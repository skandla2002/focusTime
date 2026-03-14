import { useState } from 'react'
import { useGoalStore } from '../store/goalStore'
import { formatMinutes } from '../utils/time'

const PRESETS = [60, 90, 120, 150, 180, 240]

export function GoalScreen() {
  const { goal, setDailyGoal } = useGoalStore()
  const [value, setValue] = useState(goal.dailyGoalMinutes)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setDailyGoal(value)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handlePreset(minutes: number) {
    setValue(minutes)
  }

  return (
    <div className="screen">
      <div className="header">
        <div className="header-title">목표 설정</div>
      </div>

      <div className="card">
        <div className="card-title">하루 목표 공부시간</div>
        <div className="goal-current">{formatMinutes(value)}</div>

        {/* Slider */}
        <input
          type="range"
          className="goal-slider"
          min={30}
          max={480}
          step={10}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
          <span>30분</span>
          <span>8시간</span>
        </div>
      </div>

      {/* Preset buttons */}
      <div className="card">
        <div className="card-title">빠른 선택</div>
        <div className="goal-presets">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              className={`goal-preset-btn ${value === preset ? 'selected' : ''}`}
              onClick={() => handlePreset(preset)}
            >
              {formatMinutes(preset)}
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="card" style={{ background: 'rgba(108, 99, 255, 0.08)', borderColor: 'rgba(108, 99, 255, 0.3)' }}>
        <div className="card-title" style={{ color: 'var(--color-primary-light)' }}>
          💡 팁
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {value <= 60 && '처음 시작이라면 1시간부터 시작해보세요. 꾸준함이 중요해요!'}
          {value > 60 && value <= 120 && '1-2시간의 집중은 효율적인 학습에 최적이에요.'}
          {value > 120 && value <= 180 && '2-3시간 목표는 중학생~고등학생에게 추천해요.'}
          {value > 180 && value <= 240 && '3-4시간 목표는 수험생에게 적합해요. 충분한 휴식도 잊지 마세요!'}
          {value > 240 && '높은 목표를 세웠군요! 포모도로 기법으로 집중력을 유지하세요.'}
        </div>
      </div>

      {/* Save button */}
      <div style={{ padding: '8px 0' }}>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          style={{ width: '100%', borderRadius: 16 }}
        >
          {saved ? '✓ 저장됨!' : '목표 저장'}
        </button>
      </div>

      {/* Pomodoro info */}
      <div className="card">
        <div className="card-title">포모도로 기법이란?</div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <div style={{ marginBottom: 8 }}>
            🍅 <strong style={{ color: 'var(--text-primary)' }}>집중 25분</strong> →
            ☕ <strong style={{ color: 'var(--text-primary)' }}>휴식 5분</strong>
          </div>
          <div>
            반복적인 짧은 집중 세션으로 집중력을 높이고 번아웃을 방지하는 시간 관리 기법이에요.
          </div>
          <div style={{ marginTop: 8 }}>
            목표 {formatMinutes(value)}은 약{' '}
            <strong style={{ color: 'var(--color-primary-light)' }}>
              {Math.round(value / 25)}개 세션
            </strong>에 해당해요.
          </div>
        </div>
      </div>
    </div>
  )
}
