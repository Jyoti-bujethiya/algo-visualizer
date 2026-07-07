# LeetCode Problem #297: Serialize and Deserialize Binary Tree
# Difficulty: Hard
# Link: https://leetcode.com/problems/serialize-and-deserialize-binary-tree/

from typing import Optional
from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


# ─────────────────────────────────────────────
# APPROACH 1: Pre-order Traversal (DFS) | O(n) time | O(n) space
# EXPLAIN: Serialize using pre-order DFS with 'null' markers; deserialize by consuming tokens left-to-right recursively.
# WHEN: Most common interview approach; pre-order naturally rebuilds trees top-down.

class Codec_Preorder:
    def serialize(self, root: Optional[TreeNode]) -> str:
        parts = []
        def dfs(node):
            if not node:
                parts.append('null')
                return
            parts.append(str(node.val))
            dfs(node.left)
            dfs(node.right)
        dfs(root)
        return ','.join(parts)

    def deserialize(self, data: str) -> Optional[TreeNode]:
        tokens = iter(data.split(','))
        def build():
            val = next(tokens)
            if val == 'null':
                return None
            node = TreeNode(int(val))
            node.left  = build()
            node.right = build()
            return node
        return build()


# ─────────────────────────────────────────────
# APPROACH 2: Level-order Traversal (BFS) | O(n) time | O(n) space
# EXPLAIN: BFS serializes level by level; deserialization rebuilds by assigning children to each dequeued node.
# WHEN: More intuitive for those who think in levels; matches the typical array representation.

class Codec_BFS:
    def serialize(self, root: Optional[TreeNode]) -> str:
        if not root:
            return ''
        parts = []
        q = deque([root])
        while q:
            node = q.popleft()
            if node:
                parts.append(str(node.val))
                q.append(node.left)
                q.append(node.right)
            else:
                parts.append('null')
        return ','.join(parts)

    def deserialize(self, data: str) -> Optional[TreeNode]:
        if not data:
            return None
        tokens = data.split(',')
        root = TreeNode(int(tokens[0]))
        q = deque([root])
        i = 1
        while q:
            node = q.popleft()
            if i < len(tokens) and tokens[i] != 'null':
                node.left = TreeNode(int(tokens[i]))
                q.append(node.left)
            i += 1
            if i < len(tokens) and tokens[i] != 'null':
                node.right = TreeNode(int(tokens[i]))
                q.append(node.right)
            i += 1
        return root


# ─────────────────────────────────────────────
# APPROACH 3: Pre-order with Space Separator | O(n) time | O(n) space
# EXPLAIN: Same as Approach 1 but uses '#' for null and space as delimiter; parsed with a string stream.
# WHEN: Variation of Approach 1 showing different delimiter/marker choices.

class Codec_Space:
    def serialize(self, root: Optional[TreeNode]) -> str:
        parts = []
        def dfs(node):
            if not node:
                parts.append('#')
                return
            parts.append(str(node.val))
            dfs(node.left)
            dfs(node.right)
        dfs(root)
        return ' '.join(parts)

    def deserialize(self, data: str) -> Optional[TreeNode]:
        tokens = iter(data.split())
        def build():
            val = next(tokens, None)
            if val is None or val == '#':
                return None
            node = TreeNode(int(val))
            node.left  = build()
            node.right = build()
            return node
        return build()


# ─────────────────────────────────────────────
# APPROACH 4: Compact Parentheses Representation | O(n) time | O(n) space
# EXPLAIN: Encode as "val(left)(right)" — omit branches that are empty leaves; parse recursively.
# WHEN: More space-efficient string; shows creativity in encoding design.

class Codec_Compact:
    def serialize(self, root: Optional[TreeNode]) -> str:
        if not root:
            return ''
        result = str(root.val)
        if root.left or root.right:
            result += '(' + self.serialize(root.left) + ')'
        if root.right:
            result += '(' + self.serialize(root.right) + ')'
        return result

    def deserialize(self, data: str) -> Optional[TreeNode]:
        if not data:
            return None
        self._pos = [0]
        return self._build(data)

    def _build(self, data: str) -> Optional[TreeNode]:
        pos = self._pos
        if pos[0] >= len(data):
            return None
        start = pos[0]
        if data[pos[0]] == '-':
            pos[0] += 1
        while pos[0] < len(data) and data[pos[0]].isdigit():
            pos[0] += 1
        if start == pos[0]:
            return None
        node = TreeNode(int(data[start:pos[0]]))
        if pos[0] < len(data) and data[pos[0]] == '(':
            pos[0] += 1  # skip '('
            node.left = self._build(data)
            pos[0] += 1  # skip ')'
        if pos[0] < len(data) and data[pos[0]] == '(':
            pos[0] += 1
            node.right = self._build(data)
            pos[0] += 1
        return node


# Made with Bob
