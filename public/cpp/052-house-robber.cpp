/*
 * Problem: House Robber
 * LeetCode: https://leetcode.com/problems/house-robber/
 * 
 * Description:
 * You are a professional robber planning to rob houses along a street. Each house has a certain
 * amount of money stashed, the only constraint stopping you from robbing each of them is that
 * adjacent houses have security systems connected and it will automatically contact the police
 * if two adjacent houses were broken into on the same night.
 * 
 * Given an integer array nums representing the amount of money of each house, return the maximum
 * amount of money you can rob tonight without alerting the police.
 * 
 * Example 1:
 * Input: nums = [1,2,3,1]
 * Output: 4
 * Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).
 * Total amount you can rob = 1 + 3 = 4.
 * 
 * Example 2:
 * Input: nums = [2,7,9,3,1]
 * Output: 12
 * Explanation: Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1).
 * Total amount you can rob = 2 + 9 + 1 = 12.
 * 
 * Constraints:
 * - 1 <= nums.length <= 100
 * - 0 <= nums[i] <= 400
 * 
 * Difficulty: Medium
 * Topics: Array, Dynamic Programming
 */

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    /*
     * Approach 1: Dynamic Programming (Bottom-Up with Array)
     * 
     * Intuition:
     * - At each house i, we have two choices:
     *   1. Rob house i: Take nums[i] + max money from houses up to i-2
     *   2. Skip house i: Take max money from houses up to i-1
     * - dp[i] = max(nums[i] + dp[i-2], dp[i-1])
     * 
     * Algorithm:
     * 1. Create dp array where dp[i] = max money robbing houses 0 to i
     * 2. Base cases: dp[0] = nums[0], dp[1] = max(nums[0], nums[1])
     * 3. For each house i from 2 to n-1:
     *    - dp[i] = max(nums[i] + dp[i-2], dp[i-1])
     * 4. Return dp[n-1]
     * 
     * Time Complexity: O(n) - single pass through array
     * Space Complexity: O(n) - dp array
     */
    int rob_dp_array(vector<int>& nums) {
        int n = nums.size();
        if (n == 0) return 0;
        if (n == 1) return nums[0];
        
        vector<int> dp(n);
        dp[0] = nums[0];
        dp[1] = max(nums[0], nums[1]);
        
        for (int i = 2; i < n; i++) {
            // Either rob current house + max from i-2, or skip and take max from i-1
            dp[i] = max(nums[i] + dp[i-2], dp[i-1]);
        }
        
        return dp[n-1];
    }
    
    /*
     * Approach 2: Dynamic Programming (Space Optimized)
     * 
     * Intuition:
     * - We only need the last two values (dp[i-1] and dp[i-2])
     * - Can optimize space from O(n) to O(1)
     * - Use two variables: prev1 (i-1) and prev2 (i-2)
     * 
     * Algorithm:
     * 1. Initialize prev2 = 0, prev1 = nums[0]
     * 2. For each house i from 1 to n-1:
     *    - current = max(nums[i] + prev2, prev1)
     *    - Update: prev2 = prev1, prev1 = current
     * 3. Return prev1
     * 
     * Time Complexity: O(n) - single pass
     * Space Complexity: O(1) - only two variables
     */
    int rob_optimized(vector<int>& nums) {
        int n = nums.size();
        if (n == 0) return 0;
        if (n == 1) return nums[0];
        
        int prev2 = 0;           // Max money up to i-2
        int prev1 = nums[0];     // Max money up to i-1
        
        for (int i = 1; i < n; i++) {
            int current = max(nums[i] + prev2, prev1);
            prev2 = prev1;
            prev1 = current;
        }
        
        return prev1;
    }
    
    /*
     * Approach 3: Recursion with Memoization (Top-Down DP)
     * 
     * Intuition:
     * - Recursive definition: rob(i) = max(nums[i] + rob(i-2), rob(i-1))
     * - Use memoization to avoid recomputing subproblems
     * - Cache results in memo array
     * 
     * Algorithm:
     * 1. Base cases: rob(0) = nums[0], rob(1) = max(nums[0], nums[1])
     * 2. For each house i:
     *    - If already computed, return memo[i]
     *    - Otherwise: memo[i] = max(nums[i] + rob(i-2), rob(i-1))
     * 3. Return rob(n-1)
     * 
     * Time Complexity: O(n) - each subproblem computed once
     * Space Complexity: O(n) - memo array + recursion stack
     */
    int robHelper(vector<int>& nums, int i, vector<int>& memo) {
        if (i < 0) return 0;
        if (i == 0) return nums[0];
        if (memo[i] != -1) return memo[i];
        
        // Rob current house + max from i-2, or skip and take max from i-1
        memo[i] = max(nums[i] + robHelper(nums, i-2, memo), 
                      robHelper(nums, i-1, memo));
        return memo[i];
    }
    
    int rob_memoization(vector<int>& nums) {
        int n = nums.size();
        if (n == 0) return 0;
        
        vector<int> memo(n, -1);
        return robHelper(nums, n-1, memo);
    }
    
    /*
     * Approach 4: Alternative Space Optimized (rob/skip pattern)
     * 
     * Intuition:
     * - Track two states: rob current house vs skip current house
     * - rob = nums[i] + skip (must skip previous if robbing current)
     * - skip = max(rob, skip) from previous iteration
     * 
     * Algorithm:
     * 1. Initialize rob = 0, skip = 0
     * 2. For each house:
     *    - newRob = skip + nums[i] (rob current, add to previous skip)
     *    - newSkip = max(rob, skip) (skip current, take max from previous)
     *    - Update rob = newRob, skip = newSkip
     * 3. Return max(rob, skip)
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    int rob_rob_skip(vector<int>& nums) {
        int rob = 0;   // Max money if we rob current house
        int skip = 0;  // Max money if we skip current house
        
        for (int num : nums) {
            int newRob = skip + num;           // Rob current + previous skip
            int newSkip = max(rob, skip);      // Skip current, take max
            rob = newRob;
            skip = newSkip;
        }
        
        return max(rob, skip);
    }
    
    /*
     * Approach 5: Even More Concise Space Optimized
     * 
     * Intuition:
     * - Same as approach 2 but more concise
     * - Use prev and curr to track max money
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    int rob(vector<int>& nums) {
        int prev = 0, curr = 0;
        
        for (int num : nums) {
            int temp = max(curr, prev + num);
            prev = curr;
            curr = temp;
        }
        
        return curr;
    }
};

/*
 * Test Cases
 */
