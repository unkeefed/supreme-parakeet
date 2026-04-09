/**
 * Apex Focus — Supabase Auto-Sync
 *
 * Strategy:
 * - Anonymous auth: each device gets a stable UUID stored in localStorage
 * - Every write to IndexedDB is mirrored to Supabase immediately if online
 * - Offline changes are queued in IndexedDB and flushed on reconnect
 * - Conflict resolution: last-write-wins via updatedAt timestamp
 * - Soft deletes: records are marked deleted=true, not removed from Supabase
 */

import { db } from './db/index.js'

const SUPABASE_URL = 'https://xiaatddlhvasqzzfveli.supabase.co'
const ANON_KEY     = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpYWF0ZGRsaHZhc3F6emZ2ZWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2OTEzODgsImV4cCI6MjA5MTI2NzM4OH0.-a1XP-z6kzOBUJcGGNs8UiNFFx7F8dYsqom9XVR631U'

// ─── Auth ──────────────────────────────────────────────────────────────────

let _userId = null

export function getUserId() {
  if (_userId) return _userId
  let id = localStorage.getItem('apex_user_id')
  if (!id) {
    id = 'user_' + crypto.randomUUID()
    localStorage.setItem('apex_user_id', id)
  }
  _userId = id
  return id
}

// ─── HTTP helpers ──────────────────────────────────────────────────────────

function headers() {
  return {
    'Content-Type':  'application/json',
    'apikey':        ANON_KEY,
    'Authorization': 'Bearer ' + ANON_KEY,
    'Prefer':        'resolution=merge-duplicates,return=minimal',
  }
}

