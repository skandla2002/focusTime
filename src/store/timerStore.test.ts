import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTimerStore } from './timerStore'
import { BREAK_DURATION } from '../types'
import { trackEvent } from '../utils/analytics'

vi.mock('../utils/analytics', () => ({
  trackEvent: vi.fn(() => Promise.resolve()),
}))

describe('timer store', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-14T10:00:00.000Z'))
    useTimerStore.setState({
      mode: 'focus',
      status: 'idle',
      timeLeft: 25 * 60,
      sessionStart: null,
      completedToday: 0,
      backgroundedAt: null,
      lastCompletionAt: null,
      lastCompletedMode: null,
      lastCompletedSession: null,
    })
  })

  it('[timerStore] should start an idle timer and track the start event', () => {
    useTimerStore.getState().start()

    expect(useTimerStore.getState().status).toBe('running')
    expect(useTimerStore.getState().sessionStart).toBe(Date.now())
    expect(trackEvent).toHaveBeenCalledWith('timer_start', { mode: 'focus' })
  })

  it('[timerStore] should resume a paused timer and mark the event as resumed', () => {
    useTimerStore.setState({
      status: 'paused',
      sessionStart: Date.now() - 60_000,
    })

    useTimerStore.getState().start()

    expect(useTimerStore.getState().status).toBe('running')
    expect(trackEvent).toHaveBeenCalledWith('timer_start', { mode: 'focus', resumed: true })
  })

  it('[timerStore] should pause the running timer and report the remaining seconds', () => {
    useTimerStore.setState({
      status: 'running',
      timeLeft: 123,
      sessionStart: Date.now() - 60_000,
    })

    useTimerStore.getState().pause()

    expect(useTimerStore.getState().status).toBe('paused')
    expect(trackEvent).toHaveBeenCalledWith('timer_pause', { mode: 'focus', seconds_left: 123 })
  })

  it('[timerStore] should reset the timer using the current mode duration', () => {
    useTimerStore.setState({
      mode: 'break',
      status: 'running',
      timeLeft: 12,
      sessionStart: Date.now() - 60_000,
      backgroundedAt: Date.now() - 5_000,
    })

    useTimerStore.getState().reset()

    expect(useTimerStore.getState()).toMatchObject({
      mode: 'break',
      status: 'idle',
      timeLeft: BREAK_DURATION,
      sessionStart: null,
      backgroundedAt: null,
    })
  })

  it('[timerStore] should switch modes and clear any in-progress state', () => {
    useTimerStore.setState({
      status: 'running',
      timeLeft: 12,
      sessionStart: Date.now() - 60_000,
      backgroundedAt: Date.now() - 5_000,
    })

    useTimerStore.getState().switchMode('break')

    expect(useTimerStore.getState()).toMatchObject({
      mode: 'break',
      status: 'idle',
      timeLeft: BREAK_DURATION,
      sessionStart: null,
      backgroundedAt: null,
    })
  })

  it('[timerStore] should create a session when tick finishes a focus timer', () => {
    useTimerStore.setState({
      status: 'running',
      timeLeft: 1,
      sessionStart: Date.now() - 25 * 60 * 1000,
    })

    const session = useTimerStore.getState().tick()

    expect(session?.duration).toBeGreaterThanOrEqual(25)
    expect(useTimerStore.getState().mode).toBe('break')
    expect(useTimerStore.getState().status).toBe('running')
    expect(useTimerStore.getState().timeLeft).toBe(BREAK_DURATION)
    expect(useTimerStore.getState().completedToday).toBe(1)
    expect(useTimerStore.getState().sessionStart).toBe(Date.now())
  })

  it('[timerStore] should switch back to focus without creating a session when a break timer completes', () => {
    useTimerStore.setState({
      mode: 'break',
      status: 'running',
      timeLeft: 1,
      completedToday: 3,
    })

    const session = useTimerStore.getState().tick()

    expect(session).toBeNull()
    expect(useTimerStore.getState().mode).toBe('focus')
    expect(useTimerStore.getState().status).toBe('running')
    expect(useTimerStore.getState().timeLeft).toBe(25 * 60)
    expect(useTimerStore.getState().completedToday).toBe(3)
    expect(useTimerStore.getState().sessionStart).toBe(Date.now())
  })

  it('[timerStore] should store the background timestamp only when the timer is running', () => {
    useTimerStore.getState().onBackground()
    expect(useTimerStore.getState().backgroundedAt).toBeNull()

    useTimerStore.setState({ status: 'running' })
    useTimerStore.getState().onBackground()

    expect(useTimerStore.getState().backgroundedAt).toBe(Date.now())
  })

  it('[timerStore] should reduce time when foreground resumes before completion', () => {
    useTimerStore.setState({
      status: 'running',
      timeLeft: 300,
      backgroundedAt: Date.now() - 30 * 1000,
    })

    useTimerStore.getState().onForeground()

    expect(useTimerStore.getState().timeLeft).toBe(270)
    expect(useTimerStore.getState().backgroundedAt).toBeNull()
  })

  it('[timerStore] should ignore foreground resume when the timer is not actively backgrounded', () => {
    useTimerStore.getState().onForeground()

    expect(useTimerStore.getState().timeLeft).toBe(25 * 60)
    expect(useTimerStore.getState().backgroundedAt).toBeNull()
  })

  it('[timerStore] should switch modes when foreground resume consumes the remaining time', () => {
    useTimerStore.setState({
      status: 'running',
      timeLeft: 10,
      sessionStart: Date.now() - 25 * 60 * 1000,
      backgroundedAt: Date.now() - 20 * 1000,
    })

    useTimerStore.getState().onForeground()

    expect(useTimerStore.getState().status).toBe('running')
    expect(useTimerStore.getState().mode).toBe('break')
    expect(useTimerStore.getState().timeLeft).toBe(BREAK_DURATION)
    expect(useTimerStore.getState().completedToday).toBe(1)
    expect(useTimerStore.getState().sessionStart).toBe(Date.now())
  })
})
