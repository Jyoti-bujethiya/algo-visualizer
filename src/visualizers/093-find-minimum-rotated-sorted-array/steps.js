// 093 — Find Minimum in Rotated Sorted Array · steps.js

// line indices:
// 0: function findMin(nums):
// 1:   lo = 0, hi = nums.length - 1
// 2:   while lo < hi:
// 3:     mid = (lo + hi) >>> 1
// 4:     if nums[mid] > nums[hi]:   // min is in right half
// 5:       lo = mid + 1
// 6:     else:                       // min is in left half or at mid
// 7:       hi = mid
// 8:   return nums[lo]

function push(steps, desc, lo, hi, mid, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, lo, hi, mid, highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(nums) {
  const steps = []

  push(steps,
    `Find Minimum in Rotated Sorted Array [${nums.join(', ')}]. Key insight: min is on the side that breaks sorted order. Compare mid with hi to decide.`,
    0, nums.length - 1, -1, {}, 0
  )

  let lo = 0, hi = nums.length - 1
  push(steps, `Initialize: lo=${lo}, hi=${hi}.`, lo, hi, -1, {}, 1)

  let iter = 0
  while (lo < hi) {
    iter++
    const mid = (lo + hi) >>> 1
    const hl = {}
    for (let i = lo; i <= hi; i++) hl[i] = 'compare'
    hl[mid] = 'current'
    if (lo !== mid) hl[lo] = 'special'
    if (hi !== mid) hl[hi] = 'special'

    push(steps,
      `Iter ${iter}: lo=${lo} (${nums[lo]}), mid=${mid} (${nums[mid]}), hi=${hi} (${nums[hi]}).`,
      lo, hi, mid, hl, 3
    )

    if (nums[mid] > nums[hi]) {
      push(steps,
        `nums[${mid}]=${nums[mid]} > nums[${hi}]=${nums[hi]} — rotation pivot is in right half. lo = ${mid + 1}.`,
        lo, hi, mid, hl, 5
      )
      lo = mid + 1
    } else {
      push(steps,
        `nums[${mid}]=${nums[mid]} ≤ nums[${hi}]=${nums[hi]} — minimum is at mid or left. hi = ${mid}.`,
        lo, hi, mid, hl, 7
      )
      hi = mid
    }
  }

  const hl = {}
  hl[lo] = 'match'
  push(steps,
    `lo == hi == ${lo}. Minimum = nums[${lo}] = ${nums[lo]}.`,
    lo, hi, lo, hl, 8, { result: nums[lo], done: true }
  )
  return steps
}
