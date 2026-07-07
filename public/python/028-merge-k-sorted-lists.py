# LeetCode Problem #23: Merge K Sorted Lists
# Difficulty: Hard
# Link: https://leetcode.com/problems/merge-k-sorted-lists/

from typing import Optional, List
import heapq


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


# ─────────────────────────────────────────────
# APPROACH 1: Min Heap (Priority Queue) | O(N log k) time | O(k) space
# EXPLAIN: Push the head of each list into a min-heap; repeatedly extract the minimum and push its successor.
# WHEN: Optimal for k lists; heap size stays at most k throughout.

def mergeKLists_heap(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    dummy = ListNode(0)
    curr = dummy
    while heap:
        val, i, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next


# ─────────────────────────────────────────────
# APPROACH 2: Divide and Conquer | O(N log k) time | O(log k) space
# EXPLAIN: Recursively merge pairs of lists halving the problem at each level, similar to merge sort.
# WHEN: Same asymptotic performance as heap; uses recursion stack instead of heap memory.

def mergeKLists_divide(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    def merge_two(l1, l2):
        dummy = ListNode(0)
        curr = dummy
        while l1 and l2:
            if l1.val <= l2.val:
                curr.next = l1; l1 = l1.next
            else:
                curr.next = l2; l2 = l2.next
            curr = curr.next
        curr.next = l1 or l2
        return dummy.next

    def helper(lo, hi):
        if lo > hi: return None
        if lo == hi: return lists[lo]
        mid = (lo + hi) // 2
        return merge_two(helper(lo, mid), helper(mid + 1, hi))

    if not lists: return None
    return helper(0, len(lists) - 1)


# ─────────────────────────────────────────────
# APPROACH 3: Iterative Pairwise Merge | O(N log k) time | O(1) space
# EXPLAIN: Repeatedly merge lists in pairs, reducing the count by half each round until one list remains.
# WHEN: Same time complexity as heap/D&C but avoids recursion entirely.

def mergeKLists_pairwise(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    def merge_two(l1, l2):
        dummy = ListNode(0)
        curr = dummy
        while l1 and l2:
            if l1.val <= l2.val:
                curr.next = l1; l1 = l1.next
            else:
                curr.next = l2; l2 = l2.next
            curr = curr.next
        curr.next = l1 or l2
        return dummy.next

    if not lists: return None
    while len(lists) > 1:
        merged = []
        for i in range(0, len(lists), 2):
            l2 = lists[i + 1] if i + 1 < len(lists) else None
            merged.append(merge_two(lists[i], l2))
        lists = merged
    return lists[0]


# ─────────────────────────────────────────────
# APPROACH 4: Sequential Merge | O(N*k) time | O(1) space
# EXPLAIN: Merge lists one by one into an accumulator; simple but slower for large k.
# WHEN: Easiest to code; fine when k is small.

def mergeKLists_sequential(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    def merge_two(l1, l2):
        dummy = ListNode(0)
        curr = dummy
        while l1 and l2:
            if l1.val <= l2.val:
                curr.next = l1; l1 = l1.next
            else:
                curr.next = l2; l2 = l2.next
            curr = curr.next
        curr.next = l1 or l2
        return dummy.next

    if not lists: return None
    result = lists[0]
    for i in range(1, len(lists)):
        result = merge_two(result, lists[i])
    return result


# ─────────────────────────────────────────────
# APPROACH 5: Collect All Values + Sort | O(N log N) time | O(N) space
# EXPLAIN: Drain all node values into a list, sort it, then rebuild a fresh linked list.
# WHEN: Simplest to understand; acceptable when reconstructing nodes is allowed.

def mergeKLists_sort(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    values = []
    for node in lists:
        while node:
            values.append(node.val)
            node = node.next
    values.sort()
    dummy = ListNode(0)
    curr = dummy
    for v in values:
        curr.next = ListNode(v)
        curr = curr.next
    return dummy.next


# Made with Bob
