import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DisplayModeToggle } from '../components/DisplayModeToggle'
import { MemoInputModal } from '../components/MemoInputModal'
import shared from '../styles/shared.module.css'
import { useAppStore } from '../store/appStore'
import { useMemoStore } from '../store/memoStore'
import { useStudyStore } from '../store/studyStore'
import { useTimerStore } from '../store/timerStore'
import type { FocusSession } from '../types'
import { BREAK_DURATION, FOCUS_DURATION } from '../types'
import { playCompletionAlert } from '../utils/completionAlert'
import { formatMinutes, formatTime } from '../utils/time'
import styles from './TimerScreen.module.css'

interface CompletionNotice {
  title: string
  body: string
}

export function TimerScreen() {
  const { t } = useTranslation()
  const todayMinutes = useStudyStore((state) => state.getTodayMinutes())
  const {
    mode,
    status,
    timeLeft,
    start,
    pause,
    reset,
    tick,
    switchMode,
    completedToday,
    lastCompletionAt,
    lastCompletedMode,
    lastCompletedSession,
  } = useTimerStore()
  const { addSession } = useStudyStore()
  const { loadAll, loaded, getMemoBySessionId, saveMemo } = useMemoStore()
  const { focusLock, setFocusLock, triggerInterstitial } = useAppStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const completionRef = useRef<number | null>(null)
  const processedSessionIdsRef = useRef<Set<string>>(new Set())
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)
  const [lastCompletedDuration, setLastCompletedDuration] = useState<string | null>(null)
  const [completionNotice, setCompletionNotice] = useState<CompletionNotice | null>(null)
  const [pendingMemoSession, setPendingMemoSession] = useState<FocusSession | null>(null)
  const [pendingMemoText, setPendingMemoText] = useState('')
  const [, setShowMemoDropdown] = useState(false)
  const pendingMemoTextRef = useRef('')
  pendingMemoTextRef.current = pendingMemoText

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        tick()
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
  }, [status, tick])

  useEffect(() => {
    if (!lastCompletionAt || lastCompletionAt === completionRef.current || !lastCompletedMode) {
      return
    }

    completionRef.current = lastCompletionAt
    void playCompletionAlert()

    const title =
      lastCompletedMode === 'focus' ? t('timer.alertFocusTitle') : t('timer.alertBreakTitle')
    const body =
      lastCompletedMode === 'focus' && lastCompletedDuration
        ? t('timer.completionFocusBody', { duration: lastCompletedDuration })
        : lastCompletedMode === 'focus'
          ? t('timer.alertFocusBody')
          : t('timer.completionBreakBody')

    setCompletionNotice({ title, body })

    const timer = setTimeout(() => setCompletionNotice(null), 2200)
    return () => clearTimeout(timer)
  }, [lastCompletedDuration, lastCompletedMode, lastCompletionAt, t])

  useEffect(() => {
    if (!loaded || !lastCompletedSession) {
      return
    }

    if (processedSessionIdsRef.current.has(lastCompletedSession.id)) {
      return
    }

    processedSessionIdsRef.current.add(lastCompletedSession.id)
    setLastCompletedDuration(formatMinutes(lastCompletedSession.duration))
    void addSession(lastCompletedSession)

    const inlineMemo = pendingMemoTextRef.current.trim()
    setPendingMemoText('')

    if (inlineMemo) {
      void saveMemo(lastCompletedSession.id, lastCompletedSession.date, inlineMemo)
      triggerInterstitial()
    } else if (getMemoBySessionId(lastCompletedSession.id)) {
      triggerInterstitial()
    } else {
      setPendingMemoSession(lastCompletedSession)
    }
  }, [addSession, getMemoBySessionId, lastCompletedSession, loaded, saveMemo, triggerInterstitial])

  useEffect(() => {
    const acquireWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen')
        } catch {
          // Ignore unsupported or blocked wake lock requests.
        }
      }
    }

    const releaseWakeLock = () => {
      wakeLockRef.current?.release().catch(() => {})
      wakeLockRef.current = null
    }

    if (status === 'running') {
      void acquireWakeLock()
    } else {
      releaseWakeLock()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && status === 'running') {
        void acquireWakeLock()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      releaseWakeLock()
    }
  }, [status])

  function handleReset() {
    reset()
    setPendingMemoText('')
    setShowMemoDropdown(false)
  }

  function handleSwitchMode(newMode: typeof mode) {
    switchMode(newMode)
    setPendingMemoText('')
    setShowMemoDropdown(false)
  }

  async function handleSaveMemo(memo: string) {
    if (!pendingMemoSession) {
      return
    }

    await saveMemo(pendingMemoSession.id, pendingMemoSession.date, memo)
    setPendingMemoSession(null)
    triggerInterstitial()
  }

  function handleSkipMemo() {
    setPendingMemoSession(null)
    triggerInterstitial()
  }

  const totalDuration = mode === 'focus' ? FOCUS_DURATION : BREAK_DURATION
  const progress = (timeLeft / totalDuration) * 100
  const circumference = 2 * Math.PI * 110
  const dashOffset = circumference * (1 - progress / 100)
  const lockButtonLabel = focusLock ? t('timer.disableLock') : t('timer.enableLock')
  const showFocusShield = focusLock && mode === 'focus'
  const showMemoInput =
    mode === 'focus' && (status === 'running' || (status === 'paused' && pendingMemoText.length > 0))

  return (
    <div className={shared.screen}>
      <div className={styles.timerScreenShell}>
        {showFocusShield && (
          <div className={styles.focusShield} aria-hidden="true" data-testid="focus-shield" />
        )}

        <div className={`${shared.header} ${showFocusShield ? styles.focusPriority : ''}`}>
          <div>
            <div className={shared.headerTitle}>{t('timer.title')}</div>
            <div className={shared.headerSubtitle}>
              {focusLock ? t('timer.subtitleLocked') : t('timer.subtitleReady')}
            </div>
          </div>
          <div className={styles.headerActions}>
            <DisplayModeToggle />
            <button
              type="button"
              className={`${shared.btn} ${shared.btnSecondary} ${styles.lockToggle} ${
                focusLock ? styles.lockActive : ''
              }`}
              onClick={() => setFocusLock(!focusLock)}
              aria-label={lockButtonLabel}
            >
              {focusLock ? '🔒' : '🔓'}
            </button>
          </div>
        </div>

        <div className={`${styles.modeTabs} ${showFocusShield ? styles.focusDiminished : ''}`}>
          <button
            type="button"
            className={`${styles.modeTab} ${mode === 'focus' ? styles.active : ''}`}
            onClick={() => handleSwitchMode('focus')}
            disabled={focusLock}
            aria-label={t('timer.focusMode')}
          >
            {t('timer.focusLabel')}
          </button>
          <button
            type="button"
            className={`${styles.modeTab} ${mode === 'break' ? styles.active : ''}`}
            onClick={() => handleSwitchMode('break')}
            disabled={focusLock}
            aria-label={t('timer.breakMode')}
          >
            {t('timer.breakLabel')}
          </button>
        </div>

        {completionNotice && (
          <div
            className={styles.completionOverlay}
            role="status"
            aria-live="polite"
            onClick={() => setCompletionNotice(null)}
          >
            <div className={styles.completionModal}>
              <div className={styles.completionTitle}>{completionNotice.title}</div>
              <div className={styles.completionBody}>{completionNotice.body}</div>
            </div>
          </div>
        )}

        {pendingMemoSession && (
          <MemoInputModal
            sessionId={pendingMemoSession.id}
            date={pendingMemoSession.date}
            onSave={handleSaveMemo}
            onSkip={handleSkipMemo}
          />
        )}

        <div
          className={`${styles.timerDisplay} ${showFocusShield ? `${styles.focusPriority} ${styles.focusPriorityPanel}` : ''}`}
        >
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
                {status === 'running' && (
                  <span className={`${shared.runningIndicator} ${styles.runningDot}`} />
                )}
                {mode === 'focus' ? t('timer.focusTime') : t('timer.breakTime')}
              </div>
            </div>
          </div>

          <div className={styles.timerControls}>
            <button
              type="button"
              className={`${shared.btn} ${shared.btnIcon}`}
              onClick={handleReset}
              aria-label={t('timer.reset')}
            >
              {t('timer.resetShort')}
            </button>
            {status === 'running' ? (
              <button
                type="button"
                className={`${shared.btn} ${shared.btnPrimary}`}
                onClick={pause}
                aria-label={t('timer.pause')}
              >
                {t('timer.pauseText')}
              </button>
            ) : (
              <button
                type="button"
                className={`${shared.btn} ${shared.btnPrimary}`}
                onClick={start}
                aria-label={status === 'paused' ? t('timer.resume') : t('timer.start')}
              >
                {status === 'paused' ? t('timer.resumeText') : t('timer.startText')}
              </button>
            )}
            <button
              type="button"
              className={`${shared.btn} ${shared.btnIcon} ${styles.btnDisabled}`}
              aria-label={t('timer.settings')}
              disabled
            >
              {t('timer.settingsShort')}
            </button>
          </div>

          <div className={styles.todayFocusSummary}>
            <span className={styles.todayFocusSummaryLabel}>{t('timer.todayFocusTime')}</span>
            <strong className={styles.todayFocusSummaryValue}>{formatMinutes(todayMinutes)}</strong>
          </div>
        </div>

        {showMemoInput && (
          <div className={`${shared.card} ${styles.memoInline} ${showFocusShield ? styles.focusDiminished : ''}`}>
            <div className={styles.memoLabel}>{t('timer.memoLabel')}</div>
            <textarea
              className={styles.memoTextarea}
              value={pendingMemoText}
              onChange={(e) => setPendingMemoText(e.target.value)}
              placeholder={t('timer.memoPlaceholder')}
              aria-label={t('timer.memoLabel')}
              maxLength={500}
              rows={2}
            />
            <div className={styles.memoHint}>{t('timer.memoHint')}</div>
          </div>
        )}

        <div className={`${shared.card} ${showFocusShield ? styles.focusDiminished : ''}`}>
          <div className={shared.cardTitle}>{t('timer.todayFocus')}</div>
          <div className={styles.todaySummary}>
            <div>
              <div className={`${styles.summaryNumber} ${styles.summaryNumberPrimary}`}>
                {completedToday}
              </div>
              <div className={styles.summaryLabel}>{t('timer.completedSessions')}</div>
            </div>
            <div>
              <div className={`${styles.summaryNumber} ${styles.summaryNumberSecondary}`}>
                {completedToday * 25}
              </div>
              <div className={styles.summaryLabel}>{t('timer.focusMinutes')}</div>
            </div>
            <div>
              <div className={`${styles.summaryNumber} ${styles.summaryNumberSuccess}`}>
                {completedToday * 5}
              </div>
              <div className={styles.summaryLabel}>{t('timer.breakMinutes')}</div>
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
    </div>
  )
}
