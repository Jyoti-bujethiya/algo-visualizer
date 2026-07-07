// 096 — Kth Largest Element (QuickSelect) · steps.js

// QuickSelect line indices:
// 0: function findKthLargest(nums, k):
// 1:   target = n - k  (kth largest = (n-k)th smallest)
// 2:   function quickSelect(lo, hi):
// 3:     pivot = nums[hi]
// 4:     p = lo
// 5:     for i from lo to hi-1:
// 6:       if nums[i] <= pivot: swap(nums[i], nums[p]); p++
// 7:     swap(nums[p], nums[hi])  // pivot in final position
// 8:     if p == target: return nums[p]
// 9:     else if p < target: return quickSelect(p+1, hi)
// 10:    else: return quickSelect(lo, p-1)
// 11: return quickSelect(0, n-1)

// Sort line indices (comparison):
// 0: function findKthLargest(nums, k):
// 1:   sort nums descending
// 2:   return nums[k-1]

function push(steps, desc, arr, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, arr: [...arr], highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(algo, nums, k) {
  const steps = []
  const arr = [...nums]

  push(steps,
    `Kth Largest Element (k=${k}) in [${arr.join(', ')}].`,
    arr, {}, 0
  )

  if (algo === 'sort') {
    push(steps, 'Sort approach: sort array descending, return index k-1.', arr, {}, 1)
    arr.sort((a, b) => b - a)
    const hl = {}
    for (let i = 0; i < arr.length; i++) hl[i] = 'compare'
    hl[k - 1] = 'match'
    push(steps,
      `Sorted descending: [${arr.join(', ')}]. k-1=${k-1}, arr[${k-1}]=${arr[k-1]}.`,
      arr, hl, 2, { result: arr[k - 1], done: true }
    )
    return steps
  }

  // QuickSelect
  const target = arr.length - k
  push(steps,
    `QuickSelect: k=${k} largest = index ${target} in 0-indexed sorted ascending array. Target index = n-k = ${arr.length}-${k} = ${target}.`,
    arr, {}, 1
  )

  let found = false
  let result = null

  function quickSelect(lo, hi) {
    if (found) return
    const hl = {}
    for (let i = lo; i <= hi; i++) hl[i] = 'compare'
    hl[hi] = 'special'  // pivot

    push(steps,
      `quickSelect(${lo}, ${hi}). Pivot = arr[${hi}] = ${arr[hi]}.`,
      arr, hl, 3
    )

    let p = lo
    for (let i = lo; i < hi; i++) {
      hl[i] = 'current'
      push(steps,
        `arr[${i}]=${arr[i]} vs pivot=${arr[hi]}. ${arr[i] <= arr[hi] ? '≤ pivot → swap with p=' + p : '> pivot → skip'}.`,
        arr, { ...hl }, 5
      )
      if (arr[i] <= arr[hi]) {
        ;[arr[i], arr[p]] = [arr[p], arr[i]]
        hl[p] = 'visiting'
        push(steps,
          `Swapped arr[${i}] and arr[${p}]. p = ${p + 1}. Array: [${arr.join(', ')}].`,
          arr, { ...hl }, 6
        )
        p++
      }
      hl[i] = 'compare'
    }

    ;[arr[p], arr[hi]] = [arr[hi], arr[p]]
    const pivotHL = {}
    for (let i = lo; i <= hi; i++) pivotHL[i] = 'compare'
    pivotHL[p] = 'match'
    push(steps,
      `Pivot placed at index ${p} (value=${arr[p]}). Array: [${arr.join(', ')}].`,
      arr, pivotHL, 7
    )

    if (p === target) {
      pivotHL[p] = 'match'
      push(steps,
        `Pivot index ${p} == target index ${target}. ${arr[p]} is the ${k}th largest!`,
        arr, pivotHL, 8, { result: arr[p], done: true }
      )
      found = true
      result = arr[p]
    } else if (p < target) {
      push(steps,
        `Pivot index ${p} < target ${target}. Search right half [${p+1}, ${hi}].`,
        arr, pivotHL, 9
      )
      quickSelect(p + 1, hi)
    } else {
      push(steps,
        `Pivot index ${p} > target ${target}. Search left half [${lo}, ${p-1}].`,
        arr, pivotHL, 10
      )
      quickSelect(lo, p - 1)
    }
  }

  quickSelect(0, arr.length - 1)

  if (!found) {
    push(steps, `Result: ${result}.`, arr, {}, 11, { result, done: true })
  }

  return steps
}
