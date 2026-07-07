/*
 * LeetCode Problem #253: Meeting Rooms II
 * Link: https://leetcode.com/problems/meeting-rooms-ii/
 * Difficulty: Medium
 */
import java.util.*;

class Solution {

    // APPROACH 1: Min Heap (End Times) | O(n log n) time | O(n) space
    // EXPLAIN: Sort by start; use a min-heap of end times — reuse the earliest-ending room if free.
    public int minMeetingRooms1(int[][] intervals) {
        if (intervals.length == 0) return 0;
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        minHeap.offer(intervals[0][1]);
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] >= minHeap.peek()) minHeap.poll();
            minHeap.offer(intervals[i][1]);
        }
        return minHeap.size();
    }

    // APPROACH 2: Chronological / Two Sorted Arrays | O(n log n) time | O(n) space
    // EXPLAIN: Sort starts and ends separately; advance two pointers — each unmatched start needs a new room.
    public int minMeetingRooms2(int[][] intervals) {
        int n = intervals.length;
        int[] starts = new int[n], ends = new int[n];
        for (int i = 0; i < n; i++) { starts[i] = intervals[i][0]; ends[i] = intervals[i][1]; }
        Arrays.sort(starts); Arrays.sort(ends);
        int rooms = 0, maxRooms = 0, j = 0;
        for (int i = 0; i < n; i++) {
            if (starts[i] < ends[j]) { rooms++; maxRooms = Math.max(maxRooms, rooms); }
            else { rooms--; j++; }
        }
        return maxRooms;
    }

    // APPROACH 3: Sweep Line (Events) | O(n log n) time | O(n) space
    // EXPLAIN: Create +1 events at starts and -1 at ends; sort and scan for the peak concurrent count.
    public int minMeetingRooms3(int[][] intervals) {
        int n = intervals.length;
        int[][] events = new int[2 * n][2];
        for (int i = 0; i < n; i++) {
            events[2 * i]     = new int[]{intervals[i][0],  1};
            events[2 * i + 1] = new int[]{intervals[i][1], -1};
        }
        Arrays.sort(events, (a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
        int rooms = 0, maxRooms = 0;
        for (int[] e : events) { rooms += e[1]; maxRooms = Math.max(maxRooms, rooms); }
        return maxRooms;
    }

    // APPROACH 4: TreeMap (Sweep Line with Counts) | O(n log n) time | O(n) space
    // EXPLAIN: Use a TreeMap to record +1 at each start and -1 at each end; scan in key order for peak.
    public int minMeetingRooms4(int[][] intervals) {
        TreeMap<Integer, Integer> diff = new TreeMap<>();
        for (int[] iv : intervals) {
            diff.merge(iv[0],  1, Integer::sum);
            diff.merge(iv[1], -1, Integer::sum);
        }
        int rooms = 0, maxRooms = 0;
        for (int delta : diff.values()) { rooms += delta; maxRooms = Math.max(maxRooms, rooms); }
        return maxRooms;
    }

    // APPROACH 5: Priority Queue with (end, start) Pairs | O(n log n) time | O(n) space
    // EXPLAIN: Push (endTime, startTime) into a min-heap; pop expired rooms before counting for each meeting.
    public int minMeetingRooms5(int[][] intervals) {
        if (intervals.length == 0) return 0;
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        int maxRooms = 0;
        for (int[] iv : intervals) {
            while (!pq.isEmpty() && pq.peek()[0] <= iv[0]) pq.poll();
            pq.offer(new int[]{iv[1], iv[0]});
            maxRooms = Math.max(maxRooms, pq.size());
        }
        return maxRooms;
    }
}

// Made with Bob
