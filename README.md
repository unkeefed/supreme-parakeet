# Apex Focus

Deep work session tracker — companion app to your Life Dashboard.

## Stack
- **Vite** + **React 18** — fast dev server, instant HMR
- **Tailwind CSS** — utility styles + custom design tokens
- **Dexie.js** — IndexedDB wrapper, shared with life dashboard
- **dexie-react-hooks** — `useLiveQuery` for reactive UI
- **vite-plugin-pwa** — service worker, offline cache, installable

## Quick start

```bash
# 1. Install
npm install

# 2. Dev server (auto-opens on http://localhost:5173)
npm run dev

# 3. Test on your phone (same WiFi)
# Dev server will print a network URL like http://192.168.x.x:5173
# Open that on your phone

# 4. Build for production
npm run build

# 5. Deploy to Netlify (drag the dist/ folder to netlify.com/drop)
# or: npx netlify-cli deploy --prod --dir dist
```

## Project structure

```
src/
  db/
    database.js       ← Dexie schema + helpers (start here)
  pages/
    InboxPage.jsx     ← Task inbox with CRUD + filtering
    FocusPage.jsx     ← 4-state session engine (setup→active→wrap→break)
    InsightsPage.jsx  ← Week/day metrics, heatmap, bar chart
    SettingsPage.jsx  ← 5-panel settings, reads/writes Dexie
  App.jsx             ← Bottom nav shell + routing
  main.jsx            ← Entry point, seeds DB defaults
  index.css           ← Design tokens, global styles
```

## Database schema

All data lives in IndexedDB under the `ApexFocus` database.

| Table | Purpose |
|---|---|
| `tasks` | Task inbox — title, context, priority, status, dueDate |
| `focus_sessions` | Session records — taskId, elapsedMins, distractions, quality |
| `time_blocks` | Day planner blocks — taskId, date, startTime, endTime |
| `settings` | Key-value store — all app preferences |
| `contexts` | User-defined task contexts with colour |

## Week-by-week build plan

| Week | What to build |
|---|---|
| 1 ✓ | Scaffold, Dexie schema, app shell, deploy |
| 2 ✓ | Task inbox (CRUD, filters, quick-add) — InboxPage done |
| 3 ✓ | Focus session engine — FocusPage done |
| 4 | Day planner (hourly grid, time blocks) |
| 5 | Insights charts (Chart.js bar + heatmap) |
| 6 | Settings persistence + dashboard sync |
| 7 | Gemini AI integration |
| 8 | Weekly review, PWA polish, notifications |

## Adding Gemini AI (Week 7)

1. Get a free key at https://aistudio.google.com
2. Paste it into Settings → AI → API key
3. The `aiKey` setting is read by the AI util in `src/utils/ai.js` (to be built in Week 7)

## Sharing the DB with your life dashboard

Both apps must use the same Dexie database name: `ApexFocus`.
In your life dashboard, open the DB read-only:

```js
import Dexie from 'dexie'
const focusDb = new Dexie('ApexFocus')
focusDb.version(1).stores({ focus_sessions: '++id, taskId, goalId, date' })
// then query as normal
const todaySessions = await focusDb.focus_sessions.where('date').equals(todayStr()).toArray()
```
