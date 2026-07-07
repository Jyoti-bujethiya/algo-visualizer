// 002 — Three Sum · steps.js
export function generateSteps(algo, array) {
  switch (algo) {
    case 'twopointer': return generateTwoPointerSteps(array)
    case 'brute':      return generateBruteForceSteps(array)
    default:           return generateTwoPointerSteps(array)
  }
}

function generateBruteForceSteps(array) {
  const steps = [], stats = { comparisons: 0, tripletsFound: 0 }
  const foundSet = new Set(), triplets = []
  const n = array.length
  steps.push({ description: 'Try every combination of three numbers and check if they sum to zero.', highlights: [], triplets: [], stats: { ...stats }, codeLineIndex: 0 })
  for (let i = 0; i < n - 2; i++) {
    steps.push({ description: `Fixing the first number as ${array[i]}. Need two more numbers that together cancel it out.`, highlights: [{ index: i, type: 'current' }], triplets: [...triplets], stats: { ...stats }, codeLineIndex: 0 })
    for (let j = i + 1; j < n - 1; j++) {
      steps.push({ description: `Fixing the second number as ${array[j]}. Looking for a third that makes the total zero.`, highlights: [{ index: i, type: 'current' }, { index: j, type: 'compare' }], triplets: [...triplets], stats: { ...stats }, codeLineIndex: 0 })
      for (let k = j + 1; k < n; k++) {
        stats.comparisons++
        const sum = array[i] + array[j] + array[k]
        steps.push({ description: `${array[i]} + ${array[j]} + ${array[k]} = ${sum}. ${sum === 0 ? 'That sums to zero — triplet found!' : 'Not zero, keep looking.'}`, highlights: [{ index: i, type: 'current' }, { index: j, type: 'compare' }, { index: k, type: 'special' }], triplets: [...triplets], stats: { ...stats }, codeLineIndex: 1 })
        if (sum === 0) {
          const t = [array[i], array[j], array[k]].sort((a, b) => a - b)
          const key = t.join(',')
          if (!foundSet.has(key)) { foundSet.add(key); stats.tripletsFound++; triplets.push(t) }
          steps.push({ description: `New triplet recorded: [${t.join(', ')}]. Total found so far: ${stats.tripletsFound}.`, highlights: [{ index: i, type: 'match' }, { index: j, type: 'match' }, { index: k, type: 'match' }], triplets: [...triplets], stats: { ...stats }, codeLineIndex: 2 })
        }
      }
    }
  }
  steps.push({ description: `All combinations checked. Found ${stats.tripletsFound} unique triplet(s) that sum to zero.`, highlights: [], triplets: [...triplets], stats: { ...stats }, codeLineIndex: -1 })
  return steps
}

function generateTwoPointerSteps(array) {
  const steps = [], stats = { comparisons: 0, tripletsFound: 0, duplicatesSkipped: 0 }
  const triplets = []
  const sorted = [...array].sort((a, b) => a - b)
  const n = sorted.length
  steps.push({ description: 'Sort the array first. Then fix each element one by one and use two pointers to find pairs that cancel it out.', highlights: [], array: sorted, triplets: [], stats: { ...stats }, codeLineIndex: 0 })
  steps.push({ description: `Sorted order: [${sorted.join(', ')}]. Duplicates can now be skipped efficiently.`, highlights: [], array: sorted, triplets: [], stats: { ...stats }, codeLineIndex: 0 })
  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) {
      stats.duplicatesSkipped++
      steps.push({ description: `Skipping ${sorted[i]} — same as the previous fixed number, would produce duplicate triplets.`, highlights: [{ index: i, type: 'discard' }], array: sorted, triplets: [...triplets], stats: { ...stats }, codeLineIndex: 2 })
      continue
    }
    if (sorted[i] > 0) { steps.push({ description: `The smallest remaining number is ${sorted[i]}, which is positive. Three positive numbers can never sum to zero — stop early.`, highlights: [{ index: i, type: 'current' }], array: sorted, triplets: [...triplets], stats: { ...stats }, codeLineIndex: 3 }); break }
    steps.push({ description: `Fixing ${sorted[i]} as the first number. The two pointers need to find a pair that sums to ${-sorted[i]}.`, highlights: [{ index: i, type: 'current' }], array: sorted, triplets: [...triplets], stats: { ...stats }, codeLineIndex: 1 })
    let L = i + 1, R = n - 1
    while (L < R) {
      stats.comparisons++
      const sum = sorted[i] + sorted[L] + sorted[R]
      steps.push({ description: `Testing ${sorted[i]} + ${sorted[L]} + ${sorted[R]} = ${sum}. ${sum === 0 ? 'Zero! Found a triplet.' : sum < 0 ? 'Too negative — move the left pointer right to increase the sum.' : 'Too positive — move the right pointer left to decrease the sum.'}`, highlights: [{ index: i, type: 'current' }, { index: L, type: 'compare' }, { index: R, type: 'special' }], array: sorted, triplets: [...triplets], stats: { ...stats }, codeLineIndex: 6 })
      if (sum === 0) {
        stats.tripletsFound++
        triplets.push([sorted[i], sorted[L], sorted[R]])
        steps.push({ description: `Triplet [${sorted[i]}, ${sorted[L]}, ${sorted[R]}] sums to zero. Recording it and skipping any duplicates.`, highlights: [{ index: i, type: 'match' }, { index: L, type: 'match' }, { index: R, type: 'match' }], array: sorted, triplets: [...triplets], stats: { ...stats }, codeLineIndex: 7 })
        while (L < R && sorted[L] === sorted[L + 1]) { L++; stats.duplicatesSkipped++ }
        while (L < R && sorted[R] === sorted[R - 1]) { R--; stats.duplicatesSkipped++ }
        L++; R--
      } else if (sum < 0) {
        steps.push({ description: `Sum is too negative. Move the left pointer right to try a larger value.`, highlights: [{ index: i, type: 'current' }, { index: L, type: 'compare' }, { index: R, type: 'special' }], array: sorted, triplets: [...triplets], stats: { ...stats }, codeLineIndex: 8 })
        L++
      } else {
        steps.push({ description: `Sum is too positive. Move the right pointer left to try a smaller value.`, highlights: [{ index: i, type: 'current' }, { index: L, type: 'compare' }, { index: R, type: 'special' }], array: sorted, triplets: [...triplets], stats: { ...stats }, codeLineIndex: 9 })
        R--
      }
    }
  }
  steps.push({ description: `All done! Found ${stats.tripletsFound} unique triplet(s): ${triplets.map(t => `[${t.join(',')}]`).join(' ')}`, highlights: [], array: sorted, triplets: [...triplets], stats: { ...stats }, codeLineIndex: -1 })
  return steps
}
