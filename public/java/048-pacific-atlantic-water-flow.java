/*
 * LeetCode Problem #417: Pacific Atlantic Water Flow
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/pacific-atlantic-water-flow/
 */
import java.util.*;

public class Solution {

    private static final int[][] DIRS = {{0,1},{0,-1},{1,0},{-1,0}};

    // APPROACH 1: Brute Force DFS from Each Cell | O(m*n*(m+n)) time | O(m*n) space
    // EXPLAIN: For each cell independently DFS to check reachability to both oceans.
    public List<List<Integer>> pacificAtlanticBrute(int[][] h) {
        int m=h.length, n=h[0].length;
        List<List<Integer>> res = new ArrayList<>();
        for (int r=0;r<m;r++) for (int c=0;c<n;c++)
            if (canReach(r,c,h,m,n,true) && canReach(r,c,h,m,n,false))
                res.add(Arrays.asList(r,c));
        return res;
    }
    private boolean canReach(int r, int c, int[][] h, int m, int n, boolean pacific) {
        boolean[][] vis = new boolean[m][n];
        Deque<int[]> stack = new ArrayDeque<>();
        stack.push(new int[]{r,c}); vis[r][c]=true;
        while (!stack.isEmpty()) {
            int[] cell = stack.pop();
            int x=cell[0], y=cell[1];
            if (pacific  && (x==0||y==0))   return true;
            if (!pacific && (x==m-1||y==n-1)) return true;
            for (int[] d:DIRS) {
                int nx=x+d[0],ny=y+d[1];
                if (nx>=0&&nx<m&&ny>=0&&ny<n&&!vis[nx][ny]&&h[nx][ny]<=h[x][y]) {
                    vis[nx][ny]=true; stack.push(new int[]{nx,ny});
                }
            }
        }
        return false;
    }

    // APPROACH 2: Multi-Source BFS (Optimal) | O(m*n) time | O(m*n) space
    // EXPLAIN: BFS outward from each ocean's border cells (water flows uphill); intersect both reachability sets.
    public List<List<Integer>> pacificAtlantic(int[][] h) {
        int m=h.length, n=h[0].length;
        boolean[][] pac=new boolean[m][n], atl=new boolean[m][n];
        Queue<int[]> pq=new LinkedList<>(), aq=new LinkedList<>();
        for (int r=0;r<m;r++) { pac[r][0]=true; pq.offer(new int[]{r,0}); atl[r][n-1]=true; aq.offer(new int[]{r,n-1}); }
        for (int c=0;c<n;c++) { pac[0][c]=true; pq.offer(new int[]{0,c}); atl[m-1][c]=true; aq.offer(new int[]{m-1,c}); }
        bfs(pq,pac,h,m,n); bfs(aq,atl,h,m,n);
        List<List<Integer>> res = new ArrayList<>();
        for (int r=0;r<m;r++) for (int c=0;c<n;c++) if (pac[r][c]&&atl[r][c]) res.add(Arrays.asList(r,c));
        return res;
    }
    private void bfs(Queue<int[]> q, boolean[][] vis, int[][] h, int m, int n) {
        while (!q.isEmpty()) {
            int[] cell=q.poll(); int r=cell[0],c=cell[1];
            for (int[] d:DIRS) {
                int nr=r+d[0],nc=c+d[1];
                if (nr>=0&&nr<m&&nc>=0&&nc<n&&!vis[nr][nc]&&h[nr][nc]>=h[r][c]) { vis[nr][nc]=true; q.offer(new int[]{nr,nc}); }
            }
        }
    }

    // APPROACH 3: Multi-Source DFS (Optimal DFS variant) | O(m*n) time | O(m*n) space
    // EXPLAIN: Same reverse-flood idea using DFS instead of BFS.
    public List<List<Integer>> pacificAtlanticDFS(int[][] h) {
        int m=h.length, n=h[0].length;
        boolean[][] pac=new boolean[m][n], atl=new boolean[m][n];
        for (int r=0;r<m;r++) { dfsPAC(r,0,pac,h,m,n); dfsPAC(r,n-1,atl,h,m,n); }
        for (int c=0;c<n;c++) { dfsPAC(0,c,pac,h,m,n); dfsPAC(m-1,c,atl,h,m,n); }
        List<List<Integer>> res = new ArrayList<>();
        for (int r=0;r<m;r++) for (int c=0;c<n;c++) if (pac[r][c]&&atl[r][c]) res.add(Arrays.asList(r,c));
        return res;
    }
    private void dfsPAC(int r, int c, boolean[][] vis, int[][] h, int m, int n) {
        vis[r][c]=true;
        for (int[] d:DIRS) {
            int nr=r+d[0],nc=c+d[1];
            if (nr>=0&&nr<m&&nc>=0&&nc<n&&!vis[nr][nc]&&h[nr][nc]>=h[r][c]) dfsPAC(nr,nc,vis,h,m,n);
        }
    }
}

// Made with Bob
