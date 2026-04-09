import Dexie from 'dexie'

export const db = new Dexie('ApexFocus')

// Version 1 — original schema (preserved for Dexie migration chain)
db.version(1).stores({
  tasks:          '++id, status, context, goalId, createdAt, dueDate',
  focus_sessions: '++id, taskId, goalId, startedAt, date, context',
  time_blocks:    '++id, taskId, date, startTime',
  settings:       'key',
  sync_log:       '++id, syncedAt, module'
})

// Version 2 — adds subjects store; tasks + sessions gain subjectId
// tasks.subjectId    — optional, only relevant when context is a study-type context
// sessions.subjectId — links a session to a subject for goal/streak tracking
db.version(2).stores({
  tasks:          '++id, status, context, subjectId, goalId, createdAt, dueDate',
  focus_sessions: '++id, taskId, goalId, subjectId, startedAt, date, context',
  time_blocks:    '++id, taskId, date, startTime',
  settings:       'key',
  sync_log:       '++id, syncedAt, module',
  // Subject shape: { id, name, color, icon, dailyGoalMins, createdAt, order }
  subjects:       '++id, name, createdAt'
})

// ─── Seed on first run ─────────────────────────────────────────────────────
db.on('ready', async () => {
  // Seed subjects
  const subjectCount = await db.subjects.count()
  if (subjectCount === 0) {
    const now = Date.now()
    await db.subjects.bulkAdd([
      { name: 'Engineering Math',  color: '#7F77DD', icon: '∑', dailyGoalMins: 60, createdAt: now, order: 0 },
      { name: 'Engineering Sci A', color: '#D85A30', icon: '⚙', dailyGoalMins: 90, createdAt: now, order: 1 },
      { name: 'Engineering Sci B', color: '#1D9E75', icon: '⚡', dailyGoalMins: 60, createdAt: now, order: 2 },
      { name: 'Field Methods',     color: '#BA7517', icon: '🗺', dailyGoalMins: 45, createdAt: now, order: 3 },
    ])
  }

  // Seed settings
  const existing = await db.settings.get('main')
  if (!existing) {
    await db.settings.put({
      key: 'main',

      // Session
      defaultDuration: 50,
      breakLength: 10,
      longBreakAfter: 4,
      longBreakLength: 30,

      // Timer display
      showCountdownRing: true,
      autoStartBreak: false,
      autoStartNextSession: false,

      // Daily target (global fallback)
      dailyGoalHours: 4,
      activeDays: [1, 2, 3, 4, 5],
      streakFreezeEnabled: false,
      streakGraceDays: 1,   // grace days when freeze is on

      // Contexts — task classification only
      // isStudy: true means subject picker is shown for tasks with this context
      contexts: [
        { id: 'study',    label: 'Study',     color: '#7F77DD', isStudy: true  },
        { id: 'civil',    label: 'Civil eng', color: '#BA7517', isStudy: true  },
        { id: 'personal', label: 'Personal',  color: '#D4537E', isStudy: false },
        { id: 'trading',  label: 'Trading',   color: '#1D9E75', isStudy: false },
      ],

      // Appearance
      accentColor: '#7F77DD',
      theme: 'dark', // 'dark' | 'light' | 'system'

      // Notifications
      sessionEndSound: true,
      breakEndReminder: true,
      dailyGoalAlert: true,
      morningReminderEnabled: true,
      morningReminderTime: '08:30',

      // Dashboard sync
      syncStudy: true,
      syncHabits: true,
      syncGoals: true,
      syncMood: false,

      // AI
      aiProvider: 'gemini',
      aiApiKey: '',
      aiMorningPrioritisation: true,
      aiWeeklyReview: true,
      aiDistractionAlerts: true,
      aiSmartRescheduling: false,
    })
  } else {
    // Migrate existing installs: add theme + isStudy if missing
    const patches = {}
    if (!('theme' in existing)) patches.theme = 'dark'
    if (existing.contexts && !existing.contexts[0]?.hasOwnProperty('isStudy')) {
      patches.contexts = existing.contexts.map(c => ({
        ...c,
        isStudy: c.isStudy ?? (c.id === 'study' || c.id === 'civil'),
      }))
    }
    if (Object.keys(patches).length > 0) {
      await db.settings.put({ ...existing, ...patches, key: 'main' })
    }
  }
})

// ─── Settings helpers ──────────────────────────────────────────────────────

export async function getSettings() {
  return db.settings.get('main')
}

export async function updateSettings(patch) {
  const current = await db.settings.get('main')
  await db.settings.put({ ...current, ...patch, key: 'main' })
}

// ─── Subject helpers ───────────────────────────────────────────────────────

/** All subjects, sorted by .order then alphabetically */
export async function getSubjects() {
  const all = await db.subjects.toArray()
  return all.sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.name.localeCompare(b.name))
}

