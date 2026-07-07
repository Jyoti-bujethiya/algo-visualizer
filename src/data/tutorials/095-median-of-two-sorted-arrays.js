/**
 * Tutorial content for #095 — Median of Two Sorted Arrays
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given two sorted arrays nums1 and nums2, return the median of the two arrays combined, in O(log(m+n)) time. The median is the middle value (odd total count) or the average of the two middle values (even total count).`,
    example: `nums1 = [1,3], nums2 = [2]\nCombined sorted: [1,2,3]. Middle = 2.\n✅ Answer: 2.0\n\nnums1 = [1,2], nums2 = [3,4]\nCombined: [1,2,3,4]. Middle two = 2 and 3. Median = 2.5.\n✅ Answer: 2.5`,
    keyInsight: `The median splits the combined array into two equal halves. Binary search on the smaller array to find a "partition point" that perfectly balances both halves. Check that the left max of each half ≤ right min of the other half.`,
  },

  approaches: {
    'Binary Search on Smaller Array': {
      intuition: `Partition both arrays so that their combined "left halves" have exactly half the total elements. Binary search on the smaller array (for efficiency) to find the right partition point.\n\nThe partition is correct when: maxLeft1 ≤ minRight2 AND maxLeft2 ≤ minRight1.\nIf maxLeft1 > minRight2, move the partition left; else move it right.`,
      steps: [
        `Ensure nums1 is the shorter array (swap if needed).`,
        `Total half = (m + n + 1) / 2.`,
        `Binary search: lo=0, hi=m (partitionX ranges from 0 to m).`,
        `partitionX = (lo + hi) / 2. partitionY = half - partitionX.`,
        `maxLeft1  = partitionX==0 ? -∞ : nums1[partitionX-1].`,
        `minRight1 = partitionX==m ? +∞ : nums1[partitionX].`,
        `maxLeft2  = partitionY==0 ? -∞ : nums2[partitionY-1].`,
        `minRight2 = partitionY==n ? +∞ : nums2[partitionY].`,
        `If maxLeft1 <= minRight2 AND maxLeft2 <= minRight1: found! Compute median.`,
        `  If total is odd: return max(maxLeft1, maxLeft2).`,
        `  If even: return (max(maxLeft1,maxLeft2) + min(minRight1,minRight2)) / 2.0.`,
        `If maxLeft1 > minRight2: hi = partitionX - 1.`,
        `Else: lo = partitionX + 1.`,
      ],
      example: `nums1=[1,3], nums2=[2]. m=2, n=1. half=(2+1+1)/2=2.\n\nlo=0,hi=2 → partitionX=1, partitionY=2-1=1.\nmaxLeft1=nums1[0]=1, minRight1=nums1[1]=3.\nmaxLeft2=nums2[0]=2, minRight2=+∞ (partitionY=n=1? no, n=1 so yes).\nWait: n=1, partitionY=1=n → minRight2=+∞.\nmaxLeft1(1)<=minRight2(+∞) ✓ maxLeft2(2)<=minRight1(3) ✓\nTotal odd → return max(1,2)=2 ✅`,
      keyInsight: `O(log(min(m,n))) time, O(1) space. This is the required O(log(m+n)) solution. The hardest problem in the 076-100 set — understanding the partition invariant is the entire key.`,
    },

    'Merge and Find Median': {
      intuition: `Merge both sorted arrays into one sorted array using the two-pointer merge (like merge sort's merge step). Then find the median directly by indexing into the merged array.`,
      steps: [
        `Allocate merged array of size m+n.`,
        `Use two pointers i, j. While both arrays have elements, pick the smaller.`,
        `Append any remaining elements.`,
        `If total is odd: return merged[(m+n)/2].`,
        `If even: return (merged[(m+n)/2 - 1] + merged[(m+n)/2]) / 2.0.`,
      ],
      example: `nums1=[1,3], nums2=[2]\n\nMerge: 1<2→take 1; 2<3→take 2; take 3.\nmerged=[1,2,3]. total=3 (odd). return merged[1]=2 ✅`,
      keyInsight: `O(m+n) time, O(m+n) space. Simple to understand and implement. Does not satisfy the O(log(m+n)) requirement but is perfectly valid for interviews where that constraint isn't enforced.`,
    },

    'Two Pointers (No Merge Array)': {
      intuition: `Same idea as merge, but instead of storing the merged array, just advance two pointers until you reach the median position(s). You only need to remember the last two values seen.`,
      steps: [
        `total = m+n. target = total/2.`,
        `i=0, j=0. prev=-1, curr=-1.`,
        `Advance (target+1) steps: at each step pick the smaller of nums1[i] and nums2[j] (or whichever array has remaining elements).`,
        `After each step, prev=curr, curr=new value.`,
        `If total is odd: return curr.`,
        `If even: return (prev + curr) / 2.0.`,
      ],
      example: `nums1=[1,2], nums2=[3,4]. total=4, target=2.\n\nStep1: min(1,3)=1. prev=-1,curr=1.\nStep2: min(2,3)=2. prev=1,curr=2.\nStep3: min(∞,3)=3. prev=2,curr=3.\nTotal even → (prev+curr)/2 = (2+3)/2 = 2.5 ✅`,
      keyInsight: `O(m+n) time, O(1) space. No extra array needed — just two variables to track the two middle positions. Simpler to implement than binary search but still O(m+n).`,
    },

    'Recursive Kth Element': {
      intuition: `Finding the median is equivalent to finding the ((m+n)/2)th and ((m+n+1)/2)th smallest elements. Use a recursive "find kth smallest in two sorted arrays" algorithm: compare the (k/2)th elements of both arrays and discard the smaller half — it can't contain the kth element.`,
      steps: [
        `Define findKth(nums1, start1, nums2, start2, k):`,
        `  If start1 >= m: return nums2[start2 + k - 1].`,
        `  If start2 >= n: return nums1[start1 + k - 1].`,
        `  If k == 1: return min(nums1[start1], nums2[start2]).`,
        `  mid1 = start1 + k/2 - 1 < m ? nums1[start1 + k/2 - 1] : +∞.`,
        `  mid2 = start2 + k/2 - 1 < n ? nums2[start2 + k/2 - 1] : +∞.`,
        `  If mid1 < mid2: return findKth(nums1, start1+k/2, nums2, start2, k - k/2).`,
        `  Else: return findKth(nums1, start1, nums2, start2+k/2, k - k/2).`,
        `Call with appropriate k for the median position(s).`,
      ],
      example: `nums1=[1,3], nums2=[2]. k=2 (for median of 3 elements, find 2nd smallest).\n\nfindKth(0,0,k=2): mid1=nums1[0]=1, mid2=nums2[0]=2. 1<2 → skip first k/2=1 of nums1.\nfindKth(1,0,k=1): k=1 → return min(nums1[1]=3, nums2[0]=2) = 2 ✅`,
      keyInsight: `O(log(m+n)) time, O(log(m+n)) stack space. Correct and O(log(m+n)) but harder to implement than the partition-based binary search. Good to understand the kth-element reduction as a concept.`,
    },

    'Concatenate and Sort': {
      intuition: `Concatenate both arrays into one, sort it, and find the median. The simplest possible approach — no two-pointer merge, no binary search, just combine and sort.`,
      steps: [
        `combined = nums1 + nums2.`,
        `Sort combined.`,
        `n = combined.length. Return median based on odd/even length.`,
      ],
      example: `nums1=[1,3], nums2=[2]\ncombined=[1,3,2] → sorted=[1,2,3]\nLength=3 (odd) → return combined[1]=2 ✅`,
      keyInsight: `O((m+n) log(m+n)) time, O(m+n) space. The least efficient correct solution. Useful only for quick prototyping or when simplicity is more important than efficiency.`,
    },
  },
}
