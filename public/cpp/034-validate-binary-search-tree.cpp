/*
 * LeetCode Problem #98: Validate Binary Search Tree
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/validate-binary-search-tree/
 * 
 * Problem Statement:
 * Given the root of a binary tree, determine if it is a valid binary search tree (BST).
 * 
 * A valid BST is defined as follows:
 * - The left subtree of a node contains only nodes with keys less than the node's key.
 * - The right subtree of a node contains only nodes with keys greater than the node's key.
 * - Both the left and right subtrees must also be binary search trees.
 */

#include <vector>
#include <climits>
#include <iostream>
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
    // ==================== APPROACH 1: Recursive with Range (Optimal) ====================
    /*
     * Algorithm:
     * - Pass valid range [min, max] for each node
     * - Root can be any value: (-∞, +∞)
     * - Left child must be in (min, root.val)
     * - Right child must be in (root.val, max)
     * - Recursively validate all subtrees
     * 
     * Time Complexity: O(n) - visit each node once
     * Space Complexity: O(h) - recursion stack, h = height
     * 
     * When to use: This is the OPTIMAL solution
     * 
     * Key Insight:
     * - Each node has valid range based on ancestors
     * - Not just comparing with parent, but all ancestors
     * - Range narrows as we go deeper
     */
    bool isValidBSTHelper(TreeNode* node, long long minVal, long long maxVal) {
        if (node == nullptr) {
            return true;
        }
        
        // Check if current node violates BST property
        if (node->val <= minVal || node->val >= maxVal) {
            return false;
        }
        
        // Recursively validate left and right subtrees
        return isValidBSTHelper(node->left, minVal, node->val) &&
               isValidBSTHelper(node->right, node->val, maxVal);
    }
    
    bool isValidBST_Range(TreeNode* root) {
        return isValidBSTHelper(root, LLONG_MIN, LLONG_MAX);
    }
    
    // ==================== APPROACH 2: Inorder Traversal ====================
    /*
     * Algorithm:
     * - Perform inorder traversal
     * - BST inorder gives sorted sequence
     * - Track previous value
     * - If current <= previous, not a BST
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(h) - recursion stack
     * 
     * When to use: When you want to leverage BST property
     * 
     * Key Insight:
     * - Inorder of BST is strictly increasing
     * - Just need to verify sorted order
     * - Can stop early if violation found
     */
    bool inorderHelper(TreeNode* node, TreeNode*& prev) {
        if (node == nullptr) {
            return true;
        }
        
        // Check left subtree
        if (!inorderHelper(node->left, prev)) {
            return false;
        }
        
        // Check current node
        if (prev != nullptr && node->val <= prev->val) {
            return false;
        }
        prev = node;
        
        // Check right subtree
        return inorderHelper(node->right, prev);
    }
    
    bool isValidBST_Inorder(TreeNode* root) {
        TreeNode* prev = nullptr;
        return inorderHelper(root, prev);
    }
    
    // ==================== APPROACH 3: Inorder with Array ====================
    /*
     * Algorithm:
     * - Store inorder traversal in array
     * - Check if array is strictly increasing
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n) - array storage
     * 
     * When to use: Simpler to understand but uses more space
     * 
     * Key Insight:
     * - Separate traversal from validation
     * - Easy to understand and implement
     * - Uses extra space for array
     */
    void inorderToArray(TreeNode* node, vector<int>& values) {
        if (node == nullptr) return;
        
        inorderToArray(node->left, values);
        values.push_back(node->val);
        inorderToArray(node->right, values);
    }
    
    bool isValidBST_Array(TreeNode* root) {
        vector<int> values;
        inorderToArray(root, values);
        
        for (int i = 1; i < values.size(); i++) {
            if (values[i] <= values[i - 1]) {
                return false;
            }
        }
        
        return true;
    }
    
    // ==================== APPROACH 4: Iterative with Stack ====================
    /*
     * Algorithm:
     * - Iterative inorder traversal using stack
     * - Track previous value
     * - Validate during traversal
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(h) - stack space
     * 
     * When to use: When recursion not allowed
     * 
     * Key Insight:
     * - Iterative version of inorder approach
     * - Same logic, different implementation
     * - No recursion overhead
     */
    bool isValidBST_Iterative(TreeNode* root) {
        vector<TreeNode*> stack;
        TreeNode* current = root;
        TreeNode* prev = nullptr;
        
        while (current != nullptr || !stack.empty()) {
            // Go to leftmost node
            while (current != nullptr) {
                stack.push_back(current);
                current = current->left;
            }
            
            // Process node
            current = stack.back();
            stack.pop_back();
            
            // Validate
            if (prev != nullptr && current->val <= prev->val) {
                return false;
            }
            prev = current;
            
            // Go to right subtree
            current = current->right;
        }
        
        return true;
    }
    
    // Main function (uses range approach by default)
    bool isValidBST(TreeNode* root) {
        return isValidBST_Range(root);
    }
};

// ==================== HELPER FUNCTIONS ====================
void deleteTree(TreeNode* root) {
    if (root == nullptr) return;
    deleteTree(root->left);
    deleteTree(root->right);
    delete root;
}

