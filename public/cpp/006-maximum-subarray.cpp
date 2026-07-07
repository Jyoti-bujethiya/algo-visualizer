/*
 * LeetCode Problem #53: Maximum Subarray (Kadane's Algorithm)
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/maximum-subarray/
 * 
 * Problem Statement:
 * Given an integer array nums, find the contiguous subarray (containing at least
 * one number) which has the largest sum and return its sum.
 */

#include <vector>
#include <algorithm>
#include <climits>
#include <iostream>
using namespace std;

class Solution {
public:
    // ==================== APPROACH 1: Brute Force ====================
    /*
     * Algorithm:
     * - Check all possible subarrays
     * - Calculate sum for each subarray
     * - Track maximum sum
     * 
     * Time Complexity: O(n³) - three nested loops
     * Space Complexity: O(1)
     * 
     * When to use: Never (too slow)
     */
    int maxSubArray_BruteForce(vector<int>& nums) {
        int n = nums.size();
        int maxSum = INT_MIN;
        
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                int sum = 0;
                for (int k = i; k <= j; k++) {
                    sum += nums[k];
                }
                maxSum = max(maxSum, sum);
            }
        }
        
        return maxSum;
    }
    
    // ==================== APPROACH 2: Optimized Brute Force ====================
    /*
     * Algorithm:
     * - Calculate sum incrementally instead of recalculating
     * - For each starting position, extend subarray and track sum
     * 
     * Time Complexity: O(n²)
     * Space Complexity: O(1)
     * 
     * When to use: Better than O(n³) but still not optimal
     */
    int maxSubArray_OptimizedBrute(vector<int>& nums) {
        int n = nums.size();
        int maxSum = INT_MIN;
        
        for (int i = 0; i < n; i++) {
            int currentSum = 0;
            for (int j = i; j < n; j++) {
                currentSum += nums[j];
                maxSum = max(maxSum, currentSum);
            }
        }
        
        return maxSum;
    }
    
    // ==================== APPROACH 3: Kadane's Algorithm (Optimal) ====================
    /*
     * Algorithm:
     * - Track current subarray sum
     * - If current sum becomes negative, start new subarray
     * - Keep track of maximum sum seen so far
     * 
     * Time Complexity: O(n) - single pass
     * Space Complexity: O(1)
     * 
     * When to use: This is the OPTIMAL solution
     * 
     * Key Insight:
     * - If current sum is negative, it won't help future elements
     * - Better to start fresh from next element
     * - At each position, decide: extend current subarray or start new one
     * 
     * Decision at each step:
     * - currentSum = max(nums[i], currentSum + nums[i])
     * - This means: either start new subarray at i, or extend previous
     */
    int maxSubArray_Kadane(vector<int>& nums) {
        int maxSum = nums[0];
        int currentSum = nums[0];
        
        for (int i = 1; i < nums.size(); i++) {
            // Either extend current subarray or start new one
            currentSum = max(nums[i], currentSum + nums[i]);
            maxSum = max(maxSum, currentSum);
        }
        
        return maxSum;
    }
    
    // ==================== APPROACH 4: Kadane's with Subarray Indices ====================
    /*
     * Same as Kadane's but also tracks start and end indices
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     * 
     * When to use: When you need to return the actual subarray
     */
    int maxSubArray_KadaneWithIndices(vector<int>& nums, int& start, int& end) {
        int maxSum = nums[0];
        int currentSum = nums[0];
        start = 0;
        end = 0;
        int tempStart = 0;
        
        for (int i = 1; i < nums.size(); i++) {
            if (nums[i] > currentSum + nums[i]) {
                currentSum = nums[i];
                tempStart = i;  // New subarray starts here
            } else {
                currentSum = currentSum + nums[i];
            }
            
            if (currentSum > maxSum) {
                maxSum = currentSum;
                start = tempStart;
                end = i;
            }
        }
        
        return maxSum;
    }
    
    // ==================== APPROACH 5: Divide and Conquer ====================
    /*
     * Algorithm:
     * - Divide array into two halves
     * - Maximum subarray is either:
     *   1. In left half
     *   2. In right half
     *   3. Crosses the middle
     * - Recursively solve and combine
     * 
     * Time Complexity: O(n log n)
     * Space Complexity: O(log n) - recursion stack
     * 
     * When to use: Academic interest, not optimal for this problem
     */
    int maxCrossingSum(vector<int>& nums, int left, int mid, int right) {
        int leftSum = INT_MIN;
        int sum = 0;
        for (int i = mid; i >= left; i--) {
            sum += nums[i];
            leftSum = max(leftSum, sum);
        }
        
        int rightSum = INT_MIN;
        sum = 0;
        for (int i = mid + 1; i <= right; i++) {
            sum += nums[i];
            rightSum = max(rightSum, sum);
        }
        
        return leftSum + rightSum;
    }
    
    int maxSubArrayHelper(vector<int>& nums, int left, int right) {
        if (left == right) return nums[left];
        
        int mid = left + (right - left) / 2;
        
        int leftMax = maxSubArrayHelper(nums, left, mid);
        int rightMax = maxSubArrayHelper(nums, mid + 1, right);
        int crossMax = maxCrossingSum(nums, left, mid, right);
        
        return max({leftMax, rightMax, crossMax});
    }
    
    int maxSubArray_DivideConquer(vector<int>& nums) {
        return maxSubArrayHelper(nums, 0, nums.size() - 1);
    }
};

