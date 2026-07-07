/*
 * LeetCode Problem #21: Merge Two Sorted Lists
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/merge-two-sorted-lists/
 */
import java.util.*;

class Solution {

    // Definition for singly-linked list.
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val) { this.val = val; }
    }

    // APPROACH 1: Iterative with Dummy Head | O(n + m) time | O(1) space
    // EXPLAIN: Use a dummy sentinel node; at each step attach the smaller node and advance that pointer.
    // WHEN: Preferred — O(1) space and no recursion depth concern; cleanest iterative approach.
    public ListNode mergeTwoLists_Iterative(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;

        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                current.next = list1;
                list1 = list1.next;
            } else {
                current.next = list2;
                list2 = list2.next;
            }
            current = current.next;
        }

        current.next = (list1 != null) ? list1 : list2;
        return dummy.next;
    }

    // APPROACH 2: Recursive | O(n + m) time | O(n + m) space
    // EXPLAIN: Recursively attach the smaller head and delegate the rest; base cases handle empty lists.
    // WHEN: Elegant for teaching recursion; avoid in production for long lists due to stack depth.
    public ListNode mergeTwoLists_Recursive(ListNode list1, ListNode list2) {
        if (list1 == null) return list2;
        if (list2 == null) return list1;

        if (list1.val <= list2.val) {
            list1.next = mergeTwoLists_Recursive(list1.next, list2);
            return list1;
        } else {
            list2.next = mergeTwoLists_Recursive(list1, list2.next);
            return list2;
        }
    }

    // APPROACH 3: In-Place without Dummy Node | O(n + m) time | O(1) space
    // EXPLAIN: Determine the head manually (no dummy sentinel), then wire remaining nodes iteratively.
    // WHEN: When you want to avoid allocating a dummy node; slightly more complex head selection.
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        if (list1 == null) return list2;
        if (list2 == null) return list1;

        // Determine head
        ListNode head;
        if (list1.val <= list2.val) {
            head  = list1;
            list1 = list1.next;
        } else {
            head  = list2;
            list2 = list2.next;
        }

        ListNode current = head;
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                current.next = list1;
                list1 = list1.next;
            } else {
                current.next = list2;
                list2 = list2.next;
            }
            current = current.next;
        }

        current.next = (list1 != null) ? list1 : list2;
        return head;
    }
}

// Made with Bob
