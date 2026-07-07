// 070 — Combination Sum · steps.js
// Backtracking: candidates may be reused; find all combos that sum to target

// line indices:
// 0: function combinationSum(candidates, target):
// 1:   sort(candidates); result = []; current = []
// 2:   function backtrack(start, remaining):
// 3:     if remaining == 0: result.push([...current])
// 4:     for i = start to n-1:
// 5:       if candidates[i] > remaining: break  // pruning (sorted)
// 6:       current.push(candidates[i])
// 7:       backtrack(i, remaining - candidates[i])  // reuse allowed
// 8:       current.pop()
// 9:   backtrack(0, target)

function push(steps, desc, current, result, remaining, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, current: [...current], result: result.map(r => [...r]), remaining, highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(candidatesRaw, target) {
  const steps = []
  const candidates = [...candidatesRaw].sort((a, b) => a - b)
  const n = candidates.length
  const current = []
  const result = []
  const highlights = {}

  push(steps,
    `Combination Sum: candidates=[${candidates.join(', ')}], target=${target}. Each candidate may be reused unlimited times.`,
    current, result, target, {}, 0
  )

  function backtrack(start, remaining) {
    if (remaining === 0) {
      result.push([...current])
      for (let i = 0; i < n; i++) highlights[i] = highlights[i] === 'compare' ? 'compare' : 'done'
      push(steps,
        `Found combination: [${current.join(', ')}]. Total so far: ${result.length}.`,
        current, result, 0, { ...highlights }, 3
      )
      return
    }

    for (let i = start; i < n; i++) {
      if (candidates[i] > remaining) {
        highlights[i] = 'discard'
        push(steps,
          `Prune: candidates[${i}]=${candidates[i]} > remaining=${remaining}. Stop (sorted).`,
          current, result, remaining, { ...highlights }, 5
        )
        break
      }
      highlights[i] = 'current'
      current.push(candidates[i])
      push(steps,
        `Choose candidates[${i}]=${candidates[i]}. Current: [${current.join(', ')}], remaining=${remaining - candidates[i]}.`,
        current, result, remaining - candidates[i], { ...highlights }, 6
      )
      highlights[i] = 'compare'
      backtrack(i, remaining - candidates[i])
      current.pop()
      highlights[i] = 'match'
      push(steps,
        `Backtrack: remove ${candidates[i]}. Current: [${current.join(', ')}], remaining=${remaining}.`,
        current, result, remaining, { ...highlights }, 8
      )
    }
  }

  backtrack(0, target)
  push(steps,
    `All ${result.length} combinations found: ${result.map(c => '['+c.join(',')+']').join(', ')}.`,
    current, result, 0, { ...highlights }, 9, { done: true }
  )
  return steps
}
