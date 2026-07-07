/*
 * Problem: Linked List Cycle II (LeetCode 142)
 * Difficulty: Medium
 * Category: Linked Lists
 * 
 * Description:
 * Given the head of a linked list, return the node where the cycle begins.
 * If there is no cycle, return null.
 * 
 * There is a cycle in a linked list if there is some node in the list that can be
 * reached again by continuously following the next pointer. Internally, pos is used
 * to denote the index of the node that tail's next pointer is connected to (0-indexed).
 * It is -1 if there is no cycle. Note that pos is not passed as a parameter.
 * 
 * Do not modify the linked list.
 * 
 * Example 1:
 * Input: head = [3,2,0,-4], pos = 1
 * Output: tail connects to node index 1
 * Explanation: There is a cycle in the linked list, where tail connects to the second node.
 * 
 * Example 2:
 * Input: head = [1,2], pos = 0
 * Output: tail connects to node index 0
 * Explanation: There is a cycle in the linked list, where tail connects to the first node.
 * 
 * Example 3:
 * Input: head = [1], pos = -1
 * Output: no cycle
 * Explanation: There is no cycle in the linked list.
 * 
 * Constraints:
 * - The number of nodes in the list is in the range [0, 10^4]
 * - -10^5 <= Node.val <= 10^5
 * - pos is -1 or a valid index in the linked-list
 * 
 * Follow up: Can you solve it using O(1) (i.e. constant) memory?
 */

#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

// Definition for singly-linked list
struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

/*
 * APPROACH 1: FLOYD'S CYCLE DETECTION (TWO POINTERS)
 * 
 * Intuition:
 * - Use Floyd's algorithm to detect cycle
 * - When slow and fast meet, they are k steps into the cycle
 * - Mathematical proof: distance from head to cycle start = distance from meeting point to cycle start
 * - Reset one pointer to head, move both at same speed, they meet at cycle start
 * 
 * Mathematical Proof:
 * Let:
 * - L = distance from head to cycle start
 * - C = cycle length
 * - k = distance from cycle start to meeting point
 * 
 * When they meet:
 * - Slow traveled: L + k
 * - Fast traveled: L + k + nC (where n is number of complete cycles)
 * - Fast = 2 * Slow: L + k + nC = 2(L + k)
 * - Simplify: L + k + nC = 2L + 2k
 * - Therefore: L = nC - k
 * - This means: distance from head to start = distance from meeting to start (modulo C)
 * 
 * Algorithm:
 * 1. Use slow and fast pointers to detect cycle
 * 2. If they meet, reset slow to head
 * 3. Move both at same speed until they meet again
 * 4. Meeting point is cycle start
 * 
 * Time Complexity: O(n) - traverse list twice at most
 * Space Complexity: O(1) - only two pointers
 */
class Solution1 {
public:
    ListNode *detectCycle(ListNode *head) {
        if (!head || !head->next) return nullptr;
        
        // Phase 1: Detect if cycle exists
        ListNode* slow = head;
        ListNode* fast = head;
        
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            
            if (slow == fast) {
                // Cycle detected
                // Phase 2: Find cycle start
                slow = head;
                
                while (slow != fast) {
                    slow = slow->next;
                    fast = fast->next;
                }
                
                return slow; // Cycle start
            }
        }
        
        return nullptr; // No cycle
    }
};

/*
 * APPROACH 2: HASH SET
 * 
 * Intuition:
 * - Store visited nodes in a hash set
 * - First node we see twice is the cycle start
 * - Simple but uses O(n) space
 * 
 * Algorithm:
 * 1. Traverse list, adding each node to set
 * 2. If node already in set, it's the cycle start
 * 3. If reach end, no cycle
 * 
 * Time Complexity: O(n) - traverse list once
 * Space Complexity: O(n) - hash set
 */
class Solution2 {
public:
    ListNode *detectCycle(ListNode *head) {
        unordered_set<ListNode*> visited;
        
        ListNode* current = head;
        while (current) {
            if (visited.count(current)) {
                return current; // Cycle start
            }
            visited.insert(current);
            current = current->next;
        }
        
        return nullptr; // No cycle
    }
};

