# LeetCode Problem #139: Word Break
# Difficulty: Medium
# Link: https://leetcode.com/problems/word-break/

from functools import lru_cache
from typing import List
from collections import deque

# ─────────────────────────────────────────────
# APPROACH 1: Recursive Memoization | O(n³) time | O(n) space
# EXPLAIN: Try every prefix at each position; cache whether suffix starting at i can be broken.
# WHEN: Natural recursive formulation; good for deriving the recurrence on a whiteboard.

def wordBreak_memo(s: str, wordDict: List[str]) -> bool:
    words = set(wordDict)
    n = len(s)

    @lru_cache(maxsize=None)
    def dp(i):
        if i == n:
            return True
        return any(s[i:j] in words and dp(j) for j in range(i + 1, n + 1))

    return dp(0)


# APPROACH 2: Bottom-Up DP | O(n³) time | O(n) space
# EXPLAIN: dp[i] = True if s[:i] can be segmented; extend from every valid earlier split point.
# WHEN: Standard iterative DP — clear, no recursion limit risk.

def wordBreak_dp(s: str, wordDict: List[str]) -> bool:
    words = set(wordDict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[n]


# APPROACH 3: BFS | O(n³) time | O(n) space
# EXPLAIN: BFS from index 0; each valid word from current position enqueues new index.
# WHEN: Useful for building intuition via graph traversal — each position is a node.

def wordBreak_bfs(s: str, wordDict: List[str]) -> bool:
    if not s:
        return True
    words = set(wordDict)
    n = len(s)
    visited = set()
    queue = deque([0])
    while queue:
        start = queue.popleft()
        if start in visited:
            continue
        visited.add(start)
        for end in range(start + 1, n + 1):
            if s[start:end] in words:
                if end == n:
                    return True
                queue.append(end)
    return False


# APPROACH 4: DP with Max-Length Optimization | O(n*maxLen) time | O(n) space
# EXPLAIN: Only check substrings of length up to the longest word; skips redundant checks.
# WHEN: When the dictionary has a bounded max word length — minor practical speedup.

def wordBreak_optimized(s: str, wordDict: List[str]) -> bool:
    words = set(wordDict)
    max_len = max((len(w) for w in wordDict), default=0)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for j in range(max(0, i - max_len), i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[n]


# APPROACH 5: Trie + DP | O(n²) time | O(total_chars) space
# EXPLAIN: Insert all words into a trie; from each reachable position walk the trie forward.
# WHEN: Large dictionaries where avoiding repeated hash lookups matters.

def wordBreak_trie(s: str, wordDict: List[str]) -> bool:
    # Build trie
    root = {}
    for word in wordDict:
        node = root
        for ch in word:
            node = node.setdefault(ch, {})
        node['#'] = True  # end marker

    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(n):
        if not dp[i]:
            continue
        node = root
        for j in range(i, n):
            ch = s[j]
            if ch not in node:
                break
            node = node[ch]
            if '#' in node:
                dp[j + 1] = True
    return dp[n]


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [
        ('leetcode', ['leet', 'code'], True),
        ('applepenapple', ['apple', 'pen'], True),
        ('catsandog', ['cats', 'dog', 'sand', 'and', 'cat'], False),
        ('', ['a'], True),
        ('a', ['b'], False),
    ]
    for fn in (wordBreak_memo, wordBreak_dp, wordBreak_bfs, wordBreak_optimized, wordBreak_trie):
        for s, wd, expected in cases:
            result = fn(s, wd)
            assert result == expected, (
                f'{fn.__name__}({s!r}) = {result}, expected {expected}'
            )
    print('All tests passed.')

# Made with Bob
