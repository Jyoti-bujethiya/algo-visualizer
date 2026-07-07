/*
 * LeetCode Problem #213: House Robber II
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/house-robber-ii/
 *
 * Problem Statement:
 * You are a professional robber planning to rob houses along a street. Each house
 * has a certain amount of money stashed. All houses are arranged in a circle, which
 * means the first house is the neighbor of the last one. Adjacent houses have
 * security systems connected — robbing two adjacent houses triggers an alarm.
 *
 * Given an integer array nums representing the amount of money of each house,
 * return the maximum amount of money you can rob tonight without alerting the police.
 *
 * Example 1:
 * Input: nums = [2,3,2]
 * Output: 3
 * Explanation: You cannot rob house 1 (2) and house 3 (2) because they are adjacent.
 *
 * Example 2:
 * Input: nums = [1,2,3,1]
 * Output: 4
 * Explanation: Rob house 1 (1) and house 3 (3). Total = 4.
 *
 * Example 3:
 * Input: nums = [1,2,3]
 * Output: 3
 *
 * Constraints:
 * - 1 <= nums.length <= 100
 * - 0 <= nums[i] <= 1000
 */

#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

/*
 * APPROACH 1: Two-pass Linear DP (OPTIMAL)
 *
 * Key Insight:
 * Since the houses form a circle, house[0] and house[n-1] are adjacent.
 * Break the circle by solving two linear sub-problems:
 *   - Rob houses 0..n-2 (exclude last)
 *   - Rob houses 1..n-1 (exclude first)
 * Answer = max of both sub-problems.
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class Solution1 {
private:
    int robLinear(vector<int>& nums, int lo, int hi) {
        int prev2 = 0, prev1 = 0;
        for (int i = lo; i <= hi; i++) {
            int cur = max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }

public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return nums[0];
        if (n == 2) return max(nums[0], nums[1]);
        return max(robLinear(nums, 0, n-2),
                   robLinear(nums, 1, n-1));
    }
};

/*
 * APPROACH 2: DP with Array (Two-pass, explicit dp arrays)
 *
 * Same two-pass idea but store full dp[] to trace the path.
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
class Solution2 {
private:
    int robRange(vector<int>& nums, int lo, int hi) {
        if (lo == hi) return nums[lo];
        vector<int> dp(nums.size(), 0);
        dp[lo] = nums[lo];
        dp[lo+1] = max(nums[lo], nums[lo+1]);
        for (int i = lo+2; i <= hi; i++)
            dp[i] = max(nums[i] + dp[i-2], dp[i-1]);
        return dp[hi];
    }

public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return nums[0];
        if (n == 2) return max(nums[0], nums[1]);
        return max(robRange(nums, 0, n-2),
                   robRange(nums, 1, n-1));
    }
};

/*
 * APPROACH 3: Memoization (Top-Down)
 *
 * Two-pass top-down DP with memoization.
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
class Solution3 {
private:
    vector<int> memo;

    int helper(vector<int>& nums, int i, int hi) {
        if (i > hi) return 0;
        if (memo[i] != -1) return memo[i];
        memo[i] = max(nums[i] + helper(nums, i+2, hi),
                      helper(nums, i+1, hi));
        return memo[i];
    }

public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return nums[0];
        if (n == 2) return max(nums[0], nums[1]);

        memo.assign(n, -1);
        int res1 = helper(nums, 0, n-2);

        memo.assign(n, -1);
        int res2 = helper(nums, 1, n-1);

        return max(res1, res2);
    }
};

/*
 * APPROACH 4: Rob/Skip state machine (Two-pass)
 *
 * Uses explicit rob/skip states (same as House Robber I Approach 4)
 * applied twice over the two ranges.
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class Solution4 {
private:
    int robRange(vector<int>& nums, int lo, int hi) {
        int rob = 0, skip = 0;
        for (int i = lo; i <= hi; i++) {
            int newRob  = skip + nums[i];
            int newSkip = max(rob, skip);
            rob  = newRob;
            skip = newSkip;
        }
        return max(rob, skip);
    }

public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return nums[0];
        if (n == 2) return max(nums[0], nums[1]);
        return max(robRange(nums, 0, n-2),
                   robRange(nums, 1, n-1));
    }
};

// ==================== TEST CASES ====================
void runTests() {
    Solution1 s1; Solution2 s2; Solution3 s3; Solution4 s4;

    auto run = [&](vector<int> nums, int expected) {
        cout << "Input: [";
        for (int i = 0; i < (int)nums.size(); i++) {
            cout << nums[i]; if (i+1 < (int)nums.size()) cout << ",";
        }
        cout << "]\n";
        cout << "  S1=" << s1.rob(nums)
             << "  S2=" << s2.rob(nums)
             << "  S3=" << s3.rob(nums)
             << "  S4=" << s4.rob(nums)
             << "  Expected=" << expected << "\n\n";
    };

    run({2,3,2},     3);
    run({1,2,3,1},   4);
    run({1,2,3},     3);
    run({1},         1);
    run({2,1},       2);
    run({5,5,5,5,5}, 15);
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 *
 * Approach 1 (Two-pass O(1) space — RECOMMENDED):
 *   Time: O(n), Space: O(1)
 *
 * Approach 2 (Two-pass with dp array):
 *   Time: O(n), Space: O(n)
 *
 * Approach 3 (Memoization top-down):
 *   Time: O(n), Space: O(n)
 *
 * Approach 4 (Rob/Skip state machine):
 *   Time: O(n), Space: O(1)
 *
 * KEY INSIGHTS:
 * 1. Circular constraint → break into two linear sub-problems
 * 2. Sub-problem 1: rob houses [0, n-2] (first included, last excluded)
 * 3. Sub-problem 2: rob houses [1, n-1] (first excluded, last included)
 * 4. Answer = max(sub1, sub2)
 * 5. Each sub-problem is identical to House Robber I
 *
 * COMMON MISTAKES:
 * - Forgetting that first and last are adjacent (circular)
 * - Only doing one pass instead of two
 * - Incorrect range boundaries [0,n-2] vs [1,n-1]
 */

// Made with Bob
