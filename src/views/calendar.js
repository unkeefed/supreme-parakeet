import { db, getSettings, getSubjects, getSessionsForRange, getPlannedForRange, getPlannedForDate, addPlannedSession, deletePlannedSession, generateRecurringPlanned } from '../db/index.js'
import { esc, fmtMins } from '../utils/index.js'

export async function renderCalendar(container) {
  const today = new Date()
  let viewYear  = today.getFullYear()
  let viewMonth = today.getMonth() // 0-indexed

  container.innerHTML = `
    <div class="view-header">
      <h1 class="view-title">Calendar</h1>
      <button class="icon-btn" id="schedule-btn" title="Schedule a session">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>
    <div id="week-summary"></div>
    <div id="cal-nav" class="cal-nav"></div>
    <div id="cal-grid" class="cal-grid"></div>
    <div id="day-sheet"></div>
  `

  const [settings, subjects] = await Promise.all([getSettings(), getSubjects()])

  async function renderAll() {
    // Auto-generate planned sessions from recurring rules for ±4 weeks
    const from = new Date(); from.setDate(from.getDate() - 7)
    const to   = new Date(); to.setDate(to.getDate() + 28)
    await generateRecurringPlanned(
      from.toISOString().slice(0,10),
      to.toISOString().slice(0,10)
    ).catch(() => {})
    await Promise.all([
      renderWeekSummary(subjects, settings),
      renderMonth(viewYear, viewMonth, subjects, settings),
    ])
  }

  // Month nav
  container.querySelector('#cal-nav').addEventListener('click', async e => {
    if (e.target.closest('#prev-month')) {
      viewMonth--
      if (viewMonth < 0) { viewMonth = 11; viewYear-- }
      await renderAll()
    }
    if (e.target.closest('#next-month')) {
      viewMonth++
      if (viewMonth > 11) { viewMonth = 0; viewYear++ }
      await renderAll()
    }
    if (e.target.closest('#today-btn')) {
      viewYear  = today.getFullYear()
      viewMonth = today.getMonth()
      await renderAll()
    }
  })

  // Day tap → open day sheet
  container.querySelector('#cal-grid').addEventListener('click', async e => {
    const cell = e.target.closest('.cal-day[data-date]')
    if (!cell) return
    await openDaySheet(cell.dataset.date, subjects, settings)
  })

  // Schedule button
  container.querySelector('#schedule-btn').addEventListener('click', () => {
    const dateStr = toDateStr(today)
    openScheduleModal(dateStr, subjects, renderAll)
  })

  await renderAll()
}

