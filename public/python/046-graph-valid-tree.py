# LeetCode Problem #261: Graph Valid Tree
# Difficulty: Medium
# Link: https://leetcode.com/problems/graph-valid-tree/

from typing import List
from collections import deque


# ─────────────────────────────────────────────
# APPROACH 1: DFS | O(V+E) time | O(V+E) space
# EXPLAIN: A valid tree has exactly n-1 edges and is fully connected; check edge count then DFS from node 0 and verify all nodes are reachable.
# WHEN: Simple and direct; combines two necessary conditions.

def validTree_dfs(n: int, edges: List[List[int]]) -> bool:
    if len(edges) != n - 1:
        return False
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    visited = set()
    def dfs(node):
        visited.add(node)
        for nb in adj[node]:
            if nb not in visited:
                dfs(nb)
    dfs(0)
    return len(visited) == n


# ─────────────────────────────────────────────
# APPROACH 2: BFS | O(V+E) time | O(V+E) space
# EXPLAIN: Same logic as Approach 1 using BFS instead of DFS.
# WHEN: Iterative; avoids recursion depth issues.

def validTree_bfs(n: int, edges: List[List[int]]) -> bool:
    if len(edges) != n - 1:
        return False
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    visited = {0}
    q = deque([0])
    while q:
        node = q.popleft()
        for nb in adj[node]:
            if nb not in visited:
                visited.add(nb)
                q.append(nb)
    return len(visited) == n


# ─────────────────────────────────────────────
# APPROACH 3: Union-Find | O(E·α(V)) time | O(V) space
# EXPLAIN: Check edge count; union each edge — if two nodes are already in the same set, a cycle exists.
# WHEN: Optimal; directly detects cycles during edge processing.

def validTree_union_find(n: int, edges: List[List[int]]) -> bool:
    if len(edges) != n - 1:
        return False
    parent = list(range(n))
    rank = [0] * n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb:
            return False
        if rank[ra] < rank[rb]:
            ra, rb = rb, ra
        parent[rb] = ra
        if rank[ra] == rank[rb]:
            rank[ra] += 1
        return True

    return all(union(u, v) for u, v in edges)


# Made with Bob
