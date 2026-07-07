# LeetCode Problem #105: Construct Binary Tree from Preorder and Inorder Traversal
# Difficulty: Medium
# Link: https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/

from typing import Optional, List


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


# ─────────────────────────────────────────────
# APPROACH 1: Recursive with Hash Map | O(n) time | O(n) space
# EXPLAIN: First element of preorder is the root; find it in inorder to split left/right subtrees.
#          Use a hash map for O(1) inorder lookups and a mutable preorder index.
# WHEN: Optimal time complexity; standard interview answer.

def buildTree_hashmap(preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
    idx_map = {val: i for i, val in enumerate(inorder)}
    pre_idx = [0]

    def build(lo, hi):
        if lo > hi:
            return None
        root_val = preorder[pre_idx[0]]
        pre_idx[0] += 1
        root = TreeNode(root_val)
        mid = idx_map[root_val]
        root.left  = build(lo, mid - 1)
        root.right = build(mid + 1, hi)
        return root

    return build(0, len(inorder) - 1)


# ─────────────────────────────────────────────
# APPROACH 2: Recursive without Hash Map | O(n²) time | O(n) space
# EXPLAIN: Same logic but searches for root in inorder with linear scan per call.
# WHEN: Simpler code at the cost of O(n²) time; fine for small inputs.

def buildTree_no_map(preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
    def build(pre_s, pre_e, in_s, in_e):
        if pre_s > pre_e or in_s > in_e:
            return None
        root_val = preorder[pre_s]
        root = TreeNode(root_val)
        mid = in_s
        while inorder[mid] != root_val:
            mid += 1
        left_size = mid - in_s
        root.left  = build(pre_s + 1, pre_s + left_size, in_s, mid - 1)
        root.right = build(pre_s + left_size + 1, pre_e, mid + 1, in_e)
        return root

    return build(0, len(preorder) - 1, 0, len(inorder) - 1)


# ─────────────────────────────────────────────
# APPROACH 3: Iterative with Stack | O(n) time | O(n) space
# EXPLAIN: Process preorder elements with a stack; use the inorder pointer to decide when to switch from left-child to right-child attachment.
# WHEN: Avoids recursion; useful when call-stack depth is a concern.

def buildTree_iterative(preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
    if not preorder:
        return None
    root = TreeNode(preorder[0])
    stack = [root]
    in_idx = 0
    for i in range(1, len(preorder)):
        node = TreeNode(preorder[i])
        parent = stack[-1]
        if parent.val != inorder[in_idx]:
            parent.left = node
        else:
            while stack and stack[-1].val == inorder[in_idx]:
                parent = stack.pop()
                in_idx += 1
            parent.right = node
        stack.append(node)
    return root


# ─────────────────────────────────────────────
# APPROACH 4: Slicing (Intuitive) | O(n²) time | O(n²) space
# EXPLAIN: Create explicit sub-lists for each recursive call; mirrors the conceptual split most clearly.
# WHEN: Most readable but least efficient; good for understanding the algorithm.

def buildTree_slicing(preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
    if not preorder:
        return None
    root_val = preorder[0]
    root = TreeNode(root_val)
    mid = inorder.index(root_val)
    root.left  = buildTree_slicing(preorder[1:1 + mid], inorder[:mid])
    root.right = buildTree_slicing(preorder[1 + mid:], inorder[mid + 1:])
    return root


# ─────────────────────────────────────────────
# APPROACH 5: Standard Solution (hash map, same as Approach 1) | O(n) time | O(n) space
# EXPLAIN: Canonical version matching LeetCode's method signature.
# WHEN: Default submission entry point.

def buildTree(preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
    return buildTree_hashmap(preorder, inorder)


# Made with Bob
