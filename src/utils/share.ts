export interface ShareStudyResultInput {
  title: string
  text: string
  url: string
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
