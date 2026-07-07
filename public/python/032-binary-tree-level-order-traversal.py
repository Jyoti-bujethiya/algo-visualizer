# LeetCode Problem #102: Binary Tree Level Order Traversal
# Difficulty: Medium
# Link: https://leetcode.com/problems/binary-tree-level-order-traversal/

from typing import Optional, List
from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


# ─────────────────────────────────────────────
# APPROACH 1: BFS with Queue | O(n) time | O(w) space
# EXPLAIN: Use a deque for BFS; snapshot the queue size at the start of each level to separate levels.
# WHEN: Standard, most intuitive approach for level-order traversal.

def levelOrder_bfs(root: Optional[TreeNode]) -> List[List[int]]:
    result = []
    if not root:
        return result
    q = deque([root])
    while q:
        level_size = len(q)
        level = []
        for _ in range(level_size):
            node = q.popleft()
            level.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        result.append(level)
    return result


# ─────────────────────────────────────────────
# APPROACH 2: DFS with Level Tracking | O(n) time | O(h) space
# EXPLAIN: Preorder DFS passes the current depth; extend the result list when a new level is first encountered.
# WHEN: Uses recursion stack (O(h)) rather than a queue (O(w)); useful for deeply skewed trees.

def levelOrder_dfs(root: Optional[TreeNode]) -> List[List[int]]:
    result = []
    def dfs(node, level):
        if not node:
            return
        if level >= len(result):
            result.append([])
        result[level].append(node.val)
        dfs(node.left, level + 1)
        dfs(node.right, level + 1)
    dfs(root, 0)
    return result


# ─────────────────────────────────────────────
# APPROACH 3: BFS with Null Markers | O(n) time | O(w) space
# EXPLAIN: Insert a None sentinel after each level; when None is dequeued, push another if the queue is non-empty.
# WHEN: Alternative BFS style showing level separation via sentinels instead of size snapshotting.

def levelOrder_null_markers(root: Optional[TreeNode]) -> List[List[int]]:
    result = []
    if not root:
        return result
    q = deque([root, None])
    level = []
    while q:
        node = q.popleft()
        if node is None:
            result.append(level)
            level = []
            if q:
                q.append(None)
        else:
            level.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
    return result


# ─────────────────────────────────────────────
# APPROACH 4: Two Queues | O(n) time | O(w) space
# EXPLAIN: Maintain separate current-level and next-level queues; swap them after processing each level.
# WHEN: Makes the two-level boundary completely explicit with separate containers.

def levelOrder_two_queues(root: Optional[TreeNode]) -> List[List[int]]:
    result = []
    if not root:
        return result
    current = deque([root])
    while current:
        level = []
        nxt = deque()
        while current:
            node = current.popleft()
            level.append(node.val)
            if node.left:
                nxt.append(node.left)
            if node.right:
                nxt.append(node.right)
        result.append(level)
        current = nxt
    return result


# Made with Bob
