/*
 * LeetCode Problem #206: Reverse Linked List
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/reverse-linked-list/
 * 
 * Problem Statement:
 * Given the head of a singly linked list, reverse the list, and return the reversed list.
 */

#include <iostream>
using namespace std;

// Definition for singly-linked list
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    // ==================== APPROACH 1: Iterative (Optimal) ====================
    /*
     * Algorithm:
     * - Use three pointers: prev, current, next
     * - Iterate through list, reversing links
     * - prev starts as nullptr, current as head
     * - For each node: save next, reverse link, move pointers forward
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     * 
     * When to use: This is the OPTIMAL solution
     * 
     * Key Insight:
     * - Reverse one link at a time
     * - Need to save next before reversing
     * - prev becomes new head at the end
     */
    ListNode* reverseList_Iterative(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* current = head;
        
        while (current != nullptr) {
            ListNode* next = current->next;  // Save next
            current->next = prev;             // Reverse link
            prev = current;                   // Move prev forward
            current = next;                   // Move current forward
        }
        
        return prev;  // prev is new head
    }
    
    // ==================== APPROACH 2: Recursive ====================
    /*
     * Algorithm:
     * - Recursively reverse rest of list
     * - Fix current node's link
     * - Return new head
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n) - recursion stack
     * 
     * When to use: When recursion is preferred or required
     * 
     * Key Insight:
     * - Base case: empty or single node
     * - Recursive case: reverse rest, then fix current
     * - head->next->next = head reverses the link
     */
    ListNode* reverseList_Recursive(ListNode* head) {
        // Base case: empty or single node
        if (head == nullptr || head->next == nullptr) {
            return head;
        }
        
        // Reverse rest of list
        ListNode* newHead = reverseList_Recursive(head->next);
        
        // Fix current node's link
        head->next->next = head;  // Reverse link
        head->next = nullptr;      // Break old link
        
        return newHead;
    }
    
    // ==================== APPROACH 3: Recursive (Tail Recursion) ====================
    /*
     * Tail recursive version with helper function
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     */
    ListNode* reverseListHelper(ListNode* head, ListNode* prev) {
        if (head == nullptr) {
            return prev;
        }
        
        ListNode* next = head->next;
        head->next = prev;
        return reverseListHelper(next, head);
    }
    
    ListNode* reverseList_TailRecursive(ListNode* head) {
        return reverseListHelper(head, nullptr);
    }
    
    // Main function (uses iterative by default)
    ListNode* reverseList(ListNode* head) {
        return reverseList_Iterative(head);
    }
};

// ==================== HELPER FUNCTIONS ====================
ListNode* createList(vector<int>& vals) {
    if (vals.empty()) return nullptr;
    ListNode* head = new ListNode(vals[0]);
    ListNode* current = head;
    for (int i = 1; i < vals.size(); i++) {
        current->next = new ListNode(vals[i]);
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
    cout << "]" << endl;
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
    
    // Test Case 1: Standard list
    vector<int> vals1 = {1, 2, 3, 4, 5};
    ListNode* head1 = createList(vals1);
    cout << "Test 1 Original: ";
    printList(head1);
    head1 = sol.reverseList(head1);
    cout << "Test 1 Reversed: ";
    printList(head1);
    deleteList(head1);
    // Expected: [5,4,3,2,1]
    
    // Test Case 2: Two nodes
    vector<int> vals2 = {1, 2};
    ListNode* head2 = createList(vals2);
    cout << "Test 2 Original: ";
    printList(head2);
    head2 = sol.reverseList(head2);
    cout << "Test 2 Reversed: ";
    printList(head2);
    deleteList(head2);
    // Expected: [2,1]
    
    // Test Case 3: Single node
    vector<int> vals3 = {1};
    ListNode* head3 = createList(vals3);
    cout << "Test 3 Original: ";
    printList(head3);
    head3 = sol.reverseList(head3);
    cout << "Test 3 Reversed: ";
    printList(head3);
    deleteList(head3);
    // Expected: [1]
    
    // Test Case 4: Empty list
    ListNode* head4 = nullptr;
    cout << "Test 4 Original: ";
    printList(head4);
    head4 = sol.reverseList(head4);
    cout << "Test 4 Reversed: ";
    printList(head4);
    // Expected: []
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. Iterative (RECOMMENDED):
 *    Time: O(n), Space: O(1)
 *    Most efficient, easy to understand
 * 
 * 2. Recursive:
 *    Time: O(n), Space: O(n)
 *    Elegant but uses stack space
 * 
 * 3. Tail Recursive:
 *    Time: O(n), Space: O(n)
 *    Similar to iterative in logic
 * 
 * INTERVIEW TIPS:
 * - Start with iterative approach
 * - Explain three-pointer technique
 * - Draw diagram showing pointer movements
 * - Mention recursive solution as alternative
 * - Discuss space complexity trade-off
 * 
 * KEY INSIGHTS:
 * - Need three pointers: prev, current, next
 * - Must save next before reversing link
 * - prev becomes new head
 * - Recursive: reverse rest first, then fix current
 * 
 * STEP-BY-STEP for [1->2->3->4->5]:
 * 
 * Initial: prev=null, curr=1
 * Step 1: null<-1  2->3->4->5 (prev=1, curr=2)
 * Step 2: null<-1<-2  3->4->5 (prev=2, curr=3)
 * Step 3: null<-1<-2<-3  4->5 (prev=3, curr=4)
 * Step 4: null<-1<-2<-3<-4  5 (prev=4, curr=5)
 * Step 5: null<-1<-2<-3<-4<-5 (prev=5, curr=null)
 * Return prev (5)
 * 
 * COMMON MISTAKES:
 * - Losing reference to next node
 * - Not handling empty list
 * - Not handling single node
 * - Forgetting to set head->next = nullptr in recursive
 * 
 * FOLLOW-UP QUESTIONS:
 * - Reverse in groups of k? (Reverse Nodes in k-Group - LeetCode #25)
 * - Reverse between positions m and n? (Reverse Linked List II - LeetCode #92)
 * - Detect if list is palindrome? (Use reverse + compare)
 * - Reverse doubly linked list? (Swap next and prev pointers)
 * 
 * RELATED PROBLEMS:
 * - Reverse Linked List II (LeetCode #92)
 * - Reverse Nodes in k-Group (LeetCode #25)
 * - Palindrome Linked List (LeetCode #234)
 * - Swap Nodes in Pairs (LeetCode #24)
 * 
 * VISUALIZATION:
 * Original: 1 -> 2 -> 3 -> 4 -> 5 -> null
 * Reversed: 5 -> 4 -> 3 -> 2 -> 1 -> null
 * 
 * RECURSIVE CALL STACK:
 * reverseList(1->2->3->4->5)
 *   reverseList(2->3->4->5)
 *     reverseList(3->4->5)
 *       reverseList(4->5)
 *         reverseList(5)
 *           return 5
 *         4->next->next = 4 (5->4)
 *         return 5
 *       3->next->next = 3 (4->3)
 *       return 5
 *     2->next->next = 2 (3->2)
 *     return 5
 *   1->next->next = 1 (2->1)
 *   return 5
 */

// Made with Bob
