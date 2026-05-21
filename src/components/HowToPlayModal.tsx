import { useEffect, useState } from 'react'
import { STATE_COLORS } from '../lib/colors'

const OPEN_EVENT = 'vocabsleuth:howtoplay'

export function openHowToPlay(): void {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

export function useHowToPlay(): { open: boolean; setOpen: (open: boolean) => void } {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener(OPEN_EVENT, handler)
    return () => window.removeEventListener(OPEN_EVENT, handler)
  }, [])
  return { open, setOpen }
}

interface HowToPlayModalProps {
  open: boolean
  onClose: () => void
}

export function HowToPlayModal({ open, onClose }: HowToPlayModalProps) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="howtoplay-title"
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="howtoplay-title" className="text-xl font-semibold text-slate-900">
            How to Play
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mt-1 -mr-2 rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            ✕
          </button>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-slate-700">
          Guess the daily mystery word in six tries. Each guess must be a real
          word of the right length. After each guess, the tiles change color to
          show how close you were.
        </p>

        <ul className="mb-4 space-y-3 text-sm text-slate-700">
          <li className="flex items-center gap-3">
            <ExampleCell letter="A" variant="correct" />
            <span>
              <span className="font-semibold">{STATE_COLORS.correct.name}:</span> right letter, right
              spot.
            </span>
          </li>
          <li className="flex items-center gap-3">
            <ExampleCell letter="B" variant="present" />
            <span>
              <span className="font-semibold">{STATE_COLORS.present.name}:</span> right letter, wrong
              spot.
            </span>
          </li>
          <li className="flex items-center gap-3">
            <ExampleCell letter="C" variant="absent" />
            <span>
              <span className="font-semibold">{STATE_COLORS.absent.name}:</span> not in the word.
            </span>
          </li>
        </ul>

        <p className="mb-4 text-sm leading-relaxed text-slate-700">
          A new word is picked each day. Everyone playing the same grade level
          gets the same word.
        </p>

        <div className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
          <p className="mb-3 text-sm font-medium text-slate-800">
            Example: guessing <span className="font-mono uppercase">learn</span>
          </p>
          <div className="flex flex-col items-center gap-1.5">
            {EXAMPLE_ROWS.map((row, i) => (
              <div key={i} className="flex gap-1.5">
                {row.map((cell, j) => (
                  <ExampleCell key={j} letter={cell.letter} variant={cell.variant} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

type ExampleRow = ReadonlyArray<{ letter: string; variant: ExampleCellProps['variant'] }>

const EXAMPLE_ROWS: ReadonlyArray<ExampleRow> = [
  [
    { letter: 'C', variant: 'absent' },
    { letter: 'H', variant: 'absent' },
    { letter: 'I', variant: 'absent' },
    { letter: 'L', variant: 'present' },
    { letter: 'D', variant: 'absent' },
  ],
  [
    { letter: 'L', variant: 'correct' },
    { letter: 'O', variant: 'absent' },
    { letter: 'V', variant: 'absent' },
    { letter: 'E', variant: 'present' },
    { letter: 'D', variant: 'absent' },
  ],
  [
    { letter: 'L', variant: 'correct' },
    { letter: 'E', variant: 'correct' },
    { letter: 'A', variant: 'correct' },
    { letter: 'P', variant: 'absent' },
    { letter: 'S', variant: 'absent' },
  ],
  [
    { letter: 'L', variant: 'correct' },
    { letter: 'E', variant: 'correct' },
    { letter: 'A', variant: 'correct' },
    { letter: 'R', variant: 'correct' },
    { letter: 'N', variant: 'correct' },
  ],
]

interface ExampleCellProps {
  letter: string
  variant: 'correct' | 'present' | 'absent'
}

const VARIANT_CLASSES: Record<ExampleCellProps['variant'], string> = {
  correct: `${STATE_COLORS.correct.bg} ${STATE_COLORS.correct.text} ${STATE_COLORS.correct.border}`,
  present: `${STATE_COLORS.present.bg} ${STATE_COLORS.present.text} ${STATE_COLORS.present.border}`,
  absent: `${STATE_COLORS.absent.bg} ${STATE_COLORS.absent.text} ${STATE_COLORS.absent.border}`,
}

function ExampleCell({ letter, variant }: ExampleCellProps) {
  return (
    <div
      className={
        'flex h-9 w-9 shrink-0 items-center justify-center border-2 text-base font-bold uppercase ' +
        VARIANT_CLASSES[variant]
      }
    >
      {letter}
    </div>
  )
}
