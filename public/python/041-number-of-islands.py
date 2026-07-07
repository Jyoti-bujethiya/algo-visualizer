# LeetCode Problem #200: Number of Islands
# Difficulty: Medium
# Link: https://leetcode.com/problems/number-of-islands/

from typing import List
from collections import deque


# ─────────────────────────────────────────────
# APPROACH 1: DFS Recursive | O(m*n) time | O(m*n) space
# EXPLAIN: For each unvisited '1' cell increment the count and DFS-mark all connected land cells as '0'.
# WHEN: Simplest implementation; the standard first answer for this problem.

def numIslands_dfs(grid: List[List[str]]) -> int:
    if not grid:
        return 0
    m, n = len(grid), len(grid[0])

    def dfs(i, j):
        if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] != '1':
            return
        grid[i][j] = '0'
        dfs(i+1, j); dfs(i-1, j); dfs(i, j+1); dfs(i, j-1)

    count = 0
    for i in range(m):
        for j in range(n):
            if grid[i][j] == '1':
                count += 1
                dfs(i, j)
    return count


# ─────────────────────────────────────────────
# APPROACH 2: BFS | O(m*n) time | O(min(m,n)) space
# EXPLAIN: BFS from each unvisited land cell; mark visited cells '0' inside the queue loop.
# WHEN: Avoids deep recursion; queue size bounded by min(m, n) in the worst case.

def numIslands_bfs(grid: List[List[str]]) -> int:
    if not grid:
        return 0
    m, n = len(grid), len(grid[0])
    dirs = [(1,0),(-1,0),(0,1),(0,-1)]
    count = 0
    for i in range(m):
        for j in range(n):
            if grid[i][j] == '1':
                count += 1
                q = deque([(i, j)])
                grid[i][j] = '0'
                while q:
                    x, y = q.popleft()
                    for dx, dy in dirs:
                        nx, ny = x+dx, y+dy
                        if 0 <= nx < m and 0 <= ny < n and grid[nx][ny] == '1':
                            grid[nx][ny] = '0'
                            q.append((nx, ny))
    return count


# ─────────────────────────────────────────────
# APPROACH 3: Union-Find | O(m*n*α) time | O(m*n) space
# EXPLAIN: Initialize each land cell as its own set; union adjacent land pairs and track total component count.
# WHEN: Demonstrates Union-Find; extensible for dynamic connectivity (e.g., Number of Islands II).

def numIslands_union_find(grid: List[List[str]]) -> int:
    if not grid:
        return 0
    m, n = len(grid), len(grid[0])
    parent = list(range(m * n))
    rank   = [0] * (m * n)
    count = sum(grid[i][j] == '1' for i in range(m) for j in range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        nonlocal count
        ra, rb = find(a), find(b)
        if ra == rb:
            return
        if rank[ra] < rank[rb]:
            ra, rb = rb, ra
        parent[rb] = ra
        if rank[ra] == rank[rb]:
            rank[ra] += 1
        count -= 1

    for i in range(m):
        for j in range(n):
            if grid[i][j] == '1':
                if j+1 < n and grid[i][j+1] == '1':
                    union(i*n+j, i*n+j+1)
                if i+1 < m and grid[i+1][j] == '1':
                    union(i*n+j, (i+1)*n+j)
    return count


# ─────────────────────────────────────────────
# APPROACH 4: DFS with Separate Visited Array | O(m*n) time | O(m*n) space
# EXPLAIN: Same DFS logic but marks visits in a separate boolean array, preserving the original grid.
# WHEN: When the original grid must not be modified.

def numIslands_visited(grid: List[List[str]]) -> int:
    if not grid:
        return 0
    m, n = len(grid), len(grid[0])
    visited = [[False]*n for _ in range(m)]

    def dfs(i, j):
        if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] != '1' or visited[i][j]:
            return
        visited[i][j] = True
        dfs(i+1,j); dfs(i-1,j); dfs(i,j+1); dfs(i,j-1)

    count = 0
    for i in range(m):
        for j in range(n):
            if grid[i][j] == '1' and not visited[i][j]:
                count += 1
                dfs(i, j)
    return count


# ─────────────────────────────────────────────
# APPROACH 5: Iterative DFS (Stack) | O(m*n) time | O(m*n) space
# EXPLAIN: Explicit stack replaces recursion; avoids Python's recursion limit on large grids.
# WHEN: Safe for very large grids where recursive DFS would overflow the call stack.

def numIslands_stack(grid: List[List[str]]) -> int:
    if not grid:
        return 0
    m, n = len(grid), len(grid[0])
    dirs = [(1,0),(-1,0),(0,1),(0,-1)]
    count = 0
    for i in range(m):
        for j in range(n):
            if grid[i][j] == '1':
                count += 1
                stack = [(i, j)]
                grid[i][j] = '0'
                while stack:
                    x, y = stack.pop()
                    for dx, dy in dirs:
                        nx, ny = x+dx, y+dy
                        if 0 <= nx < m and 0 <= ny < n and grid[nx][ny] == '1':
                            grid[nx][ny] = '0'
                            stack.append((nx, ny))
    return count


# Made with Bob
