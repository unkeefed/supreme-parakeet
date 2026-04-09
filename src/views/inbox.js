import { db, getSettings, getSubjects } from '../db/index.js'
import { syncTask, syncDeleteTask } from '../sync.js'
import { esc, onSwipeLeft, onSwipeRight, dayLabel, todayStr, fmtMins } from '../utils/index.js'

// ─── State ─────────────────────────────────────────────────────────────────
let _activeCtx    = 'all'
let _activeFilter = 'active'   // 'active' | 'today' | 'done'
let _sortBy       = 'priority' // 'priority' | 'due' | 'created'
let _showDone     = false
let _subjectFilter = null      // subjectId or null

export async function renderInbox(container) {
  const [settings, subjects] = await Promise.all([getSettings(), getSubjects()])

  container.innerHTML = `
    <div class="view-header">
      <div>
        <h1 class="view-title">Inbox</h1>
        <p class="view-sub">${dayLabel(todayStr())}</p>
      </div>
      <button class="icon-btn" id="add-task-btn" title="Add task">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>

    <div class="ctx-filters" id="ctx-filters">
      <button class="ctx-pill ${_activeCtx === 'all' ? 'active' : ''}" data-ctx="all">All</button>
      ${settings.contexts.map(c => `
        <button class="ctx-pill ${_activeCtx === c.id ? 'active' : ''}" data-ctx="${c.id}">
          <span class="ctx-dot" style="background:${c.color}"></span>${c.label}
        </button>
      `).join('')}
    </div>

    <div class="filter-row">
      <div class="filter-tabs">
        <button class="filter-tab ${_activeFilter === 'active' ? 'active' : ''}" data-filter="active">Active</button>
        <button class="filter-tab ${_activeFilter === 'today'  ? 'active' : ''}" data-filter="today">Today</button>
        <button class="filter-tab ${_activeFilter === 'done'   ? 'active' : ''}" data-filter="done">Done</button>
      </div>
      <div class="sort-wrap">
        <select class="sort-select" id="sort-select">
          <option value="priority" ${_sortBy==='priority'?'selected':''}>Priority</option>
          <option value="due"      ${_sortBy==='due'     ?'selected':''}>Due date</option>
          <option value="created"  ${_sortBy==='created' ?'selected':''}>Newest</option>
        </select>
      </div>
    </div>

    <div id="task-list"></div>

    <div class="inbox-footer">
      <span id="task-count"></span>
      <button class="link-btn" id="plan-btn">Plan my day →</button>
    </div>
  `

  async function refresh() {
    const [tasks, s, subjs] = await Promise.all([
      db.tasks.toArray(),
      getSettings(),
      getSubjects(),
    ])
    renderList(tasks, s, subjs)
    updateCount(tasks)
  }

  // Context filter
  container.querySelector('#ctx-filters').addEventListener('click', e => {
    const pill = e.target.closest('.ctx-pill')
    if (!pill) return
    _activeCtx = pill.dataset.ctx
    _subjectFilter = null
    container.querySelectorAll('.ctx-pill').forEach(p => p.classList.remove('active'))
    pill.classList.add('active')
    refresh()
  })

  // Status filter tabs
  container.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      _activeFilter = tab.dataset.filter
      container.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      refresh()
    })
  })

  // Sort
  container.querySelector('#sort-select').addEventListener('change', e => {
    _sortBy = e.target.value
    refresh()
  })

  // Add task button
  container.querySelector('#add-task-btn').addEventListener('click', () => {
    openAddTask(refresh)
  })

  container.querySelector('#plan-btn').addEventListener('click', () => {
    import('../router.js').then(m => m.navigateTo('focus'))
  })

  refresh()
}

// ─── Render list ───────────────────────────────────────────────────────────

