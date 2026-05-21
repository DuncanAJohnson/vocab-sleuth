import logo from '../assets/VocabSleuthTransparent.svg'
import { Link } from './Link'
import { HowToPlayModal, openHowToPlay, useHowToPlay } from './HowToPlayModal'

interface HeaderProps {
  rightLink?: { href: string; label: string }
}

export function Header({ rightLink }: HeaderProps) {
  const { open, setOpen } = useHowToPlay()
  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900 hover:text-amber-600"
        >
          <img src={logo} alt="" className="h-8 w-8" />
          Vocab Sleuth
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => openHowToPlay()}
            className="rounded-md px-2 py-1 text-sm text-slate-700 underline-offset-4 hover:text-amber-700 hover:underline"
          >
            How to Play
          </button>
          {rightLink && (
            <Link
              href={rightLink.href}
              className="rounded-md px-2 py-1 text-sm text-slate-700 underline-offset-4 hover:text-amber-700 hover:underline"
            >
              {rightLink.label}
            </Link>
          )}
        </div>
      </div>
      <HowToPlayModal open={open} onClose={() => setOpen(false)} />
    </header>
  )
}
