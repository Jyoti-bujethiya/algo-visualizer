/*
 * Problem: Min Stack (LeetCode 155)
 * Link: https://leetcode.com/problems/min-stack/
 * Difficulty: Medium
 * Category: Stacks and Queues
 * 
 * Description:
 * Design a stack that supports push, pop, top, and retrieving the minimum element
 * in constant time.
 * 
 * Implement the MinStack class:
 * - MinStack() initializes the stack object.
 * - void push(int val) pushes the element val onto the stack.
 * - void pop() removes the element on the top of the stack.
 * - int top() gets the top element of the stack.
 * - int getMin() retrieves the minimum element in the stack.
 * 
 * You must implement a solution with O(1) time complexity for each function.
 * 
 * Example:
 * Input:
 * ["MinStack","push","push","push","getMin","pop","top","getMin"]
 * [[],[-2],[0],[-3],[],[],[],[]]
 * Output: [null,null,null,null,-3,null,0,-2]
 * 
 * Constraints:
 * - -2^31 <= val <= 2^31 - 1
 * - Methods pop, top and getMin operations will always be called on non-empty stacks.
 * - At most 3 * 10^4 calls will be made to push, pop, top, and getMin.
 */

#include <iostream>
#include <stack>
#include <vector>
using namespace std;

/*
 * APPROACH 1: TWO STACKS (OPTIMAL)
 * 
 * Intuition:
 * - Use one stack for values
 * - Use another stack to track minimums
 * - Min stack top always has current minimum
 * - Push to min stack when new minimum found
 * 
 * Algorithm:
 * push(val):
 * 1. Push val to main stack
 * 2. If min stack empty or val <= min stack top, push to min stack
 * 
 * pop():
 * 1. If main stack top == min stack top, pop from min stack
 * 2. Pop from main stack
 * 
 * getMin():
 * 1. Return min stack top
 * 
 * Time Complexity: O(1) for all operations
 * Space Complexity: O(n) - two stacks
 */
class MinStack1 {
private:
    stack<int> mainStack;
    stack<int> minStack;
    
public:
    MinStack1() {}
    
    void push(int val) {
        mainStack.push(val);
        
        if (minStack.empty() || val <= minStack.top()) {
            minStack.push(val);
        }
    }
    
    void pop() {
        if (mainStack.top() == minStack.top()) {
            minStack.pop();
        }
        mainStack.pop();
    }
    
    int top() {
        return mainStack.top();
    }
    
    int getMin() {
        return minStack.top();
    }
};

/*
 * APPROACH 2: SINGLE STACK WITH PAIRS
 * 
 * Intuition:
 * - Store (value, current_min) pairs
 * - Each element knows the minimum at its level
 * - No need for separate min stack
 * 
 * Algorithm:
 * push(val):
 * 1. If stack empty, push (val, val)
 * 2. Otherwise, push (val, min(val, current_min))
 * 
 * getMin():
 * 1. Return second element of top pair
 * 
 * Time Complexity: O(1)
 * Space Complexity: O(n)
 */
class MinStack2 {
private:
    stack<pair<int, int>> stk; // (value, min_at_this_level)
    
public:
    MinStack2() {}
    
    void push(int val) {
        if (stk.empty()) {
            stk.push({val, val});
        } else {
            stk.push({val, min(val, stk.top().second)});
        }
    }
    
    void pop() {
        stk.pop();
    }
    
    int top() {
        return stk.top().first;
    }
    
    int getMin() {
        return stk.top().second;
    }
};

/*
 * APPROACH 3: SINGLE STACK WITH DIFFERENCE
 * 
 * Intuition:
 * - Store difference from minimum instead of actual value
 * - Track current minimum separately
 * - When difference is negative, it's a new minimum
 * 
 * Algorithm:
 * push(val):
 * 1. If stack empty, push 0 and set min = val
 * 2. Otherwise, push (val - min)
 * 3. If val < min, update min = val
 * 
 * pop():
 * 1. If top < 0, restore previous min
 * 2. Pop from stack
 * 
 * Time Complexity: O(1)
 * Space Complexity: O(n)
 */
class MinStack3 {
private:
    stack<long long> stk;
    long long minVal;
    
public:
    MinStack3() {}
    
    void push(int val) {
        if (stk.empty()) {
            stk.push(0);
            minVal = val;
        } else {
            stk.push((long long)val - minVal);
            if (val < minVal) {
                minVal = val;
            }
        }
    }
    
    void pop() {
        if (stk.top() < 0) {
            minVal = minVal - stk.top();
        }
        stk.pop();
    }
    
    int top() {
        if (stk.top() < 0) {
            return minVal;
        }
        return minVal + stk.top();
    }
    
    int getMin() {
        return minVal;
    }
};

/*
 * APPROACH 4: VECTOR-BASED IMPLEMENTATION
 * 
 * Intuition:
 * - Use vectors instead of stacks
 * - Store (value, min) pairs
 * - More cache-friendly than stack
 * 
 * Algorithm:
 * Same as Approach 2 but with vectors
 * 
 * Time Complexity: O(1)
 * Space Complexity: O(n)
 */
class MinStack4 {
private:
    vector<pair<int, int>> data;
    
public:
    MinStack4() {}
    
    void push(int val) {
        if (data.empty()) {
            data.push_back({val, val});
        } else {
            data.push_back({val, min(val, data.back().second)});
        }
    }
    
    void pop() {
        data.pop_back();
    }
    
    int top() {
        return data.back().first;
    }
    
    int getMin() {
        return data.back().second;
    }
};

/*
 * APPROACH 5: LINKED LIST IMPLEMENTATION
 * 
 * Intuition:
 * - Use linked list nodes
 * - Each node stores value and min
 * - Head always points to top
 * 
 * Algorithm:
 * push(val):
 * 1. Create new node with val and current min
 * 2. Link to current head
 * 3. Update head
 * 
 * Time Complexity: O(1)
 * Space Complexity: O(n)
 */
