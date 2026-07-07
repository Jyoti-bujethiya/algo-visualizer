// 089 — Reorganize String · steps.js
// Greedy + max-heap: always place the most frequent character that isn't
// the same as the previous character placed

// line indices:
// 0: function reorganizeString(s):
// 1:   freq = count char frequencies
// 2:   if any freq > ceil(n/2): return "" (impossible)
// 3:   heap = max-heap by frequency
// 4:   result = ""
// 5:   while heap not empty:
// 6:     pop most frequent char (a, ca)
// 7:     result += a
// 8:     if prev char exists: push prev back onto heap
// 9:     prev = (a, ca-1) if ca-1>0
// 10:  return result

function pushStep(steps, desc, heap, result, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, heap: heap.map(h=>[...h]), result, highlights:{...highlights}, codeLineIndex, ...extra })
}

function hPush(h, item) {
  h.push(item); let i = h.length - 1
  while (i > 0) { const p=(i-1)>>1; if (h[p][0] < h[i][0]) { [h[p],h[i]]=[h[i],h[p]]; i=p } else break }
}
function hPop(h) {
  const top = h[0]; h[0] = h[h.length-1]; h.pop(); let i = 0
  while (true) {
    let s=i, l=2*i+1, r=2*i+2
    if (l<h.length && h[l][0]>h[s][0]) s=l
    if (r<h.length && h[r][0]>h[s][0]) s=r
    if (s===i) break; [h[s],h[i]]=[h[i],h[s]]; i=s
  }
  return top
}

export function generateSteps(s) {
  const steps = []
  const n = s.length
  const freq = {}
  for (const c of s) freq[c] = (freq[c] || 0) + 1

  pushStep(steps,
    `Reorganize String: s="${s}". Frequencies: {${Object.entries(freq).map(([k,v])=>`${k}:${v}`).join(', ')}}. Greedily place most frequent that differs from previous.`,
    [], '', {}, 0
  )

  // Check feasibility
  const maxF = Math.max(...Object.values(freq))
  if (maxF > Math.ceil(n / 2)) {
    pushStep(steps, `Impossible: max freq=${maxF} > ceil(${n}/2)=${Math.ceil(n/2)}. Return "".`, [], '', {}, 2, { result: '', done: true })
    return steps
  }

  // Build max-heap
  const heap = []
  for (const [c, f] of Object.entries(freq)) hPush(heap, [f, c])
  pushStep(steps, `Initial max-heap by freq: [${heap.map(h=>`${h[1]}(${h[0]})`).join(', ')}].`, [...heap.map(h=>[...h])], '', {}, 3)

  let result = ''
  let prev = null

  while (heap.length > 0) {
    const [ca, a] = hPop(heap)
    result += a
    pushStep(steps,
      `Pop most frequent: '${a}'(${ca}). Append to result: "${result}".${prev ? ` Push prev '${prev[1]}'(${prev[0]}) back.` : ''}`,
      heap.map(h=>[...h]), result, {}, 6
    )
    if (prev && prev[0] > 0) {
      hPush(heap, prev)
    }
    prev = ca - 1 > 0 ? [ca - 1, a] : null
  }

  pushStep(steps, `Reorganized: "${result}".`, [], result, {}, 10, { result, done: true })
  return steps
}
