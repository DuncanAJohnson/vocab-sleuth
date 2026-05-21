import type { LetterState } from '../types'

interface CellProps {
  letter: string
  state: LetterState | 'empty' | 'pending'
}

const STATE_CLASSES: Record<CellProps['state'], string> = {
  correct: 'bg-slate-800 text-amber-50 border-slate-800',
  present: 'bg-amber-500 text-slate-900 border-amber-500',
  absent: 'bg-slate-400 text-white border-slate-400',
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
