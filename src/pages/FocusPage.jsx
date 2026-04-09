import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, todayStr, getSetting } from '../db/database.js'

const DURATIONS = [25, 50, 90]
const DISTRACT_TYPES = ['Phone', 'Notification', 'Thought', 'Noise', 'Other']

// Ring circumference for r=68: 2π×68 ≈ 427
const RING_C = 2 * Math.PI * 68

function TimerRing({ pct, color, size = 160, r = 68 }) {
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r}
        fill="none" stroke="var(--border)" strokeWidth="6" />
      <circle cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        style={{ transition: 'stroke-dashoffset .9s linear, stroke .3s' }}
      />
    </svg>
  )
}

function fmt(secs) {
  const m = Math.floor(Math.max(0, secs) / 60)
  const s = Math.max(0, secs) % 60
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

export default function FocusPage() {
  const today = todayStr()

  // ── State machine ──────────────────────────────────────────────────────────
  const [phase, setPhase]               = useState('setup')   // setup | active | wrap | break
  const [duration, setDuration]         = useState(50)
  const [selectedTask, setSelectedTask] = useState(null)
  const [remain, setRemain]             = useState(50 * 60)
  const [total, setTotal]               = useState(50 * 60)
  const [paused, setPaused]             = useState(false)
  const [distractions, setDistractions] = useState(0)
  const [distractLog, setDistractLog]   = useState([])
  const [rating, setRating]             = useState(null)
  const [note, setNote]                 = useState('')
  const [pomoIdx, setPomoIdx]           = useState(0)
  const [breakRemain, setBreakRemain]   = useState(10 * 60)
  const [accentColor, setAccentColor]   = useState('#7F77DD')

  const intervalRef  = useRef(null)
  const wakeLockRef  = useRef(null)
  const startTimeRef = useRef(null)

  // Load accent color from settings
  useEffect(() => {
    getSetting('accentColor', '#7F77DD').then(setAccentColor)
  }, [])

  // Today's tasks for picker
  const tasks = useLiveQuery(() =>
    db.tasks.where('dueDate').equals(today).filter(t => t.status !== 'done').toArray()
  , [today])

  const contexts = useLiveQuery(() => db.contexts.orderBy('order').toArray())

  const ctxFor = id => contexts?.find(c => c.id === id)
  const colorFor = task => ctxFor(task?.context)?.color || accentColor

  // ── Wake lock ──────────────────────────────────────────────────────────────
  async function requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen')
      }
    } catch {}
  }

  function releaseWakeLock() {
    wakeLockRef.current?.release()
    wakeLockRef.current = null
  }

  // ── Timer tick ─────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    setRemain(r => {
      if (r <= 1) {
        clearInterval(intervalRef.current)
        setPhase('wrap')
        releaseWakeLock()
        return 0
      }
      return r - 1
    })
  }, [])

  // ── Start session ──────────────────────────────────────────────────────────
  function startSession() {
    if (!selectedTask) return
    const secs = duration * 60
    setTotal(secs)
    setRemain(secs)
    setDistractions(0)
    setDistractLog([])
    setPaused(false)
    setRating(null)
    setNote('')
    startTimeRef.current = new Date().toISOString()
    setPhase('active')
    requestWakeLock()
    intervalRef.current = setInterval(tick, 1000)
  }

  function togglePause() {
    if (paused) {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    setPaused(p => !p)
  }

  function endSession() {
    clearInterval(intervalRef.current)
    releaseWakeLock()
    setPhase('wrap')
  }

  // ── Log distraction ────────────────────────────────────────────────────────
  function logDistract(type) {
    setDistractions(d => d + 1)
    setDistractLog(l => [...l, type])
  }

  // ── Save session ───────────────────────────────────────────────────────────
  async function saveSession() {
    const elapsed = Math.round((total - remain) / 60) || duration
    await db.focus_sessions.add({
      taskId:        selectedTask.id,
      goalId:        selectedTask.goalId || null,
      startedAt:     startTimeRef.current,
      durationMins:  duration,
      elapsedMins:   elapsed,
      distractions,
      distractTypes: distractLog,
      quality:       rating,
      notes:         note,
      date:          today,
    })
    // Advance Pomodoro counter
    setPomoIdx(i => i + 1)
    resetToSetup()
  }

  function resetToSetup() {
    clearInterval(intervalRef.current)
    releaseWakeLock()
    setPhase('setup')
    setRemain(duration * 60)
    setTotal(duration * 60)
    setPaused(false)
  }

  function startBreak() {
    getSetting('breakMins', 10).then(mins => {
      setBreakRemain(mins * 60)
      setPhase('break')
      intervalRef.current = setInterval(() => {
        setBreakRemain(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current)
            setPhase('setup')
            return 0
          }
          return r - 1
        })
      }, 1000)
    })
  }

  // Cleanup on unmount
  useEffect(() => () => {
    clearInterval(intervalRef.current)
    releaseWakeLock()
  }, [])

  const pct = remain / total
  const elapsed = Math.round((total - remain) / 60) || duration

  // ── Render: setup ──────────────────────────────────────────────────────────
  if (phase === 'setup') return (
    <div style={{ padding: '24px 20px 0' }}>
      <p className="page-title" style={{ marginBottom: 20 }}>Focus session</p>

      <p className="section-label">Select task</p>
      <div className="card" style={{ marginBottom: 16 }}>
        {tasks?.length === 0 && (
          <p style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-3)', margin: 0 }}>
            No tasks scheduled for today. Add some in the Inbox first.
          </p>
        )}
        {tasks?.map(t => {
          const ctx = ctxFor(t.context)
          const isSelected = selectedTask?.id === t.id
          return (
            <div
              key={t.id}
              onClick={() => setSelectedTask(t)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px',
                borderBottom: '0.5px solid var(--border)',
                cursor: 'pointer',
                background: isSelected ? (ctx?.color || accentColor) + '0d' : 'transparent',
                transition: 'background .15s',
              }}
            >
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: ctx?.color || 'var(--text-3)', flexShrink: 0,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--text-1)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {t.title}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-3)' }}>
                  {ctx?.label}{t.estimateMins ? ` · est. ${t.estimateMins}m` : ''}
                </p>
              </div>
              {isSelected && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke={ctx?.color || accentColor} strokeWidth="2.5" strokeLinecap="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              )}
            </div>
          )
        })}
      </div>

      <p className="section-label">Session length</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {DURATIONS.map(d => (
          <button
            key={d}
            className={`btn${duration === d ? ' btn-primary' : ''}`}
            style={{ flex: 1, fontSize: 13 }}
            onClick={() => { setDuration(d); setRemain(d * 60); setTotal(d * 60) }}
          >
            {d}m
          </button>
        ))}
      </div>

      <button
        className="btn btn-primary btn-full"
        style={{ fontSize: 15, padding: 14 }}
        onClick={startSession}
        disabled={!selectedTask}
      >
        {selectedTask ? 'Start session' : 'Select a task first'}
      </button>
    </div>
  )

  // ── Render: active ─────────────────────────────────────────────────────────
  if (phase === 'active') {
    const taskColor = colorFor(selectedTask)
    return (
      <div style={{ padding: '24px 20px 0' }}>
        {/* Task + Pomo dots */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--surface)', border: '0.5px solid var(--border)',
            borderRadius: 20, padding: '6px 14px',
            maxWidth: '70%',
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: taskColor, flexShrink: 0,
            }} />
            <span style={{
              fontSize: 13, fontWeight: 500, color: 'var(--text-1)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {selectedTask?.title}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {[0,1,2,3].map(i => (
              <span key={i} style={{
                width: 7, height: 7, borderRadius: '50%',
                background: i < pomoIdx % 4 || (i === 0 && pomoIdx % 4 === 0 && pomoIdx > 0)
                  ? taskColor : 'var(--border)',
                outline: i === (pomoIdx % 4) ? `2px solid ${taskColor}44` : 'none',
                outlineOffset: 1,
                transition: 'all .3s',
              }} />
            ))}
          </div>
        </div>

        {/* Ring timer */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '20px 0 16px',
        }}>
          <div style={{ position: 'relative', width: 160, height: 160 }}>
            <TimerRing pct={pct} color={paused ? 'var(--text-3)' : taskColor} />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <p style={{
                margin: 0, fontSize: 40, fontWeight: 600,
                color: 'var(--text-1)', letterSpacing: '-0.03em',
                fontFamily: '"JetBrains Mono", monospace',
              }}>
                {fmt(remain)}
              </p>
              <p style={{ margin: '3px 0 0', fontSize: 11, color: 'var(--text-3)' }}>
                {paused ? 'paused' : 'focus'}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button className="btn" style={{ flex: 2 }} onClick={togglePause}>
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button className="btn btn-danger" style={{ flex: 1 }} onClick={endSession}>
            End
          </button>
        </div>

        <hr className="divider" />

        {/* Distraction log */}
        <div style={{ paddingTop: 16 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
          }}>
            <p className="section-label" style={{ margin: 0 }}>Log distraction</p>
            <span style={{
              fontSize: 11, fontWeight: 600, color: accentColor,
              background: accentColor + '18', padding: '1px 8px', borderRadius: 20,
            }}>
              {distractions}
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {DISTRACT_TYPES.map(type => (
              <button
                key={type}
                onClick={() => logDistract(type)}
                className="btn"
                style={{ fontSize: 11, padding: '5px 12px', borderRadius: 20 }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Render: wrap ───────────────────────────────────────────────────────────
  if (phase === 'wrap') return (
    <div style={{ padding: '24px 20px 0' }}>
      {/* Done indicator */}
      <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'var(--teal-50)', border: '0.5px solid var(--teal-100)',
          margin: '0 auto 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="var(--teal-600)" strokeWidth="2.2" strokeLinecap="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--text-1)' }}>
          Session complete
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-3)' }}>
          {elapsed}m · {distractions} distraction{distractions !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8, marginBottom: 20 }}>
        {[
          { label: 'Duration',     value: `${elapsed}m` },
          { label: 'Distractions', value: distractions },
          { label: 'Quality',      value: rating || '—' },
        ].map(s => (
          <div key={s.label} className="metric-card" style={{ textAlign: 'center' }}>
            <p className="metric-value" style={{ fontSize: 20 }}>{s.value}</p>
            <p className="metric-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quality rating */}
      <p className="section-label">Rate this session</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['Deep', 'Good', 'Patchy'].map(r => (
          <button
            key={r}
            className={`btn${rating === r ? ' btn-primary' : ''}`}
            style={{ flex: 1, fontSize: 13 }}
            onClick={() => setRating(r)}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Note */}
      <p className="section-label">Session note</p>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="What did you get done? Any blockers?"
        rows={3}
        style={{
          width: '100%', border: '0.5px solid var(--border-md)',
          borderRadius: 10, padding: '10px 12px', fontSize: 13,
          color: 'var(--text-1)', background: 'var(--surface)',
          outline: 'none', fontFamily: 'inherit', resize: 'none',
          lineHeight: 1.5, marginBottom: 16, boxSizing: 'border-box',
        }}
      />

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn" style={{ flex: 1 }} onClick={startBreak}>
          Take break
        </button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveSession}>
          Save &amp; finish
        </button>
      </div>
    </div>
  )

  // ── Render: break ──────────────────────────────────────────────────────────
  if (phase === 'break') return (
    <div style={{ padding: '24px 20px 0', textAlign: 'center' }}>
      <p className="page-title" style={{ marginBottom: 6 }}>Break time</p>
      <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 24 }}>
        Step away from the screen
      </p>

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '16px 0 28px',
      }}>
        <div style={{ position: 'relative', width: 130, height: 130 }}>
          <TimerRing pct={breakRemain / 600} color="var(--teal-400)" size={130} r={56} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <p style={{
              margin: 0, fontSize: 32, fontWeight: 600,
              color: 'var(--text-1)', letterSpacing: '-0.02em',
              fontFamily: '"JetBrains Mono", monospace',
            }}>
              {fmt(breakRemain)}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-3)' }}>break</p>
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary btn-full"
        style={{ fontSize: 14, padding: 13 }}
        onClick={() => { clearInterval(intervalRef.current); resetToSetup() }}
      >
        Skip break — start next session
      </button>
    </div>
  )

  return null
}
