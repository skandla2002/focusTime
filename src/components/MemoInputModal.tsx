import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import shared from '../styles/shared.module.css'
import styles from './MemoInputModal.module.css'

interface Props {
  sessionId: string
  date: string
  onSave: (memo: string) => Promise<void> | void
  onSkip: () => void
}

export function MemoInputModal({ sessionId, date, onSave, onSkip }: Props) {
  const { t } = useTranslation()
  const [memo, setMemo] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!memo.trim()) {
      onSkip()
      return
    }

    setSaving(true)
    try {
      await onSave(memo)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.sheet}>
        <div className={shared.cardTitle}>{t('memoInput.title')}</div>
        <div className={styles.meta}>
          {date} · {sessionId}
        </div>
        <div className={styles.description}>{t('memoInput.description')}</div>
        <textarea
          className={styles.textarea}
          value={memo}
          onChange={(event) => setMemo(event.target.value.slice(0, 500))}
          placeholder={t('memoInput.placeholder')}
          rows={6}
        />
        <div className={styles.helper}>{t('memoInput.helper', { count: memo.length })}</div>
        <div className={styles.actions}>
          <button type="button" className={`${shared.btn} ${shared.btnSecondary}`} onClick={onSkip}>
            {t('memoInput.skip')}
          </button>
          <button
            type="button"
            className={`${shared.btn} ${shared.btnPrimary}`}
            onClick={() => void handleSave()}
            disabled={saving}
          >
            {t('memoInput.save')}
          </button>
        </div>
      </div>
    </div>
  )
}