// ==================== TEST CASES ====================
void runTests() {
    Solution sol;
    
    // Test Case 1: Valid BST
    //       2
    //      / \
    //     1   3
    TreeNode* root1 = new TreeNode(2);
    root1->left = new TreeNode(1);
    root1->right = new TreeNode(3);
    cout << "Test 1: " << (sol.isValidBST(root1) ? "true" : "false") << endl;
    deleteTree(root1);
    // Expected: true
    
    // Test Case 2: Invalid BST (right child of 1 is 6, violates BST)
    //       5
    //      / \
    //     1   4
    //        / \
    //       3   6
    TreeNode* root2 = new TreeNode(5);
    root2->left = new TreeNode(1);
    root2->right = new TreeNode(4);
    root2->right->left = new TreeNode(3);
    root2->right->right = new TreeNode(6);
    cout << "Test 2: " << (sol.isValidBST(root2) ? "true" : "false") << endl;
    deleteTree(root2);
    // Expected: false
    
    // Test Case 3: Single node
    TreeNode* root3 = new TreeNode(1);
    cout << "Test 3: " << (sol.isValidBST(root3) ? "true" : "false") << endl;
    deleteTree(root3);
    // Expected: true
    
    // Test Case 4: Invalid - duplicate values
    //       2
    //      / \
    //     2   2
    TreeNode* root4 = new TreeNode(2);
    root4->left = new TreeNode(2);
    root4->right = new TreeNode(2);
    cout << "Test 4: " << (sol.isValidBST(root4) ? "true" : "false") << endl;
    deleteTree(root4);
    // Expected: false
    
    // Test Case 5: Valid BST with negative numbers
    //       0
    //      /
    //    -1
    TreeNode* root5 = new TreeNode(0);
    root5->left = new TreeNode(-1);
    cout << "Test 5: " << (sol.isValidBST(root5) ? "true" : "false") << endl;
    deleteTree(root5);
    // Expected: true
    
    // Test Case 6: Edge case - INT_MIN and INT_MAX
    TreeNode* root6 = new TreeNode(INT_MAX);
    cout << "Test 6: " << (sol.isValidBST(root6) ? "true" : "false") << endl;
    deleteTree(root6);
    // Expected: true
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. Recursive with Range (RECOMMENDED):
 *    Time: O(n), Space: O(h)
 *    Most intuitive, directly checks BST property
 * 
 * 2. Inorder Traversal:
 *    Time: O(n), Space: O(h)
 *    Leverages BST property elegantly
 * 
 * 3. Inorder with Array:
 *    Time: O(n), Space: O(n)
 *    Simple but uses extra space
 * 
 * 4. Iterative with Stack:
 *    Time: O(n), Space: O(h)
 *    No recursion, same as approach 2
 * 
 * INTERVIEW TIPS:
 * - Clarify if duplicate values are allowed (usually not)
 * - Ask about value range (use long long for safety)
 * - Start with range-based approach
 * - Explain why comparing only with parent is wrong
 * - Draw example showing ancestor constraint
 * - Mention inorder approach as alternative
 * - Discuss space complexity trade-offs
 * - Handle edge cases: empty tree, single node, INT_MIN/MAX
 * 
 * KEY INSIGHTS:
 * - BST property must hold for ALL ancestors, not just parent
 * - Each node has valid range based on path from root
 * - Inorder traversal of BST is strictly increasing
 * - Must use strict inequality (no duplicates)
 * - Need long long to handle INT_MIN and INT_MAX
 * 
 * STEP-BY-STEP for tree [5,1,4,null,null,3,6]:
 * 
 *       5
 *      / \
 *     1   4
 *        / \
 *       3   6
 * 
 * Range approach:
 * - Node 5: range (-∞, +∞) ✓
 * - Node 1: range (-∞, 5) ✓
 * - Node 4: range (5, +∞) ✗ (4 < 5)
 * Result: false
 * 
 * Inorder approach:
 * - Inorder: [1, 5, 3, 4, 6]
 * - Not strictly increasing (5 > 3)
 * Result: false
 * 
 * COMMON MISTAKES:
 * - Only comparing with parent (misses ancestor constraints)
 * - Using int instead of long long (fails for INT_MIN/MAX)
 * - Allowing equal values (BST requires strict inequality)
 * - Not handling null nodes
 * - Forgetting to check both subtrees
 * - Using >= or <= instead of > or <
 * - Not considering negative numbers
 * 
 * FOLLOW-UP QUESTIONS:
 * - Find kth smallest element in BST? (Inorder traversal)
 * - Convert sorted array to BST? (Binary search approach)
 * - Recover BST with two swapped nodes? (Find violations)
 * - Check if tree is balanced BST? (Combine with height check)
 * - Find closest value in BST? (Binary search)
 * 
 * RELATED PROBLEMS:
 * - Kth Smallest Element in BST (LeetCode #230)
 * - Convert Sorted Array to BST (LeetCode #108)
 * - Recover Binary Search Tree (LeetCode #99)
 * - Closest Binary Search Tree Value (LeetCode #270)
 * - Inorder Successor in BST (LeetCode #285)
 * 
 * VISUALIZATION of why parent-only check fails:
 * 
 *       10
 *      /  \
 *     5   15
 *        /  \
 *       6   20
 * 
 * Node 6 is right child of 15 (6 < 15) ✓
 * But 6 is in right subtree of 10 (6 < 10) ✗
 * Must check against ALL ancestors!
 * 
 * RANGE PROPAGATION:
 * 
 *           10 (-∞, +∞)
 *          /            \
 *     5 (-∞, 10)    15 (10, +∞)
 *                   /           \
 *              6 (10, 15)   20 (15, +∞)
 *                 ✗ INVALID
 * 
 * Node 6 violates range (10, 15) because 6 < 10
 */

// Made with Bob
