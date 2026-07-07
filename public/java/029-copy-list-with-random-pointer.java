/*
 * LeetCode Problem #138: Copy List with Random Pointer
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/copy-list-with-random-pointer/
 */
import java.util.*;

public class Solution {

    static class Node {
        int val;
        Node next, random;
        Node(int val) { this.val = val; }
    }

    // APPROACH 1: Hash Map | O(n) time | O(n) space
    // EXPLAIN: First pass creates all copied nodes in a map; second pass wires next and random pointers using the map.
    public Node copyRandomList(Node head) {
        if (head == null) return null;
        Map<Node, Node> map = new HashMap<>();
        for (Node c = head; c != null; c = c.next) map.put(c, new Node(c.val));
        for (Node c = head; c != null; c = c.next) {
            map.get(c).next   = map.get(c.next);
            map.get(c).random = map.get(c.random);
        }
        return map.get(head);
    }

    // APPROACH 2: Interweaving Nodes | O(n) time | O(1) space
    // EXPLAIN: Insert A'->A->B'->B...; set random pointers (A'.random = A.random.next); then separate the two lists.
    public Node copyRandomListInterweave(Node head) {
        if (head == null) return null;
        // Step 1: Interweave
        Node curr = head;
        while (curr != null) {
            Node copy = new Node(curr.val);
            copy.next = curr.next;
            curr.next = copy;
            curr = copy.next;
        }
        // Step 2: Set random
        curr = head;
        while (curr != null) {
            if (curr.random != null) curr.next.random = curr.random.next;
            curr = curr.next.next;
        }
        // Step 3: Separate
        Node dummy = new Node(0), copyCurr = dummy;
        curr = head;
        while (curr != null) {
            copyCurr.next = curr.next;
            curr.next = curr.next.next;
            copyCurr = copyCurr.next;
            curr = curr.next;
        }
        return dummy.next;
    }

    // APPROACH 3: Recursive with Memo | O(n) time | O(n) space
    // EXPLAIN: Recursively clone each node, storing the result in a visited map to avoid creating duplicates when random creates back-references.
    private Map<Node, Node> memo = new HashMap<>();

    public Node copyRandomListRecursive(Node node) {
        if (node == null) return null;
        if (memo.containsKey(node)) return memo.get(node);
        Node copy = new Node(node.val);
        memo.put(node, copy);
        copy.next   = copyRandomListRecursive(node.next);
        copy.random = copyRandomListRecursive(node.random);
        return copy;
    }

    // APPROACH 4: Hash Map with Null Sentinel | O(n) time | O(n) space
    // EXPLAIN: Pre-insert null->null so all pointer assignments are uniform without null-checks.
    public Node copyRandomListNullSentinel(Node head) {
        if (head == null) return null;
        Map<Node, Node> map = new HashMap<>();
        map.put(null, null);
        for (Node c = head; c != null; c = c.next) map.put(c, new Node(c.val));
        for (Node c = head; c != null; c = c.next) {
            map.get(c).next   = map.get(c.next);
            map.get(c).random = map.get(c.random);
        }
        return map.get(head);
    }

    // APPROACH 5: Index-Based | O(n) time | O(n) space
    // EXPLAIN: Store nodes in an array and build an index map; use indices to connect copies' random pointers.
    public Node copyRandomListIndex(Node head) {
        if (head == null) return null;
        List<Node> nodes = new ArrayList<>();
        Map<Node, Integer> idx = new HashMap<>();
        for (Node c = head; c != null; c = c.next) { idx.put(c, nodes.size()); nodes.add(c); }
        Node[] copies = new Node[nodes.size()];
        for (int i = 0; i < nodes.size(); i++) copies[i] = new Node(nodes.get(i).val);
        for (int i = 0; i < nodes.size(); i++) {
            Node orig = nodes.get(i);
            if (orig.next   != null) copies[i].next   = copies[i + 1];
            if (orig.random != null) copies[i].random = copies[idx.get(orig.random)];
        }
        return copies[0];
    }
}

// Made with Bob
