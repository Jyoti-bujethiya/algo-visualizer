/*
 * LeetCode Problem #141: Linked List Cycle
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/linked-list-cycle/
 */
import java.util.*;

class Solution {

    // Definition for singly-linked list.
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val) { this.val = val; }
    }

    // APPROACH 1: Floyd's Cycle Detection (Two Pointers) | O(n) time | O(1) space
    // EXPLAIN: Slow pointer moves one step, fast moves two; if they meet, there is a cycle.
    // WHEN: Optimal — O(1) space; the standard interview answer for cycle detection in linked lists.
    public boolean hasCycle_Floyd(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }

    // APPROACH 2: Hash Set | O(n) time | O(n) space
    // EXPLAIN: Store each visited node in a set; if we encounter a node we have seen before, a cycle exists.
    // WHEN: Simple and clear; use when memory is not constrained or to quickly verify cycle detection.
    public boolean hasCycle_HashSet(ListNode head) {
        Set<ListNode> visited = new HashSet<>();
        ListNode current = head;
        while (current != null) {
            if (visited.contains(current)) return true;
            visited.add(current);
            current = current.next;
        }
        return false;
    }

    // APPROACH 3: Node Modification (Destructive) | O(n) time | O(1) space
    // EXPLAIN: Redirect each visited node's next pointer to a sentinel node; if we see the sentinel, a cycle existed.
    // WHEN: Academic / demonstration only — permanently modifies the input list.
    public boolean hasCycle_Modify(ListNode head) {
        ListNode sentinel = new ListNode(0);
        ListNode curr = head;
        while (curr != null) {
            if (curr.next == sentinel) return true;
            ListNode temp = curr.next;
            curr.next = sentinel;
            curr = temp;
        }
        return false;
    }

    // APPROACH 4: Floyd's Variant (Different Starting Points) | O(n) time | O(1) space
    // EXPLAIN: Start fast one step ahead of slow; the loop exits when they meet (cycle) or fast reaches null (no cycle).
    // WHEN: Alternative Floyd's formulation; slightly different loop condition that some find more elegant.
    public boolean hasCycle_Variant(ListNode head) {
        if (head == null) return false;
        ListNode slow = head;
        ListNode fast = head.next;
        while (slow != fast) {
            if (fast == null || fast.next == null) return false;
            slow = slow.next;
            fast = fast.next.next;
        }
        return true;
    }

    // APPROACH 5: Standard Solution (Most Common Interview Form) | O(n) time | O(1) space
    // EXPLAIN: Canonical Floyd's form — both pointers start at head; loop condition checks fast and fast.next for null.
    // WHEN: The form most interviewers expect; functionally identical to approach 1 with an added early-exit guard.
    public boolean hasCycle(ListNode head) {
        if (head == null || head.next == null) return false;
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}

// Made with Bob
