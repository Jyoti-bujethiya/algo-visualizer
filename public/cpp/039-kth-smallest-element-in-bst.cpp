/*
 * Problem: Kth Smallest Element in a BST
 * LeetCode: https://leetcode.com/problems/kth-smallest-element-in-a-bst/
 * 
 * Description:
 * Given the root of a binary search tree, and an integer k, return the kth smallest value
 * (1-indexed) of all the values of the nodes in the tree.
 * 
 * Example 1:
 * Input: root = [3,1,4,null,2], k = 1
 *        3
 *       / \
 *      1   4
 *       \
 *        2
 * Output: 1
 * 
 * Example 2:
 * Input: root = [5,3,6,2,4,null,null,1], k = 3
 *        5
 *       / \
 *      3   6
 *     / \
 *    2   4
 *   /
 *  1
 * Output: 3
 * 
 * Constraints:
 * - The number of nodes in the tree is n.
 * - 1 <= k <= n <= 10^4
 * - 0 <= Node.val <= 10^4
 * 
 * Follow up: If the BST is modified often (insert/delete operations) and you need to find
 * the kth smallest frequently, how would you optimize?
 * 
 * Difficulty: Medium
 * Topics: Tree, Depth-First Search, Binary Search Tree, Binary Tree
 */

#include <iostream>
#include <vector>
#include <stack>
using namespace std;

// Definition for a binary tree node
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution {
public:
    /*
     * Approach 1: Inorder Traversal (Recursive)
     * 
     * Intuition:
     * - Inorder traversal of BST gives sorted order
     * - Traverse left, visit node, traverse right
     * - Count nodes visited, return kth node
     * 
     * Algorithm:
     * 1. Perform inorder traversal
     * 2. Keep counter of visited nodes
     * 3. When counter reaches k, return current value
     * 4. Use helper function with counter reference
     * 
     * Time Complexity: O(k) - stop after k nodes
     * Space Complexity: O(h) - recursion stack, h = height
     */
    int result;
    int count;
    
    void inorder(TreeNode* node, int k) {
        if (!node || count >= k) return;
        
        // Traverse left subtree
        inorder(node->left, k);
        
        // Visit current node
        count++;
        if (count == k) {
            result = node->val;
            return;
        }
        
        // Traverse right subtree
        inorder(node->right, k);
    }
    
    int kthSmallest_recursive(TreeNode* root, int k) {
        count = 0;
        inorder(root, k);
        return result;
    }
    
    /*
     * Approach 2: Iterative Inorder Traversal
     * 
     * Intuition:
     * - Use stack to simulate recursion
     * - Go left as far as possible
     * - Pop and count, then go right
     * 
     * Algorithm:
     * 1. Push all left nodes to stack
     * 2. Pop node, increment counter
     * 3. If counter == k, return value
     * 4. Move to right child
     * 5. Repeat
     * 
     * Time Complexity: O(h + k) where h = height
     * Space Complexity: O(h) - stack
     */
    int kthSmallest_iterative(TreeNode* root, int k) {
        stack<TreeNode*> st;
        TreeNode* curr = root;
        int count = 0;
        
        while (curr || !st.empty()) {
            // Go to leftmost node
            while (curr) {
                st.push(curr);
                curr = curr->left;
            }
            
            // Process current node
            curr = st.top();
            st.pop();
            count++;
            
            if (count == k) {
                return curr->val;
            }
            
            // Move to right subtree
            curr = curr->right;
        }
        
        return -1;  // Should never reach here
    }
    
    /*
     * Approach 3: Store Inorder in Array
     * 
     * Intuition:
     * - Collect all values in sorted order
     * - Return kth element from array
     * - Simple but uses O(n) space
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     */
    void inorderArray(TreeNode* node, vector<int>& values) {
        if (!node) return;
        inorderArray(node->left, values);
        values.push_back(node->val);
        inorderArray(node->right, values);
    }
    
    int kthSmallest_array(TreeNode* root, int k) {
        vector<int> values;
        inorderArray(root, values);
        return values[k - 1];
    }
    
    /*
     * Approach 4: Morris Traversal (O(1) Space)
     * 
     * Intuition:
     * - Inorder traversal without recursion or stack
     * - Use threaded binary tree concept
     * - Temporarily modify tree structure
     * 
     * Algorithm:
     * 1. If no left child, visit and go right
     * 2. If left child exists:
     *    - Find inorder predecessor
     *    - Create thread or remove thread
     *    - Move accordingly
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    int kthSmallest_morris(TreeNode* root, int k) {
        TreeNode* curr = root;
        int count = 0;
        
        while (curr) {
            if (!curr->left) {
                // No left child, visit current
                count++;
                if (count == k) {
                    return curr->val;
                }
                curr = curr->right;
            } else {
                // Find inorder predecessor
                TreeNode* pred = curr->left;
                while (pred->right && pred->right != curr) {
                    pred = pred->right;
                }
                
                if (!pred->right) {
                    // Create thread
                    pred->right = curr;
                    curr = curr->left;
                } else {
                    // Remove thread and visit
                    pred->right = nullptr;
                    count++;
                    if (count == k) {
                        return curr->val;
                    }
                    curr = curr->right;
                }
            }
        }
        
        return -1;
    }
    
    /*
     * Approach 5: With Augmented BST (Follow-up)
     * 
     * Intuition:
     * - Store subtree size in each node
     * - Can find kth element in O(h) time
     * - Good for frequent queries
     * 
     * Algorithm:
     * 1. Each node stores left subtree size
     * 2. If k <= leftSize, search left
     * 3. If k == leftSize + 1, return current
     * 4. If k > leftSize + 1, search right with k - leftSize - 1
     * 
     * Time Complexity: O(h) per query
     * Space Complexity: O(n) for storing sizes
     * Note: Requires modifying tree structure
     */
    
    /*
     * Approach 6: Standard Solution (Most Common)
     * 
     * This is the most commonly used approach in interviews
     * Iterative inorder traversal
     * 
     * Time Complexity: O(h + k)
     * Space Complexity: O(h)
     */
    int kthSmallest(TreeNode* root, int k) {
        return kthSmallest_iterative(root, k);
    }
};

