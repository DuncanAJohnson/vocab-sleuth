import type { LetterState } from '../types'
import { MAX_GUESSES } from '../hooks/useWordleGame'
import { Cell } from './Cell'

interface BoardProps {
  wordLength: number
  guesses: string[]
  scoredGuesses: LetterState[][]
  currentGuess: string
  invalidShake: boolean
}

export function Board({
  wordLength,
  guesses,
  scoredGuesses,
  currentGuess,
  invalidShake,
}: BoardProps) {
  const rows: { letters: string; states: (LetterState | 'empty' | 'pending')[]; isCurrent: boolean }[] = []

  for (let r = 0; r < MAX_GUESSES; r++) {
    if (r < guesses.length) {
      const word = guesses[r]
      rows.push({
        letters: word,
        states: scoredGuesses[r] as (LetterState | 'empty' | 'pending')[],
        isCurrent: false,
      })
    } else if (r === guesses.length) {
      const padded = currentGuess.padEnd(wordLength, ' ')
      const states: ('empty' | 'pending')[] = []
      for (let c = 0; c < wordLength; c++) {
        states.push(c < currentGuess.length ? 'pending' : 'empty')
      }
      rows.push({ letters: padded, states, isCurrent: true })
    } else {
      rows.push({
        letters: ' '.repeat(wordLength),
        states: new Array(wordLength).fill('empty'),
        isCurrent: false,
      })
    }
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      {rows.map((row, r) => (
        <div
          key={r}
          className={
            'flex gap-1.5 ' + (row.isCurrent && invalidShake ? 'animate-[shake_0.4s_ease-in-out]' : '')
          }
        >
          {row.letters.split('').map((letter, c) => (
            <Cell key={c} letter={letter.trim()} state={row.states[c]} />
          ))}
        </div>
      ))}
    </div>
  )
}
