/*
 * Problem: Maximum Product Subarray (LeetCode 152)
 * Link: https://leetcode.com/problems/maximum-product-subarray/
 * Difficulty: Medium
 * Category: Dynamic Programming
 * 
 * Description:
 * Given an integer array nums, find a contiguous non-empty subarray within the array
 * that has the largest product, and return the product.
 * 
 * The test cases are generated so that the answer will fit in a 32-bit integer.
 * A subarray is a contiguous subsequence of the array.
 * 
 * Example 1:
 * Input: nums = [2,3,-2,4]
 * Output: 6
 * Explanation: [2,3] has the largest product 6.
 * 
 * Example 2:
 * Input: nums = [-2,0,-1]
 * Output: 0
 * Explanation: The result cannot be 2, because [-2,-1] is not a subarray.
 * 
 * Constraints:
 * - 1 <= nums.length <= 2 * 10^4
 * - -10 <= nums[i] <= 10
 * - The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer
 */

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/*
 * APPROACH 1: DYNAMIC PROGRAMMING (TRACK MIN AND MAX)
 * 
 * Intuition:
 * - Track both maximum and minimum product ending at current position
 * - Negative number can turn minimum into maximum and vice versa
 * - At each position, consider: current number, max*current, min*current
 * - Update global maximum as we go
 * 
 * Algorithm:
 * 1. Initialize maxProd and minProd with first element
 * 2. For each element:
 *    - Calculate new max: max(num, maxProd*num, minProd*num)
 *    - Calculate new min: min(num, maxProd*num, minProd*num)
 *    - Update global result
 * 3. Return global maximum
 * 
 * Time Complexity: O(n) - single pass
 * Space Complexity: O(1) - only variables
 */
class Solution1 {
public:
    int maxProduct(vector<int>& nums) {
        if (nums.empty()) return 0;
        
        int maxProd = nums[0];
        int minProd = nums[0];
        int result = nums[0];
        
        for (int i = 1; i < nums.size(); i++) {
            int num = nums[i];
            
            // Store maxProd before updating (needed for minProd calculation)
            int tempMax = maxProd;
            
            // Update max and min products
            maxProd = max({num, maxProd * num, minProd * num});
            minProd = min({num, tempMax * num, minProd * num});
            
            // Update result
            result = max(result, maxProd);
        }
        
        return result;
    }
};

/*
 * APPROACH 2: TWO PASS (LEFT TO RIGHT, RIGHT TO LEFT)
 * 
 * Intuition:
 * - Scan from left to right, tracking running product
 * - Scan from right to left, tracking running product
 * - Reset product to 1 when encountering 0
 * - Maximum of both scans is the answer
 * - This handles negative numbers elegantly
 * 
 * Algorithm:
 * 1. Scan left to right:
 *    - Multiply running product by current number
 *    - Update max if needed
 *    - Reset to 1 if product is 0
 * 2. Scan right to left: same logic
 * 3. Return maximum found
 * 
 * Time Complexity: O(n) - two passes
 * Space Complexity: O(1) - only variables
 */
class Solution2 {
public:
    int maxProduct(vector<int>& nums) {
        int n = nums.size();
        int result = nums[0];
        
        // Left to right
        int product = 1;
        for (int i = 0; i < n; i++) {
            product *= nums[i];
            result = max(result, product);
            if (product == 0) product = 1;
        }
        
        // Right to left
        product = 1;
        for (int i = n - 1; i >= 0; i--) {
            product *= nums[i];
            result = max(result, product);
            if (product == 0) product = 1;
        }
        
        return result;
    }
};

/*
 * APPROACH 3: KADANE'S ALGORITHM VARIANT
 * 
 * Intuition:
 * - Similar to maximum subarray but track both max and min
 * - When multiplying by negative, swap max and min
 * - This is a cleaner version of Approach 1
 * 
 * Algorithm:
 * 1. For each element:
 *    - If negative, swap max and min
 *    - Update max = max(num, max * num)
 *    - Update min = min(num, min * num)
 *    - Update result
 * 2. Return result
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class Solution3 {
public:
    int maxProduct(vector<int>& nums) {
        if (nums.empty()) return 0;
        
        int maxProd = nums[0];
        int minProd = nums[0];
        int result = nums[0];
        
        for (int i = 1; i < nums.size(); i++) {
            int num = nums[i];
            
            // If negative, swap max and min
            if (num < 0) {
                swap(maxProd, minProd);
            }
            
            // Update max and min
            maxProd = max(num, maxProd * num);
            minProd = min(num, minProd * num);
            
            // Update result
            result = max(result, maxProd);
        }
        
        return result;
    }
};

/*
 * APPROACH 4: BRUTE FORCE (FOR COMPARISON)
 * 
 * Intuition:
 * - Try all possible subarrays
 * - Calculate product for each
 * - Track maximum
 * - This is O(n^2) but shows the problem clearly
 * 
 * Algorithm:
 * 1. For each starting position i:
 *    - For each ending position j >= i:
 *      - Calculate product of subarray [i, j]
 *      - Update maximum
 * 2. Return maximum
 * 
 * Time Complexity: O(n^2) - nested loops
 * Space Complexity: O(1)
 */
class Solution4 {
public:
    int maxProduct(vector<int>& nums) {
        int n = nums.size();
        int result = nums[0];
        
        for (int i = 0; i < n; i++) {
            int product = 1;
            for (int j = i; j < n; j++) {
                product *= nums[j];
                result = max(result, product);
            }
        }
        
        return result;
    }
};

