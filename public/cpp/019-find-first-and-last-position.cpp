/*
 * Problem: Find First and Last Position of Element in Sorted Array (LeetCode 34)
 * Link: https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/
 * Difficulty: Medium
 * Category: Arrays and Strings
 *
 * Description:
 * Given an array of integers nums sorted in non-decreasing order, find the
 * starting and ending position of a given target value.
 * If target is not found in the array, return [-1, -1].
 * You must write an algorithm with O(log n) runtime complexity.
 *
 * Example 1:
 * Input: nums = [5,7,7,8,8,10], target = 8
 * Output: [3,4]
 *
 * Example 2:
 * Input: nums = [5,7,7,8,8,10], target = 6
 * Output: [-1,-1]
 *
 * Example 3:
 * Input: nums = [], target = 0
 * Output: [-1,-1]
 */

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/*
 * APPROACH 1: LINEAR SCAN
 * Time: O(n), Space: O(1)
 * Simple single pass — not optimal but good for understanding.
 */
class Solution1 {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        int first = -1, last = -1;
        for (int i = 0; i < (int)nums.size(); i++) {
            if (nums[i] == target) {
                if (first == -1) first = i;
                last = i;
            }
        }
        return {first, last};
    }
};

/*
 * APPROACH 2: TWO BINARY SEARCHES (EXPLICIT)
 * Time: O(log n), Space: O(1)
 * One binary search for leftmost position, one for rightmost.
 */
class Solution2 {
    int findLeft(vector<int>& nums, int target) {
        int lo = 0, hi = (int)nums.size() - 1, res = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) { res = mid; hi = mid - 1; }
            else if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return res;
    }

    int findRight(vector<int>& nums, int target) {
        int lo = 0, hi = (int)nums.size() - 1, res = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) { res = mid; lo = mid + 1; }
            else if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return res;
    }

public:
    vector<int> searchRange(vector<int>& nums, int target) {
        return {findLeft(nums, target), findRight(nums, target)};
    }
};

/*
 * APPROACH 3: STL LOWER_BOUND / UPPER_BOUND
 * Time: O(log n), Space: O(1)
 */
class Solution3 {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        auto lo = lower_bound(nums.begin(), nums.end(), target);
        if (lo == nums.end() || *lo != target) return {-1, -1};
        auto hi = upper_bound(nums.begin(), nums.end(), target);
        return {(int)(lo - nums.begin()), (int)(hi - nums.begin()) - 1};
    }
};

/*
 * APPROACH 4: SINGLE BINARY SEARCH FUNCTION WITH FLAG
 * Time: O(log n), Space: O(1)
 * One helper that accepts a boolean to search for leftmost or rightmost.
 */
class Solution4 {
    int binarySearch(vector<int>& nums, int target, bool findFirst) {
        int lo = 0, hi = (int)nums.size() - 1, res = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) {
                res = mid;
                if (findFirst) hi = mid - 1;
                else           lo = mid + 1;
            } else if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return res;
    }

public:
    vector<int> searchRange(vector<int>& nums, int target) {
        return {binarySearch(nums, target, true),
                binarySearch(nums, target, false)};
    }
};

/*
 * APPROACH 5: RECURSIVE BINARY SEARCH
 * Time: O(log n), Space: O(log n) — recursion stack
 */
class Solution5 {
    int findFirst(vector<int>& nums, int target, int lo, int hi) {
        if (lo > hi) return -1;
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) {
            int left = findFirst(nums, target, lo, mid - 1);
            return left == -1 ? mid : left;
        }
        return nums[mid] < target ? findFirst(nums, target, mid + 1, hi)
                                  : findFirst(nums, target, lo, mid - 1);
    }

    int findLast(vector<int>& nums, int target, int lo, int hi) {
        if (lo > hi) return -1;
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) {
            int right = findLast(nums, target, mid + 1, hi);
            return right == -1 ? mid : right;
        }
        return nums[mid] < target ? findLast(nums, target, mid + 1, hi)
                                  : findLast(nums, target, lo, mid - 1);
    }

public:
    vector<int> searchRange(vector<int>& nums, int target) {
        int n = nums.size();
        return {findFirst(nums, target, 0, n - 1),
                findLast(nums, target, 0, n - 1)};
    }
};

void test(vector<int> nums, int target, int approach) {
    vector<int> result;
    switch(approach) {
        case 1: { Solution1 s; result = s.searchRange(nums, target); break; }
        case 2: { Solution2 s; result = s.searchRange(nums, target); break; }
        case 3: { Solution3 s; result = s.searchRange(nums, target); break; }
        case 4: { Solution4 s; result = s.searchRange(nums, target); break; }
        case 5: { Solution5 s; result = s.searchRange(nums, target); break; }
    }
    cout << "Approach " << approach << ": [" << result[0] << "," << result[1] << "]\n";
}

int main() {
    vector<int> nums1 = {5,7,7,8,8,10};
    vector<int> nums2 = {5,7,7,8,8,10};
    vector<int> nums3 = {};

    cout << "nums=[5,7,7,8,8,10], target=8:\n";
    for (int i = 1; i <= 5; i++) test(nums1, 8, i);
    cout << "\nnums=[5,7,7,8,8,10], target=6:\n";
    for (int i = 1; i <= 5; i++) test(nums2, 6, i);
    cout << "\nnums=[], target=0:\n";
    for (int i = 1; i <= 5; i++) test(nums3, 0, i);
    return 0;
}

// Made with Bob
