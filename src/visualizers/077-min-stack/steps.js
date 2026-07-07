// 077 — Min Stack · steps.js
// Two stacks: main stack + min-stack tracking minimum at each level

// line indices:
// 0: class MinStack:
// 1:   stack=[]; minStack=[]
// 2:   function push(val):
// 3:     stack.push(val)
// 4:     minStack.push(min(val, minStack.top ?? val))
// 5:   function pop():
// 6:     stack.pop(); minStack.pop()
// 7:   function top(): return stack.top
// 8:   function getMin(): return minStack.top

function step(steps, desc, stack, minStack, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, stack: [...stack], minStack: [...minStack], highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(ops) {
  const steps = []
  const stack = [], minStack = [], highlights = {}
  step(steps, 'MinStack: maintain a secondary minStack that always has the current minimum at its top.', stack, minStack, {}, 0)

  for (const [op, val] of ops) {
    if (op === 'push') {
      const newMin = minStack.length === 0 ? val : Math.min(val, minStack[minStack.length - 1])
      highlights['push'] = 'current'
      step(steps, `push(${val}): push ${val} to stack, push min(${val}, ${minStack.length > 0 ? minStack[minStack.length-1] : val})=${newMin} to minStack.`, stack, minStack, { ...highlights }, 3)
      stack.push(val); minStack.push(newMin)
      highlights['push'] = 'match'
      step(steps, `After push(${val}): stack=[${stack.join(',')}], minStack=[${minStack.join(',')}], min=${newMin}.`, stack, minStack, { ...highlights }, 4, { currentMin: newMin })
    } else if (op === 'pop') {
      highlights['pop'] = 'current'
      const topVal = stack[stack.length - 1]
      step(steps, `pop(): remove top=${topVal} from both stacks.`, stack, minStack, { ...highlights }, 5)
      stack.pop(); minStack.pop()
      highlights['pop'] = 'match'
      const curMin = minStack.length > 0 ? minStack[minStack.length - 1] : null
      step(steps, `After pop: stack=[${stack.join(',')}], minStack=[${minStack.join(',')}].${curMin !== null ? ` min=${curMin}` : ''}`, stack, minStack, { ...highlights }, 6, { currentMin: curMin })
    } else if (op === 'top') {
      const topVal = stack.length > 0 ? stack[stack.length - 1] : null
      highlights['top'] = 'compare'
      step(steps, `top() = ${topVal}.`, stack, minStack, { ...highlights }, 7, { topVal })
      highlights['top'] = ''
    } else if (op === 'getMin') {
      const curMin = minStack.length > 0 ? minStack[minStack.length - 1] : null
      highlights['getMin'] = 'special'
      step(steps, `getMin() = ${curMin}.`, stack, minStack, { ...highlights }, 8, { currentMin: curMin })
      highlights['getMin'] = ''
    }
  }

  step(steps, 'All operations complete.', stack, minStack, { ...highlights }, 8, { done: true })
  return steps
}
