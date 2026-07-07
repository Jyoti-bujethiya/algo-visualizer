/**
 * Tutorial content for #090 — K Closest Points to Origin
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an array of points on a 2D plane, return the k closest points to the origin (0, 0). Distance is measured as Euclidean distance: √(x² + y²). You may return the answer in any order. There is guaranteed to be a unique answer (no ties at the kth position).`,
    example: `points = [[1,3],[-2,2]], k = 1\nDist² of [1,3]:  1+9  = 10\nDist² of [-2,2]: 4+4  = 8  ← smaller\n✅ Answer: [[-2,2]]`,
    keyInsight: `You don't need to compute actual Euclidean distances (no square root needed) because comparisons only require relative distances, and x²+y² preserves that order. Use a max-heap of size k: discard the farthest point whenever the heap exceeds k.`,
  },

  approaches: {
    'Sort by Distance²': {
      intuition: `Compute x²+y² for every point, sort all points by that value, and return the first k. Simple, correct, and fast enough for most inputs.`,
      steps: [
        `Sort points by (x*x + y*y) ascending.`,
        `Return the first k points.`,
      ],
      example: `points=[[1,3],[-2,2],[5,0]], k=2\nDist²: 10, 8, 25\nSorted: [[-2,2],[1,3],[5,0]]\nFirst 2: [[-2,2],[1,3]] ✅`,
      keyInsight: `O(n log n) time, O(1) extra space (in-place sort). The easiest correct solution. Great starting point in an interview before optimizing.`,
    },

    'Max Heap of Size K': {
      intuition: `Maintain a max-heap of size k keyed by squared distance. For each point, add it to the heap. If the heap grows beyond k, remove the farthest point (the max). After all points are processed, the heap holds the k closest points.`,
      steps: [
        `Create a max-heap (by x²+y²).`,
        `For each point:`,
        `  Add it to the heap.`,
        `  If heap.size > k: remove the farthest (max).`,
        `Return all points remaining in the heap.`,
      ],
      example: `points=[[1,3],[-2,2],[5,0],[0,1]], k=2\n\nAdd [1,3](d²=10): heap:[(10,[1,3])]\nAdd [-2,2](d²=8): heap:[(10,[1,3]),(8,[-2,2])]\nAdd [5,0](d²=25): heap:[(25,[5,0]),(10,[1,3]),(8,[-2,2])] size=3>2 → remove max(25).\n  heap:[(10,[1,3]),(8,[-2,2])]\nAdd [0,1](d²=1): heap:[(10,[1,3]),(8,[-2,2]),(1,[0,1])] size=3>2 → remove max(10).\n  heap:[(8,[-2,2]),(1,[0,1])]\nResult: [[-2,2],[0,1]] ✅`,
      keyInsight: `O(n log k) time, O(k) space. Better than full sort when k << n. This is the standard "top k" heap pattern.`,
    },

    'Quickselect': {
      intuition: `Quickselect finds the kth smallest element in O(n) average time without full sorting. Pick a pivot distance, partition points into "closer" and "farther" groups, and recurse on the side containing the kth position. Return all points on the "closer" side once the pivot lands at position k.`,
      steps: [
        `If k == n: return all points.`,
        `Randomly pick a pivot point.`,
        `Partition: points closer than pivot go to the left, farther go right.`,
        `If left.size == k: return left.`,
        `If left.size > k: recurse Quickselect(left, k).`,
        `Else: recurse Quickselect(right, k - left.size).`,
      ],
      example: `points=[[1,3],[-2,2],[5,0],[0,1]], k=2\nPick pivot [-2,2] (d²=8).\nLeft (d²≤8): [[-2,2],[0,1]]  Right: [[1,3],[5,0]]\nleft.size=2 == k=2 → return [[-2,2],[0,1]] ✅`,
      keyInsight: `O(n) average, O(n²) worst-case time. O(1) extra space. Fastest on average for large arrays — used in practice when you need raw speed without the O(n log n) sort overhead.`,
    },

    'Partial Sort': {
      intuition: `Use a language built-in that can do a partial sort — Java's Arrays.sort with a custom comparator, Python's heapq.nsmallest, C++'s partial_sort or nth_element. The idea is identical to Sort by Distance² but using a library function that may be optimized for this case.`,
      steps: [
        `Use heapq.nsmallest(k, points, key=lambda p: p[0]**2 + p[1]**2) in Python.`,
        `Or Arrays.sort(points, Comparator.comparingInt(p -> p[0]*p[0] + p[1]*p[1])) and take first k.`,
        `Or partial_sort / nth_element in C++.`,
      ],
      example: `points=[[1,3],[-2,2],[5,0]], k=1\nheapq.nsmallest(1, points, key=dist²)\n→ dist²: 10, 8, 25\n→ smallest 1: [[-2,2]] ✅`,
      keyInsight: `O(n log k) for heapq.nsmallest, O(n log n) for full sort. Leverages highly optimized library internals. Pragmatic choice in a time-pressured coding environment.`,
    },

    'Manual Quickselect': {
      intuition: `Same as Quickselect above, but implemented entirely by hand using in-place two-pointer partitioning on the original array — similar to how Quicksort's partition works. Avoids creating sub-arrays, modifying the input in-place.`,
      steps: [
        `Select a random pivot index; swap it to the end.`,
        `left pointer = start, right pointer = end-1.`,
        `Move all points with d² ≤ pivot's d² to the left using two-pointer swap.`,
        `Place pivot at left pointer position.`,
        `Compare pivot's position to k: recurse on the appropriate half.`,
      ],
      example: `points=[[1,3],[-2,2],[5,0],[0,1]], k=2 (0-indexed: want positions 0 and 1)\nPivot=[1,3](d²=10), swap to end: [[−2,2],[5,0],[0,1],[1,3]]\nPartition (d²≤10): [-2,2](8≤10✓), [5,0](25>10✗ stay right), [0,1](1≤10✓)\nAfter partition+place pivot: [[-2,2],[0,1],[1,3],[5,0]]\nPivot at index 2. k=2 → left 2 elements are the answer.\nReturn [[-2,2],[0,1]] ✅`,
      keyInsight: `O(n) average, O(1) extra space (in-place). The most memory-efficient solution. Tricky to implement correctly under pressure — the library Quickselect or heap approach is safer in interviews.`,
    },
  },
}
