/*
 * Problem: Invert Binary Tree (LeetCode 226)
 * Difficulty: Easy
 * Category: Trees and Graphs
 * 
 * Description:
 * Given the root of a binary tree, invert the tree, and return its root.
 * Inverting a tree means swapping the left and right children of all nodes.
 * 
 * Example 1:
 * Input: root = [4,2,7,1,3,6,9]
 *        4
 *      /   \
 *     2     7
 *    / \   / \
 *   1   3 6   9
 * 
 * Output: [4,7,2,9,6,3,1]
 *        4
 *      /   \
 *     7     2
 *    / \   / \
 *   9   6 3   1
 * 
 * Example 2:
 * Input: root = [2,1,3]
 * Output: [2,3,1]
 * 
 * Example 3:
 * Input: root = []
 * Output: []
 * 
 * Constraints:
 * - The number of nodes in the tree is in the range [0, 100]
 * - -100 <= Node.val <= 100
 */

#include <iostream>
#include <queue>
#include <stack>
#include <vector>
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

/*
 * APPROACH 1: RECURSIVE DFS (POST-ORDER)
 * 
 * Intuition:
 * - Use recursion to traverse the tree in post-order
 * - First invert left and right subtrees
 * - Then swap the left and right children of current node
 * - This is the most intuitive and elegant solution
 * 
 * Algorithm:
 * 1. Base case: if node is null, return null
 * 2. Recursively invert left subtree
 * 3. Recursively invert right subtree
 * 4. Swap left and right children
 * 5. Return the current node
 * 
 * Time Complexity: O(n) - visit each node once
 * Space Complexity: O(h) - recursion stack, where h is height
 *                   O(n) worst case for skewed tree
 *                   O(log n) average case for balanced tree
 */
class Solution1 {
public:
    TreeNode* invertTree(TreeNode* root) {
        // Base case: empty tree
        if (!root) return nullptr;
        
        // Recursively invert left and right subtrees
        TreeNode* left = invertTree(root->left);
        TreeNode* right = invertTree(root->right);
        
        // Swap left and right children
        root->left = right;
        root->right = left;
        
        return root;
    }
};

/*
 * APPROACH 2: RECURSIVE DFS (PRE-ORDER)
 * 
 * Intuition:
 * - Swap children first, then recursively invert subtrees
 * - This is slightly different from post-order but equally valid
 * - The order doesn't matter since we're swapping at every level
 * 
 * Algorithm:
 * 1. Base case: if node is null, return null
 * 2. Swap left and right children immediately
 * 3. Recursively invert left subtree (which was originally right)
 * 4. Recursively invert right subtree (which was originally left)
 * 5. Return the current node
 * 
 * Time Complexity: O(n) - visit each node once
 * Space Complexity: O(h) - recursion stack
 */
class Solution2 {
public:
    TreeNode* invertTree(TreeNode* root) {
        // Base case: empty tree
        if (!root) return nullptr;
        
        // Swap left and right children first
        TreeNode* temp = root->left;
        root->left = root->right;
        root->right = temp;
        
        // Recursively invert subtrees
        invertTree(root->left);
        invertTree(root->right);
        
        return root;
    }
};

/*
 * APPROACH 3: ITERATIVE BFS (LEVEL-ORDER)
 * 
 * Intuition:
 * - Use a queue to perform level-order traversal
 * - For each node, swap its left and right children
 * - Add children to queue for processing
 * - This avoids recursion stack overhead
 * 
 * Algorithm:
 * 1. If root is null, return null
 * 2. Create a queue and add root
 * 3. While queue is not empty:
 *    a. Dequeue a node
 *    b. Swap its left and right children
 *    c. Add non-null children to queue
 * 4. Return root
 * 
 * Time Complexity: O(n) - visit each node once
 * Space Complexity: O(w) - queue size, where w is max width
 *                   O(n) worst case for complete binary tree
 */
