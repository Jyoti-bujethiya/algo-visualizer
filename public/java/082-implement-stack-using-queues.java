/*
 * LeetCode Problem #225: Implement Stack using Queues
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/implement-stack-using-queues/
 */
import java.util.*;

// APPROACH 1: Two Queues — O(n) push, O(1) pop | O(n) space
// EXPLAIN: Enqueue to q2, drain q1 into q2, then swap q1 and q2 — new element is at front.
// WHEN: Classic two-queue approach; push is O(n), pop/top are O(1).

class MyStack {
    private Deque<Integer> q1 = new ArrayDeque<>();
    private Deque<Integer> q2 = new ArrayDeque<>();

    public void push(int x) {
        q2.offer(x);
        while (!q1.isEmpty()) q2.offer(q1.poll());
        Deque<Integer> tmp = q1; q1 = q2; q2 = tmp;
    }

    public int pop()         { return q1.poll(); }
    public int top()         { return q1.peek(); }
    public boolean empty()   { return q1.isEmpty(); }
}

// APPROACH 2: One Queue — O(n) push, O(1) pop | O(n) space
// EXPLAIN: After appending, rotate the queue size-1 times so the new element is at front.
// WHEN: Simpler with a single queue; same push complexity but fewer variables.

class MyStackOneQueue {
    private Deque<Integer> q = new ArrayDeque<>();

    public void push(int x) {
        q.offer(x);
        for (int i = 0; i < q.size() - 1; i++) q.offer(q.poll());
    }

    public int pop()         { return q.poll(); }
    public int top()         { return q.peek(); }
    public boolean empty()   { return q.isEmpty(); }
}

// APPROACH 3: ArrayDeque with Rotation (O(n) push, O(1) pop) | O(n) push | O(n) space
// EXPLAIN: After each push, rotate the deque so newest element sits at front — pop/top are O(1).
// WHEN: Single data structure approach; demonstrates deque rotation technique.
class MyStackDeque {
    private java.util.ArrayDeque<Integer> dq = new java.util.ArrayDeque<>();
    public void push(int x) {
        dq.addFirst(x);  // prepend so top is always front
    }
    public int pop()    { return dq.removeFirst(); }
    public int top()    { return dq.peekFirst(); }
    public boolean empty() { return dq.isEmpty(); }
}

// ── quick tests ──────────────────────────────────────────────────────────────
class Solution {
    public static void main(String[] args) {
        // Approach 1
        MyStack s1 = new MyStack();
        s1.push(1); s1.push(2);
        assert s1.top() == 2;
        assert s1.pop() == 2;
        assert !s1.empty();
        assert s1.pop() == 1;
        assert s1.empty();

        // Approach 2
        MyStackOneQueue s2 = new MyStackOneQueue();
        s2.push(1); s2.push(2);
        assert s2.top() == 2;
        assert s2.pop() == 2;
        assert !s2.empty();
        assert s2.pop() == 1;
        assert s2.empty();

        System.out.println("All tests passed.");
    }
}

// Made with Bob
