/*
 * Problem: Reorder List (LeetCode 143)
 * Difficulty: Medium
 * Category: Linked Lists
 * 
 * Description:
 * You are given the head of a singly linked-list. The list can be represented as:
 * L0 → L1 → … → Ln - 1 → Ln
 * 
 * Reorder the list to be on the following form:
 * L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …
 * 
 * You may not modify the values in the list's nodes. Only nodes themselves may be changed.
 * 
 * Example 1:
 * Input: head = [1,2,3,4]
 * Output: [1,4,2,3]
 * 
 * Example 2:
 * Input: head = [1,2,3,4,5]
 * Output: [1,5,2,4,3]
 * 
 * Constraints:
 * - The number of nodes in the list is in the range [1, 5 * 10^4]
 * - 1 <= Node.val <= 1000
 */

#include <iostream>
#include <vector>
#include <stack>
using namespace std;

// Definition for singly-linked list
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

/*
 * APPROACH 1: FIND MIDDLE + REVERSE + MERGE
 * 
 * Intuition:
 * - Split list into two halves at middle
 * - Reverse the second half
 * - Merge the two halves alternately
 * - This is the optimal O(n) time, O(1) space solution
 * 
 * Algorithm:
 * 1. Find middle using slow/fast pointers
 * 2. Reverse second half starting from middle
 * 3. Merge first half and reversed second half alternately
 * 4. Handle odd/even length lists correctly
 * 
 * Time Complexity: O(n) - three passes (find middle, reverse, merge)
 * Space Complexity: O(1) - only pointers
 */
class Solution1 {
private:
    ListNode* findMiddle(ListNode* head) {
        ListNode* slow = head;
        ListNode* fast = head;
        
        while (fast->next && fast->next->next) {
            slow = slow->next;
            fast = fast->next->next;
        }
        
        return slow;
    }
    
    ListNode* reverse(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* current = head;
        
        while (current) {
            ListNode* next = current->next;
            current->next = prev;
            prev = current;
            current = next;
        }
        
        return prev;
    }
    
    void merge(ListNode* l1, ListNode* l2) {
        while (l2) {
            ListNode* next1 = l1->next;
            ListNode* next2 = l2->next;
            
            l1->next = l2;
            l2->next = next1;
            
            l1 = next1;
            l2 = next2;
        }
    }
    
public:
    void reorderList(ListNode* head) {
        if (!head || !head->next) return;
        
        // Step 1: Find middle
        ListNode* mid = findMiddle(head);
        
        // Step 2: Reverse second half
        ListNode* secondHalf = reverse(mid->next);
        mid->next = nullptr; // Split the list
        
        // Step 3: Merge two halves
        merge(head, secondHalf);
    }
};

/*
 * APPROACH 2: USING VECTOR/ARRAY
 * 
 * Intuition:
 * - Store all nodes in a vector for random access
 * - Use two pointers from start and end
 * - Relink nodes alternately
 * - Simple but uses O(n) space
 * 
 * Algorithm:
 * 1. Store all nodes in vector
 * 2. Use left and right pointers
 * 3. Alternate between left and right, relinking nodes
 * 4. Set last node's next to nullptr
 * 
 * Time Complexity: O(n) - two passes
 * Space Complexity: O(n) - vector storage
 */
class Solution2 {
public:
    void reorderList(ListNode* head) {
        if (!head || !head->next) return;
        
        // Store nodes in vector
        vector<ListNode*> nodes;
        ListNode* current = head;
        while (current) {
            nodes.push_back(current);
            current = current->next;
        }
        
        // Reorder using two pointers
        int left = 0, right = nodes.size() - 1;
        
        while (left < right) {
            nodes[left]->next = nodes[right];
            left++;
            
            if (left >= right) break;
            
            nodes[right]->next = nodes[left];
            right--;
        }
        
        nodes[left]->next = nullptr;
    }
};

/*
 * APPROACH 3: USING STACK
 * 
 * Intuition:
 * - Push all nodes to stack (LIFO gives reverse order)
 * - Pop from stack and insert after each node from start
 * - Stop when we've processed half the nodes
 * 
 * Algorithm:
 * 1. Push all nodes to stack
 * 2. Traverse from head, pop from stack
 * 3. Insert popped node after current
 * 4. Stop at middle
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n) - stack storage
 */
