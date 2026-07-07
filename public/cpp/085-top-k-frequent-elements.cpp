/*
 * Problem: Top K Frequent Elements (LeetCode 347)
 * Link: https://leetcode.com/problems/top-k-frequent-elements/
 * Difficulty: Medium
 * Category: Heaps and Priority Queues
 * 
 * Description:
 * Given an integer array nums and an integer k, return the k most frequent elements.
 * You may return the answer in any order.
 * 
 * Example 1:
 * Input: nums = [1,1,1,2,2,3], k = 2
 * Output: [1,2]
 * 
 * Example 2:
 * Input: nums = [1], k = 1
 * Output: [1]
 * 
 * Constraints:
 * - 1 <= nums.length <= 10^5
 * - -10^4 <= nums[i] <= 10^4
 * - k is in the range [1, the number of unique elements in the array].
 * - It is guaranteed that the answer is unique.
 * 
 * Follow up: Your algorithm's time complexity must be better than O(n log n),
 * where n is the array's size.
 */

#include <iostream>
#include <vector>
#include <unordered_map>
#include <queue>
#include <algorithm>
using namespace std;

/*
 * APPROACH 1: MIN HEAP (OPTIMAL FOR SMALL K)
 * 
 * Intuition:
 * - Count frequency of each element
 * - Use min heap of size k
 * - Keep k most frequent elements in heap
 * - Heap top is kth most frequent
 * 
 * Algorithm:
 * 1. Count frequencies using hash map
 * 2. For each element:
 *    - If heap size < k, add to heap
 *    - Else if frequency > heap top, replace
 * 3. Extract all elements from heap
 * 
 * Time Complexity: O(n log k) - n elements, heap size k
 * Space Complexity: O(n) - hash map
 */
class Solution1 {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> freq;
        for (int num : nums) {
            freq[num]++;
        }
        
        // Min heap: (frequency, number)
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> minHeap;
        
        for (auto& [num, count] : freq) {
            minHeap.push({count, num});
            if (minHeap.size() > k) {
                minHeap.pop();
            }
        }
        
        vector<int> result;
        while (!minHeap.empty()) {
            result.push_back(minHeap.top().second);
            minHeap.pop();
        }
        
        return result;
    }
};

/*
 * APPROACH 2: BUCKET SORT (OPTIMAL)
 * 
 * Intuition:
 * - Frequency range is [1, n]
 * - Create buckets for each frequency
 * - Bucket[i] contains elements with frequency i
 * - Collect from high frequency buckets
 * 
 * Algorithm:
 * 1. Count frequencies
 * 2. Create buckets array of size n+1
 * 3. Place each element in its frequency bucket
 * 4. Collect k elements from high to low frequency
 * 
 * Time Complexity: O(n) - linear time
 * Space Complexity: O(n)
 */
class Solution2 {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        int n = nums.size();
        unordered_map<int, int> freq;
        
        for (int num : nums) {
            freq[num]++;
        }
        
        // Bucket[i] = elements with frequency i
        vector<vector<int>> buckets(n + 1);
        for (auto& [num, count] : freq) {
            buckets[count].push_back(num);
        }
        
        vector<int> result;
        for (int i = n; i >= 0 && result.size() < k; i--) {
            for (int num : buckets[i]) {
                result.push_back(num);
                if (result.size() == k) break;
            }
        }
        
        return result;
    }
};

/*
 * APPROACH 3: QUICKSELECT (AVERAGE O(n))
 * 
 * Intuition:
 * - Use quickselect to find kth most frequent
 * - Partition based on frequency
 * - Only need to sort partially
 * 
 * Algorithm:
 * 1. Count frequencies
 * 2. Create array of (num, freq) pairs
 * 3. Use quickselect to partition
 * 4. Return top k elements
 * 
 * Time Complexity: O(n) average, O(n^2) worst
 * Space Complexity: O(n)
 */
class Solution3 {
private:
    int partition(vector<pair<int, int>>& arr, int left, int right) {
        int pivot = arr[right].second;
        int i = left;
        
        for (int j = left; j < right; j++) {
            if (arr[j].second >= pivot) {
                swap(arr[i], arr[j]);
                i++;
            }
        }
        
        swap(arr[i], arr[right]);
        return i;
    }
    
    void quickselect(vector<pair<int, int>>& arr, int left, int right, int k) {
        if (left >= right) return;
        
        int pivotIndex = partition(arr, left, right);
        
        if (pivotIndex == k) return;
        else if (pivotIndex < k) quickselect(arr, pivotIndex + 1, right, k);
        else quickselect(arr, left, pivotIndex - 1, k);
    }
    
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> freq;
        for (int num : nums) {
            freq[num]++;
        }
        
        vector<pair<int, int>> arr;
        for (auto& [num, count] : freq) {
            arr.push_back({num, count});
        }
        
        quickselect(arr, 0, arr.size() - 1, k - 1);
        
        vector<int> result;
        for (int i = 0; i < k; i++) {
            result.push_back(arr[i].first);
        }
        
        return result;
    }
};

/*
 * APPROACH 4: SORTING
 * 
 * Intuition:
 * - Count frequencies
 * - Sort by frequency
 * - Take top k
 * 
 * Algorithm:
 * 1. Count frequencies
 * 2. Create pairs and sort
 * 3. Return first k elements
 * 
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */
class Solution4 {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> freq;
        for (int num : nums) {
            freq[num]++;
        }
        
