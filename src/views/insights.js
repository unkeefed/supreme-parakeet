import { db, getSettings, getSubjects, getSessionsForRange, getSessionsForDate, getStreak, getSubjectStreak, getFocusMinutesForDate, getSubjectMinutesForRange } from '../db/index.js'
import { todayStr, fmtMins, fmtHours, hourLabel, esc, callGemini, buildWeeklySummaryPrompt } from '../utils/index.js'

let chartInstances = []

export async function renderInsights(container) {
  const [settings, subjects] = await Promise.all([getSettings(), getSubjects()])

  container.innerHTML = `
    <div class="view-header">
      <div>
        <h1 class="view-title">Insights</h1>
        <p class="view-sub" id="period-label"></p>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <button class="btn-accent" id="open-review">Review</button>
        <div class="seg-row" style="margin:0;gap:4px">
          <button class="seg-btn seg-active" id="btn-week" data-view="week">Week</button>
          <button class="seg-btn"            id="btn-day"  data-view="day">Day</button>
        </div>
      </div>
    </div>
    <div id="insights-body"></div>
  `

  let view = 'week'

  async function render() {
    destroyCharts()
    container.querySelector('#btn-week').classList.toggle('seg-active', view === 'week')
    container.querySelector('#btn-day').classList.toggle('seg-active', view === 'day')
    if (view === 'week') await renderWeek(settings, subjects)
    else                 await renderDay(settings, subjects)
  }

  container.querySelector('#btn-week').addEventListener('click', () => { view = 'week'; render() })
  container.querySelector('#btn-day').addEventListener('click',  () => { view = 'day';  render() })
  container.querySelector('#open-review').addEventListener('click', () => {
    import('../router.js').then(m => m.navigateTo('review'))
  })
  render()
}

// ─── WEEK VIEW ─────────────────────────────────────────────────────────────

