/*
 * LeetCode Problem #2: Add Two Numbers
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/add-two-numbers/
 * 
 * Problem Statement:
 * You are given two non-empty linked lists representing two non-negative integers.
 * The digits are stored in reverse order, and each of their nodes contains a single digit.
 * Add the two numbers and return the sum as a linked list.
 * You may assume the two numbers do not contain any leading zero, except the number 0 itself.
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
    // ==================== APPROACH 1: Iterative with Dummy Head ====================
    /*
     * Algorithm:
     * - Create dummy head to simplify edge cases
     * - Iterate through both lists simultaneously
     * - Add corresponding digits plus carry
     * - Create new node for each sum digit
     * - Handle remaining carry at the end
     * 
     * Time Complexity: O(max(m, n)) where m, n are lengths of lists
     * Space Complexity: O(max(m, n)) for result list
     * 
     * When to use: This is the OPTIMAL solution
     * 
     * Key Insight:
     * - Dummy head eliminates special case for first node
     * - Process carry naturally through iteration
     * - Handle unequal length lists gracefully
     */
    ListNode* addTwoNumbers_Iterative(ListNode* l1, ListNode* l2) {
        ListNode* dummy = new ListNode(0);
        ListNode* current = dummy;
        int carry = 0;
        
        // Process both lists
        while (l1 != nullptr || l2 != nullptr || carry != 0) {
            int sum = carry;
            
            if (l1 != nullptr) {
                sum += l1->val;
                l1 = l1->next;
            }
            
            if (l2 != nullptr) {
                sum += l2->val;
                l2 = l2->next;
            }
            
            carry = sum / 10;
            current->next = new ListNode(sum % 10);
            current = current->next;
        }
        
        ListNode* result = dummy->next;
        delete dummy;
        return result;
    }
    
    // ==================== APPROACH 2: Recursive ====================
    /*
     * Algorithm:
     * - Recursively add digits from both lists
     * - Pass carry to next recursive call
     * - Base case: both lists empty and no carry
     * 
     * Time Complexity: O(max(m, n))
     * Space Complexity: O(max(m, n)) for recursion stack + result
     * 
     * When to use: When recursion is preferred
     * 
     * Key Insight:
     * - Each recursive call handles one digit position
     * - Carry propagates through recursive calls
     * - Natural handling of different length lists
     */
    ListNode* addTwoNumbersHelper(ListNode* l1, ListNode* l2, int carry) {
        // Base case: both lists empty and no carry
        if (l1 == nullptr && l2 == nullptr && carry == 0) {
            return nullptr;
        }
        
        int sum = carry;
        
        if (l1 != nullptr) {
            sum += l1->val;
            l1 = l1->next;
        }
        
        if (l2 != nullptr) {
            sum += l2->val;
            l2 = l2->next;
        }
        
        ListNode* node = new ListNode(sum % 10);
        node->next = addTwoNumbersHelper(l1, l2, sum / 10);
        
        return node;
    }
    
    ListNode* addTwoNumbers_Recursive(ListNode* l1, ListNode* l2) {
        return addTwoNumbersHelper(l1, l2, 0);
    }
    
    // ==================== APPROACH 3: In-place Modification ====================
    /*
     * Algorithm:
     * - Reuse l1 for result to save space
     * - Modify l1 nodes in place
     * - Extend l1 if l2 is longer
     * 
     * Time Complexity: O(max(m, n))
     * Space Complexity: O(1) excluding result (modifies input)
     * 
     * When to use: When input modification is allowed and space is critical
     * 
     * Note: This approach modifies input, not recommended in interviews
     * unless explicitly allowed
     */
    ListNode* addTwoNumbers_InPlace(ListNode* l1, ListNode* l2) {
        ListNode* head = l1;
        ListNode* prev = nullptr;
        int carry = 0;
        
        while (l1 != nullptr || l2 != nullptr || carry != 0) {
            int sum = carry;
            
            if (l1 != nullptr) {
                sum += l1->val;
            }
            
            if (l2 != nullptr) {
                sum += l2->val;
                l2 = l2->next;
            }
            
            carry = sum / 10;
            
            if (l1 != nullptr) {
                l1->val = sum % 10;
                prev = l1;
                l1 = l1->next;
            } else {
                // Extend l1 if needed
                prev->next = new ListNode(sum % 10);
                prev = prev->next;
            }
        }
        
        return head;
    }
    
    // Main function (uses iterative by default)
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        return addTwoNumbers_Iterative(l1, l2);
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
    
    // Test Case 1: Standard case (342 + 465 = 807)
    vector<int> vals1a = {2, 4, 3};
    vector<int> vals1b = {5, 6, 4};
    ListNode* l1 = createList(vals1a);
    ListNode* l2 = createList(vals1b);
    cout << "Test 1: ";
    printList(l1);
    cout << "      + ";
    printList(l2);
    ListNode* result1 = sol.addTwoNumbers(l1, l2);
    cout << "      = ";
    printList(result1);
    deleteList(result1);
    // Expected: [7,0,8]
    
    // Test Case 2: Different lengths (0 + 0 = 0)
    vector<int> vals2a = {0};
    vector<int> vals2b = {0};
    l1 = createList(vals2a);
    l2 = createList(vals2b);
    cout << "\nTest 2: ";
    printList(l1);
    cout << "      + ";
    printList(l2);
    ListNode* result2 = sol.addTwoNumbers(l1, l2);
    cout << "      = ";
    printList(result2);
    deleteList(result2);
    // Expected: [0]
    
    // Test Case 3: Carry propagation (9999999 + 9999 = 10009998)
    vector<int> vals3a = {9, 9, 9, 9, 9, 9, 9};
    vector<int> vals3b = {9, 9, 9, 9};
    l1 = createList(vals3a);
    l2 = createList(vals3b);
    cout << "\nTest 3: ";
    printList(l1);
    cout << "      + ";
    printList(l2);
    ListNode* result3 = sol.addTwoNumbers(l1, l2);
    cout << "      = ";
    printList(result3);
    deleteList(result3);
    // Expected: [8,9,9,9,0,0,0,1]
    
    // Test Case 4: One list longer (99 + 1 = 100)
    vector<int> vals4a = {9, 9};
    vector<int> vals4b = {1};
    l1 = createList(vals4a);
    l2 = createList(vals4b);
    cout << "\nTest 4: ";
    printList(l1);
    cout << "      + ";
    printList(l2);
    ListNode* result4 = sol.addTwoNumbers(l1, l2);
    cout << "      = ";
    printList(result4);
    deleteList(result4);
    // Expected: [0,0,1]
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. Iterative with Dummy Head (RECOMMENDED):
 *    Time: O(max(m,n)), Space: O(max(m,n))
 *    Clean, easy to understand, handles all edge cases
 * 
 * 2. Recursive:
 *    Time: O(max(m,n)), Space: O(max(m,n))
 *    Elegant but uses extra stack space
 * 
 * 3. In-place Modification:
 *    Time: O(max(m,n)), Space: O(1)
 *    Space efficient but modifies input
 * 
 * INTERVIEW TIPS:
 * - Clarify if digits are in reverse order (they are)
 * - Ask about negative numbers (problem states non-negative)
 * - Discuss dummy head technique to simplify code
 * - Mention carry handling is key
 * - Walk through example with carry propagation
 * - Consider edge cases: empty lists, different lengths
 * - Discuss space complexity of result list
 * 
 * KEY INSIGHTS:
 * - Reverse order makes addition natural (start from least significant)
 * - Dummy head eliminates special case for first node
 * - Carry must be handled even after both lists end
 * - Loop condition: continue while any list has nodes OR carry exists
 * 
 * STEP-BY-STEP for [2,4,3] + [5,6,4]:
 * 
 * Position 0: 2 + 5 + 0(carry) = 7, carry = 0
 * Position 1: 4 + 6 + 0(carry) = 10, digit = 0, carry = 1
 * Position 2: 3 + 4 + 1(carry) = 8, carry = 0
 * Result: [7,0,8] which represents 807
 * 
 * COMMON MISTAKES:
 * - Forgetting to handle final carry
 * - Not handling lists of different lengths
 * - Creating result in wrong order (forward instead of reverse)
 * - Memory leaks (not deleting dummy node)
 * - Off-by-one errors in carry calculation
 * - Not initializing carry to 0
 * - Forgetting null checks
 * 
 * FOLLOW-UP QUESTIONS:
 * - What if digits are stored in forward order? (Add Two Numbers II - LeetCode #445)
 * - How to handle negative numbers? (Need sign tracking)
 * - What if numbers are very large? (This solution handles it)
 * - Can you do it without creating new nodes? (In-place approach)
 * - How to add three numbers? (Extend to multiple lists)
 * 
 * RELATED PROBLEMS:
 * - Add Two Numbers II (LeetCode #445) - digits in forward order
 * - Plus One (LeetCode #66) - add 1 to array representation
 * - Multiply Strings (LeetCode #43) - string multiplication
 * - Add Binary (LeetCode #67) - binary string addition
 * - Add Strings (LeetCode #415) - decimal string addition
 * 
 * VISUALIZATION for [2,4,3] + [5,6,4]:
 * 
 * Input:  2 -> 4 -> 3  (represents 342)
 *       + 5 -> 6 -> 4  (represents 465)
 *       ---------------
 * Output: 7 -> 0 -> 8  (represents 807)
 * 
 * Step-by-step:
 *   2 + 5 = 7, carry = 0
 *   4 + 6 = 10, digit = 0, carry = 1
 *   3 + 4 + 1 = 8, carry = 0
 */

// Made with Bob
