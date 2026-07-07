# LeetCode Problem #621: Task Scheduler
# Difficulty: Medium
# Link: https://leetcode.com/problems/task-scheduler/

from typing import List
import heapq
from collections import deque

# ─────────────────────────────────────────────
# APPROACH 1: Math Formula | O(n) time | O(1) space
# EXPLAIN: The most frequent task creates ceil-frames of size n+1; answer is max(len(tasks), (maxFreq-1)*(n+1)+maxCount).
# WHEN: Optimal — O(n) one-pass formula, no simulation needed.

def solve_1(tasks: List[str], n: int) -> int:
    freq = [0] * 26
    for t in tasks:
        freq[ord(t) - ord('A')] += 1
    max_freq = max(freq)
    max_count = freq.count(max_freq)
    return max(len(tasks), (max_freq - 1) * (n + 1) + max_count)

# ─────────────────────────────────────────────
# APPROACH 2: Max Heap Cycle Simulation | O(|tasks| * n) time | O(1) space
# EXPLAIN: Simulate rounds of n+1 slots: pop up to n+1 tasks from a max-heap each round, add idle if needed.
# WHEN: When you want to see an explicit simulation; slightly worse than formula for large n.

def solve_2(tasks: List[str], n: int) -> int:
    freq = [0] * 26
    for t in tasks:
        freq[ord(t) - ord('A')] += 1
    max_heap = [-f for f in freq if f > 0]
    heapq.heapify(max_heap)
    time = 0
    while max_heap:
        tmp = []
        cycle = n + 1
        while cycle > 0 and max_heap:
            f = -heapq.heappop(max_heap)
            if f > 1:
                tmp.append(-(f - 1))
            time += 1
            cycle -= 1
        for f in tmp:
            heapq.heappush(max_heap, f)
        if max_heap:
            time += cycle  # idle slots
    return time

# ─────────────────────────────────────────────
# APPROACH 3: Greedy Simulation with Cooldown Queue | O(n) time | O(1) space
# EXPLAIN: Simulate step-by-step: maintain a cooldown queue of (remaining_count, available_at) and a max-heap.
# WHEN: Most faithful to real scheduler behaviour; good for understanding the problem mechanically.

def solve_3(tasks: List[str], n: int) -> int:
    freq = [0] * 26
    for t in tasks:
        freq[ord(t) - ord('A')] += 1
    max_heap = [-f for f in freq if f > 0]
    heapq.heapify(max_heap)
    cooldown: deque = deque()  # (remaining_count, next_available_time)
    time = 0
    while max_heap or cooldown:
        time += 1
        if cooldown and cooldown[0][1] <= time:
            heapq.heappush(max_heap, -cooldown.popleft()[0])
        if max_heap:
            f = -heapq.heappop(max_heap)
            if f - 1 > 0:
                cooldown.append((f - 1, time + n + 1))
    return time

# ─────────────────────────────────────────────
# APPROACH 4: Counting Idle Slots | O(n) time | O(1) space
# EXPLAIN: Calculate idle slots as (maxFreq-1)*n minus slots filled by other tasks, then add to task count.
# WHEN: Alternative O(n) formula; useful to understand the idle-slot perspective.

def solve_4(tasks: List[str], n: int) -> int:
    freq = [0] * 26
    for t in tasks:
        freq[ord(t) - ord('A')] += 1
    freq.sort()
    max_freq = freq[25]
    idle = (max_freq - 1) * n
    for i in range(24, -1, -1):
        if idle <= 0:
            break
        idle -= min(max_freq - 1, freq[i])
    idle = max(0, idle)
    return len(tasks) + idle

# Made with Bob
