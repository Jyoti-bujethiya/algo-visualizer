/*
 * Problem: Linked List Cycle
 * LeetCode: https://leetcode.com/problems/linked-list-cycle/
 * 
 * Description:
 * Given head, the head of a linked list, determine if the linked list has a cycle in it.
 * 
 * There is a cycle in a linked list if there is some node in the list that can be reached
 * again by continuously following the next pointer. Internally, pos is used to denote the
 * index of the node that tail's next pointer is connected to. Note that pos is not passed
 * as a parameter.
 * 
 * Return true if there is a cycle in the linked list. Otherwise, return false.
 * 
 * Example 1:
 * Input: head = [3,2,0,-4], pos = 1
 * Output: true
 * Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).
 * 
 * Example 2:
 * Input: head = [1,2], pos = 0
 * Output: true
 * Explanation: There is a cycle in the linked list, where the tail connects to the 0th node.
 * 
 * Example 3:
 * Input: head = [1], pos = -1
 * Output: false
 * Explanation: There is no cycle in the linked list.
 * 
 * Constraints:
 * - The number of the nodes in the list is in the range [0, 10^4].
 * - -10^5 <= Node.val <= 10^5
 * - pos is -1 or a valid index in the linked-list.
 * 
 * Follow up: Can you solve it using O(1) (i.e. constant) memory?
 * 
 * Difficulty: Easy
 * Topics: Hash Table, Linked List, Two Pointers
 */

#include <iostream>
#include <unordered_set>
using namespace std;

// Definition for singly-linked list
struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    /*
     * Approach 1: Floyd's Cycle Detection (Two Pointers)
     * 
     * Intuition:
     * - Use slow and fast pointers
     * - Slow moves 1 step, fast moves 2 steps
     * - If there's a cycle, they will eventually meet
     * - If no cycle, fast reaches end (nullptr)
     * 
     * Why It Works:
     * - In a cycle, fast pointer gains 1 step on slow per iteration
     * - Eventually fast catches up to slow (like runners on a track)
     * - If no cycle, fast reaches end first
     * 
     * Algorithm:
     * 1. Initialize slow = head, fast = head
     * 2. While fast and fast->next exist:
     *    - Move slow one step
     *    - Move fast two steps
     *    - If slow == fast, cycle detected
     * 3. If loop exits, no cycle
     * 
     * Time Complexity: O(n) - at most n iterations
     * Space Complexity: O(1) - only two pointers
     */
    bool hasCycle_floyd(ListNode *head) {
        if (!head || !head->next) return false;
        
        ListNode* slow = head;
        ListNode* fast = head;
        
        while (fast && fast->next) {
            slow = slow->next;           // Move 1 step
            fast = fast->next->next;     // Move 2 steps
            
            if (slow == fast) {
                return true;  // Cycle detected
            }
        }
        
        return false;  // Reached end, no cycle
    }
    
    /*
     * Approach 2: Hash Set
     * 
     * Intuition:
     * - Store visited nodes in hash set
     * - If we see a node again, there's a cycle
     * - If we reach end, no cycle
     * 
     * Algorithm:
     * 1. Create hash set for visited nodes
     * 2. Traverse list:
     *    - If current node in set, cycle found
     *    - Add current node to set
     *    - Move to next node
     * 3. If reach end, no cycle
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n) - hash set
     */
    bool hasCycle_hashset(ListNode *head) {
        unordered_set<ListNode*> visited;
        
        ListNode* curr = head;
        while (curr) {
            if (visited.count(curr)) {
                return true;  // Seen this node before
            }
            visited.insert(curr);
            curr = curr->next;
        }
        
        return false;
    }
    
    /*
     * Approach 3: Node Modification (Destructive)
     * 
     * Intuition:
     * - Mark visited nodes by modifying them
     * - Use a sentinel value or pointer
     * - Not recommended as it modifies input
     * 
     * Algorithm:
     * 1. Traverse list
     * 2. Mark each node as visited (e.g., set val to sentinel)
     * 3. If see marked node, cycle exists
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     * Note: Modifies input, not recommended
     */
    bool hasCycle_modify(ListNode *head) {
        ListNode* sentinel = new ListNode(0);
        
        ListNode* curr = head;
        while (curr) {
            if (curr->next == sentinel) {
                return true;
            }
            ListNode* temp = curr->next;
            curr->next = sentinel;
            curr = temp;
        }
        
        return false;
    }
    
    /*
     * Approach 4: Floyd's with Different Starting Points
     * 
     * Intuition:
     * - Variation of Floyd's algorithm
     * - Start fast one step ahead
     * - Cleaner loop condition
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    bool hasCycle_variant(ListNode *head) {
        if (!head) return false;
        
        ListNode* slow = head;
        ListNode* fast = head->next;
        
        while (slow != fast) {
            if (!fast || !fast->next) {
                return false;
            }
            slow = slow->next;
            fast = fast->next->next;
        }
        
        return true;
    }
    
    /*
     * Approach 5: Standard Solution (Most Common)
     * 
     * This is the most commonly used approach in interviews
     * Floyd's Cycle Detection Algorithm
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    bool hasCycle(ListNode *head) {
        if (!head || !head->next) return false;
        
        ListNode* slow = head;
        ListNode* fast = head;
        
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            
            if (slow == fast) {
                return true;
            }
        }
        
        return false;
    }
};

/*
 * Helper functions for testing
 */
