# LeetCode Problem #2: Add Two Numbers
# Difficulty: Medium
# Link: https://leetcode.com/problems/add-two-numbers/

from __future__ import annotations
from typing import Optional

# ─────────────────────────────────────────────
# Shared node definition
class ListNode:
    def __init__(self, val: int = 0, nxt: Optional["ListNode"] = None) -> None:
        self.val  = val
        self.next = nxt


# ─────────────────────────────────────────────
# APPROACH 1: Iterative Dummy Head | O(max(m,n)) time | O(max(m,n)) space
# EXPLAIN: Simulate grade-school addition digit-by-digit, propagating carry; create a new result list.
# WHEN: The natural simulation — always O(max(m,n)) and uses only the output list as extra space.

def add_two_numbers(
    l1: Optional[ListNode], l2: Optional[ListNode]
) -> Optional[ListNode]:
    dummy  = ListNode()
    curr   = dummy
    carry  = 0

    while l1 or l2 or carry:
        val    = carry
        if l1:
            val += l1.val
            l1   = l1.next
        if l2:
            val += l2.val
            l2   = l2.next
        carry, digit = divmod(val, 10)
        curr.next    = ListNode(digit)
        curr         = curr.next

    return dummy.next


# ─────────────────────────────────────────────
# APPROACH 2: Recursive | O(max(m,n)) time | O(max(m,n)) space
# EXPLAIN: Recursively add digit-by-digit, passing the carry as an argument; base case when both lists are empty and carry is 0.
# WHEN: Elegant recursive style; call-stack depth is O(max(m,n)).

def add_two_numbers_recursive(
    l1: Optional[ListNode], l2: Optional[ListNode], carry: int = 0
) -> Optional[ListNode]:
    if l1 is None and l2 is None and carry == 0:
        return None
    val = carry
    if l1:
        val += l1.val
        l1   = l1.next
    if l2:
        val += l2.val
        l2   = l2.next
    carry, digit = divmod(val, 10)
    node      = ListNode(digit)
    node.next = add_two_numbers_recursive(l1, l2, carry)
    return node


# ─────────────────────────────────────────────
# APPROACH 3: In-Place Modification | O(max(m,n)) time | O(1) space
# EXPLAIN: Reuse l1 nodes for the result; extend with new nodes only when l1 is shorter than l2 or carry persists.
# WHEN: When modifying the input is acceptable and space minimisation is critical.

def add_two_numbers_inplace(
    l1: Optional[ListNode], l2: Optional[ListNode]
) -> Optional[ListNode]:
    head  = l1
    prev  = None
    carry = 0

    while l1 or l2 or carry:
        val = carry
        if l1:
            val += l1.val
        if l2:
            val += l2.val
            l2   = l2.next
        carry = val // 10
        if l1:
            l1.val = val % 10
            prev   = l1
            l1     = l1.next
        else:
            # l1 exhausted — extend the list
            new_node = ListNode(val % 10)
            prev.next = new_node   # type: ignore[union-attr]
            prev      = new_node

    return head


# ─────────────────────────────────────────────
# Helpers
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
        # l1 digits (LSB first), l2 digits, expected result digits
        ([2,4,3], [5,6,4], [7,0,8]),          # 342 + 465 = 807
        ([0],     [0],     [0]),
        ([9,9,9,9,9,9,9], [9,9,9,9], [8,9,9,9,0,0,0,1]),
    ]
    for a, b, expected in cases:
        assert to_list(add_two_numbers(build_list(a), build_list(b)))           == expected
        assert to_list(add_two_numbers_recursive(build_list(a), build_list(b))) == expected
        # Note: inplace modifies l1, so pass a fresh copy
        assert to_list(add_two_numbers_inplace(build_list(a), build_list(b)))   == expected
    print("All tests passed.")

# Made with Bob
