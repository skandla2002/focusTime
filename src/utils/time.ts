export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}분`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}시간 ${m}분` : `${h}시간`
}

export function formatDate(dateStr: string): string {
  const [, month, day] = dateStr.split('-')
  return `${month}/${day}`
}

export function getDayLabel(dateStr: string): string {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const d = new Date(dateStr + 'T00:00:00')
  return days[d.getDay()]
}
