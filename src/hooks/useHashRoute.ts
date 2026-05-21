import { useEffect, useState } from 'react'

function currentHash(): string {
  const h = window.location.hash.replace(/^#/, '')
  return h || '/'
}

export function useHashRoute(): string {
  const [route, setRoute] = useState(currentHash)
  useEffect(() => {
    const onChange = () => setRoute(currentHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
