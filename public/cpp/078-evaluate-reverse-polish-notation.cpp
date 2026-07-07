/*
 * LeetCode Problem #150: Evaluate Reverse Polish Notation
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/evaluate-reverse-polish-notation/
 */

#include <vector>
#include <string>
#include <stack>
#include <unordered_set>
using namespace std;

class Solution {
public:
    // ==================== APPROACH 1: Stack-Based Evaluation ====================
    /*
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     * EXPLAIN: Push numbers; on operator pop two operands, compute, push result.
     * WHEN: Classic stack application — standard interview answer.
     */
    int evalRPN_stack(vector<string>& tokens) {
        stack<long long> st;
        for (const string& token : tokens) {
            if (token == "+" || token == "-" || token == "*" || token == "/") {
                long long b = st.top(); st.pop();
                long long a = st.top(); st.pop();
                if      (token == "+") st.push(a + b);
                else if (token == "-") st.push(a - b);
                else if (token == "*") st.push(a * b);
                else                  st.push((long long)(a / b));
            } else {
                st.push(stoll(token));
            }
        }
        return (int)st.top();
    }

    // ==================== APPROACH 2: Stack with Lambda Map ====================
    /*
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     * EXPLAIN: Use a map of operator → lambda to simplify the conditional evaluation.
     * WHEN: More concise; shows use of function objects.
     */
    int evalRPN_lambda(vector<string>& tokens) {
        unordered_map<string, function<long long(long long,long long)>> ops = {
            {"+", [](long long a, long long b){ return a + b; }},
            {"-", [](long long a, long long b){ return a - b; }},
            {"*", [](long long a, long long b){ return a * b; }},
            {"/", [](long long a, long long b){ return (long long)(a / b); }},
        };
        stack<long long> st;
        for (const string& token : tokens) {
            if (ops.count(token)) {
                long long b = st.top(); st.pop();
                long long a = st.top(); st.pop();
                st.push(ops[token](a, b));
            } else {
                st.push(stoll(token));
            }
        }
        return (int)st.top();
    }

    int evalRPN(vector<string>& tokens) {
        return evalRPN_stack(tokens);
    }
};
