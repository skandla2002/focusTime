import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '../i18n'
import { useAppStore } from '../store/appStore'
import { useMemoStore } from '../store/memoStore'
import { useTimerStore } from '../store/timerStore'
import { FOCUS_DURATION } from '../types'
import { TimerScreen } from './TimerScreen'

vi.mock('../utils/analytics', () => ({
  trackEvent: vi.fn(() => Promise.resolve()),
}))

describe('timer screen', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    localStorage.clear()
    useAppStore.setState({
      screen: 'timer',
      showInterstitial: false,
      focusLock: false,
      user: null,
      lastStatisticsAdAt: null,
    })
    useMemoStore.setState({
      memos: [],
      loaded: true,
      loadAll: vi.fn().mockResolvedValue(undefined),
    })
    useTimerStore.setState({
      mode: 'focus',
      status: 'paused',
      timeLeft: 90,
      sessionStart: Date.now() - 30_000,
      completedToday: 0,
      backgroundedAt: null,
      lastCompletionAt: null,
      lastCompletedMode: null,
      lastCompletedSession: null,
      savedModeState: {
        focus: null,
        break: null,
      },
    })
  })

  it('[TimerScreen] should show the focus shield and keep key controls interactive while focus lock is enabled', async () => {
    const user = userEvent.setup()

    render(<TimerScreen />)

    await user.click(screen.getByRole('button', { name: 'Enable focus lock' }))

    expect(useAppStore.getState().focusLock).toBe(true)
    expect(screen.getByTestId('focus-shield')).toBeTruthy()

    await user.click(screen.getByRole('button', { name: 'Break mode' }))
    expect(useTimerStore.getState().mode).toBe('focus')

    await user.click(screen.getByRole('button', { name: 'Resume timer' }))
    expect(useTimerStore.getState().status).toBe('running')

    await user.click(screen.getByRole('button', { name: 'Disable focus lock' }))
    expect(useAppStore.getState().focusLock).toBe(false)
    expect(screen.queryByTestId('focus-shield')).toBeNull()
  })

  it('[TimerScreen] should reset timer while focus lock is enabled', async () => {
    const user = userEvent.setup()

    render(<TimerScreen />)

    await user.click(screen.getByRole('button', { name: 'Enable focus lock' }))
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

  it('[TimerScreen] should not render the focus shield outside focus mode', async () => {
    const user = userEvent.setup()

    useTimerStore.setState({
      mode: 'break',
      status: 'paused',
      timeLeft: 60,
      sessionStart: null,
    })

    render(<TimerScreen />)

    await user.click(screen.getByRole('button', { name: 'Enable focus lock' }))

    expect(useAppStore.getState().focusLock).toBe(true)
    expect(screen.queryByTestId('focus-shield')).toBeNull()
  })

  it('[TimerScreen] should dismiss completion overlay when clicked', async () => {
    const user = userEvent.setup()

    useTimerStore.setState({
      lastCompletionAt: Date.now(),
      lastCompletedMode: 'focus',
      lastCompletedSession: null,
    })

    render(<TimerScreen />)

    const overlay = await screen.findByRole('status')
    expect(overlay).toBeTruthy()

    await user.click(overlay)

    expect(screen.queryByRole('status')).toBeNull()
  })

  it('[TimerScreen] should open the memo modal when a focus session completes without a memo', async () => {
    render(<TimerScreen />)

    useTimerStore.setState({
      lastCompletionAt: Date.now(),
      lastCompletedMode: 'focus',
      lastCompletedSession: {
        id: 'session_123',
        startTime: Date.now() - 25 * 60 * 1000,
        endTime: Date.now(),
        duration: 25,
        date: '2026-03-15',
      },
    })

    expect(await screen.findByText('What did you work on?')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Save memo' })).toBeTruthy()
  })
})
