/**
 * Tutorial content for #035 — Lowest Common Ancestor of a BST
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a Binary Search Tree (BST) and two nodes p and q, find their Lowest Common Ancestor (LCA). The LCA is the deepest node that is an ancestor of both p and q. A node is considered an ancestor of itself.`,
    example: `Tree: root=6, left=2, right=8, 2.left=0, 2.right=4, 8.left=7, 8.right=9\np=2, q=8\n→ Common ancestors: 6\n→ 2 is ancestor of itself\n→ 8 is ancestor of itself\n→ Deepest shared ancestor is 6\n✅ Answer: node 6`,
    keyInsight: `In a BST, the LCA of p and q is the first node you reach (from the root) where p and q split to different sides. If both are less than current, go left. If both are greater, go right. Otherwise you've found the split point — that's the LCA.`,
  },

  approaches: {
    Recursive: {
      intuition: `Use the BST's ordering property. At each node, compare its value with p and q. If both p.val and q.val are smaller, the LCA must be in the left subtree. If both are larger, it's in the right subtree. If they split (or one matches the current node), the current node is the LCA.`,
      steps: [
        `Base case: if root is null, return null.`,
        `If both p.val and q.val are less than root.val: recurse on root.left.`,
        `If both p.val and q.val are greater than root.val: recurse on root.right.`,
        `Otherwise (they split, or root equals p or q): return root — it is the LCA.`,
      ],
      example: `Tree root=6, p=2, q=8\n\nAt node 6: 2 < 6 AND 8 > 6 → they split here!\nReturn node 6.\n✅ Answer: node 6\n\nBonus: p=2, q=4 on same tree:\nAt node 6: both 2 and 4 < 6 → go left to node 2\nAt node 2: 2 == p → current node IS one of them → return node 2\n✅ Answer: node 2`,
      keyInsight: `O(h) time (h = tree height, O(log n) for balanced BST), O(h) space for recursion stack. The BST ordering makes this trivial — no need to search the whole tree.`,
    },

    'Parent Pointers': {
      intuition: `Walk from root to each of the two target nodes, recording the path taken (list of ancestors). Then find the last node that appears in both paths — that is the LCA. This is more general (works on any binary tree) and easy to understand, though it uses extra space.`,
      steps: [
        `Write a helper getPath(root, target) that returns the list of nodes from root down to target.`,
        `Call getPath for both p and q.`,
        `Compare the two paths simultaneously: the last node that matches in both paths is the LCA.`,
        `Return that node.`,
      ],
      example: `Tree: root=6, p=2, q=8\n\nPath to p=2: [6, 2]\nPath to q=8: [6, 8]\n\nCompare: index 0: both are 6 (match ✓). index 1: 2 vs 8 (no match).\nLast match was at index 0 → node 6.\n✅ Answer: node 6`,
      keyInsight: `O(h) time, O(h) space for storing paths. More straightforward to reason about than the BST-property approach, but slightly more code and memory.`,
    },

    'Path Storage': {
      intuition: `Store ancestors in a set instead of comparing paths step by step. Walk from root to p, adding each visited node to a set. Then walk from root to q; the first node you encounter that is already in the set is the LCA.`,
      steps: [
        `Walk from root to p using BST ordering, adding every visited node to a set (including p itself).`,
        `Walk from root to q using BST ordering.`,
        `At each node on the path to q, check if it's in the ancestors set.`,
        `The first match you find (shallowest, because you walk from root down) is the LCA.`,
        `Return that node.`,
      ],
      example: `Tree: root=6, p=2, q=8\n\nPath to p=2: visit 6, 2 → ancestors = {6, 2}\n\nPath to q=8: visit 6 → is 6 in ancestors? Yes!\nReturn node 6.\n✅ Answer: node 6`,
      keyInsight: `O(h) time, O(h) space for the ancestor set. Slightly different framing from the path-comparison approach — instead of comparing lists, you use set membership to find the first common node.`,
    },
  },
}
