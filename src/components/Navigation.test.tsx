import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '../i18n'
import { Navigation } from './Navigation'
import { useAppStore } from '../store/appStore'

describe('navigation', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    useAppStore.setState({
      screen: 'home',
      showInterstitial: false,
      focusLock: false,
      user: null,
      lastStatisticsAdAt: null,
    })
  })

  it('[Navigation] should call onNavigate when a nav item is clicked', async () => {
    const onNavigate = vi.fn()
    const user = userEvent.setup()

    render(<Navigation current="home" onNavigate={onNavigate} />)

    await user.click(screen.getByRole('button', { name: 'Timer' }))

    expect(onNavigate).toHaveBeenCalledWith('timer')
  })

  it('[Navigation] should trigger statistics ad when statistics tab is clicked', async () => {
    const onNavigate = vi.fn()
    const user = userEvent.setup()

    render(<Navigation current="home" onNavigate={onNavigate} />)

    await user.click(screen.getByRole('button', { name: 'Statistics' }))

    expect(useAppStore.getState().showInterstitial).toBe(true)
    expect(onNavigate).toHaveBeenCalledWith('statistics')
  })

  it('[Navigation] should not trigger ad when non-statistics tab is clicked', async () => {
    const onNavigate = vi.fn()
    const user = userEvent.setup()

    render(<Navigation current="home" onNavigate={onNavigate} />)

    await user.click(screen.getByRole('button', { name: 'Timer' }))

    expect(useAppStore.getState().showInterstitial).toBe(false)
    expect(onNavigate).toHaveBeenCalledWith('timer')
  })

  it('[Navigation] should block navigation clicks when focus lock is enabled', async () => {
    const onNavigate = vi.fn()
    const user = userEvent.setup()
    useAppStore.setState({ focusLock: true })

    render(<Navigation current="home" onNavigate={onNavigate} />)

    const timerButton = screen.getByRole('button', { name: 'Timer' })
    expect(timerButton.getAttribute('disabled')).not.toBeNull()

    await user.click(timerButton)

    expect(onNavigate).not.toHaveBeenCalled()
  })
})
