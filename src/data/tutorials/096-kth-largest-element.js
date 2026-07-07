/**
 * Tutorial content for #096 — Kth Largest Element (Quickselect focus)
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Find the kth largest element in an unsorted array. This is the same core problem as #084, but this version highlights the Quickselect algorithm as the primary solution. Note: "kth largest" means the kth in descending sorted order — so k=1 is the maximum, k=2 is the second largest, etc.`,
    example: `nums = [3,2,3,1,2,4,5,5,6], k = 4\nSorted descending: [6,5,5,4,3,3,2,2,1]\n4th largest = 4\n✅ Answer: 4`,
    keyInsight: `Quickselect: pick a pivot, partition the array so all elements ≥ pivot are on the left. If the pivot lands at index k-1 (0-based), it IS the kth largest. Otherwise recurse on the relevant half. Average O(n).`,
  },

  approaches: {
    'Quickselect': {
      intuition: `Choose a pivot element. Partition the array in-place: all elements LARGER than the pivot go left, smaller go right (for kth largest). If the pivot ends up at position k-1, we found the answer. If it's at position > k-1, the kth largest is in the left part; if < k-1, it's in the right part.\n\nWith a random pivot, this runs in O(n) on average.`,
      steps: [
        `Set left=0, right=n-1. Target index = k-1.`,
        `While left < right:`,
        `  Randomly pick pivot; swap to end.`,
        `  Partition: i=left. For j=left to right-1: if nums[j] >= pivot, swap nums[i] and nums[j], i++.`,
        `  Swap nums[i] and nums[right] (place pivot).`,
        `  If i == k-1: return nums[i].`,
        `  If i < k-1: left = i + 1.`,
        `  Else: right = i - 1.`,
        `Return nums[left].`,
      ],
      example: `nums=[3,2,3,1,2,4,5,5,6], k=4. Target index=3.\nPick pivot=4 (index 5).\nPartition (keep ≥4 on left): [5,5,6,4, | 2,3,1,2,3] pivot at index 3.\nPivot index==3==target → return nums[3]=4 ✅`,
      keyInsight: `O(n) average, O(n²) worst case, O(1) extra space (in-place). Use random pivot selection to avoid worst case. The gold-standard for "find kth element" when average speed matters.`,
    },

    'Min Heap of Size K': {
      intuition: `Maintain a min-heap of size k as you scan the array. Elements smaller than the heap's minimum get discarded; larger ones push out the minimum. After scanning, the heap's minimum is the kth largest.`,
      steps: [
        `Create empty min-heap.`,
        `For each num in nums:`,
        `  heap.add(num).`,
        `  If heap.size > k: heap.poll() (remove smallest).`,
        `Return heap.peek().`,
      ],
      example: `nums=[3,2,3,1,2,4,5,5,6], k=4\n\nAdd 3: [3]\nAdd 2: [2,3]\nAdd 3: [2,3,3]\nAdd 1: [1,2,3,3] size=4=k ✓\nAdd 2: [1,2,2,3,3] size=5>4 → remove 1. [2,2,3,3]\nAdd 4: [2,2,3,3,4]>4 → remove 2. [2,3,3,4]\nAdd 5: ... → [3,3,4,5]\nAdd 5: ... → [3,4,5,5]\nAdd 6: ... → [4,5,5,6]\nReturn heap.peek()=4 ✅`,
      keyInsight: `O(n log k) time, O(k) space. The reliable O(n log k) approach — slower than Quickselect on average but has no worst case. Great when k is small.`,
    },

    'Sort Descending': {
      intuition: `Sort the entire array in descending order. The answer is at index k-1. Clean and obvious — O(n log n) but very easy to implement.`,
      steps: [
        `Sort nums descending.`,
        `Return nums[k - 1].`,
      ],
      example: `nums=[3,2,3,1,2,4,5,5,6], k=4\nSorted desc: [6,5,5,4,3,3,2,2,1]\nnums[3]=4 ✅`,
      keyInsight: `O(n log n) time, O(1) space. Easiest to write. Good first attempt; follow up with Quickselect or heap if the interviewer asks for an improvement.`,
    },

    'Max Heap (Extract k Times)': {
      intuition: `Build a max-heap from all elements. Extract the maximum k times. The kth extracted value is the kth largest.`,
      steps: [
        `Heapify nums into a max-heap.`,
        `Call extractMax() k times.`,
        `Return the last extracted value.`,
      ],
      example: `nums=[3,2,3,1,2,4,5,5,6], k=4\nMax-heap: [6,5,5,4,3,3,2,2,1]\nExtract: 6, 5, 5, 4 ← 4th extraction\nReturn 4 ✅`,
      keyInsight: `O(n + k log n) time, O(n) space. Building a max-heap takes O(n). Each extraction is O(log n). Worse than Min Heap of size k when k is small relative to n.`,
    },

    'nth_element via partial sort': {
      intuition: `Use the language's built-in partial sort or nth_element. In C++: nth_element(nums.begin(), nums.begin()+k-1, nums.end(), greater<int>()). In Python: heapq.nlargest(k, nums)[-1]. These use Quickselect internally.`,
      steps: [
        `C++: nth_element(begin, begin + k - 1, end, greater<int>()); return nums[k-1].`,
        `Python: return heapq.nlargest(k, nums)[-1].`,
      ],
      example: `nums=[3,2,3,1,2,4,5,5,6], k=4\nheapq.nlargest(4, nums) → [6,5,5,4]\n[-1] → 4 ✅`,
      keyInsight: `O(n) average via Quickselect internally. The most concise solution. Useful in a real coding environment; in an interview, implement Quickselect manually to demonstrate understanding.`,
    },
  },
}
