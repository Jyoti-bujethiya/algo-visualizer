/*
 * LeetCode Problem #1: Two Sum
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/two-sum/
 * 
 * Problem Statement:
 * Given an array of integers nums and an integer target, return indices of the 
 * two numbers such that they add up to target.
 * You may assume that each input would have exactly one solution, and you may 
 * not use the same element twice.
 */

#include <vector>
#include <unordered_map>
#include <iostream>
using namespace std;

class Solution {
public:
    // ==================== APPROACH 1: Brute Force ====================
    /*
     * Algorithm:
     * - Use two nested loops to check every pair of numbers
     * - If sum equals target, return their indices
     * 
     * Time Complexity: O(n²) - nested loops
     * Space Complexity: O(1) - no extra space
     * 
     * When to use: Only for very small arrays or when space is critical
     */
    vector<int> twoSum_BruteForce(vector<int>& nums, int target) {
        int n = nums.size();
        
        // Check every possible pair
        for (int i = 0; i < n - 1; i++) {
            for (int j = i + 1; j < n; j++) {
                if (nums[i] + nums[j] == target) {
                    return {i, j};
                }
            }
        }
        
        return {}; // No solution found
    }
    
    // ==================== APPROACH 2: Hash Map (Optimal) ====================
    /*
     * Algorithm:
     * - Use hash map to store visited numbers and their indices
     * - For each number, check if (target - current) exists in map
     * - If found, return both indices
     * - Otherwise, add current number to map
     * 
     * Time Complexity: O(n) - single pass through array
     * Space Complexity: O(n) - hash map storage
     * 
     * When to use: This is the optimal solution for most cases
     * 
     * Key Insight: We can check if complement exists while building the map
     */
    vector<int> twoSum_HashMap(vector<int>& nums, int target) {
        unordered_map<int, int> numMap; // value -> index
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            
            // Check if complement exists in map
            if (numMap.find(complement) != numMap.end()) {
                return {numMap[complement], i};
            }
            
            // Add current number to map
            numMap[nums[i]] = i;
        }
        
        return {}; // No solution found
    }
    
    // ==================== APPROACH 3: Two Pointer (Sorted Array) ====================
    /*
     * Algorithm:
     * - Sort array while keeping track of original indices
     * - Use two pointers from start and end
     * - Move pointers based on sum comparison with target
     * 
     * Time Complexity: O(n log n) - due to sorting
     * Space Complexity: O(n) - for storing pairs of (value, index)
     * 
     * When to use: When array is already sorted or when you need to find 
     *              multiple pairs (not applicable for this problem)
     * 
     * Note: This approach requires modification to track original indices
     */
    vector<int> twoSum_TwoPointer(vector<int>& nums, int target) {
        // Create pairs of (value, original_index)
        vector<pair<int, int>> pairs;
        for (int i = 0; i < nums.size(); i++) {
            pairs.push_back({nums[i], i});
        }
        
        // Sort by value
        sort(pairs.begin(), pairs.end());
        
        int left = 0, right = pairs.size() - 1;
        
        while (left < right) {
            int sum = pairs[left].first + pairs[right].first;
            
            if (sum == target) {
                return {pairs[left].second, pairs[right].second};
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
        
        return {}; // No solution found
    }
};

// ==================== TEST CASES ====================
void runTests() {
    Solution sol;
    
    // Test Case 1: Basic case
    vector<int> nums1 = {2, 7, 11, 15};
    int target1 = 9;
    vector<int> result1 = sol.twoSum_HashMap(nums1, target1);
    cout << "Test 1: [" << result1[0] << ", " << result1[1] << "]" << endl;
    // Expected: [0, 1] because nums[0] + nums[1] = 2 + 7 = 9
    
    // Test Case 2: Numbers at end
    vector<int> nums2 = {3, 2, 4};
    int target2 = 6;
    vector<int> result2 = sol.twoSum_HashMap(nums2, target2);
    cout << "Test 2: [" << result2[0] << ", " << result2[1] << "]" << endl;
    // Expected: [1, 2] because nums[1] + nums[2] = 2 + 4 = 6
    
    // Test Case 3: Same number twice
    vector<int> nums3 = {3, 3};
    int target3 = 6;
    vector<int> result3 = sol.twoSum_HashMap(nums3, target3);
    cout << "Test 3: [" << result3[0] << ", " << result3[1] << "]" << endl;
    // Expected: [0, 1] because nums[0] + nums[1] = 3 + 3 = 6
    
    // Test Case 4: Negative numbers
    vector<int> nums4 = {-1, -2, -3, -4, -5};
    int target4 = -8;
    vector<int> result4 = sol.twoSum_HashMap(nums4, target4);
    cout << "Test 4: [" << result4[0] << ", " << result4[1] << "]" << endl;
    // Expected: [2, 4] because nums[2] + nums[4] = -3 + (-5) = -8
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. Brute Force:
 *    Pros: Simple, no extra space
 *    Cons: Slow for large inputs (O(n²))
 *    Use when: Array is very small (< 100 elements)
 * 
 * 2. Hash Map (RECOMMENDED):
 *    Pros: Optimal time O(n), single pass
 *    Cons: Uses O(n) extra space
 *    Use when: This is the standard solution for interviews
 * 
 * 3. Two Pointer:
 *    Pros: Good for sorted arrays
 *    Cons: Requires sorting (O(n log n)), complex index tracking
 *    Use when: Array is already sorted or multiple pairs needed
 * 
 * INTERVIEW TIPS:
 * - Always start by clarifying: Can we use same element twice? (No)
 * - Ask: Is there always a solution? (Yes, per problem statement)
 * - Mention all three approaches, implement hash map solution
 * - Discuss trade-offs between time and space complexity
 * - Handle edge cases: empty array, two elements, negative numbers
 * 
 * FOLLOW-UP QUESTIONS:
 * - What if we need to find all pairs? (Use two pointer on sorted array)
 * - What if array is sorted? (Two pointer is better - O(1) space)
 * - What if we can't use extra space? (Brute force or sort in-place)
 * - What about three sum? (Extend to 3Sum problem - LeetCode #15)
 */

// Made with Bob
