/*
 * LeetCode Problem #155: Min Stack
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/min-stack/
 */
import java.util.*;

// APPROACH 1: Two Stacks | O(1) time all ops | O(n) space
// EXPLAIN: Maintain a parallel min-stack whose top always holds the current minimum.
// WHEN: Most intuitive O(1) solution; go-to answer in interviews.

class MinStack {
    private Deque<Integer> stack    = new ArrayDeque<>();
    private Deque<Integer> minStack = new ArrayDeque<>();

    public void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek()) minStack.push(val);
    }

    public void pop() {
        if (stack.peek().equals(minStack.peek())) minStack.pop();
        stack.pop();
    }

    public int top()    { return stack.peek(); }
    public int getMin() { return minStack.peek(); }
}

// APPROACH 2: Single Stack of (value, currentMin) Pairs | O(1) time all ops | O(n) space
// EXPLAIN: Each node stores both its value and the running minimum up to that point.
// WHEN: Prefer when you want one data structure; slightly more memory per entry but conceptually clean.

class MinStackPairs {
    private Deque<int[]> stack = new ArrayDeque<>();   // [value, minSoFar]

    public void push(int val) {
        int curMin = stack.isEmpty() ? val : Math.min(val, stack.peek()[1]);
        stack.push(new int[]{val, curMin});
    }

    public void pop()    { stack.pop(); }
    public int top()     { return stack.peek()[0]; }
    public int getMin()  { return stack.peek()[1]; }
}

// APPROACH 3: Delta Encoding | O(1) time all ops | O(n) space
// EXPLAIN: Store (val - currentMin) on stack; reconstruct actual value and min from negative deltas.
// WHEN: Space-optimization variant — stores differences rather than absolute values.

class MinStackDelta {
    private Deque<Long> stack = new ArrayDeque<>();
    private long minVal;

    public void push(int val) {
        if (stack.isEmpty()) {
            stack.push(0L);
            minVal = val;
        } else {
            stack.push((long) val - minVal);
            if (val < minVal) minVal = val;
        }
    }

    public void pop() {
        long delta = stack.pop();
        if (delta < 0) minVal = minVal - delta;
    }

    public int top() {
        long delta = stack.peek();
        return delta <= 0 ? (int) minVal : (int)(minVal + delta);
    }

    public int getMin() { return (int) minVal; }
}

// APPROACH 4: Vector-Based (ArrayList) | O(1) amortized time | O(n) space
// EXPLAIN: Use an ArrayList of int[] pairs instead of a deque — better cache locality.
// WHEN: Cache-friendly implementation; avoids deque overhead.

class MinStackVector {
    private List<int[]> data = new ArrayList<>();

    public void push(int val) {
        int curMin = data.isEmpty() ? val : Math.min(val, data.get(data.size()-1)[1]);
        data.add(new int[]{val, curMin});
    }

    public void pop()    { data.remove(data.size() - 1); }
    public int top()     { return data.get(data.size()-1)[0]; }
    public int getMin()  { return data.get(data.size()-1)[1]; }
}

// APPROACH 5: Linked List Node-Based | O(1) time all ops | O(n) space
// EXPLAIN: Each node stores value and running minimum; head always points to top.
// WHEN: Shows manual node management; useful for understanding underlying stack mechanics.

class MinStackLinked {
    private static class Node {
        int val, min; Node next;
        Node(int v, int m, Node n) { val = v; min = m; next = n; }
    }
    private Node head;

    public void push(int val) {
        int curMin = head == null ? val : Math.min(val, head.min);
        head = new Node(val, curMin, head);
    }

    public void pop()    { head = head.next; }
    public int top()     { return head.val; }
    public int getMin()  { return head.min; }
}

// ── quick tests ──────────────────────────────────────────────────────────────
class Solution {
    public static void main(String[] args) {
        // Approach 1
        MinStack ms = new MinStack();
        ms.push(-2); ms.push(0); ms.push(-3);
        assert ms.getMin() == -3;
        ms.pop();
        assert ms.top()    == 0;
        assert ms.getMin() == -2;

        // Approach 2
        MinStackPairs mp = new MinStackPairs();
        mp.push(-2); mp.push(0); mp.push(-3);
        assert mp.getMin() == -3;
        mp.pop();
        assert mp.top()    == 0;
        assert mp.getMin() == -2;

        // Approach 3
        MinStackDelta md = new MinStackDelta();
        md.push(-2); md.push(0); md.push(-3);
        assert md.getMin() == -3;
        md.pop();
        assert md.top()    == 0;
        assert md.getMin() == -2;

        // Approach 4
        MinStackVector mv = new MinStackVector();
        mv.push(-2); mv.push(0); mv.push(-3);
        assert mv.getMin() == -3;
        mv.pop();
        assert mv.top()    == 0;
        assert mv.getMin() == -2;

        // Approach 5
        MinStackLinked ml = new MinStackLinked();
        ml.push(-2); ml.push(0); ml.push(-3);
        assert ml.getMin() == -3;
        ml.pop();
        assert ml.top()    == 0;
        assert ml.getMin() == -2;

        System.out.println("All tests passed.");
    }
}

// Made with Bob
