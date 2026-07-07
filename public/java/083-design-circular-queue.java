/*
 * LeetCode Problem #622: Design Circular Queue
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/design-circular-queue/
 */
import java.util.*;

// APPROACH 1: Array with Head/Tail Pointers | O(1) all ops | O(k) space
// EXPLAIN: Fixed-size array; head/tail pointers wrap around with modulo arithmetic.
// WHEN: Classic circular buffer — most efficient and standard implementation.

class MyCircularQueue {
    private int[] data;
    private int head, tail, size, capacity;

    public MyCircularQueue(int k) {
        data = new int[k]; head = 0; tail = -1; size = 0; capacity = k;
    }

    public boolean enQueue(int value) {
        if (isFull()) return false;
        tail = (tail + 1) % capacity;
        data[tail] = value;
        size++;
        return true;
    }

    public boolean deQueue() {
        if (isEmpty()) return false;
        head = (head + 1) % capacity;
        size--;
        return true;
    }

    public int Front()  { return isEmpty() ? -1 : data[head]; }
    public int Rear()   { return isEmpty() ? -1 : data[tail]; }
    public boolean isEmpty() { return size == 0; }
    public boolean isFull()  { return size == capacity; }
}

// APPROACH 2: Doubly Linked List | O(1) all ops | O(k) space
// EXPLAIN: Doubly linked list with dummy sentinels; size counter enforces capacity.
// WHEN: Dynamic allocation; avoids pre-allocating the full array.

class MyCircularQueueLinked {
    private static class Node { int val; Node prev, next; Node(int v) { val = v; } }
    private final Node head = new Node(0), tail = new Node(0);
    private int size, capacity;

    public MyCircularQueueLinked(int k) {
        capacity = k; head.next = tail; tail.prev = head;
    }

    public boolean enQueue(int value) {
        if (isFull()) return false;
        Node node = new Node(value), prev = tail.prev;
        prev.next = node; node.prev = prev; node.next = tail; tail.prev = node;
        size++; return true;
    }

    public boolean deQueue() {
        if (isEmpty()) return false;
        Node front = head.next;
        head.next = front.next; front.next.prev = head;
        size--; return true;
    }

    public int Front()  { return isEmpty() ? -1 : head.next.val; }
    public int Rear()   { return isEmpty() ? -1 : tail.prev.val; }
    public boolean isEmpty() { return size == 0; }
    public boolean isFull()  { return size == capacity; }
}

// APPROACH 3: ArrayDeque with Max-Capacity Check (O(1) all ops) | O(1) all ops | O(k) space
// EXPLAIN: Use a LinkedList bounded by capacity; enqueue appends to tail, dequeue removes from head.
// WHEN: Clean alternative that avoids manual index arithmetic; similar to Python deque(maxlen=k).
class MyCircularQueueDeque {
    private final java.util.LinkedList<Integer> list = new java.util.LinkedList<>();
    private final int capacity;
    public MyCircularQueueDeque(int k) { this.capacity = k; }
    public boolean enQueue(int value) {
        if (isFull()) return false;
        list.addLast(value); return true;
    }
    public boolean deQueue() {
        if (isEmpty()) return false;
        list.removeFirst(); return true;
    }
    public int Front()       { return isEmpty() ? -1 : list.getFirst(); }
    public int Rear()        { return isEmpty() ? -1 : list.getLast(); }
    public boolean isEmpty() { return list.isEmpty(); }
    public boolean isFull()  { return list.size() == capacity; }
}

// ── quick tests ──────────────────────────────────────────────────────────────
class Solution {
    public static void main(String[] args) {
        // Approach 1
        MyCircularQueue q1 = new MyCircularQueue(3);
        assert q1.enQueue(1); assert q1.enQueue(2); assert q1.enQueue(3);
        assert !q1.enQueue(4);
        assert q1.Rear() == 3; assert q1.isFull();
        assert q1.deQueue(); assert q1.enQueue(4);
        assert q1.Rear() == 4; assert q1.Front() == 2;

        // Approach 2
        MyCircularQueueLinked q2 = new MyCircularQueueLinked(3);
        assert q2.enQueue(1); assert q2.enQueue(2); assert q2.enQueue(3);
        assert !q2.enQueue(4);
        assert q2.Rear() == 3; assert q2.isFull();
        assert q2.deQueue(); assert q2.enQueue(4);
        assert q2.Rear() == 4; assert q2.Front() == 2;

        System.out.println("All tests passed.");
    }
}

// Made with Bob
