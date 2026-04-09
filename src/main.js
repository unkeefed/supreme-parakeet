import './style.css'
import { db, getSettings, getSessionsForRange, getFocusMinutesForDate } from './db/index.js'
import { initRouter, navigateTo } from './router.js'
import { requestNotificationPermission, scheduleMorningReminder, sendNotification, playBeep } from './utils/notifications.js'
import { callGemini, buildMorningPrompt, todayStr } from './utils/index.js'
import { applyTheme } from './views/settings.js'
import { initialSync, startAutoSync, onSyncStatus, getLastSyncTime } from './sync.js'

// Apply saved theme immediately to avoid flash
getSettings().then(s => { if (s?.theme) { applyTheme(s.theme); try { localStorage.setItem('apexThemeCache', JSON.stringify({theme: s.theme})) } catch {} } })
// ─── Haptic feedback ──────────────────────────────────────────────────────
export function haptic(style = 'light') {
  // iOS Safari (PWA only)
  if (window.navigator?.vibrate) {
    const patterns = { light: [8], medium: [15], heavy: [30], success: [10, 50, 10] }
    navigator.vibrate(patterns[style] || patterns.light)
  }
  // Web Vibration API fallback (Android)
  // (already handled above via navigator.vibrate)
}

// Global tap feedback — attach once to document
document.addEventListener('pointerdown', e => {
  const target = e.target.closest('button, .task-row, .picker-row, .cal-day, .subject-chip, .ctx-pill')
  if (!target) return
  target.classList.add('haptic-pop')
  target.addEventListener('animationend', () => target.classList.remove('haptic-pop'), { once: true })
}, { passive: true })

// Expose globally so views can call it
window._apexHaptic = haptic



// Expose sync status globally for settings panel
window._apexSyncStatus = { status: 'idle', pending: 0, lastSync: null }
onSyncStatus((status, pending) => {
  window._apexSyncStatus = { status, pending, lastSync: window._apexSyncStatus.lastSync }
  // Update status badge if settings sync panel is open
  const badge = document.getElementById('sync-status-badge')
  if (badge) updateSyncBadge(badge, status, pending)
})

function updateSyncBadge(el, status, pending) {
  const msgs = {
    idle:    { text: 'Not started', cls: '' },
    syncing: { text: 'Syncing…',    cls: 'sync-badge--syncing' },
    synced:  { text: 'Synced just now', cls: 'sync-badge--ok' },
    offline: { text: `Offline — ${pending} change${pending !== 1 ? 's' : ''} pending`, cls: 'sync-badge--offline' },
    error:   { text: `Error — ${pending} change${pending !== 1 ? 's' : ''} queued`, cls: 'sync-badge--error' },
  }
  const m = msgs[status] || msgs.idle
  el.textContent = m.text
  el.className   = 'sync-status-badge ' + m.cls
}
window._apexUpdateSyncBadge = updateSyncBadge

function loadScript(src) {
  return new Promise((res, rej) => {
    if (window.Chart) { res(); return }
    const s = document.createElement('script')
    s.src = src; s.onload = res; s.onerror = rej
    document.head.appendChild(s)
  })
}

// ─── PWA install prompt ────────────────────────────────────────────────────

let deferredInstallPrompt = null

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault()
  deferredInstallPrompt = e
  showInstallBanner()
})

function showInstallBanner() {
  // Only show once per session and not if already installed
  if (sessionStorage.getItem('installDismissed')) return
  if (window.matchMedia('(display-mode: standalone)').matches) return

  const banner = document.createElement('div')
  banner.className = 'install-banner'
  banner.innerHTML = `
    <div class="install-banner-inner">
      <div class="install-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
      </div>
      <div class="install-text">
        <p class="install-title">Install Apex Focus</p>
        <p class="install-sub">Add to home screen for the full app experience</p>
      </div>
      <div class="install-actions">
        <button class="install-btn" id="install-btn">Install</button>
        <button class="install-dismiss" id="install-dismiss">✕</button>
      </div>
    </div>
  `
  document.body.appendChild(banner)

  document.getElementById('install-btn').addEventListener('click', async () => {
    if (!deferredInstallPrompt) return
    deferredInstallPrompt.prompt()
    const { outcome } = await deferredInstallPrompt.userChoice
    deferredInstallPrompt = null
    banner.remove()
  })

  document.getElementById('install-dismiss').addEventListener('click', () => {
    sessionStorage.setItem('installDismissed', '1')
    banner.remove()
  })
}

// ─── Morning AI prioritisation ─────────────────────────────────────────────

