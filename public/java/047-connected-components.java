/*
 * LeetCode Problem #323: Number of Connected Components in an Undirected Graph
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/
 */
import java.util.*;

public class Solution {

    // APPROACH 1: DFS | O(V+E) time | O(V+E) space
    // EXPLAIN: DFS from each unvisited node; each invocation discovers one connected component.
    public int countComponents(int n, int[][] edges) {
        List<List<Integer>> adj = buildAdj(n, edges);
        boolean[] visited = new boolean[n];
        int count = 0;
        for (int i = 0; i < n; i++) if (!visited[i]) { dfs(i, adj, visited); count++; }
        return count;
    }
    private void dfs(int u, List<List<Integer>> adj, boolean[] visited) {
        visited[u] = true;
        for (int v : adj.get(u)) if (!visited[v]) dfs(v, adj, visited);
    }

    // APPROACH 2: BFS | O(V+E) time | O(V+E) space
    // EXPLAIN: BFS from each unvisited node; count how many BFS starts are needed.
    public int countComponentsBFS(int n, int[][] edges) {
        List<List<Integer>> adj = buildAdj(n, edges);
        boolean[] visited = new boolean[n];
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                count++;
                Queue<Integer> q = new LinkedList<>();
                q.offer(i); visited[i] = true;
                while (!q.isEmpty()) {
                    int u = q.poll();
                    for (int v : adj.get(u)) if (!visited[v]) { visited[v] = true; q.offer(v); }
                }
            }
        }
        return count;
    }

    // APPROACH 3: Union-Find | O(E·α(V)) time | O(V) space
    // EXPLAIN: Start with n components; each successful union decrements the count.
    public int countComponentsUF(int n, int[][] edges) {
        int[] parent = new int[n], rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        int count = n;
        for (int[] e : edges) {
            int ra = find(parent, e[0]), rb = find(parent, e[1]);
            if (ra != rb) {
                if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
                parent[rb] = ra;
                if (rank[ra] == rank[rb]) rank[ra]++;
                count--;
            }
        }
        return count;
    }
    private int find(int[] p, int x) { return p[x]==x?x:(p[x]=find(p,p[x])); }

    private List<List<Integer>> buildAdj(int n, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        return adj;
    }
}

// Made with Bob
