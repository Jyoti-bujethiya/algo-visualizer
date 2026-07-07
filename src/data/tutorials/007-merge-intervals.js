/**
 * Tutorial content for #007 — Merge Intervals
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a collection of intervals, merge all overlapping intervals and return the result. Two intervals overlap if one starts before the other ends.`,
    example: `intervals = [[1,3],[2,6],[8,10],[15,18]]\n→ [1,3] and [2,6] overlap (3 ≥ 2) → merge to [1,6]\n→ [8,10] and [15,18] don't overlap\n✅ Answer: [[1,6],[8,10],[15,18]]`,
    keyInsight: `After sorting by start time, you only ever need to check if the current interval overlaps with the last interval in your result list — no need to check all previous ones.`,
  },

  approaches: {
    'Brute Force': {
      intuition: `Repeatedly scan the list for any two intervals that overlap and merge them into one. Keep repeating until no more merges are possible. Very simple to reason about but highly inefficient — each full scan only fixes one merge.`,
      steps: [
        `Set merged = true to enter the loop.`,
        `While merged is true: set merged = false.`,
        `  Compare every pair (i, j) of intervals.`,
        `  If they overlap (max(start_i, start_j) <= min(end_i, end_j)):`,
        `    Replace both with one merged interval, set merged = true, break inner loops.`,
        `Return the final list.`,
      ],
      example: `intervals = [[1,3],[2,6],[8,10],[15,18]]\n\nPass 1: [1,3] and [2,6] overlap → merge → [[1,6],[8,10],[15,18]], merged=true\nPass 2: check all pairs — none overlap → merged=false, stop\n✅ Answer: [[1,6],[8,10],[15,18]]`,
      keyInsight: `O(n²) to O(n³) time, O(n) space. Each pass may merge only one pair, so up to n passes of O(n²) scanning. Never use this in practice.`,
    },

    'Sorting': {
      intuition: `Sort all intervals by their start time. Then walk through them once: if the current interval overlaps with the last merged interval, extend the last one's end. Otherwise, start a new interval in the result. Sorting guarantees that any overlap can only be with the immediately preceding interval.`,
      steps: [
        `Sort intervals by start value.`,
        `Initialize result list with the first interval.`,
        `For each subsequent interval curr:`,
        `  Let last = result's last interval.`,
        `  If curr.start <= last.end: they overlap → update last.end = max(last.end, curr.end).`,
        `  Else: no overlap → add curr to result as a new interval.`,
        `Return result.`,
      ],
      example: `intervals sorted: [[1,3],[2,6],[8,10],[15,18]]\n\nresult = [[1,3]]\ncurr=[2,6]: 2<=3 → merge → result=[[1,6]]\ncurr=[8,10]: 8>6 → new → result=[[1,6],[8,10]]\ncurr=[15,18]: 15>10 → new → result=[[1,6],[8,10],[15,18]]\n✅ Answer: [[1,6],[8,10],[15,18]]`,
      keyInsight: `O(n log n) time (sort dominates), O(n) space. This is the standard solution. After sorting, one linear pass is all you need — each interval is looked at exactly once.`,
    },

    'Sorting with Lambda': {
      intuition: `Identical logic to the Sorting approach, but uses a lambda/comparator explicitly passed to the sort function. This is common in Java or when you want a custom sort order that isn't the default. Same algorithm, different syntax.`,
      steps: [
        `Sort using a lambda: Arrays.sort(intervals, (a, b) -> a[0] - b[0]).`,
        `Initialize result list with the first interval.`,
        `For each subsequent interval: compare curr[0] with the last interval's end.`,
        `If overlapping: last[1] = max(last[1], curr[1]).`,
        `Else: add curr to result.`,
        `Convert result list to array and return.`,
      ],
      example: `intervals sorted via lambda: [[1,3],[2,6],[8,10],[15,18]]\n\nresult = [[1,3]]\n[2,6]: 2<=3 → last becomes [1,6]\n[8,10]: 8>6 → add new → [[1,6],[8,10]]\n[15,18]: 15>10 → add new → [[1,6],[8,10],[15,18]]\n✅ Answer: [[1,6],[8,10],[15,18]]`,
      keyInsight: `Same O(n log n) time, O(n) space as the Sorting approach. The lambda comparator is idiomatic Java — (a,b) -> a[0]-b[0] sorts by start index in ascending order.`,
    },

    'Without Modifying Result': {
      intuition: `Sort by start time, then merge intervals by tracking a "current" interval separately rather than mutating the last element of the result list. When a new interval doesn't overlap with the current one, flush the current to the result and move on. This avoids in-place list mutation, making the logic slightly easier to reason about.`,
      steps: [
        `Sort intervals by start time.`,
        `Set currStart = intervals[0][0], currEnd = intervals[0][1].`,
        `For each subsequent interval [s, e]:`,
        `  If s <= currEnd: currEnd = max(currEnd, e) (extend the current interval).`,
        `  Else: add [currStart, currEnd] to result, then set currStart=s, currEnd=e.`,
        `After the loop, add the final [currStart, currEnd] to result.`,
        `Return result.`,
      ],
      example: `intervals sorted: [[1,3],[2,6],[8,10],[15,18]]\ncurrStart=1, currEnd=3\n\n[2,6]: 2<=3 → currEnd=max(3,6)=6\n[8,10]: 8>6 → add [1,6], currStart=8, currEnd=10\n[15,18]: 15>10 → add [8,10], currStart=15, currEnd=18\nEnd of loop → add [15,18]\n✅ Answer: [[1,6],[8,10],[15,18]]`,
      keyInsight: `O(n log n) time, O(n) space — same complexity as the standard Sorting approach. The difference is stylistic: tracking current start/end variables avoids accessing the tail of the result list, which some find cleaner.`,
    },
  },
}
