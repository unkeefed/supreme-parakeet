import { db, getSettings, getSessionsForRange, getStreak } from '../db/index.js'
import { todayStr, fmtMins, fmtHours, esc, callGemini, buildWeeklySummaryPrompt } from '../utils/index.js'

export async function renderReview(container) {
  const settings = await getSettings()
  const { fromStr, toStr, monday, sunday } = weekRange()
  const sessions  = await getSessionsForRange(fromStr, toStr)
  const totalMins = sessions.reduce((s, x) => s + (x.durationMins || 0), 0)
  const streak    = await getStreak(settings.activeDays, settings.dailyGoalHours * 60)

  // Tasks completed this week
  const completed = await db.tasks
    .filter(t => t.completedAt && t.completedAt >= monday.getTime() && t.completedAt <= Date.now())
    .toArray()

  // Unfinished today tasks
  const open = await db.tasks
    .where('status').equals('today')
    .filter(t => !t.completedAt)
    .toArray()

  // Context breakdown
  const ctxMins = {}
  sessions.forEach(s => { ctxMins[s.context] = (ctxMins[s.context] || 0) + (s.durationMins || 0) })
  const topCtx   = Object.entries(ctxMins).sort((a, b) => b[1] - a[1])[0]
  const topCtxCfg = topCtx ? settings.contexts.find(c => c.id === topCtx[0]) : null

  // Day breakdown for mini chart
  const dayMins = Array(7).fill(0)
  sessions.forEach(s => {
    const idx = (new Date(s.startedAt).getDay() + 6) % 7
    dayMins[idx] += s.durationMins || 0
  })
  const maxDay = Math.max(...dayMins, 1)

  container.innerHTML = `
    <div class="view-header">
      <div>
        <h1 class="view-title">Weekly review</h1>
        <p class="view-sub">${monday.toLocaleDateString('en-GB', { day:'numeric', month:'short' })} – ${sunday.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}</p>
      </div>
      <button class="btn-accent" id="close-review">Done</button>
    </div>

    <div class="review-hero">
      <div class="review-stat-row">
        <div class="review-stat">
          <p class="review-stat-val">${fmtHours(totalMins)}</p>
          <p class="review-stat-label">focused</p>
        </div>
        <div class="review-stat-divider"></div>
        <div class="review-stat">
          <p class="review-stat-val">${sessions.length}</p>
          <p class="review-stat-label">sessions</p>
        </div>
        <div class="review-stat-divider"></div>
        <div class="review-stat">
          <p class="review-stat-val">${streak}</p>
          <p class="review-stat-label">day streak</p>
        </div>
      </div>

      <div class="review-minibar">
        ${['M','T','W','T','F','S','S'].map((d, i) => {
          const pct = Math.round((dayMins[i] / maxDay) * 100)
          return `
            <div class="rmb-col">
              <div class="rmb-bar-wrap">
                <div class="rmb-bar" style="height:${Math.max(3, pct)}%;background:${pct > 0 ? 'var(--accent)' : 'var(--bg-surface)'}"></div>
              </div>
              <span class="rmb-label">${d}</span>
            </div>`
        }).join('')}
      </div>
    </div>

    ${topCtxCfg ? `
      <div class="review-highlight" style="border-color:${topCtxCfg.color}44;background:${topCtxCfg.color}11">
        <span class="ctx-dot" style="background:${topCtxCfg.color}"></span>
        <span style="font-size:13px;color:var(--text-secondary)">
          Most focused on <strong style="color:var(--text-primary)">${topCtxCfg.label}</strong>
          — ${fmtMins(topCtx[1])} this week
        </span>
      </div>
    ` : ''}

    <div class="card" id="ai-review-card">
      <p class="stage-label" style="margin-bottom:10px">AI review</p>
      <div id="ai-review-body">
        <div class="ai-loading">
          <div class="ai-spinner"></div>
          <span>${settings.aiApiKey ? 'Generating your review…' : 'Add an API key in Settings → AI to enable AI reviews.'}</span>
        </div>
      </div>
    </div>

    <div class="card">
      <p class="stage-label">Completed this week</p>
      ${completed.length === 0
        ? `<p class="empty-hint" style="padding:6px 0">No tasks completed yet.</p>`
        : completed.slice(0, 8).map(t => {
            const ctx   = settings.contexts.find(c => c.id === t.context)
            const color = ctx?.color || '#888780'
            return `
              <div class="review-task-row">
                <div class="task-check checked" style="width:16px;height:16px;flex-shrink:0">
                  <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2.5"><path d="M3 8l4 4 6-6"/></svg>
                </div>
                <span class="ctx-dot" style="background:${color}"></span>
                <span style="font-size:12px;color:var(--text-secondary);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(t.title)}</span>
              </div>`
          }).join('')
      }
    </div>

    ${open.length > 0 ? `
      <div class="card">
        <p class="stage-label">Carrying forward</p>
        ${open.slice(0, 6).map(t => {
          const ctx   = settings.contexts.find(c => c.id === t.context)
          const color = ctx?.color || '#888780'
          return `
            <div class="review-task-row">
              <div class="task-check" style="width:16px;height:16px;flex-shrink:0"></div>
              <span class="ctx-dot" style="background:${color}"></span>
              <span style="font-size:12px;color:var(--text-secondary);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(t.title)}</span>
            </div>`
        }).join('')}
      </div>
    ` : ''}

    <div class="card">
      <p class="stage-label">Reflection note</p>
      <textarea class="session-note" id="review-note" rows="4"
        placeholder="What went well? What would you do differently next week?">${await loadReviewNote()}</textarea>
      <button class="btn-primary full-width" style="margin-top:12px" id="save-note-btn">Save reflection</button>
    </div>

    <div class="review-next-week">
      <p class="stage-label" style="margin-bottom:10px">Next week intentions</p>
      <div class="seg-row" style="flex-wrap:wrap">
        ${settings.contexts.map(c => `
          <button class="seg-btn intention-btn" data-ctx="${c.id}"
            style="display:flex;align-items:center;gap:5px">
            <span class="ctx-dot" style="background:${c.color}"></span>${c.label}
          </button>
        `).join('')}
      </div>
      <textarea class="session-note" id="intention-note" rows="2" style="margin-top:8px"
        placeholder="What's the #1 thing to move forward on next week?">${await loadIntentionNote()}</textarea>
      <button class="btn-primary full-width" style="margin-top:10px" id="save-intention-btn">Set intention</button>
    </div>
  `

  // Close
  container.querySelector('#close-review').addEventListener('click', () => {
    import('../router.js').then(m => m.navigateTo('inbox'))
  })

  // Save reflection
  container.querySelector('#save-note-btn').addEventListener('click', async () => {
    const note = container.querySelector('#review-note').value
    await db.settings.put({ key: 'reviewNote_' + fromStr, value: note })
    const btn  = container.querySelector('#save-note-btn')
    btn.textContent = 'Saved ✓'
    setTimeout(() => { btn.textContent = 'Save reflection' }, 1800)
  })

  // Save intention
  container.querySelector('#save-intention-btn').addEventListener('click', async () => {
    const note = container.querySelector('#intention-note').value
    await db.settings.put({ key: 'intention_' + toStr, value: note })
    const btn  = container.querySelector('#save-intention-btn')
    btn.textContent = 'Intention set ✓'
    setTimeout(() => { btn.textContent = 'Set intention' }, 1800)
  })

  // Intention context pills
  container.querySelectorAll('.intention-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('seg-active')
    })
  })

  // AI review
  if (settings.aiApiKey && settings.aiWeeklyReview && sessions.length > 0) {
    loadAiReview(sessions, totalMins, streak, settings)
  } else if (!settings.aiApiKey) {
    document.getElementById('ai-review-body').innerHTML =
      `<p class="empty-hint">Add a Gemini API key in Settings → AI to enable AI weekly reviews.</p>`
  } else if (sessions.length === 0) {
    document.getElementById('ai-review-body').innerHTML =
      `<p class="empty-hint">Complete sessions this week to generate a review.</p>`
  }
}

