/**
 * Tutorial content for #092 — Search in Rotated Sorted Array
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `A sorted array was rotated at an unknown pivot index, so it looks like [4,5,6,7,0,1,2]. Given this array and a target, return the index of the target or -1 if not found. You must achieve O(log n) runtime.`,
    example: `nums = [4,5,6,7,0,1,2], target = 0\nThe pivot is between index 3 and 4.\nTarget 0 is in the right (rotated) portion at index 4.\n✅ Answer: 4`,
    keyInsight: `Even though the array is rotated, one of the two halves around any midpoint is always normally sorted. Check which half is sorted, then determine whether the target falls inside it. If yes, search that half; otherwise search the other.`,
  },

  approaches: {
    'One-Pass Modified Binary Search': {
      intuition: `Standard binary search, but at each step, before deciding which half to search, figure out which half is sorted. If nums[left] ≤ nums[mid], the left half is sorted. If nums[mid] ≤ nums[right], the right half is sorted. Then check if the target falls within the sorted half's range to decide where to go.`,
      steps: [
        `left = 0, right = nums.length - 1.`,
        `While left <= right:`,
        `  mid = left + (right - left) / 2.`,
        `  If nums[mid] == target: return mid.`,
        `  If nums[left] <= nums[mid]  (left half is sorted):`,
        `    If target >= nums[left] AND target < nums[mid]: right = mid - 1.`,
        `    Else: left = mid + 1.`,
        `  Else  (right half is sorted):`,
        `    If target > nums[mid] AND target <= nums[right]: left = mid + 1.`,
        `    Else: right = mid - 1.`,
        `Return -1.`,
      ],
      example: `nums=[4,5,6,7,0,1,2], target=0\n\nleft=0,right=6. mid=3, nums[3]=7≠0.\n  Left sorted? nums[0]=4 ≤ nums[3]=7 ✓\n  target=0 in [4,7)? No → left=4.\nleft=4,right=6. mid=5, nums[5]=1≠0.\n  Left sorted? nums[4]=0 ≤ nums[5]=1 ✓\n  target=0 in [0,1)? Yes → right=4.\nleft=4,right=4. mid=4, nums[4]=0==0 → return 4 ✅`,
      keyInsight: `O(log n) time, O(1) space. The key insight is that every midpoint split leaves one sorted half — you use that sorted half as a known range to decide the search direction.`,
    },

    'Find Pivot then Binary Search': {
      intuition: `Two-pass approach: first find the pivot index (the index of the minimum element) using binary search, then run a standard binary search on the appropriate half of the array (treating it as a normal sorted array).`,
      steps: [
        `Find pivot: binary search for the index of the minimum element.`,
        `  While left < right: mid = (left+right)/2. If nums[mid] > nums[right]: left=mid+1. Else: right=mid.`,
        `  pivot = left.`,
        `Now run standard binary search on [pivot, pivot+n-1] mod n.`,
        `  Set lo=pivot, hi=pivot+n-1. While lo<=hi: real index = mid % n. Compare nums[realMid] to target.`,
        `Return real index or -1.`,
      ],
      example: `nums=[4,5,6,7,0,1,2]\nFind pivot:\n  left=0,right=6. mid=3, nums[3]=7>nums[6]=2 → left=4.\n  left=4,right=6. mid=5, nums[5]=1≤nums[6]=2 → right=5.\n  left=4,right=5. mid=4, nums[4]=0≤nums[5]=1 → right=4.\n  pivot=4.\nSearch for 0 starting at pivot: standard search in [0,1,2,4,5,6,7].\nNums[4]=0 → return 4 ✅`,
      keyInsight: `O(log n) time, O(1) space — two separate binary searches. Slightly more code but very readable: finding the pivot and searching are clean independent steps.`,
    },

    'Recursive Modified Binary Search': {
      intuition: `Same logic as the one-pass iterative approach, expressed as a recursive function. Each call determines which half is sorted, checks if the target belongs there, and recurses accordingly.`,
      steps: [
        `search(nums, target, left, right):`,
        `  If left > right: return -1.`,
        `  mid = (left + right) / 2.`,
        `  If nums[mid] == target: return mid.`,
        `  If left half sorted (nums[left] <= nums[mid]):`,
        `    If target in [nums[left], nums[mid]): return search(left, mid-1).`,
        `    Else: return search(mid+1, right).`,
        `  Else: if target in (nums[mid], nums[right]]: return search(mid+1, right).`,
        `  Else: return search(left, mid-1).`,
      ],
      example: `nums=[4,5,6,7,0,1,2], target=0\n\ncall(0,6): mid=3(7). Left sorted[4..7]. 0 not in [4,7) → call(4,6).\ncall(4,6): mid=5(1). Left sorted[0..1]. 0 in [0,1) → call(4,4).\ncall(4,4): mid=4(0)==0 → return 4 ✅`,
      keyInsight: `O(log n) time, O(log n) stack space. Same correctness as iterative. Use iterative in interviews to avoid stack overhead — recursive is good for explaining the logic.`,
    },

    'Linear Scan': {
      intuition: `Simply scan every element. Not O(log n), but shown as the naive baseline to make clear why binary search is needed.`,
      steps: [
        `For i from 0 to n-1:`,
        `  If nums[i] == target: return i.`,
        `Return -1.`,
      ],
      example: `nums=[4,5,6,7,0,1,2], target=0\n\ni=0(4≠0),i=1(5≠0),i=2(6≠0),i=3(7≠0),i=4(0==0) → return 4 ✅`,
      keyInsight: `O(n) time, O(1) space. Correct but misses the O(log n) requirement. Only shown as a baseline — never use this when the problem asks for logarithmic time.`,
    },

    'Index Remapping Binary Search': {
      intuition: `Find the pivot index, then perform binary search but translate every logical index back to the real array index using modulo. This lets you treat the rotated array as if it were fully sorted, without physically copying elements.`,
      steps: [
        `Find pivot index p (index of minimum element).`,
        `Binary search: left=0, right=n-1 (logical indices).`,
        `Each step: real = (left + (right-left)/2 + p) % n.`,
        `Compare nums[real] to target; adjust left/right accordingly.`,
        `Return real index when found, or -1.`,
      ],
      example: `nums=[4,5,6,7,0,1,2], p=4\nLogical sorted: [0,1,2,4,5,6,7] (nums at indices 4,5,6,0,1,2,3)\n\nleft=0,right=6. logical_mid=3. real=(3+4)%7=0. nums[0]=4... wait, target=0.\n  4>0 → right=2.\nleft=0,right=2. logical_mid=1. real=(1+4)%7=5. nums[5]=1>0 → right=0.\nleft=0,right=0. real=(0+4)%7=4. nums[4]=0==0 → return 4 ✅`,
      keyInsight: `O(log n) time, O(1) space. The modulo remapping is elegant — it "unrotates" the array virtually without any extra memory. Trickier to implement than the direct sorted-half check approach.`,
    },
  },
}
