import React, { useState, useEffect, useRef } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, todayStr, sessionsLastNDays, currentStreak, getSetting } from '../db/database.js'

function MetricCard({ label, value, sub, subClass }) {
  return (
    <div className="metric-card">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      {sub && <p className={`metric-sub${subClass ? ' ' + subClass : ''}`}>{sub}</p>}
    </div>
  )
}

function GoalBar({ label, pct, color }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-1)' }}>{Math.round(pct)}%</span>
      </div>
      <div style={{
        height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: 3,
          background: color, width: `${Math.min(100, pct)}%`,
          transition: 'width .4s',
        }} />
      </div>
    </div>
  )
}

export default function InsightsPage() {
  const [view, setView]       = useState('week')
  const [streak, setStreak]   = useState(0)
  const [goalHours, setGoalHours] = useState(4)
  const today = todayStr()

  useEffect(() => {
    currentStreak().then(setStreak)
    getSetting('dailyGoalHours', 4).then(setGoalHours)
  }, [])

  // Week sessions
  const weekSessions = useLiveQuery(async () => {
    const sessions = await sessionsLastNDays(7)
    return sessions
  }, [])

  // Today sessions
  const todaySessions = useLiveQuery(() =>
    db.focus_sessions.where('date').equals(today).toArray()
  , [today])

  // Contexts for goal breakdown
  const contexts = useLiveQuery(() => db.contexts.orderBy('order').toArray())

  // Derived metrics — week
  const weekMins   = weekSessions?.reduce((s, x) => s + (x.elapsedMins || 0), 0) || 0
  const weekHrs    = (weekMins / 60).toFixed(1)
  const weekCount  = weekSessions?.length || 0

  // Derived — today
  const todayMins  = todaySessions?.reduce((s, x) => s + (x.elapsedMins || 0), 0) || 0
  const todayHrs   = (todayMins / 60).toFixed(1)
  const todayCount = todaySessions?.length || 0
  const distractToday = todaySessions?.reduce((s, x) => s + (x.distractions || 0), 0) || 0

  // Peak hour (week)
  const hourBuckets = new Array(24).fill(0)
  weekSessions?.forEach(s => {
    if (s.startedAt) {
      const h = new Date(s.startedAt).getHours()
      hourBuckets[h] += s.elapsedMins || 0
    }
  })
  const peakHour = hourBuckets.indexOf(Math.max(...hourBuckets))
  const peakLabel = peakHour >= 0
    ? `${peakHour % 12 || 12}${peakHour < 12 ? 'am' : 'pm'}`
    : '—'

  // Goal breakdown (minutes per context)
  const ctxMins = {}
  weekSessions?.forEach(s => {
    if (!s.taskId) return
    // We'll need to resolve taskId → context
    // For now we use goalId as a proxy; a proper query would join tasks
  })

  // Heatmap data (hours 6–21)
  const maxBucket = Math.max(...hourBuckets.slice(6, 22), 1)

  // Day-of-week bar data
  const dayLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const dayBuckets = new Array(7).fill(0)
  weekSessions?.forEach(s => {
    if (s.startedAt) {
      const dow = (new Date(s.startedAt).getDay() + 6) % 7 // Mon=0
      dayBuckets[dow] += s.elapsedMins || 0
    }
  })
  const maxDay = Math.max(...dayBuckets, 1)

  if (view === 'week') return (
    <div style={{ padding: '24px 20px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div>
          <p className="page-title">Insights</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-3)' }}>
            Last 7 days
          </p>
        </div>
        <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 8, padding: 2, gap: 2 }}>
          {['week','day'].map(v => (
            <button key={v} className={`seg-btn${view === v ? ' active' : ''}`}
              onClick={() => setView(v)}
              style={{ padding: '5px 14px', textTransform: 'capitalize' }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 8, marginBottom: 14 }}>
        <MetricCard label="Focus hours"  value={`${weekHrs}h`} sub="this week" />
        <MetricCard label="Sessions"     value={weekCount}     sub="completed" />
        <MetricCard label="Best hour"    value={peakLabel}     sub="most focus" />
        <MetricCard label="Streak"       value={`${streak}d`}  sub={streak > 0 ? 'keep going' : 'start today'} subClass={streak > 0 ? 'up' : ''} />
      </div>

      {/* Daily bar chart */}
      <div className="card-padded" style={{ marginBottom: 12 }}>
        <p className="section-label">Daily focus</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
          {dayBuckets.map((mins, i) => {
            const hPct = mins / maxDay
            const isMax = mins === maxDay && mins > 0
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%', borderRadius: 4,
                  height: Math.max(4, Math.round(hPct * 60)),
                  background: isMax ? 'var(--accent)' : 'var(--purple-50)',
                  transition: 'height .3s',
                }} />
                <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{dayLabels[i]}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Heatmap */}
      <div className="card-padded" style={{ marginBottom: 12 }}>
        <p className="section-label">Peak hours</p>
        <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
          {hourBuckets.slice(6, 22).map((v, i) => {
            const op = v === 0 ? 0.07 : 0.15 + (v / maxBucket) * 0.85
            const h = Math.max(8, Math.round((v / maxBucket) * 48) + 8)
            return (
              <div key={i} style={{
                flex: 1, height: h, borderRadius: 3,
                background: 'var(--accent)', opacity: op,
              }} />
            )
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          {['6am','9am','12pm','3pm','6pm','9pm'].map(l => (
            <span key={l} style={{ fontSize: 10, color: 'var(--text-3)' }}>{l}</span>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {weekCount === 0 && (
        <div style={{
          textAlign: 'center', padding: '20px 0',
          fontSize: 13, color: 'var(--text-3)',
        }}>
          Complete your first session to see insights here.
        </div>
      )}
    </div>
  )

  // ── Day view ────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '24px 20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div>
          <p className="page-title">Insights</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-3)' }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
          </p>
        </div>
        <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 8, padding: 2, gap: 2 }}>
          {['week','day'].map(v => (
            <button key={v} className={`seg-btn${view === v ? ' active' : ''}`}
              onClick={() => setView(v)}
              style={{ padding: '5px 14px', textTransform: 'capitalize' }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8, marginBottom: 14 }}>
        <MetricCard label="Focus today"  value={`${todayHrs}h`}  sub={`goal: ${goalHours}h`} subClass={parseFloat(todayHrs) >= goalHours ? 'up' : ''} />
        <MetricCard label="Sessions"     value={todayCount} />
        <MetricCard label="Distractions" value={distractToday} subClass={distractToday > 3 ? 'down' : ''} />
      </div>

      {/* Session timeline */}
      <div className="card-padded" style={{ marginBottom: 12 }}>
        <p className="section-label">Sessions today</p>
        {todaySessions?.length === 0 && (
          <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>No sessions yet today.</p>
        )}
        {todaySessions?.map((s, i) => (
          <div key={s.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 0',
            borderBottom: i < todaySessions.length - 1 ? '0.5px solid var(--border)' : 'none',
          }}>
            <span style={{ fontSize: 11, color: 'var(--text-3)', width: 44, flexShrink: 0 }}>
              {s.startedAt ? new Date(s.startedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—'}
            </span>
            <div style={{
              flex: 1, height: 24, borderRadius: 4,
              background: s.quality === 'Patchy' ? 'var(--coral-50)' : 'var(--purple-50)',
              display: 'flex', alignItems: 'center', paddingLeft: 8,
            }}>
              <span style={{ fontSize: 11, color: s.quality === 'Patchy' ? 'var(--coral-600)' : 'var(--purple-800)' }}>
                {s.elapsedMins || s.durationMins}m · {s.quality || 'unrated'}
              </span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
              {s.distractions}×
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
