/**
 * Tutorial content for #086 — Find Median from Data Stream
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Design a data structure that supports two operations: addNum(int num) — add an integer from a stream, and findMedian() — return the median of all elements added so far. The median is the middle value for odd count, or the average of the two middle values for even count.`,
    example: `addNum(1) → stream: [1]         median = 1.0\naddNum(2) → stream: [1,2]       median = 1.5\naddNum(3) → stream: [1,2,3]     median = 2.0\n✅ Answer: 1.5 then 2.0`,
    keyInsight: `Keep the stream split into two halves: a max-heap for the lower half and a min-heap for the upper half. The median lives at the tops of these two heaps. Balance them after each insertion to keep their sizes differ by at most 1.`,
  },

  approaches: {
    'Two Heaps': {
      intuition: `Maintain two heaps:\n• lo: a max-heap of the smaller half of numbers.\n• hi: a min-heap of the larger half.\n\nInvariant: every element in lo ≤ every element in hi, and |lo.size - hi.size| ≤ 1.\n\nMedian = lo.top if lo is larger, hi.top if hi is larger, or (lo.top + hi.top) / 2.0 if equal sizes.`,
      steps: [
        `addNum(num):`,
        `  Push num into lo (max-heap).`,
        `  Move lo's max to hi (ensures lo.max ≤ hi.min always).`,
        `  If hi.size > lo.size: move hi's min back to lo (rebalance).`,
        `findMedian():`,
        `  If lo.size > hi.size: return lo.top.`,
        `  Return (lo.top + hi.top) / 2.0.`,
      ],
      example: `addNum(1): lo→push 1. move max(1) to hi. hi:[1], lo:[]. hi>lo → move 1 back. lo:[1], hi:[]\naddNum(2): lo→push 2. move max(2) to hi. lo:[1], hi:[2]. equal size.\nfindMedian → (1+2)/2 = 1.5 ✅\naddNum(3): lo→push 3. move max(3) to hi. lo:[1], hi:[2,3]. hi>lo → move min(2) to lo. lo:[2,1], hi:[3]\nfindMedian → lo.size>hi.size → lo.top = 2.0 ✅`,
      keyInsight: `O(log n) per addNum (heap insertion), O(1) per findMedian (peek tops). O(n) space. This is the canonical and optimal solution to this problem.`,
    },

    'Sorted Array with Binary Search': {
      intuition: `Maintain a sorted array. To add a number, binary search for its insertion position and insert it (shifting elements). findMedian just reads the middle index.`,
      steps: [
        `Maintain a sorted list.`,
        `addNum(num): use binary search to find insertion point; insert.`,
        `findMedian(): n = list.size. If n is odd return list[n/2]. If even return (list[n/2-1] + list[n/2]) / 2.0.`,
      ],
      example: `addNum(1): [1]\naddNum(2): binary search → insert at 1 → [1,2]. median=(1+2)/2=1.5\naddNum(3): insert at 2 → [1,2,3]. median=list[1]=2.0 ✅`,
      keyInsight: `O(n) per addNum (insertion shift), O(1) per findMedian. O(n) space. Fine for small streams but too slow for large inputs — the Two Heaps approach is strictly better.`,
    },

    'Two Heaps with Explicit Routing': {
      intuition: `Same as Two Heaps, but with an explicit rule for where each new number goes: if num ≤ lo.top push to lo, else push to hi. Then rebalance by size. This makes the routing decision visible and avoids the "push then pop" pattern.`,
      steps: [
        `addNum(num):`,
        `  If lo is empty OR num ≤ lo.top: push num to lo.`,
        `  Else: push num to hi.`,
        `  Rebalance: while |lo.size - hi.size| > 1, move top of larger to smaller.`,
        `findMedian(): same as Two Heaps.`,
      ],
      example: `addNum(5): lo empty → push to lo. lo:[5], hi:[]\naddNum(3): 3≤5 → push to lo. lo:[5,3]. |lo|-|hi|=2>1 → move 5 to hi. lo:[3], hi:[5]\naddNum(4): 4≤5 (lo.top=3? no 4>3) → push to hi. hi:[4,5]. |hi|>|lo| → move 4 to lo. lo:[4,3], hi:[5]\nfindMedian → (4+5)/2 = 4.5 ✅`,
      keyInsight: `O(log n) per addNum, O(1) per findMedian. Functionally identical to the basic Two Heaps — this variant just makes the routing logic explicit, which some find easier to reason about.`,
    },

    'Insertion Sort (Linear Insert)': {
      intuition: `Keep a plain list and maintain it in sorted order by inserting each new number at the correct position (linear scan to find it). findMedian reads the center. Simple but slow — practical only for small data.`,
      steps: [
        `Maintain List<Integer> sorted.`,
        `addNum(num): scan from the start to find where num fits; insert there.`,
        `findMedian(): read from middle index.`,
      ],
      example: `addNum(3): [3]\naddNum(1): scan: 1<3 → insert at 0 → [1,3]. median=(1+3)/2=2.0\naddNum(2): scan: 2<3 → insert at 1 → [1,2,3]. median=2.0 ✅`,
      keyInsight: `O(n) per addNum, O(1) per findMedian. O(n) space. The simplest correct implementation. Only use for tiny inputs or as a reference baseline.`,
    },

    'TreeMap (Balanced BST)': {
      intuition: `Use a TreeMap (Red-Black tree) to maintain elements in sorted order. Track the total count and a "lower" pointer to the element at position count/2. addNum keeps this pointer updated by shifting it when needed.`,
      steps: [
        `TreeMap<Integer,Integer> map (value → frequency).`,
        `Track lo (the "lower median" element) and loCount (how many of lo are in the lower half).`,
        `addNum(num): insert into map. Adjust lo and loCount based on where num falls relative to lo.`,
        `findMedian(): if even, (lo + map.higherKey(lo))/2.0. If odd, return lo.`,
      ],
      example: `addNum(1): map:{1:1}, lo=1, total=1. median=1.0\naddNum(2): map:{1:1,2:1}, total=2. lo stays 1.\nfindMedian → even: (1 + nextKey(1)=2)/2 = 1.5 ✅\naddNum(3): map:{1:1,2:1,3:1}, total=3. lo moves to 2.\nfindMedian → odd: lo = 2.0 ✅`,
      keyInsight: `O(log n) per addNum and findMedian. O(n) space. Handles duplicate values elegantly and is useful when you also need range queries — but the Two Heaps approach is simpler for pure median finding.`,
    },
  },
}
