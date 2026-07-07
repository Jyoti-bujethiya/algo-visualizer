/*
 * LeetCode Problem #94: Binary Tree Inorder Traversal
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/binary-tree-inorder-traversal/
 * 
 * Problem Statement:
 * Given the root of a binary tree, return the inorder traversal of its nodes' values.
 * Inorder traversal visits nodes in the order: Left -> Root -> Right
 */

#include <vector>
#include <stack>
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
    // ==================== APPROACH 1: Recursive ====================
    /*
     * Algorithm:
     * - Recursively traverse left subtree
     * - Visit root
     * - Recursively traverse right subtree
     * 
     * Time Complexity: O(n) - visit each node once
     * Space Complexity: O(h) - recursion stack, h = height
     * 
     * When to use: Simple and intuitive, good for interviews
     * 
     * Key Insight:
     * - Inorder: Left -> Root -> Right
     * - Natural recursive structure
     * - Base case: null node
     */
    void inorderHelper(TreeNode* root, vector<int>& result) {
        if (root == nullptr) {
            return;
        }
        
        inorderHelper(root->left, result);   // Left
        result.push_back(root->val);         // Root
        inorderHelper(root->right, result);  // Right
    }
    
    vector<int> inorderTraversal_Recursive(TreeNode* root) {
        vector<int> result;
        inorderHelper(root, result);
        return result;
    }
    
    // ==================== APPROACH 2: Iterative with Stack ====================
    /*
     * Algorithm:
     * - Use stack to simulate recursion
     * - Go left as far as possible, pushing nodes
     * - Pop node, add to result, go right
     * - Repeat until stack empty and no more nodes
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(h) - stack space
     * 
     * When to use: When recursion not allowed or preferred
     * 
     * Key Insight:
     * - Stack simulates call stack
     * - Push all left nodes first
     * - Process node when popped
     * - Then process right subtree
     */
    vector<int> inorderTraversal_Iterative(TreeNode* root) {
        vector<int> result;
        stack<TreeNode*> st;
        TreeNode* current = root;
        
        while (current != nullptr || !st.empty()) {
            // Go to leftmost node
            while (current != nullptr) {
                st.push(current);
                current = current->left;
            }
            
            // Process node
            current = st.top();
            st.pop();
            result.push_back(current->val);
            
            // Go to right subtree
            current = current->right;
        }
        
        return result;
    }
    
    // ==================== APPROACH 3: Morris Traversal (Optimal Space) ====================
    /*
     * Algorithm:
     * - Use threaded binary tree concept
     * - Create temporary links to traverse without stack
     * - For each node, find inorder predecessor
     * - Create thread from predecessor to current
     * - Remove thread after processing
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1) - no extra space!
     * 
     * When to use: When O(1) space is required
     * 
     * Key Insight:
     * - Temporarily modify tree structure
     * - Use rightmost node of left subtree as predecessor
     * - Thread points back to current node
     * - Restore tree structure after traversal
     */
    vector<int> inorderTraversal_Morris(TreeNode* root) {
        vector<int> result;
        TreeNode* current = root;
        
        while (current != nullptr) {
            if (current->left == nullptr) {
                // No left subtree, process current and go right
                result.push_back(current->val);
                current = current->right;
            } else {
                // Find inorder predecessor
                TreeNode* predecessor = current->left;
                while (predecessor->right != nullptr && 
                       predecessor->right != current) {
                    predecessor = predecessor->right;
                }
                
                if (predecessor->right == nullptr) {
                    // Create thread
                    predecessor->right = current;
                    current = current->left;
                } else {
                    // Thread exists, remove it and process current
                    predecessor->right = nullptr;
                    result.push_back(current->val);
                    current = current->right;
                }
            }
        }
        
        return result;
    }
    
    // ==================== APPROACH 4: Iterative with Color Marking ====================
    /*
     * Algorithm:
     * - Use stack with color marking (white/gray)
     * - White: not visited, Gray: visited
     * - Push nodes in reverse order (right, root, left)
     * - Process gray nodes by adding to result
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(h)
     * 
     * When to use: Unified approach for all traversals
     * 
     * Key Insight:
     * - Color marking tracks visit state
     * - Can easily adapt for preorder/postorder
     * - Push in reverse order of processing
     */
    vector<int> inorderTraversal_ColorMarking(TreeNode* root) {
        vector<int> result;
        if (root == nullptr) return result;
        
        stack<pair<TreeNode*, bool>> st;  // (node, isVisited)
        st.push({root, false});
        
        while (!st.empty()) {
            auto [node, visited] = st.top();
            st.pop();
            
            if (node == nullptr) continue;
            
            if (visited) {
                // Already visited, add to result
                result.push_back(node->val);
            } else {
                // Not visited, push in reverse order: right, root, left
                st.push({node->right, false});
                st.push({node, true});  // Mark as visited
                st.push({node->left, false});
            }
        }
        
        return result;
    }
    
    // Main function (uses recursive by default)
    vector<int> inorderTraversal(TreeNode* root) {
        return inorderTraversal_Recursive(root);
    }
};

// ==================== HELPER FUNCTIONS ====================
TreeNode* createTree(vector<int>& vals, int index) {
    if (index >= vals.size() || vals[index] == -1) {
        return nullptr;
    }
    
    TreeNode* root = new TreeNode(vals[index]);
    root->left = createTree(vals, 2 * index + 1);
    root->right = createTree(vals, 2 * index + 2);
    return root;
}

void deleteTree(TreeNode* root) {
    if (root == nullptr) return;
    deleteTree(root->left);
    deleteTree(root->right);
    delete root;
}