class Solution3 {
public:
    TreeNode* invertTree(TreeNode* root) {
        // Base case: empty tree
        if (!root) return nullptr;
        
        // BFS using queue
        queue<TreeNode*> q;
        q.push(root);
        
        while (!q.empty()) {
            TreeNode* node = q.front();
            q.pop();
            
            // Swap left and right children
            TreeNode* temp = node->left;
            node->left = node->right;
            node->right = temp;
            
            // Add children to queue
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        
        return root;
    }
};

/*
 * APPROACH 4: ITERATIVE DFS (USING STACK)
 * 
 * Intuition:
 * - Use a stack to simulate recursive DFS
 * - This is the iterative version of the recursive approach
 * - Useful when recursion depth might cause stack overflow
 * 
 * Algorithm:
 * 1. If root is null, return null
 * 2. Create a stack and push root
 * 3. While stack is not empty:
 *    a. Pop a node
 *    b. Swap its left and right children
 *    c. Push non-null children to stack
 * 4. Return root
 * 
 * Time Complexity: O(n) - visit each node once
 * Space Complexity: O(h) - stack size, where h is height
 */
class Solution4 {
public:
    TreeNode* invertTree(TreeNode* root) {
        // Base case: empty tree
        if (!root) return nullptr;
        
        // DFS using stack
        stack<TreeNode*> stk;
        stk.push(root);
        
        while (!stk.empty()) {
            TreeNode* node = stk.top();
            stk.pop();
            
            // Swap left and right children
            TreeNode* temp = node->left;
            node->left = node->right;
            node->right = temp;
            
            // Push children to stack
            if (node->left) stk.push(node->left);
            if (node->right) stk.push(node->right);
        }
        
        return root;
    }
};

/*
 * APPROACH 5: MORRIS TRAVERSAL (SPACE-OPTIMIZED)
 * 
 * Intuition:
 * - Use Morris traversal to achieve O(1) space complexity
 * - Temporarily modify tree structure to avoid stack/queue
 * - Create threaded binary tree for traversal
 * - This is the most space-efficient solution
 * 
 * Algorithm:
 * 1. Start with current = root
 * 2. While current is not null:
 *    a. If current has no left child:
 *       - Swap left and right
 *       - Move to right child
 *    b. If current has left child:
 *       - Find rightmost node in left subtree
 *       - If rightmost's right is null:
 *         * Create thread: rightmost->right = current
 *         * Move to left child
 *       - If rightmost's right is current:
 *         * Remove thread: rightmost->right = null
 *         * Swap left and right
 *         * Move to right child
 * 3. Return root
 * 
 * Time Complexity: O(n) - each edge traversed at most twice
 * Space Complexity: O(1) - no extra space except variables
 */
class Solution5 {
public:
    TreeNode* invertTree(TreeNode* root) {
        TreeNode* current = root;
        
        while (current) {
            if (!current->left) {
                // No left child, swap and move right
                TreeNode* temp = current->left;
                current->left = current->right;
                current->right = temp;
                current = current->left; // Move to what was right
            } else {
                // Find rightmost node in left subtree
                TreeNode* predecessor = current->left;
                while (predecessor->right && predecessor->right != current) {
                    predecessor = predecessor->right;
                }
                
                if (!predecessor->right) {
                    // Create thread
                    predecessor->right = current;
                    current = current->left;
                } else {
                    // Remove thread and swap
                    predecessor->right = nullptr;
                    TreeNode* temp = current->left;
                    current->left = current->right;
                    current->right = temp;
                    current = current->left; // Move to what was right
                }
            }
        }
        
        return root;
    }
};

// Helper function to create a binary tree from level-order array
TreeNode* createTree(const vector<int>& values) {
    if (values.empty() || values[0] == -1) return nullptr;
    
    TreeNode* root = new TreeNode(values[0]);
    queue<TreeNode*> q;
    q.push(root);
    
    int i = 1;
    while (!q.empty() && i < values.size()) {
        TreeNode* node = q.front();
        q.pop();
        
        // Left child
        if (i < values.size() && values[i] != -1) {
            node->left = new TreeNode(values[i]);
            q.push(node->left);
        }
        i++;
        
        // Right child
        if (i < values.size() && values[i] != -1) {
            node->right = new TreeNode(values[i]);
            q.push(node->right);
        }
        i++;
    }
    
    return root;
}

// Helper function to print tree in level-order
vector<int> levelOrder(TreeNode* root) {
    vector<int> result;
    if (!root) return result;
    
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        
        result.push_back(node->val);
        
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
    
    return result;
}

// Helper function to delete tree
void deleteTree(TreeNode* root) {
    if (!root) return;
    deleteTree(root->left);
    deleteTree(root->right);
    delete root;
}

// Test function
void test(const vector<int>& input, int approach) {
    TreeNode* root = createTree(input);
    TreeNode* result = nullptr;
    
    cout << "Input: [";
    for (int i = 0; i < input.size(); i++) {
        if (input[i] == -1) cout << "null";
        else cout << input[i];
        if (i < input.size() - 1) cout << ",";
    }
    cout << "]\n";
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.invertTree(root);
            cout << "Approach 1 (Recursive Post-order): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.invertTree(root);
            cout << "Approach 2 (Recursive Pre-order): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.invertTree(root);
            cout << "Approach 3 (Iterative BFS): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.invertTree(root);
            cout << "Approach 4 (Iterative DFS): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.invertTree(root);
            cout << "Approach 5 (Morris Traversal): ";
            break;
        }
    }
    
    vector<int> output = levelOrder(result);
    cout << "[";
    for (int i = 0; i < output.size(); i++) {
        cout << output[i];
        if (i < output.size() - 1) cout << ",";
    }
    cout << "]\n\n";
    
    deleteTree(result);
}

