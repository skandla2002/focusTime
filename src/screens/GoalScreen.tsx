import { useState } from 'react'
import { useGoalStore } from '../store/goalStore'
import { trackEvent } from '../utils/analytics'
import { formatMinutes } from '../utils/time'
import shared from '../styles/shared.module.css'
import styles from './GoalScreen.module.css'

const PRESETS = [60, 90, 120, 150, 180, 240]

export function GoalScreen() {
  const { goal, setDailyGoal } = useGoalStore()
  const [value, setValue] = useState(goal.dailyGoalMinutes)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setDailyGoal(value)
    setSaved(true)
    void trackEvent('goal_set', { daily_goal_minutes: value })
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className={shared.screen}>
      <div className={shared.header}>
        <div className={shared.headerTitle}>Daily Goal</div>
      </div>

      <div className={shared.card}>
        <div className={shared.cardTitle}>Target focus time</div>
        <div className={styles.goalCurrent}>{formatMinutes(value)}</div>
        <input
          type="range"
          className={styles.goalSlider}
          aria-label="Daily goal minutes"
          min={30}
          max={480}
          step={10}
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
        />
        <div className={styles.goalSliderLabels}>
          <span>30 min</span>
          <span>8 hours</span>
        </div>
      </div>

      <div className={shared.card}>
        <div className={shared.cardTitle}>Quick picks</div>
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
        <div className={`${shared.cardTitle} ${styles.coachCardTitle}`}>
          Coach note
        </div>
        <div className={styles.coachText}>
          {value <= 60 && 'Start small and build consistency. A one-hour target is a great baseline.'}
          {value > 60 && value <= 120 && 'One to two hours is a realistic target for steady daily improvement.'}
          {value > 120 && value <= 180 && 'Two to three hours works well when you can plan breaks between sessions.'}
          {value > 180 && value <= 240 && 'Three to four hours needs structure. Break it into blocks and protect your rest.'}
          {value > 240 && 'That is a big target. Use several Pomodoro rounds and make recovery time part of the plan.'}
        </div>
      </div>

      <div className={styles.saveRow}>
        <button
          type="button"
          className={`${shared.btn} ${shared.btnPrimary} ${styles.saveBtn}`}
          onClick={handleSave}
        >
          {saved ? 'Goal saved' : 'Save goal'}
        </button>
      </div>

      <div className={shared.card}>
        <div className={shared.cardTitle}>Pomodoro guide</div>
        <div className={styles.guideText}>
          <div className={styles.guideRow}>
            Focus for <strong className={styles.guideEmphasis}>25 minutes</strong>, then rest for{' '}
            <strong className={styles.guideEmphasis}>5 minutes</strong>.
          </div>
          <div>
            This rhythm helps you stay engaged without burning out, especially when the goal gets larger.
          </div>
          <div className={styles.guideSessionCount}>
            A goal of {formatMinutes(value)} is about{' '}
            <strong className={styles.guideSessionEmphasis}>{Math.round(value / 25)} focus sessions</strong>.
          </div>
        </div>
      </div>
    </div>
  )
}
