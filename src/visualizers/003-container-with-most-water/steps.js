// 003 — Container With Most Water · steps.js
export function generateSteps(algo, heights) {
  return algo === 'bruteForce' ? generateBruteSteps(heights) : generateTwoPointerSteps(heights)
}

function generateBruteSteps(h) {
  const steps = [], stats = { comparisons: 0, maxArea: 0 }
  steps.push({ description: 'Try every pair of lines and calculate the water each pair can hold. Keep track of the largest area found.', highlights: [], maxArea: 0, stats: { ...stats }, codeLineIndex: 0 })
  const n = h.length
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      stats.comparisons++
      const area = (j - i) * Math.min(h[i], h[j])
      const isMax = area > stats.maxArea
      if (isMax) stats.maxArea = area
      steps.push({
        description: `Lines at positions ${i} and ${j}: width is ${j - i}, the shorter line is height ${Math.min(h[i], h[j])}, so the area is ${area}. ${isMax ? 'New best!' : `Current best is still ${stats.maxArea}.`}`,
        highlights: [{ index: i, type: isMax ? 'match' : 'current' }, { index: j, type: isMax ? 'match' : 'compare' }],
        left: i, right: j, currentArea: area, maxArea: stats.maxArea,
        stats: { ...stats }, codeLineIndex: isMax ? 3 : 2,
      })
    }
  }
  steps.push({ description: `All pairs checked. The maximum water container holds ${stats.maxArea} units.`, highlights: [], maxArea: stats.maxArea, stats: { ...stats }, codeLineIndex: 4 })
  return steps
}

function generateTwoPointerSteps(h) {
  const steps = [], stats = { comparisons: 0, maxArea: 0 }
  let L = 0, R = h.length - 1
  steps.push({ description: 'Place one pointer at the left end and one at the right. Move the shorter line inward — it has no chance of improving the area by staying.', highlights: [], left: L, right: R, maxArea: 0, stats: { ...stats }, codeLineIndex: 0 })
  while (L < R) {
    stats.comparisons++
    const area = (R - L) * Math.min(h[L], h[R])
    const isMax = area > stats.maxArea
    if (isMax) stats.maxArea = area
    steps.push({
      description: `Left line height ${h[L]}, right line height ${h[R]}. Width is ${R - L}, water level is ${Math.min(h[L], h[R])}, area = ${area}. ${isMax ? 'New best!' : `Best so far is ${stats.maxArea}.`}`,
      highlights: [{ index: L, type: isMax ? 'match' : 'current' }, { index: R, type: isMax ? 'match' : 'special' }],
      left: L, right: R, currentArea: area, maxArea: stats.maxArea,
      stats: { ...stats }, codeLineIndex: isMax ? 3 : 2,
    })
    if (h[L] < h[R]) {
      steps.push({ description: `The left line (${h[L]}) is shorter. Moving it right — a taller line might increase the area.`, highlights: [{ index: L, type: 'discard' }, { index: R, type: 'special' }], left: L, right: R, maxArea: stats.maxArea, stats: { ...stats }, codeLineIndex: 4 })
      L++
    } else {
      steps.push({ description: `The right line (${h[R]}) is shorter or equal. Moving it left — a taller line might increase the area.`, highlights: [{ index: L, type: 'current' }, { index: R, type: 'discard' }], left: L, right: R, maxArea: stats.maxArea, stats: { ...stats }, codeLineIndex: 5 })
      R--
    }
  }
  steps.push({ description: `Pointers met — all useful pairs have been considered. Maximum area is ${stats.maxArea} units.`, highlights: [], maxArea: stats.maxArea, stats: { ...stats }, codeLineIndex: 6 })
  return steps
}
