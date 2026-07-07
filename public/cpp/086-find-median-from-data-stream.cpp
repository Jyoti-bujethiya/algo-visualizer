/*
 * Problem: Find Median from Data Stream (LeetCode 295)
 * Link: https://leetcode.com/problems/find-median-from-data-stream/
 * Difficulty: Hard
 * Category: Heaps and Priority Queues
 * 
 * Description:
 * The median is the middle value in an ordered integer list. If the size of the
 * list is even, there is no middle value, and the median is the mean of the two
 * middle values.
 * 
 * Implement the MedianFinder class:
 * - MedianFinder() initializes the MedianFinder object.
 * - void addNum(int num) adds the integer num from the data stream to the data structure.
 * - double findMedian() returns the median of all elements so far.
 * 
 * Example 1:
 * Input:
 * ["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
 * [[], [1], [2], [], [3], []]
 * Output: [null, null, null, 1.5, null, 2.0]
 * 
 * Constraints:
 * - -10^5 <= num <= 10^5
 * - There will be at least one element in the data structure before calling findMedian.
 * - At most 5 * 10^4 calls will be made to addNum and findMedian.
 */

#include <iostream>
#include <queue>
#include <vector>
#include <algorithm>
#include <set>
using namespace std;

/*
 * APPROACH 1: TWO HEAPS (OPTIMAL)
 * 
 * Intuition:
 * - Use max heap for lower half of numbers
 * - Use min heap for upper half of numbers
 * - Keep heaps balanced (size difference <= 1)
 * - Median is at top of heap(s)
 * 
 * Algorithm:
 * addNum:
 * 1. Add to max heap (lower half)
 * 2. Move max heap top to min heap (upper half)
 * 3. Balance: if min heap larger, move top to max heap
 * 
 * findMedian:
 * 1. If heaps equal size: average of both tops
 * 2. Otherwise: top of larger heap
 * 
 * Time Complexity:
 * - addNum: O(log n) - heap operations
 * - findMedian: O(1) - just peek
 * Space Complexity: O(n) - store all numbers
 */
class MedianFinder1 {
private:
    priority_queue<int> maxHeap; // Lower half (max heap)
    priority_queue<int, vector<int>, greater<int>> minHeap; // Upper half (min heap)
    
public:
    MedianFinder1() {}
    
    void addNum(int num) {
        // Add to max heap first
        maxHeap.push(num);
        
        // Balance: move largest from lower half to upper half
        minHeap.push(maxHeap.top());
        maxHeap.pop();
        
        // Ensure max heap has equal or one more element
        if (minHeap.size() > maxHeap.size()) {
            maxHeap.push(minHeap.top());
            minHeap.pop();
        }
    }
    
    double findMedian() {
        if (maxHeap.size() > minHeap.size()) {
            return maxHeap.top();
        }
        return (maxHeap.top() + minHeap.top()) / 2.0;
    }
};

/*
 * APPROACH 2: SORTED VECTOR WITH BINARY SEARCH
 * 
 * Intuition:
 * - Maintain sorted array
 * - Use binary search to find insertion position
 * - Median is at middle position(s)
 * 
 * Algorithm:
 * addNum:
 * 1. Binary search for insertion position
 * 2. Insert at correct position
 * 
 * findMedian:
 * 1. Return middle element(s)
 * 
 * Time Complexity:
 * - addNum: O(n) - insertion in vector
 * - findMedian: O(1)
 * Space Complexity: O(n)
 */
class MedianFinder2 {
private:
    vector<int> nums;
    
public:
    MedianFinder2() {}
    
    void addNum(int num) {
        if (nums.empty()) {
            nums.push_back(num);
        } else {
            // Binary search for insertion position
            auto it = lower_bound(nums.begin(), nums.end(), num);
            nums.insert(it, num);
        }
    }
    
    double findMedian() {
        int n = nums.size();
        if (n % 2 == 1) {
            return nums[n / 2];
        }
        return (nums[n / 2 - 1] + nums[n / 2]) / 2.0;
    }
};

/*
 * APPROACH 3: MULTISET (BALANCED BST)
 * 
 * Intuition:
 * - Use multiset (self-balancing BST)
 * - Maintain iterator to median position
 * - Update iterator on insertions
 * 
 * Algorithm:
 * addNum:
 * 1. Insert into multiset
 * 2. Adjust median iterator
 * 
 * findMedian:
 * 1. Use median iterator
 * 
 * Time Complexity:
 * - addNum: O(log n) - BST insertion
 * - findMedian: O(1) - iterator access
 * Space Complexity: O(n)
 */
class MedianFinder3 {
private:
    multiset<int> data;
    multiset<int>::iterator lo, hi;
    
public:
    MedianFinder3() : lo(data.end()), hi(data.end()) {}
    
