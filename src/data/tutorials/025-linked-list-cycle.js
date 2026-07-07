/**
 * Tutorial content for #025 — Linked List Cycle
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given the head of a linked list, determine if the list contains a cycle (a node whose next pointer points back to a previously visited node, creating a loop). Return true if a cycle exists, false otherwise.`,
    example: `3→2→0→-4→(back to 2)\n→ -4 points back to 2, forming a cycle\n✅ Answer: true\n\n1→2→null → no cycle\n✅ Answer: false`,
    keyInsight: `Floyd's Cycle Detection: if two runners move at different speeds in a cycle, the faster one will eventually lap the slower one and they'll meet. If there's no cycle, the fast runner will reach the end.`,
  },

  approaches: {
    "Floyd's Variant (Different Starting Points)": {
      intuition: `A minor variation of Floyd's algorithm: start fast one node ahead of slow instead of at the same node. This avoids the initial slow==fast equality at the very first step (before any movement), which can simplify the loop condition in some implementations. The mathematical guarantee of meeting inside any cycle still holds.`,
      steps: [
        `If head is null or head.next is null: return false.`,
        `Initialize slow = head, fast = head.next (fast starts one step ahead).`,
        `While slow != fast:`,
        `  If fast is null OR fast.next is null: return false (no cycle).`,
        `  slow = slow.next (one step); fast = fast.next.next (two steps).`,
        `Return true (they met — cycle exists).`,
      ],
      example: `list: 3→2→0→-4→(back to 2)\n\nStart: slow=3, fast=2 (already different — skip initial equality check)\nStep 1: slow=2, fast=-4\nStep 2: slow=0, fast=0  (fast: -4→2→0)\n  slow == fast → ✅ return true\n\nlist: 1→2→null\nStart: slow=1, fast=2\nStep 1: fast.next=null → loop exits → ✅ return false`,
      keyInsight: `O(n) time, O(1) space — identical complexity to standard Floyd's. The offset start avoids the trivial initial equality (both at head) so the while condition can be written without a do-while construct.`,
    },

    "Floyd's Cycle Detection (Two Pointers)": {
      intuition: `Use two pointers: slow moves one step at a time, fast moves two steps at a time. If there is a cycle, fast will eventually "lap" slow and they'll point to the same node. If there's no cycle, fast will reach null and we return false.`,
      steps: [
        `Initialize slow = head, fast = head.`,
        `While fast is not null AND fast.next is not null:`,
        `  slow = slow.next (one step).`,
        `  fast = fast.next.next (two steps).`,
        `  If slow == fast: return true (cycle detected).`,
        `Return false (fast reached the end — no cycle).`,
      ],
      example: `list: 3→2→0→-4→(back to 2)\n\nStart: slow=3, fast=3\nStep 1: slow=2, fast=0\nStep 2: slow=0, fast=2  (fast: 0→-4→2)\nStep 3: slow=-4, fast=-4  (slow: 0→-4, fast: 2→0→-4)\n  slow == fast → ✅ return true\n\nlist: 1→2→null\nStep 1: slow=2, fast=null → loop ends → ✅ return false`,
      keyInsight: `O(n) time, O(1) space. The mathematical guarantee: in a cycle of length c, fast gains 1 step per iteration on slow, so they meet within c iterations after slow enters the cycle. The gold-standard cycle detection algorithm.`,
    },

    'Hash Set': {
      intuition: `Visit each node and record it in a hash set. If you ever visit a node that's already in the set, you've found the cycle. If you reach null without any repeats, there's no cycle. Simple and straightforward but uses extra memory.`,
      steps: [
        `Create an empty HashSet of nodes.`,
        `Set curr = head.`,
        `While curr is not null:`,
        `  If curr is already in the set: return true (we've seen this node before — cycle!).`,
        `  Add curr to the set.`,
        `  curr = curr.next.`,
        `Return false (reached end without revisiting any node).`,
      ],
      example: `list: 3→2→0→-4→(back to 2)\n\nVisit 3: set={3}\nVisit 2: set={3,2}\nVisit 0: set={3,2,0}\nVisit -4: set={3,2,0,-4}\nVisit 2: already in set! → ✅ return true\n\nlist: 1→2→null\nVisit 1: set={1}\nVisit 2: set={1,2}\nVisit null → loop ends → ✅ return false`,
      keyInsight: `O(n) time, O(n) space (stores all visited nodes). Easy to understand and explain. The tradeoff versus Floyd's: uses O(n) memory instead of O(1), but conceptually simpler.`,
    },

    'Node Modification (Destructive)': {
      intuition: `Destructively mark each visited node by replacing its value with a special sentinel (like Integer.MIN_VALUE) or setting its next pointer to a unique sentinel node. If you ever visit a node that's already marked, there's a cycle. Warning: this permanently modifies the list — acceptable only when the problem explicitly allows it.`,
      steps: [
        `Create a unique sentinel node: sentinel = new ListNode(Integer.MIN_VALUE).`,
        `Set curr = head.`,
        `While curr is not null:`,
        `  If curr.next == sentinel: return true (we've looped back to a marked node).`,
        `  Save next = curr.next.`,
        `  curr.next = sentinel (mark this node as visited).`,
        `  curr = next.`,
        `Return false.`,
      ],
      example: `list: 3→2→0→-4→(back to 2)\n\nVisit 3: 3.next=sentinel, curr=2\nVisit 2: 2.next=sentinel, curr=0\nVisit 0: 0.next=sentinel, curr=-4\nVisit -4: -4.next was 2, now 2.next is sentinel → check: next==sentinel? Yes! → ✅ return true\n\n(Note: the original list is now destroyed — all next pointers point to sentinel)`,
      keyInsight: `O(n) time, O(1) space — matches Floyd's space efficiency. However, it permanently destroys the list, which is usually unacceptable. Shown for completeness and to illustrate the "marking" pattern used in graph traversal.`,
    },

    'Standard Solution (Most Common Interview Form)': {
      intuition: `This is the textbook interview presentation of Floyd's algorithm, written with a do-while or equivalent pre-check structure. Initialize both pointers at head, advance them, then check for equality — returning true immediately on a match and false when fast hits null. Its clarity and brevity make it the answer most interviewers expect.`,
      steps: [
        `If head is null: return false.`,
        `Initialize slow = head, fast = head.`,
        `Loop: advance slow = slow.next, fast = fast.next.next.`,
        `  If fast is null OR fast.next is null: return false (end of list reached — no cycle).`,
        `  If slow == fast: return true (pointers met — cycle confirmed).`,
      ],
      example: `list: 3→2→0→-4→(back to 2)\n\nslow=3, fast=3\n→ slow=2, fast=0; not equal, not null\n→ slow=0, fast=2 (fast: 0→-4→2); not equal\n→ slow=-4, fast=-4 (fast: 2→0→-4); slow==fast!\n✅ return true\n\nlist: 1→2→null\n→ slow=2, fast=null; fast==null → ✅ return false`,
      keyInsight: `O(n) time, O(1) space. Functionally identical to Floyd's Cycle Detection — this entry captures the specific code shape that appears most often in interview solutions and standard references.`,
    },
  },
}
