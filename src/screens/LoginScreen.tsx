import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DisplayModeToggle } from '../components/DisplayModeToggle'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { useAppStore } from '../store/appStore'
import { signInWithGoogle } from '../utils/cloudStorage'
import shared from '../styles/shared.module.css'
import styles from './LoginScreen.module.css'

export function LoginScreen() {
  const { t } = useTranslation()
  const { navigate } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGoogleLogin() {
    setLoading(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch {
      setError(t('login.loginFailed'))
    } finally {
      setLoading(false)
    }
  }

  function handleSkip() {
    navigate('home')
  }

  return (
    <div className={`${shared.screen} ${styles.loginScreen}`}>
      <div className={styles.loginHero}>
        <div className={styles.loginIcon}>⏱</div>
        <h1 className={styles.loginTitle}>{t('common.appName')}</h1>
        <p className={styles.loginSubtitle}>{t('login.subtitle')}</p>
        <div className={styles.loginLangRow}>
          <LanguageSwitcher />
          <DisplayModeToggle />
        </div>
      </div>

      <div className={styles.loginActions}>
        <button
          type="button"
          className={styles.btnGoogle}
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <span className={styles.btnGoogleIcon}>G</span>
          {loading ? t('login.loggingIn') : t('login.googleContinue')}
        </button>

        {error && <p className={styles.loginError}>{error}</p>}

        <button
          type="button"
          className={styles.btnSkip}
          onClick={handleSkip}
        >
          {t('login.skip')}
        </button>

        <p className={styles.loginNotice}>{t('login.notice')}</p>
      </div>
    </div>
  )
}
