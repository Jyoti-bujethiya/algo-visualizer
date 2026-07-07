/*
 * LeetCode Problem #70: Climbing Stairs
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/climbing-stairs/
 * 
 * Problem Statement:
 * You are climbing a staircase. It takes n steps to reach the top.
 * Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?
 * 
 * Example:
 * Input: n = 3
 * Output: 3
 * Explanation: There are three ways to climb to the top:
 * 1. 1 step + 1 step + 1 step
 * 2. 1 step + 2 steps
 * 3. 2 steps + 1 step
 */

#include <vector>
#include <iostream>
using namespace std;

class Solution {
public:
    // ==================== APPROACH 1: Dynamic Programming (Bottom-Up) ====================
    /*
     * Algorithm:
     * - Build solution from base cases up to n
     * - dp[i] = ways to reach step i
     * - dp[i] = dp[i-1] + dp[i-2]
     * - Base: dp[0] = 1, dp[1] = 1
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     * 
     * When to use: Standard DP approach
     * 
     * Key Insight:
     * - To reach step i, come from step i-1 or i-2
     * - Total ways = ways from i-1 + ways from i-2
     * - This is Fibonacci sequence!
     */
    int climbStairs(int n) {
        if (n <= 2) return n;
        
        vector<int> dp(n + 1);
        dp[0] = 1;  // 1 way to stay at ground
        dp[1] = 1;  // 1 way to reach step 1
        
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i-1] + dp[i-2];
        }
        
        return dp[n];
    }
    
    // ==================== APPROACH 2: Space-Optimized DP ====================
    /*
     * Algorithm:
     * - Only need last two values, not entire array
     * - Use two variables instead of array
     * - Update variables in each iteration
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     * 
     * When to use: This is the OPTIMAL solution
     * 
     * Key Insight:
     * - Only previous two states needed
     * - Constant space optimization
     * - Same logic as Fibonacci
     */
    int climbStairs_Optimized(int n) {
        if (n <= 2) return n;
        
        int prev2 = 1;  // dp[i-2]
        int prev1 = 1;  // dp[i-1]
        int current;
        
        for (int i = 2; i <= n; i++) {
            current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }
        
        return current;
    }
    
    // ==================== APPROACH 3: Recursive with Memoization (Top-Down) ====================
    /*
     * Algorithm:
     * - Recursively calculate ways from top
     * - Cache results to avoid recomputation
     * - Base cases: n=0 returns 1, n=1 returns 1
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n) for memo + recursion stack
     * 
     * When to use: When recursive thinking is natural
     * 
     * Key Insight:
     * - Top-down approach with memoization
     * - Avoids exponential time of naive recursion
     */
    int climbStairs_Memo(int n) {
        vector<int> memo(n + 1, -1);
        return climbHelper(n, memo);
    }
    
private:
    int climbHelper(int n, vector<int>& memo) {
        if (n <= 1) return 1;
        
        if (memo[n] != -1) {
            return memo[n];
        }
        
        memo[n] = climbHelper(n-1, memo) + climbHelper(n-2, memo);
        return memo[n];
    }
    
public:
    // ==================== APPROACH 4: Matrix Exponentiation ====================
    /*
     * Algorithm:
     * - Use matrix exponentiation for Fibonacci
     * - [[1,1],[1,0]]^n gives Fibonacci numbers
     * - Fast exponentiation in O(log n)
     * 
     * Time Complexity: O(log n)
     * Space Complexity: O(1)
     * 
     * When to use: For very large n (advanced)
     * 
     * Key Insight:
     * - Fibonacci can be computed via matrix power
     * - Binary exponentiation reduces time
     * - Overkill for this problem but interesting
     */
    int climbStairs_Matrix(int n) {
        if (n <= 2) return n;
        
        vector<vector<long long>> base = {{1, 1}, {1, 0}};
        vector<vector<long long>> result = matrixPower(base, n);
        
        return result[0][0];
    }
    
private:
    vector<vector<long long>> matrixMultiply(vector<vector<long long>>& A, 
                                             vector<vector<long long>>& B) {
        vector<vector<long long>> C(2, vector<long long>(2));
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 2; j++) {
                C[i][j] = 0;
                for (int k = 0; k < 2; k++) {
                    C[i][j] += A[i][k] * B[k][j];
                }
            }
        }
        return C;
    }
    
    vector<vector<long long>> matrixPower(vector<vector<long long>>& matrix, int n) {
        if (n == 1) return matrix;
        
        if (n % 2 == 0) {
            auto half = matrixPower(matrix, n / 2);
            return matrixMultiply(half, half);
        } else {
            auto half = matrixPower(matrix, n - 1);
            return matrixMultiply(matrix, half);
        }
    }
    
public:
    // ==================== APPROACH 5: Mathematical Formula (Binet's Formula) ====================
    /*
     * Algorithm:
     * - Use closed-form Fibonacci formula
     * - F(n) = (φ^n - ψ^n) / √5
     * - φ = (1 + √5) / 2, ψ = (1 - √5) / 2
     * 
     * Time Complexity: O(1)
     * Space Complexity: O(1)
     * 
     * When to use: For mathematical elegance (not practical)
     * 
     * Note: Floating point precision issues for large n
     */
    int climbStairs_Formula(int n) {
        double sqrt5 = sqrt(5);
        double phi = (1 + sqrt5) / 2;
        double psi = (1 - sqrt5) / 2;
        
        return round((pow(phi, n + 1) - pow(psi, n + 1)) / sqrt5);
    }
};

