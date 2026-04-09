import { db, saveSession, getSettings, getSubjects, getFocusMinutesForDate, getSubjectMinutesForDate, getSubjectStreak, getSessionsForDate } from '../db/index.js'
import { esc, fmtTime, fmtMins, todayStr, callGemini, buildDistractionPrompt } from '../utils/index.js'

// ─── Module-level state ────────────────────────────────────────────────────
let timerInterval = null
let breakInterval = null
let sessionData   = {}
let pomodoroCount = 0

// ─── Entry point ──────────────────────────────────────────────────────────
export async function renderFocus(container) {
  container_ref = container
  const [settings, subjects] = await Promise.all([getSettings(), getSubjects()])
  const tasks = await loadTodayTasks()

  container.innerHTML = `
    <div class="view-header">
      <h1 class="view-title">Focus</h1>
      <span class="state-badge" id="state-badge">Idle</span>
    </div>
    <div id="session-stage"></div>
  `

  if (timerInterval && sessionData.taskId) {
    const task    = await db.tasks.get(sessionData.taskId)
    const ctx     = settings.contexts.find(c => c.id === task?.context)
    const subject = sessionData.subjectId ? subjects.find(s => s.id === sessionData.subjectId) : null
    showActive(container, task, ctx, subject, sessionData.durationMins, settings)
  } else {
    showSetup(container, tasks, settings, subjects)
  }
}

export async function renderFocusWrapped(container) {
  container_ref = container
  return renderFocus(container)
}

let container_ref = null

// ─── SETUP ────────────────────────────────────────────────────────────────
async function showSetup(container, tasks, settings, subjects) {
  clearTimers()
  setBadge('Idle', '')

  const stage = container.querySelector('#session-stage')
  stage.innerHTML = `
    <div id="daily-progress-wrap"></div>
    <div id="subject-progress-wrap"></div>

    <p class="stage-label">Subject <span class="stage-label-hint">optional</span></p>
    <div class="subject-picker" id="subject-picker">
      <button class="subject-chip ${!subjects.length ? 'hidden' : ''} subject-chip--none selected" data-id="">
        No subject
      </button>
      ${subjects.map(s => `
        <button class="subject-chip" data-id="${s.id}"
          style="--sc:${s.color}">
          <span class="subject-chip-icon">${s.icon || '📚'}</span>
          <span>${esc(s.name)}</span>
        </button>
      `).join('')}
    </div>

    <p class="stage-label" style="margin-top:18px">Task <span class="stage-label-hint">optional</span></p>
    <div id="task-picker" class="task-picker">
      ${tasks.length === 0
        ? `<div class="empty-state" style="padding:24px 0">
             <p style="font-size:13px;color:var(--text-muted)">No tasks scheduled for today.</p>
             <button class="btn-ghost" style="margin-top:10px;font-size:12px" id="go-inbox">Go to Inbox →</button>
           </div>`
        : `<button class="picker-row picker-row--none selected" data-id="">
             <span style="color:var(--text-muted);font-size:13px">Free session — no task</span>
           </button>
           ${tasks.map(t => pickerRow(t, settings.contexts, subjects, false)).join('')}`
      }
    </div>

    <p class="stage-label" style="margin-top:18px">Session length</p>
    <div class="seg-row" id="dur-seg">
      ${[25, 50, 90].map(m => `
        <button class="seg-btn ${settings.defaultDuration === m ? 'seg-active' : ''}" data-mins="${m}">${m} min</button>
      `).join('')}
    </div>

    <button class="btn-primary full-width" id="start-btn" style="margin-top:24px">
      Start session
    </button>

    <div class="planner-link-row">
      <button class="link-btn" id="open-planner">View day planner →</button>
    </div>
  `

  // ── Global daily progress ──────────────────────────────────────────────
  loadGlobalProgress(settings)

  // ── Per-subject progress bars ──────────────────────────────────────────
  loadSubjectProgress(subjects, settings)

  let selectedTaskId    = null  // null = free session
  let selectedSubjectId = null  // null = no subject
  let selectedMins      = settings.defaultDuration

  // Subject picker
  stage.querySelectorAll('.subject-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      stage.querySelectorAll('.subject-chip').forEach(c => c.classList.remove('selected'))
      chip.classList.add('selected')
      selectedSubjectId = chip.dataset.id ? +chip.dataset.id : null
    })
  })

  // Task picker
  stage.querySelectorAll('.picker-row').forEach(row => {
    row.addEventListener('click', () => {
      stage.querySelectorAll('.picker-row').forEach(r => r.classList.remove('selected'))
      row.classList.add('selected')
      selectedTaskId = row.dataset.id ? +row.dataset.id : null

      // Auto-select subject from task if not already set
      if (selectedTaskId && !selectedSubjectId) {
        db.tasks.get(selectedTaskId).then(task => {
          if (task?.subjectId) {
            const chip = stage.querySelector(`.subject-chip[data-id="${task.subjectId}"]`)
            if (chip) {
              stage.querySelectorAll('.subject-chip').forEach(c => c.classList.remove('selected'))
              chip.classList.add('selected')
              selectedSubjectId = task.subjectId
            }
          }
        })
      }
    })
  })

  // Duration
  stage.querySelectorAll('#dur-seg .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      stage.querySelectorAll('#dur-seg .seg-btn').forEach(b => b.classList.remove('seg-active'))
      btn.classList.add('seg-active')
      selectedMins = +btn.dataset.mins
    })
  })

  stage.querySelector('#go-inbox')?.addEventListener('click', () => {
    import('../router.js').then(m => m.navigateTo('inbox'))
  })

  stage.querySelector('#open-planner')?.addEventListener('click', () => {
    showPlanner(container, tasks, settings, subjects)
  })

  stage.querySelector('#start-btn').addEventListener('click', async () => {
    const task    = selectedTaskId ? await db.tasks.get(selectedTaskId) : null
    const ctx     = task ? settings.contexts.find(c => c.id === task.context) : null
    const subject = selectedSubjectId ? subjects.find(s => s.id === selectedSubjectId) : null
    showActive(container, task, ctx, subject, selectedMins, settings)
  })
}

