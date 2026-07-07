// 083 — Design Circular Queue · steps.js
// Fixed-size ring buffer: head/tail pointers, count tracking

// line indices:
// 0: class MyCircularQueue(k):
// 1:   buf=[k slots]; head=0; tail=0; count=0
// 2:   function enQueue(val):
// 3:     if isFull: return false
// 4:     buf[tail] = val; tail=(tail+1)%k; count++
// 5:   function deQueue():
// 6:     if isEmpty: return false
// 7:     head=(head+1)%k; count--
// 8:   function Front(): buf[head] if !empty
// 9:   function Rear(): buf[(tail-1+k)%k] if !empty
// 10:  function isEmpty(): count==0
// 11:  function isFull(): count==k

function step(steps, desc, buf, head, tail, count, codeLineIndex, extra = {}) {
  steps.push({ description: desc, buf: [...buf], head, tail, count, codeLineIndex, ...extra })
}

export function generateSteps(k, ops) {
  const steps = []
  const buf = new Array(k).fill(null)
  let head = 0, tail = 0, count = 0

  step(steps, `Design Circular Queue: capacity k=${k}. Ring buffer with head/tail pointers and a count.`, buf, head, tail, count, 0)

  for (const [op, val] of ops) {
    if (op === 'enQueue') {
      if (count === k) {
        step(steps, `enQueue(${val}): FULL — return false.`, buf, head, tail, count, 3, { op, val, result: false })
      } else {
        buf[tail] = val
        const oldTail = tail
        tail = (tail + 1) % k
        count++
        step(steps, `enQueue(${val}): write to buf[${oldTail}], tail→${tail}, count=${count}.`, buf, head, tail, count, 4, { op, val, result: true })
      }
    } else if (op === 'deQueue') {
      if (count === 0) {
        step(steps, `deQueue(): EMPTY — return false.`, buf, head, tail, count, 6, { op, result: false })
      } else {
        buf[head] = null
        head = (head + 1) % k
        count--
        step(steps, `deQueue(): clear old head, head→${head}, count=${count}.`, buf, head, tail, count, 7, { op, result: true })
      }
    } else if (op === 'Front') {
      const result = count === 0 ? -1 : buf[head]
      step(steps, `Front() = ${result}.`, buf, head, tail, count, 8, { op, result })
    } else if (op === 'Rear') {
      const result = count === 0 ? -1 : buf[(tail - 1 + k) % k]
      step(steps, `Rear() = ${result}.`, buf, head, tail, count, 9, { op, result })
    } else if (op === 'isEmpty') {
      step(steps, `isEmpty() = ${count === 0}.`, buf, head, tail, count, 10, { op, result: count === 0 })
    } else if (op === 'isFull') {
      step(steps, `isFull() = ${count === k}.`, buf, head, tail, count, 11, { op, result: count === k })
    }
  }
  step(steps, 'All operations complete.', buf, head, tail, count, 11, { done: true })
  return steps
}
