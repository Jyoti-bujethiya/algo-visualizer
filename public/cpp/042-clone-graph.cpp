/*
 * Problem: Clone Graph (LeetCode 133)
 * Link: https://leetcode.com/problems/clone-graph/
 * Difficulty: Medium
 * Category: Graphs
 * 
 * Description:
 * Given a reference of a node in a connected undirected graph, return a deep copy
 * (clone) of the graph. Each node in the graph contains a value (int) and a list
 * (List[Node]) of its neighbors.
 * 
 * Example 1:
 * Input: adjList = [[2,4],[1,3],[2,4],[1,3]]
 * Output: [[2,4],[1,3],[2,4],[1,3]]
 * 
 * Example 2:
 * Input: adjList = [[]]
 * Output: [[]]
 * 
 * Example 3:
 * Input: adjList = []
 * Output: []
 * 
 * Constraints:
 * - The number of nodes in the graph is in the range [0, 100].
 * - 1 <= Node.val <= 100
 * - Node.val is unique for each node.
 * - There are no repeated edges and no self-loops in the graph.
 * - The Graph is connected and all nodes can be visited starting from the given node.
 */

#include <iostream>
#include <vector>
#include <unordered_map>
#include <queue>
#include <unordered_set>
using namespace std;

// Definition for a Node
class Node {
public:
    int val;
    vector<Node*> neighbors;
    
    Node() {
        val = 0;
        neighbors = vector<Node*>();
    }
    
    Node(int _val) {
        val = _val;
        neighbors = vector<Node*>();
    }
    
    Node(int _val, vector<Node*> _neighbors) {
        val = _val;
        neighbors = _neighbors;
    }
};

/*
 * APPROACH 1: DFS WITH HASH MAP (OPTIMAL)
 * 
 * Intuition:
 * - Use DFS to traverse graph
 * - Use hash map to store original -> clone mapping
 * - Avoid creating duplicate clones
 * - Recursively clone neighbors
 * 
 * Algorithm:
 * 1. If node is null, return null
 * 2. If node already cloned, return clone
 * 3. Create new node with same value
 * 4. Store in map
 * 5. Recursively clone all neighbors
 * 6. Return cloned node
 * 
 * Time Complexity: O(N + E) - visit all nodes and edges
 * Space Complexity: O(N) - hash map + recursion stack
 */
class Solution1 {
private:
    unordered_map<Node*, Node*> visited;
    
public:
    Node* cloneGraph(Node* node) {
        if (!node) return nullptr;
        
        // If already cloned, return clone
        if (visited.find(node) != visited.end()) {
            return visited[node];
        }
        
        // Create clone
        Node* clone = new Node(node->val);
        visited[node] = clone;
        
        // Clone all neighbors
        for (Node* neighbor : node->neighbors) {
            clone->neighbors.push_back(cloneGraph(neighbor));
        }
        
        return clone;
    }
};

/*
 * APPROACH 2: BFS WITH HASH MAP
 * 
 * Intuition:
 * - Use BFS to traverse graph level by level
 * - Use hash map to track cloned nodes
 * - Use queue for BFS traversal
 * 
 * Algorithm:
 * 1. Create clone of starting node
 * 2. Add to queue
 * 3. While queue not empty:
 *    - Process current node
 *    - Clone neighbors if not cloned
 *    - Add neighbors to queue
 * 4. Return clone
 * 
 * Time Complexity: O(N + E)
 * Space Complexity: O(N) - map + queue
 */
class Solution2 {
public:
    Node* cloneGraph(Node* node) {
        if (!node) return nullptr;
        
        unordered_map<Node*, Node*> visited;
        queue<Node*> q;
        
        // Clone starting node
        visited[node] = new Node(node->val);
        q.push(node);
        
        while (!q.empty()) {
            Node* curr = q.front();
            q.pop();
            
            // Process all neighbors
            for (Node* neighbor : curr->neighbors) {
                if (visited.find(neighbor) == visited.end()) {
                    // Clone neighbor
                    visited[neighbor] = new Node(neighbor->val);
                    q.push(neighbor);
                }
                
                // Add neighbor to clone's neighbor list
                visited[curr]->neighbors.push_back(visited[neighbor]);
            }
        }
        
        return visited[node];
    }
};

/*
 * APPROACH 3: DFS WITH EXPLICIT STACK
 * 
 * Intuition:
 * - Iterative DFS using explicit stack
 * - Avoid recursion stack overflow
 * - Same logic as recursive DFS
 * 
 * Algorithm:
 * 1. Use stack for DFS
 * 2. Clone nodes as we visit them
 * 3. Track visited nodes in map
 * 4. Process neighbors iteratively
 * 
 * Time Complexity: O(N + E)
 * Space Complexity: O(N)
 */
