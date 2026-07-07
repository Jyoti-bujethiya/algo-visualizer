/*
 * Problem: Meeting Rooms (LeetCode 252)
 * Link: https://leetcode.com/problems/meeting-rooms/
 * Difficulty: Easy
 * Category: Sorting and Searching
 * 
 * Description:
 * Given an array of meeting time intervals where intervals[i] = [starti, endi],
 * determine if a person could attend all meetings.
 * 
 * Example 1:
 * Input: intervals = [[0,30],[5,10],[15,20]]
 * Output: false
 * 
 * Example 2:
 * Input: intervals = [[7,10],[2,4]]
 * Output: true
 */

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/*
 * APPROACH 1: SORT BY START TIME (OPTIMAL)
 * Time: O(n log n), Space: O(1)
 */
class Solution1 {
public:
    bool canAttendMeetings(vector<vector<int>>& intervals) {
        if (intervals.empty()) return true;
        
        sort(intervals.begin(), intervals.end());
        
        for (int i = 1; i < intervals.size(); i++) {
            if (intervals[i][0] < intervals[i-1][1]) {
                return false;
            }
        }
        return true;
    }
};

/*
 * APPROACH 2: SORT WITH CUSTOM COMPARATOR
 * Time: O(n log n), Space: O(1)
 */
class Solution2 {
public:
    bool canAttendMeetings(vector<vector<int>>& intervals) {
        if (intervals.empty()) return true;
        
        sort(intervals.begin(), intervals.end(), 
             [](const vector<int>& a, const vector<int>& b) {
                 return a[0] < b[0];
             });
        
        for (int i = 1; i < intervals.size(); i++) {
            if (intervals[i][0] < intervals[i-1][1]) {
                return false;
            }
        }
        return true;
    }
};

/*
 * APPROACH 3: BRUTE FORCE CHECK ALL PAIRS
 * Time: O(n²), Space: O(1)
 */
class Solution3 {
public:
    bool canAttendMeetings(vector<vector<int>>& intervals) {
        for (int i = 0; i < intervals.size(); i++) {
            for (int j = i + 1; j < intervals.size(); j++) {
                if (!(intervals[i][1] <= intervals[j][0] || 
                      intervals[j][1] <= intervals[i][0])) {
                    return false;
                }
            }
        }
        return true;
    }
};

/*
 * APPROACH 4: SEPARATE START AND END ARRAYS
 * Time: O(n log n), Space: O(n)
 */
class Solution4 {
public:
    bool canAttendMeetings(vector<vector<int>>& intervals) {
        if (intervals.empty()) return true;
        
        vector<int> starts, ends;
        for (const auto& interval : intervals) {
            starts.push_back(interval[0]);
            ends.push_back(interval[1]);
        }
        
        sort(starts.begin(), starts.end());
        sort(ends.begin(), ends.end());
        
        for (int i = 1; i < starts.size(); i++) {
            if (starts[i] < ends[i-1]) {
                return false;
            }
        }
        return true;
    }
};

/*
 * APPROACH 5: SORT AND CHECK WITH MAX END
 * Time: O(n log n), Space: O(1)
 */
class Solution5 {
public:
    bool canAttendMeetings(vector<vector<int>>& intervals) {
        if (intervals.empty()) return true;
        
        sort(intervals.begin(), intervals.end());
        
        int maxEnd = intervals[0][1];
        for (int i = 1; i < intervals.size(); i++) {
            if (intervals[i][0] < maxEnd) {
                return false;
            }
            maxEnd = max(maxEnd, intervals[i][1]);
        }
        return true;
    }
};

void test(vector<vector<int>> intervals, int approach) {
    bool result;
    
    cout << "Input: [";
    for (int i = 0; i < intervals.size(); i++) {
        cout << "[" << intervals[i][0] << "," << intervals[i][1] << "]";
        if (i < intervals.size() - 1) cout << ",";
    }
    cout << "] -> ";
    
    switch(approach) {
        case 1: { Solution1 sol; result = sol.canAttendMeetings(intervals); break; }
        case 2: { Solution2 sol; result = sol.canAttendMeetings(intervals); break; }
        case 3: { Solution3 sol; result = sol.canAttendMeetings(intervals); break; }
        case 4: { Solution4 sol; result = sol.canAttendMeetings(intervals); break; }
        case 5: { Solution5 sol; result = sol.canAttendMeetings(intervals); break; }
    }
    cout << (result ? "true" : "false") << "\n";
}

int main() {
    vector<vector<int>> test1 = {{0,30},{5,10},{15,20}};
    vector<vector<int>> test2 = {{7,10},{2,4}};
    
    for (int i = 1; i <= 5; i++) {
        cout << "Approach " << i << ":\n";
        test(test1, i);
        test(test2, i);
        cout << "\n";
    }
    return 0;
}

// Made with Bob
