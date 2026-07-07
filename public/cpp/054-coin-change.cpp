/*
 * LeetCode Problem #322: Coin Change
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/coin-change/
 * 
 * Problem Statement:
 * You are given an integer array coins representing coins of different denominations
 * and an integer amount representing a total amount of money.
 * 
 * Return the fewest number of coins that you need to make up that amount.
 * If that amount of money cannot be made up by any combination of the coins, return -1.
 * 
 * You may assume that you have an infinite number of each kind of coin.
 * 
 * Example:
 * Input: coins = [1,2,5], amount = 11
 * Output: 3
 * Explanation: 11 = 5 + 5 + 1
 */

#include <vector>
#include <queue>
#include <climits>
#include <iostream>
using namespace std;

class Solution {
public:
    // ==================== APPROACH 1: Dynamic Programming (Bottom-Up) ====================
    /*
     * Algorithm:
     * - Build solution from 0 to amount
     * - dp[i] = minimum coins needed for amount i
     * - For each amount, try all coins
     * - dp[i] = min(dp[i], dp[i-coin] + 1)
     * 
     * Time Complexity: O(amount * n) where n = number of coins
     * Space Complexity: O(amount)
     * 
     * When to use: This is the STANDARD solution
     * 
     * Key Insight:
     * - To make amount i, use coin c and solve for i-c
     * - Take minimum across all valid coins
     * - Build from smaller amounts to larger
     */
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);  // Initialize with impossible value
        dp[0] = 0;  // Base case: 0 coins for amount 0
        
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i) {
                    dp[i] = min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        
        return dp[amount] > amount ? -1 : dp[amount];
    }
    
    // ==================== APPROACH 2: BFS (Shortest Path) ====================
    /*
     * Algorithm:
     * - Treat as shortest path problem
     * - Each state is current amount
     * - Each coin is an edge to new state
     * - BFS finds shortest path (minimum coins)
     * 
     * Time Complexity: O(amount * n)
     * Space Complexity: O(amount)
     * 
     * When to use: When thinking in terms of graph traversal
     * 
     * Key Insight:
     * - BFS naturally finds shortest path
     * - Level represents number of coins used
     * - First time reaching amount is optimal
     */
    int coinChange_BFS(vector<int>& coins, int amount) {
        if (amount == 0) return 0;
        
        vector<bool> visited(amount + 1, false);
        queue<int> q;
        q.push(0);
        visited[0] = true;
        int level = 0;
        
        while (!q.empty()) {
            int size = q.size();
            level++;
            
            for (int i = 0; i < size; i++) {
                int current = q.front();
                q.pop();
                
                for (int coin : coins) {
                    int next = current + coin;
                    
                    if (next == amount) {
                        return level;
                    }
                    
                    if (next < amount && !visited[next]) {
                        visited[next] = true;
                        q.push(next);
                    }
                }
            }
        }
        
        return -1;
    }
    
    // ==================== APPROACH 3: Memoization (Top-Down DP) ====================
    /*
     * Algorithm:
     * - Recursively try each coin
     * - Cache results to avoid recomputation
     * - Return minimum across all choices
     * 
     * Time Complexity: O(amount * n)
     * Space Complexity: O(amount) for memo + recursion stack
     * 
     * When to use: When recursive thinking is natural
     * 
     * Key Insight:
     * - Top-down approach with caching
     * - More intuitive for some people
     * - Same complexity as bottom-up
     */
    int coinChange_Memo(vector<int>& coins, int amount) {
        vector<int> memo(amount + 1, -2);  // -2 = not computed
        return coinHelper(coins, amount, memo);
    }
    
private:
    int coinHelper(vector<int>& coins, int amount, vector<int>& memo) {
        if (amount == 0) return 0;
        if (amount < 0) return -1;
        
        if (memo[amount] != -2) {
            return memo[amount];
        }
        
        int minCoins = INT_MAX;
        for (int coin : coins) {
            int result = coinHelper(coins, amount - coin, memo);
            if (result >= 0) {
                minCoins = min(minCoins, result + 1);
            }
        }
        
        memo[amount] = (minCoins == INT_MAX) ? -1 : minCoins;
        return memo[amount];
    }
    
public:
    // ==================== APPROACH 4: Greedy (INCORRECT - for comparison) ====================
    /*
     * Algorithm:
     * - Always use largest coin possible
     * - Repeat until amount reached or impossible
     * 
     * Time Complexity: O(amount / min_coin)
     * Space Complexity: O(1)
     * 
     * When to use: NEVER - This approach is WRONG
     * 
     * Note: Greedy doesn't work for arbitrary coin systems
     * Example: coins=[1,3,4], amount=6
     * Greedy: 4+1+1 = 3 coins
     * Optimal: 3+3 = 2 coins
     */
    int coinChange_Greedy_WRONG(vector<int>& coins, int amount) {
        sort(coins.rbegin(), coins.rend());  // Sort descending
        int count = 0;
        
        for (int coin : coins) {
            while (amount >= coin) {
                amount -= coin;
                count++;
            }
        }
        
        return amount == 0 ? count : -1;
    }
};

