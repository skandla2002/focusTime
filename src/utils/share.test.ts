import { beforeEach, describe, expect, it, vi } from 'vitest'
import { shareScreenshot, shareStudyResult } from './share'

const { html2canvasMock } = vi.hoisted(() => ({
  html2canvasMock: vi.fn(),
}))

vi.mock('html2canvas', () => ({
  default: html2canvasMock,
}))

function setNavigatorValue(key: keyof Navigator, value: unknown) {
  Object.defineProperty(window.navigator, key, {
    configurable: true,
    value,
  })
}

describe('share utils', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
    vi.clearAllMocks()
    html2canvasMock.mockReset()
    setNavigatorValue('share', undefined)
    setNavigatorValue('canShare', undefined)
    setNavigatorValue('clipboard', undefined)
  })

  it('[share] should use the web share api when it is supported', async () => {
    const share = vi.fn(() => Promise.resolve())
    setNavigatorValue('share', share)
    setNavigatorValue('canShare', vi.fn(() => true))
    setNavigatorValue('clipboard', { writeText: vi.fn() })

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
    setNavigatorValue('clipboard', { writeText })

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
    setNavigatorValue('share', share)
    setNavigatorValue('canShare', vi.fn(() => false))
    setNavigatorValue('clipboard', { writeText })

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

    await expect(
      shareStudyResult({
        title: 'FocusTimer',
        text: 'No share path',
        url: 'https://example.com',
      })
    ).rejects.toThrow('Share is unavailable on this device.')
  })

  it('[share] should share a screenshot file when file sharing is supported', async () => {
    const share = vi.fn(() => Promise.resolve())
    const canShare = vi.fn(() => true)
    const blob = new Blob(['image-bytes'], { type: 'image/png' })
    const target = document.createElement('div')

    setNavigatorValue('share', share)
    setNavigatorValue('canShare', canShare)

    html2canvasMock.mockResolvedValue({
      toBlob: (callback: BlobCallback) => callback(blob),
    })

    await expect(
      shareScreenshot({
        elementRef: target,
        filename: 'stats.png',
        title: 'FocusTimer',
        text: 'Daily result',
      })
    ).resolves.toBe('shared')

    expect(html2canvasMock).toHaveBeenCalledWith(
      target,
      expect.objectContaining({ backgroundColor: '#0f0f23' })
    )
    expect(canShare).toHaveBeenCalledWith(expect.objectContaining({ files: expect.any(Array) }))
    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'FocusTimer',
        text: 'Daily result',
        files: [expect.objectContaining({ name: 'stats.png', type: 'image/png' })],
      })
    )
  })

  it('[share] should download a screenshot when file sharing is unavailable', async () => {
    const blob = new Blob(['image-bytes'], { type: 'image/png' })
    const target = document.createElement('div')
    const anchor = document.createElement('a')
    const createObjectURL = vi.fn(() => 'blob:share-test')
    const revokeObjectURL = vi.fn()
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined)
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName.toLowerCase() === 'a') {
        return anchor
      }

      return document.createElementNS('http://www.w3.org/1999/xhtml', tagName)
    })

    setNavigatorValue('share', vi.fn(() => Promise.resolve()))
    setNavigatorValue('canShare', vi.fn(() => false))
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURL,
    })
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: revokeObjectURL,
    })

    html2canvasMock.mockResolvedValue({
      toBlob: (callback: BlobCallback) => callback(blob),
    })

    await expect(
      shareScreenshot({
        elementRef: target,
        filename: 'stats.png',
      })
    ).resolves.toBe('copied')

    expect(createObjectURL).toHaveBeenCalledWith(blob)
    expect(anchor.download).toBe('stats.png')
    expect(anchor.href).toContain('blob:share-test')
    expect(clickSpy).toHaveBeenCalled()
    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:share-test')
  })

  it('[share] should throw when a screenshot blob cannot be created', async () => {
    const target = document.createElement('div')

    html2canvasMock.mockResolvedValue({
      toBlob: (callback: BlobCallback) => callback(null),
    })

    await expect(
      shareScreenshot({
        elementRef: target,
      })
    ).rejects.toThrow('Screenshot failed')
  })
})
