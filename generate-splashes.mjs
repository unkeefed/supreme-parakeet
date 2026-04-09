/**
 * generate-splashes.mjs
 * Run: node generate-splashes.mjs
 * Generates minimal iOS splash screens in public/icons/
 * Uses canvas (npm install canvas) or falls back to SVG placeholders.
 *
 * For production, use https://progressier.com or https://appsco.pe/developer/splash-screens
 * to generate pixel-perfect splash screens from your icon.
 */

import { createCanvas } from 'canvas'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SIZES = [
  { w: 430, h: 932,  name: 'splash-430x932.png'  },  // iPhone 15 Pro Max
  { w: 390, h: 844,  name: 'splash-390x844.png'  },  // iPhone 14
  { w: 375, h: 667,  name: 'splash-375x667.png'  },  // iPhone SE
]

const BG    = '#0f0f13'
const ICON  = '#7F77DD'
const SCALE = 3 // @3x

async function generate() {
  const outDir = join(__dirname, 'public', 'icons')
  mkdirSync(outDir, { recursive: true })

  for (const { w, h, name } of SIZES) {
    const pw = w * SCALE
    const ph = h * SCALE
    const canvas = createCanvas(pw, ph)
    const ctx    = canvas.getContext('2d')

    // Background
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, pw, ph)

    // Centre icon circle
    const cx = pw / 2
    const cy = ph / 2
    const r  = Math.min(pw, ph) * 0.12

    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = ICON + '22'
    ctx.fill()

    // Clock hands (simplified logo)
    ctx.strokeStyle = ICON
    ctx.lineWidth   = r * 0.14
    ctx.lineCap     = 'round'

    // Circle outline
    ctx.beginPath()
    ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2)
    ctx.stroke()

    // Hour hand
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx, cy - r * 0.38)
    ctx.stroke()

    // Minute hand
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + r * 0.3, cy + r * 0.15)
    ctx.stroke()

    // App name
    ctx.fillStyle = '#e8e6f0'
    ctx.font      = `${Math.round(r * 0.55)}px -apple-system, system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('Apex Focus', cx, cy + r * 1.6)

    const buf = canvas.toBuffer('image/png')
    writeFileSync(join(outDir, name), buf)
    console.log(`✓ ${name} (${pw}×${ph})`)
  }
}

generate().catch(err => {
  console.warn('canvas module not available — creating SVG fallbacks instead')
  console.warn(err.message)

  const { mkdirSync, writeFileSync } = await import('fs').catch(() => require('fs'))
  const outDir = join(__dirname, 'public', 'icons')
  mkdirSync(outDir, { recursive: true })

  for (const { w, h, name } of SIZES) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w*3}" height="${h*3}">
  <rect width="100%" height="100%" fill="#0f0f13"/>
  <circle cx="${w*3/2}" cy="${h*3/2}" r="${Math.min(w,h)*0.3}" fill="#7F77DD22" stroke="#7F77DD" stroke-width="8"/>
  <text x="50%" y="${h*3/2 + Math.min(w,h)*0.18}" text-anchor="middle" fill="#e8e6f0" font-size="48" font-family="system-ui">Apex Focus</text>
</svg>`
    writeFileSync(join(outDir, name.replace('.png', '.svg')), svg)
  }
})
