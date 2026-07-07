/**
 * Tutorial content for #031 — Binary Tree Inorder Traversal
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given the root of a binary tree, return the inorder traversal of its node values. Inorder means: visit the left subtree first, then the current node, then the right subtree. For a valid BST, inorder traversal always gives values in sorted order.`,
    example: `Tree: 1 → right: 2, 2 → left: 3\n(Drawn: root=1, 1.right=2, 2.left=3)\n→ Go left as far as possible from 1 → reach null, backtrack to 1 → visit 1\n→ Go right to 2 → go left to 3 → visit 3 → backtrack to 2 → visit 2\n✅ Answer: [1, 3, 2]`,
    keyInsight: `"Left → Root → Right" is the defining rule. Recursion naturally expresses this, but an explicit stack can simulate the call stack iteratively. Morris traversal threads the tree itself to navigate without any extra space.`,
  },

  approaches: {
    Recursive: {
      intuition: `The recursive definition is a direct translation of "left → root → right". Call inorder on the left child, then add the current node's value to the result, then call inorder on the right child. The base case is a null node — do nothing and return.`,
      steps: [
        `Create an empty result array.`,
        `Define a helper function inorder(node).`,
        `Base case: if node is null, return immediately.`,
        `Recursively call inorder(node.left).`,
        `Append node.val to the result array.`,
        `Recursively call inorder(node.right).`,
        `Call helper on root and return the result array.`,
      ],
      example: `Tree: root=1, 1.right=2, 2.left=3\n\ninorder(1): inorder(1.left=null) → add 1 → inorder(1.right=2)\ninorder(2): inorder(2.left=3)\n  inorder(3): inorder(null) → add 3 → inorder(null)\n            → add 2 → inorder(null)\nresult = [1, 3, 2]\n✅ Answer: [1, 3, 2]`,
      keyInsight: `O(n) time, O(n) space for the recursion stack (O(h) where h is tree height, O(n) worst case for a skewed tree). Clearest and simplest implementation.`,
    },

    'Iterative with Stack': {
      intuition: `Simulate the recursion manually using an explicit stack. The idea: keep going left and pushing nodes onto the stack. When you can't go left anymore, pop the top node (that's the "current root" to visit), record its value, then switch to its right subtree and repeat.`,
      steps: [
        `Create an empty stack and set curr = root.`,
        `Loop while curr is not null OR the stack is not empty.`,
        `Inner loop: while curr is not null, push curr onto the stack and move curr = curr.left.`,
        `Pop the top node from the stack — this is the node to visit.`,
        `Append node.val to the result.`,
        `Set curr = node.right and continue the outer loop.`,
      ],
      example: `Tree: root=1, 1.right=2, 2.left=3\n\nStart: curr=1, stack=[]\nPush 1, go left → curr=null, stack=[1]\nPop 1, add 1 to result. curr=1.right=2\nPush 2, go left → curr=3, stack=[2]\nPush 3, go left → curr=null, stack=[2,3]\nPop 3, add 3 to result. curr=3.right=null\nPop 2, add 2 to result. curr=2.right=null\nStack empty, done.\n✅ Answer: [1, 3, 2]`,
      keyInsight: `O(n) time, O(n) space for the stack. Equivalent to the recursive approach but avoids actual recursion — useful when the tree is very deep and you risk a stack overflow.`,
    },

    'Morris Traversal': {
      intuition: `Achieve O(1) space by temporarily modifying the tree itself. The key idea: when visiting a node X, find the inorder predecessor of X (the rightmost node in X's left subtree) and make its right pointer point back to X. This "thread" allows you to return to X after finishing the left subtree without a stack. After visiting X, you restore the original right pointer.`,
      steps: [
        `Set curr = root.`,
        `While curr is not null: if curr has no left child, visit curr (add curr.val), then move curr = curr.right.`,
        `Otherwise, find the inorder predecessor: the rightmost node in curr.left that doesn't already point to curr.`,
        `If predecessor.right is null: set predecessor.right = curr (create thread), then move curr = curr.left.`,
        `If predecessor.right is curr: remove the thread (predecessor.right = null), visit curr (add curr.val), move curr = curr.right.`,
      ],
      example: `Tree: root=1, 1.right=2, 2.left=3\n\ncurr=1: left child exists. Predecessor of 1 in left subtree? No left child! Wait — 1 has no left child.\nVisit 1, move right → curr=2\ncurr=2: left child = 3. Predecessor of 2 = rightmost of {3} = node 3. 3.right=null.\nCreate thread: 3.right → 2. Move curr=2.left=3.\ncurr=3: no left child. Visit 3. Move curr=3.right=2 (thread!).\ncurr=2: left child = 3. Predecessor=3, 3.right=2 (thread exists). Remove thread: 3.right=null. Visit 2. Move curr=2.right=null.\nDone.\n✅ Answer: [1, 3, 2]`,
      keyInsight: `O(n) time, O(1) space — no stack, no recursion. The tree is temporarily modified but fully restored. This is the most space-efficient traversal algorithm.`,
    },

    'Iterative with Color Marking': {
      intuition: `Assign each node one of two states: WHITE (unvisited) or GRAY (ready to collect). Push pairs of (node, state) onto a stack. When you pop a WHITE node, push its right child (WHITE), then itself as GRAY, then its left child (WHITE) — this encodes the "visit me between my children" contract. When you pop a GRAY node, simply add its value to the result. No tree modification required.`,
      steps: [
        `Create an empty result list and push (root, WHITE) onto a stack.`,
        `While the stack is not empty: pop (node, color).`,
        `If node is null: continue (skip).`,
        `If color is GRAY: append node.val to result.`,
        `If color is WHITE: push (node.right, WHITE), then (node, GRAY), then (node.left, WHITE) — in this order, so left is processed first.`,
        `Return result.`,
      ],
      example: `Tree: root=1, 1.right=2, 2.left=3\n\nStack: [(1,W)]\nPop (1,W): push (2,W), (1,G), (null,W)\nStack: [(2,W), (1,G), (null,W)]\nPop (null,W): skip\nPop (1,G): result=[1]\nPop (2,W): push (null,W), (2,G), (3,W)\nStack: [(null,W), (2,G), (3,W)]\nPop (3,W): push (null,W), (3,G), (null,W)\nPop (null,W): skip\nPop (3,G): result=[1,3]\nPop (null,W): skip\nPop (2,G): result=[1,3,2]\n✅ Answer: [1, 3, 2]`,
      keyInsight: `O(n) time, O(n) space. The color-marking pattern is universal — change the push order from (right,root,left) to (left,root,right) for post-order, or (root,left,right) for pre-order, without any other modification.`,
    },
  },
}
