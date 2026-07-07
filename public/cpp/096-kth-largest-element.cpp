/*
 * Problem: Kth Largest Element in an Array (LeetCode 215)
 * Link: https://leetcode.com/problems/kth-largest-element-in-an-array/
 * Difficulty: Medium
 * Category: Sorting and Searching
 * 
 * Description:
 * Given an integer array nums and an integer k, return the kth largest element.
 * Note that it is the kth largest element in sorted order, not the kth distinct element.
 * 
 * Example 1:
 * Input: nums = [3,2,1,5,6,4], k = 2
 * Output: 5
 * 
 * Example 2:
 * Input: nums = [3,2,3,1,2,4,5,5,6], k = 4
 * Output: 4
 */

#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

/*
 * APPROACH 1: QUICKSELECT (OPTIMAL)
 * Time: O(n) average, O(n²) worst, Space: O(1)
 */
class Solution1 {
private:
    int partition(vector<int>& nums, int left, int right) {
        int pivot = nums[right];
        int i = left;
        
        for (int j = left; j < right; j++) {
            if (nums[j] >= pivot) {
                swap(nums[i], nums[j]);
                i++;
            }
        }
        swap(nums[i], nums[right]);
        return i;
    }
    
    int quickSelect(vector<int>& nums, int left, int right, int k) {
        if (left == right) return nums[left];
        
        int pivotIndex = partition(nums, left, right);
        
        if (pivotIndex == k) return nums[pivotIndex];
        else if (pivotIndex < k) return quickSelect(nums, pivotIndex + 1, right, k);
        else return quickSelect(nums, left, pivotIndex - 1, k);
    }
    
public:
    int findKthLargest(vector<int>& nums, int k) {
        return quickSelect(nums, 0, nums.size() - 1, k - 1);
    }
};

/*
 * APPROACH 2: MIN HEAP
 * Time: O(n log k), Space: O(k)
 */
class Solution2 {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int, vector<int>, greater<int>> minHeap;
        
        for (int num : nums) {
            minHeap.push(num);
            if (minHeap.size() > k) {
                minHeap.pop();
            }
        }
        return minHeap.top();
    }
};

/*
 * APPROACH 3: SORTING
 * Time: O(n log n), Space: O(1)
 */
class Solution3 {
public:
    int findKthLargest(vector<int>& nums, int k) {
        sort(nums.begin(), nums.end(), greater<int>());
        return nums[k - 1];
    }
};

/*
 * APPROACH 4: MAX HEAP
 * Time: O(n + k log n), Space: O(n)
 */
class Solution4 {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int> maxHeap(nums.begin(), nums.end());
        
        for (int i = 0; i < k - 1; i++) {
            maxHeap.pop();
        }
        return maxHeap.top();
    }
};

/*
 * APPROACH 5: STL NTH_ELEMENT
 * Time: O(n) average, Space: O(1)
 */
class Solution5 {
public:
    int findKthLargest(vector<int>& nums, int k) {
        nth_element(nums.begin(), nums.begin() + k - 1, nums.end(), greater<int>());
        return nums[k - 1];
    }
};

void test(vector<int> nums, int k, int approach) {
    int result;
    
    switch(approach) {
        case 1: { Solution1 sol; result = sol.findKthLargest(nums, k); break; }
        case 2: { Solution2 sol; result = sol.findKthLargest(nums, k); break; }
        case 3: { Solution3 sol; result = sol.findKthLargest(nums, k); break; }
        case 4: { Solution4 sol; result = sol.findKthLargest(nums, k); break; }
        case 5: { Solution5 sol; result = sol.findKthLargest(nums, k); break; }
    }
    cout << result << "\n";
}

int main() {
    vector<int> nums = {3, 2, 1, 5, 6, 4};
    int k = 2;
    
    for (int i = 1; i <= 5; i++) {
        cout << "Approach " << i << ": ";
        test(nums, k, i);
    }
    return 0;
}

// Made with Bob
