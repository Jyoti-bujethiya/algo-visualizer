/*
 * LeetCode Problem #417: Pacific Atlantic Water Flow
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/pacific-atlantic-water-flow/
 *
 * Problem Statement:
 * There is an m x n rectangular island that borders both the Pacific Ocean (top/left)
 * and the Atlantic Ocean (bottom/right). Rain water can flow to a neighboring cell
 * if it is at the same or lower height. Return all cells from which water can flow
 * to BOTH oceans.
 *
 * Example:
 *   heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]
 *   Output: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
 *
 * Constraints:
 *   - m == heights.length, n == heights[r].length
 *   - 1 <= m, n <= 200
 *   - 0 <= heights[i][j] <= 10^5
 */

#include <vector>
#include <queue>
#include <iostream>
using namespace std;

using vvi = vector<vector<int>>;
using vvb = vector<vector<bool>>;

// ==================== APPROACH 1: Brute Force (DFS from each cell) ====================
// For each cell, DFS to see if it can reach Pacific and Atlantic independently.
// Time: O(m*n*(m+n))  Space: O(m*n)
class Solution1 {
    int m, n;
    bool canReach(int r, int c, const vvi& h, bool pacific) {
        vector<vector<bool>> vis(m, vector<bool>(n, false));
        return dfs(r, c, h, vis, pacific);
    }
    bool dfs(int r, int c, const vvi& h, vvb& vis, bool pacific) {
        if (pacific && (r == 0 || c == 0)) return true;
        if (!pacific && (r == m-1 || c == n-1)) return true;
        vis[r][c] = true;
        int dr[] = {0,0,1,-1}, dc[] = {1,-1,0,0};
        for (int d = 0; d < 4; d++) {
            int nr = r+dr[d], nc = c+dc[d];
            if (nr<0||nr>=m||nc<0||nc>=n||vis[nr][nc]) continue;
            if (h[nr][nc] <= h[r][c] && dfs(nr, nc, h, vis, pacific)) return true;
        }
        return false;
    }
public:
    vvi pacificAtlantic(vvi& heights) {
        m = heights.size(); n = heights[0].size();
        vvi res;
        for (int r=0;r<m;r++) for (int c=0;c<n;c++)
            if (canReach(r,c,heights,true) && canReach(r,c,heights,false))
                res.push_back({r,c});
        return res;
    }
};

// ==================== APPROACH 2: BFS Multi-source (Optimal) ====================
// Reverse-flood from each ocean border (water flows uphill from ocean).
// Cells reachable from both = answer.
// Time: O(m*n)  Space: O(m*n)
class Solution2 {
    void bfs(queue<pair<int,int>>& q, vvb& visited, const vvi& h) {
        int dr[] = {0,0,1,-1}, dc[] = {1,-1,0,0};
        while (!q.empty()) {
            auto [r,c] = q.front(); q.pop();
            for (int d=0;d<4;d++) {
                int nr=r+dr[d], nc=c+dc[d];
                if (nr<0||nr>=(int)h.size()||nc<0||nc>=(int)h[0].size()||visited[nr][nc]) continue;
                if (h[nr][nc] >= h[r][c]) { visited[nr][nc]=true; q.push({nr,nc}); }
            }
        }
    }
public:
    vvi pacificAtlantic(vvi& heights) {
        int m=heights.size(), n=heights[0].size();
        vvb pac(m,vector<bool>(n,false)), atl(m,vector<bool>(n,false));
        queue<pair<int,int>> pq, aq;
        for (int r=0;r<m;r++) { pac[r][0]=true; pq.push({r,0}); atl[r][n-1]=true; aq.push({r,n-1}); }
        for (int c=0;c<n;c++) { pac[0][c]=true; pq.push({0,c}); atl[m-1][c]=true; aq.push({m-1,c}); }
        bfs(pq,pac,heights); bfs(aq,atl,heights);
        vvi res;
        for (int r=0;r<m;r++) for (int c=0;c<n;c++) if (pac[r][c]&&atl[r][c]) res.push_back({r,c});
        return res;
    }
};

// ==================== APPROACH 3: DFS Multi-source (Optimal DFS variant) ====================
// Same reverse-flood idea using DFS.
// Time: O(m*n)  Space: O(m*n)
class Solution3 {
    void dfs(int r, int c, vvb& visited, const vvi& h) {
        visited[r][c] = true;
        int dr[]={0,0,1,-1}, dc[]={1,-1,0,0};
        for (int d=0;d<4;d++) {
            int nr=r+dr[d], nc=c+dc[d];
            if (nr<0||nr>=(int)h.size()||nc<0||nc>=(int)h[0].size()||visited[nr][nc]) continue;
            if (h[nr][nc] >= h[r][c]) dfs(nr,nc,visited,h);
        }
    }
public:
    vvi pacificAtlantic(vvi& heights) {
        int m=heights.size(), n=heights[0].size();
        vvb pac(m,vector<bool>(n,false)), atl(m,vector<bool>(n,false));
        for (int r=0;r<m;r++) { if (!pac[r][0]) dfs(r,0,pac,heights); if (!atl[r][n-1]) dfs(r,n-1,atl,heights); }
        for (int c=0;c<n;c++) { if (!pac[0][c]) dfs(0,c,pac,heights); if (!atl[m-1][c]) dfs(m-1,c,atl,heights); }
        vvi res;
        for (int r=0;r<m;r++) for (int c=0;c<n;c++) if (pac[r][c]&&atl[r][c]) res.push_back({r,c});
        return res;
    }
};

void runTests() {
    Solution2 sol;
    vvi h1={{1,2,2,3,5},{3,2,3,4,4},{2,4,5,3,1},{6,7,1,4,5},{5,1,1,2,4}};
    auto r1 = sol.pacificAtlantic(h1);
    cout << "Test 1 result size: " << r1.size() << " (expected 7)\n";
    vvi h2={{1}};
    auto r2 = sol.pacificAtlantic(h2);
    cout << "Test 2: " << r2.size() << " (expected 1)\n";
}

int main() { runTests(); return 0; }

// Made with Bob
