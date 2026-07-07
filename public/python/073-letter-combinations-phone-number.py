# LeetCode Problem #17: Letter Combinations of a Phone Number
# Difficulty: Medium
# Link: https://leetcode.com/problems/letter-combinations-of-a-phone-number/

from typing import List
from collections import deque

MAPPING = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"]

# ─────────────────────────────────────────────
# APPROACH 1: Backtracking | O(4ⁿ·n) time | O(n) space
# EXPLAIN: Build combinations character-by-character; backtrack after each letter choice.
# WHEN: Classic backtracking template — clean and O(n) auxiliary space.

def letterCombinations_backtrack(digits: str) -> List[str]:
    if not digits:
        return []
    result = []

    def backtrack(index, current):
        if index == len(digits):
            result.append(''.join(current))
            return
        for ch in MAPPING[int(digits[index])]:
            current.append(ch)
            backtrack(index + 1, current)
            current.pop()

    backtrack(0, [])
    return result


# APPROACH 2: BFS with Queue | O(4ⁿ·n) time | O(4ⁿ) space
# EXPLAIN: Treat each digit as a BFS level; extend all partial combinations with each letter.
# WHEN: Iterative approach using a queue — intuitive level-by-level expansion.

def letterCombinations_bfs(digits: str) -> List[str]:
    if not digits:
        return []
    queue = deque([''])
    for digit in digits:
        letters = MAPPING[int(digit)]
        for _ in range(len(queue)):
            prefix = queue.popleft()
            for ch in letters:
                queue.append(prefix + ch)
    return list(queue)


# APPROACH 3: Iterative with Vector | O(4ⁿ·n) time | O(4ⁿ) space
# EXPLAIN: Start with [''] and replace with all extensions for each digit.
# WHEN: Simplest iterative approach; no extra queue data structure needed.

def letterCombinations_iterative(digits: str) -> List[str]:
    if not digits:
        return []
    result = ['']
    for digit in digits:
        letters = MAPPING[int(digit)]
        result = [prev + ch for prev in result for ch in letters]
    return result


# APPROACH 4: Pure Recursive (no helper) | O(4ⁿ·n) time | O(4ⁿ) space
# EXPLAIN: Recurse on the remaining digits; prepend first digit's letters to sub-results.
# WHEN: Functional recursive style — no mutation of shared state.

def letterCombinations_recursive(digits: str) -> List[str]:
    if not digits:
        return []
    if len(digits) == 1:
        return list(MAPPING[int(digits[0])])
    sub = letterCombinations_recursive(digits[1:])
    return [ch + s for ch in MAPPING[int(digits[0])] for s in sub]


# APPROACH 5: Standard (entry point — backtracking) | O(4ⁿ·n) time | O(n) space
# EXPLAIN: Standard canonical solution used in LeetCode submissions.
# WHEN: Default choice when asked to implement letter combinations.

def letterCombinations(digits: str) -> List[str]:
    return letterCombinations_backtrack(digits)


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [
        ("23", sorted(["ad","ae","af","bd","be","bf","cd","ce","cf"])),
        ("",   []),
        ("2",  sorted(["a", "b", "c"])),
    ]
    fns = [letterCombinations_backtrack, letterCombinations_bfs,
           letterCombinations_iterative, letterCombinations_recursive,
           letterCombinations]
    for fn in fns:
        for digits, expected in cases:
            assert sorted(fn(digits)) == expected, f'{fn.__name__}({digits!r}) mismatch'
    print('All tests passed.')

# Made with Bob
