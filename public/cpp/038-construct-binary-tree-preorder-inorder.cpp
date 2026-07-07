/*
 * Problem: Construct Binary Tree from Preorder and Inorder Traversal
 * LeetCode: https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
 * 
 * Description:
 * Given two integer arrays preorder and inorder where preorder is the preorder traversal of a
 * binary tree and inorder is the inorder traversal of the same tree, construct and return the
 * binary tree.
 * 
 * Example 1:
 * Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
 *        3
 *       / \
 *      9  20
 *        /  \
 *       15   7
 * Output: [3,9,20,null,null,15,7]
 * 
 * Example 2:
 * Input: preorder = [-1], inorder = [-1]
 * Output: [-1]
 * 
 * Constraints:
 * - 1 <= preorder.length <= 3000
 * - inorder.length == preorder.length
 * - -3000 <= preorder[i], inorder[i] <= 3000
 * - preorder and inorder consist of unique values.
 * - Each value of inorder also appears in preorder.
 * - preorder is guaranteed to be the preorder traversal of the tree.
 * - inorder is guaranteed to be the inorder traversal of the tree.
 * 
 * Difficulty: Medium
 * Topics: Array, Hash Table, Divide and Conquer, Tree, Binary Tree
 */

#include <iostream>
#include <vector>
#include <unordered_map>
#include <queue>
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
     * Approach 1: Recursive with Hash Map
     * 
     * Intuition:
     * - Preorder: [root | left subtree | right subtree]
     * - Inorder: [left subtree | root | right subtree]
     * - First element in preorder is always root
     * - Find root in inorder to split left and right subtrees
     * - Recursively build left and right subtrees
     * 
     * Key Insight:
     * - Preorder tells us the root
     * - Inorder tells us which nodes are in left vs right subtree
     * - Use hash map for O(1) lookup of root position in inorder
     * 
     * Algorithm:
     * 1. Build hash map: inorder value -> index
     * 2. First element in preorder is root
     * 3. Find root in inorder to determine subtree sizes
     * 4. Recursively build left subtree with:
     *    - preorder[1 : 1+leftSize]
     *    - inorder[0 : rootIndex]
     * 5. Recursively build right subtree with:
     *    - preorder[1+leftSize : end]
     *    - inorder[rootIndex+1 : end]
     * 
     * Time Complexity: O(n) - each node processed once
     * Space Complexity: O(n) - hash map + recursion stack
     */
    unordered_map<int, int> inorderMap;
    int preorderIndex;
    
    TreeNode* buildTreeHelper(vector<int>& preorder, int left, int right) {
        if (left > right) return nullptr;
        
        // Get root value from preorder
        int rootVal = preorder[preorderIndex++];
        TreeNode* root = new TreeNode(rootVal);
        
        // Find root position in inorder
        int inorderIndex = inorderMap[rootVal];
        
        // Build left and right subtrees
        root->left = buildTreeHelper(preorder, left, inorderIndex - 1);
        root->right = buildTreeHelper(preorder, inorderIndex + 1, right);
        
        return root;
    }
    
    TreeNode* buildTree_hashmap(vector<int>& preorder, vector<int>& inorder) {
        preorderIndex = 0;
        
        // Build hash map for inorder indices
        for (int i = 0; i < inorder.size(); i++) {
            inorderMap[inorder[i]] = i;
        }
        
        return buildTreeHelper(preorder, 0, inorder.size() - 1);
    }
    
    /*
     * Approach 2: Recursive without Hash Map
     * 
     * Intuition:
     * - Same logic but find root in inorder using linear search
     * - Simpler but slower
     * 
     * Time Complexity: O(n²) - O(n) for each node to find in inorder
     * Space Complexity: O(n) - recursion stack
     */
    TreeNode* buildTreeNoMap(vector<int>& preorder, vector<int>& inorder,
                             int preStart, int preEnd, int inStart, int inEnd) {
        if (preStart > preEnd || inStart > inEnd) {
            return nullptr;
        }
        
        int rootVal = preorder[preStart];
        TreeNode* root = new TreeNode(rootVal);
        
        // Find root in inorder
        int inorderIndex = inStart;
        while (inorder[inorderIndex] != rootVal) {
            inorderIndex++;
        }
        
        int leftSize = inorderIndex - inStart;
        
        root->left = buildTreeNoMap(preorder, inorder,
                                     preStart + 1, preStart + leftSize,
                                     inStart, inorderIndex - 1);
        root->right = buildTreeNoMap(preorder, inorder,
                                      preStart + leftSize + 1, preEnd,
                                      inorderIndex + 1, inEnd);
        
        return root;
    }
    
    TreeNode* buildTree_no_map(vector<int>& preorder, vector<int>& inorder) {
        return buildTreeNoMap(preorder, inorder, 0, preorder.size() - 1,
                              0, inorder.size() - 1);
    }
    
    /*
     * Approach 3: Iterative with Stack
     * 
     * Intuition:
     * - Use stack to track path from root
     * - Process preorder elements one by one
     * - Use inorder to determine when to pop from stack
     * 
     * Algorithm:
     * 1. Create root from first preorder element
     * 2. For each remaining preorder element:
     *    - If it matches inorder[inIndex], pop stack
     *    - Otherwise, add as left child
     * 3. Handle right children when popping
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n) - stack
     */
    TreeNode* buildTree_iterative(vector<int>& preorder, vector<int>& inorder) {
        if (preorder.empty()) return nullptr;
        
        TreeNode* root = new TreeNode(preorder[0]);
        stack<TreeNode*> st;
        st.push(root);
        
        int inIndex = 0;
        
        for (int i = 1; i < preorder.size(); i++) {
            TreeNode* node = new TreeNode(preorder[i]);
            TreeNode* parent = st.top();
            
            // If current preorder doesn't match inorder, go left
            if (parent->val != inorder[inIndex]) {
                parent->left = node;
            } else {
                // Pop until we find the right parent
                while (!st.empty() && st.top()->val == inorder[inIndex]) {
                    parent = st.top();
                    st.pop();
                    inIndex++;
                }
                parent->right = node;
            }
            
            st.push(node);
        }
        
        return root;
    }
    
    /*
     * Approach 4: Recursive with Explicit Ranges
     * 
     * Intuition:
     * - Pass array slices explicitly
     * - More intuitive but creates new vectors
     * 
     * Time Complexity: O(n²) - copying vectors
     * Space Complexity: O(n²) - new vectors
     */
    TreeNode* buildTree_slicing(vector<int>& preorder, vector<int>& inorder) {
        if (preorder.empty()) return nullptr;
        
        int rootVal = preorder[0];
        TreeNode* root = new TreeNode(rootVal);
        
        // Find root in inorder
        int rootIndex = 0;
        while (inorder[rootIndex] != rootVal) rootIndex++;
        
        // Create slices
        vector<int> leftPreorder(preorder.begin() + 1, 
                                 preorder.begin() + 1 + rootIndex);
        vector<int> leftInorder(inorder.begin(), 
                                inorder.begin() + rootIndex);
        vector<int> rightPreorder(preorder.begin() + 1 + rootIndex, 
                                  preorder.end());
        vector<int> rightInorder(inorder.begin() + rootIndex + 1, 
                                 inorder.end());
        
        root->left = buildTree_slicing(leftPreorder, leftInorder);
        root->right = buildTree_slicing(rightPreorder, rightInorder);
        
        return root;
    }
    
    /*
     * Approach 5: Standard Solution (Hash Map - Most Common)
     * 
     * This is the most commonly used approach in interviews
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     */
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        preorderIndex = 0;
        inorderMap.clear();
        
        for (int i = 0; i < inorder.size(); i++) {
            inorderMap[inorder[i]] = i;
        }
        
        return buildTreeHelper(preorder, 0, inorder.size() - 1);
    }
};