// ─── Week summary strip ────────────────────────────────────────────────────
async function renderWeekSummary(subjects, settings) {
  const wrap = document.getElementById('week-summary')
  if (!wrap) return

  const today  = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const fromStr = toDateStr(monday)
  const toStr   = toDateStr(sunday)

  const [sessions, planned] = await Promise.all([
    getSessionsForRange(fromStr, toStr),
    getPlannedForRange(fromStr, toStr),
  ])

  const totalMins = sessions.reduce((s, x) => s + (x.durationMins || 0), 0)
  const totalSessions = sessions.length
  const totalPlanned  = planned.length

  // Per-subject mins this week
  const subjMins = new Map()
  sessions.forEach(s => {
    if (!s.subjectId) return
    subjMins.set(s.subjectId, (subjMins.get(s.subjectId) || 0) + (s.durationMins || 0))
  })

  // Day bars — 7 days Mon-Sun
  const dayMins = Array(7).fill(0)
  sessions.forEach(s => {
    const d = new Date(s.startedAt)
    const idx = (d.getDay() + 6) % 7
    dayMins[idx] += s.durationMins || 0
  })
  const maxDay = Math.max(...dayMins, 1)
  const dayLabels = ['M','T','W','T','F','S','S']
  const todayIdx  = (today.getDay() + 6) % 7

  wrap.innerHTML = `
    <div class="week-summary-card">
      <div class="week-summary-head">
        <span class="week-summary-title">This week</span>
        <span class="week-summary-stat">${formatMinsCompact(totalMins)} · ${totalSessions} session${totalSessions !== 1 ? 's' : ''}${totalPlanned ? ` · ${totalPlanned} planned` : ''}</span>
      </div>
      <div class="week-bars">
        ${dayLabels.map((label, i) => `
          <div class="week-bar-col">
            <div class="week-bar-wrap">
              <div class="week-bar-fill ${i === todayIdx ? 'week-bar-today' : ''}"
                style="height:${Math.round((dayMins[i] / maxDay) * 100)}%"></div>
            </div>
            <span class="week-bar-label ${i === todayIdx ? 'week-bar-label--today' : ''}">${label}</span>
          </div>
        `).join('')}
      </div>
      ${subjects.length ? `
        <div class="week-subj-row">
          ${subjects.filter(s => subjMins.has(s.id)).map(s => `
            <span class="week-subj-chip" style="background:${s.color}22;color:${s.color};border-color:${s.color}44">
              ${s.icon ? s.icon + ' ' : ''}${formatMinsCompact(subjMins.get(s.id))}
            </span>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `
}

// ─── Month grid ────────────────────────────────────────────────────────────
async function renderMonth(year, month, subjects, settings) {
  const nav  = document.getElementById('cal-nav')
  const grid = document.getElementById('cal-grid')
  if (!nav || !grid) return

  const monthName = new Date(year, month, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  nav.innerHTML = `
    <button class="cal-nav-btn" id="prev-month">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <div class="cal-month-label">
      <span>${monthName}</span>
      <button class="cal-today-pill" id="today-btn">Today</button>
    </div>
    <button class="cal-nav-btn" id="next-month">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  `

  // Load sessions and planned for entire month
  const firstDay = new Date(year, month, 1)
  const lastDay  = new Date(year, month + 1, 0)
  const fromStr  = toDateStr(firstDay)
  const toStr    = toDateStr(lastDay)

  const [sessions, planned, tasks] = await Promise.all([
    getSessionsForRange(fromStr, toStr),
    getPlannedForRange(fromStr, toStr),
    db.tasks.where('dueDate').between(fromStr, toStr, true, true).toArray(),
  ])

  // Build date → data map
  const byDate = new Map()
  const ensure = d => { if (!byDate.has(d)) byDate.set(d, { sessions: [], planned: [], tasks: [] }); return byDate.get(d) }
  sessions.forEach(s => ensure(s.date).sessions.push(s))
  planned.forEach(p => ensure(p.date).planned.push(p))
  tasks.forEach(t => { if (t.dueDate) ensure(t.dueDate).tasks.push(t) })

  // Build grid — start on Monday
  const startDow = (firstDay.getDay() + 6) % 7 // 0=Mon
  const daysInMonth = lastDay.getDate()
  const today = new Date()
  const todayStr = toDateStr(today)

  const dayHeaders = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

  let html = `<div class="cal-dow-row">${dayHeaders.map(d => `<div class="cal-dow">${d}</div>`).join('')}</div><div class="cal-cells">`

  // Empty cells before month starts
  for (let i = 0; i < startDow; i++) html += `<div class="cal-day cal-day--empty"></div>`

  for (let d = 1; d <= daysInMonth; d++) {
    const date    = new Date(year, month, d)
    const dateStr = toDateStr(date)
    const data    = byDate.get(dateStr) || { sessions: [], planned: [], tasks: [] }
    const isToday = dateStr === todayStr
    const isPast  = date < today && !isToday
    const isFuture = date > today

    // Colour dots — up to 3 unique subject colours from sessions
    const subjColors = [...new Set(
      data.sessions.filter(s => s.subjectId).map(s => {
        const subj = subjects.find(x => x.id === s.subjectId)
        return subj?.color
      }).filter(Boolean)
    )].slice(0, 3)

    const totalMins = data.sessions.reduce((s, x) => s + (x.durationMins || 0), 0)

    html += `
      <div class="cal-day ${isToday ? 'cal-day--today' : ''} ${isPast && !data.sessions.length && !data.planned.length ? 'cal-day--empty-past' : ''}"
        data-date="${dateStr}">
        <span class="cal-day-num ${isToday ? 'cal-day-num--today' : ''}">${d}</span>
        ${totalMins > 0 ? `<span class="cal-day-mins">${formatMinsCompact(totalMins)}</span>` : ''}
        <div class="cal-day-dots">
          ${subjColors.map(c => `<span class="cal-dot" style="background:${c}"></span>`).join('')}
          ${data.planned.length && isFuture ? `<span class="cal-dot cal-dot--planned"></span>` : ''}
          ${data.tasks.length ? `<span class="cal-dot cal-dot--task"></span>` : ''}
        </div>
      </div>
    `
  }

  html += '</div>'
  grid.innerHTML = html
}

// ─── Day sheet ─────────────────────────────────────────────────────────────
async function openDaySheet(dateStr, subjects, settings) {
  const existing = document.getElementById('day-sheet')
  if (!existing) return

  const date    = new Date(dateStr + 'T00:00:00')
  const label   = date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  const isToday = dateStr === toDateStr(new Date())
  const isPast  = date < new Date() && !isToday

  const [sessions, planned, tasks] = await Promise.all([
    getSessionsForRange(dateStr, dateStr),
    getPlannedForDate(dateStr),
    db.tasks.filter(t => t.dueDate === dateStr).toArray(),
  ])

  const totalMins = sessions.reduce((s, x) => s + (x.durationMins || 0), 0)

  function buildSessionBlock(s, isPlanned = false) {
    const subj  = s.subjectId ? subjects.find(x => x.id === s.subjectId) : null
    const color = subj?.color || 'var(--accent)'
    const time  = isPlanned
      ? s.startTime || ''
      : new Date(s.startedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

    return `
      <div class="day-session-row ${isPlanned ? 'day-session-row--planned' : ''}" data-id="${s.id}" data-planned="${isPlanned}">
        <div class="day-session-bar" style="background:${color}"></div>
        <div class="day-session-body">
          <div class="day-session-head">
            <span class="day-session-subj" style="color:${color}">
              ${subj ? (subj.icon ? subj.icon + ' ' : '') + subj.name : 'No subject'}
            </span>
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            ${isPlanned ? `<span class="day-session-badge">planned</span>` : `<span class="day-session-badge day-session-badge--done">done</span>`}
          </div>
          </div>
          <div class="day-session-meta">
            ${time ? `<span>${time}</span>` : ''}
            <span>${fmtMins(s.durationMins || 0)}</span>
            ${!isPlanned && s.qualityRating ? `<span>${s.qualityRating}</span>` : ''}
            ${s.notes ? `<span class="day-session-note">${esc(s.notes)}</span>` : ''}
          </div>
        </div>
        ${isPlanned ? `
          <button class="day-session-delete" data-id="${s.id}" title="Remove">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        ` : ''}
      </div>
    `
  }

  existing.innerHTML = `
    <div class="day-sheet-inner" id="day-sheet-inner">
      <div class="day-sheet-handle"></div>
      <div class="day-sheet-header">
        <div>
          <p class="day-sheet-title">${label}</p>
          ${totalMins > 0 ? `<p class="day-sheet-sub">${formatMinsCompact(totalMins)} focused</p>` : ''}
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          ${!isPast ? `<button class="btn-accent" id="day-schedule-btn">+ Plan session</button>` : ''}
          <button class="icon-btn" id="day-sheet-close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      ${sessions.length === 0 && planned.length === 0 && tasks.length === 0 ? `
        <p class="day-sheet-empty">${isPast ? 'No sessions recorded.' : 'Nothing planned yet.'}</p>
      ` : ''}

      ${planned.length > 0 ? `
        <p class="day-sheet-section">Planned</p>
        ${planned.map(p => buildSessionBlock(p, true)).join('')}
      ` : ''}

      ${sessions.length > 0 ? `
        <p class="day-sheet-section">Completed</p>
        ${sessions.map(s => buildSessionBlock(s, false)).join('')}
      ` : ''}

      ${tasks.length > 0 ? `
        <p class="day-sheet-section">Tasks due</p>
        ${tasks.map(t => `
          <div class="day-task-row">
            <span class="day-task-check ${t.completedAt ? 'checked' : ''}">
              ${t.completedAt ? '✓' : ''}
            </span>
            <span class="day-task-title ${t.completedAt ? 'task-title--done' : ''}">${esc(t.title)}</span>
          </div>
        `).join('')}
      ` : ''}
    </div>
  `

  // Animate in
  requestAnimationFrame(() => {
    existing.querySelector('#day-sheet-inner')?.classList.add('day-sheet--open')
  })

  // Close
  existing.querySelector('#day-sheet-close')?.addEventListener('click', () => {
    existing.querySelector('#day-sheet-inner')?.classList.remove('day-sheet--open')
    setTimeout(() => { existing.innerHTML = '' }, 280)
  })

  // Close on backdrop tap (outside sheet)
  existing.addEventListener('click', e => {
    if (e.target === existing) {
      existing.querySelector('#day-sheet-inner')?.classList.remove('day-sheet--open')
      setTimeout(() => { existing.innerHTML = '' }, 280)
    }
  })

  // Delete planned session
  existing.querySelectorAll('.day-session-delete').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.stopPropagation()
      const id = +btn.dataset.id
      await deletePlannedSession(id)
      // Re-render sheet + calendar
      existing.innerHTML = ''
      await openDaySheet(dateStr, subjects, settings)
      const grid = document.getElementById('cal-grid')
      if (grid) {
        const nav    = document.getElementById('cal-nav')
        const month  = nav ? parseInt(nav.dataset.month ?? new Date().getMonth()) : new Date().getMonth()
        const year   = nav ? parseInt(nav.dataset.year ?? new Date().getFullYear()) : new Date().getFullYear()
        await renderMonth(year, month, subjects, settings)
      }
    })
  })

  // Schedule from day sheet
  existing.querySelector('#day-schedule-btn')?.addEventListener('click', () => {
    existing.querySelector('#day-sheet-inner')?.classList.remove('day-sheet--open')
    setTimeout(() => {
      existing.innerHTML = ''
      openScheduleModal(dateStr, subjects, async () => {
        const [s2, subj2, set2] = await Promise.all([getSettings(), getSubjects()])
        await openDaySheet(dateStr, subj2, set2)
      })
    }, 280)
  })
}

