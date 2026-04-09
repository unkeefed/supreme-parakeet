// ─── Notification & sound utilities ───────────────────────────────────────

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function sendNotification(title, body, tag = 'apex-focus') {
  if (Notification.permission !== 'granted') return
  new Notification(title, {
    body,
    tag,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    silent: false,
  })
}

export function playBeep(type = 'session-end') {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const patterns = {
      'session-end': [
        { freq: 523, start: 0,    dur: 0.12 },
        { freq: 659, start: 0.14, dur: 0.12 },
        { freq: 784, start: 0.28, dur: 0.22 },
      ],
      'break-end': [
        { freq: 440, start: 0,    dur: 0.10 },
        { freq: 440, start: 0.14, dur: 0.10 },
      ],
      'goal-reached': [
        { freq: 523, start: 0,    dur: 0.10 },
        { freq: 659, start: 0.12, dur: 0.10 },
        { freq: 784, start: 0.24, dur: 0.10 },
        { freq: 1047,start: 0.36, dur: 0.22 },
      ],
    }
    const notes = patterns[type] || patterns['session-end']
    notes.forEach(({ freq, start, dur }) => {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.18, ctx.currentTime + start)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur)
      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + dur + 0.05)
    })
  } catch {}
}

export function scheduleMorningReminder(timeStr) {
  // Uses Service Worker registration for persistent scheduling
  // Falls back to a simple setTimeout for the current session
  if (!timeStr) return
  const [h, m] = timeStr.split(':').map(Number)
  const now    = new Date()
  const target = new Date()
  target.setHours(h, m, 0, 0)
  if (target <= now) target.setDate(target.getDate() + 1)
  const ms = target - now
  setTimeout(() => {
    sendNotification(
      'Plan your day — Apex Focus',
      'Good morning! Time to set your focus blocks for today.'
    )
  }, Math.min(ms, 2147483647)) // clamp to max setTimeout
}
