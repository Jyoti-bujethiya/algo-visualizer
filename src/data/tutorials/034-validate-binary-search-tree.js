/**
 * Tutorial content for #034 — Validate Binary Search Tree
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given the root of a binary tree, determine if it is a valid Binary Search Tree (BST). A valid BST requires: every node in the left subtree has a value strictly less than the node, every node in the right subtree has a value strictly greater, and both subtrees must also be valid BSTs. Note: the constraint is for the ENTIRE subtree, not just immediate children.`,
    example: `Tree 1: [2, 1, 3]\n→ 1 < 2 and 3 > 2. Both children satisfy constraints for entire tree.\n✅ true\n\nTree 2: [5, 1, 4, null, null, 3, 6]\n→ Right child is 4, which is less than root 5.\n✅ false`,
    keyInsight: `The common mistake is only comparing a node with its immediate parent. You must pass down valid ranges (min, max) for each node as you recurse — every node must lie strictly within the range inherited from its ancestors.`,
  },

  approaches: {
    'Recursive with Range': {
      intuition: `Pass a valid range [min, max] down as you recurse. The root can be any value (range: -∞ to +∞). When you go left, the upper bound shrinks to the current node's value. When you go right, the lower bound grows to the current node's value. If any node falls outside its allowed range, the tree is invalid.`,
      steps: [
        `Define validate(node, min, max) with initial call validate(root, -Infinity, +Infinity).`,
        `Base case: if node is null, return true (empty subtree is valid).`,
        `If node.val <= min or node.val >= max, return false (out of range).`,
        `Recursively validate the left subtree: validate(node.left, min, node.val).`,
        `Recursively validate the right subtree: validate(node.right, node.val, max).`,
        `Return true only if both recursive calls return true.`,
      ],
      example: `Tree: [5, 1, 4, null, null, 3, 6]\n\nvalidate(5, -∞, +∞): 5 in (-∞,∞) ✓\n  validate(1, -∞, 5):  1 in (-∞,5) ✓ → left/right both null → true\n  validate(4, 5, +∞):  4 ≤ 5 → FAIL! Return false immediately.\nOverall: false\n✅ Answer: false`,
      keyInsight: `O(n) time, O(h) space. The range-passing approach is the cleanest and most idiomatic. The bounds correctly enforce the BST property for ALL ancestors, not just the immediate parent.`,
    },

    'Inorder Traversal': {
      intuition: `An inorder traversal of a valid BST must produce values in strictly increasing order. So do an inorder traversal while tracking the previously visited value. If the current node's value is ever less than or equal to the previous value, the tree is not a valid BST.`,
      steps: [
        `Set prev = -Infinity (or null to mean "no previous node yet").`,
        `Define inorder(node): recurse left, check current vs prev, recurse right.`,
        `If inorder(node.left) returns false, propagate false.`,
        `If node.val <= prev, return false.`,
        `Update prev = node.val.`,
        `Return the result of inorder(node.right).`,
      ],
      example: `Tree: [5, 1, 4, null, null, 3, 6]\nInorder traversal order: 1, 5, 3, 4, 6\n\nprev=-∞\nVisit 1: 1 > -∞ ✓, prev=1\nVisit 5: 5 > 1  ✓, prev=5\nVisit 3: 3 ≤ 5  ✗ → return false\n✅ Answer: false`,
      keyInsight: `O(n) time, O(h) space. Elegant: leverages the BST property that inorder must be sorted. Naturally catches all violations including non-adjacent ancestor-descendant violations.`,
    },

    'Inorder with Array': {
      intuition: `A simpler variant: collect all values from the inorder traversal into an array first, then check in a second pass whether the array is strictly sorted. Two passes instead of one but arguably easier to understand and debug.`,
      steps: [
        `Run a standard inorder traversal and collect all values into an array.`,
        `Iterate through the array and check that each element is strictly greater than the previous.`,
        `If any element violates this, return false.`,
        `Otherwise return true.`,
      ],
      example: `Tree: [2, 1, 3]\nInorder array: [1, 2, 3]\n\nCheck: 1 < 2 < 3 ← strictly increasing\n✅ Answer: true\n\nTree: [5, 1, 4, null, null, 3, 6]\nInorder array: [1, 5, 3, 4, 6]\nCheck: 5 > 3 → NOT strictly increasing\n✅ Answer: false`,
      keyInsight: `O(n) time, O(n) space (the extra array). Slightly less efficient than single-pass inorder but very beginner-friendly. The two-step separation (collect then validate) makes each part trivial.`,
    },

    'Iterative Inorder with Stack': {
      intuition: `Same as the Inorder Traversal approach but implemented iteratively using an explicit stack instead of recursion. Track the previously visited node's value; if the current node is ever ≤ previous, return false.`,
      steps: [
        `Initialise an empty stack, curr = root, prev = -Infinity.`,
        `Loop while curr is not null or stack is not empty.`,
        `Traverse left: while curr is not null, push curr onto stack, move curr = curr.left.`,
        `Pop a node from the stack — this is the current inorder node.`,
        `If node.val <= prev, return false.`,
        `Set prev = node.val, then curr = node.right and continue.`,
        `Return true if the loop completes without returning false.`,
      ],
      example: `Tree: [2, 1, 3]\n\nPush 2, go left → push 1, go left → null\nPop 1: 1 > -∞ ✓, prev=1, curr=1.right=null\nPop 2: 2 > 1  ✓, prev=2, curr=2.right=3\nPush 3, go left → null\nPop 3: 3 > 2  ✓, prev=3, curr=3.right=null\nStack empty, return true\n✅ Answer: true`,
      keyInsight: `O(n) time, O(h) space. Avoids recursion stack overflow for very deep trees. Functionally identical to recursive inorder traversal.`,
    },
  },
}