/*
 * Helper functions for testing
 */
void printTree(TreeNode* root, string prefix = "", bool isLeft = true) {
    if (!root) return;
    
    cout << prefix;
    cout << (isLeft ? "├──" : "└──");
    cout << root->val << endl;
    
    if (root->left || root->right) {
        if (root->left) {
            printTree(root->left, prefix + (isLeft ? "│   " : "    "), true);
        }
        if (root->right) {
            printTree(root->right, prefix + (isLeft ? "│   " : "    "), false);
        }
    }
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
    
    // Test Case 1: Standard tree
    cout << "Test 1 - Input: preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]" << endl;
    vector<int> pre1 = {3, 9, 20, 15, 7};
    vector<int> in1 = {9, 3, 15, 20, 7};
    
    TreeNode* result1a = sol.buildTree_hashmap(pre1, in1);
    cout << "Hash Map approach:" << endl;
    printTree(result1a);
    
    TreeNode* result1b = sol.buildTree_no_map(pre1, in1);
    cout << "No Map approach:" << endl;
    printTree(result1b);
    
    TreeNode* result1c = sol.buildTree(pre1, in1);
    cout << "Standard approach:" << endl;
    printTree(result1c);
    cout << endl;
    
    // Test Case 2: Single node
    cout << "Test 2 - Input: preorder=[-1], inorder=[-1]" << endl;
    vector<int> pre2 = {-1};
    vector<int> in2 = {-1};
    TreeNode* result2 = sol.buildTree(pre2, in2);
    printTree(result2);
    cout << endl;
    
    // Test Case 3: Linear tree (all left)
    cout << "Test 3 - Input: preorder=[1,2,3], inorder=[3,2,1]" << endl;
    vector<int> pre3 = {1, 2, 3};
    vector<int> in3 = {3, 2, 1};
    TreeNode* result3 = sol.buildTree(pre3, in3);
    printTree(result3);
    cout << endl;
    
    // Test Case 4: Linear tree (all right)
    cout << "Test 4 - Input: preorder=[1,2,3], inorder=[1,2,3]" << endl;
    vector<int> pre4 = {1, 2, 3};
    vector<int> in4 = {1, 2, 3};
    TreeNode* result4 = sol.buildTree(pre4, in4);
    printTree(result4);
    cout << endl;
    
    // Test Case 5: Balanced tree
    cout << "Test 5 - Input: preorder=[1,2,4,5,3,6,7], inorder=[4,2,5,1,6,3,7]" << endl;
    vector<int> pre5 = {1, 2, 4, 5, 3, 6, 7};
    vector<int> in5 = {4, 2, 5, 1, 6, 3, 7};
    TreeNode* result5 = sol.buildTree(pre5, in5);
    printTree(result5);
    cout << endl;
}

