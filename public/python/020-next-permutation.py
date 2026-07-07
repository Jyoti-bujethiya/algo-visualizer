# LeetCode Problem #31: Next Permutation
# Difficulty: Medium
# Link: https://leetcode.com/problems/next-permutation/

# ─────────────────────────────────────────────
# APPROACH 1: STL next_permutation (Library) | O(n) time | O(1) space
# EXPLAIN: Use Python's itertools equivalent — find the next permutation in lexicographic order.
# WHEN: Reference / quick-check; not available as a single built-in so we replicate the algorithm.

def next_permutation_stl(nums: list[int]) -> None:
    """Modifies nums in-place (delegates to classic in-place algorithm)."""
    # Python has no direct next_permutation — replicate the classic algorithm
    n = len(nums)
    i = n - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1
    if i >= 0:
        j = n - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    lo, hi = i + 1, n - 1
    while lo < hi:
        nums[lo], nums[hi] = nums[hi], nums[lo]
        lo += 1; hi -= 1


# ─────────────────────────────────────────────
# APPROACH 2: Classic In-Place | O(n) time | O(1) space
# EXPLAIN: Find the rightmost descent, swap with the next-larger element to its right, then reverse the suffix.
# WHEN: The canonical O(n) in-place algorithm — always use this; it's the expected solution.

def next_permutation_inplace(nums: list[int]) -> None:
    """Modifies nums in-place."""
    n = len(nums)
    # Step 1: find the largest index i such that nums[i] < nums[i+1]
    i = n - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1

    if i >= 0:
        # Step 2: find the largest index j > i such that nums[i] < nums[j]
        j = n - 1
        while nums[j] <= nums[i]:
            j -= 1
        # Step 3: swap
        nums[i], nums[j] = nums[j], nums[i]

    # Step 4: reverse the suffix starting at i+1
    lo, hi = i + 1, n - 1
    while lo < hi:
        nums[lo], nums[hi] = nums[hi], nums[lo]
        lo += 1; hi -= 1


# ─────────────────────────────────────────────
# APPROACH 3: Explicit Reverse | O(n) time | O(1) space
# EXPLAIN: Identical to approach 2 but spells out the suffix reversal explicitly without any helper call.
# WHEN: When you want every step in plain view — useful on a whiteboard.

def next_permutation_explicit(nums: list[int]) -> None:
    """Modifies nums in-place."""
    n = len(nums)
    i = n - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1
    if i >= 0:
        j = n - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    # Manual reverse
    lo, hi = i + 1, n - 1
    while lo < hi:
        nums[lo], nums[hi] = nums[hi], nums[lo]
        lo += 1
        hi -= 1


# ─────────────────────────────────────────────
# APPROACH 4: Two-Pass Scan (Educational / Verbose) | O(n) time | O(1) space
# EXPLAIN: Same four-step logic with descriptive names (pivot, swap_idx) to highlight each conceptual step.
# WHEN: Teaching or code review; very readable for explaining the algorithm.

def next_permutation_two_pass(nums: list[int]) -> None:
    """Modifies nums in-place."""
    n = len(nums)
    pivot = -1
    for i in range(n - 2, -1, -1):
        if nums[i] < nums[i + 1]:
            pivot = i
            break

    if pivot == -1:
        nums.sort()
        return

    swap_idx = -1
    for j in range(n - 1, pivot, -1):
        if nums[j] > nums[pivot]:
            swap_idx = j
            break

    nums[pivot], nums[swap_idx] = nums[swap_idx], nums[pivot]

    lo, hi = pivot + 1, n - 1
    while lo < hi:
        nums[lo], nums[hi] = nums[hi], nums[lo]
        lo += 1; hi -= 1


# ─────────────────────────────────────────────
# APPROACH 5: Sort-Based | O(n log n) time | O(1) space
# EXPLAIN: Same pivot-and-swap; sort the suffix instead of reversing — correct because suffix is already descending.
# WHEN: Slightly slower (O(n log n) vs O(n)) but shows that sorting descending = reversing.

def next_permutation_sort(nums: list[int]) -> None:
    """Modifies nums in-place."""
    n = len(nums)
    i = n - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1
    if i >= 0:
        j = n - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    # Sort suffix (equivalent to reversing because it is already descending)
    nums[i + 1:] = sorted(nums[i + 1:])


# ─────────────────────────────────────────────
if __name__ == "__main__":
    import copy

    cases = [
        ([1, 2, 3], [1, 3, 2]),
        ([3, 2, 1], [1, 2, 3]),
        ([1, 1, 5], [1, 5, 1]),
        ([1],       [1]),
    ]
    fns = [
        next_permutation_stl,
        next_permutation_inplace,
        next_permutation_explicit,
        next_permutation_two_pass,
        next_permutation_sort,
    ]
    for nums, expected in cases:
        for fn in fns:
            m = copy.deepcopy(nums)
            fn(m)
            assert m == expected, f"{fn.__name__} failed on {nums}: got {m}"

    print("All tests passed.")

# Made with Bob
