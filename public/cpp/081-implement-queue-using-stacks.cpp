/*
 * LeetCode Problem #232: Implement Queue using Stacks
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/implement-queue-using-stacks/
 */

#include <stack>
using namespace std;

// ==================== APPROACH 1: Two Stacks — Lazy Transfer ====================
/*
 * Time Complexity: O(1) amortized
 * Space Complexity: O(n)
 * EXPLAIN: Push to inbox; on peek/pop transfer inbox to outbox only when outbox is empty.
 * WHEN: Optimal amortised approach — the standard interview answer.
 */
class MyQueue {
    stack<int> inbox, outbox;

    void transfer() {
        if (outbox.empty()) {
            while (!inbox.empty()) {
                outbox.push(inbox.top());
                inbox.pop();
            }
        }
    }

public:
    MyQueue() {}

    void push(int x) {
        inbox.push(x);
    }

    int pop() {
        transfer();
        int val = outbox.top();
        outbox.pop();
        return val;
    }

    int peek() {
        transfer();
        return outbox.top();
    }

    bool empty() {
        return inbox.empty() && outbox.empty();
    }
};


// ==================== APPROACH 2: Two Stacks — Eager Transfer ====================
/*
 * Time Complexity: O(n) push, O(1) pop
 * Space Complexity: O(n)
 * EXPLAIN: On every push move everything to temp stack, add new element, move back.
 * WHEN: Pop and peek are always O(1) at the cost of expensive push.
 */
class MyQueue_Eager {
    stack<int> st;

public:
    MyQueue_Eager() {}

    void push(int x) {
        stack<int> temp;
        while (!st.empty()) { temp.push(st.top()); st.pop(); }
        st.push(x);
        while (!temp.empty()) { st.push(temp.top()); temp.pop(); }
    }

    int pop() {
        int val = st.top(); st.pop(); return val;
    }

    int peek() { return st.top(); }

    bool empty() { return st.empty(); }
};