        vector<pair<int, int>> arr;
        for (auto& [num, count] : freq) {
            arr.push_back({count, num});
        }
        
        sort(arr.rbegin(), arr.rend());
        
        vector<int> result;
        for (int i = 0; i < k; i++) {
            result.push_back(arr[i].second);
        }
        
        return result;
    }
};

/*
 * APPROACH 5: MAX HEAP
 * 
 * Intuition:
 * - Use max heap to get elements in frequency order
 * - Extract k elements from heap
 * - Simple but not optimal for large k
 * 
 * Algorithm:
 * 1. Count frequencies
 * 2. Add all to max heap
 * 3. Extract k elements
 * 
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */
class Solution5 {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> freq;
        for (int num : nums) {
            freq[num]++;
        }
        
        priority_queue<pair<int, int>> maxHeap;
        for (auto& [num, count] : freq) {
            maxHeap.push({count, num});
        }
        
        vector<int> result;
        for (int i = 0; i < k; i++) {
            result.push_back(maxHeap.top().second);
            maxHeap.pop();
        }
        
        return result;
    }
};

// Test function
void test(vector<int> nums, int k, int approach) {
    vector<int> result;
    
    cout << "Input: nums = [";
    for (int i = 0; i < nums.size(); i++) {
        cout << nums[i];
        if (i < nums.size() - 1) cout << ",";
    }
    cout << "], k = " << k << "\n";
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.topKFrequent(nums, k);
            cout << "Approach 1 (Min Heap): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.topKFrequent(nums, k);
            cout << "Approach 2 (Bucket Sort): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.topKFrequent(nums, k);
            cout << "Approach 3 (Quickselect): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.topKFrequent(nums, k);
            cout << "Approach 4 (Sorting): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.topKFrequent(nums, k);
            cout << "Approach 5 (Max Heap): ";
            break;
        }
    }
    
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]\n\n";
}

int main() {
    // Test Case 1: Standard case
    cout << "Test Case 1: Standard case\n";
    vector<int> test1 = {1, 1, 1, 2, 2, 3};
    for (int i = 1; i <= 5; i++) {
        test(test1, 2, i);
    }
    
    // Test Case 2: Single element
    cout << "Test Case 2: Single element\n";
    vector<int> test2 = {1};
    for (int i = 1; i <= 5; i++) {
        test(test2, 1, i);
    }
    
    // Test Case 3: All same frequency
    cout << "Test Case 3: All same frequency\n";
    vector<int> test3 = {1, 2, 3, 4, 5};
    for (int i = 1; i <= 5; i++) {
        test(test3, 3, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (Min Heap):
 * - Time: O(n log k)
 * - Space: O(n)
 * - Best for: Small k, k << n
 * 
 * Approach 2 (Bucket Sort - OPTIMAL):
 * - Time: O(n)
 * - Space: O(n)
 * - Best for: Linear time requirement
 * 
 * Approach 3 (Quickselect):
 * - Time: O(n) average, O(n^2) worst
 * - Space: O(n)
 * - Best for: Average case optimization
 * 
 * Approach 4 (Sorting):
 * - Time: O(n log n)
 * - Space: O(n)
 * - Best for: Simple implementation
 * 
 * Approach 5 (Max Heap):
 * - Time: O(n log n)
 * - Space: O(n)
 * - Best for: Large k
 * 
 * INTERVIEW TIPS:
 * 1. Start with Approach 1 (min heap)
 * 2. Mention Approach 2 for O(n) time
 * 3. Explain bucket sort intuition
 * 4. Discuss trade-offs based on k
 * 5. Consider follow-up requirements
 * 
 * COMMON MISTAKES:
 * 1. Using max heap when min heap is better
 * 2. Not considering k vs n relationship
 * 3. Wrong heap comparison function
 * 4. Forgetting to count frequencies first
 * 5. Not handling edge cases
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. What if k is very large? (Use max heap)
 * 2. Can you do it in O(n)? (Yes, bucket sort)
 * 3. What if stream of data? (Use heap)
 * 4. How to handle ties? (Any order is fine)
 * 5. Space optimization? (In-place quickselect)
 * 
 * RELATED PROBLEMS:
 * - Kth Largest Element
 * - Top K Frequent Words
 * - Sort Characters by Frequency
 * - Find K Pairs with Smallest Sums
 * - Reorganize String
 * 
 * KEY INSIGHTS:
 * 1. Frequency counting is first step
 * 2. Choice depends on k vs n
 * 3. Bucket sort achieves O(n)
 * 4. Min heap optimal for small k
 * 5. Multiple valid approaches
 * 
 * WHEN TO USE EACH APPROACH:
 * - k << n: Min heap (Approach 1)
 * - k ≈ n: Bucket sort (Approach 2)
 * - Need O(n): Bucket sort or quickselect
 * - Simple code: Sorting (Approach 4)
 * - Stream data: Heap-based
 * 
 * BUCKET SORT EXPLANATION:
 * - Frequency range: [1, n]
 * - Create n+1 buckets
 * - Bucket[i] = elements with frequency i
 * - Collect from high to low
 * - O(n) time, O(n) space
 * - Optimal for this problem
 * 
 * HEAP CHOICE:
 * - Min heap for small k: keep k largest
 * - Max heap for large k: extract k times
 * - Min heap: O(n log k)
 * - Max heap: O(n log n)
 * - Choose based on k
 */

// Made with Bob
