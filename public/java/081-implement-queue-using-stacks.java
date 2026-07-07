/*
 * LeetCode Problem #232: Implement Queue using Stacks
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/implement-queue-using-stacks/
 */
import java.util.*;

// APPROACH 1: Two Stacks — Lazy Transfer (Amortized O(1)) | O(1) amortized | O(n) space
// EXPLAIN: Push to inbox; transfer to outbox only when outbox is empty (lazy).
// WHEN: Optimal amortised approach — the standard interview answer.

class MyQueue {
    private Deque<Integer> inbox  = new ArrayDeque<>();
    private Deque<Integer> outbox = new ArrayDeque<>();

    public void push(int x) { inbox.push(x); }

    public int pop() { transfer(); return outbox.pop(); }

    public int peek() { transfer(); return outbox.peek(); }

    public boolean empty() { return inbox.isEmpty() && outbox.isEmpty(); }

    private void transfer() {
        if (outbox.isEmpty())
            while (!inbox.isEmpty()) outbox.push(inbox.pop());
    }
}

// APPROACH 2: Two Stacks — Eager Transfer (O(n) push, O(1) pop) | O(n) push | O(n) space
// EXPLAIN: On every push, drain to temp, add new element at bottom, restore — pop/peek are O(1).
// WHEN: Simpler reasoning for pop/peek; acceptable when pushes are infrequent.

class MyQueueEager {
    private Deque<Integer> stack = new ArrayDeque<>();

    public void push(int x) {
        Deque<Integer> temp = new ArrayDeque<>();
        while (!stack.isEmpty()) temp.push(stack.pop());
        stack.push(x);
        while (!temp.isEmpty()) stack.push(temp.pop());
    }

    public int pop()         { return stack.pop(); }
    public int peek()        { return stack.peek(); }
    public boolean empty()   { return stack.isEmpty(); }
}

// APPROACH 3: ArrayDeque direct (O(1) all ops) | O(1) all ops | O(n) space
// EXPLAIN: Wrap Java's ArrayDeque directly — no stack simulation needed; pure queue semantics.
// WHEN: When you want to show the natural queue implementation as a contrast to stack-based.
class MyQueueDeque {
    private java.util.ArrayDeque<Integer> dq = new java.util.ArrayDeque<>();
    public void push(int x)      { dq.addLast(x); }
    public int pop()             { return dq.removeFirst(); }
    public int peek()            { return dq.peekFirst(); }
    public boolean empty()       { return dq.isEmpty(); }
}

// ── quick tests ──────────────────────────────────────────────────────────────
class Solution {
    public static void main(String[] args) {
        // Approach 1
        MyQueue q1 = new MyQueue();
        q1.push(1); q1.push(2);
        assert q1.peek()  == 1;
        assert q1.pop()   == 1;
        assert !q1.empty();
        assert q1.pop()   == 2;
        assert q1.empty();

        // Approach 2
        MyQueueEager q2 = new MyQueueEager();
        q2.push(1); q2.push(2);
        assert q2.peek()  == 1;
        assert q2.pop()   == 1;
        assert !q2.empty();
        assert q2.pop()   == 2;
        assert q2.empty();

        System.out.println("All tests passed.");
    }
}

// Made with Bob