// ─── Daily progress (global) ───────────────────────────────────────────────
async function loadGlobalProgress(settings) {
  const mins   = await getFocusMinutesForDate(todayStr())
  const target = settings.dailyGoalHours * 60
  const pct    = Math.min(100, Math.round((mins / target) * 100))
  const wrap   = document.getElementById('daily-progress-wrap')
  if (!wrap) return
  wrap.innerHTML = `
    <div class="daily-progress-card">
      <div class="dp-row">
        <span class="dp-label">Today's focus</span>
        <span class="dp-val">${fmtMins(mins)} <span class="dp-target">/ ${settings.dailyGoalHours}h</span></span>
      </div>
      <div class="dp-bar-bg">
        <div class="dp-bar-fg" style="width:${pct}%"></div>
      </div>
      ${pct >= 100 ? `<p class="dp-done">Daily goal reached 🎉</p>` : ''}
    </div>
  `
}

// ─── Per-subject progress bars ─────────────────────────────────────────────
async function loadSubjectProgress(subjects, settings) {
  if (!subjects.length) return
  const wrap = document.getElementById('subject-progress-wrap')
  if (!wrap) return

  const today = todayStr()
  const rows  = await Promise.all(subjects.map(async s => {
    const mins = await getSubjectMinutesForDate(today, s.id)
    const pct  = Math.min(100, Math.round((mins / (s.dailyGoalMins || 60)) * 100))
    const graceDays   = settings.streakFreezeEnabled ? (settings.streakGraceDays ?? 1) : 0
    const { current } = await getSubjectStreak(s.id, s.dailyGoalMins, settings.activeDays, graceDays)
    return { s, mins, pct, streak: current }
  }))

  wrap.innerHTML = `
    <div class="subj-progress-section">
      <p class="stage-label" style="margin-bottom:8px">Subject goals</p>
      ${rows.map(({ s, mins, pct, streak }) => `
        <div class="subj-progress-row">
          <div class="subj-progress-head">
            <span class="subj-progress-icon" style="color:${s.color}">${s.icon || '📚'}</span>
            <span class="subj-progress-name">${esc(s.name)}</span>
            <span class="subj-progress-val">${fmtMins(mins)}<span class="subj-progress-goal"> / ${fmtMins(s.dailyGoalMins)}</span></span>
            ${streak > 0 ? `<span class="subj-streak-badge" style="${streak >= 14 ? 'background:rgba(186,117,23,.2);color:#BA7517;border-color:rgba(186,117,23,.4)' : streak >= 7 ? 'background:rgba(127,119,221,.2);color:#7F77DD;border-color:rgba(127,119,221,.4)' : ''}">${streak >= 30 ? '🔥🔥🔥' : streak >= 14 ? '🔥🔥' : '🔥'} ${streak}</span>` : ''}
          </div>
          <div class="dp-bar-bg" style="margin-top:5px">
            <div class="dp-bar-fg" style="width:${pct}%;background:${s.color}"></div>
          </div>
          ${pct >= 100 ? `<p class="dp-done" style="color:${s.color}">Goal reached ✓</p>` : ''}
        </div>
      `).join('')}
    </div>
  `
}

