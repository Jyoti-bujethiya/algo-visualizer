import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'dsa-done-problems'

function loadDone() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveDone(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
  } catch { /* ignore quota errors */ }
}

/**
 * useDoneProblems — global localStorage-backed set of completed problem slugs.
 *
 * Returns:
 *   done        — Set<string> of completed slugs
 *   isDone(slug) — boolean
 *   toggle(slug) — mark done / unmark
 */
export function useDoneProblems() {
  const [done, setDone] = useState(loadDone)

  // Sync across tabs
  useEffect(() => {
    function onStorage(e) {
      if (e.key === STORAGE_KEY) setDone(loadDone())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggle = useCallback((slug) => {
    setDone(prev => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      saveDone(next)
      return next
    })
  }, [])

  const isDone = useCallback((slug) => done.has(slug), [done])

  return { done, isDone, toggle }
}
