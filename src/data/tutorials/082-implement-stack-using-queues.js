/**
 * Tutorial content for #082 — Implement Stack Using Queues
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Implement a last-in, first-out (LIFO) stack using only queues. The stack must support push, pop, top, and empty. You may only use standard queue operations: add to back, remove from front, peek at front, size, isEmpty.`,
    example: `push(1) → stack: [1]\npush(2) → stack: [1, 2]  (2 is top)\ntop     → 2\npop     → 2\nempty   → false (1 remains)\n✅ Answer: top=2, pop=2, empty=false`,
    keyInsight: `A queue gives you elements in FIFO order; you need LIFO. The trick: after pushing a new element to the back of the queue, rotate all previously enqueued elements to the back — now the newest element is at the front, giving stack (LIFO) order.`,
  },

  approaches: {
    'Two Queues — O(n) push, O(1) pop': {
      intuition: `Maintain two queues, q1 (main) and q2 (helper). On every push:\n1. Enqueue the new value into q2.\n2. Drain all of q1 into q2 (so the new value is now at the front order).\n3. Swap q1 and q2.\n\nNow q1's front is always the most recently pushed element, making pop/top O(1).`,
      steps: [
        `push(val): enqueue val into q2.`,
        `  While q1 is not empty: dequeue from q1 and enqueue into q2.`,
        `  Swap q1 and q2 (q2 becomes the new q1, q1 is now empty).`,
        `pop(): dequeue from q1.`,
        `top(): peek at q1's front.`,
        `empty(): return q1.isEmpty().`,
      ],
      example: `push(1): q2←1. q1 empty, skip drain. swap → q1:[1] q2:[]\npush(2): q2←2. drain q1: q2←1. swap → q1:[2,1] q2:[]\n  (2 is at front = top of stack)\npush(3): q2←3. drain q1: q2←2,1. swap → q1:[3,2,1] q2:[]\ntop() → q1.front = 3 ✅\npop() → dequeue 3. q1:[2,1]\npop() → dequeue 2. q1:[1]\npop() → dequeue 1. q1:[] ✅`,
      keyInsight: `push is O(n), pop/top/empty are O(1). For workloads with many pops and few pushes this is efficient. The two-queue design is the classic "textbook" version of this problem.`,
    },

    'One Queue — O(n) push, O(1) pop': {
      intuition: `You don't actually need two queues. After pushing a new element to the back of the single queue, rotate all PREVIOUS elements to the back — i.e., dequeue and re-enqueue (size - 1) elements. Now the new element is at the front.\n\nThis is cleaner and uses half the memory.`,
      steps: [
        `push(val): enqueue val to the back of q.`,
        `  Rotate: repeat (q.size - 1) times: dequeue from front, enqueue to back.`,
        `  Now the newly pushed element is at the front.`,
        `pop(): dequeue from q.`,
        `top(): peek at q's front.`,
        `empty(): return q.isEmpty().`,
      ],
      example: `push(1): q←1. rotate 0 times. q:[1]\npush(2): q←2. q:[1,2]. rotate 1 time: dequeue 1, enqueue 1. q:[2,1]\n  (2 is at front = top)\npush(3): q←3. q:[2,1,3]. rotate 2 times:\n  dequeue 2, enqueue 2 → q:[1,3,2]\n  dequeue 1, enqueue 1 → q:[3,2,1]\n  (3 is now at front = top)\ntop() → q.front = 3 ✅\npop() → dequeue 3. q:[2,1]\npop() → dequeue 2. q:[1] ✅`,
      keyInsight: `push is O(n), pop/top/empty are O(1). Exactly the same complexity as the Two Queues approach but uses only one data structure. This is the preferred solution in most implementations.`,
    },

    'ArrayDeque with Rotation (O(n) push, O(1) pop)': {
      intuition: `Use a single ArrayDeque but exploit its addFirst (prepend) method. Every push goes to the front of the deque, so the most recently pushed element is always at the front — exactly the LIFO (stack) behaviour needed. pop and top simply read or remove from the front. This approach uses O(1) per push but relies on a data structure that supports efficient front-insertion.`,
      steps: [
        `Wrap a single ArrayDeque<Integer> dq.`,
        `push(val): dq.addFirst(val) — prepend to the front so the new element is immediately the top.`,
        `pop(): dq.removeFirst() — remove and return the top (front).`,
        `top(): dq.peekFirst() — peek at the top (front).`,
        `empty(): dq.isEmpty().`,
      ],
      example: `push(1): dq=[1]  (1 is at front = top)\npush(2): dq=[2,1]  (2 prepended = new top)\npush(3): dq=[3,2,1]  (3 prepended = new top)\ntop(): dq.peekFirst() = 3 ✅\npop(): dq.removeFirst() = 3. dq=[2,1] ✅\npop(): dq.removeFirst() = 2. dq=[1] ✅`,
      keyInsight: `O(1) push/pop/top/empty, O(n) space. Since ArrayDeque supports O(1) addFirst, this is actually more efficient than the one-queue rotation approach. The "rotation" in the name refers to the conceptual idea — in practice addFirst replaces the rotation.`,
    },
  },
}
