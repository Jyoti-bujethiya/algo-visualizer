/**
 * Tutorial content for #077 — Min Stack
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Design a stack that supports push, pop, top, and retrieving the minimum element — all in O(1) time. The tricky part: getMin must still work correctly after pops, because the minimum might change when elements are removed.`,
    example: `push(-2) → stack: [-2],  min: -2\npush(0)  → stack: [-2,0], min: -2\npush(-3) → stack: [-2,0,-3], min: -3\ngetMin   → -3\npop      → stack: [-2,0], min: -2\ngetMin   → -2\n✅ Answer: -3, then -2`,
    keyInsight: `The challenge is that a single variable tracking the minimum breaks when you pop the current minimum. You need to either store the minimum at every level or encode "what was the min before this push" alongside each element.`,
  },

  approaches: {
    'Two Stacks': {
      intuition: `Maintain two stacks in parallel: the main stack stores all values as normal, and a second "min stack" stores the current minimum at the time each element was pushed.\n\nWhen you push a value, also push the new minimum (min of the value and whatever is currently on top of the min stack) onto the min stack.\n\nWhen you pop, pop both stacks together. The top of the min stack is always the current minimum.`,
      steps: [
        `Maintain stack (normal) and minStack.`,
        `push(val): push val to stack; push min(val, minStack.top or val) to minStack.`,
        `pop(): pop from both stack and minStack.`,
        `top(): return stack.top.`,
        `getMin(): return minStack.top.`,
      ],
      example: `push(-2): stack:[-2]       minStack:[-2]\npush(0):  stack:[-2,0]     minStack:[-2,-2]\npush(-3): stack:[-2,0,-3]  minStack:[-2,-2,-3]\ngetMin → minStack.top = -3 ✅\npop:      stack:[-2,0]     minStack:[-2,-2]\ngetMin → minStack.top = -2 ✅`,
      keyInsight: `O(1) for all operations, O(n) extra space. The minStack mirrors every push and pop, so the minimum is always instantly available at the top.`,
    },

    'Single Stack of (value, currentMin) Pairs': {
      intuition: `Instead of a second stack, each entry in the single stack is a pair: (the pushed value, the minimum at the time of this push). This bundles the snapshot of the minimum with every element, so pops automatically restore the previous minimum.`,
      steps: [
        `Each node on the stack stores a pair: (value, minSoFar).`,
        `push(val): minSoFar = min(val, stack.top.minSoFar if non-empty else val); push (val, minSoFar).`,
        `pop(): remove the top pair.`,
        `top(): return stack.top.value.`,
        `getMin(): return stack.top.minSoFar.`,
      ],
      example: `push(-2): push (-2, -2)  → stack: [(-2,-2)]\npush(0):  push (0, -2)   → stack: [(-2,-2),(0,-2)]\npush(-3): push (-3, -3)  → stack: [(-2,-2),(0,-2),(-3,-3)]\ngetMin → top.minSoFar = -3 ✅\npop  → stack: [(-2,-2),(0,-2)]\ngetMin → top.minSoFar = -2 ✅`,
      keyInsight: `O(1) for all operations, O(n) space. One data structure instead of two — slightly simpler to reason about when used as a custom linked list or object node.`,
    },

    'Delta Encoding': {
      intuition: `Save space by storing the DIFFERENCE (delta) between the pushed value and the current minimum, rather than the value itself. The minimum is stored separately as one variable.\n\nIf delta ≤ 0, the newly pushed value is the new minimum and we can recover it as min - delta on pop.`,
      steps: [
        `Keep one variable min (the current global minimum).`,
        `push(val): compute delta = val - min. If delta < 0, update min = val. Push delta.`,
        `top(): if stack.top ≤ 0, return min; else return min + stack.top.`,
        `getMin(): return min.`,
        `pop(): if stack.top ≤ 0, the element being popped WAS the min; restore min = min - stack.top. Then pop.`,
      ],
      example: `push(-2): min=-2, delta=-2-0=-2 → push -2. min=-2\npush(0):  delta=0-(-2)=2  → push 2.  min=-2\npush(-3): delta=-3-(-2)=-1 → push -1. min=-3\ngetMin → -3 ✅\npop: top=-1 ≤ 0 → restore min = -3-(-1) = -2. pop.\ngetMin → -2 ✅`,
      keyInsight: `O(1) all operations, O(n) stack entries but each stores only one integer (no pairs). Clever space optimization, but the encoding logic is tricky under interview pressure — understand it before using it.`,
    },

    'Vector-Based (ArrayList)': {
      intuition: `Use an ArrayList (dynamic array) as the backing store for both the main values and the minimums. This is functionally the same as the Two Stacks approach, just using arrays instead of stack objects — useful in languages without a built-in Stack class.`,
      steps: [
        `Maintain ArrayList<Integer> data and ArrayList<Integer> mins.`,
        `push(val): add val to data; add min(val, last element of mins if non-empty else val) to mins.`,
        `pop(): remove last element from both data and mins.`,
        `top(): return last element of data.`,
        `getMin(): return last element of mins.`,
      ],
      example: `push(5):  data:[5]    mins:[5]\npush(3):  data:[5,3]  mins:[5,3]\npush(7):  data:[5,3,7] mins:[5,3,3]\ngetMin → mins.last = 3 ✅\npop:      data:[5,3]  mins:[5,3]\ngetMin → 3 ✅`,
      keyInsight: `O(1) amortized for all operations, O(n) space. Behaviorally identical to Two Stacks — the difference is purely implementation detail (arrays vs. stack objects).`,
    },

    'Linked List Node-Based': {
      intuition: `Implement the stack as a singly linked list where each node stores the value AND the minimum at the time it was pushed. The head of the list is the top of the stack. No built-in Stack or ArrayList needed — just Node objects.`,
      steps: [
        `Define a Node class with fields: val, min, next.`,
        `push(val): create new Node. new.min = min(val, head.min if head exists else val). Point new.next = head. head = new.`,
        `pop(): head = head.next.`,
        `top(): return head.val.`,
        `getMin(): return head.min.`,
      ],
      example: `push(-2): node(-2, min=-2) → head → null\npush(0):  node(0,  min=-2) → node(-2,-2) → null\npush(-3): node(-3, min=-3) → node(0,-2)  → node(-2,-2) → null\ngetMin → head.min = -3 ✅\npop: head = head.next → node(0,-2) at head\ngetMin → head.min = -2 ✅`,
      keyInsight: `O(1) for all operations, O(n) space. This is the "from scratch" implementation — no library classes used. Shows you understand how a stack actually works at the pointer level.`,
    },
  },
}