    void addNum(int num) {
        int n = data.size();
        data.insert(num);
        
        if (n == 0) {
            lo = hi = data.begin();
        } else if (n % 2 == 1) {
            // Odd to even: median is average of two middle
            if (num < *lo) {
                lo--;
            } else {
                hi++;
            }
        } else {
            // Even to odd: median is single middle
            if (num >= *lo && num < *hi) {
                lo++;
                hi--;
            } else if (num >= *hi) {
                lo++;
            } else {
                lo = --hi;
            }
        }
    }
    
    double findMedian() {
        return (*lo + *hi) / 2.0;
    }
};

/*
 * APPROACH 4: TWO HEAPS WITH SIZE TRACKING
 * 
 * Intuition:
 * - Similar to Approach 1 but with explicit size tracking
 * - Clearer logic for balancing
 * - Better for understanding
 * 
 * Algorithm:
 * Same as Approach 1 but with size variables
 * 
 * Time Complexity:
 * - addNum: O(log n)
 * - findMedian: O(1)
 * Space Complexity: O(n)
 */
class MedianFinder4 {
private:
    priority_queue<int> maxHeap;
    priority_queue<int, vector<int>, greater<int>> minHeap;
    int maxHeapSize, minHeapSize;
    
public:
    MedianFinder4() : maxHeapSize(0), minHeapSize(0) {}
    
    void addNum(int num) {
        if (maxHeapSize == 0 || num <= maxHeap.top()) {
            maxHeap.push(num);
            maxHeapSize++;
        } else {
            minHeap.push(num);
            minHeapSize++;
        }
        
        // Balance heaps
        if (maxHeapSize > minHeapSize + 1) {
            minHeap.push(maxHeap.top());
            maxHeap.pop();
            maxHeapSize--;
            minHeapSize++;
        } else if (minHeapSize > maxHeapSize) {
            maxHeap.push(minHeap.top());
            minHeap.pop();
            minHeapSize--;
            maxHeapSize++;
        }
    }
    
    double findMedian() {
        if (maxHeapSize > minHeapSize) {
            return maxHeap.top();
        }
        return (maxHeap.top() + minHeap.top()) / 2.0;
    }
};

/*
 * APPROACH 5: INSERTION SORT APPROACH
 * 
 * Intuition:
 * - Keep array sorted by inserting at correct position
 * - Simple but less efficient
 * - Good for small datasets
 * 
 * Algorithm:
 * addNum:
 * 1. Find position using linear search
 * 2. Insert at position
 * 
 * findMedian:
 * 1. Return middle element(s)
 * 
 * Time Complexity:
 * - addNum: O(n) - linear search + insertion
 * - findMedian: O(1)
 * Space Complexity: O(n)
 */
class MedianFinder5 {
private:
    vector<int> nums;
    
public:
    MedianFinder5() {}
    
    void addNum(int num) {
        int pos = 0;
        while (pos < nums.size() && nums[pos] < num) {
            pos++;
        }
        nums.insert(nums.begin() + pos, num);
    }
    
    double findMedian() {
        int n = nums.size();
        if (n % 2 == 1) {
            return nums[n / 2];
        }
        return (nums[n / 2 - 1] + nums[n / 2]) / 2.0;
    }
};

// Test function
void testMedianFinder(int approach) {
    cout << "Testing Approach " << approach << ":\n";
    
    if (approach == 1) {
        MedianFinder1 mf;
        cout << "addNum(1)\n";
        mf.addNum(1);
        cout << "addNum(2)\n";
        mf.addNum(2);
        cout << "findMedian() = " << mf.findMedian() << " (expected: 1.5)\n";
        cout << "addNum(3)\n";
        mf.addNum(3);
        cout << "findMedian() = " << mf.findMedian() << " (expected: 2)\n";
    } else if (approach == 2) {
        MedianFinder2 mf;
        cout << "addNum(1)\n";
        mf.addNum(1);
        cout << "addNum(2)\n";
        mf.addNum(2);
        cout << "findMedian() = " << mf.findMedian() << " (expected: 1.5)\n";
        cout << "addNum(3)\n";
        mf.addNum(3);
        cout << "findMedian() = " << mf.findMedian() << " (expected: 2)\n";
    } else if (approach == 3) {
        MedianFinder3 mf;
        cout << "addNum(1)\n";
        mf.addNum(1);
        cout << "addNum(2)\n";
        mf.addNum(2);
        cout << "findMedian() = " << mf.findMedian() << " (expected: 1.5)\n";
        cout << "addNum(3)\n";
        mf.addNum(3);
        cout << "findMedian() = " << mf.findMedian() << " (expected: 2)\n";
    } else if (approach == 4) {
        MedianFinder4 mf;
        cout << "addNum(1)\n";
        mf.addNum(1);
        cout << "addNum(2)\n";
        mf.addNum(2);
        cout << "findMedian() = " << mf.findMedian() << " (expected: 1.5)\n";
        cout << "addNum(3)\n";
        mf.addNum(3);
        cout << "findMedian() = " << mf.findMedian() << " (expected: 2)\n";
    } else if (approach == 5) {
        MedianFinder5 mf;
        cout << "addNum(1)\n";
        mf.addNum(1);
        cout << "addNum(2)\n";
        mf.addNum(2);
        cout << "findMedian() = " << mf.findMedian() << " (expected: 1.5)\n";
        cout << "addNum(3)\n";
        mf.addNum(3);
        cout << "findMedian() = " << mf.findMedian() << " (expected: 2)\n";
    }
    cout << "\n";
}

