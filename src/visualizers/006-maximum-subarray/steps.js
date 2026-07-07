// 006 – Maximum Subarray — pure step generator (no DOM)

// CODE.kadane  line→ init:0, extend/restart:2, newMax:3, complete:4
// CODE.brute   line→ init:0, outer:1, inner:4, newMax:5, complete:6
// CODE.divconq line→ init:0, split:1, cross:4, complete:5
const push = (steps, desc, currentSum, bestSum, windowStart, windowEnd, extra = {}) =>
  steps.push({ description: desc, currentSum, bestSum, windowStart, windowEnd, ...extra })

// CODE.kadane  = ['cur = best = nums[0]','for i in 1..n-1:','  cur = max(nums[i], cur+nums[i])','  best = max(best, cur)','return best']
// CODE.brute   = ['best = -∞','for i in 0..n-1:','  cur = 0','  for j in i..n-1:','    cur += nums[j]','    best = max(best, cur)','return best']
// CODE.divconq = ['solve(l, r):','  mid = (l+r)/2','  L = solve(l, mid)','  R = solve(mid+1, r)','  C = maxCross(l, mid, r)','  return max(L, R, C)']

function generateKadane(nums) {
  const steps = []
  const n = nums.length
  let cur = nums[0], best = nums[0], wStart = 0, wEnd = 0, tempStart = 0

  push(steps, `Start with the first element (${cur}) as the current running sum and the best sum found so far.`, cur, best, 0, 0, { current: 0, codeLineIndex: 0 })

  for (let i = 1; i < n; i++) {
    const extend  = cur + nums[i]
    const restart = nums[i]

    if (nums[i] > cur + nums[i]) {
      push(steps, `At value ${nums[i]}: starting a brand new subarray here (${restart}) beats extending the current one (${extend}). Reset and start fresh.`,
        restart, best, i, i, { current: i, codeLineIndex: 2 })
      cur = restart; tempStart = i
    } else {
      push(steps, `At value ${nums[i]}: extending the current subarray gives ${extend}, starting fresh gives ${restart}. Extending wins — grow the window.`,
        extend, best, tempStart, i, { current: i, codeLineIndex: 2 })
      cur = extend
    }

    if (cur > best) {
      best = cur; wStart = tempStart; wEnd = i
      push(steps, `New best sum found: ${best}! This is the largest subarray sum seen so far.`,
        cur, best, wStart, wEnd, { newMax: true, current: i, codeLineIndex: 3 })
    }
  }

  push(steps, `All elements visited. The maximum subarray sum is ${best}: [${nums.slice(wStart, wEnd + 1).join(', ')}].`,
    cur, best, wStart, wEnd, { complete: true, codeLineIndex: 4 })
  return steps
}

function generateBrute(nums) {
  const steps = []
  let best = -Infinity, bStart = 0, bEnd = 0

  push(steps, `Try every possible subarray — fix each starting position, then stretch the end rightward and track the best sum.`, 0, best, -1, -1, { codeLineIndex: 0 })

  for (let i = 0; i < nums.length; i++) {
    let cur = 0
    for (let j = i; j < nums.length; j++) {
      cur += nums[j]
      push(steps,
        `Subarray from position ${i} to ${j}: [${nums.slice(i, j + 1).join(', ')}] sums to ${cur}.${cur > best ? ' New best!' : ''}`,
        cur, best, i, j, { rangeStart: i, rangeEnd: j, current: j, codeLineIndex: 4 })
      if (cur > best) {
        best = cur; bStart = i; bEnd = j
        push(steps, `Best sum updated to ${best}. Remembering this window.`, cur, best, bStart, bEnd, { newMax: true, codeLineIndex: 5 })
      }
    }
  }

  push(steps, `All subarrays checked. Maximum sum is ${best}: [${nums.slice(bStart, bEnd + 1).join(', ')}].`,
    0, best, bStart, bEnd, { complete: true, codeLineIndex: 6 })
  return steps
}

function generateDivConq(nums) {
  const steps = []
  steps.push({ description: `Recursively split the array in half. At each level, the answer is either in the left half, the right half, or crosses the midpoint — check all three.`, currentSum: 0, bestSum: -Infinity, windowStart: -1, windowEnd: -1, codeLineIndex: 0 })

  let best = -Infinity, bestStart = 0, bestEnd = 0

  const solve = (l, r) => {
    if (l === r) {
      push(steps, `Single element at position ${l}: value ${nums[l]}. A single element is its own subarray.`, nums[l], best, l, l, { rangeStart: l, rangeEnd: l, codeLineIndex: 1 })
      if (nums[l] > best) { best = nums[l]; bestStart = l; bestEnd = l }
      return nums[l]
    }
    const mid = Math.floor((l + r) / 2)
    push(steps, `Splitting the range from position ${l} to ${r} at the midpoint (${mid}). Solve the left half and right half separately.`,
      0, best, l, r, { rangeStart: l, rangeEnd: r, codeLineIndex: 1 })

    const leftMax  = solve(l, mid)
    const rightMax = solve(mid + 1, r)

    let ls = -Infinity, s = 0, csLeft = mid, csRight = mid + 1, rs = -Infinity
    for (let i = mid;     i >= l; i--) { s += nums[i]; if (s > ls) { ls = s; csLeft = i } }
    s = 0
    for (let i = mid + 1; i <= r; i++) { s += nums[i]; if (s > rs) { rs = s; csRight = i } }
    const cross = ls + rs

    push(steps,
      `Checking the crossing subarray that spans the midpoint: best left extension (${ls}) + best right extension (${rs}) = ${cross}. Compare with left-half best (${leftMax}) and right-half best (${rightMax}).`,
      cross, best, csLeft, csRight, { rangeStart: l, rangeEnd: r, crossing: true, codeLineIndex: 4 })

    const result = Math.max(leftMax, rightMax, cross)
    if (result > best) {
      if (result === cross) { bestStart = csLeft; bestEnd = csRight }
      best = result
    }
    return result
  }

  solve(0, nums.length - 1)
  push(steps, `All recursive calls complete. Maximum subarray sum is ${best}: [${nums.slice(bestStart, bestEnd + 1).join(', ')}].`,
    0, best, bestStart, bestEnd, { complete: true, codeLineIndex: 5 })
  return steps
}

export function generateSteps(algo, nums) {
  if (algo === 'kadane')  return generateKadane(nums)
  if (algo === 'brute')   return generateBrute(nums)
  if (algo === 'divconq') return generateDivConq(nums)
  return generateKadane(nums)
}
