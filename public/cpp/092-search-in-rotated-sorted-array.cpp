/*
 * Problem: Search in Rotated Sorted Array (LeetCode 33)
 * Link: https://leetcode.com/problems/search-in-rotated-sorted-array/
 * Difficulty: Medium
 * Category: Sorting and Searching
 * 
 * Description:
 * There is an integer array nums sorted in ascending order (with distinct values).
 * Prior to being passed to your function, nums is possibly rotated at an unknown
 * pivot index k (1 <= k < nums.length) such that the resulting array is
 * [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed).
 * 
 * Given the array nums after the possible rotation and an integer target, return the
 * index of target if it is in nums, or -1 if it is not in nums.
 * 
 * You must write an algorithm with O(log n) runtime complexity.
 * 
 * Example 1:
 * Input: nums = [4,5,6,7,0,1,2], target = 0
 * Output: 4
 * 
 * Example 2:
 * Input: nums = [4,5,6,7,0,1,2], target = 3
 * Output: -1
 * 
 * Constraints:
 * - 1 <= nums.length <= 5000
 * - -10^4 <= nums[i] <= 10^4
 * - All values of nums are unique.
 */

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/*
 * APPROACH 1: MODIFIED BINARY SEARCH (OPTIMAL)
 * 
 * Intuition:
 * - One half of array is always sorted
 * - Determine which half is sorted
 * - Check if target is in sorted half
 * 
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 */
class Solution1 {
public:
    int search(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] == target) return mid;
            
            if (nums[left] <= nums[mid]) {
                if (nums[left] <= target && target < nums[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            } else {
                if (nums[mid] < target && target <= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
        return -1;
    }
};

/*
 * APPROACH 2: FIND PIVOT THEN BINARY SEARCH
 * 
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 */
class Solution2 {
private:
    int findPivot(vector<int>& nums) {
        int left = 0, right = nums.size() - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] > nums[right]) left = mid + 1;
            else right = mid;
        }
        return left;
    }
    
    int binarySearch(vector<int>& nums, int left, int right, int target) {
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
    
public:
    int search(vector<int>& nums, int target) {
        int n = nums.size();
        int pivot = findPivot(nums);
        
        if (pivot == 0 || target < nums[0]) {
            return binarySearch(nums, pivot, n - 1, target);
        }
        return binarySearch(nums, 0, pivot - 1, target);
    }
};

/*
 * APPROACH 3: RECURSIVE SOLUTION
 * 
 * Time Complexity: O(log n)
 * Space Complexity: O(log n)
 */
class Solution3 {
private:
    int searchHelper(vector<int>& nums, int target, int left, int right) {
        if (left > right) return -1;
        
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                return searchHelper(nums, target, left, mid - 1);
            } else {
                return searchHelper(nums, target, mid + 1, right);
            }
        } else {
            if (nums[mid] < target && target <= nums[right]) {
                return searchHelper(nums, target, mid + 1, right);
            } else {
                return searchHelper(nums, target, left, mid - 1);
            }
        }
    }
    
public:
    int search(vector<int>& nums, int target) {
        return searchHelper(nums, target, 0, nums.size() - 1);
    }
};

/*
 * APPROACH 4: LINEAR SEARCH (BASELINE)
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class Solution4 {
public:
    int search(vector<int>& nums, int target) {
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] == target) return i;
        }
        return -1;
    }
};

/*
 * APPROACH 5: STL FIND
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class Solution5 {
public:
    int search(vector<int>& nums, int target) {
        auto it = find(nums.begin(), nums.end(), target);
        return it != nums.end() ? distance(nums.begin(), it) : -1;
    }
};

void test(vector<int> nums, int target, int approach) {
    int result;
    
    cout << "Input: nums = [";
    for (int i = 0; i < nums.size(); i++) {
        cout << nums[i];
        if (i < nums.size() - 1) cout << ",";
    }
    cout << "], target = " << target << "\n";
    
    switch(approach) {
        case 1: { Solution1 sol; result = sol.search(nums, target); cout << "Approach 1: "; break; }
        case 2: { Solution2 sol; result = sol.search(nums, target); cout << "Approach 2: "; break; }
        case 3: { Solution3 sol; result = sol.search(nums, target); cout << "Approach 3: "; break; }
        case 4: { Solution4 sol; result = sol.search(nums, target); cout << "Approach 4: "; break; }
        case 5: { Solution5 sol; result = sol.search(nums, target); cout << "Approach 5: "; break; }
    }
    
    cout << result << "\n\n";
}

int main() {
    cout << "Test Case 1: Target exists\n";
    vector<int> test1 = {4, 5, 6, 7, 0, 1, 2};
    for (int i = 1; i <= 5; i++) test(test1, 0, i);
    
    cout << "Test Case 2: Target doesn't exist\n";
    vector<int> test2 = {4, 5, 6, 7, 0, 1, 2};
    for (int i = 1; i <= 5; i++) test(test2, 3, i);
    
    cout << "Test Case 3: No rotation\n";
    vector<int> test3 = {1, 2, 3, 4, 5};
    for (int i = 1; i <= 5; i++) test(test3, 3, i);
    
    return 0;
}

/*
 * COMPLEXITY SUMMARY:
 * #1: O(log n) time, O(1) space - OPTIMAL
 * #2: O(log n) time, O(1) space
 * #3: O(log n) time, O(log n) space
 * #4: O(n) time, O(1) space
 * #5: O(n) time, O(1) space
 * 
 * KEY INSIGHTS:
 * - One half always sorted after rotation
 * - Use sorted half to guide search
 * - O(log n) maintained despite rotation
 */

// Made with Bob
