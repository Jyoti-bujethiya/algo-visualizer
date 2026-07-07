# LeetCode Problem #239: Sliding Window Maximum
# Difficulty: Hard
# Link: https://leetcode.com/problems/sliding-window-maximum/

from collections import deque
import math

# ─────────────────────────────────────────────
# APPROACH 1: Brute Force | O(n·k) time | O(1) space
# EXPLAIN: For each window position, scan all k elements to find the maximum.
# WHEN: Tiny inputs or when k ≈ 1; establishes the baseline before deque optimisation.

def max_sliding_window_brute(nums: list[int], k: int) -> list[int]:
    n = len(nums)
    return [max(nums[i: i + k]) for i in range(n - k + 1)]


# ─────────────────────────────────────────────
# APPROACH 2: Monotonic Deque | O(n) time | O(k) space
# EXPLAIN: Keep a deque of indices in decreasing order of value; the front is always the window maximum.
# WHEN: The canonical optimal solution — O(n) with a clean invariant; use in every interview.

def max_sliding_window_deque(nums: list[int], k: int) -> list[int]:
    dq: deque[int] = deque()    # stores indices; front = max of current window
    result: list[int] = []

    for i, num in enumerate(nums):
        # Remove indices outside the window
        if dq and dq[0] < i - k + 1:
            dq.popleft()
        # Maintain decreasing order — remove smaller elements from the back
        while dq and nums[dq[-1]] <= num:
            dq.pop()
        dq.append(i)
        # Window is fully formed from index k-1 onward
        if i >= k - 1:
            result.append(nums[dq[0]])

    return result


# ─────────────────────────────────────────────
# APPROACH 3: Segment Tree | O(n log n) time | O(n) space
# EXPLAIN: Build a segment tree over the array; each window query is O(log n) range-maximum.
# WHEN: When k changes dynamically or you need other range queries alongside sliding max.

class SegTree:
    def __init__(self, nums: list[int]) -> None:
        self.n = len(nums)
        self.tree = [-math.inf] * (4 * self.n)
        self._build(nums, 0, 0, self.n - 1)

    def _build(self, nums: list[int], node: int, lo: int, hi: int) -> None:
        if lo == hi:
            self.tree[node] = nums[lo]
            return
        mid = (lo + hi) // 2
        self._build(nums, 2 * node + 1, lo,      mid)
        self._build(nums, 2 * node + 2, mid + 1, hi)
        self.tree[node] = max(self.tree[2 * node + 1], self.tree[2 * node + 2])

    def query(self, ql: int, qr: int, node: int = 0, lo: int = 0, hi: int = -1) -> float:
        if hi == -1:
            hi = self.n - 1
        if ql > hi or qr < lo:
            return -math.inf
        if ql <= lo and hi <= qr:
            return self.tree[node]
        mid = (lo + hi) // 2
        return max(
            self.query(ql, qr, 2 * node + 1, lo,      mid),
            self.query(ql, qr, 2 * node + 2, mid + 1, hi),
        )


def max_sliding_window_segtree(nums: list[int], k: int) -> list[int]:
    st = SegTree(nums)
    return [int(st.query(i, i + k - 1)) for i in range(len(nums) - k + 1)]


# ─────────────────────────────────────────────
# APPROACH 4: Two-Pass Block Decomposition | O(n) time | O(n) space
# EXPLAIN: Divide array into blocks of size k; prefix/suffix max within each block give window max in O(1).
# WHEN: Alternative O(n) approach without a deque — useful when deque operations are restricted.

def max_sliding_window_block(nums: list[int], k: int) -> list[int]:
    n = len(nums)
    left  = [0] * n
    right = [0] * n

    for i in range(n):
        if i % k == 0:
            left[i] = nums[i]
        else:
            left[i] = max(left[i - 1], nums[i])

    for i in range(n - 1, -1, -1):
        if i % k == k - 1 or i == n - 1:
            right[i] = nums[i]
        else:
            right[i] = max(right[i + 1], nums[i])

    return [max(right[i], left[i + k - 1]) for i in range(n - k + 1)]


# ─────────────────────────────────────────────
# APPROACH 5: Sorted Container (SortedList) | O(n log k) time | O(k) space
# EXPLAIN: Maintain a sorted multiset of the current window; max is always the last element.
# WHEN: When you want a simple implementation at the cost of O(log k) per operation.

def max_sliding_window_sorted(nums: list[int], k: int) -> list[int]:
    # Use a sorted list via bisect for O(log k) insert/remove
    import bisect
    window: list[int] = []
    result: list[int] = []

    for i, num in enumerate(nums):
        bisect.insort(window, num)
        if i >= k:
            # Remove the element that left the window
            idx = bisect.bisect_left(window, nums[i - k])
            window.pop(idx)
        if i >= k - 1:
            result.append(window[-1])   # max is at the end

    return result


# ─────────────────────────────────────────────
if __name__ == "__main__":
    cases = [
        ([1, 3, -1, -3, 5, 3, 6, 7], 3, [3, 3, 5, 5, 6, 7]),
        ([1],                          1, [1]),
        ([1, -1],                      1, [1, -1]),
    ]
    for nums, k, expected in cases:
        assert max_sliding_window_brute(nums, k)   == expected
        assert max_sliding_window_deque(nums, k)   == expected
        assert max_sliding_window_segtree(nums, k) == expected
        assert max_sliding_window_block(nums, k)   == expected
        assert max_sliding_window_sorted(nums, k)  == expected
    print("All tests passed.")

# Made with Bob
