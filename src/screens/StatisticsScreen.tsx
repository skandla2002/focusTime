import { useEffect, useRef, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import type { TooltipItem } from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import { useStudyStore } from '../store/studyStore'
import { useAppStore } from '../store/appStore'
import { formatMinutes, formatDate, getDayLabel } from '../utils/time'
import { shareStudyResult } from '../utils/share'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: TooltipItem<'bar' | 'line'>) => `${ctx.parsed.y} min`,
      },
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: { color: '#9e9e9e', font: { size: 11 } },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: {
        color: '#9e9e9e',
        font: { size: 11 },
        callback: (value: string | number) => `${value} min`,
      },
      beginAtZero: true,
    },
  },
}

export function StatisticsScreen() {
  const { records, getWeekData, getMonthData, getTodayMinutes, getTotalMinutes } = useStudyStore()
  const { triggerInterstitial } = useAppStore()
  const triggeredRef = useRef(false)
  const [shareFeedback, setShareFeedback] = useState<string | null>(null)

  useEffect(() => {
    if (!triggeredRef.current) {
      triggeredRef.current = true
      const timer = setTimeout(() => triggerInterstitial(), 500)
      return () => clearTimeout(timer)
    }
  }, [triggerInterstitial])

  useEffect(() => {
    if (!shareFeedback) {
      return
    }

    const timer = setTimeout(() => setShareFeedback(null), 2500)
    return () => clearTimeout(timer)
  }, [shareFeedback])

  const weekData = getWeekData()
  const monthData = getMonthData()
  const todayMinutes = getTodayMinutes()
  const totalMinutes = getTotalMinutes()
  const todayKey = new Date().toISOString().split('T')[0]
  const todayRecord = records.find((record) => record.date === todayKey)
  const todaySessions = todayRecord?.sessions.length ?? 0

  const activeDays = weekData.filter((day) => day.minutes > 0).length
  const weekTotal = weekData.reduce((sum, day) => sum + day.minutes, 0)
  const monthTotal = monthData.reduce((sum, day) => sum + day.minutes, 0)
  const maxDay = weekData.reduce(
    (best, day) => (day.minutes > best.minutes ? day : best),
    weekData[0]
  )

  const weekChartData = {
    labels: weekData.map((day) => getDayLabel(day.date)),
    datasets: [
      {
        data: weekData.map((day) => day.minutes),
        backgroundColor: weekData.map((_, index) =>
          index === weekData.length - 1
            ? 'rgba(108, 99, 255, 0.9)'
            : 'rgba(108, 99, 255, 0.45)'
        ),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const monthChartData = {
    labels: monthData.map((day) => formatDate(day.date)),
    datasets: [
      {
        data: monthData.map((day) => day.minutes),
        borderColor: 'rgba(79, 195, 247, 0.9)',
        backgroundColor: 'rgba(79, 195, 247, 0.1)',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(79, 195, 247, 0.9)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  async function handleShare() {
    const text = `Today I completed ${todayMinutes} focused minutes across ${todaySessions} sessions! #FocusTimer`

    try {
      const result = await shareStudyResult({
        title: 'FocusTimer study result',
        text,
        url: window.location.href,
      })

      setShareFeedback(
        result === 'shared'
          ? 'Share sheet opened.'
          : 'Share is unavailable here, so the result was copied.'
      )
    } catch {
      setShareFeedback('This device cannot share the result right now.')
    }
  }

  return (
    <div className="screen">
      <div className="header">
        <div className="header-title">Statistics</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title">Today</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-primary-light)' }}>
            {todayMinutes}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>min</div>
        </div>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title">This Week</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-secondary)' }}>
            {weekTotal}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>min</div>
        </div>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title">This Month</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-success)' }}>
            {monthTotal}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>min</div>
        </div>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title">Total</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-warning)' }}>
            {totalMinutes}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>min</div>
        </div>
      </div>

      <div className="card">
        <div className="chart-title">Weekly Focus Time</div>
        {weekTotal > 0 ? (
          <div className="chart-container">
            <Bar data={weekChartData} options={CHART_OPTIONS as never} />
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">+</div>
            <div className="empty-state-text">
              No study history yet.
              <br />
              Start a timer to build your first stats.
            </div>
          </div>
        )}
        <div style={{ marginTop: 12, display: 'flex', gap: 16, justifyContent: 'center', fontSize: 13 }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            Active days <strong style={{ color: 'var(--text-primary)' }}>{activeDays}</strong>
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>
            Best day <strong style={{ color: 'var(--text-primary)' }}>{formatMinutes(maxDay?.minutes ?? 0)}</strong>
          </span>
        </div>
      </div>

      <div className="card">
        <div className="chart-title">30-Day Trend</div>
        {monthTotal > 0 ? (
          <div className="chart-container">
            <Line data={monthChartData} options={CHART_OPTIONS as never} />
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">~</div>
            <div className="empty-state-text">
              More study history is needed
              <br />
              before the monthly trend can appear.
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">Details</div>
        <div className="stat-row">
          <span className="stat-label">Weekly average</span>
          <span className="stat-value">{formatMinutes(Math.round(weekTotal / 7))}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Active days</span>
          <span className="stat-value">{activeDays} / 7</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Monthly total</span>
          <span className="stat-value accent">{formatMinutes(monthTotal)}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Total focus time</span>
          <span className="stat-value accent">{formatMinutes(totalMinutes)}</span>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <div className="card-title">Share Result</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>
          Share today's progress with the system share sheet, or copy the result if sharing is not supported.
        </div>
        <button className="btn btn-primary" onClick={handleShare} style={{ width: '100%' }}>
          Share My Result
        </button>
        {shareFeedback && (
          <div style={{ marginTop: 12, color: 'var(--color-success)', fontSize: 13 }}>
            {shareFeedback}
          </div>
        )}
      </div>
    </div>
  )
}