async function runMorningPrioritisation(settings) {
  if (!settings.aiMorningPrioritisation) return
  if (!settings.aiApiKey) return

  // Only fire once per day
  const lastRun = await db.settings.get('morningPromptDate')
  if (lastRun?.value === todayStr()) return

  const now = new Date()
  const h   = now.getHours()
  if (h < 6 || h > 11) return   // Only relevant in the morning

  const tasks = await db.tasks
    .where('status').anyOf(['today', 'inbox'])
    .filter(t => !t.completedAt)
    .toArray()

  if (tasks.length === 0) return

  const { fromStr } = weekRange()
  const sessions    = await getSessionsForRange(fromStr, todayStr())
  const prompt      = buildMorningPrompt(tasks, sessions)
  const raw         = await callGemini(prompt, settings.aiApiKey)

  if (!raw) return

  let suggested = []
  try {
    const clean = raw.replace(/```json|```/g, '').trim()
    suggested   = JSON.parse(clean)
  } catch { return }

  if (!Array.isArray(suggested) || suggested.length === 0) return

  // Mark suggested tasks as 'today'
  for (const title of suggested) {
    const match = tasks.find(t => t.title.toLowerCase().includes(title.toLowerCase().slice(0, 20)))
    if (match && match.status !== 'today') {
      await db.tasks.update(match.id, { status: 'today' })
    }
  }

  await db.settings.put({ key: 'morningPromptDate', value: todayStr() })
  await db.settings.put({ key: 'morningPromptResult', value: JSON.stringify(suggested) })

  showMorningCard(suggested)
}

function showMorningCard(tasks) {
  const card = document.createElement('div')
  card.className = 'morning-card'
  card.innerHTML = `
    <div class="morning-card-inner">
      <div class="morning-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        <p class="morning-title">Good morning — your top 3 for today</p>
        <button class="morning-close" id="morning-close">✕</button>
      </div>
      <ol class="morning-list">
        ${tasks.slice(0, 3).map(t => `<li>${t}</li>`).join('')}
      </ol>
      <button class="btn-primary full-width" style="font-size:12px;padding:9px" id="morning-start">
        Start with first task →
      </button>
    </div>
  `
  document.body.appendChild(card)

  document.getElementById('morning-close').addEventListener('click', () => card.remove())
  document.getElementById('morning-start').addEventListener('click', () => {
    card.remove()
    navigateTo('focus')
  })

  setTimeout(() => card.classList.add('morning-card--in'), 50)
}

// ─── Boot ──────────────────────────────────────────────────────────────────

async function boot() {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js')
  await db.open()
  initRouter()

  // Start Supabase auto-sync after router is ready
  initialSync().catch(() => {})
  startAutoSync()

  const settings = await getSettings()

  // FIX 1: Re-apply saved accent colour on every boot
  if (settings.accentColor) {
    document.documentElement.style.setProperty('--accent', settings.accentColor)
  }

  // FIX 2: Midnight cleanup — delete time_blocks older than yesterday
  try {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const cutoff = yesterday.toISOString().slice(0, 10)
    await db.time_blocks.where('date').below(cutoff).delete()
  } catch {}

  // Notifications
  if (settings.morningReminderEnabled) {
    const granted = await requestNotificationPermission()
    if (granted) scheduleMorningReminder(settings.morningReminderTime)
  }

  // Expose sound + notify for use from focus.js
  window._apexPlayBeep = playBeep
  window._apexNotify   = sendNotification

  // Morning AI (non-blocking)
  runMorningPrioritisation(settings).catch(() => {})

  // Sunday review prompt
  const isSunday = new Date().getDay() === 0
  if (isSunday) {
    const lastReview = await db.settings.get('lastReviewDate')
    if (lastReview?.value !== todayStr()) {
      setTimeout(() => showSundayPrompt(), 3000)
    }
  }
}

function showSundayPrompt() {
  const card = document.createElement('div')
  card.className = 'morning-card'
  card.innerHTML = `
    <div class="morning-card-inner">
      <div class="morning-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        <p class="morning-title">Time for your weekly review</p>
        <button class="morning-close" id="sunday-close">✕</button>
      </div>
      <p style="font-size:12px;color:var(--text-muted);margin:0 0 12px;line-height:1.5">
        Reflect on this week and set your intention for the next one.
      </p>
      <button class="btn-primary full-width" style="font-size:12px;padding:9px" id="sunday-start">
        Open weekly review →
      </button>
    </div>
  `
  document.body.appendChild(card)
  document.getElementById('sunday-close').addEventListener('click', async () => {
    await db.settings.put({ key: 'lastReviewDate', value: todayStr() })
    card.remove()
  })
  document.getElementById('sunday-start').addEventListener('click', async () => {
    await db.settings.put({ key: 'lastReviewDate', value: todayStr() })
    card.remove()
    navigateTo('review')
  })
  setTimeout(() => card.classList.add('morning-card--in'), 50)
}

function weekRange() {
  const today  = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  return { fromStr: monday.toISOString().slice(0, 10) }
}

boot().catch(err => {
  document.getElementById('app').innerHTML = `
    <div style="padding:40px;text-align:center;color:#D85A30">
      <p style="font-size:16px;font-weight:500">Failed to start</p>
      <p style="font-size:12px;margin-top:8px;color:#5e5a72">${err.message}</p>
    </div>
  `
})