// ─── ACTIVE ───────────────────────────────────────────────────────────────
function showActive(container, task, ctx, subject, durationMins, settings) {
  clearTimers()
  setBadge('Focus', 'focus')

  const color       = subject?.color || ctx?.color || '#7F77DD'
  const totalSecs   = (durationMins || settings.defaultDuration) * 60
  const circumference = 2 * Math.PI * 68

  sessionData = {
    taskId:         task?.id || null,
    goalId:         task?.goalId || null,
    context:        task?.context || null,
    subjectId:      subject?.id || null,
    startedAt:      Date.now(),
    durationMins:   durationMins || settings.defaultDuration,
    distractions:   0,
    distractionLog: [],
    qualityRating:  null,
    notes:          '',
  }

  const stage = container.querySelector('#session-stage')

  // Build the label pill
  const pillLabel = subject
    ? `${subject.icon ? subject.icon + ' ' : ''}${subject.name}`
    : task
      ? task.title
      : 'Free session'

  stage.innerHTML = `
    <div class="active-header">
      <div class="task-pill" style="border-color:${color}44">
        <span class="ctx-dot" style="background:${color}"></span>
        <span class="pill-text">${esc(pillLabel)}</span>
      </div>
      ${task && task.title !== pillLabel ? `
        <p class="active-task-sub">${esc(task.title)}</p>
      ` : ''}
      <div class="pomo-dots" id="pomo-dots">
        ${Array.from({ length: settings.longBreakAfter || 4 }, (_, i) => `
          <div class="pomo-dot ${i < pomodoroCount ? 'done' : i === pomodoroCount ? 'active' : ''}"></div>
        `).join('')}
      </div>
    </div>

    ${subject ? `
      <div id="active-subj-progress"></div>
    ` : ''}

    <div class="timer-wrap">
      <div class="timer-ring-wrap">
        <svg class="timer-svg" viewBox="0 0 160 160">
          <circle class="ring-bg" cx="80" cy="80" r="68"/>
          <circle class="ring-fg" id="ring-fg" cx="80" cy="80" r="68"
            stroke="${color}"
            stroke-dasharray="${circumference.toFixed(1)}"
            stroke-dashoffset="0"/>
        </svg>
        <div class="timer-center">
          <p class="timer-num" id="timer-num">${fmtTime(totalSecs)}</p>
          <p class="timer-sub" id="timer-sub">Focus</p>
        </div>
      </div>
    </div>

    <div class="active-controls">
      <button class="btn-ghost flex-2" id="pause-btn">Pause</button>
      <button class="btn-ghost danger flex-1" id="end-btn">End</button>
    </div>

    <div class="distract-section">
      <p class="stage-label">Log distraction</p>
      <div class="distract-chips">
        ${['Phone','Notification','Thought','Noise','Other'].map(d =>
          `<button class="distract-chip" data-type="${d}">${d}</button>`
        ).join('')}
      </div>
      <div class="distract-counter">
        <span class="stage-label" style="margin:0">Distractions</span>
        <span class="distract-badge" id="distract-badge">0</span>
      </div>
    </div>
  `

  // Live subject goal progress during session
  if (subject) {
    updateActiveSubjectProgress(subject, settings)
  }

  let remainSecs = totalSecs
  let paused     = false

  timerInterval = setInterval(() => {
    if (paused) return
    remainSecs--
    const numEl = document.getElementById('timer-num')
    if (numEl) numEl.textContent = fmtTime(Math.max(0, remainSecs))

    const pct    = remainSecs / totalSecs
    const offset = (circumference * (1 - pct)).toFixed(1)
    const ring   = document.getElementById('ring-fg')
    if (ring) ring.setAttribute('stroke-dashoffset', offset)

    // Update subject progress every 30s
    if (subject && (totalSecs - remainSecs) % 30 === 0) {
      updateActiveSubjectProgress(subject, settings)
    }

    if (remainSecs <= 0) {
      clearTimers()
      pomodoroCount++
      window._apexHaptic?.('medium')
      if (settings.sessionEndSound) window._apexPlayBeep?.('session-end')
      window._apexNotify?.('Session complete — Apex Focus', `${sessionData.durationMins}m logged. Rate your session.`)
      finishSession(container, task, ctx, subject, settings)
    }
  }, 1000)

  const pauseBtn = stage.querySelector('#pause-btn')
  pauseBtn.addEventListener('click', () => {
    paused = !paused
    pauseBtn.textContent = paused ? 'Resume' : 'Pause'
    setBadge(paused ? 'Paused' : 'Focus', paused ? '' : 'focus')
  })

  stage.querySelector('#end-btn').addEventListener('click', () => {
    clearTimers()
    const elapsed = Math.max(1, Math.round((Date.now() - sessionData.startedAt) / 60000))
    sessionData.durationMins = elapsed
    pomodoroCount++
    finishSession(container, task, ctx, subject, settings)
  })

  stage.querySelectorAll('.distract-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      sessionData.distractions++
      sessionData.distractionLog.push({ type: chip.dataset.type, at: Date.now() })
      const badge = document.getElementById('distract-badge')
      if (badge) badge.textContent = sessionData.distractions
      chip.classList.add('logged')
      setTimeout(() => chip.classList.remove('logged'), 900)
    })
  })

  if ('wakeLock' in navigator) {
    navigator.wakeLock.request('screen').catch(() => {})
  }
}

