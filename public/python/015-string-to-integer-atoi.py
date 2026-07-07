# LeetCode Problem #8: String to Integer (atoi)
# Difficulty: Medium
# Link: https://leetcode.com/problems/string-to-integer-atoi/

import math

INT_MIN = -(2 ** 31)
INT_MAX =  (2 ** 31) - 1

# ─────────────────────────────────────────────
# APPROACH 1: Simulation | O(n) time | O(1) space
# EXPLAIN: Trim whitespace, handle sign, accumulate digits, then clamp to 32-bit signed integer range.
# WHEN: The only sensible approach — mirrors exactly what a real atoi implementation does.

def my_atoi(s: str) -> int:
    s   = s.lstrip()          # step 1: strip leading whitespace
    if not s:
        return 0

    # step 2: optional sign
    sign  = 1
    start = 0
    if s[0] in ('+', '-'):
        sign  = -1 if s[0] == '-' else 1
        start = 1

    # step 3: read digits
    result = 0
    for i in range(start, len(s)):
        ch = s[i]
        if not ch.isdigit():
            break
        result = result * 10 + int(ch)
        # early clamp to avoid unnecessary work on huge strings
        if result * sign > INT_MAX:
            return INT_MAX
        if result * sign < INT_MIN:
            return INT_MIN

    # step 4: apply sign and clamp
    result *= sign
    return max(INT_MIN, min(INT_MAX, result))


# ─────────────────────────────────────────────
# APPROACH 2: Overflow-Safe (no big int) | O(n) time | O(1) space
# EXPLAIN: Check against INT_MAX // 10 before each multiplication to detect overflow without widening the integer.
# WHEN: When you want to demonstrate boundary-aware integer parsing without relying on Python's arbitrary precision.

def my_atoi_overflow_safe(s: str) -> int:
    s = s.lstrip()
    if not s:
        return 0
    sign = 1
    i = 0
    if s[0] in ('+', '-'):
        sign = -1 if s[0] == '-' else 1
        i = 1
    result = 0
    while i < len(s) and s[i].isdigit():
        d = int(s[i])
        if result > INT_MAX // 10 or (result == INT_MAX // 10 and d > 7):
            return INT_MAX if sign == 1 else INT_MIN
        result = result * 10 + d
        i += 1
    return sign * result


# ─────────────────────────────────────────────
# APPROACH 3: DFA / State Machine | O(n) time | O(1) space
# EXPLAIN: Model parsing as explicit states (START → SIGN → NUMBER → END) for rigour and extensibility.
# WHEN: When you want to demonstrate finite-automaton design or need to handle a richer grammar.

def my_atoi_fsm(s: str) -> int:
    STATE_START, STATE_SIGN, STATE_NUMBER, STATE_END = 0, 1, 2, 3
    state  = STATE_START
    sign   = 1
    result = 0

    for ch in s:
        if state == STATE_START:
            if ch == ' ':
                continue
            elif ch in ('+', '-'):
                sign  = -1 if ch == '-' else 1
                state = STATE_SIGN
            elif ch.isdigit():
                result = int(ch)
                state  = STATE_NUMBER
            else:
                break
        elif state in (STATE_SIGN, STATE_NUMBER):
            if ch.isdigit():
                result = result * 10 + int(ch)
                state  = STATE_NUMBER
            else:
                state = STATE_END
                break
        else:
            break

    result *= sign
    return max(INT_MIN, min(INT_MAX, result))


# ─────────────────────────────────────────────
# APPROACH 4: Manual Parse (strip + index) | O(n) time | O(1) space
# EXPLAIN: Use str.lstrip() for trimming then advance an explicit index for sign and digit collection.
# WHEN: When you want crystal-clear step-by-step parsing matching the problem spec exactly.

def my_atoi_manual(s: str) -> int:
    s = s.lstrip()
    if not s:
        return 0
    sign = 1
    i = 0
    if s[0] in ('+', '-'):
        sign = -1 if s[0] == '-' else 1
        i = 1
    res = 0
    while i < len(s) and s[i].isdigit():
        res = res * 10 + int(s[i])
        if res * sign > INT_MAX:
            return INT_MAX
        if res * sign < INT_MIN:
            return INT_MIN
        i += 1
    return sign * res


# ─────────────────────────────────────────────
# APPROACH 5: Library Parse (int() with regex) | O(n) time | O(n) space
# EXPLAIN: Use re to extract the leading signed integer string and convert with int() — delegates to Python builtins.
# WHEN: Demonstrates awareness of library tools; not acceptable in an interview without explicit permission.

import re

def my_atoi_library(s: str) -> int:
    m = re.match(r'^\s*([+-]?\d+)', s)
    if not m:
        return 0
    return max(INT_MIN, min(INT_MAX, int(m.group(1))))


# ─────────────────────────────────────────────
if __name__ == "__main__":
    cases = [
        ("42",                  42),
        ("   -042",            -42),
        ("1337c0d3",          1337),
        ("0-1",                  0),
        ("words and 987",        0),
        ("-91283472332",  INT_MIN),
        ("21474836460",   INT_MAX),
    ]
    for s, expected in cases:
        assert my_atoi(s)              == expected, f"simulation failed on {s!r}"
        assert my_atoi_overflow_safe(s)== expected, f"overflow_safe failed on {s!r}"
        assert my_atoi_fsm(s)          == expected, f"fsm failed on {s!r}"
        assert my_atoi_manual(s)       == expected, f"manual failed on {s!r}"
        assert my_atoi_library(s)      == expected, f"library failed on {s!r}"
    print("All tests passed.")

# Made with Bob
