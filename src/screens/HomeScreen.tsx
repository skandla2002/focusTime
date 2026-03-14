import { useStudyStore } from '../store/studyStore'
import { useGoalStore } from '../store/goalStore'
import { useTimerStore } from '../store/timerStore'
import { useAppStore } from '../store/appStore'
import { BannerAd } from '../components/BannerAd'
import { formatMinutes } from '../utils/time'

export function HomeScreen() {
  const { getTodayMinutes, getWeekData, getTotalMinutes } = useStudyStore()
  const { goal } = useGoalStore()
  const { completedToday, mode, status } = useTimerStore()
  const { navigate } = useAppStore()

  const todayMinutes = getTodayMinutes()
  const weekData = getWeekData()
  const totalMinutes = getTotalMinutes()
  const { dailyGoalMinutes } = goal
  const goalProgress = Math.min(100, (todayMinutes / dailyGoalMinutes) * 100)

  const weekTotal = weekData.reduce((sum, d) => sum + d.minutes, 0)
  const weekAvg = Math.round(weekTotal / 7)

  const now = new Date()
  const hour = now.getHours()
  const greeting =
    hour < 12 ? '좋은 아침이에요' : hour < 18 ? '집중할 시간이에요' : '오늘도 수고했어요'

  return (
    <div className="screen">
      <div className="header">
        <div>
          <div className="header-title">FocusTimer</div>
          <div className="header-subtitle">{greeting} 👋</div>
        </div>
        {status === 'running' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-success)' }}>
            <span className="running-indicator" />
            집중 중
          </div>
        )}
      </div>

      {/* Today's Study Time */}
      <div className="card">
        <div className="card-title">오늘 공부시간</div>
        <div className="today-time">{todayMinutes}</div>
        <div className="today-time-unit">분 / 목표 {dailyGoalMinutes}분</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${goalProgress}%` }} />
        </div>
        <div className="progress-label">
          <span>{goalProgress >= 100 ? '목표 달성! 🎉' : `${Math.round(goalProgress)}% 완료`}</span>
          <span>{formatMinutes(dailyGoalMinutes - todayMinutes > 0 ? dailyGoalMinutes - todayMinutes : 0)} 남음</span>
        </div>
      </div>

      {/* Quick Start */}
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="card-title">빠른 시작</div>
        <div style={{ marginBottom: 16, color: 'var(--text-secondary)', fontSize: 14 }}>
          {mode === 'focus' ? '집중 타이머 25분' : '휴식 타이머 5분'}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('timer')}
          style={{ width: '100%', maxWidth: 240 }}
        >
          {status === 'running' ? '타이머 보기' : status === 'paused' ? '▶ 계속하기' : '▶ 시작하기'}
        </button>
        {completedToday > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
              오늘 완료한 세션
            </div>
            <div className="pomodoro-dots">
              {Array.from({ length: Math.min(completedToday, 8) }).map((_, i) => (
                <div key={i} className="pomodoro-dot completed" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Weekly Summary */}
      <div className="card">
        <div className="card-title">이번 주 요약</div>
        <div className="stat-row">
          <span className="stat-label">주간 합계</span>
          <span className="stat-value accent">{formatMinutes(weekTotal)}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">일 평균</span>
          <span className="stat-value">{formatMinutes(weekAvg)}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">총 누적</span>
          <span className="stat-value">{formatMinutes(totalMinutes)}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">오늘 완료 세션</span>
          <span className="stat-value">{completedToday}개</span>
        </div>
      </div>

      <BannerAd />
    </div>
  )
}