// ==================== TEST CASES ====================
void runTests() {
    Solution sol;
    
    // Test Case 1: Standard case
    // Input: coins = [1,2,5], amount = 11
    // Expected: 3 (5+5+1)
    cout << "Test Case 1: Standard case\n";
    vector<int> coins1 = {1, 2, 5};
    cout << "Output: " << sol.coinChange(coins1, 11) << "\n";
    cout << "Expected: 3\n\n";
    
    // Test Case 2: Impossible case
    // Input: coins = [2], amount = 3
    // Expected: -1 (cannot make 3 with only 2s)
    cout << "Test Case 2: Impossible case\n";
    vector<int> coins2 = {2};
    cout << "Output: " << sol.coinChange_BFS(coins2, 3) << "\n";
    cout << "Expected: -1\n\n";
    
    // Test Case 3: Amount is 0
    // Input: coins = [1], amount = 0
    // Expected: 0
    cout << "Test Case 3: Amount is 0\n";
    vector<int> coins3 = {1};
    cout << "Output: " << sol.coinChange_Memo(coins3, 0) << "\n";
    cout << "Expected: 0\n\n";
    
    // Test Case 4: Single coin type
    // Input: coins = [1], amount = 2
    // Expected: 2
    cout << "Test Case 4: Single coin type\n";
    vector<int> coins4 = {1};
    cout << "Output: " << sol.coinChange(coins4, 2) << "\n";
    cout << "Expected: 2\n\n";
    
    // Test Case 5: Greedy fails case
    // Input: coins = [1,3,4], amount = 6
    // Expected: 2 (3+3, not 4+1+1)
    cout << "Test Case 5: Greedy fails case\n";
    vector<int> coins5 = {1, 3, 4};
    cout << "DP Output: " << sol.coinChange(coins5, 6) << "\n";
    cout << "Greedy Output (WRONG): " << sol.coinChange_Greedy_WRONG(coins5, 6) << "\n";
    cout << "Expected: 2\n\n";
    
    // Test Case 6: Large amount
    // Input: coins = [1,5,10,25], amount = 63
    // Expected: 6 (25+25+10+1+1+1)
    cout << "Test Case 6: Large amount\n";
    vector<int> coins6 = {1, 5, 10, 25};
    cout << "Output: " << sol.coinChange_BFS(coins6, 63) << "\n";
    cout << "Expected: 6\n\n";
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. DP Bottom-Up (RECOMMENDED):
 *    Time: O(amount*n), Space: O(amount)
 *    Pros: Optimal, clear, iterative
 *    Cons: None
 *    Best for: Most interview scenarios
 * 
 * 2. BFS:
 *    Time: O(amount*n), Space: O(amount)
 *    Pros: Intuitive as shortest path
 *    Cons: More space for queue
 *    Best for: Graph thinking approach
 * 
 * 3. Memoization Top-Down:
 *    Time: O(amount*n), Space: O(amount)
 *    Pros: Recursive, intuitive
 *    Cons: Recursion overhead
 *    Best for: When recursion preferred
 * 
 * 4. Greedy:
 *    Time: O(amount), Space: O(1)
 *    Pros: Fast, simple
 *    Cons: INCORRECT for arbitrary coins!
 *    Best for: NEVER (shown for comparison)
 * 
 * INTERVIEW TIPS:
 * - Recognize this as unbounded knapsack variant
 * - Explain why greedy doesn't work
 * - Start with recursive solution, then optimize
 * - Discuss DP state: dp[i] = min coins for amount i
 * - Walk through small example (amount=11, coins=[1,2,5])
 * - Mention initialization with amount+1 (impossible value)
 * - Consider edge cases: amount=0, impossible amounts
 * - Discuss why we need infinite coins (unbounded)
 * - Compare with 0/1 knapsack (bounded)
 * - Consider follow-up: print actual coins used
 * 
 * KEY INSIGHTS:
 * - Unbounded knapsack problem (unlimited coins)
 * - Greedy fails for arbitrary coin systems
 * - DP builds solution from smaller amounts
 * - Each amount depends on (amount - coin) subproblems
 * - Initialize with impossible value (amount+1)
 * - BFS treats as shortest path in graph
 * 
 * STEP-BY-STEP WALKTHROUGH:
 * coins = [1,2,5], amount = 11
 * 
 * dp[0] = 0 (base case)
 * dp[1] = min(dp[0]+1) = 1 (use coin 1)
 * dp[2] = min(dp[1]+1, dp[0]+1) = 1 (use coin 2)
 * dp[3] = min(dp[2]+1, dp[1]+1) = 2 (use 2+1)
 * dp[4] = min(dp[3]+1, dp[2]+1) = 2 (use 2+2)
 * dp[5] = min(dp[4]+1, dp[3]+1, dp[0]+1) = 1 (use coin 5)
 * dp[6] = min(dp[5]+1, dp[4]+1, dp[1]+1) = 2 (use 5+1)
 * ...
 * dp[11] = min(dp[10]+1, dp[9]+1, dp[6]+1) = 3 (use 5+5+1)
 * 
 * COMMON MISTAKES:
 * - Using greedy approach (doesn't work!)
 * - Not initializing dp with impossible value
 * - Forgetting base case dp[0] = 0
 * - Not checking if coin <= amount
 * - Integer overflow with INT_MAX
 * - Not handling impossible cases (return -1)
 * - Confusing with 0/1 knapsack (bounded)
 * - Off-by-one errors in loop bounds
 * - Not considering amount = 0 case
 * - Modifying input coins array
 * 
 * FOLLOW-UP QUESTIONS:
 * - How would you print the actual coins used?
 * - What if each coin can only be used once? (0/1 knapsack)
 * - How would you count total number of ways?
 * - What if coins have different weights/values?
 * - How would you handle very large amounts efficiently?
 * 
 * RELATED PROBLEMS:
 * - LeetCode #518: Coin Change II (count ways)
 * - LeetCode #377: Combination Sum IV
 * - LeetCode #279: Perfect Squares
 * - LeetCode #983: Minimum Cost For Tickets
 * - LeetCode #1449: Form Largest Integer With Digits That Add up to Target
 */

// Made with Bob
