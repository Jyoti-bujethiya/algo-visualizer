/*
 * LeetCode Problem #56: Merge Intervals
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/merge-intervals/
 * 
 * Problem Statement:
 * Given an array of intervals where intervals[i] = [starti, endi], merge all
 * overlapping intervals, and return an array of the non-overlapping intervals
 * that cover all the intervals in the input.
 */

#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

class Solution {
public:
    // ==================== APPROACH 1: Brute Force ====================
    /*
     * Algorithm:
     * - Compare each interval with every other interval
     * - Merge if they overlap
     * - Repeat until no more merges possible
     * 
     * Time Complexity: O(n³) - nested loops with potential merges
     * Space Complexity: O(n) - result storage
     * 
     * When to use: Never (too inefficient)
     */
    vector<vector<int>> merge_BruteForce(vector<vector<int>>& intervals) {
        if (intervals.empty()) return {};
        
        vector<vector<int>> result = intervals;
        bool merged = true;
        
        while (merged) {
            merged = false;
            vector<vector<int>> temp;
            vector<bool> used(result.size(), false);
            
            for (int i = 0; i < result.size(); i++) {
                if (used[i]) continue;
                
                vector<int> current = result[i];
                used[i] = true;
                
                for (int j = i + 1; j < result.size(); j++) {
                    if (used[j]) continue;
                    
                    // Check if intervals overlap
                    if (current[1] >= result[j][0] && current[0] <= result[j][1]) {
                        current[0] = min(current[0], result[j][0]);
                        current[1] = max(current[1], result[j][1]);
                        used[j] = true;
                        merged = true;
                    }
                }
                temp.push_back(current);
            }
            result = temp;
        }
        
        return result;
    }
    
    // ==================== APPROACH 2: Sorting (Optimal) ====================
    /*
     * Algorithm:
     * 1. Sort intervals by start time
     * 2. Iterate through sorted intervals
     * 3. If current interval overlaps with last merged interval, merge them
     * 4. Otherwise, add current interval to result
     * 
     * Time Complexity: O(n log n) - dominated by sorting
     * Space Complexity: O(n) - result storage (or O(log n) for sorting)
     * 
     * When to use: This is the OPTIMAL solution
     * 
     * Key Insight:
     * - After sorting, we only need to check if current interval overlaps
     *   with the last interval in result
     * - Two intervals [a,b] and [c,d] overlap if: b >= c (when a <= c)
     * - Merged interval: [min(a,c), max(b,d)]
     */
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        if (intervals.empty()) return {};
        
        // Sort by start time
        sort(intervals.begin(), intervals.end());
        
        vector<vector<int>> result;
        result.push_back(intervals[0]);
        
        for (int i = 1; i < intervals.size(); i++) {
            // Get last interval in result
            vector<int>& last = result.back();
            vector<int>& current = intervals[i];
            
            // Check if current overlaps with last
            if (current[0] <= last[1]) {
                // Merge: extend the end time
                last[1] = max(last[1], current[1]);
            } else {
                // No overlap: add current interval
                result.push_back(current);
            }
        }
        
