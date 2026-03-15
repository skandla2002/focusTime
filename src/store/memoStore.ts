import { create } from 'zustand'
import { db, type SessionMemo } from '../db/focusDb'

interface MemoState {
  memos: SessionMemo[]
  loaded: boolean
  loadAll: () => Promise<void>
  saveMemo: (sessionId: string, date: string, memo: string) => Promise<void>
  getMemoBySessionId: (sessionId: string) => SessionMemo | undefined
}

async function readAllMemos(): Promise<SessionMemo[]> {
  return db.memos.orderBy('createdAt').reverse().toArray()
}

export const useMemoStore = create<MemoState>((set, get) => ({
  memos: [],
  loaded: false,

  loadAll: async () => {
    const memos = await readAllMemos()
    set({ memos, loaded: true })
  },

  saveMemo: async (sessionId, date, memo) => {
    const entry: SessionMemo = {
      sessionId,
      date,
      memo: memo.trim(),
      createdAt: Date.now(),
    }

    await db.memos.put(entry)
    const memos = await readAllMemos()
    set({ memos, loaded: true })
  },

  getMemoBySessionId: (sessionId) => get().memos.find((memo) => memo.sessionId === sessionId),
}))
