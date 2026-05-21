import type { GradeId } from '../types'
import { GRADES } from '../lib/grades'
import { openHowToPlay } from './HowToPlayModal'

interface GradeModalProps {
  open: boolean
  onSelect: (id: GradeId) => void
  onClose?: () => void
  currentGrade: GradeId | null
}

export function GradeModal({ open, onSelect, onClose, currentGrade }: GradeModalProps) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="grade-modal-title"
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {currentGrade === null ? (
          <>
            <h2 id="grade-modal-title" className="mb-1 text-xl font-semibold text-slate-900">
              Welcome to Vocab Sleuth
            </h2>
            <p className="mb-2 text-sm text-slate-600">
              A daily Wordle-style word puzzle with answers pulled from a grade-appropriate
              vocabulary list.
            </p>
            <p className="mb-4 text-sm font-medium text-slate-700">
              Pick a grade level to get started:
            </p>
          </>
        ) : (
          <>
            <h2 id="grade-modal-title" className="mb-1 text-xl font-semibold text-slate-900">
              Pick your grade level
            </h2>
            <p className="mb-4 text-sm text-slate-600">
              Each grade band has its own word list and word length.
            </p>
          </>
        )}
        <div className="grid grid-cols-2 gap-3">
          {GRADES.map((g) => {
            const active = g.id === currentGrade
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => onSelect(g.id)}
                className={
                  'flex flex-col items-start rounded-lg px-4 py-3 text-left ring-1 transition ' +
                  (active
                    ? 'bg-slate-800 text-amber-50 ring-slate-800'
                    : 'bg-slate-100 text-slate-900 ring-slate-300 hover:bg-amber-100 hover:ring-amber-500')
                }
              >
                <span className="text-base font-semibold">{g.label}</span>
                <span
                  className={
                    'text-xs ' + (active ? 'text-amber-100' : 'text-slate-600')
                  }
                >
                  {g.list.wordLength} letters
                </span>
              </button>
            )
          })}
        </div>
        {currentGrade === null && (
          <p className="mt-4 text-center text-sm text-slate-600">
            New to the game?{' '}
            <button
              type="button"
              onClick={openHowToPlay}
              className="font-medium text-amber-700 underline-offset-4 hover:underline"
            >
              Learn how to play
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
