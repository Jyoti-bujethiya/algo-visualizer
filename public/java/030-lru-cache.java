/*
 * LeetCode Problem #146: LRU Cache
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/lru-cache/
 */
import java.util.*;

// APPROACH 1: LinkedHashMap | O(1) time | O(n) space
// EXPLAIN: LinkedHashMap maintains insertion order with an accessOrder flag, providing built-in LRU eviction with one-line removeEldestEntry override.
// WHEN: Production shortcut in Java; ideal when you want minimal boilerplate.
class LRUCacheLinkedHashMap {
    private final int capacity;
    private final LinkedHashMap<Integer, Integer> map;

    public LRUCacheLinkedHashMap(int capacity) {
        this.capacity = capacity;
        this.map = new LinkedHashMap<>(capacity, 0.75f, true) {
            protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
                return size() > capacity;
            }
        };
    }

    public int get(int key) { return map.getOrDefault(key, -1); }
    public void put(int key, int value) { map.put(key, value); }
}

// APPROACH 2: Doubly-Linked List + HashMap | O(1) time | O(n) space
// EXPLAIN: A HashMap gives O(1) key lookup; a custom doubly-linked list tracks recency so both moves and evictions are O(1).
// WHEN: The canonical interview answer — demonstrates understanding of cache internals.
class LRUCache {
    private static class Node {
        int key, val;
        Node prev, next;
        Node(int k, int v) { key = k; val = v; }
    }

    private final int capacity;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0);
    private final Node tail = new Node(0, 0);

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        Node node = map.get(key);
        if (node == null) return -1;
        moveToFront(node);
        return node.val;
    }

    public void put(int key, int value) {
        Node node = map.get(key);
        if (node != null) {
            node.val = value;
            moveToFront(node);
        } else {
            node = new Node(key, value);
            map.put(key, node);
            addToFront(node);
            if (map.size() > capacity) {
                Node lru = tail.prev;
                remove(lru);
                map.remove(lru.key);
            }
        }
    }

    private void addToFront(Node node) {
        node.next = head.next; node.prev = head;
        head.next.prev = node; head.next = node;
    }
    private void remove(Node node) {
        node.prev.next = node.next; node.next.prev = node.prev;
    }
    private void moveToFront(Node node) { remove(node); addToFront(node); }
}

// APPROACH 3: Timestamp (Not O(1)) | O(n) eviction | O(n) space
// EXPLAIN: Record access timestamps per key; on eviction scan all keys for the minimum timestamp. Does NOT meet O(1) requirement — shown for comparison only.
class LRUCacheTimestamp {
    private final int capacity;
    private final Map<Integer, Integer> values = new HashMap<>();
    private final Map<Integer, Integer> times  = new HashMap<>();
    private int ts = 0;

    public LRUCacheTimestamp(int capacity) { this.capacity = capacity; }

    public int get(int key) {
        if (!values.containsKey(key)) return -1;
        times.put(key, ts++);
        return values.get(key);
    }

    public void put(int key, int value) {
        if (values.containsKey(key)) {
            values.put(key, value);
            times.put(key, ts++);
        } else {
            if (values.size() == capacity) {
                int lruKey = Collections.min(times.entrySet(),
                    Map.Entry.comparingByValue()).getKey();
                values.remove(lruKey);
                times.remove(lruKey);
            }
            values.put(key, value);
            times.put(key, ts++);
        }
    }
}

// Made with Bob
