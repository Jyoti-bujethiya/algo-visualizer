# LeetCode Problem #98: Validate Binary Search Tree
# Difficulty: Medium
# Link: https://leetcode.com/problems/validate-binary-search-tree/

from typing import Optional
import math


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


# ─────────────────────────────────────────────
# APPROACH 1: Recursive with Range | O(n) time | O(h) space
# EXPLAIN: Pass a valid (min, max) range to each node; update min when going right, max when going left.
# WHEN: Most direct approach; clearly expresses the BST invariant for all ancestors.

def isValidBST_range(root: Optional[TreeNode]) -> bool:
    def validate(node, lo, hi):
        if not node:
            return True
        if node.val <= lo or node.val >= hi:
            return False
        return validate(node.left, lo, node.val) and validate(node.right, node.val, hi)
    return validate(root, -math.inf, math.inf)


# ─────────────────────────────────────────────
# APPROACH 2: Inorder Traversal | O(n) time | O(h) space
# EXPLAIN: Inorder of a valid BST is strictly increasing; track previous value and return False on violation.
# WHEN: Elegant use of BST property; slightly less direct but widely recognized.

def isValidBST_inorder(root: Optional[TreeNode]) -> bool:
    prev = [-math.inf]

    def inorder(node):
        if not node:
            return True
        if not inorder(node.left):
            return False
        if node.val <= prev[0]:
            return False
        prev[0] = node.val
        return inorder(node.right)

    return inorder(root)


# ─────────────────────────────────────────────
# APPROACH 3: Inorder with Array | O(n) time | O(n) space
# EXPLAIN: Collect the entire inorder sequence into a list and verify it is strictly increasing.
# WHEN: Most readable; separates traversal from validation at the cost of O(n) extra space.

def isValidBST_array(root: Optional[TreeNode]) -> bool:
    values = []

    def collect(node):
        if not node:
            return
        collect(node.left)
        values.append(node.val)
        collect(node.right)

    collect(root)
    return all(values[i] < values[i + 1] for i in range(len(values) - 1))


# ─────────────────────────────────────────────
# APPROACH 4: Iterative Inorder with Stack | O(n) time | O(h) space
# EXPLAIN: Iterative inorder traversal; compare each node to the previously processed node.
# WHEN: Avoids recursion; useful when the call stack depth is a concern.

def isValidBST_iterative(root: Optional[TreeNode]) -> bool:
    stack = []
    prev = -math.inf
    curr = root
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        if curr.val <= prev:
            return False
        prev = curr.val
        curr = curr.right
    return True


# Made with Bob