        return result;
    }
    
    // ==================== APPROACH 3: Sorting with Lambda ====================
    /*
     * Same as Approach 2 but with custom comparator
     * Useful when intervals are not in vector<vector<int>> format
     * 
     * Time Complexity: O(n log n)
     * Space Complexity: O(n)
     */
    vector<vector<int>> merge_CustomSort(vector<vector<int>>& intervals) {
        if (intervals.empty()) return {};
        
        // Sort with custom comparator
        sort(intervals.begin(), intervals.end(), 
             [](const vector<int>& a, const vector<int>& b) {
                 return a[0] < b[0];  // Sort by start time
             });
        
        vector<vector<int>> result;
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
    
    // ==================== APPROACH 4: Without Modifying Result ====================
    /*
     * Build result without modifying last element
     * More functional programming style
     * 
     * Time Complexity: O(n log n)
     * Space Complexity: O(n)
     */
    vector<vector<int>> merge_Functional(vector<vector<int>>& intervals) {
        if (intervals.empty()) return {};
        
        sort(intervals.begin(), intervals.end());
        
        vector<vector<int>> result;
        int start = intervals[0][0];
        int end = intervals[0][1];
        
        for (int i = 1; i < intervals.size(); i++) {
            if (intervals[i][0] <= end) {
                // Extend current interval
                end = max(end, intervals[i][1]);
            } else {
                // Save current interval and start new one
                result.push_back({start, end});
                start = intervals[i][0];
                end = intervals[i][1];
            }
        }
        
        // Don't forget the last interval
        result.push_back({start, end});
        
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
    
    // Test Case 1: Standard overlapping intervals
    vector<vector<int>> intervals1 = {{1,3},{2,6},{8,10},{15,18}};
    cout << "Test 1: ";
    printIntervals(sol.merge(intervals1));
    // Expected: [[1,6],[8,10],[15,18]]
    
    // Test Case 2: All intervals merge into one
    vector<vector<int>> intervals2 = {{1,4},{4,5}};
    cout << "Test 2: ";
    printIntervals(sol.merge(intervals2));
    // Expected: [[1,5]]
    
    // Test Case 3: No overlapping
    vector<vector<int>> intervals3 = {{1,2},{3,4},{5,6}};
    cout << "Test 3: ";
    printIntervals(sol.merge(intervals3));
    // Expected: [[1,2],[3,4],[5,6]]
    
    // Test Case 4: Complete overlap
    vector<vector<int>> intervals4 = {{1,10},{2,3},{4,5},{6,7}};
    cout << "Test 4: ";
    printIntervals(sol.merge(intervals4));
    // Expected: [[1,10]]
    
    // Test Case 5: Unsorted input
    vector<vector<int>> intervals5 = {{2,3},{4,5},{6,7},{8,9},{1,10}};
    cout << "Test 5: ";
    printIntervals(sol.merge(intervals5));
    // Expected: [[1,10]]
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. Brute Force:
 *    Time: O(n³), Space: O(n)
 *    Too slow, not acceptable
 * 
 * 2. Sorting (RECOMMENDED):
 *    Time: O(n log n), Space: O(n)
 *    Optimal and most intuitive
 * 
 * 3. Custom Sort:
 *    Time: O(n log n), Space: O(n)
 *    Same as #2, useful for custom data structures
 * 
 * 4. Functional Style:
 *    Time: O(n log n), Space: O(n)
 *    Cleaner code, avoids modifying result
 * 
 * INTERVIEW TIPS:
 * - Always sort intervals first by start time
 * - Explain overlap condition: current.start <= last.end
 * - Handle edge cases: empty array, single interval
 * - Mention that sorting modifies input (can copy if needed)
 * - Discuss why we only check with last interval in result
 * 
 * KEY INSIGHTS:
 * - Sorting enables greedy approach
 * - After sorting, only need to check adjacent intervals
 * - Overlap condition: intervals[i][0] <= result.back()[1]
 * - Merge by taking max of end times
 * 
 * OVERLAP CONDITIONS:
 * For sorted intervals [a,b] and [c,d] where a <= c:
 * - Overlap if: b >= c
 * - Merged interval: [a, max(b,d)]
 * 
 * VISUALIZATION for [[1,3],[2,6],[8,10],[15,18]]:
 * 
 * After sorting (already sorted):
 * [1,3] [2,6] [8,10] [15,18]
 * 
 * Step 1: result = [[1,3]]
 * Step 2: [2,6] overlaps with [1,3] (2 <= 3)
 *         Merge: [1, max(3,6)] = [1,6]
 *         result = [[1,6]]
 * Step 3: [8,10] doesn't overlap (8 > 6)
 *         result = [[1,6], [8,10]]
 * Step 4: [15,18] doesn't overlap (15 > 10)
 *         result = [[1,6], [8,10], [15,18]]
 * 
 * COMMON MISTAKES:
 * - Forgetting to sort intervals first
 * - Wrong overlap condition (using < instead of <=)
 * - Not handling edge cases (empty, single interval)
 * - Forgetting to add last interval in functional approach
 * - Comparing with all previous intervals instead of just last
 * 
 * FOLLOW-UP QUESTIONS:
 * - Insert a new interval? (Insert Interval - LeetCode #57)
 * - Find minimum meeting rooms? (Meeting Rooms II - LeetCode #253)
 * - Merge intervals from multiple sources? (Same approach)
 * - What if intervals are given as stream? (Use TreeMap/priority queue)
 * 
 * RELATED PROBLEMS:
 * - Insert Interval (LeetCode #57)
 * - Meeting Rooms (LeetCode #252)
 * - Meeting Rooms II (LeetCode #253)
 * - Non-overlapping Intervals (LeetCode #435)
 * - Minimum Number of Arrows to Burst Balloons (LeetCode #452)
 * 
 * TIME COMPLEXITY BREAKDOWN:
 * - Sorting: O(n log n)
 * - Merging: O(n) - single pass
 * - Total: O(n log n)
 * 
 * SPACE COMPLEXITY:
 * - Result array: O(n) worst case (no overlaps)
 * - Sorting: O(log n) to O(n) depending on algorithm
 * - Total: O(n)
 */

// Made with Bob
