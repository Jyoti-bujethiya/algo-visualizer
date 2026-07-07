# LeetCode Problem #300: Longest Increasing Subsequence
# Difficulty: Medium
# Link: https://leetcode.com/problems/longest-increasing-subsequence/

from typing import List
import bisect

# ─────────────────────────────────────────────
# APPROACH 1: Dynamic Programming O(n²) | O(n²) time | O(n) space
# EXPLAIN: dp[i] = length of LIS ending at index i; check all j < i to extend.
# WHEN: Simple and intuitive — good when n is small or you need the actual subsequence.

def lengthOfLIS_dp(nums: List[int]) -> int:
    if not nums:
        return 0
    n = len(nums)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)


# APPROACH 2: Binary Search (Patience Sorting) | O(n log n) time | O(n) space
# EXPLAIN: Maintain a tails array; for each number, binary-search where to place it to keep
#          tails as small as possible — length of tails equals LIS length.
# WHEN: Optimal complexity; use whenever n can be large (up to 10^4+).

def lengthOfLIS_binary_search(nums: List[int]) -> int:
    tails = []
    for num in nums:
        pos = bisect.bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    return len(tails)


# APPROACH 3: DP with Reconstruction | O(n²) time | O(n) space
# EXPLAIN: Same O(n²) DP but also store parent pointers to reconstruct the actual LIS.
# WHEN: When you need to print the actual subsequence, not just its length.

def lengthOfLIS_reconstruct(nums: List[int]) -> int:
    if not nums:
        return 0
    n = len(nums)
    dp = [1] * n
    parent = [-1] * n
    max_len, max_idx = 1, 0
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
                parent[i] = j
        if dp[i] > max_len:
            max_len, max_idx = dp[i], i
    # Reconstruct
    lis = []
    cur = max_idx
    while cur != -1:
        lis.append(nums[cur])
        cur = parent[cur]
    lis.reverse()
    return max_len  # lis contains the actual subsequence


# APPROACH 4: Binary Search with Manual Implementation | O(n log n) time | O(n) space
# EXPLAIN: Same patience sorting but with an explicit hand-written binary search.
# WHEN: Use to demonstrate binary search mechanics without relying on bisect.

def lengthOfLIS_manual_bs(nums: List[int]) -> int:
    tails = []
    for num in nums:
        lo, hi = 0, len(tails)
        while lo < hi:
            mid = (lo + hi) // 2
            if tails[mid] < num:
                lo = mid + 1
            else:
                hi = mid
        if lo == len(tails):
            tails.append(num)
        else:
            tails[lo] = num
    return len(tails)


# APPROACH 5: Segment Tree | O(n log n) time | O(n) space
# EXPLAIN: Coordinate-compress values; segment tree tracks max LIS length ending at each value.
# WHEN: Advanced technique useful when extending to count LIS or handle other range queries.

def lengthOfLIS_seg_tree(nums: List[int]) -> int:
    sorted_unique = sorted(set(nums))
    rank = {v: i for i, v in enumerate(sorted_unique)}
    n = len(sorted_unique)
    tree = [0] * (2 * n)

    def update(pos, val):
        pos += n
        tree[pos] = max(tree[pos], val)
        pos >>= 1
        while pos >= 1:
            tree[pos] = max(tree[2 * pos], tree[2 * pos + 1])
            pos >>= 1

    def query(lo, hi):
        res = 0
        lo += n; hi += n + 1
        while lo < hi:
            if lo & 1:
                res = max(res, tree[lo]); lo += 1
            if hi & 1:
                hi -= 1; res = max(res, tree[hi])
            lo >>= 1; hi >>= 1
        return res

    result = 0
    for num in nums:
        pos = rank[num]
        best = query(0, pos - 1) if pos > 0 else 0
        new_len = best + 1
        result = max(result, new_len)
        update(pos, new_len)
    return result


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [
        ([10, 9, 2, 5, 3, 7, 101, 18], 4),
        ([0, 1, 0, 3, 2, 3], 4),
        ([7, 7, 7, 7, 7, 7, 7], 1),
        ([1], 1),
        ([1, 2], 2),
    ]
    for fn in (lengthOfLIS_dp, lengthOfLIS_binary_search, lengthOfLIS_reconstruct,
               lengthOfLIS_manual_bs, lengthOfLIS_seg_tree):
        for nums, expected in cases:
            result = fn(nums)
            assert result == expected, (
                f'{fn.__name__}({nums}) = {result}, expected {expected}'
            )
    print('All tests passed.')

# Made with Bob