function renderList(tasks, settings, subjects) {
  const list = document.getElementById('task-list')
  if (!list) return

  // Filter by context
  let filtered = _activeCtx === 'all'
    ? tasks
    : tasks.filter(t => t.context === _activeCtx)

  // Filter by subject
  if (_subjectFilter) filtered = filtered.filter(t => t.subjectId === _subjectFilter)

  // Split active vs done
  const active = filtered.filter(t => !t.completedAt)
  const done   = filtered.filter(t => !!t.completedAt)

  // Apply status filter
  let toShow = []
  if (_activeFilter === 'today') {
    toShow = active.filter(t => t.status === 'today')
  } else if (_activeFilter === 'done') {
    toShow = done
  } else {
    toShow = active
  }

  // Sort
  toShow = sortTasks(toShow, _sortBy)

  list.innerHTML = ''

  if (toShow.length === 0) {
    list.appendChild(emptyState(_activeFilter))
    return
  }

  // Group: Today + Backlog for active view
  if (_activeFilter === 'active') {
    const today   = toShow.filter(t => t.status === 'today')
    const backlog = toShow.filter(t => t.status !== 'today')
    if (today.length > 0) {
      list.insertAdjacentHTML('beforeend', sectionHead('Today', today.length))
      today.forEach(t => list.appendChild(buildRow(t, settings, subjects)))
    }
    if (backlog.length > 0) {
      list.insertAdjacentHTML('beforeend', sectionHead('Backlog', backlog.length))
      backlog.forEach(t => list.appendChild(buildRow(t, settings, subjects)))
    }
  } else {
    toShow.forEach(t => list.appendChild(buildRow(t, settings, subjects)))
  }
}

