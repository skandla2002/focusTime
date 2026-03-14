import { useEffect } from 'react'
import { BannerAd } from '../components/BannerAd'
import { useAppStore } from '../store/appStore'
import { useGoalStore } from '../store/goalStore'
import { useStreakStore } from '../store/streakStore'
import { useStudyStore } from '../store/studyStore'
import { useTimerStore } from '../store/timerStore'
import { formatMinutes } from '../utils/time'

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
    <div className="screen">
      <div className="header">
        <div>
          <div className="header-title">FocusTimer</div>
          <div className="header-subtitle">{greeting}</div>
        </div>
        {status === 'running' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-success)' }}>
            <span className="running-indicator" />
            In focus mode
          </div>
        )}
      </div>

      <div className="streak-badge">
        <div>
          <div className="streak-label">Current streak</div>
          <div className="streak-value">🔥 {currentStreak} day{currentStreak === 1 ? '' : 's'}</div>
        </div>
        <div className="streak-meta">Best {longestStreak} day{longestStreak === 1 ? '' : 's'}</div>
      </div>

      {celebrationMessage && (
        <div className="toast-card">
          <div className="toast-title">Milestone reached</div>
          <div className="toast-copy">{celebrationMessage}</div>
        </div>
      )}

      <div className="card">
        <div className="card-title">Today's study time</div>
        <div className="today-time">{todayMinutes}</div>
        <div className="today-time-unit">minutes / goal {dailyGoalMinutes} minutes</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${goalProgress}%` }} />
        </div>
        <div className="progress-label">
          <span>{goalProgress >= 100 ? 'Goal achieved.' : `${Math.round(goalProgress)}% complete`}</span>
          <span>{formatMinutes(Math.max(dailyGoalMinutes - todayMinutes, 0))} remaining</span>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <div className="card-title">Quick start</div>
        <div style={{ marginBottom: 16, color: 'var(--text-secondary)', fontSize: 14 }}>
          {mode === 'focus' ? 'Focus session: 25 minutes' : 'Break session: 5 minutes'}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('timer')}
          style={{ width: '100%', maxWidth: 240 }}
        >
          {status === 'running' ? 'View timer' : status === 'paused' ? 'Resume timer' : 'Start timer'}
        </button>
        {completedToday > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Completed sessions today
            </div>
            <div className="pomodoro-dots">
              {Array.from({ length: Math.min(completedToday, 8) }).map((_, index) => (
                <div key={index} className="pomodoro-dot completed" />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">Weekly summary</div>
        <div className="stat-row">
          <span className="stat-label">Weekly total</span>
          <span className="stat-value accent">{formatMinutes(weekTotal)}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Daily average</span>
          <span className="stat-value">{formatMinutes(weekAverage)}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">All-time total</span>
          <span className="stat-value">{formatMinutes(totalMinutes)}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Today's sessions</span>
          <span className="stat-value">{completedToday}</span>
        </div>
      </div>

      <BannerAd />
    </div>
  )
}
