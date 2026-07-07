/*
 * Problem: Longest Increasing Subsequence (LeetCode 300)
 * Link: https://leetcode.com/problems/longest-increasing-subsequence/
 * Difficulty: Medium
 * Category: Dynamic Programming
 * 
 * Description:
 * Given an integer array nums, return the length of the longest strictly increasing
 * subsequence.
 * 
 * A subsequence is a sequence that can be derived from an array by deleting some or
 * no elements without changing the order of the remaining elements.
 * 
 * Example 1:
 * Input: nums = [10,9,2,5,3,7,101,18]
 * Output: 4
 * Explanation: The longest increasing subsequence is [2,3,7,101], therefore the length is 4.
 * 
 * Example 2:
 * Input: nums = [0,1,0,3,2,3]
 * Output: 4
 * 
 * Example 3:
 * Input: nums = [7,7,7,7,7,7,7]
 * Output: 1
 * 
 * Constraints:
 * - 1 <= nums.length <= 2500
 * - -10^4 <= nums[i] <= 10^4
 */

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/*
 * APPROACH 1: DYNAMIC PROGRAMMING O(n^2)
 * 
 * Intuition:
 * - dp[i] = length of LIS ending at index i
 * - For each i, check all j < i
 * - If nums[j] < nums[i], can extend LIS ending at j
 * - dp[i] = max(dp[j] + 1) for all valid j
 * 
 * Algorithm:
 * 1. Initialize dp array with 1 (each element is LIS of length 1)
 * 2. For each i from 1 to n-1:
 *    - For each j from 0 to i-1:
 *      - If nums[j] < nums[i]:
 *        - dp[i] = max(dp[i], dp[j] + 1)
 * 3. Return max value in dp array
 * 
 * Time Complexity: O(n^2) - nested loops
 * Space Complexity: O(n) - dp array
 */
class Solution1 {
public:
    int lengthOfLIS(vector<int>& nums) {
        int n = nums.size();
        vector<int> dp(n, 1);
        int maxLen = 1;
        
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    dp[i] = max(dp[i], dp[j] + 1);
                }
            }
            maxLen = max(maxLen, dp[i]);
        }
        
        return maxLen;
    }
};

/*
 * APPROACH 2: BINARY SEARCH + DP (OPTIMAL)
 * 
 * Intuition:
 * - Maintain array of smallest tail elements for each length
 * - tails[i] = smallest tail of all increasing subsequences of length i+1
 * - Use binary search to find position to update
 * - If element larger than all tails, extend sequence
 * - Otherwise, replace first tail >= element
 * 
 * Algorithm:
 * 1. Initialize tails array
 * 2. For each number:
 *    - Binary search for position in tails
 *    - If larger than all, append
 *    - Otherwise, replace element at position
 * 3. Return length of tails
 * 
 * Time Complexity: O(n log n) - binary search for each element
 * Space Complexity: O(n) - tails array
 */
class Solution2 {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;
        
        for (int num : nums) {
            auto it = lower_bound(tails.begin(), tails.end(), num);
            
            if (it == tails.end()) {
                tails.push_back(num);
            } else {
                *it = num;
            }
        }
        
        return tails.size();
    }
};

