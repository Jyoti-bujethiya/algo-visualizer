/*
 * LeetCode Problem #19: Remove Nth Node From End of List
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/remove-nth-node-from-end-of-list/
 * 
 * Problem Statement:
 * Given the head of a linked list, remove the nth node from the end of the list
 * and return its head.
 * 
 * Example:
 * Input: head = [1,2,3,4,5], n = 2
 * Output: [1,2,3,5]
 * Explanation: Remove the 2nd node from the end (node with value 4).
 * 
 * Follow up: Could you do this in one pass?
 */

#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    // ==================== APPROACH 1: Two Pointer (One Pass) ====================
    /*
     * Algorithm:
     * - Use two pointers with n gap between them
     * - Move both pointers until fast reaches end
     * - Slow pointer will be at node before target
     * - Remove target node
     * 
     * Time Complexity: O(L) where L = length of list
     * Space Complexity: O(1)
     * 
     * When to use: This is the OPTIMAL solution
     * 
     * Key Insight:
     * - Maintain n+1 gap to position slow before target
     * - Dummy node handles edge case of removing head
     * - Single pass through the list
     */
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode* dummy = new ListNode(0);
        dummy->next = head;
        
        ListNode* fast = dummy;
        ListNode* slow = dummy;
        
        // Move fast n+1 steps ahead
        for (int i = 0; i <= n; i++) {
            fast = fast->next;
        }
        
        // Move both pointers until fast reaches end
        while (fast != nullptr) {
            fast = fast->next;
            slow = slow->next;
        }
        
        // Remove the nth node from end
        ListNode* toDelete = slow->next;
        slow->next = slow->next->next;
        delete toDelete;
        
        ListNode* result = dummy->next;
        delete dummy;
        return result;
    }
    
    // ==================== APPROACH 2: Two Pass (Calculate Length) ====================
    /*
     * Algorithm:
     * - First pass: calculate list length
     * - Second pass: go to (length - n)th node
     * - Remove the target node
     * 
     * Time Complexity: O(L)
     * Space Complexity: O(1)
     * 
     * When to use: When two passes are acceptable
     * 
     * Key Insight:
     * - Nth from end = (length - n + 1)th from start
     * - More straightforward but requires two passes
     */
    ListNode* removeNthFromEnd_TwoPass(ListNode* head, int n) {
        // Calculate length
        int length = 0;
        ListNode* current = head;
        while (current != nullptr) {
            length++;
            current = current->next;
        }
        
        // Handle edge case: remove head
        if (length == n) {
            ListNode* newHead = head->next;
            delete head;
            return newHead;
        }
        
        // Find node before target
        current = head;
        for (int i = 0; i < length - n - 1; i++) {
            current = current->next;
        }
        
        // Remove target node
        ListNode* toDelete = current->next;
        current->next = current->next->next;
        delete toDelete;
        
        return head;
    }
    
    // ==================== APPROACH 3: Recursion ====================
    /*
     * Algorithm:
     * - Recursively traverse to end
     * - Count nodes on return path
     * - Remove node when count equals n
     * 
     * Time Complexity: O(L)
     * Space Complexity: O(L) for recursion stack
     * 
     * When to use: When recursive solution preferred
     * 
     * Key Insight:
     * - Count from end during backtracking
     * - Return modified list from recursion
     */
    ListNode* removeNthFromEnd_Recursive(ListNode* head, int n) {
        int count = 0;
        return removeHelper(head, n, count);
    }
    
private:
    ListNode* removeHelper(ListNode* node, int n, int& count) {
        if (node == nullptr) {
            return nullptr;
        }
        
        node->next = removeHelper(node->next, n, count);
        count++;
        
        // If this is the nth node from end, skip it
        if (count == n) {
            ListNode* toDelete = node;
            node = node->next;
            delete toDelete;
        }
        
        return node;
    }
    
public:
    // ==================== APPROACH 4: Stack ====================
    /*
     * Algorithm:
     * - Push all nodes onto stack
     * - Pop n nodes to reach target
     * - Remove target node
     * 
     * Time Complexity: O(L)
     * Space Complexity: O(L) for stack
     * 
     * When to use: When stack-based solution is natural
     * 
     * Key Insight:
     * - Stack reverses order (LIFO)
     * - Easy to access nth from end
     * - Uses extra space
     */
    ListNode* removeNthFromEnd_Stack(ListNode* head, int n) {
        stack<ListNode*> stk;
        ListNode* dummy = new ListNode(0);
        dummy->next = head;
        
        // Push all nodes including dummy
        ListNode* current = dummy;
        while (current != nullptr) {
            stk.push(current);
            current = current->next;
        }
        
        // Pop n nodes to reach node before target
        for (int i = 0; i < n; i++) {
            stk.pop();
        }
        
        // Remove target node
        ListNode* prev = stk.top();
        ListNode* toDelete = prev->next;
        prev->next = prev->next->next;
        delete toDelete;
        
        ListNode* result = dummy->next;
        delete dummy;
        return result;
    }
};

// ==================== HELPER FUNCTIONS ====================
ListNode* createList(vector<int>& values) {
    if (values.empty()) return nullptr;
    
    ListNode* head = new ListNode(values[0]);
    ListNode* current = head;
    
    for (int i = 1; i < values.size(); i++) {
        current->next = new ListNode(values[i]);
        current = current->next;
    }
    
    return head;
}

void printList(ListNode* head) {
    cout << "[";
    while (head != nullptr) {
        cout << head->val;
        if (head->next != nullptr) cout << ",";
        head = head->next;
    }
    cout << "]";
}

void deleteList(ListNode* head) {
    while (head != nullptr) {
        ListNode* temp = head;
        head = head->next;
        delete temp;
    }
}

