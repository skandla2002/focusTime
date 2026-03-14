import type { Screen } from '../types'
import styles from './Navigation.module.css'

interface NavItem {
  screen: Screen
  icon: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { screen: 'home', icon: '🏠', label: '홈' },
  { screen: 'timer', icon: '⏱', label: '타이머' },
  { screen: 'statistics', icon: '📊', label: '통계' },
  { screen: 'goal', icon: '🎯', label: '목표' },
]

interface Props {
  current: Screen
  onNavigate: (screen: Screen) => void
}

export function Navigation({ current, onNavigate }: Props) {
  return (
    <nav className={styles.nav} role="navigation" aria-label="주 메뉴">
      {NAV_ITEMS.map(({ screen, icon, label }) => (
        <button
          key={screen}
          type="button"
          className={`${styles.navItem} ${current === screen ? styles.active : ''}`}
          onClick={() => onNavigate(screen)}
          aria-label={label}
          aria-current={current === screen ? 'page' : undefined}
        >
          <span className={styles.navIcon}>{icon}</span>
          {label}
        </button>
      ))}
    </nav>
  )
}
