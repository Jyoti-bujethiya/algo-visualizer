/**
 * Tutorial content for #040 — Invert Binary Tree
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given the root of a binary tree, invert the tree (i.e. mirror it) and return its root. Every node's left and right children should be swapped at every level.`,
    example: `Input:  [4, 2, 7, 1, 3, 6, 9]\n        4\n      /   \\\n     2     7\n    / \\ / \\\n   1  3 6  9\n→ Swap left/right at every node:\n        4\n      /   \\\n     7     2\n    / \\ / \\\n   9  6 3  1\n✅ Answer: [4, 7, 2, 9, 6, 3, 1]`,
    keyInsight: `Inverting a binary tree just means swapping the left and right child at every node. Whether you do this top-down (pre-order), bottom-up (post-order), or level-by-level (BFS) doesn't matter — all approaches visit every node once and swap its children.`,
  },

  approaches: {
    'Recursive DFS (Post-order)': {
      intuition: `Recurse to the leaves first, then swap on the way back up. This is post-order: first invert the left subtree, then invert the right subtree, then swap the two children of the current node. By the time you swap, both subtrees are already fully inverted.`,
      steps: [
        `Base case: if root is null, return null.`,
        `Recursively invert the left subtree: invertTree(root.left).`,
        `Recursively invert the right subtree: invertTree(root.right).`,
        `Swap: temp = root.left; root.left = root.right; root.right = temp.`,
        `Return root.`,
      ],
      example: `Tree: 4→(2→(1,3), 7→(6,9))\n\nPost-order bottom-up:\nInvert(1)→1, Invert(3)→3\nInvert(2): swap 1,3 → node 2 now has left=3, right=1\nInvert(6)→6, Invert(9)→9\nInvert(7): swap 6,9 → node 7 now has left=9, right=6\nInvert(4): swap node2,node7 → node 4 now has left=7, right=2\n✅ Answer: [4,7,2,9,6,3,1]`,
      keyInsight: `O(n) time (visits every node once), O(h) space for the call stack. Post-order ensures both children are fully inverted before the swap — though pre-order also works fine for this problem.`,
    },

    'Recursive DFS (Pre-order)': {
      intuition: `Swap first, then recurse. This is pre-order: swap the left and right children of the current node before recurring down. After the swap, recurse on the (now swapped) children. Both pre-order and post-order are correct — the order of operations just differs in when the swap happens.`,
      steps: [
        `Base case: if root is null, return null.`,
        `Swap the children: temp = root.left; root.left = root.right; root.right = temp.`,
        `Recursively call invertTree(root.left).`,
        `Recursively call invertTree(root.right).`,
        `Return root.`,
      ],
      example: `Tree: 4→(2→(1,3), 7→(6,9))\n\nPre-order top-down:\nAt 4: swap children → 4.left=7, 4.right=2\nAt 7 (was right, now left): swap children → 7.left=9, 7.right=6\nAt 9: no children, return.\nAt 6: no children, return.\nAt 2 (was left, now right): swap children → 2.left=3, 2.right=1\nAt 3: no children, return.\nAt 1: no children, return.\n✅ Answer: [4,7,2,9,6,3,1]`,
      keyInsight: `O(n) time, O(h) space. Pre-order swaps on the way down; post-order swaps on the way up. Both are correct — pick whichever feels more intuitive to you.`,
    },

    'Iterative BFS': {
      intuition: `Use a queue to process nodes level by level. For each node dequeued, swap its left and right children, then enqueue the (now swapped) non-null children. This avoids recursion entirely and is easy to trace through level by level.`,
      steps: [
        `If root is null, return null.`,
        `Enqueue root.`,
        `While queue is not empty: dequeue a node.`,
        `Swap: temp = node.left; node.left = node.right; node.right = temp.`,
        `Enqueue non-null node.left and node.right.`,
        `Return root after the queue is empty.`,
      ],
      example: `Tree: 4→(2→(1,3), 7→(6,9))\n\nQueue: [4]\nDequeue 4, swap → 4.left=7, 4.right=2. Enqueue 7, 2.\nQueue: [7, 2]\nDequeue 7, swap → 7.left=9, 7.right=6. Enqueue 9, 6.\nDequeue 2, swap → 2.left=3, 2.right=1. Enqueue 3, 1.\nQueue: [9, 6, 3, 1]\nDequeue 9,6,3,1: all leaves, swap null/null (no effect).\nQueue: []\n✅ Answer: [4,7,2,9,6,3,1]`,
      keyInsight: `O(n) time, O(n) space for the queue (max width of the tree at any level). Iterative and easy to visualise level-by-level. Avoids recursion stack overhead for very deep trees.`,
    },

    'Iterative DFS (Stack)': {
      intuition: `Replace the recursive call stack with an explicit stack. For each node popped, swap its children, then push the non-null children onto the stack. This mirrors pre-order recursive DFS — swap first, then push children — but with no risk of stack overflow on very deep trees.`,
      steps: [
        `If root is null, return null.`,
        `Push root onto a stack.`,
        `While stack is not empty: pop a node.`,
        `Swap its children: temp = node.left; node.left = node.right; node.right = temp.`,
        `Push non-null node.left and node.right onto the stack.`,
        `Return root after the stack empties.`,
      ],
      example: `Tree: 4→(2→(1,3), 7→(6,9))\n\nStack: [4]\nPop 4: swap → 4.left=7, 4.right=2. Push 7, push 2. Stack: [7,2]\nPop 2 (top): swap → 2.left=3, 2.right=1. Push 3, push 1. Stack: [7,3,1]\nPop 1: no children. Stack: [7,3]\nPop 3: no children. Stack: [7]\nPop 7: swap → 7.left=9, 7.right=6. Push 9, push 6. Stack: [9,6]\nPop 6: no children. Stack: [9]\nPop 9: no children. Stack: []\n✅ Answer: [4,7,2,9,6,3,1]`,
      keyInsight: `O(n) time, O(h) space for the stack. Functionally identical to the recursive pre-order approach but uses an explicit stack. Preferred when recursion depth is a concern.`,
    },

    'Morris Traversal': {
      intuition: `Invert the tree in O(1) space using Morris traversal — no stack, no recursion. Thread the tree by temporarily linking the inorder predecessor's right pointer back to the current node. When visiting each node (on the first visit for nodes with left children, or immediately for leaf-like nodes), swap its children. Then unthread as you return.`,
      steps: [
        `curr = root.`,
        `While curr is not null: if curr.left is null → swap curr's children; move curr = curr.left (was right before swap).`,
        `Otherwise find curr's inorder predecessor (rightmost node in left subtree not yet threaded to curr).`,
        `If pred.right is null: set pred.right = curr (create thread); move curr = curr.left.`,
        `If pred.right == curr (thread exists): remove thread (pred.right = null); swap curr's children; move curr = curr.left (was right before swap).`,
      ],
      example: `Tree: 4→(2→(1,3), 7→(6,9))\n\ncurr=4: left=2≠null. Pred of 4 in left subtree = node(3) (rightmost of subtree rooted at 2).\n  pred.right=null → thread: 3.right=4. curr=2.\ncurr=2: left=1≠null. Pred of 2 = node(1). pred.right=null → thread: 1.right=2. curr=1.\ncurr=1: left=null → swap 1's children (1 has none). curr=1.left (was right)=null... (traversal continues threading and swapping each node)\nEach node's children are swapped exactly once.\n✅ Answer: [4,7,2,9,6,3,1]`,
      keyInsight: `O(n) time, O(1) space — no extra data structures. The most space-efficient approach. Complex to implement correctly due to threading/unthreading bookkeeping; rarely asked in interviews but valuable to know for space-constrained environments.`,
    },
  },
}
