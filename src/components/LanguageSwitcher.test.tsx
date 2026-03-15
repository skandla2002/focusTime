import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import i18n from '../i18n'
import { LanguageSwitcher } from './LanguageSwitcher'

describe('language switcher', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('[LanguageSwitcher] should render compact language badges and change language on click', async () => {
    const user = userEvent.setup()

    render(<LanguageSwitcher />)

    const koButton = screen.getByText('KO').closest('button')
    const enButton = screen.getByText('EN').closest('button')
    const zhButton = screen.getByText('ZH').closest('button')

    expect(koButton?.getAttribute('aria-pressed')).toBe('false')
    expect(enButton?.getAttribute('aria-pressed')).toBe('true')
    expect(zhButton?.getAttribute('aria-pressed')).toBe('false')

    await user.click(screen.getByText('ZH'))

    expect(i18n.language).toBe('zh')
  })
})