class Solution3 {
public:
    Node* cloneGraph(Node* node) {
        if (!node) return nullptr;
        
        unordered_map<Node*, Node*> visited;
        vector<Node*> stack;
        
        visited[node] = new Node(node->val);
        stack.push_back(node);
        
        while (!stack.empty()) {
            Node* curr = stack.back();
            stack.pop_back();
            
            for (Node* neighbor : curr->neighbors) {
                if (visited.find(neighbor) == visited.end()) {
                    visited[neighbor] = new Node(neighbor->val);
                    stack.push_back(neighbor);
                }
                visited[curr]->neighbors.push_back(visited[neighbor]);
            }
        }
        
        return visited[node];
    }
};

/*
 * APPROACH 4: TWO-PASS APPROACH
 * 
 * Intuition:
 * - First pass: create all nodes
 * - Second pass: connect neighbors
 * - Clearer separation of concerns
 * 
 * Algorithm:
 * 1. First BFS: create all node clones
 * 2. Second BFS: connect neighbors
 * 3. Return clone
 * 
 * Time Complexity: O(N + E)
 * Space Complexity: O(N)
 */
class Solution4 {
public:
    Node* cloneGraph(Node* node) {
        if (!node) return nullptr;
        
        unordered_map<Node*, Node*> visited;
        queue<Node*> q;
        
        // First pass: create all nodes
        visited[node] = new Node(node->val);
        q.push(node);
        
        while (!q.empty()) {
            Node* curr = q.front();
            q.pop();
            
            for (Node* neighbor : curr->neighbors) {
                if (visited.find(neighbor) == visited.end()) {
                    visited[neighbor] = new Node(neighbor->val);
                    q.push(neighbor);
                }
            }
        }
        
        // Second pass: connect neighbors
        for (auto& [original, clone] : visited) {
            for (Node* neighbor : original->neighbors) {
                clone->neighbors.push_back(visited[neighbor]);
            }
        }
        
        return visited[node];
    }
};

/*
 * APPROACH 5: RECURSIVE WITH VISITED SET
 * 
 * Intuition:
 * - Similar to Approach 1
 * - Use separate visited set for clarity
 * - Post-order processing
 * 
 * Algorithm:
 * 1. Mark node as visited
 * 2. Create clone
 * 3. Recursively clone neighbors
 * 4. Return clone
 * 
 * Time Complexity: O(N + E)
 * Space Complexity: O(N)
 */
class Solution5 {
private:
    unordered_map<Node*, Node*> clones;
    unordered_set<Node*> visited;
    
    Node* dfs(Node* node) {
        if (!node) return nullptr;
        
        if (clones.find(node) != clones.end()) {
            return clones[node];
        }
        
        Node* clone = new Node(node->val);
        clones[node] = clone;
        visited.insert(node);
        
        for (Node* neighbor : node->neighbors) {
            if (visited.find(neighbor) == visited.end()) {
                clone->neighbors.push_back(dfs(neighbor));
            } else {
                clone->neighbors.push_back(clones[neighbor]);
            }
        }
        
        return clone;
    }
    
public:
    Node* cloneGraph(Node* node) {
        return dfs(node);
    }
};

// Helper function to create graph from adjacency list
Node* createGraph(vector<vector<int>>& adjList) {
    if (adjList.empty()) return nullptr;
    
    int n = adjList.size();
    vector<Node*> nodes(n + 1);
    
    for (int i = 1; i <= n; i++) {
        nodes[i] = new Node(i);
    }
    
    for (int i = 0; i < n; i++) {
        for (int neighbor : adjList[i]) {
            nodes[i + 1]->neighbors.push_back(nodes[neighbor]);
        }
    }
    
    return nodes[1];
}

// Helper function to print graph
void printGraph(Node* node, unordered_set<Node*>& visited) {
    if (!node || visited.find(node) != visited.end()) return;
    
    visited.insert(node);
    cout << "Node " << node->val << " neighbors: [";
    for (int i = 0; i < node->neighbors.size(); i++) {
        cout << node->neighbors[i]->val;
        if (i < node->neighbors.size() - 1) cout << ",";
    }
    cout << "]\n";
    
    for (Node* neighbor : node->neighbors) {
        printGraph(neighbor, visited);
    }
}

