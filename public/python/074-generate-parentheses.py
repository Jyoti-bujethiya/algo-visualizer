# LeetCode Problem #22: Generate Parentheses
# Difficulty: Medium
# Link: https://leetcode.com/problems/generate-parentheses/

from typing import List
from collections import deque

# ─────────────────────────────────────────────
# APPROACH 1: Backtracking (Optimal) | O(4ⁿ/√n) time | O(n) space
# EXPLAIN: Add '(' if open<n; add ')' if close<open; collect when length==2n.
# WHEN: Cleanest, most efficient — standard interview answer.

def generateParenthesis_backtrack(n: int) -> List[str]:
    result = []

    def backtrack(current, open_count, close_count):
        if len(current) == 2 * n:
            result.append(current)
            return
        if open_count < n:
            backtrack(current + '(', open_count + 1, close_count)
        if close_count < open_count:
            backtrack(current + ')', open_count, close_count + 1)

    backtrack('', 0, 0)
    return result


# APPROACH 2: Backtracking with String Reference | O(4ⁿ/√n) time | O(n) space
# EXPLAIN: Same logic but mutates a list and joins at the leaf — avoids string concatenation.
# WHEN: More memory-efficient in languages without string interning; shows backtrack-restore.

def generateParenthesis_ref(n: int) -> List[str]:
    result = []

    def backtrack(current, open_count, close_count):
        if len(current) == 2 * n:
            result.append(''.join(current))
            return
        if open_count < n:
            current.append('(')
            backtrack(current, open_count + 1, close_count)
            current.pop()
        if close_count < open_count:
            current.append(')')
            backtrack(current, open_count, close_count + 1)
            current.pop()

    backtrack([], 0, 0)
    return result


# APPROACH 3: Closure Number (Mathematical / Recursive) | O(4ⁿ/√n) time | O(4ⁿ/√n) space
# EXPLAIN: Any valid combination is '(' + inside + ')' + after where inside has i pairs.
# WHEN: Elegant mathematical decomposition; shows Catalan number recurrence.

def generateParenthesis_closure(n: int) -> List[str]:
    if n == 0:
        return ['']
    result = []
    for i in range(n):
        for left in generateParenthesis_closure(i):
            for right in generateParenthesis_closure(n - 1 - i):
                result.append('(' + left + ')' + right)
    return result


# APPROACH 4: Dynamic Programming (Bottom-Up) | O(4ⁿ/√n) time | O(4ⁿ/√n) space
# EXPLAIN: dp[k] = all valid combinations with k pairs; build from dp[0..k-1] using closure number.
# WHEN: Demonstrates DP perspective; avoids recomputing subproblems in the closure approach.

def generateParenthesis_dp(n: int) -> List[str]:
    dp: List[List[str]] = [[] for _ in range(n + 1)]
    dp[0] = ['']
    for k in range(1, n + 1):
        for i in range(k):
            for left in dp[i]:
                for right in dp[k - 1 - i]:
                    dp[k].append('(' + left + ')' + right)
    return dp[n]


# APPROACH 5: BFS/Iterative with Stack | O(4ⁿ/√n) time | O(4ⁿ/√n) space
# EXPLAIN: Use a stack of (string, open, close) states; expand valid next states iteratively.
# WHEN: Iterative preference; avoids recursion entirely.

def generateParenthesis_bfs(n: int) -> List[str]:
    result = []
    stack = [('', 0, 0)]
    while stack:
        current, open_count, close_count = stack.pop()
        if len(current) == 2 * n:
            result.append(current)
            continue
        if open_count < n:
            stack.append((current + '(', open_count + 1, close_count))
        if close_count < open_count:
            stack.append((current + ')', open_count, close_count + 1))
    return result


def generateParenthesis(n: int) -> List[str]:
    return generateParenthesis_backtrack(n)


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    expected_3 = sorted(["((()))","(()())","(())()","()(())","()()()"])
    expected_1 = ["()"]

    fns = [generateParenthesis_backtrack, generateParenthesis_ref,
           generateParenthesis_closure, generateParenthesis_dp,
           generateParenthesis_bfs, generateParenthesis]
    for fn in fns:
        assert sorted(fn(3)) == expected_3, f'{fn.__name__}(3) mismatch'
        assert sorted(fn(1)) == expected_1, f'{fn.__name__}(1) mismatch'
    print('All tests passed.')

# Made with Bob