// ==================== TEST CASES ====================
void runTests() {
    Solution sol;
    
    // Test Case 1: Standard case
    vector<int> nums1 = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    cout << "Test 1: " << sol.maxSubArray_Kadane(nums1) << endl;
    // Expected: 6 (subarray [4,-1,2,1])
    
    // Test Case 2: All negative
    vector<int> nums2 = {-2, -3, -1, -4};
    cout << "Test 2: " << sol.maxSubArray_Kadane(nums2) << endl;
    // Expected: -1 (single element)
    
    // Test Case 3: Single element
    vector<int> nums3 = {5};
    cout << "Test 3: " << sol.maxSubArray_Kadane(nums3) << endl;
    // Expected: 5
    
    // Test Case 4: All positive
    vector<int> nums4 = {1, 2, 3, 4, 5};
    cout << "Test 4: " << sol.maxSubArray_Kadane(nums4) << endl;
    // Expected: 15 (entire array)
    
    // Test Case 5: With indices
    vector<int> nums5 = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    int start, end;
    int maxSum = sol.maxSubArray_KadaneWithIndices(nums5, start, end);
    cout << "Test 5: Sum=" << maxSum << ", Start=" << start << ", End=" << end << endl;
    // Expected: Sum=6, Start=3, End=6
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. Brute Force:
 *    Time: O(n³), Space: O(1)
 *    Not acceptable
 * 
 * 2. Optimized Brute:
 *    Time: O(n²), Space: O(1)
 *    Better but still slow
 * 
 * 3. Kadane's Algorithm (RECOMMENDED):
 *    Time: O(n), Space: O(1)
 *    Optimal solution, most elegant
 * 
 * 4. Divide and Conquer:
 *    Time: O(n log n), Space: O(log n)
 *    Academic interest, not optimal
 * 
 * INTERVIEW TIPS:
 * - This is a classic DP problem
 * - Kadane's algorithm is the expected solution
 * - Explain the greedy choice: extend or start new
 * - Handle all negative numbers case
 * - Can extend to return actual subarray
 * 
 * KADANE'S ALGORITHM INTUITION:
 * - At each position, we have two choices:
 *   1. Add current element to existing subarray
 *   2. Start new subarray from current element
 * - We choose whichever gives larger sum
 * - If adding current element makes sum negative, start fresh
 * 
 * STEP-BY-STEP for [-2,1,-3,4,-1,2,1,-5,4]:
 * 
 * i=0: current=-2, max=-2
 * i=1: current=1 (start new), max=1
 * i=2: current=-2 (1-3), max=1
 * i=3: current=4 (start new), max=4
 * i=4: current=3 (4-1), max=4
 * i=5: current=5 (3+2), max=5
 * i=6: current=6 (5+1), max=6 ✓
 * i=7: current=1 (6-5), max=6
 * i=8: current=5 (1+4), max=6
 * 
 * COMMON MISTAKES:
 * - Not handling all negative numbers
 * - Resetting current sum to 0 instead of current element
 * - Not updating max at each step
 * - Confusing with maximum product subarray
 * 
 * FOLLOW-UP QUESTIONS:
 * - Return the actual subarray? (Track indices)
 * - Maximum product subarray? (Different algorithm - LeetCode #152)
 * - Circular array? (Two passes or break circle)
 * - 2D array? (Extend to 2D Kadane's)
 * 
 * VARIATIONS:
 * - Maximum Subarray Sum with One Deletion (LeetCode #1186)
 * - Maximum Sum Circular Subarray (LeetCode #918)
 * - Maximum Product Subarray (LeetCode #152)
 * 
 * WHY KADANE'S WORKS:
 * - Optimal substructure: optimal solution contains optimal subsolutions
 * - Greedy choice: at each step, make locally optimal choice
 * - If current sum is negative, it can't help future elements
 * - This greedy choice leads to global optimum
 */

// Made with Bob
