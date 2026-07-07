// 098 — Meeting Rooms II · steps.js
// Minimum number of conference rooms required.
// Approach 1 — Min-Heap of end times
// Approach 2 — Chronological ordering (split start/end events)

// Heap line indices:
// 0: function minMeetingRooms(intervals):
// 1:   sort by start time
// 2:   heap = min-heap of end times
// 3:   for each [start, end]:
// 4:     if heap.top <= start: heap.pop()  // room reusable
// 5:     heap.push(end)
// 6:   return heap.size  // min rooms needed

// Chron line indices:
// 0: function minMeetingRooms(intervals):
// 1:   starts = sorted start times; ends = sorted end times
// 2:   rooms = 0, maxRooms = 0, e = 0
// 3:   for each s in starts:
// 4:     if s < ends[e]: rooms++; maxRooms = max(maxRooms, rooms)
// 5:     else: e++
// 6:   return maxRooms

function push(steps, desc, heap, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, heap: [...heap], highlights: { ...highlights }, codeLineIndex, ...extra })
}

function heapifyUp(h) {
  let i = h.length - 1
  while (i > 0) {
    const p = (i - 1) >> 1
    if (h[p] > h[i]) { [h[p], h[i]] = [h[i], h[p]]; i = p } else break
  }
}
function heapifyDown(h) {
  let i = 0, n = h.length
  while (true) {
    let s = i, l = 2*i+1, r = 2*i+2
    if (l < n && h[l] < h[s]) s = l
    if (r < n && h[r] < h[s]) s = r
    if (s === i) break
    ;[h[s], h[i]] = [h[i], h[s]]; i = s
  }
}

export function generateSteps(algo, intervals) {
  const steps = []

  push(steps,
    `Meeting Rooms II: minimum rooms for ${intervals.length} meetings ${JSON.stringify(intervals)}.`,
    [], {}, 0
  )

  if (algo === 'heap') {
    const sorted = [...intervals].sort((a, b) => a[0] - b[0])
    push(steps,
      `Sort by start: ${JSON.stringify(sorted)}. Use min-heap of room end-times. If top ≤ next start → reuse that room.`,
      [], {}, 1
    )

    const heap = []
    const hl = {}

    for (let i = 0; i < sorted.length; i++) {
      const [start, end] = sorted[i]
      hl[i] = 'current'
      push(steps,
        `Meeting ${i} [${start},${end}]. Heap (end times): [${heap.join(',')}]. Rooms in use: ${heap.length}.`,
        heap, { ...hl }, 3
      )

      if (heap.length > 0 && heap[0] <= start) {
        push(steps,
          `Room freed! Heap top=${heap[0]} ≤ start=${start}. Reuse room. Pop ${heap[0]}.`,
          heap, { ...hl }, 4
        )
        heap[0] = heap[heap.length - 1]
        heap.pop()
        heapifyDown(heap)
      } else if (heap.length > 0) {
        push(steps,
          `Room NOT freed (heap top=${heap[0]} > start=${start}). Need new room.`,
          heap, { ...hl }, 4
        )
      }

      heap.push(end)
      heapifyUp(heap)
      hl[i] = 'done'
      push(steps,
        `Push end=${end} onto heap: [${heap.join(',')}]. Rooms in use: ${heap.length}.`,
        heap, { ...hl }, 5, { rooms: heap.length }
      )
    }

    push(steps,
      `Done. Heap size = ${heap.length} = minimum meeting rooms needed.`,
      heap, {}, 6, { rooms: heap.length, done: true }
    )

  } else {
    // Chronological
    const starts = [...intervals].map(x => x[0]).sort((a, b) => a - b)
    const ends   = [...intervals].map(x => x[1]).sort((a, b) => a - b)

    push(steps,
      `Chronological: starts=[${starts}], ends=[${ends}]. Sweep through starts; if start < ends[e] we need a new room, else a room was freed.`,
      [], {}, 1
    )

    let rooms = 0, maxRooms = 0, e = 0
    const hl = {}

    for (let i = 0; i < starts.length; i++) {
      hl[`s${i}`] = 'current'
      hl[`e${e}`] = 'compare'
      push(steps,
        `starts[${i}]=${starts[i]} vs ends[${e}]=${ends[e]}. Rooms=${rooms}.`,
        [], { ...hl }, 3, { rooms, maxRooms }
      )
      if (starts[i] < ends[e]) {
        rooms++
        maxRooms = Math.max(maxRooms, rooms)
        hl[`s${i}`] = 'visiting'
        push(steps,
          `starts[${i}]=${starts[i]} < ends[${e}]=${ends[e]}. New room needed! rooms=${rooms}.`,
          [], { ...hl }, 4, { rooms, maxRooms }
        )
      } else {
        e++
        hl[`e${e-1}`] = 'done'
        hl[`s${i}`] = 'done'
        push(steps,
          `starts[${i}]=${starts[i]} ≥ ends[${e-1}]=${ends[e-1]}. Room freed. e=${e}. rooms=${rooms}.`,
          [], { ...hl }, 5, { rooms, maxRooms }
        )
      }
    }

    push(steps,
      `Done. Max rooms used simultaneously = ${maxRooms}.`,
      [], {}, 6, { rooms: maxRooms, done: true }
    )
  }

  return steps
}
