import guesses4 from '../data/guesses-4.json'
import guesses5 from '../data/guesses-5.json'

interface GuessList {
  wordLength: number
  words: string[]
}

function toSet(raw: GuessList): Set<string> {
  const s = new Set<string>()
  for (const w of raw.words) {
    if (typeof w !== 'string' || w.length !== raw.wordLength || !/^[A-Z]+$/.test(w)) {
      throw new Error(
        `Invalid guess word "${w}" for length ${raw.wordLength}: must be ${raw.wordLength} uppercase letters A-Z`,
      )
    }
    s.add(w)
  }
  return s
}

const SETS: Record<number, Set<string>> = {
  4: toSet(guesses4),
  5: toSet(guesses5),
}

export function getGuessSet(wordLength: number): Set<string> | null {
  return SETS[wordLength] ?? null
}

export function isValidGuess(
  guess: string,
  wordLength: number,
  answerWords: readonly string[],
): boolean {
  if (guess.length !== wordLength) return false
  const set = SETS[wordLength]
  if (set && set.has(guess)) return true
  for (const w of answerWords) if (w === guess) return true
  return false
}
