# LeetCode Problem #207: Course Schedule
# Difficulty: Medium
# Link: https://leetcode.com/problems/course-schedule/

from typing import List
from collections import deque


# ─────────────────────────────────────────────
# APPROACH 1: DFS with Three States | O(V+E) time | O(V+E) space
# EXPLAIN: State 0=unvisited, 1=in-progress, 2=done; reaching a state-1 node means there's a cycle.
# WHEN: Clean cycle detection; most intuitive recursive solution.

def canFinish_dfs(numCourses: int, prerequisites: List[List[int]]) -> bool:
    adj = [[] for _ in range(numCourses)]
    for a, b in prerequisites:
        adj[b].append(a)
    state = [0] * numCourses  # 0=unvisited, 1=visiting, 2=done

    def has_cycle(u):
        if state[u] == 1: return True
        if state[u] == 2: return False
        state[u] = 1
        for v in adj[u]:
            if has_cycle(v): return True
        state[u] = 2
        return False

    return not any(state[i] == 0 and has_cycle(i) for i in range(numCourses))


# ─────────────────────────────────────────────
# APPROACH 2: BFS / Kahn's Algorithm | O(V+E) time | O(V+E) space
# EXPLAIN: Process nodes with in-degree 0; if all nodes are eventually processed, no cycle exists.
# WHEN: Iterative topological sort; cleanly handles disconnected components.

def canFinish_bfs(numCourses: int, prerequisites: List[List[int]]) -> bool:
    adj = [[] for _ in range(numCourses)]
    indegree = [0] * numCourses
    for a, b in prerequisites:
        adj[b].append(a)
        indegree[a] += 1
    q = deque(i for i in range(numCourses) if indegree[i] == 0)
    processed = 0
    while q:
        u = q.popleft()
        processed += 1
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                q.append(v)
    return processed == numCourses


# ─────────────────────────────────────────────
# APPROACH 3: DFS with Visited Sets | O(V+E) time | O(V+E) space
# EXPLAIN: Maintain explicit "visiting" and "visited" sets; check sets instead of a state array.
# WHEN: More Pythonic set-based cycle detection.

def canFinish_sets(numCourses: int, prerequisites: List[List[int]]) -> bool:
    adj = [[] for _ in range(numCourses)]
    for a, b in prerequisites:
        adj[b].append(a)
    visiting: set = set()
    visited:  set = set()

    def has_cycle(u):
        if u in visiting: return True
        if u in visited:  return False
        visiting.add(u)
        for v in adj[u]:
            if has_cycle(v): return True
        visiting.discard(u)
        visited.add(u)
        return False

    return not any(u not in visited and has_cycle(u) for u in range(numCourses))


# ─────────────────────────────────────────────
# APPROACH 4: DFS with Path Tracking | O(V+E) time | O(V+E) space
# EXPLAIN: Track which nodes are on the current path; a back-edge to an on-path node means cycle.
# WHEN: Explicit path tracking makes the cycle logic very transparent.

def canFinish_path(numCourses: int, prerequisites: List[List[int]]) -> bool:
    adj = [[] for _ in range(numCourses)]
    for a, b in prerequisites:
        adj[b].append(a)
    visited = [False] * numCourses
    on_path = [False] * numCourses

    def dfs(u):
        if on_path[u]: return True
        if visited[u]:  return False
        visited[u] = on_path[u] = True
        for v in adj[u]:
            if dfs(v): return True
        on_path[u] = False
        return False

    return not any(not visited[i] and dfs(i) for i in range(numCourses))


# ─────────────────────────────────────────────
# APPROACH 5: Modified BFS (Union-Find style) | O(V+E) time | O(V+E) space
# EXPLAIN: Same as Approach 2 / Kahn's BFS — demonstrated as a named variant for completeness.
# WHEN: Shows that Kahn's and cycle-detection via topological sort are equivalent.

def canFinish_kahn(numCourses: int, prerequisites: List[List[int]]) -> bool:
    return canFinish_bfs(numCourses, prerequisites)


# Made with Bob
