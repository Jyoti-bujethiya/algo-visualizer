/**
 * Tutorial content for #093 — Find Minimum in Rotated Sorted Array
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `A sorted array of unique integers was rotated at an unknown pivot. Find the minimum element. The array may not have been rotated at all (it could already be in sorted order). You must achieve O(log n) runtime.`,
    example: `[3,4,5,1,2] → rotated at index 3, minimum is 1\n[4,5,6,7,0,1,2] → minimum is 0 at index 4\n[1,2,3] → not rotated, minimum is 1\n✅ Answer: 1, 0, 1`,
    keyInsight: `The minimum is the only element that is smaller than its left neighbour (the "break point"). In binary search, if nums[mid] > nums[right], the minimum is in the right half; otherwise it is in the left half (including mid itself).`,
  },

  approaches: {
    'Binary Search (Compare to Right)': {
      intuition: `Compare the middle element to the rightmost element. If nums[mid] > nums[right], the array's break point (minimum) is somewhere to the right of mid — set left = mid + 1. Otherwise, the minimum is at mid or to its left — set right = mid. When left == right, you've found the minimum.`,
      steps: [
        `left = 0, right = nums.length - 1.`,
        `While left < right:`,
        `  mid = left + (right - left) / 2.`,
        `  If nums[mid] > nums[right]: left = mid + 1.`,
        `  Else: right = mid.`,
        `Return nums[left].`,
      ],
      example: `nums=[3,4,5,1,2]\n\nleft=0,right=4. mid=2, nums[2]=5>nums[4]=2 → left=3.\nleft=3,right=4. mid=3, nums[3]=1≤nums[4]=2 → right=3.\nleft=3=right → return nums[3]=1 ✅\n\nnums=[1,2,3] (not rotated)\nleft=0,right=2. mid=1, nums[1]=2≤nums[2]=3 → right=1.\nleft=0,right=1. mid=0, nums[0]=1≤nums[1]=2 → right=0.\nReturn nums[0]=1 ✅`,
      keyInsight: `O(log n) time, O(1) space. Comparing to the right boundary (not left) is the key — it reliably identifies which side the pivot is on regardless of whether the array is rotated.`,
    },

    'Binary Search (Compare to Left with Early Exit)': {
      intuition: `Compare the middle to the leftmost element. If nums[left] < nums[right], the current window is already sorted — nums[left] is the minimum in this window, return it immediately. Otherwise, if nums[mid] >= nums[left], the left half is sorted and the minimum is in the right — move left past mid.`,
      steps: [
        `left = 0, right = nums.length - 1.`,
        `While left < right:`,
        `  If nums[left] < nums[right]: return nums[left]  (window is sorted).`,
        `  mid = left + (right - left) / 2.`,
        `  If nums[mid] >= nums[left]: left = mid + 1.`,
        `  Else: right = mid.`,
        `Return nums[left].`,
      ],
      example: `nums=[4,5,6,7,0,1,2]\n\nleft=0,right=6. nums[0]=4>nums[6]=2 → not sorted.\nmid=3, nums[3]=7>=nums[0]=4 → left=4.\nleft=4,right=6. nums[4]=0<nums[6]=2 → sorted! return nums[4]=0 ✅`,
      keyInsight: `O(log n) time, O(1) space. The early-exit when the window is fully sorted is a nice optimization — it terminates as soon as the minimum is cornered. Slightly more readable for some people.`,
    },

    'Recursive Binary Search': {
      intuition: `Express the same compare-to-right logic recursively. Each call returns the minimum of the narrowed window. The recursion bottoms out when left == right.`,
      steps: [
        `findMin(nums, left, right):`,
        `  If left == right: return nums[left].`,
        `  mid = left + (right - left) / 2.`,
        `  If nums[mid] > nums[right]: return findMin(nums, mid+1, right).`,
        `  Else: return findMin(nums, left, mid).`,
        `Initial call: findMin(nums, 0, nums.length-1).`,
      ],
      example: `nums=[3,4,5,1,2]\n\nfindMin(0,4): mid=2, nums[2]=5>nums[4]=2 → findMin(3,4)\nfindMin(3,4): mid=3, nums[3]=1≤nums[4]=2 → findMin(3,3)\nfindMin(3,3): left==right → return nums[3]=1 ✅`,
      keyInsight: `O(log n) time, O(log n) stack space. Same result as iterative. Choose iterative for production code; recursive is helpful for explaining the divide-and-conquer structure clearly.`,
    },

    'Linear Scan': {
      intuition: `Walk through the array and return the first element that is smaller than its predecessor. If no such element exists, the array was never rotated and the first element is the minimum.`,
      steps: [
        `For i from 1 to n-1:`,
        `  If nums[i] < nums[i-1]: return nums[i].`,
        `Return nums[0]  (array is not rotated).`,
      ],
      example: `nums=[3,4,5,1,2]\n\ni=1: 4>3 continue.\ni=2: 5>4 continue.\ni=3: 1<5 → return 1 ✅\n\nnums=[1,2,3]: no drop found → return nums[0]=1 ✅`,
      keyInsight: `O(n) time, O(1) space. Does not satisfy the O(log n) requirement of the problem but is simple and correct. Use only as a conceptual baseline or for tiny arrays.`,
    },

    'Arrays.stream min': {
      intuition: `In Java, use Arrays.stream(nums).min().getAsInt(). In Python, just return min(nums). This delegates the search to the language runtime. Simple, but O(n) and doesn't demonstrate the binary search skill the problem is testing.`,
      steps: [
        `Java: return Arrays.stream(nums).min().getAsInt();`,
        `Python: return min(nums)`,
        `C++: return *min_element(nums.begin(), nums.end());`,
      ],
      example: `nums=[3,4,5,1,2]\nmin(nums) → scans all 5 elements → returns 1 ✅`,
      keyInsight: `O(n) time, O(1) space. One-liner, but misses the point of the problem entirely. An interviewer will follow up asking you to do it in O(log n) — make sure you know the binary search approach.`,
    },
  },
}
