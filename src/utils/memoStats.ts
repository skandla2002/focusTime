import type { SessionMemo } from '../db/focusDb'

const STOP_WORDS = new Set([
  '그리고', '하지만', '그런데', '에서', '으로', '에게', '을', '를', '이', '가', '은', '는',
  '도', '만', '부터', '까지', '와', '과', '이나', '나', '에', '로', '의', '한', '하다',
])

/** 단어 빈도 Top N 반환 (2자 이상, 불용어 제외) */
export function getTopWords(
  memos: SessionMemo[],
  topN = 10,
): { word: string; count: number }[] {
  const freq = new Map<string, number>()

  for (const { memo } of memos) {
    for (const token of memo.split(/\s+/)) {
      const word = token.replace(/[^가-힣a-zA-Z0-9]/g, '').trim()
      if (word.length >= 2 && !STOP_WORDS.has(word)) {
        freq.set(word, (freq.get(word) ?? 0) + 1)
      }
    }
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word, count]) => ({ word, count }))
}

/** 시간대별(0~23시) 집중 세션 수 반환 */
export function getHourlyDistribution(memos: SessionMemo[]): number[] {
  const hours = Array<number>(24).fill(0)
  for (const { createdAt } of memos) {
    hours[new Date(createdAt).getHours()]++
  }
  return hours
}
