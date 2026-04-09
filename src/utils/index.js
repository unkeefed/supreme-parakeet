// ─── Date helpers ──────────────────────────────────────────────────────────

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function dateStr(date) {
  return new Date(date).toISOString().slice(0, 10)
}

export function dayLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long'
  })
}

export function fmtTime(secs) {
  const m = Math.floor(Math.max(0, secs) / 60)
  const s = Math.max(0, secs) % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function fmtMins(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function fmtHours(mins) {
  return (mins / 60).toFixed(1) + 'h'
}

export function hourLabel(h) {
  if (h === 0) return '12am'
  if (h < 12) return `${h}am`
  if (h === 12) return '12pm'
  return `${h - 12}pm`
}

// ─── HTML escaping ─────────────────────────────────────────────────────────

export function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ─── DOM helpers ───────────────────────────────────────────────────────────

/** Fire callback when element is swiped left past threshold */
export function onSwipeLeft(el, callback, threshold = 80) {
  let startX = null
  let startY = null

  el.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
  }, { passive: true })

  el.addEventListener('touchend', e => {
    if (startX === null) return
    const dx = e.changedTouches[0].clientX - startX
    const dy = Math.abs(e.changedTouches[0].clientY - startY)
    if (dx < -threshold && dy < 40) callback()
    startX = null
  }, { passive: true })
}

/** Fire callback when element is swiped right past threshold */
export function onSwipeRight(el, callback, threshold = 80) {
  let startX = null
  let startY = null

  el.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
  }, { passive: true })

  el.addEventListener('touchend', e => {
    if (startX === null) return
    const dx = e.changedTouches[0].clientX - startX
    const dy = Math.abs(e.changedTouches[0].clientY - startY)
    if (dx > threshold && dy < 40) callback()
    startX = null
  }, { passive: true })
}

// ─── Gemini AI helper ──────────────────────────────────────────────────────

/**
 * Call Gemini 2.5 Flash with a prompt string.
 * Returns the text response, or null if no API key / request fails.
 * @param {string} prompt
 * @param {string} apiKey
 * @returns {Promise<string|null>}
 */
export async function callGemini(prompt, apiKey) {
  if (!apiKey) return null
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 512, temperature: 0.7 }
        })
      }
    )
    if (!res.ok) throw new Error(`Gemini ${res.status}`)
    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null
  } catch (err) {
    console.warn('Gemini call failed:', err.message)
    return null
  }
}

// ─── AI prompts ────────────────────────────────────────────────────────────

/**
 * Build the morning prioritisation prompt.
 * Returns a string for callGemini().
 */
export function buildMorningPrompt(tasks, sessions) {
  const recentCtx = sessions.slice(-20).map(s => s.context)
  const taskList = tasks.slice(0, 15).map(t =>
    `- "${t.title}" [${t.context}] est:${t.estimatedMins || '?'}min priority:${t.priority}`
  ).join('\n')

  return `You are a productivity assistant. Given these tasks and recent focus history, 
suggest the top 3 tasks to focus on today. Reply with ONLY a JSON array of 3 task titles 
from the list, nothing else. Example: ["Task A","Task B","Task C"]

Tasks:
${taskList}

Recent focus contexts: ${[...new Set(recentCtx)].join(', ')}
Today: ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}`
}

/**
 * Build the weekly insight summary prompt.
 */
export function buildWeeklySummaryPrompt(sessions, totalMins, streak) {
  const byCtx = {}
  sessions.forEach(s => { byCtx[s.context] = (byCtx[s.context] || 0) + (s.durationMins || 0) })
  const topCtx = Object.entries(byCtx).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none'

  const hourBuckets = Array(24).fill(0)
  sessions.forEach(s => { hourBuckets[new Date(s.startedAt).getHours()] += s.durationMins || 0 })
  const bestHour = hourBuckets.indexOf(Math.max(...hourBuckets))

  const avgDistractions = sessions.length
    ? Math.round(sessions.reduce((s, x) => s + (x.distractions || 0), 0) / sessions.length)
    : 0

  return `You are a productivity coach. Give exactly 4 short insight observations (each under 12 words) 
about this week's focus data. Reply ONLY as a JSON array of 4 strings.

Data:
- Total focus: ${Math.round(totalMins / 60 * 10) / 10}h across ${sessions.length} sessions
- Current streak: ${streak} days
- Most focused context: ${topCtx}
- Peak focus hour: ${hourLabel(bestHour)}
- Avg distractions per session: ${avgDistractions}`
}

/**
 * Build the distraction alert prompt.
 */
export function buildDistractionPrompt(session, avgDistractions) {
  return `A focus session just ended with ${session.distractions} distractions 
(the user's average is ${avgDistractions.toFixed(1)}). 
Give ONE short, direct, encouraging suggestion (under 15 words) to reduce distractions next time. 
Reply with only the suggestion text, no preamble.`
}
