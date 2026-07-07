/*
 * LeetCode Problem #102: Binary Tree Level Order Traversal
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/binary-tree-level-order-traversal/
 * 
 * Problem Statement:
 * Given the root of a binary tree, return the level order traversal of its nodes' values.
 * (i.e., from left to right, level by level).
 */

#include <vector>
#include <queue>
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
    // ==================== APPROACH 1: BFS with Queue (Optimal) ====================
    /*
     * Algorithm:
     * - Use queue for breadth-first search
     * - Process nodes level by level
     * - Track level size to separate levels
     * - Add children to queue for next level
     * 
     * Time Complexity: O(n) - visit each node once
     * Space Complexity: O(w) - w is max width of tree
     * 
     * When to use: This is the OPTIMAL solution
     * 
     * Key Insight:
     * - Queue naturally processes nodes level by level
     * - Track current level size to group nodes
     * - Children added to queue for next iteration
     */
    vector<vector<int>> levelOrder_BFS(TreeNode* root) {
        vector<vector<int>> result;
        if (root == nullptr) return result;
        
        queue<TreeNode*> q;
        q.push(root);
        
        while (!q.empty()) {
            int levelSize = q.size();
            vector<int> currentLevel;
            
            // Process all nodes at current level
            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();
                currentLevel.push_back(node->val);
                
                // Add children for next level
                if (node->left != nullptr) {
                    q.push(node->left);
                }
                if (node->right != nullptr) {
                    q.push(node->right);
                }
            }
            
            result.push_back(currentLevel);
        }
        
        return result;
    }
    
    // ==================== APPROACH 2: DFS with Level Tracking ====================
    /*
     * Algorithm:
     * - Use DFS with level parameter
     * - Track current depth during traversal
     * - Add nodes to appropriate level in result
     * - Create new level vector when needed
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(h) - recursion stack, h = height
     * 
     * When to use: When DFS is preferred or recursion required
     * 
     * Key Insight:
     * - DFS can achieve level order with level tracking
     * - Preorder traversal with depth parameter
     * - Result vector indexed by level
     */
    void dfsHelper(TreeNode* root, int level, vector<vector<int>>& result) {
        if (root == nullptr) return;
        
        // Create new level if needed
        if (level >= result.size()) {
            result.push_back(vector<int>());
        }
        
        // Add current node to its level
        result[level].push_back(root->val);
        
        // Recurse on children with incremented level
        dfsHelper(root->left, level + 1, result);
        dfsHelper(root->right, level + 1, result);
    }
    
    vector<vector<int>> levelOrder_DFS(TreeNode* root) {
        vector<vector<int>> result;
        dfsHelper(root, 0, result);
        return result;
    }
    
    // ==================== APPROACH 3: BFS with Null Markers ====================
    /*
     * Algorithm:
     * - Use queue with null markers to separate levels
     * - Add null after each level
     * - When null encountered, start new level
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(w)
     * 
     * When to use: Alternative BFS approach
     * 
     * Key Insight:
     * - Null markers act as level separators
     * - Simpler logic but uses null pointers
     * - Must handle final null carefully
     */
    vector<vector<int>> levelOrder_NullMarkers(TreeNode* root) {
        vector<vector<int>> result;
        if (root == nullptr) return result;
        
        queue<TreeNode*> q;
        q.push(root);
        q.push(nullptr);  // Level marker
        
        vector<int> currentLevel;
        
        while (!q.empty()) {
            TreeNode* node = q.front();
            q.pop();
            
            if (node == nullptr) {
                // End of level
                result.push_back(currentLevel);
                currentLevel.clear();
                
                // Add marker for next level if queue not empty
                if (!q.empty()) {
                    q.push(nullptr);
                }
            } else {
                currentLevel.push_back(node->val);
                
                if (node->left != nullptr) {
                    q.push(node->left);
                }
                if (node->right != nullptr) {
                    q.push(node->right);
                }
            }
        }
        
        return result;
    }
    
    // ==================== APPROACH 4: Two Queues ====================
    /*
     * Algorithm:
     * - Use two queues alternating between levels
     * - Current level in one queue, next in other
     * - Swap queues after each level
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(w)
     * 
     * When to use: Alternative approach, less common
     * 
     * Key Insight:
     * - Separate queues for current and next level
     * - No need to track level size
     * - Swap queues between levels
     */
    vector<vector<int>> levelOrder_TwoQueues(TreeNode* root) {
        vector<vector<int>> result;
        if (root == nullptr) return result;
        
        queue<TreeNode*> currentLevel;
        queue<TreeNode*> nextLevel;
        currentLevel.push(root);
        
        while (!currentLevel.empty()) {
            vector<int> level;
            
            while (!currentLevel.empty()) {
                TreeNode* node = currentLevel.front();
                currentLevel.pop();
                level.push_back(node->val);
                
                if (node->left != nullptr) {
                    nextLevel.push(node->left);
                }
                if (node->right != nullptr) {
                    nextLevel.push(node->right);
                }
            }
            
            result.push_back(level);
            swap(currentLevel, nextLevel);
        }
        
        return result;
    }
    
    // Main function (uses BFS by default)
    vector<vector<int>> levelOrder(TreeNode* root) {
        return levelOrder_BFS(root);
    }
};

// ==================== HELPER FUNCTIONS ====================
void deleteTree(TreeNode* root) {
    if (root == nullptr) return;
    deleteTree(root->left);
    deleteTree(root->right);
    delete root;
}

void printResult(const vector<vector<int>>& result) {
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << "[";
        for (int j = 0; j < result[i].size(); j++) {
            cout << result[i][j];
            if (j < result[i].size() - 1) cout << ",";
        }
        cout << "]";
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
}

