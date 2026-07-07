/*
 * Problem: Binary Tree Maximum Path Sum
 * LeetCode: https://leetcode.com/problems/binary-tree-maximum-path-sum/
 * 
 * Description:
 * A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the
 * sequence has an edge connecting them. A node can only appear in the sequence at most once.
 * Note that the path does not need to pass through the root.
 * 
 * The path sum of a path is the sum of the node's values in the path.
 * Given the root of a binary tree, return the maximum path sum of any non-empty path.
 * 
 * Example 1:
 * Input: root = [1,2,3]
 *        1
 *       / \
 *      2   3
 * Output: 6
 * Explanation: The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.
 * 
 * Example 2:
 * Input: root = [-10,9,20,null,null,15,7]
 *         -10
 *         / \
 *        9  20
 *          /  \
 *         15   7
 * Output: 42
 * Explanation: The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.
 * 
 * Constraints:
 * - The number of nodes in the tree is in the range [1, 3 * 10^4].
 * - -1000 <= Node.val <= 1000
 * 
 * Difficulty: Hard
 * Topics: Dynamic Programming, Tree, Depth-First Search, Binary Tree
 */

#include <iostream>
#include <algorithm>
#include <climits>
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
     * Approach 1: DFS with Global Maximum
     * 
     * Intuition:
     * - At each node, we can form a path that:
     *   1. Goes through the node (node + left path + right path)
     *   2. Extends from parent (node + max(left path, right path))
     * - Track global maximum for case 1
     * - Return value for case 2 (to be used by parent)
     * 
     * Key Insight:
     * - A path can "turn" at most once (at some node)
     * - At each node, consider it as the turning point
     * - Path through node = node.val + leftMax + rightMax
     * - Path extending to parent = node.val + max(leftMax, rightMax)
     * 
     * Algorithm:
     * 1. For each node, calculate:
     *    - maxSingle: max path sum extending to parent
     *    - maxTop: max path sum with node as highest point
     * 2. Update global maximum with maxTop
     * 3. Return maxSingle to parent
     * 
     * Time Complexity: O(n) - visit each node once
     * Space Complexity: O(h) - recursion stack, h = height
     */
    int maxSum;
    
    int maxPathSumHelper(TreeNode* node) {
        if (!node) return 0;
        
        // Get max path sum from left and right subtrees
        // Use max(0, ...) to ignore negative paths
        int leftMax = max(0, maxPathSumHelper(node->left));
        int rightMax = max(0, maxPathSumHelper(node->right));
        
        // Max path sum with current node as turning point
        int pathThroughNode = node->val + leftMax + rightMax;
        
        // Update global maximum
        maxSum = max(maxSum, pathThroughNode);
        
        // Return max path sum extending to parent
        // Can only take one branch (left or right)
        return node->val + max(leftMax, rightMax);
    }
    
    int maxPathSum_dfs(TreeNode* root) {
        maxSum = INT_MIN;
        maxPathSumHelper(root);
        return maxSum;
    }
    
    /*
     * Approach 2: DFS with Pair Return
     * 
     * Intuition:
     * - Return both values explicitly as a pair
     * - More explicit about what's being tracked
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(h)
     */
    pair<int, int> maxPathSumPair(TreeNode* node) {
        // Returns: {maxSingle, maxPath}
        // maxSingle: max path extending to parent
        // maxPath: max path sum in subtree
        
        if (!node) return {0, INT_MIN};
        
        auto [leftSingle, leftPath] = maxPathSumPair(node->left);
        auto [rightSingle, rightPath] = maxPathSumPair(node->right);
        
        // Max path extending to parent
        int maxSingle = node->val + max({0, leftSingle, rightSingle});
        
        // Max path in current subtree
        int maxPath = max({
            leftPath,                                    // In left subtree
            rightPath,                                   // In right subtree
            node->val + max(0, leftSingle) + max(0, rightSingle)  // Through node
        });
        
        return {maxSingle, maxPath};
    }
    
    int maxPathSum_pair(TreeNode* root) {
        auto [single, path] = maxPathSumPair(root);
        return path;
    }
    
    /*
     * Approach 3: DFS with Detailed Comments
     * 
     * Intuition:
     * - Same as approach 1 but with detailed explanation
     * - Helps understand the logic better
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(h)
     */
    int globalMax;
    
    int dfs(TreeNode* node) {
        if (!node) return 0;
        
        // Recursively get max path sum from children
        int leftGain = dfs(node->left);
        int rightGain = dfs(node->right);
        
        // Ignore negative gains (better to not include them)
        leftGain = max(leftGain, 0);
        rightGain = max(rightGain, 0);
        
        // Price to start a new path where node is the highest node
        int priceNewPath = node->val + leftGain + rightGain;
        
        // Update global maximum
        globalMax = max(globalMax, priceNewPath);
        
        // For recursion, return max gain if continue the same path
        // Can only choose one branch (left or right) to extend upward
        return node->val + max(leftGain, rightGain);
    }
    
    int maxPathSum_detailed(TreeNode* root) {
        globalMax = INT_MIN;
        dfs(root);
        return globalMax;
    }
    
    /*
     * Approach 4: Iterative with Post-order Traversal
     * 
     * Intuition:
     * - Convert recursive solution to iterative
     * - Use post-order traversal (process children before parent)
     * - Store computed values in hash map
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n) - stack + hash map
     */
    int maxPathSum_iterative(TreeNode* root) {
        if (!root) return 0;
        
        int maxSum = INT_MIN;
        unordered_map<TreeNode*, int> maxSingle;
        maxSingle[nullptr] = 0;
        
        // Post-order traversal using two stacks
        stack<TreeNode*> s1, s2;
        s1.push(root);
        
        while (!s1.empty()) {
            TreeNode* node = s1.top();
            s1.pop();
            s2.push(node);
            
            if (node->left) s1.push(node->left);
            if (node->right) s1.push(node->right);
        }
        
        // Process nodes in post-order
        while (!s2.empty()) {
            TreeNode* node = s2.top();
            s2.pop();
            
            int leftMax = max(0, maxSingle[node->left]);
            int rightMax = max(0, maxSingle[node->right]);
            
            // Path through this node
            maxSum = max(maxSum, node->val + leftMax + rightMax);
            
            // Max path extending to parent
            maxSingle[node] = node->val + max(leftMax, rightMax);
        }
        
        return maxSum;
    }
    
    /*
     * Approach 5: Standard Solution (Most Common)
     * 
     * This is the most commonly used approach in interviews
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(h)
     */
    int maxPathSum(TreeNode* root) {
        maxSum = INT_MIN;
        maxPathSumHelper(root);
        return maxSum;
    }
};

