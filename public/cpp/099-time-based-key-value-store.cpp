/*
 * Problem: Time Based Key-Value Store (LeetCode 981)
 * Link: https://leetcode.com/problems/time-based-key-value-store/
 * Difficulty: Medium
 * Category: Sorting and Searching
 * 
 * Description:
 * Design a time-based key-value data structure that can store multiple values
 * for the same key at different time stamps and retrieve the key's value at a
 * certain timestamp.
 * 
 * Implement the TimeMap class:
 * - TimeMap() Initializes the object
 * - void set(String key, String value, int timestamp) Stores the key with value at timestamp
 * - String get(String key, int timestamp) Returns a value such that set was called previously,
 *   with timestamp_prev <= timestamp. If there are multiple such values, return the one with
 *   the largest timestamp_prev. If there are no values, return "".
 * 
 * Example:
 * Input: ["TimeMap", "set", "get", "get", "set", "get", "get"]
 * [[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]]
 * Output: [null, null, "bar", "bar", null, "bar2", "bar2"]
 */

#include <iostream>
#include <unordered_map>
#include <vector>
#include <map>
#include <string>
using namespace std;

/*
 * APPROACH 1: HASH MAP + BINARY SEARCH (OPTIMAL)
 * Time: set O(1), get O(log n), Space: O(n)
 */
class TimeMap1 {
private:
    unordered_map<string, vector<pair<int, string>>> store;
    
public:
    TimeMap1() {}
    
    void set(string key, string value, int timestamp) {
        store[key].push_back({timestamp, value});
    }
    
    string get(string key, int timestamp) {
        if (store.find(key) == store.end()) return "";
        
        auto& values = store[key];
        int left = 0, right = values.size() - 1;
        string result = "";
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (values[mid].first <= timestamp) {
                result = values[mid].second;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return result;
    }
};

/*
 * APPROACH 2: HASH MAP + MAP (TREE MAP)
 * Time: set O(log n), get O(log n), Space: O(n)
 */
class TimeMap2 {
private:
    unordered_map<string, map<int, string>> store;
    
public:
    TimeMap2() {}
    
    void set(string key, string value, int timestamp) {
        store[key][timestamp] = value;
    }
    
    string get(string key, int timestamp) {
        if (store.find(key) == store.end()) return "";
        
        auto it = store[key].upper_bound(timestamp);
        if (it == store[key].begin()) return "";
        
        --it;
        return it->second;
    }
};

/*
 * APPROACH 3: HASH MAP + LINEAR SEARCH
 * Time: set O(1), get O(n), Space: O(n)
 */
class TimeMap3 {
private:
    unordered_map<string, vector<pair<int, string>>> store;
    
public:
    TimeMap3() {}
    
    void set(string key, string value, int timestamp) {
        store[key].push_back({timestamp, value});
    }
    
    string get(string key, int timestamp) {
        if (store.find(key) == store.end()) return "";
        
        string result = "";
        for (const auto& p : store[key]) {
            if (p.first <= timestamp) {
                result = p.second;
            } else {
                break;
            }
        }
        return result;
    }
};

/*
 * APPROACH 4: HASH MAP + STL LOWER_BOUND
 * Time: set O(1), get O(log n), Space: O(n)
 */
class TimeMap4 {
private:
    unordered_map<string, vector<pair<int, string>>> store;
    
public:
    TimeMap4() {}
    
    void set(string key, string value, int timestamp) {
        store[key].push_back({timestamp, value});
    }
    
    string get(string key, int timestamp) {
        if (store.find(key) == store.end()) return "";
        
        auto& values = store[key];
        auto it = upper_bound(values.begin(), values.end(), 
                             make_pair(timestamp, string("")),
                             [](const pair<int,string>& a, const pair<int,string>& b) {
                                 return a.first < b.first;
                             });
        
        if (it == values.begin()) return "";
        --it;
        return it->second;
    }
};

/*
 * APPROACH 5: NESTED HASH MAPS
 * Time: set O(1), get O(n), Space: O(n)
 */
class TimeMap5 {
private:
    unordered_map<string, unordered_map<int, string>> store;
    unordered_map<string, vector<int>> timestamps;
    
public:
    TimeMap5() {}
    
    void set(string key, string value, int timestamp) {
        store[key][timestamp] = value;
        timestamps[key].push_back(timestamp);
    }
    
    string get(string key, int timestamp) {
        if (store.find(key) == store.end()) return "";
        
        int bestTime = -1;
        for (int t : timestamps[key]) {
            if (t <= timestamp && t > bestTime) {
                bestTime = t;
            }
        }
        
        return bestTime == -1 ? "" : store[key][bestTime];
    }
};

void testTimeMap(int approach) {
    cout << "Approach " << approach << ":\n";
    
    if (approach == 1) {
        TimeMap1 tm;
        tm.set("foo", "bar", 1);
        cout << tm.get("foo", 1) << "\n";
        cout << tm.get("foo", 3) << "\n";
        tm.set("foo", "bar2", 4);
        cout << tm.get("foo", 4) << "\n";
        cout << tm.get("foo", 5) << "\n";
    } else if (approach == 2) {
        TimeMap2 tm;
        tm.set("foo", "bar", 1);
        cout << tm.get("foo", 1) << "\n";
        cout << tm.get("foo", 3) << "\n";
        tm.set("foo", "bar2", 4);
        cout << tm.get("foo", 4) << "\n";
        cout << tm.get("foo", 5) << "\n";
    } else if (approach == 3) {
        TimeMap3 tm;
        tm.set("foo", "bar", 1);
        cout << tm.get("foo", 1) << "\n";
        cout << tm.get("foo", 3) << "\n";
        tm.set("foo", "bar2", 4);
        cout << tm.get("foo", 4) << "\n";
        cout << tm.get("foo", 5) << "\n";
    } else if (approach == 4) {
        TimeMap4 tm;
        tm.set("foo", "bar", 1);
        cout << tm.get("foo", 1) << "\n";
        cout << tm.get("foo", 3) << "\n";
        tm.set("foo", "bar2", 4);
        cout << tm.get("foo", 4) << "\n";
        cout << tm.get("foo", 5) << "\n";
    } else {
        TimeMap5 tm;
        tm.set("foo", "bar", 1);
        cout << tm.get("foo", 1) << "\n";
        cout << tm.get("foo", 3) << "\n";
        tm.set("foo", "bar2", 4);
        cout << tm.get("foo", 4) << "\n";
        cout << tm.get("foo", 5) << "\n";
    }
    cout << "\n";
}

int main() {
    for (int i = 1; i <= 5; i++) {
        testTimeMap(i);
    }
    return 0;
}

// Made with Bob
