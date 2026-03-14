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
import { useAppStore } from '../store/appStore'
import { useStudyStore } from '../store/studyStore'
import { trackEvent } from '../utils/analytics'
import { shareStudyResult } from '../utils/share'
import { formatDate, formatMinutes, getDayLabel } from '../utils/time'
import shared from '../styles/shared.module.css'
import styles from './StatisticsScreen.module.css'

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
        label: (context: TooltipItem<'bar' | 'line'>) => `${context.parsed.y} min`,
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
    weekData[0] ?? { date: todayKey, minutes: 0 }
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
    const shareText = `Today I completed ${todayMinutes} focused minutes across ${todaySessions} sessions! #FocusTimer`

    try {
      const result = await shareStudyResult({
        title: 'FocusTimer study result',
        text: shareText,
        url: window.location.href,
      })

      await trackEvent('share_result', {
        method: result,
        today_minutes: todayMinutes,
        today_sessions: todaySessions,
      })

      setShareFeedback(
        result === 'shared'
          ? 'Share sheet opened.'
          : 'Sharing is not supported here, so the result was copied.'
      )
    } catch {
      setShareFeedback('This device cannot share the result right now.')
    }
  }

  return (
    <div className={shared.screen}>
      <div className={shared.header}>
        <div className={shared.headerTitle}>Statistics</div>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${shared.card} ${styles.gridCard}`}>
          <div className={shared.cardTitle}>Today</div>
          <div className={`${styles.gridNumber} ${styles.gridNumberPrimary}`}>{todayMinutes}</div>
          <div className={styles.gridUnit}>min</div>
        </div>
        <div className={`${shared.card} ${styles.gridCard}`}>
          <div className={shared.cardTitle}>This Week</div>
          <div className={`${styles.gridNumber} ${styles.gridNumberSecondary}`}>{weekTotal}</div>
          <div className={styles.gridUnit}>min</div>
        </div>
        <div className={`${shared.card} ${styles.gridCard}`}>
          <div className={shared.cardTitle}>This Month</div>
          <div className={`${styles.gridNumber} ${styles.gridNumberSuccess}`}>{monthTotal}</div>
          <div className={styles.gridUnit}>min</div>
        </div>
        <div className={`${shared.card} ${styles.gridCard}`}>
          <div className={shared.cardTitle}>Total</div>
          <div className={`${styles.gridNumber} ${styles.gridNumberWarning}`}>{totalMinutes}</div>
          <div className={styles.gridUnit}>min</div>
        </div>
      </div>

      <div className={shared.card}>
        <div className={styles.chartTitle}>Weekly focus time</div>
        {weekTotal > 0 ? (
          <div className={styles.chartContainer}>
            <Bar data={weekChartData} options={CHART_OPTIONS as never} />
          </div>
        ) : (
          <div className={shared.emptyState}>
            <div className={shared.emptyStateIcon}>+</div>
            <div className={shared.emptyStateText}>
              No study history yet.
              <br />
              Start a timer to build your first chart.
            </div>
          </div>
        )}
        <div className={styles.chartMeta}>
          <span className={styles.chartMetaItem}>
            Active days <strong className={styles.chartMetaValue}>{activeDays}</strong>
          </span>
          <span className={styles.chartMetaItem}>
            Best day <strong className={styles.chartMetaValue}>{formatMinutes(maxDay.minutes)}</strong>
          </span>
        </div>
      </div>

      <div className={shared.card}>
        <div className={styles.chartTitle}>30-day trend</div>
        {monthTotal > 0 ? (
          <div className={styles.chartContainer}>
            <Line data={monthChartData} options={CHART_OPTIONS as never} />
          </div>
        ) : (
          <div className={shared.emptyState}>
            <div className={shared.emptyStateIcon}>~</div>
            <div className={shared.emptyStateText}>
              More study history is needed
              <br />
              before the monthly trend can appear.
            </div>
          </div>
        )}
      </div>

      <div className={shared.card}>
        <div className={shared.cardTitle}>Details</div>
        <div className={shared.statRow}>
          <span className={shared.statLabel}>Weekly average</span>
          <span className={shared.statValue}>{formatMinutes(Math.round(weekTotal / 7))}</span>
        </div>
        <div className={shared.statRow}>
          <span className={shared.statLabel}>Active days</span>
          <span className={shared.statValue}>{activeDays} / 7</span>
        </div>
        <div className={shared.statRow}>
          <span className={shared.statLabel}>Monthly total</span>
          <span className={`${shared.statValue} ${shared.accent}`}>{formatMinutes(monthTotal)}</span>
        </div>
        <div className={shared.statRow}>
          <span className={shared.statLabel}>Total focus time</span>
          <span className={`${shared.statValue} ${shared.accent}`}>{formatMinutes(totalMinutes)}</span>
        </div>
      </div>

      <div className={`${shared.card} ${styles.shareCard}`}>
        <div className={shared.cardTitle}>Share result</div>
        <div className={styles.shareDesc}>
          Share today's progress with the system share sheet, or copy it when sharing is unavailable.
        </div>
        <button type="button" className={`${shared.btn} ${shared.btnPrimary} ${styles.shareBtn}`} onClick={handleShare}>
          Share My Result
        </button>
        {shareFeedback && (
          <div className={styles.shareFeedback}>
            {shareFeedback}
          </div>
        )}
      </div>
    </div>
  )
}
