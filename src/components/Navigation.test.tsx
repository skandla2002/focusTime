import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Navigation } from './Navigation'

describe('navigation', () => {
  it('[Navigation] should call onNavigate when a nav item is clicked', async () => {
    const onNavigate = vi.fn()
    const user = userEvent.setup()

    render(<Navigation current="home" onNavigate={onNavigate} />)

    const buttons = screen.getAllByRole('button')
    await user.click(buttons[1])

    expect(onNavigate).toHaveBeenCalled()
  })
})
