import type { Meta, StoryObj } from '@storybook/react'
import { TimerScreen } from './TimerScreen'

const meta: Meta<typeof TimerScreen> = {
  title: 'Screens/TimerScreen',
  component: TimerScreen,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof TimerScreen>

export const Idle: Story = {}
