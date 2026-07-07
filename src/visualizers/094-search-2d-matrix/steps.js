// 094 — Search a 2D Matrix · steps.js

// line indices:
// 0: function searchMatrix(matrix, target):
// 1:   m = rows, n = cols
// 2:   lo = 0, hi = m*n - 1
// 3:   while lo <= hi:
// 4:     mid = (lo + hi) >>> 1
// 5:     r = mid / n | 0,  c = mid % n
// 6:     if matrix[r][c] == target: return true
// 7:     else if matrix[r][c] < target: lo = mid + 1
// 8:     else: hi = mid - 1
// 9:   return false

function push(steps, desc, lo, hi, mid, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, lo, hi, mid, highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(matrix, target) {
  const steps = []
  const m = matrix.length
  const n = matrix[0].length
  const total = m * n

  push(steps,
    `Search 2D Matrix: treat the ${m}×${n} matrix as a flat sorted array of ${total} elements. Binary search on index 0..${total-1}. Target=${target}.`,
    0, total - 1, -1, {}, 0
  )

  let lo = 0, hi = total - 1
  push(steps,
    `Initialize: lo=0, hi=${hi} (${m}×${n} - 1 = ${total-1}).`,
    lo, hi, -1, {}, 2
  )

  let iter = 0
  while (lo <= hi) {
    iter++
    const mid = (lo + hi) >>> 1
    const r = (mid / n) | 0
    const c = mid % n
    const val = matrix[r][c]

    const hl = {}
    for (let i = lo; i <= hi; i++) hl[`${(i/n)|0},${i%n}`] = 'compare'
    hl[`${r},${c}`] = 'current'

    push(steps,
      `Iter ${iter}: lo=${lo}, hi=${hi}, mid=${mid} → matrix[${r}][${c}]=${val}. Target=${target}.`,
      lo, hi, mid, hl, 4
    )

    if (val === target) {
      hl[`${r},${c}`] = 'match'
      push(steps,
        `matrix[${r}][${c}]=${val} == target. Found at (${r},${c})!`,
        lo, hi, mid, hl, 6, { result: [r, c], done: true }
      )
      return steps
    } else if (val < target) {
      push(steps,
        `matrix[${r}][${c}]=${val} < target. Search right. lo = ${mid + 1}.`,
        lo, hi, mid, hl, 7
      )
      lo = mid + 1
    } else {
      push(steps,
        `matrix[${r}][${c}]=${val} > target. Search left. hi = ${mid - 1}.`,
        lo, hi, mid, hl, 8
      )
      hi = mid - 1
    }
  }

  push(steps,
    `lo=${lo} > hi=${hi}. Target ${target} not found in matrix. Return false.`,
    lo, hi, -1, {}, 9, { result: null, done: true }
  )
  return steps
}