async function renderWeek(settings, subjects) {
  const { fromStr, toStr, monday, prevFromStr, prevToStr } = weekRanges()

  document.getElementById('period-label').textContent =
    'Week of ' + monday.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

  const [sessions, prevSessions, streak, allSessions] = await Promise.all([
    getSessionsForRange(fromStr, toStr),
    getSessionsForRange(prevFromStr, prevToStr),
    getStreak(settings.activeDays, settings.dailyGoalHours * 60, settings.streakFreezeEnabled ? (settings.streakGraceDays ?? 1) : 0),
    db.focus_sessions.toArray(),                      // for personal best
  ])

  const totalMins     = sessions.reduce((s, x) => s + (x.durationMins || 0), 0)
  const prevTotalMins = prevSessions.reduce((s, x) => s + (x.durationMins || 0), 0)

  // Focus rate (avg across sessions with distractions logged)
  const focusRates = sessions
    .filter(s => s.durationMins > 0)
    .map(s => Math.max(0, 100 - Math.round((s.distractions || 0) / s.durationMins * 100 * 0.5)))
  const avgFocusRate = focusRates.length
    ? Math.round(focusRates.reduce((a, b) => a + b, 0) / focusRates.length)
    : null
  const prevFocusRates = prevSessions
    .filter(s => s.durationMins > 0)
    .map(s => Math.max(0, 100 - Math.round((s.distractions || 0) / s.durationMins * 100 * 0.5)))
  const prevAvgFocusRate = prevFocusRates.length
    ? Math.round(prevFocusRates.reduce((a, b) => a + b, 0) / prevFocusRates.length)
    : null

  // Personal best session ever
  const bestSession = allSessions.length
    ? allSessions.reduce((best, s) => (s.durationMins || 0) > (best.durationMins || 0) ? s : best, allSessions[0])
    : null
  const isPersonalBestThisWeek = bestSession && sessions.some(s => s.id === bestSession.id)

  // Week-on-week change
  const weekChange = prevTotalMins > 0
    ? Math.round(((totalMins - prevTotalMins) / prevTotalMins) * 100)
    : null

  // Session count change
  const sessionCountChange = prevSessions.length > 0
    ? sessions.length - prevSessions.length
    : null

  // Hour buckets
  const hourBuckets = Array(24).fill(0)
  sessions.forEach(s => { hourBuckets[new Date(s.startedAt).getHours()] += s.durationMins || 0 })
  const bestHour    = hourBuckets.indexOf(Math.max(...hourBuckets.slice(6, 22)))
  const bestHourStr = hourBuckets[bestHour] > 0 ? hourLabel(bestHour) : '—'
  const prevHourBuckets = Array(24).fill(0)
  prevSessions.forEach(s => { prevHourBuckets[new Date(s.startedAt).getHours()] += s.durationMins || 0 })
  const prevBestHour = prevHourBuckets.indexOf(Math.max(...prevHourBuckets.slice(6, 22)))

  // Daily breakdown
  const dayMins = Array(7).fill(0)
  sessions.forEach(s => {
    const idx = (new Date(s.startedAt).getDay() + 6) % 7
    dayMins[idx] += s.durationMins || 0
  })

  // Subject breakdown this week
  const subjMinsMap = new Map()
  sessions.forEach(s => {
    if (!s.subjectId) return
    subjMinsMap.set(s.subjectId, (subjMinsMap.get(s.subjectId) || 0) + (s.durationMins || 0))
  })
  const prevSubjMinsMap = new Map()
  prevSessions.forEach(s => {
    if (!s.subjectId) return
    prevSubjMinsMap.set(s.subjectId, (prevSubjMinsMap.get(s.subjectId) || 0) + (s.durationMins || 0))
  })

  // Context breakdown
  const ctxMins = {}
  sessions.forEach(s => { const k = s.context || 'other'; ctxMins[k] = (ctxMins[k] || 0) + (s.durationMins || 0) })
  const totalCtxMins = Math.max(1, Object.values(ctxMins).reduce((a, b) => a + b, 0))

  // Streak per subject
  const graceDays  = settings.streakFreezeEnabled ? (settings.streakGraceDays ?? 1) : 0
  const subjStreaks = await Promise.all(subjects.map(async s => {
    const { current, best } = await getSubjectStreak(s.id, s.dailyGoalMins, settings.activeDays, graceDays)
    return { ...s, current, best }
  }))

  const body = document.getElementById('insights-body')
  body.innerHTML = `

    <div class="metric-grid">
      ${metric(
        'Focus hours', fmtHours(totalMins),
        weekChange !== null
          ? weekChange > 0
            ? `↑ ${weekChange}% from last week`
            : weekChange < 0
              ? `↓ ${Math.abs(weekChange)}% from last week`
              : 'Same as last week'
          : prevTotalMins === 0 ? 'No data last week' : '',
        weekChange !== null && weekChange > 0 ? 'positive' : weekChange !== null && weekChange < 0 ? 'negative' : ''
      )}
      ${metric(
        'Sessions', sessions.length,
        sessionCountChange !== null
          ? sessionCountChange > 0
            ? `${sessionCountChange} more than last week`
            : sessionCountChange < 0
              ? `${Math.abs(sessionCountChange)} fewer than last week`
              : 'Same as last week'
          : '',
        sessionCountChange > 0 ? 'positive' : sessionCountChange < 0 ? 'negative' : ''
      )}
      ${metric(
        'Focus rate',
        avgFocusRate !== null ? avgFocusRate + '%' : '—',
        avgFocusRate !== null && prevAvgFocusRate !== null
          ? avgFocusRate > prevAvgFocusRate
            ? `↑ up from ${prevAvgFocusRate}% last week`
            : avgFocusRate < prevAvgFocusRate
              ? `↓ down from ${prevAvgFocusRate}% last week`
              : 'Same as last week'
          : avgFocusRate !== null ? 'Based on distractions logged' : 'Log sessions to see',
        avgFocusRate !== null && prevAvgFocusRate !== null && avgFocusRate > prevAvgFocusRate ? 'positive' : ''
      )}
      ${metric(
        'Streak', streak + ' day' + (streak !== 1 ? 's' : ''),
        streak >= 7 ? '🔥 On fire — keep going' :
        streak >= 3 ? 'Building momentum' :
        streak === 0 ? 'Start a session to begin' :
        streak + ' day' + (streak !== 1 ? 's' : '') + ' in a row',
        streak >= 3 ? 'positive' : ''
      )}
    </div>

    ${isPersonalBestThisWeek ? `
      <div class="comment-card comment-card--highlight">
        <span class="comment-card-icon">🏆</span>
        <div>
          <p class="comment-card-title">Personal best this week</p>
          <p class="comment-card-body">Your longest session ever — ${fmtMins(bestSession.durationMins)} — was logged this week.</p>
        </div>
      </div>
    ` : bestSession ? `
      <div class="comment-card">
        <span class="comment-card-icon">🏅</span>
        <div>
          <p class="comment-card-title">Personal best session</p>
          <p class="comment-card-body">${fmtMins(bestSession.durationMins)} on ${new Date(bestSession.startedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}. Beat it!</p>
        </div>
      </div>
    ` : ''}

    <div class="card">
      <p class="stage-label">Daily focus — hours</p>
      <div style="position:relative;height:140px">
        <canvas id="daily-chart"></canvas>
      </div>
    </div>

    ${subjects.length > 0 ? `
      <div class="card">
        <p class="stage-label">Goal breakdown by subject</p>
        <div id="subj-bars"></div>
      </div>

      <div class="card">
        <p class="stage-label">Subject streaks</p>
        <div id="streak-panel"></div>
      </div>
    ` : ''}

    <div class="two-col-grid">
      <div class="card" style="margin-bottom:0">
        <p class="stage-label">By context</p>
        <div id="goal-bars"></div>
      </div>
      <div class="card" style="margin-bottom:0">
        <p class="stage-label">Quality</p>
        <div style="position:relative;height:120px">
          <canvas id="quality-chart"></canvas>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:12px">
      <p class="stage-label">Peak focus hours</p>
      <p class="metric-helper" style="margin-bottom:8px">
        ${hourBuckets[bestHour] > 0
          ? `Most productive at ${bestHourStr}${prevBestHour && prevBestHour !== bestHour ? ` — shifted from ${hourLabel(prevBestHour)} last week` : ''}`
          : 'No sessions yet this week'
        }
      </p>
      <div class="heatmap" id="heatmap"></div>
      <div class="heatmap-labels">
        <span>6am</span><span>9am</span><span>12pm</span><span>3pm</span><span>6pm</span><span>9pm</span>
      </div>
    </div>

    <div class="card" id="ai-insights-card">
      <p class="stage-label" style="margin-bottom:10px">AI observations</p>
      <div id="ai-chips">
        ${sessions.length === 0
          ? `<p class="empty-hint">Complete sessions to see AI insights.</p>`
          : `<div class="ai-loading"><div class="ai-spinner"></div><span>Analysing your week…</span></div>`
        }
      </div>
    </div>

    ${sessions.length === 0 ? `
      <div class="empty-state" style="margin-top:20px">
        <div class="empty-icon">📊</div>
        <p class="empty-title">No sessions yet this week</p>
        <p class="empty-hint">Head to Focus to log your first session.</p>
      </div>
    ` : ''}
  `

  if (sessions.length > 0) {
    drawDailyChart(dayMins, settings)
    drawQualityChart(sessions)
    drawHeatmap(hourBuckets)
    drawGoalBars(ctxMins, totalCtxMins, settings.contexts)
    if (subjects.length > 0) {
      drawSubjectBars(subjects, subjMinsMap, prevSubjMinsMap, totalMins)
      drawStreakPanel(subjStreaks)
    }
    loadAiInsights(sessions, totalMins, streak, settings)
  }
}

// ─── DAY VIEW ──────────────────────────────────────────────────────────────

async function renderDay(settings, subjects) {
  const today        = todayStr()
  const yesterday    = new Date(); yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  const [sessions, yesterdaySessions] = await Promise.all([
    getSessionsForDate(today),
    getSessionsForDate(yesterdayStr),
  ])

  const totalMins      = sessions.reduce((s, x) => s + (x.durationMins || 0), 0)
  const prevTotalMins  = yesterdaySessions.reduce((s, x) => s + (x.durationMins || 0), 0)
  const totalDistracts = sessions.reduce((s, x) => s + (x.distractions || 0), 0)
  const goalMins       = settings.dailyGoalHours * 60
  const goalPct        = Math.min(100, Math.round((totalMins / goalMins) * 100))

  const focusRates = sessions.filter(s => s.durationMins > 0)
    .map(s => Math.max(0, 100 - Math.round((s.distractions || 0) / s.durationMins * 100 * 0.5)))
  const avgFocusRate = focusRates.length
    ? Math.round(focusRates.reduce((a, b) => a + b, 0) / focusRates.length)
    : null

  const hourBuckets = Array(24).fill(0)
  sessions.forEach(s => { hourBuckets[new Date(s.startedAt).getHours()] += s.durationMins || 0 })
  const bestHourIdx = hourBuckets.indexOf(Math.max(...hourBuckets))
  const bestHourStr = totalMins > 0 ? hourLabel(bestHourIdx) : '—'

  // Subject today
  const subjTodayMins = new Map()
  sessions.forEach(s => {
    if (!s.subjectId) return
    subjTodayMins.set(s.subjectId, (subjTodayMins.get(s.subjectId) || 0) + (s.durationMins || 0))
  })

  document.getElementById('period-label').textContent =
    new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  const body = document.getElementById('insights-body')
  body.innerHTML = `
    <div class="metric-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">
      ${metric(
        'Focus today', fmtHours(totalMins),
        prevTotalMins > 0
          ? totalMins > prevTotalMins
            ? `↑ More than yesterday's ${fmtHours(prevTotalMins)}`
            : totalMins < prevTotalMins
              ? `↓ Less than yesterday's ${fmtHours(prevTotalMins)}`
              : 'Same as yesterday'
          : `Goal: ${settings.dailyGoalHours}h`,
        totalMins >= goalMins ? 'positive' : ''
      )}
      ${metric(
        'Sessions', sessions.length,
        sessions.length === 0 ? 'Start your first session' :
        sessions.length === 1 ? 'First session done' :
        `Avg ${fmtMins(Math.round(totalMins / sessions.length))} each`,
        ''
      )}
      ${metric(
        'Focus rate',
        avgFocusRate !== null ? avgFocusRate + '%' : '—',
        avgFocusRate === null ? 'Log sessions to see' :
        avgFocusRate >= 90 ? 'Excellent — near zero distractions' :
        avgFocusRate >= 70 ? 'Good — minimal interruptions' :
        'Could improve — log distractions',
        avgFocusRate !== null && avgFocusRate >= 70 ? 'positive' : avgFocusRate !== null && avgFocusRate < 50 ? 'negative' : ''
      )}
      ${metric(
        'Distractions', totalDistracts,
        totalDistracts === 0 ? 'None logged — great focus' :
        totalDistracts <= 2 ? 'Low — well controlled' :
        totalDistracts <= 5 ? 'Moderate — keep an eye on it' :
        'High — try logging triggers',
        totalDistracts === 0 ? 'positive' : totalDistracts > 5 ? 'negative' : ''
      )}
    </div>

    <div class="card">
      <div class="dp-row" style="margin-bottom:6px">
        <span class="dp-label">Daily goal progress</span>
        <span class="dp-val" style="font-size:14px">${goalPct}%</span>
      </div>
      <div class="dp-bar-bg">
        <div class="dp-bar-fg" style="width:${goalPct}%"></div>
      </div>
      <p class="metric-helper" style="margin-top:6px">
        ${goalPct >= 100
          ? 'Goal reached 🎉 — anything extra is a bonus'
          : goalPct >= 50
            ? `${fmtMins(goalMins - totalMins)} to go — you're over halfway`
            : `${fmtMins(goalMins - totalMins)} remaining to hit ${settings.dailyGoalHours}h`
        }
      </p>
    </div>

    ${subjects.length > 0 && subjTodayMins.size > 0 ? `
      <div class="card">
        <p class="stage-label">Subject progress today</p>
        <div id="today-subj-bars"></div>
      </div>
    ` : ''}

    <div class="card">
      <p class="stage-label">Sessions timeline</p>
      ${sessions.length === 0
        ? `<p class="empty-hint" style="padding:8px 0">No sessions yet today.</p>`
        : `<div style="position:relative;height:${Math.max(80, sessions.length * 48)}px">
             <canvas id="timeline-chart"></canvas>
           </div>`
      }
    </div>

    <div class="two-col-grid">
      <div class="card" style="margin-bottom:0">
        <p class="stage-label">By context</p>
        <div id="day-goal-bars"></div>
      </div>
      <div class="card" style="margin-bottom:0">
        <p class="stage-label">Distraction log</p>
        <div id="distract-log"></div>
      </div>
    </div>
  `

  if (sessions.length > 0) {
    drawTimelineChart(sessions, subjects)
    drawDayGoalBars(sessions, settings.contexts)
    drawDistractionLog(sessions)
  }

  if (subjects.length > 0 && subjTodayMins.size > 0) {
    drawTodaySubjectBars(subjects, subjTodayMins)
  }
}

// ─── CHART DRAWS ───────────────────────────────────────────────────────────

function drawDailyChart(dayMins, settings) {
  const canvas = document.getElementById('daily-chart')
  if (!canvas) return
  const labels     = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const goalPerDay = settings.dailyGoalHours
  const colors     = dayMins.map((m, i) => {
    const hrs = m / 60
    if (hrs >= goalPerDay) return '#1D9E75'
    if (m > 0) return '#7F77DD'
    return 'rgba(127,119,221,0.15)'
  })
  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          data: dayMins.map(m => +(m / 60).toFixed(2)),
          backgroundColor: colors,
          borderRadius: 5,
          borderSkipped: false,
        },
        {
          type: 'line',
          data: Array(7).fill(goalPerDay),
          borderColor: 'rgba(127,119,221,0.35)',
          borderDash: [4, 4],
          borderWidth: 1,
          pointRadius: 0,
          fill: false,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ctx.datasetIndex === 0 ? fmtMins(Math.round(ctx.parsed.y * 60)) : 'Goal: ' + ctx.parsed.y + 'h' } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#5e5a72', font: { size: 11 } } },
        y: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#5e5a72', font: { size: 11 }, callback: v => v + 'h' },
          beginAtZero: true,
        }
      }
    }
  })
  chartInstances.push(chart)
}

function drawSubjectBars(subjects, subjMinsMap, prevSubjMinsMap, totalMins) {
  const el = document.getElementById('subj-bars')
  if (!el) return
  const total = Math.max(1, totalMins)
  const rows = subjects
    .filter(s => subjMinsMap.has(s.id))
    .sort((a, b) => (subjMinsMap.get(b.id) || 0) - (subjMinsMap.get(a.id) || 0))

  if (rows.length === 0) { el.innerHTML = '<p class="empty-hint">No subject sessions this week.</p>'; return }

  el.innerHTML = rows.map(s => {
    const mins     = subjMinsMap.get(s.id) || 0
    const prevMins = prevSubjMinsMap.get(s.id) || 0
    const pct      = Math.round((mins / total) * 100)
    const goalPct  = Math.min(100, Math.round((mins / (s.dailyGoalMins * 5)) * 100)) // 5 active days
    const change   = prevMins > 0 ? Math.round(((mins - prevMins) / prevMins) * 100) : null

    return `
      <div style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
          <span style="font-size:12px;font-weight:500;color:var(--text-primary)">
            ${s.icon ? s.icon + ' ' : ''}${esc(s.name)}
          </span>
          <span style="font-size:12px;font-weight:600;color:${s.color}">${fmtMins(mins)}</span>
        </div>
        <div class="dp-bar-bg">
          <div class="dp-bar-fg" style="width:${pct}%;background:${s.color}"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:3px">
          <span class="metric-helper">${pct}% of total focus time</span>
          <span class="metric-helper ${change !== null && change > 0 ? 'metric-helper--pos' : change !== null && change < 0 ? 'metric-helper--neg' : ''}">
            ${change !== null
              ? change > 0 ? `↑ ${change}% vs last week` : change < 0 ? `↓ ${Math.abs(change)}% vs last week` : 'same as last week'
              : `goal: ${fmtMins(s.dailyGoalMins)}/day`
            }
          </span>
        </div>
      </div>
    `
  }).join('')
}

function drawStreakPanel(subjStreaks) {
  const el = document.getElementById('streak-panel')
  if (!el) return
  const withData = subjStreaks.filter(s => s.current > 0 || s.best > 0)
  if (withData.length === 0) {
    el.innerHTML = '<p class="empty-hint">Hit your daily goal for a subject to start a streak.</p>'
    return
  }
  el.innerHTML = withData.map(s => `
    <div class="streak-row">
      <span class="streak-icon" style="color:${s.color}">${s.icon || '📚'}</span>
      <div class="streak-body">
        <span class="streak-name">${esc(s.name)}</span>
        <span class="streak-helper">${s.current > 0 ? `${s.current} day streak` : 'No active streak'} · best: ${s.best} day${s.best !== 1 ? 's' : ''}</span>
      </div>
      <div class="streak-nums">
        ${s.current > 0 ? `<span class="streak-fire">🔥 ${s.current}</span>` : '<span class="streak-fire" style="opacity:.3">—</span>'}
      </div>
    </div>
  `).join('')
}

function drawTodaySubjectBars(subjects, subjTodayMins) {
  const el = document.getElementById('today-subj-bars')
  if (!el) return
  el.innerHTML = subjects.filter(s => subjTodayMins.has(s.id)).map(s => {
    const mins    = subjTodayMins.get(s.id) || 0
    const goalPct = Math.min(100, Math.round((mins / s.dailyGoalMins) * 100))
    return `
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:12px;font-weight:500;color:var(--text-primary)">${s.icon ? s.icon + ' ' : ''}${esc(s.name)}</span>
          <span style="font-size:12px;color:${s.color};font-weight:500">${fmtMins(mins)} / ${fmtMins(s.dailyGoalMins)}</span>
        </div>
        <div class="dp-bar-bg">
          <div class="dp-bar-fg" style="width:${goalPct}%;background:${s.color}"></div>
        </div>
        <p class="metric-helper" style="margin-top:3px">
          ${goalPct >= 100
            ? `Goal reached ✓`
            : `${fmtMins(s.dailyGoalMins - mins)} to go`
          }
        </p>
      </div>
    `
  }).join('')
}

function drawQualityChart(sessions) {
  const canvas = document.getElementById('quality-chart')
  if (!canvas) return
  const counts = { Deep: 0, Good: 0, Patchy: 0 }
  sessions.forEach(s => { if (s.qualityRating) counts[s.qualityRating]++ })
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  if (total === 0) {
    canvas.parentElement.innerHTML = '<p class="empty-hint" style="padding:16px 0;font-size:11px">Rate sessions to see quality data.</p>'
    return
  }
  const chart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Deep','Good','Patchy'],
      datasets: [{ data: [counts.Deep, counts.Good, counts.Patchy], backgroundColor: ['#1D9E75','#7F77DD','#D85A30'], borderWidth: 0, hoverOffset: 4 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '68%',
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed}` } } }
    }
  })
  chartInstances.push(chart)
  const legend = document.createElement('div')
  legend.className = 'quality-legend'
  legend.innerHTML = [['Deep','#1D9E75',counts.Deep],['Good','#7F77DD',counts.Good],['Patchy','#D85A30',counts.Patchy]]
    .filter(([,,n]) => n > 0)
    .map(([l,c,n]) => `<span class="q-leg-item"><span style="width:8px;height:8px;border-radius:2px;background:${c};display:inline-block"></span> ${l} <strong>${n}</strong></span>`)
    .join('')
  canvas.parentElement.appendChild(legend)
}

