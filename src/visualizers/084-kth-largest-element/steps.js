// 084 — Kth Largest Element · steps.js (Min-Heap of size k)
// Maintain a min-heap of size k; root = kth largest

// line indices (heap):
// 0: function findKthLargest(nums, k):
// 1:   heap = min-heap of size k
// 2:   for each num in nums:
// 3:     heap.push(num)
// 4:     if heap.size > k: heap.pop()  // remove smallest
// 5:   return heap.top  // kth largest

function push(steps, desc, heap, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, heap: [...heap], highlights: { ...highlights }, codeLineIndex, ...extra })
}

function heapifyUp(h, i) {
  while (i > 0) {
    const p = (i - 1) >> 1
    if (h[p] > h[i]) { [h[p], h[i]] = [h[i], h[p]]; i = p } else break
  }
}
function heapifyDown(h, i) {
  const n = h.length
  while (true) {
    let s = i, l = 2*i+1, r = 2*i+2
    if (l < n && h[l] < h[s]) s = l
    if (r < n && h[r] < h[s]) s = r
    if (s === i) break
    ;[h[s], h[i]] = [h[i], h[s]]; i = s
  }
}

export function generateSteps(algo, nums, k) {
  const steps = []
  const heap = [], highlights = {}

  push(steps,
    `Kth Largest (k=${k}): maintain a min-heap of size k. When heap exceeds k, pop the minimum. Root = kth largest.`,
    heap, {}, 0
  )

  for (let i = 0; i < nums.length; i++) {
    highlights[i] = 'current'
    heap.push(nums[i])
    heapifyUp(heap, heap.length - 1)
    push(steps,
      `Push nums[${i}]=${nums[i]}. Heap: [${heap.join(',')}] (size=${heap.length}).`,
      heap, { ...highlights }, 3
    )
    if (heap.length > k) {
      const popped = heap[0]
      heap[0] = heap[heap.length - 1]
      heap.pop()
      heapifyDown(heap, 0)
      highlights[i] = 'discard'
      push(steps,
        `Heap size > k — pop min=${popped}. Heap: [${heap.join(',')}].`,
        heap, { ...highlights }, 4
      )
    } else {
      highlights[i] = 'match'
    }
  }

  push(steps,
    `Heap root = ${heap[0]} = ${k}th largest element.`,
    heap, { ...highlights }, 5, { result: heap[0], done: true }
  )
  return steps
}
