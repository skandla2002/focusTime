import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BannerAd } from '../components/BannerAd'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { useAppStore } from '../store/appStore'
import { useGoalStore } from '../store/goalStore'
import { useStreakStore } from '../store/streakStore'
import { useStudyStore } from '../store/studyStore'
import { useTimerStore } from '../store/timerStore'
import { formatMinutes } from '../utils/time'
import shared from '../styles/shared.module.css'
import styles from './HomeScreen.module.css'

export function HomeScreen() {
  const { t } = useTranslation()
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
      ? t('home.greetingMorning')
      : hour < 18
        ? t('home.greetingAfternoon')
        : t('home.greetingEvening')

  return (
    <div className={shared.screen}>
      <div className={shared.header}>
        <div>
          <div className={shared.headerTitle}>{t('common.appName')}</div>
          <div className={shared.headerSubtitle}>{greeting}</div>
        </div>
        <div>
          {status === 'running' && (
            <div className={styles.runningStatus}>
              <span className={shared.runningIndicator} />
              {t('home.runningStatus')}
            </div>
          )}
          <LanguageSwitcher />
        </div>
      </div>

      <div className={styles.streakBadge}>
        <div>
          <div className={styles.streakLabel}>{t('home.currentStreak')}</div>
          <div className={styles.streakValue}>🔥 {t('home.streakDays', { count: currentStreak })}</div>
        </div>
        <div className={styles.streakMeta}>{t('home.bestDays', { count: longestStreak })}</div>
      </div>

      {celebrationMessage && (
        <div className={styles.toastCard}>
          <div className={styles.toastTitle}>{t('home.milestoneTitle')}</div>
          <div className={styles.toastCopy}>{celebrationMessage}</div>
        </div>
      )}

      <div className={shared.card}>
        <div className={shared.cardTitle}>{t('home.todayStudyTime')}</div>
        <div className={styles.todayTime}>{todayMinutes}</div>
        <div className={styles.todayTimeUnit}>
          {formatMinutes(todayMinutes)} / {dailyGoalMinutes} {t('common.minutesShort')}
        </div>
        <div className={shared.progressBar}>
          <div className={shared.progressFill} style={{ width: `${goalProgress}%` }} />
        </div>
        <div className={shared.progressLabel}>
          <span>
            {goalProgress >= 100
              ? t('home.goalAchieved')
              : t('home.goalProgress', { progress: Math.round(goalProgress) })}
          </span>
          <span>
            {t('home.goalRemaining', {
              remaining: formatMinutes(Math.max(dailyGoalMinutes - todayMinutes, 0)),
            })}
          </span>
        </div>
      </div>

      <div className={`${shared.card} ${styles.quickStartCard}`}>
        <div className={shared.cardTitle}>{t('home.quickStart')}</div>
        <div className={styles.quickStartDesc}>
          {mode === 'focus' ? t('home.quickStartFocus') : t('home.quickStartBreak')}
        </div>
        <button
          type="button"
          className={`${shared.btn} ${shared.btnPrimary} ${styles.quickStartBtn}`}
          onClick={() => navigate('timer')}
        >
          {status === 'running'
            ? t('home.viewTimer')
            : status === 'paused'
              ? t('home.resumeTimer')
              : t('home.startTimer')}
        </button>
        {completedToday > 0 && (
          <div className={styles.sessionsToday}>
            <div className={styles.sessionsLabel}>{t('home.completedSessionsToday')}</div>
            <div className={shared.pomodoroDots}>
              {Array.from({ length: Math.min(completedToday, 8) }).map((_, index) => (
                <div key={index} className={`${shared.pomodoroDot} ${shared.completed}`} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={shared.card}>
        <div className={shared.cardTitle}>{t('home.weeklySummary')}</div>
        <div className={shared.statRow}>
          <span className={shared.statLabel}>{t('home.weeklyTotal')}</span>
          <span className={`${shared.statValue} ${shared.accent}`}>{formatMinutes(weekTotal)}</span>
        </div>
        <div className={shared.statRow}>
          <span className={shared.statLabel}>{t('home.dailyAverage')}</span>
          <span className={shared.statValue}>{formatMinutes(weekAverage)}</span>
        </div>
        <div className={shared.statRow}>
          <span className={shared.statLabel}>{t('home.allTimeTotal')}</span>
          <span className={shared.statValue}>{formatMinutes(totalMinutes)}</span>
        </div>
        <div className={shared.statRow}>
          <span className={shared.statLabel}>{t('home.todaySessions')}</span>
          <span className={shared.statValue}>{completedToday}</span>
        </div>
      </div>

      <BannerAd />
    </div>
  )
}
