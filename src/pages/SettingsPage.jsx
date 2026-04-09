import React, { useState, useEffect } from 'react'
import { db, getSetting, setSetting } from '../db/database.js'
import { useLiveQuery } from 'dexie-react-hooks'

const PANELS = [
  { id: 'session',  label: 'Session' },
  { id: 'contexts', label: 'Contexts' },
  { id: 'alerts',   label: 'Alerts' },
  { id: 'sync',     label: 'Sync' },
  { id: 'ai',       label: 'AI' },
]

const ACCENT_COLORS = ['#7F77DD','#1D9E75','#D85A30','#D4537E','#378ADD']
const DAYS = ['M','T','W','T','F','S','S']

function Toggle({ value, onChange }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
      <div className="toggle-track" />
      <div className="toggle-thumb" />
    </label>
  )
}

function SettingRow({ label, hint, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 0', borderBottom: '0.5px solid var(--border)', gap: 16,
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-1)' }}>{label}</p>
        {hint && <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-3)' }}>{hint}</p>}
      </div>
      {children}
    </div>
  )
}

function NumInput({ value, onChange, min, max, step = 1, suffix }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <input
        type="number" value={value} min={min} max={max} step={step}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width: 60, textAlign: 'center', fontSize: 13,
          padding: '5px 8px', border: '0.5px solid var(--border-md)',
          borderRadius: 8, background: 'var(--surface)', color: 'var(--text-1)',
          outline: 'none', fontFamily: 'inherit',
        }}
      />
      {suffix && <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{suffix}</span>}
    </div>
  )
}

