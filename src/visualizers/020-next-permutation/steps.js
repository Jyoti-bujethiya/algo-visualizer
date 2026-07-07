// Next Permutation — LeetCode #31 — pure step generators (no DOM)

function genClassic(nums, isManual) {
  const steps = []
  const arr = [...nums]
  const n = arr.length

  steps.push({ arr: [...arr], pivot: -1, swapJ: -1, suffix: [], phase: 'init', codeLineIndex: 0, description: `Find the next lexicographically greater permutation of [${arr.join(', ')}]. If none exists, wrap around to the smallest.` })

  let i = n - 2
  steps.push({ arr: [...arr], pivot: -1, swapJ: -1, suffix: [], phase: 'scan-pivot', codeLineIndex: 2, description: `Scan from right to left looking for the first element that is smaller than its right neighbour — this is the "pivot" point.` })

  while (i >= 0 && arr[i] >= arr[i + 1]) {
    steps.push({ arr: [...arr], pivot: -1, swapJ: i, suffix: [], phase: 'scan-pivot', codeLineIndex: 2, description: `${arr[i]} ≥ ${arr[i + 1]} — this is part of a descending tail, not the pivot. Move one step left.` })
    i--
  }

  if (i < 0) {
    steps.push({ arr: [...arr], pivot: -1, swapJ: -1, suffix: [], phase: 'all-desc', codeLineIndex: 5, description: `The entire array is in descending order — this is already the largest permutation. Reverse it to get the smallest.` })
    arr.reverse()
    steps.push({ arr: [...arr], pivot: -1, swapJ: -1, suffix: [], phase: 'complete', codeLineIndex: 11, description: `Reversed to get the smallest permutation: [${arr.join(', ')}].` })
    return steps
  }

  steps.push({ arr: [...arr], pivot: i, swapJ: -1, suffix: Array.from({ length: n - i - 1 }, (_, k) => i + 1 + k), phase: 'pivot-found', codeLineIndex: 5, description: `Pivot found at position ${i} (value ${arr[i]}). Everything to its right is descending. We need to swap it with the next larger value from the right.` })

  let j = n - 1
  steps.push({ arr: [...arr], pivot: i, swapJ: j, suffix: [], phase: 'find-j', codeLineIndex: 6, description: `Starting from the right end, find the smallest value that is still larger than the pivot (${arr[i]}).` })

  while (arr[j] <= arr[i]) {
    steps.push({ arr: [...arr], pivot: i, swapJ: j, suffix: [], phase: 'find-j', codeLineIndex: 7, description: `${arr[j]} is not larger than the pivot (${arr[i]}) — move one step left.` })
    j--
  }

  steps.push({ arr: [...arr], pivot: i, swapJ: j, suffix: [], phase: 'swap', codeLineIndex: 8, description: `Found the swap candidate at position ${j} (value ${arr[j]}). Swapping it with the pivot at position ${i} (value ${arr[i]}).` });

  [arr[i], arr[j]] = [arr[j], arr[i]]
  steps.push({ arr: [...arr], pivot: i, swapJ: j, suffix: Array.from({ length: n - i - 1 }, (_, k) => i + 1 + k), phase: 'swapped', codeLineIndex: 8, description: `Swap done. Now reverse the suffix after position ${i} — it's still descending, and we need the smallest arrangement.` })

  const suffix = arr.slice(i + 1)
  suffix.reverse()
  for (let k = 0; k < suffix.length; k++) arr[i + 1 + k] = suffix[k]

  steps.push({ arr: [...arr], pivot: -1, swapJ: -1, suffix: [], phase: 'complete', codeLineIndex: isManual ? 9 : 11, description: `Suffix reversed. The next permutation is [${arr.join(', ')}].` })
  return steps
}

function genVerbose(nums) {
  const steps = []
  const arr = [...nums]
  const n = arr.length

  steps.push({ arr: [...arr], pivot: -1, swapJ: -1, suffix: [], phase: 'init', codeLineIndex: 0, description: `Four explicit steps: (1) find the dip (pivot), (2) find the swap candidate, (3) swap, (4) reverse the suffix.` })

  let pivot = -1
  for (let i = n - 2; i >= 0; i--) {
    steps.push({ arr: [...arr], pivot: -1, swapJ: i, suffix: [], phase: 'scan-pivot', codeLineIndex: 2, description: `Comparing positions ${i} and ${i + 1}: ${arr[i]} ${arr[i] < arr[i + 1] ? '< ' + arr[i + 1] + ' — this is the dip (pivot)!' : '>= ' + arr[i + 1] + ' — still descending, continue left.'}` })
    if (arr[i] < arr[i + 1]) { pivot = i; break }
  }

  if (pivot === -1) {
    steps.push({ arr: [...arr], pivot: -1, swapJ: -1, suffix: [], phase: 'all-desc', codeLineIndex: 5, description: `No dip found — the array is fully non-increasing. Reverse it to get the smallest permutation.` })
    arr.reverse()
    steps.push({ arr: [...arr], pivot: -1, swapJ: -1, suffix: [], phase: 'complete', codeLineIndex: 6, description: `Reversed: [${arr.join(', ')}].` })
    return steps
  }

  steps.push({ arr: [...arr], pivot, swapJ: -1, suffix: Array.from({ length: n - pivot - 1 }, (_, k) => pivot + 1 + k), phase: 'pivot-found', codeLineIndex: 3, description: `Pivot found at position ${pivot} (value ${arr[pivot]}). The suffix [${arr.slice(pivot + 1).join(', ')}] is descending.` })

  let swapIdx = -1
  for (let j = n - 1; j > pivot; j--) {
    steps.push({ arr: [...arr], pivot, swapJ: j, suffix: [], phase: 'find-swap', codeLineIndex: 9, description: `Checking position ${j} (value ${arr[j]}): ${arr[j] > arr[pivot] ? `It's larger than the pivot (${arr[pivot]}) — this is the swap candidate.` : `Not larger than the pivot, continue.`}` })
    if (arr[j] > arr[pivot]) { swapIdx = j; break }
  }

  steps.push({ arr: [...arr], pivot, swapJ: swapIdx, suffix: [], phase: 'swap', codeLineIndex: 12, description: `Swapping the pivot (${arr[pivot]} at position ${pivot}) with the smallest value greater than it (${arr[swapIdx]} at position ${swapIdx}).` });

  [arr[pivot], arr[swapIdx]] = [arr[swapIdx], arr[pivot]]
  steps.push({ arr: [...arr], pivot, swapJ: swapIdx, suffix: Array.from({ length: n - pivot - 1 }, (_, k) => pivot + 1 + k), phase: 'swapped', codeLineIndex: 12, description: `Swap done: [${arr.join(', ')}]. Now reverse the suffix to make it ascending (smallest possible).` })

  const sfx = arr.slice(pivot + 1).reverse()
  for (let k = 0; k < sfx.length; k++) arr[pivot + 1 + k] = sfx[k]

  steps.push({ arr: [...arr], pivot: -1, swapJ: -1, suffix: [], phase: 'complete', codeLineIndex: 13, description: `Done! Next permutation: [${arr.join(', ')}].` })
  return steps
}

export function generateSteps(algo, nums) {
  if (algo === 'verbose')   return genVerbose(nums)
  if (algo === 'manualRev') return genClassic(nums, true)
  return genClassic(nums, false)
}
