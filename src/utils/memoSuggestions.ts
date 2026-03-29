import Fuse from 'fuse.js'
import type { SessionMemo } from '../db/focusDb'

/** 최근 N건 메모 텍스트 반환 (중복 제거, 최신 순) */
export function getRecentMemos(memos: SessionMemo[], n = 5): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const { memo } of [...memos].sort((a, b) => b.createdAt - a.createdAt)) {
    const text = memo.trim()
    if (text && !seen.has(text)) {
      seen.add(text)
      result.push(text)
    }
    if (result.length >= n) break
  }
  return result
}

/** 빈도 Top N 메모 텍스트 반환 (중복 제거) */
export function getFrequentMemos(memos: SessionMemo[], n = 5): string[] {
  const freq = new Map<string, number>()
  for (const { memo } of memos) {
    const text = memo.trim()
    if (text) freq.set(text, (freq.get(text) ?? 0) + 1)
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([text]) => text)
}

/** 입력 중인 텍스트로 과거 메모 유사도 검색 (Fuse.js) */
export function searchMemos(memos: SessionMemo[], query: string, n = 8): string[] {
  if (!query.trim()) return []
  const fuse = new Fuse(memos, { keys: ['memo'], threshold: 0.4 })
  return fuse
    .search(query)
    .slice(0, n)
    .map((r) => r.item.memo)
}
