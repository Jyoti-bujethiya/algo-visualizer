# LeetCode Problem #20: Valid Parentheses
# Difficulty: Easy
# Link: https://leetcode.com/problems/valid-parentheses/

# ─────────────────────────────────────────────
# APPROACH 1: Stack | O(n) time | O(n) space
# EXPLAIN: Push opening brackets onto a stack; for every closing bracket check it matches the top.
# WHEN: The standard solution — handles all three bracket types correctly and is easy to extend.

def is_valid_stack(s: str) -> bool:
    matching = {')': '(', ']': '[', '}': '{'}
    stack: list[str] = []
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        elif ch in ')]}':
            if not stack or stack[-1] != matching[ch]:
                return False
            stack.pop()
    return len(stack) == 0


# ─────────────────────────────────────────────
# APPROACH 2: Stack with Switch | O(n) time | O(n) space
# EXPLAIN: Same stack logic but uses explicit if/elif chains instead of a dict for matching.
# WHEN: When you want to avoid the dictionary lookup overhead at the cost of slightly more verbose code.

def is_valid_switch(s: str) -> bool:
    stack: list[str] = []
    for ch in s:
        if ch in ('(', '[', '{'):
            stack.append(ch)
        elif ch == ')':
            if not stack or stack[-1] != '(':
                return False
            stack.pop()
        elif ch == ']':
            if not stack or stack[-1] != '[':
                return False
            stack.pop()
        elif ch == '}':
            if not stack or stack[-1] != '{':
                return False
            stack.pop()
    return len(stack) == 0


# ─────────────────────────────────────────────
# APPROACH 3: Replace Method | O(n²) time | O(n) space
# EXPLAIN: Repeatedly remove valid adjacent bracket pairs until the string is empty or no pairs remain.
# WHEN: Never (inefficient) — included as an intuitive but slow illustration of the idea.

def is_valid_replace(s: str) -> bool:
    while '()' in s or '[]' in s or '{}' in s:
        s = s.replace('()', '').replace('[]', '').replace('{}', '')
    return s == ''


# ─────────────────────────────────────────────
if __name__ == "__main__":
    stack_cases = [
        ("()",       True),
        ("()[]{}",   True),
        ("(]",       False),
        ("([)]",     False),
        ("{[]}",     True),
        ("",         True),
    ]
    for s, expected in stack_cases:
        assert is_valid_stack(s)   == expected, f"stack failed on {s!r}"
        assert is_valid_switch(s)  == expected, f"switch failed on {s!r}"
        assert is_valid_replace(s) == expected, f"replace failed on {s!r}"

    print("All tests passed.")

# Made with Bob
