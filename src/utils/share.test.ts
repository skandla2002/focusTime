import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  generateMarkdownReport,
  generateShareUrl,
  generateTextReport,
  shareScreenshot,
  shareStudyResult,
} from './share'
import type { StudyStats } from './share'

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

const sampleStats: StudyStats = {
  date: '2026-03-31',
  todayMinutes: 90,
  weekTotal: 420,
  monthTotal: 1800,
  totalMinutes: 12300,
  todaySessions: 3,
}

describe('generateTextReport', () => {
  it('should include the date and all stats', () => {
    const report = generateTextReport(sampleStats)
    expect(report).toContain('2026-03-31')
    expect(report).toContain('90 min')
    expect(report).toContain('3 sessions')
    expect(report).toContain('420 min')
    expect(report).toContain('1800 min')
    expect(report).toContain('12300 min')
    expect(report).toContain('#FocusTimer')
  })

  it('should produce a plain text string with no markdown', () => {
    const report = generateTextReport(sampleStats)
    expect(report).not.toContain('|')
    expect(report).not.toContain('##')
  })
})

describe('generateMarkdownReport', () => {
  it('should include a markdown heading and table', () => {
    const report = generateMarkdownReport(sampleStats)
    expect(report).toContain('## FocusTimer Study Record — 2026-03-31')
    expect(report).toContain('| Period | Time |')
    expect(report).toContain('| Today | 90 min (3 sessions) |')
    expect(report).toContain('| This week | 420 min |')
    expect(report).toContain('| This month | 1800 min |')
    expect(report).toContain('| Total | 12300 min |')
    expect(report).toContain('#FocusTimer')
  })
})

describe('generateShareUrl', () => {
  it('should encode all stats as query parameters', () => {
    const url = generateShareUrl(sampleStats)
    expect(url).toContain('today=90')
    expect(url).toContain('week=420')
    expect(url).toContain('month=1800')
    expect(url).toContain('total=12300')
    expect(url).toContain('sessions=3')
    expect(url).toContain('date=2026-03-31')
  })

  it('should use VITE_SHARE_BASE_URL when set', () => {
    const original = import.meta.env['VITE_SHARE_BASE_URL']
    import.meta.env['VITE_SHARE_BASE_URL'] = 'https://my.app/share'
    const url = generateShareUrl(sampleStats)
    expect(url.startsWith('https://my.app/share?')).toBe(true)
    import.meta.env['VITE_SHARE_BASE_URL'] = original
  })
})

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
