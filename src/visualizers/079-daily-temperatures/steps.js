// 079 — Daily Temperatures · steps.js
// Monotonic decreasing stack of indices
// When T[i] > T[stack.top], pop and record answer

// line indices:
// 0: function dailyTemperatures(T):
// 1:   answer = [0,...,0]; stack=[]
// 2:   for i = 0 to n-1:
// 3:     while stack not empty and T[i] > T[stack.top]:
// 4:       j = stack.pop()
// 5:       answer[j] = i - j
// 6:     stack.push(i)
// 7:   return answer

function push(steps, desc, stack, answer, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, stack: [...stack], answer: [...answer], highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(temps) {
  const steps = []
  const n = temps.length
  const answer = new Array(n).fill(0)
  const stack = [], highlights = {}
  push(steps, `Daily Temperatures: temps=[${temps.join(',')}]. Monotonic stack: for each day, pop warmer days waiting in stack.`, stack, answer, {}, 0)

  for (let i = 0; i < n; i++) {
    highlights[i] = 'current'
    push(steps, `Day ${i}: T=${temps[i]}. Check if warmer than stack top.`, stack, answer, { ...highlights }, 2)
    while (stack.length > 0 && temps[i] > temps[stack[stack.length - 1]]) {
      const j = stack.pop()
      highlights[j] = 'match'
      answer[j] = i - j
      push(steps, `T[${i}]=${temps[i]} > T[${j}]=${temps[j]}: answer[${j}] = ${i}-${j} = ${i-j} days.`, stack, [...answer], { ...highlights }, 4)
    }
    stack.push(i)
    highlights[i] = 'compare'
    push(steps, `Push index ${i} (T=${temps[i]}) onto stack. Stack indices: [${stack.join(',')}].`, stack, answer, { ...highlights }, 6)
  }

  push(steps, `Done! Remaining in stack: [${stack.join(',')}] → their answer stays 0. answer=[${answer.join(',')}].`, stack, answer, { ...highlights }, 7, { answer: [...answer], done: true })
  return steps
}
