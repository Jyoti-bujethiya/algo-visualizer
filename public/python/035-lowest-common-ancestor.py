# LeetCode Problem #236: Lowest Common Ancestor of a Binary Tree
# Difficulty: Medium
# Link: https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/

from typing import Optional


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


# ─────────────────────────────────────────────
# APPROACH 1: Recursive | O(n) time | O(h) space
# EXPLAIN: Return root if it is None/p/q; if both subtrees find a target, current node is LCA; otherwise propagate the non-None result.
# WHEN: Elegant one-pass solution; standard interview answer.

def lowestCommonAncestor_recursive(root: Optional[TreeNode],
                                    p: TreeNode, q: TreeNode) -> Optional[TreeNode]:
    if not root or root is p or root is q:
        return root
    left  = lowestCommonAncestor_recursive(root.left, p, q)
    right = lowestCommonAncestor_recursive(root.right, p, q)
    if left and right:
        return root
    return left if left else right


# ─────────────────────────────────────────────
# APPROACH 2: Parent Pointers | O(n) time | O(n) space
# EXPLAIN: Build a parent-pointer map with BFS; collect all ancestors of p into a set, then walk q's ancestor chain until a match.
# WHEN: More intuitive for those comfortable with the "two paths from root" mental model.

def lowestCommonAncestor_parents(root: Optional[TreeNode],
                                  p: TreeNode, q: TreeNode) -> Optional[TreeNode]:
    from collections import deque
    parent = {root: None}
    dq = deque([root])
    while p not in parent or q not in parent:
        node = dq.popleft()
        if node.left:
            parent[node.left] = node
            dq.append(node.left)
        if node.right:
            parent[node.right] = node
            dq.append(node.right)
    ancestors = set()
    while p:
        ancestors.add(p)
        p = parent[p]
    while q not in ancestors:
        q = parent[q]
    return q


# ─────────────────────────────────────────────
# APPROACH 3: Path Storage | O(n) time | O(n) space
# EXPLAIN: Find the root-to-p and root-to-q paths; the last node both paths share is the LCA.
# WHEN: Most explicit — useful when you want to inspect the full paths.

def lowestCommonAncestor_paths(root: Optional[TreeNode],
                                p: TreeNode, q: TreeNode) -> Optional[TreeNode]:
    def find_path(node, target, path):
        if not node:
            return False
        path.append(node)
        if node is target:
            return True
        if find_path(node.left, target, path) or find_path(node.right, target, path):
            return True
        path.pop()
        return False

    path_p: list = []
    path_q: list = []
    find_path(root, p, path_p)
    find_path(root, q, path_q)
    lca = None
    for a, b in zip(path_p, path_q):
        if a is b:
            lca = a
        else:
            break
    return lca


# Made with Bob
