# LeetCode Problem #124: Binary Tree Maximum Path Sum
# Difficulty: Hard
# Link: https://leetcode.com/problems/binary-tree-maximum-path-sum/

from typing import Optional
import math


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


# ─────────────────────────────────────────────
# APPROACH 1: Recursive DFS with Global Max | O(n) time | O(h) space
# EXPLAIN: For each node compute the best single-arm gain (max of 0 or left/right arm).
#          Update global max with the full path through the node (left + node + right).
#          Return only the best single arm so the caller can extend it.
# WHEN: Only practical approach; the global-variable pattern is the standard interview solution.

def maxPathSum(root: Optional[TreeNode]) -> int:
    best = [-math.inf]

    def gain(node: Optional[TreeNode]) -> int:
        if not node:
            return 0
        left_gain  = max(gain(node.left),  0)
        right_gain = max(gain(node.right), 0)
        best[0] = max(best[0], node.val + left_gain + right_gain)
        return node.val + max(left_gain, right_gain)

    gain(root)
    return best[0]


# ─────────────────────────────────────────────
# APPROACH 2: Same algorithm, nonlocal variable style | O(n) time | O(h) space
# EXPLAIN: Identical logic to Approach 1 but uses Python's `nonlocal` instead of a
#          mutable list container — cleaner syntax in Python 3.
# WHEN: When you prefer nonlocal over a wrapper list; functionally equivalent.

def maxPathSum_nonlocal(root: Optional[TreeNode]) -> int:
    best = -math.inf

    def gain(node: Optional[TreeNode]) -> int:
        nonlocal best
        if not node:
            return 0
        left_gain  = max(gain(node.left),  0)
        right_gain = max(gain(node.right), 0)
        best = max(best, node.val + left_gain + right_gain)
        return node.val + max(left_gain, right_gain)

    gain(root)
    return best


# ─────────────────────────────────────────────
# APPROACH 3: DFS returning (maxSingle, maxPath) pair | O(n) time | O(h) space
# EXPLAIN: Return a tuple (best_arm, best_path_in_subtree) from each recursive call; no global variable needed.
# WHEN: Useful if you want to avoid side-effects and keep the function purely functional.

def maxPathSum_pair(root: Optional[TreeNode]) -> int:
    def dfs(node):
        if not node:
            return 0, -math.inf
        ls, lp = dfs(node.left)
        rs, rp = dfs(node.right)
        max_single = node.val + max(0, ls, rs)
        max_path   = max(lp, rp, node.val + max(0, ls) + max(0, rs))
        return max_single, max_path

    _, result = dfs(root)
    return result


# ─────────────────────────────────────────────
# APPROACH 4: Iterative Post-order | O(n) time | O(n) space
# EXPLAIN: Two-stack post-order collects nodes; process in reverse post-order, keeping a hash map of best single-arm gains.
# WHEN: Avoids recursion limit; useful for very deep trees.

def maxPathSum_iterative(root: Optional[TreeNode]) -> int:
    if not root:
        return 0
    best = -math.inf
    best_single: dict = {None: 0}
    # Collect nodes in post-order using two-stack trick
    s1 = [root]
    s2 = []
    while s1:
        node = s1.pop()
        s2.append(node)
        if node.left:
            s1.append(node.left)
        if node.right:
            s1.append(node.right)
    while s2:
        node = s2.pop()
        left_max  = max(0, best_single.get(node.left,  0))
        right_max = max(0, best_single.get(node.right, 0))
        best = max(best, node.val + left_max + right_max)
        best_single[node] = node.val + max(left_max, right_max)
    return best


# ─────────────────────────────────────────────
# APPROACH 5: Standard Solution (most common) | O(n) time | O(h) space
# EXPLAIN: Identical to Approach 1 — included as the named entry point to match the LeetCode signature.
# WHEN: Default submission format.

def maxPathSum_standard(root: Optional[TreeNode]) -> int:
    return maxPathSum(root)


# Made with Bob
