# LeetCode Problem #143: Reorder List
# Difficulty: Medium
# Link: https://leetcode.com/problems/reorder-list/

from typing import Optional


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


# ─────────────────────────────────────────────
# APPROACH 1: Find Middle + Reverse + Merge | O(n) time | O(1) space
# EXPLAIN: Split list at middle, reverse second half, then interleave both halves.
# WHEN: Optimal solution — three clean linear passes with no extra memory.

def reorderList_optimal(head: Optional[ListNode]) -> None:
    if not head or not head.next:
        return

    # Step 1: Find middle
    slow, fast = head, head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next

    # Step 2: Reverse second half
    prev, curr = None, slow.next
    slow.next = None
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    second = prev

    # Step 3: Merge
    first = head
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first = tmp1
        second = tmp2


# ─────────────────────────────────────────────
# APPROACH 2: Using Array | O(n) time | O(n) space
# EXPLAIN: Store all nodes in a list, then relink using two pointers from ends.
# WHEN: Simpler logic at the cost of O(n) extra memory.

def reorderList_array(head: Optional[ListNode]) -> None:
    if not head or not head.next:
        return
    nodes = []
    curr = head
    while curr:
        nodes.append(curr)
        curr = curr.next
    left, right = 0, len(nodes) - 1
    while left < right:
        nodes[left].next = nodes[right]
        left += 1
        if left >= right:
            break
        nodes[right].next = nodes[left]
        right -= 1
    nodes[left].next = None


# ─────────────────────────────────────────────
# APPROACH 3: Using Stack | O(n) time | O(n) space
# EXPLAIN: Push all nodes to a stack; pop from stack to get reverse-order nodes and insert after each forward node.
# WHEN: Alternative O(n) space approach using LIFO property.

def reorderList_stack(head: Optional[ListNode]) -> None:
    if not head or not head.next:
        return
    stack = []
    curr = head
    while curr:
        stack.append(curr)
        curr = curr.next
    count = len(stack)
    curr = head
    for _ in range(count // 2):
        last = stack.pop()
        nxt = curr.next
        curr.next = last
        last.next = nxt
        curr = nxt
    curr.next = None


# ─────────────────────────────────────────────
# APPROACH 4: Recursive | O(n) time | O(n) space
# EXPLAIN: Recurse to end of list; on the way back, relink outermost nodes and advance a front pointer.
# WHEN: Demonstrates recursive thinking; uses O(n) call stack space.

def reorderList_recursive(head: Optional[ListNode]) -> None:
    if not head or not head.next:
        return
    front = [head]

    def helper(node):
        if not node:
            return
        helper(node.next)
        if not front[0] or front[0] is node or front[0].next is node:
            node.next = None
            front[0] = None
            return
        nxt = front[0].next
        front[0].next = node
        node.next = nxt
        front[0] = nxt

    helper(head.next)


# ─────────────────────────────────────────────
# APPROACH 5: Iterative with Length Calculation | O(n) time | O(1) space
# EXPLAIN: Compute list length to find exact midpoint, reverse second half, then merge.
# WHEN: Same complexity as Approach 1 but uses explicit length rather than slow/fast pointers.

def reorderList_length(head: Optional[ListNode]) -> None:
    if not head or not head.next:
        return
    # Get length
    length, curr = 0, head
    while curr:
        length += 1
        curr = curr.next
    # Find middle
    mid = length // 2
    curr = head
    for _ in range(mid):
        curr = curr.next
    # Reverse second half
    prev, node = None, curr.next
    curr.next = None
    while node:
        nxt = node.next
        node.next = prev
        prev = node
        node = nxt
    # Merge
    first, second = head, prev
    while second:
        n1, n2 = first.next, second.next
        first.next = second
        second.next = n1
        first = n1
        second = n2


# Made with Bob
