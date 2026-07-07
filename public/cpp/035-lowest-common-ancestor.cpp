/*
 * LeetCode Problem #236: Lowest Common Ancestor of a Binary Tree
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/
 * 
 * Problem Statement:
 * Given a binary tree, find the lowest common ancestor (LCA) of two given nodes.
 * 
 * The lowest common ancestor is defined as the lowest node in T that has both
 * p and q as descendants (where we allow a node to be a descendant of itself).
 * 
 * Example:
 * Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
 *        3
 *       / \
 *      5   1
 *     / \ / \
 *    6  2 0  8
 *      / \
 *     7   4
 * Output: 3
 */

#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <iostream>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    // ==================== APPROACH 1: Recursive ====================
    /*
     * Algorithm:
     * - If root is null or equals p or q, return root
     * - Recursively search in left and right subtrees
     * - If both return non-null, root is LCA
     * - If only one returns non-null, return that one
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(h) for recursion
     * 
     * When to use: This is the OPTIMAL solution
     * 
     * Key Insight:
     * - LCA is where paths to p and q diverge
     * - If both found in different subtrees, current is LCA
     * - If both in same subtree, LCA is in that subtree
     */
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (root == nullptr || root == p || root == q) {
            return root;
        }
        
        TreeNode* left = lowestCommonAncestor(root->left, p, q);
        TreeNode* right = lowestCommonAncestor(root->right, p, q);
        
        if (left != nullptr && right != nullptr) {
            return root;  // p and q in different subtrees
        }
        
        return left != nullptr ? left : right;
    }
    
    // ==================== APPROACH 2: Parent Pointers ====================
    /*
     * Algorithm:
     * - Store parent pointers for all nodes
     * - Trace path from p to root
     * - Trace path from q until hitting p's path
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     * 
     * When to use: When parent pointers available
     */
    TreeNode* lowestCommonAncestor_Parents(TreeNode* root, TreeNode* p, TreeNode* q) {
        unordered_map<TreeNode*, TreeNode*> parent;
        parent[root] = nullptr;
        
        // Build parent map
        buildParentMap(root, parent);
        
        // Get ancestors of p
        unordered_set<TreeNode*> ancestors;
        while (p != nullptr) {
            ancestors.insert(p);
            p = parent[p];
        }
        
        // Find first common ancestor
        while (q != nullptr) {
            if (ancestors.count(q)) {
                return q;
            }
            q = parent[q];
        }
        
        return nullptr;
    }
    
private:
    void buildParentMap(TreeNode* node, unordered_map<TreeNode*, TreeNode*>& parent) {
        if (node == nullptr) return;
        
        if (node->left != nullptr) {
            parent[node->left] = node;
            buildParentMap(node->left, parent);
        }
        if (node->right != nullptr) {
            parent[node->right] = node;
            buildParentMap(node->right, parent);
        }
    }
    
public:
    // ==================== APPROACH 3: Path Storage ====================
    /*
     * Algorithm:
     * - Find path from root to p
     * - Find path from root to q
     * - Compare paths to find last common node
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     */
    TreeNode* lowestCommonAncestor_Paths(TreeNode* root, TreeNode* p, TreeNode* q) {
        vector<TreeNode*> pathP, pathQ;
        
        findPath(root, p, pathP);
        findPath(root, q, pathQ);
        
        TreeNode* lca = nullptr;
        int i = 0;
        while (i < pathP.size() && i < pathQ.size() && pathP[i] == pathQ[i]) {
            lca = pathP[i];
            i++;
        }
        
        return lca;
    }
    
private:
    bool findPath(TreeNode* root, TreeNode* target, vector<TreeNode*>& path) {
        if (root == nullptr) return false;
        
        path.push_back(root);
        
        if (root == target) return true;
        
        if (findPath(root->left, target, path) || 
            findPath(root->right, target, path)) {
            return true;
        }
        
        path.pop_back();
        return false;
    }
};

// ==================== TEST CASES ====================
void runTests() {
    Solution sol;
    
    // Test Case 1: LCA is root
    cout << "Test Case 1: LCA is root\n";
    TreeNode* root1 = new TreeNode(3);
    root1->left = new TreeNode(5);
    root1->right = new TreeNode(1);
    TreeNode* result1 = sol.lowestCommonAncestor(root1, root1->left, root1->right);
    cout << "Output: " << result1->val << "\n";
    cout << "Expected: 3\n\n";
    
    // Test Case 2: LCA is one of the nodes
    cout << "Test Case 2: LCA is one of the nodes\n";
    TreeNode* root2 = new TreeNode(3);
    root2->left = new TreeNode(5);
    root2->left->left = new TreeNode(6);
    TreeNode* result2 = sol.lowestCommonAncestor_Parents(root2, root2->left, root2->left->left);
    cout << "Output: " << result2->val << "\n";
    cout << "Expected: 5\n\n";
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. Recursive (RECOMMENDED):
 *    Time: O(n), Space: O(h)
 *    Pros: Elegant, optimal
 *    Cons: Requires understanding
 *    Best for: Most scenarios
 * 
 * 2. Parent Pointers:
 *    Time: O(n), Space: O(n)
 *    Pros: Intuitive
 *    Cons: Extra space
 *    Best for: When parent pointers available
 * 
 * 3. Path Storage:
 *    Time: O(n), Space: O(n)
 *    Pros: Clear logic
 *    Cons: Extra space
 *    Best for: Understanding concept
 * 
 * INTERVIEW TIPS:
 * - Clarify if nodes always exist in tree
 * - Explain recursive logic clearly
 * - Draw tree showing different cases
 * - Discuss when node is ancestor of itself
 * - Handle edge cases
 * - Mention BST variant (easier)
 * 
 * KEY INSIGHTS:
 * - LCA is split point of paths
 * - Recursive solution is elegant
 * - Both nodes in different subtrees → current is LCA
 * - Both in same subtree → LCA in that subtree
 * 
 * COMMON MISTAKES:
 * - Not handling when node is ancestor of itself
 * - Forgetting null checks
 * - Incorrect base cases
 * - Not considering all cases
 * 
 * RELATED PROBLEMS:
 * - LeetCode #235: LCA of BST
 * - LeetCode #1644: LCA of Binary Tree II
 * - LeetCode #1650: LCA of Binary Tree III
 */

// Made with Bob
