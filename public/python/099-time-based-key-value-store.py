# LeetCode Problem #981: Time Based Key-Value Store
# Difficulty: Medium
# Link: https://leetcode.com/problems/time-based-key-value-store/

from typing import List
import bisect
from collections import defaultdict

# ─────────────────────────────────────────────
# APPROACH 1: Hash Map + Binary Search | O(1) set | O(log n) get | O(n) space
# EXPLAIN: Store (timestamp, value) pairs per key in insertion order; binary search for the largest timestamp ≤ query.
# WHEN: Optimal — set is O(1) amortised, get is O(log n); standard solution.

class TimeMap1:
    def __init__(self):
        self.store: dict = defaultdict(list)  # key -> [(timestamp, value)]

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.store[key].append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        if key not in self.store:
            return ""
        entries = self.store[key]
        lo, hi = 0, len(entries) - 1
        result = ""
        while lo <= hi:
            mid = lo + (hi - lo) // 2
            if entries[mid][0] <= timestamp:
                result = entries[mid][1]
                lo = mid + 1
            else:
                hi = mid - 1
        return result

# ─────────────────────────────────────────────
# APPROACH 2: Hash Map + Sorted Map (dict keys sorted) | O(log n) set | O(log n) get | O(n) space
# EXPLAIN: Use a plain dict per key and maintain a sorted list of timestamps for bisect lookup.
# WHEN: When you want explicit timestamp-key sorted access without a tree map library.

class TimeMap2:
    def __init__(self):
        self.store: dict = defaultdict(dict)    # key -> {timestamp: value}
        self.ts_list: dict = defaultdict(list)  # key -> sorted [timestamps]

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.store[key][timestamp] = value
        bisect.insort(self.ts_list[key], timestamp)

    def get(self, key: str, timestamp: int) -> str:
        if key not in self.store:
            return ""
        ts = self.ts_list[key]
        idx = bisect.bisect_right(ts, timestamp) - 1
        if idx < 0:
            return ""
        return self.store[key][ts[idx]]

# ─────────────────────────────────────────────
# APPROACH 3: Hash Map + Linear Search | O(1) set | O(n) get | O(n) space
# EXPLAIN: Append to a list per key; scan from the end to find the latest valid timestamp.
# WHEN: Simplest implementation; only feasible when get calls are rare or n is very small.

class TimeMap3:
    def __init__(self):
        self.store: dict = defaultdict(list)

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.store[key].append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        result = ""
        for ts, val in self.store.get(key, []):
            if ts <= timestamp:
                result = val
            else:
                break
        return result

# ─────────────────────────────────────────────
# APPROACH 4: Hash Map + bisect upper_bound | O(1) set | O(log n) get | O(n) space
# EXPLAIN: Use bisect.bisect_right on a parallel timestamp list to locate the insertion point, then step back one.
# WHEN: Equivalent to Approach 1 but uses bisect library directly for cleaner code.

class TimeMap4:
    def __init__(self):
        self.vals: dict = defaultdict(list)  # key -> [value]
        self.times: dict = defaultdict(list) # key -> [timestamp]

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.times[key].append(timestamp)
        self.vals[key].append(value)

    def get(self, key: str, timestamp: int) -> str:
        if key not in self.times:
            return ""
        idx = bisect.bisect_right(self.times[key], timestamp) - 1
        if idx < 0:
            return ""
        return self.vals[key][idx]

# ─────────────────────────────────────────────
# APPROACH 5: Nested Hash Maps with Timestamp Scan | O(1) set | O(n) get | O(n) space
# EXPLAIN: Store key -> {timestamp -> value} and separately track all timestamps; scan for best match.
# WHEN: When direct timestamp lookup by key is needed and get performance is not critical.

class TimeMap5:
    def __init__(self):
        self.store: dict = defaultdict(dict)
        self.timestamps: dict = defaultdict(list)

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.store[key][timestamp] = value
        self.timestamps[key].append(timestamp)

    def get(self, key: str, timestamp: int) -> str:
        if key not in self.store:
            return ""
        best_time = -1
        for t in self.timestamps[key]:
            if t <= timestamp and t > best_time:
                best_time = t
        return "" if best_time == -1 else self.store[key][best_time]

# Made with Bob
