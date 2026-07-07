/*
 * LeetCode Problem #238: Product of Array Except Self
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/product-of-array-except-self/
 * 
 * Problem Statement:
 * Given an integer array nums, return an array answer such that answer[i] is
 * equal to the product of all the elements of nums except nums[i].
 * You must write an algorithm that runs in O(n) time and without using division.
 */

#include <vector>
#include <iostream>
using namespace std;

class Solution {
public:
    // ==================== APPROACH 1: Brute Force ====================
    /*
     * Algorithm:
     * - For each position i, multiply all elements except nums[i]
     * - Use nested loops
     * 
     * Time Complexity: O(n²)
     * Space Complexity: O(1) excluding output array
     * 
     * When to use: Never in interviews (too slow)
     */
    vector<int> productExceptSelf_BruteForce(vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n);
        
        for (int i = 0; i < n; i++) {
            int product = 1;
            for (int j = 0; j < n; j++) {
                if (i != j) {
                    product *= nums[j];
                }
            }
            result[i] = product;
        }
        
        return result;
    }
    
    // ==================== APPROACH 2: Division (Not Allowed) ====================
    /*
     * Algorithm:
     * - Calculate total product of all elements
     * - For each position, divide total by nums[i]
     * - Handle zeros specially
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     * 
     * When to use: Problem explicitly forbids division
     * 
     * Note: This approach has issues with zeros and is not allowed
     */
    vector<int> productExceptSelf_Division(vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n);
        
        // Count zeros and calculate product of non-zero elements
        int zeroCount = 0;
        long long product = 1;
        
        for (int num : nums) {
            if (num == 0) {
                zeroCount++;
            } else {
                product *= num;
            }
        }
        
        // Fill result based on zero count
        for (int i = 0; i < n; i++) {
            if (zeroCount > 1) {
                result[i] = 0;
            } else if (zeroCount == 1) {
                result[i] = (nums[i] == 0) ? product : 0;
            } else {
                result[i] = product / nums[i];
            }
        }
        
        return result;
    }
    
    // ==================== APPROACH 3: Prefix and Suffix Arrays ====================
    /*
     * Algorithm:
     * - Create prefix array: prefix[i] = product of all elements before i
     * - Create suffix array: suffix[i] = product of all elements after i
     * - result[i] = prefix[i] * suffix[i]
     * 
     * Time Complexity: O(n) - three passes
     * Space Complexity: O(n) - two extra arrays
     * 
     * When to use: Good intermediate solution
     * 
     * Key Insight:
     * - Product except self = (product of left) * (product of right)
     */
    vector<int> productExceptSelf_PrefixSuffix(vector<int>& nums) {
        int n = nums.size();
        vector<int> prefix(n, 1);
        vector<int> suffix(n, 1);
        vector<int> result(n);
        
        // Build prefix array
        for (int i = 1; i < n; i++) {
            prefix[i] = prefix[i - 1] * nums[i - 1];
        }
        
        // Build suffix array
        for (int i = n - 2; i >= 0; i--) {
            suffix[i] = suffix[i + 1] * nums[i + 1];
        }
        
        // Calculate result
        for (int i = 0; i < n; i++) {
            result[i] = prefix[i] * suffix[i];
        }
        
        return result;
    }
    
    // ==================== APPROACH 4: Optimized Space (Optimal) ====================
    /*
     * Algorithm:
     * - Use result array to store prefix products
     * - Calculate suffix products on the fly and multiply with prefix
     * - Only use one extra variable for suffix product
     * 
     * Time Complexity: O(n) - two passes
     * Space Complexity: O(1) - excluding output array
     * 
     * When to use: This is the OPTIMAL solution
     * 
     * Key Insight:
     * - We can calculate suffix products while building result
     * - Use result array itself to store prefix products
     * - Use single variable to track running suffix product
     */
    vector<int> productExceptSelf_Optimal(vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n, 1);
        
        // First pass: calculate prefix products and store in result
        int prefix = 1;
        for (int i = 0; i < n; i++) {
            result[i] = prefix;
            prefix *= nums[i];
        }
        
        // Second pass: calculate suffix products and multiply with result
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            result[i] *= suffix;
            suffix *= nums[i];
        }
        
        return result;
    }
};