export default function SettingsPage() {
  const [panel, setPanel] = useState('session')
  const [saved, setSaved]  = useState(false)

  // Local state mirrors DB — loaded on mount
  const [s, setS] = useState({
    defaultDuration: 50,
    breakMins: 10,
    longBreakMins: 30,
    longBreakAfter: 4,
    dailyGoalHours: 4,
    activeDays: [1,2,3,4,5],
    accentColor: '#7F77DD',
    showRing: true,
    autoStartBreak: false,
    autoStartSession: false,
    soundEnabled: true,
    morningReminder: '08:30',
    morningReminderOn: true,
    syncStudy: true,
    syncHabits: true,
    syncGoals: true,
    syncMood: false,
    aiProvider: 'gemini',
    aiKey: '',
    aiMorning: true,
    aiWeekly: true,
    aiDistractions: true,
    aiReschedule: false,
  })

  const contexts = useLiveQuery(() => db.contexts.orderBy('order').toArray())

  // Load all settings from DB on mount
  useEffect(() => {
    const keys = Object.keys(s)
    Promise.all(keys.map(k => getSetting(k))).then(vals => {
      const loaded = {}
      keys.forEach((k, i) => { if (vals[i] !== null) loaded[k] = vals[i] })
      setS(prev => ({ ...prev, ...loaded }))
    })
  }, [])

  function set(key, val) { setS(prev => ({ ...prev, [key]: val })) }

  async function save() {
    await Promise.all(Object.entries(s).map(([k, v]) => setSetting(k, v)))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function toggleDay(idx) {
    const days = s.activeDays.includes(idx)
      ? s.activeDays.filter(d => d !== idx)
      : [...s.activeDays, idx].sort()
    set('activeDays', days)
  }

  async function addContext() {
    const colors = ACCENT_COLORS
    const id = 'context_' + Date.now()
    const order = (contexts?.length || 0)
    await db.contexts.add({ id, label: 'New context', color: colors[order % colors.length], order })
  }

  async function removeContext(id) {
    await db.contexts.delete(id)
  }

  return (
    <div style={{ padding: '24px 0 0' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', marginBottom: 16,
      }}>
        <p className="page-title">Settings</p>
        <button
          className="btn btn-primary"
          style={{ fontSize: 12, padding: '7px 16px' }}
          onClick={save}
        >
          {saved ? '✓ Saved' : 'Save'}
        </button>
      </div>

      {/* Panel nav */}
      <div style={{
        display: 'flex', gap: 0,
        borderBottom: '0.5px solid var(--border)',
        overflowX: 'auto', padding: '0 20px',
      }}>
        {PANELS.map(p => (
          <button
            key={p.id}
            onClick={() => setPanel(p.id)}
            style={{
              flex: 'none', padding: '8px 14px', fontSize: 12,
              fontWeight: 500, border: 'none', background: 'none',
              cursor: 'pointer', fontFamily: 'inherit',
              color: panel === p.id ? 'var(--accent)' : 'var(--text-3)',
              borderBottom: `2px solid ${panel === p.id ? 'var(--accent)' : 'transparent'}`,
              transition: 'all .15s', whiteSpace: 'nowrap',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px 20px 0' }}>

        {/* ── Session panel ──────────────────────────────────────────────────── */}
        {panel === 'session' && (
          <>
            <p className="section-label">Timer</p>
            <div className="card-padded" style={{ marginBottom: 16 }}>
              <SettingRow label="Default length" hint="When starting a new session">
                <div className="seg-ctrl">
                  {[25,50,90].map(d => (
                    <button key={d} className={`seg-btn${s.defaultDuration === d ? ' active' : ''}`}
                      onClick={() => set('defaultDuration', d)}>
                      {d}m
                    </button>
                  ))}
                </div>
              </SettingRow>
              <SettingRow label="Break length" hint="After each session">
                <NumInput value={s.breakMins} onChange={v => set('breakMins', v)} min={5} max={30} step={5} suffix="min" />
              </SettingRow>
              <SettingRow label="Long break after" hint="Sessions before long break">
                <NumInput value={s.longBreakAfter} onChange={v => set('longBreakAfter', v)} min={2} max={8} suffix="sessions" />
              </SettingRow>
              <SettingRow label="Long break length">
                <NumInput value={s.longBreakMins} onChange={v => set('longBreakMins', v)} min={15} max={60} step={5} suffix="min" />
              </SettingRow>
              <SettingRow label="Show countdown ring">
                <Toggle value={s.showRing} onChange={v => set('showRing', v)} />
              </SettingRow>
              <SettingRow label="Auto-start break" hint="After session ends">
                <Toggle value={s.autoStartBreak} onChange={v => set('autoStartBreak', v)} />
              </SettingRow>
              <div style={{ paddingTop: 12, paddingBottom: 0 }}>
                <SettingRow label="Auto-start next session">
                  <Toggle value={s.autoStartSession} onChange={v => set('autoStartSession', v)} />
                </SettingRow>
              </div>
            </div>

            <p className="section-label">Daily target</p>
            <div className="card-padded">
              <SettingRow label="Daily focus goal" hint="Used for streak and insights">
                <NumInput value={s.dailyGoalHours} onChange={v => set('dailyGoalHours', v)} min={1} max={12} step={0.5} suffix="hours" />
              </SettingRow>
              <SettingRow label="Active days" hint="Count toward streak">
                <div style={{ display: 'flex', gap: 4 }}>
                  {DAYS.map((d, i) => {
                    // Day indices: 0=Sun, convert to Mon=1…
                    const dayNum = i === 6 ? 0 : i + 1
                    const on = s.activeDays.includes(dayNum)
                    return (
                      <button key={i} onClick={() => toggleDay(dayNum)} style={{
                        width: 26, height: 26, borderRadius: 6, fontSize: 11,
                        fontWeight: 500, border: '0.5px solid var(--border)',
                        background: on ? 'var(--accent)' : 'transparent',
                        color: on ? '#fff' : 'var(--text-3)',
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}>
                        {d}
                      </button>
                    )
                  })}
                </div>
              </SettingRow>
            </div>
          </>
        )}

        {/* ── Contexts panel ─────────────────────────────────────────────────── */}
        {panel === 'contexts' && (
          <>
            <p className="section-label">Task contexts</p>
            <div className="card-padded" style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: 'var(--text-3)', margin: '0 0 14px' }}>
                Contexts group tasks and colour-code them across the inbox, planner, and insights.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {contexts?.map(ctx => (
                  <div key={ctx.id} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: ctx.color + '14', border: `0.5px solid ${ctx.color}`,
                    borderRadius: 20, padding: '5px 12px',
                  }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: ctx.color, flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 12, color: 'var(--text-1)' }}>{ctx.label}</span>
                    <button
                      onClick={() => removeContext(ctx.id)}
                      style={{
                        fontSize: 14, color: 'var(--text-3)', background: 'none',
                        border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={addContext}
                  style={{
                    fontSize: 12, color: 'var(--accent)',
                    background: 'none', border: `0.5px dashed ${ACCENT_COLORS[0]}`,
                    borderRadius: 20, padding: '5px 14px', cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  + New context
                </button>
              </div>
            </div>

            <p className="section-label">Accent colour</p>
            <div className="card-padded">
              <SettingRow label="App accent" hint="Timer ring and active states">
                <div style={{ display: 'flex', gap: 8 }}>
                  {ACCENT_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => set('accentColor', c)}
                      style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: c, border: 'none', cursor: 'pointer',
                        outline: s.accentColor === c ? `2px solid ${c}` : 'none',
                        outlineOffset: 2,
                      }}
                    />
                  ))}
                </div>
              </SettingRow>
            </div>
          </>
        )}

        {/* ── Alerts panel ───────────────────────────────────────────────────── */}
        {panel === 'alerts' && (
          <>
            <p className="section-label">Sounds & notifications</p>
            <div className="card-padded">
              <SettingRow label="Session end sound">
                <Toggle value={s.soundEnabled} onChange={v => set('soundEnabled', v)} />
              </SettingRow>
              <SettingRow label="Morning planning reminder">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="time" value={s.morningReminder}
                    onChange={e => set('morningReminder', e.target.value)}
                    style={{
                      fontSize: 12, padding: '4px 8px',
                      border: '0.5px solid var(--border-md)',
                      borderRadius: 8, background: 'var(--surface)',
                      color: 'var(--text-1)', outline: 'none',
                    }}
                  />
                  <Toggle value={s.morningReminderOn} onChange={v => set('morningReminderOn', v)} />
                </div>
              </SettingRow>
            </div>
          </>
        )}

        {/* ── Sync panel ─────────────────────────────────────────────────────── */}
        {panel === 'sync' && (
          <>
            <p className="section-label">Life dashboard sync</p>
            <div className="card-padded" style={{ marginBottom: 12 }}>
              {[
                { key: 'syncStudy',  label: 'Study module',  hint: 'Auto-log focus hours as study time' },
                { key: 'syncHabits', label: 'Habits module', hint: 'Auto-check "deep work" habit' },
                { key: 'syncGoals',  label: 'Goals module',  hint: 'Update goal progress from sessions' },
                { key: 'syncMood',   label: 'Mood module',   hint: 'Attach session quality to mood entries' },
              ].map(({ key, label, hint }) => (
                <SettingRow key={key} label={label} hint={hint}>
                  <Toggle value={s[key]} onChange={v => set(key, v)} />
                </SettingRow>
              ))}
            </div>
            <div style={{
              background: 'var(--surface)', border: '0.5px solid var(--border)',
              borderRadius: 12, padding: '10px 14px',
              fontSize: 12, color: 'var(--text-3)',
            }}>
              Syncs to the shared ApexFocus IndexedDB — no network required.
            </div>
          </>
        )}

        {/* ── AI panel ───────────────────────────────────────────────────────── */}
        {panel === 'ai' && (
          <>
            <p className="section-label">AI features</p>
            <div className="card-padded" style={{ marginBottom: 16 }}>
              {[
                { key: 'aiMorning',      label: 'Morning prioritisation',  hint: 'Suggests top 3 tasks each morning' },
                { key: 'aiWeekly',       label: 'Weekly review summary',   hint: 'Auto-generated Sunday digest' },
                { key: 'aiDistractions', label: 'Distraction pattern alerts', hint: 'Flags when rate spikes' },
                { key: 'aiReschedule',   label: 'Smart rescheduling',      hint: 'Suggests replanning when late' },
              ].map(({ key, label, hint }) => (
                <SettingRow key={key} label={label} hint={hint}>
                  <Toggle value={s[key]} onChange={v => set(key, v)} />
                </SettingRow>
              ))}
            </div>

            <p className="section-label">API key</p>
            <div className="card-padded" style={{ marginBottom: 12 }}>
              <SettingRow label="Provider">
                <div className="seg-ctrl">
                  {['gemini','openai'].map(p => (
                    <button key={p} className={`seg-btn${s.aiProvider === p ? ' active' : ''}`}
                      onClick={() => set('aiProvider', p)}
                      style={{ textTransform: 'capitalize' }}>
                      {p === 'gemini' ? 'Gemini' : 'OpenAI'}
                    </button>
                  ))}
                </div>
              </SettingRow>
              <SettingRow label="API key">
                <input
                  type="password"
                  value={s.aiKey}
                  onChange={e => set('aiKey', e.target.value)}
                  placeholder="Paste key here"
                  style={{
                    fontSize: 12, padding: '5px 10px', width: 160,
                    border: '0.5px solid var(--border-md)',
                    borderRadius: 8, background: 'var(--surface)',
                    color: 'var(--text-1)', outline: 'none',
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                />
              </SettingRow>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-3)', margin: 0 }}>
              Get a free Gemini key at{' '}
              <a href="https://aistudio.google.com" target="_blank" rel="noreferrer"
                style={{ color: 'var(--accent)' }}>
                aistudio.google.com
              </a>
              {' '}— use the gemini-2.5-flash model.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
