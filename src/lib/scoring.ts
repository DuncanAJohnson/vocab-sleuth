import type { LetterState } from '../types'

export function scoreGuess(guess: string, answer: string): LetterState[] {
  const len = guess.length
  const result: LetterState[] = new Array(len).fill('absent')
  const remaining: (string | null)[] = answer.split('')

  for (let i = 0; i < len; i++) {
    if (guess[i] === answer[i]) {
      result[i] = 'correct'
      remaining[i] = null
    }
  }
  for (let i = 0; i < len; i++) {
    if (result[i] === 'correct') continue
    const idx = remaining.indexOf(guess[i])
    if (idx !== -1) {
      result[i] = 'present'
      remaining[idx] = null
    }
  }
  return result
}

const RANK: Record<LetterState, number> = { absent: 0, present: 1, correct: 2 }

export function mergeKeyStates(
  current: Record<string, LetterState>,
  guess: string,
  scored: LetterState[],
): Record<string, LetterState> {
  const next = { ...current }
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i]
    const prev = next[letter]
    if (!prev || RANK[scored[i]] > RANK[prev]) {
      next[letter] = scored[i]
    }
  }
  return next
}
