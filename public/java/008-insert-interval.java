/*
 * LeetCode Problem #57: Insert Interval
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/insert-interval/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Linear Scan | O(n) time | O(n) space
    // EXPLAIN: Add all intervals that end before the new one, merge overlapping ones, then append the rest.
    // WHEN: Clean and straightforward; preferred when the list is not too large.
    public int[][] insert_LinearScan(int[][] intervals, int[] newInterval) {
        List<int[]> result = new ArrayList<>();
        int i = 0, n = intervals.length;

        // Add all intervals that come before the new interval
        while (i < n && intervals[i][1] < newInterval[0]) {
            result.add(intervals[i++]);
        }

        // Merge all overlapping intervals with newInterval
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
            i++;
        }
        result.add(newInterval);

        // Add remaining intervals
        while (i < n) {
            result.add(intervals[i++]);
        }

        return result.toArray(new int[result.size()][]);
    }

    // APPROACH 2: Binary Search + Linear Merge | O(log n + n) time | O(n) space
    // EXPLAIN: Use binary search to locate the first overlapping interval, then merge from there.
    // WHEN: When you want to show binary search awareness; insertion point still requires O(n) copy.
    public int[][] insert_BinarySearch(int[][] intervals, int[] newInterval) {
        List<int[]> result = new ArrayList<>();
        int n = intervals.length;

        // Binary search for first interval that could overlap (start <= newInterval end)
        int lo = 0, hi = n;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (intervals[mid][0] <= newInterval[1]) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        int rightBound = lo; // first interval that starts after newInterval ends

        // Binary search for first interval whose end >= newInterval start
        lo = 0; hi = n;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (intervals[mid][1] < newInterval[0]) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        int leftBound = lo; // first interval that overlaps or comes after

        // Add non-overlapping left side
        for (int i = 0; i < leftBound; i++) {
            result.add(intervals[i]);
        }

        // Merge overlapping section
        int mergedStart = newInterval[0];
        int mergedEnd   = newInterval[1];
        for (int i = leftBound; i < rightBound; i++) {
            mergedStart = Math.min(mergedStart, intervals[i][0]);
            mergedEnd   = Math.max(mergedEnd,   intervals[i][1]);
        }
        result.add(new int[]{mergedStart, mergedEnd});

        // Add non-overlapping right side
        for (int i = rightBound; i < n; i++) {
            result.add(intervals[i]);
        }

        return result.toArray(new int[result.size()][]);
    }
}

// Made with Bob
