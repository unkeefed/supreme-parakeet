import { db, getSettings, updateSettings, getSubjects, addSubject, updateSubject, deleteSubject, getRecurringSessions, addRecurringSession, updateRecurringSession, deleteRecurringSession, getSessionsForRange, getFocusMinutesForDate } from '../db/index.js'
import { todayStr, esc } from '../utils/index.js'

export async function renderSettings(container) {
  const settings = await getSettings()
  let draft      = structuredClone(settings)
  let activePanel = 'session'
  let saveTimer   = null

  container.innerHTML = `
    <div class="view-header">
      <h1 class="view-title">Settings</h1>
      <button class="btn-save" id="save-btn">Save</button>
    </div>
    <div class="settings-layout">
      <nav class="settings-nav" id="settings-nav">
        ${navItem('session',  'Session',  timerIcon())}
        ${navItem('subjects',   'Subjects',  subjectIcon())}
        ${navItem('recurring',  'Recurring', recurIcon())}
        ${navItem('contexts', 'Contexts', ctxIcon())}
        ${navItem('alerts',   'Alerts',   bellIcon())}
        ${navItem('sync',     'Sync',     syncIcon())}
        ${navItem('ai',       'AI',       aiIcon())}
      </nav>
      <div class="settings-content" id="settings-content"></div>
    </div>
  `

  async function renderPanel() {
    const content = container.querySelector('#settings-content')
    const panels  = {
      session:  sessionPanel,
      subjects: subjectsPanel,
      contexts: contextsPanel,
      alerts:   alertsPanel,
      sync:     syncPanel,
      ai:       aiPanel,
    }
    await panels[activePanel]?.(content, draft)
  }

  container.querySelector('#settings-nav').addEventListener('click', async e => {
    const btn = e.target.closest('.settings-nav-item')
    if (!btn) return
    container.querySelectorAll('.settings-nav-item').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    activePanel = btn.dataset.panel
    await renderPanel()
  })

  container.querySelector('#save-btn').addEventListener('click', async () => {
    await updateSettings(draft)
    const btn = container.querySelector('#save-btn')
    btn.textContent = 'Saved ✓'
    btn.style.background = 'var(--teal)'
    setTimeout(() => { btn.textContent = 'Save'; btn.style.background = '' }, 2000)
  })

  await renderPanel()
}

// ─── SESSION PANEL ─────────────────────────────────────────────────────────

