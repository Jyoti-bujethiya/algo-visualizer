# LeetCode Problem #55: Jump Game
# Difficulty: Medium
# Link: https://leetcode.com/problems/jump-game/

from typing import List
from collections import deque

# ─────────────────────────────────────────────
# APPROACH 1: Greedy (Forward) | O(n) time | O(1) space
# EXPLAIN: Track the furthest index reachable; if current index exceeds it, return False.
# WHEN: Optimal — single pass, no extra memory. The go-to approach.

def canJump_greedy(nums: List[int]) -> bool:
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + jump)
    return True


# APPROACH 2: Greedy (Backward) | O(n) time | O(1) space
# EXPLAIN: Start from the end; track the leftmost index that can reach it; if 0, return True.
# WHEN: Elegant alternative — scan right-to-left, no extra data structure needed.

def canJump_greedy_backward(nums: List[int]) -> bool:
    last_pos = len(nums) - 1
    for i in range(len(nums) - 2, -1, -1):
        if i + nums[i] >= last_pos:
            last_pos = i
    return last_pos == 0


# APPROACH 3: DP (Bottom-Up) | O(n²) time | O(n) space
# EXPLAIN: dp[i] = True if index i is reachable; for each reachable i extend forward.
# WHEN: When you want to know which positions are reachable, not just the final answer.

def canJump_dp(nums: List[int]) -> bool:
    n = len(nums)
    dp = [False] * n
    dp[n - 1] = True
    for i in range(n - 2, -1, -1):
        furthest = min(i + nums[i], n - 1)
        for j in range(i + 1, furthest + 1):
            if dp[j]:
                dp[i] = True
                break
    return dp[0]


# APPROACH 4: BFS | O(n²) time | O(n) space
# EXPLAIN: Each index is a node; edges lead to all reachable indices; BFS checks last index.
# WHEN: Useful for visualising the problem as a graph shortest-path variant.

def canJump_bfs(nums: List[int]) -> bool:
    n = len(nums)
    if n == 1:
        return True
    visited = {0}
    queue = deque([0])
    while queue:
        i = queue.popleft()
        for step in range(1, nums[i] + 1):
            nxt = i + step
            if nxt >= n - 1:
                return True
            if nxt not in visited:
                visited.add(nxt)
                queue.append(nxt)
    return False


# APPROACH 5: Recursive Memoization | O(n²) time | O(n) space
# EXPLAIN: For each position recursively try all jumps; cache results to avoid recomputation.
# WHEN: Top-down DP style — shows the problem structure; not optimal but educational.

from functools import lru_cache

def canJump_memo(nums: List[int]) -> bool:
    n = len(nums)

    @lru_cache(maxsize=None)
    def dp(pos: int) -> bool:
        if pos >= n - 1:
            return True
        for jump in range(1, nums[pos] + 1):
            if dp(pos + jump):
                return True
        return False

    return dp(0)


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [
        ([2, 3, 1, 1, 4], True),
        ([3, 2, 1, 0, 4], False),
        ([0], True),
        ([2, 0, 0], True),
        ([1, 0, 1, 0], False),
    ]
    for fn in (canJump_greedy, canJump_greedy_backward, canJump_dp,
               canJump_bfs, canJump_memo):
        for nums, expected in cases:
            result = fn(nums)
            assert result == expected, (
                f'{fn.__name__}({nums}) = {result}, expected {expected}'
            )
    print('All tests passed.')

# Made with Bob
