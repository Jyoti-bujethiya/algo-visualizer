/*
 * LeetCode Problem #543: Diameter of Binary Tree
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/diameter-of-binary-tree/
 *
 * Problem Statement:
 * Given the root of a binary tree, return the length of the diameter of the tree.
 * The diameter is the length of the longest path between any two nodes.
 * The path may or may not pass through the root.
 * The length is the number of edges between two nodes.
 *
 * Example 1:
 *       1
 *      / \
 *     2   3
 *    / \
 *   4   5
 *   Input: root = [1,2,3,4,5]
 *   Output: 3  (path: 4->2->1->3 or 5->2->1->3)
 *
 * Example 2:
 *   Input: root = [1,2]
 *   Output: 1
 *
 * Constraints:
 *   - Number of nodes: [1, 10^4]
 *   - -100 <= Node.val <= 100
 */

#include <algorithm>
#include <iostream>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

// ==================== APPROACH 1: Brute Force (recompute height each node) ====================
// For each node: diameter through it = leftHeight + rightHeight.
// Time: O(n^2)  Space: O(h)
class Solution1 {
    int height(TreeNode* node) {
        if (!node) return 0;
        return 1 + max(height(node->left), height(node->right));
    }
public:
    int diameterOfBinaryTree(TreeNode* root) {
        if (!root) return 0;
        int leftH = height(root->left), rightH = height(root->right);
        int throughRoot = leftH + rightH;
        int leftD = diameterOfBinaryTree(root->left);
        int rightD = diameterOfBinaryTree(root->right);
        return max({throughRoot, leftD, rightD});
    }
};

// ==================== APPROACH 2: Optimized DFS (single pass) ====================
// Track global max diameter while returning height from DFS.
// Time: O(n)  Space: O(h)
class Solution2 {
    int maxDiam = 0;
    int dfs(TreeNode* node) {
        if (!node) return 0;
        int left = dfs(node->left), right = dfs(node->right);
        maxDiam = max(maxDiam, left + right);
        return 1 + max(left, right);
    }
public:
    int diameterOfBinaryTree(TreeNode* root) {
        maxDiam = 0;
        dfs(root);
        return maxDiam;
    }
};

// ==================== APPROACH 3: Iterative Post-order (no recursion) ====================
// Iterative post-order traversal using a stack; same O(n) but avoids call stack.
// Time: O(n)  Space: O(n)
#include <stack>
#include <unordered_map>
class Solution3 {
public:
    int diameterOfBinaryTree(TreeNode* root) {
        if (!root) return 0;
        int maxDiam = 0;
        unordered_map<TreeNode*, int> memo;
        stack<TreeNode*> st;
        TreeNode* prev = nullptr;
        st.push(root);
        while (!st.empty()) {
            TreeNode* node = st.top();
            bool goDeeper = (prev == nullptr || prev->left == node || prev->right == node);
            if (goDeeper) {
                if (node->right) st.push(node->right);
                if (node->left) st.push(node->left);
            }
            if (!node->left && !node->right) {
                memo[node] = 0; st.pop(); prev = node;
            } else if ((!node->left || memo.count(node->left)) &&
                       (!node->right || memo.count(node->right))) {
                int l = node->left ? memo[node->left]+1 : 0;
                int r = node->right ? memo[node->right]+1 : 0;
                maxDiam = max(maxDiam, l + r);
                memo[node] = max(l, r);
                st.pop(); prev = node;
            }
        }
        return maxDiam;
    }
};

void runTests() {
    // Build [1,2,3,4,5]
    TreeNode* r1 = new TreeNode(1);
    r1->left = new TreeNode(2); r1->right = new TreeNode(3);
    r1->left->left = new TreeNode(4); r1->left->right = new TreeNode(5);
    Solution2 sol;
    cout << "Test 1: " << sol.diameterOfBinaryTree(r1) << " (expected 3)\n";
    TreeNode* r2 = new TreeNode(1); r2->left = new TreeNode(2);
    cout << "Test 2: " << sol.diameterOfBinaryTree(r2) << " (expected 1)\n";
}

int main() { runTests(); return 0; }

// Made with Bob
