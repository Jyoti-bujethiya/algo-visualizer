/*
 * Problem: Number of Islands (LeetCode 200)
 * Difficulty: Medium
 * Category: Trees and Graphs
 * 
 * Description:
 * Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water),
 * return the number of islands.
 * 
 * An island is surrounded by water and is formed by connecting adjacent lands horizontally
 * or vertically. You may assume all four edges of the grid are all surrounded by water.
 * 
 * Example 1:
 * Input: grid = [
 *   ["1","1","1","1","0"],
 *   ["1","1","0","1","0"],
 *   ["1","1","0","0","0"],
 *   ["0","0","0","0","0"]
 * ]
 * Output: 1
 * 
 * Example 2:
 * Input: grid = [
 *   ["1","1","0","0","0"],
 *   ["1","1","0","0","0"],
 *   ["0","0","1","0","0"],
 *   ["0","0","0","1","1"]
 * ]
 * Output: 3
 * 
 * Constraints:
 * - m == grid.length
 * - n == grid[i].length
 * - 1 <= m, n <= 300
 * - grid[i][j] is '0' or '1'
 */

#include <iostream>
#include <vector>
#include <queue>
using namespace std;

/*
 * APPROACH 1: DFS (RECURSIVE)
 * 
 * Intuition:
 * - Iterate through grid
 * - When we find a '1', increment island count
 * - Use DFS to mark all connected '1's as visited
 * - This explores entire island before moving to next
 * 
 * Algorithm:
 * 1. Iterate through each cell
 * 2. If cell is '1', increment count and start DFS
 * 3. DFS marks current cell as '0' (visited)
 * 4. Recursively visit all 4 adjacent cells
 * 5. Continue until all islands counted
 * 
 * Time Complexity: O(m * n) - visit each cell once
 * Space Complexity: O(m * n) - recursion stack in worst case
 */
class Solution1 {
private:
    void dfs(vector<vector<char>>& grid, int i, int j) {
        int m = grid.size();
        int n = grid[0].size();
        
        // Boundary check and water check
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] == '0') {
            return;
        }
        
        // Mark as visited
        grid[i][j] = '0';
        
        // Explore 4 directions
        dfs(grid, i + 1, j); // Down
        dfs(grid, i - 1, j); // Up
        dfs(grid, i, j + 1); // Right
        dfs(grid, i, j - 1); // Left
    }
    
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty() || grid[0].empty()) return 0;
        
        int m = grid.size();
        int n = grid[0].size();
        int count = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    count++;
                    dfs(grid, i, j);
                }
            }
        }
        
        return count;
    }
};

/*
 * APPROACH 2: BFS (ITERATIVE)
 * 
 * Intuition:
 * - Similar to DFS but use queue for level-order traversal
 * - When we find a '1', use BFS to explore entire island
 * - BFS explores island layer by layer
 * 
 * Algorithm:
 * 1. Iterate through each cell
 * 2. If cell is '1', increment count and start BFS
 * 3. Use queue to explore all connected cells
 * 4. Mark visited cells as '0'
 * 5. Continue until all islands counted
 * 
 * Time Complexity: O(m * n) - visit each cell once
 * Space Complexity: O(min(m, n)) - queue size in worst case
 */
class Solution2 {
private:
    void bfs(vector<vector<char>>& grid, int i, int j) {
        int m = grid.size();
        int n = grid[0].size();
        
        queue<pair<int, int>> q;
        q.push({i, j});
        grid[i][j] = '0';
        
        int directions[4][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        
        while (!q.empty()) {
            auto [x, y] = q.front();
            q.pop();
            
            for (auto& dir : directions) {
                int nx = x + dir[0];
                int ny = y + dir[1];
                
                if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] == '1') {
                    grid[nx][ny] = '0';
                    q.push({nx, ny});
                }
            }
        }
    }
    
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty() || grid[0].empty()) return 0;
        
        int m = grid.size();
        int n = grid[0].size();
        int count = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    count++;
                    bfs(grid, i, j);
                }
            }
        }
        
        return count;
    }
};

/*
 * APPROACH 3: UNION-FIND (DISJOINT SET)
 * 
 * Intuition:
 * - Use Union-Find data structure
 * - Connect adjacent land cells
 * - Count number of disjoint sets
 * - This is more complex but shows advanced technique
 * 
 * Algorithm:
 * 1. Initialize Union-Find with all cells
 * 2. For each '1', union with adjacent '1's
 * 3. Count number of unique roots for '1' cells
 * 
 * Time Complexity: O(m * n * α(m*n)) where α is inverse Ackermann
 * Space Complexity: O(m * n) - parent and rank arrays
 */
