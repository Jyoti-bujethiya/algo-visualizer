/**
 * Tutorial content for #085 — Top K Frequent Elements
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an integer array nums and an integer k, return the k most frequent elements. The answer can be returned in any order. It is guaranteed that the answer is unique (no tie at the kth position).`,
    example: `nums = [1,1,1,2,2,3], k = 2\nFrequencies: 1→3, 2→2, 3→1\nTop-2 most frequent: [1, 2]\n✅ Answer: [1, 2]`,
    keyInsight: `First count frequencies (a HashMap). Then the challenge is extracting the top k by frequency efficiently — a min-heap of size k achieves O(n log k), and bucket sort achieves O(n) since frequencies are bounded by n.`,
  },

  approaches: {
    'Min Heap of Size K': {
      intuition: `Count element frequencies with a hash map. Then maintain a min-heap of size k keyed by frequency. As you add each (element, freq) pair, if the heap grows beyond k, remove the one with the lowest frequency. After processing all elements, everything left in the heap is a top-k element.`,
      steps: [
        `Build a frequency map: map[num] = count.`,
        `Create an empty min-heap (sorted by frequency).`,
        `For each (num, freq) in the map:`,
        `  Add (freq, num) to the heap.`,
        `  If heap.size > k: remove the minimum-frequency element.`,
        `Extract all elements from the heap into the result array.`,
      ],
      example: `nums=[1,1,1,2,2,3], k=2\nfreqMap: {1:3, 2:2, 3:1}\n\nAdd (3,1): heap:[(3,1)]\nAdd (2,2): heap:[(2,2),(3,1)]\nAdd (1,3): heap:[(1,3),(3,1),(2,2)] size=3>2 → remove min(1,3). heap:[(2,2),(3,1)]\nResult: [1, 2] ✅`,
      keyInsight: `O(n log k) time, O(n + k) space. Great general-purpose solution. If k is close to n, use a max-heap of all elements instead to avoid redundant comparisons.`,
    },

    'Bucket Sort': {
      intuition: `After counting frequencies, create an array of "buckets" indexed by frequency (index i holds all elements that appear exactly i times). Since no element can appear more than n times, we need at most n+1 buckets.\n\nThen scan from the highest bucket downward, collecting elements until we have k of them.`,
      steps: [
        `Build frequency map.`,
        `Create buckets: List<Integer>[] where buckets[i] = all nums with frequency i.`,
        `For each (num, freq) in freqMap: buckets[freq].add(num).`,
        `Scan from buckets[n] down to buckets[1], adding elements to result until result has k elements.`,
        `Return result.`,
      ],
      example: `nums=[1,1,1,2,2,3], k=2\nfreqMap: {1:3, 2:2, 3:1}\nbuckets: idx0=[] idx1=[3] idx2=[2] idx3=[1] idx4=[] ...\n\nScan from high:\n  idx3: add 1. result=[1], need 1 more.\n  idx2: add 2. result=[1,2], done.\nReturn [1,2] ✅`,
      keyInsight: `O(n) time, O(n) space. This is the optimal solution — it exploits the fact that frequencies are bounded by n, enabling a counting-based approach rather than comparison-based sorting.`,
    },

    'Quickselect on Frequency': {
      intuition: `Build the frequency map, then use the Quickselect algorithm on the keys array (partitioned by frequency) to find the kth partition point. All elements at or beyond the partition are in the top k.`,
      steps: [
        `Build frequency map.`,
        `Extract the unique numbers into an array unique[].`,
        `Use Quickselect: target position is len(unique) - k.`,
        `Partition by frequency: elements with freq ≤ pivot go left, > pivot go right.`,
        `When pivot lands at the target position, return unique[target..end].`,
      ],
      example: `nums=[1,1,1,2,2,3], k=2. unique=[1,2,3], freqs=[3,2,1]\ntarget = 3-2 = 1\n\nPartition around freq=2 (num=2):\n  [3(freq=1), 2(freq=2), 1(freq=3)] (ascending freq order)\nPivot at index 1 = target? Yes.\nReturn unique[1..2] = [2,1] ✅`,
      keyInsight: `O(n) average, O(n²) worst-case time, O(n) space. Same trade-off as Quickselect for kth largest — excellent average performance, not guaranteed.`,
    },

    'Sort by Frequency': {
      intuition: `The most straightforward approach: count frequencies, then sort the unique elements by frequency descending and return the first k.`,
      steps: [
        `Build frequency map.`,
        `Sort the entries of the map by frequency descending.`,
        `Return the first k keys.`,
      ],
      example: `nums=[1,1,1,2,2,3], k=2\nfreqMap: {1:3, 2:2, 3:1}\nSorted by freq desc: [(1,3),(2,2),(3,1)]\nFirst 2 keys: [1,2] ✅`,
      keyInsight: `O(n log n) time (dominated by sort), O(n) space. Simple to write, easy to understand, passes most test cases. Slightly worse than the heap/bucket approaches for large n.`,
    },

    'Max Heap': {
      intuition: `Build a max-heap keyed by frequency. Extract the maximum k times. Each extraction gives you the next most frequent element.`,
      steps: [
        `Build frequency map.`,
        `Insert all (freq, num) pairs into a max-heap.`,
        `Extract max k times, collecting the num from each extracted pair.`,
        `Return collected nums.`,
      ],
      example: `nums=[1,1,1,2,2,3], k=2\nmax-heap: [(3,1),(2,2),(1,3)]\nExtract 1: (3,1) → take num=1\nExtract 2: (2,2) → take num=2\nReturn [1,2] ✅`,
      keyInsight: `O(n + k log n) time, O(n) space. Heapifying all entries costs O(n), each of the k extractions costs O(log n). For small k relative to n, the Min Heap of size k approach is better.`,
    },
  },
}
