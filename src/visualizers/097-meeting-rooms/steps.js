// 097 — Meeting Rooms · steps.js
// Can a person attend all meetings? Sort intervals, check overlaps.

// line indices:
// 0: function canAttendMeetings(intervals):
// 1:   sort intervals by start time
// 2:   for i from 1 to n-1:
// 3:     if intervals[i].start < intervals[i-1].end:
// 4:       return false  // overlap found
// 5:   return true

function push(steps, desc, sorted, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, sorted: sorted.map(x => [...x]), highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(intervals) {
  const steps = []

  push(steps,
    `Meeting Rooms: can one person attend all meetings? Intervals: ${JSON.stringify(intervals)}. Sort by start, then check for overlaps.`,
    intervals, {}, 0
  )

  const sorted = [...intervals].sort((a, b) => a[0] - b[0])

  push(steps,
    `Sorted by start time: ${JSON.stringify(sorted)}.`,
    sorted, {}, 1
  )

  let result = true

  for (let i = 1; i < sorted.length; i++) {
    const hl = {}
    hl[i - 1] = 'compare'
    hl[i] = 'current'

    push(steps,
      `Compare interval[${i-1}]=[${sorted[i-1]}] (end=${sorted[i-1][1]}) with interval[${i}]=[${sorted[i]}] (start=${sorted[i][0]}).`,
      sorted, hl, 2
    )

    if (sorted[i][0] < sorted[i - 1][1]) {
      hl[i - 1] = 'error'
      hl[i] = 'error'
      push(steps,
        `OVERLAP! interval[${i}] starts at ${sorted[i][0]} before interval[${i-1}] ends at ${sorted[i-1][1]}. Cannot attend all meetings!`,
        sorted, hl, 3, { result: false }
      )
      result = false
      break
    } else {
      hl[i - 1] = 'done'
      push(steps,
        `No overlap: interval[${i}] starts at ${sorted[i][0]} ≥ end of interval[${i-1}] at ${sorted[i-1][1]}. OK.`,
        sorted, hl, 2
      )
    }
  }

  if (result) {
    const hl = {}
    sorted.forEach((_, i) => { hl[i] = 'done' })
    push(steps,
      `No overlaps found! A person can attend all ${sorted.length} meetings.`,
      sorted, hl, 5, { result: true, done: true }
    )
  } else {
    push(steps,
      `Cannot attend all meetings — overlap detected. Return false.`,
      sorted, {}, 4, { result: false, done: true }
    )
  }

  return steps
}
