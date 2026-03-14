import type { Meta, StoryObj } from '@storybook/react'
import { BannerAd } from './BannerAd'

const meta: Meta<typeof BannerAd> = {
  title: 'Components/BannerAd',
  component: BannerAd,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof BannerAd>

export const WebPlaceholder: Story = {}
