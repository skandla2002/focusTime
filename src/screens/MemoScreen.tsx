import { useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import { useTranslation } from 'react-i18next'
import { useMemoStore } from '../store/memoStore'
import { useStudyStore } from '../store/studyStore'
import shared from '../styles/shared.module.css'
import styles from './MemoScreen.module.css'

type SearchMode = 'exact' | 'fuzzy'

export function MemoScreen() {
  const { t, i18n } = useTranslation()
  const { memos, loadAll } = useMemoStore()
  const { records } = useStudyStore()
  const [query, setQuery] = useState('')
  const [searchMode, setSearchMode] = useState<SearchMode>('exact')

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  const sessionMap = useMemo(() => {
    const sessions = records.flatMap((record) => record.sessions)
    return new Map(sessions.map((session) => [session.id, session]))
  }, [records])

  const fuse = useMemo(
    () =>
      new Fuse(memos, {
        keys: ['memo'],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [memos]
  )

  const filteredMemos = useMemo(() => {
    if (!query.trim()) {
      return memos
    }

    const normalizedQuery = query.trim().toLowerCase()
    if (searchMode === 'exact') {
      return memos.filter((memo) => memo.memo.toLowerCase().includes(normalizedQuery))
    }

    return fuse.search(query.trim()).map((result) => result.item)
  }, [fuse, memos, query, searchMode])

  function formatSessionTime(timestamp: number | undefined): string {
    if (!timestamp) {
      return '--:--'
    }

    return new Intl.DateTimeFormat(i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp))
  }

  return (
    <div className={shared.screen}>
      <div className={shared.header}>
        <div>
          <div className={shared.headerTitle}>{t('memoScreen.title')}</div>
          <div className={shared.headerSubtitle}>{t('memoScreen.subtitle')}</div>
        </div>
      </div>

      <div className={`${shared.card} ${styles.searchCard}`}>
        <input
          className={styles.searchInput}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('memoScreen.searchPlaceholder')}
          aria-label={t('memoScreen.searchPlaceholder')}
        />
        <div className={styles.searchModes}>
          <button
            type="button"
            className={`${styles.searchMode} ${searchMode === 'exact' ? styles.active : ''}`}
            onClick={() => setSearchMode('exact')}
          >
            {t('memoScreen.exact')}
          </button>
          <button
            type="button"
            className={`${styles.searchMode} ${searchMode === 'fuzzy' ? styles.active : ''}`}
            onClick={() => setSearchMode('fuzzy')}
          >
            {t('memoScreen.fuzzy')}
          </button>
        </div>
      </div>

      {filteredMemos.length === 0 ? (
        <div className={shared.card}>
          <div className={shared.emptyState}>
            <div className={shared.emptyStateText}>
              {memos.length === 0 ? t('memoScreen.empty') : t('memoScreen.noResults')}
            </div>
          </div>
        </div>
      ) : (
        filteredMemos.map((memoEntry) => {
          const session = sessionMap.get(memoEntry.sessionId)

          return (
            <div key={memoEntry.sessionId} className={`${shared.card} ${styles.memoCard}`}>
              <div className={styles.memoMeta}>
                <span>{memoEntry.date}</span>
                <span>{formatSessionTime(session?.startTime)}</span>
                <span>{t('memoScreen.duration', { minutes: session?.duration ?? 0 })}</span>
              </div>
              <div className={styles.memoBody}>{memoEntry.memo}</div>
            </div>
          )
        })
      )}
    </div>
  )
}
