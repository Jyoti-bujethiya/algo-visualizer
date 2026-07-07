/*
 * LeetCode Problem #200: Number of Islands
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/number-of-islands/
 */
import java.util.*;

public class Solution {

    // APPROACH 1: DFS Recursive | O(m*n) time | O(m*n) space
    // EXPLAIN: For each unvisited '1' cell increment the island count and DFS-mark all connected land cells as '0'.
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int m = grid.length, n = grid[0].length, count = 0;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (grid[i][j] == '1') { count++; dfs(grid, i, j, m, n); }
        return count;
    }
    private void dfs(char[][] g, int i, int j, int m, int n) {
        if (i < 0 || i >= m || j < 0 || j >= n || g[i][j] != '1') return;
        g[i][j] = '0';
        dfs(g, i+1, j, m, n); dfs(g, i-1, j, m, n);
        dfs(g, i, j+1, m, n); dfs(g, i, j-1, m, n);
    }

    // APPROACH 2: BFS | O(m*n) time | O(min(m,n)) space
    // EXPLAIN: BFS from each unvisited land cell; mark visited cells '0' to avoid revisiting.
    public int numIslandsBFS(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int m = grid.length, n = grid[0].length, count = 0;
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) {
            if (grid[i][j] == '1') {
                count++;
                Queue<int[]> q = new LinkedList<>();
                q.offer(new int[]{i, j});
                grid[i][j] = '0';
                while (!q.isEmpty()) {
                    int[] cell = q.poll();
                    for (int[] d : dirs) {
                        int ni = cell[0]+d[0], nj = cell[1]+d[1];
                        if (ni>=0&&ni<m&&nj>=0&&nj<n&&grid[ni][nj]=='1') {
                            grid[ni][nj]='0'; q.offer(new int[]{ni,nj});
                        }
                    }
                }
            }
        }
        return count;
    }

    // APPROACH 3: Union-Find | O(m*n*α) time | O(m*n) space
    // EXPLAIN: Initialize each land cell as its own component; union adjacent land cells and track the component count.
    public int numIslandsUnionFind(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int m = grid.length, n = grid[0].length;
        int[] parent = new int[m * n], rank = new int[m * n];
        int count = 0;
        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) {
            if (grid[i][j] == '1') { parent[i*n+j] = i*n+j; count++; }
        }
        int[][] dirs = {{1,0},{0,1}};
        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) {
            if (grid[i][j] == '1') for (int[] d : dirs) {
                int ni=i+d[0], nj=j+d[1];
                if (ni<m&&nj<n&&grid[ni][nj]=='1') {
                    int a=find(parent,i*n+j), b=find(parent,ni*n+nj);
                    if (a!=b) { if(rank[a]<rank[b]) { int t=a;a=b;b=t; } parent[b]=a; if(rank[a]==rank[b])rank[a]++; count--; }
                }
            }
        }
        return count;
    }
    private int find(int[] p, int x) { return p[x]==x?x:(p[x]=find(p,p[x])); }

    // APPROACH 4: DFS with Visited Array | O(m*n) time | O(m*n) space
    // EXPLAIN: Same DFS logic but marks cells in a separate boolean array, preserving the original grid.
    public int numIslandsVisited(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int m = grid.length, n = grid[0].length, count = 0;
        boolean[][] vis = new boolean[m][n];
        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++)
            if (grid[i][j]=='1'&&!vis[i][j]) { count++; dfsVis(grid,vis,i,j,m,n); }
        return count;
    }
    private void dfsVis(char[][] g, boolean[][] vis, int i, int j, int m, int n) {
        if (i<0||i>=m||j<0||j>=n||g[i][j]!='1'||vis[i][j]) return;
        vis[i][j]=true;
        dfsVis(g,vis,i+1,j,m,n); dfsVis(g,vis,i-1,j,m,n);
        dfsVis(g,vis,i,j+1,m,n); dfsVis(g,vis,i,j-1,m,n);
    }

    // APPROACH 5: Iterative DFS (Stack) | O(m*n) time | O(m*n) space
    // EXPLAIN: Explicit stack replaces the call stack; same marking approach as Approach 1.
    public int numIslandsStack(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int m = grid.length, n = grid[0].length, count = 0;
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) {
            if (grid[i][j] == '1') {
                count++;
                Deque<int[]> stack = new ArrayDeque<>();
                stack.push(new int[]{i, j});
                grid[i][j] = '0';
                while (!stack.isEmpty()) {
                    int[] c = stack.pop();
                    for (int[] d : dirs) {
                        int ni=c[0]+d[0], nj=c[1]+d[1];
                        if (ni>=0&&ni<m&&nj>=0&&nj<n&&grid[ni][nj]=='1') {
                            grid[ni][nj]='0'; stack.push(new int[]{ni,nj});
                        }
                    }
                }
            }
        }
        return count;
    }
}

// Made with Bob