async function updateActiveSubjectProgress(subject, settings) {
  const wrap = document.getElementById('active-subj-progress')
  if (!wrap) return
  const mins = await getSubjectMinutesForDate(todayStr(), subject.id)
  const pct  = Math.min(100, Math.round((mins / (subject.dailyGoalMins || 60)) * 100))
  wrap.innerHTML = `
    <div class="active-subj-bar">
      <div class="active-subj-bar-head">
        <span style="font-size:12px;color:var(--text-muted)">${esc(subject.name)} today</span>
        <span style="font-size:12px;color:${subject.color}">${fmtMins(mins)} / ${fmtMins(subject.dailyGoalMins)}</span>
      </div>
      <div class="dp-bar-bg" style="margin-top:4px">
        <div class="dp-bar-fg" style="width:${pct}%;background:${subject.color}"></div>
      </div>
    </div>
  `
}

// ─── FINISH ────────────────────────────────────────────────────────────────
async function finishSession(container, task, ctx, subject, settings) {
  let distractTip = null

  if (settings.aiDistractionAlerts && settings.aiApiKey && sessionData.distractions > 0) {
    const allSessions = await getSessionsForDate(todayStr())
    const avgD = allSessions.length
      ? allSessions.reduce((s, x) => s + (x.distractions || 0), 0) / allSessions.length
      : 0
    if (sessionData.distractions > avgD * 1.5 + 1) {
      distractTip = await callGemini(buildDistractionPrompt(sessionData, avgD), settings.aiApiKey).catch(() => null)
    }
  }

  if (settings.aiSmartRescheduling && settings.aiApiKey) {
    try {
      const now       = new Date()
      const nowMins   = now.getHours() * 60 + now.getMinutes()
      const remaining = await db.time_blocks.where('date').equals(todayStr())
        .filter(b => b.startTime > nowMins).toArray()
      if (remaining.length > 0 && !distractTip) {
        const taskIds  = [...new Set(remaining.map(b => b.taskId).filter(Boolean))]
        const taskObjs = await Promise.all(taskIds.map(id => db.tasks.get(id)))
        const titles   = taskObjs.filter(Boolean).map(t => t.title)
        const prompt   = `You are a productivity assistant. A focus session just ended and it's now ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}. The user still has these tasks planned: ${titles.join(', ')}. In one short sentence (under 15 words), suggest whether to continue the plan or drop the lowest priority task. Be direct.`
        distractTip = await callGemini(prompt, settings.aiApiKey).catch(() => null)
      }
    } catch {}
  }

  showWrap(container, task, ctx, subject, settings, distractTip)
}

