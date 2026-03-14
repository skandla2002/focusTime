import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'

const DAILY_NOTIFICATION_ID = 1001
const GOAL_REMINDER_ID = 1002

/** 알림 권한 요청. 권한이 없으면 false 반환 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false
  const { display } = await LocalNotifications.requestPermissions()
  return display === 'granted'
}

/** 현재 알림 권한 상태 확인 */
export async function checkNotificationPermission(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false
  const { display } = await LocalNotifications.checkPermissions()
  return display === 'granted'
}

/** 매일 오전 9시 공부 시작 알림 스케줄 등록 */
export async function scheduleDailyReminder(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return

  await LocalNotifications.cancel({ notifications: [{ id: DAILY_NOTIFICATION_ID }] })

  const scheduleAt = new Date()
  scheduleAt.setHours(9, 0, 0, 0)
  if (scheduleAt <= new Date()) {
    scheduleAt.setDate(scheduleAt.getDate() + 1)
  }

  await LocalNotifications.schedule({
    notifications: [
      {
        id: DAILY_NOTIFICATION_ID,
        title: 'FocusTimer',
        body: '공부 시작할 시간이에요! 오늘 목표를 향해 집중해봐요.',
        schedule: {
          at: scheduleAt,
          repeats: true,
          every: 'day',
        },
        sound: undefined,
        smallIcon: 'ic_stat_icon_config_sample',
        iconColor: '#6C63FF',
      },
    ],
  })
}

/** 매일 오전 9시 알림 취소 */
export async function cancelDailyReminder(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return
  await LocalNotifications.cancel({ notifications: [{ id: DAILY_NOTIFICATION_ID }] })
}

/** 목표 달성 임박 알림 (오후 6시) */
export async function scheduleGoalReminder(remainingMinutes: number): Promise<void> {
  if (!Capacitor.isNativePlatform() || remainingMinutes <= 0) return

  await LocalNotifications.cancel({ notifications: [{ id: GOAL_REMINDER_ID }] })

  const scheduleAt = new Date()
  scheduleAt.setHours(18, 0, 0, 0)
  if (scheduleAt <= new Date()) return // 오후 6시가 지났으면 스킵

  await LocalNotifications.schedule({
    notifications: [
      {
        id: GOAL_REMINDER_ID,
        title: '오늘 목표까지 얼마 안 남았어요!',
        body: `목표까지 ${remainingMinutes}분 남았어요. 지금 시작하면 충분해요!`,
        schedule: { at: scheduleAt },
        sound: undefined,
        smallIcon: 'ic_stat_icon_config_sample',
        iconColor: '#6C63FF',
      },
    ],
  })
}

/** 타이머 완료 즉시 알림 */
export async function notifyTimerComplete(isBreak: boolean): Promise<void> {
  if (!Capacitor.isNativePlatform()) return

  await LocalNotifications.schedule({
    notifications: [
      {
        id: Date.now(),
        title: isBreak ? '휴식 완료!' : '집중 세션 완료!',
        body: isBreak
          ? '다시 집중 시간이에요. 파이팅!'
          : '잠깐 쉬어가세요. 수고했어요!',
        schedule: { at: new Date(Date.now() + 100) },
        sound: undefined,
        smallIcon: 'ic_stat_icon_config_sample',
        iconColor: '#6C63FF',
      },
    ],
  })
}
