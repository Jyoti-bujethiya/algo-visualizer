/*
 * LeetCode Problem #323: Number of Connected Components in an Undirected Graph
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/
 *
 * Problem Statement:
 * Given n nodes labeled 0 to n-1 and a list of undirected edges, find the number
 * of connected components in the graph.
 *
 * Example 1:
 *   Input: n = 5, edges = [[0,1],[1,2],[3,4]]
 *   Output: 2
 *
 * Example 2:
 *   Input: n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]
 *   Output: 1
 *
 * Constraints:
 *   - 1 <= n <= 2000
 *   - 1 <= edges.length <= 5000
 *   - edges[i].length == 2
 *   - 0 <= ai < bi < n
 *   - No repeated edges
 */

#include <vector>
#include <queue>
#include <iostream>
using namespace std;

// ==================== APPROACH 1: DFS ====================
// DFS from each unvisited node; each DFS call = one new component.
// Time: O(V+E)  Space: O(V+E)
class Solution1 {
    void dfs(int node, vector<vector<int>>& adj, vector<bool>& vis) {
        vis[node] = true;
        for (int nb : adj[node]) if (!vis[nb]) dfs(nb, adj, vis);
    }
public:
    int countComponents(int n, vector<vector<int>>& edges) {
        vector<vector<int>> adj(n);
        for (auto& e : edges) { adj[e[0]].push_back(e[1]); adj[e[1]].push_back(e[0]); }
        vector<bool> vis(n, false);
        int count = 0;
        for (int i = 0; i < n; i++) if (!vis[i]) { dfs(i, adj, vis); count++; }
        return count;
    }
};

// ==================== APPROACH 2: BFS ====================
// BFS from each unvisited node; count how many BFS starts needed.
// Time: O(V+E)  Space: O(V+E)
class Solution2 {
public:
    int countComponents(int n, vector<vector<int>>& edges) {
        vector<vector<int>> adj(n);
        for (auto& e : edges) { adj[e[0]].push_back(e[1]); adj[e[1]].push_back(e[0]); }
        vector<bool> vis(n, false);
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (!vis[i]) {
                count++;
                queue<int> q;
                q.push(i); vis[i] = true;
                while (!q.empty()) {
                    int node = q.front(); q.pop();
                    for (int nb : adj[node]) if (!vis[nb]) { vis[nb] = true; q.push(nb); }
                }
            }
        }
        return count;
    }
};

// ==================== APPROACH 3: Union-Find (Optimal) ====================
// Union all edges; count distinct roots = number of components.
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
    int countComponents(int n, vector<vector<int>>& edges) {
        parent.resize(n); rank_.assign(n, 0);
        for (int i = 0; i < n; i++) parent[i] = i;
        int components = n;
        for (auto& e : edges) if (unite(e[0], e[1])) components--;
        return components;
    }
};

void runTests() {
    Solution3 sol;
    vector<vector<int>> e1 = {{0,1},{1,2},{3,4}};
    cout << "Test 1: " << sol.countComponents(5, e1) << " (expected 2)\n";
    vector<vector<int>> e2 = {{0,1},{1,2},{2,3},{3,4}};
    cout << "Test 2: " << sol.countComponents(5, e2) << " (expected 1)\n";
    vector<vector<int>> e3 = {};
    cout << "Test 3: " << sol.countComponents(3, e3) << " (expected 3)\n";
}

int main() { runTests(); return 0; }

// Made with Bob