class Solution3 {
private:
    class UnionFind {
    public:
        vector<int> parent;
        vector<int> rank;
        int count;
        
        UnionFind(vector<vector<char>>& grid) {
            int m = grid.size();
            int n = grid[0].size();
            count = 0;
            
            parent.resize(m * n);
            rank.resize(m * n, 0);
            
            for (int i = 0; i < m; i++) {
                for (int j = 0; j < n; j++) {
                    if (grid[i][j] == '1') {
                        parent[i * n + j] = i * n + j;
                        count++;
                    }
                }
            }
        }
        
        int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]); // Path compression
            }
            return parent[x];
        }
        
        void unite(int x, int y) {
            int rootX = find(x);
            int rootY = find(y);
            
            if (rootX != rootY) {
                // Union by rank
                if (rank[rootX] < rank[rootY]) {
                    parent[rootX] = rootY;
                } else if (rank[rootX] > rank[rootY]) {
                    parent[rootY] = rootX;
                } else {
                    parent[rootY] = rootX;
                    rank[rootX]++;
                }
                count--;
            }
        }
        
        int getCount() {
            return count;
        }
    };
    
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty() || grid[0].empty()) return 0;
        
        int m = grid.size();
        int n = grid[0].size();
        
        UnionFind uf(grid);
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    // Check right neighbor
                    if (j + 1 < n && grid[i][j + 1] == '1') {
                        uf.unite(i * n + j, i * n + j + 1);
                    }
                    // Check down neighbor
                    if (i + 1 < m && grid[i + 1][j] == '1') {
                        uf.unite(i * n + j, (i + 1) * n + j);
                    }
                }
            }
        }
        
        return uf.getCount();
    }
};

/*
 * APPROACH 4: DFS WITH SEPARATE VISITED ARRAY
 * 
 * Intuition:
 * - Use separate visited array instead of modifying grid
 * - Preserves original grid
 * - Same DFS logic but tracks visited separately
 * 
 * Algorithm:
 * 1. Create visited array
 * 2. Use DFS to explore islands
 * 3. Mark cells in visited array
 * 4. Original grid remains unchanged
 * 
 * Time Complexity: O(m * n)
 * Space Complexity: O(m * n) - visited array + recursion
 */
class Solution4 {
private:
    void dfs(vector<vector<char>>& grid, vector<vector<bool>>& visited, int i, int j) {
        int m = grid.size();
        int n = grid[0].size();
        
        if (i < 0 || i >= m || j < 0 || j >= n || 
            grid[i][j] == '0' || visited[i][j]) {
            return;
        }
        
        visited[i][j] = true;
        
        dfs(grid, visited, i + 1, j);
        dfs(grid, visited, i - 1, j);
        dfs(grid, visited, i, j + 1);
        dfs(grid, visited, i, j - 1);
    }
    
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty() || grid[0].empty()) return 0;
        
        int m = grid.size();
        int n = grid[0].size();
        vector<vector<bool>> visited(m, vector<bool>(n, false));
        int count = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1' && !visited[i][j]) {
                    count++;
                    dfs(grid, visited, i, j);
                }
            }
        }
        
        return count;
    }
};

/*
 * APPROACH 5: ITERATIVE DFS WITH STACK
 * 
 * Intuition:
 * - Use stack to simulate DFS iteratively
 * - Avoids recursion stack overflow for large grids
 * - Same logic as recursive DFS but explicit stack
 * 
 * Algorithm:
 * 1. Use stack instead of recursion
 * 2. Push starting cell to stack
 * 3. Pop and explore neighbors
 * 4. Mark visited cells
 * 
 * Time Complexity: O(m * n)
 * Space Complexity: O(m * n) - stack size
 */
class Solution5 {
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty() || grid[0].empty()) return 0;
        
        int m = grid.size();
        int n = grid[0].size();
        int count = 0;
        
        int directions[4][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    count++;
                    
                    // Iterative DFS using stack
                    vector<pair<int, int>> stack;
                    stack.push_back({i, j});
                    grid[i][j] = '0';
                    
                    while (!stack.empty()) {
                        auto [x, y] = stack.back();
                        stack.pop_back();
                        
                        for (auto& dir : directions) {
                            int nx = x + dir[0];
                            int ny = y + dir[1];
                            
                            if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] == '1') {
                                grid[nx][ny] = '0';
                                stack.push_back({nx, ny});
                            }
                        }
                    }
                }
            }
        }
        
        return count;
    }
};

