# LeetCode Problem #76: Minimum Window Substring
# Difficulty: Hard
# Link: https://leetcode.com/problems/minimum-window-substring/

from collections import Counter

# ─────────────────────────────────────────────
# APPROACH 1: Brute Force | O(n²·m) time | O(m) space
# EXPLAIN: Check every substring of s and test whether it contains all characters of t.
# WHEN: Demonstration only — O(n²) substrings each costing O(m) is far too slow for large inputs.

def min_window_brute(s: str, t: str) -> str:
    need = Counter(t)
    n = len(s)
    best_len = float('inf')
    best_start = 0

    def contains(window_count: Counter) -> bool:
        return all(window_count[ch] >= need[ch] for ch in need)

    for i in range(n):
        window: Counter = Counter()
        for j in range(i, n):
            window[s[j]] += 1
            if contains(window) and (j - i + 1) < best_len:
                best_len   = j - i + 1
                best_start = i
                break                        # can't shrink from left here, so move on

    return s[best_start: best_start + best_len] if best_len != float('inf') else ""


# ─────────────────────────────────────────────
# APPROACH 2: Sliding Window | O(n + m) time | O(m) space
# EXPLAIN: Expand right until the window is valid, then shrink left while maintaining validity, recording minimums.
# WHEN: The optimal approach — handles all edge cases in a single linear pass.

def min_window_sliding(s: str, t: str) -> str:
    if not t or not s:
        return ""
    need    = Counter(t)
    missing = len(t)            # total characters still required
    best    = ""
    lo      = 0

    for hi, ch in enumerate(s):
        if need[ch] > 0:
            missing -= 1
        need[ch] -= 1

        if missing == 0:        # window is valid — try to shrink
            while need[s[lo]] < 0:
                need[s[lo]] += 1
                lo += 1
            window = s[lo: hi + 1]
            if not best or len(window) < len(best):
                best = window
            # slide: remove s[lo] so window becomes invalid again
            need[s[lo]] += 1
            missing += 1
            lo += 1

    return best


# ─────────────────────────────────────────────
# APPROACH 3: Optimized with Array | O(n + m) time | O(1) space
# EXPLAIN: Same sliding window logic but uses a 128-element int array instead of a Counter for speed.
# WHEN: When input is guaranteed ASCII — array lookups are faster than dict operations.

def min_window_array(s: str, t: str) -> str:
    if not s or not t:
        return ""
    need = [0] * 128
    for ch in t:
        need[ord(ch)] += 1
    required = sum(1 for f in need if f > 0)

    window = [0] * 128
    formed = 0
    lo = 0
    best_lo = 0
    best_len = float('inf')

    for hi, ch in enumerate(s):
        code = ord(ch)
        window[code] += 1
        if need[code] > 0 and window[code] == need[code]:
            formed += 1
        while formed == required:
            if hi - lo + 1 < best_len:
                best_len = hi - lo + 1
                best_lo  = lo
            lc = ord(s[lo])
            if need[lc] > 0 and window[lc] == need[lc]:
                formed -= 1
            window[lc] -= 1
            lo += 1

    return s[best_lo: best_lo + best_len] if best_len != float('inf') else ""


# ─────────────────────────────────────────────
if __name__ == "__main__":
    cases = [
        ("ADOBECODEBANC", "ABC", "BANC"),
        ("a",             "a",   "a"),
        ("a",             "aa",  ""),
    ]
    for s, t, expected in cases:
        assert min_window_brute(s, t)   == expected, f"brute failed: {s!r}, {t!r}"
        assert min_window_sliding(s, t) == expected, f"sliding failed: {s!r}, {t!r}"
        assert min_window_array(s, t)   == expected, f"array failed: {s!r}, {t!r}"
    print("All tests passed.")

# Made with Bob
