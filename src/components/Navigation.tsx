import { useTranslation } from 'react-i18next'
import type { Screen } from '../types'
import { useAppStore } from '../store/appStore'
import styles from './Navigation.module.css'

interface NavItem {
  screen: Screen
  icon: string
  translationKey: string
}

const NAV_ITEMS: NavItem[] = [
  { screen: 'home', icon: '🏠', translationKey: 'nav.home' },
  { screen: 'timer', icon: '⏱', translationKey: 'nav.timer' },
  { screen: 'statistics', icon: '📊', translationKey: 'nav.statistics' },
  { screen: 'goal', icon: '🎯', translationKey: 'nav.goal' },
]

interface Props {
  current: Screen
  onNavigate: (screen: Screen) => void
}

export function Navigation({ current, onNavigate }: Props) {
  const { t } = useTranslation()
  const focusLock = useAppStore((state) => state.focusLock)

  return (
    <nav className={styles.nav} role="navigation" aria-label="Primary navigation">
      {NAV_ITEMS.map(({ screen, icon, translationKey }) => {
        const label = t(translationKey)

        return (
          <button
            key={screen}
            type="button"
            className={`${styles.navItem} ${current === screen ? styles.active : ''}`}
            onClick={() => onNavigate(screen)}
            aria-label={label}
            aria-current={current === screen ? 'page' : undefined}
            disabled={focusLock}
          >
            <span className={styles.navIcon}>{icon}</span>
            {label}
          </button>
        )
      })}
    </nav>
  )
}
