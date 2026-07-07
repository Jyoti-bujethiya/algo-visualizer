/*
 * LeetCode Problem #261: Graph Valid Tree
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/graph-valid-tree/
 */
import java.util.*;

public class Solution {

    // APPROACH 1: DFS | O(V+E) time | O(V+E) space
    // EXPLAIN: Valid tree ↔ exactly n-1 edges AND fully connected; DFS from node 0 and verify all nodes visited.
    public boolean validTree(int n, int[][] edges) {
        if (edges.length != n - 1) return false;
        List<List<Integer>> adj = buildAdj(n, edges);
        boolean[] visited = new boolean[n];
        dfs(0, adj, visited);
        for (boolean v : visited) if (!v) return false;
        return true;
    }
    private void dfs(int u, List<List<Integer>> adj, boolean[] visited) {
        visited[u] = true;
        for (int v : adj.get(u)) if (!visited[v]) dfs(v, adj, visited);
    }

    // APPROACH 2: BFS | O(V+E) time | O(V+E) space
    // EXPLAIN: Same two-condition check using BFS for connectivity.
    public boolean validTreeBFS(int n, int[][] edges) {
        if (edges.length != n - 1) return false;
        List<List<Integer>> adj = buildAdj(n, edges);
        boolean[] visited = new boolean[n];
        Queue<Integer> q = new LinkedList<>();
        q.offer(0); visited[0] = true; int count = 1;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : adj.get(u)) if (!visited[v]) { visited[v] = true; q.offer(v); count++; }
        }
        return count == n;
    }

    // APPROACH 3: Union-Find | O(E·α(V)) time | O(V) space
    // EXPLAIN: Check edge count; union each edge — if already connected, cycle detected.
    public boolean validTreeUF(int n, int[][] edges) {
        if (edges.length != n - 1) return false;
        int[] parent = new int[n], rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        for (int[] e : edges) if (!union(parent, rank, e[0], e[1])) return false;
        return true;
    }
    private int find(int[] p, int x) { return p[x]==x?x:(p[x]=find(p,p[x])); }
    private boolean union(int[] p, int[] r, int a, int b) {
        int ra=find(p,a), rb=find(p,b);
        if (ra==rb) return false;
        if (r[ra]<r[rb]){int t=ra;ra=rb;rb=t;}
        p[rb]=ra; if(r[ra]==r[rb])r[ra]++;
        return true;
    }

    private List<List<Integer>> buildAdj(int n, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        return adj;
    }
}

// Made with Bob
