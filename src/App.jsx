import React from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import InboxPage    from './pages/InboxPage.jsx'
import FocusPage    from './pages/FocusPage.jsx'
import InsightsPage from './pages/InsightsPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'

const TABS = [
  {
    path: '/',
    label: 'Inbox',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? 'var(--accent)' : 'var(--text-3)'}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    path: '/focus',
    label: 'Focus',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? 'var(--accent)' : 'var(--text-3)'}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 7v5l3 3"/>
      </svg>
    ),
  },
  {
    path: '/insights',
    label: 'Insights',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? 'var(--accent)' : 'var(--text-3)'}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6"/>
      </svg>
    ),
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? 'var(--accent)' : 'var(--text-3)'}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
]

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()

  const activePath = '/' + location.pathname.split('/')[1]

  return (
    <>
      {/* Page content */}
      <div className="page-scroll">
        <Routes>
          <Route path="/"         element={<InboxPage />} />
          <Route path="/focus"    element={<FocusPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>

      {/* Bottom navigation */}
      <nav className="bottom-nav">
        {TABS.map(tab => {
          const isActive = activePath === tab.path
          return (
            <button
              key={tab.path}
              className={`nav-tab${isActive ? ' active' : ''}`}
              onClick={() => navigate(tab.path)}
            >
              <div className="nav-indicator" />
              {tab.icon(isActive)}
              {tab.label}
            </button>
          )
        })}
      </nav>
    </>
  )
}