// Test function
void test(vector<vector<char>> grid, int approach) {
    cout << "Input grid:\n";
    for (const auto& row : grid) {
        cout << "[";
        for (int i = 0; i < row.size(); i++) {
            cout << "\"" << row[i] << "\"";
            if (i < row.size() - 1) cout << ",";
        }
        cout << "]\n";
    }
    
    int result;
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.numIslands(grid);
            cout << "Approach 1 (DFS Recursive): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.numIslands(grid);
            cout << "Approach 2 (BFS): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.numIslands(grid);
            cout << "Approach 3 (Union-Find): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.numIslands(grid);
            cout << "Approach 4 (DFS with Visited): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.numIslands(grid);
            cout << "Approach 5 (Iterative DFS): ";
            break;
        }
    }
    
    cout << result << "\n\n";
}

int main() {
    // Test Case 1: Single island
    cout << "Test Case 1: Single island\n";
    vector<vector<char>> test1 = {
        {'1','1','1','1','0'},
        {'1','1','0','1','0'},
        {'1','1','0','0','0'},
        {'0','0','0','0','0'}
    };
    for (int i = 1; i <= 5; i++) {
        test(test1, i);
    }
    
    // Test Case 2: Multiple islands
    cout << "Test Case 2: Multiple islands\n";
    vector<vector<char>> test2 = {
        {'1','1','0','0','0'},
        {'1','1','0','0','0'},
        {'0','0','1','0','0'},
        {'0','0','0','1','1'}
    };
    for (int i = 1; i <= 5; i++) {
        test(test2, i);
    }
    
    // Test Case 3: All water
    cout << "Test Case 3: All water\n";
    vector<vector<char>> test3 = {
        {'0','0','0'},
        {'0','0','0'}
    };
    for (int i = 1; i <= 5; i++) {
        test(test3, i);
    }
    
    // Test Case 4: All land
    cout << "Test Case 4: All land\n";
    vector<vector<char>> test4 = {
        {'1','1'},
        {'1','1'}
    };
    for (int i = 1; i <= 5; i++) {
        test(test4, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (DFS Recursive):
 * - Time: O(m * n) - visit each cell once
 * - Space: O(m * n) - recursion stack worst case
 * - Best for: Clean, intuitive solution
 * 
 * Approach 2 (BFS):
 * - Time: O(m * n)
 * - Space: O(min(m, n)) - queue size
 * - Best for: Level-order exploration
 * 
 * Approach 3 (Union-Find):
 * - Time: O(m * n * α(m*n)) - nearly O(m*n)
 * - Space: O(m * n) - parent/rank arrays
 * - Best for: Advanced technique, dynamic connectivity
 * 
 * Approach 4 (DFS with Visited):
 * - Time: O(m * n)
 * - Space: O(m * n) - visited array
 * - Best for: Preserving original grid
 * 
 * Approach 5 (Iterative DFS):
 * - Time: O(m * n)
 * - Space: O(m * n) - stack
 * - Best for: Avoiding recursion
 * 
 * INTERVIEW TIPS:
 * 1. Start with DFS (Approach 1) - most common
 * 2. Explain why we mark cells as visited
 * 3. Discuss trade-offs between DFS and BFS
 * 4. Mention Union-Find for advanced knowledge
 * 5. Handle edge cases: empty grid, all water, all land
 * 
 * COMMON MISTAKES:
 * 1. Not marking cells as visited (infinite loop)
 * 2. Incorrect boundary checks
 * 3. Not handling empty grid
 * 4. Modifying grid when asked to preserve it
 * 5. Off-by-one errors in grid dimensions
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. What if grid is very large? (Use iterative to avoid stack overflow)
 * 2. Can you preserve original grid? (Use visited array)
 * 3. What if we need island sizes? (Track size during DFS/BFS)
 * 4. How to find largest island? (Track max size)
 * 5. What about diagonal connections? (Add 4 more directions)
 * 
 * RELATED PROBLEMS:
 * - Max Area of Island
 * - Number of Closed Islands
 * - Number of Distinct Islands
 * - Surrounded Regions
 * - Pacific Atlantic Water Flow
 */

// Made with Bob
