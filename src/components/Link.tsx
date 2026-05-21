import type { MouseEvent, ReactNode } from 'react'
import { navigate } from '../hooks/useRoute'

interface LinkProps {
  href: string
  className?: string
  children: ReactNode
}

export function Link({ href, className, children }: LinkProps) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    navigate(href)
  }
  return (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  )
}
