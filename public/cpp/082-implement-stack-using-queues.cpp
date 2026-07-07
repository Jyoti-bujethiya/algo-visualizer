/*
 * LeetCode Problem #225: Implement Stack using Queues
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/implement-stack-using-queues/
 */

#include <queue>
using namespace std;

// ==================== APPROACH 1: One Queue — O(n) push, O(1) pop ====================
/*
 * Time Complexity: O(n) push, O(1) pop/top
 * Space Complexity: O(n)
 * EXPLAIN: After appending, rotate the queue n-1 times so the new element is at front.
 * WHEN: Simpler with a single queue; same push complexity but fewer variables.
 */
class MyStack {
    queue<int> q;

public:
    MyStack() {}

    void push(int x) {
        q.push(x);
        int sz = q.size();
        for (int i = 1; i < sz; i++) {
            q.push(q.front());
            q.pop();
        }
    }

    int pop() {
        int val = q.front(); q.pop(); return val;
    }

    int top() { return q.front(); }

    bool empty() { return q.empty(); }
};


// ==================== APPROACH 2: Two Queues — O(n) push, O(1) pop ====================
/*
 * Time Complexity: O(n) push, O(1) pop/top
 * Space Complexity: O(n)
 * EXPLAIN: Push new element to q2, drain q1 into q2, then swap queues.
 * WHEN: Intuitive two-queue approach.
 */
class MyStack_TwoQueues {
    queue<int> q1, q2;

public:
    MyStack_TwoQueues() {}

    void push(int x) {
        q2.push(x);
        while (!q1.empty()) { q2.push(q1.front()); q1.pop(); }
        swap(q1, q2);
    }

    int pop() {
        int val = q1.front(); q1.pop(); return val;
    }

    int top() { return q1.front(); }

    bool empty() { return q1.empty(); }
};