/** Single subject by id */
export async function getSubject(id) {
  return db.subjects.get(id)
}

/** Add a new subject */
export async function addSubject(subject) {
  const count = await db.subjects.count()
  const id = await db.subjects.add({
    color: '#7F77DD',
    icon: '📚',
    dailyGoalMins: 60,
    createdAt: Date.now(),
    order: count,
    ...subject,
  })
  import('../sync.js').then(m => m.syncSubject(id)).catch(() => {})
  return id
}

/** Update a subject */
export async function updateSubject(id, patch) {
  const result = await db.subjects.update(id, patch)
  import('../sync.js').then(m => m.syncSubject(id)).catch(() => {})
  return result
}

/** Delete a subject — clears subjectId from related tasks */
export async function deleteSubject(id) {
  await db.tasks.where('subjectId').equals(id).modify({ subjectId: null })
  import('../sync.js').then(m => m.syncDeleteSubject(id)).catch(() => {})
  return db.subjects.delete(id)
}

// ─── Task helpers ──────────────────────────────────────────────────────────

/** All non-done tasks sorted by priority */
export async function getTodayTasks() {
  return db.tasks
    .where('status').anyOf(['today', 'inbox'])
    .sortBy('priority')
}

/** All tasks with optional filtering */
export async function getAllTasks(filter = {}) {
  const tasks = await db.tasks.toArray()
  return tasks.filter(t => {
    if (filter.status    != null && t.status    !== filter.status)    return false
    if (filter.context   != null && t.context   !== filter.context)   return false
    if (filter.subjectId != null && t.subjectId !== filter.subjectId) return false
    return true
  })
}

// ─── Session helpers ───────────────────────────────────────────────────────

/** Sessions for a given ISO date string e.g. '2026-04-06' */
export async function getSessionsForDate(dateStr) {
  return db.focus_sessions.where('date').equals(dateStr).toArray()
}

/** Sessions for a date range — sorted by startedAt */
export async function getSessionsForRange(fromDate, toDate) {
  return db.focus_sessions
    .where('date').between(fromDate, toDate, true, true)
    .sortBy('startedAt')
}

/** Save a completed session */
export async function saveSession(session) {
  const id = await db.focus_sessions.add({
    ...session,
    date: new Date(session.startedAt).toISOString().slice(0, 10),
  })
  import('../sync.js').then(m => m.syncSession(id)).catch(() => {})
  return id
}

/** Total focus minutes for a date */
export async function getFocusMinutesForDate(dateStr) {
  const sessions = await getSessionsForDate(dateStr)
  return sessions.reduce((sum, s) => sum + (s.durationMins || 0), 0)
}

/** Focus minutes for a date filtered to a specific subject */
export async function getSubjectMinutesForDate(dateStr, subjectId) {
  const sessions = await getSessionsForDate(dateStr)
  return sessions
    .filter(s => s.subjectId === subjectId)
    .reduce((sum, s) => sum + (s.durationMins || 0), 0)
}

/** Focus minutes per subject over a date range — returns Map<subjectId, mins> */
export async function getSubjectMinutesForRange(fromDate, toDate) {
  const sessions = await getSessionsForRange(fromDate, toDate)
  const map = new Map()
  for (const s of sessions) {
    if (s.subjectId == null) continue
    map.set(s.subjectId, (map.get(s.subjectId) || 0) + (s.durationMins || 0))
  }
  return map
}

// ─── Streak helpers ────────────────────────────────────────────────────────

/**
 * Global streak — consecutive active days with total focus >= dailyGoalMins.
 * graceDays: number of missed active days allowed without breaking streak (freeze logic).
 */
export async function getStreak(activeDays, dailyGoalMins, graceDays = 0) {
  let streak   = 0
  let graceUsed = 0
  const today  = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    if (!activeDays.includes(d.getDay())) continue
    const dateStr = d.toISOString().slice(0, 10)
    const mins    = await getFocusMinutesForDate(dateStr)
    if (mins >= dailyGoalMins) {
      streak++
      graceUsed = 0 // reset grace on a successful day
    } else if (i === 0) {
      // today — always allowed to be incomplete
    } else if (graceUsed < graceDays) {
      graceUsed++ // burn a grace day instead of breaking
    } else {
      break // gap found and no grace left — streak ends
    }
  }
  return streak
}

/**
 * Per-subject streak — consecutive active days where subject goal was met.
 * graceDays: missed days allowed without resetting streak.
 * Returns { current, best }.
 */