ListNode* createCycleList(int n, int pos) {
    if (n == 0) return nullptr;
    
    ListNode* head = new ListNode(0);
    ListNode* curr = head;
    ListNode* cycleNode = nullptr;
    
    if (pos == 0) cycleNode = head;
    
    for (int i = 1; i < n; i++) {
        curr->next = new ListNode(i);
        curr = curr->next;
        if (i == pos) cycleNode = curr;
    }
    
    if (pos != -1) {
        curr->next = cycleNode;  // Create cycle
    }
    
    return head;
}

void deleteList(ListNode* head, bool hasCycle) {
    if (!head) return;
    
    if (hasCycle) {
        // Break cycle first
        ListNode* slow = head;
        ListNode* fast = head;
        
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) break;
        }
        
        if (slow == fast) {
            slow = head;
            while (slow->next != fast->next) {
                slow = slow->next;
                fast = fast->next;
            }
            fast->next = nullptr;
        }
    }
    
    // Delete all nodes
    while (head) {
        ListNode* temp = head;
        head = head->next;
        delete temp;
    }
}

/*
 * Test Cases
 */
void runTests() {
    Solution sol;
    
    // Test Case 1: Cycle at position 1
    cout << "Test 1 - List: [3,2,0,-4], pos=1" << endl;
    ListNode* test1 = createCycleList(4, 1);
    cout << "Floyd's: " << (sol.hasCycle_floyd(test1) ? "true" : "false") << endl;
    cout << "Expected: true" << endl << endl;
    deleteList(test1, true);
    
    // Test Case 2: Cycle at position 0
    cout << "Test 2 - List: [1,2], pos=0" << endl;
    ListNode* test2 = createCycleList(2, 0);
    cout << "Result: " << (sol.hasCycle(test2) ? "true" : "false") << endl;
    cout << "Expected: true" << endl << endl;
    deleteList(test2, true);
    
    // Test Case 3: No cycle
    cout << "Test 3 - List: [1], pos=-1" << endl;
    ListNode* test3 = createCycleList(1, -1);
    cout << "Result: " << (sol.hasCycle(test3) ? "true" : "false") << endl;
    cout << "Expected: false" << endl << endl;
    deleteList(test3, false);
    
    // Test Case 4: Empty list
    cout << "Test 4 - List: [], pos=-1" << endl;
    ListNode* test4 = nullptr;
    cout << "Result: " << (sol.hasCycle(test4) ? "true" : "false") << endl;
    cout << "Expected: false" << endl << endl;
    
    // Test Case 5: Two nodes, no cycle
    cout << "Test 5 - List: [1,2], pos=-1" << endl;
    ListNode* test5 = createCycleList(2, -1);
    cout << "Result: " << (sol.hasCycle(test5) ? "true" : "false") << endl;
    cout << "Expected: false" << endl << endl;
    deleteList(test5, false);
}

