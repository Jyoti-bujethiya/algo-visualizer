// 071 — Combination Sum II · steps.js
// Each candidate used once; sort + skip same value at same recursion depth

// line indices:
// 0: function combinationSum2(candidates, target):
// 1:   sort(candidates)
// 2:   result = []; current = []
// 3:   function backtrack(start, remaining):
// 4:     if remaining == 0: result.push([...current])
// 5:     for i = start to n-1:
// 6:       if i > start and candidates[i]==candidates[i-1]: continue  // skip dup
// 7:       if candidates[i] > remaining: break
// 8:       current.push(candidates[i])
// 9:       backtrack(i+1, remaining - candidates[i])
// 10:      current.pop()
// 11:  backtrack(0, target)

function push(steps, desc, current, result, remaining, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, current: [...current], result: result.map(r => [...r]), remaining, highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(candidatesRaw, target) {
  const steps = []
  const candidates = [...candidatesRaw].sort((a, b) => a - b)
  const n = candidates.length
  const current = [], result = [], highlights = {}

  push(steps,
    `Combination Sum II: sorted=[${candidates.join(',')}], target=${target}. Each number used once; skip duplicates at same depth level.`,
    current, result, target, {}, 0
  )

  function backtrack(start, remaining) {
    if (remaining === 0) {
      result.push([...current])
      push(steps, `Found: [${current.join(',')}]. Total: ${result.length}.`, current, result, 0, { ...highlights }, 4)
      return
    }
    for (let i = start; i < n; i++) {
      if (i > start && candidates[i] === candidates[i - 1]) {
        highlights[i] = 'discard'
        push(steps, `Skip i=${i} (${candidates[i]}): dup of candidates[${i-1}]=${candidates[i-1]} at same level.`, current, result, remaining, { ...highlights }, 6)
        continue
      }
      if (candidates[i] > remaining) {
        highlights[i] = 'discard'
        push(steps, `Prune: ${candidates[i]} > remaining=${remaining}. Stop.`, current, result, remaining, { ...highlights }, 7)
        break
      }
      highlights[i] = 'current'
      current.push(candidates[i])
      push(steps, `Choose ${candidates[i]}. Current:[${current.join(',')}], rem=${remaining - candidates[i]}.`, current, result, remaining - candidates[i], { ...highlights }, 8)
      highlights[i] = 'compare'
      backtrack(i + 1, remaining - candidates[i])
      current.pop()
      highlights[i] = 'match'
      push(steps, `Backtrack: remove ${candidates[i]}. rem=${remaining}.`, current, result, remaining, { ...highlights }, 10)
    }
  }

  backtrack(0, target)
  push(steps, `Done! ${result.length} unique combinations.`, current, result, 0, { ...highlights }, 11, { done: true })
  return steps
}