export async function getSubjectStreak(subjectId, dailyGoalMins, activeDays, graceDays = 0) {
  let current       = 0
  let best          = 0
  let run           = 0
  let graceUsed     = 0
  let currentLocked = false
  const today       = new Date()

  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    if (!activeDays.includes(d.getDay())) continue

    const dateStr = d.toISOString().slice(0, 10)
    const mins    = await getSubjectMinutesForDate(dateStr, subjectId)

    if (mins >= dailyGoalMins) {
      run++
      graceUsed = 0
      best = Math.max(best, run)
      if (!currentLocked) current = run
    } else if (i === 0) {
      // today incomplete — don't break
    } else if (graceUsed < graceDays) {
      graceUsed++ // burn grace day
    } else {
      currentLocked = true
      run = 0
      break
    }
  }
  return { current, best }
}

// Version 3 — adds planned_sessions store for calendar scheduling
// Shape: { id, subjectId, date (YYYY-MM-DD), startTime (HH:MM), durationMins, notes, createdAt }
db.version(3).stores({
  tasks:            '++id, status, context, subjectId, goalId, createdAt, dueDate',
  focus_sessions:   '++id, taskId, goalId, subjectId, startedAt, date, context',
  time_blocks:      '++id, taskId, date, startTime',
  settings:         'key',
  sync_log:         '++id, syncedAt, module',
  subjects:         '++id, name, createdAt',
  planned_sessions: '++id, subjectId, date, createdAt'
})


// Version 4 — adds recurring_sessions; planned_sessions gains taskId
// recurring shape: { id, subjectId, taskId?, days (array of 0-6), startTime, durationMins, notes, createdAt, active }
db.version(4).stores({
  tasks:               '++id, status, context, subjectId, goalId, createdAt, dueDate',
  focus_sessions:      '++id, taskId, goalId, subjectId, startedAt, date, context',
  time_blocks:         '++id, taskId, date, startTime',
  settings:            'key',
  sync_log:            '++id, syncedAt, module',
  subjects:            '++id, name, createdAt',
  planned_sessions:    '++id, subjectId, taskId, date, createdAt',
  recurring_sessions:  '++id, subjectId, createdAt'
})

// ─── Planned session helpers ──────────────────────────────────────────────

/** All planned sessions for a given date */
export async function getPlannedForDate(dateStr) {
  return db.planned_sessions.where('date').equals(dateStr).toArray()
}

/** Planned sessions for a date range */
export async function getPlannedForRange(fromDate, toDate) {
  return db.planned_sessions
    .where('date').between(fromDate, toDate, true, true)
    .toArray()
}

/** Add a planned session */
export async function addPlannedSession(plan) {
  const id = await db.planned_sessions.add({ ...plan, createdAt: Date.now() })
  import('../sync.js').then(m => m.syncPlanned(id)).catch(() => {})
  return id
}

/** Delete a planned session */
export async function deletePlannedSession(id) {
  import('../sync.js').then(m => m.syncDeletePlanned(id)).catch(() => {})
  return db.planned_sessions.delete(id)
}

// ─── Recurring session helpers ─────────────────────────────────────────────
// Shape: { id, subjectId, taskId, days (0-6 Sun-Sat), startTime, durationMins, notes, active, createdAt }

export async function getRecurringSessions() {
  return db.recurring_sessions.toArray()
}

export async function addRecurringSession(rec) {
  return db.recurring_sessions.add({ ...rec, createdAt: Date.now(), active: true })
}

export async function updateRecurringSession(id, patch) {
  return db.recurring_sessions.update(id, patch)
}

export async function deleteRecurringSession(id) {
  return db.recurring_sessions.delete(id)
}

/**
 * Generate planned sessions from recurring rules for a date range.
 * Only creates entries that don't already exist for that date+subjectId+startTime.
 */
export async function generateRecurringPlanned(fromDate, toDate) {
  const rules    = await db.recurring_sessions.where('active').equals(1).toArray()
    .catch(() => db.recurring_sessions.toArray().then(r => r.filter(x => x.active)))
  if (!rules.length) return

  const existing = await getPlannedForRange(fromDate, toDate)
  const existKey = (date, subjectId, startTime) => `${date}|${subjectId}|${startTime}`
  const existSet = new Set(existing.map(p => existKey(p.date, p.subjectId, p.startTime)))

  const from = new Date(fromDate + 'T00:00:00')
  const to   = new Date(toDate   + 'T00:00:00')

  for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    const dow     = d.getDay() // 0=Sun
    const dateStr = d.toISOString().slice(0, 10)
    for (const rule of rules) {
      if (!rule.days?.includes(dow)) continue
      const key = existKey(dateStr, rule.subjectId, rule.startTime)
      if (existSet.has(key)) continue
      await addPlannedSession({
        subjectId:    rule.subjectId,
        taskId:       rule.taskId || null,
        date:         dateStr,
        startTime:    rule.startTime,
        durationMins: rule.durationMins,
        notes:        rule.notes || '',
        fromRecurring: rule.id,
      })
      existSet.add(key)
    }
  }
}
