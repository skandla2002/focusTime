import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '../i18n'
import type { StudyRecord } from '../types'
import { useMemoStore } from '../store/memoStore'
import { useStudyStore } from '../store/studyStore'
import { MemoScreen } from './MemoScreen'

const records: StudyRecord[] = [
  {
    id: '2026-03-15',
    date: '2026-03-15',
    totalMinutes: 50,
    sessions: [
      {
        id: 'session_1',
        startTime: new Date('2026-03-15T09:00:00').getTime(),
        endTime: new Date('2026-03-15T09:25:00').getTime(),
        duration: 25,
        date: '2026-03-15',
      },
      {
        id: 'session_2',
        startTime: new Date('2026-03-15T10:00:00').getTime(),
        endTime: new Date('2026-03-15T10:25:00').getTime(),
        duration: 25,
        date: '2026-03-15',
      },
    ],
  },
]

describe('memo screen', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    useMemoStore.setState({
      memos: [
        {
          sessionId: 'session_1',
          date: '2026-03-15',
          memo: 'Review algebra chapter 4',
          createdAt: 1,
        },
        {
          sessionId: 'session_2',
          date: '2026-03-15',
          memo: 'Write history summary',
          createdAt: 2,
        },
      ],
      loaded: true,
      loadAll: vi.fn().mockResolvedValue(undefined),
    })
    useStudyStore.setState({
      records,
      syncing: false,
    })
  })

  it('[MemoScreen] should filter memos with exact search', async () => {
    const user = userEvent.setup()

    render(<MemoScreen />)

    await user.type(screen.getByRole('textbox', { name: 'Search memos' }), 'algebra')

    expect(screen.getByText('Review algebra chapter 4')).toBeTruthy()
    expect(screen.queryByText('Write history summary')).toBeNull()
    expect(screen.getByText('25 min focus')).toBeTruthy()
  })

  it('[MemoScreen] should return fuzzy matches when fuzzy mode is enabled', async () => {
    const user = userEvent.setup()

    render(<MemoScreen />)

    const searchInput = screen.getByRole('textbox', { name: 'Search memos' })
    await user.type(searchInput, 'algebrah')

    expect(screen.getByText('No memos matched your search.')).toBeTruthy()

    await user.click(screen.getByRole('button', { name: 'Fuzzy' }))

    expect(screen.getByText('Review algebra chapter 4')).toBeTruthy()
    expect(screen.queryByText('No memos matched your search.')).toBeNull()
  })
})
