/*
 * LeetCode Problem #621: Task Scheduler
 * Link: https://leetcode.com/problems/task-scheduler/
 * Difficulty: Medium
 */
import java.util.*;

class Solution {

    // APPROACH 1: Math Formula | O(n) time | O(1) space
    // EXPLAIN: answer = max(tasks.length, (maxFreq-1)*(n+1)+maxCount).
    public int leastInterval1(char[] tasks, int n) {
        int[] freq = new int[26];
        for (char c : tasks) freq[c - 'A']++;
        int maxFreq = 0;
        for (int f : freq) maxFreq = Math.max(maxFreq, f);
        int maxCount = 0;
        for (int f : freq) if (f == maxFreq) maxCount++;
        return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount);
    }

    // APPROACH 2: Max Heap Cycle Simulation | O(|tasks| * n) time | O(1) space
    // EXPLAIN: Simulate rounds of n+1 slots; pop up to n+1 tasks per round, add idle slots if needed.
    public int leastInterval2(char[] tasks, int n) {
        int[] freq = new int[26];
        for (char c : tasks) freq[c - 'A']++;
        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
        for (int f : freq) if (f > 0) pq.offer(f);
        int time = 0;
        while (!pq.isEmpty()) {
            List<Integer> tmp = new ArrayList<>();
            int cycle = n + 1;
            while (cycle-- > 0 && !pq.isEmpty()) {
                int f = pq.poll();
                if (f > 1) tmp.add(f - 1);
                time++;
            }
            for (int f : tmp) pq.offer(f);
            if (!pq.isEmpty()) time += cycle + 1;
        }
        return time;
    }

    // APPROACH 3: Greedy Simulation with Cooldown Queue | O(n) time | O(1) space
    // EXPLAIN: Step-by-step simulation: use a max-heap plus a cooldown queue of (count, available_at).
    public int leastInterval3(char[] tasks, int n) {
        int[] freq = new int[26];
        for (char c : tasks) freq[c - 'A']++;
        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
        for (int f : freq) if (f > 0) pq.offer(f);
        Queue<int[]> cooldown = new LinkedList<>(); // [remaining, nextAvailableTime]
        int time = 0;
        while (!pq.isEmpty() || !cooldown.isEmpty()) {
            time++;
            if (!cooldown.isEmpty() && cooldown.peek()[1] <= time)
                pq.offer(cooldown.poll()[0]);
            if (!pq.isEmpty()) {
                int f = pq.poll();
                if (f - 1 > 0) cooldown.offer(new int[]{f - 1, time + n + 1});
            }
        }
        return time;
    }

    // APPROACH 4: Counting Idle Slots | O(n) time | O(1) space
    // EXPLAIN: idle = (maxFreq-1)*n - sum of min(maxFreq-1, otherFreqs); result = tasks.length + max(0, idle).
    public int leastInterval4(char[] tasks, int n) {
        int[] freq = new int[26];
        for (char c : tasks) freq[c - 'A']++;
        Arrays.sort(freq);
        int maxFreq = freq[25];
        int idle = (maxFreq - 1) * n;
        for (int i = 24; i >= 0 && idle > 0; i--)
            idle -= Math.min(maxFreq - 1, freq[i]);
        idle = Math.max(0, idle);
        return tasks.length + idle;
    }
}

// Made with Bob