/*
 * Helper functions for testing
 */
TreeNode* createTree(vector<int> values) {
    if (values.empty()) return nullptr;
    
    TreeNode* root = new TreeNode(values[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    
    while (!q.empty() && i < values.size()) {
        TreeNode* node = q.front();
        q.pop();
        
        if (i < values.size() && values[i] != INT_MIN) {
            node->left = new TreeNode(values[i]);
            q.push(node->left);
        }
        i++;
        
        if (i < values.size() && values[i] != INT_MIN) {
            node->right = new TreeNode(values[i]);
            q.push(node->right);
        }
        i++;
    }
    
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
    
    // Test Case 1: Simple tree
    cout << "Test 1 - Input: [1,2,3]" << endl;
    TreeNode* test1 = createTree({1, 2, 3});
    cout << "DFS: " << sol.maxPathSum_dfs(test1) << endl;
    cout << "Pair: " << sol.maxPathSum_pair(test1) << endl;
    cout << "Detailed: " << sol.maxPathSum_detailed(test1) << endl;
    cout << "Standard: " << sol.maxPathSum(test1) << endl;
    cout << "Expected: 6 (2->1->3)" << endl << endl;
    
    // Test Case 2: Tree with negative root
    cout << "Test 2 - Input: [-10,9,20,null,null,15,7]" << endl;
    TreeNode* test2 = createTree({-10, 9, 20, INT_MIN, INT_MIN, 15, 7});
    cout << "Result: " << sol.maxPathSum(test2) << endl;
    cout << "Expected: 42 (15->20->7)" << endl << endl;
    
    // Test Case 3: Single node
    cout << "Test 3 - Input: [5]" << endl;
    TreeNode* test3 = createTree({5});
    cout << "Result: " << sol.maxPathSum(test3) << endl;
    cout << "Expected: 5" << endl << endl;
    
    // Test Case 4: All negative values
    cout << "Test 4 - Input: [-3,-2,-1]" << endl;
    TreeNode* test4 = createTree({-3, -2, -1});
    cout << "Result: " << sol.maxPathSum(test4) << endl;
    cout << "Expected: -1 (single node)" << endl << endl;
    
    // Test Case 5: Path doesn't include root
    cout << "Test 5 - Input: [2,-1,3]" << endl;
    TreeNode* test5 = createTree({2, -1, 3});
    cout << "Result: " << sol.maxPathSum(test5) << endl;
    cout << "Expected: 5 (2->3, skipping -1)" << endl << endl;
    
    // Test Case 6: Linear tree
    cout << "Test 6 - Input: [1,2,null,3,null,4]" << endl;
    TreeNode* test6 = createTree({1, 2, INT_MIN, 3, INT_MIN, 4});
    cout << "Result: " << sol.maxPathSum(test6) << endl;
    cout << "Expected: 10 (1->2->3->4)" << endl << endl;
}

int main() {
    cout << "Binary Tree Maximum Path Sum - Multiple Approaches" << endl;
    cout << "===================================================" << endl << endl;
    
    runTests();
    
    return 0;
}

/*
 * Complexity Analysis Summary:
 * 
 * All Recursive Approaches:
 * - Time: O(n) - visit each node once
 * - Space: O(h) - recursion stack, h = tree height
 * 
 * Iterative Approach:
 * - Time: O(n)
 * - Space: O(n) - stack + hash map
 * 
 * Key Insights:
 * 1. Path can turn at most once (at some node)
 * 2. At each node, consider it as the turning point
 * 3. Track two values: path through node vs path to parent
 * 4. Ignore negative contributions (use max(0, ...))
 * 5. Global variable tracks maximum across all nodes
 * 
 * Why This Works:
 * - Every path has a highest node (turning point)
 * - At that node, path = node + left branch + right branch
 * - For parent, can only extend one branch upward
 * - DFS ensures we process children before parent
 * 
 * Path Types:
 * 1. Single node: just node.val
 * 2. Node + left: node.val + leftMax
 * 3. Node + right: node.val + rightMax
 * 4. Node + both: node.val + leftMax + rightMax (turning point)
 * 
 * Why max(0, gain):
 * - If subtree has negative sum, better to not include it
 * - Example: node=5, left=-10, right=3
 * - Without max(0): 5 + (-10) + 3 = -2
 * - With max(0): 5 + 0 + 3 = 8 (ignore negative left)
 * 
 * Common Pitfalls:
 * 1. Forgetting to use max(0, ...) for negative paths
 * 2. Not updating global maximum at each node
 * 3. Returning wrong value (should return single path, not max)
 * 4. Not handling negative values correctly
 * 5. Confusing path through node vs path to parent
 * 
 * Interview Tips:
 * 1. Start by explaining what a path is
 * 2. Draw tree and show different path possibilities
 * 3. Explain why we need two values (through vs to parent)
 * 4. Mention that path can turn at most once
 * 5. Explain max(0, ...) for ignoring negative paths
 * 6. Walk through example with negative values
 * 7. Discuss time/space complexity
 * 
 * Edge Cases to Consider:
 * 1. Single node tree
 * 2. All negative values
 * 3. Linear tree (all left or all right)
 * 4. Balanced tree
 * 5. Path doesn't include root
 * 6. Very deep tree (stack overflow risk)
 * 
 * Visualization for [-10,9,20,null,null,15,7]:
 *         -10
 *         / \
 *        9  20
 *          /  \
 *         15   7
 * 
 * At node 20:
 * - leftMax = 15, rightMax = 7
 * - pathThrough = 20 + 15 + 7 = 42 (maximum!)
 * - returnToParent = 20 + max(15, 7) = 35
 * 
 * At node -10:
 * - leftMax = max(0, 9) = 9
 * - rightMax = max(0, 35) = 35
 * - pathThrough = -10 + 9 + 35 = 34
 * - But 42 is still maximum
 * 
 * Real-World Applications:
 * 1. Network routing (maximum bandwidth path)
 * 2. Game theory (maximum score path)
 * 3. Resource allocation (maximum profit path)
 * 4. Circuit design (maximum signal strength)
 * 5. Social networks (maximum influence path)
 * 
 * Extensions and Variations:
 * 1. Minimum path sum
 * 2. Path with exactly k nodes
 * 3. Path with constraints (e.g., no adjacent nodes)
 * 4. Count paths with sum equal to target
 * 5. Longest path in tree
 * 
 * Related Problems:
 * - Path Sum
 * - Path Sum II
 * - Path Sum III
 * - Binary Tree Maximum Path Sum
 * - Diameter of Binary Tree
 * - Longest Univalue Path
 */

// Made with Bob
