import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GoalScreen } from './GoalScreen'
import { useGoalStore } from '../store/goalStore'
import { trackEvent } from '../utils/analytics'

vi.mock('../utils/analytics', () => ({
  trackEvent: vi.fn(() => Promise.resolve()),
}))

describe('goal screen', () => {
  beforeEach(() => {
    localStorage.clear()
    useGoalStore.setState({ goal: { dailyGoalMinutes: 120 } })
  })

  it('[GoalScreen] should save the selected goal when the save button is clicked', async () => {
    const user = userEvent.setup()
    render(<GoalScreen />)

    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '180' } })
    await user.click(screen.getByRole('button', { name: 'Save goal' }))

    expect(screen.getByRole('button', { name: 'Goal saved' })).toBeTruthy()
    expect(useGoalStore.getState().goal.dailyGoalMinutes).toBe(180)
    expect(localStorage.getItem('focus_timer_goal')).toBe(JSON.stringify({ dailyGoalMinutes: 180 }))
    expect(trackEvent).toHaveBeenCalledWith('goal_set', { daily_goal_minutes: 180 })
  })

  it('[GoalScreen] should update the coach note when a quick-pick preset is selected', async () => {
    const user = userEvent.setup()
    render(<GoalScreen />)

    await user.click(screen.getByRole('button', { name: /240|4/ }))

    expect(screen.getByText(/Three to four hours needs structure/i)).toBeTruthy()
  })
})