class Solution3 {
public:
    void reorderList(ListNode* head) {
        if (!head || !head->next) return;
        
        // Count nodes and push to stack
        stack<ListNode*> stk;
        ListNode* current = head;
        int count = 0;
        
        while (current) {
            stk.push(current);
            current = current->next;
            count++;
        }
        
        // Reorder
        current = head;
        int steps = count / 2;
        
        for (int i = 0; i < steps; i++) {
            ListNode* next = current->next;
            ListNode* last = stk.top();
            stk.pop();
            
            current->next = last;
            last->next = next;
            current = next;
        }
        
        current->next = nullptr;
    }
};

/*
 * APPROACH 4: RECURSIVE
 * 
 * Intuition:
 * - Use recursion to reach the end
 * - On return, relink nodes from outside in
 * - Track current position to know when to stop
 * 
 * Algorithm:
 * 1. Recursively reach end of list
 * 2. On return, relink current with end node
 * 3. Use reference to track current position
 * 4. Stop when positions meet
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n) - recursion stack
 */
class Solution4 {
private:
    ListNode* helper(ListNode* head, ListNode*& current) {
        if (!head) return nullptr;
        
        ListNode* tail = helper(head->next, current);
        
        if (!current) return nullptr;
        
        if (current == head || current->next == head) {
            head->next = nullptr;
            current = nullptr;
            return nullptr;
        }
        
        ListNode* next = current->next;
        current->next = head;
        head->next = next;
        current = next;
        
        return head;
    }
    
public:
    void reorderList(ListNode* head) {
        if (!head || !head->next) return;
        
        ListNode* current = head;
        helper(head->next, current);
    }
};

