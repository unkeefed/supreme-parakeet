import { renderInbox }          from './views/inbox.js'
import { renderFocusWrapped as renderFocus } from './views/focus.js'
import { renderCalendar }       from './views/calendar.js'
import { renderInsights }       from './views/insights.js'
import { renderSettings }       from './views/settings.js'
import { renderReview }         from './views/review.js'

const TABS = ['inbox', 'focus', 'calendar', 'insights', 'settings', 'review']
let currentTab = 'inbox'

const views = {
  inbox:    renderInbox,
  focus:    renderFocus,
  calendar: renderCalendar,
  insights: renderInsights,
  settings: renderSettings,
  review:   renderReview,
}

export function initRouter() {
  const hash = location.hash.replace('#', '')
  if (TABS.includes(hash)) currentTab = hash
  renderShell()
  navigateTo(currentTab)
}

export async function navigateTo(tab) {
  if (!TABS.includes(tab)) return
  currentTab = tab
  location.hash = tab

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab)
  })

  const view = document.getElementById('view')
  if (!view) return

  // Animate out
  view.classList.add('view-exit')
  await new Promise(r => setTimeout(r, 120))
  view.innerHTML = ''
  view.classList.remove('view-exit')
  view.classList.add('view-enter')

  try {
    await views[tab]?.(view)
    // Trigger enter animation after content is painted
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        view.classList.add('view-enter-active')
        setTimeout(() => {
          view.classList.remove('view-enter', 'view-enter-active')
        }, 220)
      })
    })
  } catch (err) {
    console.error(`[Apex Focus] Render error on ${tab}:`, err)
    view.innerHTML = `
      <div class="view-error">
        <div class="view-error-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <p class="view-error-title">Something went wrong</p>
        <p class="view-error-msg">${err.message || 'Unexpected error.'}</p>
        <button class="btn-ghost" onclick="location.reload()" style="margin-top:12px">Reload app</button>
      </div>
    `
  }
}

function renderShell() {
  document.getElementById('app').innerHTML = `
    <div id="view" class="view"></div>
    <nav class="bottom-nav">
      ${navItem('inbox',    inboxIcon(),    'Inbox')}
      ${navItem('focus',    focusIcon(),    'Focus')}
      ${navItem('calendar', calendarIcon(), 'Calendar')}
      ${navItem('insights', insightsIcon(), 'Insights')}
      ${navItem('settings', settingsIcon(), 'Settings')}
    </nav>
  `
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.tab))
  })
}

function navItem(tab, icon, label) {
  return `
    <button class="nav-item ${tab === currentTab ? 'active' : ''}" data-tab="${tab}">
      ${icon}<span>${label}</span>
    </button>`
}

const inboxIcon    = () => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-6l-2 3H10L8 12H2"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`
const focusIcon    = () => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
const calendarIcon = () => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
const insightsIcon = () => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`
const settingsIcon = () => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
