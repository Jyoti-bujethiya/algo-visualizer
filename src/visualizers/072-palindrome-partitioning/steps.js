// 072 — Palindrome Partitioning · steps.js
// Backtrack: at each start index, try every end index;
// if s[start..end] is palindrome, recurse from end+1

// line indices:
// 0: function partition(s):
// 1:   result=[]; current=[]
// 2:   function isPalin(l,r): while l<r: if s[l]!=s[r] return false; ...
// 3:   function backtrack(start):
// 4:     if start==n: result.push([...current])
// 5:     for end = start to n-1:
// 6:       if isPalin(start, end):
// 7:         current.push(s[start..end])
// 8:         backtrack(end+1)
// 9:         current.pop()
// 10:  backtrack(0)

function isPalin(s, l, r) {
  while (l < r) { if (s[l] !== s[r]) return false; l++; r-- }
  return true
}

function push(steps, desc, current, result, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, current: [...current], result: result.map(r => [...r]), highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(s) {
  const steps = []
  const n = s.length
  const current = [], result = [], highlights = {}

  push(steps,
    `Palindrome Partitioning: s="${s}". Backtrack: at each position try all substrings; if palindrome, include it and continue from the next position.`,
    current, result, {}, 0
  )

  function backtrack(start) {
    if (start === n) {
      result.push([...current])
      push(steps, `Partition found: [${current.map(w=>`"${w}"`).join(',')}]. Total: ${result.length}.`, current, result, { ...highlights }, 4)
      return
    }
    for (let end = start; end < n; end++) {
      const sub = s.slice(start, end + 1)
      const pal = isPalin(s, start, end)
      highlights[`${start},${end}`] = pal ? 'compare' : 'discard'
      push(steps,
        `Check s[${start}..${end}]="${sub}" — ${pal ? 'PALINDROME ✓' : 'not palindrome ✗'}.`,
        current, result, { ...highlights }, pal ? 6 : 5
      )
      if (pal) {
        highlights[`${start},${end}`] = 'current'
        current.push(sub)
        push(steps, `Add "${sub}". Current: [${current.map(w=>`"${w}"`).join(',')}]. Recurse from ${end+1}.`, current, result, { ...highlights }, 7)
        backtrack(end + 1)
        current.pop()
        highlights[`${start},${end}`] = 'match'
        push(steps, `Backtrack: remove "${sub}".`, current, result, { ...highlights }, 9)
      }
    }
  }

  backtrack(0)
  push(steps, `All ${result.length} palindrome partitions found.`, current, result, { ...highlights }, 10, { done: true })
  return steps
}