int main() {
    cout << "Linked List Cycle - Multiple Approaches" << endl;
    cout << "========================================" << endl << endl;
    
    runTests();
    
    return 0;
}

/*
 * Complexity Analysis Summary:
 * 
 * Approach 1 (Floyd's Algorithm):
 * - Time: O(n)
 * - Space: O(1)
 * - BEST for interviews: optimal space
 * 
 * Approach 2 (Hash Set):
 * - Time: O(n)
 * - Space: O(n)
 * - Simple but uses extra space
 * 
 * Approach 3 (Node Modification):
 * - Time: O(n)
 * - Space: O(1)
 * - Not recommended: modifies input
 * 
 * Approach 4 (Floyd's Variant):
 * - Time: O(n)
 * - Space: O(1)
 * - Alternative implementation
 * 
 * Key Insights:
 * 1. Floyd's algorithm is optimal (O(1) space)
 * 2. Slow and fast pointers will meet if cycle exists
 * 3. Fast pointer moves twice as fast as slow
 * 4. If no cycle, fast reaches end first
 * 5. Works for any cycle length
 * 
 * Why Floyd's Algorithm Works:
 * - Think of it as two runners on a circular track
 * - Fast runner gains 1 position per iteration
 * - Eventually fast catches up to slow
 * - Mathematical proof:
 *   - Let cycle length = C
 *   - When slow enters cycle, fast is somewhere in cycle
 *   - Distance between them decreases by 1 each step
 *   - They meet in at most C steps
 * 
 * Visualization:
 * List: 1 -> 2 -> 3 -> 4 -> 5
 *                 ^         |
 *                 |_________|
 * 
 * Step 0: slow=1, fast=1
 * Step 1: slow=2, fast=3
 * Step 2: slow=3, fast=5
 * Step 3: slow=4, fast=4  (meet!)
 * 
 * Common Pitfalls:
 * 1. Not checking for null pointers
 * 2. Incorrect loop condition
 * 3. Moving pointers in wrong order
 * 4. Not handling empty list
 * 5. Confusing with cycle detection II (finding start)
 * 
 * Interview Tips:
 * 1. Start with Floyd's algorithm
 * 2. Explain why it works (runners analogy)
 * 3. Mention hash set as alternative
 * 4. Discuss space complexity trade-off
 * 5. Handle edge cases: empty, single node
 * 6. Draw diagram to visualize
 * 7. Mention this is also called "tortoise and hare"
 * 
 * Edge Cases:
 * 1. Empty list: return false
 * 2. Single node: return false
 * 3. Two nodes with cycle: return true
 * 4. Two nodes without cycle: return false
 * 5. Cycle at head: return true
 * 6. Cycle at tail: return true
 * 
 * Time Complexity Proof:
 * - Without cycle: O(n) - fast reaches end
 * - With cycle: O(n + k) where k = cycle length
 *   - At most n steps to enter cycle
 *   - At most k steps to meet in cycle
 *   - Total: O(n)
 * 
 * Space Complexity:
 * - Floyd's: O(1) - only two pointers
 * - Hash set: O(n) - store all nodes
 * 
 * Real-World Applications:
 * 1. Detecting infinite loops in programs
 * 2. Finding duplicate elements
 * 3. Cycle detection in graphs
 * 4. Memory leak detection
 * 5. Deadlock detection
 * 
 * Extensions and Variations:
 * 1. Find cycle start (Linked List Cycle II)
 * 2. Find cycle length
 * 3. Detect cycle in directed graph
 * 4. Find duplicate number (array as linked list)
 * 5. Happy number problem
 * 
 * Related Problems:
 * - Linked List Cycle II (find cycle start)
 * - Find the Duplicate Number
 * - Happy Number
 * - Circular Array Loop
 * - Detect Capital
 */

// Made with Bob
