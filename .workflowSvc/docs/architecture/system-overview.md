# System Overview

> This document summarizes the live FocusTimer application codebase.

---

## Analysis Date

2026-03-14

## Technical Stack

- React 18
- TypeScript 5
- Vite 5
- Zustand 4
- Chart.js 4 with `react-chartjs-2`
- localStorage for persistence in the current MVP

## Directory Shape

```text
src/
├── components/
├── screens/
├── store/
├── types/
└── utils/
```

## Main Modules

| Path | Role |
| ---- | ---- |
| `src/main.tsx` | Boots the React app and mounts `App` into `#root`. |
| `src/App.tsx` | Switches between screens using `appStore` and keeps navigation plus interstitial UI mounted. |
| `src/store/appStore.ts` | Manages the active screen and interstitial visibility. |
| `src/store/timerStore.ts` | Manages Pomodoro mode, timer status, countdown state, and completed sessions. |
| `src/store/studyStore.ts` | Aggregates study records, exposes day and range summaries, and persists them to localStorage. |
| `src/store/goalStore.ts` | Persists and updates the daily study goal. |
| `src/screens/TimerScreen.tsx` | Runs the countdown loop, records completed sessions, and triggers interstitial placeholders. |
| `src/screens/StatisticsScreen.tsx` | Renders weekly and monthly study charts plus summary metrics. |
| `src/utils/storage.ts` | Reads and writes study records and goals from localStorage. |
| `src/components/BannerAd.tsx` | Renders the current banner placeholder for future AdMob integration. |

## Entry Points

- App bootstrap: `src/main.tsx`
- Root UI composition: `src/App.tsx`
- Screen state entry: `useAppStore()` in `src/store/appStore.ts`

## Dependencies

- Runtime: `react`, `react-dom`, `zustand`, `chart.js`, `react-chartjs-2`
- Tooling: `vite`, `typescript`, `@vitejs/plugin-react`
- Planned tooling additions for workflow support: ESLint with TypeScript rules

## Data Flow

```text
User interaction
  -> Screen component
  -> Zustand store action
  -> localStorage helper (study records / goals)
  -> Store state update
  -> UI rerender
```

Timer completion follows a slightly richer path:

```text
TimerScreen interval
  -> timerStore.tick()
  -> completed focus session returned
  -> studyStore.addSession(session)
  -> storage.ts saves updated records
  -> appStore.triggerInterstitial()
  -> App renders the interstitial placeholder
```

## Constraints And Notes

- AdMob is currently represented by placeholder components only; no native SDK is wired yet.
- Capacitor configuration exists, but native packaging is not part of the current MVP implementation.
- Persistence is localStorage-only in the current code. SQLite is still a later-phase concern.
- The app uses store-driven screen switching instead of a router.
- There are currently no dedicated unit test files in the repository.
