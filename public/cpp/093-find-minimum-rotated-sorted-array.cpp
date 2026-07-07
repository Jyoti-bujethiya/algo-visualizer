/*
 * Problem: Find Minimum in Rotated Sorted Array (LeetCode 153)
 * Link: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
 * Difficulty: Medium
 * Category: Sorting and Searching
 * 
 * Description:
 * Suppose an array of length n sorted in ascending order is rotated between 1 and n times.
 * Given the sorted rotated array nums of unique elements, return the minimum element.
 * You must write an algorithm that runs in O(log n) time.
 * 
 * Example 1:
 * Input: nums = [3,4,5,1,2]
 * Output: 1
 * 
 * Example 2:
 * Input: nums = [4,5,6,7,0,1,2]
 * Output: 0
 * 
 * Constraints:
 * - n == nums.length
 * - 1 <= n <= 5000
 * - -5000 <= nums[i] <= 5000
 * - All integers are unique
 */

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/*
 * APPROACH 1: BINARY SEARCH (OPTIMAL)
 * Time: O(log n), Space: O(1)
 */
class Solution1 {
public:
    int findMin(vector<int>& nums) {
        int left = 0, right = nums.size() - 1;
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return nums[left];
    }
};

/*
 * APPROACH 2: BINARY SEARCH WITH COMPARISON TO LEFT
 * Time: O(log n), Space: O(1)
 */
class Solution2 {
public:
    int findMin(vector<int>& nums) {
        int left = 0, right = nums.size() - 1;
        
        while (left < right) {
            if (nums[left] < nums[right]) return nums[left];
            
            int mid = left + (right - left) / 2;
            
            if (nums[mid] >= nums[left]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return nums[left];
    }
};

/*
 * APPROACH 3: RECURSIVE BINARY SEARCH
 * Time: O(log n), Space: O(log n)
 */
class Solution3 {
private:
    int findMinHelper(vector<int>& nums, int left, int right) {
        if (left == right) return nums[left];
        if (nums[left] < nums[right]) return nums[left];
        
        int mid = left + (right - left) / 2;
        
        if (nums[mid] > nums[right]) {
            return findMinHelper(nums, mid + 1, right);
        } else {
            return findMinHelper(nums, left, mid);
        }
    }
    
public:
    int findMin(vector<int>& nums) {
        return findMinHelper(nums, 0, nums.size() - 1);
    }
};

/*
 * APPROACH 4: LINEAR SCAN
 * Time: O(n), Space: O(1)
 */
class Solution4 {
public:
    int findMin(vector<int>& nums) {
        int minVal = nums[0];
        for (int num : nums) {
            minVal = min(minVal, num);
        }
        return minVal;
    }
};

/*
 * APPROACH 5: STL MIN_ELEMENT
 * Time: O(n), Space: O(1)
 */
class Solution5 {
public:
    int findMin(vector<int>& nums) {
        return *min_element(nums.begin(), nums.end());
    }
};

void test(vector<int> nums, int approach) {
    int result;
    cout << "Input: [";
    for (int i = 0; i < nums.size(); i++) {
        cout << nums[i];
        if (i < nums.size() - 1) cout << ",";
    }
    cout << "] -> ";
    
    switch(approach) {
        case 1: { Solution1 sol; result = sol.findMin(nums); break; }
        case 2: { Solution2 sol; result = sol.findMin(nums); break; }
        case 3: { Solution3 sol; result = sol.findMin(nums); break; }
        case 4: { Solution4 sol; result = sol.findMin(nums); break; }
        case 5: { Solution5 sol; result = sol.findMin(nums); break; }
    }
    cout << result << "\n";
}

int main() {
    vector<int> test1 = {3, 4, 5, 1, 2};
    vector<int> test2 = {4, 5, 6, 7, 0, 1, 2};
    vector<int> test3 = {11, 13, 15, 17};
    
    for (int i = 1; i <= 5; i++) {
        cout << "Approach " << i << ":\n";
        test(test1, i);
        test(test2, i);
        test(test3, i);
        cout << "\n";
    }
    return 0;
}

// Made with Bob
