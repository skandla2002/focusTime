import { useEffect, useRef } from 'react'
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
import { Bar, Line } from 'react-chartjs-2'
import { useStudyStore } from '../store/studyStore'
import { useAppStore } from '../store/appStore'
import { formatMinutes, formatDate, getDayLabel } from '../utils/time'

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        label: (ctx: any) => `${ctx.parsed.y}분`,
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: (v: any) => `${v}분`,
      },
      beginAtZero: true,
    },
  },
}

export function StatisticsScreen() {
  const { getWeekData, getMonthData, getTodayMinutes, getTotalMinutes } = useStudyStore()
  const { triggerInterstitial } = useAppStore()
  const triggeredRef = useRef(false)

  useEffect(() => {
    if (!triggeredRef.current) {
      triggeredRef.current = true
      // Trigger interstitial on first stats screen visit
      const timer = setTimeout(() => triggerInterstitial(), 500)
      return () => clearTimeout(timer)
    }
  }, [triggerInterstitial])

  const weekData = getWeekData()
  const monthData = getMonthData()
  const todayMinutes = getTodayMinutes()
  const totalMinutes = getTotalMinutes()

  const activeDays = weekData.filter((d) => d.minutes > 0).length
  const weekTotal = weekData.reduce((s, d) => s + d.minutes, 0)
  const monthTotal = monthData.reduce((s, d) => s + d.minutes, 0)
  const maxDay = weekData.reduce(
    (best, d) => (d.minutes > best.minutes ? d : best),
    weekData[0]
  )

  const weekChartData = {
    labels: weekData.map((d) => getDayLabel(d.date)),
    datasets: [
      {
        data: weekData.map((d) => d.minutes),
        backgroundColor: weekData.map((d, i) =>
          i === weekData.length - 1
            ? 'rgba(108, 99, 255, 0.9)'
            : 'rgba(108, 99, 255, 0.45)'
        ),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const monthChartData = {
    labels: monthData.map((d) => formatDate(d.date)),
    datasets: [
      {
        data: monthData.map((d) => d.minutes),
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

  return (
    <div className="screen">
      <div className="header">
        <div className="header-title">통계</div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title">오늘</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-primary-light)' }}>
            {todayMinutes}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>분</div>
        </div>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title">이번 주</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-secondary)' }}>
            {weekTotal}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>분</div>
        </div>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title">이번 달</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-success)' }}>
            {monthTotal}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>분</div>
        </div>
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title">총 누적</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-warning)' }}>
            {totalMinutes}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>분</div>
        </div>
      </div>

      {/* Weekly Bar Chart */}
      <div className="card">
        <div className="chart-title">주간 공부 시간</div>
        {weekTotal > 0 ? (
          <div className="chart-container">
            <Bar data={weekChartData} options={CHART_OPTIONS as never} />
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <div className="empty-state-text">아직 공부 기록이 없어요.<br />타이머를 시작해보세요!</div>
          </div>
        )}
        <div style={{ marginTop: 12, display: 'flex', gap: 16, justifyContent: 'center', fontSize: 13 }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            활동 <strong style={{ color: 'var(--text-primary)' }}>{activeDays}일</strong>
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>
            최고 <strong style={{ color: 'var(--text-primary)' }}>{formatMinutes(maxDay?.minutes ?? 0)}</strong>
          </span>
        </div>
      </div>

      {/* Monthly Line Chart */}
      <div className="card">
        <div className="chart-title">월간 추이 (30일)</div>
        {monthTotal > 0 ? (
          <div className="chart-container">
            <Line data={monthChartData} options={CHART_OPTIONS as never} />
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📈</div>
            <div className="empty-state-text">30일간 기록이 쌓이면<br />추이를 볼 수 있어요!</div>
          </div>
        )}
      </div>

      {/* Detailed stats */}
      <div className="card">
        <div className="card-title">상세 통계</div>
        <div className="stat-row">
          <span className="stat-label">주간 평균</span>
          <span className="stat-value">{formatMinutes(Math.round(weekTotal / 7))}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">활동한 날</span>
          <span className="stat-value">{activeDays}일 / 7일</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">월간 합계</span>
          <span className="stat-value accent">{formatMinutes(monthTotal)}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">총 집중 시간</span>
          <span className="stat-value accent">{formatMinutes(totalMinutes)}</span>
        </div>
      </div>
    </div>
  )
}