/*
 * APPROACH 3: MODIFY LIST (REVERSE POINTERS)
 * 
 * Intuition:
 * - Reverse the list as we traverse
 * - If we reach a node whose next points backwards, that's cycle start
 * - Restore list afterwards
 * - This modifies the list temporarily
 * 
 * Algorithm:
 * 1. Reverse list while traversing
 * 2. If current->next points to a previous node, cycle found
 * 3. Restore list to original state
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class Solution3 {
public:
    ListNode *detectCycle(ListNode *head) {
        if (!head || !head->next) return nullptr;
        
        ListNode* prev = nullptr;
        ListNode* current = head;
        
        while (current) {
            ListNode* next = current->next;
            
            // Check if next points to a node we've already processed
            if (next && next->next == current) {
                // Found cycle start, restore list
                ListNode* restore = head;
                while (restore != current) {
                    ListNode* temp = restore->next;
                    restore->next = prev;
                    prev = restore;
                    restore = temp;
                }
                return next;
            }
            
            current->next = prev;
            prev = current;
            current = next;
        }
        
        // No cycle, restore list
        current = prev;
        prev = nullptr;
        while (current) {
            ListNode* next = current->next;
            current->next = prev;
            prev = current;
            current = next;
        }
        
        return nullptr;
    }
};

/*
 * APPROACH 4: MARKING NODES (MODIFY VALUES)
 * 
 * Intuition:
 * - Mark visited nodes by modifying their values
 * - First node with marked value is cycle start
 * - Requires restoring original values
 * - Only works if we can use a special marker value
 * 
 * Algorithm:
 * 1. Use a special marker value (e.g., INT_MAX)
 * 2. Mark each node as visited
 * 3. If node already marked, it's cycle start
 * 4. Restore original values
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 * Note: This approach modifies node values, not recommended
 */
class Solution4 {
public:
    ListNode *detectCycle(ListNode *head) {
        const int MARKER = 1000000; // Outside constraint range
        
        ListNode* current = head;
        while (current) {
            if (current->val == MARKER) {
                // Restore values and return
                ListNode* restore = head;
                while (restore != current) {
                    restore->val -= MARKER;
                    restore = restore->next;
                }
                return current;
            }
            
            current->val += MARKER;
            current = current->next;
        }
        
        // No cycle, restore values
        current = head;
        while (current) {
            current->val -= MARKER;
            current = current->next;
        }
        
        return nullptr;
    }
};

