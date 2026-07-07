# LeetCode Problem #146: LRU Cache
# Difficulty: Medium
# Link: https://leetcode.com/problems/lru-cache/

from collections import OrderedDict


# ─────────────────────────────────────────────
# APPROACH 1: OrderedDict | O(1) time | O(n) space
# EXPLAIN: Python's OrderedDict tracks insertion order; move_to_end() marks recent use,
#          and popitem(last=False) evicts the least-recently-used entry.
# WHEN: Clean Pythonic solution leveraging the standard library.

class LRUCache_OrderedDict:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache: OrderedDict = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)


# ─────────────────────────────────────────────
# APPROACH 2: Doubly Linked List + Hash Map | O(1) time | O(n) space
# EXPLAIN: Hash map gives O(1) lookup; a doubly linked list maintains access order
#          with sentinel head/tail so insert/delete are always O(1).
# WHEN: Language-agnostic optimal solution; required when you cannot use OrderedDict.

class _DLLNode:
    __slots__ = ('key', 'val', 'prev', 'next')
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = self.next = None

class LRUCache_DLL:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache: dict = {}
        self.head = _DLLNode()   # least-recent sentinel
        self.tail = _DLLNode()   # most-recent sentinel
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node: _DLLNode) -> None:
        node.prev.next = node.next
        node.next.prev = node.prev

    def _insert_tail(self, node: _DLLNode) -> None:
        node.prev = self.tail.prev
        node.next = self.tail
        self.tail.prev.next = node
        self.tail.prev = node

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._remove(node)
        self._insert_tail(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = _DLLNode(key, value)
        self.cache[key] = node
        self._insert_tail(node)
        if len(self.cache) > self.cap:
            lru = self.head.next
            self._remove(lru)
            del self.cache[lru.key]


# ─────────────────────────────────────────────
# APPROACH 3: Timestamp-based (not O(1)) | O(n) time eviction | O(n) space
# EXPLAIN: Track last-access timestamp per key; on eviction find the minimum-timestamp key by scanning.
# WHEN: Shown for comparison — does NOT meet the O(1) requirement; educational only.

class LRUCache_Timestamp:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.values: dict = {}
        self.times: dict = {}
        self.ts = 0

    def get(self, key: int) -> int:
        if key not in self.values:
            return -1
        self.times[key] = self.ts
        self.ts += 1
        return self.values[key]

    def put(self, key: int, value: int) -> None:
        if key in self.values:
            self.values[key] = value
            self.times[key] = self.ts
            self.ts += 1
        else:
            if len(self.values) == self.cap:
                lru_key = min(self.times, key=lambda k: self.times[k])
                del self.values[lru_key]
                del self.times[lru_key]
            self.values[key] = value
            self.times[key] = self.ts
            self.ts += 1


# Made with Bob
