/*
 * LeetCode Problem #377: Combination Sum IV
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/combination-sum-iv/
 *
 * Problem Statement:
 * Given an array of distinct integers nums and a target integer target, return
 * the number of possible combinations that add up to target.
 *
 * The test cases are generated so that the answer can fit in a 32-bit integer.
 * Note: order matters (permutations), e.g. [1,1,2] and [1,2,1] and [2,1,1]
 * are all different combinations.
 *
 * Example 1:
 * Input: nums = [1,2,3], target = 4
 * Output: 7
 * Explanation: (1,1,1,1), (1,1,2), (1,2,1), (1,3), (2,1,1), (2,2), (3,1)
 *
 * Example 2:
 * Input: nums = [9], target = 3
 * Output: 0
 *
 * Constraints:
 * - 1 <= nums.length <= 200
 * - 1 <= nums[i] <= 1000
 * - All elements of nums are unique.
 * - 1 <= target <= 1000
 */

#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

/*
 * APPROACH 1: DP Bottom-Up (OPTIMAL)
 *
 * dp[i] = number of ordered combinations that sum to i
 * For each amount i, try every num in nums:
 *   dp[i] += dp[i - num]   (if i >= num)
 * Base: dp[0] = 1
 *
 * Time: O(target * n)
 * Space: O(target)
 */
class Solution1 {
public:
    int combinationSum4(vector<int>& nums, int target) {
        vector<unsigned int> dp(target + 1, 0);
        dp[0] = 1;
        for (int i = 1; i <= target; i++) {
            for (int num : nums) {
                if (i >= num)
                    dp[i] += dp[i - num];
            }
        }
        return dp[target];
    }
};

/*
 * APPROACH 2: DP with sorted nums (minor optimization)
 *
 * Sort nums first so we can break early when num > i.
 *
 * Time: O(target * n)
 * Space: O(target)
 */
class Solution2 {
public:
    int combinationSum4(vector<int>& nums, int target) {
        sort(nums.begin(), nums.end());
        vector<unsigned int> dp(target + 1, 0);
        dp[0] = 1;
        for (int i = 1; i <= target; i++) {
            for (int num : nums) {
                if (num > i) break;   // early exit (nums sorted)
                dp[i] += dp[i - num];
            }
        }
        return dp[target];
    }
};

/*
 * APPROACH 3: Memoization Top-Down
 *
 * Recursive: ways(target) = sum of ways(target - num) for each num
 *
 * Time: O(target * n)
 * Space: O(target)
 */
class Solution3 {
private:
    vector<int> memo;

    int helper(vector<int>& nums, int rem) {
        if (rem == 0) return 1;
        if (memo[rem] != -1) return memo[rem];
        int total = 0;
        for (int num : nums)
            if (rem >= num)
                total += helper(nums, rem - num);
        return memo[rem] = total;
    }

public:
    int combinationSum4(vector<int>& nums, int target) {
        memo.assign(target + 1, -1);
        return helper(nums, target);
    }
};

/*
 * APPROACH 4: DP with 2D table (show how each num contributes)
 *
 * Same as Approach 1 but store which num contributed at each cell.
 *
 * Time: O(target * n)
 * Space: O(target * n)
 */
class Solution4 {
public:
    int combinationSum4(vector<int>& nums, int target) {
        // Same result as Approach 1; 2D table for visualization
        int n = nums.size();
        vector<vector<unsigned int>> contrib(target + 1, vector<unsigned int>(n, 0));
        vector<unsigned int> dp(target + 1, 0);
        dp[0] = 1;
        for (int i = 1; i <= target; i++) {
            for (int k = 0; k < n; k++) {
                if (i >= nums[k]) {
                    contrib[i][k] = dp[i - nums[k]];
                    dp[i] += contrib[i][k];
                }
            }
        }
        return dp[target];
    }
};

// ==================== TEST CASES ====================
void runTests() {
    Solution1 s1; Solution2 s2; Solution3 s3; Solution4 s4;

    auto run = [&](vector<int> nums, int target, int expected) {
        cout << "nums=["; for (int i=0;i<(int)nums.size();i++){cout<<nums[i];if(i+1<(int)nums.size())cout<<",";}
        cout << "], target=" << target << "\n";
        cout << "  S1=" << s1.combinationSum4(nums,target)
             << "  S2=" << s2.combinationSum4(nums,target)
             << "  S3=" << s3.combinationSum4(nums,target)
             << "  S4=" << s4.combinationSum4(nums,target)
             << "  expected=" << expected << "\n\n";
    };

    run({1,2,3}, 4, 7);
    run({9},     3, 0);
    run({1,2,3}, 3, 4);
    run({1},     5, 1);
    run({2,1,3}, 5, 13);
}

int main() { runTests(); return 0; }

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 *
 * Approach 1 (DP Bottom-Up — RECOMMENDED): O(target*n) time, O(target) space
 * Approach 2 (DP Sorted Early-Exit):       O(target*n) time, O(target) space
 * Approach 3 (Memoization Top-Down):       O(target*n) time, O(target) space
 * Approach 4 (2D Contribution Table):      O(target*n) time, O(target*n) space
 *
 * KEY INSIGHTS:
 * 1. ORDER MATTERS — unlike coin change, [1,2] and [2,1] are distinct → iterate
 *    target amounts in outer loop, nums in inner loop (unbounded ordered knapsack).
 * 2. dp[0] = 1 (one way to reach 0: use nothing).
 * 3. Compare to Coin Change II (unordered): swap loop order.
 *
 * COMMON MISTAKES:
 * - Swapping loop order (gives Coin Change II instead).
 * - Integer overflow for large targets (use unsigned int or long).
 */

// Made with Bob
