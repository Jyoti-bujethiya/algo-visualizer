/**
 * Tutorial content for #084 — Kth Largest Element in an Array
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an integer array nums and an integer k, return the kth largest element in the array. Note: it is the kth largest in sorted order, not the kth distinct element. For example, k=1 means the maximum, k=2 means the second largest, and so on.`,
    example: `nums = [3,2,1,5,6,4], k = 2\nSorted descending: [6,5,4,3,2,1]\n2nd element = 5\n✅ Answer: 5`,
    keyInsight: `You don't need the full sorted array — just the k-th position. A min-heap of size k does this in O(n log k): keep the k largest elements seen so far, discarding smaller ones. Or use Quickselect for O(n) average.`,
  },

  approaches: {
    'Min Heap of Size K': {
      intuition: `Keep a min-heap that holds exactly k elements. As you scan the array, add each element to the heap. Whenever the heap grows beyond k, remove the smallest element (the heap's minimum). After the full scan, the heap holds the k largest elements, and the minimum of the heap IS the kth largest.`,
      steps: [
        `Create an empty min-heap.`,
        `For each num in nums:`,
        `  Add num to the heap.`,
        `  If heap.size > k: remove the smallest (heap.poll()).`,
        `Return heap.peek() — the smallest among the k largest.`,
      ],
      example: `nums=[3,2,1,5,6,4], k=2\n\nadd 3: heap:[3]\nadd 2: heap:[2,3]\nadd 1: size=3>2 → remove min(1). heap:[2,3]\nadd 5: heap:[2,3,5] → remove 2. heap:[3,5]\nadd 6: heap:[3,5,6] → remove 3. heap:[5,6]\nadd 4: heap:[4,5,6] → remove 4. heap:[5,6]\nReturn heap.peek() = 5 ✅`,
      keyInsight: `O(n log k) time, O(k) space. For small k this is faster than sorting the entire array. This is the go-to interview solution.`,
    },

    'Sort Descending': {
      intuition: `The simplest approach: sort the entire array in descending order and return the element at index k-1. No heap, no selection — just sort and index.`,
      steps: [
        `Sort nums in descending order.`,
        `Return nums[k - 1].`,
      ],
      example: `nums=[3,2,1,5,6,4], k=2\nSorted desc: [6,5,4,3,2,1]\nnums[k-1] = nums[1] = 5 ✅`,
      keyInsight: `O(n log n) time, O(1) extra space (in-place sort). Simple to write but wasteful — you sort the entire array to find just one element. Acceptable for small inputs or when code clarity matters most.`,
    },

    'Quickselect': {
      intuition: `Quickselect is a partial sort: it finds the kth smallest/largest in O(n) average time without fully sorting the array. Pick a pivot, partition the array so everything larger than the pivot is to the left (for kth largest). If the pivot lands at position k-1, you're done. Otherwise recurse on the appropriate half.`,
      steps: [
        `Convert "kth largest" to "find the element at index k-1 after descending sort", or equivalently index n-k after ascending sort.`,
        `Partition: pick a pivot, place all elements > pivot to the left, < pivot to the right.`,
        `If pivot index == target index: return pivot.`,
        `If pivot index < target: recurse on the right sub-array.`,
        `Else: recurse on the left sub-array.`,
      ],
      example: `nums=[3,2,1,5,6,4], k=2. Target index=1 (0-based).\n\nPartition around pivot=4: [6,5,4,3,2,1] (desc order)\nPivot 4 lands at index 2. Target=1, so go left subarray.\nPartition [6,5] around 5: [6,5]. Pivot lands at index 1. Match!\nReturn 5 ✅`,
      keyInsight: `O(n) average, O(n²) worst-case time, O(1) extra space. Fastest on average but the worst case can be mitigated with random pivot selection. Great for large arrays where O(n log n) sort is too slow.`,
    },

    'Max Heap (Extract k Times)': {
      intuition: `Build a max-heap from all elements, then extract the maximum k times. The kth extraction gives you the kth largest element.`,
      steps: [
        `Heapify all nums into a max-heap.`,
        `Call heap.extractMax() k times.`,
        `Return the last extracted value.`,
      ],
      example: `nums=[3,2,1,5,6,4], k=2\n\nMax-heap: [6,5,4,3,2,1]\nExtract 1: 6. heap:[5,4,3,2,1]\nExtract 2: 5. ← 2nd largest\nReturn 5 ✅`,
      keyInsight: `O(n + k log n) time, O(n) space. Building the heap is O(n), each extraction is O(log n). Worse than the Min Heap of size k approach for large n and small k.`,
    },

    'Counting Sort': {
      intuition: `If the range of values is bounded (e.g., -10000 to 10000 per LeetCode constraints), use a frequency array. Count how many times each value appears. Then scan from the maximum value downward, decrementing a counter by each frequency, until the counter drops below k.`,
      steps: [
        `Find min and max of nums to determine range.`,
        `Build a frequency array count[].`,
        `For each value in nums: count[val - offset]++.`,
        `Scan from the highest value downward: k -= count[val]. When k ≤ 0, return val.`,
      ],
      example: `nums=[3,2,1,5,6,4], k=2. Range 1–6.\ncount: [1,1,1,1,1,1] (each appears once)\n\nval=6: k=2-1=1. not ≤0.\nval=5: k=1-1=0. k≤0 → return 5 ✅`,
      keyInsight: `O(n + range) time, O(range) space. Extremely fast when the value range is small and fixed. Not useful for large or unbounded value ranges.`,
    },
  },
}
