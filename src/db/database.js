// src/db/database.js
// Apex Focus — Dexie.js schema
// Shared IndexedDB instance. The life dashboard reads from the same DB.
// All tables versioned so schema migrations are safe.

import Dexie from 'dexie'

export const db = new Dexie('ApexFocus')

db.version(1).stores({
  // ─── Tasks ────────────────────────────────────────────────────────────────
  // id:           auto-increment primary key
  // title:        task name
  // context:      'study' | 'civil' | 'personal' | 'trading' | custom string
  // goalId:       optional — links to a goal in the life dashboard DB
  // priority:     'high' | 'medium' | 'low'
  // estimateMins: estimated duration in minutes
  // status:       'todo' | 'done'
  // dueDate:      ISO date string YYYY-MM-DD, null = backlog
  // createdAt:    ISO timestamp
  tasks: '++id, context, goalId, status, dueDate, createdAt',

  // ─── Focus sessions ────────────────────────────────────────────────────────
  // id:            auto-increment primary key
  // taskId:        FK → tasks.id
  // goalId:        denormalised from task for fast goal-progress queries
  // startedAt:     ISO timestamp
  // durationMins:  planned session length (25 | 50 | 90)
  // elapsedMins:   actual minutes elapsed (may differ if ended early)
  // distractions:  integer count
  // distractTypes: JSON array e.g. ['Phone','Thought','Noise']
  // quality:       'Deep' | 'Good' | 'Patchy' | null
  // notes:         free text
  // date:          YYYY-MM-DD (for fast date-range queries without parsing startedAt)
  focus_sessions: '++id, taskId, goalId, date, startedAt, quality',

  // ─── Time blocks ──────────────────────────────────────────────────────────
  // id:        auto-increment primary key
  // taskId:    FK → tasks.id
  // date:      YYYY-MM-DD
  // startTime: 'HH:MM' 24h string
  // endTime:   'HH:MM' 24h string
  // actualMins: filled in when session completes against this block
  time_blocks: '++id, taskId, date, startTime',

  // ─── Settings ─────────────────────────────────────────────────────────────
  // key-value store — each row is one setting
  // key:   setting name (string, primary key)
  // value: JSON-serialised value
  settings: 'key',

  // ─── Contexts ─────────────────────────────────────────────────────────────
  // User-defined task contexts (replaces hardcoded list)
  // id:    string slug e.g. 'study'
  // label: display name e.g. 'Study'
  // color: hex string e.g. '#7F77DD'
  // order: integer for sorting
  contexts: 'id, order',
})

// ─── Seed defaults on first run ─────────────────────────────────────────────

export async function seedDefaults() {
  const existing = await db.settings.get('seeded')
  if (existing) return

  await db.contexts.bulkPut([
    { id: 'study',    label: 'Study',     color: '#7F77DD', order: 0 },
    { id: 'civil',    label: 'Civil eng', color: '#BA7517', order: 1 },
    { id: 'personal', label: 'Personal',  color: '#D4537E', order: 2 },
    { id: 'trading',  label: 'Trading',   color: '#1D9E75', order: 3 },
  ])

  await db.settings.bulkPut([
    { key: 'defaultDuration',    value: 50 },
    { key: 'breakMins',          value: 10 },
    { key: 'longBreakMins',      value: 30 },
    { key: 'longBreakAfter',     value: 4  },
    { key: 'dailyGoalHours',     value: 4  },
    { key: 'activeDays',         value: [1,2,3,4,5] }, // Mon–Fri
    { key: 'accentColor',        value: '#7F77DD' },
    { key: 'showRing',           value: true },
    { key: 'autoStartBreak',     value: false },
    { key: 'autoStartSession',   value: false },
    { key: 'soundEnabled',       value: true },
    { key: 'morningReminder',    value: '08:30' },
    { key: 'morningReminderOn',  value: true },
    { key: 'syncStudy',          value: true },
    { key: 'syncHabits',         value: true },
    { key: 'syncGoals',          value: true },
    { key: 'syncMood',           value: false },
    { key: 'aiProvider',         value: 'gemini' },
    { key: 'aiKey',              value: '' },
    { key: 'aiMorning',          value: true },
    { key: 'aiWeekly',           value: true },
    { key: 'aiDistractions',     value: true },
    { key: 'aiReschedule',       value: false },
    { key: 'seeded',             value: true },
  ])
}

// ─── Helpers ────────────────────────────────────────────────────────────────

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export async function getSetting(key, fallback = null) {
  const row = await db.settings.get(key)
  return row ? row.value : fallback
}

export async function setSetting(key, value) {
  await db.settings.put({ key, value })
}

// Returns total elapsed mins for a given date (default: today)
export async function focusMinutesOnDate(date = todayStr()) {
  const sessions = await db.focus_sessions.where('date').equals(date).toArray()
  return sessions.reduce((sum, s) => sum + (s.elapsedMins || 0), 0)
}

// Returns sessions grouped by date for the last N days
export async function sessionsLastNDays(n = 7) {
  const dates = Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().slice(0, 10)
  })
  const sessions = await db.focus_sessions
    .where('date')
    .anyOf(dates)
    .toArray()
  return sessions
}

// Returns current streak in days
export async function currentStreak(activeDays = [1,2,3,4,5], goalHours = 4) {
  const goalMins = goalHours * 60
  let streak = 0
  const d = new Date()
  // Check up to 90 days back
  for (let i = 0; i < 90; i++) {
    const dayOfWeek = d.getDay() // 0=Sun, 1=Mon…
    const dateStr = d.toISOString().slice(0, 10)
    if (activeDays.includes(dayOfWeek)) {
      const mins = await focusMinutesOnDate(dateStr)
      if (mins >= goalMins) {
        streak++
      } else if (i > 0) {
        break // gap — streak ends
      }
    }
    d.setDate(d.getDate() - 1)
  }
  return streak
}
