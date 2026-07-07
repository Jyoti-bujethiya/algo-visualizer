/*
 * LeetCode Problem #239: Sliding Window Maximum
 * Difficulty: Hard
 * Link: https://leetcode.com/problems/sliding-window-maximum/
 *
 * Problem Statement:
 * You are given an array of integers nums, there is a sliding window of size k
 * which is moving from the very left of the array to the very right. You can only
 * see the k numbers in the window. Each time the sliding window moves right by one
 * position. Return the max sliding window.
 *
 * Example 1:
 * Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
 * Output: [3,3,5,5,6,7]
 *
 * Example 2:
 * Input: nums = [1], k = 1
 * Output: [1]
 */

#include <vector>
#include <deque>
#include <algorithm>
#include <iostream>
using namespace std;

/*
 * APPROACH 1: BRUTE FORCE
 * Time: O(n * k), Space: O(1)
 * Scan every window of size k and find the max.
 */
class Solution1 {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        int n = nums.size();
        vector<int> result;

        for (int i = 0; i <= n - k; i++) {
            int maxVal = nums[i];
            for (int j = i + 1; j < i + k; j++) {
                maxVal = max(maxVal, nums[j]);
            }
            result.push_back(maxVal);
        }
        return result;
    }
};

/*
 * APPROACH 2: MONOTONIC DEQUE (OPTIMAL)
 * Time: O(n), Space: O(k)
 *
 * Key Insight:
 * - Maintain a deque of indices in decreasing order of their values.
 * - The front of the deque is always the index of the maximum element
 *   in the current window.
 * - Before processing index i:
 *   1. Remove indices from the front that have slid out of the window (< i-k+1).
 *   2. Remove indices from the back whose values are <= nums[i] — they can
 *      never be the maximum while nums[i] is still in the window.
 * - Push i onto the back.
 * - Once i >= k-1, the front of the deque is the window maximum.
 */
class Solution2 {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        int n = nums.size();
        deque<int> dq;   // stores indices
        vector<int> result;

        for (int i = 0; i < n; i++) {
            // Remove out-of-window indices from front
            while (!dq.empty() && dq.front() < i - k + 1) {
                dq.pop_front();
            }

            // Maintain decreasing order: remove smaller elements from back
            while (!dq.empty() && nums[dq.back()] <= nums[i]) {
                dq.pop_back();
            }

            dq.push_back(i);

            // Start recording results once the first full window is reached
            if (i >= k - 1) {
                result.push_back(nums[dq.front()]);
            }
        }
        return result;
    }
};

/*
 * APPROACH 3: SEGMENT TREE / SPARSE TABLE (ADVANCED)
 * Time: O(n log n) build + O(1) per query, Space: O(n)
 * Overkill for this problem but useful for range-max queries.
 * Implemented here as a Sparse Table for static range maximum query.
 */
class Solution3 {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        int n = nums.size();
        // Build sparse table
        int LOG = 1;
        while ((1 << LOG) <= k) LOG++;
        vector<vector<int>> sparse(LOG, vector<int>(n));
        sparse[0] = nums;
        for (int j = 1; j < LOG; j++) {
            for (int i = 0; i + (1 << j) <= n; i++) {
                sparse[j][i] = max(sparse[j-1][i], sparse[j-1][i + (1 << (j-1))]);
            }
        }

        // Query range [l, r] max in O(1)
        auto query = [&](int l, int r) {
            int len = r - l + 1;
            int k2  = __lg(len);          // floor(log2(len))
            return max(sparse[k2][l], sparse[k2][r - (1 << k2) + 1]);
        };

        vector<int> result;
        for (int i = 0; i <= n - k; i++) {
            result.push_back(query(i, i + k - 1));
        }
        return result;
    }
};

/*
 * APPROACH 4: TWO-PASS BLOCK DECOMPOSITION
 * Time: O(n), Space: O(n)
 * Divide array into blocks of size k.
 * left[i]  = max from block start to i (left-to-right prefix max within block).
 * right[i] = max from i to block end   (right-to-left suffix max within block).
 * Window max = max(right[i], left[i+k-1]).
 */
class Solution4 {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        int n = nums.size();
        vector<int> left(n), right(n);

        for (int i = 0; i < n; i++) {
            left[i]  = (i % k == 0) ? nums[i] : max(left[i-1],  nums[i]);
        }
        for (int i = n - 1; i >= 0; i--) {
            right[i] = (i % k == k-1 || i == n-1) ? nums[i] : max(right[i+1], nums[i]);
        }

        vector<int> result;
        for (int i = 0; i <= n - k; i++) {
            result.push_back(max(right[i], left[i + k - 1]));
        }
        return result;
    }
};

/*
 * APPROACH 5: STL MULTISET
 * Time: O(n log k), Space: O(k)
 * Keep a sliding multiset and read the max via rbegin().
 */
class Solution5 {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        multiset<int> ms;
        vector<int> result;

        for (int i = 0; i < (int)nums.size(); i++) {
            ms.insert(nums[i]);
            if (i >= k) ms.erase(ms.find(nums[i - k]));
            if (i >= k - 1) result.push_back(*ms.rbegin());
        }
        return result;
    }
};

void printResult(const vector<int>& v) {
    cout << "[";
    for (int i = 0; i < (int)v.size(); i++) {
        cout << v[i];
        if (i + 1 < (int)v.size()) cout << ",";
    }
    cout << "]" << endl;
}

int main() {
    vector<int> nums1 = {1, 3, -1, -3, 5, 3, 6, 7};
    int k1 = 3;

    vector<int> nums2 = {1};
    int k2 = 1;

    for (int approach = 1; approach <= 5; approach++) {
        cout << "Approach " << approach << ": ";
        switch (approach) {
            case 1: { Solution1 sol; printResult(sol.maxSlidingWindow(nums1, k1)); break; }
            case 2: { Solution2 sol; printResult(sol.maxSlidingWindow(nums1, k1)); break; }
            case 3: { Solution3 sol; printResult(sol.maxSlidingWindow(nums1, k1)); break; }
            case 4: { Solution4 sol; printResult(sol.maxSlidingWindow(nums1, k1)); break; }
            case 5: { Solution5 sol; printResult(sol.maxSlidingWindow(nums1, k1)); break; }
        }
    }

    cout << "\nEdge case (k=1): ";
    { Solution2 sol; printResult(sol.maxSlidingWindow(nums2, k2)); }

    return 0;
}

// Made with Bob