// ==================== TEST CASES ====================
void printArray(const vector<int>& arr) {
    cout << "[";
    for (int i = 0; i < arr.size(); i++) {
        cout << arr[i];
        if (i < arr.size() - 1) cout << ",";
    }
    cout << "]" << endl;
}

void runTests() {
    Solution sol;
    
    // Test Case 1: Standard case
    vector<int> nums1 = {1, 2, 3, 4};
    cout << "Test 1: ";
    printArray(sol.productExceptSelf_Optimal(nums1));
    // Expected: [24,12,8,6]
    // Explanation: [2*3*4, 1*3*4, 1*2*4, 1*2*3]
    
    // Test Case 2: With zeros
    vector<int> nums2 = {-1, 1, 0, -3, 3};
    cout << "Test 2: ";
    printArray(sol.productExceptSelf_Optimal(nums2));
    // Expected: [0,0,9,0,0]
    
    // Test Case 3: Two elements
    vector<int> nums3 = {5, 2};
    cout << "Test 3: ";
    printArray(sol.productExceptSelf_Optimal(nums3));
    // Expected: [2,5]
    
    // Test Case 4: All ones
    vector<int> nums4 = {1, 1, 1, 1};
    cout << "Test 4: ";
    printArray(sol.productExceptSelf_Optimal(nums4));
    // Expected: [1,1,1,1]
    
    // Test Case 5: Negative numbers
    vector<int> nums5 = {-1, -2, -3, -4};
    cout << "Test 5: ";
    printArray(sol.productExceptSelf_Optimal(nums5));
    // Expected: [-24,-12,-8,-6]
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. Brute Force:
 *    Time: O(n²), Space: O(1)
 *    Too slow, not acceptable
 * 
 * 2. Division:
 *    Time: O(n), Space: O(1)
 *    Not allowed by problem constraints
 * 
 * 3. Prefix/Suffix Arrays:
 *    Time: O(n), Space: O(n)
 *    Good solution, easy to understand
 * 
 * 4. Optimized Space (RECOMMENDED):
 *    Time: O(n), Space: O(1)
 *    Optimal solution meeting all constraints
 * 
 * INTERVIEW TIPS:
 * - Clarify that division is not allowed
 * - Start with prefix/suffix approach
 * - Optimize to use result array for prefix
 * - Explain how suffix is calculated on the fly
 * - Mention that output array doesn't count as extra space
 * 
 * KEY INSIGHTS:
 * - Product except self = prefix product * suffix product
 * - We can reuse the output array to save space
 * - Calculate prefix forward, suffix backward
 * - No need to store suffix array, calculate on the fly
 * 
 * STEP-BY-STEP for [1,2,3,4]:
 * 
 * After prefix pass:
 * result = [1, 1, 2, 6]
 * (result[i] = product of all elements before i)
 * 
 * After suffix pass:
 * result = [24, 12, 8, 6]
 * (multiply each by product of all elements after i)
 * 
 * COMMON MISTAKES:
 * - Using division (not allowed)
 * - Not handling zeros correctly
 * - Counting output array as extra space
 * - Not optimizing from O(n) space to O(1)
 * 
 * FOLLOW-UP QUESTIONS:
 * - What if division was allowed? (Calculate total product, divide by each)
 * - How to handle multiple zeros? (Check zero count)
 * - Can we do it in one pass? (No, need two passes for prefix/suffix)
 * - What about overflow? (Use long long or modulo arithmetic)
 * 
 * RELATED PROBLEMS:
 * - Maximum Product Subarray (LeetCode #152)
 * - Product of the Last K Numbers (LeetCode #1352)
 */

// Made with Bob
