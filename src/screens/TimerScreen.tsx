import { useEffect, useRef, useState } from 'react'
import { BREAK_DURATION, FOCUS_DURATION } from '../types'
import shared from '../styles/shared.module.css'
import { useAppStore } from '../store/appStore'
import { useStudyStore } from '../store/studyStore'
import { useTimerStore } from '../store/timerStore'
import { formatTime, formatMinutes } from '../utils/time'
import styles from './TimerScreen.module.css'

export function TimerScreen() {
  const { mode, status, timeLeft, start, pause, reset, tick, switchMode, completedToday } =
    useTimerStore()
  const { addSession } = useStudyStore()
  const { focusLock, setFocusLock, triggerInterstitial } = useAppStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [lastCompleted, setLastCompleted] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        const session = tick()
        if (session) {
          void addSession(session)
          setLastCompleted(formatMinutes(session.duration))
          triggerInterstitial()
        }
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [status, tick, addSession, triggerInterstitial])

  const totalDuration = mode === 'focus' ? FOCUS_DURATION : BREAK_DURATION
  const progress = (timeLeft / totalDuration) * 100
  const circumference = 2 * Math.PI * 110
  const dashOffset = circumference * (1 - progress / 100)
  const isPrimaryActionLocked = focusLock && status !== 'running'
  const lockButtonLabel = focusLock ? 'Disable focus lock' : 'Enable focus lock'

  return (
    <div className={shared.screen}>
      <div className={shared.header}>
        <div>
          <div className={shared.headerTitle}>타이머</div>
          <div className={shared.headerSubtitle}>
            {focusLock ? '집중 잠금이 켜져 있어 다른 조작이 막혀 있어요.' : '모드를 고르고 다음 세션을 시작해보세요.'}
          </div>
        </div>
        <button
          type="button"
          className={`${shared.btn} ${shared.btnSecondary} ${styles.lockToggle} ${
            focusLock ? styles.lockActive : ''
          }`}
          onClick={() => setFocusLock(!focusLock)}
          aria-pressed={focusLock}
          aria-label={lockButtonLabel}
        >
          {focusLock ? '잠금 해제' : '잠금'}
        </button>
      </div>

      <div className={styles.modeTabs}>
        <button
          type="button"
          className={`${styles.modeTab} ${mode === 'focus' ? styles.active : ''}`}
          onClick={() => switchMode('focus')}
          disabled={focusLock}
          aria-label="Focus mode"
        >
          집중 25분
        </button>
        <button
          type="button"
          className={`${styles.modeTab} ${mode === 'break' ? styles.active : ''}`}
          onClick={() => switchMode('break')}
          disabled={focusLock}
          aria-label="Break mode"
        >
          휴식 5분
        </button>
      </div>

      {lastCompleted && status === 'idle' && (
        <div className={`${styles.sessionComplete} ${shared.popIn}`}>
          <div className={styles.sessionCompleteIcon}>{mode === 'break' ? '완료' : '복귀'}</div>
          <div className={styles.sessionCompleteTitle}>
            {mode === 'break' ? '집중 세션이 완료됐어요.' : '휴식이 끝났어요.'}
          </div>
          <div className={styles.sessionCompleteSub}>
            {mode === 'break' ? `${lastCompleted} 기록이 저장됐어요.` : '준비되면 다음 집중 세션을 시작해보세요.'}
          </div>
        </div>
      )}

      <div className={styles.timerDisplay}>
        <div className={styles.timerRingContainer}>
          <svg className={styles.timerRingSvg} width="240" height="240" viewBox="0 0 240 240">
            <circle className={styles.timerRingBg} cx="120" cy="120" r="110" />
            <circle
              className={`${styles.timerRingProgress} ${mode === 'break' ? styles.break : ''}`}
              cx="120"
              cy="120"
              r="110"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className={styles.timerTimeText}>
            <div className={styles.timerTime}>{formatTime(timeLeft)}</div>
            <div className={styles.timerModeLabel}>
              {status === 'running' && <span className={`${shared.runningIndicator} ${styles.runningDot}`} />}
              {mode === 'focus' ? '집중' : '휴식'} 시간
            </div>
          </div>
        </div>

        <div className={styles.timerControls}>
          <button
            type="button"
            className={`${shared.btn} ${shared.btnIcon}`}
            onClick={reset}
            aria-label="Reset timer"
          >
            ↺
          </button>
          {status === 'running' ? (
            <button
              type="button"
              className={`${shared.btn} ${shared.btnPrimary}`}
              onClick={pause}
              aria-label="Pause timer"
            >
              일시정지
            </button>
          ) : (
            <button
              type="button"
              className={`${shared.btn} ${shared.btnPrimary}`}
              onClick={start}
              disabled={isPrimaryActionLocked}
              aria-label={status === 'paused' ? 'Resume timer' : 'Start timer'}
            >
              {status === 'paused' ? '계속' : '시작'}
            </button>
          )}
          <button
            type="button"
            className={`${shared.btn} ${shared.btnIcon} ${styles.btnDisabled}`}
            aria-label="Timer settings"
            disabled
          >
            ⚙
          </button>
        </div>
      </div>

      <div className={shared.card}>
        <div className={shared.cardTitle}>오늘의 집중</div>
        <div className={styles.todaySummary}>
          <div>
            <div className={`${styles.summaryNumber} ${styles.summaryNumberPrimary}`}>{completedToday}</div>
            <div className={styles.summaryLabel}>완료 세션</div>
          </div>
          <div>
            <div className={`${styles.summaryNumber} ${styles.summaryNumberSecondary}`}>
              {completedToday * 25}
            </div>
            <div className={styles.summaryLabel}>분 집중</div>
          </div>
          <div>
            <div className={`${styles.summaryNumber} ${styles.summaryNumberSuccess}`}>{completedToday * 5}</div>
            <div className={styles.summaryLabel}>분 휴식</div>
          </div>
        </div>

        {completedToday > 0 && (
          <div className={`${shared.pomodoroDots} ${styles.dotsRow}`}>
            {Array.from({ length: Math.min(completedToday, 8) }).map((_, index) => (
              <div key={index} className={`${shared.pomodoroDot} ${shared.completed}`} />
            ))}
            {completedToday < 8 && <div className={shared.pomodoroDot} />}
          </div>
        )}
      </div>
    </div>
  )
}
