# LeetCode Problem #1: Two Sum
# Difficulty: Easy
# Link: https://leetcode.com/problems/two-sum/

# ─────────────────────────────────────────────
# APPROACH 1: Brute Force | O(n²) time | O(1) space
# EXPLAIN: Check every pair of indices with two nested loops to find the target sum.
# WHEN: Only practical for very small inputs where memory is severely constrained.

def two_sum_brute(nums: list[int], target: int) -> list[int]:
    n = len(nums)
    for i in range(n - 1):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []


# ─────────────────────────────────────────────
# APPROACH 2: Hash Map (One Pass) | O(n) time | O(n) space
# EXPLAIN: Store each number's index in a hash map; for each element check if its complement already exists.
# WHEN: The standard optimal solution — use whenever time efficiency is the priority.

def two_sum_hash(nums: list[int], target: int) -> list[int]:
    seen: dict[int, int] = {}          # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []


# ─────────────────────────────────────────────
# APPROACH 3: Sort + Two Pointers | O(n log n) time | O(n) space
# EXPLAIN: Sort a paired list, then walk inward with two pointers; map values back to original indices.
# WHEN: When the input can be sorted and you want to demonstrate the two-pointer pattern.

def two_sum_two_pointers(nums: list[int], target: int) -> list[int]:
    indexed = sorted(enumerate(nums), key=lambda x: x[1])
    lo, hi = 0, len(indexed) - 1
    while lo < hi:
        current_sum = indexed[lo][1] + indexed[hi][1]
        if current_sum == target:
            return [indexed[lo][0], indexed[hi][0]]
        elif current_sum < target:
            lo += 1
        else:
            hi -= 1
    return []


# ─────────────────────────────────────────────
# Quick smoke tests
if __name__ == "__main__":
    cases = [
        ([2, 7, 11, 15], 9,  {0, 1}),
        ([3, 2, 4],       6,  {1, 2}),
        ([3, 3],           6,  {0, 1}),
    ]
    for nums, target, expected in cases:
        assert set(two_sum_brute(nums, target))        == expected
        assert set(two_sum_hash(nums, target))         == expected
        assert set(two_sum_two_pointers(nums, target)) == expected
    print("All tests passed.")

# Made with Bob
