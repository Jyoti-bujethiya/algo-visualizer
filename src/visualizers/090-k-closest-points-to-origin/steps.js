// 090 — K Closest Points to Origin · steps.js
// Max-heap of size k: root = farthest in current k; evict if new point is closer

// line indices:
// 0: function kClosest(points, k):
// 1:   heap = max-heap of size k (by dist²)
// 2:   for each point [x,y]:
// 3:     d = x²+y²
// 4:     heap.push([d, x, y])
// 5:     if heap.size > k: heap.pop()  // remove farthest
// 6:   return heap elements

function pushStep(steps, desc, heap, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, heap: heap.map(h=>[...h]), highlights:{...highlights}, codeLineIndex, ...extra })
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

export function generateSteps(points, k) {
  const steps = []
  const heap = [], highlights = {}

  pushStep(steps,
    `K Closest Points (k=${k}): keep a max-heap of size k by distance². When heap > k, evict the farthest point.`,
    heap, {}, 0
  )

  for (let i = 0; i < points.length; i++) {
    const [x, y] = points[i]
    const d = x * x + y * y
    highlights[i] = 'current'
    hPush(heap, [d, x, y, i])
    pushStep(steps,
      `Point[${i}]=[${x},${y}]: d²=${d}. Push to heap. heap size=${heap.length}.`,
      heap, { ...highlights }, 4
    )
    if (heap.length > k) {
      const [popD, px, py, pi] = hPop(heap)
      highlights[pi] = 'discard'
      highlights[i]  = 'match'
      pushStep(steps,
        `Heap > k — evict farthest [${px},${py}] (d²=${popD}). Remaining k points in heap.`,
        heap, { ...highlights }, 5
      )
    } else {
      highlights[i] = 'match'
      pushStep(steps,
        `Heap size=${heap.length} ≤ k. Keep point[${i}].`,
        heap, { ...highlights }, 5
      )
    }
  }

  const result = heap.map(h => [h[1], h[2]])
  pushStep(steps,
    `k=${k} closest points: [${result.map(p=>`[${p}]`).join(', ')}].`,
    heap, { ...highlights }, 6, { result, done: true }
  )
  return steps
}
