import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useMemoStore } from './memoStore'

const { memosTable, reverse, toArray } = vi.hoisted(() => ({
  memosTable: {
    put: vi.fn(),
    orderBy: vi.fn(),
  },
  reverse: vi.fn(),
  toArray: vi.fn(),
}))

vi.mock('../db/focusDb', () => ({
  db: {
    memos: memosTable,
  },
}))

describe('memo store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    reverse.mockReturnValue({ toArray })
    memosTable.orderBy.mockReturnValue({ reverse })
    useMemoStore.setState({ memos: [], loaded: false })
  })

  it('[memoStore] should load all memos from IndexedDB order', async () => {
    toArray.mockResolvedValueOnce([
      { sessionId: 'session_2', date: '2026-03-15', memo: 'Review algebra', createdAt: 2 },
    ])

    await useMemoStore.getState().loadAll()

    expect(memosTable.orderBy).toHaveBeenCalledWith('createdAt')
    expect(useMemoStore.getState().loaded).toBe(true)
    expect(useMemoStore.getState().memos).toHaveLength(1)
  })

  it('[memoStore] should save a memo and keep the latest list in memory', async () => {
    toArray.mockResolvedValueOnce([
      { sessionId: 'session_1', date: '2026-03-15', memo: 'Solve chapter 3', createdAt: 10 },
    ])

    await useMemoStore.getState().saveMemo('session_1', '2026-03-15', '  Solve chapter 3  ')

    expect(memosTable.put).toHaveBeenCalledWith({
      sessionId: 'session_1',
      date: '2026-03-15',
      memo: 'Solve chapter 3',
      createdAt: expect.any(Number),
    })
    expect(useMemoStore.getState().getMemoBySessionId('session_1')?.memo).toBe('Solve chapter 3')
  })
})
