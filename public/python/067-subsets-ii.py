# LeetCode Problem #90: Subsets II
# Difficulty: Medium
# Link: https://leetcode.com/problems/subsets-ii/

from typing import List
from collections import Counter

# ─────────────────────────────────────────────
# APPROACH 1: Backtracking with Skip Duplicates | O(n·2ⁿ) time | O(n) space
# EXPLAIN: Sort array, then skip duplicate elements at the same recursion level.
# WHEN: Standard go-to — correct, efficient, easy to explain in interviews.

def subsetsWithDup_backtrack(nums: List[int]) -> List[List[int]]:
    nums.sort()
    result = []

    def backtrack(start, current):
        result.append(list(current))
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]:
                continue          # skip duplicate at same level
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()

    backtrack(0, [])
    return result


# APPROACH 2: Iterative Cascading with Duplicate Handling | O(n·2ⁿ) time | O(1) space
# EXPLAIN: Track how many subsets were added in the last round; for duplicates only extend those.
# WHEN: Iterative preference; avoids recursion while correctly handling duplicates.

def subsetsWithDup_iterative(nums: List[int]) -> List[List[int]]:
    nums.sort()
    result = [[]]
    last_added_count = 0

    for i in range(len(nums)):
        start = len(result) - last_added_count if i > 0 and nums[i] == nums[i - 1] else 0
        current_size = len(result)
        for j in range(start, current_size):
            result.append(result[j] + [nums[i]])
        last_added_count = current_size - start

    return result


# APPROACH 3: Frequency Map Backtracking | O(n·2ⁿ) time | O(n) space
# EXPLAIN: Count each unique element's frequency; for each unique element try 0..freq copies.
# WHEN: Elegant when duplicates are heavy; no need to sort or reason about index skipping.

def subsetsWithDup_freq(nums: List[int]) -> List[List[int]]:
    freq = sorted(Counter(nums).items())
    result = []

    def backtrack(idx, current):
        if idx == len(freq):
            result.append(list(current))
            return
        num, count = freq[idx]
        for times in range(count + 1):
            for _ in range(times):
                current.append(num)
            backtrack(idx + 1, current)
            for _ in range(times):
                current.pop()

    backtrack(0, [])
    return result


# APPROACH 4: Bit Manipulation with Set | O(n·2ⁿ·log(2ⁿ)) time | O(n·2ⁿ) space
# EXPLAIN: Generate all 2ⁿ subsets via bitmask; insert into a set to deduplicate.
# WHEN: Simplest to code from scratch; less efficient due to set overhead.

def subsetsWithDup_bitmask(nums: List[int]) -> List[List[int]]:
    nums.sort()
    n = len(nums)
    seen = set()
    result = []
    for mask in range(1 << n):
        subset = tuple(nums[i] for i in range(n) if mask >> i & 1)
        if subset not in seen:
            seen.add(subset)
            result.append(list(subset))
    return result


# APPROACH 5: Cascading (Standard) | O(n·2ⁿ) time | O(1) space
# EXPLAIN: Same as iterative cascading — the canonical clean version.
# WHEN: Default clean iterative submission choice.

def subsetsWithDup(nums: List[int]) -> List[List[int]]:
    return subsetsWithDup_iterative(nums)


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    def normalise(subsets):
        return sorted(sorted(s) for s in subsets)

    cases = [
        ([1, 2, 2], [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]),
        ([0],        [[], [0]]),
        ([1, 1, 1],  [[], [1], [1, 1], [1, 1, 1]]),
    ]
    fns = [subsetsWithDup_backtrack, subsetsWithDup_iterative,
           subsetsWithDup_freq, subsetsWithDup_bitmask, subsetsWithDup]
    for fn in fns:
        for nums, expected in cases:
            assert normalise(fn(list(nums))) == normalise(expected), \
                f'{fn.__name__}({nums}) mismatch'
    print('All tests passed.')

# Made with Bob
