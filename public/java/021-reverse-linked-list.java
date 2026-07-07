/*
 * LeetCode Problem #206: Reverse Linked List
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/reverse-linked-list/
 */
import java.util.*;

class Solution {

    // Definition for singly-linked list.
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val) { this.val = val; }
    }

    // APPROACH 1: Iterative | O(n) time | O(1) space
    // EXPLAIN: Walk through the list, reversing each node's next pointer using three variables.
    // WHEN: Preferred — O(1) space, no call-stack risk; standard interview answer.
    public ListNode reverseList_Iterative(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }

    // APPROACH 2: Recursive | O(n) time | O(n) space
    // EXPLAIN: Recurse to the tail, then reverse the link on the way back up the call stack.
    // WHEN: When interviewers ask for the recursive solution or to demonstrate recursion clarity.
    public ListNode reverseList_Recursive(ListNode head) {
        if (head == null || head.next == null) return head;
        ListNode newHead = reverseList_Recursive(head.next);
        head.next.next = head;
        head.next = null;
        return newHead;
    }

    // APPROACH 3: Tail Recursion | O(n) time | O(n) space
    // EXPLAIN: Pass an accumulator (prev) through tail-recursive calls — mirrors the iterative logic in recursive form.
    // WHEN: When the interviewer asks for a tail-recursive variant; logically identical to iterative.
    public ListNode reverseList_TailRecursive(ListNode head) {
        return reverseHelper(head, null);
    }

    private ListNode reverseHelper(ListNode curr, ListNode prev) {
        if (curr == null) return prev;
        ListNode next = curr.next;
        curr.next = prev;
        return reverseHelper(next, curr);
    }
}

// Made with Bob