// ==================== TEST CASES ====================
void runTests() {
    Solution sol;
    
    // Test Case 1: Standard tree
    //       3
    //      / \
    //     9  20
    //       /  \
    //      15   7
    TreeNode* root1 = new TreeNode(3);
    root1->left = new TreeNode(9);
    root1->right = new TreeNode(20);
    root1->right->left = new TreeNode(15);
    root1->right->right = new TreeNode(7);
    cout << "Test 1: ";
    printResult(sol.levelOrder(root1));
    deleteTree(root1);
    // Expected: [[3],[9,20],[15,7]]
    
    // Test Case 2: Single node
    TreeNode* root2 = new TreeNode(1);
    cout << "Test 2: ";
    printResult(sol.levelOrder(root2));
    deleteTree(root2);
    // Expected: [[1]]
    
    // Test Case 3: Empty tree
    TreeNode* root3 = nullptr;
    cout << "Test 3: ";
    printResult(sol.levelOrder(root3));
    // Expected: []
    
    // Test Case 4: Left-skewed tree
    TreeNode* root4 = new TreeNode(1);
    root4->left = new TreeNode(2);
    root4->left->left = new TreeNode(3);
    root4->left->left->left = new TreeNode(4);
    cout << "Test 4: ";
    printResult(sol.levelOrder(root4));
    deleteTree(root4);
    // Expected: [[1],[2],[3],[4]]
    
    // Test Case 5: Complete binary tree
    //       1
    //      / \
    //     2   3
    //    / \ / \
    //   4  5 6  7
    TreeNode* root5 = new TreeNode(1);
    root5->left = new TreeNode(2);
    root5->right = new TreeNode(3);
    root5->left->left = new TreeNode(4);
    root5->left->right = new TreeNode(5);
    root5->right->left = new TreeNode(6);
    root5->right->right = new TreeNode(7);
    cout << "Test 5: ";
    printResult(sol.levelOrder(root5));
    deleteTree(root5);
    // Expected: [[1],[2,3],[4,5,6,7]]
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. BFS with Queue (RECOMMENDED):
 *    Time: O(n), Space: O(w) where w = max width
 *    Most intuitive, standard approach
 * 
 * 2. DFS with Level Tracking:
 *    Time: O(n), Space: O(h) where h = height
 *    Recursive, uses less space for skewed trees
 * 
 * 3. BFS with Null Markers:
 *    Time: O(n), Space: O(w)
 *    Alternative BFS, uses null separators
 * 
 * 4. Two Queues:
 *    Time: O(n), Space: O(w)
 *    Less common, more memory overhead
 * 
 * INTERVIEW TIPS:
 * - Start with BFS approach (most natural)
 * - Explain why queue is used (FIFO for level order)
 * - Mention tracking level size is key
 * - Draw tree and show queue state at each step
 * - Discuss DFS alternative if asked
 * - Compare space complexity for different tree shapes
 * - Mention variations (zigzag, bottom-up)
 * 
 * KEY INSIGHTS:
 * - BFS naturally processes level by level
 * - Queue size at start of iteration = current level size
 * - DFS can achieve same result with level parameter
 * - Space complexity depends on tree shape
 * - Complete tree: O(n/2) = O(n) space
 * - Skewed tree: O(1) space for BFS, O(h) for DFS
 * 
 * STEP-BY-STEP for tree [3,9,20,null,null,15,7]:
 * 
 *       3
 *      / \
 *     9  20
 *       /  \
 *      15   7
 * 
 * Initial: queue = [3]
 * Level 0: Process 3, add 9,20 -> [[3]]
 * Level 1: Process 9,20, add 15,7 -> [[3],[9,20]]
 * Level 2: Process 15,7 -> [[3],[9,20],[15,7]]
 * 
 * COMMON MISTAKES:
 * - Not tracking level size correctly
 * - Processing children immediately (breaks level grouping)
 * - Forgetting to check for null children
 * - Not handling empty tree
 * - Confusing with inorder/preorder traversal
 * - Memory leaks (not deleting nodes)
 * - Off-by-one errors in level tracking
 * 
 * FOLLOW-UP QUESTIONS:
 * - Return level order bottom-up? (Reverse result)
 * - Zigzag level order? (Alternate direction per level)
 * - Right side view of tree? (Last node of each level)
 * - Average of each level? (Sum/count per level)
 * - Maximum value in each level? (Track max per level)
 * 
 * RELATED PROBLEMS:
 * - Binary Tree Zigzag Level Order (LeetCode #103)
 * - Binary Tree Level Order Traversal II (LeetCode #107)
 * - Binary Tree Right Side View (LeetCode #199)
 * - Average of Levels in Binary Tree (LeetCode #637)
 * - N-ary Tree Level Order Traversal (LeetCode #429)
 * 
 * VISUALIZATION:
 * 
 * Tree:       3
 *            / \
 *           9  20
 *             /  \
 *            15   7
 * 
 * Queue states:
 * Start:    [3]
 * After 3:  [9, 20]
 * After 9:  [20]
 * After 20: [15, 7]
 * After 15: [7]
 * After 7:  []
 * 
 * Result: [[3], [9,20], [15,7]]
 * 
 * SPACE COMPLEXITY ANALYSIS:
 * - Complete binary tree: Last level has n/2 nodes
 *   Queue can hold up to n/2 nodes -> O(n)
 * - Skewed tree: Queue holds at most 1 node -> O(1)
 * - General case: O(w) where w is max width
 */

// Made with Bob
