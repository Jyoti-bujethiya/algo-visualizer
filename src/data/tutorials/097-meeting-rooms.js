/**
 * Tutorial content for #097 — Meeting Rooms
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an array of meeting time intervals where intervals[i] = [start, end], determine if a person can attend ALL meetings. A person cannot attend two meetings that overlap (where one starts before the other ends).`,
    example: `intervals = [[0,30],[5,10],[15,20]]\nMeeting 1: 0–30\nMeeting 2: 5–10 → overlaps with Meeting 1 (5 < 30)\n→ Cannot attend all meetings.\n✅ Answer: false\n\nintervals = [[7,10],[2,4]]\nSorted: [[2,4],[7,10]] → 4 ≤ 7, no overlap.\n✅ Answer: true`,
    keyInsight: `Two intervals [a,b] and [c,d] overlap if and only if c < b (the next meeting starts before the current one ends). Sort by start time — then you only need to check adjacent pairs.`,
  },

  approaches: {
    'Sort by Start Time': {
      intuition: `Sort all meetings by their start time. After sorting, any overlap can only occur between consecutive meetings: if the next meeting starts before the current one ends, there's a conflict. Walk through the sorted list and check each adjacent pair.`,
      steps: [
        `Sort intervals by start time.`,
        `For i from 1 to n-1:`,
        `  If intervals[i][0] < intervals[i-1][1]: return false (overlap found).`,
        `Return true.`,
      ],
      example: `intervals=[[0,30],[5,10],[15,20]]\nSorted: [[0,30],[5,10],[15,20]]\n\ni=1: start=5 < end=30 → overlap! return false ✅\n\nintervals=[[7,10],[2,4]]\nSorted: [[2,4],[7,10]]\ni=1: start=7 >= end=4 → no overlap.\nReturn true ✅`,
      keyInsight: `O(n log n) time (sort dominates), O(1) extra space. This is the standard solution. After sorting, overlaps only need to be checked between consecutive intervals.`,
    },

    'Sort with Explicit Comparator': {
      intuition: `Same as Sort by Start Time but uses an explicit lambda/comparator for the sort instead of default tuple comparison. This makes the sorting criterion obvious and works in all languages.`,
      steps: [
        `Sort with comparator: (a, b) → a[0] - b[0] (sort by start ascending).`,
        `For i from 1 to n-1:`,
        `  If intervals[i][0] < intervals[i-1][1]: return false.`,
        `Return true.`,
      ],
      example: `intervals=[[0,30],[5,10],[15,20]]\nAfter explicit sort by start: [[0,30],[5,10],[15,20]]\ni=1: 5 < 30 → false ✅`,
      keyInsight: `O(n log n) time, O(1) space. Functionally identical to "Sort by Start Time." The explicit comparator is standard Java style (Arrays.sort with lambda) and is worth knowing.`,
    },

    'Brute Force Check All Pairs': {
      intuition: `Check every pair of meetings (i, j) for overlap. Two meetings [a,b] and [c,d] overlap if NOT (b <= c OR d <= a), i.e., if max(a,c) < min(b,d).`,
      steps: [
        `For each pair (i, j) where i < j:`,
        `  If intervals[i][0] < intervals[j][1] AND intervals[j][0] < intervals[i][1]: return false.`,
        `Return true.`,
      ],
      example: `intervals=[[0,30],[5,10],[15,20]]\nPair (0,1): [0,30] and [5,10]: 0<10 and 5<30 → overlap! return false ✅`,
      keyInsight: `O(n²) time, O(1) space. Correct but slow. Only acceptable for very small inputs. The sorted approach is always preferable.`,
    },

    'Separate Start and End Arrays': {
      intuition: `Sort start times and end times separately. This is more commonly used for Meeting Rooms II, but for Meeting Rooms I, we check: if the (i+1)th start time comes before the ith end time (in sorted order), there must be an overlap.`,
      steps: [
        `Collect all start times in starts[], all end times in ends[].`,
        `Sort starts and ends independently.`,
        `For i from 0 to n-2:`,
        `  If starts[i+1] < ends[i]: return false.`,
        `Return true.`,
      ],
      example: `intervals=[[0,30],[5,10],[15,20]]\nstarts=[0,5,15] ends=[30,10,20]\nSorted starts=[0,5,15] sorted ends=[10,20,30]\n\ni=0: starts[1]=5 < ends[0]=10 → overlap! return false ✅`,
      keyInsight: `O(n log n) time, O(n) space. Slightly more space than the single-sort approach. This pattern generalizes directly to Meeting Rooms II (count rooms needed).`,
    },

    'Sort and Track Max End': {
      intuition: `Sort meetings by start time. Track the maximum end time seen so far. If any new meeting's start is less than the max end, there's an overlap with some earlier meeting.`,
      steps: [
        `Sort by start time.`,
        `maxEnd = intervals[0][1].`,
        `For i from 1 to n-1:`,
        `  If intervals[i][0] < maxEnd: return false.`,
        `  maxEnd = max(maxEnd, intervals[i][1]).`,
        `Return true.`,
      ],
      example: `intervals=[[0,30],[5,10],[15,20]]\nSorted: [[0,30],[5,10],[15,20]]\nmaxEnd=30\ni=1: start=5 < maxEnd=30 → return false ✅`,
      keyInsight: `O(n log n) time, O(1) space. Slightly more general than comparing only adjacent pairs — tracking maxEnd handles cases where a long meeting overlaps with many later ones. In this problem, adjacent comparison suffices since the array is sorted.`,
    },
  },
}
