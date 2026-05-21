import type { GradeId, PersistedGame } from '../types'
import { isGradeId } from './grades'

const GRADE_KEY = 'vocabsleuth:grade'
const gameKey = (grade: GradeId, day: number) => `vocabsleuth:game:${grade}:${day}`

export function loadSelectedGrade(): GradeId | null {
  try {
    const v = localStorage.getItem(GRADE_KEY)
    return isGradeId(v) ? v : null
  } catch {
    return null
  }
}

export function saveSelectedGrade(grade: GradeId): void {
  try {
    localStorage.setItem(GRADE_KEY, grade)
  } catch {
    // ignore
  }
}

export function loadGame(grade: GradeId, day: number): PersistedGame | null {
  try {
    const raw = localStorage.getItem(gameKey(grade, day))
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedGame
    if (!parsed || !Array.isArray(parsed.guesses)) return null
    return parsed
  } catch {
    return null
  }
}

export function saveGame(grade: GradeId, day: number, game: PersistedGame): void {
  try {
    localStorage.setItem(gameKey(grade, day), JSON.stringify(game))
  } catch {
    // ignore
  }
}