function drawHeatmap(hourBuckets) {
  const el = document.getElementById('heatmap')
  if (!el) return
  const maxH = Math.max(...hourBuckets.slice(6, 22), 1)
  for (let h = 6; h <= 21; h++) {
    const v    = hourBuckets[h]
    const op   = v === 0 ? 0.07 : 0.14 + (v / maxH) * 0.82
    const ht   = Math.max(8, Math.round((v / maxH) * 60) + 8)
    const cell = document.createElement('div')
    cell.className = 'heat-cell'
    cell.style.cssText = `height:${ht}px;opacity:${op.toFixed(2)};background:var(--accent)`
    cell.title = `${hourLabel(h)} — ${fmtMins(Math.round(v))}`
    el.appendChild(cell)
  }
}

function drawGoalBars(ctxMins, total, contexts) {
  const el = document.getElementById('goal-bars')
  if (!el) return
  if (Object.keys(ctxMins).length === 0) { el.innerHTML = '<p class="empty-hint">No sessions yet.</p>'; return }
  el.innerHTML = Object.entries(ctxMins).sort((a, b) => b[1] - a[1]).map(([id, mins]) => {
    const ctx   = contexts.find(c => c.id === id)
    const color = ctx?.color || '#888780'
    const label = ctx?.label || id
    const pct   = Math.round((mins / total) * 100)
    return `
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:11px;color:var(--text-secondary)">${label}</span>
          <span style="font-size:11px;font-weight:500;color:var(--text-primary)">${fmtMins(mins)} <span style="color:var(--text-muted);font-weight:400">(${pct}%)</span></span>
        </div>
        <div class="progress-bg"><div class="progress-fg" style="width:${pct}%;background:${color}"></div></div>
      </div>`
  }).join('')
}

