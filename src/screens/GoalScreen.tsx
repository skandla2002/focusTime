import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DisplayModeToggle } from '../components/DisplayModeToggle'
import { useGoalStore } from '../store/goalStore'
import { trackEvent } from '../utils/analytics'
import { formatMinutes } from '../utils/time'
import shared from '../styles/shared.module.css'
import styles from './GoalScreen.module.css'

const PRESETS = [60, 90, 120, 150, 180, 240]

export function GoalScreen() {
  const { t } = useTranslation()
  const { goal, setDailyGoal } = useGoalStore()
  const [value, setValue] = useState(goal.dailyGoalMinutes)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setDailyGoal(value)
    setSaved(true)
    void trackEvent('goal_set', { daily_goal_minutes: value })
    setTimeout(() => setSaved(false), 2000)
  }

  function getCoachCopy(): string {
    if (value <= 60) return t('goal.coachSmall')
    if (value <= 120) return t('goal.coachSteady')
    if (value <= 180) return t('goal.coachBalanced')
    if (value <= 240) return t('goal.coachStructured')
    return t('goal.coachBig')
  }

  return (
    <div className={shared.screen}>
      <div className={shared.header}>
        <div className={shared.headerTitle}>{t('goal.title')}</div>
        <DisplayModeToggle />
      </div>

      <div className={shared.card}>
        <div className={shared.cardTitle}>{t('goal.targetFocusTime')}</div>
        <div className={styles.goalCurrent}>{formatMinutes(value)}</div>
        <input
          type="range"
          className={styles.goalSlider}
          aria-label={t('goal.ariaGoalMinutes')}
          min={30}
          max={480}
          step={10}
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
        />
        <div className={styles.goalSliderLabels}>
          <span>{t('goal.sliderMin')}</span>
          <span>{t('goal.sliderMax')}</span>
        </div>
      </div>

      <div className={shared.card}>
        <div className={shared.cardTitle}>{t('goal.quickPicks')}</div>
        <div className={styles.goalPresets}>
          {PRESETS.map((preset) => (
            <button
              type="button"
              key={preset}
              className={`${styles.goalPresetBtn} ${value === preset ? styles.selected : ''}`}
              onClick={() => setValue(preset)}
            >
              {formatMinutes(preset)}
            </button>
          ))}
        </div>
      </div>

      <div className={`${shared.card} ${styles.coachCard}`}>
        <div className={`${shared.cardTitle} ${styles.coachCardTitle}`}>{t('goal.coachNote')}</div>
        <div className={styles.coachText}>{getCoachCopy()}</div>
      </div>

      <div className={styles.saveRow}>
        <button
          type="button"
          className={`${shared.btn} ${shared.btnPrimary} ${styles.saveBtn}`}
          onClick={handleSave}
        >
          {saved ? t('goal.goalSaved') : t('goal.saveGoal')}
        </button>
      </div>

      <div className={shared.card}>
        <div className={shared.cardTitle}>{t('goal.pomodoroGuide')}</div>
        <div className={styles.guideText}>
          <div className={styles.guideRow}>
            {t('common.focus')} <strong className={styles.guideEmphasis}>25 {t('common.minutesShort')}</strong>,{' '}
            {t('common.break')} <strong className={styles.guideEmphasis}>5 {t('common.minutesShort')}</strong>.
          </div>
          <div>{t('goal.guideLine2')}</div>
          <div className={styles.guideSessionCount}>
            {t('goal.guideLine3', {
              goal: formatMinutes(value),
              sessions: Math.round(value / 25),
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
