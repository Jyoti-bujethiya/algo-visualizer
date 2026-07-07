# LeetCode Problem #543: Diameter of Binary Tree
# Difficulty: Easy
# Link: https://leetcode.com/problems/diameter-of-binary-tree/

from typing import Optional


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


# ─────────────────────────────────────────────
# APPROACH 1: Recursive DFS | O(n) time | O(h) space
# EXPLAIN: For each node compute max depth of left and right subtrees; the path
#          through that node = left_depth + right_depth. Track global max.
# WHEN: Cleanest solution; standard pattern for "longest path through each node".

def diameterOfBinaryTree_recursive(root: Optional[TreeNode]) -> int:
    diameter = [0]

    def depth(node: Optional[TreeNode]) -> int:
        if not node:
            return 0
        left  = depth(node.left)
        right = depth(node.right)
        diameter[0] = max(diameter[0], left + right)
        return 1 + max(left, right)

    depth(root)
    return diameter[0]


# ─────────────────────────────────────────────
# APPROACH 2: Iterative Post-Order (stack) | O(n) time | O(n) space
# EXPLAIN: Simulate post-order traversal with an explicit stack; compute heights
#          bottom-up using a dictionary and update the diameter on each pop.
# WHEN: Avoids Python recursion limit on deep/skewed trees.

def diameterOfBinaryTree_iterative(root: Optional[TreeNode]) -> int:
    if not root:
        return 0
    height: dict = {}
    diameter = 0
    stack = [root]
    visited = set()

    while stack:
        node = stack[-1]
        # Push children if not yet processed
        if node.left and node.left not in visited:
            stack.append(node.left)
        elif node.right and node.right not in visited:
            stack.append(node.right)
        else:
            stack.pop()
            visited.add(node)
            left_h  = height.get(node.left,  0)
            right_h = height.get(node.right, 0)
            diameter = max(diameter, left_h + right_h)
            height[node] = 1 + max(left_h, right_h)

    return diameter


# ─────────────────────────────────────────────
# APPROACH 3: Brute Force (recompute height per node) | O(n²) time | O(h) space
# EXPLAIN: For each node recompute heights of left and right subtrees; diameter through node = sum.
# WHEN: Easiest to understand but inefficient; good starting point before optimization.

def diameterOfBinaryTree_brute(root: Optional[TreeNode]) -> int:
    def height(node):
        if not node:
            return 0
        return 1 + max(height(node.left), height(node.right))

    if not root:
        return 0
    through_root = height(root.left) + height(root.right)
    left_diam    = diameterOfBinaryTree_brute(root.left)
    right_diam   = diameterOfBinaryTree_brute(root.right)
    return max(through_root, left_diam, right_diam)


# Made with Bob
