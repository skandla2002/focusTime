import type { Screen } from '../types'
import { useAppStore } from '../store/appStore'
import styles from './Navigation.module.css'

interface NavItem {
  screen: Screen
  icon: string
  label: string
  ariaLabel: string
}

const NAV_ITEMS: NavItem[] = [
  { screen: 'home', icon: '🏠', label: '홈', ariaLabel: 'Home' },
  { screen: 'timer', icon: '⏱', label: '타이머', ariaLabel: 'Timer' },
  { screen: 'statistics', icon: '📊', label: '통계', ariaLabel: 'Statistics' },
  { screen: 'goal', icon: '🎯', label: '목표', ariaLabel: 'Goal' },
]

interface Props {
  current: Screen
  onNavigate: (screen: Screen) => void
}

export function Navigation({ current, onNavigate }: Props) {
  const focusLock = useAppStore((state) => state.focusLock)

  return (
    <nav className={styles.nav} role="navigation" aria-label="Primary navigation">
      {NAV_ITEMS.map(({ screen, icon, label, ariaLabel }) => (
        <button
          key={screen}
          type="button"
          className={`${styles.navItem} ${current === screen ? styles.active : ''}`}
          onClick={() => onNavigate(screen)}
          aria-label={ariaLabel}
          aria-current={current === screen ? 'page' : undefined}
          disabled={focusLock}
        >
          <span className={styles.navIcon}>{icon}</span>
          {label}
        </button>
      ))}
    </nav>
  )
}
