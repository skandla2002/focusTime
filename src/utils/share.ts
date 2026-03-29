export interface ShareStudyResultInput {
  title: string
  text: string
  url: string
}

export interface ShareScreenshotInput {
  elementRef: HTMLElement
  filename?: string
  title?: string
  text?: string
}

export type ShareResult = 'shared' | 'copied'

function canUseWebShare(data: ShareData): boolean {
  if (typeof navigator.share !== 'function') {
    return false
  }

  if (typeof navigator.canShare === 'function') {
    return navigator.canShare(data)
  }

  return true
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return true
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', 'true')
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()

  const copied = document.execCommand('copy')
  document.body.removeChild(textarea)
  return copied
}

function downloadBlob(blob: Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(objectUrl)
}

export async function shareStudyResult(input: ShareStudyResultInput): Promise<ShareResult> {
  const data: ShareData = {
    title: input.title,
    text: input.text,
    url: input.url,
  }

  if (canUseWebShare(data)) {
    await navigator.share(data)
    return 'shared'
  }

  const copied = await copyToClipboard(`${input.text} ${input.url}`.trim())
  if (!copied) {
    throw new Error('Share is unavailable on this device.')
  }

  return 'copied'
}

export async function shareScreenshot(input: ShareScreenshotInput): Promise<ShareResult> {
  const html2canvas = (await import('html2canvas')).default
  const canvas = await html2canvas(input.elementRef, {
    backgroundColor: '#0f0f23',
    scale: window.devicePixelRatio || 1,
  })

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => {
      if (value) {
        resolve(value)
        return
      }

      reject(new Error('Screenshot failed'))
    }, 'image/png')
  })

  const filename = input.filename ?? 'focustimer-result.png'
  const file = new File([blob], filename, { type: 'image/png' })

  if (typeof navigator.share === 'function' && navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: input.title,
      text: input.text,
    })
    return 'shared'
  }

  downloadBlob(blob, filename)
  return 'copied'
}
