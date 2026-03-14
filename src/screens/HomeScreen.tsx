import { useEffect } from 'react'
import { BannerAd } from '../components/BannerAd'
import { useAppStore } from '../store/appStore'
import { useGoalStore } from '../store/goalStore'
import { useStreakStore } from '../store/streakStore'
import { useStudyStore } from '../store/studyStore'
import { useTimerStore } from '../store/timerStore'
import { formatMinutes } from '../utils/time'
import shared from '../styles/shared.module.css'
import styles from './HomeScreen.module.css'

export function HomeScreen() {
  const { records, getTodayMinutes, getWeekData, getTotalMinutes } = useStudyStore()
  const { goal } = useGoalStore()
  const { completedToday, mode, status } = useTimerStore()
  const { navigate } = useAppStore()
  const {
    currentStreak,
    longestStreak,
    celebrationMessage,
    dismissCelebration,
    syncFromRecords,
  } = useStreakStore()

  useEffect(() => {
    syncFromRecords(records)
  }, [records, syncFromRecords])

  useEffect(() => {
    if (!celebrationMessage) {
      return
    }

    const timer = setTimeout(() => dismissCelebration(), 2800)
    return () => clearTimeout(timer)
  }, [celebrationMessage, dismissCelebration])

  const todayMinutes = getTodayMinutes()
  const weekData = getWeekData()
  const totalMinutes = getTotalMinutes()
  const { dailyGoalMinutes } = goal
  const goalProgress = Math.min(100, (todayMinutes / dailyGoalMinutes) * 100)
  const weekTotal = weekData.reduce((sum, day) => sum + day.minutes, 0)
  const weekAverage = Math.round(weekTotal / 7)

  const hour = new Date().getHours()
  const greeting =
    hour < 12
      ? 'Good morning. Ready for a focused start?'
      : hour < 18
        ? 'Keep your momentum going this afternoon.'
        : 'Close the day with one more solid session.'

  return (
    <div className={shared.screen}>
      <div className={shared.header}>
        <div>
          <div className={shared.headerTitle}>FocusTimer</div>
          <div className={shared.headerSubtitle}>{greeting}</div>
        </div>
        {status === 'running' && (
          <div className={styles.runningStatus}>
            <span className={shared.runningIndicator} />
            In focus mode
          </div>
        )}
      </div>

      <div className={styles.streakBadge}>
        <div>
          <div className={styles.streakLabel}>Current streak</div>
          <div className={styles.streakValue}>🔥 {currentStreak} day{currentStreak === 1 ? '' : 's'}</div>
        </div>
        <div className={styles.streakMeta}>Best {longestStreak} day{longestStreak === 1 ? '' : 's'}</div>
      </div>

      {celebrationMessage && (
        <div className={styles.toastCard}>
          <div className={styles.toastTitle}>Milestone reached</div>
          <div className={styles.toastCopy}>{celebrationMessage}</div>
        </div>
      )}

      <div className={shared.card}>
        <div className={shared.cardTitle}>Today's study time</div>
        <div className={styles.todayTime}>{todayMinutes}</div>
        <div className={styles.todayTimeUnit}>minutes / goal {dailyGoalMinutes} minutes</div>
        <div className={shared.progressBar}>
          <div className={shared.progressFill} style={{ width: `${goalProgress}%` }} />
        </div>
        <div className={shared.progressLabel}>
          <span>{goalProgress >= 100 ? 'Goal achieved.' : `${Math.round(goalProgress)}% complete`}</span>
          <span>{formatMinutes(Math.max(dailyGoalMinutes - todayMinutes, 0))} remaining</span>
        </div>
      </div>

      <div className={`${shared.card} ${styles.quickStartCard}`}>
        <div className={shared.cardTitle}>Quick start</div>
        <div className={styles.quickStartDesc}>
          {mode === 'focus' ? 'Focus session: 25 minutes' : 'Break session: 5 minutes'}
        </div>
        <button
          type="button"
          className={`${shared.btn} ${shared.btnPrimary} ${styles.quickStartBtn}`}
          onClick={() => navigate('timer')}
        >
          {status === 'running' ? 'View timer' : status === 'paused' ? 'Resume timer' : 'Start timer'}
        </button>
        {completedToday > 0 && (
          <div className={styles.sessionsToday}>
            <div className={styles.sessionsLabel}>
              Completed sessions today
            </div>
            <div className={shared.pomodoroDots}>
              {Array.from({ length: Math.min(completedToday, 8) }).map((_, index) => (
                <div key={index} className={`${shared.pomodoroDot} ${shared.completed}`} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={shared.card}>
        <div className={shared.cardTitle}>Weekly summary</div>
        <div className={shared.statRow}>
          <span className={shared.statLabel}>Weekly total</span>
          <span className={`${shared.statValue} ${shared.accent}`}>{formatMinutes(weekTotal)}</span>
        </div>
        <div className={shared.statRow}>
          <span className={shared.statLabel}>Daily average</span>
          <span className={shared.statValue}>{formatMinutes(weekAverage)}</span>
        </div>
        <div className={shared.statRow}>
          <span className={shared.statLabel}>All-time total</span>
          <span className={shared.statValue}>{formatMinutes(totalMinutes)}</span>
        </div>
        <div className={shared.statRow}>
          <span className={shared.statLabel}>Today's sessions</span>
          <span className={shared.statValue}>{completedToday}</span>
        </div>
      </div>

      <BannerAd />
    </div>
  )
}
