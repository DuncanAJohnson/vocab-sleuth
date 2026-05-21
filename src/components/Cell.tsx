import type { LetterState } from '../types'
import { STATE_COLORS } from '../lib/colors'

interface CellProps {
  letter: string
  state: LetterState | 'empty' | 'pending'
}

const letterStateClass = (state: LetterState) =>
  `${STATE_COLORS[state].bg} ${STATE_COLORS[state].text} ${STATE_COLORS[state].border}`

const STATE_CLASSES: Record<CellProps['state'], string> = {
  correct: letterStateClass('correct'),
  present: letterStateClass('present'),
  absent: letterStateClass('absent'),
  pending: 'bg-white text-slate-900 border-slate-500',
  empty: 'bg-white text-slate-900 border-slate-300',
}

export function Cell({ letter, state }: CellProps) {
  return (
    <div
      className={
        'flex h-14 w-14 items-center justify-center border-2 text-2xl font-bold uppercase ' +
        STATE_CLASSES[state]
      }
    >
      {letter}
    </div>
  )
}
