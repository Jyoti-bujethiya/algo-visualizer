// Find First and Last Position — LeetCode #34 — pure step generators (no DOM)

function genTwoBS(nums, target) {
  const steps = []
  const n = nums.length

  steps.push({ lo: -1, hi: -1, mid: -1, result: [-1, -1], description: `Run binary search twice — once to find the leftmost occurrence of ${target}, once for the rightmost.`, codeLineIndex: 0, phase: 'init', pass: 'none' })

  if (n === 0) {
    steps.push({ lo: -1, hi: -1, mid: -1, result: [-1, -1], description: 'The array is empty — the target cannot be found.', codeLineIndex: 7, phase: 'complete', pass: 'done' })
    return steps
  }

  let lo = 0, hi = n - 1, leftRes = -1
  steps.push({ lo, hi, mid: -1, result: [-1, -1], description: `First binary search: find the leftmost position of ${target}. Start with the full range.`, codeLineIndex: 1, phase: 'findLeft', pass: 'left' })

  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2)
    steps.push({ lo, hi, mid, result: [leftRes, -1], description: `Checking the midpoint: value is ${nums[mid]}.`, codeLineIndex: 3, phase: 'compare-left', pass: 'left' })
    if (nums[mid] === target) {
      leftRes = mid; hi = mid - 1
      steps.push({ lo, hi, mid, result: [leftRes, -1], description: `Found ${target} at position ${leftRes}! But there might be an earlier occurrence — shrink the right boundary to keep searching left.`, codeLineIndex: 4, phase: 'found-left', pass: 'left' })
    } else if (nums[mid] < target) {
      lo = mid + 1
      steps.push({ lo, hi, mid, result: [leftRes, -1], description: `${nums[mid]} is less than ${target} — the target must be to the right. Move the left boundary up.`, codeLineIndex: 5, phase: 'compare-left', pass: 'left' })
    } else {
      hi = mid - 1
      steps.push({ lo, hi, mid, result: [leftRes, -1], description: `${nums[mid]} is greater than ${target} — the target must be to the left. Move the right boundary down.`, codeLineIndex: 6, phase: 'compare-left', pass: 'left' })
    }
  }
  steps.push({ lo, hi, mid: -1, result: [leftRes, -1], description: `First search done. The leftmost position of ${target} is ${leftRes === -1 ? 'not found' : leftRes}.`, codeLineIndex: 7, phase: 'left-done', pass: 'left' })

  lo = 0; hi = n - 1; let rightRes = -1
  steps.push({ lo, hi, mid: -1, result: [leftRes, -1], description: `Second binary search: find the rightmost position of ${target}. Reset to the full range.`, codeLineIndex: 9, phase: 'findRight', pass: 'right' })

  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2)
    steps.push({ lo, hi, mid, result: [leftRes, rightRes], description: `Checking the midpoint: value is ${nums[mid]}.`, codeLineIndex: 11, phase: 'compare-right', pass: 'right' })
    if (nums[mid] === target) {
      rightRes = mid; lo = mid + 1
      steps.push({ lo, hi, mid, result: [leftRes, rightRes], description: `Found ${target} at position ${rightRes}! But there might be a later occurrence — expand the left boundary to keep searching right.`, codeLineIndex: 13, phase: 'found-right', pass: 'right' })
    } else if (nums[mid] < target) {
      lo = mid + 1
      steps.push({ lo, hi, mid, result: [leftRes, rightRes], description: `${nums[mid]} is less than ${target} — move the left boundary up.`, codeLineIndex: 14, phase: 'compare-right', pass: 'right' })
    } else {
      hi = mid - 1
      steps.push({ lo, hi, mid, result: [leftRes, rightRes], description: `${nums[mid]} is greater than ${target} — move the right boundary down.`, codeLineIndex: 15, phase: 'compare-right', pass: 'right' })
    }
  }
  steps.push({ lo, hi, mid: -1, result: [leftRes, rightRes], description: `Both searches complete. ${target} appears from position ${leftRes} to position ${rightRes}.`, codeLineIndex: 16, phase: 'complete', pass: 'done' })
  return steps
}

