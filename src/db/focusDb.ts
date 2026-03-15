import Dexie, { type Table } from 'dexie'

export interface SessionMemo {
  sessionId: string
  date: string
  memo: string
  createdAt: number
}

export class FocusDb extends Dexie {
  memos!: Table<SessionMemo, string>

  constructor() {
    super('FocusTimerDB')

    this.version(1).stores({
      memos: 'sessionId, date, createdAt',
    })
  }
}

export const db = new FocusDb()