/*
 * APPROACH 3: BINARY SEARCH WITH MANUAL IMPLEMENTATION
 * 
 * Intuition:
 * - Same as Approach 2 but implement binary search manually
 * - Better understanding of algorithm
 * - More control over search logic
 * 
 * Algorithm:
 * Same as Approach 2 with manual binary search
 * 
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */
class Solution3 {
private:
    int binarySearch(vector<int>& tails, int target) {
        int left = 0, right = tails.size() - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (tails[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return left;
    }
    
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;
        
        for (int num : nums) {
            int pos = binarySearch(tails, num);
            
            if (pos == tails.size()) {
                tails.push_back(num);
            } else {
                tails[pos] = num;
            }
        }
        
        return tails.size();
    }
};

/*
 * APPROACH 4: DP WITH RECONSTRUCTION
 * 
 * Intuition:
 * - Same as Approach 1 but also track actual sequence
 * - Store parent pointers to reconstruct LIS
 * - Can print actual subsequence
 * 
 * Algorithm:
 * 1. Build dp array as in Approach 1
 * 2. Also maintain parent array
 * 3. Track index of maximum length
 * 4. Reconstruct sequence using parent pointers
 * 
 * Time Complexity: O(n^2)
 * Space Complexity: O(n)
 */
class Solution4 {
public:
    int lengthOfLIS(vector<int>& nums) {
        int n = nums.size();
        vector<int> dp(n, 1);
        vector<int> parent(n, -1);
        int maxLen = 1;
        int maxIdx = 0;
        
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
                    dp[i] = dp[j] + 1;
                    parent[i] = j;
                }
            }
            
            if (dp[i] > maxLen) {
                maxLen = dp[i];
                maxIdx = i;
            }
        }
        
        // Reconstruct sequence (optional)
        vector<int> lis;
        int curr = maxIdx;
        while (curr != -1) {
            lis.push_back(nums[curr]);
            curr = parent[curr];
        }
        reverse(lis.begin(), lis.end());
        
        return maxLen;
    }
};

/*
 * APPROACH 5: SEGMENT TREE (ADVANCED)
 * 
 * Intuition:
 * - Use segment tree to query max LIS length for range
 * - For each element, query max length for all smaller values
 * - Update segment tree with new length
 * 
 * Algorithm:
 * 1. Coordinate compression for values
 * 2. Build segment tree
 * 3. For each element:
 *    - Query max length for smaller values
 *    - Update with new length
 * 4. Return overall max
 * 
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */
class Solution5 {
private:
    vector<int> tree;
    int offset;
    
    void update(int pos, int val) {
        pos += offset;
        tree[pos] = max(tree[pos], val);
        
        while (pos > 1) {
            pos /= 2;
            tree[pos] = max(tree[pos * 2], tree[pos * 2 + 1]);
        }
    }
    
    int query(int left, int right) {
        left += offset;
        right += offset;
        int result = 0;
        
        while (left <= right) {
            if (left % 2 == 1) result = max(result, tree[left++]);
            if (right % 2 == 0) result = max(result, tree[right--]);
            left /= 2;
            right /= 2;
        }
        
        return result;
    }
    
public:
    int lengthOfLIS(vector<int>& nums) {
        // Coordinate compression
        vector<int> sorted = nums;
        sort(sorted.begin(), sorted.end());
        sorted.erase(unique(sorted.begin(), sorted.end()), sorted.end());
        
        int n = sorted.size();
        offset = 1;
        while (offset < n) offset *= 2;
        tree.resize(2 * offset, 0);
        
        int maxLen = 0;
        
        for (int num : nums) {
            int pos = lower_bound(sorted.begin(), sorted.end(), num) - sorted.begin();
            int len = query(0, pos - 1) + 1;
            update(pos, len);
            maxLen = max(maxLen, len);
        }
        
        return maxLen;
    }
};

// Test function
void test(vector<int> nums, int approach) {
    int result;
    
    cout << "Input: [";
    for (int i = 0; i < nums.size(); i++) {
        cout << nums[i];
        if (i < nums.size() - 1) cout << ",";
    }
    cout << "]\n";
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.lengthOfLIS(nums);
            cout << "Approach 1 (DP O(n^2)): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.lengthOfLIS(nums);
            cout << "Approach 2 (Binary Search): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.lengthOfLIS(nums);
            cout << "Approach 3 (Manual Binary Search): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.lengthOfLIS(nums);
            cout << "Approach 4 (With Reconstruction): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.lengthOfLIS(nums);
            cout << "Approach 5 (Segment Tree): ";
            break;
        }
    }
    
    cout << result << "\n\n";
}