/*
 * APPROACH 5: ITERATIVE WITH LENGTH CALCULATION
 * 
 * Intuition:
 * - Calculate list length first
 * - Split at exact middle
 * - Reverse second half
 * - Merge alternately
 * 
 * Algorithm:
 * 1. Calculate length
 * 2. Find middle using length
 * 3. Reverse second half
 * 4. Merge two halves
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class Solution5 {
private:
    int getLength(ListNode* head) {
        int length = 0;
        while (head) {
            length++;
            head = head->next;
        }
        return length;
    }
    
    ListNode* reverse(ListNode* head) {
        ListNode* prev = nullptr;
        while (head) {
            ListNode* next = head->next;
            head->next = prev;
            prev = head;
            head = next;
        }
        return prev;
    }
    
public:
    void reorderList(ListNode* head) {
        if (!head || !head->next) return;
        
        // Get length
        int length = getLength(head);
        int mid = length / 2;
        
        // Find middle
        ListNode* current = head;
        for (int i = 0; i < mid; i++) {
            current = current->next;
        }
        
        // Reverse second half
        ListNode* secondHalf = reverse(current->next);
        current->next = nullptr;
        
        // Merge
        ListNode* first = head;
        ListNode* second = secondHalf;
        
        while (second) {
            ListNode* next1 = first->next;
            ListNode* next2 = second->next;
            
            first->next = second;
            second->next = next1;
            
            first = next1;
            second = next2;
        }
    }
};

// Helper function to create linked list
ListNode* createList(const vector<int>& values) {
    if (values.empty()) return nullptr;
    
    ListNode* head = new ListNode(values[0]);
    ListNode* current = head;
    
    for (int i = 1; i < values.size(); i++) {
        current->next = new ListNode(values[i]);
        current = current->next;
    }
    
    return head;
}

// Helper function to print list
void printList(ListNode* head) {
    cout << "[";
    while (head) {
        cout << head->val;
        if (head->next) cout << ",";
        head = head->next;
    }
    cout << "]\n";
}

// Helper function to delete list
void deleteList(ListNode* head) {
    while (head) {
        ListNode* temp = head;
        head = head->next;
        delete temp;
    }
}

// Test function
void test(vector<int> values, int approach) {
    ListNode* head = createList(values);
    
    cout << "Input: ";
    printList(head);
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            sol.reorderList(head);
            cout << "Approach 1 (Middle+Reverse+Merge): ";
            break;
        }
        case 2: {
            Solution2 sol;
            sol.reorderList(head);
            cout << "Approach 2 (Vector): ";
            break;
        }
        case 3: {
            Solution3 sol;
            sol.reorderList(head);
            cout << "Approach 3 (Stack): ";
            break;
        }
        case 4: {
            Solution4 sol;
            sol.reorderList(head);
            cout << "Approach 4 (Recursive): ";
            break;
        }
        case 5: {
            Solution5 sol;
            sol.reorderList(head);
            cout << "Approach 5 (Length Calculation): ";
            break;
        }
    }
    
    printList(head);
    deleteList(head);
    cout << "\n";
}

int main() {
    // Test Case 1: Even length
    cout << "Test Case 1: Even length\n";
    vector<int> test1 = {1, 2, 3, 4};
    for (int i = 1; i <= 5; i++) {
        test(test1, i);
    }
    
    // Test Case 2: Odd length
    cout << "Test Case 2: Odd length\n";
    vector<int> test2 = {1, 2, 3, 4, 5};
    for (int i = 1; i <= 5; i++) {
        test(test2, i);
    }
    
    // Test Case 3: Two nodes
    cout << "Test Case 3: Two nodes\n";
    vector<int> test3 = {1, 2};
    for (int i = 1; i <= 5; i++) {
        test(test3, i);
    }
    
    // Test Case 4: Single node
    cout << "Test Case 4: Single node\n";
    vector<int> test4 = {1};
    for (int i = 1; i <= 5; i++) {
        test(test4, i);
    }
    
    // Test Case 5: Longer list
    cout << "Test Case 5: Longer list\n";
    vector<int> test5 = {1, 2, 3, 4, 5, 6, 7, 8};
    for (int i = 1; i <= 5; i++) {
        test(test5, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (Middle+Reverse+Merge):
 * - Time: O(n) - three passes
 * - Space: O(1) - only pointers
 * - Best for: Optimal solution, most efficient
 * 
 * Approach 2 (Vector):
 * - Time: O(n) - two passes
 * - Space: O(n) - vector storage
 * - Best for: Simple implementation, random access
 * 
 * Approach 3 (Stack):
 * - Time: O(n)
 * - Space: O(n) - stack storage
 * - Best for: Alternative approach with LIFO
 * 
 * Approach 4 (Recursive):
 * - Time: O(n)
 * - Space: O(n) - recursion stack
 * - Best for: Recursive thinking (less practical)
 * 
 * Approach 5 (Length Calculation):
 * - Time: O(n)
 * - Space: O(1)
 * - Best for: Explicit length tracking
 * 
 * INTERVIEW TIPS:
 * 1. Start with Approach 1 - optimal solution
 * 2. Break problem into three clear steps
 * 3. Explain each step: find middle, reverse, merge
 * 4. Handle odd/even length lists correctly
 * 5. Mention vector approach as simpler alternative
 * 
 * COMMON MISTAKES:
 * 1. Not splitting list at middle (causes infinite loop)
 * 2. Incorrect middle finding for odd/even lengths
 * 3. Not setting last node's next to nullptr
 * 4. Losing track of next pointers during merge
 * 5. Not handling single node or two node cases
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. Can you do it in-place? (Yes, Approach 1)
 * 2. What if list is very long? (Approach 1 is still optimal)
 * 3. Can you do it recursively? (Yes, but uses O(n) space)
 * 4. How to handle doubly linked list? (Similar approach)
 * 5. What if we want different reordering pattern? (Modify merge logic)
 * 
 * RELATED PROBLEMS:
 * - Reverse Linked List
 * - Palindrome Linked List
 * - Merge Two Sorted Lists
 * - Odd Even Linked List
 * - Swap Nodes in Pairs
 * 
 * KEY INSIGHTS:
 * 1. Problem combines three classic operations: find middle, reverse, merge
 * 2. Slow/fast pointers efficiently find middle
 * 3. In-place reversal is crucial for O(1) space
 * 4. Merge alternates between two lists
 * 5. Must handle odd/even lengths correctly
 */

// Made with Bob
