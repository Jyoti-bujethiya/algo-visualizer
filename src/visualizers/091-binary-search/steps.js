// 091 — Binary Search · steps.js

// line indices:
// 0: function binarySearch(nums, target):
// 1:   lo = 0, hi = nums.length - 1
// 2:   while lo <= hi:
// 3:     mid = (lo + hi) >>> 1
// 4:     if nums[mid] == target: return mid
// 5:     else if nums[mid] < target: lo = mid + 1
// 6:     else: hi = mid - 1
// 7:   return -1

function push(steps, desc, lo, hi, mid, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, lo, hi, mid, highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(nums, target) {
  const steps = []
  const highlights = {}

  push(steps,
    `Binary Search: find ${target} in sorted array [${nums.join(', ')}]. Start with lo=0, hi=${nums.length-1}.`,
    0, nums.length - 1, -1, {}, 0
  )

  let lo = 0, hi = nums.length - 1

  push(steps,
    `Initialize: lo=${lo}, hi=${hi}.`,
    lo, hi, -1, {}, 1
  )

  let iterations = 0

  while (lo <= hi) {
    iterations++
    const mid = (lo + hi) >>> 1

    // Highlight lo, hi, mid
    const hl = {}
    for (let i = lo; i <= hi; i++) hl[i] = 'compare'
    hl[mid] = 'current'
    if (lo !== mid) hl[lo] = 'special'
    if (hi !== mid) hl[hi] = 'special'

    push(steps,
      `Iteration ${iterations}: lo=${lo}, hi=${hi}, mid=${mid}, nums[mid]=${nums[mid]}. Comparing with target=${target}.`,
      lo, hi, mid, hl, 3
    )

    if (nums[mid] === target) {
      hl[mid] = 'match'
      push(steps,
        `nums[${mid}] = ${nums[mid]} == target=${target}. Found! Return index ${mid}.`,
        lo, hi, mid, hl, 4, { result: mid, done: true }
      )
      return steps
    } else if (nums[mid] < target) {
      push(steps,
        `nums[${mid}]=${nums[mid]} < target=${target}. Discard left half. lo = ${mid + 1}.`,
        lo, hi, mid, hl, 5
      )
      lo = mid + 1
    } else {
      push(steps,
        `nums[${mid}]=${nums[mid]} > target=${target}. Discard right half. hi = ${mid - 1}.`,
        lo, hi, mid, hl, 6
      )
      hi = mid - 1
    }
  }

  push(steps,
    `lo=${lo} > hi=${hi}. Search space exhausted. Target ${target} not found. Return -1.`,
    lo, hi, -1, {}, 7, { result: -1, done: true }
  )
  return steps
}
