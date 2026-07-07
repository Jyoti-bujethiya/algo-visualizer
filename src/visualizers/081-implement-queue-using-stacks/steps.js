// 081 — Implement Queue using Stacks · steps.js
// Two stacks: inbox (push) + outbox (pop/peek)
// On pop/peek if outbox empty, transfer all of inbox → outbox

// line indices:
// 0: class MyQueue:
// 1:   inbox=[]; outbox=[]
// 2:   function push(x): inbox.push(x)
// 3:   function transfer(): while inbox: outbox.push(inbox.pop())
// 4:   function pop():
// 5:     if outbox empty: transfer()
// 6:     return outbox.pop()
// 7:   function peek():
// 8:     if outbox empty: transfer()
// 9:     return outbox.top
// 10:  function empty(): return inbox.empty and outbox.empty

function step(steps, desc, inbox, outbox, codeLineIndex, extra = {}) {
  steps.push({ description: desc, inbox: [...inbox], outbox: [...outbox], codeLineIndex, ...extra })
}

export function generateSteps(ops) {
  const steps = []
  const inbox = [], outbox = []
  step(steps, 'Queue using 2 Stacks: inbox receives pushes; outbox serves pops/peeks. Transfer happens lazily.', inbox, outbox, 0)

  for (const [op, val] of ops) {
    if (op === 'push') {
      inbox.push(val)
      step(steps, `push(${val}): add to inbox. inbox=[${inbox.join(',')}], outbox=[${outbox.join(',')}].`, inbox, outbox, 2, { op, val })
    } else if (op === 'pop' || op === 'peek') {
      if (outbox.length === 0) {
        step(steps, `${op}(): outbox empty — transferring inbox → outbox.`, inbox, outbox, op === 'pop' ? 5 : 8)
        while (inbox.length > 0) {
          outbox.push(inbox.pop())
          step(steps, `  Transfer: inbox=[${inbox.join(',')}], outbox=[${outbox.join(',')}].`, inbox, outbox, 3)
        }
      }
      const result = op === 'pop' ? outbox.pop() : outbox[outbox.length - 1]
      step(steps, `${op}() = ${result}. inbox=[${inbox.join(',')}], outbox=[${outbox.join(',')}].`, inbox, outbox, op === 'pop' ? 6 : 9, { op, result })
    } else if (op === 'empty') {
      const result = inbox.length === 0 && outbox.length === 0
      step(steps, `empty() = ${result}. inbox=[${inbox.join(',')}], outbox=[${outbox.join(',')}].`, inbox, outbox, 10, { op, result })
    }
  }
  step(steps, 'All operations complete.', inbox, outbox, 10, { done: true })
  return steps
}
