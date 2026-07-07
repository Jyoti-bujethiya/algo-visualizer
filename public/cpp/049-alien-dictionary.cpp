/*
 * LeetCode Problem #269: Alien Dictionary
 * Difficulty: Hard
 * Link: https://leetcode.com/problems/alien-dictionary/
 *
 * Problem Statement:
 * There is a new alien language that uses the English alphabet. The order of letters
 * is unknown to you. You are given a list of strings words from the alien language's
 * dictionary, where the strings in words are sorted lexicographically by the rules
 * of this new language.
 *
 * Return a string of the unique letters in the new language sorted by the rules,
 * or "" if the order cannot be determined, or "" if there is a contradiction.
 *
 * Example 1:
 *   Input: words = ["wrt","wrf","er","ett","rftt"]
 *   Output: "wertf"
 *
 * Example 2:
 *   Input: words = ["z","x"]
 *   Output: "zx"
 *
 * Example 3:
 *   Input: words = ["z","x","z"]
 *   Output: "" (contradiction — cycle)
 *
 * Constraints:
 *   - 1 <= words.length <= 100
 *   - 1 <= words[i].length <= 100
 *   - words[i] consists of lowercase English letters
 */

#include <vector>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <queue>
#include <iostream>
using namespace std;

// ==================== APPROACH 1: Topological Sort via BFS (Kahn's Algorithm) ====================
// 1. Build directed graph from adjacent word comparisons.
// 2. Run Kahn's BFS topological sort.
// Time: O(C) where C = total characters across all words  Space: O(1) (26 chars at most)
class Solution1 {
public:
    string alienOrder(vector<string>& words) {
        // Collect all unique characters
        unordered_map<char,int> indegree;
        unordered_map<char,unordered_set<char>> adj;
        for (auto& w : words) for (char c : w) if (!indegree.count(c)) indegree[c] = 0;

        // Build edges
        for (int i = 0; i+1 < (int)words.size(); i++) {
            string& a = words[i], &b = words[i+1];
            int len = min(a.size(), b.size());
            // Prefix longer word = invalid
            if (a.size() > b.size() && a.substr(0, len) == b.substr(0, len)) return "";
            for (int j = 0; j < (int)len; j++) {
                if (a[j] != b[j]) {
                    if (!adj[a[j]].count(b[j])) { adj[a[j]].insert(b[j]); indegree[b[j]]++; }
                    break;
                }
            }
        }

        // BFS topological sort
        queue<char> q;
        for (auto& [c, d] : indegree) if (d == 0) q.push(c);
        string result;
        while (!q.empty()) {
            char c = q.front(); q.pop();
            result += c;
            for (char nb : adj[c]) if (--indegree[nb] == 0) q.push(nb);
        }
        return result.size() == indegree.size() ? result : "";
    }
};

// ==================== APPROACH 2: Topological Sort via DFS (Cycle Detection) ====================
// DFS post-order gives reverse topological order; detect cycles with coloring.
// Time: O(C)  Space: O(1)
class Solution2 {
    unordered_map<char, vector<char>> adj;
    unordered_map<char, int> color; // 0=unvisited,1=visiting,2=done
    string order;
    bool hasCycle;

    void dfs(char c) {
        if (hasCycle) return;
        color[c] = 1;
        for (char nb : adj[c]) {
            if (color[nb] == 1) { hasCycle = true; return; }
            if (color[nb] == 0) dfs(nb);
        }
        color[c] = 2;
        order += c;
    }
public:
    string alienOrder(vector<string>& words) {
        unordered_set<char> chars;
        for (auto& w : words) for (char c : w) { chars.insert(c); color[c] = 0; }

        for (int i = 0; i+1 < (int)words.size(); i++) {
            string& a = words[i], &b = words[i+1];
            int len = min(a.size(), b.size());
            if (a.size() > b.size() && a.substr(0,len) == b.substr(0,len)) return "";
            for (int j = 0; j < (int)len; j++) {
                if (a[j] != b[j]) { adj[a[j]].push_back(b[j]); break; }
            }
        }

        hasCycle = false;
        for (char c : chars) if (color[c] == 0) dfs(c);
        if (hasCycle) return "";
        reverse(order.begin(), order.end());
        return order;
    }
};

// ==================== APPROACH 3: BFS with explicit set (cleaner) ====================
// Same as Approach 1 but uses set instead of unordered_set for deterministic order.
class Solution3 {
public:
    string alienOrder(vector<string>& words) {
        unordered_map<char,int> indegree;
        unordered_map<char,vector<char>> adj;
        for (auto& w : words) for (char c : w) if (!indegree.count(c)) indegree[c] = 0;
        for (int i = 0; i+1 < (int)words.size(); i++) {
            auto& a = words[i]; auto& b = words[i+1];
            int len = min(a.size(), b.size());
            if (a.size() > b.size() && a.substr(0,len)==b.substr(0,len)) return "";
            for (int j = 0; j < (int)len; j++) {
                if (a[j] != b[j]) { adj[a[j]].push_back(b[j]); indegree[b[j]]++; break; }
            }
        }
        queue<char> q;
        for (auto& [c,d] : indegree) if (d==0) q.push(c);
        string res;
        while (!q.empty()) {
            char c = q.front(); q.pop(); res += c;
            for (char nb : adj[c]) if (--indegree[nb]==0) q.push(nb);
        }
        return res.size()==indegree.size() ? res : "";
    }
};

void runTests() {
    Solution1 sol;
    vector<string> w1 = {"wrt","wrf","er","ett","rftt"};
    cout << "Test 1: \"" << sol.alienOrder(w1) << "\" (expected \"wertf\")\n";
    vector<string> w2 = {"z","x"};
    cout << "Test 2: \"" << sol.alienOrder(w2) << "\" (expected \"zx\")\n";
    vector<string> w3 = {"z","x","z"};
    cout << "Test 3: \"" << sol.alienOrder(w3) << "\" (expected \"\")\n";
}

int main() { runTests(); return 0; }

// Made with Bob
