/**
 * Tutorial content for #021 — Reverse Linked List
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given the head of a singly linked list, reverse the list so that the last node becomes the head and each node points to the previous node instead of the next. Return the new head.`,
    example: `1 → 2 → 3 → 4 → 5 → null\n→ reverse each pointer direction\n✅ Answer: 5 → 4 → 3 → 2 → 1 → null`,
    keyInsight: `To reverse a linked list, you need three pointers: the previous node, the current node, and the next node saved before you re-link. Walk forward one node at a time, flipping each pointer.`,
  },

  approaches: {
    'Iterative': {
      intuition: `Walk through the list once. At each node, before changing its next pointer, save the next node in a temporary variable. Then point the current node backward (to the previous node). Move both prev and curr forward and repeat until curr is null. Prev will be the new head.`,
      steps: [
        `Initialize prev = null, curr = head.`,
        `While curr is not null:`,
        `  Save next = curr.next.`,
        `  Set curr.next = prev (flip the pointer).`,
        `  Move prev = curr.`,
        `  Move curr = next.`,
        `Return prev (it's now the new head).`,
      ],
      example: `1→2→3→4→5→null\n\nprev=null, curr=1\nStep 1: next=2, curr.next=null, prev=1, curr=2  → null←1  2→3→4→5\nStep 2: next=3, curr.next=1,   prev=2, curr=3  → null←1←2  3→4→5\nStep 3: next=4, curr.next=2,   prev=3, curr=4  → null←1←2←3  4→5\nStep 4: next=5, curr.next=3,   prev=4, curr=5  → null←1←2←3←4  5\nStep 5: next=null, curr.next=4, prev=5, curr=null\nReturn prev=5\n✅ Answer: 5→4→3→2→1→null`,
      keyInsight: `O(n) time, O(1) space. The cleanest and most commonly expected interview answer. The key is always saving next before you overwrite the pointer — a common bug if you forget.`,
    },

    'Recursive': {
      intuition: `Recurse to the end of the list. On the way back, each node sets its next node's next pointer back to itself, then sets its own next to null. The last node (the base case) becomes the new head and gets returned all the way up.`,
      steps: [
        `Base case: if head is null OR head.next is null, return head (this is the new head).`,
        `Recurse: newHead = reverse(head.next).`,
        `After returning: head.next.next = head (point the next node back to current).`,
        `Set head.next = null (avoid a cycle).`,
        `Return newHead all the way up.`,
      ],
      example: `reverse(1→2→3→null)\n\nreverse(1): recurse into reverse(2)\n  reverse(2): recurse into reverse(3)\n    reverse(3): 3.next is null → return 3 (new head)\n  Back in reverse(2): 3.next=2, 2.next=null → list: null←2←3\n  return newHead=3\nBack in reverse(1): 2.next=1, 1.next=null → list: null←1←2←3\nReturn newHead=3\n✅ Answer: 3→2→1→null`,
      keyInsight: `O(n) time, O(n) space (recursion stack — one frame per node). Elegant but uses stack space proportional to list length. Risk of stack overflow for very long lists.`,
    },

    'Tail Recursion': {
      intuition: `Same as the recursive approach but restructured with an accumulator parameter (the "previous" node). This way the recursive call is the last operation in the function — a tail call. Some languages optimize tail calls to avoid stack overflow, making this effectively iterative under the hood.`,
      steps: [
        `Define helper(curr, prev): if curr is null, return prev (prev is new head).`,
        `Save next = curr.next.`,
        `Set curr.next = prev (flip the pointer).`,
        `Return helper(next, curr) — the tail call.`,
        `Start with helper(head, null).`,
      ],
      example: `helper(1→2→3, null)\n→ next=2, 1.next=null, tail-call helper(2, 1)\n  → next=3, 2.next=1, tail-call helper(3, 2)\n    → next=null, 3.next=2, tail-call helper(null, 3)\n      → curr is null, return prev=3\n✅ Answer: 3→2→1→null (same result)`,
      keyInsight: `O(n) time, O(n) stack frames in Java/Python (no tail-call optimization). In languages with TCO (like Scheme or Kotlin with @TailRec), this becomes O(1) space. Shows the equivalence between iterative accumulation and tail recursion.`,
    },
  },
}
