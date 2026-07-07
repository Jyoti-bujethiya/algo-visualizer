/*
 * Problem: Binary Search (LeetCode 704)
 * Link: https://leetcode.com/problems/binary-search/
 * Difficulty: Easy
 * Category: Sorting and Searching
 * 
 * Description:
 * Given an array of integers nums which is sorted in ascending order, and an integer
 * target, write a function to search target in nums. If target exists, then return its
 * index. Otherwise, return -1.
 * 
 * You must write an algorithm with O(log n) runtime complexity.
 * 
 * Example 1:
 * Input: nums = [-1,0,3,5,9,12], target = 9
 * Output: 4
 * Explanation: 9 exists in nums and its index is 4
 * 
 * Example 2:
 * Input: nums = [-1,0,3,5,9,12], target = 2
 * Output: -1
 * Explanation: 2 does not exist in nums so return -1
 * 
 * Constraints:
 * - 1 <= nums.length <= 10^4
 * - -10^4 < nums[i], target < 10^4
 * - All the integers in nums are unique.
 * - nums is sorted in ascending order.
 */

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/*
 * APPROACH 1: ITERATIVE BINARY SEARCH (OPTIMAL)
 * 
 * Intuition:
 * - Divide search space in half each iteration
 * - Compare middle element with target
 * - Eliminate half of remaining elements
 * - Continue until found or search space exhausted
 * 
 * Algorithm:
 * 1. Initialize left = 0, right = n-1
 * 2. While left <= right:
 *    - Calculate mid = left + (right - left) / 2
 *    - If nums[mid] == target, return mid
 *    - If nums[mid] < target, search right half (left = mid + 1)
 *    - If nums[mid] > target, search left half (right = mid - 1)
 * 3. Return -1 if not found
 * 
 * Time Complexity: O(log n) - halve search space each iteration
 * Space Complexity: O(1) - constant extra space
 */
class Solution1 {
public:
    int search(vector<int>& nums, int target) {
        int left = 0;
        int right = nums.size() - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1;
    }
};

/*
 * APPROACH 2: RECURSIVE BINARY SEARCH
 * 
 * Intuition:
 * - Same logic as iterative but using recursion
 * - Each recursive call searches half of array
 * - Base case: element found or search space empty
 * 
 * Algorithm:
 * 1. Base case: if left > right, return -1
 * 2. Calculate mid
 * 3. If nums[mid] == target, return mid
 * 4. If nums[mid] < target, recurse on right half
 * 5. Otherwise, recurse on left half
 * 
 * Time Complexity: O(log n)
 * Space Complexity: O(log n) - recursion stack
 */
class Solution2 {
private:
    int binarySearchHelper(vector<int>& nums, int target, int left, int right) {
        if (left > right) {
            return -1;
        }
        
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            return binarySearchHelper(nums, target, mid + 1, right);
        } else {
            return binarySearchHelper(nums, target, left, mid - 1);
        }
    }
    
public:
    int search(vector<int>& nums, int target) {
        return binarySearchHelper(nums, target, 0, nums.size() - 1);
    }
};

/*
 * APPROACH 3: STL BINARY SEARCH
 * 
 * Intuition:
 * - Use C++ STL lower_bound function
 * - Returns iterator to first element >= target
 * - Check if element at iterator equals target
 * 
 * Algorithm:
 * 1. Use lower_bound to find position
 * 2. Check if iterator is valid and points to target
 * 3. Return index or -1
 * 
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 */
class Solution3 {
public:
    int search(vector<int>& nums, int target) {
        auto it = lower_bound(nums.begin(), nums.end(), target);
        
        if (it != nums.end() && *it == target) {
            return it - nums.begin();
        }
        
        return -1;
    }
};

/*
 * APPROACH 4: LINEAR SEARCH (FOR COMPARISON)
 * 
 * Intuition:
 * - Simple linear scan through array
 * - Not optimal but shows baseline
 * - Useful for understanding improvement
 * 
 * Algorithm:
 * 1. Iterate through array
 * 2. Return index when target found
 * 3. Return -1 if not found
 * 
 * Time Complexity: O(n) - check every element
 * Space Complexity: O(1)
 */
class Solution4 {
public:
    int search(vector<int>& nums, int target) {
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] == target) {
                return i;
            }
        }
        return -1;
    }
};

/*
 * APPROACH 5: BINARY SEARCH WITH BOUNDS CHECK
 * 
 * Intuition:
 * - Add early termination checks
 * - Check if target is within array bounds
 * - Optimize for edge cases
 * 
 * Algorithm:
 * 1. Check if target < first or > last element
 * 2. Perform standard binary search
 * 3. Return result
 * 
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 */
class Solution5 {
public:
    int search(vector<int>& nums, int target) {
        if (nums.empty()) return -1;
        if (target < nums[0] || target > nums[nums.size() - 1]) {
            return -1;
        }
        
        int left = 0;
        int right = nums.size() - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1;
    }
};

