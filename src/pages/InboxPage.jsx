import React, { useState, useRef } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, todayStr } from '../db/database.js'
import { useNavigate } from 'react-router-dom'

const PRIORITIES = { high: '#D85A30', medium: '#BA7517', low: '#9896B0' }

function CtxDot({ color, size = 8 }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: size, height: size,
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
      }}
    />
  )
}

function TaskRow({ task, contexts, onToggle, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const ctx = contexts?.find(c => c.id === task.context)

  return (
    <div
      className="fade-up"
      style={{
        borderBottom: '0.5px solid var(--border)',
        opacity: task.status === 'done' ? 0.5 : 1,
        transition: 'opacity .2s',
      }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '11px 0', cursor: 'pointer',
        }}
        onClick={() => setExpanded(e => !e)}
      >
        {/* Checkbox */}
        <button
          onClick={e => { e.stopPropagation(); onToggle(task) }}
          style={{
            width: 18, height: 18,
            borderRadius: '50%',
            border: `1.5px solid ${task.status === 'done' ? 'var(--teal-400)' : 'var(--border-md)'}`,
            background: task.status === 'done' ? 'var(--teal-400)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, cursor: 'pointer', transition: 'all .15s',
          }}
        >
          {task.status === 'done' && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        {/* Priority dot */}
        <span
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: PRIORITIES[task.priority] || PRIORITIES.low,
            flexShrink: 0,
          }}
        />

        {/* Title + context */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin: 0, fontSize: 13, fontWeight: 500,
            color: 'var(--text-1)',
            textDecoration: task.status === 'done' ? 'line-through' : 'none',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {task.title}
          </p>
          {ctx && (
            <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-3)' }}>
              {ctx.label}
            </p>
          )}
        </div>

        {/* Est + tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {task.estimateMins && (
            <span style={{
              fontSize: 10, color: 'var(--text-3)',
              background: 'var(--bg)', padding: '1px 6px', borderRadius: 10,
            }}>
              {task.estimateMins}m
            </span>
          )}
          {ctx && (
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '2px 7px',
              borderRadius: 20, letterSpacing: '0.03em',
              background: ctx.color + '22',
              color: ctx.color,
            }}>
              {ctx.label}
            </span>
          )}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{
          padding: '0 0 12px 28px',
          display: 'flex', gap: 8, flexWrap: 'wrap',
        }}>
          <button
            className="btn"
            style={{ fontSize: 12, padding: '5px 12px' }}
            onClick={() => db.tasks.update(task.id, {
              priority: task.priority === 'high' ? 'medium'
                      : task.priority === 'medium' ? 'low' : 'high'
            })}
          >
            Priority: {task.priority || 'low'}
          </button>
          <button
            className="btn"
            style={{ fontSize: 12, padding: '5px 12px' }}
            onClick={() => db.tasks.update(task.id, {
              dueDate: task.dueDate ? null : todayStr()
            })}
          >
            {task.dueDate === todayStr() ? '✓ Today' : 'Move to today'}
          </button>
          <button
            className="btn btn-danger"
            style={{ fontSize: 12, padding: '5px 12px' }}
            onClick={() => onDelete(task.id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default function InboxPage() {
  const navigate = useNavigate()
  const [filterCtx, setFilterCtx]   = useState('all')
  const [filterDate, setFilterDate] = useState('today')
  const [quickAdd, setQuickAdd]     = useState('')
  const inputRef = useRef(null)

  const today = todayStr()

  const contexts = useLiveQuery(() => db.contexts.orderBy('order').toArray())

  const tasks = useLiveQuery(async () => {
    let q = db.tasks.orderBy('createdAt').reverse()
    return q.toArray()
  }, [])

  const filtered = tasks?.filter(t => {
    if (filterCtx !== 'all' && t.context !== filterCtx) return false
    if (filterDate === 'today' && t.dueDate !== today && t.status !== 'done') {
      // show done tasks regardless, backlog tasks hidden
      if (t.status !== 'done') return false
    }
    return true
  })

  const todayTasks    = filtered?.filter(t => t.dueDate === today || t.status === 'done' && t.dueDate === today) || []
  const backlogTasks  = filtered?.filter(t => t.dueDate !== today && t.status !== 'done') || []

  async function handleQuickAdd(e) {
    if (e.key !== 'Enter' || !quickAdd.trim()) return
    await db.tasks.add({
      title:        quickAdd.trim(),
      context:      contexts?.[0]?.id || 'study',
      priority:     'low',
      estimateMins: null,
      status:       'todo',
      dueDate:      today,
      createdAt:    new Date().toISOString(),
    })
    setQuickAdd('')
  }

  async function handleToggle(task) {
    await db.tasks.update(task.id, {
      status: task.status === 'done' ? 'todo' : 'done'
    })
  }

  async function handleDelete(id) {
    await db.tasks.delete(id)
  }

  const remaining = todayTasks.filter(t => t.status !== 'done')
  const totalMins = remaining.reduce((s, t) => s + (t.estimateMins || 0), 0)
  const totalHrs  = totalMins >= 60
    ? `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`
    : `${totalMins}m`

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ paddingTop: 24 }}>
        <div>
          <p className="page-title">Tasks</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-3)' }}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
          </p>
        </div>
        <button
          className="btn btn-primary"
          style={{ fontSize: 12, padding: '7px 14px' }}
          onClick={() => navigate('/focus')}
        >
          Start session →
        </button>
      </div>

      <div style={{ padding: '16px 20px 0' }}>
        {/* Quick add */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--surface)', border: '0.5px solid var(--border)',
          borderRadius: 12, padding: '0 14px', marginBottom: 14,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <input
            ref={inputRef}
            value={quickAdd}
            onChange={e => setQuickAdd(e.target.value)}
            onKeyDown={handleQuickAdd}
            placeholder="Add task — press Enter to save"
            style={{
              flex: 1, border: 'none', outline: 'none',
              background: 'transparent', fontSize: 13,
              color: 'var(--text-1)', padding: '11px 0',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {/* Context pills */}
          <button
            onClick={() => setFilterCtx('all')}
            style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 20, border: 'none',
              background: filterCtx === 'all' ? 'var(--accent)' : 'var(--bg)',
              color: filterCtx === 'all' ? '#fff' : 'var(--text-3)',
              cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
            }}
          >
            All
          </button>
          {contexts?.map(ctx => (
            <button
              key={ctx.id}
              onClick={() => setFilterCtx(filterCtx === ctx.id ? 'all' : ctx.id)}
              style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 20,
                border: `0.5px solid ${filterCtx === ctx.id ? ctx.color : 'transparent'}`,
                background: filterCtx === ctx.id ? ctx.color + '18' : 'var(--bg)',
                color: filterCtx === ctx.id ? ctx.color : 'var(--text-3)',
                cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <CtxDot color={ctx.color} size={6} />
              {ctx.label}
            </button>
          ))}

          {/* Today/All toggle */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            {['today', 'all'].map(v => (
              <button
                key={v}
                onClick={() => setFilterDate(v)}
                style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 20,
                  border: '0.5px solid var(--border)',
                  background: filterDate === v ? 'var(--bg)' : 'transparent',
                  color: filterDate === v ? 'var(--text-1)' : 'var(--text-3)',
                  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
                }}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task list */}
      <div style={{ padding: '0 20px' }}>
        <div className="card-padded">

          {/* Today section */}
          <p className="section-label" style={{ marginBottom: 0 }}>Today</p>
          {todayTasks.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--text-3)', padding: '12px 0', margin: 0 }}>
              No tasks for today — add one above.
            </p>
          )}
          {todayTasks.map(t => (
            <TaskRow
              key={t.id}
              task={t}
              contexts={contexts}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}

          {/* Backlog section */}
          {filterDate === 'all' && backlogTasks.length > 0 && (
            <>
              <p className="section-label" style={{ marginTop: 16 }}>Backlog</p>
              {backlogTasks.map(t => (
                <TaskRow
                  key={t.id}
                  task={t}
                  contexts={contexts}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 4px',
          fontSize: 12, color: 'var(--text-3)',
        }}>
          <span>
            {remaining.length} task{remaining.length !== 1 ? 's' : ''} · {totalHrs} remaining
          </span>
          <button
            style={{
              fontSize: 12, color: 'var(--accent)', background: 'none',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}
            onClick={() => navigate('/focus')}
          >
            Plan my day →
          </button>
        </div>
      </div>
    </div>
  )
}
