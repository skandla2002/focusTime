import type { Meta, StoryObj } from '@storybook/react'
import { Navigation } from './Navigation'

const meta: Meta<typeof Navigation> = {
  title: 'Components/Navigation',
  component: Navigation,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    current: {
      control: 'select',
      options: ['home', 'timer', 'statistics', 'goal'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Navigation>

export const Home: Story = {
  args: { current: 'home', onNavigate: () => {} },
}

export const Timer: Story = {
  args: { current: 'timer', onNavigate: () => {} },
}

export const Statistics: Story = {
  args: { current: 'statistics', onNavigate: () => {} },
}

export const Goal: Story = {
  args: { current: 'goal', onNavigate: () => {} },
}