void runTests() {
    Solution sol;
    
    // Test Case 1: Basic case
    vector<int> test1 = {1, 2, 3, 1};
    cout << "Test 1 - Input: [1,2,3,1]" << endl;
    cout << "DP Array: " << sol.rob_dp_array(test1) << endl;
    cout << "Optimized: " << sol.rob_optimized(test1) << endl;
    cout << "Memoization: " << sol.rob_memoization(test1) << endl;
    cout << "Rob/Skip: " << sol.rob_rob_skip(test1) << endl;
    cout << "Concise: " << sol.rob(test1) << endl;
    cout << "Expected: 4" << endl << endl;
    
    // Test Case 2: Longer array
    vector<int> test2 = {2, 7, 9, 3, 1};
    cout << "Test 2 - Input: [2,7,9,3,1]" << endl;
    cout << "DP Array: " << sol.rob_dp_array(test2) << endl;
    cout << "Optimized: " << sol.rob_optimized(test2) << endl;
    cout << "Memoization: " << sol.rob_memoization(test2) << endl;
    cout << "Rob/Skip: " << sol.rob_rob_skip(test2) << endl;
    cout << "Concise: " << sol.rob(test2) << endl;
    cout << "Expected: 12" << endl << endl;
    
    // Test Case 3: Single house
    vector<int> test3 = {5};
    cout << "Test 3 - Input: [5]" << endl;
    cout << "Result: " << sol.rob(test3) << endl;
    cout << "Expected: 5" << endl << endl;
    
    // Test Case 4: Two houses
    vector<int> test4 = {2, 1};
    cout << "Test 4 - Input: [2,1]" << endl;
    cout << "Result: " << sol.rob(test4) << endl;
    cout << "Expected: 2" << endl << endl;
    
    // Test Case 5: All same values
    vector<int> test5 = {5, 5, 5, 5, 5};
    cout << "Test 5 - Input: [5,5,5,5,5]" << endl;
    cout << "Result: " << sol.rob(test5) << endl;
    cout << "Expected: 15 (rob houses 0, 2, 4)" << endl << endl;
    
    // Test Case 6: Increasing values
    vector<int> test6 = {1, 2, 3, 4, 5};
    cout << "Test 6 - Input: [1,2,3,4,5]" << endl;
    cout << "Result: " << sol.rob(test6) << endl;
    cout << "Expected: 9 (rob houses 0, 2, 4 = 1+3+5)" << endl << endl;
    
    // Test Case 7: Large values at ends
    vector<int> test7 = {100, 1, 1, 100};
    cout << "Test 7 - Input: [100,1,1,100]" << endl;
    cout << "Result: " << sol.rob(test7) << endl;
    cout << "Expected: 200 (rob houses 0 and 3)" << endl << endl;
}

int main() {
    cout << "House Robber - Multiple Approaches" << endl;
    cout << "===================================" << endl << endl;
    
    runTests();
    
    return 0;
}

/*
 * Complexity Analysis Summary:
 * 
 * Approach 1 (DP Array):
 * - Time: O(n) - single pass through array
 * - Space: O(n) - dp array
 * 
 * Approach 2 (Space Optimized):
 * - Time: O(n) - single pass
 * - Space: O(1) - only two variables
 * - BEST for interviews: optimal time and space
 * 
 * Approach 3 (Memoization):
 * - Time: O(n) - each subproblem computed once
 * - Space: O(n) - memo array + recursion stack
 * 
 * Approach 4 (Rob/Skip):
 * - Time: O(n)
 * - Space: O(1)
 * - Alternative way to think about the problem
 * 
 * Approach 5 (Concise):
 * - Time: O(n)
 * - Space: O(1)
 * - Most concise implementation
 * 
 * Key Insights:
 * 1. Classic DP problem with optimal substructure
 * 2. Recurrence: dp[i] = max(nums[i] + dp[i-2], dp[i-1])
 * 3. Can optimize space from O(n) to O(1)
 * 4. Multiple ways to think about the problem (rob/skip, prev/curr)
 * 5. Base cases are crucial: handle n=0, n=1, n=2
 * 
 * Common Pitfalls:
 * 1. Forgetting to handle edge cases (empty array, single house)
 * 2. Off-by-one errors in indexing
 * 3. Not considering that skipping might be better than robbing
 * 4. Incorrect initialization of base cases
 * 
 * Interview Tips:
 * 1. Start with recursive solution to show understanding
 * 2. Identify overlapping subproblems
 * 3. Convert to bottom-up DP
 * 4. Optimize space if asked
 * 5. Discuss trade-offs between approaches
 * 6. Test with edge cases
 * 
 * Related Problems:
 * - House Robber II (circular array)
 * - House Robber III (binary tree)
 * - Delete and Earn
 * - Maximum Alternating Subsequence Sum
 */

// Made with Bob