function sortTasks(tasks, by) {
  return [...tasks].sort((a, b) => {
    if (by === 'due') {
      if (!a.dueDate && !b.dueDate) return (a.priority||3) - (b.priority||3)
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    if (by === 'created') return (b.createdAt||0) - (a.createdAt||0)
    // priority (default)
    const pd = (a.priority||3) - (b.priority||3)
    if (pd !== 0) return pd
    return (a.createdAt||0) - (b.createdAt||0)
  })
}

// ─── Build task row ────────────────────────────────────────────────────────

function buildRow(task, settings, subjects) {
  const ctx     = settings.contexts.find(c => c.id === task.context)
  const subject = task.subjectId ? subjects.find(s => s.id === task.subjectId) : null
  const color   = ctx?.color || '#888'
  const label   = ctx?.label || task.context
  const done    = !!task.completedAt
  const pColors = { 1: 'var(--coral)', 2: 'var(--amber)', 3: 'var(--text-muted)' }
  const pColor  = pColors[task.priority] || 'var(--text-muted)'

  const wrap = document.createElement('div')
  wrap.className = 'task-row-wrap'
  wrap.dataset.id = task.id

  wrap.innerHTML = `
    <div class="swipe-bg swipe-bg--complete">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>
      <span>${done ? 'Undo' : 'Done'}</span>
    </div>
    <div class="swipe-bg swipe-bg--delete">
      <span>Delete</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
    </div>
    <div class="task-row ${done ? 'task-done' : ''}">
      <div class="task-check ${done ? 'checked' : ''}" data-check="${task.id}">
        ${done ? `<svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2.5"><path d="M3 8l4 4 6-6"/></svg>` : ''}
      </div>
      <span class="priority-dot" style="background:${pColor}" title="${['','High','Med','Low'][task.priority||3]}"></span>
      <div class="task-content">
        <p class="task-title ${done ? 'task-title--done' : ''}">${esc(task.title)}</p>
        <div class="task-meta-row">
          <span class="ctx-tag" style="background:${color}22;color:${color};border:0.5px solid ${color}44">${label}</span>
          ${subject ? `<span class="subj-tag" style="background:${subject.color}22;color:${subject.color};border:0.5px solid ${subject.color}44">${subject.icon ? subject.icon + ' ' : ''}${esc(subject.name)}</span>` : ''}
          ${task.estimatedMins ? `<span class="task-est">${fmtMins(task.estimatedMins)}</span>` : ''}
          ${task.notes ? `<svg class="task-notes-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>` : ''}
        </div>
      </div>
      ${dueBadge(task.dueDate)}
    </div>
  `

  const row   = wrap.querySelector('.task-row')
  const check = wrap.querySelector('[data-check]')

  check.addEventListener('click', async e => {
    e.stopPropagation()
    await toggleComplete(task.id)
  })

  row.addEventListener('click', e => {
    if (e.target.closest('[data-check]')) return
    openDetail(task.id)
  })

  onSwipeLeft(wrap, async () => {
    wrap.style.transition = 'opacity .2s'
    wrap.style.opacity = '0'
    await sleep(220)
    await toggleComplete(task.id)
  })

  onSwipeRight(wrap, async () => {
    wrap.style.transition = 'opacity .2s'
    wrap.style.opacity = '0'
    await sleep(220)
    await db.tasks.delete(task.id)
    syncDeleteTask(task.id).catch(() => {})
    refreshAll()
  })

  return wrap
}

// ─── Add task modal ────────────────────────────────────────────────────────

async function openAddTask(onSave) {
  const [settings, subjects] = await Promise.all([getSettings(), getSubjects()])
  const studyCtxIds = new Set(settings.contexts.filter(c => c.isStudy).map(c => c.id))

  // Pick a sensible default context
  const defaultCtx = _activeCtx !== 'all'
    ? settings.contexts.find(c => c.id === _activeCtx)
    : settings.contexts[0]

  let draft = {
    title: '',
    context: defaultCtx?.id || settings.contexts[0]?.id || 'study',
    subjectId: null,
    priority: 3,
    status: _activeFilter === 'today' ? 'today' : 'inbox',
    estimatedMins: null,
    dueDate: null,
    dueTime: null,
    notes: '',
  }

  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'
  overlay.innerHTML = buildTaskForm('Add task', draft, settings, subjects, studyCtxIds, false)
  document.body.appendChild(overlay)
  requestAnimationFrame(() => overlay.querySelector('.detail-modal').classList.add('modal-open'))
  overlay.querySelector('#edit-title').focus()

  wireTaskForm(overlay, draft, settings, subjects, studyCtxIds)

  const closeModal = () => {
    overlay.querySelector('.detail-modal').classList.remove('modal-open')
    setTimeout(() => overlay.remove(), 250)
  }

  overlay.querySelector('#modal-close').addEventListener('click', closeModal)
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal() })

  overlay.querySelector('#save-btn').addEventListener('click', async () => {
    const title = overlay.querySelector('#edit-title').value.trim()
    if (!title) { overlay.querySelector('#edit-title').focus(); return }
    draft.title = title
    const newId = await db.tasks.add({ ...draft, createdAt: Date.now(), completedAt: null, goalId: null })
    syncTask(newId).catch(() => {})
    closeModal()
    if (onSave) onSave()
    else refreshAll()
  })
}

// ─── Detail/edit modal ─────────────────────────────────────────────────────

async function openDetail(id) {
  const task = await db.tasks.get(id)
  if (!task) return
  const [settings, subjects] = await Promise.all([getSettings(), getSubjects()])
  const studyCtxIds = new Set(settings.contexts.filter(c => c.isStudy).map(c => c.id))

  let draft = {
    title: task.title,
    context: task.context,
    subjectId: task.subjectId ?? null,
    priority: task.priority,
    status: task.status,
    estimatedMins: task.estimatedMins ?? null,
    dueDate: task.dueDate ?? null,
    dueTime: task.dueTime ?? null,
    notes: task.notes ?? '',
  }

  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'
  overlay.innerHTML = buildTaskForm('Edit task', draft, settings, subjects, studyCtxIds, true)
  document.body.appendChild(overlay)
  requestAnimationFrame(() => overlay.querySelector('.detail-modal').classList.add('modal-open'))

  wireTaskForm(overlay, draft, settings, subjects, studyCtxIds)

  const closeModal = () => {
    overlay.querySelector('.detail-modal').classList.remove('modal-open')
    setTimeout(() => overlay.remove(), 250)
  }

  overlay.querySelector('#modal-close').addEventListener('click', closeModal)
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal() })

  overlay.querySelector('#save-btn').addEventListener('click', async () => {
    draft.title = overlay.querySelector('#edit-title').value.trim() || task.title
    await db.tasks.update(id, draft)
    syncTask(id).catch(() => {})
    closeModal()
    refreshAll()
  })

  overlay.querySelector('#delete-btn')?.addEventListener('click', async () => {
    if (!confirm('Delete this task?')) return
    await db.tasks.delete(id)
    syncDeleteTask(id).catch(() => {})
    closeModal()
    refreshAll()
  })

  overlay.querySelector('#complete-btn')?.addEventListener('click', async () => {
    await toggleComplete(id)
    closeModal()
  })
}

// ─── Task form builder ─────────────────────────────────────────────────────

function buildTaskForm(title, draft, settings, subjects, studyCtxIds, isEdit) {
  const isStudyCtx = studyCtxIds.has(draft.context)

  return `
    <div class="modal-card detail-modal">
      <div class="modal-drag-bar"></div>
      <div class="modal-header">
        <textarea class="modal-title-input" id="edit-title" rows="2" placeholder="Task title…">${esc(draft.title)}</textarea>
        <button class="modal-close-btn" id="modal-close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">

        <label class="modal-field-label">Context</label>
        <div class="seg-row" id="ctx-seg" style="flex-wrap:wrap;margin-bottom:14px">
          ${settings.contexts.map(c => {
            const active = draft.context === c.id
            return `<button class="seg-btn ${active ? 'seg-ctx-active' : ''}" data-val="${c.id}" data-color="${c.color}" data-is-study="${c.isStudy ? '1' : '0'}"
              style="${active ? `background:${c.color}22;border-color:${c.color};color:${c.color}` : ''}">
              <span class="ctx-dot" style="background:${c.color}"></span>${c.label}
            </button>`
          }).join('')}
        </div>

        <div id="subject-row" style="${isStudyCtx && subjects.length ? '' : 'display:none'}">
          <label class="modal-field-label">Subject</label>
          <div class="seg-row" id="subj-seg" style="flex-wrap:wrap;margin-bottom:14px">
            <button class="seg-btn ${!draft.subjectId ? 'seg-active' : ''}" data-val="">None</button>
            ${subjects.map(s => {
              const active = draft.subjectId === s.id
              return `<button class="seg-btn ${active ? 'seg-ctx-active' : ''}" data-val="${s.id}" data-color="${s.color}"
                style="${active ? `background:${s.color}22;border-color:${s.color};color:${s.color}` : ''}">
                ${s.icon ? s.icon + ' ' : ''}${esc(s.name)}
              </button>`
            }).join('')}
          </div>
        </div>

        <div class="modal-row-2">
          <div style="flex:1;min-width:0">
            <label class="modal-field-label">Priority</label>
            <div class="seg-row" id="pri-seg" style="gap:4px">
              ${[{v:1,l:'High',c:'#D85A30'},{v:2,l:'Med',c:'#BA7517'},{v:3,l:'Low',c:'#888780'}].map(p => {
                const active = draft.priority === p.v
                return `<button class="seg-btn ${active ? 'seg-active' : ''}" data-val="${p.v}" data-color="${p.c}"
                  style="${active ? `background:${p.c}22;border-color:${p.c};color:${p.c}` : ''}">${p.l}</button>`
              }).join('')}
            </div>
          </div>
          <div>
            <label class="modal-field-label">Est.</label>
            <div style="display:flex;align-items:center;gap:6px">
              <input type="number" class="num-input" id="edit-est" value="${draft.estimatedMins || ''}" placeholder="—" min="5" max="480" step="5">
              <span class="field-unit">min</span>
            </div>
          </div>
        </div>

        <div class="modal-row-2" style="margin-top:12px">
          <div style="flex:1">
            <label class="modal-field-label">Schedule</label>
            <div class="seg-row" id="status-seg">
              <button class="seg-btn ${draft.status==='today' ? 'seg-active' : ''}" data-val="today">Today</button>
              <button class="seg-btn ${draft.status==='inbox' ? 'seg-active' : ''}" data-val="inbox">Backlog</button>
            </div>
          </div>
          <div>
            <label class="modal-field-label">Due date</label>
            <input type="date" class="time-input date-input" id="edit-due" value="${draft.dueDate || ''}">
          </div>
        </div>

        <div style="margin-top:12px">
          <label class="modal-field-label">Due time <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--text-muted)">(optional)</span></label>
          <input type="time" class="time-input" id="edit-due-time" value="${draft.dueTime || ''}">
        </div>

        <label class="modal-field-label" style="margin-top:14px">Notes</label>
        <textarea class="detail-notes" id="edit-notes" rows="3" placeholder="Add notes…">${esc(draft.notes || '')}</textarea>

      </div>
      <div class="modal-footer">
        ${isEdit ? `
          <button class="btn-ghost danger" id="delete-btn">Delete</button>
          <button class="btn-ghost" id="complete-btn">${draft.completedAt ? 'Undo' : 'Complete'}</button>
        ` : ''}
        <button class="btn-primary" id="save-btn">${isEdit ? 'Save changes' : 'Add task'}</button>
      </div>
    </div>
  `
}

function wireTaskForm(overlay, draft, settings, subjects, studyCtxIds) {
  overlay.querySelector('#edit-est')?.addEventListener('input', e => {
    draft.estimatedMins = e.target.value ? +e.target.value : null
  })
  overlay.querySelector('#edit-notes')?.addEventListener('input', e => {
    draft.notes = e.target.value
  })
  overlay.querySelector('#edit-due')?.addEventListener('change', e => {
    draft.dueDate = e.target.value || null
  })
  overlay.querySelector('#edit-due-time')?.addEventListener('change', e => {
    draft.dueTime = e.target.value || null
  })

  // Context seg
  overlay.querySelectorAll('#ctx-seg .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.querySelectorAll('#ctx-seg .seg-btn').forEach(b => { b.classList.remove('seg-ctx-active'); b.style.cssText = '' })
      btn.classList.add('seg-ctx-active')
      const c = btn.dataset.color
      btn.style.background = c + '22'; btn.style.borderColor = c; btn.style.color = c
      draft.context = btn.dataset.val

      // Show/hide subject row based on isStudy flag
      const isStudy = btn.dataset.isStudy === '1'
      const subjectRow = overlay.querySelector('#subject-row')
      if (subjectRow) subjectRow.style.display = (isStudy && subjects.length) ? '' : 'none'
      if (!isStudy) draft.subjectId = null
    })
  })

  // Subject seg
  overlay.querySelectorAll('#subj-seg .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.querySelectorAll('#subj-seg .seg-btn').forEach(b => { b.classList.remove('seg-ctx-active', 'seg-active'); b.style.cssText = '' })
      const val = btn.dataset.val
      if (val) {
        btn.classList.add('seg-ctx-active')
        const c = btn.dataset.color
        btn.style.background = c + '22'; btn.style.borderColor = c; btn.style.color = c
        draft.subjectId = +val
      } else {
        btn.classList.add('seg-active')
        draft.subjectId = null
      }
    })
  })

  // Priority seg
  overlay.querySelectorAll('#pri-seg .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.querySelectorAll('#pri-seg .seg-btn').forEach(b => { b.classList.remove('seg-active'); b.style.cssText = '' })
      btn.classList.add('seg-active')
      const c = btn.dataset.color
      btn.style.background = c + '22'; btn.style.borderColor = c; btn.style.color = c
      draft.priority = +btn.dataset.val
    })
  })

  // Status seg
  overlay.querySelectorAll('#status-seg .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.querySelectorAll('#status-seg .seg-btn').forEach(b => b.classList.remove('seg-active'))
      btn.classList.add('seg-active')
      draft.status = btn.dataset.val
    })
  })
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function dueBadge(dueDate) {
  if (!dueDate) return ''
  const today    = new Date(); today.setHours(0,0,0,0)
  const due      = new Date(dueDate); due.setHours(0,0,0,0)
  const diffDays = Math.round((due - today) / 86400000)
  if (diffDays < 0)   return `<span class="due-badge due-badge--overdue">overdue</span>`
  if (diffDays === 0) return `<span class="due-badge due-badge--today">today</span>`
  if (diffDays <= 3)  return `<span class="due-badge due-badge--upcoming">in ${diffDays}d</span>`
  return `<span class="due-badge due-badge--upcoming">${due.toLocaleDateString('en-GB', {day:'numeric',month:'short'})}</span>`
}

function emptyState(filter) {
  const messages = {
    active: { icon: '✓', title: 'All clear', hint: 'Tap + to add your first task' },
    today:  { icon: '☀', title: 'Nothing scheduled today', hint: 'Add a task and set it to Today' },
    done:   { icon: '🎉', title: 'No completed tasks yet', hint: 'Swipe a task left or tap to complete it' },
  }
  const m = messages[filter] || messages.active
  const div = document.createElement('div')
  div.className = 'empty-state'
  div.innerHTML = `
    <div class="empty-icon">${m.icon}</div>
    <p class="empty-title">${m.title}</p>
    <p class="empty-hint">${m.hint}</p>
  `
  return div
}

async function toggleComplete(id) {
  const task = await db.tasks.get(id)
  if (!task) return
  await db.tasks.update(id, {
    completedAt: task.completedAt ? null : Date.now(),
    status: task.completedAt ? 'inbox' : task.status,
  })
  syncTask(id).catch(() => {})
  refreshAll()
}

async function refreshAll() {
  const [tasks, settings, subjects] = await Promise.all([
    db.tasks.toArray(),
    getSettings(),
    getSubjects(),
  ])
  renderList(tasks, settings, subjects)
  updateCount(tasks)
}

function updateCount(tasks) {
  const el = document.getElementById('task-count')
  if (!el) return
  const active    = tasks.filter(t => !t.completedAt)
  const completed = tasks.filter(t => !!t.completedAt)
  const mins      = active.reduce((s, t) => s + (t.estimatedMins || 0), 0)
  el.textContent = `${active.length} active${mins > 0 ? ' · ' + fmtMins(mins) : ''} · ${completed.length} done`
}

function sectionHead(label, count) {
  return `<div class="section-header">${label}<span class="section-count">${count}</span></div>`
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
