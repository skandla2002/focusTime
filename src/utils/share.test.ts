import { beforeEach, describe, expect, it, vi } from 'vitest'
import { shareStudyResult } from './share'

describe('share utils', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('[share] should use the web share api when it is supported', async () => {
    const share = vi.fn(() => Promise.resolve())
    Object.assign(navigator, {
      share,
      canShare: vi.fn(() => true),
      clipboard: { writeText: vi.fn() },
    })

    await expect(
      shareStudyResult({
        title: 'FocusTimer',
        text: 'Shared text',
        url: 'https://example.com',
      })
    ).resolves.toBe('shared')

    expect(share).toHaveBeenCalled()
  })

  it('[share] should copy to the clipboard when web share is unavailable', async () => {
    const writeText = vi.fn(() => Promise.resolve())
    Object.assign(navigator, {
      share: undefined,
      canShare: undefined,
      clipboard: { writeText },
    })

    await expect(
      shareStudyResult({
        title: 'FocusTimer',
        text: 'Clipboard text',
        url: 'https://example.com',
      })
    ).resolves.toBe('copied')

    expect(writeText).toHaveBeenCalledWith('Clipboard text https://example.com')
  })

  it('[share] should fall back to clipboard when canShare rejects the payload', async () => {
    const share = vi.fn(() => Promise.resolve())
    const writeText = vi.fn(() => Promise.resolve())
    Object.assign(navigator, {
      share,
      canShare: vi.fn(() => false),
      clipboard: { writeText },
    })

    await expect(
      shareStudyResult({
        title: 'FocusTimer',
        text: 'Fallback text',
        url: 'https://example.com',
      })
    ).resolves.toBe('copied')

    expect(share).not.toHaveBeenCalled()
    expect(writeText).toHaveBeenCalledWith('Fallback text https://example.com')
  })

  it('[share] should use execCommand when the clipboard api is unavailable', async () => {
    const execCommand = vi.fn(() => true)
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: execCommand,
    })
    Object.assign(navigator, {
      share: undefined,
      canShare: undefined,
      clipboard: undefined,
    })

    await expect(
      shareStudyResult({
        title: 'FocusTimer',
        text: 'Legacy copy',
        url: 'https://example.com',
      })
    ).resolves.toBe('copied')

    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(document.querySelector('textarea')).toBeNull()
  })

  it('[share] should throw when neither sharing nor copying succeeds', async () => {
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: vi.fn(() => false),
    })
    Object.assign(navigator, {
      share: undefined,
      canShare: undefined,
      clipboard: undefined,
    })

    await expect(
      shareStudyResult({
        title: 'FocusTimer',
        text: 'No share path',
        url: 'https://example.com',
      })
    ).rejects.toThrow('Share is unavailable on this device.')
  })
})