// ==================== TEST CASES ====================
void runTests() {
    Solution sol;
    
    // Test Case 1: Remove from middle
    // Input: head = [1,2,3,4,5], n = 2
    // Expected: [1,2,3,5]
    cout << "Test Case 1: Remove from middle\n";
    vector<int> vals1 = {1, 2, 3, 4, 5};
    ListNode* head1 = createList(vals1);
    ListNode* result1 = sol.removeNthFromEnd(head1, 2);
    cout << "Output: ";
    printList(result1);
    cout << "\nExpected: [1,2,3,5]\n\n";
    deleteList(result1);
    
    // Test Case 2: Remove head (only one node)
    // Input: head = [1], n = 1
    // Expected: []
    cout << "Test Case 2: Remove only node\n";
    vector<int> vals2 = {1};
    ListNode* head2 = createList(vals2);
    ListNode* result2 = sol.removeNthFromEnd_TwoPass(head2, 1);
    cout << "Output: ";
    printList(result2);
    cout << "\nExpected: []\n\n";
    
    // Test Case 3: Remove head (multiple nodes)
    // Input: head = [1,2], n = 2
    // Expected: [2]
    cout << "Test Case 3: Remove head\n";
    vector<int> vals3 = {1, 2};
    ListNode* head3 = createList(vals3);
    ListNode* result3 = sol.removeNthFromEnd_Recursive(head3, 2);
    cout << "Output: ";
    printList(result3);
    cout << "\nExpected: [2]\n\n";
    deleteList(result3);
    
    // Test Case 4: Remove last node
    // Input: head = [1,2,3], n = 1
    // Expected: [1,2]
    cout << "Test Case 4: Remove last node\n";
    vector<int> vals4 = {1, 2, 3};
    ListNode* head4 = createList(vals4);
    ListNode* result4 = sol.removeNthFromEnd_Stack(head4, 1);
    cout << "Output: ";
    printList(result4);
    cout << "\nExpected: [1,2]\n\n";
    deleteList(result4);
    
    // Test Case 5: Two nodes, remove first
    // Input: head = [1,2], n = 1
    // Expected: [1]
    cout << "Test Case 5: Two nodes, remove last\n";
    vector<int> vals5 = {1, 2};
    ListNode* head5 = createList(vals5);
    ListNode* result5 = sol.removeNthFromEnd(head5, 1);
    cout << "Output: ";
    printList(result5);
    cout << "\nExpected: [1]\n\n";
    deleteList(result5);
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. Two Pointer One Pass (RECOMMENDED):
 *    Time: O(L), Space: O(1)
 *    Pros: Optimal, single pass, constant space
 *    Cons: Requires careful pointer management
 *    Best for: Most interview scenarios
 * 
 * 2. Two Pass with Length:
 *    Time: O(L), Space: O(1)
 *    Pros: Straightforward, easy to understand
 *    Cons: Requires two passes
 *    Best for: When clarity is priority
 * 
 * 3. Recursion:
 *    Time: O(L), Space: O(L)
 *    Pros: Elegant, counts from end naturally
 *    Cons: Extra space for recursion stack
 *    Best for: When recursion preferred
 * 
 * 4. Stack:
 *    Time: O(L), Space: O(L)
 *    Pros: Easy to access from end
 *    Cons: Extra space for stack
 *    Best for: Stack-based thinking
 * 
 * INTERVIEW TIPS:
 * - Clarify if n is always valid (1 ≤ n ≤ length)
 * - Mention the one-pass requirement
 * - Explain the two-pointer technique with gap
 * - Discuss why dummy node is useful
 * - Walk through example showing pointer movement
 * - Handle edge case: removing head
 * - Consider edge case: single node list
 * - Mention memory cleanup (delete nodes)
 * - Discuss trade-offs between approaches
 * - Consider follow-up: what if n could be invalid?
 * 
 * KEY INSIGHTS:
 * - Two pointers with n+1 gap positions slow before target
 * - Dummy node simplifies head removal case
 * - Nth from end = (length - n + 1)th from start
 * - One pass is possible with two pointers
 * - Fast pointer reaches null when slow is at target
 * 
 * STEP-BY-STEP WALKTHROUGH:
 * List: 1->2->3->4->5, n = 2 (remove 4)
 * 
 * Initial: dummy->1->2->3->4->5
 * fast = dummy, slow = dummy
 * 
 * Move fast n+1=3 steps:
 *   fast at 3, slow at dummy
 * 
 * Move both until fast is null:
 *   fast at 4, slow at 1
 *   fast at 5, slow at 2
 *   fast at null, slow at 3
 * 
 * slow->next is target (4)
 * Remove: slow->next = slow->next->next
 * Result: 1->2->3->5
 * 
 * COMMON MISTAKES:
 * - Not using dummy node (complicates head removal)
 * - Moving fast only n steps (should be n+1)
 * - Not handling single node case
 * - Not checking if n is valid
 * - Memory leaks from not deleting nodes
 * - Off-by-one errors in pointer positioning
 * - Not considering removing head
 * - Incorrect gap between pointers
 * - Forgetting to delete dummy node
 * - Not handling null input
 * 
 * FOLLOW-UP QUESTIONS:
 * - What if n could be larger than list length?
 * - How would you remove multiple nodes?
 * - Can you do it without dummy node?
 * - How would you remove nth from start?
 * - What if list is doubly linked?
 * 
 * RELATED PROBLEMS:
 * - LeetCode #237: Delete Node in a Linked List
 * - LeetCode #203: Remove Linked List Elements
 * - LeetCode #83: Remove Duplicates from Sorted List
 * - LeetCode #82: Remove Duplicates from Sorted List II
 * - LeetCode #2095: Delete the Middle Node of a Linked List
 */

// Made with Bob
