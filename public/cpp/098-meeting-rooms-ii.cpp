/*
 * Problem: Meeting Rooms II (LeetCode 253)
 * Link: https://leetcode.com/problems/meeting-rooms-ii/
 * Difficulty: Medium
 * Category: Sorting and Searching
 * 
 * Description:
 * Given an array of meeting time intervals where intervals[i] = [starti, endi],
 * return the minimum number of conference rooms required.
 * 
 * Example 1:
 * Input: intervals = [[0,30],[5,10],[15,20]]
 * Output: 2
 * 
 * Example 2:
 * Input: intervals = [[7,10],[2,4]]
 * Output: 1
 */

#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

/*
 * APPROACH 1: MIN HEAP (OPTIMAL)
 * Time: O(n log n), Space: O(n)
 */
class Solution1 {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;
        
        sort(intervals.begin(), intervals.end());
        
        priority_queue<int, vector<int>, greater<int>> minHeap;
        minHeap.push(intervals[0][1]);
        
        for (int i = 1; i < intervals.size(); i++) {
            if (intervals[i][0] >= minHeap.top()) {
                minHeap.pop();
            }
            minHeap.push(intervals[i][1]);
        }
        
        return minHeap.size();
    }
};

/*
 * APPROACH 2: CHRONOLOGICAL ORDERING
 * Time: O(n log n), Space: O(n)
 */
class Solution2 {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        vector<int> starts, ends;
        
        for (const auto& interval : intervals) {
            starts.push_back(interval[0]);
            ends.push_back(interval[1]);
        }
        
        sort(starts.begin(), starts.end());
        sort(ends.begin(), ends.end());
        
        int rooms = 0, maxRooms = 0;
        int startPtr = 0, endPtr = 0;
        
        while (startPtr < starts.size()) {
            if (starts[startPtr] < ends[endPtr]) {
                rooms++;
                maxRooms = max(maxRooms, rooms);
                startPtr++;
            } else {
                rooms--;
                endPtr++;
            }
        }
        
        return maxRooms;
    }
};

/*
 * APPROACH 3: SWEEP LINE ALGORITHM
 * Time: O(n log n), Space: O(n)
 */
class Solution3 {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        vector<pair<int, int>> events;
        
        for (const auto& interval : intervals) {
            events.push_back({interval[0], 1});  // start
            events.push_back({interval[1], -1}); // end
        }
        
        sort(events.begin(), events.end(), [](const pair<int,int>& a, const pair<int,int>& b) {
            if (a.first == b.first) return a.second < b.second;
            return a.first < b.first;
        });
        
        int rooms = 0, maxRooms = 0;
        for (const auto& event : events) {
            rooms += event.second;
            maxRooms = max(maxRooms, rooms);
        }
        
        return maxRooms;
    }
};

/*
 * APPROACH 4: MULTISET FOR END TIMES
 * Time: O(n log n), Space: O(n)
 */
class Solution4 {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;
        
        sort(intervals.begin(), intervals.end());
        
        multiset<int> endTimes;
        endTimes.insert(intervals[0][1]);
        
        for (int i = 1; i < intervals.size(); i++) {
            auto it = endTimes.upper_bound(intervals[i][0]);
            if (it != endTimes.begin()) {
                --it;
                endTimes.erase(it);
            }
            endTimes.insert(intervals[i][1]);
        }
        
        return endTimes.size();
    }
};

/*
 * APPROACH 5: PRIORITY QUEUE WITH PAIR
 * Time: O(n log n), Space: O(n)
 */
class Solution5 {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;
        
        sort(intervals.begin(), intervals.end());
        
        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
        
        int maxRooms = 0;
        for (const auto& interval : intervals) {
            while (!pq.empty() && pq.top().first <= interval[0]) {
                pq.pop();
            }
            pq.push({interval[1], interval[0]});
            maxRooms = max(maxRooms, (int)pq.size());
        }
        
        return maxRooms;
    }
};

void test(vector<vector<int>> intervals, int approach) {
    int result;
    
    cout << "Input: [";
    for (int i = 0; i < intervals.size(); i++) {
        cout << "[" << intervals[i][0] << "," << intervals[i][1] << "]";
        if (i < intervals.size() - 1) cout << ",";
    }
    cout << "] -> ";
    
    switch(approach) {
        case 1: { Solution1 sol; result = sol.minMeetingRooms(intervals); break; }
        case 2: { Solution2 sol; result = sol.minMeetingRooms(intervals); break; }
        case 3: { Solution3 sol; result = sol.minMeetingRooms(intervals); break; }
        case 4: { Solution4 sol; result = sol.minMeetingRooms(intervals); break; }
        case 5: { Solution5 sol; result = sol.minMeetingRooms(intervals); break; }
    }
    cout << result << "\n";
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