async function loadAiReview(sessions, totalMins, streak, settings) {
  const el = document.getElementById('ai-review-body')
  if (!el) return

  const { callGemini } = await import('../utils/index.js')

  const avgDistracts = sessions.reduce((s, x) => s + (x.distractions || 0), 0) / sessions.length
  const prompt = `You are a productivity coach giving a warm, direct weekly review.

Data:
- Total focus: ${fmtHours(totalMins)} across ${sessions.length} sessions
- Streak: ${streak} days
- Avg distractions per session: ${avgDistracts.toFixed(1)}
- Quality ratings: ${sessions.filter(s => s.qualityRating).map(s => s.qualityRating).join(', ') || 'none rated'}

Write a short weekly review in exactly this JSON format:
{
  "headline": "One punchy sentence summarising the week (under 12 words)",
  "strength": "One specific thing that went well (under 20 words)",
  "opportunity": "One concrete thing to improve next week (under 20 words)",
  "challenge": "Acknowledge one difficulty without being preachy (under 15 words)"
}
Reply with only valid JSON, no markdown.`

  const raw = await callGemini(prompt, settings.aiApiKey)
  if (!el) return

  if (!raw) {
    el.innerHTML = `<p class="empty-hint">AI review unavailable. Check your API key.</p>`
    return
  }

  let review = {}
  try {
    const clean = raw.replace(/```json|```/g, '').trim()
    review = JSON.parse(clean)
  } catch {
    el.innerHTML = `<p style="font-size:13px;color:var(--text-secondary);line-height:1.6">${esc(raw)}</p>`
    return
  }

  el.innerHTML = `
    <p class="review-headline">${esc(review.headline || '')}</p>
    <div class="review-items">
      ${reviewItem('Strength',    review.strength,    '#1D9E75')}
      ${reviewItem('Improve',     review.opportunity, '#D85A30')}
      ${reviewItem('Acknowledged',review.challenge,   '#888780')}
    </div>
  `
}

function reviewItem(label, text, color) {
  if (!text) return ''
  return `
    <div class="review-item">
      <span class="review-item-label" style="color:${color}">${label}</span>
      <p class="review-item-text">${esc(text)}</p>
    </div>`
}

async function loadReviewNote() {
  const { fromStr } = weekRange()
  const rec = await db.settings.get('reviewNote_' + fromStr)
  return esc(rec?.value || '')
}

async function loadIntentionNote() {
  const { toStr } = weekRange()
  const rec = await db.settings.get('intention_' + toStr)
  return esc(rec?.value || '')
}

function weekRange() {
  const today  = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  monday.setHours(0, 0, 0, 0)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return {
    fromStr: monday.toISOString().slice(0, 10),
    toStr:   today.toISOString().slice(0, 10),
    monday,
    sunday,
  }
}
