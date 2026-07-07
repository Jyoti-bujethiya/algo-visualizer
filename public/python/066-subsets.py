# LeetCode Problem #78: Subsets
# Difficulty: Medium
# Link: https://leetcode.com/problems/subsets/

from typing import List

# ─────────────────────────────────────────────
# APPROACH 1: Backtracking (DFS) | O(n·2ⁿ) time | O(n) space
# EXPLAIN: At each index add current list to result then try including each remaining element.
# WHEN: Classic backtracking template — extend to handle duplicates or constraints easily.

def subsets_backtrack(nums: List[int]) -> List[List[int]]:
    result = []

    def backtrack(start, current):
        result.append(list(current))
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()

    backtrack(0, [])
    return result


# APPROACH 2: Iterative Cascading | O(n·2ⁿ) time | O(1) space
# EXPLAIN: Start with [[]]; for each number copy all existing subsets and append number.
# WHEN: Clean iterative approach without recursion or bit manipulation.

def subsets_iterative(nums: List[int]) -> List[List[int]]:
    result = [[]]
    for num in nums:
        result += [subset + [num] for subset in result]
    return result


# APPROACH 3: Bit Manipulation | O(n·2ⁿ) time | O(1) space
# EXPLAIN: Each integer 0..(2ⁿ-1) represents a bitmask; bit k set → include nums[k].
# WHEN: Elegant non-recursive solution; great when you want to generate subsets as integers.

def subsets_bitmask(nums: List[int]) -> List[List[int]]:
    n = len(nums)
    result = []
    for mask in range(1 << n):
        subset = [nums[k] for k in range(n) if mask >> k & 1]
        result.append(subset)
    return result


# APPROACH 4: Include/Exclude Binary Decision | O(n·2ⁿ) time | O(n) space
# EXPLAIN: At each index explicitly branch — exclude element or include it; collect at leaves.
# WHEN: Illustrates the decision-tree structure most clearly for teaching.

def subsets_include_exclude(nums: List[int]) -> List[List[int]]:
    result = []

    def dfs(idx, current):
        if idx == len(nums):
            result.append(list(current))
            return
        dfs(idx + 1, current)              # exclude
        current.append(nums[idx])
        dfs(idx + 1, current)              # include
        current.pop()

    dfs(0, [])
    return result


# APPROACH 5: Standard (alias — backtracking) | O(n·2ⁿ) time | O(n) space
# EXPLAIN: Standard canonical solution used in LeetCode submissions.
# WHEN: Default choice when asked to implement subsets.

def subsets(nums: List[int]) -> List[List[int]]:
    return subsets_backtrack(nums)


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    def normalise(subsets):
        return sorted(sorted(s) for s in subsets)

    cases = [
        ([1, 2, 3], [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]),
        ([0], [[], [0]]),
    ]
    for fn in (subsets_backtrack, subsets_iterative, subsets_bitmask,
               subsets_include_exclude, subsets):
        for nums, expected in cases:
            result = normalise(fn(nums))
            exp = normalise(expected)
            assert result == exp, f'{fn.__name__}({nums}) mismatch'
    print('All tests passed.')

# Made with Bob