async function sbFetch(path, options = {}) {
  const res = await fetch(SUPABASE_URL + '/rest/v1' + path, {
    ...options,
    headers: { ...headers(), ...(options.headers || {}) },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Supabase ${options.method || 'GET'} ${path} → ${res.status}: ${text}`)
  }
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

// ─── Offline queue ─────────────────────────────────────────────────────────
// Queue is stored in IndexedDB under settings key 'syncQueue'

async function getQueue() {
  try {
    const row = await db.settings.get('syncQueue')
    return row?.value ? JSON.parse(row.value) : []
  } catch { return [] }
}

async function setQueue(queue) {
  await db.settings.put({ key: 'syncQueue', value: JSON.stringify(queue) })
}

async function enqueue(op) {
  const queue = await getQueue()
  // Deduplicate: if same table+localId already queued, replace
  const idx = queue.findIndex(q => q.table === op.table && q.localId === op.localId)
  if (idx >= 0) queue[idx] = op
  else queue.push(op)
  await setQueue(queue)
}

// ─── Sync status ───────────────────────────────────────────────────────────

let _status    = 'idle'  // 'idle' | 'syncing' | 'synced' | 'offline' | 'error'
let _listeners = []
let _pendingCount = 0

export function onSyncStatus(fn) {
  _listeners.push(fn)
  fn(_status, _pendingCount)
  return () => { _listeners = _listeners.filter(l => l !== fn) }
}

function setStatus(status, pending = 0) {
  _status       = status
  _pendingCount = pending
  _listeners.forEach(l => l(status, pending))
}

// ─── Online detection ──────────────────────────────────────────────────────

let _online = navigator.onLine

window.addEventListener('online',  () => { _online = true;  flushQueue() })
window.addEventListener('offline', () => { _online = false; setStatus('offline', _pendingCount) })

// ─── ID mapping (local integer ↔ Supabase UUID) ────────────────────────────
// Stored as settings key 'idMap_{table}'

async function getIdMap(table) {
  const row = await db.settings.get('idMap_' + table).catch(() => null)
  return row?.value ? JSON.parse(row.value) : {}
}

async function setIdMap(table, map) {
  await db.settings.put({ key: 'idMap_' + table, value: JSON.stringify(map) })
}

async function getRemoteId(table, localId) {
  const map = await getIdMap(table)
  return map[localId] || null
}

async function saveIdMapping(table, localId, remoteId) {
  const map = await getIdMap(table)
  map[localId] = remoteId
  await setIdMap(table, map)
}

// ─── Record transformers (local → remote) ─────────────────────────────────

async function subjectToRemote(s) {
  return {
    local_id:        s.id,
    name:            s.name,
    color:           s.color || '#7F77DD',
    icon:            s.icon || '',
    daily_goal_mins: s.dailyGoalMins || 60,
    order:           s.order ?? 0,
    created_at:      s.createdAt || Date.now(),
    updated_at:      Date.now(),
    deleted:         false,
    user_id:         getUserId(),
  }
}

async function taskToRemote(t) {
  let remoteSubjectId = null
  if (t.subjectId) {
    remoteSubjectId = await getRemoteId('subjects', t.subjectId)
  }
  return {
    local_id:        t.id,
    title:           t.title,
    context:         t.context || null,
    subject_id:      remoteSubjectId,
    priority:        t.priority || 3,
    status:          t.status || 'inbox',
    estimated_mins:  t.estimatedMins || null,
    due_date:        t.dueDate || null,
    due_time:        t.dueTime || null,
    notes:           t.notes || null,
    completed_at:    t.completedAt || null,
    created_at:      t.createdAt || Date.now(),
    updated_at:      Date.now(),
    deleted:         false,
    user_id:         getUserId(),
  }
}

async function sessionToRemote(s) {
  let remoteSubjectId = null
  if (s.subjectId) {
    remoteSubjectId = await getRemoteId('subjects', s.subjectId)
  }
  return {
    local_id:         s.id,
    subject_id:       remoteSubjectId,
    task_id:          s.taskId || null,
    context:          s.context || null,
    started_at:       s.startedAt,
    duration_mins:    s.durationMins || 0,
    distractions:     s.distractions || 0,
    distraction_log:  s.distractionLog ? JSON.stringify(s.distractionLog) : null,
    quality_rating:   s.qualityRating || null,
    notes:            s.notes || null,
    date:             s.date,
    created_at:       s.startedAt || Date.now(),
    updated_at:       Date.now(),
    deleted:          false,
    user_id:          getUserId(),
  }
}

async function plannedToRemote(p) {
  let remoteSubjectId = null
  if (p.subjectId) {
    remoteSubjectId = await getRemoteId('subjects', p.subjectId)
  }
  return {
    local_id:      p.id,
    subject_id:    remoteSubjectId,
    date:          p.date,
    start_time:    p.startTime || null,
    duration_mins: p.durationMins || 50,
    notes:         p.notes || null,
    created_at:    p.createdAt || Date.now(),
    updated_at:    Date.now(),
    deleted:       false,
    user_id:       getUserId(),
  }
}

// ─── Core upsert ──────────────────────────────────────────────────────────

async function upsertRecord(table, remoteRecord) {
  await sbFetch('/' + table + '?on_conflict=local_id,user_id', {
    method:  'POST',
    headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
    body:    JSON.stringify(remoteRecord),
  })
}

// ─── Public write interceptors ─────────────────────────────────────────────
// Call these after every local DB write

export async function syncSubject(localId) {
  try {
    const s = await db.subjects.get(localId)
    if (!s) return
    const remote = await subjectToRemote(s)
    if (_online) {
      await upsertRecord('subjects', remote)
      await saveIdMapping('subjects', localId, remote.local_id)
      updateSyncTime()
    } else {
      await enqueue({ table: 'subjects', localId, type: 'upsert' })
      setStatus('offline', (await getQueue()).length)
    }
  } catch (err) {
    console.warn('[Sync] subject failed:', err)
    await enqueue({ table: 'subjects', localId, type: 'upsert' })
  }
}

export async function syncTask(localId) {
  try {
    const t = await db.tasks.get(localId)
    if (!t) return
    const remote = await taskToRemote(t)
    if (_online) {
      await upsertRecord('tasks', remote)
      updateSyncTime()
    } else {
      await enqueue({ table: 'tasks', localId, type: 'upsert' })
      setStatus('offline', (await getQueue()).length)
    }
  } catch (err) {
    console.warn('[Sync] task failed:', err)
    await enqueue({ table: 'tasks', localId, type: 'upsert' })
  }
}

export async function syncSession(localId) {
  try {
    const s = await db.focus_sessions.get(localId)
    if (!s) return
    const remote = await sessionToRemote(s)
    if (_online) {
      await upsertRecord('focus_sessions', remote)
      updateSyncTime()
    } else {
      await enqueue({ table: 'focus_sessions', localId, type: 'upsert' })
      setStatus('offline', (await getQueue()).length)
    }
  } catch (err) {
    console.warn('[Sync] session failed:', err)
    await enqueue({ table: 'focus_sessions', localId, type: 'upsert' })
  }
}

export async function syncPlanned(localId) {
  try {
    const p = await db.planned_sessions.get(localId)
    if (!p) return
    const remote = await plannedToRemote(p)
    if (_online) {
      await upsertRecord('planned_sessions', remote)
      updateSyncTime()
    } else {
      await enqueue({ table: 'planned_sessions', localId, type: 'upsert' })
      setStatus('offline', (await getQueue()).length)
    }
  } catch (err) {
    console.warn('[Sync] planned failed:', err)
    await enqueue({ table: 'planned_sessions', localId, type: 'upsert' })
  }
}

export async function syncDeleteSubject(localId) {
  try {
    if (_online) {
      await sbFetch(`/subjects?local_id=eq.${localId}&user_id=eq.${getUserId()}`, {
        method: 'PATCH',
        body: JSON.stringify({ deleted: true, updated_at: Date.now() }),
      })
      updateSyncTime()
    } else {
      await enqueue({ table: 'subjects', localId, type: 'delete' })
    }
  } catch (err) {
    console.warn('[Sync] delete subject failed:', err)
    await enqueue({ table: 'subjects', localId, type: 'delete' })
  }
}

export async function syncDeleteTask(localId) {
  try {
    if (_online) {
      await sbFetch(`/tasks?local_id=eq.${localId}&user_id=eq.${getUserId()}`, {
        method: 'PATCH',
        body: JSON.stringify({ deleted: true, updated_at: Date.now() }),
      })
      updateSyncTime()
    } else {
      await enqueue({ table: 'tasks', localId, type: 'delete' })
    }
  } catch (err) {
    await enqueue({ table: 'tasks', localId, type: 'delete' })
  }
}

export async function syncDeletePlanned(localId) {
  try {
    if (_online) {
      await sbFetch(`/planned_sessions?local_id=eq.${localId}&user_id=eq.${getUserId()}`, {
        method: 'PATCH',
        body: JSON.stringify({ deleted: true, updated_at: Date.now() }),
      })
      updateSyncTime()
    } else {
      await enqueue({ table: 'planned_sessions', localId, type: 'delete' })
    }
  } catch (err) {
    await enqueue({ table: 'planned_sessions', localId, type: 'delete' })
  }
}

// ─── Flush offline queue ───────────────────────────────────────────────────

export async function flushQueue() {
  const queue = await getQueue()
  if (queue.length === 0) { setStatus('synced', 0); return }

  setStatus('syncing', queue.length)
  const failed = []

  for (const op of queue) {
    try {
      if (op.type === 'upsert') {
        if (op.table === 'subjects') {
          const s = await db.subjects.get(op.localId)
          if (s) await upsertRecord('subjects', await subjectToRemote(s))
        } else if (op.table === 'tasks') {
          const t = await db.tasks.get(op.localId)
          if (t) await upsertRecord('tasks', await taskToRemote(t))
        } else if (op.table === 'focus_sessions') {
          const s = await db.focus_sessions.get(op.localId)
          if (s) await upsertRecord('focus_sessions', await sessionToRemote(s))
        } else if (op.table === 'planned_sessions') {
          const p = await db.planned_sessions.get(op.localId)
          if (p) await upsertRecord('planned_sessions', await plannedToRemote(p))
        }
      } else if (op.type === 'delete') {
        await sbFetch(`/${op.table}?local_id=eq.${op.localId}&user_id=eq.${getUserId()}`, {
          method: 'PATCH',
          body: JSON.stringify({ deleted: true, updated_at: Date.now() }),
        })
      }
    } catch (err) {
      console.warn('[Sync] flush failed for', op, err)
      failed.push(op)
    }
  }

  await setQueue(failed)
  if (failed.length === 0) {
    updateSyncTime()
    setStatus('synced', 0)
  } else {
    setStatus('error', failed.length)
  }
}

// ─── Initial full sync (first load / new device) ───────────────────────────

export async function initialSync() {
  if (!_online) { setStatus('offline', (await getQueue()).length); return }
  setStatus('syncing', 0)

  try {
    // Push all local data up (subjects first, then tasks, sessions, planned)
    const [subjects, tasks, sessions, planned] = await Promise.all([
      db.subjects.toArray(),
      db.tasks.toArray(),
      db.focus_sessions.toArray(),
      db.planned_sessions.toArray(),
    ])

    // Upsert in dependency order
    for (const s of subjects) {
      await upsertRecord('subjects', await subjectToRemote(s))
    }
    for (const t of tasks) {
      await upsertRecord('tasks', await taskToRemote(t))
    }
    for (const s of sessions) {
      await upsertRecord('focus_sessions', await sessionToRemote(s))
    }
    for (const p of planned) {
      await upsertRecord('planned_sessions', await plannedToRemote(p))
    }

    // Sync settings snapshot
    const settings = await db.settings.get('main')
    if (settings) {
      await sbFetch('/settings?on_conflict=user_id', {
        method:  'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
        body:    JSON.stringify({
          user_id:    getUserId(),
          data:       JSON.stringify(settings),
          updated_at: Date.now(),
        }),
      })
    }

    await flushQueue()
    updateSyncTime()
    setStatus('synced', 0)
  } catch (err) {
    console.warn('[Sync] initial sync error:', err)
    setStatus('error', 0)
  }
}

// ─── Sync time tracker ─────────────────────────────────────────────────────

async function updateSyncTime() {
  const now = Date.now()
  await db.settings.put({ key: 'lastSupabaseSync', value: now })
  setStatus('synced', 0)
}

export async function getLastSyncTime() {
  const row = await db.settings.get('lastSupabaseSync').catch(() => null)
  return row?.value || null
}

// ─── Auto-sync interval (every 60s as a safety net) ───────────────────────

export function startAutoSync() {
  // Flush any queued changes immediately
  flushQueue()

  // Periodic safety-net flush every 60 seconds
  setInterval(() => {
    if (_online) flushQueue()
  }, 60_000)
}
