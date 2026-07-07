/*
 * LeetCode Problem #2: Add Two Numbers
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/add-two-numbers/
 */
import java.util.*;

class Solution {

    // Definition for singly-linked list.
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val) { this.val = val; }
    }

    // APPROACH 1: Iterative Dummy Head | O(max(m, n)) time | O(max(m, n)) space
    // EXPLAIN: Traverse both lists simultaneously, summing digits and carrying the overflow to the next node.
    // WHEN: The natural single-pass solution; handles different lengths and final carry correctly.
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;
        int carry = 0;

        while (l1 != null || l2 != null || carry != 0) {
            int sum = carry;
            if (l1 != null) {
                sum += l1.val;
                l1 = l1.next;
            }
            if (l2 != null) {
                sum += l2.val;
                l2 = l2.next;
            }
            carry = sum / 10;
            current.next = new ListNode(sum % 10);
            current = current.next;
        }

        return dummy.next;
    }

    // APPROACH 2: Recursive | O(max(m, n)) time | O(max(m, n)) space
    // EXPLAIN: Recursively sum digits and pass carry to the next call; base case when both lists are empty and carry is zero.
    // WHEN: Elegant recursive alternative; call-stack depth is O(max(m,n)).
    public ListNode addTwoNumbers_Recursive(ListNode l1, ListNode l2) {
        return addHelper(l1, l2, 0);
    }

    private ListNode addHelper(ListNode l1, ListNode l2, int carry) {
        if (l1 == null && l2 == null && carry == 0) return null;

        int sum = carry;
        if (l1 != null) { sum += l1.val; l1 = l1.next; }
        if (l2 != null) { sum += l2.val; l2 = l2.next; }

        ListNode node = new ListNode(sum % 10);
        node.next = addHelper(l1, l2, sum / 10);
        return node;
    }

    // APPROACH 3: In-Place Modification | O(max(m, n)) time | O(1) space
    // EXPLAIN: Reuse l1 nodes for the result; allocate new nodes only when l1 is exhausted or carry remains.
    // WHEN: When modifying the input is acceptable and minimising extra allocation matters.
    public ListNode addTwoNumbers_InPlace(ListNode l1, ListNode l2) {
        ListNode head = l1;
        ListNode prev = null;
        int carry = 0;

        while (l1 != null || l2 != null || carry != 0) {
            int sum = carry;
            if (l1 != null) sum += l1.val;
            if (l2 != null) { sum += l2.val; l2 = l2.next; }
            carry = sum / 10;

            if (l1 != null) {
                l1.val = sum % 10;
                prev   = l1;
                l1     = l1.next;
            } else {
                ListNode newNode = new ListNode(sum % 10);
                prev.next = newNode;
                prev      = newNode;
            }
        }
        return head;
    }
}

// Made with Bob
