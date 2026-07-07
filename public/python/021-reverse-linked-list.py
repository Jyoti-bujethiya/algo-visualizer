# LeetCode Problem #206: Reverse Linked List
# Difficulty: Easy
# Link: https://leetcode.com/problems/reverse-linked-list/

from __future__ import annotations
from typing import Optional

# ─────────────────────────────────────────────
# Shared node definition
class ListNode:
    def __init__(self, val: int = 0, nxt: Optional["ListNode"] = None) -> None:
        self.val  = val
        self.next = nxt

    def __repr__(self) -> str:
        nodes, cur = [], self
        while cur:
            nodes.append(str(cur.val))
            cur = cur.next
        return " -> ".join(nodes)


# ─────────────────────────────────────────────
# APPROACH 1: Iterative | O(n) time | O(1) space
# EXPLAIN: Walk the list with three pointers (prev, curr, next), reversing each link in turn.
# WHEN: The standard O(1) space solution — preferred in virtually every scenario.

def reverse_list_iterative(head: Optional[ListNode]) -> Optional[ListNode]:
    prev: Optional[ListNode] = None
    curr = head
    while curr:
        nxt        = curr.next
        curr.next  = prev
        prev       = curr
        curr       = nxt
    return prev


# ─────────────────────────────────────────────
# APPROACH 2: Recursive | O(n) time | O(n) space
# EXPLAIN: Recurse to the tail, then rewire each link on the way back up the call stack.
# WHEN: Elegant and concise; call-stack depth is O(n) so avoid on very long lists.

def reverse_list_recursive(head: Optional[ListNode]) -> Optional[ListNode]:
    if head is None or head.next is None:
        return head
    new_head       = reverse_list_recursive(head.next)
    head.next.next = head
    head.next      = None
    return new_head


# ─────────────────────────────────────────────
# APPROACH 3: Tail Recursion | O(n) time | O(n) space
# EXPLAIN: Pass an accumulator (prev) through tail-recursive calls — mirrors the iterative logic in recursive form.
# WHEN: When the interviewer asks for a tail-recursive variant; logically identical to iterative.

def reverse_list_tail_recursive(
    head: Optional[ListNode],
    prev: Optional[ListNode] = None
) -> Optional[ListNode]:
    if head is None:
        return prev
    nxt       = head.next
    head.next = prev
    return reverse_list_tail_recursive(nxt, head)


# ─────────────────────────────────────────────
# Helpers for testing
def build_list(vals: list[int]) -> Optional[ListNode]:
    dummy = ListNode()
    cur   = dummy
    for v in vals:
        cur.next = ListNode(v)
        cur       = cur.next
    return dummy.next

def to_list(head: Optional[ListNode]) -> list[int]:
    result, cur = [], head
    while cur:
        result.append(cur.val)
        cur = cur.next
    return result

if __name__ == "__main__":
    cases = [
        ([1, 2, 3, 4, 5], [5, 4, 3, 2, 1]),
        ([1, 2],           [2, 1]),
        ([],               []),
    ]
    for vals, expected in cases:
        assert to_list(reverse_list_iterative(build_list(vals)))     == expected
        assert to_list(reverse_list_recursive(build_list(vals)))     == expected
        assert to_list(reverse_list_tail_recursive(build_list(vals)))== expected
    print("All tests passed.")

# Made with Bob
