import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { useMemoStore } from '../store/memoStore'
import { useStudyStore } from '../store/studyStore'
import { trackEvent } from '../utils/analytics'
import { getTopWords, getHourlyDistribution } from '../utils/memoStats'
import { shareScreenshot } from '../utils/share'
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

export function StatisticsScreen() {
  const { t } = useTranslation()
  const { records, getWeekData, getMonthData, getTodayMinutes, getTotalMinutes } = useStudyStore()
  const { triggerInterstitial } = useAppStore()
  const { memos, loadAll, loaded } = useMemoStore()
  const triggeredRef = useRef(false)
  const shareTargetRef = useRef<HTMLDivElement | null>(null)
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

  useEffect(() => {
    if (!loaded) void loadAll()
  }, [loaded, loadAll])

  const weekData = getWeekData()
  const monthData = getMonthData()
  const todayMinutes = getTodayMinutes()
  const totalMinutes = getTotalMinutes()
  const todayKey = new Date().toISOString().split('T')[0]
  const todayRecord = records.find((record) => record.date === todayKey)
  const todaySessions = todayRecord?.sessions.length ?? 0

  const topWords = getTopWords(memos)
  const hourlyDist = getHourlyDistribution(memos)
  const maxHourCount = Math.max(...hourlyDist, 1)

  const activeDays = weekData.filter((day) => day.minutes > 0).length
  const weekTotal = weekData.reduce((sum, day) => sum + day.minutes, 0)
  const monthTotal = monthData.reduce((sum, day) => sum + day.minutes, 0)
  const maxDay = weekData.reduce(
    (best, day) => (day.minutes > best.minutes ? day : best),
    weekData[0] ?? { date: todayKey, minutes: 0 }
  )

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar' | 'line'>) =>
            `${context.parsed.y} ${t('common.minutesShort')}`,
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
          callback: (value: string | number) => `${value} ${t('common.minutesShort')}`,
        },
        beginAtZero: true,
      },
    },
  }

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
    const shareTarget = shareTargetRef.current
    const shareText = t('statistics.shareText', {
      minutes: todayMinutes,
      sessions: todaySessions,
    })

    if (!shareTarget) {
      setShareFeedback(t('statistics.shareUnavailable'))
      return
    }

    try {
      const result = await shareScreenshot({
        elementRef: shareTarget,
        filename: `focustimer-${todayKey}.png`,
        title: t('statistics.shareTitle'),
        text: shareText,
      })

      await trackEvent('share_result', {
        method: result,
        today_minutes: todayMinutes,
        today_sessions: todaySessions,
      })

      setShareFeedback(result === 'shared' ? t('statistics.shareOpened') : t('statistics.shareCopied'))
    } catch {
      setShareFeedback(t('statistics.shareUnavailable'))
    }
  }

  return (
    <div className={shared.screen} ref={shareTargetRef}>
      <div className={shared.header}>
        <div className={shared.headerTitle}>{t('statistics.title')}</div>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${shared.card} ${styles.gridCard}`}>
          <div className={shared.cardTitle}>{t('common.today')}</div>
          <div className={`${styles.gridNumber} ${styles.gridNumberPrimary}`}>{todayMinutes}</div>
          <div className={styles.gridUnit}>{t('common.minutesShort')}</div>
        </div>
        <div className={`${shared.card} ${styles.gridCard}`}>
          <div className={shared.cardTitle}>{t('statistics.thisWeek')}</div>
          <div className={`${styles.gridNumber} ${styles.gridNumberSecondary}`}>{weekTotal}</div>
          <div className={styles.gridUnit}>{t('common.minutesShort')}</div>
        </div>
        <div className={`${shared.card} ${styles.gridCard}`}>
          <div className={shared.cardTitle}>{t('statistics.thisMonth')}</div>
          <div className={`${styles.gridNumber} ${styles.gridNumberSuccess}`}>{monthTotal}</div>
          <div className={styles.gridUnit}>{t('common.minutesShort')}</div>
        </div>
        <div className={`${shared.card} ${styles.gridCard}`}>
          <div className={shared.cardTitle}>{t('common.total')}</div>
          <div className={`${styles.gridNumber} ${styles.gridNumberWarning}`}>{totalMinutes}</div>
          <div className={styles.gridUnit}>{t('common.minutesShort')}</div>
        </div>
      </div>

      <div className={shared.card}>
        <div className={styles.chartTitle}>{t('statistics.weeklyFocusTime')}</div>
        {weekTotal > 0 ? (
          <div className={styles.chartContainer}>
            <Bar data={weekChartData} options={chartOptions as never} />
          </div>
        ) : (
          <div className={shared.emptyState}>
            <div className={shared.emptyStateIcon}>+</div>
            <div className={shared.emptyStateText}>
              {t('statistics.noHistoryTitle')}
              <br />
              {t('statistics.noHistoryBody')}
            </div>
          </div>
        )}
        <div className={styles.chartMeta}>
          <span className={styles.chartMetaItem}>
            {t('statistics.activeDays')} <strong className={styles.chartMetaValue}>{activeDays}</strong>
          </span>
          <span className={styles.chartMetaItem}>
            {t('statistics.bestDay')} <strong className={styles.chartMetaValue}>{formatMinutes(maxDay.minutes)}</strong>
          </span>
        </div>
      </div>

      <div className={shared.card}>
        <div className={styles.chartTitle}>{t('statistics.trendTitle')}</div>
        {monthTotal > 0 ? (
          <div className={styles.chartContainer}>
            <Line data={monthChartData} options={chartOptions as never} />
          </div>
        ) : (
          <div className={shared.emptyState}>
            <div className={shared.emptyStateIcon}>~</div>
            <div className={shared.emptyStateText}>
              {t('statistics.trendEmptyTitle')}
              <br />
              {t('statistics.trendEmptyBody')}
            </div>
          </div>
        )}
      </div>

      <div className={shared.card}>
        <div className={shared.cardTitle}>{t('statistics.details')}</div>
        <div className={shared.statRow}>
          <span className={shared.statLabel}>{t('statistics.weeklyAverage')}</span>
          <span className={shared.statValue}>{formatMinutes(Math.round(weekTotal / 7))}</span>
        </div>
        <div className={shared.statRow}>
          <span className={shared.statLabel}>{t('statistics.activeDays')}</span>
          <span className={shared.statValue}>{activeDays} / 7</span>
        </div>
        <div className={shared.statRow}>
          <span className={shared.statLabel}>{t('statistics.monthlyTotal')}</span>
          <span className={`${shared.statValue} ${shared.accent}`}>{formatMinutes(monthTotal)}</span>
        </div>
        <div className={shared.statRow}>
          <span className={shared.statLabel}>{t('statistics.totalFocusTime')}</span>
          <span className={`${shared.statValue} ${shared.accent}`}>{formatMinutes(totalMinutes)}</span>
        </div>
      </div>

      <div className={shared.card}>
        <div className={styles.chartTitle}>{t('statistics.topWordsTitle')}</div>
        {topWords.length === 0 ? (
          <div className={styles.memoStatsEmpty}>{t('statistics.memoStatsEmpty')}</div>
        ) : (
          <div className={styles.wordList}>
            {topWords.map(({ word, count }) => (
              <div key={word} className={styles.wordRow}>
                <span className={styles.wordLabel}>{word}</span>
                <div className={styles.wordBarWrap}>
                  <div
                    className={styles.wordBar}
                    style={{ '--bar-pct': `${(count / topWords[0].count) * 100}%` } as React.CSSProperties}
                  />
                </div>
                <span className={styles.wordCount}>{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={shared.card}>
        <div className={styles.chartTitle}>{t('statistics.hourlyTitle')}</div>
        {memos.length === 0 ? (
          <div className={styles.memoStatsEmpty}>{t('statistics.memoStatsEmpty')}</div>
        ) : (
          <div className={styles.hourlyChart}>
            {hourlyDist.map((count, hour) => (
              <div key={hour} className={styles.hourlyBarWrap}>
                <div
                  className={styles.hourlyBar}
                  style={{ '--bar-pct': `${(count / maxHourCount) * 100}%` } as React.CSSProperties}
                />
                {hour % 6 === 0 && (
                  <span className={`${styles.hourlyLabel} ${count > 0 ? styles.hourlyLabelVisible : ''}`}>
                    {hour}{t('statistics.hourSuffix')}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`${shared.card} ${styles.shareCard}`}>
        <div className={shared.cardTitle}>{t('statistics.shareResult')}</div>
        <div className={styles.shareDesc}>{t('statistics.shareDesc')}</div>
        <button type="button" className={`${shared.btn} ${shared.btnPrimary} ${styles.shareBtn}`} onClick={handleShare}>
          {t('statistics.shareButton')}
        </button>
        {shareFeedback && <div className={styles.shareFeedback}>{shareFeedback}</div>}
      </div>
    </div>
  )
}
