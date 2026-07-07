# LeetCode Problem #230: Kth Smallest Element in a BST
# Difficulty: Medium
# Link: https://leetcode.com/problems/kth-smallest-element-in-a-bst/

from typing import Optional, List


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


# ─────────────────────────────────────────────
# APPROACH 1: Recursive Inorder | O(k) time | O(h) space
# EXPLAIN: Inorder traversal of a BST yields sorted order; stop and record when the k-th node is reached.
# WHEN: Clean recursive solution; early exit after k nodes.

def kthSmallest_recursive(root: Optional[TreeNode], k: int) -> int:
    result = [0]
    count = [0]

    def inorder(node):
        if not node or count[0] >= k:
            return
        inorder(node.left)
        count[0] += 1
        if count[0] == k:
            result[0] = node.val
            return
        inorder(node.right)

    inorder(root)
    return result[0]


# ─────────────────────────────────────────────
# APPROACH 2: Iterative Inorder | O(h + k) time | O(h) space
# EXPLAIN: Explicit stack-based inorder; pop and count nodes until the k-th is reached.
# WHEN: Avoids recursion; preferred for large trees or restricted environments.

def kthSmallest_iterative(root: Optional[TreeNode], k: int) -> int:
    stack = []
    curr = root
    count = 0
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        count += 1
        if count == k:
            return curr.val
        curr = curr.right
    return -1


# ─────────────────────────────────────────────
# APPROACH 3: Store Inorder in Array | O(n) time | O(n) space
# EXPLAIN: Collect all values in sorted order then return index k-1.
# WHEN: Simplest logic; acceptable when the full traversal cost is fine.

def kthSmallest_array(root: Optional[TreeNode], k: int) -> int:
    values: List[int] = []

    def collect(node):
        if not node:
            return
        collect(node.left)
        values.append(node.val)
        collect(node.right)

    collect(root)
    return values[k - 1]


# ─────────────────────────────────────────────
# APPROACH 4: Morris Traversal | O(n) time | O(1) space
# EXPLAIN: Threaded-tree inorder traversal; count nodes without extra memory.
# WHEN: O(1) extra space required; complex but avoids any auxiliary data structure.

def kthSmallest_morris(root: Optional[TreeNode], k: int) -> int:
    curr = root
    count = 0
    while curr:
        if not curr.left:
            count += 1
            if count == k:
                return curr.val
            curr = curr.right
        else:
            pred = curr.left
            while pred.right and pred.right is not curr:
                pred = pred.right
            if not pred.right:
                pred.right = curr
                curr = curr.left
            else:
                pred.right = None
                count += 1
                if count == k:
                    return curr.val
                curr = curr.right
    return -1


# ─────────────────────────────────────────────
# APPROACH 5: Augmented BST (Follow-up) | O(h) time per query | O(n) space
# EXPLAIN: Each node stores its left-subtree size; binary search to find k-th in O(h) per query.
# WHEN: Optimal for frequent kth queries after preprocessing; O(h) per query vs O(h+k).

class AugmentedNode:
    def __init__(self, val):
        self.val = val
        self.left = self.right = None
        self.left_size = 0  # number of nodes in left subtree

def kthSmallest_augmented(root: Optional[TreeNode], k: int) -> int:
    # Build augmented tree
    def build(node: Optional[TreeNode]) -> Optional[AugmentedNode]:
        if not node:
            return None
        aug = AugmentedNode(node.val)
        aug.left  = build(node.left)
        aug.right = build(node.right)
        aug.left_size = (aug.left.left_size + 1 if aug.left else 0) + (count_nodes(aug.left))
        return aug

    def count_nodes(node) -> int:
        if not node:
            return 0
        return 1 + count_nodes(node.left) + count_nodes(node.right)

    def search(node, k):
        left_count = node.left_size
        if k <= left_count:
            return search(node.left, k)
        elif k == left_count + 1:
            return node.val
        else:
            return search(node.right, k - left_count - 1)

    aug_root = build(root)
    return search(aug_root, k)


# ─────────────────────────────────────────────
# APPROACH 6: Standard Solution (most common) | O(h + k) time | O(h) space
# EXPLAIN: Canonical iterative inorder — same as Approach 2; matches typical interview submission.
# WHEN: Default answer format.

def kthSmallest(root: Optional[TreeNode], k: int) -> int:
    return kthSmallest_iterative(root, k)


# Made with Bob
