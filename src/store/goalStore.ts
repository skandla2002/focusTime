import { create } from 'zustand'
import type { StudyGoal } from '../types'
import { getGoal, saveGoal } from '../utils/storage'

interface GoalState {
  goal: StudyGoal
  setDailyGoal: (minutes: number) => void
}

export const useGoalStore = create<GoalState>((set) => ({
  goal: getGoal(),

  setDailyGoal: (minutes: number) => {
    const goal: StudyGoal = { dailyGoalMinutes: minutes }
    saveGoal(goal)
    set({ goal })
  },
}))
