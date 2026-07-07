/**
 * Tutorial content for #023 — Add Two Numbers
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Two non-negative integers are represented as reversed singly linked lists (each node holds one digit, least significant digit first). Add the two numbers and return the sum as a reversed linked list in the same format.`,
    example: `(2→4→3) + (5→6→4)\n→ represents 342 + 465 = 807\n→ return 7→0→8\n✅ Answer: 7→0→8`,
    keyInsight: `Simulate grade-school addition digit by digit. Process both lists from head to tail (already in the right order — least significant first). Track a carry that passes to the next digit.`,
  },

  approaches: {
    'Iterative Dummy Head': {
      intuition: `Walk both lists simultaneously, adding corresponding digits plus any carry from the previous step. Create a new node for each digit of the result (sum % 10) and pass the carry (sum / 10) to the next iteration. Use a dummy head to simplify building the result list. Continue until both lists are exhausted AND carry is zero.`,
      steps: [
        `Create dummy = new ListNode(0), curr = dummy, carry = 0.`,
        `While l1 is not null OR l2 is not null OR carry != 0:`,
        `  val = carry.`,
        `  If l1 is not null: val += l1.val, l1 = l1.next.`,
        `  If l2 is not null: val += l2.val, l2 = l2.next.`,
        `  carry = val / 10.`,
        `  curr.next = new ListNode(val % 10).`,
        `  curr = curr.next.`,
        `Return dummy.next.`,
      ],
      example: `l1: 2→4→3  (342)\nl2: 5→6→4  (465)\n\nStep 1: val=2+5+0=7, carry=0, digit=7\nStep 2: val=4+6+0=10, carry=1, digit=0\nStep 3: val=3+4+1=8, carry=0, digit=8\nl1=null, l2=null, carry=0 → stop\nResult: 7→0→8\n✅ Answer: 807`,
      keyInsight: `O(max(m,n)) time, O(max(m,n)) space for the result list. The dummy head eliminates the "initialize result head" special case. The carry check in the while condition handles the edge case where the result is longer than both inputs (e.g., 5+5=10).`,
    },

    'Recursive': {
      intuition: `Define a recursive helper: add the current digits of both lists plus the carry, create the result node with digit = sum % 10, then recurse with the next nodes and the new carry. Base case: both lists are null and carry is 0.`,
      steps: [
        `Define helper(l1, l2, carry):`,
        `  If l1==null AND l2==null AND carry==0: return null.`,
        `  val = carry + (l1 != null ? l1.val : 0) + (l2 != null ? l2.val : 0).`,
        `  node = new ListNode(val % 10).`,
        `  node.next = helper(l1.next or null, l2.next or null, val/10).`,
        `  Return node.`,
        `Call helper(l1, l2, 0) and return result.`,
      ],
      example: `helper(2→4→3, 5→6→4, carry=0)\n→ val=2+5+0=7, digit=7\n  → helper(4→3, 6→4, 0)\n  → val=4+6+0=10, digit=0, carry=1\n    → helper(3, 4, 1)\n    → val=3+4+1=8, digit=8\n      → helper(null, null, 0) → return null\n    → return node(8)\n  → return node(0)→node(8)\n→ return node(7)→node(0)→node(8)\n✅ Answer: 7→0→8`,
      keyInsight: `O(max(m,n)) time, O(max(m,n)) space (stack depth + result). The recursive approach is clean to read but the extra stack depth is a downside for very long numbers. The iterative version is preferred in production.`,
    },

    'In-Place Modification': {
      intuition: `Reuse the nodes of the longer input list (l1) for the result rather than allocating fresh nodes. Write the digit directly into l1.val. Only allocate new nodes when l1 runs out of nodes before l2 does, or when a final carry remains after both lists are exhausted.`,
      steps: [
        `Save head = l1 (this will be the returned result head). Set prev = null, carry = 0.`,
        `While l1 is not null OR l2 is not null OR carry != 0:`,
        `  Compute sum = carry + (l1?.val ?? 0) + (l2?.val ?? 0). Advance l2, update carry.`,
        `  If l1 is not null: overwrite l1.val = sum % 10, save prev = l1, advance l1.`,
        `  Else: allocate a new node (sum % 10), append it via prev.next, advance prev.`,
        `Return head.`,
      ],
      example: `l1: 2→4→3  l2: 5→6→4  (342 + 465 = 807)\n\nIteration 1: sum=2+5+0=7, l1.val→7, prev=node(7), l1→4\nIteration 2: sum=4+6+0=10, carry=1, l1.val→0, prev=node(0), l1→3\nIteration 3: sum=3+4+1=8, l1.val→8, prev=node(8), l1→null\nBoth exhausted, carry=0 → stop.\nResult: 7→0→8 (same nodes as original l1, values overwritten)\n✅ Answer: 7→0→8`,
      keyInsight: `O(max(m,n)) time, O(1) extra space — no new nodes unless strictly necessary. Acceptable only when the problem permits mutating the input. Minimises allocation pressure compared to the dummy-head approach.`,
    },
  },
}
