// 099 — Time Based Key-Value Store · steps.js
// Operations: set(key, value, timestamp) and get(key, timestamp)
// get returns the value with the largest timestamp ≤ given timestamp (binary search)

// line indices:
// 0: TimeMap:
// 1:   store = {}  // key → [[timestamp, value], ...]
// 2:   function set(key, value, timestamp):
// 3:     store[key].push([timestamp, value])
// 4:   function get(key, timestamp):
// 5:     entries = store[key]
// 6:     lo=0, hi=entries.length-1
// 7:     while lo <= hi:
// 8:       mid = (lo+hi)/2
// 9:       if entries[mid][0] == timestamp: return entries[mid][1]
// 10:      if entries[mid][0] < timestamp: lo=mid+1; bestVal=entries[mid][1]
// 11:      else: hi=mid-1
// 12:    return bestVal

function push(steps, desc, store, highlights, codeLineIndex, extra = {}) {
  const snap = {}
  for (const k of Object.keys(store)) snap[k] = store[k].map(e => [...e])
  steps.push({ description: desc, store: snap, highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(operations) {
  const steps = []
  const store = {}

  push(steps,
    'TimeMap: a key-value store where each key maps to a list of (timestamp, value) pairs, kept in sorted order. get() uses binary search.',
    store, {}, 0
  )

  for (const op of operations) {
    if (op.type === 'set') {
      const { key, value, timestamp } = op
      if (!store[key]) store[key] = []
      store[key].push([timestamp, value])
      push(steps,
        `set("${key}", "${value}", ${timestamp}). Appended to store["${key}"] → ${JSON.stringify(store[key])}.`,
        store, {}, 3
      )
    } else {
      // get
      const { key, timestamp } = op
      push(steps,
        `get("${key}", ${timestamp}). Binary search store["${key}"] = ${JSON.stringify(store[key] ?? [])} for largest ts ≤ ${timestamp}.`,
        store, {}, 4
      )

      const entries = store[key] ?? []
      let lo = 0, hi = entries.length - 1
      let bestVal = ''

      push(steps,
        `Initialize: lo=${lo}, hi=${hi}.`,
        store, {}, 6
      )

      let iter = 0
      while (lo <= hi) {
        iter++
        const mid = (lo + hi) >> 1
        const [ts, val] = entries[mid]
        const hl = {}
        hl[`${key}_${mid}`] = 'current'
        for (let i = lo; i <= hi; i++) hl[`${key}_${i}`] = hl[`${key}_${i}`] || 'compare'

        push(steps,
          `Iter ${iter}: lo=${lo}, hi=${hi}, mid=${mid} → (ts=${ts}, val="${val}"). Target ts=${timestamp}.`,
          store, hl, 8
        )

        if (ts === timestamp) {
          hl[`${key}_${mid}`] = 'match'
          push(steps,
            `Exact match! ts=${ts} == ${timestamp}. Return "${val}".`,
            store, hl, 9, { getResult: val }
          )
          bestVal = val
          lo = hi + 1 // break
        } else if (ts < timestamp) {
          bestVal = val
          hl[`${key}_${mid}`] = 'done'
          push(steps,
            `ts=${ts} < ${timestamp}. Candidate best="${val}". lo = ${mid + 1}.`,
            store, hl, 10, { getResult: bestVal }
          )
          lo = mid + 1
        } else {
          push(steps,
            `ts=${ts} > ${timestamp}. Too large. hi = ${mid - 1}.`,
            store, hl, 11
          )
          hi = mid - 1
        }
      }

      push(steps,
        `get("${key}", ${timestamp}) → "${bestVal}".`,
        store, {}, 12, { getResult: bestVal, done: true }
      )
    }
  }

  return steps
}