// Test function
void test(vector<int> nums, int target, int approach) {
    int result;
    
    cout << "Input: nums = [";
    for (int i = 0; i < nums.size(); i++) {
        cout << nums[i];
        if (i < nums.size() - 1) cout << ",";
    }
    cout << "], target = " << target << "\n";
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.search(nums, target);
            cout << "Approach 1 (Iterative): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.search(nums, target);
            cout << "Approach 2 (Recursive): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.search(nums, target);
            cout << "Approach 3 (STL): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.search(nums, target);
            cout << "Approach 4 (Linear): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.search(nums, target);
            cout << "Approach 5 (With Bounds): ";
            break;
        }
    }
    
    cout << result << "\n\n";
}

int main() {
    // Test Case 1: Target exists
    cout << "Test Case 1: Target exists\n";
    vector<int> test1 = {-1, 0, 3, 5, 9, 12};
    for (int i = 1; i <= 5; i++) {
        test(test1, 9, i);
    }
    
    // Test Case 2: Target doesn't exist
    cout << "Test Case 2: Target doesn't exist\n";
    vector<int> test2 = {-1, 0, 3, 5, 9, 12};
    for (int i = 1; i <= 5; i++) {
        test(test2, 2, i);
    }
    
    // Test Case 3: Single element - found
    cout << "Test Case 3: Single element - found\n";
    vector<int> test3 = {5};
    for (int i = 1; i <= 5; i++) {
        test(test3, 5, i);
    }
    
    // Test Case 4: Single element - not found
    cout << "Test Case 4: Single element - not found\n";
    vector<int> test4 = {5};
    for (int i = 1; i <= 5; i++) {
        test(test4, 3, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (Iterative - OPTIMAL):
 * - Time: O(log n)
 * - Space: O(1)
 * - Best for: Standard solution, most efficient
 * 
 * Approach 2 (Recursive):
 * - Time: O(log n)
 * - Space: O(log n) - recursion stack
 * - Best for: Recursive thinking
 * 
 * Approach 3 (STL):
 * - Time: O(log n)
 * - Space: O(1)
 * - Best for: Using standard library
 * 
 * Approach 4 (Linear):
 * - Time: O(n)
 * - Space: O(1)
 * - Best for: Understanding baseline (not optimal)
 * 
 * Approach 5 (With Bounds):
 * - Time: O(log n)
 * - Space: O(1)
 * - Best for: Early termination optimization
 * 
 * INTERVIEW TIPS:
 * 1. Start with Approach 1 (iterative)
 * 2. Explain why we use mid = left + (right - left) / 2
 * 3. Draw diagram showing search space reduction
 * 4. Mention recursive alternative
 * 5. Discuss edge cases (empty array, single element)
 * 
 * COMMON MISTAKES:
 * 1. Using (left + right) / 2 (can overflow)
 * 2. Wrong loop condition (< instead of <=)
 * 3. Not updating left/right correctly
 * 4. Off-by-one errors
 * 5. Infinite loop due to wrong mid calculation
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. What if array has duplicates? (Find first/last occurrence)
 * 2. Can you find insertion position? (Return left)
 * 3. What about rotated array? (Modified binary search)
 * 4. How to find range? (Two binary searches)
 * 5. What if array is very large? (Same O(log n))
 * 
 * RELATED PROBLEMS:
 * - Search Insert Position
 * - First Bad Version
 * - Find First and Last Position
 * - Search in Rotated Sorted Array
 * - Find Minimum in Rotated Sorted Array
 * 
 * KEY INSIGHTS:
 * 1. Binary search requires sorted array
 * 2. Halves search space each iteration
 * 3. O(log n) is very efficient
 * 4. Must handle edge cases carefully
 * 5. Iterative is preferred over recursive
 * 
 * WHY mid = left + (right - left) / 2:
 * - Prevents integer overflow
 * - (left + right) / 2 can overflow if left + right > INT_MAX
 * - Equivalent but safer
 * - Always use this formula
 * 
 * BINARY SEARCH INVARIANT:
 * - If target exists, it's in [left, right]
 * - After each iteration, maintain this invariant
 * - When left > right, target doesn't exist
 * - Loop terminates when found or invariant violated
 * 
 * EDGE CASES:
 * - Empty array: return -1
 * - Single element: check if equals target
 * - Target at boundaries: first or last element
 * - Target not in array: return -1
 * - All elements same: still works
 */

// Made with Bob
