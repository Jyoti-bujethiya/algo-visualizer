/**
 * Tutorial content for #019 — Find First and Last Position
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a sorted array of integers and a target value, find the starting and ending index of the target in the array. If the target is not found, return [-1, -1]. Your solution must run in O(log n) time.`,
    example: `nums = [5,7,7,8,8,10], target = 8\n→ 8 first appears at index 3, last at index 4\n✅ Answer: [3, 4]`,
    keyInsight: `Binary search can find the leftmost occurrence (lower bound) and rightmost occurrence (upper bound) of a target separately. Run binary search twice with slightly different conditions.`,
  },

  approaches: {
    'Linear Scan': {
      intuition: `Walk through the sorted array from left to right. Record the first time you see the target and the last time you see it. Simple and readable, but doesn't meet the O(log n) requirement for large inputs.`,
      steps: [
        `Initialize first=-1, last=-1.`,
        `Loop i from 0 to n-1.`,
        `If nums[i] == target AND first == -1: set first = i.`,
        `If nums[i] == target: update last = i.`,
        `Return [first, last].`,
      ],
      example: `nums = [5,7,7,8,8,10], target = 8\n\ni=0: 5≠8\ni=1: 7≠8\ni=2: 7≠8\ni=3: 8==8, first=3, last=3\ni=4: 8==8, last=4\ni=5: 10≠8\n✅ Answer: [3, 4]`,
      keyInsight: `O(n) time, O(1) space. Simple but violates the O(log n) requirement. Useful to understand what we're looking for before moving to binary search.`,
    },

    'Two Binary Searches': {
      intuition: `Use binary search twice: once to find the leftmost (first) position of the target, and once to find the rightmost (last) position. The key difference: when you find the target while searching for the left bound, keep searching left; when searching for the right bound, keep searching right.`,
      steps: [
        `findFirst(nums, target): binary search where when nums[mid]==target, record mid and search LEFT (right=mid-1).`,
        `findLast(nums, target): binary search where when nums[mid]==target, record mid and search RIGHT (left=mid+1).`,
        `Both searches use standard lo=0, hi=n-1 and stop when lo > hi.`,
        `Return [findFirst(), findLast()].`,
      ],
      example: `nums = [5,7,7,8,8,10], target=8\n\nfindFirst:\n  lo=0,hi=5 → mid=2(7<8) → lo=3\n  lo=3,hi=5 → mid=4(8==8) → first=4, hi=3\n  lo=3,hi=3 → mid=3(8==8) → first=3, hi=2\n  lo>hi → return first=3\n\nfindLast:\n  lo=0,hi=5 → mid=2(7<8) → lo=3\n  lo=3,hi=5 → mid=4(8==8) → last=4, lo=5\n  lo=5,hi=5 → mid=5(10>8) → hi=4\n  lo>hi → return last=4\n\n✅ Answer: [3, 4]`,
      keyInsight: `O(log n) time, O(1) space. Two independent binary searches, each O(log n). The only difference between them is the direction you continue searching after a match — left for first, right for last.`,
    },

    'STL-Style (Arrays.binarySearch analogue)': {
      intuition: `Model the solution after C++ STL's lower_bound and upper_bound functions. lower_bound finds the first index where nums[i] >= target; upper_bound finds the first index where nums[i] > target. The answer range is [lower_bound(target), upper_bound(target) - 1]. Both use the same binary search template with only the comparison condition changed.`,
      steps: [
        `lowerBound(target): binary search for first index i where nums[i] >= target.`,
        `  lo=0, hi=n. While lo < hi: mid = (lo+hi)/2. If nums[mid] < target → lo=mid+1. Else → hi=mid.`,
        `  Return lo.`,
        `upperBound(target): binary search for first index i where nums[i] > target.`,
        `  Same loop but condition: if nums[mid] <= target → lo=mid+1. Else → hi=mid.`,
        `  Return lo.`,
        `first = lowerBound(target). If first==n OR nums[first]!=target → return [-1,-1].`,
        `last = upperBound(target) - 1. Return [first, last].`,
      ],
      example: `nums = [5,7,7,8,8,10], target=8\n\nlowerBound(8): lo=0,hi=6\n  mid=3: nums[3]=8 >= 8 → hi=3\n  mid=1: nums[1]=7 < 8 → lo=2\n  mid=2: nums[2]=7 < 8 → lo=3\n  lo==hi=3 → return 3 ✓\n\nupperBound(8): lo=0,hi=6\n  mid=3: nums[3]=8 <= 8 → lo=4\n  mid=5: nums[5]=10 > 8 → hi=5\n  mid=4: nums[4]=8 <= 8 → lo=5\n  lo==hi=5 → return 5 ✓\n\nlast = 5-1 = 4\n✅ Answer: [3, 4]`,
      keyInsight: `O(log n) time, O(1) space. The lower_bound / upper_bound abstraction is reusable across dozens of problems — learning this template once pays dividends. The half-open interval convention (lo=0, hi=n, loop while lo<hi) eliminates off-by-one errors common in closed-interval binary search.`,
    },

    'Single Binary Search with Flag': {
      intuition: `Run one binary search to locate any occurrence of the target. If not found, return [-1,-1] immediately. Once you have a confirmed index, do two separate linear expansions left and right to find the true boundaries. This is not O(log n) worst-case but degenerates gracefully and is simple to implement.`,
      steps: [
        `Binary search for any occurrence of target. If not found, return [-1,-1].`,
        `From the found index, walk left while nums[left-1] == target.`,
        `From the found index, walk right while nums[right+1] == target.`,
        `Return [left, right].`,
      ],
      example: `nums = [5,7,7,8,8,10], target=8\n\nBinary search → finds index 4 (or 3)\nWalk left from 4: nums[3]=8 → left=3; nums[2]=7 ≠ 8 → stop, left=3\nWalk right from 4: nums[5]=10 ≠ 8 → stop, right=4\n✅ Answer: [3, 4]`,
      keyInsight: `O(log n + k) time where k is the length of the target run, O(1) space. Worst case O(n) when all elements equal the target, violating the problem's O(log n) requirement. Useful as a conceptual bridge — binary search to "get close," then scan to "get exact" — before learning the pure binary search variants.`,
    },

    'Recursive Binary Search': {
      intuition: `Express the left-bound and right-bound binary searches recursively. Each recursive call halves the search space and returns the first or last occurrence found within that half. Slightly more elegant to read for those comfortable with recursion, though the iterative versions are preferred in practice.`,
      steps: [
        `findFirst(nums, lo, hi, target):`,
        `  Base case: if lo > hi, return -1.`,
        `  mid = (lo+hi)/2.`,
        `  If nums[mid] == target: check if it's the first (mid==0 OR nums[mid-1]!=target) → return mid. Else recurse left: findFirst(lo, mid-1).`,
        `  If nums[mid] < target: recurse right: findFirst(mid+1, hi).`,
        `  Else: recurse left: findFirst(lo, mid-1).`,
        `findLast is symmetric: on match, check if last (mid==n-1 OR nums[mid+1]!=target) → return mid, else recurse right.`,
      ],
      example: `nums = [5,7,7,8,8,10], target=8\n\nfindFirst(0,5):\n  mid=2, nums[2]=7 < 8 → recurse(3,5)\n  mid=4, nums[4]=8: nums[3]=8 so not first → recurse(3,3)\n  mid=3, nums[3]=8: nums[2]=7 ≠ 8 → first! return 3\n\nfindLast(0,5):\n  mid=2, 7<8 → recurse(3,5)\n  mid=4, 8==8: nums[5]=10≠8 → last! return 4\n✅ Answer: [3, 4]`,
      keyInsight: `O(log n) time, O(log n) space (call stack). Produces the same result as the iterative two-binary-search approach. The O(log n) stack depth is the only practical difference — the iterative version is preferred in stack-constrained environments.`,
    },
  },
}
