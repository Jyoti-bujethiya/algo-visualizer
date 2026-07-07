/**
 * Tutorial content for #081 — Implement Queue Using Stacks
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Implement a first-in, first-out (FIFO) queue using only two stacks. The queue must support push (add to back), pop (remove from front), peek (see the front), and empty. You may only use standard stack operations: push to top, pop from top, peek at top, isEmpty.`,
    example: `push(1) → queue: [1]\npush(2) → queue: [1, 2]\npeek    → 1  (front of queue)\npop     → 1  (remove front)\nempty   → false (2 is still there)\n✅ Answer: peek=1, pop=1, empty=false`,
    keyInsight: `A stack is LIFO, a queue is FIFO. If you pour stack1 into stack2, the order reverses — making stack2 a queue. The trick is knowing WHEN to pour: lazily (only when stack2 is empty) gives O(1) amortized.`,
  },

  approaches: {
    'Two Stacks — Lazy Transfer (Amortized O(1))': {
      intuition: `Keep two stacks: an "inbox" for pushes and an "outbox" for pops/peeks.\n\nPush always goes to the inbox. Pop/peek only transfers elements when the outbox is empty — pour everything from inbox into outbox (reversing the order), then operate on outbox.\n\nEach element is moved at most once, so the total work across all operations is O(n) → amortized O(1) per operation.`,
      steps: [
        `push(val): push val onto inbox.`,
        `Helper transfer(): if outbox is empty, pop all from inbox and push each onto outbox.`,
        `pop(): call transfer(); return outbox.pop().`,
        `peek(): call transfer(); return outbox.top.`,
        `empty(): return inbox.isEmpty() && outbox.isEmpty().`,
      ],
      example: `push(1): inbox:[1]      outbox:[]\npush(2): inbox:[1,2]    outbox:[]\npush(3): inbox:[1,2,3]  outbox:[]\n\npeek():\n  outbox empty → transfer: pop 3,2,1 from inbox → push to outbox\n  inbox:[]     outbox:[3,2,1]  (1 is on top)\n  return outbox.top = 1 ✅\n\npop():\n  outbox not empty → no transfer\n  return outbox.pop() = 1\n  outbox:[3,2]\n\npush(4): inbox:[4]  outbox:[3,2]\npop():\n  outbox not empty → return 2. outbox:[3]\npop():\n  outbox not empty → return 3. outbox:[]\npop():\n  outbox empty → transfer: inbox→outbox: [4]\n  return 4 ✅`,
      keyInsight: `push is O(1). pop/peek are O(1) amortized (O(n) worst-case but each element moves only once ever). This is the standard interview answer — it is what the problem is testing.`,
    },

    'Two Stacks — Eager Transfer (O(n) push, O(1) pop)': {
      intuition: `An alternative design: every push immediately re-sorts the stacks so that the queue front is always on top of stack1. To push a new element, move everything from stack1 to stack2, push the new element to stack1, then move everything back.\n\nNow pop/peek are always O(1) because stack1's top is always the queue's front — but push costs O(n).`,
      steps: [
        `push(val):`,
        `  Move all elements from stack1 to stack2.`,
        `  Push val onto stack1 (it's now at the bottom of the queue order).`,
        `  Move all elements back from stack2 to stack1.`,
        `pop(): return stack1.pop().`,
        `peek(): return stack1.top.`,
        `empty(): return stack1.isEmpty().`,
      ],
      example: `push(1): stack1:[1]    stack2:[]\npush(2): move 1 to stack2 → push 2 → move back\n  stack1:[2,1]  (1 on top = queue front) stack2:[]\npush(3): move 2,1 to stack2 → push 3 → move back\n  stack1:[3,2,1] (1 on top) stack2:[]\npeek() → stack1.top = 1 ✅\npop()  → stack1.pop() = 1. stack1:[3,2] ✅`,
      keyInsight: `push is O(n), pop/peek are O(1). Compare to the Lazy approach where push is O(1) and pop/peek are O(1) amortized — Lazy is superior overall. This variant is shown for completeness.`,
    },

    'ArrayDeque direct (O(1) all ops)': {
      intuition: `Use Java's ArrayDeque directly as a queue — no stack simulation at all. addLast enqueues to the back (FIFO order), removeFirst dequeues from the front. All operations are O(1). This is the natural queue implementation, shown here as a contrast to the stack-based approaches and to highlight that the "simulate queue with stacks" problem is a constraint puzzle, not the real-world solution.`,
      steps: [
        `Wrap a single ArrayDeque<Integer>.`,
        `push(val): dq.addLast(val) — add to the rear.`,
        `pop(): dq.removeFirst() — remove from the front.`,
        `peek(): dq.peekFirst() — look at the front without removing.`,
        `empty(): dq.isEmpty().`,
      ],
      example: `push(1): dq=[1]\npush(2): dq=[1,2]\npeek(): dq.peekFirst() = 1 ✅  (front of queue)\npop():  dq.removeFirst() = 1. dq=[2] ✅\nempty(): false (2 remains) ✅`,
      keyInsight: `O(1) for all operations, O(n) space. This is the real-world correct queue implementation in Java. It is NOT a valid answer to the LeetCode problem (which mandates using only stacks), but it is useful as a reference point to understand what the stack-simulation approaches are approximating.`,
    },
  },
}
