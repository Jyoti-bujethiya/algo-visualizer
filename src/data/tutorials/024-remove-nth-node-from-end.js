/**
 * Tutorial content for #024 — Remove Nth Node From End
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given the head of a linked list and an integer n, remove the nth node from the end of the list and return the head. Try to do it in one pass.`,
    example: `list: 1→2→3→4→5, n=2\n→ 2nd from end is node(4)\n→ remove it: 1→2→3→5\n✅ Answer: 1→2→3→5`,
    keyInsight: `Use two pointers with a gap of n nodes between them. When the fast pointer reaches the end, the slow pointer is exactly at the node before the one to remove.`,
  },

  approaches: {
    'Two Pointer One Pass': {
      intuition: `Send a "fast" pointer n+1 steps ahead of a "slow" pointer. Move both at the same speed until fast reaches the end of the list. Now slow is positioned just before the node to remove. Use a dummy head to handle the edge case where the first node itself is removed.`,
      steps: [
        `Create dummy = new ListNode(0, head). Set fast = dummy, slow = dummy.`,
        `Advance fast n+1 times (so there's a gap of n between fast and slow).`,
        `Move both fast and slow forward together until fast is null.`,
        `slow.next = slow.next.next (skip the nth-from-end node).`,
        `Return dummy.next.`,
      ],
      example: `list: 1→2→3→4→5, n=2\ndummy→1→2→3→4→5\n\nAdvance fast 3 steps (n+1=3):\n  fast: dummy→1→2→3\n  slow: at dummy\n\nMove both until fast=null:\n  fast=3→4, slow=1\n  fast=4→5, slow=2\n  fast=5→null... wait, fast should reach null:\n  fast=3→4→5→null: move 3 times from 3:\n  Actually from position 3: fast→4, slow→1; fast→5, slow→2; fast→null, slow→3\n  slow=3, slow.next=4 (the target)\n\nslow.next = slow.next.next = 5\n✅ Result: 1→2→3→5`,
      keyInsight: `O(n) time (one pass), O(1) space. The n+1 gap ensures slow stops exactly one node before the target. The dummy head elegantly handles removal of the very first node (n == list length).`,
    },

    'Two Pass Length': {
      intuition: `First pass: count the total length of the list. Second pass: calculate the position from the front (length - n), then walk to that node and remove the next one. Simple and easy to reason about, but requires two traversals.`,
      steps: [
        `First pass: count the length L of the list.`,
        `Create dummy = new ListNode(0, head). Set curr = dummy.`,
        `Compute the number of steps to the node before the target: steps = L - n.`,
        `Advance curr exactly steps times.`,
        `curr.next = curr.next.next (remove the target node).`,
        `Return dummy.next.`,
      ],
      example: `list: 1→2→3→4→5, n=2\n\nPass 1: length L=5\nSteps to node before target: 5-2=3\n\nPass 2 (from dummy):\n  dummy→1 (step 1) → 2 (step 2) → 3 (step 3) → curr=3\n  curr.next = 4, curr.next.next = 5\n  curr.next = 5 → list becomes 1→2→3→5\n✅ Answer: 1→2→3→5`,
      keyInsight: `O(n) time (two passes), O(1) space. More intuitive than the two-pointer approach — easier to explain. The two-pointer one-pass solution is O(n) the same, just more clever.`,
    },

    'Recursion': {
      intuition: `Recurse all the way to the end of the list, then count nodes on the way back. When the counter reaches n on the return path, that node is the one to remove — return its next instead of itself. Use a dummy head so the head node itself can be removed uniformly.`,
      steps: [
        `Create dummy = new ListNode(0, head). Set count = [0] (mutable integer wrapper).`,
        `Define helper(node): if node == null return null; otherwise node.next = helper(node.next).`,
        `Inside helper, increment count after the recursive call returns.`,
        `If count[0] == n, skip this node by returning node.next instead of node.`,
        `Call dummy.next = helper(head) and return dummy.next.`,
      ],
      example: `list: 1→2→3→4→5, n=2\n\nRecurse to end:\nhelper(null) → return null, count stays 0\nhelper(5) → count=1, 1≠2, return node(5)\nhelper(4) → count=2, 2==2 → return node(4).next = node(5) [node 4 removed]\nhelper(3) → count=3, return node(3)→node(5)\nhelper(2) → count=4, return node(2)→node(3)→node(5)\nhelper(1) → count=5, return node(1)→node(2)→node(3)→node(5)\n✅ Result: 1→2→3→5`,
      keyInsight: `O(n) time, O(n) space for the call stack. Elegant but uses stack depth proportional to list length. The count is passed as a single-element array to allow mutation inside the recursive helper.`,
    },

    'Stack': {
      intuition: `Push every node (including the dummy head) onto a stack. Popping n nodes takes you right past the node to remove. The next peek reveals the predecessor node — set its next pointer to skip the target.`,
      steps: [
        `Create dummy = new ListNode(0, head). Push dummy and every subsequent node onto a stack.`,
        `Pop exactly n nodes from the top of the stack (discarding them).`,
        `Peek at the top — this is the predecessor of the node to remove.`,
        `Set predecessor.next = predecessor.next.next to unlink the target.`,
        `Return dummy.next.`,
      ],
      example: `list: 1→2→3→4→5, n=2\nStack (top→bottom): [5, 4, 3, 2, 1, dummy]\n\nPop 1st: node(5)\nPop 2nd: node(4) — this is the node to remove\nPeek: node(3) — this is the predecessor\nnode(3).next = node(3).next.next = node(5)\n✅ Result: 1→2→3→5`,
      keyInsight: `O(n) time, O(n) space for the stack. Conceptually simple — the LIFO order of the stack naturally exposes nodes from the end first. Popping n nodes to find the nth-from-end is a direct mapping of the problem statement.`,
    },
  },
}
