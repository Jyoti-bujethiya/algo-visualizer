/**
 * Tutorial content for #055 — Longest Increasing Subsequence
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an integer array, find the length of the longest strictly increasing subsequence. A subsequence does not need to be contiguous — you can skip elements, but the remaining elements must be in strictly increasing order.`,
    example: `nums = [10, 9, 2, 5, 3, 7, 101, 18]\n→ Longest increasing subsequence: [2, 3, 7, 101]\n✅ Answer: 4`,
    keyInsight: `For each element, ask: what is the longest increasing subsequence that ends exactly here? The answer is 1 + the best answer among all earlier, smaller elements.`,
  },

  approaches: {
    'DP O(n²)': {
      intuition: `Define dp[i] as the length of the longest increasing subsequence ending at index i. For each i, scan all earlier indices j. If nums[j] < nums[i], then we could extend the LIS ending at j by nums[i], so dp[i] = max(dp[i], dp[j]+1). The answer is the maximum in the dp array.`,
      steps: [
        `Create dp array of size n, all initialised to 1 (each element alone is an LIS of length 1).`,
        `For i from 1 to n-1:`,
        `  For j from 0 to i-1:`,
        `    If nums[j] < nums[i]: dp[i] = max(dp[i], dp[j] + 1).`,
        `Return max(dp).`,
      ],
      example: `nums = [10, 9, 2, 5, 3, 7, 101, 18]\n\ndp[0]=1 (10)\ndp[1]=1 (9, nothing smaller before)\ndp[2]=1 (2, nothing smaller)\ndp[3]=2 (5 > 2, dp[2]+1)\ndp[4]=2 (3 > 2, dp[2]+1)\ndp[5]=3 (7 > 2,5,3 → best dp[3]+1 or dp[4]+1 = 3)\ndp[6]=4 (101 > all → dp[5]+1=4)\ndp[7]=4 (18 > 2,5,3,7 → dp[5]+1=4)\nmax = 4\n✅ Answer: 4`,
      keyInsight: `O(n²) time, O(n) space. Easy to understand and implement — the go-to solution when n ≤ 2000.`,
    },

    'DP with Reconstruction': {
      intuition: `Same O(n²) DP, but additionally track a parent array so we can trace back which elements form the actual LIS, not just its length. At each step, when dp[i] is updated, record parent[i] = j so we can walk backward from the best ending index.`,
      steps: [
        `Build dp and parent arrays as in O(n²) DP.`,
        `Track the index with the maximum dp value as bestIdx.`,
        `Walk back using parent[bestIdx] until parent is -1.`,
        `Reverse the collected indices to get the LIS in order.`,
      ],
      example: `nums = [10, 9, 2, 5, 3, 7, 101, 18]\n\nAfter DP: dp = [1,1,1,2,2,3,4,4]\nparent = [-1,-1,-1,2,2,3 or 4,5,5]\nTrace from index 6 (dp=4):\n  6 ← 5 ← 4 or 3 ← 2\nPath: indices [2,4,5,6] → values [2,3,7,101]\n✅ Answer: [2, 3, 7, 101] (length 4)`,
      keyInsight: `O(n²) time and O(n) space — same complexity as plain DP but with the bonus of returning the actual subsequence, not just its length.`,
    },

    'Binary Search (Patience Sorting)': {
      intuition: `Maintain a "tails" array where tails[i] is the smallest possible tail element of any increasing subsequence of length i+1. For each number, binary search tails to find where it fits. This keeps tails sorted and allows O(log n) updates per element.`,
      steps: [
        `Create an empty tails array.`,
        `For each num in nums:`,
        `  Binary search tails for the leftmost position where tails[pos] >= num.`,
        `  If pos == tails.length, append num (extends longest LIS).`,
        `  Else replace tails[pos] = num (better tail for that length).`,
        `Return tails.length.`,
      ],
      example: `nums = [10, 9, 2, 5, 3, 7, 101, 18]\n\ntails=[]\n10 → tails=[10]\n9  → replace 10 → tails=[9]\n2  → replace 9  → tails=[2]\n5  → append    → tails=[2,5]\n3  → replace 5 → tails=[2,3]\n7  → append    → tails=[2,3,7]\n101→ append    → tails=[2,3,7,101]\n18 → replace 101→ tails=[2,3,7,18]\nLength = 4\n✅ Answer: 4`,
      keyInsight: `O(n log n) time, O(n) space. Note: tails is NOT the actual LIS — it's a virtual structure. This is the optimal approach for large inputs.`,
    },

    'Binary Search with Manual Implementation': {
      intuition: `The same patience-sorting logic but using a manually written binary search instead of a library call. This makes the algorithm fully self-contained and is useful in environments where library binary search isn't available, or when you want to understand every line.`,
      steps: [
        `Create tails array and a size counter.`,
        `For each num: manually binary search tails[0..size-1] for leftmost index where tails[idx] >= num.`,
        `Set tails[idx] = num; if idx == size, increment size.`,
        `Return size.`,
      ],
      example: `Same as Binary Search (Patience Sorting) — result is identical.\nnums = [10,9,2,5,3,7,101,18]\ntails progression: [10]→[9]→[2]→[2,5]→[2,3]→[2,3,7]→[2,3,7,101]→[2,3,7,18]\nLength = 4\n✅ Answer: 4`,
      keyInsight: `O(n log n) time, O(n) space. Identical performance to the library version — the manual binary search is just more transparent about what "leftmost index where tails[i] >= num" means.`,
    },

    'Segment Tree': {
      intuition: `Coordinate-compress the values, then use a segment tree that supports point-update and range-max query. For each element in the array, query the segment tree for the best LIS length ending with any value strictly less than the current element, then update the tree at the current value.`,
      steps: [
        `Coordinate compress: map values to ranks 1..n.`,
        `Build a segment tree supporting range-max query and point-update.`,
        `For each element (in order), query max in range [1, rank-1].`,
        `The LIS length ending here = query result + 1.`,
        `Update the tree at position rank with this new length.`,
        `Track and return the overall maximum.`,
      ],
      example: `nums = [10,9,2,5,3,7,101,18]\nRanks: 10→5, 9→4, 2→1, 5→3, 3→2, 7→4(adj), 101→8, 18→7\n\nProcess rank 5: query[1,4]=0 → dp=1, update pos5=1\nProcess rank 4: query[1,3]=0 → dp=1, update pos4=1\nProcess rank 1: query[1,0]=0 → dp=1, update pos1=1\nProcess rank 3: query[1,2]=1 → dp=2, update pos3=2\n... eventually max = 4\n✅ Answer: 4`,
      keyInsight: `O(n log n) time, O(n) space. More complex than patience sorting but generalises to 2D LIS and other DP problems that need range-max queries.`,
    },
  },
}
