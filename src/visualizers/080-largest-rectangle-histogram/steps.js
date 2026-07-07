// 080 — Largest Rectangle in Histogram · steps.js
// Monotonic increasing stack of indices
// When height[i] < height[stack.top], pop and compute area

// line indices:
// 0: function largestRectangleArea(heights):
// 1:   stack=[]; maxArea=0
// 2:   for i = 0 to n (sentinel):
// 3:     h = i==n ? 0 : heights[i]
// 4:     while stack and h < heights[stack.top]:
// 5:       height = heights[stack.pop()]
// 6:       width = stack.empty ? i : i - stack.top - 1
// 7:       maxArea = max(maxArea, height * width)
// 8:     stack.push(i)
// 9:   return maxArea

function push(steps, desc, stack, maxArea, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, stack: [...stack], maxArea, highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(heights) {
  const steps = []
  const n = heights.length
  const stack = [], highlights = {}
  let maxArea = 0

  push(steps, `Largest Rectangle in Histogram: heights=[${heights.join(',')}]. Monotonic increasing stack: pop when current bar is shorter and compute rectangle area.`, stack, 0, {}, 0)

  for (let i = 0; i <= n; i++) {
    const h = i === n ? 0 : heights[i]
    if (i < n) {
      highlights[i] = 'current'
      push(steps, `i=${i}: h=${h}. Check if smaller than stack top.`, stack, maxArea, { ...highlights }, 2)
    }

    while (stack.length > 0 && h < heights[stack[stack.length - 1]]) {
      const j = stack.pop()
      const barH = heights[j]
      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1
      const area = barH * width
      highlights[j] = 'compare'
      push(steps, `Pop index ${j} (h=${barH}). Width = ${width}. Area = ${barH}×${width} = ${area}. maxArea = max(${maxArea}, ${area}) = ${Math.max(maxArea, area)}.`, stack, Math.max(maxArea, area), { ...highlights }, 6)
      maxArea = Math.max(maxArea, area)
      highlights[j] = area === maxArea ? 'match' : 'done'
    }

    if (i < n) {
      stack.push(i)
      highlights[i] = 'compare'
      push(steps, `Push ${i} (h=${h}). Stack: [${stack.join(',')}].`, stack, maxArea, { ...highlights }, 8)
    }
  }

  push(steps, `Largest rectangle area = ${maxArea}.`, stack, maxArea, { ...highlights }, 9, { maxArea, done: true })
  return steps
}