int main() {
    // Test Case 1: Regular binary tree
    cout << "Test Case 1: Regular binary tree\n";
    vector<int> test1 = {4, 2, 7, 1, 3, 6, 9};
    for (int i = 1; i <= 5; i++) {
        test(test1, i);
    }
    
    // Test Case 2: Small tree
    cout << "Test Case 2: Small tree\n";
    vector<int> test2 = {2, 1, 3};
    for (int i = 1; i <= 5; i++) {
        test(test2, i);
    }
    
    // Test Case 3: Empty tree
    cout << "Test Case 3: Empty tree\n";
    vector<int> test3 = {};
    for (int i = 1; i <= 5; i++) {
        test(test3, i);
    }
    
    // Test Case 4: Single node
    cout << "Test Case 4: Single node\n";
    vector<int> test4 = {1};
    for (int i = 1; i <= 5; i++) {
        test(test4, i);
    }
    
    // Test Case 5: Left-skewed tree
    cout << "Test Case 5: Left-skewed tree\n";
    vector<int> test5 = {1, 2, -1, 3, -1, 4};
    for (int i = 1; i <= 5; i++) {
        test(test5, i);
    }
    
    // Test Case 6: Right-skewed tree
    cout << "Test Case 6: Right-skewed tree\n";
    vector<int> test6 = {1, -1, 2, -1, 3, -1, 4};
    for (int i = 1; i <= 5; i++) {
        test(test6, i);
    }
    
    // Test Case 7: Complete binary tree
    cout << "Test Case 7: Complete binary tree\n";
    vector<int> test7 = {1, 2, 3, 4, 5, 6, 7};
    for (int i = 1; i <= 5; i++) {
        test(test7, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (Recursive Post-order):
 * - Time: O(n) - visit each node once
 * - Space: O(h) - recursion stack
 * - Best for: Clean, readable code
 * 
 * Approach 2 (Recursive Pre-order):
 * - Time: O(n) - visit each node once
 * - Space: O(h) - recursion stack
 * - Best for: Alternative recursive approach
 * 
 * Approach 3 (Iterative BFS):
 * - Time: O(n) - visit each node once
 * - Space: O(w) - queue size (max width)
 * - Best for: Level-by-level processing
 * 
 * Approach 4 (Iterative DFS):
 * - Time: O(n) - visit each node once
 * - Space: O(h) - stack size
 * - Best for: Avoiding recursion
 * 
 * Approach 5 (Morris Traversal):
 * - Time: O(n) - each edge traversed at most twice
 * - Space: O(1) - no extra space
 * - Best for: Space-constrained environments
 * 
 * INTERVIEW TIPS:
 * 1. Start with recursive solution (Approach 1) - most intuitive
 * 2. Mention iterative alternatives if asked about space optimization
 * 3. Morris traversal shows advanced knowledge but is rarely required
 * 4. Discuss trade-offs between recursion and iteration
 * 5. This problem tests basic tree manipulation skills
 * 
 * COMMON MISTAKES:
 * 1. Forgetting to return the root node
 * 2. Not handling null nodes properly
 * 3. Swapping children incorrectly (need temporary variable)
 * 4. In Morris traversal, not removing threads properly
 * 5. Confusing pre-order and post-order approaches
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. Can you invert only a subtree? (Yes, same logic)
 * 2. How to verify if a tree is inverted? (Compare with original)
 * 3. Can you do it in-place? (Yes, all approaches are in-place)
 * 4. What if tree has millions of nodes? (Use iterative to avoid stack overflow)
 * 5. How to invert n-ary tree? (Same logic, iterate through all children)
 */

// Made with Bob
