/*
 * LeetCode Problem #19: Remove Nth Node From End of List
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/remove-nth-node-from-end-of-list/
 */
import java.util.*;

class Solution {

    // Definition for singly-linked list.
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val) { this.val = val; }
    }

    // APPROACH 1: Two Pointer One Pass | O(n) time | O(1) space
    // EXPLAIN: Advance fast pointer n+1 steps ahead; then move both until fast reaches the end — slow is at the target's predecessor.
    // WHEN: Optimal — single pass, constant space; classic two-pointer linked list trick.
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode fast = dummy;
        ListNode slow = dummy;

        // Advance fast by n+1 steps
        for (int i = 0; i <= n; i++) {
            fast = fast.next;
        }

        // Move both until fast reaches end
        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }

        slow.next = slow.next.next;
        return dummy.next;
    }

    // APPROACH 2: Two Pass Length | O(n) time | O(1) space
    // EXPLAIN: First pass counts the length; second pass navigates to the (L - n)th node and removes the next.
    // WHEN: Simple to explain; good when two passes are acceptable.
    public ListNode removeNthFromEnd_TwoPass(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        // Count length
        int length = 0;
        ListNode temp = head;
        while (temp != null) {
            length++;
            temp = temp.next;
        }

        // Navigate to node just before the target
        int stepsFromHead = length - n;
        ListNode current = dummy;
        for (int i = 0; i < stepsFromHead; i++) {
            current = current.next;
        }
        current.next = current.next.next;

        return dummy.next;
    }

    // APPROACH 3: Recursion | O(n) time | O(n) space
    // EXPLAIN: Recurse to the end; count nodes on the return path and skip the nth node from the end.
    // WHEN: When a recursive solution is preferred; stack depth is O(n).
    public ListNode removeNthFromEnd_Recursive(ListNode head, int n) {
        int[] count = {0};
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        dummy.next = removeHelper(head, n, count);
        return dummy.next;
    }

    private ListNode removeHelper(ListNode node, int n, int[] count) {
        if (node == null) return null;
        node.next = removeHelper(node.next, n, count);
        count[0]++;
        if (count[0] == n) return node.next; // skip this node
        return node;
    }

    // APPROACH 4: Stack | O(n) time | O(n) space
    // EXPLAIN: Push all nodes (including dummy) onto a stack; pop n times to reach the predecessor, then unlink the target.
    // WHEN: Intuitive LIFO-based approach for accessing nodes from the end.
    public ListNode removeNthFromEnd_Stack(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        Deque<ListNode> stack = new ArrayDeque<>();
        ListNode current = dummy;
        while (current != null) {
            stack.push(current);
            current = current.next;
        }

        // Pop n nodes to reach the predecessor
        for (int i = 0; i < n; i++) {
            stack.pop();
        }

        ListNode prev = stack.peek();
        prev.next = prev.next.next;

        return dummy.next;
    }
}

// Made with Bob
