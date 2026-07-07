/*
 * LeetCode Problem #207: Course Schedule
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/course-schedule/
 */
import java.util.*;

public class Solution {

    // APPROACH 1: DFS with Three States | O(V+E) time | O(V+E) space
    // EXPLAIN: State 0=unvisited, 1=in-progress, 2=done; if we reach a state-1 node we found a cycle.
    public boolean canFinish(int n, int[][] prereqs) {
        List<List<Integer>> adj = buildAdj(n, prereqs);
        int[] state = new int[n];
        for (int i = 0; i < n; i++)
            if (state[i] == 0 && hasCycleDFS(i, adj, state)) return false;
        return true;
    }
    private boolean hasCycleDFS(int u, List<List<Integer>> adj, int[] state) {
        if (state[u] == 1) return true;
        if (state[u] == 2) return false;
        state[u] = 1;
        for (int v : adj.get(u)) if (hasCycleDFS(v, adj, state)) return true;
        state[u] = 2;
        return false;
    }

    // APPROACH 2: BFS / Kahn's Algorithm | O(V+E) time | O(V+E) space
    // EXPLAIN: Process nodes with in-degree 0; if all nodes are eventually processed, no cycle exists.
    public boolean canFinishBFS(int n, int[][] prereqs) {
        List<List<Integer>> adj = buildAdj(n, prereqs);
        int[] indegree = new int[n];
        for (int[] p : prereqs) indegree[p[0]]++;
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < n; i++) if (indegree[i] == 0) q.offer(i);
        int processed = 0;
        while (!q.isEmpty()) {
            int u = q.poll(); processed++;
            for (int v : adj.get(u)) if (--indegree[v] == 0) q.offer(v);
        }
        return processed == n;
    }

    // APPROACH 3: DFS with Visited Sets | O(V+E) time | O(V+E) space
    // EXPLAIN: Use explicit "visiting" and "visited" hash-sets instead of a state array.
    public boolean canFinishSets(int n, int[][] prereqs) {
        List<List<Integer>> adj = buildAdj(n, prereqs);
        Set<Integer> visiting = new HashSet<>(), visited = new HashSet<>();
        for (int i = 0; i < n; i++)
            if (!visited.contains(i) && hasCycleSets(i, adj, visiting, visited)) return false;
        return true;
    }
    private boolean hasCycleSets(int u, List<List<Integer>> adj,
                                  Set<Integer> visiting, Set<Integer> visited) {
        if (visiting.contains(u)) return true;
        if (visited.contains(u))  return false;
        visiting.add(u);
        for (int v : adj.get(u)) if (hasCycleSets(v, adj, visiting, visited)) return true;
        visiting.remove(u); visited.add(u);
        return false;
    }

    // APPROACH 4: DFS with Path Tracking | O(V+E) time | O(V+E) space
    // EXPLAIN: Track per-node "onPath" flag; if we re-enter a node still on the path, cycle found.
    public boolean canFinishPath(int n, int[][] prereqs) {
        List<List<Integer>> adj = buildAdj(n, prereqs);
        boolean[] visited = new boolean[n], onPath = new boolean[n];
        for (int i = 0; i < n; i++)
            if (!visited[i] && dfsCycle(i, adj, visited, onPath)) return false;
        return true;
    }
    private boolean dfsCycle(int u, List<List<Integer>> adj, boolean[] vis, boolean[] onPath) {
        if (onPath[u]) return true;
        if (vis[u])    return false;
        vis[u] = onPath[u] = true;
        for (int v : adj.get(u)) if (dfsCycle(v, adj, vis, onPath)) return true;
        onPath[u] = false;
        return false;
    }

    // APPROACH 5: Kahn's BFS (Variant) | O(V+E) time | O(V+E) space
    // EXPLAIN: Same as Approach 2; separated to emphasise it is a distinct named algorithm.
    public boolean canFinishKahn(int n, int[][] prereqs) {
        return canFinishBFS(n, prereqs);
    }

    private List<List<Integer>> buildAdj(int n, int[][] prereqs) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] p : prereqs) adj.get(p[1]).add(p[0]);
        return adj;
    }
}

// Made with Bob
