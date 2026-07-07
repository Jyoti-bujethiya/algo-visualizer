/*
 * LeetCode Problem #143: Reorder List
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/reorder-list/
 */
import java.util.*;

public class Solution {

    static class ListNode {
        int val;
        ListNode next;
        ListNode(int x) { val = x; }
    }

    // APPROACH 1: Find Middle + Reverse + Merge | O(n) time | O(1) space
    // EXPLAIN: Find list midpoint with slow/fast pointers, reverse the second half in-place, then interleave both halves.
    public void reorderList(ListNode head) {
        if (head == null || head.next == null) return;
        // Find middle
        ListNode slow = head, fast = head;
        while (fast.next != null && fast.next.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        // Reverse second half
        ListNode prev = null, curr = slow.next;
        slow.next = null;
        while (curr != null) {
            ListNode nxt = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nxt;
        }
        // Merge
        ListNode first = head, second = prev;
        while (second != null) {
            ListNode tmp1 = first.next, tmp2 = second.next;
            first.next = second;
            second.next = tmp1;
            first = tmp1;
            second = tmp2;
        }
    }

    // APPROACH 2: Using ArrayList | O(n) time | O(n) space
    // EXPLAIN: Store all nodes in a list then relink using left/right two-pointer sweep.
    public void reorderListArray(ListNode head) {
        if (head == null || head.next == null) return;
        List<ListNode> nodes = new ArrayList<>();
        for (ListNode c = head; c != null; c = c.next) nodes.add(c);
        int left = 0, right = nodes.size() - 1;
        while (left < right) {
            nodes.get(left).next = nodes.get(right);
            left++;
            if (left >= right) break;
            nodes.get(right).next = nodes.get(left);
            right--;
        }
        nodes.get(left).next = null;
    }

    // APPROACH 3: Using Stack | O(n) time | O(n) space
    // EXPLAIN: Push all nodes to a stack; pop the tail node and insert it after each front node, stopping at the midpoint.
    public void reorderListStack(ListNode head) {
        if (head == null || head.next == null) return;
        Deque<ListNode> stack = new ArrayDeque<>();
        int count = 0;
        for (ListNode c = head; c != null; c = c.next) { stack.push(c); count++; }
        ListNode curr = head;
        for (int i = 0; i < count / 2; i++) {
            ListNode last = stack.pop();
            ListNode nxt = curr.next;
            curr.next = last;
            last.next = nxt;
            curr = nxt;
        }
        curr.next = null;
    }

    // APPROACH 4: Recursive | O(n) time | O(n) space
    // EXPLAIN: Recurse to the end, then on the way back relink nodes from both ends inward using a mutable front reference.
    private ListNode front;

    public void reorderListRecursive(ListNode head) {
        if (head == null || head.next == null) return;
        front = head;
        helper(head.next);
    }

    private void helper(ListNode node) {
        if (node == null) return;
        helper(node.next);
        if (front == null || front == node || front.next == node) {
            node.next = null;
            front = null;
            return;
        }
        ListNode nxt = front.next;
        front.next = node;
        node.next = nxt;
        front = nxt;
    }

    // APPROACH 5: Iterative with Length Calculation | O(n) time | O(1) space
    // EXPLAIN: Compute list length to locate exact midpoint, reverse second half, then merge the two halves alternately.
    public void reorderListLength(ListNode head) {
        if (head == null || head.next == null) return;
        int length = 0;
        for (ListNode c = head; c != null; c = c.next) length++;
        int mid = length / 2;
        ListNode curr = head;
        for (int i = 0; i < mid; i++) curr = curr.next;
        // Reverse second half
        ListNode prev = null, node = curr.next;
        curr.next = null;
        while (node != null) {
            ListNode nxt = node.next;
            node.next = prev;
            prev = node;
            node = nxt;
        }
        // Merge
        ListNode first = head, second = prev;
        while (second != null) {
            ListNode n1 = first.next, n2 = second.next;
            first.next = second;
            second.next = n1;
            first = n1;
            second = n2;
        }
    }
}

// Made with Bob