function drawTimelineChart(sessions, subjects) {
  const canvas = document.getElementById('timeline-chart')
  if (!canvas) return
  const labels = sessions.map(s => new Date(s.startedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }))
  const data   = sessions.map(s => s.durationMins || 0)
  const colors = sessions.map(s => {
    if (s.subjectId) {
      const subj = subjects?.find(x => x.id === s.subjectId)
      if (subj) return subj.color
    }
    if (s.qualityRating === 'Deep') return '#1D9E75'
    if (s.qualityRating === 'Patchy') return '#D85A30'
    return '#7F77DD'
  })
  const chart = new Chart(canvas, {
    type: 'bar', indexAxis: 'y',
    data: { labels, datasets: [{ data, backgroundColor: colors, borderRadius: 4, borderSkipped: false }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => fmtMins(ctx.parsed.x) } } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#5e5a72', font: { size: 11 }, callback: v => v + 'm' }, beginAtZero: true },
        y: { grid: { display: false }, ticks: { color: '#5e5a72', font: { size: 11 } } }
      }
    }
  })
  chartInstances.push(chart)
}

function drawDayGoalBars(sessions, contexts) {
  const el = document.getElementById('day-goal-bars')
  if (!el) return
  const byCtx = {}
  sessions.forEach(s => { byCtx[s.context] = (byCtx[s.context] || 0) + (s.durationMins || 0) })
  const total = Math.max(1, Object.values(byCtx).reduce((a, b) => a + b, 0))
  el.innerHTML = Object.entries(byCtx).map(([id, mins]) => {
    const ctx = contexts.find(c => c.id === id)
    const pct = Math.round((mins / total) * 100)
    return `
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:11px;color:var(--text-secondary)">${ctx?.label || id}</span>
          <span style="font-size:11px;font-weight:500;color:var(--text-primary)">${pct}%</span>
        </div>
        <div class="progress-bg"><div class="progress-fg" style="width:${pct}%;background:${ctx?.color || '#888780'}"></div></div>
      </div>`
  }).join('') || '<p class="empty-hint">No sessions.</p>'
}

