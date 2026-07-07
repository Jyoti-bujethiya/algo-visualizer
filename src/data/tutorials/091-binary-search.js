/**
 * Tutorial content for #091 — Binary Search
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a sorted array of distinct integers and a target value, return the index of the target if it exists, or -1 if it does not. The array is sorted in ascending order. You must write an algorithm with O(log n) runtime complexity.`,
    example: `nums = [-1,0,3,5,9,12], target = 9\nIndex 0:-1, 1:0, 2:3, 3:5, 4:9, 5:12\nBinary search homes in on index 4\n✅ Answer: 4`,
    keyInsight: `Because the array is sorted, you can eliminate half the remaining candidates at every step. Check the middle element: if it equals the target you're done; if it's too big narrow to the left half; if too small narrow to the right half.`,
  },

  approaches: {
    'Iterative Binary Search': {
      intuition: `Keep two pointers, left and right, that bracket the region still under consideration. Repeatedly compute the midpoint and compare nums[mid] to the target. If equal, return mid. If nums[mid] < target, the target must be in the right half — set left = mid + 1. If nums[mid] > target, set right = mid - 1. Continue until left > right.`,
      steps: [
        `Set left = 0, right = nums.length - 1.`,
        `While left <= right:`,
        `  mid = left + (right - left) / 2  (avoids integer overflow).`,
        `  If nums[mid] == target: return mid.`,
        `  If nums[mid] < target: left = mid + 1.`,
        `  Else: right = mid - 1.`,
        `Return -1 (target not found).`,
      ],
      example: `nums=[-1,0,3,5,9,12], target=9\n\nleft=0, right=5. mid=2 → nums[2]=3 < 9 → left=3.\nleft=3, right=5. mid=4 → nums[4]=9 == 9 → return 4 ✅`,
      keyInsight: `O(log n) time, O(1) space. This is the canonical binary search every developer must know. The +1/-1 on left/right ensures you always shrink the window and never loop infinitely.`,
    },

    'Recursive Binary Search': {
      intuition: `Same logic as iterative, expressed recursively. Each call receives the current left and right bounds and either returns the answer or calls itself on the appropriate half. The base case is left > right (target not found).`,
      steps: [
        `binarySearch(nums, target, left, right):`,
        `  If left > right: return -1.`,
        `  mid = left + (right - left) / 2.`,
        `  If nums[mid] == target: return mid.`,
        `  If nums[mid] < target: return binarySearch(nums, target, mid+1, right).`,
        `  Else: return binarySearch(nums, target, left, mid-1).`,
        `Initial call: binarySearch(nums, target, 0, nums.length-1).`,
      ],
      example: `nums=[-1,0,3,5,9,12], target=9\n\ncall(0,5): mid=2, nums[2]=3<9 → call(3,5)\ncall(3,5): mid=4, nums[4]=9==9 → return 4 ✅`,
      keyInsight: `O(log n) time, O(log n) space (call stack). Functionally identical to iterative. Most interviewers prefer the iterative version because it avoids the extra stack space, but recursive is fine for explanations.`,
    },

    'Binary Search with Standard Library': {
      intuition: `Most languages have a built-in binary search. In Java, Arrays.binarySearch returns the index if found (or a negative value if not). In Python, bisect.bisect_left returns the insertion point — you then check if that index holds the target.`,
      steps: [
        `Java: int idx = Arrays.binarySearch(nums, target); return idx >= 0 ? idx : -1.`,
        `Python: idx = bisect.bisect_left(nums, target); return idx if idx < len(nums) and nums[idx] == target else -1.`,
        `C++: auto it = lower_bound(nums.begin(), nums.end(), target); return (it != nums.end() && *it == target) ? it - nums.begin() : -1.`,
      ],
      example: `nums=[-1,0,3,5,9,12], target=9\n\nPython: bisect_left → idx=4. nums[4]=9==target → return 4 ✅\nJava: Arrays.binarySearch → returns 4 directly ✅`,
      keyInsight: `O(log n) time, O(1) space. The pragmatic choice in production code. In an interview you'll likely be asked to implement it yourself — use the iterative approach.`,
    },

    'Linear Search': {
      intuition: `Simply scan every element from left to right until you find the target. No use of the sorted property at all. This is presented only as a baseline for comparison — never use it when the array is sorted.`,
      steps: [
        `For i from 0 to nums.length - 1:`,
        `  If nums[i] == target: return i.`,
        `Return -1.`,
      ],
      example: `nums=[-1,0,3,5,9,12], target=9\n\ni=0(-1≠9), i=1(0≠9), i=2(3≠9), i=3(5≠9), i=4(9==9) → return 4 ✅`,
      keyInsight: `O(n) time, O(1) space. Correct but completely ignores the sorted property. Shown here so you appreciate why binary search (O(log n)) is so much better for sorted data.`,
    },

    'Binary Search with Bounds Check': {
      intuition: `A slight variation of the iterative approach where you keep the right pointer as nums.length (exclusive upper bound) instead of nums.length - 1. The loop condition becomes left < right, and you never access nums[right] directly. Some find this style cleaner because it mirrors the half-open interval convention [left, right).`,
      steps: [
        `left = 0, right = nums.length  (exclusive right bound).`,
        `While left < right:`,
        `  mid = left + (right - left) / 2.`,
        `  If nums[mid] == target: return mid.`,
        `  If nums[mid] < target: left = mid + 1.`,
        `  Else: right = mid.  ← not mid-1, because right is exclusive`,
        `Return -1.`,
      ],
      example: `nums=[-1,0,3,5,9,12], target=9\n\nleft=0, right=6. mid=3 → nums[3]=5 < 9 → left=4.\nleft=4, right=6. mid=5 → nums[5]=12 > 9 → right=5.\nleft=4, right=5. mid=4 → nums[4]=9 == 9 → return 4 ✅`,
      keyInsight: `O(log n) time, O(1) space. Identical outcome to the standard iterative approach. The [left, right) convention is common in lower_bound/upper_bound style binary searches and is worth knowing for range-query variants.`,
    },
  },
}
