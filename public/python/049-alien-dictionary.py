# LeetCode Problem #269: Alien Dictionary
# Difficulty: Hard
# Link: https://leetcode.com/problems/alien-dictionary/

from typing import List
from collections import deque, defaultdict


# ─────────────────────────────────────────────
# APPROACH 1: Topological Sort via BFS (Kahn's Algorithm) | O(C) time | O(1) space
# EXPLAIN: Extract ordering constraints from adjacent word pairs; run Kahn's BFS topological sort; cycle ↔ return "".
# WHEN: Standard interview answer; clean iterative implementation.

def alienOrder_bfs(words: List[str]) -> str:
    indegree = {c: 0 for w in words for c in w}
    adj: dict = {c: [] for c in indegree}
    for i in range(len(words) - 1):
        a, b = words[i], words[i+1]
        mn = min(len(a), len(b))
        if len(a) > len(b) and a[:mn] == b[:mn]:
            return ""
        for j in range(mn):
            if a[j] != b[j]:
                adj[a[j]].append(b[j])
                indegree[b[j]] += 1
                break
    q = deque(c for c in indegree if indegree[c] == 0)
    result = []
    while q:
        c = q.popleft()
        result.append(c)
        for nb in adj[c]:
            indegree[nb] -= 1
            if indegree[nb] == 0:
                q.append(nb)
    return ''.join(result) if len(result) == len(indegree) else ""


# ─────────────────────────────────────────────
# APPROACH 2: Topological Sort via DFS (Cycle Detection) | O(C) time | O(1) space
# EXPLAIN: DFS post-order gives reverse topological order; detect cycles with 3-color marking.
# WHEN: Recursive approach; post-order naturally produces the reverse order.

def alienOrder_dfs(words: List[str]) -> str:
    adj: dict = defaultdict(list)
    chars = {c for w in words for c in w}
    color = {c: 0 for c in chars}  # 0=unvisited, 1=visiting, 2=done
    order = []
    has_cycle = [False]

    for i in range(len(words) - 1):
        a, b = words[i], words[i+1]
        mn = min(len(a), len(b))
        if len(a) > len(b) and a[:mn] == b[:mn]:
            return ""
        for j in range(mn):
            if a[j] != b[j]:
                adj[a[j]].append(b[j])
                break

    def dfs(c):
        if has_cycle[0]: return
        color[c] = 1
        for nb in adj[c]:
            if color[nb] == 1:
                has_cycle[0] = True
                return
            if color[nb] == 0:
                dfs(nb)
        color[c] = 2
        order.append(c)

    for c in chars:
        if color[c] == 0:
            dfs(c)
    if has_cycle[0]:
        return ""
    return ''.join(reversed(order))


# ─────────────────────────────────────────────
# APPROACH 3: BFS with Explicit Set (Cleaner Variant) | O(C) time | O(1) space
# EXPLAIN: Same as Approach 1 but uses a list for adj values instead of set, deduplicating with a seen-edges set.
# WHEN: Cleaner deduplication; functionally equivalent to Approach 1.

def alienOrder_bfs_clean(words: List[str]) -> str:
    indegree = {c: 0 for w in words for c in w}
    adj: dict = defaultdict(list)
    seen_edges: set = set()
    for i in range(len(words) - 1):
        a, b = words[i], words[i+1]
        mn = min(len(a), len(b))
        if len(a) > len(b) and a[:mn] == b[:mn]:
            return ""
        for j in range(mn):
            if a[j] != b[j]:
                if (a[j], b[j]) not in seen_edges:
                    seen_edges.add((a[j], b[j]))
                    adj[a[j]].append(b[j])
                    indegree[b[j]] += 1
                break
    q = deque(c for c in indegree if indegree[c] == 0)
    result = []
    while q:
        c = q.popleft()
        result.append(c)
        for nb in adj[c]:
            indegree[nb] -= 1
            if indegree[nb] == 0:
                q.append(nb)
    return ''.join(result) if len(result) == len(indegree) else ""


# Made with Bob
