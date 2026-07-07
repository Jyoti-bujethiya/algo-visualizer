/*
 * Problem: Partition Equal Subset Sum (LeetCode 416)
 * Link: https://leetcode.com/problems/partition-equal-subset-sum/
 * Difficulty: Medium
 * Category: Dynamic Programming
 *
 * Description:
 * Given an integer array nums, return true if you can partition the array into
 * two subsets such that the sum of the elements in both subsets is equal or false
 * otherwise.
 *
 * Example 1:
 * Input: nums = [1,5,11,5]
 * Output: true
 * Explanation: [1,5,5] and [11]
 *
 * Example 2:
 * Input: nums = [1,2,3,5]
 * Output: false
 *
 * Constraints:
 * - 1 <= nums.length <= 200
 * - 1 <= nums[i] <= 100
 */

#include <vector>
#include <algorithm>
#include <iostream>
#include <numeric>
#include <bitset>
using namespace std;

/*
 * APPROACH 1: 2D DP (Boolean Table)
 *
 * Intuition:
 * - Total sum must be even; target = sum/2
 * - dp[i][j] = can we form sum j using first i items?
 * - Recurrence: dp[i][j] = dp[i-1][j] || dp[i-1][j-nums[i-1]]
 *
 * Time:  O(n * target)
 * Space: O(n * target)
 */
class Solution1 {
public:
    bool canPartition(vector<int>& nums) {
        int total = accumulate(nums.begin(), nums.end(), 0);
        if (total % 2 != 0) return false;
        int target = total / 2;
        int n = nums.size();
        vector<vector<bool>> dp(n + 1, vector<bool>(target + 1, false));
        for (int i = 0; i <= n; i++) dp[i][0] = true;
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= target; j++) {
                dp[i][j] = dp[i-1][j];
                if (j >= nums[i-1])
                    dp[i][j] = dp[i][j] || dp[i-1][j - nums[i-1]];
            }
        }
        return dp[n][target];
    }
};

/*
 * APPROACH 2: 1D DP (Space Optimised)
 *
 * Intuition:
 * - Reduce 2D table to 1D by traversing j right-to-left
 * - dp[j] = can we form sum j with elements seen so far?
 *
 * Time:  O(n * target)
 * Space: O(target)
 */
class Solution2 {
public:
    bool canPartition(vector<int>& nums) {
        int total = accumulate(nums.begin(), nums.end(), 0);
        if (total % 2 != 0) return false;
        int target = total / 2;
        vector<bool> dp(target + 1, false);
        dp[0] = true;
        for (int num : nums) {
            for (int j = target; j >= num; j--) {
                dp[j] = dp[j] || dp[j - num];
            }
        }
        return dp[target];
    }
};

/*
 * APPROACH 3: Memoization (Top-Down)
 *
 * Intuition:
 * - Recursively try including / excluding each element
 * - Cache results in memo[i][rem]
 *
 * Time:  O(n * target)
 * Space: O(n * target)
 */
class Solution3 {
private:
    vector<vector<int>> memo;
    bool helper(vector<int>& nums, int i, int rem) {
        if (rem == 0) return true;
        if (i == 0 || rem < 0) return false;
        if (memo[i][rem] != -1) return memo[i][rem];
        memo[i][rem] = helper(nums, i-1, rem) || helper(nums, i-1, rem - nums[i-1]);
        return memo[i][rem];
    }
public:
    bool canPartition(vector<int>& nums) {
        int total = accumulate(nums.begin(), nums.end(), 0);
        if (total % 2 != 0) return false;
        int target = total / 2;
        memo.assign(nums.size() + 1, vector<int>(target + 1, -1));
        return helper(nums, nums.size(), target);
    }
};

/*
 * APPROACH 4: Bitset Optimisation
 *
 * Intuition:
 * - Represent reachable sums as bits in a bitset
 * - For each num, shift bits left by num and OR into the set
 * - Check if target bit is set
 *
 * Time:  O(n * target / 64) — bitset parallelism
 * Space: O(target)
 */
class Solution4 {
public:
    bool canPartition(vector<int>& nums) {
        int total = accumulate(nums.begin(), nums.end(), 0);
        if (total % 2 != 0) return false;
        int target = total / 2;
        bitset<10001> bits;
        bits[0] = 1;
        for (int num : nums) bits |= (bits << num);
        return bits[target];
    }
};

void test(vector<int> nums, int approach) {
    bool result;
    cout << "Input: [";
    for (int i = 0; i < (int)nums.size(); i++) { cout << nums[i]; if (i+1<(int)nums.size()) cout<<","; }
    cout << "] ";
    switch(approach) {
        case 1: { Solution1 s; result = s.canPartition(nums); cout << "2D-DP: "; break; }
        case 2: { Solution2 s; result = s.canPartition(nums); cout << "1D-DP: "; break; }
        case 3: { Solution3 s; result = s.canPartition(nums); cout << "Memo:  "; break; }
        case 4: { Solution4 s; result = s.canPartition(nums); cout << "Bitset:"; break; }
    }
    cout << (result ? "true" : "false") << "\n";
}

int main() {
    vector<int> t1 = {1,5,11,5};   for(int i=1;i<=4;i++) test(t1,i);
    vector<int> t2 = {1,2,3,5};    for(int i=1;i<=4;i++) test(t2,i);
    vector<int> t3 = {1,1};        for(int i=1;i<=4;i++) test(t3,i);
    vector<int> t4 = {3,3,3,4,5};  for(int i=1;i<=4;i++) test(t4,i);
    return 0;
}

/*
 * COMPLEXITY SUMMARY:
 * Approach 1 (2D DP):    Time O(n*T)        Space O(n*T)
 * Approach 2 (1D DP):    Time O(n*T)        Space O(T)
 * Approach 3 (Memo):     Time O(n*T)        Space O(n*T) + stack
 * Approach 4 (Bitset):   Time O(n*T/64)     Space O(T)
 *
 * T = target = sum/2
 */

// Made with Bob
