# LeetCode Problem #210: Course Schedule II
# Difficulty: Medium
# Link: https://leetcode.com/problems/course-schedule-ii/

from typing import List
from collections import deque


# ─────────────────────────────────────────────
# APPROACH 1: Kahn's Algorithm (BFS Topological Sort) | O(V+E) time | O(V+E) space
# EXPLAIN: Enqueue nodes with in-degree 0; each dequeued node goes into the result; cycle ↔ not all nodes processed.
# WHEN: Iterative and intuitive; most common interview answer for topological ordering.

def findOrder_bfs(numCourses: int, prerequisites: List[List[int]]) -> List[int]:
    adj = [[] for _ in range(numCourses)]
    indegree = [0] * numCourses
    for a, b in prerequisites:
        adj[b].append(a)
        indegree[a] += 1
    q = deque(i for i in range(numCourses) if indegree[i] == 0)
    result = []
    while q:
        u = q.popleft()
        result.append(u)
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                q.append(v)
    return result if len(result) == numCourses else []


# ─────────────────────────────────────────────
# APPROACH 2: DFS Topological Sort | O(V+E) time | O(V+E) space
# EXPLAIN: Post-order DFS appends each node after all its successors; reverse gives topological order.
# WHEN: Recursive formulation; natural connection between DFS post-order and topological sort.

def findOrder_dfs(numCourses: int, prerequisites: List[List[int]]) -> List[int]:
    adj = [[] for _ in range(numCourses)]
    for a, b in prerequisites:
        adj[b].append(a)
    state = [0] * numCourses  # 0=unvis, 1=visiting, 2=done
    order = []

    def dfs(u):
        if state[u] == 1: return False
        if state[u] == 2: return True
        state[u] = 1
        for v in adj[u]:
            if not dfs(v): return False
        state[u] = 2
        order.append(u)
        return True

    if not all(state[i] == 2 or dfs(i) for i in range(numCourses)):
        return []
    return order[::-1]


# ─────────────────────────────────────────────
# APPROACH 3: Iterative DFS | O(V+E) time | O(V+E) space
# EXPLAIN: Explicit stack DFS avoids call-stack overflow for large graphs.
# WHEN: Safe for very large course graphs; same output as Approach 2.

def findOrder_iterative(numCourses: int, prerequisites: List[List[int]]) -> List[int]:
    adj = [[] for _ in range(numCourses)]
    for a, b in prerequisites:
        adj[b].append(a)
    state = [0] * numCourses
    order = []
    for start in range(numCourses):
        if state[start] != 0:
            continue
        stack = [(start, 0)]  # (node, neighbor_index)
        while stack:
            u, ni = stack[-1]
            if ni == 0:
                if state[u] == 1: return []
                if state[u] == 2: stack.pop(); continue
                state[u] = 1
            if ni < len(adj[u]):
                stack[-1] = (u, ni + 1)
                v = adj[u][ni]
                if state[v] == 0:
                    stack.append((v, 0))
                elif state[v] == 1:
                    return []
            else:
                state[u] = 2
                order.append(u)
                stack.pop()
    return order[::-1]


# ─────────────────────────────────────────────
# APPROACH 4: Kahn's with Min-Heap | O(V log V + E) time | O(V+E) space
# EXPLAIN: Replace FIFO queue with min-heap to produce lexicographically smallest valid order.
# WHEN: When a deterministic smallest ordering is required among valid topological sorts.

def findOrder_pq(numCourses: int, prerequisites: List[List[int]]) -> List[int]:
    import heapq
    adj = [[] for _ in range(numCourses)]
    indegree = [0] * numCourses
    for a, b in prerequisites:
        adj[b].append(a)
        indegree[a] += 1
    heap = [i for i in range(numCourses) if indegree[i] == 0]
    heapq.heapify(heap)
    result = []
    while heap:
        u = heapq.heappop(heap)
        result.append(u)
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                heapq.heappush(heap, v)
    return result if len(result) == numCourses else []


# ─────────────────────────────────────────────
# APPROACH 5: DFS with Finish Time | O(V log V + E) time | O(V+E) space
# EXPLAIN: Record the DFS finish timestamp of each node; sort descending to obtain topological order.
# WHEN: Educational — connects topological sort to Tarjan's DFS finish-time concept.

def findOrder_finish_time(numCourses: int, prerequisites: List[List[int]]) -> List[int]:
    adj = [[] for _ in range(numCourses)]
    for a, b in prerequisites:
        adj[b].append(a)
    state = [0] * numCourses
    finish = [0] * numCourses
    timer = [0]

    def dfs(u):
        if state[u] == 1: return False
        if state[u] == 2: return True
        state[u] = 1
        for v in adj[u]:
            if not dfs(v): return False
        state[u] = 2
        finish[u] = timer[0]
        timer[0] += 1
        return True

    if not all(state[i] == 2 or dfs(i) for i in range(numCourses)):
        return []
    return sorted(range(numCourses), key=lambda x: -finish[x])


# Made with Bob
