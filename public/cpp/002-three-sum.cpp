/*
 * LeetCode Problem #15: Three Sum
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/3sum/
 * 
 * Problem Statement:
 * Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]]
 * such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.
 * Notice that the solution set must not contain duplicate triplets.
 */

#include <vector>
#include <algorithm>
#include <set>
#include <iostream>
using namespace std;

class Solution {
public:
    // ==================== APPROACH 1: Brute Force with Set ====================
    /*
     * Algorithm:
     * - Use three nested loops to check all triplets
     * - Use set to avoid duplicates
     * - Sort each triplet before adding to set
     * 
     * Time Complexity: O(n³ log n) - three loops + set operations
     * Space Complexity: O(n) - for storing results
     * 
     * When to use: Never in production, only for understanding
     */
    vector<vector<int>> threeSum_BruteForce(vector<int>& nums) {
        set<vector<int>> resultSet;
        int n = nums.size();
        
        for (int i = 0; i < n - 2; i++) {
            for (int j = i + 1; j < n - 1; j++) {
                for (int k = j + 1; k < n; k++) {
                    if (nums[i] + nums[j] + nums[k] == 0) {
                        vector<int> triplet = {nums[i], nums[j], nums[k]};
                        sort(triplet.begin(), triplet.end());
                        resultSet.insert(triplet);
                    }
                }
            }
        }
        
        return vector<vector<int>>(resultSet.begin(), resultSet.end());
    }
    
    // ==================== APPROACH 2: Hash Map ====================
    /*
     * Algorithm:
     * - Fix first element, use hash map for remaining two (like 2Sum)
     * - For each i, find pairs (j, k) where nums[j] + nums[k] = -nums[i]
     * - Use set to avoid duplicates
     * 
     * Time Complexity: O(n²) - outer loop * hash map operations
     * Space Complexity: O(n) - hash map + result storage
     * 
     * When to use: When you want O(n²) time but can use extra space
     */
    vector<vector<int>> threeSum_HashMap(vector<int>& nums) {
        set<vector<int>> resultSet;
        int n = nums.size();
        
        for (int i = 0; i < n - 2; i++) {
            unordered_set<int> seen;
            int target = -nums[i];
            
            for (int j = i + 1; j < n; j++) {
                int complement = target - nums[j];
                
                if (seen.find(complement) != seen.end()) {
                    vector<int> triplet = {nums[i], complement, nums[j]};
                    sort(triplet.begin(), triplet.end());
                    resultSet.insert(triplet);
                }
                seen.insert(nums[j]);
            }
        }
        
        return vector<vector<int>>(resultSet.begin(), resultSet.end());
    }
    
    // ==================== APPROACH 3: Two Pointer (Optimal) ====================
    /*
     * Algorithm:
     * 1. Sort the array
     * 2. Fix first element (i), use two pointers for remaining elements
     * 3. For each i, find pairs where nums[left] + nums[right] = -nums[i]
     * 4. Skip duplicates to avoid duplicate triplets
     * 
     * Time Complexity: O(n²) - O(n log n) sorting + O(n) * O(n) two pointer
     * Space Complexity: O(1) or O(n) depending on sorting algorithm
     * 
     * When to use: This is the OPTIMAL solution for interviews
     * 
     * Key Insights:
     * - Sorting allows us to skip duplicates efficiently
     * - Two pointer technique reduces inner loop from O(n²) to O(n)
     * - We can break early when nums[i] > 0 (all remaining are positive)
     */
    vector<vector<int>> threeSum_TwoPointer(vector<int>& nums) {
        vector<vector<int>> result;
        int n = nums.size();
        
        // Edge case: need at least 3 elements
        if (n < 3) return result;
        
        // Sort the array
        sort(nums.begin(), nums.end());
        
        // Fix the first element
        for (int i = 0; i < n - 2; i++) {
            // Skip duplicates for first element
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            
            // Optimization: if smallest element > 0, no solution possible
            if (nums[i] > 0) break;
            
            int left = i + 1;
            int right = n - 1;
            int target = -nums[i];
            
            // Two pointer approach for remaining elements
            while (left < right) {
                int sum = nums[left] + nums[right];
                
                if (sum == target) {
                    result.push_back({nums[i], nums[left], nums[right]});
                    
                    // Skip duplicates for second element
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    // Skip duplicates for third element
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    
                    left++;
                    right--;
                } else if (sum < target) {
                    left++;  // Need larger sum
                } else {
                    right--; // Need smaller sum
                }
            }
        }
        
        return result;
    }
    
