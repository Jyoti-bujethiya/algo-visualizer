# LeetCode Problem #238: Product of Array Except Self
# Difficulty: Medium
# Link: https://leetcode.com/problems/product-of-array-except-self/

# ─────────────────────────────────────────────
# APPROACH 1: Brute Force | O(n²) time | O(1) space
# EXPLAIN: For each index, multiply all other elements together in a nested loop.
# WHEN: Tiny arrays only; shows why the O(n) approaches exist.

def product_except_self_brute(nums: list[int]) -> list[int]:
    n = len(nums)
    result = []
    for i in range(n):
        product = 1
        for j in range(n):
            if j != i:
                product *= nums[j]
        result.append(product)
    return result


# ─────────────────────────────────────────────
# APPROACH 2: Division | O(n) time | O(1) space
# EXPLAIN: Compute the total product, then divide by each element; handle zeros specially.
# WHEN: Shown for completeness only — the problem statement explicitly forbids division.

def product_except_self_division(nums: list[int]) -> list[int]:
    n = len(nums)
    zero_count = nums.count(0)
    product = 1
    for x in nums:
        if x != 0:
            product *= x
    result = []
    for x in nums:
        if zero_count > 1:
            result.append(0)
        elif zero_count == 1:
            result.append(product if x == 0 else 0)
        else:
            result.append(product // x)
    return result


# ─────────────────────────────────────────────
# APPROACH 3: Prefix + Suffix Arrays | O(n) time | O(n) space
# EXPLAIN: Build a prefix-product array and a suffix-product array; answer[i] = prefix[i-1] * suffix[i+1].
# WHEN: When you want an explicit and readable O(n) solution using two passes.

def product_except_self_prefix_suffix(nums: list[int]) -> list[int]:
    n = len(nums)
    prefix  = [1] * n
    suffix  = [1] * n
    for i in range(1, n):
        prefix[i] = prefix[i - 1] * nums[i - 1]
    for i in range(n - 2, -1, -1):
        suffix[i] = suffix[i + 1] * nums[i + 1]
    return [prefix[i] * suffix[i] for i in range(n)]


# ─────────────────────────────────────────────
# APPROACH 4: Optimized Space | O(n) time | O(1) space
# EXPLAIN: Fill the output array with prefix products, then multiply in the suffix product on a second pass.
# WHEN: Optimal solution — constant extra space (the output array is not counted by convention).

def product_except_self_optimized(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [1] * n
    # forward pass: result[i] holds product of all elements to the left of i
    for i in range(1, n):
        result[i] = result[i - 1] * nums[i - 1]
    # backward pass: multiply in the suffix product
    suffix = 1
    for i in range(n - 2, -1, -1):
        suffix *= nums[i + 1]
        result[i] *= suffix
    return result


# ─────────────────────────────────────────────
if __name__ == "__main__":
    cases = [
        ([1, 2, 3, 4],  [24, 12, 8, 6]),
        ([-1, 1, 0, -3, 3], [0, 0, 9, 0, 0]),
    ]
    for nums, expected in cases:
        assert product_except_self_brute(nums)           == expected
        assert product_except_self_prefix_suffix(nums)   == expected
        assert product_except_self_optimized(nums)       == expected
    # Division approach verified separately (integer-only, no zeros edge case here)
    assert product_except_self_division([1, 2, 3, 4]) == [24, 12, 8, 6]
    print("All tests passed.")

# Made with Bob
