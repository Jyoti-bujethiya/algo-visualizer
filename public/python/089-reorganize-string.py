# LeetCode Problem #767: Reorganize String
# Difficulty: Medium
# Link: https://leetcode.com/problems/reorganize-string/

import heapq

# ─────────────────────────────────────────────
# APPROACH 1: Max Heap Greedy (Pair Pop) | O(n log 26) time | O(1) space
# EXPLAIN: Each step pop the two most frequent characters, append both, and re-push with decremented counts.
# WHEN: Clean greedy approach; handles the impossible case naturally when one char remains with freq > 1.

def solve_1(s: str) -> str:
    freq = [0] * 26
    for c in s:
        freq[ord(c) - ord('a')] += 1
    max_heap = [(-freq[i], chr(ord('a') + i)) for i in range(26) if freq[i] > 0]
    heapq.heapify(max_heap)
    res = []
    while len(max_heap) >= 2:
        f1, c1 = heapq.heappop(max_heap)
        f2, c2 = heapq.heappop(max_heap)
        res.append(c1)
        res.append(c2)
        if f1 + 1 < 0:
            heapq.heappush(max_heap, (f1 + 1, c1))
        if f2 + 1 < 0:
            heapq.heappush(max_heap, (f2 + 1, c2))
    if max_heap:
        f, c = max_heap[0]
        if -f > 1:
            return ""
        res.append(c)
    return "".join(res)

# ─────────────────────────────────────────────
# APPROACH 2: Interleave Even/Odd Indices | O(n log n) time | O(n) space
# EXPLAIN: Sort chars by frequency descending, fill even indices first then odd.
# WHEN: When you want a simple index-based placement without a heap.

def solve_2(s: str) -> str:
    freq = [0] * 26
    for c in s:
        freq[ord(c) - ord('a')] += 1
    max_freq = max(freq)
    if max_freq > (len(s) + 1) // 2:
        return ""
    pairs = sorted(
        [(freq[i], chr(ord('a') + i)) for i in range(26) if freq[i] > 0],
        reverse=True
    )
    res = [''] * len(s)
    idx = 0
    for f, c in pairs:
        for _ in range(f):
            if idx >= len(s):
                idx = 1
            res[idx] = c
            idx += 2
    return "".join(res)

# ─────────────────────────────────────────────
# APPROACH 3: Greedy with Previous Tracking | O(n log 26) time | O(1) space
# EXPLAIN: Pop the max-frequency char; if it equals the last placed char, use the second-highest instead.
# WHEN: Mirrors real-scheduler logic; more intuitive for step-by-step tracing.

def solve_3(s: str) -> str:
    freq = [0] * 26
    for c in s:
        freq[ord(c) - ord('a')] += 1
    max_freq = max(freq)
    if max_freq > (len(s) + 1) // 2:
        return ""
    max_heap = [(-freq[i], chr(ord('a') + i)) for i in range(26) if freq[i] > 0]
    heapq.heapify(max_heap)
    res = []
    prev_f, prev_c = 0, ''
    while max_heap:
        f, c = heapq.heappop(max_heap)
        if c == prev_c and max_heap:
            f2, c2 = heapq.heappop(max_heap)
            res.append(c2)
            if f2 + 1 < 0:
                heapq.heappush(max_heap, (f2 + 1, c2))
            heapq.heappush(max_heap, (f, c))
            prev_f, prev_c = f2 + 1, c2
        else:
            res.append(c)
            if f + 1 < 0:
                heapq.heappush(max_heap, (f + 1, c))
            prev_f, prev_c = f + 1, c
    return "".join(res) if len(res) == len(s) else ""

# ─────────────────────────────────────────────
# APPROACH 4: Counting + Direct Placement | O(n) time | O(n) space
# EXPLAIN: Place the most frequent character at all even positions first, then fill remaining positions.
# WHEN: Fastest O(n) approach; no sorting needed, just a single linear scan.

def solve_4(s: str) -> str:
    freq = [0] * 26
    for c in s:
        freq[ord(c) - ord('a')] += 1
    max_char = freq.index(max(freq))
    if freq[max_char] > (len(s) + 1) // 2:
        return ""
    res = [''] * len(s)
    idx = 0
    # Place most frequent at even slots
    while freq[max_char] > 0:
        res[idx] = chr(ord('a') + max_char)
        idx += 2
        freq[max_char] -= 1
    # Fill remaining chars
    for i in range(26):
        while freq[i] > 0:
            if idx >= len(s):
                idx = 1
            res[idx] = chr(ord('a') + i)
            idx += 2
            freq[i] -= 1
    return "".join(res)

# Made with Bob
