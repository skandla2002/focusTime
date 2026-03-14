import { create } from 'zustand'
import type { TimerMode, TimerStatus, FocusSession } from '../types'
import { FOCUS_DURATION, BREAK_DURATION } from '../types'

interface TimerState {
  mode: TimerMode
  status: TimerStatus
  timeLeft: number
  sessionStart: number | null
  completedToday: number
  // actions
  start: () => void
  pause: () => void
  reset: () => void
  tick: () => FocusSession | null
  switchMode: (mode: TimerMode) => void
}

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: 'focus',
  status: 'idle',
  timeLeft: FOCUS_DURATION,
  sessionStart: null,
  completedToday: 0,

  start: () => {
    const { status } = get()
    if (status === 'idle') {
      set({ status: 'running', sessionStart: Date.now() })
    } else if (status === 'paused') {
      set({ status: 'running' })
    }
  },

  pause: () => {
    set({ status: 'paused' })
  },

  reset: () => {
    const { mode } = get()
    set({
      status: 'idle',
      timeLeft: mode === 'focus' ? FOCUS_DURATION : BREAK_DURATION,
      sessionStart: null,
    })
  },

  switchMode: (mode: TimerMode) => {
    set({
      mode,
      status: 'idle',
      timeLeft: mode === 'focus' ? FOCUS_DURATION : BREAK_DURATION,
      sessionStart: null,
    })
  },

  tick: (): FocusSession | null => {
    const { timeLeft, mode, sessionStart, completedToday } = get()

    if (timeLeft <= 1) {
      // Timer completed
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
      }

      // Switch to opposite mode
      const nextMode: TimerMode = mode === 'focus' ? 'break' : 'focus'
      set({
        mode: nextMode,
        status: 'idle',
        timeLeft: nextMode === 'focus' ? FOCUS_DURATION : BREAK_DURATION,
        sessionStart: null,
        completedToday: mode === 'focus' ? completedToday + 1 : completedToday,
      })

      return session
    }

    set({ timeLeft: timeLeft - 1 })
    return null
  },
}))
