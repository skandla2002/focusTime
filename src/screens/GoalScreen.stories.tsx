import type { Meta, StoryObj } from '@storybook/react'
import { GoalScreen } from './GoalScreen'

const meta: Meta<typeof GoalScreen> = {
  title: 'Screens/GoalScreen',
  component: GoalScreen,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof GoalScreen>

export const Default: Story = {}
