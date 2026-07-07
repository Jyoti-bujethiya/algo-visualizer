# LeetCode Problem #226: Invert Binary Tree
# Difficulty: Easy
# Link: https://leetcode.com/problems/invert-binary-tree/

from typing import Optional
from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


# ─────────────────────────────────────────────
# APPROACH 1: Recursive DFS (Post-order) | O(n) time | O(h) space
# EXPLAIN: Recursively invert both subtrees, then swap the children.
# WHEN: Cleanest solution; standard recursive approach.

def invertTree_postorder(root: Optional[TreeNode]) -> Optional[TreeNode]:
    if not root:
        return None
    left  = invertTree_postorder(root.left)
    right = invertTree_postorder(root.right)
    root.left  = right
    root.right = left
    return root


# ─────────────────────────────────────────────
# APPROACH 2: Recursive DFS (Pre-order) | O(n) time | O(h) space
# EXPLAIN: Swap children first, then recurse into the (already-swapped) subtrees.
# WHEN: Equivalent to post-order; some find pre-order more intuitive.

def invertTree_preorder(root: Optional[TreeNode]) -> Optional[TreeNode]:
    if not root:
        return None
    root.left, root.right = root.right, root.left
    invertTree_preorder(root.left)
    invertTree_preorder(root.right)
    return root


# ─────────────────────────────────────────────
# APPROACH 3: Iterative BFS | O(n) time | O(w) space
# EXPLAIN: Level-order BFS with a deque; swap children of each dequeued node.
# WHEN: Avoids recursion; processes the tree level by level.

def invertTree_bfs(root: Optional[TreeNode]) -> Optional[TreeNode]:
    if not root:
        return None
    q = deque([root])
    while q:
        node = q.popleft()
        node.left, node.right = node.right, node.left
        if node.left:
            q.append(node.left)
        if node.right:
            q.append(node.right)
    return root


# ─────────────────────────────────────────────
# APPROACH 4: Iterative DFS (Stack) | O(n) time | O(h) space
# EXPLAIN: Explicit stack replaces the call stack; swap children as each node is popped.
# WHEN: Avoids Python recursion limit; DFS order rather than level order.

def invertTree_stack(root: Optional[TreeNode]) -> Optional[TreeNode]:
    if not root:
        return None
    stack = [root]
    while stack:
        node = stack.pop()
        node.left, node.right = node.right, node.left
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)
    return root


# ─────────────────────────────────────────────
# APPROACH 5: Morris Traversal | O(n) time | O(1) space
# EXPLAIN: Threaded-tree traversal; swap children at each visited node without extra memory.
# WHEN: Optimal space — O(1) extra; complex implementation, rarely required.

def invertTree_morris(root: Optional[TreeNode]) -> Optional[TreeNode]:
    curr = root
    while curr:
        if not curr.left:
            curr.left, curr.right = curr.right, curr.left
            curr = curr.left  # move to what was originally right
        else:
            pred = curr.left
            while pred.right and pred.right is not curr:
                pred = pred.right
            if not pred.right:
                pred.right = curr
                curr = curr.left
            else:
                pred.right = None
                curr.left, curr.right = curr.right, curr.left
                curr = curr.left
    return root


# Made with Bob
