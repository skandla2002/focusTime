import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FOCUS_DURATION } from '../types'
import { useAppStore } from '../store/appStore'
import { useTimerStore } from '../store/timerStore'
import { TimerScreen } from './TimerScreen'

vi.mock('../utils/analytics', () => ({
  trackEvent: vi.fn(() => Promise.resolve()),
}))

describe('timer screen', () => {
  beforeEach(() => {
    localStorage.clear()
    useAppStore.setState({
      screen: 'timer',
      showInterstitial: false,
      focusLock: false,
      user: null,
    })
    useTimerStore.setState({
      mode: 'focus',
      status: 'paused',
      timeLeft: 90,
      sessionStart: Date.now() - 30_000,
      completedToday: 0,
      backgroundedAt: null,
    })
  })

  it('[TimerScreen] should block extra controls while focus lock is enabled', async () => {
    const user = userEvent.setup()

    render(<TimerScreen />)

    await user.click(screen.getByRole('button', { name: 'Enable focus lock' }))

    expect(useAppStore.getState().focusLock).toBe(true)

    await user.click(screen.getByRole('button', { name: 'Break mode' }))
    await user.click(screen.getByRole('button', { name: 'Resume timer' }))

    expect(useTimerStore.getState().mode).toBe('focus')
    expect(useTimerStore.getState().status).toBe('paused')

    await user.click(screen.getByRole('button', { name: 'Reset timer' }))

    expect(useTimerStore.getState().status).toBe('idle')
    expect(useTimerStore.getState().timeLeft).toBe(FOCUS_DURATION)
  })

  it('[TimerScreen] should allow mode changes again after focus lock is disabled', async () => {
    const user = userEvent.setup()

    render(<TimerScreen />)

    await user.click(screen.getByRole('button', { name: 'Enable focus lock' }))
    await user.click(screen.getByRole('button', { name: 'Disable focus lock' }))
    await user.click(screen.getByRole('button', { name: 'Break mode' }))

    expect(useAppStore.getState().focusLock).toBe(false)
    expect(useTimerStore.getState().mode).toBe('break')
  })
})
