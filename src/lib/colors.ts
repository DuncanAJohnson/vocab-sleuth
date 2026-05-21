import type { LetterState } from '../types'

interface StateColors {
  name: string
  bg: string
  border: string
  text: string
}

export const STATE_COLORS: Record<LetterState, StateColors> = {
  correct: {
    name: 'Green',
    bg: 'bg-green-900',
    border: 'border-green-900',
    text: 'text-white',
  },
  present: {
    name: 'Yellow',
    bg: 'bg-amber-400',
    border: 'border-amber-400',
    text: 'text-slate-900',
  },
  absent: {
    name: 'Gray',
    bg: 'bg-slate-500',
    border: 'border-slate-500',
    text: 'text-white',
  },
}
