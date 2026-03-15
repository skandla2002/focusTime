import { useTranslation } from 'react-i18next'
import styles from './LanguageSwitcher.module.css'

const LANGUAGES = [
  { code: 'ko', translationKey: 'languageSwitcher.ko' },
  { code: 'en', translationKey: 'languageSwitcher.en' },
  { code: 'zh', translationKey: 'languageSwitcher.zh' },
] as const

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const activeLanguage = (i18n.resolvedLanguage ?? i18n.language ?? 'en').split('-')[0]

  return (
    <div className={styles.switcher} aria-label={t('languageSwitcher.label')}>
      {LANGUAGES.map(({ code, translationKey }) => (
        <button
          key={code}
          type="button"
          className={`${styles.option} ${activeLanguage === code ? styles.active : ''}`}
          onClick={() => void i18n.changeLanguage(code)}
          aria-pressed={activeLanguage === code}
        >
          {t(translationKey)}
        </button>
      ))}
    </div>
  )
}
