# LeetCode Problem #23: Merge k Sorted Lists
# Difficulty: Hard
# Link: https://leetcode.com/problems/merge-k-sorted-lists/

from typing import List, Optional
import heapq

class ListNode:
    def __init__(self, val: int = 0, next: 'Optional[ListNode]' = None):
        self.val = val
        self.next = next

# ─────────────────────────────────────────────
# APPROACH 1: Min Heap (Priority Queue) | O(N log k) time | O(k) space
# EXPLAIN: Push all list heads into a min-heap; repeatedly extract the minimum and advance that list.
# WHEN: Optimal for large k; heap always holds at most k nodes.

def solve_1(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    # Store (val, id, node) — id breaks ties when vals are equal
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    dummy = ListNode(0)
    cur = dummy
    while heap:
        val, i, node = heapq.heappop(heap)
        cur.next = node
        cur = cur.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next

# ─────────────────────────────────────────────
# APPROACH 2: Divide and Conquer | O(N log k) time | O(log k) space
# EXPLAIN: Repeatedly merge pairs of lists until one remains; depth is O(log k).
# WHEN: Same time complexity as heap but uses O(log k) stack space instead of O(k).

def solve_2(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    def merge_two(a: Optional[ListNode], b: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0)
        cur = dummy
        while a and b:
            if a.val <= b.val:
                cur.next = a
                a = a.next
            else:
                cur.next = b
                b = b.next
            cur = cur.next
        cur.next = a if a else b
        return dummy.next

    if not lists:
        return None
    n = len(lists)
    while n > 1:
        for i in range(n // 2):
            lists[i] = merge_two(lists[i], lists[n - 1 - i])
        n = (n + 1) // 2
    return lists[0]

# ─────────────────────────────────────────────
# APPROACH 3: Collect and Sort | O(N log N) time | O(N) space
# EXPLAIN: Gather all node values into an array, sort it, then rebuild the linked list.
# WHEN: Simple to implement; acceptable when N is small or code clarity is the priority.

def solve_3(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    vals = []
    for head in lists:
        node = head
        while node:
            vals.append(node.val)
            node = node.next
    vals.sort()
    dummy = ListNode(0)
    cur = dummy
    for v in vals:
        cur.next = ListNode(v)
        cur = cur.next
    return dummy.next

# ─────────────────────────────────────────────
# APPROACH 4: Sequential Merge (Brute Force) | O(k * N) time | O(1) space
# EXPLAIN: Iteratively merge each list into an accumulator one by one.
# WHEN: Simplest implementation; only suitable for small k.

def solve_4(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    def merge_two(a: Optional[ListNode], b: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode(0)
        cur = dummy
        while a and b:
            if a.val <= b.val:
                cur.next = a
                a = a.next
            else:
                cur.next = b
                b = b.next
            cur = cur.next
        cur.next = a if a else b
        return dummy.next

    if not lists:
        return None
    result = lists[0]
    for i in range(1, len(lists)):
        result = merge_two(result, lists[i])
    return result

# Made with Bob
