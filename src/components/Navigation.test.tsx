import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Navigation } from './Navigation'
import { useAppStore } from '../store/appStore'

describe('navigation', () => {
  beforeEach(() => {
    useAppStore.setState({
      screen: 'home',
      showInterstitial: false,
      focusLock: false,
      user: null,
    })
  })

  it('[Navigation] should call onNavigate when a nav item is clicked', async () => {
    const onNavigate = vi.fn()
    const user = userEvent.setup()

    render(<Navigation current="home" onNavigate={onNavigate} />)

    await user.click(screen.getByRole('button', { name: 'Timer' }))

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