// ─── Schedule session modal ────────────────────────────────────────────────
function openScheduleModal(defaultDate, subjects, onSave) {
  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'
  overlay.innerHTML = `
    <div class="modal-card detail-modal">
      <div class="modal-drag-bar"></div>
      <div class="modal-header">
        <p style="font-size:15px;font-weight:500;color:var(--text-primary);margin:0">Plan a session</p>
        <button class="modal-close-btn" id="sched-close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">

        <label class="modal-field-label">Subject</label>
        <div class="seg-row" id="sched-subj-seg" style="flex-wrap:wrap;margin-bottom:14px">
          ${subjects.length === 0
            ? `<p style="font-size:12px;color:var(--text-muted)">No subjects yet — add them in Settings.</p>`
            : subjects.map((s, i) => `
                <button class="seg-btn ${i === 0 ? 'seg-ctx-active' : ''}" data-id="${s.id}" data-color="${s.color}"
                  style="${i === 0 ? `background:${s.color}22;border-color:${s.color};color:${s.color}` : ''}">
                  ${s.icon ? s.icon + ' ' : ''}${esc(s.name)}
                </button>
              `).join('')
          }
        </div>

        <label class="modal-field-label">Link a task <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--text-muted)">(optional)</span></label>
        <div id="sched-task-wrap" style="margin-bottom:14px">
          <select class="sort-select" id="sched-task-sel" style="width:100%;padding:8px;font-size:13px">
            <option value="">No task linked</option>
          </select>
        </div>

        <div class="modal-row-2">
          <div style="flex:1">
            <label class="modal-field-label">Date</label>
            <input type="date" class="time-input date-input" id="sched-date" value="${defaultDate}">
          </div>
          <div>
            <label class="modal-field-label">Start time</label>
            <input type="time" class="time-input" id="sched-time" value="09:00">
          </div>
        </div>

        <div style="margin-top:12px">
          <label class="modal-field-label">Duration</label>
          <div class="seg-row" id="sched-dur-seg">
            <button class="seg-btn" data-mins="25">25m</button>
            <button class="seg-btn seg-active" data-mins="50">50m</button>
            <button class="seg-btn" data-mins="90">90m</button>
            <button class="seg-btn" data-mins="120">2h</button>
          </div>
        </div>

        <div style="margin-top:12px">
          <label class="modal-field-label">Notes <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--text-muted)">(optional)</span></label>
          <textarea class="detail-notes" id="sched-notes" rows="2" placeholder="What do you plan to cover?"></textarea>
        </div>

      </div>
      <div class="modal-footer">
        <button class="btn-ghost" id="sched-cancel">Cancel</button>
        <button class="btn-primary" id="sched-save">Save plan</button>
      </div>
    </div>
  `
  document.body.appendChild(overlay)
  requestAnimationFrame(() => overlay.querySelector('.detail-modal').classList.add('modal-open'))

  let selectedSubjectId = subjects[0]?.id || null
  let selectedMins      = 50

  // Load tasks for initial subject
  async function loadTasksForSubject(subjId) {
    const sel = overlay.querySelector('#sched-task-sel')
    if (!sel) return
    const tasks = await db.tasks.filter(t => !t.completedAt && (!subjId || t.subjectId === subjId || !t.subjectId)).toArray()
    const current = sel.value
    sel.innerHTML = '<option value="">No task linked</option>' +
      tasks.map(t => `<option value="${t.id}" ${t.id == current ? 'selected' : ''}>${esc(t.title)}</option>`).join('')
  }
  if (subjects.length) loadTasksForSubject(subjects[0]?.id)

  // Subject seg
  overlay.querySelectorAll('#sched-subj-seg .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.querySelectorAll('#sched-subj-seg .seg-btn').forEach(b => { b.classList.remove('seg-ctx-active'); b.style.cssText = '' })
      btn.classList.add('seg-ctx-active')
      const c = btn.dataset.color
      btn.style.background = c + '22'; btn.style.borderColor = c; btn.style.color = c
      selectedSubjectId = +btn.dataset.id
      loadTasksForSubject(selectedSubjectId)
    })
  })

  // Duration seg
  overlay.querySelectorAll('#sched-dur-seg .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.querySelectorAll('#sched-dur-seg .seg-btn').forEach(b => b.classList.remove('seg-active'))
      btn.classList.add('seg-active')
      selectedMins = +btn.dataset.mins
    })
  })

  const close = () => {
    overlay.querySelector('.detail-modal').classList.remove('modal-open')
    setTimeout(() => overlay.remove(), 250)
  }
  overlay.querySelector('#sched-close').addEventListener('click', close)
  overlay.querySelector('#sched-cancel').addEventListener('click', close)
  overlay.addEventListener('click', e => { if (e.target === overlay) close() })

  overlay.querySelector('#sched-save').addEventListener('click', async () => {
    if (!selectedSubjectId) { close(); return }
    const date  = overlay.querySelector('#sched-date').value
    const time  = overlay.querySelector('#sched-time').value
    const notes = overlay.querySelector('#sched-notes').value.trim()
    if (!date) return
    const taskIdVal = overlay.querySelector('#sched-task-sel')?.value
    await addPlannedSession({
      subjectId:    selectedSubjectId,
      taskId:       taskIdVal ? +taskIdVal : null,
      date,
      startTime:    time,
      durationMins: selectedMins,
      notes,
    })
    close()
    if (onSave) await onSave()
  })
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function toDateStr(date) {
  return date.toISOString().slice(0, 10)
}

function formatMinsCompact(mins) {
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h}h ${m}m` : `${h}h`
}
