import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle } from '@capacitor/haptics'

function getAudioContext(): typeof AudioContext | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ?? null
}

async function playTone(): Promise<void> {
  const AudioContextCtor = getAudioContext()
  if (!AudioContextCtor) {
    return
  }

  const context = new AudioContextCtor()
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = 'triangle'
  oscillator.frequency.value = 880
  gain.gain.value = 0.08

  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + 0.25)

  await new Promise<void>((resolve) => {
    oscillator.onended = () => {
      void context.close()
      resolve()
    }
  })
}

async function triggerHaptics(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return
  }

  try {
    await Haptics.vibrate({ duration: 500 })
    await Haptics.impact({ style: ImpactStyle.Heavy })
  } catch {
    // Ignore missing haptics support on devices that do not expose it.
  }
}

export async function playCompletionAlert(): Promise<void> {
  await Promise.allSettled([triggerHaptics(), playTone()])
}