function drawDistractionLog(sessions) {
  const el = document.getElementById('distract-log')
  if (!el) return
  const counts = {}
  sessions.forEach(s => { (s.distractionLog || []).forEach(d => { counts[d.type] = (counts[d.type] || 0) + 1 }) })
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  if (entries.length === 0) { el.innerHTML = '<p class="empty-hint" style="font-size:11px">No distractions logged.</p>'; return }
  el.innerHTML = entries.map(([type, n]) => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:0.5px solid var(--border)">
      <span style="font-size:12px;color:var(--text-secondary)">${type}</span>
      <span style="font-size:12px;font-weight:500;color:var(--text-primary)">${n}×</span>
    </div>
  `).join('')
}

// ─── AI INSIGHTS ───────────────────────────────────────────────────────────

async function loadAiInsights(sessions, totalMins, streak, settings) {
  const el = document.getElementById('ai-chips')
  if (!el) return
  if (!settings.aiApiKey || !settings.aiWeeklyReview) {
    el.innerHTML = `<p class="empty-hint">Add a Gemini API key in Settings → AI to enable weekly insights.</p>`
    return
  }
  const raw = await callGemini(buildWeeklySummaryPrompt(sessions, totalMins, streak), settings.aiApiKey)
  if (!raw) { el.innerHTML = `<p class="empty-hint">Could not load AI insights. Check your API key.</p>`; return }
  let chips = []
  try { const clean = raw.replace(/```json|```/g, '').trim(); chips = JSON.parse(clean); if (!Array.isArray(chips)) chips = [raw] }
  catch { chips = [raw] }
  el.innerHTML = chips.map(c => `
    <div class="insight-chip">
      <span class="insight-dot"></span>${esc(typeof c === 'string' ? c : JSON.stringify(c))}
    </div>
  `).join('')
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function weekRanges() {
  const today  = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  const prevMonday = new Date(monday)
  prevMonday.setDate(monday.getDate() - 7)
  const prevSunday = new Date(monday)
  prevSunday.setDate(monday.getDate() - 1)
  return {
    fromStr:     monday.toISOString().slice(0, 10),
    toStr:       today.toISOString().slice(0, 10),
    prevFromStr: prevMonday.toISOString().slice(0, 10),
    prevToStr:   prevSunday.toISOString().slice(0, 10),
    monday,
  }
}

function metric(label, value, helper = '', helperType = '') {
  return `
    <div class="metric-card">
      <p class="metric-label">${label}</p>
      <p class="metric-value">${value}</p>
      ${helper ? `<p class="metric-helper ${helperType === 'positive' ? 'metric-helper--pos' : helperType === 'negative' ? 'metric-helper--neg' : ''}">${helper}</p>` : ''}
    </div>`
}

function streakIcon(n) {
  if (n >= 30) return '🔥🔥🔥'
  if (n >= 14) return '🔥🔥'
  return '🔥'
}

function streakBadgeStyle(n) {
  if (n >= 30) return 'background:rgba(216,90,48,.2);color:#D85A30;border-color:rgba(216,90,48,.4)'
  if (n >= 14) return 'background:rgba(186,117,23,.2);color:#BA7517;border-color:rgba(186,117,23,.4)'
  if (n >= 7)  return 'background:rgba(127,119,221,.2);color:#7F77DD;border-color:rgba(127,119,221,.4)'
  return ''
}

function destroyCharts() {
  chartInstances.forEach(c => { try { c.destroy() } catch {} })
  chartInstances = []
}
