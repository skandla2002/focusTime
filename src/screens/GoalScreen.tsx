import { useState } from 'react'
import { useGoalStore } from '../store/goalStore'
import { trackEvent } from '../utils/analytics'
import { formatMinutes } from '../utils/time'

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
    <div className="screen">
      <div className="header">
        <div className="header-title">Daily Goal</div>
      </div>

      <div className="card">
        <div className="card-title">Target focus time</div>
        <div className="goal-current">{formatMinutes(value)}</div>
        <input
          type="range"
          className="goal-slider"
          min={30}
          max={480}
          step={10}
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
          <span>30 min</span>
          <span>8 hours</span>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Quick picks</div>
        <div className="goal-presets">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              className={`goal-preset-btn ${value === preset ? 'selected' : ''}`}
              onClick={() => setValue(preset)}
            >
              {formatMinutes(preset)}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ background: 'rgba(108, 99, 255, 0.08)', borderColor: 'rgba(108, 99, 255, 0.3)' }}>
        <div className="card-title" style={{ color: 'var(--color-primary-light)' }}>
          Coach note
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {value <= 60 && 'Start small and build consistency. A one-hour target is a great baseline.'}
          {value > 60 && value <= 120 && 'One to two hours is a realistic target for steady daily improvement.'}
          {value > 120 && value <= 180 && 'Two to three hours works well when you can plan breaks between sessions.'}
          {value > 180 && value <= 240 && 'Three to four hours needs structure. Break it into blocks and protect your rest.'}
          {value > 240 && 'That is a big target. Use several Pomodoro rounds and make recovery time part of the plan.'}
        </div>
      </div>

      <div style={{ padding: '8px 0' }}>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          style={{ width: '100%', borderRadius: 16 }}
        >
          {saved ? 'Goal saved' : 'Save goal'}
        </button>
      </div>

      <div className="card">
        <div className="card-title">Pomodoro guide</div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <div style={{ marginBottom: 8 }}>
            Focus for <strong style={{ color: 'var(--text-primary)' }}>25 minutes</strong>, then rest for{' '}
            <strong style={{ color: 'var(--text-primary)' }}>5 minutes</strong>.
          </div>
          <div>
            This rhythm helps you stay engaged without burning out, especially when the goal gets larger.
          </div>
          <div style={{ marginTop: 8 }}>
            A goal of {formatMinutes(value)} is about{' '}
            <strong style={{ color: 'var(--color-primary-light)' }}>{Math.round(value / 25)} focus sessions</strong>.
          </div>
        </div>
      </div>
    </div>
  )
}
