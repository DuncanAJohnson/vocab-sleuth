import type { LetterState } from '../types'
import { STATE_COLORS } from '../lib/colors'

interface KeyboardProps {
  keyStates: Record<string, LetterState>
  onPress: (key: string) => void
  disabled: boolean
}

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
]

const STATE_CLASSES: Record<LetterState, string> = {
  correct: `${STATE_COLORS.correct.bg} ${STATE_COLORS.correct.text}`,
  present: `${STATE_COLORS.present.bg} ${STATE_COLORS.present.text}`,
  absent: `${STATE_COLORS.absent.bg} ${STATE_COLORS.absent.text}`,
}

export function Keyboard({ keyStates, onPress, disabled }: KeyboardProps) {
  return (
    <div className="flex w-full max-w-lg flex-col items-stretch gap-1.5 px-1">
      {ROWS.map((row, r) => (
        <div key={r} className="flex gap-1 sm:gap-1.5">
          {row.map((key) => {
            const isSpecial = key === 'Enter' || key === 'Backspace'
            const state = isSpecial ? null : keyStates[key]
            const sizing = isSpecial
              ? 'flex-[1.5] min-w-0 px-1 text-[10px] sm:text-xs'
              : 'flex-1 min-w-0 text-sm'
            const color = state
              ? STATE_CLASSES[state]
              : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
            return (
              <button
                key={key}
                type="button"
                disabled={disabled}
                onClick={() => onPress(key)}
                className={
                  'flex h-12 items-center justify-center rounded-md font-semibold uppercase select-none disabled:opacity-60 ' +
                  sizing +
                  ' ' +
                  color
                }
                aria-label={key === 'Backspace' ? 'Backspace' : key}
              >
                {key === 'Backspace' ? '⌫' : key}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