int main() {
    cout << "Construct Binary Tree from Preorder and Inorder Traversal" << endl;
    cout << "==========================================================" << endl << endl;
    
    runTests();
    
    return 0;
}

/*
 * Complexity Analysis Summary:
 * 
 * Approach 1 (Hash Map):
 * - Time: O(n) - each node processed once, O(1) lookup
 * - Space: O(n) - hash map + recursion stack
 * - BEST for interviews: optimal time complexity
 * 
 * Approach 2 (No Map):
 * - Time: O(n²) - O(n) to find each node in inorder
 * - Space: O(n) - recursion stack only
 * - Simpler but slower
 * 
 * Approach 3 (Iterative):
 * - Time: O(n)
 * - Space: O(n) - stack
 * - More complex but avoids recursion
 * 
 * Approach 4 (Slicing):
 * - Time: O(n²) - copying vectors
 * - Space: O(n²) - new vectors
 * - Most intuitive but inefficient
 * 
 * Key Insights:
 * 1. Preorder gives us root first
 * 2. Inorder splits tree into left and right subtrees
 * 3. Hash map enables O(1) root lookup
 * 4. Recursion naturally handles tree structure
 * 5. Must track indices carefully
 * 
 * Traversal Properties:
 * - Preorder: Root -> Left -> Right
 * - Inorder: Left -> Root -> Right
 * - Postorder: Left -> Right -> Root
 * 
 * Why This Works:
 * Example: preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]
 * 
 * 1. Root is 3 (first in preorder)
 * 2. Find 3 in inorder: [9 | 3 | 15,20,7]
 * 3. Left subtree: [9], Right subtree: [15,20,7]
 * 4. In preorder: [3 | 9 | 20,15,7]
 * 5. Recursively build left with [9] and [9]
 * 6. Recursively build right with [20,15,7] and [15,20,7]
 * 
 * Index Calculation:
 * - Root index in inorder: rootIndex
 * - Left subtree size: rootIndex - inStart
 * - Left preorder: [preStart+1, preStart+leftSize]
 * - Right preorder: [preStart+leftSize+1, preEnd]
 * - Left inorder: [inStart, rootIndex-1]
 * - Right inorder: [rootIndex+1, inEnd]
 * 
 * Common Pitfalls:
 * 1. Off-by-one errors in index calculations
 * 2. Not handling empty subtrees
 * 3. Forgetting to increment preorder index
 * 4. Incorrect subtree size calculation
 * 5. Not clearing hash map between test cases
 * 
 * Interview Tips:
 * 1. Start by explaining traversal properties
 * 2. Draw tree and show how preorder/inorder relate
 * 3. Explain why we need both traversals
 * 4. Walk through index calculations carefully
 * 5. Mention hash map optimization
 * 6. Handle edge cases: single node, linear tree
 * 7. Discuss time/space complexity
 * 
 * Why We Need Both Traversals:
 * - Preorder alone: can't determine structure
 * - Inorder alone: can't determine root
 * - Together: uniquely determine tree
 * 
 * Example Walkthrough:
 * preorder = [3,9,20,15,7]
 * inorder = [9,3,15,20,7]
 * 
 * Step 1: Root = 3
 *         3
 * 
 * Step 2: Find 3 in inorder
 *         Left: [9], Right: [15,20,7]
 * 
 * Step 3: Build left subtree
 *         3
 *        /
 *       9
 * 
 * Step 4: Build right subtree (root = 20)
 *         3
 *        / \
 *       9  20
 * 
 * Step 5: Continue recursively
 *         3
 *        / \
 *       9  20
 *         /  \
 *        15   7
 * 
 * Real-World Applications:
 * 1. Reconstructing tree from serialized data
 * 2. Database query optimization
 * 3. Compiler parse tree reconstruction
 * 4. File system recovery
 * 5. Network topology reconstruction
 * 
 * Extensions and Variations:
 * 1. Construct from inorder and postorder
 * 2. Construct from preorder and postorder (not unique)
 * 3. Construct BST from preorder only
 * 4. Verify if traversals are valid
 * 5. Count possible trees from traversals
 * 
 * Related Problems:
 * - Construct Binary Tree from Inorder and Postorder
 * - Construct Binary Search Tree from Preorder
 * - Verify Preorder Serialization of Binary Tree
 * - Serialize and Deserialize Binary Tree
 * - Recover Binary Search Tree
 */

// Made with Bob