// ─── WRAP ──────────────────────────────────────────────────────────────────
function showWrap(container, task, ctx, subject, settings, distractTip = null) {
  setBadge('Done', 'done')

  const stage = container.querySelector('#session-stage')
  const focusRate = sessionData.distractions > 0
    ? Math.max(0, Math.round(100 - (sessionData.distractions / sessionData.durationMins) * 100 * 0.5))
    : 100

  stage.innerHTML = `
    <div class="wrap-hero">
      <div class="wrap-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="#0F6E56" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>
      <p class="wrap-title">Session complete</p>
      <p class="wrap-meta">
        ${sessionData.durationMins}m
        ${subject ? `· <span style="color:${subject.color}">${subject.icon || ''}${subject.name}</span>` : ''}
        · ${sessionData.distractions} distraction${sessionData.distractions !== 1 ? 's' : ''}
      </p>
    </div>

    <div class="stat-grid">
      <div class="stat-card">
        <p class="stat-val">${fmtMins(sessionData.durationMins)}</p>
        <p class="stat-label">Duration</p>
      </div>
      <div class="stat-card">
        <p class="stat-val">${focusRate}%</p>
        <p class="stat-label">Focus rate</p>
      </div>
      <div class="stat-card">
        <p class="stat-val" id="quality-stat">—</p>
        <p class="stat-label">Quality</p>
      </div>
    </div>

    ${subject ? `<div id="wrap-subj-progress"></div>` : ''}

    ${distractTip ? `
      <div class="ai-tip">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        ${esc(distractTip)}
      </div>
    ` : ''}

    <p class="stage-label">Rate this session</p>
    <div class="seg-row" id="quality-seg">
      <button class="seg-btn" data-val="Deep">Deep</button>
      <button class="seg-btn" data-val="Good">Good</button>
      <button class="seg-btn" data-val="Patchy">Patchy</button>
    </div>

    <p class="stage-label" style="margin-top:16px">Session note</p>
    <textarea class="session-note" id="session-note" rows="3"
      placeholder="What did you get done? Any blockers?"></textarea>

    <div class="wrap-actions">
      <button class="btn-ghost" id="break-btn">Take ${settings.breakLength}m break</button>
      <button class="btn-primary" id="save-btn">Save &amp; finish</button>
    </div>
  `

  // Show post-session subject progress
  if (subject) {
    updateActiveSubjectProgress(subject, settings).then(() => {
      // Check if goal was just crossed
      getSubjectMinutesForDate(todayStr(), subject.id).then(mins => {
        if (mins + sessionData.durationMins >= subject.dailyGoalMins && mins < subject.dailyGoalMins) {
          const el = document.getElementById('wrap-subj-progress')
          if (el) el.insertAdjacentHTML('beforeend', `
            <p class="dp-done" style="color:${subject.color};margin-top:4px">
              ${subject.name} goal reached 🎉
            </p>
          `)
        }
      })
    })
  }

  stage.querySelector('#session-note').addEventListener('input', e => {
    sessionData.notes = e.target.value
  })

  stage.querySelectorAll('#quality-seg .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      stage.querySelectorAll('#quality-seg .seg-btn').forEach(b => { b.classList.remove('seg-active'); b.style.cssText = '' })
      btn.classList.add('seg-active')
      btn.style.background  = 'var(--accent)22'
      btn.style.borderColor = 'var(--accent)'
      btn.style.color       = 'var(--accent)'
      sessionData.qualityRating = btn.dataset.val
      const qs = document.getElementById('quality-stat')
      if (qs) qs.textContent = btn.dataset.val
    })
  })

  stage.querySelector('#save-btn').addEventListener('click', async () => {
    await commitSession(settings, subject)
    const [tasks, subjects] = await Promise.all([loadTodayTasks(), getSubjects()])
    showSetup(container, tasks, settings, subjects)
  })

  stage.querySelector('#break-btn').addEventListener('click', async () => {
    await commitSession(settings, subject)
    const isLong = pomodoroCount > 0 && pomodoroCount % (settings.longBreakAfter || 4) === 0
    if (isLong) pomodoroCount = 0
    showBreak(container, isLong ? settings.longBreakLength : settings.breakLength, settings)
  })
}

