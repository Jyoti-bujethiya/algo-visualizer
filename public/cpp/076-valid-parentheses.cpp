/*
 * LeetCode Problem #20: Valid Parentheses
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/valid-parentheses/
 */

#include <string>
#include <stack>
#include <unordered_map>
using namespace std;

class Solution {
public:
    // ==================== APPROACH 1: Stack ====================
    /*
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     * EXPLAIN: Push opening brackets onto a stack; on closing bracket verify top matches.
     * WHEN: Default approach — clean, linear, handles all bracket types.
     */
    bool isValid_stack(string s) {
        stack<char> st;
        unordered_map<char,char> mapping = {{')', '('}, {']', '['}, {'}', '{'}};
        for (char ch : s) {
            if (mapping.count(ch)) {
                if (st.empty() || st.top() != mapping[ch]) return false;
                st.pop();
            } else {
                st.push(ch);
            }
        }
        return st.empty();
    }

    // ==================== APPROACH 2: Stack with Early Exit ====================
    /*
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     * EXPLAIN: Same stack idea but prune impossible cases early (odd length).
     * WHEN: Slight optimisation when inputs are often invalid.
     */
    bool isValid_early_exit(string s) {
        if (s.size() % 2 != 0) return false;
        stack<char> st;
        unordered_map<char,char> pairs = {{'(',')'}, {'[',']'}, {'{','}'}};
        for (char ch : s) {
            if (pairs.count(ch)) {
                st.push(pairs[ch]);
            } else {
                if (st.empty() || st.top() != ch) return false;
                st.pop();
            }
        }
        return st.empty();
    }

    bool isValid(string s) {
        return isValid_stack(s);
    }
};
