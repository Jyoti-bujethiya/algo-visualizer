/**
 * Tutorial content for #022 — Merge Two Sorted Lists
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given the heads of two sorted singly linked lists, merge them into one sorted linked list and return the head of the merged list. The merged list should be made by splicing together the nodes of the two input lists.`,
    example: `list1: 1→2→4\nlist2: 1→3→4\n→ compare heads, pick smaller, advance that pointer\n✅ Answer: 1→1→2→3→4→4`,
    keyInsight: `Use a dummy head node to simplify edge cases. Compare the front nodes of both lists, attach the smaller one, and advance that list's pointer. When one list is exhausted, attach the rest of the other.`,
  },

  approaches: {
    'Iterative with Dummy Head': {
      intuition: `Create a dummy (sentinel) node as the starting point of the result list. Use a current pointer to build the merged list. At each step, compare the heads of the two lists and attach the smaller node to current.next, then advance. When one list runs out, attach the rest of the other.`,
      steps: [
        `Create dummy = new ListNode(0), curr = dummy.`,
        `While list1 is not null AND list2 is not null:`,
        `  If list1.val <= list2.val: curr.next = list1, list1 = list1.next.`,
        `  Else: curr.next = list2, list2 = list2.next.`,
        `  curr = curr.next.`,
        `After the loop: curr.next = list1 (if list1 has remaining) or list2.`,
        `Return dummy.next (skip the dummy node).`,
      ],
      example: `list1: 1→2→4,  list2: 1→3→4\ndummy → ?\n\n1vs1: equal → attach list1(1), l1→2, curr→1\n2vs1: 1<2  → attach list2(1), l2→3, curr→1\n2vs3: 2<3  → attach list1(2), l1→4, curr→2\n4vs3: 3<4  → attach list2(3), l2→4, curr→3\n4vs4: equal → attach list1(4), l1=null, curr→4\nl1=null → attach rest of l2: append 4\n✅ Answer: 1→1→2→3→4→4`,
      keyInsight: `O(m+n) time, O(1) space (reuses existing nodes). The dummy head eliminates the special case for "what is the first node of the result?" — a classic linked list trick.`,
    },

    'Recursive': {
      intuition: `The merged list is just: "the smaller head node, with its next pointer set to the result of merging the rest." Define this recursively. Base cases: if either list is empty, return the other. Otherwise compare heads and recurse on the remainder.`,
      steps: [
        `Base case: if list1 is null, return list2. If list2 is null, return list1.`,
        `If list1.val <= list2.val:`,
        `  list1.next = merge(list1.next, list2).`,
        `  Return list1.`,
        `Else:`,
        `  list2.next = merge(list1, list2.next).`,
        `  Return list2.`,
      ],
      example: `merge(1→2→4, 1→3→4)\n→ 1≤1: l1.next = merge(2→4, 1→3→4), return l1(1)\n  → 2>1: l2.next = merge(2→4, 3→4), return l2(1)\n    → 2≤3: l1.next = merge(4, 3→4), return l1(2)\n      → 4>3: l2.next = merge(4, 4), return l2(3)\n        → 4≤4: l1.next = merge(null, 4), return l1(4)\n          → l1=null, return l2(4)\nUnwinding: 4→4, 3→4→4, 2→3→4→4, 1→2→3→4→4, 1→1→2→3→4→4\n✅ Answer: 1→1→2→3→4→4`,
      keyInsight: `O(m+n) time, O(m+n) space (recursion stack, one frame per node). Elegant and short to write, but the stack depth grows linearly with list sizes — not ideal for very long lists.`,
    },

    'In-Place without Dummy Node': {
      intuition: `Avoid the dummy node by manually determining which list's head is smaller to start. Then use two pointers to weave the lists together in-place. Slightly more code but demonstrates the operation without any auxiliary nodes at all.`,
      steps: [
        `If list1 is null, return list2. If list2 is null, return list1.`,
        `Set head = whichever of list1.val, list2.val is smaller (this is the result head).`,
        `Initialize curr = head. Advance whichever list's pointer you chose.`,
        `While both list1 and list2 are not null:`,
        `  Attach the smaller, advance its pointer, advance curr.`,
        `Attach the non-null remainder (curr.next = list1 or list2).`,
        `Return head.`,
      ],
      example: `list1: 1→2→4,  list2: 1→3→4\n\nhead = list1(1) (1≤1, pick l1), l1→2, curr=node(1)\n1vs1(l1=2,l2=1): 1<2 → attach l2(1), l2→3, curr→l2's 1\n2vs3: 2<3 → attach l1(2), l1→4, curr→2\n4vs3: 3<4 → attach l2(3), l2→4, curr→3\n4vs4: equal→ attach l1(4), l1=null, curr→4\nl1=null → curr.next=l2(4)\n✅ Answer: 1→1→2→3→4→4`,
      keyInsight: `O(m+n) time, O(1) space. Functionally identical to the dummy-head approach. Avoids allocating any new node — every node in the result is one of the original input nodes, just re-linked.`,
    },
  },
}