/*
 * APPROACH 5: DISTANCE CALCULATION
 * 
 * Intuition:
 * - Similar to Approach 1 but with explicit distance tracking
 * - Calculate distances to understand the cycle structure
 * - More educational but essentially same as Floyd's algorithm
 * 
 * Algorithm:
 * 1. Detect cycle using Floyd's algorithm
 * 2. Calculate cycle length
 * 3. Use cycle length to find start
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class Solution5 {
public:
    ListNode *detectCycle(ListNode *head) {
        if (!head || !head->next) return nullptr;
        
        // Detect cycle
        ListNode* slow = head;
        ListNode* fast = head;
        bool hasCycle = false;
        
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            
            if (slow == fast) {
                hasCycle = true;
                break;
            }
        }
        
        if (!hasCycle) return nullptr;
        
        // Calculate cycle length
        int cycleLength = 1;
        fast = slow->next;
        while (fast != slow) {
            fast = fast->next;
            cycleLength++;
        }
        
        // Move fast pointer cycleLength steps ahead
        slow = head;
        fast = head;
        for (int i = 0; i < cycleLength; i++) {
            fast = fast->next;
        }
        
        // Move both at same speed until they meet
        while (slow != fast) {
            slow = slow->next;
            fast = fast->next;
        }
        
        return slow;
    }
};

// Helper function to create a linked list with cycle
ListNode* createListWithCycle(const vector<int>& values, int pos) {
    if (values.empty()) return nullptr;
    
    ListNode* head = new ListNode(values[0]);
    ListNode* current = head;
    ListNode* cycleNode = (pos == 0) ? head : nullptr;
    
    for (int i = 1; i < values.size(); i++) {
        current->next = new ListNode(values[i]);
        current = current->next;
        if (i == pos) {
            cycleNode = current;
        }
    }
    
    // Create cycle
    if (pos >= 0 && cycleNode) {
        current->next = cycleNode;
    }
    
    return head;
}

// Helper function to find node position
int findNodePosition(ListNode* head, ListNode* target) {
    if (!target) return -1;
    
    int pos = 0;
    ListNode* current = head;
    while (current) {
        if (current == target) return pos;
        current = current->next;
        pos++;
        if (pos > 10000) break; // Prevent infinite loop
    }
    return -1;
}

// Test function
void test(const vector<int>& values, int pos, int approach) {
    ListNode* head = createListWithCycle(values, pos);
    ListNode* result = nullptr;
    
    cout << "Input: [";
    for (int i = 0; i < values.size(); i++) {
        cout << values[i];
        if (i < values.size() - 1) cout << ",";
    }
    cout << "], pos = " << pos << "\n";
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.detectCycle(head);
            cout << "Approach 1 (Floyd's Algorithm): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.detectCycle(head);
            cout << "Approach 2 (Hash Set): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.detectCycle(head);
            cout << "Approach 3 (Reverse Pointers): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.detectCycle(head);
            cout << "Approach 4 (Mark Values): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.detectCycle(head);
            cout << "Approach 5 (Distance Calculation): ";
            break;
        }
    }
    
    int resultPos = findNodePosition(head, result);
    if (resultPos == -1) {
        cout << "no cycle\n";
    } else {
        cout << "cycle starts at index " << resultPos << "\n";
    }
    
    cout << "\n";
}

int main() {
    // Test Case 1: Cycle at index 1
    cout << "Test Case 1: Cycle at index 1\n";
    vector<int> test1 = {3, 2, 0, -4};
    for (int i = 1; i <= 5; i++) {
        test(test1, 1, i);
    }
    
    // Test Case 2: Cycle at index 0
    cout << "Test Case 2: Cycle at index 0\n";
    vector<int> test2 = {1, 2};
    for (int i = 1; i <= 5; i++) {
        test(test2, 0, i);
    }
    
    // Test Case 3: No cycle
    cout << "Test Case 3: No cycle\n";
    vector<int> test3 = {1};
    for (int i = 1; i <= 5; i++) {
        test(test3, -1, i);
    }
    
    // Test Case 4: Single node with cycle
    cout << "Test Case 4: Single node with cycle\n";
    vector<int> test4 = {1};
    for (int i = 1; i <= 5; i++) {
        test(test4, 0, i);
    }
    
    // Test Case 5: Longer list with cycle
    cout << "Test Case 5: Longer list\n";
    vector<int> test5 = {1, 2, 3, 4, 5, 6};
    for (int i = 1; i <= 5; i++) {
        test(test5, 3, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (Floyd's Algorithm):
 * - Time: O(n) - traverse list at most twice
 * - Space: O(1) - only two pointers
 * - Best for: Optimal solution, meets follow-up requirement
 * 
 * Approach 2 (Hash Set):
 * - Time: O(n) - single traversal
 * - Space: O(n) - hash set
 * - Best for: Simple implementation, easy to understand
 * 
 * Approach 3 (Reverse Pointers):
 * - Time: O(n)
 * - Space: O(1)
 * - Best for: Alternative O(1) space (modifies list temporarily)
 * 
 * Approach 4 (Mark Values):
 * - Time: O(n)
 * - Space: O(1)
 * - Best for: Educational (not recommended, modifies values)
 * 
 * Approach 5 (Distance Calculation):
 * - Time: O(n)
 * - Space: O(1)
 * - Best for: Understanding cycle structure
 * 
 * INTERVIEW TIPS:
 * 1. Start with Approach 1 (Floyd's) - optimal solution
 * 2. Explain the mathematical proof clearly
 * 3. Draw diagram to visualize the cycle
 * 4. Mention hash set as simpler alternative
 * 5. Floyd's algorithm is the expected solution
 * 
 * COMMON MISTAKES:
 * 1. Not handling empty list or single node
 * 2. Incorrect pointer movement in phase 2
 * 3. Not understanding why the algorithm works
 * 4. Forgetting to check for null pointers
 * 5. Modifying the list when problem says not to
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. Can you find cycle length? (Yes, count steps in cycle)
 * 2. What if list is very long? (Floyd's is still optimal)
 * 3. Can you do it without modifying list? (Yes, Approach 1 and 2)
 * 4. How to remove the cycle? (Set tail->next = nullptr)
 * 5. What if multiple cycles? (Not possible in singly linked list)
 * 
 * RELATED PROBLEMS:
 * - Linked List Cycle (detect only)
 * - Find Duplicate Number (similar concept)
 * - Happy Number (cycle detection in sequences)
 * - Intersection of Two Linked Lists
 * 
 * KEY INSIGHTS:
 * 1. Floyd's algorithm uses mathematical property of cycles
 * 2. Distance from head to start = distance from meeting to start
 * 3. Two-phase approach: detect cycle, then find start
 * 4. O(1) space is achievable with clever pointer manipulation
 * 5. Hash set is simpler but uses O(n) space
 */

// Made with Bob
