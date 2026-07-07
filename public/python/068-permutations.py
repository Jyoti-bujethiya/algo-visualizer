# LeetCode Problem #46: Permutations
# Difficulty: Medium
# Link: https://leetcode.com/problems/permutations/

from typing import List
from itertools import permutations as _permutations

# ─────────────────────────────────────────────
# APPROACH 1: Backtracking with Swap | O(n!·n) time | O(n) space
# EXPLAIN: Fix each element at the start position by swapping, recurse, then swap back.
# WHEN: Most space-efficient backtracking — no extra used-array needed.

def permute_swap(nums: List[int]) -> List[List[int]]:
    result = []

    def backtrack(start):
        if start == len(nums):
            result.append(list(nums))
            return
        for i in range(start, len(nums)):
            nums[start], nums[i] = nums[i], nums[start]
            backtrack(start + 1)
            nums[start], nums[i] = nums[i], nums[start]

    backtrack(0)
    return result


# APPROACH 2: Backtracking with Used Array | O(n!·n) time | O(n) space
# EXPLAIN: Build permutation element-by-element tracking which elements are already used.
# WHEN: More intuitive for beginners; easy to adapt to Permutations II.

def permute_used(nums: List[int]) -> List[List[int]]:
    result = []
    used = [False] * len(nums)

    def backtrack(current):
        if len(current) == len(nums):
            result.append(list(current))
            return
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True
            current.append(nums[i])
            backtrack(current)
            current.pop()
            used[i] = False

    backtrack([])
    return result


# APPROACH 3: Iterative Insertion | O(n!·n) time | O(1) space
# EXPLAIN: Insert each new element at every possible position in all existing permutations.
# WHEN: No recursion; builds permutations layer by layer.

def permute_iterative(nums: List[int]) -> List[List[int]]:
    result = [[]]
    for num in nums:
        new_result = []
        for perm in result:
            for i in range(len(perm) + 1):
                new_result.append(perm[:i] + [num] + perm[i:])
        result = new_result
    return result


# APPROACH 4: Using itertools | O(n!·n) time | O(1) space
# EXPLAIN: Delegate to Python's built-in permutations generator.
# WHEN: Fastest to write; acceptable in non-interview settings.

def permute_itertools(nums: List[int]) -> List[List[int]]:
    return [list(p) for p in _permutations(nums)]


# APPROACH 5: Standard (entry point — swap backtracking) | O(n!·n) time | O(n) space
# EXPLAIN: Standard canonical solution used in LeetCode submissions.
# WHEN: Default choice when asked to implement permutations.

def permute(nums: List[int]) -> List[List[int]]:
    return permute_swap(nums)


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    def normalise(perms):
        return sorted(sorted(p) for p in perms)  # use sorted tuples for comparison

    def normalise_exact(perms):
        return sorted(tuple(p) for p in perms)

    cases = [
        [1, 2, 3],
        [0, 1],
        [1],
    ]
    for fn in (permute_swap, permute_used, permute_iterative, permute_itertools, permute):
        for nums in cases:
            result = normalise_exact(fn(list(nums)))
            expected = normalise_exact(list(_permutations(nums)))
            assert result == expected, f'{fn.__name__}({nums}) mismatch'
    print('All tests passed.')

# Made with Bob
