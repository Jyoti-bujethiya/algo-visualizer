# LeetCode Problem #322: Coin Change
# Difficulty: Medium
# Link: https://leetcode.com/problems/coin-change/

from typing import List
from collections import deque
from functools import lru_cache

# ─────────────────────────────────────────────
# APPROACH 1: Recursive Memoization | O(S·n) time | O(S) space
# EXPLAIN: Top-down recursion tries every coin at each remaining amount; cache avoids recomputation.
# WHEN: Good starting point — models the problem naturally as a decision tree.

def coinChange_memo(coins: List[int], amount: int) -> int:
    @lru_cache(maxsize=None)
    def dp(rem):
        if rem == 0:
            return 0
        if rem < 0:
            return float('inf')
        return min(1 + dp(rem - c) for c in coins)

    result = dp(amount)
    return result if result != float('inf') else -1


# APPROACH 2: BFS (Level-by-Level) | O(S·n) time | O(S) space
# EXPLAIN: BFS treats amount as target; each level adds one coin; first time we reach 0 is fewest coins.
# WHEN: When you think of it as a shortest-path problem on an implicit graph.

def coinChange_bfs(coins: List[int], amount: int) -> int:
    if amount == 0:
        return 0
    visited = {amount}
    queue = deque([amount])
    steps = 0
    while queue:
        steps += 1
        for _ in range(len(queue)):
            rem = queue.popleft()
            for c in coins:
                nxt = rem - c
                if nxt == 0:
                    return steps
                if nxt > 0 and nxt not in visited:
                    visited.add(nxt)
                    queue.append(nxt)
    return -1


# APPROACH 3: Bottom-Up DP | O(S·n) time | O(S) space
# EXPLAIN: dp[i] = minimum coins to make amount i; build from 0 up to amount.
# WHEN: Best practical choice — simple loop, no recursion overhead.

def coinChange_dp(coins: List[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if c <= i:
                dp[i] = min(dp[i], dp[i - c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1


# APPROACH 4: Bottom-Up DP with Sorted Early-Exit | O(S·n) time | O(S) space
# EXPLAIN: Sort coins ascending then break inner loop when coin > remaining amount.
# WHEN: Minor practical speedup when coins contain large denominations.

def coinChange_sorted(coins: List[int], amount: int) -> int:
    sorted_coins = sorted(coins)
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in sorted_coins:
            if c > i:
                break
            dp[i] = min(dp[i], dp[i - c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [
        ([1, 5, 10, 25], 30, 2),
        ([1, 2, 5], 11, 3),
        ([2], 3, -1),
        ([1], 0, 0),
        ([1], 1, 1),
        ([186, 419, 83, 408], 6249, 20),
    ]
    for fn in (coinChange_memo, coinChange_bfs, coinChange_dp, coinChange_sorted):
        for coins, amount, expected in cases:
            result = fn(coins, amount)
            assert result == expected, (
                f'{fn.__name__}({coins}, {amount}) = {result}, expected {expected}'
            )
    print('All tests passed.')

# Made with Bob