// ─── BREAK ─────────────────────────────────────────────────────────────────
function showBreak(container, breakMins, settings) {
  clearTimers()
  setBadge('Break', 'break')

  const totalSecs = breakMins * 60
  let remainSecs  = totalSecs
  const circ      = 2 * Math.PI * 68

  const stage = container.querySelector('#session-stage')
  stage.innerHTML = `
    <p style="text-align:center;font-size:13px;color:var(--text-muted);margin:0 0 4px">
      ${breakMins >= 20 ? 'Long break — step away and recharge' : 'Short break — stretch and breathe'}
    </p>
    <div class="timer-wrap">
      <div class="timer-ring-wrap">
        <svg class="timer-svg" viewBox="0 0 160 160">
          <circle class="ring-bg" cx="80" cy="80" r="68"/>
          <circle class="ring-fg" id="break-ring" cx="80" cy="80" r="68"
            stroke="#1D9E75"
            stroke-dasharray="${circ.toFixed(1)}"
            stroke-dashoffset="0"/>
        </svg>
        <div class="timer-center">
          <p class="timer-num" id="break-num">${fmtTime(totalSecs)}</p>
          <p class="timer-sub" style="color:var(--teal)">Break</p>
        </div>
      </div>
    </div>
    <button class="btn-primary full-width" id="skip-break" style="margin-top:24px">
      Skip break
    </button>
  `

  breakInterval = setInterval(() => {
    remainSecs--
    const el   = document.getElementById('break-num')
    const ring = document.getElementById('break-ring')
    if (el) el.textContent = fmtTime(Math.max(0, remainSecs))
    if (ring) ring.setAttribute('stroke-dashoffset', (circ * (1 - remainSecs / totalSecs)).toFixed(1))
    if (remainSecs <= 0) {
      clearTimers()
      if (settings.breakEndReminder) window._apexPlayBeep?.('break-end')
      endBreak(container, settings)
    }
  }, 1000)

  stage.querySelector('#skip-break').addEventListener('click', () => {
    clearTimers()
    endBreak(container, settings)
  })
}

async function endBreak(container, settings) {
  const [tasks, subjects] = await Promise.all([loadTodayTasks(), getSubjects()])
  showSetup(container, tasks, settings, subjects)
}

// ─── PLANNER ──────────────────────────────────────────────────────────────
async function showPlanner(container, tasks, settings, subjects) {
  const blocks   = await db.time_blocks.where('date').equals(todayStr()).toArray()
  const tasksMap = Object.fromEntries(tasks.map(t => [t.id, t]))

  const stage = container.querySelector('#session-stage')
  stage.innerHTML = `
    <div class="planner-header">
      <div>
        <p class="stage-label" style="margin:0 0 2px">Day planner</p>
        <p class="planner-total" id="planner-total">${calcBlockedTime(blocks)}h blocked</p>
      </div>
      <button class="btn-accent" id="back-setup">← Back</button>
    </div>
    <div class="planner-grid" id="planner-grid"></div>
    <button class="btn-primary full-width" style="margin-top:16px" id="planner-start">
      Start first session
    </button>
  `

  stage.querySelector('#back-setup').addEventListener('click', async () => {
    showSetup(container, tasks, settings, subjects)
  })

  stage.querySelector('#planner-start').addEventListener('click', async () => {
    const now     = new Date()
    const nowMins = now.getHours() * 60 + now.getMinutes()
    const next    = blocks.filter(b => b.taskId && tasksMap[b.taskId])
      .sort((a, b) => a.startTime - b.startTime)
      .find(b => b.startTime >= nowMins)
    const task    = next ? tasksMap[next.taskId] : tasks[0]
    if (!task) return
    const ctx     = settings.contexts.find(c => c.id === task.context)
    const subject = task.subjectId ? subjects.find(s => s.id === task.subjectId) : null
    showActive(container, task, ctx, subject, next?.durationMins || settings.defaultDuration, settings)
  })

  renderPlannerGrid(stage, tasks, settings, subjects, blocks, tasksMap)
}

