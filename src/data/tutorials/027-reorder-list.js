/**
 * Tutorial content for #027 — Reorder List
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a singly linked list L0 → L1 → … → Ln-1 → Ln, reorder it to: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → … You must do this in-place without altering node values — only the links may be changed.`,
    example: `Input:  1 → 2 → 3 → 4 → 5\n→ Take from front: 1, then from back: 5, then front: 2, back: 4, then: 3\n✅ Answer: 1 → 5 → 2 → 4 → 3`,
    keyInsight: `The pattern is always "one from the front, one from the back, repeat." This means you need access to both ends simultaneously — find the middle, reverse the second half, then merge the two halves together.`,
  },

  approaches: {
    'Find Middle + Reverse + Merge': {
      intuition: `Break the problem into three clean sub-steps: (1) find the middle of the list using slow/fast pointers, (2) reverse the second half, (3) interleave nodes from the first half and the reversed second half. Each step is a classic linked-list technique, and together they solve the problem in O(n) time and O(1) space.`,
      steps: [
        `Find the middle node using slow/fast pointers (slow moves 1, fast moves 2). When fast reaches the end, slow is at the middle.`,
        `Split the list: set slow.next = null to sever the first half from the second.`,
        `Reverse the second half in-place: use three pointers (prev, curr, next) to flip every link.`,
        `Now merge the two halves by alternating nodes: take one from list1, then one from list2, repeat until list2 is exhausted.`,
      ],
      example: `List: 1 → 2 → 3 → 4 → 5\n\nStep 1 — Find middle:\nslow/fast start at 1.\nslow=2,fast=3 → slow=3,fast=5. Middle = node 3.\n\nStep 2 — Split:\nFirst half: 1 → 2 → 3 (3.next = null)\nSecond half: 4 → 5\n\nStep 3 — Reverse second half:\n4 → 5  becomes  5 → 4\n\nStep 4 — Merge:\nl1=1, l2=5: insert 5 after 1 → 1 → 5 → 2 → 3\nl1=2, l2=4: insert 4 after 2 → 1 → 5 → 2 → 4 → 3\n✅ Answer: 1 → 5 → 2 → 4 → 3`,
      keyInsight: `O(n) time, O(1) space. This is the optimal in-place solution. The three-step decomposition (middle → reverse → merge) is a reusable pattern for many linked-list problems.`,
    },

    'Using ArrayList': {
      intuition: `Instead of manipulating links directly, collect all nodes into an array (ArrayList). Then use two index pointers — one from the front (lo) and one from the back (hi) — to rewire the links in the required order. The array gives you random access, making the two-pointer approach trivial.`,
      steps: [
        `Traverse the list and store every node in an array/list in order.`,
        `Initialise lo = 0, hi = array.length - 1.`,
        `While lo < hi: set array[lo].next = array[hi], then lo++.`,
        `If lo < hi (they haven't crossed): set array[hi].next = array[lo], then hi--.`,
        `After the loop, set array[lo].next = null to terminate the reordered list.`,
      ],
      example: `List: 1 → 2 → 3 → 4 → 5\nArray: [node1, node2, node3, node4, node5]\n\nlo=0, hi=4: node1.next = node5, lo=1\n             node5.next = node2, hi=3\nlo=1, hi=3: node2.next = node4, lo=2\n             node4.next = node3, hi=2\nlo=2, hi=2: loop ends (lo not < hi)\nnode3.next = null\n\nResult: 1 → 5 → 2 → 4 → 3 ✅`,
      keyInsight: `O(n) time, O(n) space. Simpler to code than the in-place approach because random access replaces tricky pointer manipulation. The trade-off is the extra O(n) memory for the array.`,
    },

    'Using Stack': {
      intuition: `Push all nodes onto a stack. The stack's LIFO order gives you the tail node on each pop. Walk a front pointer through the list, and for each step pop the tail from the stack and insert it right after the front node. Stop at the midpoint to avoid crossing over — when the front pointer reaches the node you just inserted.`,
      steps: [
        `Count the list length n. Push all nodes onto a stack.`,
        `Set curr = head. Loop n / 2 times:`,
        `  Pop last = stack.pop() (the tail).`,
        `  Save nxt = curr.next.`,
        `  curr.next = last; last.next = nxt.`,
        `  curr = nxt.`,
        `Set curr.next = null to terminate the reordered list.`,
      ],
      example: `List: 1 → 2 → 3 → 4 → 5  (n=5)\nStack (top→bottom): [5, 4, 3, 2, 1]\n\ni=0: pop 5, insert after 1 → 1→5→2→3→4, curr=2\ni=1: pop 4, insert after 2 → 1→5→2→4→3, curr=3\nLoop ends (n/2=2 iterations done).\ncurr.next = null → 1→5→2→4→3\n✅ Answer: 1→5→2→4→3`,
      keyInsight: `O(n) time, O(n) space for the stack. Conceptually clean — the stack naturally reverses access order so the tail is always on top. The explicit count guards against crossing pointers.`,
    },

    'Recursive': {
      intuition: `Use recursion to reach the end of the list, then on the unwinding phase link back from the tail inward. Keep a mutable "front" reference (class field) that advances from the head while the recursion unwinds from the tail. When the front and back pointers meet or cross, stop by setting the next pointer to null.`,
      steps: [
        `Store front = head as a class/instance field.`,
        `Define helper(node): recurse on node.next first; then on the return path, relink.`,
        `When helper unwinds back to a node: if front == node or front.next == node, set node.next = null and clear front — we're done.`,
        `Otherwise: save nxt = front.next; front.next = node; node.next = nxt; advance front = nxt.`,
        `Call helper(head.next) and the field updates handle the full reorder.`,
      ],
      example: `List: 1 → 2 → 3 → 4 → 5, front=1\n\nRecurse all the way → unwind from node 5:\nfront=1, node=5: nxt=2, 1.next=5, 5.next=2, front=2 → [1→5→2→3→4]\nUnwind to node 4:\nfront=2, node=4: nxt=3, 2.next=4, 4.next=3, front=3 → [1→5→2→4→3]\nUnwind to node 3:\nfront=3, node=3: front==node → 3.next=null, front=null → stop\n✅ Answer: 1→5→2→4→3`,
      keyInsight: `O(n) time, O(n) space for the recursion stack. Elegant but harder to read than the array approach. The mutable front reference is the key — it advances from the head while the stack unwinds from the tail.`,
    },

    'Iterative with Length Calculation': {
      intuition: `Compute the list length explicitly so you can find the exact midpoint without slow/fast pointer gymnastics. Walk length/2 steps to land precisely at the midpoint, sever the list there, reverse the second half, and then interleave the two halves. Identical in effect to the Find Middle + Reverse + Merge approach but uses counted iteration rather than the slow/fast trick.`,
      steps: [
        `Count length n by traversing the entire list.`,
        `Walk exactly n/2 steps from head to reach the midpoint; set mid.next = null.`,
        `Reverse the second half (originally starting at mid.next) in-place using prev/curr/nxt pointers.`,
        `Merge: alternate nodes from the first half and the reversed second half until the second half is exhausted.`,
      ],
      example: `List: 1 → 2 → 3 → 4 → 5  (length=5)\n\nStep 1: n/2=2, walk 2 steps → curr=3 (midpoint)\nSplit: first=1→2→3, second=4→5\n\nStep 2: reverse second → 5→4\n\nStep 3: merge:\n  l1=1,l2=5: 1→5→2→3, l1=2,l2=4\n  l1=2,l2=4: 1→5→2→4→3, l1=3,l2=null\n  l2 exhausted → done\n✅ Answer: 1→5→2→4→3`,
      keyInsight: `O(n) time, O(1) space. Functionally identical to Find Middle + Reverse + Merge but replaces the slow/fast pointer with an explicit length count — marginally simpler to verify correctness of the midpoint calculation.`,
    },
  },
}
