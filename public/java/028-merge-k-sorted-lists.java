/*
 * LeetCode Problem #23: Merge K Sorted Lists
 * Difficulty: Hard
 * Link: https://leetcode.com/problems/merge-k-sorted-lists/
 */
import java.util.*;

public class Solution {

    static class ListNode {
        int val;
        ListNode next;
        ListNode(int x) { val = x; }
    }

    // APPROACH 1: Min Heap | O(N log k) time | O(k) space
    // EXPLAIN: Insert each list's head into a min-heap; extract the minimum, append to result, and push its successor — heap size stays at most k.
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> heap = new PriorityQueue<>(
            (a, b) -> a.val - b.val);
        for (ListNode node : lists) if (node != null) heap.offer(node);
        ListNode dummy = new ListNode(0), tail = dummy;
        while (!heap.isEmpty()) {
            tail.next = heap.poll();
            tail = tail.next;
            if (tail.next != null) heap.offer(tail.next);
        }
        return dummy.next;
    }

    // APPROACH 2: Divide and Conquer | O(N log k) time | O(log k) space
    // EXPLAIN: Recursively split the list array in half and merge pairs, like merge sort.
    public ListNode mergeKListsDivide(ListNode[] lists) {
        if (lists.length == 0) return null;
        return divide(lists, 0, lists.length - 1);
    }

    private ListNode divide(ListNode[] lists, int lo, int hi) {
        if (lo == hi) return lists[lo];
        int mid = (lo + hi) / 2;
        return mergeTwoLists(divide(lists, lo, mid), divide(lists, mid + 1, hi));
    }

    private ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0), tail = dummy;
        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
            else                  { tail.next = l2; l2 = l2.next; }
            tail = tail.next;
        }
        tail.next = (l1 != null) ? l1 : l2;
        return dummy.next;
    }

    // APPROACH 3: Iterative Pairwise Merge | O(N log k) time | O(1) space
    // EXPLAIN: Repeatedly merge adjacent list pairs, halving the total count each round until one list remains.
    public ListNode mergeKListsPairwise(ListNode[] lists) {
        List<ListNode> arr = new ArrayList<>(Arrays.asList(lists));
        while (arr.size() > 1) {
            List<ListNode> merged = new ArrayList<>();
            for (int i = 0; i < arr.size(); i += 2) {
                ListNode l2 = (i + 1 < arr.size()) ? arr.get(i + 1) : null;
                merged.add(mergeTwoLists(arr.get(i), l2));
            }
            arr = merged;
        }
        return arr.isEmpty() ? null : arr.get(0);
    }

    // APPROACH 4: Sequential Merge | O(N*k) time | O(1) space
    // EXPLAIN: Merge each list into a running accumulator one at a time; simpler but slower for large k.
    public ListNode mergeKListsSequential(ListNode[] lists) {
        if (lists.length == 0) return null;
        ListNode result = lists[0];
        for (int i = 1; i < lists.length; i++)
            result = mergeTwoLists(result, lists[i]);
        return result;
    }

    // APPROACH 5: Collect + Sort | O(N log N) time | O(N) space
    // EXPLAIN: Drain all node values into a list, sort them, and rebuild a fresh linked list.
    public ListNode mergeKListsSort(ListNode[] lists) {
        List<Integer> vals = new ArrayList<>();
        for (ListNode node : lists)
            for (ListNode c = node; c != null; c = c.next) vals.add(c.val);
        Collections.sort(vals);
        ListNode dummy = new ListNode(0), tail = dummy;
        for (int v : vals) { tail.next = new ListNode(v); tail = tail.next; }
        return dummy.next;
    }
}

// Made with Bob