function renderPlannerGrid(stage, tasks, settings, subjects, blocks, tasksMap) {
  const grid = stage.querySelector('#planner-grid')
  if (!grid) return
  grid.innerHTML = ''

  const hours = Array.from({ length: 14 }, (_, i) => i + 7)
  const now   = new Date()
  const nowH  = now.getHours()

  hours.forEach(h => {
    const blockForHour = blocks.find(b => Math.floor(b.startTime / 60) === h)
    const task  = blockForHour ? tasksMap[blockForHour.taskId] : null
    const ctx   = task ? settings.contexts.find(c => c.id === task.context) : null
    const subj  = task?.subjectId ? subjects.find(s => s.id === task.subjectId) : null
    const color = subj?.color || ctx?.color || '#7F77DD'
    const isNow = h === nowH

    const row = document.createElement('div')
    row.className = 'planner-row' + (isNow ? ' planner-now' : '')
    row.innerHTML = `
      <div class="planner-hour ${isNow ? 'planner-hour--now' : ''}">${hourLabel(h)}</div>
      <div class="planner-slot">
        ${isNow ? `<div class="now-line"><span class="now-dot"></span></div>` : ''}
        ${task
          ? `<div class="planner-block" data-task-id="${task.id}"
               style="background:${color}22;border-color:${color}44;color:${color}">
               <span class="block-title">${esc(task.title)}</span>
               ${subj ? `<span class="block-subj">${subj.icon || ''} ${esc(subj.name)}</span>` : ''}
               ${blockForHour.durationMins ? `<span class="block-dur">${blockForHour.durationMins}m</span>` : ''}
             </div>`
          : `<div class="planner-empty" data-hour="${h}"><span>+ add block</span></div>`
        }
      </div>
    `

    const block = row.querySelector('.planner-block')
    if (block) {
      let pressTimer = null
      block.addEventListener('click', async () => {
        if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; return }
        const t   = await db.tasks.get(+block.dataset.taskId)
        const s   = await getSettings()
        const c   = s.contexts.find(x => x.id === t?.context)
        const sj  = t?.subjectId ? subjects.find(x => x.id === t.subjectId) : null
        showActive(container_ref, t, c, sj, blockForHour.durationMins || s.defaultDuration, s)
      })
      const startPress = () => { pressTimer = setTimeout(async () => {
        pressTimer = null
        if (!confirm('Remove this block?')) return
        await db.time_blocks.delete(blockForHour.id)
        const ub = await db.time_blocks.where('date').equals(todayStr()).toArray()
        renderPlannerGrid(stage, tasks, settings, subjects, ub, Object.fromEntries(tasks.map(t => [t.id, t])))
        const total = stage.querySelector('#planner-total')
        if (total) total.textContent = calcBlockedTime(ub) + 'h blocked'
      }, 500) }
      const cancelPress = () => { if (pressTimer) { clearTimeout(pressTimer); pressTimer = null } }
      block.addEventListener('touchstart', startPress, { passive: true })
      block.addEventListener('touchend',   cancelPress)
      block.addEventListener('mousedown',  startPress)
      block.addEventListener('mouseup',    cancelPress)
      block.addEventListener('mouseleave', cancelPress)
    }

    const empty = row.querySelector('.planner-empty')
    if (empty) {
      empty.addEventListener('click', () => openBlockPicker(h, tasks, settings, async () => {
        const ub = await db.time_blocks.where('date').equals(todayStr()).toArray()
        renderPlannerGrid(stage, tasks, settings, subjects, ub, Object.fromEntries(tasks.map(t => [t.id, t])))
        const total = stage.querySelector('#planner-total')
        if (total) total.textContent = calcBlockedTime(ub) + 'h blocked'
      }))
    }

    grid.appendChild(row)
  })
}

async function openBlockPicker(hour, tasks, settings, onSave) {
  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'
  overlay.innerHTML = `
    <div class="modal-card detail-modal">
      <div class="modal-drag-bar"></div>
      <div class="modal-header">
        <p style="font-size:15px;font-weight:500;color:var(--text-primary);margin:0">Block ${hourLabel(hour)}</p>
        <button class="modal-close-btn" id="block-close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <label class="modal-field-label">Task</label>
        <div class="task-picker" id="block-task-picker" style="max-height:220px;overflow-y:auto">
          ${tasks.map((t, i) => pickerRow(t, settings.contexts, [], i === 0)).join('')}
        </div>
        <label class="modal-field-label" style="margin-top:14px">Duration</label>
        <div class="seg-row" id="block-dur-seg">
          <button class="seg-btn" data-mins="25">25m</button>
          <button class="seg-btn seg-active" data-mins="50">50m</button>
          <button class="seg-btn" data-mins="90">90m</button>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-ghost" id="block-cancel">Cancel</button>
        <button class="btn-primary" id="block-save">Add block</button>
      </div>
    </div>
  `
  document.body.appendChild(overlay)
  requestAnimationFrame(() => overlay.querySelector('.detail-modal').classList.add('modal-open'))

  let selectedTaskId = tasks[0]?.id || null
  let selectedMins   = 50

  overlay.querySelectorAll('.picker-row').forEach(row => {
    row.addEventListener('click', () => {
      overlay.querySelectorAll('.picker-row').forEach(r => r.classList.remove('selected'))
      row.classList.add('selected')
      selectedTaskId = row.dataset.id ? +row.dataset.id : null
    })
  })
  overlay.querySelectorAll('#block-dur-seg .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.querySelectorAll('#block-dur-seg .seg-btn').forEach(b => b.classList.remove('seg-active'))
      btn.classList.add('seg-active')
      selectedMins = +btn.dataset.mins
    })
  })

  const close = () => {
    overlay.querySelector('.detail-modal').classList.remove('modal-open')
    setTimeout(() => overlay.remove(), 250)
  }
  overlay.querySelector('#block-close').addEventListener('click', close)
  overlay.querySelector('#block-cancel').addEventListener('click', close)
  overlay.addEventListener('click', e => { if (e.target === overlay) close() })

  overlay.querySelector('#block-save').addEventListener('click', async () => {
    if (!selectedTaskId) return
    await db.time_blocks.add({ taskId: selectedTaskId, date: todayStr(), startTime: hour * 60, durationMins: selectedMins, createdAt: Date.now() })
    close()
    onSave()
  })
}

