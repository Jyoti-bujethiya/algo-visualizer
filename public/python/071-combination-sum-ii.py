# LeetCode Problem #40: Combination Sum II
# Difficulty: Medium
# Link: https://leetcode.com/problems/combination-sum-ii/

from typing import List
from collections import Counter

# ─────────────────────────────────────────────
# APPROACH 1: Backtracking with Skip Duplicates | O(2^n) time | O(n) space
# EXPLAIN: Sort array; skip element if it equals the previous element at the same recursion level.
# WHEN: Standard interview solution — correct, efficient, easy to explain.

def combinationSum2_backtrack(candidates: List[int], target: int) -> List[List[int]]:
    candidates.sort()
    result = []

    def backtrack(start, current, remaining):
        if remaining == 0:
            result.append(list(current))
            return
        for i in range(start, len(candidates)):
            if i > start and candidates[i] == candidates[i - 1]:
                continue          # skip duplicate at same level
            if candidates[i] > remaining:
                break
            current.append(candidates[i])
            backtrack(i + 1, current, remaining - candidates[i])  # no reuse: i+1
            current.pop()

    backtrack(0, [], target)
    return result


# APPROACH 2: Frequency Map Backtracking | O(2^n) time | O(n) space
# EXPLAIN: Count element frequencies; for each unique element try 0..min(freq,target/val) copies.
# WHEN: Elegant when duplicates are heavy; multiplicities handled naturally.

def combinationSum2_freq(candidates: List[int], target: int) -> List[List[int]]:
    freq = sorted(Counter(candidates).items())
    result = []

    def backtrack(idx, current, remaining):
        if remaining == 0:
            result.append(list(current))
            return
        if idx == len(freq):
            return
        num, count = freq[idx]
        for times in range(min(count, remaining // num) + 1):
            for _ in range(times):
                current.append(num)
            backtrack(idx + 1, current, remaining - num * times)
            for _ in range(times):
                current.pop()

    backtrack(0, [], target)
    return result


# APPROACH 3: Backtracking with Used Array | O(2^n) time | O(n) space
# EXPLAIN: Sort array; use a boolean used-array; skip nums[i]==nums[i-1] when nums[i-1] is unused.
# WHEN: Same dedup logic as Permutations II; useful when the used-array pattern is already familiar.

def combinationSum2_used(candidates: List[int], target: int) -> List[List[int]]:
    candidates.sort()
    result = []
    used = [False] * len(candidates)

    def backtrack(start, current, remaining):
        if remaining == 0:
            result.append(list(current))
            return
        for i in range(start, len(candidates)):
            if used[i]:
                continue
            if i > 0 and candidates[i] == candidates[i - 1] and not used[i - 1]:
                continue
            if candidates[i] > remaining:
                break
            used[i] = True
            current.append(candidates[i])
            backtrack(i + 1, current, remaining - candidates[i])
            current.pop()
            used[i] = False

    backtrack(0, [], target)
    return result


# APPROACH 4: Bit Manipulation with Set | O(2^n·n) time | O(2^n) space
# EXPLAIN: Try all subsets via bitmask; collect those that sum to target; deduplicate via set.
# WHEN: Brute-force fallback; easy to code when n is small.

def combinationSum2_bitmask(candidates: List[int], target: int) -> List[List[int]]:
    candidates.sort()
    n = len(candidates)
    seen = set()
    result = []
    for mask in range(1 << n):
        subset = [candidates[i] for i in range(n) if mask >> i & 1]
        if sum(subset) == target:
            key = tuple(subset)
            if key not in seen:
                seen.add(key)
                result.append(subset)
    return result


# APPROACH 5: Standard (entry point) | O(2^n) time | O(n) space
# EXPLAIN: Standard canonical solution used in LeetCode submissions.
# WHEN: Default choice when asked to implement combination sum ii.

def combinationSum2(candidates: List[int], target: int) -> List[List[int]]:
    return combinationSum2_backtrack(candidates, target)


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    def normalise(combos):
        return sorted(sorted(c) for c in combos)

    cases = [
        ([10, 1, 2, 7, 6, 1, 5], 8, [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]),
        ([2, 5, 2, 1, 2], 5, [[1, 2, 2], [5]]),
        ([2, 3, 5], 1, []),
    ]
    fns = [combinationSum2_backtrack, combinationSum2_freq,
           combinationSum2_used, combinationSum2_bitmask, combinationSum2]
    for fn in fns:
        for cands, t, expected in cases:
            assert normalise(fn(list(cands), t)) == normalise(expected), \
                f'{fn.__name__} mismatch'
    print('All tests passed.')

# Made with Bob