// ==================== TEST CASES ====================
void runTests() {
    Solution sol;
    
    // Test Case 1: Small n
    // Input: n = 2
    // Expected: 2 (1+1, 2)
    cout << "Test Case 1: n = 2\n";
    cout << "Output: " << sol.climbStairs(2) << "\n";
    cout << "Expected: 2\n\n";
    
    // Test Case 2: Medium n
    // Input: n = 3
    // Expected: 3 (1+1+1, 1+2, 2+1)
    cout << "Test Case 2: n = 3\n";
    cout << "Output: " << sol.climbStairs_Optimized(3) << "\n";
    cout << "Expected: 3\n\n";
    
    // Test Case 3: Larger n
    // Input: n = 5
    // Expected: 8
    cout << "Test Case 3: n = 5\n";
    cout << "Output: " << sol.climbStairs_Memo(5) << "\n";
    cout << "Expected: 8\n\n";
    
    // Test Case 4: Base case
    // Input: n = 1
    // Expected: 1
    cout << "Test Case 4: n = 1\n";
    cout << "Output: " << sol.climbStairs_Matrix(1) << "\n";
    cout << "Expected: 1\n\n";
    
    // Test Case 5: Larger value
    // Input: n = 10
    // Expected: 89
    cout << "Test Case 5: n = 10\n";
    cout << "Output: " << sol.climbStairs_Formula(10) << "\n";
    cout << "Expected: 89\n\n";
    
    // Test Case 6: Verify Fibonacci pattern
    cout << "Test Case 6: Fibonacci pattern verification\n";
    cout << "n=1: " << sol.climbStairs(1) << " (Expected: 1)\n";
    cout << "n=2: " << sol.climbStairs(2) << " (Expected: 2)\n";
    cout << "n=3: " << sol.climbStairs(3) << " (Expected: 3)\n";
    cout << "n=4: " << sol.climbStairs(4) << " (Expected: 5)\n";
    cout << "n=5: " << sol.climbStairs(5) << " (Expected: 8)\n";
    cout << "n=6: " << sol.climbStairs(6) << " (Expected: 13)\n\n";
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. DP Bottom-Up:
 *    Time: O(n), Space: O(n)
 *    Pros: Clear, easy to understand
 *    Cons: Uses O(n) space
 *    Best for: Learning DP concepts
 * 
 * 2. Space-Optimized DP (RECOMMENDED):
 *    Time: O(n), Space: O(1)
 *    Pros: Optimal space, simple
 *    Cons: None
 *    Best for: Most interview scenarios
 * 
 * 3. Memoization Top-Down:
 *    Time: O(n), Space: O(n)
 *    Pros: Intuitive recursion
 *    Cons: Extra space, recursion overhead
 *    Best for: When recursion is natural
 * 
 * 4. Matrix Exponentiation:
 *    Time: O(log n), Space: O(1)
 *    Pros: Fastest for very large n
 *    Cons: Complex, overkill for this problem
 *    Best for: Advanced optimization
 * 
 * 5. Mathematical Formula:
 *    Time: O(1), Space: O(1)
 *    Pros: Constant time
 *    Cons: Floating point precision issues
 *    Best for: Mathematical elegance only
 * 
 * INTERVIEW TIPS:
 * - Recognize this as Fibonacci sequence
 * - Start with recursive solution, then optimize
 * - Explain why dp[i] = dp[i-1] + dp[i-2]
 * - Mention space optimization opportunity
 * - Draw small examples (n=1,2,3) to verify
 * - Discuss base cases carefully
 * - Consider edge cases: n=0, n=1
 * - Mention this is classic DP problem
 * - Discuss how to extend to k steps
 * - Consider follow-up: count ways with specific constraints
 * 
 * KEY INSIGHTS:
 * - This is Fibonacci sequence: F(n+1)
 * - To reach step n: come from n-1 or n-2
 * - Overlapping subproblems → DP applicable
 * - Only need last two values → space optimization
 * - Pattern: 1, 2, 3, 5, 8, 13, 21...
 * - Can be generalized to k steps per move
 * 
 * STEP-BY-STEP WALKTHROUGH:
 * n = 5
 * 
 * dp[0] = 1 (base)
 * dp[1] = 1 (base)
 * dp[2] = dp[1] + dp[0] = 1 + 1 = 2
 * dp[3] = dp[2] + dp[1] = 2 + 1 = 3
 * dp[4] = dp[3] + dp[2] = 3 + 2 = 5
 * dp[5] = dp[4] + dp[3] = 5 + 3 = 8
 * 
 * Ways to reach step 5: 8
 * 
 * Actual paths:
 * 1. 1+1+1+1+1
 * 2. 1+1+1+2
 * 3. 1+1+2+1
 * 4. 1+2+1+1
 * 5. 2+1+1+1
 * 6. 1+2+2
 * 7. 2+1+2
 * 8. 2+2+1
 * 
 * COMMON MISTAKES:
 * - Starting with dp[0] = 0 (should be 1)
 * - Confusing n with array index
 * - Not handling n=1 separately
 * - Forgetting base cases
 * - Off-by-one errors in loop
 * - Not recognizing Fibonacci pattern
 * - Using naive recursion (exponential time)
 * - Integer overflow for large n
 * - Incorrect space optimization
 * - Not considering n=0 case
 * 
 * FOLLOW-UP QUESTIONS:
 * - What if you can climb 1, 2, or 3 steps? (generalize to k steps)
 * - What if some steps are broken and cannot be used?
 * - What if there's a cost associated with each step?
 * - How would you find the minimum cost path?
 * - How would you print all possible paths?
 * 
 * RELATED PROBLEMS:
 * - LeetCode #746: Min Cost Climbing Stairs
 * - LeetCode #509: Fibonacci Number
 * - LeetCode #1137: N-th Tribonacci Number
 * - LeetCode #91: Decode Ways (similar DP pattern)
 * - LeetCode #198: House Robber (similar DP)
 */

// Made with Bob
