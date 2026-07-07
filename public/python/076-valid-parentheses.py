# LeetCode Problem #76: Valid Parentheses
# Difficulty: Easy
# Link: https://leetcode.com/problems/valid-parentheses/

# APPROACH 1: Stack | O(n) time | O(n) space
# EXPLAIN: Push opening brackets onto stack; on closing bracket, check top matches.
# WHEN: Default approach — clean, linear, handles all bracket types.

def isValid_stack(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for ch in s:
        if ch in mapping:
            top = stack.pop() if stack else '#'
            if mapping[ch] != top:
                return False
        else:
            stack.append(ch)
    return not stack


# APPROACH 2: Stack with early exit | O(n) time | O(n) space
# EXPLAIN: Same stack idea but prune impossible cases early (odd length, starts with closer).
# WHEN: Slight optimisation when inputs are often invalid.

def isValid_early_exit(s: str) -> bool:
    if len(s) % 2 != 0:
        return False
    stack = []
    pairs = {'(': ')', '{': '}', '[': ']'}
    for ch in s:
        if ch in pairs:
            stack.append(pairs[ch])
        else:
            if not stack or stack[-1] != ch:
                return False
            stack.pop()
    return not stack


# APPROACH 3: Replace pairs iteratively | O(n²) time | O(n) space
# EXPLAIN: Repeatedly strip innermost matching pairs until string is empty or no change.
# WHEN: Academic / interview curiosity — shows string reduction; avoid in production.

def isValid_replace(s: str) -> bool:
    prev = None
    while prev != s:
        prev = s
        for pair in ('()', '{}', '[]'):
            s = s.replace(pair, '')
    return s == ''


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [
        ('()', True),
        ('()[}', False),
        ('{[]}', True),
        ('([)]', False),
        ('', True),
    ]
    for fn in (isValid_stack, isValid_early_exit, isValid_replace):
        for s, expected in cases:
            assert fn(s) == expected, f'{fn.__name__}({s!r}) failed'
    print('All tests passed.')

# Made with Bob