/*
 * Helper functions for testing
 */
TreeNode* createTree1() {
    TreeNode* root = new TreeNode(3);
    root->left = new TreeNode(1);
    root->right = new TreeNode(4);
    root->left->right = new TreeNode(2);
    return root;
}

TreeNode* createTree2() {
    TreeNode* root = new TreeNode(5);
    root->left = new TreeNode(3);
    root->right = new TreeNode(6);
    root->left->left = new TreeNode(2);
    root->left->right = new TreeNode(4);
    root->left->left->left = new TreeNode(1);
    return root;
}

void deleteTree(TreeNode* root) {
    if (!root) return;
    deleteTree(root->left);
    deleteTree(root->right);
    delete root;
}

/*
 * Test Cases
 */
void runTests() {
    Solution sol;
    
    // Test Case 1: Small tree
    cout << "Test 1 - Tree: [3,1,4,null,2], k=1" << endl;
    TreeNode* tree1 = createTree1();
    cout << "Recursive: " << sol.kthSmallest_recursive(tree1, 1) << endl;
    cout << "Iterative: " << sol.kthSmallest_iterative(tree1, 1) << endl;
    cout << "Array: " << sol.kthSmallest_array(tree1, 1) << endl;
    cout << "Morris: " << sol.kthSmallest_morris(tree1, 1) << endl;
    cout << "Expected: 1" << endl << endl;
    
    // Test Case 2: Larger tree
    cout << "Test 2 - Tree: [5,3,6,2,4,null,null,1], k=3" << endl;
    TreeNode* tree2 = createTree2();
    cout << "Result: " << sol.kthSmallest(tree2, 3) << endl;
    cout << "Expected: 3" << endl << endl;
    
    // Test Case 3: k = 1 (minimum)
    cout << "Test 3 - k=1 (minimum element)" << endl;
    TreeNode* tree3 = createTree2();
    cout << "Result: " << sol.kthSmallest(tree3, 1) << endl;
    cout << "Expected: 1" << endl << endl;
    
    // Test Case 4: k = n (maximum)
    cout << "Test 4 - k=6 (maximum element)" << endl;
    TreeNode* tree4 = createTree2();
    cout << "Result: " << sol.kthSmallest(tree4, 6) << endl;
    cout << "Expected: 6" << endl << endl;
    
    // Test Case 5: Middle element
    cout << "Test 5 - k=4 (middle element)" << endl;
    TreeNode* tree5 = createTree2();
    cout << "Result: " << sol.kthSmallest(tree5, 4) << endl;
    cout << "Expected: 4" << endl << endl;
    
    // Cleanup
    deleteTree(tree1);
    deleteTree(tree2);
    deleteTree(tree3);
    deleteTree(tree4);
    deleteTree(tree5);
}

