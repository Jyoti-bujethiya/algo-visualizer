# LeetCode Problem #3: Longest Substring Without Repeating Characters
# Difficulty: Medium
# Link: https://leetcode.com/problems/longest-substring-without-repeating-characters/

# ─────────────────────────────────────────────
# APPROACH 1: Brute Force | O(n³) time | O(min(m,n)) space
# EXPLAIN: Generate all substrings with two loops; check each for duplicates using a set.
# WHEN: Tiny inputs only — establishes the baseline before sliding window solutions.

def length_of_longest_brute(s: str) -> int:
    n = len(s)
    best = 0
    for i in range(n):
        for j in range(i + 1, n + 1):
            if len(set(s[i:j])) == j - i:   # all unique
                best = max(best, j - i)
    return best


# ─────────────────────────────────────────────
# APPROACH 2: Sliding Window with Set | O(n) time | O(min(m,n)) space
# EXPLAIN: Maintain a set of characters in the current window; shrink from the left when a repeat is found.
# WHEN: Clean and intuitive — great for explaining the sliding window pattern in interviews.

def length_of_longest_sliding_window(s: str) -> int:
    char_set: set[str] = set()
    lo = best = 0
    for hi, ch in enumerate(s):
        while ch in char_set:
            char_set.remove(s[lo])
            lo += 1
        char_set.add(ch)
        best = max(best, hi - lo + 1)
    return best


# ─────────────────────────────────────────────
# APPROACH 3: Sliding Window with HashMap | O(n) time | O(min(m,n)) space
# EXPLAIN: Store the last-seen index of each character; jump the left pointer directly past the duplicate.
# WHEN: Slightly fewer iterations in practice — preferred when you want to minimise pointer movements.

def length_of_longest_optimised(s: str) -> int:
    last_seen: dict[str, int] = {}
    lo = best = 0
    for hi, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] >= lo:
            lo = last_seen[ch] + 1            # jump past the previous occurrence
        last_seen[ch] = hi
        best = max(best, hi - lo + 1)
    return best


# ─────────────────────────────────────────────
# APPROACH 4: Array Instead of HashMap | O(n) time | O(1) space
# EXPLAIN: Use a 128-element integer array indexed by ASCII code instead of a hash map.
# WHEN: When input is guaranteed ASCII — array lookups avoid hash overhead for maximum speed.

def length_of_longest_array(s: str) -> int:
    char_index = [-1] * 128   # index of last seen position for each ASCII char
    lo = best = 0
    for hi, ch in enumerate(s):
        code = ord(ch)
        if char_index[code] >= lo:
            lo = char_index[code] + 1
        char_index[code] = hi
        best = max(best, hi - lo + 1)
    return best


# ─────────────────────────────────────────────
if __name__ == "__main__":
    cases = [
        ("abcabcbb", 3),
        ("bbbbb",    1),
        ("pwwkew",   3),
        ("",         0),
    ]
    for s, expected in cases:
        assert length_of_longest_brute(s)           == expected
        assert length_of_longest_sliding_window(s)  == expected
        assert length_of_longest_optimised(s)       == expected
        assert length_of_longest_array(s)           == expected
    print("All tests passed.")

# Made with Bob
