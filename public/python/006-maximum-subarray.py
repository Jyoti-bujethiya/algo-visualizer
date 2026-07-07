# LeetCode Problem #53: Maximum Subarray
# Difficulty: Medium
# Link: https://leetcode.com/problems/maximum-subarray/

# ─────────────────────────────────────────────
# APPROACH 1: Brute Force | O(n³) time | O(1) space
# EXPLAIN: Try all possible subarrays with three loops; recalculate sum from scratch each time.
# WHEN: Never — only for understanding; O(n²) version below is already an improvement.

def max_subarray_brute_cubic(nums: list[int]) -> int:
    n = len(nums)
    best = float('-inf')
    for i in range(n):
        for j in range(i, n):
            total = sum(nums[i:j + 1])
            best = max(best, total)
    return int(best)


# ─────────────────────────────────────────────
# APPROACH 2: Optimized Brute Force | O(n²) time | O(1) space
# EXPLAIN: Try all O(n²) subarrays, accumulating each sum and tracking the global maximum.
# WHEN: Only for tiny inputs; the O(n) solution is almost always preferred.

def max_subarray_brute(nums: list[int]) -> int:
    n = len(nums)
    best = float('-inf')
    for i in range(n):
        current = 0
        for j in range(i, n):
            current += nums[j]
            best = max(best, current)
    return int(best)


# ─────────────────────────────────────────────
# APPROACH 3: Kadane's Algorithm | O(n) time | O(1) space
# EXPLAIN: Extend the current subarray if it helps, otherwise restart from the current element.
# WHEN: The definitive linear solution — use in virtually every interview or production context.

def max_subarray_kadane(nums: list[int]) -> int:
    current = best = nums[0]
    for num in nums[1:]:
        current = max(num, current + num)
        best    = max(best, current)
    return best


# ─────────────────────────────────────────────
# APPROACH 4: Kadane's with Indices | O(n) time | O(1) space
# EXPLAIN: Same as Kadane's but also tracks the start and end indices of the best subarray.
# WHEN: When you need to return the actual subarray, not just its sum.

def max_subarray_kadane_with_indices(nums: list[int]) -> tuple[int, int, int]:
    """Returns (max_sum, start_index, end_index)."""
    best = current = nums[0]
    start = end = temp_start = 0
    for i in range(1, len(nums)):
        if nums[i] > current + nums[i]:
            current = nums[i]
            temp_start = i
        else:
            current += nums[i]
        if current > best:
            best = current
            start = temp_start
            end = i
    return best, start, end


# ─────────────────────────────────────────────
# APPROACH 5: Divide & Conquer | O(n log n) time | O(log n) space
# EXPLAIN: Split array in half; max subarray is either in left, right, or crosses the midpoint.
# WHEN: When you need to extend the technique to count inversions or similar divide-and-conquer problems.

def max_subarray_divide_conquer(nums: list[int]) -> int:
    def helper(lo: int, hi: int) -> int:
        if lo == hi:
            return nums[lo]
        mid = (lo + hi) // 2
        left_max  = helper(lo, mid)
        right_max = helper(mid + 1, hi)
        # best crossing subarray
        left_sum = float('-inf')
        running = 0
        for i in range(mid, lo - 1, -1):
            running  += nums[i]
            left_sum  = max(left_sum, running)
        right_sum = float('-inf')
        running = 0
        for i in range(mid + 1, hi + 1):
            running   += nums[i]
            right_sum  = max(right_sum, running)
        cross = left_sum + right_sum
        return max(left_max, right_max, cross)

    return helper(0, len(nums) - 1)


# ─────────────────────────────────────────────
if __name__ == "__main__":
    cases = [
        ([-2, 1, -3, 4, -1, 2, 1, -5, 4], 6),
        ([1],                               1),
        ([5, 4, -1, 7, 8],                23),
        ([-2, -3, -1, -4],                -1),
    ]
    for nums, expected in cases:
        assert max_subarray_brute_cubic(nums)        == expected
        assert max_subarray_brute(nums)              == expected
        assert max_subarray_kadane(nums)             == expected
        assert max_subarray_kadane_with_indices(nums)[0] == expected
        assert max_subarray_divide_conquer(nums)     == expected
    print("All tests passed.")

# Made with Bob
