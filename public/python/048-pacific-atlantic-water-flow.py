# LeetCode Problem #417: Pacific Atlantic Water Flow
# Difficulty: Medium
# Link: https://leetcode.com/problems/pacific-atlantic-water-flow/

from typing import List
from collections import deque


# ─────────────────────────────────────────────
# APPROACH 1: Brute Force DFS from Each Cell | O(m*n*(m+n)) time | O(m*n) space
# EXPLAIN: For each cell independently check whether it can reach both oceans via DFS.
# WHEN: Conceptually clearest; too slow for large grids but good for understanding.

def pacificAtlantic_brute(heights: List[List[int]]) -> List[List[int]]:
    m, n = len(heights), len(heights[0])
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]

    def can_reach(r, c, pacific):
        visited = [[False]*n for _ in range(m)]
        stack = [(r, c)]
        visited[r][c] = True
        while stack:
            x, y = stack.pop()
            if pacific and (x == 0 or y == 0):
                return True
            if not pacific and (x == m-1 or y == n-1):
                return True
            for dx, dy in dirs:
                nx, ny = x+dx, y+dy
                if 0 <= nx < m and 0 <= ny < n and not visited[nx][ny] and heights[nx][ny] <= heights[x][y]:
                    visited[nx][ny] = True
                    stack.append((nx, ny))
        return False

    return [[r, c] for r in range(m) for c in range(n)
            if can_reach(r, c, True) and can_reach(r, c, False)]


# ─────────────────────────────────────────────
# APPROACH 2: Multi-Source BFS (Optimal) | O(m*n) time | O(m*n) space
# EXPLAIN: Reverse-flood from each ocean border (water flows uphill from ocean inward). Cells reachable from both = answer.
# WHEN: Optimal; single BFS per ocean instead of per cell.

def pacificAtlantic_bfs(heights: List[List[int]]) -> List[List[int]]:
    m, n = len(heights), len(heights[0])
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]

    def bfs(starts):
        visited = [[False]*n for _ in range(m)]
        q = deque(starts)
        for r, c in starts:
            visited[r][c] = True
        while q:
            r, c = q.popleft()
            for dr, dc in dirs:
                nr, nc = r+dr, c+dc
                if 0 <= nr < m and 0 <= nc < n and not visited[nr][nc] and heights[nr][nc] >= heights[r][c]:
                    visited[nr][nc] = True
                    q.append((nr, nc))
        return visited

    pac_starts = [(0, c) for c in range(n)] + [(r, 0) for r in range(1, m)]
    atl_starts = [(m-1, c) for c in range(n)] + [(r, n-1) for r in range(m-1)]
    pac = bfs(pac_starts)
    atl = bfs(atl_starts)
    return [[r, c] for r in range(m) for c in range(n) if pac[r][c] and atl[r][c]]


# ─────────────────────────────────────────────
# APPROACH 3: Multi-Source DFS (Optimal DFS variant) | O(m*n) time | O(m*n) space
# EXPLAIN: Same reverse-flood idea using DFS from border cells.
# WHEN: Same time complexity as BFS; DFS uses the call stack instead of an explicit queue.

def pacificAtlantic_dfs(heights: List[List[int]]) -> List[List[int]]:
    m, n = len(heights), len(heights[0])
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]

    def dfs(r, c, visited):
        visited[r][c] = True
        for dr, dc in dirs:
            nr, nc = r+dr, c+dc
            if 0 <= nr < m and 0 <= nc < n and not visited[nr][nc] and heights[nr][nc] >= heights[r][c]:
                dfs(nr, nc, visited)

    pac = [[False]*n for _ in range(m)]
    atl = [[False]*n for _ in range(m)]
    for c in range(n):
        dfs(0, c, pac)
        dfs(m-1, c, atl)
    for r in range(m):
        dfs(r, 0, pac)
        dfs(r, n-1, atl)
    return [[r, c] for r in range(m) for c in range(n) if pac[r][c] and atl[r][c]]


# Made with Bob
