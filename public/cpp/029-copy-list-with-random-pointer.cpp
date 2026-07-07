/*
 * Problem: Copy List with Random Pointer (LeetCode 138)
 * Link: https://leetcode.com/problems/copy-list-with-random-pointer/
 * Difficulty: Medium
 * Category: Linked Lists
 * 
 * Description:
 * A linked list of length n is given such that each node contains an additional
 * random pointer, which could point to any node in the list, or null.
 * 
 * Construct a deep copy of the list. The deep copy should consist of exactly n
 * brand new nodes, where each new node has its value set to the value of its
 * corresponding original node. Both the next and random pointer of the new nodes
 * should point to new nodes in the copied list such that the pointers in the
 * original list and copied list represent the same list state.
 * 
 * Example 1:
 * Input: head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
 * Output: [[7,null],[13,0],[11,4],[10,2],[1,0]]
 * 
 * Example 2:
 * Input: head = [[1,1],[2,1]]
 * Output: [[1,1],[2,1]]
 * 
 * Constraints:
 * - 0 <= n <= 1000
 * - -10^4 <= Node.val <= 10^4
 * - Node.random is null or is pointing to some node in the linked list.
 */

#include <iostream>
#include <unordered_map>
#include <vector>
using namespace std;

// Definition for a Node
class Node {
public:
    int val;
    Node* next;
    Node* random;
    
    Node(int _val) {
        val = _val;
        next = nullptr;
        random = nullptr;
    }
};

/*
 * APPROACH 1: HASH MAP (INTUITIVE)
 * 
 * Intuition:
 * - Use hash map to store mapping from original to copied nodes
 * - First pass: create all nodes and store in map
 * - Second pass: set next and random pointers using map
 * 
 * Algorithm:
 * 1. First pass: create copy of each node, store in map
 * 2. Second pass: for each original node:
 *    - Set copy's next to map[original->next]
 *    - Set copy's random to map[original->random]
 * 3. Return map[head]
 * 
 * Time Complexity: O(n) - two passes
 * Space Complexity: O(n) - hash map
 */
class Solution1 {
public:
    Node* copyRandomList(Node* head) {
        if (!head) return nullptr;
        
        unordered_map<Node*, Node*> oldToNew;
        
        // First pass: create all nodes
        Node* curr = head;
        while (curr) {
            oldToNew[curr] = new Node(curr->val);
            curr = curr->next;
        }
        
        // Second pass: set next and random pointers
        curr = head;
        while (curr) {
            if (curr->next) {
                oldToNew[curr]->next = oldToNew[curr->next];
            }
            if (curr->random) {
                oldToNew[curr]->random = oldToNew[curr->random];
            }
            curr = curr->next;
        }
        
        return oldToNew[head];
    }
};

/*
 * APPROACH 2: INTERWEAVING NODES (OPTIMAL - NO EXTRA SPACE)
 * 
 * Intuition:
 * - Insert copied nodes between original nodes
 * - Original: A -> B -> C
 * - After: A -> A' -> B -> B' -> C -> C'
 * - Set random pointers using this structure
 * - Separate the two lists
 * 
 * Algorithm:
 * 1. First pass: create copy after each node
 *    A -> A' -> B -> B' -> C -> C'
 * 2. Second pass: set random pointers
 *    A'->random = A->random->next
 * 3. Third pass: separate lists
 * 
 * Time Complexity: O(n) - three passes
 * Space Complexity: O(1) - no extra space
 */
class Solution2 {
public:
    Node* copyRandomList(Node* head) {
        if (!head) return nullptr;
        
        // Step 1: Create copy nodes interweaved with original
        Node* curr = head;
        while (curr) {
            Node* copy = new Node(curr->val);
            copy->next = curr->next;
            curr->next = copy;
            curr = copy->next;
        }
        
        // Step 2: Set random pointers for copied nodes
        curr = head;
        while (curr) {
            if (curr->random) {
                curr->next->random = curr->random->next;
            }
            curr = curr->next->next;
        }
        
        // Step 3: Separate the two lists
        Node* dummy = new Node(0);
        Node* copyCurr = dummy;
        curr = head;
        
        while (curr) {
            copyCurr->next = curr->next;
            curr->next = curr->next->next;
            
            copyCurr = copyCurr->next;
            curr = curr->next;
        }
        
        return dummy->next;
    }
};

