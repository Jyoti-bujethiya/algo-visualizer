# LeetCode Problem #42: Trapping Rain Water
# Difficulty: Hard
# Link: https://leetcode.com/problems/trapping-rain-water/

# ─────────────────────────────────────────────
# APPROACH 1: Brute Force | O(n²) time | O(1) space
# EXPLAIN: For each bar, scan left and right to find the tallest walls, then compute trapped water.
# WHEN: Educational baseline only; too slow for large inputs.

def trap_brute(height: list[int]) -> int:
    n = len(height)
    total = 0
    for i in range(1, n - 1):
        left_max  = max(height[:i + 1])
        right_max = max(height[i:])
        total += min(left_max, right_max) - height[i]
    return total


# ─────────────────────────────────────────────
# APPROACH 2: Prefix / Suffix Arrays | O(n) time | O(n) space
# EXPLAIN: Precompute running max from left and right; answer for each bar is min(left_max, right_max) - height.
# WHEN: When clarity is more important than memory; easy to reason about and verify.

def trap_prefix_suffix(height: list[int]) -> int:
    n = len(height)
    if n == 0:
        return 0
    left_max  = [0] * n
    right_max = [0] * n
    left_max[0] = height[0]
    for i in range(1, n):
        left_max[i] = max(left_max[i - 1], height[i])
    right_max[n - 1] = height[n - 1]
    for i in range(n - 2, -1, -1):
        right_max[i] = max(right_max[i + 1], height[i])
    return sum(min(left_max[i], right_max[i]) - height[i] for i in range(n))


# ─────────────────────────────────────────────
# APPROACH 3: Two Pointers | O(n) time | O(1) space
# EXPLAIN: Maintain left_max and right_max on the fly; process the side with the smaller max each step.
# WHEN: Optimal in both time and space — the go-to solution for this problem.

def trap_two_pointers(height: list[int]) -> int:
    lo, hi = 0, len(height) - 1
    left_max = right_max = 0
    total = 0
    while lo < hi:
        if height[lo] <= height[hi]:
            if height[lo] >= left_max:
                left_max = height[lo]
            else:
                total += left_max - height[lo]
            lo += 1
        else:
            if height[hi] >= right_max:
                right_max = height[hi]
            else:
                total += right_max - height[hi]
            hi -= 1
    return total


# ─────────────────────────────────────────────
# APPROACH 4: Monotonic Stack | O(n) time | O(n) space
# EXPLAIN: Use a stack of indices to track candidate left walls; compute horizontal water bands layer by layer.
# WHEN: Useful when you need to extend the technique to related problems (e.g., histogram area).

def trap_stack(height: list[int]) -> int:
    stack: list[int] = []
    total = 0
    for i, h in enumerate(height):
        while stack and h > height[stack[-1]]:
            top = stack.pop()
            if not stack:
                break
            distance = i - stack[-1] - 1
            bounded_height = min(h, height[stack[-1]]) - height[top]
            total += distance * bounded_height
        stack.append(i)
    return total


# ─────────────────────────────────────────────
if __name__ == "__main__":
    cases = [
        ([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], 6),
        ([4, 2, 0, 3, 2, 5],                    9),
        ([],                                     0),
    ]
    for h, expected in cases:
        assert trap_brute(h)          == expected
        assert trap_prefix_suffix(h)  == expected
        assert trap_two_pointers(h)   == expected
        assert trap_stack(h)          == expected
    print("All tests passed.")

# Made with Bob