int main() {
    cout << "Kth Smallest Element in BST - Multiple Approaches" << endl;
    cout << "==================================================" << endl << endl;
    
    runTests();
    
    return 0;
}

/*
 * Complexity Analysis Summary:
 * 
 * Approach 1 (Recursive Inorder):
 * - Time: O(k) - stop after k nodes
 * - Space: O(h) - recursion stack
 * - Clean and intuitive
 * 
 * Approach 2 (Iterative Inorder):
 * - Time: O(h + k)
 * - Space: O(h) - stack
 * - BEST for interviews: no recursion
 * 
 * Approach 3 (Array):
 * - Time: O(n)
 * - Space: O(n)
 * - Simple but inefficient
 * 
 * Approach 4 (Morris):
 * - Time: O(n)
 * - Space: O(1)
 * - Most space-efficient
 * 
 * Key Insights:
 * 1. Inorder traversal of BST gives sorted order
 * 2. Can stop after k nodes (don't need full traversal)
 * 3. Iterative approach avoids recursion overhead
 * 4. Morris traversal achieves O(1) space
 * 5. BST property: left < root < right
 * 
 * Why Inorder Works:
 * - BST property ensures left subtree < root < right subtree
 * - Inorder visits nodes in ascending order
 * - Kth node visited is kth smallest
 * 
 * Inorder Traversal Order:
 *        5
 *       / \
 *      3   6
 *     / \
 *    2   4
 *   /
 *  1
 * 
 * Order: 1, 2, 3, 4, 5, 6
 * k=3 returns 3
 * 
 * Common Pitfalls:
 * 1. Forgetting BST property (inorder gives sorted)
 * 2. Traversing entire tree when k is small
 * 3. Off-by-one errors (k is 1-indexed)
 * 4. Not handling edge cases (k=1, k=n)
 * 5. Incorrect stack operations in iterative
 * 
 * Interview Tips:
 * 1. Start with iterative inorder (most common)
 * 2. Explain BST property and inorder traversal
 * 3. Mention can stop after k nodes
 * 4. Discuss Morris traversal for O(1) space
 * 5. Handle edge cases: k=1, k=n
 * 6. For follow-up, mention augmented BST
 * 7. Draw tree and show traversal order
 * 
 * Follow-up Optimization:
 * - Store subtree size in each node
 * - Can find kth in O(h) time
 * - Good for frequent queries
 * - Trade-off: O(n) space, O(h) insert/delete
 * 
 * Augmented BST Example:
 * Each node stores left subtree size
 *        5(3)
 *       /    \
 *     3(2)   6(0)
 *    /   \
 *  2(1)  4(0)
 *  /
 * 1(0)
 * 
 * To find k=3:
 * - At 5: leftSize=3, k=3, go left
 * - At 3: leftSize=2, k=3, go right (k-2-1=0)
 * - At 4: leftSize=0, k=0+1, return 4
 * 
 * Morris Traversal Explained:
 * - Create temporary threads to avoid stack
 * - Thread from predecessor to current
 * - Remove thread after visiting
 * - O(1) space but modifies tree temporarily
 * 
 * Time Complexity Comparison:
 * - Recursive/Iterative: O(h + k)
 * - Array: O(n)
 * - Morris: O(n)
 * - Augmented: O(h) per query
 * 
 * Space Complexity Comparison:
 * - Recursive: O(h) stack
 * - Iterative: O(h) stack
 * - Array: O(n)
 * - Morris: O(1)
 * - Augmented: O(n) for sizes
 * 
 * Real-World Applications:
 * 1. Database indexing (B-trees)
 * 2. Order statistics
 * 3. Median finding
 * 4. Percentile calculations
 * 5. Ranking systems
 * 
 * Extensions and Variations:
 * 1. Kth largest element (reverse inorder)
 * 2. Find median in BST
 * 3. Count smaller elements
 * 4. Range queries in BST
 * 5. Closest element to target
 * 
 * Related Problems:
 * - Kth Largest Element in Array
 * - Find Median from Data Stream
 * - Closest Binary Search Tree Value
 * - Inorder Successor in BST
 * - Binary Search Tree Iterator
 */

// Made with Bob