// Test function
void test(vector<vector<int>> adjList, int approach) {
    Node* graph = createGraph(adjList);
    Node* result = nullptr;
    
    cout << "Input adjacency list: [";
    for (int i = 0; i < adjList.size(); i++) {
        cout << "[";
        for (int j = 0; j < adjList[i].size(); j++) {
            cout << adjList[i][j];
            if (j < adjList[i].size() - 1) cout << ",";
        }
        cout << "]";
        if (i < adjList.size() - 1) cout << ",";
    }
    cout << "]\n";
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.cloneGraph(graph);
            cout << "Approach 1 (DFS Recursive): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.cloneGraph(graph);
            cout << "Approach 2 (BFS): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.cloneGraph(graph);
            cout << "Approach 3 (DFS Iterative): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.cloneGraph(graph);
            cout << "Approach 4 (Two-Pass): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.cloneGraph(graph);
            cout << "Approach 5 (Visited Set): ";
            break;
        }
    }
    
    if (result) {
        cout << "Cloned\n";
        unordered_set<Node*> visited;
        printGraph(result, visited);
    } else {
        cout << "Empty graph\n";
    }
    cout << "\n";
}

int main() {
    // Test Case 1: Standard graph
    cout << "Test Case 1: Standard graph\n";
    vector<vector<int>> test1 = {{2, 4}, {1, 3}, {2, 4}, {1, 3}};
    for (int i = 1; i <= 5; i++) {
        test(test1, i);
    }
    
    // Test Case 2: Single node
    cout << "Test Case 2: Single node\n";
    vector<vector<int>> test2 = {{}};
    for (int i = 1; i <= 5; i++) {
        test(test2, i);
    }
    
    // Test Case 3: Linear graph
    cout << "Test Case 3: Linear graph\n";
    vector<vector<int>> test3 = {{2}, {1, 3}, {2}};
    for (int i = 1; i <= 5; i++) {
        test(test3, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (DFS Recursive - OPTIMAL):
 * - Time: O(N + E) - visit all nodes and edges
 * - Space: O(N) - map + recursion stack
 * - Best for: Clean, intuitive solution
 * 
 * Approach 2 (BFS):
 * - Time: O(N + E)
 * - Space: O(N) - map + queue
 * - Best for: Level-order traversal preference
 * 
 * Approach 3 (DFS Iterative):
 * - Time: O(N + E)
 * - Space: O(N) - map + stack
 * - Best for: Avoiding recursion
 * 
 * Approach 4 (Two-Pass):
 * - Time: O(N + E)
 * - Space: O(N)
 * - Best for: Clearer logic separation
 * 
 * Approach 5 (Visited Set):
 * - Time: O(N + E)
 * - Space: O(N)
 * - Best for: Explicit visited tracking
 * 
 * INTERVIEW TIPS:
 * 1. Start with Approach 1 (DFS recursive)
 * 2. Explain need for hash map
 * 3. Draw example showing cloning process
 * 4. Mention cycle handling
 * 5. Discuss BFS alternative
 * 
 * COMMON MISTAKES:
 * 1. Creating duplicate clones of same node
 * 2. Not handling cycles properly
 * 3. Forgetting to clone neighbors
 * 4. Shallow copy instead of deep copy
 * 5. Not checking for null input
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. How to verify deep copy? (Check addresses)
 * 2. Can you do it without hash map? (No, need mapping)
 * 3. What if graph is disconnected? (Clone each component)
 * 4. How to handle directed graph? (Same approach)
 * 5. What about weighted edges? (Add weight to Node)
 * 
 * RELATED PROBLEMS:
 * - Copy List with Random Pointer
 * - Clone Binary Tree with Random Pointer
 * - Clone N-ary Tree
 * - Serialize and Deserialize Binary Tree
 * - Graph Valid Tree
 * 
 * KEY INSIGHTS:
 * 1. Hash map prevents duplicate clones
 * 2. Must handle cycles in graph
 * 3. DFS and BFS both work
 * 4. Deep copy means new memory
 * 5. Neighbors must point to clones
 * 
 * GRAPH CLONING PATTERN:
 * - Use hash map for original -> clone mapping
 * - Check map before creating new clone
 * - Recursively/iteratively clone neighbors
 * - Handle cycles by checking visited
 * - Works for any graph structure
 * 
 * WHY HASH MAP NEEDED:
 * - Prevents creating duplicate clones
 * - Handles cycles in graph
 * - Provides O(1) lookup
 * - Maps original to clone
 * - Essential for correctness
 * 
 * DFS VS BFS:
 * - DFS: simpler code, uses recursion
 * - BFS: level-order, uses queue
 * - Both O(N + E) time
 * - Both O(N) space
 * - Choose based on preference
 */

// Made with Bob
