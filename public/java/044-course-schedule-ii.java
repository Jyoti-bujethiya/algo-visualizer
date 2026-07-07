/*
 * LeetCode Problem #210: Course Schedule II
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/course-schedule-ii/
 */
import java.util.*;

public class Solution {

    // APPROACH 1: Kahn's Algorithm (BFS Topological Sort) | O(V+E) time | O(V+E) space
    // EXPLAIN: Process nodes with in-degree 0; each processed node goes into the result; if all processed, return result, else empty.
    public int[] findOrder(int n, int[][] prereqs) {
        List<List<Integer>> adj = buildAdj(n, prereqs);
        int[] indegree = new int[n];
        for (int[] p : prereqs) indegree[p[0]]++;
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < n; i++) if (indegree[i] == 0) q.offer(i);
        int[] result = new int[n];
        int idx = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            result[idx++] = u;
            for (int v : adj.get(u)) if (--indegree[v] == 0) q.offer(v);
        }
        return idx == n ? result : new int[]{};
    }

    // APPROACH 2: DFS Topological Sort | O(V+E) time | O(V+E) space
    // EXPLAIN: Post-order DFS; nodes added after all descendants — reverse to get topological order.
    public int[] findOrderDFS(int n, int[][] prereqs) {
        List<List<Integer>> adj = buildAdj(n, prereqs);
        int[] state = new int[n]; // 0=unvis, 1=visiting, 2=done
        List<Integer> order = new ArrayList<>();
        for (int i = 0; i < n; i++)
            if (state[i] == 0 && !dfs(i, adj, state, order)) return new int[]{};
        Collections.reverse(order);
        return order.stream().mapToInt(Integer::intValue).toArray();
    }
    private boolean dfs(int u, List<List<Integer>> adj, int[] state, List<Integer> order) {
        if (state[u] == 1) return false;
        if (state[u] == 2) return true;
        state[u] = 1;
        for (int v : adj.get(u)) if (!dfs(v, adj, state, order)) return false;
        state[u] = 2;
        order.add(u);
        return true;
    }

    // APPROACH 3: Iterative DFS | O(V+E) time | O(V+E) space
    // EXPLAIN: Explicit stack DFS avoids call-stack overflow for large graphs.
    public int[] findOrderIterative(int n, int[][] prereqs) {
        List<List<Integer>> adj = buildAdj(n, prereqs);
        int[] state = new int[n];
        List<Integer> order = new ArrayList<>();
        for (int start = 0; start < n; start++) {
            if (state[start] != 0) continue;
            Deque<int[]> stack = new ArrayDeque<>();  // [node, neighborIdx]
            stack.push(new int[]{start, 0});
            while (!stack.isEmpty()) {
                int[] top = stack.peek();
                int u = top[0], ni = top[1];
                if (ni == 0) {
                    if (state[u] == 1) return new int[]{};
                    if (state[u] == 2) { stack.pop(); continue; }
                    state[u] = 1;
                }
                if (ni < adj.get(u).size()) {
                    top[1]++;
                    int v = adj.get(u).get(ni);
                    if (state[v] == 0) stack.push(new int[]{v, 0});
                    else if (state[v] == 1) return new int[]{};
                } else {
                    state[u] = 2;
                    order.add(u);
                    stack.pop();
                }
            }
        }
        Collections.reverse(order);
        return order.stream().mapToInt(Integer::intValue).toArray();
    }

    // APPROACH 4: Kahn's with Priority Queue | O(V log V + E) time | O(V+E) space
    // EXPLAIN: Min-heap instead of FIFO queue produces lexicographically smallest valid order.
    public int[] findOrderPQ(int n, int[][] prereqs) {
        List<List<Integer>> adj = buildAdj(n, prereqs);
        int[] indegree = new int[n];
        for (int[] p : prereqs) indegree[p[0]]++;
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int i = 0; i < n; i++) if (indegree[i] == 0) pq.offer(i);
        int[] result = new int[n];
        int idx = 0;
        while (!pq.isEmpty()) {
            int u = pq.poll();
            result[idx++] = u;
            for (int v : adj.get(u)) if (--indegree[v] == 0) pq.offer(v);
        }
        return idx == n ? result : new int[]{};
    }

    // APPROACH 5: DFS with Finish Time | O(V log V + E) time | O(V+E) space
    // EXPLAIN: Assign finish timestamps; sort nodes by decreasing finish time for topological order.
    private int timer;
    public int[] findOrderFinishTime(int n, int[][] prereqs) {
        List<List<Integer>> adj = buildAdj(n, prereqs);
        int[] state = new int[n], finish = new int[n];
        timer = 0;
        for (int i = 0; i < n; i++)
            if (state[i] == 0 && !dfsFinish(i, adj, state, finish)) return new int[]{};
        Integer[] ids = new Integer[n];
        for (int i = 0; i < n; i++) ids[i] = i;
        Arrays.sort(ids, (a, b) -> finish[b] - finish[a]);
        return Arrays.stream(ids).mapToInt(Integer::intValue).toArray();
    }
    private boolean dfsFinish(int u, List<List<Integer>> adj, int[] state, int[] finish) {
        if (state[u] == 1) return false;
        if (state[u] == 2) return true;
        state[u] = 1;
        for (int v : adj.get(u)) if (!dfsFinish(v, adj, state, finish)) return false;
        state[u] = 2; finish[u] = timer++;
        return true;
    }

    private List<List<Integer>> buildAdj(int n, int[][] prereqs) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] p : prereqs) adj.get(p[1]).add(p[0]);
        return adj;
    }
}

// Made with Bob
