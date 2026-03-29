import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { SessionMemo } from '../db/focusDb'
import { getRecentMemos, getFrequentMemos, searchMemos } from '../utils/memoSuggestions'
import styles from './MemoDropdown.module.css'

interface Props {
  memos: SessionMemo[]
  query: string
  onSelect: (text: string) => void
  onClose: () => void
}

export function MemoDropdown({ memos, query, onSelect, onClose }: Props) {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [onClose])

  const trimmed = query.trim()

  if (trimmed) {
    const results = searchMemos(memos, trimmed)
    return (
      <div ref={ref} className={styles.dropdown}>
        {results.length === 0 ? (
          <div className={styles.empty}>{t('memoDropdown.empty')}</div>
        ) : (
          <>
            <div className={styles.sectionLabel}>{t('memoDropdown.searchResult')}</div>
            {results.map((text) => (
              <button
                key={text}
                type="button"
                className={styles.item}
                onPointerDown={(e) => {
                  e.preventDefault()
                  onSelect(text)
                }}
              >
                {text}
              </button>
            ))}
          </>
        )}
      </div>
    )
  }

  const recent = getRecentMemos(memos)
  const frequent = getFrequentMemos(memos)
  // 자주 목록에서 최근과 겹치는 항목 제외
  const frequentFiltered = frequent.filter((t) => !recent.includes(t))

  if (recent.length === 0 && frequentFiltered.length === 0) {
    return (
      <div ref={ref} className={styles.dropdown}>
        <div className={styles.empty}>{t('memoDropdown.empty')}</div>
      </div>
    )
  }

  return (
    <div ref={ref} className={styles.dropdown}>
      {recent.length > 0 && (
        <>
          <div className={styles.sectionLabel}>{t('memoDropdown.recent')}</div>
          {recent.map((text) => (
            <button
              key={`recent-${text}`}
              type="button"
              className={styles.item}
              onPointerDown={(e) => {
                e.preventDefault()
                onSelect(text)
              }}
            >
              {text}
            </button>
          ))}
        </>
      )}
      {frequentFiltered.length > 0 && (
        <>
          <div className={styles.sectionLabel}>{t('memoDropdown.frequent')}</div>
          {frequentFiltered.map((text) => (
            <button
              key={`freq-${text}`}
              type="button"
              className={styles.item}
              onPointerDown={(e) => {
                e.preventDefault()
                onSelect(text)
              }}
            >
              {text}
            </button>
          ))}
        </>
      )}
    </div>
  )
}
