# LeetCode Problem #21: Merge Two Sorted Lists
# Difficulty: Easy
# Link: https://leetcode.com/problems/merge-two-sorted-lists/

from __future__ import annotations
from typing import Optional

# ─────────────────────────────────────────────
# Shared node definition
class ListNode:
    def __init__(self, val: int = 0, nxt: Optional["ListNode"] = None) -> None:
        self.val  = val
        self.next = nxt


# ─────────────────────────────────────────────
# APPROACH 1: Iterative (Dummy Head) | O(n + m) time | O(1) space
# EXPLAIN: Use a dummy sentinel node; repeatedly attach the smaller head to the merged list and advance.
# WHEN: The standard O(1) space solution — clean, efficient, and avoids recursion overhead.

def merge_two_lists_iterative(
    list1: Optional[ListNode], list2: Optional[ListNode]
) -> Optional[ListNode]:
    dummy = ListNode()
    tail  = dummy
    while list1 and list2:
        if list1.val <= list2.val:
            tail.next = list1
            list1     = list1.next
        else:
            tail.next = list2
            list2     = list2.next
        tail = tail.next
    tail.next = list1 if list1 else list2
    return dummy.next


# ─────────────────────────────────────────────
# APPROACH 2: Recursive | O(n + m) time | O(n + m) space
# EXPLAIN: Recurse by selecting the smaller head and attaching the result of merging the rest.
# WHEN: Elegant and concise for teaching recursion; call stack is O(n+m) so watch for very long lists.

def merge_two_lists_recursive(
    list1: Optional[ListNode], list2: Optional[ListNode]
) -> Optional[ListNode]:
    if list1 is None:
        return list2
    if list2 is None:
        return list1
    if list1.val <= list2.val:
        list1.next = merge_two_lists_recursive(list1.next, list2)
        return list1
    else:
        list2.next = merge_two_lists_recursive(list1, list2.next)
        return list2


# ─────────────────────────────────────────────
# APPROACH 3: In-Place without Dummy Node | O(n + m) time | O(1) space
# EXPLAIN: Determine the head manually (no dummy node), then wire the rest iteratively.
# WHEN: When you want to avoid allocating a dummy node; slightly more complex head handling.

def merge_two_lists_no_dummy(
    list1: Optional[ListNode], list2: Optional[ListNode]
) -> Optional[ListNode]:
    if list1 is None:
        return list2
    if list2 is None:
        return list1

    # Determine the head
    if list1.val <= list2.val:
        head  = list1
        list1 = list1.next
    else:
        head  = list2
        list2 = list2.next

    current = head
    while list1 and list2:
        if list1.val <= list2.val:
            current.next = list1
            list1         = list1.next
        else:
            current.next = list2
            list2         = list2.next
        current = current.next

    current.next = list1 if list1 else list2
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
        ([1,2,4], [1,3,4], [1,1,2,3,4,4]),
        ([],       [],       []),
        ([],       [0],      [0]),
    ]
    for a, b, expected in cases:
        assert to_list(merge_two_lists_iterative(build_list(a), build_list(b))) == expected
        assert to_list(merge_two_lists_recursive(build_list(a), build_list(b))) == expected
        assert to_list(merge_two_lists_no_dummy(build_list(a),  build_list(b))) == expected
    print("All tests passed.")

# Made with Bob
