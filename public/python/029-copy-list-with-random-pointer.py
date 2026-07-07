# LeetCode Problem #138: Copy List with Random Pointer
# Difficulty: Medium
# Link: https://leetcode.com/problems/copy-list-with-random-pointer/

from typing import Optional


class Node:
    def __init__(self, x: int, next=None, random=None):
        self.val = int(x)
        self.next = next
        self.random = random


# ─────────────────────────────────────────────
# APPROACH 1: Hash Map (Intuitive) | O(n) time | O(n) space
# EXPLAIN: Two passes: first create all copied nodes stored in a map; second wire next and random pointers via the map.
# WHEN: Most readable approach; standard first solution in an interview.

def copyRandomList_hashmap(head: Optional[Node]) -> Optional[Node]:
    if not head:
        return None
    old_to_new = {}
    curr = head
    while curr:
        old_to_new[curr] = Node(curr.val)
        curr = curr.next
    curr = head
    while curr:
        if curr.next:
            old_to_new[curr].next = old_to_new[curr.next]
        if curr.random:
            old_to_new[curr].random = old_to_new[curr.random]
        curr = curr.next
    return old_to_new[head]


# ─────────────────────────────────────────────
# APPROACH 2: Interweaving Nodes (Optimal) | O(n) time | O(1) space
# EXPLAIN: Insert each copy right after its original (A->A'->B->B'...), set random pointers, then separate the lists.
# WHEN: Best space efficiency — O(1) extra, no hash map needed.

def copyRandomList_interweave(head: Optional[Node]) -> Optional[Node]:
    if not head:
        return None
    # Step 1: Interweave
    curr = head
    while curr:
        copy = Node(curr.val)
        copy.next = curr.next
        curr.next = copy
        curr = copy.next
    # Step 2: Set random pointers
    curr = head
    while curr:
        if curr.random:
            curr.next.random = curr.random.next
        curr = curr.next.next
    # Step 3: Separate lists
    dummy = Node(0)
    copy_curr = dummy
    curr = head
    while curr:
        copy_curr.next = curr.next
        curr.next = curr.next.next
        copy_curr = copy_curr.next
        curr = curr.next
    return dummy.next


# ─────────────────────────────────────────────
# APPROACH 3: Recursive with Hash Map | O(n) time | O(n) space
# EXPLAIN: Recursively clone each node, using a visited dict to avoid creating duplicates.
# WHEN: Natural recursive formulation; useful when you think about the problem structurally.

def copyRandomList_recursive(head: Optional[Node]) -> Optional[Node]:
    visited: dict = {}

    def clone(node):
        if not node:
            return None
        if node in visited:
            return visited[node]
        copy = Node(node.val)
        visited[node] = copy
        copy.next = clone(node.next)
        copy.random = clone(node.random)
        return copy

    return clone(head)


# ─────────────────────────────────────────────
# APPROACH 4: Hash Map with Null Sentinel | O(n) time | O(n) space
# EXPLAIN: Pre-insert None->None into the map so next/random pointer assignments need no null checks.
# WHEN: Slightly cleaner code than Approach 1 by handling null uniformly.

def copyRandomList_null_sentinel(head: Optional[Node]) -> Optional[Node]:
    if not head:
        return None
    mp: dict = {None: None}
    curr = head
    while curr:
        mp[curr] = Node(curr.val)
        curr = curr.next
    curr = head
    while curr:
        mp[curr].next = mp[curr.next]
        mp[curr].random = mp[curr.random]
        curr = curr.next
    return mp[head]


# ─────────────────────────────────────────────
# APPROACH 5: Vector/Index-Based | O(n) time | O(n) space
# EXPLAIN: Store nodes in a list, build an index map, create copies, then wire pointers using indices.
# WHEN: Useful when you want to think about nodes by position rather than pointer identity.

def copyRandomList_index(head: Optional[Node]) -> Optional[Node]:
    if not head:
        return None
    nodes = []
    node_to_idx: dict = {}
    curr = head
    while curr:
        node_to_idx[curr] = len(nodes)
        nodes.append(curr)
        curr = curr.next
    copies = [Node(n.val) for n in nodes]
    for i, n in enumerate(nodes):
        if n.next:
            copies[i].next = copies[i + 1]
        if n.random:
            copies[i].random = copies[node_to_idx[n.random]]
    return copies[0]


# Made with Bob
