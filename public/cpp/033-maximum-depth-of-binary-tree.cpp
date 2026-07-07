/*
 * LeetCode Problem #104: Maximum Depth of Binary Tree
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/maximum-depth-of-binary-tree/
 * 
 * Problem Statement:
 * Given the root of a binary tree, return its maximum depth.
 * 
 * A binary tree's maximum depth is the number of nodes along the longest path
 * from the root node down to the farthest leaf node.
 * 
 * Example:
 * Input: root = [3,9,20,null,null,15,7]
 *     3
 *    / \
 *   9  20
 *     /  \
 *    15   7
 * Output: 3
 */

#include <queue>
#include <algorithm>
#include <iostream>
using namespace std;

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
    // ==================== APPROACH 1: Recursive DFS ====================
    /*
     * Algorithm:
     * - Recursively calculate depth of left and right subtrees
     * - Return 1 + max(left_depth, right_depth)
     * - Base case: null node has depth 0
     * 
     * Time Complexity: O(n) - visit each node once
     * Space Complexity: O(h) - recursion stack, h = height
     * 
     * When to use: This is the STANDARD solution
     * 
     * Key Insight:
     * - Depth of tree = 1 + max depth of subtrees
     * - Natural recursive definition
     * - Clean and elegant
     */
    int maxDepth(TreeNode* root) {
        if (root == nullptr) {
            return 0;
        }
        
        int leftDepth = maxDepth(root->left);
        int rightDepth = maxDepth(root->right);
        
        return 1 + max(leftDepth, rightDepth);
    }
    
    // ==================== APPROACH 2: BFS (Level Order) ====================
    /*
     * Algorithm:
     * - Use queue for level-order traversal
     * - Count number of levels
     * - Each level increments depth
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(w) - w is max width
     * 
     * When to use: When iterative solution preferred
     * 
     * Key Insight:
     * - BFS naturally processes level by level
     * - Number of levels = depth
     * - No recursion needed
     */
    int maxDepth_BFS(TreeNode* root) {
        if (root == nullptr) {
            return 0;
        }
        
        queue<TreeNode*> q;
        q.push(root);
        int depth = 0;
        
        while (!q.empty()) {
            int levelSize = q.size();
            depth++;
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();
                
                if (node->left != nullptr) {
                    q.push(node->left);
                }
                if (node->right != nullptr) {
                    q.push(node->right);
                }
            }
        }
        
        return depth;
    }
    
    // ==================== APPROACH 3: DFS with Stack (Iterative) ====================
    /*
     * Algorithm:
     * - Use stack to simulate recursion
     * - Track depth for each node
     * - Update maximum depth seen
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(h)
     * 
     * When to use: When recursion not allowed
     * 
     * Key Insight:
     * - Explicit stack replaces recursion
     * - Track depth alongside nodes
     * - Preorder traversal approach
     */
    int maxDepth_DFS_Stack(TreeNode* root) {
        if (root == nullptr) {
            return 0;
        }
        
        stack<pair<TreeNode*, int>> stk;
        stk.push({root, 1});
        int maxDepth = 0;
        
        while (!stk.empty()) {
            auto [node, depth] = stk.top();
            stk.pop();
            
            maxDepth = max(maxDepth, depth);
            
            if (node->right != nullptr) {
                stk.push({node->right, depth + 1});
            }
            if (node->left != nullptr) {
                stk.push({node->left, depth + 1});
            }
        }
        
        return maxDepth;
    }
    
    // ==================== APPROACH 4: Morris Traversal ====================
    /*
     * Algorithm:
     * - Use Morris traversal for O(1) space
     * - Track depth during traversal
     * - No recursion or stack needed
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     * 
     * When to use: When O(1) space required
     * 
     * Key Insight:
     * - Threaded binary tree concept
     * - Temporarily modify tree structure
     * - Restore tree after traversal
     */
    int maxDepth_Morris(TreeNode* root) {
        if (root == nullptr) {
            return 0;
        }
        
        int maxDepth = 0;
        int currentDepth = 0;
        TreeNode* current = root;
        
        while (current != nullptr) {
            if (current->left == nullptr) {
                currentDepth++;
                maxDepth = max(maxDepth, currentDepth);
                current = current->right;
            } else {
                // Find predecessor
                TreeNode* predecessor = current->left;
                int steps = 1;
                
                while (predecessor->right != nullptr && 
                       predecessor->right != current) {
                    predecessor = predecessor->right;
                    steps++;
                }
                
                if (predecessor->right == nullptr) {
                    // Create thread
                    currentDepth++;
                    predecessor->right = current;
                    current = current->left;
                } else {
                    // Remove thread
                    predecessor->right = nullptr;
                    currentDepth -= steps;
                    current = current->right;
                }
            }
        }
        
        return maxDepth;
    }
    
    // ==================== APPROACH 5: Tail Recursion Optimized ====================
    /*
     * Algorithm:
     * - Use tail recursion with accumulator
     * - Pass current depth as parameter
     * - Update maximum in each call
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(h)
     * 
     * When to use: For tail recursion optimization
     * 
     * Key Insight:
     * - Tail recursion can be optimized by compiler
     * - Accumulator pattern
     * - Still uses stack space in practice
     */
    int maxDepth_TailRecursion(TreeNode* root) {
        int result = 0;
        maxDepthHelper(root, 1, result);
        return result;
    }
    
private:
    void maxDepthHelper(TreeNode* node, int depth, int& maxDepth) {
        if (node == nullptr) {
            return;
        }
        
        maxDepth = max(maxDepth, depth);
        maxDepthHelper(node->left, depth + 1, maxDepth);
        maxDepthHelper(node->right, depth + 1, maxDepth);
    }
};