class MinStack5 {
private:
    struct Node {
        int val;
        int min;
        Node* next;
        Node(int v, int m, Node* n = nullptr) : val(v), min(m), next(n) {}
    };
    
    Node* head;
    
public:
    MinStack5() : head(nullptr) {}
    
    void push(int val) {
        if (!head) {
            head = new Node(val, val);
        } else {
            head = new Node(val, min(val, head->min), head);
        }
    }
    
    void pop() {
        Node* temp = head;
        head = head->next;
        delete temp;
    }
    
    int top() {
        return head->val;
    }
    
    int getMin() {
        return head->min;
    }
    
    ~MinStack5() {
        while (head) {
            pop();
        }
    }
};

// Test function
void testMinStack(int approach) {
    cout << "Testing Approach " << approach << ":\n";
    
    if (approach == 1) {
        MinStack1 stack;
        stack.push(-2);
        stack.push(0);
        stack.push(-3);
        cout << "getMin() = " << stack.getMin() << " (expected: -3)\n";
        stack.pop();
        cout << "top() = " << stack.top() << " (expected: 0)\n";
        cout << "getMin() = " << stack.getMin() << " (expected: -2)\n";
    } else if (approach == 2) {
        MinStack2 stack;
        stack.push(-2);
        stack.push(0);
        stack.push(-3);
        cout << "getMin() = " << stack.getMin() << " (expected: -3)\n";
        stack.pop();
        cout << "top() = " << stack.top() << " (expected: 0)\n";
        cout << "getMin() = " << stack.getMin() << " (expected: -2)\n";
    } else if (approach == 3) {
        MinStack3 stack;
        stack.push(-2);
        stack.push(0);
        stack.push(-3);
        cout << "getMin() = " << stack.getMin() << " (expected: -3)\n";
        stack.pop();
        cout << "top() = " << stack.top() << " (expected: 0)\n";
        cout << "getMin() = " << stack.getMin() << " (expected: -2)\n";
    } else if (approach == 4) {
        MinStack4 stack;
        stack.push(-2);
        stack.push(0);
        stack.push(-3);
        cout << "getMin() = " << stack.getMin() << " (expected: -3)\n";
        stack.pop();
        cout << "top() = " << stack.top() << " (expected: 0)\n";
        cout << "getMin() = " << stack.getMin() << " (expected: -2)\n";
    } else if (approach == 5) {
        MinStack5 stack;
        stack.push(-2);
        stack.push(0);
        stack.push(-3);
        cout << "getMin() = " << stack.getMin() << " (expected: -3)\n";
        stack.pop();
        cout << "top() = " << stack.top() << " (expected: 0)\n";
        cout << "getMin() = " << stack.getMin() << " (expected: -2)\n";
    }
    
    cout << "\n";
}

int main() {
    for (int i = 1; i <= 5; i++) {
        testMinStack(i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (Two Stacks - OPTIMAL):
 * - Time: O(1) for all operations
 * - Space: O(n) - two stacks
 * - Best for: Standard solution, easy to understand
 * 
 * Approach 2 (Pairs):
 * - Time: O(1)
 * - Space: O(n)
 * - Best for: Single stack preference
 * 
 * Approach 3 (Difference):
 * - Time: O(1)
 * - Space: O(n)
 * - Best for: Space optimization (stores differences)
 * 
 * Approach 4 (Vector):
 * - Time: O(1)
 * - Space: O(n)
 * - Best for: Cache-friendly implementation
 * 
 * Approach 5 (Linked List):
 * - Time: O(1)
 * - Space: O(n)
 * - Best for: Custom implementation
 * 
 * INTERVIEW TIPS:
 * 1. Start with Approach 1 (two stacks)
 * 2. Explain why we need min stack
 * 3. Draw example showing both stacks
 * 4. Mention Approach 2 as alternative
 * 5. Discuss trade-offs
 * 
 * COMMON MISTAKES:
 * 1. Not handling duplicates in min stack
 * 2. Popping from min stack incorrectly
 * 3. Not using <= for min comparison
 * 4. Forgetting to update min on pop
 * 5. Integer overflow in Approach 3
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. Can you do it with one stack? (Yes, Approach 2)
 * 2. How to handle duplicates? (Use <= in comparison)
 * 3. What about max stack? (Same approach)
 * 4. Can you optimize space? (Approach 3)
 * 5. Thread-safe version? (Add locks)
 * 
 * RELATED PROBLEMS:
 * - Max Stack
 * - Min Stack with O(1) space
 * - Design Stack with Increment Operation
 * - Implement Queue using Stacks
 * - Design Circular Queue
 * 
 * KEY INSIGHTS:
 * 1. Need to track minimum at each level
 * 2. Two stacks is most intuitive
 * 3. Can store min with each element
 * 4. All operations must be O(1)
 * 5. Handle duplicates carefully
 * 
 * WHY TWO STACKS WORK:
 * - Main stack stores all values
 * - Min stack stores minimums
 * - Min stack top = current minimum
 * - Push to min stack when new min found
 * - Pop from min stack when min removed
 * - Always synchronized
 * 
 * DUPLICATE HANDLING:
 * - Use <= not < when comparing
 * - Push duplicate mins to min stack
 * - Ensures correct min after pop
 * - Example: push(1), push(1), pop()
 * - Without <=, min would be lost
 * 
 * SPACE OPTIMIZATION:
 * - Approach 3 stores differences
 * - Saves space when many duplicates
 * - More complex implementation
 * - Risk of overflow with large values
 * - Trade-off: complexity vs space
 */

// Made with Bob
