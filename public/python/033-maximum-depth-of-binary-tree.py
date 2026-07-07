# LeetCode Problem #104: Maximum Depth of Binary Tree
# Difficulty: Easy
# Link: https://leetcode.com/problems/maximum-depth-of-binary-tree/

from typing import Optional
from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


# ─────────────────────────────────────────────
# APPROACH 1: Recursive DFS | O(n) time | O(h) space
# EXPLAIN: Depth = 1 + max(left_depth, right_depth); base case is None returning 0.
# WHEN: Cleanest solution; standard recursive pattern.

def maxDepth_recursive(root: Optional[TreeNode]) -> int:
    if not root:
        return 0
    return 1 + max(maxDepth_recursive(root.left), maxDepth_recursive(root.right))


# ─────────────────────────────────────────────
# APPROACH 2: BFS (Level Order) | O(n) time | O(w) space
# EXPLAIN: BFS counts levels; the total number of levels is the maximum depth.
# WHEN: Iterative approach; useful when recursion is disallowed.

def maxDepth_bfs(root: Optional[TreeNode]) -> int:
    if not root:
        return 0
    q = deque([root])
    depth = 0
    while q:
        depth += 1
        for _ in range(len(q)):
            node = q.popleft()
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
    return depth


# ─────────────────────────────────────────────
# APPROACH 3: Iterative DFS with Stack | O(n) time | O(h) space
# EXPLAIN: Use a stack of (node, current_depth) pairs and track the running maximum.
# WHEN: Iterative DFS; avoids Python recursion limit for very deep trees.

def maxDepth_stack(root: Optional[TreeNode]) -> int:
    if not root:
        return 0
    stack = [(root, 1)]
    max_depth = 0
    while stack:
        node, depth = stack.pop()
        max_depth = max(max_depth, depth)
        if node.left:
            stack.append((node.left, depth + 1))
        if node.right:
            stack.append((node.right, depth + 1))
    return max_depth


# ─────────────────────────────────────────────
# APPROACH 4: Morris Traversal | O(n) time | O(1) space
# EXPLAIN: Threaded-tree traversal tracks current depth without a stack or recursion.
# WHEN: Optimal space — O(1) extra; complex implementation, rarely asked.

def maxDepth_morris(root: Optional[TreeNode]) -> int:
    if not root:
        return 0
    max_depth = 0
    curr_depth = 0
    curr = root
    while curr:
        if not curr.left:
            curr_depth += 1
            max_depth = max(max_depth, curr_depth)
            curr = curr.right
        else:
            pred = curr.left
            steps = 1
            while pred.right and pred.right is not curr:
                pred = pred.right
                steps += 1
            if not pred.right:
                curr_depth += 1
                pred.right = curr
                curr = curr.left
            else:
                pred.right = None
                curr_depth -= steps
                curr = curr.right
    return max_depth


# ─────────────────────────────────────────────
# APPROACH 5: Tail-Recursion Style (Accumulator) | O(n) time | O(h) space
# EXPLAIN: Pass the current depth as an accumulator argument; update a mutable max on each leaf visit.
# WHEN: Demonstrates accumulator pattern; functionally same as Approach 1.

def maxDepth_accumulator(root: Optional[TreeNode]) -> int:
    result = [0]

    def helper(node, depth):
        if not node:
            return
        result[0] = max(result[0], depth)
        helper(node.left, depth + 1)
        helper(node.right, depth + 1)

    helper(root, 1)
    return result[0]


# Made with Bob
