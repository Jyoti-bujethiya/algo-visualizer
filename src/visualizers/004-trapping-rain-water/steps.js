// 004 — Trapping Rain Water · steps.js
export function generateSteps(algo, heights) {
  return algo === 'dp' ? generateDPSteps(heights) : generateTwoPointerSteps(heights)
}

function generateDPSteps(h) {
  const steps = [], n = h.length
  const leftMax = new Array(n), rightMax = new Array(n), water = new Array(n).fill(0)
  steps.push({ description: 'Precompute the tallest bar to the left and right of every position. Water at each bar equals the shorter of those two heights minus the bar itself.', heights: h, water: [...water], leftMax: [], rightMax: [], currentPos: -1, totalWater: 0, codeLineIndex: 0 })
  leftMax[0] = h[0]
  for (let i = 1; i < n; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], h[i])
    steps.push({ description: `The tallest bar to the left of position ${i} (including itself) is ${leftMax[i]}.`, heights: h, water: [...water], leftMax: leftMax.slice(0, i + 1), rightMax: [], currentPos: i, totalWater: 0, codeLineIndex: 0 })
  }
  rightMax[n - 1] = h[n - 1]
  for (let i = n - 2; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], h[i])
    steps.push({ description: `The tallest bar to the right of position ${i} (including itself) is ${rightMax[i]}.`, heights: h, water: [...water], leftMax: [...leftMax], rightMax: rightMax.slice(i), currentPos: i, totalWater: 0, codeLineIndex: 1 })
  }
  let total = 0
  for (let i = 0; i < n; i++) {
    water[i] = Math.min(leftMax[i], rightMax[i]) - h[i]
    total += water[i]
    steps.push({ description: `Position ${i}: water level is min(${leftMax[i]}, ${rightMax[i]}) = ${Math.min(leftMax[i], rightMax[i])}, bar height is ${h[i]}, so ${water[i]} units of water sit here. Running total: ${total}.`, heights: h, water: [...water], leftMax: [...leftMax], rightMax: [...rightMax], currentPos: i, totalWater: total, codeLineIndex: 2 })
  }
  steps.push({ description: `All positions filled. Total water trapped: ${total} units.`, heights: h, water: [...water], leftMax: [...leftMax], rightMax: [...rightMax], currentPos: -1, totalWater: total, codeLineIndex: 2 })
  return steps
}

function generateTwoPointerSteps(h) {
  const steps = [], n = h.length
  const water = new Array(n).fill(0)
  let L = 0, R = n - 1, lMax = 0, rMax = 0, total = 0
  steps.push({ description: 'Use two pointers moving inward. The side with the shorter max height determines how much water can be trapped — process that side first.', heights: h, water: [...water], left: L, right: R, leftMax: lMax, rightMax: rMax, totalWater: 0, codeLineIndex: 0 })
  while (L < R) {
    if (h[L] < h[R]) {
      if (h[L] >= lMax) {
        lMax = h[L]
        steps.push({ description: `Left bar (height ${h[L]}) is the new tallest seen from the left. Update the left maximum to ${lMax} — no water trapped here.`, heights: h, water: [...water], left: L, right: R, leftMax: lMax, rightMax: rMax, totalWater: total, currentPos: L, codeLineIndex: 3 })
      } else {
        water[L] = lMax - h[L]; total += water[L]
        steps.push({ description: `Left bar is shorter than the left maximum (${lMax}). Water fills up to ${lMax}, so ${water[L]} units are trapped here. Total so far: ${total}.`, heights: h, water: [...water], left: L, right: R, leftMax: lMax, rightMax: rMax, totalWater: total, currentPos: L, codeLineIndex: 4 })
      }
      L++
    } else {
      if (h[R] >= rMax) {
        rMax = h[R]
        steps.push({ description: `Right bar (height ${h[R]}) is the new tallest seen from the right. Update the right maximum to ${rMax} — no water trapped here.`, heights: h, water: [...water], left: L, right: R, leftMax: lMax, rightMax: rMax, totalWater: total, currentPos: R, codeLineIndex: 6 })
      } else {
        water[R] = rMax - h[R]; total += water[R]
        steps.push({ description: `Right bar is shorter than the right maximum (${rMax}). Water fills up to ${rMax}, so ${water[R]} units are trapped here. Total so far: ${total}.`, heights: h, water: [...water], left: L, right: R, leftMax: lMax, rightMax: rMax, totalWater: total, currentPos: R, codeLineIndex: 7 })
      }
      R--
    }
  }
  steps.push({ description: `Both pointers met. Total water trapped: ${total} units.`, heights: h, water: [...water], left: -1, right: -1, leftMax: lMax, rightMax: rMax, totalWater: total, codeLineIndex: -1 })
  return steps
}