/*
 * APPROACH 5: DIVIDE AND CONQUER BY ZEROS
 * 
 * Intuition:
 * - Split array by zeros
 * - Find max product in each segment
 * - Also consider 0 itself as a candidate
 * - Handle negative numbers in each segment
 * 
 * Algorithm:
 * 1. Split array into segments separated by zeros
 * 2. For each segment, find max product
 * 3. Consider 0 as a candidate
 * 4. Return overall maximum
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class Solution5 {
private:
    int maxProductSegment(vector<int>& nums, int start, int end) {
        if (start > end) return INT_MIN;
        
        int maxProd = nums[start];
        int minProd = nums[start];
        int result = nums[start];
        
        for (int i = start + 1; i <= end; i++) {
            int tempMax = maxProd;
            maxProd = max({nums[i], maxProd * nums[i], minProd * nums[i]});
            minProd = min({nums[i], tempMax * nums[i], minProd * nums[i]});
            result = max(result, maxProd);
        }
        
        return result;
    }
    
public:
    int maxProduct(vector<int>& nums) {
        int result = INT_MIN;
        int start = 0;
        bool hasZero = false;
        
        for (int i = 0; i <= nums.size(); i++) {
            if (i == nums.size() || nums[i] == 0) {
                if (i > start) {
                    result = max(result, maxProductSegment(nums, start, i - 1));
                }
                if (i < nums.size() && nums[i] == 0) {
                    hasZero = true;
                }
                start = i + 1;
            }
        }
        
        if (hasZero) result = max(result, 0);
        
        return result;
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
            result = sol.maxProduct(nums);
            cout << "Approach 1 (DP Min/Max): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.maxProduct(nums);
            cout << "Approach 2 (Two Pass): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.maxProduct(nums);
            cout << "Approach 3 (Kadane Variant): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.maxProduct(nums);
            cout << "Approach 4 (Brute Force): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.maxProduct(nums);
            cout << "Approach 5 (Divide by Zeros): ";
            break;
        }
    }
    
    cout << result << "\n\n";
}

int main() {
    // Test Case 1: Standard case
    cout << "Test Case 1: Standard case\n";
    vector<int> test1 = {2, 3, -2, 4};
    for (int i = 1; i <= 5; i++) {
        test(test1, i);
    }
    
    // Test Case 2: With zero
    cout << "Test Case 2: With zero\n";
    vector<int> test2 = {-2, 0, -1};
    for (int i = 1; i <= 5; i++) {
        test(test2, i);
    }
    
    // Test Case 3: All negative
    cout << "Test Case 3: All negative\n";
    vector<int> test3 = {-2, -3, -4};
    for (int i = 1; i <= 5; i++) {
        test(test3, i);
    }
    
    // Test Case 4: Single element
    cout << "Test Case 4: Single element\n";
    vector<int> test4 = {-2};
    for (int i = 1; i <= 5; i++) {
        test(test4, i);
    }
    
    // Test Case 5: Mix of positive and negative
    cout << "Test Case 5: Mix\n";
    vector<int> test5 = {2, -5, -2, -4, 3};
    for (int i = 1; i <= 5; i++) {
        test(test5, i);
    }
    
    // Test Case 6: With multiple zeros
    cout << "Test Case 6: Multiple zeros\n";
    vector<int> test6 = {0, 2, 0, 4};
    for (int i = 1; i <= 5; i++) {
        test(test6, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (DP Min/Max):
 * - Time: O(n) - single pass
 * - Space: O(1) - only variables
 * - Best for: Optimal solution, most intuitive
 * 
 * Approach 2 (Two Pass):
 * - Time: O(n) - two passes
 * - Space: O(1)
 * - Best for: Elegant handling of negatives
 * 
 * Approach 3 (Kadane Variant):
 * - Time: O(n)
 * - Space: O(1)
 * - Best for: Clean swap logic
 * 
 * Approach 4 (Brute Force):
 * - Time: O(n^2) - not optimal
 * - Space: O(1)
 * - Best for: Understanding the problem
 * 
 * Approach 5 (Divide by Zeros):
 * - Time: O(n)
 * - Space: O(1)
 * - Best for: Handling zeros explicitly
 * 
 * INTERVIEW TIPS:
 * 1. Start with Approach 1 - track both min and max
 * 2. Explain why we need to track minimum (negative numbers)
 * 3. Key insight: negative * negative = positive
 * 4. Mention Approach 2 as elegant alternative
 * 5. Handle edge cases: zeros, all negatives, single element
 * 
 * COMMON MISTAKES:
 * 1. Only tracking maximum (forgetting minimum)
 * 2. Not handling zeros correctly
 * 3. Not considering single element as subarray
 * 4. Integer overflow (though problem guarantees fit)
 * 5. Forgetting to update result at each step
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. What if array is very large? (Same O(n) is optimal)
 * 2. Can you find the actual subarray? (Track indices)
 * 3. What if we want k-th largest product? (More complex)
 * 4. How to handle overflow? (Use long long or check)
 * 5. What if we can skip elements? (Different problem)
 * 
 * RELATED PROBLEMS:
 * - Maximum Subarray (Kadane's Algorithm)
 * - Best Time to Buy and Sell Stock
 * - Maximum Sum Circular Subarray
 * - Longest Turbulent Subarray
 * - Maximum Product of Three Numbers
 * 
 * KEY INSIGHTS:
 * 1. Need to track both max and min due to negatives
 * 2. Negative number can flip max and min
 * 3. Zero resets the product
 * 4. Similar to Kadane's but with multiplication
 * 5. Two-pass approach is elegant alternative
 */

// Made with Bob
