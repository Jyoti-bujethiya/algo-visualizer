# LeetCode Problem #142: Linked List Cycle II
# Difficulty: Medium
# Link: https://leetcode.com/problems/linked-list-cycle-ii/

from typing import Optional


class ListNode:
    def __init__(self, val: int = 0, next: 'Optional[ListNode]' = None):
        self.val = val
        self.next = next


# ─────────────────────────────────────────────
# APPROACH 1: Floyd's Cycle Detection (Two Pointers) | O(n) time | O(1) space
# EXPLAIN: Fast/slow pointers meet inside cycle; reset slow to head, advance both one step until they meet at cycle start.
# WHEN: Optimal solution; constant space; standard interview answer.

def detectCycle_floyd(head: Optional[ListNode]) -> Optional[ListNode]:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            slow = head
            while slow is not fast:
                slow = slow.next
                fast = fast.next
            return slow
    return None


# ─────────────────────────────────────────────
# APPROACH 2: Hash Set | O(n) time | O(n) space
# EXPLAIN: Store visited nodes; the first node seen twice is the cycle entrance.
# WHEN: Simplest implementation when extra memory is acceptable.

def detectCycle_hashset(head: Optional[ListNode]) -> Optional[ListNode]:
    visited = set()
    node = head
    while node:
        if node in visited:
            return node
        visited.add(node)
        node = node.next
    return None


# ─────────────────────────────────────────────
# APPROACH 3: Modify List (Reverse Pointers) | O(n) time | O(1) space
# EXPLAIN: Reverse list as we traverse; if current.next points backward a cycle is found; restore the list afterward.
# WHEN: When O(1) space is required and list modification is permitted.

def detectCycle_reverse(head: Optional[ListNode]) -> Optional[ListNode]:
    if not head or not head.next:
        return None
    prev = None
    current = head
    while current:
        nxt = current.next
        if nxt and nxt.next is current:
            # Restore and return
            restore = head
            while restore is not current:
                tmp = restore.next
                restore.next = prev
                prev = restore
                restore = tmp
            return nxt
        current.next = prev
        prev = current
        current = nxt
    # No cycle — restore
    current = prev
    prev = None
    while current:
        nxt = current.next
        current.next = prev
        prev = current
        current = nxt
    return None


# ─────────────────────────────────────────────
# APPROACH 4: Mark Values | O(n) time | O(1) space
# EXPLAIN: Add a large marker to each visited node's value; first node already marked is the cycle start.
# WHEN: Educational only — modifies node values, not recommended in practice.

def detectCycle_mark(head: Optional[ListNode]) -> Optional[ListNode]:
    MARKER = 200001  # outside constraint range
    current = head
    while current:
        if current.val == MARKER:
            # restore
            restore = head
            while restore is not current:
                restore.val -= MARKER
                restore = restore.next
            return current
        current.val += MARKER
        current = current.next
    # restore
    current = head
    while current:
        current.val -= MARKER
        current = current.next
    return None


# ─────────────────────────────────────────────
# APPROACH 5: Distance Calculation | O(n) time | O(1) space
# EXPLAIN: Detect cycle with Floyd's, measure cycle length, then use two pointers offset by cycle length to find start.
# WHEN: Good for understanding cycle structure; functionally same as Approach 1.

def detectCycle_distance(head: Optional[ListNode]) -> Optional[ListNode]:
    if not head or not head.next:
        return None
    slow = fast = head
    has_cycle = False
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            has_cycle = True
            break
    if not has_cycle:
        return None
    # Measure cycle length
    cycle_len = 1
    fast = slow.next
    while fast is not slow:
        fast = fast.next
        cycle_len += 1
    # Advance fast by cycle_len, then move both
    slow = fast = head
    for _ in range(cycle_len):
        fast = fast.next
    while slow is not fast:
        slow = slow.next
        fast = fast.next
    return slow


# Made with Bob
