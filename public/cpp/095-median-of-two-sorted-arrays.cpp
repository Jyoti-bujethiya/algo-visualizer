/*
 * Problem: Median of Two Sorted Arrays (LeetCode 4)
 * Link: https://leetcode.com/problems/median-of-two-sorted-arrays/
 * Difficulty: Hard
 * Category: Sorting and Searching
 * 
 * Description:
 * Given two sorted arrays nums1 and nums2 of size m and n respectively,
 * return the median of the two sorted arrays.
 * The overall run time complexity should be O(log (m+n)).
 * 
 * Example 1:
 * Input: nums1 = [1,3], nums2 = [2]
 * Output: 2.00000
 * 
 * Example 2:
 * Input: nums1 = [1,2], nums2 = [3,4]
 * Output: 2.50000
 */

#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

/*
 * APPROACH 1: BINARY SEARCH ON SMALLER ARRAY (OPTIMAL)
 * Time: O(log(min(m,n))), Space: O(1)
 */
class Solution1 {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        if (nums1.size() > nums2.size()) {
            return findMedianSortedArrays(nums2, nums1);
        }
        
        int m = nums1.size(), n = nums2.size();
        int left = 0, right = m;
        
        while (left <= right) {
            int partition1 = (left + right) / 2;
            int partition2 = (m + n + 1) / 2 - partition1;
            
            int maxLeft1 = (partition1 == 0) ? INT_MIN : nums1[partition1 - 1];
            int minRight1 = (partition1 == m) ? INT_MAX : nums1[partition1];
            
            int maxLeft2 = (partition2 == 0) ? INT_MIN : nums2[partition2 - 1];
            int minRight2 = (partition2 == n) ? INT_MAX : nums2[partition2];
            
            if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
                if ((m + n) % 2 == 0) {
                    return (max(maxLeft1, maxLeft2) + min(minRight1, minRight2)) / 2.0;
                } else {
                    return max(maxLeft1, maxLeft2);
                }
            } else if (maxLeft1 > minRight2) {
                right = partition1 - 1;
            } else {
                left = partition1 + 1;
            }
        }
        return 0.0;
    }
};

/*
 * APPROACH 2: MERGE AND FIND MEDIAN
 * Time: O(m+n), Space: O(m+n)
 */
class Solution2 {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        vector<int> merged;
        int i = 0, j = 0;
        
        while (i < nums1.size() && j < nums2.size()) {
            if (nums1[i] < nums2[j]) {
                merged.push_back(nums1[i++]);
            } else {
                merged.push_back(nums2[j++]);
            }
        }
        
        while (i < nums1.size()) merged.push_back(nums1[i++]);
        while (j < nums2.size()) merged.push_back(nums2[j++]);
        
        int n = merged.size();
        if (n % 2 == 0) {
            return (merged[n/2-1] + merged[n/2]) / 2.0;
        } else {
            return merged[n/2];
        }
    }
};

/*
 * APPROACH 3: TWO POINTERS WITHOUT MERGE
 * Time: O(m+n), Space: O(1)
 */
class Solution3 {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        int m = nums1.size(), n = nums2.size();
        int total = m + n;
        int i = 0, j = 0, count = 0;
        int prev = 0, curr = 0;
        
        while (count <= total / 2) {
            prev = curr;
            if (i < m && (j >= n || nums1[i] < nums2[j])) {
                curr = nums1[i++];
            } else {
                curr = nums2[j++];
            }
            count++;
        }
        
        if (total % 2 == 0) {
            return (prev + curr) / 2.0;
        } else {
            return curr;
        }
    }
};

/*
 * APPROACH 4: RECURSIVE BINARY SEARCH
 * Time: O(log(m+n)), Space: O(log(m+n))
 */
class Solution4 {
private:
    int findKth(vector<int>& nums1, int i, vector<int>& nums2, int j, int k) {
        if (i >= nums1.size()) return nums2[j + k - 1];
        if (j >= nums2.size()) return nums1[i + k - 1];
        if (k == 1) return min(nums1[i], nums2[j]);
        
        int mid1 = (i + k/2 - 1 < nums1.size()) ? nums1[i + k/2 - 1] : INT_MAX;
        int mid2 = (j + k/2 - 1 < nums2.size()) ? nums2[j + k/2 - 1] : INT_MAX;
        
        if (mid1 < mid2) {
            return findKth(nums1, i + k/2, nums2, j, k - k/2);
        } else {
            return findKth(nums1, i, nums2, j + k/2, k - k/2);
        }
    }
    
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        int m = nums1.size(), n = nums2.size();
        int total = m + n;
        
        if (total % 2 == 0) {
            return (findKth(nums1, 0, nums2, 0, total/2) + 
                    findKth(nums1, 0, nums2, 0, total/2 + 1)) / 2.0;
        } else {
            return findKth(nums1, 0, nums2, 0, total/2 + 1);
        }
    }
};

/*
 * APPROACH 5: STL MERGE
 * Time: O(m+n), Space: O(m+n)
 */
class Solution5 {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        vector<int> merged(nums1.size() + nums2.size());
        merge(nums1.begin(), nums1.end(), nums2.begin(), nums2.end(), merged.begin());
        
        int n = merged.size();
        if (n % 2 == 0) {
            return (merged[n/2-1] + merged[n/2]) / 2.0;
        } else {
            return merged[n/2];
        }
    }
};

void test(vector<int> nums1, vector<int> nums2, int approach) {
    double result;
    
    switch(approach) {
        case 1: { Solution1 sol; result = sol.findMedianSortedArrays(nums1, nums2); break; }
        case 2: { Solution2 sol; result = sol.findMedianSortedArrays(nums1, nums2); break; }
        case 3: { Solution3 sol; result = sol.findMedianSortedArrays(nums1, nums2); break; }
        case 4: { Solution4 sol; result = sol.findMedianSortedArrays(nums1, nums2); break; }
        case 5: { Solution5 sol; result = sol.findMedianSortedArrays(nums1, nums2); break; }
    }
    cout << result << "\n";
}

int main() {
    vector<int> nums1 = {1, 3};
    vector<int> nums2 = {2};
    
    for (int i = 1; i <= 5; i++) {
        cout << "Approach " << i << ": ";
        test(nums1, nums2, i);
    }
    return 0;
}

// Made with Bob
