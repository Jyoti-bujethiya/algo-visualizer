/*
 * LeetCode Problem #142: Linked List Cycle II
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/linked-list-cycle-ii/
 */
import java.util.*;

public class Solution {

    static class ListNode {
        int val;
        ListNode next;
        ListNode(int x) { val = x; next = null; }
    }

    // APPROACH 1: Floyd's Algorithm + Math | O(n) time | O(1) space
    // EXPLAIN: After slow/fast meet inside the cycle, reset slow to head; both advance one step at a time until they meet at the cycle entrance.
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                slow = head;
                while (slow != fast) {
                    slow = slow.next;
                    fast = fast.next;
                }
                return slow;
            }
        }
        return null;
    }

    // APPROACH 2: Hash Set | O(n) time | O(n) space
    // EXPLAIN: Record each visited node; the first node seen twice is the cycle entrance.
    public ListNode detectCycleHashSet(ListNode head) {
        Set<ListNode> visited = new HashSet<>();
        ListNode cur = head;
        while (cur != null) {
            if (!visited.add(cur)) return cur;
            cur = cur.next;
        }
        return null;
    }

    // APPROACH 3: Reverse Pointers | O(n) time | O(1) space
    // EXPLAIN: Reverse the list as we traverse; if we detect a node whose next points backward that is the cycle start; restore afterwards.
    public ListNode detectCycleReverse(ListNode head) {
        if (head == null || head.next == null) return null;
        ListNode prev = null, current = head;
        while (current != null) {
            ListNode next = current.next;
            if (next != null && next.next == current) {
                // restore and return
                ListNode restore = head;
                while (restore != current) {
                    ListNode tmp = restore.next;
                    restore.next = prev;
                    prev = restore;
                    restore = tmp;
                }
                return next;
            }
            current.next = prev;
            prev = current;
            current = next;
        }
        // no cycle — restore
        current = prev; prev = null;
        while (current != null) {
            ListNode next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        return null;
    }

    // APPROACH 4: Mark Values | O(n) time | O(1) space
    // EXPLAIN: Add a sentinel value to each visited node; the first already-marked node is the cycle start (not recommended in production).
    public ListNode detectCycleMarkValues(ListNode head) {
        final int MARKER = 200001;
        ListNode current = head;
        while (current != null) {
            if (current.val == MARKER) {
                ListNode r = head;
                while (r != current) { r.val -= MARKER; r = r.next; }
                return current;
            }
            current.val += MARKER;
            current = current.next;
        }
        current = head;
        while (current != null) { current.val -= MARKER; current = current.next; }
        return null;
    }

    // APPROACH 5: Distance Calculation | O(n) time | O(1) space
    // EXPLAIN: Detect cycle with Floyd's, compute cycle length, then use two pointers offset by that length to meet at cycle start.
    public ListNode detectCycleDistance(ListNode head) {
        if (head == null || head.next == null) return null;
        ListNode slow = head, fast = head;
        boolean hasCycle = false;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) { hasCycle = true; break; }
        }
        if (!hasCycle) return null;
        int cycleLen = 1;
        fast = slow.next;
        while (fast != slow) { fast = fast.next; cycleLen++; }
        slow = fast = head;
        for (int i = 0; i < cycleLen; i++) fast = fast.next;
        while (slow != fast) { slow = slow.next; fast = fast.next; }
        return slow;
    }
}

// Made with Bob
