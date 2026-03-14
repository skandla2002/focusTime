import type { Meta, StoryObj } from '@storybook/react'
import { InterstitialAd } from './InterstitialAd'
import { useAppStore } from '../store/appStore'
import { useEffect } from 'react'

const meta: Meta<typeof InterstitialAd> = {
  title: 'Components/InterstitialAd',
  component: InterstitialAd,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof InterstitialAd>

function InterstitialVisible() {
  const { triggerInterstitial } = useAppStore()
  useEffect(() => { triggerInterstitial() }, [triggerInterstitial])
  return <InterstitialAd />
}

export const Visible: Story = {
  render: () => <InterstitialVisible />,
}

export const Hidden: Story = {}
