# PRD - FocusTimer

**Version:** 0.1  
**Type:** MVP  
**Primary Platforms:** Web MVP first, with later mobile packaging support  
**Monetization:** Ad placeholders in MVP, native AdMob integration in a later phase

---

## 1. Product Overview

FocusTimer is a study-focused Pomodoro app that helps users measure focus time,
review their study history, and stay aligned to a daily goal.

## 2. Target Users

- Students who want a simple focus timer with progress tracking
- Learners preparing for exams or certifications
- Self-directed workers who want lightweight study-time analytics

## 3. Core Value Proposition

- Start a focused study session quickly
- Keep a persistent record of completed study time
- Review trends through simple charts
- Stay accountable with a daily time goal

## 4. Core Features (MVP)

### 4.1 Focus Timer

- 25-minute focus sessions
- 5-minute break sessions
- Start, pause, reset, and automatic mode switching

### 4.2 Study Time Record

- Save completed focus sessions
- Aggregate minutes by day
- Retain study history in browser storage

### 4.3 Statistics Dashboard

- Today's total study minutes
- 7-day summary
- 30-day trend view

### 4.4 Study Goal

- Set a daily goal in minutes
- Show progress toward that goal on the home screen

## 5. Monetization

### MVP

- Banner and interstitial ad placeholders only
- No native ad SDK shipping requirement

### Phase 2

- Real Google AdMob SDK integration
- Native ad lifecycle handling and production ad unit IDs

## 6. Screens

- Home
- Timer
- Statistics
- Goal settings

## 7. UX Flow

```text
Open app
  -> Review today's progress
  -> Start timer
  -> Complete focus session
  -> Save record
  -> Review updated statistics
```

## 8. Data Storage

### MVP

- localStorage for study records and goals

### Phase 2

- SQLite for richer offline persistence if native packaging requires it
- Optional sync strategy can be evaluated later

## 9. Technical Stack

### MVP

- React
- TypeScript
- Vite
- Zustand
- Chart.js
- localStorage

### Phase 2

- Capacitor for native packaging
- AdMob SDK for real ad delivery
- SQLite for native-first persistence

## 10. Future AI Features

- Study coaching suggestions
- Focus-pattern analysis
- Personalized study-plan recommendations

## 11. Success Metrics

- Daily active usage
- Sessions completed per day
- 7-day retention
- Ad revenue after native ad rollout

## 12. MVP Scope

### Included In MVP

- Timer
- Study record persistence
- Statistics dashboard
- Goal management
- Placeholder banner and interstitial ad surfaces

### Explicitly Out Of MVP

- User accounts and cloud sync
- AI-driven recommendations
- Native Capacitor packaging
- Real AdMob SDK integration
- SQLite persistence

## 13. Development Timeline

- Week 1: core timer and home flow
- Week 2: storage and statistics
- Week 3: goals and ad placeholders

## 14. Risks

- Users may drop off if progress feedback feels too shallow
- Placeholder ad surfaces should not be mistaken for production monetization
- localStorage-only persistence limits device portability

## 15. MVP Definition of Done

The MVP is complete when:

- The Pomodoro timer runs with focus and break modes
- Completed focus sessions are saved locally
- Statistics render from saved study records
- Users can set and review a daily goal
- Placeholder ad components exist in the UI
- The app runs as a web MVP without requiring Capacitor, SQLite, or the AdMob SDK
