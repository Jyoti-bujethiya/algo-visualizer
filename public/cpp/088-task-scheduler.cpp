/*
 * Problem: Task Scheduler (LeetCode 621)
 * Link: https://leetcode.com/problems/task-scheduler/
 * Difficulty: Medium
 * Category: Heaps and Priority Queues
 *
 * Description:
 * Given a characters array tasks, representing tasks a CPU needs to do, where
 * each letter represents a different task. Tasks could be done in any order.
 * Each task is done in one unit of time. For each unit of time the CPU could
 * complete either one task or just be idle.
 * However, there is a non-negative integer n that represents the cooldown
 * interval between two same tasks — there must be at least n units of time
 * between any two same tasks.
 * Return the minimum number of intervals the CPU will take to finish all tasks.
 *
 * Example 1: tasks=["A","A","A","B","B","B"], n=2  → 8
 *   A->B->idle->A->B->idle->A->B
 * Example 2: tasks=["A","A","A","B","B","B"], n=0  → 6
 * Example 3: tasks=["A","A","A","A","A","A","B","C","D","E","F","G"], n=2 → 16
 *
 * Constraints:
 * - 1 <= tasks.length <= 10^4
 * - tasks[i] is upper-case English letter
 * - 0 <= n <= 100
 */

#include <vector>
#include <queue>
#include <unordered_map>
#include <algorithm>
#include <iostream>
using namespace std;

/*
 * APPROACH 1: MATH FORMULA (OPTIMAL, O(1) RESULT)
 *
 * maxFreq = highest task frequency
 * maxCount = number of tasks with that frequency
 * result = max(tasks.size(), (maxFreq-1)*(n+1) + maxCount)
 *
 * Intuition: the most frequent task creates "frames" of size n+1.
 * Last frame just needs maxCount slots. Fill rest with other tasks or idle.
 *
 * Time:  O(|tasks|)
 * Space: O(1)  (26-char frequency array)
 */
class Solution1 {
public:
    int leastInterval(vector<char>& tasks, int n) {
        int freq[26] = {};
        for (char c : tasks) freq[c - 'A']++;
        int maxFreq = *max_element(freq, freq + 26);
        int maxCount = count(freq, freq + 26, maxFreq);
        return max((int)tasks.size(), (maxFreq - 1) * (n + 1) + maxCount);
    }
};

/*
 * APPROACH 2: MAX HEAP + COOLDOWN QUEUE SIMULATION
 *
 * Use a max-heap of (freq, task). Each cycle of n+1 slots:
 * - Pop up to n+1 tasks from heap, decrement freq
 * - Push back tasks with remaining freq > 0
 * - Add idle time if fewer than n+1 tasks were available
 *
 * Time:  O(|tasks| * n)
 * Space: O(1)  (26 unique tasks at most)
 */
class Solution2 {
public:
    int leastInterval(vector<char>& tasks, int n) {
        int freq[26] = {};
        for (char c : tasks) freq[c - 'A']++;
        priority_queue<int> pq;
        for (int f : freq) if (f) pq.push(f);

        int time = 0;
        while (!pq.empty()) {
            vector<int> tmp;
            int cycle = n + 1;
            while (cycle-- && !pq.empty()) {
                int f = pq.top(); pq.pop();
                if (f > 1) tmp.push_back(f - 1);
                time++;
            }
            for (int f : tmp) pq.push(f);
            if (!pq.empty()) time += cycle + 1; // idle slots
        }
        return time;
    }
};

/*
 * APPROACH 3: GREEDY SIMULATION WITH QUEUE
 *
 * Simulate time step-by-step with a max-heap and a cooldown queue of
 * (freq, available_at) pairs. Closest to real scheduler behaviour.
 *
 * Time:  O(|tasks| log 26) = O(|tasks|)
 * Space: O(1)
 */
class Solution3 {
public:
    int leastInterval(vector<char>& tasks, int n) {
        int freq[26] = {};
        for (char c : tasks) freq[c - 'A']++;
        priority_queue<int> pq;
        for (int f : freq) if (f) pq.push(f);

        // cooldown queue: (remaining_count, next_available_time)
        queue<pair<int,int>> cooldown;
        int time = 0;

        while (!pq.empty() || !cooldown.empty()) {
            time++;
            // release tasks whose cooldown has expired
            if (!cooldown.empty() && cooldown.front().second <= time) {
                pq.push(cooldown.front().first);
                cooldown.pop();
            }
            if (!pq.empty()) {
                int f = pq.top(); pq.pop();
                if (f - 1 > 0) cooldown.push({f - 1, time + n + 1});
            }
        }
        return time;
    }
};

/*
 * APPROACH 4: COUNTING IDLE SLOTS
 *
 * Explicitly count idle slots needed:
 * idle = (maxFreq-1)*n - sum of min(maxFreq-1, freq) for other tasks
 * result = tasks.size() + max(0, idle)
 *
 * Time:  O(|tasks|)
 * Space: O(1)
 */
class Solution4 {
public:
    int leastInterval(vector<char>& tasks, int n) {
        int freq[26] = {};
        for (char c : tasks) freq[c - 'A']++;
        sort(freq, freq + 26);
        int maxFreq = freq[25];
        int idle = (maxFreq - 1) * n;
        for (int i = 24; i >= 0 && idle > 0; i--)
            idle -= min(maxFreq - 1, freq[i]);
        idle = max(0, idle);
        return (int)tasks.size() + idle;
    }
};

int main() {
    auto run = [](vector<char> tasks, int n) {
        cout << "tasks.size=" << tasks.size() << " n=" << n << "\n";
        { Solution1 s; cout << "Formula:    " << s.leastInterval(tasks,n) << "\n"; }
        { Solution2 s; cout << "HeapCycle:  " << s.leastInterval(tasks,n) << "\n"; }
        { Solution3 s; cout << "GreedySim:  " << s.leastInterval(tasks,n) << "\n"; }
        { Solution4 s; cout << "IdleCount:  " << s.leastInterval(tasks,n) << "\n"; }
        cout << "\n";
    };
    run({'A','A','A','B','B','B'}, 2);   // → 8
    run({'A','A','A','B','B','B'}, 0);   // → 6
    run({'A','A','A','A','A','A','B','C','D','E','F','G'}, 2); // → 16
    return 0;
}

/*
 * COMPLEXITY SUMMARY:
 * Approach 1 (Formula):      Time O(N)   Space O(1)  ← optimal
 * Approach 2 (HeapCycle):    Time O(N*n) Space O(1)
 * Approach 3 (GreedySim):    Time O(N)   Space O(1)
 * Approach 4 (IdleCount):    Time O(N)   Space O(1)
 */

// Made with Bob
