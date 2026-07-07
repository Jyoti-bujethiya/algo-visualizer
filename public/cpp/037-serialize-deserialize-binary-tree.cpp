/*
 * Problem: Serialize and Deserialize Binary Tree
 * LeetCode: https://leetcode.com/problems/serialize-and-deserialize-binary-tree/
 * 
 * Description:
 * Serialization is the process of converting a data structure or object into a sequence of bits
 * so that it can be stored in a file or memory buffer, or transmitted across a network connection
 * link to be reconstructed later in the same or another computer environment.
 * 
 * Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how
 * your serialization/deserialization algorithm should work. You just need to ensure that a binary
 * tree can be serialized to a string and this string can be deserialized to the original tree structure.
 * 
 * Example 1:
 * Input: root = [1,2,3,null,null,4,5]
 *        1
 *       / \
 *      2   3
 *         / \
 *        4   5
 * Output: [1,2,3,null,null,4,5]
 * 
 * Example 2:
 * Input: root = []
 * Output: []
 * 
 * Constraints:
 * - The number of nodes in the tree is in the range [0, 10^4].
 * - -1000 <= Node.val <= 1000
 * 
 * Difficulty: Hard
 * Topics: String, Tree, Depth-First Search, Breadth-First Search, Design, Binary Tree
 */

#include <iostream>
#include <string>
#include <sstream>
#include <queue>
using namespace std;

// Definition for a binary tree node
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

/*
 * Approach 1: Pre-order Traversal (DFS)
 * 
 * Intuition:
 * - Use pre-order traversal (root, left, right)
 * - Represent null nodes explicitly with marker (e.g., "null")
 * - Pre-order allows us to reconstruct tree top-down
 * 
 * Serialization:
 * - Traverse tree in pre-order
 * - Append each value to string with delimiter
 * - Use "null" for null nodes
 * 
 * Deserialization:
 * - Split string by delimiter
 * - Recursively build tree in pre-order
 * - Use index/iterator to track current position
 * 
 * Time Complexity: O(n) for both operations
 * Space Complexity: O(n) for string and recursion
 */
class Codec_PreOrder {
public:
    // Encodes a tree to a single string
    string serialize(TreeNode* root) {
        string result;
        serializeHelper(root, result);
        return result;
    }
    
    void serializeHelper(TreeNode* node, string& result) {
        if (!node) {
            result += "null,";
            return;
        }
        
        result += to_string(node->val) + ",";
        serializeHelper(node->left, result);
        serializeHelper(node->right, result);
    }
    
    // Decodes your encoded data to tree
    TreeNode* deserialize(string data) {
        stringstream ss(data);
        return deserializeHelper(ss);
    }
    
    TreeNode* deserializeHelper(stringstream& ss) {
        string val;
        getline(ss, val, ',');
        
        if (val == "null") {
            return nullptr;
        }
        
        TreeNode* node = new TreeNode(stoi(val));
        node->left = deserializeHelper(ss);
        node->right = deserializeHelper(ss);
        
        return node;
    }
};

