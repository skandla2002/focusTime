import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import i18n from '../i18n'
import { LanguageSwitcher } from './LanguageSwitcher'

describe('language switcher', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('[LanguageSwitcher] should change the active language when a button is clicked', async () => {
    const user = userEvent.setup()

    render(<LanguageSwitcher />)

    await user.click(screen.getByRole('button', { name: '中文' }))

    expect(i18n.language).toBe('zh')
  })
})
