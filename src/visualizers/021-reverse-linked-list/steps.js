// 021 — Reverse Linked List · steps.js

const _PL021 = {'init': 0, 'save-next': 1, 'reverse': 2, 'advance': 3, 'complete': 5}

function makeList(arr) {
  return arr.map((val, i) => ({ val, id: i }))
}

function push(steps, desc, nodes, highlights, extra = {}) {
  steps.push({ description: desc, nodes: nodes.map(n => ({ ...n })), highlights: { ...highlights }, codeLineIndex: extra.codeLineIndex ?? (_PL021[extra.phase] ?? -1), ...extra })
}

function genIterative(arr) {
  const steps = []
  const nodes = makeList(arr)
  const hl = {}

  push(steps, 'Use three pointers — prev, curr, and next — to reverse each link one at a time as we walk forward through the list.', nodes, hl)

  let prev = -1, curr = 0

  push(steps, 'Start with prev pointing at nothing (null) and curr at the head of the list.', nodes, { [curr]: 'current' }, { prev, curr, phase: 'init' })

  while (curr !== -1) {
    const nextNode = curr + 1 < nodes.length ? curr + 1 : -1
    push(steps,
      `Save the next pointer before we overwrite it: next = node ${nextNode === -1 ? 'null' : nodes[nextNode].val}.`,
      nodes,
      { ...(prev !== -1 ? { [prev]: 'compare' } : {}), [curr]: 'current', ...(nextNode !== -1 ? { [nextNode]: 'special' } : {}) },
      { prev, curr, next: nextNode, phase: 'save-next' })

    push(steps,
      `Reverse the link: make node ${nodes[curr].val}'s pointer point back to ${prev === -1 ? 'null' : 'node ' + nodes[prev].val}.`,
      nodes,
      { ...(prev !== -1 ? { [prev]: 'match' } : {}), [curr]: 'current', ...(nextNode !== -1 ? { [nextNode]: 'special' } : {}) },
      { prev, curr, next: nextNode, phase: 'reverse' })

    prev = curr
    curr = nextNode
    if (curr !== -1) {
      push(steps,
        `Advance: prev moves to node ${nodes[prev].val}, curr moves to node ${nodes[curr].val}.`,
        nodes,
        { [prev]: 'compare', [curr]: 'current' },
        { prev, curr, phase: 'advance' })
    }
  }

  push(steps,
    `All links reversed! The new head is node ${nodes[prev].val}. The list now reads: ${[...arr].reverse().join(' → ')}.`,
    nodes,
    Object.fromEntries(nodes.map((n, i) => [i, 'match'])),
    { prev, curr: -1, phase: 'complete' })

  return steps
}

function genRecursive(arr) {
  const steps = []
  const nodes = makeList(arr)

  push(steps, 'Recurse all the way to the tail. On the way back up, reverse each link — each node points back to its caller.', nodes, {})

  const callStack = []

  function recurse(i) {
    callStack.push(i)
    push(steps,
      `Recursing into node ${nodes[i].val}. Call depth: ${callStack.length}. ${i === nodes.length - 1 ? 'This is the tail — it becomes the new head.' : 'Keep going deeper.'}`,
      nodes,
      { [i]: i === nodes.length - 1 ? 'match' : 'current' },
      { callDepth: callStack.length, phase: i === nodes.length - 1 ? 'base' : 'recurse' })

    if (i === nodes.length - 1) {
      callStack.pop()
      return
    }

    recurse(i + 1)

    push(steps,
      `Back at node ${nodes[i].val}. Reversing: make node ${nodes[i + 1].val} point back to node ${nodes[i].val}.`,
      nodes,
      { [i]: 'compare', [i + 1]: 'current' },
      { phase: 'unwind' })

    callStack.pop()
  }

  recurse(0)

  push(steps,
    `Recursion complete. The new head is node ${nodes[nodes.length - 1].val}. Reversed: ${[...arr].reverse().join(' → ')}.`,
    nodes,
    Object.fromEntries(nodes.map((_, i) => [i, 'match'])),
    { phase: 'complete' })

  return steps
}

function genStack(arr) {
  const steps = []
  const nodes = makeList(arr)

  push(steps, 'Push all node values onto a stack, then pop them off to rebuild the list in reverse order.', nodes, {})

  const stack = []
  for (let i = 0; i < nodes.length; i++) {
    stack.push(nodes[i].val)
    push(steps,
      `Push node ${nodes[i].val} onto the stack. Stack is now: [${stack.join(', ')}].`,
      nodes,
      { [i]: 'current' },
      { stack: [...stack], phase: 'push' })
  }

  push(steps, 'All values pushed. Now pop them one by one to reconstruct the list in reverse.', nodes, {}, { stack: [...stack] })

  const reversed = []
  while (stack.length) {
    const v = stack.pop()
    reversed.push(v)
    push(steps,
      `Popped ${v}. Reversed list so far: ${reversed.join(' → ')}.`,
      nodes,
      {},
      { stack: [...stack], reversed: [...reversed], phase: 'pop' })
  }

  push(steps,
    `Done! Reversed list: ${reversed.join(' → ')}.`,
    nodes,
    Object.fromEntries(nodes.map((_, i) => [i, 'match'])),
    { reversed, phase: 'complete' })

  return steps
}

export function generateSteps(algo, arr) {
  if (algo === 'recursive') return genRecursive(arr)
  if (algo === 'stack')     return genStack(arr)
  return genIterative(arr)
}
