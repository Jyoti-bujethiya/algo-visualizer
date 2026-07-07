/*
 * LeetCode Problem #261: Graph Valid Tree
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/graph-valid-tree/
 *
 * Problem Statement:
 * Given n nodes labeled from 0 to n-1, and a list of undirected edges (each edge
 * is a pair of nodes), write a function to check whether these edges make up a
 * valid tree.
 *
 * A graph is a valid tree if:
 *   1. It is fully connected (all n nodes are reachable)
 *   2. It has no cycles (exactly n-1 edges)
 *
 * Example 1:
 *   Input: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]
 *   Output: true
 *
 * Example 2:
 *   Input: n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]
 *   Output: false (cycle exists)
 *
 * Constraints:
 *   - 1 <= n <= 2000
 *   - 0 <= edges.length <= 5000
 *   - edges[i].length == 2
 *   - 0 <= ai, bi < n
 *   - ai != bi
 *   - No self-loops or repeated edges
 */

#include <vector>
#include <queue>
#include <algorithm>
#include <iostream>
using namespace std;

// ==================== APPROACH 1: DFS ====================
// Build adjacency list, DFS from node 0, count visited nodes.
// Valid tree iff all n nodes visited and exactly n-1 edges given.
// Time: O(V+E)  Space: O(V+E)
class Solution1 {
public:
    bool validTree(int n, vector<vector<int>>& edges) {
        if ((int)edges.size() != n - 1) return false;
        vector<vector<int>> adj(n);
        for (auto& e : edges) {
            adj[e[0]].push_back(e[1]);
            adj[e[1]].push_back(e[0]);
        }
        vector<bool> visited(n, false);
        dfs(0, adj, visited);
        for (bool v : visited) if (!v) return false;
        return true;
    }
private:
    void dfs(int node, vector<vector<int>>& adj, vector<bool>& visited) {
        visited[node] = true;
        for (int nb : adj[node])
            if (!visited[nb]) dfs(nb, adj, visited);
    }
};

// ==================== APPROACH 2: BFS ====================
// Same idea using BFS instead of DFS.
// Time: O(V+E)  Space: O(V+E)
class Solution2 {
public:
    bool validTree(int n, vector<vector<int>>& edges) {
        if ((int)edges.size() != n - 1) return false;
        vector<vector<int>> adj(n);
        for (auto& e : edges) {
            adj[e[0]].push_back(e[1]);
            adj[e[1]].push_back(e[0]);
        }
        vector<bool> visited(n, false);
        queue<int> q;
        q.push(0);
        visited[0] = true;
        int count = 1;
        while (!q.empty()) {
            int node = q.front(); q.pop();
            for (int nb : adj[node]) {
                if (!visited[nb]) {
                    visited[nb] = true;
                    q.push(nb);
                    count++;
                }
            }
        }
        return count == n;
    }
};

// ==================== APPROACH 3: Union-Find (Optimal) ====================
// Use DSU to detect cycles and confirm single component.
// Time: O(E·α(V))  Space: O(V)
class Solution3 {
    vector<int> parent, rank_;
    int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (rank_[a] < rank_[b]) swap(a, b);
        parent[b] = a;
        if (rank_[a] == rank_[b]) rank_[a]++;
        return true;
    }
public:
    bool validTree(int n, vector<vector<int>>& edges) {
        if ((int)edges.size() != n - 1) return false;
        parent.resize(n); rank_.assign(n, 0);
        for (int i = 0; i < n; i++) parent[i] = i;
        for (auto& e : edges)
            if (!unite(e[0], e[1])) return false;
        return true;
    }
};

void runTests() {
    Solution3 sol;
    vector<vector<int>> e1 = {{0,1},{0,2},{0,3},{1,4}};
    cout << "Test 1: " << sol.validTree(5, e1) << " (expected 1)\n";
    vector<vector<int>> e2 = {{0,1},{1,2},{2,3},{1,3},{1,4}};
    cout << "Test 2: " << sol.validTree(5, e2) << " (expected 0)\n";
    vector<vector<int>> e3 = {};
    cout << "Test 3: " << sol.validTree(1, e3) << " (expected 1)\n";
}

int main() { runTests(); return 0; }

// Made with Bob