function sessionPanel(el, draft) {
  el.innerHTML = `
    <div class="settings-section">
      <p class="settings-section-title">Pomodoro timer</p>
      <div class="card">
        ${numRow('Default session',   'defaultDuration', draft.defaultDuration, 'min',     25, 120, 5)}
        ${numRow('Short break',       'breakLength',     draft.breakLength,     'min',      5,  30, 5)}
        ${numRow('Long break after',  'longBreakAfter',  draft.longBreakAfter,  'sessions', 2,   8, 1)}
        ${numRow('Long break length', 'longBreakLength', draft.longBreakLength, 'min',     15,  60, 5)}
      </div>
    </div>

    <div class="settings-section">
      <p class="settings-section-title">Behaviour</p>
      <div class="card">
        ${toggleRow('Show countdown ring',    'showCountdownRing',    draft.showCountdownRing,    'SVG ring around the timer')}
        ${toggleRow('Auto-start break',       'autoStartBreak',       draft.autoStartBreak,       'Break starts immediately after session')}
        ${toggleRow('Auto-start next session','autoStartNextSession', draft.autoStartNextSession, 'Skip setup between sessions')}
      </div>
    </div>

    <div class="settings-section">
      <p class="settings-section-title">Daily target</p>
      <div class="card">
        ${numRow('Daily focus goal', 'dailyGoalHours', draft.dailyGoalHours, 'hours', 1, 16, 0.5)}
        <div class="setting-row">
          <div><p class="setting-label">Active days</p><p class="setting-hint">Counts toward streak</p></div>
          <div class="day-grid" id="day-grid">
            ${['S','M','T','W','T','F','S'].map((d, i) => `
              <button class="day-btn ${draft.activeDays.includes(i) ? 'active' : ''}"
                data-day="${i}">${d}</button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <p class="settings-section-title">Appearance</p>
      <div class="card">
        <div class="setting-row">
          <div><p class="setting-label">Theme</p><p class="setting-hint">Changes app colour scheme</p></div>
          <div class="seg-row" id="theme-seg" style="margin:0;gap:6px">
            ${['dark','light','system'].map(t => `
              <button class="seg-btn ${(draft.theme||'dark') === t ? 'seg-active' : ''}"
                data-theme="${t}">${t.charAt(0).toUpperCase()+t.slice(1)}</button>
            `).join('')}
          </div>
        </div>
        <div class="setting-row" style="border-top:0.5px solid var(--border)">
          <p class="setting-label">Accent colour</p>
          <div class="accent-swatches" id="accent-swatches">
            ${['#7F77DD','#1D9E75','#D85A30','#D4537E','#378ADD','#BA7517'].map(c => `
              <button class="accent-swatch ${draft.accentColor === c ? 'selected' : ''}"
                data-color="${c}" style="background:${c}"></button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <p class="settings-section-title">Streak protection</p>
      <div class="card">
        ${toggleRow('Streak freeze', 'streakFreezeEnabled', draft.streakFreezeEnabled, 'Allow a grace period before your streak resets')}
        <div class="setting-row ${draft.streakFreezeEnabled ? '' : 'setting-row--disabled'}" id="grace-row">
          <div><p class="setting-label">Grace days</p><p class="setting-hint">Missed active days before streak breaks</p></div>
          <div style="display:flex;align-items:center;gap:6px">
            <input type="number" class="num-input" data-field="streakGraceDays"
              value="${draft.streakGraceDays ?? 1}" min="1" max="3" step="1"
              ${draft.streakFreezeEnabled ? '' : 'disabled'}>
            <span class="field-unit">day${(draft.streakGraceDays ?? 1) !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  \`
  wireInputs(el, draft)

  el.querySelector('#day-grid').addEventListener('click', e => {
    const btn = e.target.closest('.day-btn')
    if (!btn) return
    const day = +btn.dataset.day
    if (draft.activeDays.includes(day)) {
      draft.activeDays = draft.activeDays.filter(d => d !== day)
    } else {
      draft.activeDays = [...draft.activeDays, day].sort((a, b) => a - b)
    }
    btn.classList.toggle('active', draft.activeDays.includes(day))
  })

  // Streak freeze toggle → enable/disable grace-days input
  el.querySelector('[data-field="streakFreezeEnabled"]')?.addEventListener('change', e => {
    const graceRow   = el.querySelector('#grace-row')
    const graceInput = el.querySelector('[data-field="streakGraceDays"]')
    if (graceRow)   graceRow.classList.toggle('setting-row--disabled', !e.target.checked)
    if (graceInput) graceInput.disabled = !e.target.checked
  })

  el.querySelector('#theme-seg').addEventListener('click', e => {
    const btn = e.target.closest('.seg-btn')
    if (!btn) return
    draft.theme = btn.dataset.theme
    el.querySelectorAll('#theme-seg .seg-btn').forEach(b => b.classList.remove('seg-active'))
    btn.classList.add('seg-active')
    applyTheme(draft.theme)
  })

  el.querySelector('#accent-swatches').addEventListener('click', e => {
    const btn = e.target.closest('.accent-swatch')
    if (!btn) return
    draft.accentColor = btn.dataset.color
    el.querySelectorAll('.accent-swatch').forEach(b => b.classList.remove('selected'))
    btn.classList.add('selected')
    document.documentElement.style.setProperty('--accent', draft.accentColor)
  })
}

// ─── SUBJECTS PANEL ────────────────────────────────────────────────────────

const SUBJECT_ICONS = ['📚','∑','⚙','⚡','🗺','🔬','🧮','📐','🌍','📊','🧪','💡','🏗','📝','🎯','⚖','🔭','🖥']

async function subjectsPanel(el, draft) {
  async function refresh() {
    const subjects = await getSubjects()
    el.innerHTML = `
      <div class="settings-section">
        <p class="settings-section-title">Study subjects</p>
        <p class="settings-hint-text">Subjects drive the focus timer, daily goals, and streaks. Tasks can optionally be linked to a subject.</p>
        <div class="card" id="subj-card">
          ${subjects.length === 0 ? `<p class="settings-hint-text" style="padding:12px 0">No subjects yet — add one below.</p>` : ''}
          ${subjects.map(s => `
            <div class="subj-row" data-id="${s.id}">
              <button class="subj-icon-btn" data-id="${s.id}" style="background:${s.color}22;color:${s.color};border:1px solid ${s.color}44">
                ${esc(s.icon || '📚')}
              </button>
              <div class="subj-row-body">
                <input class="subj-name-input" value="${esc(s.name)}" data-id="${s.id}" maxlength="40" placeholder="Subject name">
                <div class="subj-row-meta">
                  <input type="color" class="subj-color-input ctx-color-input" value="${s.color}" data-id="${s.id}" title="Colour">
                  <span class="subj-goal-label">Goal:</span>
                  <input type="number" class="subj-goal-input num-input" value="${s.dailyGoalMins}" min="5" max="480" step="5" data-id="${s.id}">
                  <span class="subj-goal-unit">min/day</span>
                </div>
              </div>
              <button class="ctx-remove-btn subj-delete-btn" data-id="${s.id}" title="Delete subject">×</button>
            </div>
          `).join('')}
        </div>
        <button class="btn-ghost full-width-ghost" id="add-subj">+ Add subject</button>
      </div>
    `
    wireSubjectInputs()

    el.querySelector('#add-subj').addEventListener('click', async () => {
      await addSubject({ name: 'New subject', color: '#7F77DD', icon: '📚', dailyGoalMins: 60 })
      await refresh()
    })
  }

  function wireSubjectInputs() {
    el.querySelectorAll('.subj-name-input').forEach(inp => {
      inp.addEventListener('input', async e => {
        await updateSubject(+e.target.dataset.id, { name: e.target.value })
      })
    })
    el.querySelectorAll('.subj-color-input').forEach(inp => {
      inp.addEventListener('input', async e => {
        const id = +e.target.dataset.id
        await updateSubject(id, { color: e.target.value })
        // Update icon button colour live
        const row = el.querySelector(`.subj-row[data-id="${id}"]`)
        const iconBtn = row?.querySelector('.subj-icon-btn')
        if (iconBtn) {
          iconBtn.style.background = e.target.value + '22'
          iconBtn.style.color      = e.target.value
          iconBtn.style.border     = `1px solid ${e.target.value}44`
        }
      })
    })
    el.querySelectorAll('.subj-goal-input').forEach(inp => {
      inp.addEventListener('input', async e => {
        await updateSubject(+e.target.dataset.id, { dailyGoalMins: +e.target.value })
      })
    })
    el.querySelectorAll('.subj-icon-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = +btn.dataset.id
        showIconPicker(el, id, btn, refresh)
      })
    })
    el.querySelectorAll('.subj-delete-btn').forEach(btn => {
      btn.addEventListener('click', async e => {
        const id = +btn.dataset.id
        if (confirm('Delete this subject? Sessions already logged will keep their data.')) {
          await deleteSubject(id)
          await refresh()
        }
      })
    })
  }

  await refresh()
}

function showIconPicker(el, subjectId, anchorBtn, onPick) {
  // Remove any existing picker
  el.querySelector('.icon-picker')?.remove()

  const picker = document.createElement('div')
  picker.className = 'icon-picker'
  picker.innerHTML = SUBJECT_ICONS.map(icon => `
    <button class="icon-picker-btn" data-icon="${icon}">${icon}</button>
  `).join('')

  // Position near anchor
  const rect = anchorBtn.getBoundingClientRect()
  picker.style.position = 'fixed'
  picker.style.top  = (rect.bottom + 6) + 'px'
  picker.style.left = rect.left + 'px'
  picker.style.zIndex = '500'

  document.body.appendChild(picker)

  picker.addEventListener('click', async e => {
    const btn = e.target.closest('.icon-picker-btn')
    if (!btn) return
    await updateSubject(subjectId, { icon: btn.dataset.icon })
    anchorBtn.textContent = btn.dataset.icon
    picker.remove()
  })

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', function close(e) {
      if (!picker.contains(e.target) && e.target !== anchorBtn) {
        picker.remove()
        document.removeEventListener('click', close)
      }
    })
  }, 50)
}

// ─── CONTEXTS PANEL ────────────────────────────────────────────────────────

function contextsPanel(el, draft) {
  function refresh() {
    el.innerHTML = `
      <div class="settings-section">
        <p class="settings-section-title">Task contexts</p>
        <p class="settings-hint-text">Contexts colour-code tasks in the Inbox. Mark a context as "Study" to enable the subject picker on tasks with that context.</p>
        <div class="card" id="ctx-card">
          ${draft.contexts.map((c, i) => `
            <div class="ctx-edit-row" data-i="${i}">
              <input class="ctx-color-input" type="color" value="${c.color}" data-i="${i}" title="Colour">
              <input class="ctx-label-input" value="${esc(c.label)}" data-i="${i}" maxlength="20" placeholder="Label">
              <label class="ctx-study-toggle" title="Study context — shows subject picker on tasks">
                <input type="checkbox" class="ctx-is-study" data-i="${i}" ${c.isStudy ? 'checked' : ''}>
                <span class="ctx-study-label">Study</span>
              </label>
              <button class="ctx-remove-btn" data-i="${i}">×</button>
            </div>
          `).join('')}
        </div>
        <button class="btn-ghost full-width-ghost" id="add-ctx">+ Add context</button>
      </div>
    `
    wireCtxInputs()

    el.querySelector('#add-ctx').addEventListener('click', () => {
      draft.contexts.push({ id: 'ctx_' + Date.now(), label: 'New context', color: '#7F77DD', isStudy: false })
      refresh()
    })
  }

  function wireCtxInputs() {
    el.querySelectorAll('.ctx-color-input').forEach(inp => {
      inp.addEventListener('input', e => { draft.contexts[+e.target.dataset.i].color = e.target.value })
    })
    el.querySelectorAll('.ctx-label-input').forEach(inp => {
      inp.addEventListener('input', e => { draft.contexts[+e.target.dataset.i].label = e.target.value })
    })
    el.querySelectorAll('.ctx-is-study').forEach(inp => {
      inp.addEventListener('change', e => { draft.contexts[+e.target.dataset.i].isStudy = inp.checked })
    })
    el.querySelectorAll('.ctx-remove-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        draft.contexts.splice(+e.currentTarget.dataset.i, 1)
        refresh()
      })
    })
  }

  refresh()
}

// ─── ALERTS PANEL ──────────────────────────────────────────────────────────

function alertsPanel(el, draft) {
  el.innerHTML = `
    <div class="settings-section">
      <p class="settings-section-title">Notifications</p>
      <div class="card">
        ${toggleRow('Session end sound',     'sessionEndSound',       draft.sessionEndSound,       'Plays when timer hits zero')}
        ${toggleRow('Break end reminder',    'breakEndReminder',      draft.breakEndReminder,      'Nudge when break time is up')}
        ${toggleRow('Daily goal reached',    'dailyGoalAlert',        draft.dailyGoalAlert,        'Celebrate hitting your target')}
        ${toggleRow('Morning planning nudge','morningReminderEnabled',draft.morningReminderEnabled,'Reminds you to plan your day')}
        <div class="setting-row">
          <div><p class="setting-label">Reminder time</p></div>
          <input type="time" class="time-input" data-field="morningReminderTime"
            value="${draft.morningReminderTime}">
        </div>
      </div>
    </div>
  `
  wireInputs(el, draft)
}

// ─── SYNC PANEL ────────────────────────────────────────────────────────────

function syncPanel(el, draft) {
  const syncState  = window._apexSyncStatus || { status: 'idle', pending: 0 }
  const statusMsgs = {
    idle:    { text: 'Not started yet',  cls: '' },
    syncing: { text: 'Syncing…',         cls: 'sync-badge--syncing' },
    synced:  { text: 'Synced just now',  cls: 'sync-badge--ok' },
    offline: { text: `Offline — ${syncState.pending} change${syncState.pending !== 1 ? 's' : ''} pending`, cls: 'sync-badge--offline' },
    error:   { text: `Sync error — ${syncState.pending} queued`, cls: 'sync-badge--error' },
  }
  const sm = statusMsgs[syncState.status] || statusMsgs.idle

  el.innerHTML = `
    <div class="settings-section">
      <p class="settings-section-title">Cloud sync</p>
      <p class="settings-hint-text">All subjects, tasks, sessions, and planned sessions are automatically synced to Supabase whenever you're online. Offline changes are queued and uploaded on reconnect.</p>
      <div class="card">
        <div class="setting-row">
          <div>
            <p class="setting-label">Status</p>
            <p class="setting-hint">Updates in real time</p>
          </div>
          <span class="sync-status-badge ${sm.cls}" id="sync-status-badge">${sm.text}</span>
        </div>
        <div class="setting-row" style="border-top:0.5px solid var(--border)">
          <p class="setting-label">Last synced</p>
          <span id="last-sync-time" class="setting-hint" style="color:var(--text-muted)">Loading…</span>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <p class="settings-section-title">Life dashboard modules</p>
      <p class="settings-hint-text">Apex Focus also writes to a shared IndexedDB for your local dashboard.</p>
      <div class="card">
        ${toggleRow('Study module',  'syncStudy',  draft.syncStudy,  'Auto-log focus hours as study time')}
        ${toggleRow('Habits module', 'syncHabits', draft.syncHabits, 'Auto-check "deep work" habit on goal')}
        ${toggleRow('Goals module',  'syncGoals',  draft.syncGoals,  'Update goal progress from sessions')}
        ${toggleRow('Mood module',   'syncMood',   draft.syncMood,   'Attach session quality to mood entries')}
      </div>
    </div>
  `
  wireInputs(el, draft)

  // Load last sync time
  import('../sync.js').then(async ({ getLastSyncTime }) => {
    const t  = await getLastSyncTime()
    const el2 = el.querySelector('#last-sync-time')
    if (!el2) return
    el2.textContent = t
      ? new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })
      : 'Never'
  }).catch(() => {})
}

async function loadSyncStats(el, draft) {
  const el2 = el.querySelector('#sync-stats')
  if (!el2) return
  const todayMins    = await getFocusMinutesForDate(todayStr())
  const { fromStr }  = weekRange()
  const weekSessions = await getSessionsForRange(fromStr, todayStr())
  const weekMins     = weekSessions.reduce((s, x) => s + (x.durationMins || 0), 0)
  const lastSync     = await db.settings.get('lastSync')
  el2.innerHTML = `
    <div class="sync-row"><span class="sync-key">Today's focus</span><span class="sync-val">${(todayMins/60).toFixed(1)}h</span></div>
    <div class="sync-row"><span class="sync-key">This week</span><span class="sync-val">${(weekMins/60).toFixed(1)}h · ${weekSessions.length} sessions</span></div>
    <div class="sync-row"><span class="sync-key">Last sync</span><span class="sync-val">${lastSync?.value ? new Date(lastSync.value).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' }) : 'Never'}</span></div>
  `
}

async function runSync(settings) {
  const todayMins    = await getFocusMinutesForDate(todayStr())
  const { fromStr }  = weekRange()
  const weekSessions = await getSessionsForRange(fromStr, todayStr())
  const weekMins     = weekSessions.reduce((s, x) => s + (x.durationMins || 0), 0)
  const goalReached  = todayMins >= settings.dailyGoalHours * 60
  await db.settings.put({
    key: 'apexFocusSync',
    value: JSON.stringify({ syncedAt: Date.now(), todayMins, weekMins, weekSessions: weekSessions.length, goalReached,
      syncStudy: settings.syncStudy, syncHabits: settings.syncHabits, syncGoals: settings.syncGoals, syncMood: settings.syncMood })
  })
  await db.settings.put({ key: 'lastSync', value: Date.now() })
}

// ─── AI PANEL ──────────────────────────────────────────────────────────────

function aiPanel(el, draft) {
  el.innerHTML = `
    <div class="settings-section">
      <p class="settings-section-title">Features</p>
      <div class="card">
        ${toggleRow('Morning prioritisation', 'aiMorningPrioritisation', draft.aiMorningPrioritisation, 'Top 3 task suggestions each morning')}
        ${toggleRow('Weekly review summary',  'aiWeeklyReview',          draft.aiWeeklyReview,          'AI insight chips on Insights tab')}
        ${toggleRow('Distraction alerts',     'aiDistractionAlerts',     draft.aiDistractionAlerts,     'Tips when distraction rate spikes')}
        ${toggleRow('Smart rescheduling',     'aiSmartRescheduling',     draft.aiSmartRescheduling,     'Suggests replanning when sessions run late')}
      </div>
    </div>
    <div class="settings-section">
      <p class="settings-section-title">Provider</p>
      <div class="card">
        <div class="setting-row">
          <p class="setting-label">Model</p>
          <div class="seg-row" style="margin:0;gap:6px">
            <button class="seg-btn ${draft.aiProvider==='gemini'?'seg-active':''}" id="prov-gemini" data-val="gemini">Gemini</button>
            <button class="seg-btn ${draft.aiProvider==='openai'?'seg-active':''}" id="prov-openai" data-val="openai">OpenAI</button>
          </div>
        </div>
        <div class="setting-row">
          <p class="setting-label">API key</p>
          <input type="password" class="api-key-input" data-field="aiApiKey"
            value="${draft.aiApiKey}" placeholder="Paste key here…">
        </div>
        <div class="setting-row" style="border:none;padding-top:4px">
          <span id="key-status" class="key-status"></span>
          <button class="link-btn" id="test-key">Test connection</button>
        </div>
      </div>
    </div>
    <p class="settings-hint-text" style="margin-top:4px">
      Uses Gemini 2.5 Flash on the free tier — no credit card needed.
      <br>Get a key at <strong>aistudio.google.com</strong>.
    </p>
  `
  wireInputs(el, draft)

  el.querySelectorAll('#prov-gemini, #prov-openai').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('#prov-gemini, #prov-openai').forEach(b => b.classList.remove('seg-active'))
      btn.classList.add('seg-active')
      draft.aiProvider = btn.dataset.val
    })
  })

  el.querySelector('#test-key').addEventListener('click', async () => {
    const status = el.querySelector('#key-status')
    if (!draft.aiApiKey) { status.textContent = 'No API key set.'; status.className = 'key-status fail'; return }
    status.textContent = 'Testing…'; status.className = 'key-status'
    const { callGemini } = await import('../utils/index.js')
    const res = await callGemini('Reply with only the word "ok".', draft.aiApiKey)
    if (res && res.toLowerCase().includes('ok')) {
      status.textContent = 'Connected ✓'; status.className = 'key-status ok'
    } else {
      status.textContent = 'Connection failed. Check your key.'; status.className = 'key-status fail'
    }
  })
}

// ─── RECURRING PANEL ──────────────────────────────────────────────────────

async function recurringPanel(el, draft) {
  async function refresh() {
    const [rules, subjects, allTasks] = await Promise.all([
      getRecurringSessions(),
      getSubjects(),
      db.tasks.toArray(),
    ])
    const activeTasks = allTasks.filter(t => !t.completedAt)

    el.innerHTML = `
      <div class="settings-section">
        <p class="settings-section-title">Recurring study sessions</p>
        <p class="settings-hint-text">These sessions auto-populate your calendar each week. Toggle them on/off without deleting.</p>
        <div class="card" id="recur-list">
          ${rules.length === 0
            ? `<p class="settings-hint-text" style="padding:8px 0">No recurring sessions yet.</p>`
            : rules.map(r => {
                const subj   = subjects.find(s => s.id === r.subjectId)
                const task   = r.taskId ? activeTasks.find(t => t.id === r.taskId) : null
                const days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
                const dayStr = (r.days || []).map(d => days[d]).join(', ')
                return \`
                  <div class="recur-row">
                    <div class="recur-row-left">
                      <label class="toggle recur-toggle">
                        <input type="checkbox" class="recur-active-toggle" data-id="\${r.id}" \${r.active ? 'checked' : ''}>
                        <span class="toggle-track"></span>
                        <span class="toggle-thumb"></span>
                      </label>
                    </div>
                    <div class="recur-row-body">
                      <p class="recur-title">
                        <span style="color:\${subj?.color || 'var(--accent)'}">
                          \${subj?.icon ? subj.icon + ' ' : ''}\${subj?.name || 'Unknown subject'}
                        </span>
                        \${task ? \` · \${task.title}\` : ''}
                      </p>
                      <p class="recur-meta">\${dayStr || 'No days set'} · \${r.startTime || '—'} · \${r.durationMins}m</p>
                    </div>
                    <button class="ctx-remove-btn recur-delete" data-id="\${r.id}">×</button>
                  </div>
                \`
              }).join('')
          }
        </div>
        <button class="btn-ghost full-width-ghost" id="add-recur">+ Add recurring session</button>
      </div>
    \`

    // Wire toggles
    el.querySelectorAll('.recur-active-toggle').forEach(inp => {
      inp.addEventListener('change', async e => {
        await updateRecurringSession(+e.target.dataset.id, { active: e.target.checked })
      })
    })

    // Wire deletes
    el.querySelectorAll('.recur-delete').forEach(btn => {
      btn.addEventListener('click', async e => {
        await deleteRecurringSession(+btn.dataset.id)
        await refresh()
      })
    })

    // Add button
    el.querySelector('#add-recur')?.addEventListener('click', () => {
      openAddRecurringModal(subjects, activeTasks, refresh)
    })
  }

  await refresh()
}

function openAddRecurringModal(subjects, tasks, onSave) {
  const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'
  overlay.innerHTML = \`
    <div class="modal-card detail-modal">
      <div class="modal-drag-bar"></div>
      <div class="modal-header">
        <p style="font-size:15px;font-weight:500;color:var(--text-primary);margin:0">Recurring session</p>
        <button class="modal-close-btn" id="recur-close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <label class="modal-field-label">Subject</label>
        <div class="seg-row" id="rs-subj" style="flex-wrap:wrap;margin-bottom:14px">
          \${subjects.map((s, i) => \`
            <button class="seg-btn \${i === 0 ? 'seg-ctx-active' : ''}" data-id="\${s.id}" data-color="\${s.color}"
              style="\${i === 0 ? \`background:\${s.color}22;border-color:\${s.color};color:\${s.color}\` : ''}">
              \${s.icon ? s.icon + ' ' : ''}\${esc(s.name)}
            </button>
          \`).join('')}
        </div>

        <label class="modal-field-label">Linked task <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--text-muted)">(optional)</span></label>
        <select class="sort-select" id="rs-task" style="width:100%;padding:8px;margin-bottom:14px;font-size:13px">
          <option value="">No task linked</option>
          \${tasks.map(t => \`<option value="\${t.id}">\${esc(t.title)}</option>\`).join('')}
        </select>

        <label class="modal-field-label">Repeat on</label>
        <div class="day-grid" id="rs-days" style="margin-bottom:14px">
          \${DAY_LABELS.map((d, i) => \`<button class="day-btn" data-day="\${i}">\${d.slice(0,1)}</button>\`).join('')}
        </div>

        <div class="modal-row-2">
          <div>
            <label class="modal-field-label">Start time</label>
            <input type="time" class="time-input" id="rs-time" value="09:00">
          </div>
          <div>
            <label class="modal-field-label">Duration</label>
            <div class="seg-row" id="rs-dur" style="margin:0;gap:4px">
              <button class="seg-btn" data-mins="25">25m</button>
              <button class="seg-btn seg-active" data-mins="50">50m</button>
              <button class="seg-btn" data-mins="90">90m</button>
            </div>
          </div>
        </div>

        <label class="modal-field-label" style="margin-top:12px">Notes</label>
        <textarea class="detail-notes" id="rs-notes" rows="2" placeholder="e.g. Finish lab report…"></textarea>
      </div>
      <div class="modal-footer">
        <button class="btn-ghost" id="rs-cancel">Cancel</button>
        <button class="btn-primary" id="rs-save">Save</button>
      </div>
    </div>
  \`
  document.body.appendChild(overlay)
  requestAnimationFrame(() => overlay.querySelector('.detail-modal').classList.add('modal-open'))

  let selectedSubject = subjects[0]?.id || null
  let selectedDays    = []
  let selectedMins    = 50

  overlay.querySelectorAll('#rs-subj .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.querySelectorAll('#rs-subj .seg-btn').forEach(b => { b.classList.remove('seg-ctx-active'); b.style.cssText = '' })
      btn.classList.add('seg-ctx-active')
      const c = btn.dataset.color
      btn.style.background = c + '22'; btn.style.borderColor = c; btn.style.color = c
      selectedSubject = +btn.dataset.id
    })
  })

  overlay.querySelectorAll('#rs-days .day-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const d = +btn.dataset.day
      if (selectedDays.includes(d)) {
        selectedDays = selectedDays.filter(x => x !== d)
        btn.classList.remove('active')
      } else {
        selectedDays.push(d)
        btn.classList.add('active')
      }
    })
  })

  overlay.querySelectorAll('#rs-dur .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.querySelectorAll('#rs-dur .seg-btn').forEach(b => b.classList.remove('seg-active'))
      btn.classList.add('seg-active')
      selectedMins = +btn.dataset.mins
    })
  })

  const close = () => {
    overlay.querySelector('.detail-modal').classList.remove('modal-open')
    setTimeout(() => overlay.remove(), 250)
  }
  overlay.querySelector('#recur-close').addEventListener('click', close)
  overlay.querySelector('#rs-cancel').addEventListener('click', close)
  overlay.addEventListener('click', e => { if (e.target === overlay) close() })

  overlay.querySelector('#rs-save').addEventListener('click', async () => {
    if (!selectedSubject || selectedDays.length === 0) return
    const taskId = overlay.querySelector('#rs-task').value
    await addRecurringSession({
      subjectId:    selectedSubject,
      taskId:       taskId ? +taskId : null,
      days:         selectedDays.sort(),
      startTime:    overlay.querySelector('#rs-time').value,
      durationMins: selectedMins,
      notes:        overlay.querySelector('#rs-notes').value.trim(),
    })
    close()
    if (onSave) onSave()
  })
}

// ─── Theme helper (called live when toggling) ──────────────────────────────

export function applyTheme(theme) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const useDark = theme === 'dark' || (theme === 'system' && prefersDark)
  document.documentElement.setAttribute('data-theme', useDark ? 'dark' : 'light')
}

// ─── Shared helpers ────────────────────────────────────────────────────────

function wireInputs(el, draft) {
  el.querySelectorAll('[data-field]').forEach(inp => {
    const field = inp.dataset.field
    if (inp.type === 'checkbox') {
      inp.addEventListener('change', () => { draft[field] = inp.checked })
    } else if (inp.type === 'number') {
      inp.addEventListener('input', () => { draft[field] = +inp.value })
    } else {
      inp.addEventListener('input', () => { draft[field] = inp.value })
    }
  })
}

function toggleRow(label, field, value, hint = '') {
  return `
    <div class="setting-row">
      <div>
        <p class="setting-label">${label}</p>
        ${hint ? `<p class="setting-hint">${hint}</p>` : ''}
      </div>
      <label class="toggle">
        <input type="checkbox" data-field="${field}" ${value ? 'checked' : ''}>
        <span class="toggle-track"></span>
        <span class="toggle-thumb"></span>
      </label>
    </div>`
}

function numRow(label, field, value, unit, min, max, step) {
  return `
    <div class="setting-row">
      <p class="setting-label">${label}</p>
      <div style="display:flex;align-items:center;gap:6px">
        <input type="number" class="num-input" data-field="${field}"
          value="${value}" min="${min}" max="${max}" step="${step}">
        <span class="field-unit">${unit}</span>
      </div>
    </div>`
}

function navItem(panel, label, icon) {
  return `
    <button class="settings-nav-item ${panel === 'session' ? 'active' : ''}" data-panel="${panel}">
      ${icon}<span>${label}</span>
    </button>`
}

function weekRange() {
  const today  = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  return { fromStr: monday.toISOString().slice(0, 10), toStr: today.toISOString().slice(0, 10), monday }
}

// ─── Icons ─────────────────────────────────────────────────────────────────
const i = (d) => `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`
const timerIcon   = () => i('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>')
const subjectIcon = () => i('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>')
const ctxIcon     = () => i('<circle cx="6" cy="6" r="2"/><circle cx="14" cy="10" r="2"/><path d="M8 6h4M8 10H4"/>')
const bellIcon    = () => i('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>')
const syncIcon    = () => i('<path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>')
const aiIcon      = () => i('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M8 10h.01M12 10h.01M16 10h.01M8 14h8"/>') 
const recurIcon   = () => i('<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>')
