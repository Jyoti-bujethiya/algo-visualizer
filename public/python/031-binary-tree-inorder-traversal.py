# LeetCode Problem #94: Binary Tree Inorder Traversal
# Difficulty: Easy
# Link: https://leetcode.com/problems/binary-tree-inorder-traversal/

from typing import Optional, List


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


# ─────────────────────────────────────────────
# APPROACH 1: Recursive | O(n) time | O(h) space
# EXPLAIN: Recursively traverse left, visit root, traverse right.
# WHEN: Simplest and most readable; standard first answer.

def inorderTraversal_recursive(root: Optional[TreeNode]) -> List[int]:
    result = []
    def dfs(node):
        if not node:
            return
        dfs(node.left)
        result.append(node.val)
        dfs(node.right)
    dfs(root)
    return result


# ─────────────────────────────────────────────
# APPROACH 2: Iterative with Stack | O(n) time | O(h) space
# EXPLAIN: Use a stack to simulate the call stack: push all left nodes, pop and record, then move right.
# WHEN: Preferred when recursion is not allowed; mirrors the recursive approach explicitly.

def inorderTraversal_iterative(root: Optional[TreeNode]) -> List[int]:
    result = []
    stack = []
    curr = root
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        result.append(curr.val)
        curr = curr.right
    return result


# ─────────────────────────────────────────────
# APPROACH 3: Morris Traversal | O(n) time | O(1) space
# EXPLAIN: Create temporary threads from each node's inorder predecessor back to the node; process node when thread is removed.
# WHEN: Optimal space — O(1) extra memory; temporarily modifies tree structure.

def inorderTraversal_morris(root: Optional[TreeNode]) -> List[int]:
    result = []
    curr = root
    while curr:
        if not curr.left:
            result.append(curr.val)
            curr = curr.right
        else:
            # Find inorder predecessor
            pred = curr.left
            while pred.right and pred.right is not curr:
                pred = pred.right
            if not pred.right:
                pred.right = curr      # create thread
                curr = curr.left
            else:
                pred.right = None      # remove thread
                result.append(curr.val)
                curr = curr.right
    return result


# ─────────────────────────────────────────────
# APPROACH 4: Iterative with Color Marking | O(n) time | O(h) space
# EXPLAIN: Use a stack of (node, visited) pairs; push right/node(marked)/left in reverse order; process marked nodes immediately.
# WHEN: Unified template that works for pre/in/post-order by just reordering the push sequence.

def inorderTraversal_color(root: Optional[TreeNode]) -> List[int]:
    result = []
    if not root:
        return result
    stack = [(root, False)]
    while stack:
        node, visited = stack.pop()
        if not node:
            continue
        if visited:
            result.append(node.val)
        else:
            stack.append((node.right, False))
            stack.append((node, True))
            stack.append((node.left, False))
    return result


# Made with Bob
