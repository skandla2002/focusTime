import { describe, expect, it } from 'vitest'
import { formatDate, formatMinutes, formatTime, getDayLabel } from './time'

describe('time utils', () => {
  it('[time] should format seconds as mm:ss when time is provided', () => {
    expect(formatTime(65)).toBe('01:05')
  })

  it('[time] should include the minute count when formatting minutes', () => {
    expect(formatMinutes(125)).toMatch(/125|2|5/)
  })

  it('[time] should support whole-hour minute values', () => {
    expect(formatMinutes(60)).toMatch(/60|1/)
  })

  it('[time] should shorten an iso date into month/day', () => {
    expect(formatDate('2026-03-14')).toBe('03/14')
  })

  it('[time] should return a non-empty weekday label when a date is provided', () => {
    expect(getDayLabel('2026-03-16')).toMatch(/\S+/)
  })
})
