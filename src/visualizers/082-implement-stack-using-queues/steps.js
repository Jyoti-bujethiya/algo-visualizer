// 082 — Implement Stack using Queues · steps.js
// One queue; on push(x): enqueue x then rotate all previous elements to back
// so x ends up at the front

// line indices:
// 0: class MyStack:
// 1:   queue=[]
// 2:   function push(x):
// 3:     queue.enqueue(x)
// 4:     for i = 0 to size-2: queue.enqueue(queue.dequeue())
// 5:   function pop(): return queue.dequeue()
// 6:   function top(): return queue.front
// 7:   function empty(): return queue.empty

function step(steps, desc, queue, codeLineIndex, extra = {}) {
  steps.push({ description: desc, queue: [...queue], codeLineIndex, ...extra })
}

export function generateSteps(ops) {
  const steps = []
  const queue = []
  step(steps, 'Stack using 1 Queue: after each push(x), rotate the queue so x is at the front — making pop/top O(1).', queue, 0)

  for (const [op, val] of ops) {
    if (op === 'push') {
      queue.push(val)
      step(steps, `push(${val}): enqueue ${val}. queue=[${queue.join(',')}]. Now rotate ${queue.length - 1} elements to put ${val} at front.`, queue, 3)
      const rotations = queue.length - 1
      for (let i = 0; i < rotations; i++) {
        const front = queue.shift()
        queue.push(front)
        step(steps, `  Rotate: move ${front} to back. queue=[${queue.join(',')}].`, queue, 4)
      }
      step(steps, `push(${val}) done. queue=[${queue.join(',')}] (front=${queue[0]} is stack top).`, queue, 4, { op, val })
    } else if (op === 'pop') {
      const result = queue.shift()
      step(steps, `pop() = ${result}. queue=[${queue.join(',')}].`, queue, 5, { op, result })
    } else if (op === 'top') {
      const result = queue[0]
      step(steps, `top() = ${result}. queue unchanged=[${queue.join(',')}].`, queue, 6, { op, result })
    } else if (op === 'empty') {
      const result = queue.length === 0
      step(steps, `empty() = ${result}.`, queue, 7, { op, result })
    }
  }
  step(steps, 'All operations complete.', queue, 7, { done: true })
  return steps
}
