// 085 — Top K Frequent Elements · steps.js
// Count frequencies, then use min-heap of size k to keep top-k

// line indices:
// 0: function topKFrequent(nums, k):
// 1:   freq = count frequencies
// 2:   heap = min-heap by frequency (size k)
// 3:   for each (num, count) in freq:
// 4:     heap.push([count, num])
// 5:     if heap.size > k: heap.pop()
// 6:   return heap elements (nums only)

function pushStep(steps, desc, freq, heap, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, freq: { ...freq }, heap: heap.map(h => [...h]), highlights: { ...highlights }, codeLineIndex, ...extra })
}

function heapifyUp(h, i, cmp) {
  while (i > 0) {
    const p = (i - 1) >> 1
    if (cmp(h[p], h[i]) > 0) { [h[p], h[i]] = [h[i], h[p]]; i = p } else break
  }
}
function heapifyDown(h, i, cmp) {
  const n = h.length
  while (true) {
    let s = i, l = 2*i+1, r = 2*i+2
    if (l < n && cmp(h[l], h[s]) < 0) s = l
    if (r < n && cmp(h[r], h[s]) < 0) s = r
    if (s === i) break
    ;[h[s], h[i]] = [h[i], h[s]]; i = s
  }
}
const cmpMinFreq = (a, b) => a[0] - b[0]

export function generateSteps(nums, k) {
  const steps = []
  const freq = {}, highlights = {}

  pushStep(steps, `Top K Frequent (k=${k}): nums=[${nums.join(',')}]. First count frequencies, then use a min-heap of size k keyed by frequency.`, freq, [], {}, 0)

  for (const n of nums) freq[n] = (freq[n] || 0) + 1
  pushStep(steps, `Frequencies: {${Object.entries(freq).map(([n,c])=>`${n}:${c}`).join(', ')}}.`, freq, [], {}, 1)

  const heap = []
  for (const [num, count] of Object.entries(freq)) {
    heap.push([count, Number(num)])
    heapifyUp(heap, heap.length - 1, cmpMinFreq)
    highlights[num] = 'current'
    pushStep(steps,
      `Push (count=${count}, num=${num}). Heap size=${heap.length}.`,
      freq, heap, { ...highlights }, 4
    )
    if (heap.length > k) {
      const [popCount, popNum] = heap[0]
      heap[0] = heap[heap.length - 1]; heap.pop()
      heapifyDown(heap, 0, cmpMinFreq)
      highlights[popNum] = 'discard'
      highlights[num] = 'match'
      pushStep(steps, `Heap > k — pop (freq=${popCount}, num=${popNum}). Heap: [${heap.map(h=>h[1]).join(',')}].`, freq, heap, { ...highlights }, 5)
    } else {
      highlights[num] = 'match'
    }
  }

  const result = heap.map(h => h[1])
  pushStep(steps, `Top ${k} frequent elements: [${result.join(',')}].`, freq, heap, { ...highlights }, 6, { result, done: true })
  return steps
}
