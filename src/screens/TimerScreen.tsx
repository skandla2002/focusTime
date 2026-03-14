import { useEffect, useRef, useState } from 'react'
import { useTimerStore } from '../store/timerStore'
import { useStudyStore } from '../store/studyStore'
import { useAppStore } from '../store/appStore'
import { formatTime, formatMinutes } from '../utils/time'
import { FOCUS_DURATION, BREAK_DURATION } from '../types'

export function TimerScreen() {
  const { mode, status, timeLeft, start, pause, reset, tick, switchMode, completedToday } =
    useTimerStore()
  const { addSession } = useStudyStore()
  const { triggerInterstitial } = useAppStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [lastCompleted, setLastCompleted] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        const session = tick()
        if (session) {
          addSession(session)
          setLastCompleted(formatMinutes(session.duration))
          triggerInterstitial()
        }
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [status, tick, addSession, triggerInterstitial])

  const totalDuration = mode === 'focus' ? FOCUS_DURATION : BREAK_DURATION
  const progress = (timeLeft / totalDuration) * 100
  const circumference = 2 * Math.PI * 110
  const dashOffset = circumference * (1 - progress / 100)

  return (
    <div className="screen">
      <div className="header">
        <div className="header-title">타이머</div>
      </div>

      {/* Mode Tabs */}
      <div className="mode-tabs">
        <button
          className={`mode-tab ${mode === 'focus' ? 'active' : ''}`}
          onClick={() => switchMode('focus')}
        >
          집중 25분
        </button>
        <button
          className={`mode-tab ${mode === 'break' ? 'active' : ''}`}
          onClick={() => switchMode('break')}
        >
          휴식 5분
        </button>
      </div>

      {/* Completed notification */}
      {lastCompleted && status === 'idle' && (
        <div className="session-complete pop-in">
          <div className="session-complete-icon">
            {mode === 'break' ? '☕' : '✅'}
          </div>
          <div className="session-complete-title">
            {mode === 'break' ? '집중 완료! 잠깐 쉬어요' : '휴식 완료! 다시 집중해요'}
          </div>
          <div className="session-complete-sub">
            {mode === 'break' ? `${lastCompleted} 기록 저장됨` : '새 집중 세션을 시작하세요'}
          </div>
        </div>
      )}

      {/* Circular Timer */}
      <div className="timer-display">
        <div className="timer-ring-container">
          <svg className="timer-ring-svg" width="240" height="240" viewBox="0 0 240 240">
            <circle className="timer-ring-bg" cx="120" cy="120" r="110" />
            <circle
              className={`timer-ring-progress ${mode === 'break' ? 'break' : ''}`}
              cx="120"
              cy="120"
              r="110"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="timer-time-text">
            <div className="timer-time">{formatTime(timeLeft)}</div>
            <div className="timer-mode-label">
              {status === 'running' && <span className="running-indicator" style={{ marginRight: 6 }} />}
              {mode === 'focus' ? '집중' : '휴식'} 시간
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="timer-controls">
          <button className="btn btn-icon" onClick={reset} aria-label="초기화">
            ↺
          </button>
          {status === 'running' ? (
            <button className="btn btn-primary" onClick={pause}>
              ⏸ 일시정지
            </button>
          ) : (
            <button className="btn btn-primary" onClick={start}>
              ▶ {status === 'paused' ? '계속' : '시작'}
            </button>
          )}
          <button className="btn btn-icon" aria-label="설정" style={{ opacity: 0.3, cursor: 'default' }}>
            ⚙
          </button>
        </div>
      </div>

      {/* Today's progress */}
      <div className="card">
        <div className="card-title">오늘의 집중</div>
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-primary-light)' }}>
              {completedToday}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>완료 세션</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-secondary)' }}>
              {completedToday * 25}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>분 집중</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-success)' }}>
              {completedToday * 5}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>분 휴식</div>
          </div>
        </div>

        {completedToday > 0 && (
          <div className="pomodoro-dots" style={{ marginTop: 16 }}>
            {Array.from({ length: Math.min(completedToday, 8) }).map((_, i) => (
              <div key={i} className="pomodoro-dot completed" />
            ))}
            {completedToday < 8 && (
              <div className="pomodoro-dot" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
