# LeetCode Problem #39: Combination Sum
# Difficulty: Medium
# Link: https://leetcode.com/problems/combination-sum/

from typing import List

# ─────────────────────────────────────────────
# APPROACH 1: Backtracking with Reuse | O(N^(T/M)) time | O(T/M) space
# EXPLAIN: For each candidate try including it (reuse allowed) by not incrementing start index.
# WHEN: Classic backtracking — simple and correct.

def combinationSum_backtrack(candidates: List[int], target: int) -> List[List[int]]:
    result = []

    def backtrack(start, current, remaining):
        if remaining == 0:
            result.append(list(current))
            return
        if remaining < 0:
            return
        for i in range(start, len(candidates)):
            current.append(candidates[i])
            backtrack(i, current, remaining - candidates[i])   # reuse: pass i not i+1
            current.pop()

    backtrack(0, [], target)
    return result


# APPROACH 2: Backtracking with Early Pruning | O(N^(T/M)) time | O(T/M) space
# EXPLAIN: Sort candidates; break early when candidate exceeds remaining target.
# WHEN: Better practical performance — prunes branches early for sorted input.

def combinationSum_pruned(candidates: List[int], target: int) -> List[List[int]]:
    candidates.sort()
    result = []

    def backtrack(start, current, remaining):
        if remaining == 0:
            result.append(list(current))
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break          # sorted → no later candidate will fit
            current.append(candidates[i])
            backtrack(i, current, remaining - candidates[i])
            current.pop()

    backtrack(0, [], target)
    return result


# APPROACH 3: Include/Exclude Decision Tree | O(N^(T/M)) time | O(T/M) space
# EXPLAIN: At each index explicitly choose include-again or move to next candidate.
# WHEN: Illustrates the decision-tree structure most clearly.

def combinationSum_choice(candidates: List[int], target: int) -> List[List[int]]:
    result = []

    def backtrack(index, current, remaining):
        if remaining == 0:
            result.append(list(current))
            return
        if index >= len(candidates) or remaining < 0:
            return
        # Include current candidate (can reuse — pass same index)
        current.append(candidates[index])
        backtrack(index, current, remaining - candidates[index])
        current.pop()
        # Exclude current candidate (move forward)
        backtrack(index + 1, current, remaining)

    backtrack(0, [], target)
    return result


# APPROACH 4: Dynamic Programming | O(N·T·K) time | O(T·K) space
# EXPLAIN: Build combinations bottom-up for each sum 0..target; deduplicate by sorting.
# WHEN: Educational DP perspective; not optimal for large T.

def combinationSum_dp(candidates: List[int], target: int) -> List[List[int]]:
    dp: List[List[List[int]]] = [[] for _ in range(target + 1)]
    dp[0] = [[]]
    for s in range(1, target + 1):
        for c in candidates:
            if c <= s:
                for combo in dp[s - c]:
                    new_combo = sorted(combo + [c])
                    if new_combo not in dp[s]:
                        dp[s].append(new_combo)
    return dp[target]


# APPROACH 5: Standard (entry point — pruned backtracking) | O(N^(T/M)) time | O(T/M) space
# EXPLAIN: Standard canonical solution used in LeetCode submissions.
# WHEN: Default choice when asked to implement combination sum.

def combinationSum(candidates: List[int], target: int) -> List[List[int]]:
    return combinationSum_pruned(candidates, target)


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    def normalise(combos):
        return sorted(sorted(c) for c in combos)

    cases = [
        ([2, 3, 6, 7], 7,  [[2, 2, 3], [7]]),
        ([2, 3, 5],    8,  [[2, 2, 2, 2], [2, 3, 3], [3, 5]]),
        ([2],          1,  []),
    ]
    fns = [combinationSum_backtrack, combinationSum_pruned,
           combinationSum_choice, combinationSum_dp, combinationSum]
    for fn in fns:
        for cands, target, expected in cases:
            result = normalise(fn(list(cands), target))
            assert result == normalise(expected), f'{fn.__name__} mismatch'
    print('All tests passed.')

# Made with Bob