int main() {
    // Test Case 1: Standard case
    cout << "Test Case 1: Standard case\n";
    vector<int> test1 = {10, 9, 2, 5, 3, 7, 101, 18};
    for (int i = 1; i <= 5; i++) {
        test(test1, i);
    }
    
    // Test Case 2: Multiple LIS
    cout << "Test Case 2: Multiple LIS\n";
    vector<int> test2 = {0, 1, 0, 3, 2, 3};
    for (int i = 1; i <= 5; i++) {
        test(test2, i);
    }
    
    // Test Case 3: All same
    cout << "Test Case 3: All same\n";
    vector<int> test3 = {7, 7, 7, 7, 7, 7, 7};
    for (int i = 1; i <= 5; i++) {
        test(test3, i);
    }
    
    // Test Case 4: Decreasing
    cout << "Test Case 4: Decreasing\n";
    vector<int> test4 = {5, 4, 3, 2, 1};
    for (int i = 1; i <= 5; i++) {
        test(test4, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (DP O(n^2)):
 * - Time: O(n^2) - nested loops
 * - Space: O(n) - dp array
 * - Best for: Understanding DP, small inputs
 * 
 * Approach 2 (Binary Search - OPTIMAL):
 * - Time: O(n log n) - binary search per element
 * - Space: O(n) - tails array
 * - Best for: Optimal solution, large inputs
 * 
 * Approach 3 (Manual Binary Search):
 * - Time: O(n log n)
 * - Space: O(n)
 * - Best for: Understanding binary search
 * 
 * Approach 4 (With Reconstruction):
 * - Time: O(n^2)
 * - Space: O(n)
 * - Best for: Need actual sequence
 * 
 * Approach 5 (Segment Tree):
 * - Time: O(n log n)
 * - Space: O(n)
 * - Best for: Advanced technique
 * 
 * INTERVIEW TIPS:
 * 1. Start with Approach 1 (DP O(n^2))
 * 2. Explain dp[i] meaning clearly
 * 3. Mention Approach 2 for optimization
 * 4. Draw example showing tails array
 * 5. Explain why binary search works
 * 
 * COMMON MISTAKES:
 * 1. Confusing subsequence with subarray
 * 2. Not handling equal elements correctly
 * 3. Wrong binary search bounds
 * 4. Forgetting to track maximum length
 * 5. Not understanding tails array invariant
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. Can you print the actual LIS? (Yes, Approach 4)
 * 2. What if we want longest non-decreasing? (Use <= instead of <)
 * 3. How many LIS exist? (Different DP problem)
 * 4. Can you do it in O(n log n)? (Yes, Approach 2)
 * 5. What about longest decreasing? (Reverse or negate)
 * 
 * RELATED PROBLEMS:
 * - Number of Longest Increasing Subsequence
 * - Russian Doll Envelopes
 * - Maximum Length of Pair Chain
 * - Longest Arithmetic Subsequence
 * - Wiggle Subsequence
 * 
 * KEY INSIGHTS:
 * 1. DP solution is intuitive but O(n^2)
 * 2. Binary search optimization achieves O(n log n)
 * 3. Tails array maintains smallest tails
 * 4. Can reconstruct actual sequence
 * 5. Classic DP problem with optimization
 * 
 * TAILS ARRAY INVARIANT:
 * - tails[i] = smallest tail of all LIS of length i+1
 * - Array is always sorted
 * - Binary search finds correct position
 * - Replace or extend based on position
 * - Length of tails = length of LIS
 * 
 * WHY BINARY SEARCH WORKS:
 * - Tails array is always sorted
 * - Want to find first element >= current
 * - If all smaller, extend sequence
 * - Otherwise, replace to keep smallest tail
 * - Maintains invariant for future elements
 * - Greedy choice is optimal
 */

// Made with Bob
