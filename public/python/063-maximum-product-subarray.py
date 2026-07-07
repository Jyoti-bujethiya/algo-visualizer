# LeetCode Problem #152: Maximum Product Subarray
# Difficulty: Medium
# Link: https://leetcode.com/problems/maximum-product-subarray/

from typing import List

# ─────────────────────────────────────────────
# APPROACH 1: Brute Force | O(n²) time | O(1) space
# EXPLAIN: Try every subarray, compute its product, track the maximum seen.
# WHEN: Only for small inputs or when code clarity matters more than performance.

def maxProduct_brute(nums: List[int]) -> int:
    n = len(nums)
    result = nums[0]
    for i in range(n):
        prod = 1
        for j in range(i, n):
            prod *= nums[j]
            result = max(result, prod)
    return result


# APPROACH 2: DP Track Min/Max | O(n) time | O(1) space
# EXPLAIN: At each element keep both the max and min product ending here (negatives can flip);
#          global max is updated at every step.
# WHEN: Optimal — handles negatives and zeros elegantly in a single pass.

def maxProduct_dp(nums: List[int]) -> int:
    cur_max = cur_min = result = nums[0]
    for num in nums[1:]:
        candidates = (num, cur_max * num, cur_min * num)
        cur_max = max(candidates)
        cur_min = min(candidates)
        result = max(result, cur_max)
    return result


# APPROACH 3: Kadane Variant — Swap on Negative | O(n) time | O(1) space
# EXPLAIN: When element is negative swap max/min before updating — cleaner swap formulation.
# WHEN: Alternative O(1) form; slightly more readable when demonstrating the swap insight.

def maxProduct_kadane(nums: List[int]) -> int:
    cur_max = cur_min = result = nums[0]
    for num in nums[1:]:
        if num < 0:
            cur_max, cur_min = cur_min, cur_max
        cur_max = max(num, cur_max * num)
        cur_min = min(num, cur_min * num)
        result  = max(result, cur_max)
    return result


# APPROACH 4: Two-Pass (Left↔Right) | O(n) time | O(1) space
# EXPLAIN: Scan left→right and right→left tracking running product; reset on zero.
# WHEN: Elegant dual-pass that naturally handles even numbers of negatives and zeros.

def maxProduct_two_pass(nums: List[int]) -> int:
    result = max(nums)
    product = 1
    for num in nums:
        product *= num
        result = max(result, product)
        if product == 0:
            product = 1
    product = 1
    for num in reversed(nums):
        product *= num
        result = max(result, product)
        if product == 0:
            product = 1
    return result


# APPROACH 5: Divide by Zeros (segment approach) | O(n) time | O(1) space
# EXPLAIN: Split array at zeros; for each non-zero segment apply DP; zeros contribute max 0.
# WHEN: Makes zero-handling explicit; good for teaching the role each zero plays.

def maxProduct_divide_zeros(nums: List[int]) -> int:
    result = nums[0]
    max_p = min_p = nums[0]
    for num in nums[1:]:
        if num == 0:
            result = max(result, 0)
            max_p = min_p = 0
        else:
            new_max = max(num, max_p * num, min_p * num)
            new_min = min(num, max_p * num, min_p * num)
            max_p, min_p = new_max, new_min
            result = max(result, max_p)
    return result


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [
        ([2, 3, -2, 4], 6),
        ([-2, 0, -1], 0),
        ([-2], -2),
        ([0, 2], 2),
        ([-2, 3, -4], 24),
        ([2, -5, -2, -4, 3], 24),
    ]
    for fn in (maxProduct_brute, maxProduct_dp, maxProduct_kadane,
               maxProduct_two_pass, maxProduct_divide_zeros):
        for nums, expected in cases:
            result = fn(nums)
            assert result == expected, (
                f'{fn.__name__}({nums}) = {result}, expected {expected}'
            )
    print('All tests passed.')

# Made with Bob
