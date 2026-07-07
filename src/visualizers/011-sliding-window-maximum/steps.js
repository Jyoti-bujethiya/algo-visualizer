// 011 – Sliding Window Maximum — pure step generator

// CODE.deque = ['deque=[]','for i in 0..n-1:','  pop front if out-of-window','  pop back if smaller','  push i','  if i>=k-1: record max']
// CODE.brute = ['for i in 0..n-k:','  maxVal=nums[i]','  for j in i..i+k-1:','  ','    maxVal=max(maxVal,nums[j])','  record max']
const push = (steps, desc, right, winL, winR, deque, result, extra = {}) =>
  steps.push({ description: desc, right, winL, winR, deque: [...deque], result: [...result], ...extra })

function genDeque(nums, k) {
  const steps = []
  const n = nums.length
  const deque = [], result = []

  push(steps, `Use a deque (double-ended queue) that always holds indices in decreasing value order. The front always points to the maximum in the current window of size ${k}.`, -1, 0, k - 1, deque, result, { codeLineIndex: 0 })

  for (let i = 0; i < n; i++) {
    while (deque.length && deque[0] < i - k + 1) {
      const removed = deque.shift()
      push(steps, `The element at position ${removed} (value ${nums[removed]}) has slid out of the window — remove it from the front of the deque.`,
        i, i - k + 1, i, deque, result, { removing: removed, codeLineIndex: 2 })
    }
    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) {
      const popped = deque.pop()
      push(steps, `Value ${nums[popped]} at position ${popped} is smaller than the incoming ${nums[i]} — it can never be the window maximum, so remove it from the back.`,
        i, Math.max(0, i - k + 1), i, deque, result, { popping: popped, codeLineIndex: 3 })
    }
    deque.push(i)
    push(steps,
      `Add position ${i} (value ${nums[i]}) to the back of the deque. Deque values from front to back: [${deque.map(idx => nums[idx]).join(', ')}].`,
      i, Math.max(0, i - k + 1), i, deque, result, { codeLineIndex: 4 })

    if (i >= k - 1) {
      const maxVal = nums[deque[0]]
      result.push(maxVal)
      push(steps, `Window [${i-k+1}..${i}] is complete. The front of the deque gives the maximum: ${maxVal}. Recording it.`,
        i, i - k + 1, i, deque, result, { recording: true, codeLineIndex: 5 })
    }
  }

  push(steps, `All windows processed. Result: [${result.join(', ')}].`, n - 1, n - k, n - 1, deque, result, { complete: true, codeLineIndex: 5 })
  return steps
}

function genBrute(nums, k) {
  const steps = []
  const n = nums.length, result = []

  push(steps, `For every window of size ${k}, scan all elements inside it and pick the largest. Simple but slow.`, -1, 0, k - 1, [], result, { codeLineIndex: 0 })

  for (let i = 0; i <= n - k; i++) {
    let maxVal = nums[i], maxIdx = i
    push(steps, `Starting window at position ${i}: [${nums.slice(i, i + k).join(', ')}]. Scanning for the maximum.`, i + k - 1, i, i + k - 1, [], result, { winScanStart: i, codeLineIndex: 1 })
    for (let j = i; j < i + k; j++) {
      push(steps,
        `Checking position ${j}: value ${nums[j]}. ${nums[j] > maxVal ? `It's larger than the current max (${maxVal}) — update the max.` : `Not larger than the current max (${maxVal}).`}`,
        j, i, i + k - 1, [], result, { scanning: j, maxIdx, codeLineIndex: 3 })
      if (nums[j] > maxVal) { maxVal = nums[j]; maxIdx = j }
    }
    result.push(maxVal)
    push(steps, `Window [${i}..${i+k-1}] maximum is ${maxVal}. Result so far: [${result.join(', ')}].`,
      i + k - 1, i, i + k - 1, [], result, { recording: true, maxIdx, codeLineIndex: 4 })
  }

  push(steps, `All windows done. Result: [${result.join(', ')}].`, n - 1, n - k, n - 1, [], result, { complete: true, codeLineIndex: 4 })
  return steps
}

export function generateSteps(algo, nums, k) {
  if (algo === 'brute') return genBrute(nums, k)
  return genDeque(nums, k)
}
