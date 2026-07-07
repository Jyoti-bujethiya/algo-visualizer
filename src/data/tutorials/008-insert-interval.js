/**
 * Tutorial content for #008 — Insert Interval
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a sorted list of non-overlapping intervals and a new interval, insert the new interval into the list in the correct position, merging any overlapping intervals as needed. Return the updated list.`,
    example: `intervals = [[1,3],[6,9]], newInterval = [2,5]\n→ [2,5] overlaps [1,3] → merge to [1,5]\n→ [1,5] does not overlap [6,9]\n✅ Answer: [[1,5],[6,9]]`,
    keyInsight: `There are three phases: (1) copy all intervals that end before the new interval starts, (2) merge all intervals that overlap the new interval, (3) copy the rest. Handle each phase separately.`,
  },

  approaches: {
    'Linear Scan': {
      intuition: `Walk through the interval list left to right. First, collect all intervals that come entirely before the new interval (their end < newInterval.start). Then, merge all intervals that overlap with the new interval (their start <= newInterval.end). Finally, append whatever intervals remain after the new interval.`,
      steps: [
        `Initialize result list and index i=0.`,
        `Phase 1 — copy non-overlapping intervals before: while i < n and intervals[i][1] < newInterval[0], add intervals[i] to result, i++.`,
        `Phase 2 — merge overlapping intervals: while i < n and intervals[i][0] <= newInterval[1]:`,
        `  newInterval[0] = min(newInterval[0], intervals[i][0])`,
        `  newInterval[1] = max(newInterval[1], intervals[i][1]), i++`,
        `Add the merged newInterval to result.`,
        `Phase 3 — copy remaining intervals: add all intervals from i to end.`,
        `Return result.`,
      ],
      example: `intervals = [[1,3],[6,9]], newInterval = [2,5]\n\nPhase 1: intervals[0][1]=3 ≥ 2 (newInterval[0]) → stop. result=[]\nPhase 2:\n  i=0: [1,3] overlaps [2,5] (1<=5) → new=[min(1,2),max(3,5)]=[1,5], i=1\n  i=1: [6,9] doesn't overlap (6>5) → stop\n  Add [1,5] → result=[[1,5]]\nPhase 3: add [6,9] → result=[[1,5],[6,9]]\n✅ Answer: [[1,5],[6,9]]`,
      keyInsight: `O(n) time, O(n) space. One linear pass with three clean phases. Since intervals are already sorted, we never need to backtrack — this is the optimal approach.`,
    },

    'Binary Search + Linear Merge': {
      intuition: `Use binary search to quickly find the first interval that might overlap with the new interval (the first interval whose end >= newInterval.start). Then do the merge from that position forward. Binary search speeds up finding the insertion point for large lists.`,
      steps: [
        `Binary search for the first index where intervals[i][1] >= newInterval[0].`,
        `Copy all intervals before that index directly to result (they cannot overlap).`,
        `From the found index, merge all overlapping intervals with newInterval (while intervals[i][0] <= newInterval[1]).`,
        `Add the merged newInterval to result.`,
        `Copy all remaining intervals after the merged region.`,
        `Return result.`,
      ],
      example: `intervals = [[1,3],[6,9]], newInterval = [2,5]\n\nBinary search for first interval with end >= 2:\n  intervals[0][1]=3 >= 2 → found at index 0\n\nCopy before index 0: nothing to copy.\nMerge from index 0:\n  [1,3]: 1<=5 → new=[1,5], i=1\n  [6,9]: 6>5 → stop\nAdd [1,5].\nCopy remaining: [6,9]\n✅ Answer: [[1,5],[6,9]]`,
      keyInsight: `O(log n + n) time — binary search is O(log n) but copying intervals is still O(n). Mainly benefits when the new interval belongs early in a very large list. Merge phase remains linear.`,
    },
  },
}
