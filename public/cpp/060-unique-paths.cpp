/*
 * Problem: Unique Paths (LeetCode 62)
 * Difficulty: Medium
 * Category: Dynamic Programming
 * 
 * Description:
 * There is a robot on an m x n grid. The robot is initially located at the
 * top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right
 * corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right
 * at any point in time.
 * 
 * Given the two integers m and n, return the number of possible unique paths that
 * the robot can take to reach the bottom-right corner.
 * 
 * Example 1:
 * Input: m = 3, n = 7
 * Output: 28
 * 
 * Example 2:
 * Input: m = 3, n = 2
 * Output: 3
 * Explanation: From the top-left corner, there are a total of 3 ways to reach
 * the bottom-right corner:
 * 1. Right -> Down -> Down
 * 2. Down -> Down -> Right
 * 3. Down -> Right -> Down
 * 
 * Constraints:
 * - 1 <= m, n <= 100
 */

#include <iostream>
#include <vector>
using namespace std;

/*
 * APPROACH 1: 2D DYNAMIC PROGRAMMING
 * 
 * Intuition:
 * - Number of ways to reach cell (i,j) = ways to reach (i-1,j) + ways to reach (i,j-1)
 * - This is because we can only come from top or left
 * - Base case: first row and first column all have 1 way (straight line)
 * - Build up the solution using bottom-up DP
 * 
 * Algorithm:
 * 1. Create 2D DP table of size m x n
 * 2. Initialize first row and column to 1
 * 3. For each cell (i,j), dp[i][j] = dp[i-1][j] + dp[i][j-1]
 * 4. Return dp[m-1][n-1]
 * 
 * Time Complexity: O(m * n) - fill entire grid
 * Space Complexity: O(m * n) - DP table
 */
class Solution1 {
public:
    int uniquePaths(int m, int n) {
        // Create DP table
        vector<vector<int>> dp(m, vector<int>(n, 1));
        
        // Fill the DP table
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = dp[i-1][j] + dp[i][j-1];
            }
        }
        
        return dp[m-1][n-1];
    }
};

/*
 * APPROACH 2: SPACE-OPTIMIZED DP (1D ARRAY)
 * 
 * Intuition:
 * - We only need the previous row to compute current row
 * - Use a single array and update it in-place
 * - dp[j] represents ways to reach current position in current row
 * - When computing dp[j], it already contains value from previous row
 * 
 * Algorithm:
 * 1. Create 1D array of size n, initialize to 1
 * 2. For each row i from 1 to m-1:
 *    - For each column j from 1 to n-1:
 *      - dp[j] = dp[j] + dp[j-1]
 *        (dp[j] is from previous row, dp[j-1] is from current row)
 * 3. Return dp[n-1]
 * 
 * Time Complexity: O(m * n) - same iterations
 * Space Complexity: O(n) - single array
 */
class Solution2 {
public:
    int uniquePaths(int m, int n) {
        // Use 1D array
        vector<int> dp(n, 1);
        
        // Process each row
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[j] = dp[j] + dp[j-1];
            }
        }
        
        return dp[n-1];
    }
};

/*
 * APPROACH 3: COMBINATORICS (MATHEMATICAL)
 * 
 * Intuition:
 * - To reach (m-1, n-1) from (0, 0), we need exactly (m-1) down moves and (n-1) right moves
 * - Total moves = (m-1) + (n-1) = m + n - 2
 * - We need to choose (m-1) positions for down moves out of (m+n-2) total positions
 * - This is a combination problem: C(m+n-2, m-1) = (m+n-2)! / ((m-1)! * (n-1)!)
 * - To avoid overflow, compute iteratively
 * 
 * Algorithm:
 * 1. Total moves = m + n - 2
 * 2. Choose min(m-1, n-1) to minimize computation
 * 3. Compute C(total, choose) = total! / (choose! * (total-choose)!)
 * 4. Use iterative multiplication and division to avoid overflow
 * 
 * Time Complexity: O(min(m, n)) - compute combination
 * Space Complexity: O(1) - only variables
 */
class Solution3 {
public:
    int uniquePaths(int m, int n) {
        int total = m + n - 2;
        int choose = min(m - 1, n - 1);
        
        long long result = 1;
        
        // Compute C(total, choose) iteratively
        for (int i = 1; i <= choose; i++) {
            result = result * (total - choose + i) / i;
        }
        
        return (int)result;
    }
};

/*
 * APPROACH 4: RECURSIVE WITH MEMOIZATION (TOP-DOWN DP)
 * 
 * Intuition:
 * - Recursively compute paths from (0,0) to (m-1, n-1)
 * - Use memoization to avoid recomputing same subproblems
 * - paths(i, j) = paths(i-1, j) + paths(i, j-1)
 * 
 * Algorithm:
 * 1. Base cases:
 *    - If i == 0 or j == 0, return 1 (edge of grid)
 *    - If already computed, return cached value
 * 2. Recursively compute paths(i-1, j) and paths(i, j-1)
 * 3. Cache and return sum
 * 
 * Time Complexity: O(m * n) - each cell computed once
 * Space Complexity: O(m * n) - memoization table + recursion stack
 */
