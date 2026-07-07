# LeetCode Problem #323: Number of Connected Components in an Undirected Graph
# Difficulty: Medium
# Link: https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/

from typing import List
from collections import deque


# ─────────────────────────────────────────────
# APPROACH 1: DFS | O(V+E) time | O(V+E) space
# EXPLAIN: DFS from each unvisited node; each DFS call discovers one connected component.
# WHEN: Simple recursive approach; standard first answer.

def countComponents_dfs(n: int, edges: List[List[int]]) -> int:
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    visited = [False] * n

    def dfs(node):
        visited[node] = True
        for nb in adj[node]:
            if not visited[nb]:
                dfs(nb)

    count = 0
    for i in range(n):
        if not visited[i]:
            dfs(i)
            count += 1
    return count


# ─────────────────────────────────────────────
# APPROACH 2: BFS | O(V+E) time | O(V+E) space
# EXPLAIN: BFS from each unvisited node; count how many BFS starts are needed.
# WHEN: Iterative; avoids recursion depth issues.

def countComponents_bfs(n: int, edges: List[List[int]]) -> int:
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    visited = [False] * n
    count = 0
    for i in range(n):
        if not visited[i]:
            count += 1
            q = deque([i])
            visited[i] = True
            while q:
                node = q.popleft()
                for nb in adj[node]:
                    if not visited[nb]:
                        visited[nb] = True
                        q.append(nb)
    return count


# ─────────────────────────────────────────────
# APPROACH 3: Union-Find | O(E·α(V)) time | O(V) space
# EXPLAIN: Start with n components; each union of two different components decrements the count.
# WHEN: Optimal; naturally models dynamic connectivity.

def countComponents_union_find(n: int, edges: List[List[int]]) -> int:
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

    count = n
    for u, v in edges:
        if union(u, v):
            count -= 1
    return count


# Made with Bob
