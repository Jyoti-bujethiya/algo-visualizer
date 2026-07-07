/*
 * LeetCode Problem #252: Meeting Rooms
 * Link: https://leetcode.com/problems/meeting-rooms/
 * Difficulty: Easy
 */
import java.util.*;

class Solution {

    // APPROACH 1: Sort by Start Time | O(n log n) time | O(1) space
    // EXPLAIN: Sort intervals; if any start before the previous ends, there is an overlap.
    public boolean canAttendMeetings1(int[][] intervals) {
        if (intervals.length == 0) return true;
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        for (int i = 1; i < intervals.length; i++)
            if (intervals[i][0] < intervals[i - 1][1]) return false;
        return true;
    }

    // APPROACH 2: Sort with Explicit Comparator | O(n log n) time | O(1) space
    // EXPLAIN: Equivalent to Approach 1; uses Arrays.sort with a lambda comparator to be explicit.
    public boolean canAttendMeetings2(int[][] intervals) {
        if (intervals.length == 0) return true;
        Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));
        for (int i = 1; i < intervals.length; i++)
            if (intervals[i][0] < intervals[i - 1][1]) return false;
        return true;
    }

    // APPROACH 3: Brute Force Check All Pairs | O(n²) time | O(1) space
    // EXPLAIN: For every pair, check if they overlap; first overlap found returns false.
    public boolean canAttendMeetings3(int[][] intervals) {
        for (int i = 0; i < intervals.length; i++)
            for (int j = i + 1; j < intervals.length; j++)
                if (!(intervals[i][1] <= intervals[j][0] || intervals[j][1] <= intervals[i][0]))
                    return false;
        return true;
    }

    // APPROACH 4: Separate Start and End Arrays | O(n log n) time | O(n) space
    // EXPLAIN: Sort starts and ends independently; if starts[i] < ends[i-1] there is an overlap.
    public boolean canAttendMeetings4(int[][] intervals) {
        if (intervals.length == 0) return true;
        int n = intervals.length;
        int[] starts = new int[n], ends = new int[n];
        for (int i = 0; i < n; i++) { starts[i] = intervals[i][0]; ends[i] = intervals[i][1]; }
        Arrays.sort(starts); Arrays.sort(ends);
        for (int i = 1; i < n; i++)
            if (starts[i] < ends[i - 1]) return false;
        return true;
    }

    // APPROACH 5: Sort and Track Max End | O(n log n) time | O(1) space
    // EXPLAIN: Sort intervals; track the maximum end time and check each new start against it.
    public boolean canAttendMeetings5(int[][] intervals) {
        if (intervals.length == 0) return true;
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        int maxEnd = intervals[0][1];
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] < maxEnd) return false;
            maxEnd = Math.max(maxEnd, intervals[i][1]);
        }
        return true;
    }
}

// Made with Bob