void printVector(const vector<int>& vec) {
    cout << "[";
    for (int i = 0; i < vec.size(); i++) {
        cout << vec[i];
        if (i < vec.size() - 1) cout << ",";
    }
    cout << "]" << endl;
}

// ==================== TEST CASES ====================
void runTests() {
    Solution sol;
    
    // Test Case 1: Standard tree
    //       1
    //        \
    //         2
    //        /
    //       3
    vector<int> vals1 = {1, -1, 2, -1, -1, 3};
    TreeNode* root1 = new TreeNode(1);
    root1->right = new TreeNode(2);
    root1->right->left = new TreeNode(3);
    cout << "Test 1: ";
    printVector(sol.inorderTraversal(root1));
    deleteTree(root1);
    // Expected: [1,3,2]
    
    // Test Case 2: Empty tree
    TreeNode* root2 = nullptr;
    cout << "Test 2: ";
    printVector(sol.inorderTraversal(root2));
    // Expected: []
    
    // Test Case 3: Single node
    TreeNode* root3 = new TreeNode(1);
    cout << "Test 3: ";
    printVector(sol.inorderTraversal(root3));
    deleteTree(root3);
    // Expected: [1]
    
    // Test Case 4: Complete binary tree
    //       1
    //      / \
    //     2   3
    //    / \
    //   4   5
    TreeNode* root4 = new TreeNode(1);
    root4->left = new TreeNode(2);
    root4->right = new TreeNode(3);
    root4->left->left = new TreeNode(4);
    root4->left->right = new TreeNode(5);
    cout << "Test 4: ";
    printVector(sol.inorderTraversal(root4));
    deleteTree(root4);
    // Expected: [4,2,5,1,3]
    
    // Test Case 5: Left-skewed tree
    TreeNode* root5 = new TreeNode(3);
    root5->left = new TreeNode(2);
    root5->left->left = new TreeNode(1);
    cout << "Test 5: ";
    printVector(sol.inorderTraversal(root5));
    deleteTree(root5);
    // Expected: [1,2,3]
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. Recursive (RECOMMENDED for interviews):
 *    Time: O(n), Space: O(h)
 *    Simple, intuitive, easy to implement
 * 
 * 2. Iterative with Stack:
 *    Time: O(n), Space: O(h)
 *    Good when recursion not allowed
 * 
 * 3. Morris Traversal (OPTIMAL space):
 *    Time: O(n), Space: O(1)
 *    Complex but achieves O(1) space
 * 
 * 4. Color Marking:
 *    Time: O(n), Space: O(h)
 *    Unified approach for all traversals
 * 
 * INTERVIEW TIPS:
 * - Start with recursive solution (simplest)
 * - Explain inorder: Left -> Root -> Right
 * - Draw tree and show traversal order
 * - Mention iterative solution as follow-up
 * - Discuss Morris traversal if asked about O(1) space
 * - Compare with preorder and postorder
 * - Explain use cases (BST gives sorted order)
 * 
 * KEY INSIGHTS:
 * - Inorder of BST gives sorted sequence
 * - Recursive solution mirrors definition
 * - Stack simulates recursion call stack
 * - Morris uses threading to avoid stack
 * - All approaches visit each node exactly once
 * 
 * STEP-BY-STEP for tree [1,null,2,3]:
 * 
 *     1
 *      \
 *       2
 *      /
 *     3
 * 
 * Recursive:
 * 1. Visit left of 1 (null)
 * 2. Process 1 -> [1]
 * 3. Visit right of 1 (node 2)
 * 4. Visit left of 2 (node 3)
 * 5. Visit left of 3 (null)
 * 6. Process 3 -> [1,3]
 * 7. Visit right of 3 (null)
 * 8. Process 2 -> [1,3,2]
 * 9. Visit right of 2 (null)
 * 
 * COMMON MISTAKES:
 * - Confusing inorder with preorder/postorder
 * - Not handling null nodes
 * - Incorrect stack operations in iterative
 * - Memory leaks in Morris (not removing threads)
 * - Wrong order in color marking approach
 * - Not considering empty tree
 * - Forgetting to go right after processing node
 * 
 * FOLLOW-UP QUESTIONS:
 * - Implement preorder traversal? (Root -> Left -> Right)
 * - Implement postorder traversal? (Left -> Right -> Root)
 * - Find kth smallest in BST? (Use inorder)
 * - Verify if tree is BST? (Check inorder is sorted)
 * - Can you do it without recursion? (Iterative/Morris)
 * 
 * RELATED PROBLEMS:
 * - Binary Tree Preorder Traversal (LeetCode #144)
 * - Binary Tree Postorder Traversal (LeetCode #145)
 * - Binary Tree Level Order Traversal (LeetCode #102)
 * - Kth Smallest Element in BST (LeetCode #230)
 * - Validate Binary Search Tree (LeetCode #98)
 * 
 * TRAVERSAL COMPARISON:
 * 
 * Tree:     1
 *          / \
 *         2   3
 *        / \
 *       4   5
 * 
 * Inorder:   [4, 2, 5, 1, 3]  (Left-Root-Right)
 * Preorder:  [1, 2, 4, 5, 3]  (Root-Left-Right)
 * Postorder: [4, 5, 2, 3, 1]  (Left-Right-Root)
 * 
 * USE CASES:
 * - Inorder: Get sorted sequence from BST
 * - Preorder: Copy tree structure
 * - Postorder: Delete tree, evaluate expression tree
 */

// Made with Bob
