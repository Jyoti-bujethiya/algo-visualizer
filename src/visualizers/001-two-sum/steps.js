// Two Sum — step generator

export function generateSteps(algo, array, target) {
  switch (algo) {
    case 'brute':      return generateBruteForceSteps(array, target)
    case 'hashmap':    return generateHashMapSteps(array, target)
    case 'twopointer': return generateTwoPointerSteps(array, target)
    default:           return generateHashMapSteps(array, target)
  }
}

function generateBruteForceSteps(array, target) {
  const steps = []
  const stats = { comparisons: 0, arrayAccess: 0, mapOps: 0 }
  const n = array.length

  steps.push({ description: 'Try every pair of numbers and check if they add up to the target.', highlights: [], hashmap: null, stats: { ...stats }, codeLineIndex: 0 })

  for (let i = 0; i < n - 1; i++) {
    stats.arrayAccess++
    steps.push({ description: `Fixing the first number as ${array[i]} (position ${i}). Now look for a second number that adds up to ${target}.`, highlights: [{ index: i, type: 'current' }], hashmap: null, stats: { ...stats }, codeLineIndex: 0 })

    for (let j = i + 1; j < n; j++) {
      stats.arrayAccess++; stats.comparisons++
      const sum = array[i] + array[j]
      steps.push({
        description: `${array[i]} + ${array[j]} = ${sum}. ${sum === target ? `That equals ${target} — found the answer!` : `Not ${target}, keep searching.`}`,
        highlights: [{ index: i, type: 'current' }, { index: j, type: 'checking' }],
        hashmap: null, stats: { ...stats }, codeLineIndex: 2,
      })
      if (sum === target) {
        steps.push({ description: `Found it! The two numbers at positions ${i} and ${j} add up to ${target}.`, highlights: [{ index: i, type: 'found' }, { index: j, type: 'found' }], hashmap: null, stats: { ...stats }, codeLineIndex: 3 })
        return steps
      }
    }
  }
  steps.push({ description: 'Checked every pair — no two numbers add up to the target.', highlights: [], hashmap: null, stats: { ...stats }, codeLineIndex: -1 })
  return steps
}

function generateHashMapSteps(array, target) {
  const steps = []
  const stats = { comparisons: 0, arrayAccess: 0, mapOps: 0 }
  const hashmap = new Map()

  steps.push({ description: `Use a hash map to remember each number we've seen. For every new number, check if its complement (target minus that number) is already stored.`, highlights: [], hashmap: new Map(), stats: { ...stats }, codeLineIndex: 0 })

  for (let i = 0; i < array.length; i++) {
    stats.arrayAccess++
    const num = array[i], complement = target - num
    steps.push({ description: `Looking at ${num}. We need ${complement} to complete the pair (because ${num} + ${complement} = ${target}).`, highlights: [{ index: i, type: 'current' }], hashmap: new Map(hashmap), stats: { ...stats }, codeLineIndex: 1 })

    stats.comparisons++; stats.mapOps++

    if (hashmap.has(complement)) {
      const compIdx = hashmap.get(complement)
      steps.push({ description: `${complement} is already in the map at position ${compIdx}! We have our pair.`, highlights: [{ index: compIdx, type: 'found' }, { index: i, type: 'found' }], hashmap: new Map(hashmap), stats: { ...stats }, codeLineIndex: 2 })
      steps.push({ description: `Done! Positions ${compIdx} and ${i} hold numbers that add up to ${target}.`, highlights: [{ index: compIdx, type: 'found' }, { index: i, type: 'found' }], hashmap: new Map(hashmap), stats: { ...stats }, codeLineIndex: 3 })
      return steps
    }

    stats.mapOps++
    hashmap.set(num, i)
    steps.push({ description: `${complement} not seen yet. Store ${num} in the map so a future number can find it.`, highlights: [{ index: i, type: 'in-map' }], hashmap: new Map(hashmap), stats: { ...stats }, codeLineIndex: 4 })
  }
  steps.push({ description: 'Went through every number — no valid pair found.', highlights: [], hashmap: new Map(hashmap), stats: { ...stats }, codeLineIndex: -1 })
  return steps
}

function generateTwoPointerSteps(array, target) {
  const steps = []
  const stats = { comparisons: 0, arrayAccess: 0, mapOps: 0 }

  steps.push({ description: 'Sort the array first, then use two pointers — one at each end — and move them inward.', highlights: [], hashmap: null, stats: { ...stats }, codeLineIndex: 0 })

  const pairs = array.map((val, idx) => ({ val, idx }))
  pairs.sort((a, b) => a.val - b.val)

  steps.push({ description: `Array sorted: [${pairs.map(p => p.val).join(', ')}]. The left pointer starts at the smallest, the right at the largest.`, highlights: [], hashmap: null, sortedPairs: pairs, stats: { ...stats }, codeLineIndex: 0 })

  let left = 0, right = pairs.length - 1
  steps.push({ description: `Left pointer at ${pairs[left].val}, right pointer at ${pairs[right].val}. Start narrowing in.`, highlights: [], hashmap: null, sortedPairs: pairs, pointers: { left, right }, stats: { ...stats }, codeLineIndex: 1 })

  while (left < right) {
    stats.arrayAccess += 2; stats.comparisons++
    const sum = pairs[left].val + pairs[right].val
    steps.push({ description: `${pairs[left].val} + ${pairs[right].val} = ${sum}. ${sum === target ? 'That matches the target!' : sum < target ? 'Too small — move the left pointer right to increase the sum.' : 'Too large — move the right pointer left to decrease the sum.'}`, highlights: [], hashmap: null, sortedPairs: pairs, pointers: { left, right }, stats: { ...stats }, codeLineIndex: 3 })

    if (sum === target) {
      steps.push({ description: `Found the pair! Original positions are ${pairs[left].idx} and ${pairs[right].idx}.`, highlights: [{ index: pairs[left].idx, type: 'found' }, { index: pairs[right].idx, type: 'found' }], hashmap: null, sortedPairs: pairs, pointers: { left, right }, stats: { ...stats }, codeLineIndex: 4 })
      return steps
    } else if (sum < target) {
      left++
      steps.push({ description: `Sum is too small. Move the left pointer right to try a larger value.`, highlights: [], hashmap: null, sortedPairs: pairs, pointers: { left, right }, stats: { ...stats }, codeLineIndex: 5 })
    } else {
      right--
      steps.push({ description: `Sum is too large. Move the right pointer left to try a smaller value.`, highlights: [], hashmap: null, sortedPairs: pairs, pointers: { left, right }, stats: { ...stats }, codeLineIndex: 6 })
    }
  }
  steps.push({ description: 'Pointers met in the middle — no pair found that adds up to the target.', highlights: [], hashmap: null, sortedPairs: pairs, stats: { ...stats }, codeLineIndex: -1 })
  return steps
}
