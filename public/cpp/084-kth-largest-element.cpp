/*
 * Problem: Kth Largest Element in an Array (LeetCode 215)
 * Link: https://leetcode.com/problems/kth-largest-element-in-an-array/
 * Difficulty: Medium
 * Category: Heaps and Priority Queues
 *
 * Description:
 * Given an integer array nums and an integer k, return the kth largest element
 * in the array. Note that it is the kth largest element in the sorted order,
 * not the kth distinct element.
 * Can you solve it without sorting?
 *
 * Example 1: nums=[3,2,1,5,6,4], k=2  → 5
 * Example 2: nums=[3,2,3,1,2,4,5,5,6], k=4 → 4
 *
 * Constraints:
 * - 1 <= k <= nums.length <= 10^5
 * - -10^4 <= nums[i] <= 10^4
 */

#include <vector>
#include <algorithm>
#include <iostream>
#include <queue>
#include <random>
using namespace std;

/*
 * APPROACH 1: MIN HEAP OF SIZE K (OPTIMAL FOR SMALL K)
 *
 * Maintain a min-heap of size k.  The top of the heap is always the kth largest.
 * For each element: if heap < k → push; else if element > top → replace top.
 *
 * Time:  O(n log k)
 * Space: O(k)
 */
class Solution1 {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int, vector<int>, greater<int>> minHeap;
        for (int num : nums) {
            minHeap.push(num);
            if ((int)minHeap.size() > k) minHeap.pop();
        }
        return minHeap.top();
    }
};

/*
 * APPROACH 2: SORT DESCENDING
 *
 * Sort the array in descending order and return element at index k-1.
 *
 * Time:  O(n log n)
 * Space: O(1)  (in-place sort)
 */
class Solution2 {
public:
    int findKthLargest(vector<int>& nums, int k) {
        sort(nums.begin(), nums.end(), greater<int>());
        return nums[k - 1];
    }
};

/*
 * APPROACH 3: QUICKSELECT (AVERAGE O(n))
 *
 * Partition the array around a pivot (Dutch National Flag style).
 * If pivot lands at position n-k we are done; otherwise recurse on
 * the correct side.  Uses random pivot to avoid worst-case O(n²).
 *
 * Time:  O(n) average, O(n²) worst
 * Space: O(log n) recursion stack
 */
class Solution3 {
    int partition(vector<int>& nums, int lo, int hi) {
        // Random pivot to avoid sorted-input worst case
        int pivotIdx = lo + rand() % (hi - lo + 1);
        swap(nums[pivotIdx], nums[hi]);
        int pivot = nums[hi], i = lo;
        for (int j = lo; j < hi; j++)
            if (nums[j] <= pivot) swap(nums[i++], nums[j]);
        swap(nums[i], nums[hi]);
        return i;
    }
    int quickselect(vector<int>& nums, int lo, int hi, int target) {
        if (lo == hi) return nums[lo];
        int p = partition(nums, lo, hi);
        if (p == target) return nums[p];
        return p < target ? quickselect(nums, p + 1, hi, target)
                          : quickselect(nums, lo, p - 1, target);
    }
public:
    int findKthLargest(vector<int>& nums, int k) {
        // kth largest = element at index n-k in sorted ascending order
        return quickselect(nums, 0, nums.size() - 1, nums.size() - k);
    }
};

/*
 * APPROACH 4: MAX HEAP (SIMPLE, EXTRACT K TIMES)
 *
 * Build a max-heap, pop k times.
 *
 * Time:  O(n + k log n)
 * Space: O(n)
 */
class Solution4 {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int> maxHeap(nums.begin(), nums.end());
        for (int i = 0; i < k - 1; i++) maxHeap.pop();
        return maxHeap.top();
    }
};

/*
 * APPROACH 5: COUNTING SORT  (when values bounded)
 *
 * Because constraints guarantee -10^4 <= nums[i] <= 10^4, we can bucket-count.
 *
 * Time:  O(n + R)  where R = value range = 20001
 * Space: O(R)
 */
class Solution5 {
public:
    int findKthLargest(vector<int>& nums, int k) {
        const int OFFSET = 10000;
        const int R = 20001;
        vector<int> cnt(R, 0);
        for (int n : nums) cnt[n + OFFSET]++;
        int remain = k;
        for (int v = R - 1; v >= 0; v--) {
            remain -= cnt[v];
            if (remain <= 0) return v - OFFSET;
        }
        return -1; // unreachable
    }
};

void test(vector<int> nums, int k, int approach) {
    int result;
    cout << "[";
    for (int i = 0; i < (int)nums.size(); i++) { cout << nums[i]; if (i+1<(int)nums.size()) cout<<","; }
    cout << "] k=" << k << "  ";
    switch(approach) {
        case 1: { Solution1 s; result=s.findKthLargest(nums,k); cout<<"MinHeap:     "; break; }
        case 2: { Solution2 s; result=s.findKthLargest(nums,k); cout<<"Sort:        "; break; }
        case 3: { Solution3 s; result=s.findKthLargest(nums,k); cout<<"Quickselect: "; break; }
        case 4: { Solution4 s; result=s.findKthLargest(nums,k); cout<<"MaxHeap:     "; break; }
        case 5: { Solution5 s; result=s.findKthLargest(nums,k); cout<<"CountSort:   "; break; }
    }
    cout << result << "\n";
}

int main() {
    for(int i=1;i<=5;i++) test({3,2,1,5,6,4},2,i);
    cout << "\n";
    for(int i=1;i<=5;i++) test({3,2,3,1,2,4,5,5,6},4,i);
    cout << "\n";
    for(int i=1;i<=5;i++) test({1},1,i);
    return 0;
}

/*
 * COMPLEXITY SUMMARY:
 * Approach 1 (Min Heap k):   Time O(n log k)        Space O(k)
 * Approach 2 (Sort):         Time O(n log n)         Space O(1)
 * Approach 3 (Quickselect):  Time O(n) avg           Space O(log n)
 * Approach 4 (Max Heap):     Time O(n + k log n)     Space O(n)
 * Approach 5 (Count Sort):   Time O(n + R)           Space O(R)
 */

// Made with Bob