// ─── Session commit ────────────────────────────────────────────────────────
async function commitSession(settings, subject) {
  await saveSession(sessionData)

  // Global daily goal check
  try {
    const goalMins  = settings.dailyGoalHours * 60
    const nowMins   = await getFocusMinutesForDate(todayStr())
    const prevMins  = nowMins - sessionData.durationMins
    if (prevMins < goalMins && nowMins >= goalMins && settings.dailyGoalAlert) {
      window._apexHaptic?.('success')
      window._apexPlayBeep?.('goal-reached')
      window._apexNotify?.('Daily goal reached! 🎉', `${settings.dailyGoalHours}h of deep work done.`, 'goal-reached')
    }
  } catch {}

  // Subject daily goal check + streak milestone
  if (subject) {
    try {
      const prevSubjMins = await getSubjectMinutesForDate(todayStr(), subject.id) - sessionData.durationMins
      const nowSubjMins  = await getSubjectMinutesForDate(todayStr(), subject.id)
      if (prevSubjMins < subject.dailyGoalMins && nowSubjMins >= subject.dailyGoalMins) {
        window._apexHaptic?.('success')
        window._apexPlayBeep?.('goal-reached')
        // Check streak
        const graceDays   = settings.streakFreezeEnabled ? (settings.streakGraceDays ?? 1) : 0
        const { current } = await getSubjectStreak(subject.id, subject.dailyGoalMins, settings.activeDays, graceDays)
        const milestones   = [3, 7, 14, 30]
        if (milestones.includes(current)) {
          window._apexHaptic?.('success')
          window._apexNotify?.(
            `${current}-day streak! 🔥`,
            `You've hit your ${subject.name} goal ${current} days in a row.`,
            'streak-' + subject.id
          )
        }
      }
    } catch {}
  }

  // Dashboard sync
  if (settings.syncHabits) {
    const todayMins = await getFocusMinutesForDate(todayStr())
    if (todayMins >= settings.dailyGoalHours * 60) {
      await db.settings.put({ key: 'habitSync_' + todayStr(), value: true })
    }
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────
async function loadTodayTasks() {
  return db.tasks.where('status').anyOf(['today', 'inbox']).filter(t => !t.completedAt).toArray()
}

function clearTimers() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null }
  if (breakInterval) { clearInterval(breakInterval); breakInterval = null }
}

function setBadge(text, type) {
  const badge = document.getElementById('state-badge')
  if (!badge) return
  badge.textContent = text
  badge.className   = 'state-badge' + (type ? ' badge-' + type : '')
}

function pickerRow(task, contexts, subjects, isFirst) {
  const ctx   = contexts.find(c => c.id === task.context)
  const subj  = subjects?.find(s => s.id === task.subjectId)
  const color = subj?.color || ctx?.color || '#888780'
  return `
    <div class="picker-row ${isFirst ? 'selected' : ''}" data-id="${task.id}">
      <span class="ctx-dot" style="background:${color}"></span>
      <div class="picker-content">
        <p class="picker-title">${esc(task.title)}</p>
        <p class="picker-meta">
          ${ctx?.label || task.context}
          ${subj ? ' · ' + (subj.icon || '') + subj.name : ''}
          ${task.estimatedMins ? ' · est. ' + fmtMins(task.estimatedMins) : ''}
        </p>
      </div>
      <span class="picker-check">✓</span>
    </div>
  `
}

function calcBlockedTime(blocks) {
  return (blocks.reduce((s, b) => s + (b.durationMins || 50), 0) / 60).toFixed(1)
}

function hourLabel(h) {
  if (h === 0) return '12am'
  if (h < 12)  return `${h}am`
  if (h === 12) return '12pm'
  return `${h - 12}pm`
}