function genFlagBS(nums, target) {
  const steps = []
  const n = nums.length
  steps.push({ lo: -1, hi: -1, mid: -1, result: [-1, -1], description: `Use one binary search function with a "find first" flag — call it twice to get both boundaries.`, codeLineIndex: 0, phase: 'init', pass: 'none' })

  const doSearch = (findFirst, prevResult) => {
    let lo = 0, hi = n - 1, res = -1
    const pass = findFirst ? 'left' : 'right'
    steps.push({ lo, hi, mid: -1, result: findFirst ? [-1, prevResult] : [prevResult, -1], description: `Searching for the ${findFirst ? 'first' : 'last'} occurrence of ${target}.`, codeLineIndex: 1, phase: findFirst ? 'findLeft' : 'findRight', pass })
    while (lo <= hi) {
      const mid = lo + Math.floor((hi - lo) / 2)
      steps.push({ lo, hi, mid, result: findFirst ? [res, prevResult] : [prevResult, res], description: `Midpoint value is ${nums[mid]}.`, codeLineIndex: 3, phase: 'compare', pass })
      if (nums[mid] === target) {
        res = mid
        if (findFirst) { hi = mid - 1; steps.push({ lo, hi, mid, result: findFirst ? [res, prevResult] : [prevResult, res], description: `Matched at position ${res}. Searching left for an earlier occurrence.`, codeLineIndex: 6, phase: 'found', pass }) }
        else { lo = mid + 1; steps.push({ lo, hi, mid, result: findFirst ? [res, prevResult] : [prevResult, res], description: `Matched at position ${res}. Searching right for a later occurrence.`, codeLineIndex: 7, phase: 'found', pass }) }
      } else if (nums[mid] < target) {
        lo = mid + 1
        steps.push({ lo, hi, mid, result: findFirst ? [res, prevResult] : [prevResult, res], description: `Value is too small — move left boundary up.`, codeLineIndex: 8, phase: 'compare', pass })
      } else {
        hi = mid - 1
        steps.push({ lo, hi, mid, result: findFirst ? [res, prevResult] : [prevResult, res], description: `Value is too large — move right boundary down.`, codeLineIndex: 9, phase: 'compare', pass })
      }
    }
    return res
  }

  const first = doSearch(true, -1)
  const last  = doSearch(false, first)
  steps.push({ lo: 0, hi: n - 1, mid: -1, result: [first, last], description: `Both searches done. Target ${target} found at range [${first}, ${last}].`, codeLineIndex: 10, phase: 'complete', pass: 'done' })
  return steps
}

function genLinear(nums, target) {
  const steps = []
  steps.push({ lo: -1, hi: -1, mid: -1, result: [-1, -1], description: `Scan every element from left to right. The first match sets the "first" position; every match updates the "last" position.`, codeLineIndex: 0, phase: 'init', pass: 'scan' })
  let first = -1, last = -1
  for (let i = 0; i < nums.length; i++) {
    steps.push({ lo: i, hi: -1, mid: i, result: [first, last], description: `Checking position ${i}: value ${nums[i]}. ${nums[i] === target ? 'It matches the target!' : `Not ${target}.`}`, codeLineIndex: 2, phase: 'scan', pass: 'scan' })
    if (nums[i] === target) {
      if (first === -1) first = i
      last = i
      steps.push({ lo: i, hi: -1, mid: i, result: [first, last], description: `Match at position ${i}. First occurrence: ${first}, last occurrence so far: ${last}.`, codeLineIndex: 3, phase: 'found', pass: 'scan' })
    }
  }
  steps.push({ lo: -1, hi: -1, mid: -1, result: [first, last], description: `Scan complete. ${first === -1 ? 'Target not found.' : `Target found from position ${first} to position ${last}.`}`, codeLineIndex: 5, phase: 'complete', pass: 'done' })
  return steps
}

function genSTL(nums, target) {
  const steps = []
  steps.push({ lo: -1, hi: -1, mid: -1, result: [-1, -1], description: `Use lower_bound (first element ≥ target) and upper_bound (first element > target). Their difference gives the range.`, codeLineIndex: 0, phase: 'init', pass: 'none' })

  if (nums.length === 0 || !nums.includes(target)) {
    steps.push({ lo: -1, hi: -1, mid: -1, result: [-1, -1], description: `The target is not in the array. Return [-1, -1].`, codeLineIndex: 1, phase: 'complete', pass: 'done' })
    return steps
  }

  const lo = nums.indexOf(target)
  steps.push({ lo, hi: -1, mid: lo, result: [lo, -1], description: `lower_bound: the first position with a value ≥ ${target} is index ${lo}.`, codeLineIndex: 0, phase: 'lower', pass: 'left' })

  let hi = nums.length - 1
  while (hi >= 0 && nums[hi] !== target) hi--
  const hiIdx = hi + 1

  steps.push({ lo, hi: hiIdx, mid: -1, result: [lo, hi], description: `upper_bound: the first position with a value > ${target} is index ${hiIdx}. So the last occurrence is at ${hiIdx} - 1 = ${hi}.`, codeLineIndex: 2, phase: 'upper', pass: 'right' })
  steps.push({ lo, hi: hiIdx, mid: -1, result: [lo, hi], description: `Done! Target ${target} spans from index ${lo} to index ${hi}.`, codeLineIndex: 3, phase: 'complete', pass: 'done' })
  return steps
}

export function generateSteps(algo, nums, target) {
  if (algo === 'twoBS')  return genTwoBS(nums, target)
  if (algo === 'flagBS') return genFlagBS(nums, target)
  if (algo === 'linear') return genLinear(nums, target)
  return genSTL(nums, target)
}