class Solution4 {
private:
    int helper(int i, int j, vector<vector<int>>& memo) {
        // Base cases
        if (i == 0 || j == 0) return 1;
        
        // Check memo
        if (memo[i][j] != -1) return memo[i][j];
        
        // Recursive case
        memo[i][j] = helper(i-1, j, memo) + helper(i, j-1, memo);
        return memo[i][j];
    }
    
public:
    int uniquePaths(int m, int n) {
        vector<vector<int>> memo(m, vector<int>(n, -1));
        return helper(m-1, n-1, memo);
    }
};

/*
 * APPROACH 5: SPACE-OPTIMIZED WITH TWO VARIABLES
 * 
 * Intuition:
 * - For very small grids, we can optimize further
 * - Use two variables to track previous and current values
 * - This is an extreme space optimization
 * 
 * Algorithm:
 * 1. If m or n is 1, return 1
 * 2. Use two arrays: prev and curr
 * 3. Update curr based on prev
 * 4. Swap arrays for next iteration
 * 
 * Time Complexity: O(m * n)
 * Space Complexity: O(n) - two arrays of size n
 */
class Solution5 {
public:
    int uniquePaths(int m, int n) {
        if (m == 1 || n == 1) return 1;
        
        vector<int> prev(n, 1);
        vector<int> curr(n, 1);
        
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                curr[j] = curr[j-1] + prev[j];
            }
            prev = curr;
        }
        
        return curr[n-1];
    }
};

// Test function
void test(int m, int n, int approach) {
    int result;
    
    cout << "Input: m = " << m << ", n = " << n << "\n";
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.uniquePaths(m, n);
            cout << "Approach 1 (2D DP): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.uniquePaths(m, n);
            cout << "Approach 2 (1D DP): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.uniquePaths(m, n);
            cout << "Approach 3 (Combinatorics): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.uniquePaths(m, n);
            cout << "Approach 4 (Memoization): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.uniquePaths(m, n);
            cout << "Approach 5 (Two Arrays): ";
            break;
        }
    }
    
    cout << result << "\n\n";
}

int main() {
    // Test Case 1: Standard case
    cout << "Test Case 1: Standard case\n";
    for (int i = 1; i <= 5; i++) {
        test(3, 7, i);
    }
    
    // Test Case 2: Small grid
    cout << "Test Case 2: Small grid\n";
    for (int i = 1; i <= 5; i++) {
        test(3, 2, i);
    }
    
    // Test Case 3: Single row
    cout << "Test Case 3: Single row\n";
    for (int i = 1; i <= 5; i++) {
        test(1, 10, i);
    }
    
    // Test Case 4: Single column
    cout << "Test Case 4: Single column\n";
    for (int i = 1; i <= 5; i++) {
        test(10, 1, i);
    }
    
    // Test Case 5: Square grid
    cout << "Test Case 5: Square grid\n";
    for (int i = 1; i <= 5; i++) {
        test(5, 5, i);
    }
    
    // Test Case 6: Large grid
    cout << "Test Case 6: Large grid\n";
    for (int i = 1; i <= 5; i++) {
        test(10, 10, i);
    }
    
    // Test Case 7: Very small grid
    cout << "Test Case 7: Very small grid\n";
    for (int i = 1; i <= 5; i++) {
        test(2, 2, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (2D DP):
 * - Time: O(m * n) - fill entire grid
 * - Space: O(m * n) - DP table
 * - Best for: Clear visualization, easy to understand
 * 
 * Approach 2 (1D DP):
 * - Time: O(m * n) - same iterations
 * - Space: O(n) - single array
 * - Best for: Space optimization, most practical
 * 
 * Approach 3 (Combinatorics):
 * - Time: O(min(m, n)) - compute combination
 * - Space: O(1) - only variables
 * - Best for: Optimal time and space, mathematical insight
 * 
 * Approach 4 (Memoization):
 * - Time: O(m * n) - each cell computed once
 * - Space: O(m * n) - memo + recursion stack
 * - Best for: Top-down thinking, easier to extend
 * 
 * Approach 5 (Two Arrays):
 * - Time: O(m * n)
 * - Space: O(n) - two arrays
 * - Best for: Alternative space optimization
 * 
 * INTERVIEW TIPS:
 * 1. Start with 2D DP to show understanding
 * 2. Optimize to 1D DP when asked about space
 * 3. Mention combinatorics for optimal solution
 * 4. Discuss trade-offs between approaches
 * 5. This is a classic DP problem - know it well
 * 
 * COMMON MISTAKES:
 * 1. Off-by-one errors in grid dimensions
 * 2. Not initializing first row/column correctly
 * 3. In combinatorics, integer overflow (use long long)
 * 4. Confusing m and n (rows vs columns)
 * 5. Not handling edge cases (m=1 or n=1)
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. What if there are obstacles? (Unique Paths II - LeetCode 63)
 * 2. Can you return all unique paths? (Use backtracking)
 * 3. What if robot can move in 4 directions? (Different problem, use BFS)
 * 4. How to handle very large grids? (Combinatorics with modulo)
 * 5. What if each cell has a cost? (Minimum Path Sum - LeetCode 64)
 * 
 * RELATED PROBLEMS:
 * - Unique Paths II (with obstacles)
 * - Minimum Path Sum
 * - Dungeon Game
 * - Cherry Pickup
 * - Number of Ways to Reach Destination
 */

// Made with Bob
