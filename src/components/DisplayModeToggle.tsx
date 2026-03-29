import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/appStore'
import styles from './DisplayModeToggle.module.css'

export function DisplayModeToggle() {
  const { t } = useTranslation()
  const { visualMode, setVisualMode } = useAppStore()
  const isGrayscale = visualMode === 'grayscale'

  function handleToggle() {
    setVisualMode(isGrayscale ? 'color' : 'grayscale')
  }

  return (
    <button
      type="button"
      className={`${styles.toggle} ${isGrayscale ? styles.grayscale : ''}`}
      onClick={handleToggle}
      aria-pressed={isGrayscale}
      aria-label={isGrayscale ? t('displayMode.toColor') : t('displayMode.toGrayscale')}
      title={isGrayscale ? t('displayMode.toColor') : t('displayMode.toGrayscale')}
    >
      {isGrayscale ? '◑' : '●'}
    </button>
  )
}
