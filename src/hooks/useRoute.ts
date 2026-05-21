import { useEffect, useState } from 'react'

const NAV_EVENT = 'vocabsleuth:navigate'

function currentPath(): string {
  return window.location.pathname || '/'
}

export function useRoute(): string {
  const [route, setRoute] = useState(currentPath)
  useEffect(() => {
    const onChange = () => setRoute(currentPath())
    window.addEventListener('popstate', onChange)
    window.addEventListener(NAV_EVENT, onChange)
    return () => {
      window.removeEventListener('popstate', onChange)
      window.removeEventListener(NAV_EVENT, onChange)
    }
  }, [])
  return route
}

export function navigate(to: string): void {
  if (window.location.pathname === to) return
  window.history.pushState(null, '', to)
  window.dispatchEvent(new Event(NAV_EVENT))
}
