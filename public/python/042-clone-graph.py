# LeetCode Problem #133: Clone Graph
# Difficulty: Medium
# Link: https://leetcode.com/problems/clone-graph/

from typing import Optional
from collections import deque


class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []


# ─────────────────────────────────────────────
# APPROACH 1: DFS with Hash Map | O(N+E) time | O(N) space
# EXPLAIN: Recursively clone each node, storing original→clone in a dict to handle cycles.
# WHEN: Natural recursive formulation; concise and easy to trace.

def cloneGraph_dfs(node: Optional[Node]) -> Optional[Node]:
    if not node:
        return None
    visited: dict = {}

    def dfs(n):
        if n in visited:
            return visited[n]
        clone = Node(n.val)
        visited[n] = clone
        for nb in n.neighbors:
            clone.neighbors.append(dfs(nb))
        return clone

    return dfs(node)


# ─────────────────────────────────────────────
# APPROACH 2: BFS with Hash Map | O(N+E) time | O(N) space
# EXPLAIN: BFS; clone each node on first encounter, then wire neighbor edges.
# WHEN: Iterative; avoids recursion depth issues on large graphs.

def cloneGraph_bfs(node: Optional[Node]) -> Optional[Node]:
    if not node:
        return None
    visited: dict = {node: Node(node.val)}
    q = deque([node])
    while q:
        curr = q.popleft()
        for nb in curr.neighbors:
            if nb not in visited:
                visited[nb] = Node(nb.val)
                q.append(nb)
            visited[curr].neighbors.append(visited[nb])
    return visited[node]


# ─────────────────────────────────────────────
# APPROACH 3: Iterative DFS (Stack) | O(N+E) time | O(N) space
# EXPLAIN: Explicit stack replaces recursion for DFS; same logic as Approach 1.
# WHEN: Avoids Python recursion limit for large or deeply connected graphs.

def cloneGraph_stack(node: Optional[Node]) -> Optional[Node]:
    if not node:
        return None
    visited: dict = {node: Node(node.val)}
    stack = [node]
    while stack:
        curr = stack.pop()
        for nb in curr.neighbors:
            if nb not in visited:
                visited[nb] = Node(nb.val)
                stack.append(nb)
            visited[curr].neighbors.append(visited[nb])
    return visited[node]


# ─────────────────────────────────────────────
# APPROACH 4: Two-Pass BFS | O(N+E) time | O(N) space
# EXPLAIN: First BFS creates all clones; second pass wires neighbor edges.
# WHEN: Cleaner separation of "create nodes" and "connect nodes" phases.

def cloneGraph_two_pass(node: Optional[Node]) -> Optional[Node]:
    if not node:
        return None
    visited: dict = {}
    q = deque([node])
    visited[node] = Node(node.val)
    while q:
        curr = q.popleft()
        for nb in curr.neighbors:
            if nb not in visited:
                visited[nb] = Node(nb.val)
                q.append(nb)
    for orig, clone in visited.items():
        for nb in orig.neighbors:
            clone.neighbors.append(visited[nb])
    return visited[node]


# ─────────────────────────────────────────────
# APPROACH 5: Recursive with Visited Set | O(N+E) time | O(N) space
# EXPLAIN: Maintain separate visited set alongside clone dict; check visited before recursing.
# WHEN: Explicit visited tracking makes the cycle-handling logic more transparent.

def cloneGraph_visited_set(node: Optional[Node]) -> Optional[Node]:
    if not node:
        return None
    clones: dict = {}
    seen: set = set()

    def dfs(n):
        if n in clones:
            return clones[n]
        clone = Node(n.val)
        clones[n] = clone
        seen.add(n)
        for nb in n.neighbors:
            if nb not in seen:
                clone.neighbors.append(dfs(nb))
            else:
                clone.neighbors.append(clones[nb])
        return clone

    return dfs(node)


# Made with Bob
