import { create } from 'zustand'
import type { FocusSession, TimerMode, TimerStatus } from '../types'
import { BREAK_DURATION, FOCUS_DURATION } from '../types'
import { trackEvent } from '../utils/analytics'

interface SavedModeState {
  timeLeft: number
  sessionStart: number | null
}

interface TimerState {
  mode: TimerMode
  status: TimerStatus
  timeLeft: number
  sessionStart: number | null
  completedToday: number
  backgroundedAt: number | null
  lastCompletionAt: number | null
  lastCompletedMode: TimerMode | null
  lastCompletedSession: FocusSession | null
  savedModeState: Record<TimerMode, SavedModeState | null>
  start: () => void
  pause: () => void
  reset: () => void
  tick: () => FocusSession | null
  switchMode: (mode: TimerMode) => void
  onBackground: () => void
  onForeground: () => void
}

function getDurationForMode(mode: TimerMode): number {
  return mode === 'focus' ? FOCUS_DURATION : BREAK_DURATION
}

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: 'focus',
  status: 'idle',
  timeLeft: FOCUS_DURATION,
  sessionStart: null,
  completedToday: 0,
  backgroundedAt: null,
  lastCompletionAt: null,
  lastCompletedMode: null,
  lastCompletedSession: null,
  savedModeState: {
    focus: null,
    break: null,
  },

  start: () => {
    const { status, mode } = get()

    if (status === 'idle') {
      set({ status: 'running', sessionStart: Date.now() })
      void trackEvent('timer_start', { mode })
      return
    }

    if (status === 'paused') {
      set({ status: 'running' })
      void trackEvent('timer_start', { mode, resumed: true })
    }
  },

  pause: () => {
    const { mode, timeLeft } = get()
    set({ status: 'paused' })
    void trackEvent('timer_pause', { mode, seconds_left: timeLeft })
  },

  reset: () => {
    const { mode, savedModeState } = get()
    set({
      status: 'idle',
      timeLeft: getDurationForMode(mode),
      sessionStart: null,
      backgroundedAt: null,
      savedModeState: {
        ...savedModeState,
        [mode]: null,
      },
    })
  },

  switchMode: (newMode) => {
    const { mode, status, timeLeft, sessionStart, savedModeState } = get()

    if (mode === newMode) {
      return
    }

    const shouldSave = status === 'running' || status === 'paused'
    const restoredState = savedModeState[newMode]

    set({
      mode: newMode,
      status: restoredState ? 'paused' : 'idle',
      timeLeft: restoredState ? restoredState.timeLeft : getDurationForMode(newMode),
      sessionStart: restoredState ? restoredState.sessionStart : null,
      backgroundedAt: null,
      savedModeState: {
        ...savedModeState,
        [mode]: shouldSave ? { timeLeft, sessionStart } : null,
        [newMode]: null,
      },
    })
  },

  onBackground: () => {
    const { status } = get()
    if (status === 'running') {
      set({ backgroundedAt: Date.now() })
    }
  },

  onForeground: () => {
    const { status, backgroundedAt, timeLeft, mode, sessionStart, completedToday, savedModeState } =
      get()
    if (status !== 'running' || backgroundedAt === null) {
      return
    }

    const elapsedSeconds = Math.floor((Date.now() - backgroundedAt) / 1000)
    const remaining = timeLeft - elapsedSeconds

    if (remaining <= 0) {
      let durationMinutes = 0
      let session: FocusSession | null = null

      if (mode === 'focus' && sessionStart) {
        const now = Date.now()
        const durationSeconds = Math.round((now - sessionStart) / 1000)
        durationMinutes = Math.max(1, Math.round(durationSeconds / 60))
        session = {
          id: `session_${now}`,
          startTime: sessionStart,
          endTime: now,
          duration: durationMinutes,
          date: new Date().toISOString().split('T')[0],
        }
        void trackEvent('timer_complete', {
          duration_minutes: durationMinutes,
          completed_today: completedToday + 1,
          completed_in_background: true,
        })
      }

      const nextMode: TimerMode = mode === 'focus' ? 'break' : 'focus'
      const completedAt = Date.now()
      set({
        mode: nextMode,
        status: 'running',
        timeLeft: getDurationForMode(nextMode),
        sessionStart: completedAt,
        backgroundedAt: null,
        completedToday: mode === 'focus' ? completedToday + 1 : completedToday,
        lastCompletionAt: completedAt,
        lastCompletedMode: mode,
        lastCompletedSession: session,
        savedModeState: {
          ...savedModeState,
          [mode]: null,
          [nextMode]: null,
        },
      })
      return
    }

    set({ timeLeft: remaining, backgroundedAt: null })
  },

  tick: (): FocusSession | null => {
    const { timeLeft, mode, sessionStart, completedToday, savedModeState } = get()

    if (timeLeft <= 1) {
      let session: FocusSession | null = null

      if (mode === 'focus' && sessionStart) {
        const now = Date.now()
        const durationSeconds = Math.round((now - sessionStart) / 1000)
        const durationMinutes = Math.max(1, Math.round(durationSeconds / 60))
        session = {
          id: `session_${now}`,
          startTime: sessionStart,
          endTime: now,
          duration: durationMinutes,
          date: new Date().toISOString().split('T')[0],
        }

        void trackEvent('timer_complete', {
          duration_minutes: durationMinutes,
          completed_today: completedToday + 1,
        })
      }

      const nextMode: TimerMode = mode === 'focus' ? 'break' : 'focus'
      const nextSessionStart = Date.now()
      set({
        mode: nextMode,
        status: 'running',
        timeLeft: getDurationForMode(nextMode),
        sessionStart: nextSessionStart,
        backgroundedAt: null,
        completedToday: mode === 'focus' ? completedToday + 1 : completedToday,
        lastCompletionAt: nextSessionStart,
        lastCompletedMode: mode,
        lastCompletedSession: session,
        savedModeState: {
          ...savedModeState,
          [mode]: null,
          [nextMode]: null,
        },
      })

      return session
    }

    set({ timeLeft: timeLeft - 1 })
    return null
  },
}))
