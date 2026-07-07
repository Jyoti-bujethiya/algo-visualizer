/*
 * LeetCode Problem #23: Merge k Sorted Lists
 * Link: https://leetcode.com/problems/merge-k-sorted-lists/
 * Difficulty: Hard
 */
import java.util.*;

class Solution {

    static class ListNode {
        int val;
        ListNode next;
        ListNode(int x) { val = x; }
    }

    // APPROACH 1: Min Heap (Priority Queue) | O(N log k) time | O(k) space
    // EXPLAIN: Push all list heads into a min-heap; repeatedly extract the minimum and advance that list.
    public ListNode mergeKLists1(ListNode[] lists) {
        PriorityQueue<ListNode> pq = new PriorityQueue<>(Comparator.comparingInt(n -> n.val));
        for (ListNode h : lists) if (h != null) pq.offer(h);
        ListNode dummy = new ListNode(0), cur = dummy;
        while (!pq.isEmpty()) {
            ListNode node = pq.poll();
            cur.next = node;
            cur = cur.next;
            if (node.next != null) pq.offer(node.next);
        }
        return dummy.next;
    }

    // APPROACH 2: Divide and Conquer | O(N log k) time | O(log k) space
    // EXPLAIN: Merge pairs of lists in rounds until one list remains; depth is O(log k).
    public ListNode mergeKLists2(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;
        int n = lists.length;
        while (n > 1) {
            for (int i = 0; i < n / 2; i++)
                lists[i] = mergeTwoLists(lists[i], lists[n - 1 - i]);
            n = (n + 1) / 2;
        }
        return lists[0];
    }

    // APPROACH 3: Collect and Sort | O(N log N) time | O(N) space
    // EXPLAIN: Gather all values, sort, and rebuild the linked list.
    public ListNode mergeKLists3(ListNode[] lists) {
        List<Integer> vals = new ArrayList<>();
        for (ListNode h : lists)
            for (ListNode p = h; p != null; p = p.next) vals.add(p.val);
        Collections.sort(vals);
        ListNode dummy = new ListNode(0), cur = dummy;
        for (int v : vals) { cur.next = new ListNode(v); cur = cur.next; }
        return dummy.next;
    }

    // APPROACH 4: Sequential Merge (Brute Force) | O(k * N) time | O(1) space
    // EXPLAIN: Merge lists one by one into a running result list.
    public ListNode mergeKLists4(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;
        ListNode result = lists[0];
        for (int i = 1; i < lists.length; i++)
            result = mergeTwoLists(result, lists[i]);
        return result;
    }

    private ListNode mergeTwoLists(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0), cur = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { cur.next = a; a = a.next; }
            else                { cur.next = b; b = b.next; }
            cur = cur.next;
        }
        cur.next = (a != null) ? a : b;
        return dummy.next;
    }
}

// Made with Bob