/*
 * APPROACH 3: RECURSIVE WITH HASH MAP
 * 
 * Intuition:
 * - Use recursion to copy nodes
 * - Use hash map to avoid creating duplicate copies
 * - Base case: null node returns null
 * 
 * Algorithm:
 * 1. If node in map, return mapped copy
 * 2. Create new node
 * 3. Store in map
 * 4. Recursively copy next and random
 * 5. Return new node
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n) - map + recursion stack
 */
class Solution3 {
private:
    unordered_map<Node*, Node*> visited;
    
    Node* copyNode(Node* node) {
        if (!node) return nullptr;
        
        if (visited.find(node) != visited.end()) {
            return visited[node];
        }
        
        Node* newNode = new Node(node->val);
        visited[node] = newNode;
        
        newNode->next = copyNode(node->next);
        newNode->random = copyNode(node->random);
        
        return newNode;
    }
    
public:
    Node* copyRandomList(Node* head) {
        return copyNode(head);
    }
};

/*
 * APPROACH 4: ITERATIVE WITH NULL HANDLING
 * 
 * Intuition:
 * - Similar to Approach 1 but with explicit null handling
 * - Add null to map for cleaner code
 * - Single pass possible with careful ordering
 * 
 * Algorithm:
 * 1. Add nullptr to map
 * 2. Create all nodes in one pass
 * 3. Set pointers in same pass
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
class Solution4 {
public:
    Node* copyRandomList(Node* head) {
        if (!head) return nullptr;
        
        unordered_map<Node*, Node*> map;
        map[nullptr] = nullptr;
        
        // Create all nodes
        Node* curr = head;
        while (curr) {
            map[curr] = new Node(curr->val);
            curr = curr->next;
        }
        
        // Set pointers
        curr = head;
        while (curr) {
            map[curr]->next = map[curr->next];
            map[curr]->random = map[curr->random];
            curr = curr->next;
        }
        
        return map[head];
    }
};

/*
 * APPROACH 5: VECTOR-BASED INDEXING
 * 
 * Intuition:
 * - Store nodes in vector for index-based access
 * - Use indices instead of pointers
 * - Convert random pointers to indices, then back
 * 
 * Algorithm:
 * 1. Store all nodes in vector
 * 2. Create map from node to index
 * 3. Create copied nodes
 * 4. Set pointers using indices
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
class Solution5 {
public:
    Node* copyRandomList(Node* head) {
        if (!head) return nullptr;
        
        vector<Node*> nodes;
        unordered_map<Node*, int> nodeToIndex;
        
        // Store nodes and create index map
        Node* curr = head;
        int index = 0;
        while (curr) {
            nodes.push_back(curr);
            nodeToIndex[curr] = index++;
            curr = curr->next;
        }
        
        // Create copied nodes
        vector<Node*> copies(nodes.size());
        for (int i = 0; i < nodes.size(); i++) {
            copies[i] = new Node(nodes[i]->val);
        }
        
        // Set pointers
        for (int i = 0; i < nodes.size(); i++) {
            if (nodes[i]->next) {
                copies[i]->next = copies[i + 1];
            }
            if (nodes[i]->random) {
                int randomIndex = nodeToIndex[nodes[i]->random];
                copies[i]->random = copies[randomIndex];
            }
        }
        
        return copies[0];
    }
};

// Helper function to print list
void printList(Node* head) {
    Node* curr = head;
    cout << "[";
    while (curr) {
        cout << "[" << curr->val << ",";
        if (curr->random) {
            cout << curr->random->val;
        } else {
            cout << "null";
        }
        cout << "]";
        if (curr->next) cout << ",";
        curr = curr->next;
    }
    cout << "]\n";
}

// Helper function to create test list
Node* createList(vector<pair<int, int>> data) {
    if (data.empty()) return nullptr;
    
    vector<Node*> nodes;
    for (auto& p : data) {
        nodes.push_back(new Node(p.first));
    }
    
    for (int i = 0; i < nodes.size() - 1; i++) {
        nodes[i]->next = nodes[i + 1];
    }
    
    for (int i = 0; i < data.size(); i++) {
        if (data[i].second != -1) {
            nodes[i]->random = nodes[data[i].second];
        }
    }
    
    return nodes[0];
}

// Test function
void test(vector<pair<int, int>> data, int approach) {
    Node* head = createList(data);
    Node* result = nullptr;
    
    cout << "Input: ";
    printList(head);
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.copyRandomList(head);
            cout << "Approach 1 (Hash Map): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.copyRandomList(head);
            cout << "Approach 2 (Interweaving): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.copyRandomList(head);
            cout << "Approach 3 (Recursive): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.copyRandomList(head);
            cout << "Approach 4 (Null Handling): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.copyRandomList(head);
            cout << "Approach 5 (Vector Indexing): ";
            break;
        }
    }
    
    printList(result);
    cout << "\n";
}

int main() {
    // Test Case 1: Standard case
    cout << "Test Case 1: Standard case\n";
    vector<pair<int, int>> test1 = {{7, -1}, {13, 0}, {11, 4}, {10, 2}, {1, 0}};
    for (int i = 1; i <= 5; i++) {
        test(test1, i);
    }
    
    // Test Case 2: Simple case
    cout << "Test Case 2: Simple case\n";
    vector<pair<int, int>> test2 = {{1, 1}, {2, 1}};
    for (int i = 1; i <= 5; i++) {
        test(test2, i);
    }
    
    // Test Case 3: All null random
    cout << "Test Case 3: All null random\n";
    vector<pair<int, int>> test3 = {{1, -1}, {2, -1}, {3, -1}};
    for (int i = 1; i <= 5; i++) {
        test(test3, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (Hash Map):
 * - Time: O(n) - two passes
 * - Space: O(n) - hash map
 * - Best for: Most intuitive, easy to understand
 * 
 * Approach 2 (Interweaving - OPTIMAL):
 * - Time: O(n) - three passes
 * - Space: O(1) - no extra space
 * - Best for: Space optimization, clever solution
 * 
 * Approach 3 (Recursive):
 * - Time: O(n)
 * - Space: O(n) - map + stack
 * - Best for: Recursive thinking
 * 
 * Approach 4 (Null Handling):
 * - Time: O(n)
 * - Space: O(n)
 * - Best for: Cleaner code
 * 
 * Approach 5 (Vector Indexing):
 * - Time: O(n)
 * - Space: O(n)
 * - Best for: Index-based thinking
 * 
 * INTERVIEW TIPS:
 * 1. Start with Approach 1 (hash map)
 * 2. Mention Approach 2 for O(1) space
 * 3. Draw diagram showing interweaving
 * 4. Explain why interweaving works
 * 5. Discuss trade-offs between approaches
 * 
 * COMMON MISTAKES:
 * 1. Not handling null random pointers
 * 2. Creating duplicate copies of same node
 * 3. Not restoring original list in Approach 2
 * 4. Forgetting to set both next and random
 * 5. Memory leaks in test code
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. Can you do it in O(1) space? (Yes, Approach 2)
 * 2. What if list is circular? (Same approaches work)
 * 3. How to verify deep copy? (Check addresses differ)
 * 4. Can you do it in one pass? (Difficult, need map)
 * 5. What if random can point outside list? (Invalid input)
 * 
 * RELATED PROBLEMS:
 * - Clone Graph
 * - Copy List with Random Pointer II
 * - Clone N-ary Tree
 * - Clone Binary Tree with Random Pointer
 * - Deep Copy of Doubly Linked List
 * 
 * KEY INSIGHTS:
 * 1. Hash map provides old->new mapping
 * 2. Interweaving eliminates need for map
 * 3. Must handle null pointers carefully
 * 4. Deep copy means new memory allocation
 * 5. Two-pass approach is most intuitive
 * 
 * INTERWEAVING TECHNIQUE:
 * - Insert copy after each original node
 * - Original: A -> B -> C
 * - After: A -> A' -> B -> B' -> C -> C'
 * - A'->random = A->random->next (if exists)
 * - Separate lists at end
 * - O(1) space, O(n) time
 * 
 * WHY INTERWEAVING WORKS:
 * - Copy is always next to original
 * - Can access copy via original->next
 * - Random pointer: original->random->next gives copy
 * - No need for hash map lookup
 * - Clever use of existing structure
 */

// Made with Bob
