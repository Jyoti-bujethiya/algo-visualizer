/*
 * LeetCode Problem #56: Merge Intervals
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/merge-intervals/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Brute Force | O(n³) time | O(n) space
    // EXPLAIN: Repeatedly scan all interval pairs and merge overlapping ones until no merges are possible.
    // WHEN: Never (too slow) — shows the naive baseline before the sorting approach.
    public int[][] merge_BruteForce(int[][] intervals) {
        List<int[]> result = new ArrayList<>();
        for (int[] iv : intervals) result.add(iv.clone());

        boolean merged = true;
        while (merged) {
            merged = false;
            List<int[]> temp = new ArrayList<>();
            boolean[] used = new boolean[result.size()];
            for (int i = 0; i < result.size(); i++) {
                if (used[i]) continue;
                int[] cur = result.get(i).clone();
                used[i] = true;
                for (int j = i + 1; j < result.size(); j++) {
                    if (used[j]) continue;
                    int[] other = result.get(j);
                    if (cur[1] >= other[0] && cur[0] <= other[1]) {
                        cur[0] = Math.min(cur[0], other[0]);
                        cur[1] = Math.max(cur[1], other[1]);
                        used[j] = true;
                        merged = true;
                    }
                }
                temp.add(cur);
            }
            result = temp;
        }
        return result.toArray(new int[result.size()][]);
    }

    // APPROACH 2: Sorting | O(n log n) time | O(n) space
    // EXPLAIN: Sort by start time; iterate and merge the current interval into the last result if they overlap.
    // WHEN: Standard and optimal approach — always use this for interval merging problems.
    public int[][] merge(int[][] intervals) {
        if (intervals.length <= 1) return intervals;

        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);

        List<int[]> merged = new ArrayList<>();
        int[] current = intervals[0];

        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] <= current[1]) {
                current[1] = Math.max(current[1], intervals[i][1]);
            } else {
                merged.add(current);
                current = intervals[i];
            }
        }
        merged.add(current);

        return merged.toArray(new int[merged.size()][]);
    }

    // APPROACH 3: Sorting with Lambda | O(n log n) time | O(n) space
    // EXPLAIN: Same as sorting but uses an explicit lambda comparator — useful for custom interval types.
    // WHEN: When intervals arrive as a custom object and you need an explicit comparator.
    public int[][] merge_CustomSort(int[][] intervals) {
        if (intervals.length <= 1) return intervals;

        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

        List<int[]> result = new ArrayList<>();
        result.add(intervals[0].clone());

        for (int i = 1; i < intervals.length; i++) {
            int[] last = result.get(result.size() - 1);
            if (intervals[i][0] <= last[1]) {
                last[1] = Math.max(last[1], intervals[i][1]);
            } else {
                result.add(intervals[i].clone());
            }
        }
        return result.toArray(new int[result.size()][]);
    }

    // APPROACH 4: Without Modifying Result | O(n log n) time | O(n) space
    // EXPLAIN: Maintains a running (start, end) pair; saves it when a gap is found, avoids mutating the list.
    // WHEN: Functional style that avoids in-place list mutation — cleaner in some codebases.
    public int[][] merge_Functional(int[][] intervals) {
        if (intervals.length == 0) return new int[0][];

        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);

        List<int[]> result = new ArrayList<>();
        int start = intervals[0][0], end = intervals[0][1];

        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] <= end) {
                end = Math.max(end, intervals[i][1]);
            } else {
                result.add(new int[]{start, end});
                start = intervals[i][0];
                end   = intervals[i][1];
            }
        }
        result.add(new int[]{start, end});

        return result.toArray(new int[result.size()][]);
    }
}

// Made with Bob
