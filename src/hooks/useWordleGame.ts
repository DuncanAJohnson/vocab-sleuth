import { useCallback, useEffect, useMemo, useState } from 'react'
import type { GameStatus, GradeMeta, LetterState } from '../types'
import { dayIndex, pickDailyWord } from '../lib/dailyWord'
import { isValidGuess } from '../lib/guesses'
import { mergeKeyStates, scoreGuess } from '../lib/scoring'
import { loadGame, saveGame } from '../lib/storage'

export const MAX_GUESSES = 6

export interface UseWordleGame {
  answer: string | null
  wordLength: number
  guesses: string[]
  currentGuess: string
  status: GameStatus
  invalidShake: boolean
  scoredGuesses: LetterState[][]
  keyStates: Record<string, LetterState>
  error: string | null
  press: (key: string) => void
  reset: () => void
}

function computeStatus(guesses: string[], answer: string | null): GameStatus {
  if (!answer) return 'playing'
  if (guesses.length > 0 && guesses[guesses.length - 1] === answer) return 'won'
  if (guesses.length >= MAX_GUESSES) return 'lost'
  return 'playing'
}

export function useWordleGame(grade: GradeMeta): UseWordleGame {
  const today = useMemo(() => dayIndex(), [])
  const answer = useMemo(() => pickDailyWord(grade.list, grade.id), [grade])
  const wordLength = grade.list.wordLength

  const [guesses, setGuesses] = useState<string[]>(
    () => loadGame(grade.id, today)?.guesses ?? [],
  )
  const [currentGuess, setCurrentGuess] = useState('')
  const [invalidShake, setInvalidShake] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    saveGame(grade.id, today, { guesses })
  }, [grade.id, today, guesses])

  const status = computeStatus(guesses, answer)

  const scoredGuesses = useMemo<LetterState[][]>(() => {
    if (!answer) return []
    return guesses.map((g) => scoreGuess(g, answer))
  }, [guesses, answer])

  const keyStates = useMemo<Record<string, LetterState>>(() => {
    let acc: Record<string, LetterState> = {}
    for (let i = 0; i < scoredGuesses.length; i++) {
      acc = mergeKeyStates(acc, guesses[i], scoredGuesses[i])
    }
    return acc
  }, [guesses, scoredGuesses])

  const flashError = useCallback((msg: string) => {
    setInvalidShake(true)
    setError(msg)
    window.setTimeout(() => setInvalidShake(false), 400)
    window.setTimeout(() => setError((prev) => (prev === msg ? null : prev)), 1500)
  }, [])

  const press = useCallback(
    (key: string) => {
      if (!answer) return
      if (status !== 'playing') return
      if (key === 'Enter') {
        if (currentGuess.length !== wordLength) {
          flashError('Not enough letters')
          return
        }
        if (!isValidGuess(currentGuess, wordLength, grade.list.words)) {
          flashError('Not in word list')
          return
        }
        setError(null)
        setGuesses((prev) => [...prev, currentGuess])
        setCurrentGuess('')
        return
      }
      if (key === 'Backspace') {
        setCurrentGuess((prev) => prev.slice(0, -1))
        return
      }
      if (/^[a-zA-Z]$/.test(key)) {
        setCurrentGuess((prev) =>
          prev.length < wordLength ? prev + key.toUpperCase() : prev,
        )
      }
    },
    [answer, currentGuess, grade.list.words, status, wordLength, flashError],
  )

  const reset = useCallback(() => {
    setGuesses([])
    setCurrentGuess('')
    setError(null)
    setInvalidShake(false)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'Enter' || e.key === 'Backspace') {
        e.preventDefault()
        press(e.key)
        return
      }
      if (/^[a-zA-Z]$/.test(e.key)) {
        press(e.key)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [press])

  return {
    answer,
    wordLength,
    guesses,
    currentGuess,
    status,
    invalidShake,
    scoredGuesses,
    keyStates,
    error,
    press,
    reset,
  }
}
