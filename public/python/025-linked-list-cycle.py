# LeetCode Problem #141: Linked List Cycle
# Difficulty: Easy
# Link: https://leetcode.com/problems/linked-list-cycle/

from __future__ import annotations
from typing import Optional

# ─────────────────────────────────────────────
# Shared node definition
class ListNode:
    def __init__(self, val: int = 0, nxt: Optional["ListNode"] = None) -> None:
        self.val  = val
        self.next = nxt


# ─────────────────────────────────────────────
# APPROACH 1: Floyd's Cycle Detection (Two Pointers) | O(n) time | O(1) space
# EXPLAIN: Move a slow pointer one step and a fast pointer two steps; if they ever meet, a cycle exists.
# WHEN: The classic O(1) space solution — always preferred when memory efficiency matters.

def has_cycle_floyd(head: Optional[ListNode]) -> bool:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next                # type: ignore[assignment]
        fast = fast.next.next           # type: ignore[assignment]
        if slow is fast:
            return True
    return False


# ─────────────────────────────────────────────
# APPROACH 2: Hash Set | O(n) time | O(n) space
# EXPLAIN: Store visited node ids in a set; if we encounter a node we have seen before, a cycle exists.
# WHEN: Simple and obvious; useful when you also need to find the cycle entry node cheaply.

def has_cycle_hash(head: Optional[ListNode]) -> bool:
    visited: set[int] = set()
    cur = head
    while cur:
        if id(cur) in visited:
            return True
        visited.add(id(cur))
        cur = cur.next
    return False


# ─────────────────────────────────────────────
# APPROACH 3: Node Modification (Destructive) | O(n) time | O(1) space
# EXPLAIN: Mark each visited node by redirecting its next pointer to a sentinel; if we encounter the sentinel, a cycle exists.
# WHEN: Academic / demonstration only — modifies (destroys) the input list; never use in production.

def has_cycle_modify(head: Optional[ListNode]) -> bool:
    sentinel = ListNode(-999999)
    cur = head
    while cur:
        if cur.next is sentinel:
            return True
        nxt      = cur.next
        cur.next = sentinel
        cur      = nxt
    return False


# ─────────────────────────────────────────────
# APPROACH 4: Floyd's Variant (Different Starting Points) | O(n) time | O(1) space
# EXPLAIN: Start fast one step ahead of slow; loop terminates when slow == fast (cycle) or fast reaches None (no cycle).
# WHEN: Alternative Floyd's formulation with a slightly cleaner loop condition.

def has_cycle_variant(head: Optional[ListNode]) -> bool:
    if head is None:
        return False
    slow = head
    fast = head.next     # fast starts one step ahead
    while slow is not fast:
        if fast is None or fast.next is None:
            return False
        slow = slow.next            # type: ignore[assignment]
        fast = fast.next.next       # type: ignore[assignment]
    return True


# ─────────────────────────────────────────────
# APPROACH 5: Standard Floyd's (Most Common Interview Form) | O(n) time | O(1) space
# EXPLAIN: Identical to approach 1 but written as the canonical, most-cited interview version — slow and fast both start at head.
# WHEN: The form most interviewers expect; functionally identical to approach 1.

def has_cycle(head: Optional[ListNode]) -> bool:
    if not head or not head.next:
        return False
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next            # type: ignore[assignment]
        fast = fast.next.next       # type: ignore[assignment]
        if slow is fast:
            return True
    return False


# ─────────────────────────────────────────────
# Helpers
def build_cycle_list(vals: list[int], pos: int) -> Optional[ListNode]:
    """Build a list; if pos >= 0, connect tail to the node at index pos."""
    if not vals:
        return None
    nodes = [ListNode(v) for v in vals]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    if pos >= 0:
        nodes[-1].next = nodes[pos]     # create cycle
    return nodes[0]

if __name__ == "__main__":
    cases = [
        ([3,2,0,-4], 1,  True),
        ([1,2],       0,  True),
        ([1],        -1,  False),
        ([],         -1,  False),
    ]
    for vals, pos, expected in cases:
        head = build_cycle_list(vals, pos)
        assert has_cycle_floyd(head)   == expected
        assert has_cycle_hash(
            build_cycle_list(vals, pos)) == expected
        # Note: has_cycle_modify destroys the list, so always use a fresh one
        assert has_cycle_modify(
            build_cycle_list(vals, pos)) == expected
        assert has_cycle_variant(
            build_cycle_list(vals, pos)) == expected
        assert has_cycle(
            build_cycle_list(vals, pos)) == expected
    print("All tests passed.")

# Made with Bob
