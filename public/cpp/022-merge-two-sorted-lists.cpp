/*
 * LeetCode Problem #21: Merge Two Sorted Lists
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/merge-two-sorted-lists/
 * 
 * Problem Statement:
 * You are given the heads of two sorted linked lists list1 and list2.
 * Merge the two lists in a one sorted list. The list should be made by
 * splicing together the nodes of the first two lists. Return the head of
 * the merged linked list.
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
    // ==================== APPROACH 1: Iterative with Dummy Node ====================
    /*
     * Algorithm:
     * - Create dummy node to simplify edge cases
     * - Use pointer to build result list
     * - Compare nodes from both lists, add smaller one
     * - Append remaining nodes from non-empty list
     * 
     * Time Complexity: O(n + m)
     * Space Complexity: O(1)
     * 
     * When to use: This is the OPTIMAL solution
     * 
     * Key Insight:
     * - Dummy node eliminates special case for head
     * - Just rewire pointers, don't create new nodes
     * - One list will finish first, append the rest
     */
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        ListNode dummy(0);
        ListNode* current = &dummy;
        
        while (list1 != nullptr && list2 != nullptr) {
            if (list1->val <= list2->val) {
                current->next = list1;
                list1 = list1->next;
            } else {
                current->next = list2;
                list2 = list2->next;
            }
            current = current->next;
        }
        
        // Append remaining nodes
        current->next = (list1 != nullptr) ? list1 : list2;
        
        return dummy.next;
    }
    
    // ==================== APPROACH 2: Recursive ====================
    /*
     * Algorithm:
     * - Base case: if one list is empty, return the other
     * - Recursive case: choose smaller head, recursively merge rest
     * 
     * Time Complexity: O(n + m)
     * Space Complexity: O(n + m) - recursion stack
     * 
     * When to use: When recursion is preferred
     * 
     * Key Insight:
     * - Elegant recursive structure
     * - Each call handles one node
     * - Naturally handles remaining nodes
     */
    ListNode* mergeTwoLists_Recursive(ListNode* list1, ListNode* list2) {
        // Base cases
        if (list1 == nullptr) return list2;
        if (list2 == nullptr) return list1;
        
        // Recursive case
        if (list1->val <= list2->val) {
            list1->next = mergeTwoLists_Recursive(list1->next, list2);
            return list1;
        } else {
            list2->next = mergeTwoLists_Recursive(list1, list2->next);
            return list2;
        }
    }
    
    // ==================== APPROACH 3: In-place without Dummy ====================
    /*
     * Same as iterative but without dummy node
     * More complex due to head handling
     * 
     * Time Complexity: O(n + m)
     * Space Complexity: O(1)
     */
    ListNode* mergeTwoLists_NoDummy(ListNode* list1, ListNode* list2) {
        if (list1 == nullptr) return list2;
        if (list2 == nullptr) return list1;
        
        // Determine head
        ListNode* head;
        if (list1->val <= list2->val) {
            head = list1;
            list1 = list1->next;
        } else {
            head = list2;
            list2 = list2->next;
        }
        
        ListNode* current = head;
        
        while (list1 != nullptr && list2 != nullptr) {
            if (list1->val <= list2->val) {
                current->next = list1;
                list1 = list1->next;
            } else {
                current->next = list2;
                list2 = list2->next;
            }
            current = current->next;
        }
        
        current->next = (list1 != nullptr) ? list1 : list2;
        
        return head;
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
    
    // Test Case 1: Standard merge
    vector<int> vals1a = {1, 2, 4};
    vector<int> vals1b = {1, 3, 4};
    ListNode* list1a = createList(vals1a);
    ListNode* list1b = createList(vals1b);
    cout << "Test 1: ";
    ListNode* result1 = sol.mergeTwoLists(list1a, list1b);
    printList(result1);
    deleteList(result1);
    // Expected: [1,1,2,3,4,4]
    
    // Test Case 2: One empty list
    vector<int> vals2a = {};
    vector<int> vals2b = {0};
    ListNode* list2a = createList(vals2a);
    ListNode* list2b = createList(vals2b);
    cout << "Test 2: ";
    ListNode* result2 = sol.mergeTwoLists(list2a, list2b);
    printList(result2);
    deleteList(result2);
    // Expected: [0]
    
    // Test Case 3: Both empty
    ListNode* list3a = nullptr;
    ListNode* list3b = nullptr;
    cout << "Test 3: ";
    ListNode* result3 = sol.mergeTwoLists(list3a, list3b);
    printList(result3);
    // Expected: []
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. Iterative with Dummy (RECOMMENDED):
 *    Time: O(n+m), Space: O(1)
 *    Clean, efficient, easy to understand
 * 
 * 2. Recursive:
 *    Time: O(n+m), Space: O(n+m)
 *    Elegant but uses stack space
 * 
 * 3. Without Dummy:
 *    Time: O(n+m), Space: O(1)
 *    More complex, no real benefit
 * 
 * INTERVIEW TIPS:
 * - Explain dummy node technique
 * - Mention that we're rewiring, not copying
 * - Handle edge cases: empty lists
 * - Discuss recursive alternative
 * - Mention this extends to k lists
 * 
 * KEY INSIGHTS:
 * - Dummy node simplifies code significantly
 * - No need to create new nodes, just rewire
 * - One list will finish first
 * - Remaining nodes can be appended directly
 * 
 * STEP-BY-STEP for [1,2,4] and [1,3,4]:
 * 
 * Initial: dummy->null, l1=1, l2=1
 * Step 1: 1<=1, add l1, dummy->1, l1=2, l2=1
 * Step 2: 2>1, add l2, dummy->1->1, l1=2, l2=3
 * Step 3: 2<=3, add l1, dummy->1->1->2, l1=4, l2=3
 * Step 4: 4>3, add l2, dummy->1->1->2->3, l1=4, l2=4
 * Step 5: 4<=4, add l1, dummy->1->1->2->3->4, l1=null, l2=4
 * Step 6: l1=null, append l2, dummy->1->1->2->3->4->4
 * 
 * COMMON MISTAKES:
 * - Creating new nodes instead of rewiring
 * - Not handling empty lists
 * - Forgetting to append remaining nodes
 * - Complex head handling without dummy
 * 
 * FOLLOW-UP QUESTIONS:
 * - Merge k sorted lists? (Use heap - LeetCode #23)
 * - Merge in descending order? (Reverse comparison)
 * - Remove duplicates while merging? (Skip equal values)
 * - Merge arrays instead? (Similar logic)
 * 
 * RELATED PROBLEMS:
 * - Merge k Sorted Lists (LeetCode #23)
 * - Merge Sorted Array (LeetCode #88)
 * - Sort List (LeetCode #148)
 * - Add Two Numbers (LeetCode #2)
 */

// Made with Bob
