/*
 * LeetCode Problem #622: Design Circular Queue
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/design-circular-queue/
 */

#include <vector>
using namespace std;

// ==================== APPROACH 1: Array with Head/Tail Pointers ====================
/*
 * Time Complexity: O(1) all ops
 * Space Complexity: O(k)
 * EXPLAIN: Use a fixed-size array; head/tail pointers wrap around with modulo.
 * WHEN: Classic circular buffer — most efficient and standard implementation.
 */
class MyCircularQueue {
    vector<int> data;
    int head, tail, size, capacity;

public:
    MyCircularQueue(int k) : data(k), head(0), tail(-1), size(0), capacity(k) {}

    bool enQueue(int value) {
        if (isFull()) return false;
        tail = (tail + 1) % capacity;
        data[tail] = value;
        size++;
        return true;
    }

    bool deQueue() {
        if (isEmpty()) return false;
        head = (head + 1) % capacity;
        size--;
        return true;
    }

    int Front() { return isEmpty() ? -1 : data[head]; }
    int Rear()  { return isEmpty() ? -1 : data[tail]; }
    bool isEmpty() { return size == 0; }
    bool isFull()  { return size == capacity; }
};


// ==================== APPROACH 2: Doubly Linked List ====================
/*
 * Time Complexity: O(1) all ops
 * Space Complexity: O(k)
 * EXPLAIN: Use a doubly linked list with dummy head/tail sentinels and a size counter.
 * WHEN: Dynamic allocation; avoids pre-allocating the full array.
 */
class MyCircularQueue_LinkedList {
    struct Node {
        int val;
        Node *prev, *next;
        Node(int v = 0) : val(v), prev(nullptr), next(nullptr) {}
    };

    Node *head, *tail;
    int size, capacity;

public:
    MyCircularQueue_LinkedList(int k) : size(0), capacity(k) {
        head = new Node(); tail = new Node();
        head->next = tail; tail->prev = head;
    }

    bool enQueue(int value) {
        if (isFull()) return false;
        Node* node = new Node(value);
        Node* prev = tail->prev;
        prev->next = node; node->prev = prev;
        node->next = tail; tail->prev = node;
        size++;
        return true;
    }

    bool deQueue() {
        if (isEmpty()) return false;
        Node* front = head->next;
        head->next = front->next;
        front->next->prev = head;
        delete front;
        size--;
        return true;
    }

    int Front() { return isEmpty() ? -1 : head->next->val; }
    int Rear()  { return isEmpty() ? -1 : tail->prev->val; }
    bool isEmpty() { return size == 0; }
    bool isFull()  { return size == capacity; }
};