    // ==================== APPROACH 4: Optimized Two Pointer ====================
    /*
     * Same as Approach 3 but with additional optimizations
     * 
     * Additional Optimizations:
     * - Early termination when nums[i] > 0
     * - Skip when nums[i] + nums[i+1] + nums[i+2] > 0 (minimum possible sum)
     * - Skip when nums[i] + nums[n-2] + nums[n-1] < 0 (maximum possible sum)
     */
    vector<vector<int>> threeSum_Optimized(vector<int>& nums) {
        vector<vector<int>> result;
        int n = nums.size();
        
        if (n < 3) return result;
        
        sort(nums.begin(), nums.end());
        
        for (int i = 0; i < n - 2; i++) {
            // Skip duplicates
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            
            // Early termination
            if (nums[i] > 0) break;
            
            // Optimization: check if any valid triplet exists
            if (nums[i] + nums[i + 1] + nums[i + 2] > 0) break;
            if (nums[i] + nums[n - 2] + nums[n - 1] < 0) continue;
            
            int left = i + 1;
            int right = n - 1;
            int target = -nums[i];
            
            while (left < right) {
                int sum = nums[left] + nums[right];
                
                if (sum == target) {
                    result.push_back({nums[i], nums[left], nums[right]});
                    
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    
                    left++;
                    right--;
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        
        return result;
    }
};

// ==================== TEST CASES ====================
void printResult(const vector<vector<int>>& result) {
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << "[";
        for (int j = 0; j < result[i].size(); j++) {
            cout << result[i][j];
            if (j < result[i].size() - 1) cout << ",";
        }
        cout << "]";
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
}

void runTests() {
    Solution sol;
    
    // Test Case 1: Standard case with multiple triplets
    vector<int> nums1 = {-1, 0, 1, 2, -1, -4};
    cout << "Test 1: ";
    printResult(sol.threeSum_TwoPointer(nums1));
    // Expected: [[-1,-1,2],[-1,0,1]]
    
    // Test Case 2: No solution
    vector<int> nums2 = {0, 1, 1};
    cout << "Test 2: ";
    printResult(sol.threeSum_TwoPointer(nums2));
    // Expected: []
    
    // Test Case 3: All zeros
    vector<int> nums3 = {0, 0, 0};
    cout << "Test 3: ";
    printResult(sol.threeSum_TwoPointer(nums3));
    // Expected: [[0,0,0]]
    
    // Test Case 4: Multiple duplicates
    vector<int> nums4 = {-2, 0, 0, 2, 2};
    cout << "Test 4: ";
    printResult(sol.threeSum_TwoPointer(nums4));
    // Expected: [[-2,0,2]]
    
    // Test Case 5: Large numbers
    vector<int> nums5 = {-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6};
    cout << "Test 5: ";
    printResult(sol.threeSum_TwoPointer(nums5));
    // Expected: Multiple valid triplets
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. Brute Force:
 *    Time: O(n³ log n), Space: O(n)
 *    Pros: Easy to understand
 *    Cons: Too slow, not acceptable in interviews
 * 
 * 2. Hash Map:
 *    Time: O(n²), Space: O(n)
 *    Pros: Good time complexity
 *    Cons: Uses extra space, harder to handle duplicates
 * 
 * 3. Two Pointer (RECOMMENDED):
 *    Time: O(n²), Space: O(1)
 *    Pros: Optimal, clean duplicate handling, space efficient
 *    Cons: Requires sorting (modifies input)
 * 
 * 4. Optimized Two Pointer:
 *    Time: O(n²), Space: O(1)
 *    Pros: Best practical performance with early termination
 *    Cons: Slightly more complex code
 * 
 * INTERVIEW TIPS:
 * - Start with brute force, then optimize to two pointer
 * - Emphasize duplicate handling strategy
 * - Explain why sorting helps (enables two pointer + skip duplicates)
 * - Discuss trade-off: sorting modifies input but saves space
 * - Mention that result order doesn't matter
 * 
 * COMMON MISTAKES:
 * - Forgetting to skip duplicates (results in duplicate triplets)
 * - Not handling edge cases (empty array, less than 3 elements)
 * - Using set for deduplication (inefficient, O(n) extra space)
 * - Not optimizing with early breaks
 * 
 * FOLLOW-UP QUESTIONS:
 * - What if we need closest sum to target? (3Sum Closest - LeetCode #16)
 * - What about 4Sum? (Extend to 4Sum - LeetCode #18)
 * - Can we do better than O(n²)? (No, we need to check all pairs)
 * - What if array is not sorted? (Must sort first, O(n log n))
 * 
 * KEY PATTERNS:
 * - Sorting + Two Pointer is common for sum problems
 * - Skip duplicates by comparing with previous element
 * - Fix one element, solve remaining as 2Sum problem
 * - Early termination optimizations can significantly improve performance
 */

// Made with Bob
