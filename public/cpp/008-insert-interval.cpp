/*
 * LeetCode Problem #57: Insert Interval
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/insert-interval/
 * 
 * Problem Statement:
 * You are given an array of non-overlapping intervals where intervals[i] = [starti, endi]
 * represent the start and the end of the ith interval and intervals is sorted in ascending
 * order by starti. You are also given an interval newInterval = [start, end] that represents
 * the start and end of another interval. Insert newInterval into intervals such that intervals
 * is still sorted in ascending order by starti and intervals still does not have any overlapping
 * intervals (merge overlapping intervals if necessary).
 */

#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

class Solution {
public:
    // ==================== APPROACH 1: Three-Part Merge ====================
    /*
     * Algorithm:
     * 1. Add all intervals that come before newInterval
     * 2. Merge all overlapping intervals with newInterval
     * 3. Add all intervals that come after newInterval
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     * 
     * When to use: This is the OPTIMAL solution
     * 
     * Key Insight:
     * - Since intervals are sorted, we can process in three phases
     * - Phase 1: intervals ending before newInterval starts
     * - Phase 2: intervals overlapping with newInterval (merge them)
     * - Phase 3: intervals starting after newInterval ends
     */
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        vector<vector<int>> result;
        int i = 0;
        int n = intervals.size();
        
        // Phase 1: Add all intervals ending before newInterval starts
        while (i < n && intervals[i][1] < newInterval[0]) {
            result.push_back(intervals[i]);
            i++;
        }
        
        // Phase 2: Merge all overlapping intervals
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = min(newInterval[0], intervals[i][0]);
            newInterval[1] = max(newInterval[1], intervals[i][1]);
            i++;
        }
        result.push_back(newInterval);
        
        // Phase 3: Add all remaining intervals
        while (i < n) {
            result.push_back(intervals[i]);
            i++;
        }
        
        return result;
    }
    
    // ==================== APPROACH 2: Binary Search + Merge ====================
    /*
     * Algorithm:
     * - Use binary search to find insertion position
     * - Merge overlapping intervals
     * 
     * Time Complexity: O(n) - still need to merge
     * Space Complexity: O(n)
     * 
     * When to use: When you want to optimize finding insertion point
     */
    vector<vector<int>> insert_BinarySearch(vector<vector<int>>& intervals, vector<int>& newInterval) {
        vector<vector<int>> result;
        
        // Find position to insert using binary search
        int left = 0, right = intervals.size();
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (intervals[mid][0] < newInterval[0]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        // Insert and merge
        intervals.insert(intervals.begin() + left, newInterval);
        
        result.push_back(intervals[0]);
        for (int i = 1; i < intervals.size(); i++) {
            if (intervals[i][0] <= result.back()[1]) {
                result.back()[1] = max(result.back()[1], intervals[i][1]);
            } else {
                result.push_back(intervals[i]);
            }
        }
        
        return result;
    }
};

// ==================== TEST CASES ====================
void printIntervals(const vector<vector<int>>& intervals) {
    cout << "[";
    for (int i = 0; i < intervals.size(); i++) {
        cout << "[" << intervals[i][0] << "," << intervals[i][1] << "]";
        if (i < intervals.size() - 1) cout << ",";
    }
    cout << "]" << endl;
}

void runTests() {
    Solution sol;
    
    // Test Case 1: Insert in middle with merge
    vector<vector<int>> intervals1 = {{1,3},{6,9}};
    vector<int> newInterval1 = {2,5};
    cout << "Test 1: ";
    printIntervals(sol.insert(intervals1, newInterval1));
    // Expected: [[1,5],[6,9]]
    
    // Test Case 2: Insert with multiple merges
    vector<vector<int>> intervals2 = {{1,2},{3,5},{6,7},{8,10},{12,16}};
    vector<int> newInterval2 = {4,8};
    cout << "Test 2: ";
    printIntervals(sol.insert(intervals2, newInterval2));
    // Expected: [[1,2],[3,10],[12,16]]
    
    // Test Case 3: Insert at beginning
    vector<vector<int>> intervals3 = {{3,5},{6,9}};
    vector<int> newInterval3 = {1,2};
    cout << "Test 3: ";
    printIntervals(sol.insert(intervals3, newInterval3));
    // Expected: [[1,2],[3,5],[6,9]]
    
    // Test Case 4: Insert at end
    vector<vector<int>> intervals4 = {{1,5}};
    vector<int> newInterval4 = {6,8};
    cout << "Test 4: ";
    printIntervals(sol.insert(intervals4, newInterval4));
    // Expected: [[1,5],[6,8]]
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. Three-Part Merge (RECOMMENDED):
 *    Time: O(n), Space: O(n)
 *    Clean, efficient, easy to understand
 * 
 * 2. Binary Search + Merge:
 *    Time: O(n), Space: O(n)
 *    Slightly more complex, same time complexity
 * 
 * INTERVIEW TIPS:
 * - Explain the three phases clearly
 * - Handle edge cases: empty intervals, insert at start/end
 * - Mention that intervals are already sorted
 * - Discuss overlap condition: intervals[i][0] <= newInterval[1]
 * 
 * KEY INSIGHTS:
 * - Sorted input allows single-pass solution
 * - Three distinct phases: before, merge, after
 * - Overlap condition determines merge phase
 * 
 * COMMON MISTAKES:
 * - Wrong overlap condition
 * - Forgetting to update newInterval during merge
 * - Not handling empty intervals array
 * 
 * FOLLOW-UP QUESTIONS:
 * - What if intervals are not sorted? (Sort first)
 * - Multiple new intervals to insert? (Insert one by one or sort together)
 * - Return number of intervals after merge? (Return result.size())
 */
