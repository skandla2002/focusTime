import { useTranslation } from 'react-i18next'
import styles from './LanguageSwitcher.module.css'

const LANGUAGES = [
  { code: 'ko', label: 'KO', translationKey: 'languageSwitcher.ko' },
  { code: 'en', label: 'EN', translationKey: 'languageSwitcher.en' },
  { code: 'zh', label: 'ZH', translationKey: 'languageSwitcher.zh' },
] as const

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const activeLanguage = (i18n.resolvedLanguage ?? i18n.language ?? 'en').split('-')[0]

  return (
    <div className={styles.switcher} aria-label={t('languageSwitcher.label')}>
      {LANGUAGES.map(({ code, label, translationKey }) => (
        <button
          key={code}
          type="button"
          className={`${styles.option} ${activeLanguage === code ? styles.active : ''}`}
          onClick={() => void i18n.changeLanguage(code)}
          aria-pressed={activeLanguage === code}
          aria-label={`${t('languageSwitcher.label')}: ${t(translationKey)}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
