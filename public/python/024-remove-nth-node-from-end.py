# LeetCode Problem #19: Remove Nth Node From End of List
# Difficulty: Medium
# Link: https://leetcode.com/problems/remove-nth-node-from-end-of-list/

from __future__ import annotations
from typing import Optional

# ─────────────────────────────────────────────
# Shared node definition
class ListNode:
    def __init__(self, val: int = 0, nxt: Optional["ListNode"] = None) -> None:
        self.val  = val
        self.next = nxt


# ─────────────────────────────────────────────
# APPROACH 1: Two Pointer One Pass | O(n) time | O(1) space
# EXPLAIN: Advance the fast pointer n+1 steps ahead; move both until fast reaches None — slow is at the predecessor.
# WHEN: Elegant single-pass solution; the go-to answer in interviews.

def remove_nth_one_pass(head: Optional[ListNode], n: int) -> Optional[ListNode]:
    dummy = ListNode(0, head)
    slow = fast = dummy
    # Advance fast by n+1 steps so the gap is n
    for _ in range(n + 1):
        fast = fast.next        # type: ignore[assignment]
    while fast is not None:
        slow = slow.next        # type: ignore[assignment]
        fast = fast.next
    slow.next = slow.next.next  # type: ignore[union-attr]
    return dummy.next


# ─────────────────────────────────────────────
# APPROACH 2: Two Pass Length | O(n) time | O(1) space
# EXPLAIN: First pass counts length L; second pass stops at node L - n to remove the target.
# WHEN: Simple and explicit — easy to verify correctness; identical time complexity to one pass.

def remove_nth_two_pass(head: Optional[ListNode], n: int) -> Optional[ListNode]:
    dummy = ListNode(0, head)
    # Count length
    length, cur = 0, head
    while cur:
        length += 1
        cur     = cur.next
    # Move to the node just before the target
    target = length - n
    cur = dummy
    for _ in range(target):
        cur = cur.next          # type: ignore[assignment]
    cur.next = cur.next.next    # type: ignore[union-attr]
    return dummy.next


# ─────────────────────────────────────────────
# APPROACH 3: Recursion | O(n) time | O(n) space
# EXPLAIN: Recurse to the end; count nodes on the return path and skip the nth one from the end.
# WHEN: When a recursive solution is preferred; call-stack depth is O(n).

def remove_nth_recursive(head: Optional[ListNode], n: int) -> Optional[ListNode]:
    count = [0]   # mutable counter via list

    def helper(node: Optional[ListNode]) -> Optional[ListNode]:
        if node is None:
            return None
        node.next = helper(node.next)
        count[0] += 1
        if count[0] == n:
            return node.next   # skip this node
        return node

    dummy = ListNode(0, head)
    dummy.next = helper(head)
    return dummy.next


# ─────────────────────────────────────────────
# APPROACH 4: Stack | O(n) time | O(n) space
# EXPLAIN: Push all nodes onto a stack; pop n times to reach the predecessor of the target, then unlink it.
# WHEN: When a stack-based approach is natural or required.

def remove_nth_stack(head: Optional[ListNode], n: int) -> Optional[ListNode]:
    dummy = ListNode(0, head)
    stack: list[ListNode] = []
    cur: Optional[ListNode] = dummy
    while cur:
        stack.append(cur)
        cur = cur.next
    # Pop n nodes to reach the predecessor
    for _ in range(n):
        stack.pop()
    prev = stack[-1]
    prev.next = prev.next.next  # type: ignore[union-attr]
    return dummy.next


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
        ([1,2,3,4,5], 2, [1,2,3,5]),
        ([1],          1, []),
        ([1,2],        1, [1]),
        ([1,2],        2, [2]),
    ]
    for vals, n, expected in cases:
        assert to_list(remove_nth_one_pass( build_list(vals), n)) == expected
        assert to_list(remove_nth_two_pass( build_list(vals), n)) == expected
        assert to_list(remove_nth_recursive(build_list(vals), n)) == expected
        assert to_list(remove_nth_stack(    build_list(vals), n)) == expected
    print("All tests passed.")

# Made with Bob
