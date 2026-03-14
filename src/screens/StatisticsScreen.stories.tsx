import type { Meta, StoryObj } from '@storybook/react'
import { StatisticsScreen } from './StatisticsScreen'

const meta: Meta<typeof StatisticsScreen> = {
  title: 'Screens/StatisticsScreen',
  component: StatisticsScreen,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof StatisticsScreen>

export const Empty: Story = {}