int main() {
    // Test Case 1: Basic operations
    cout << "Test Case 1: Basic operations\n";
    for (int i = 1; i <= 5; i++) {
        testMedianFinder(i);
    }
    
    // Test Case 2: More complex sequence
    cout << "Test Case 2: Complex sequence\n";
    MedianFinder1 mf;
    vector<int> nums = {5, 15, 1, 3, 8, 7, 9, 10, 20, 12};
    
    for (int num : nums) {
        mf.addNum(num);
        cout << "After adding " << num << ", median = " << mf.findMedian() << "\n";
    }
    
    // Test Case 3: Negative numbers
    cout << "\nTest Case 3: Negative numbers\n";
    MedianFinder1 mf2;
    vector<int> nums2 = {-1, -2, -3, -4, -5};
    
    for (int num : nums2) {
        mf2.addNum(num);
        cout << "After adding " << num << ", median = " << mf2.findMedian() << "\n";
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (Two Heaps - OPTIMAL):
 * - addNum: O(log n) - heap operations
 * - findMedian: O(1) - peek at tops
 * - Space: O(n)
 * - Best for: Most efficient, industry standard
 * 
 * Approach 2 (Sorted Vector):
 * - addNum: O(n) - insertion in vector
 * - findMedian: O(1)
 * - Space: O(n)
 * - Best for: Simple implementation
 * 
 * Approach 3 (Multiset):
 * - addNum: O(log n) - BST insertion
 * - findMedian: O(1) - iterator access
 * - Space: O(n)
 * - Best for: C++ specific solution
 * 
 * Approach 4 (Two Heaps with Tracking):
 * - addNum: O(log n)
 * - findMedian: O(1)
 * - Space: O(n)
 * - Best for: Clearer logic
 * 
 * Approach 5 (Insertion Sort):
 * - addNum: O(n) - linear search
 * - findMedian: O(1)
 * - Space: O(n)
 * - Best for: Small datasets
 * 
 * INTERVIEW TIPS:
 * 1. Start with Approach 1 (two heaps)
 * 2. Explain heap balancing strategy
 * 3. Draw diagram showing heap states
 * 4. Mention max heap stores smaller half
 * 5. Discuss why we keep heaps balanced
 * 
 * COMMON MISTAKES:
 * 1. Using min heap for lower half (wrong!)
 * 2. Not balancing heaps properly
 * 3. Integer overflow when averaging (use double)
 * 4. Wrong median calculation for even size
 * 5. Not handling empty data structure
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. What if 99% of numbers are in [0,100]? (Use counting sort)
 * 2. Can you handle duplicates? (Yes, all approaches work)
 * 3. What if stream is infinite? (Two heaps still work)
 * 4. How to find kth percentile? (Adjust heap sizes)
 * 5. What if we need to remove numbers? (Use multiset)
 * 
 * RELATED PROBLEMS:
 * - Sliding Window Median
 * - Find K Pairs with Smallest Sums
 * - Kth Largest Element in Stream
 * - IPO (maximize capital)
 * - Meeting Rooms II
 * 
 * KEY INSIGHTS:
 * 1. Two heaps maintain sorted halves efficiently
 * 2. Max heap for lower half, min heap for upper half
 * 3. Keep heaps balanced (size diff <= 1)
 * 4. Median always at heap top(s)
 * 5. O(log n) insertion, O(1) median retrieval
 * 
 * HEAP BALANCING RULES:
 * 1. Max heap size = min heap size OR max heap size = min heap size + 1
 * 2. All elements in max heap <= all elements in min heap
 * 3. After each insertion, restore balance
 * 4. If odd total: median is max heap top
 * 5. If even total: median is average of both tops
 * 
 * WHY TWO HEAPS WORK:
 * - Max heap gives largest of smaller half in O(1)
 * - Min heap gives smallest of larger half in O(1)
 * - Together they give median in O(1)
 * - Insertion is O(log n) due to heap operations
 * - This is optimal for this problem
 */

// Made with Bob