// ==================== TEST CASES ====================
void runTests() {
    Solution sol;
    
    // Test Case 1: Standard tree
    // Input: [3,9,20,null,null,15,7]
    //     3
    //    / \
    //   9  20
    //     /  \
    //    15   7
    // Expected: 3
    cout << "Test Case 1: Standard tree\n";
    TreeNode* root1 = new TreeNode(3);
    root1->left = new TreeNode(9);
    root1->right = new TreeNode(20);
    root1->right->left = new TreeNode(15);
    root1->right->right = new TreeNode(7);
    cout << "Output: " << sol.maxDepth(root1) << "\n";
    cout << "Expected: 3\n\n";
    
    // Test Case 2: Single node
    // Input: [1]
    // Expected: 1
    cout << "Test Case 2: Single node\n";
    TreeNode* root2 = new TreeNode(1);
    cout << "Output: " << sol.maxDepth_BFS(root2) << "\n";
    cout << "Expected: 1\n\n";
    
    // Test Case 3: Empty tree
    // Input: []
    // Expected: 0
    cout << "Test Case 3: Empty tree\n";
    TreeNode* root3 = nullptr;
    cout << "Output: " << sol.maxDepth_DFS_Stack(root3) << "\n";
    cout << "Expected: 0\n\n";
    
    // Test Case 4: Left-skewed tree
    // Input: [1,2,null,3]
    //   1
    //  /
    // 2
    // /
    //3
    // Expected: 3
    cout << "Test Case 4: Left-skewed tree\n";
    TreeNode* root4 = new TreeNode(1);
    root4->left = new TreeNode(2);
    root4->left->left = new TreeNode(3);
    cout << "Output: " << sol.maxDepth_Morris(root4) << "\n";
    cout << "Expected: 3\n\n";
    
    // Test Case 5: Right-skewed tree
    // Input: [1,null,2,null,3]
    // 1
    //  \
    //   2
    //    \
    //     3
    // Expected: 3
    cout << "Test Case 5: Right-skewed tree\n";
    TreeNode* root5 = new TreeNode(1);
    root5->right = new TreeNode(2);
    root5->right->right = new TreeNode(3);
    cout << "Output: " << sol.maxDepth_TailRecursion(root5) << "\n";
    cout << "Expected: 3\n\n";
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. Recursive DFS (RECOMMENDED):
 *    Time: O(n), Space: O(h)
 *    Pros: Clean, elegant, natural
 *    Cons: Stack overflow for very deep trees
 *    Best for: Most interview scenarios
 * 
 * 2. BFS Level Order:
 *    Time: O(n), Space: O(w)
 *    Pros: Iterative, counts levels directly
 *    Cons: More space for wide trees
 *    Best for: When iterative preferred
 * 
 * 3. DFS with Stack:
 *    Time: O(n), Space: O(h)
 *    Pros: No recursion
 *    Cons: More complex than recursive
 *    Best for: When recursion not allowed
 * 
 * 4. Morris Traversal:
 *    Time: O(n), Space: O(1)
 *    Pros: Constant space
 *    Cons: Complex, temporarily modifies tree
 *    Best for: When O(1) space required
 * 
 * 5. Tail Recursion:
 *    Time: O(n), Space: O(h)
 *    Pros: Tail recursion pattern
 *    Cons: Not truly optimized in most languages
 *    Best for: Academic interest
 * 
 * INTERVIEW TIPS:
 * - Start with recursive solution (simplest)
 * - Explain base case clearly
 * - Discuss recursion tree
 * - Mention BFS alternative
 * - Consider space complexity
 * - Handle edge cases: null, single node
 * - Discuss balanced vs skewed trees
 * - Mention Morris for O(1) space
 * - Consider follow-up: minimum depth
 * - Discuss height vs depth terminology
 * 
 * KEY INSIGHTS:
 * - Depth = 1 + max(left_depth, right_depth)
 * - Recursive definition is natural
 * - BFS counts levels directly
 * - Space depends on tree shape
 * - Balanced tree: O(log n) space
 * - Skewed tree: O(n) space
 * 
 * STEP-BY-STEP WALKTHROUGH:
 * Tree: [3,9,20,null,null,15,7]
 *     3
 *    / \
 *   9  20
 *     /  \
 *    15   7
 * 
 * maxDepth(3):
 *   leftDepth = maxDepth(9):
 *     leftDepth = maxDepth(null) = 0
 *     rightDepth = maxDepth(null) = 0
 *     return 1 + max(0,0) = 1
 *   
 *   rightDepth = maxDepth(20):
 *     leftDepth = maxDepth(15):
 *       return 1 + max(0,0) = 1
 *     rightDepth = maxDepth(7):
 *       return 1 + max(0,0) = 1
 *     return 1 + max(1,1) = 2
 *   
 *   return 1 + max(1,2) = 3
 * 
 * COMMON MISTAKES:
 * - Confusing depth with height
 * - Not handling null root
 * - Off-by-one errors in counting
 * - Forgetting base case
 * - Not considering skewed trees
 * - Stack overflow with deep recursion
 * - Incorrect BFS level counting
 * - Memory leaks from not deleting nodes
 * - Confusing max with min depth
 * - Not considering empty tree
 * 
 * FOLLOW-UP QUESTIONS:
 * - How would you find minimum depth?
 * - How would you check if tree is balanced?
 * - Can you do it with O(1) space?
 * - How would you find diameter of tree?
 * - What if tree is n-ary instead of binary?
 * 
 * RELATED PROBLEMS:
 * - LeetCode #111: Minimum Depth of Binary Tree
 * - LeetCode #110: Balanced Binary Tree
 * - LeetCode #543: Diameter of Binary Tree
 * - LeetCode #559: Maximum Depth of N-ary Tree
 * - LeetCode #662: Maximum Width of Binary Tree
 */

// Made with Bob
