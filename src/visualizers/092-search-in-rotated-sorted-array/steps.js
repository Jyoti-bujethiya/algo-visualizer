// 092 — Search in Rotated Sorted Array · steps.js

// line indices:
// 0: function search(nums, target):
// 1:   lo = 0, hi = nums.length - 1
// 2:   while lo <= hi:
// 3:     mid = (lo + hi) >>> 1
// 4:     if nums[mid] == target: return mid
// 5:     if nums[lo] <= nums[mid]:   // left half sorted
// 6:       if nums[lo] <= target < nums[mid]: hi = mid - 1
// 7:       else: lo = mid + 1
// 8:     else:                        // right half sorted
// 9:       if nums[mid] < target <= nums[hi]: lo = mid + 1
// 10:      else: hi = mid - 1
// 11:  return -1

function push(steps, desc, lo, hi, mid, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, lo, hi, mid, highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(nums, target) {
  const steps = []

  push(steps,
    `Search in Rotated Array: find ${target} in [${nums.join(', ')}]. One half is always sorted — use that to decide which half to search.`,
    0, nums.length - 1, -1, {}, 0
  )

  let lo = 0, hi = nums.length - 1
  push(steps, `Initialize: lo=${lo}, hi=${hi}.`, lo, hi, -1, {}, 1)

  let iter = 0
  while (lo <= hi) {
    iter++
    const mid = (lo + hi) >>> 1
    const hl = {}
    for (let i = lo; i <= hi; i++) hl[i] = 'compare'
    hl[mid] = 'current'
    if (lo !== mid) hl[lo] = 'special'
    if (hi !== mid) hl[hi] = 'special'

    push(steps,
      `Iter ${iter}: lo=${lo} (${nums[lo]}), mid=${mid} (${nums[mid]}), hi=${hi} (${nums[hi]}). Target=${target}.`,
      lo, hi, mid, hl, 3
    )

    if (nums[mid] === target) {
      hl[mid] = 'match'
      push(steps,
        `nums[${mid}]=${nums[mid]} == target. Found at index ${mid}!`,
        lo, hi, mid, hl, 4, { result: mid, done: true }
      )
      return steps
    }

    if (nums[lo] <= nums[mid]) {
      push(steps,
        `Left half [${lo}..${mid}] is sorted (${nums[lo]}..${nums[mid]}).`,
        lo, hi, mid, hl, 5
      )
      if (nums[lo] <= target && target < nums[mid]) {
        push(steps,
          `Target ${target} in [${nums[lo]}, ${nums[mid]}). Search left. hi = ${mid - 1}.`,
          lo, hi, mid, hl, 6
        )
        hi = mid - 1
      } else {
        push(steps,
          `Target ${target} not in left sorted range. Search right. lo = ${mid + 1}.`,
          lo, hi, mid, hl, 7
        )
        lo = mid + 1
      }
    } else {
      push(steps,
        `Right half [${mid}..${hi}] is sorted (${nums[mid]}..${nums[hi]}).`,
        lo, hi, mid, hl, 8
      )
      if (nums[mid] < target && target <= nums[hi]) {
        push(steps,
          `Target ${target} in (${nums[mid]}, ${nums[hi]}]. Search right. lo = ${mid + 1}.`,
          lo, hi, mid, hl, 9
        )
        lo = mid + 1
      } else {
        push(steps,
          `Target ${target} not in right sorted range. Search left. hi = ${mid - 1}.`,
          lo, hi, mid, hl, 10
        )
        hi = mid - 1
      }
    }
  }

  push(steps,
    `Search space exhausted. Target ${target} not found. Return -1.`,
    lo, hi, -1, {}, 11, { result: -1, done: true }
  )
  return steps
}