/*
 * Approach 2: Level-order Traversal (BFS)
 * 
 * Intuition:
 * - Use level-order traversal (BFS)
 * - More intuitive for some people
 * - Matches the typical array representation
 * 
 * Serialization:
 * - Use queue for BFS
 * - Add all nodes (including nulls) to string
 * 
 * Deserialization:
 * - Use queue to build tree level by level
 * - Connect parent to children as we go
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
class Codec_LevelOrder {
public:
    string serialize(TreeNode* root) {
        if (!root) return "";
        
        string result;
        queue<TreeNode*> q;
        q.push(root);
        
        while (!q.empty()) {
            TreeNode* node = q.front();
            q.pop();
            
            if (node) {
                result += to_string(node->val) + ",";
                q.push(node->left);
                q.push(node->right);
            } else {
                result += "null,";
            }
        }
        
        return result;
    }
    
    TreeNode* deserialize(string data) {
        if (data.empty()) return nullptr;
        
        stringstream ss(data);
        string val;
        getline(ss, val, ',');
        
        TreeNode* root = new TreeNode(stoi(val));
        queue<TreeNode*> q;
        q.push(root);
        
        while (!q.empty()) {
            TreeNode* node = q.front();
            q.pop();
            
            // Process left child
            if (getline(ss, val, ',')) {
                if (val != "null") {
                    node->left = new TreeNode(stoi(val));
                    q.push(node->left);
                }
            }
            
            // Process right child
            if (getline(ss, val, ',')) {
                if (val != "null") {
                    node->right = new TreeNode(stoi(val));
                    q.push(node->right);
                }
            }
        }
        
        return root;
    }
};

/*
 * Approach 3: Pre-order with Index
 * 
 * Intuition:
 * - Similar to approach 1 but use index instead of stringstream
 * - More explicit control over parsing
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
class Codec_Index {
public:
    string serialize(TreeNode* root) {
        string result;
        serializeHelper(root, result);
        return result;
    }
    
    void serializeHelper(TreeNode* node, string& result) {
        if (!node) {
            result += "# ";
            return;
        }
        
        result += to_string(node->val) + " ";
        serializeHelper(node->left, result);
        serializeHelper(node->right, result);
    }
    
    TreeNode* deserialize(string data) {
        istringstream iss(data);
        return deserializeHelper(iss);
    }
    
    TreeNode* deserializeHelper(istringstream& iss) {
        string val;
        iss >> val;
        
        if (val == "#") {
            return nullptr;
        }
        
        TreeNode* node = new TreeNode(stoi(val));
        node->left = deserializeHelper(iss);
        node->right = deserializeHelper(iss);
        
        return node;
    }
};

/*
 * Approach 4: Compact Representation
 * 
 * Intuition:
 * - Use more compact representation
 * - Parentheses to denote structure
 * - Example: 1(2)(3(4)(5))
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
class Codec_Compact {
public:
    string serialize(TreeNode* root) {
        if (!root) return "";
        
        string result = to_string(root->val);
        
        if (root->left || root->right) {
            result += "(" + serialize(root->left) + ")";
        }
        
        if (root->right) {
            result += "(" + serialize(root->right) + ")";
        }
        
        return result;
    }
    
    TreeNode* deserialize(string data) {
        int pos = 0;
        return deserializeHelper(data, pos);
    }
    
    TreeNode* deserializeHelper(string& data, int& pos) {
        if (pos >= data.length()) return nullptr;
        
        // Parse number
        int start = pos;
        if (data[pos] == '-') pos++;
        while (pos < data.length() && isdigit(data[pos])) pos++;
        
        if (start == pos) return nullptr;
        
        TreeNode* node = new TreeNode(stoi(data.substr(start, pos - start)));
        
        // Parse left child
        if (pos < data.length() && data[pos] == '(') {
            pos++;  // skip '('
            node->left = deserializeHelper(data, pos);
            pos++;  // skip ')'
        }
        
        // Parse right child
        if (pos < data.length() && data[pos] == '(') {
            pos++;  // skip '('
            node->right = deserializeHelper(data, pos);
            pos++;  // skip ')'
        }
        
        return node;
    }
};

/*
 * Standard Solution (Pre-order - Most Common)
 */
class Codec {
public:
    // Encodes a tree to a single string
    string serialize(TreeNode* root) {
        string result;
        serializeHelper(root, result);
        return result;
    }
    
    void serializeHelper(TreeNode* node, string& result) {
        if (!node) {
            result += "null,";
            return;
        }
        
        result += to_string(node->val) + ",";
        serializeHelper(node->left, result);
        serializeHelper(node->right, result);
    }
    
    // Decodes your encoded data to tree
    TreeNode* deserialize(string data) {
        stringstream ss(data);
        return deserializeHelper(ss);
    }
    
