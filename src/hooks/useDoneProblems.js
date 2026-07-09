import { useState, useCallback, useEffect, useRef } from 'react'
import { useUser } from '@clerk/react'

const STORAGE_KEY = 'dsa-done-problems'
const META_KEY    = 'doneProblems'        // key inside Clerk publicMetadata

// ── localStorage helpers (guest fallback) ────────────────────────────────
function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch { return new Set() }
}

function saveLocal(set) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...set])) } catch {}
}

// ── Clerk metadata helpers ────────────────────────────────────────────────
async function loadFromClerk(user) {
  try {
    await user.reload()
    const arr = user.unsafeMetadata?.[META_KEY]
    return Array.isArray(arr) ? new Set(arr) : null
  } catch { return null }
}

async function saveToClerk(user, set) {
  try {
    await user.update({ unsafeMetadata: { [META_KEY]: [...set] } })
  } catch {}
}

/**
 * useDoneProblems
 *
 * When signed in  → reads/writes Clerk unsafeMetadata (synced cross-device).
 *                   On first sign-in, merges any existing localStorage progress.
 * When signed out → falls back to localStorage (same as before).
 *
 * Returns: { done, isDone, toggle }
 */
export function useDoneProblems() {
  const { isSignedIn, user } = useUser()
  const [done, setDone] = useState(loadLocal)
  const merged = useRef(false)   // track one-time localStorage → Clerk merge

  // When user signs in, load their cloud progress + merge local
  useEffect(() => {
    if (!isSignedIn || !user) return

    loadFromClerk(user).then(cloudSet => {
      if (!cloudSet) return  // load failed — keep local

      if (!merged.current) {
        merged.current = true
        const local = loadLocal()
        if (local.size > 0) {
          // Merge local into cloud on first sign-in
          const merged_ = new Set([...cloudSet, ...local])
          setDone(merged_)
          saveLocal(merged_)
          saveToClerk(user, merged_)
          return
        }
      }

      setDone(cloudSet)
    })
  }, [isSignedIn, user])

  // Sync across tabs (guest mode)
  useEffect(() => {
    if (isSignedIn) return
    function onStorage(e) {
      if (e.key === STORAGE_KEY) setDone(loadLocal())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [isSignedIn])

  const toggle = useCallback((slug) => {
    setDone(prev => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      saveLocal(next)
      if (isSignedIn && user) saveToClerk(user, next)
      return next
    })
  }, [isSignedIn, user])

  const isDone = useCallback((slug) => done.has(slug), [done])

  return { done, isDone, toggle }
}
