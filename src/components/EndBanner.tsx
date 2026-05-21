import type { GameStatus } from '../types'

interface EndBannerProps {
  status: GameStatus
  answer: string | null
}

export function EndBanner({ status, answer }: EndBannerProps) {
  if (status === 'playing') return null
  const won = status === 'won'
  return (
    <div
      className={
        'rounded-lg px-4 py-3 text-center text-sm font-semibold ring-1 ' +
        (won
          ? 'bg-slate-800 text-white ring-slate-800'
          : 'bg-white text-slate-900 ring-amber-300')
      }
    >
      {won ? (
        <span>Nice work — you got it!</span>
      ) : (
        <span>
          Out of guesses. The word was <span className="font-bold">{answer}</span>.
        </span>
      )}
    </div>
  )
}
