# LeetCode Problem #11: Container With Most Water
# Difficulty: Medium
# Link: https://leetcode.com/problems/container-with-most-water/

# ─────────────────────────────────────────────
# APPROACH 1: Brute Force | O(n²) time | O(1) space
# EXPLAIN: Check every pair of lines and compute the area, keeping track of the maximum.
# WHEN: Only for tiny inputs; establishes the baseline before the optimal solution.

def max_area_brute(height: list[int]) -> int:
    n = len(height)
    max_water = 0
    for i in range(n - 1):
        for j in range(i + 1, n):
            water = (j - i) * min(height[i], height[j])
            max_water = max(max_water, water)
    return max_water


# ─────────────────────────────────────────────
# APPROACH 2: Two Pointers | O(n) time | O(1) space
# EXPLAIN: Start with the widest container and move the shorter wall inward — the only way area can grow.
# WHEN: Always preferred; classic greedy two-pointer pattern on sorted-boundary problems.

def max_area_two_pointers(height: list[int]) -> int:
    lo, hi = 0, len(height) - 1
    max_water = 0
    while lo < hi:
        water = (hi - lo) * min(height[lo], height[hi])
        max_water = max(max_water, water)
        if height[lo] <= height[hi]:
            lo += 1
        else:
            hi -= 1
    return max_water


# ─────────────────────────────────────────────
# APPROACH 3: Two Pointers with Optimization | O(n) time | O(1) space
# EXPLAIN: Same greedy two-pointer logic but skips lines shorter than the current boundary to reduce iterations.
# WHEN: Same worst case as approach 2 but faster in practice when many short lines are present.

def max_area_optimized(height: list[int]) -> int:
    lo, hi = 0, len(height) - 1
    max_water = 0
    while lo < hi:
        water = (hi - lo) * min(height[lo], height[hi])
        max_water = max(max_water, water)
        if height[lo] < height[hi]:
            cur = height[lo]
            while lo < hi and height[lo] <= cur:
                lo += 1
        else:
            cur = height[hi]
            while lo < hi and height[hi] <= cur:
                hi -= 1
    return max_water


# ─────────────────────────────────────────────
if __name__ == "__main__":
    cases = [
        ([1, 8, 6, 2, 5, 4, 8, 3, 7], 49),
        ([1, 1],                        1),
        ([4, 3, 2, 1, 4],              16),
        ([1, 2, 1],                     2),
    ]
    for height, expected in cases:
        assert max_area_brute(height)        == expected
        assert max_area_two_pointers(height) == expected
        assert max_area_optimized(height)    == expected
    print("All tests passed.")

# Made with Bob