    TreeNode* deserializeHelper(stringstream& ss) {
        string val;
        getline(ss, val, ',');
        
        if (val == "null") {
            return nullptr;
        }
        
        TreeNode* node = new TreeNode(stoi(val));
        node->left = deserializeHelper(ss);
        node->right = deserializeHelper(ss);
        
        return node;
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

TreeNode* createTree() {
    TreeNode* root = new TreeNode(1);
    root->left = new TreeNode(2);
    root->right = new TreeNode(3);
    root->right->left = new TreeNode(4);
    root->right->right = new TreeNode(5);
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
    // Test Case 1: Pre-order approach
    cout << "Test 1 - Pre-order Serialization" << endl;
    TreeNode* tree1 = createTree();
    cout << "Original tree:" << endl;
    printTree(tree1);
    
    Codec_PreOrder codec1;
    string serialized1 = codec1.serialize(tree1);
    cout << "Serialized: " << serialized1 << endl;
    
    TreeNode* deserialized1 = codec1.deserialize(serialized1);
    cout << "Deserialized tree:" << endl;
    printTree(deserialized1);
    cout << endl;
    
    // Test Case 2: Level-order approach
    cout << "Test 2 - Level-order Serialization" << endl;
    TreeNode* tree2 = createTree();
    
    Codec_LevelOrder codec2;
    string serialized2 = codec2.serialize(tree2);
    cout << "Serialized: " << serialized2 << endl;
    
    TreeNode* deserialized2 = codec2.deserialize(serialized2);
    cout << "Deserialized tree:" << endl;
    printTree(deserialized2);
    cout << endl;
    
    // Test Case 3: Empty tree
    cout << "Test 3 - Empty Tree" << endl;
    Codec codec3;
    string serialized3 = codec3.serialize(nullptr);
    cout << "Serialized: " << serialized3 << endl;
    TreeNode* deserialized3 = codec3.deserialize(serialized3);
    cout << "Deserialized: " << (deserialized3 ? "Not null" : "null") << endl << endl;
    
    // Test Case 4: Single node
    cout << "Test 4 - Single Node" << endl;
    TreeNode* tree4 = new TreeNode(1);
    Codec codec4;
    string serialized4 = codec4.serialize(tree4);
    cout << "Serialized: " << serialized4 << endl;
    TreeNode* deserialized4 = codec4.deserialize(serialized4);
    cout << "Deserialized tree:" << endl;
    printTree(deserialized4);
    cout << endl;
    
    // Test Case 5: Linear tree
    cout << "Test 5 - Linear Tree" << endl;
    TreeNode* tree5 = new TreeNode(1);
    tree5->left = new TreeNode(2);
    tree5->left->left = new TreeNode(3);
    
    Codec codec5;
    string serialized5 = codec5.serialize(tree5);
    cout << "Serialized: " << serialized5 << endl;
    TreeNode* deserialized5 = codec5.deserialize(serialized5);
    cout << "Deserialized tree:" << endl;
    printTree(deserialized5);
    cout << endl;
}

int main() {
    cout << "Serialize and Deserialize Binary Tree" << endl;
    cout << "======================================" << endl << endl;
    
    runTests();
    
    return 0;
}

/*
 * Complexity Analysis Summary:
 * 
 * All Approaches:
 * - Serialization Time: O(n) - visit each node once
 * - Deserialization Time: O(n) - create each node once
 * - Space: O(n) - string storage + recursion/queue
 * 
 * Approach Comparison:
 * 
 * 1. Pre-order (DFS):
 *    - Pros: Simple, recursive, compact
 *    - Cons: Requires null markers
 *    - Best for: Most interviews
 * 
 * 2. Level-order (BFS):
 *    - Pros: Intuitive, matches array representation
 *    - Cons: More complex deserialization
 *    - Best for: When level-order is natural
 * 
 * 3. Compact:
 *    - Pros: More space-efficient
 *    - Cons: More complex parsing
 *    - Best for: Space-constrained scenarios
 * 
 * Key Insights:
 * 1. Need to encode structure (null nodes) explicitly
 * 2. Pre-order allows top-down reconstruction
 * 3. Delimiter needed to separate values
 * 4. Recursion naturally handles tree structure
 * 5. Must handle negative numbers correctly
 * 
 * Why Pre-order Works:
 * - Root comes first, so we know where to start
 * - Left subtree comes before right
 * - Null markers tell us when subtree ends
 * - Recursive structure matches tree structure
 * 
 * Serialization Example (Pre-order):
 *     1
 *    / \
 *   2   3
 *      / \
 *     4   5
 * 
 * Serialized: "1,2,null,null,3,4,null,null,5,null,null,"
 * 
 * Deserialization Process:
 * 1. Read "1" -> create root
 * 2. Read "2" -> create left child
 * 3. Read "null" -> left.left = null
 * 4. Read "null" -> left.right = null
 * 5. Read "3" -> create right child
 * 6. Read "4" -> create right.left
 * ... and so on
 * 
 * Common Pitfalls:
 * 1. Forgetting to handle null nodes
 * 2. Not using delimiter between values
 * 3. Incorrect parsing of negative numbers
 * 4. Off-by-one errors in string parsing
 * 5. Memory leaks (not deleting nodes)
 * 6. Not handling empty tree
 * 
 * Interview Tips:
 * 1. Start with pre-order approach (simplest)
 * 2. Explain why null markers are needed
 * 3. Draw tree and show serialization step-by-step
 * 4. Mention alternative approaches (BFS, compact)
 * 5. Handle edge cases: empty tree, single node
 * 6. Discuss delimiter choice (comma, space, etc.)
 * 7. Test with negative numbers
 * 
 * Design Considerations:
 * 1. Delimiter choice: comma, space, newline
 * 2. Null representation: "null", "#", "N"
 * 3. Number format: decimal, binary, hex
 * 4. Compression: can we make it smaller?
 * 5. Error handling: invalid input
 * 
 * Real-World Applications:
 * 1. Saving tree to file/database
 * 2. Network transmission of tree data
 * 3. Caching tree structures
 * 4. Undo/redo in tree editors
 * 5. Inter-process communication
 * 
 * Extensions and Variations:
 * 1. Serialize N-ary tree
 * 2. Serialize graph (with cycles)
 * 3. Serialize with parent pointers
 * 4. Compressed serialization
 * 5. Binary serialization (not string)
 * 
 * Related Problems:
 * - Serialize and Deserialize BST
 * - Serialize and Deserialize N-ary Tree
 * - Encode and Decode Strings
 * - Construct Binary Tree from String
 * - Clone Graph
 */

// Made with Bob
