# LeetCode Problem #15: Three Sum
# Difficulty: Medium
# Link: https://leetcode.com/problems/3sum/

# ─────────────────────────────────────────────
# APPROACH 1: Brute Force | O(n³ log n) time | O(n) space
# EXPLAIN: Try all triples with three nested loops, deduplicate with a set of sorted tuples.
# WHEN: Tiny inputs only; illustrates the naive baseline before optimization.

def three_sum_brute(nums: list[int]) -> list[list[int]]:
    n = len(nums)
    result: set[tuple[int, ...]] = set()
    for i in range(n - 2):
        for j in range(i + 1, n - 1):
            for k in range(j + 1, n):
                if nums[i] + nums[j] + nums[k] == 0:
                    result.add(tuple(sorted([nums[i], nums[j], nums[k]])))
    return [list(t) for t in result]


# ─────────────────────────────────────────────
# APPROACH 2: HashMap | O(n²) time | O(n) space
# EXPLAIN: Fix one element, then use a hash set to find the complementary pair in the remaining elements.
# WHEN: When you want O(n²) time with hash-based lookup instead of sorting.

def three_sum_hash(nums: list[int]) -> list[list[int]]:
    nums.sort()                               # sort still needed for dedup
    result: set[tuple[int, ...]] = set()
    for i in range(len(nums) - 2):
        seen: set[int] = set()
        for j in range(i + 1, len(nums)):
            complement = -(nums[i] + nums[j])
            if complement in seen:
                result.add(tuple(sorted([nums[i], complement, nums[j]])))
            seen.add(nums[j])
    return [list(t) for t in result]


# ─────────────────────────────────────────────
# APPROACH 3: Two Pointers | O(n²) time | O(1) space
# EXPLAIN: Sort the array; fix one element then shrink a two-pointer window for the remaining pair.
# WHEN: The canonical O(n²) solution — preferred in interviews for clarity and efficiency.

def three_sum_two_pointers(nums: list[int]) -> list[list[int]]:
    nums.sort()
    result: list[list[int]] = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue                          # skip duplicate pivot
        lo, hi = i + 1, len(nums) - 1
        while lo < hi:
            total = nums[i] + nums[lo] + nums[hi]
            if total == 0:
                result.append([nums[i], nums[lo], nums[hi]])
                while lo < hi and nums[lo] == nums[lo + 1]:
                    lo += 1
                while lo < hi and nums[hi] == nums[hi - 1]:
                    hi -= 1
                lo += 1
                hi -= 1
            elif total < 0:
                lo += 1
            else:
                hi -= 1
    return result


# ─────────────────────────────────────────────
# APPROACH 4: Optimized Two Pointers | O(n²) time | O(1) space
# EXPLAIN: Same as two pointers but adds early-exit bounds checks to skip impossible pivot values.
# WHEN: Best practical performance — use when you want maximum speed with clean duplicate handling.

def three_sum_optimized(nums: list[int]) -> list[list[int]]:
    nums.sort()
    result: list[list[int]] = []
    n = len(nums)
    for i in range(n - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        if nums[i] > 0:
            break                             # all remaining elements are positive
        if nums[i] + nums[i + 1] + nums[i + 2] > 0:
            break                             # minimum possible sum already > 0
        if nums[i] + nums[n - 2] + nums[n - 1] < 0:
            continue                          # maximum possible sum still < 0
        lo, hi = i + 1, n - 1
        while lo < hi:
            total = nums[i] + nums[lo] + nums[hi]
            if total == 0:
                result.append([nums[i], nums[lo], nums[hi]])
                while lo < hi and nums[lo] == nums[lo + 1]:
                    lo += 1
                while lo < hi and nums[hi] == nums[hi - 1]:
                    hi -= 1
                lo += 1
                hi -= 1
            elif total < 0:
                lo += 1
            else:
                hi -= 1
    return result


# ─────────────────────────────────────────────
if __name__ == "__main__":
    def normalize(lst):
        return sorted([sorted(t) for t in lst])

    nums = [-1, 0, 1, 2, -1, -4]
    expected = [[-1, -1, 2], [-1, 0, 1]]
    assert normalize(three_sum_brute(list(nums)))         == normalize(expected)
    assert normalize(three_sum_hash(list(nums)))          == normalize(expected)
    assert normalize(three_sum_two_pointers(list(nums)))  == normalize(expected)
    assert normalize(three_sum_optimized(list(nums)))     == normalize(expected)
    print("All tests passed.")

# Made with Bob
