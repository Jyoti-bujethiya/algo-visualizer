# LeetCode Problem #739: Daily Temperatures
# Difficulty: Medium
# Link: https://leetcode.com/problems/daily-temperatures/

from typing import List

# ─────────────────────────────────────────────
# APPROACH 1: Monotonic Stack (Optimal) | O(n) time | O(n) space
# EXPLAIN: Stack stores indices of unresolved days; pop when a warmer temperature is found.
# WHEN: Standard O(n) solution — the classic monotonic stack pattern.

def dailyTemperatures_stack(temperatures: List[int]) -> List[int]:
    n = len(temperatures)
    result = [0] * n
    stack = []  # indices of days waiting for a warmer day

    for i in range(n):
        while stack and temperatures[i] > temperatures[stack[-1]]:
            prev = stack.pop()
            result[prev] = i - prev
        stack.append(i)

    return result


# APPROACH 2: Brute Force | O(n²) time | O(1) space
# EXPLAIN: For each day search forward for the first warmer temperature.
# WHEN: Educational baseline; correct but too slow for large inputs.

def dailyTemperatures_brute(temperatures: List[int]) -> List[int]:
    n = len(temperatures)
    result = [0] * n
    for i in range(n):
        for j in range(i + 1, n):
            if temperatures[j] > temperatures[i]:
                result[i] = j - i
                break
    return result


# APPROACH 3: Backward Iteration with Jump | O(n) time | O(1) space
# EXPLAIN: Scan right-to-left; use result array to skip ahead to the next candidate.
# WHEN: O(1) extra space beyond the output array — best space-complexity solution.

def dailyTemperatures_backward(temperatures: List[int]) -> List[int]:
    n = len(temperatures)
    result = [0] * n
    for i in range(n - 2, -1, -1):
        j = i + 1
        while j < n:
            if temperatures[j] > temperatures[i]:
                result[i] = j - i
                break
            if result[j] == 0:
                break
            j += result[j]  # jump to next candidate
    return result


# APPROACH 4: Array as Stack | O(n) time | O(n) space
# EXPLAIN: Use a plain list as a stack with manual top pointer — better cache locality.
# WHEN: Same as monotonic stack but avoids Python list pop overhead.

def dailyTemperatures_arrayStack(temperatures: List[int]) -> List[int]:
    n = len(temperatures)
    result = [0] * n
    stack = [0] * n
    top = -1

    for i in range(n):
        while top >= 0 and temperatures[i] > temperatures[stack[top]]:
            prev = stack[top]
            top -= 1
            result[prev] = i - prev
        top += 1
        stack[top] = i

    return result


# APPROACH 5: Next Greater Element Pattern | O(n) time | O(n) space
# EXPLAIN: Store (index, temperature) pairs on stack — shows the generalised NGE pattern.
# WHEN: Use when you need both index and value in the stack for other NGE variants.

def dailyTemperatures(temperatures: List[int]) -> List[int]:
    n = len(temperatures)
    result = [0] * n
    stack = []  # (index, temperature)

    for i, temp in enumerate(temperatures):
        while stack and temp > stack[-1][1]:
            prev_idx, _ = stack.pop()
            result[prev_idx] = i - prev_idx
        stack.append((i, temp))

    return result


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [
        ([73, 74, 75, 71, 69, 72, 76, 73], [1, 1, 4, 2, 1, 1, 0, 0]),
        ([30, 40, 50, 60],                  [1, 1, 1, 0]),
        ([30, 60, 90],                       [1, 1, 0]),
    ]
    fns = [dailyTemperatures_stack, dailyTemperatures_brute, dailyTemperatures_backward,
           dailyTemperatures_arrayStack, dailyTemperatures]
    for fn in fns:
        for temps, expected in cases:
            assert fn(list(temps)) == expected, f'{fn.__name__} mismatch'
    print('All tests passed.')

# Made with Bob
