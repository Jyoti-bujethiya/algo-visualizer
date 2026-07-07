/*
 * Problem: Regular Expression Matching (LeetCode 10)
 * Link: https://leetcode.com/problems/regular-expression-matching/
 * Difficulty: Hard
 * Category: Dynamic Programming
 *
 * Description:
 * Given an input string s and a pattern p, implement regular expression matching
 * with support for '.' and '*' where:
 * - '.' matches any single character.
 * - '*' matches zero or more of the preceding element.
 * The matching should cover the entire input string (not partial).
 *
 * Example 1: s="aa", p="a*"  → true  ('a*' matches "aa")
 * Example 2: s="ab", p=".*"  → true  ('.*' matches "ab")
 * Example 3: s="aa", p="a"   → false
 * Example 4: s="aab",p="c*a*b" → true
 *
 * Constraints:
 * - 1 <= s.length <= 20
 * - 1 <= p.length <= 30
 * - s contains only lowercase letters
 * - p contains only lowercase letters, '.', and '*'
 * - '*' never appears without a valid preceding element
 */

#include <vector>
#include <string>
#include <iostream>
using namespace std;

/*
 * APPROACH 1: 2D DP (Bottom-Up)
 *
 * dp[i][j] = does s[0..i-1] match p[0..j-1]?
 *
 * Recurrence:
 *   if p[j-1] == s[i-1] or p[j-1] == '.':
 *     dp[i][j] = dp[i-1][j-1]
 *   elif p[j-1] == '*':
 *     dp[i][j] = dp[i][j-2]              // use '*' as zero occurrences
 *             || (p[j-2] matches s[i-1]   // use '*' as one-more occurrence
 *                && dp[i-1][j])
 *
 * Time:  O(m * n)  where m=|s|, n=|p|
 * Space: O(m * n)
 */
class Solution1 {
public:
    bool isMatch(string s, string p) {
        int m = s.size(), n = p.size();
        vector<vector<bool>> dp(m+1, vector<bool>(n+1, false));
        dp[0][0] = true;
        // Handle patterns like a*, a*b*, a*b*c* that can match empty string
        for (int j = 2; j <= n; j++)
            if (p[j-1] == '*') dp[0][j] = dp[0][j-2];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (p[j-1] == '*') {
                    dp[i][j] = dp[i][j-2]; // zero occurrences
                    if (p[j-2] == s[i-1] || p[j-2] == '.')
                        dp[i][j] = dp[i][j] || dp[i-1][j]; // one more
                } else if (p[j-1] == s[i-1] || p[j-1] == '.') {
                    dp[i][j] = dp[i-1][j-1];
                }
            }
        }
        return dp[m][n];
    }
};

/*
 * APPROACH 2: Space-Optimised DP (1D rolling array)
 *
 * Only need previous row → use two 1D arrays.
 *
 * Time:  O(m * n)
 * Space: O(n)
 */
class Solution2 {
public:
    bool isMatch(string s, string p) {
        int m = s.size(), n = p.size();
        vector<bool> prev(n+1, false), curr(n+1, false);
        prev[0] = true;
        for (int j = 2; j <= n; j++)
            if (p[j-1] == '*') prev[j] = prev[j-2];
        for (int i = 1; i <= m; i++) {
            fill(curr.begin(), curr.end(), false);
            curr[0] = false;
            for (int j = 1; j <= n; j++) {
                if (p[j-1] == '*') {
                    curr[j] = (j >= 2) ? curr[j-2] : false;
                    if (p[j-2] == s[i-1] || p[j-2] == '.')
                        curr[j] = curr[j] || prev[j];
                } else if (p[j-1] == s[i-1] || p[j-1] == '.') {
                    curr[j] = prev[j-1];
                }
            }
            swap(prev, curr);
        }
        return prev[n];
    }
};

/*
 * APPROACH 3: Memoization (Top-Down)
 *
 * Recursively match s[i..] against p[j..], cache results.
 *
 * Time:  O(m * n)
 * Space: O(m * n) + stack
 */
class Solution3 {
    vector<vector<int>> memo;
    bool helper(const string& s, const string& p, int i, int j) {
        if (j == (int)p.size()) return i == (int)s.size();
        if (memo[i][j] != -1) return memo[i][j];
        bool firstMatch = (i < (int)s.size() && (p[j] == s[i] || p[j] == '.'));
        bool res;
        if (j+1 < (int)p.size() && p[j+1] == '*') {
            res = helper(s, p, i, j+2) ||           // skip x*
                  (firstMatch && helper(s, p, i+1, j)); // consume one
        } else {
            res = firstMatch && helper(s, p, i+1, j+1);
        }
        return memo[i][j] = res;
    }
public:
    bool isMatch(string s, string p) {
        memo.assign(s.size()+1, vector<int>(p.size()+1, -1));
        return helper(s, p, 0, 0);
    }
};

/*
 * APPROACH 4: Pure Recursion (for understanding)
 *
 * Same as Approach 3 but without caching.
 * Exponential time — fine only for short strings.
 *
 * Time:  O(2^(m+n)) worst case
 * Space: O(m+n) recursion stack
 */
class Solution4 {
    bool helper(const string& s, const string& p, int i, int j) {
        if (j == (int)p.size()) return i == (int)s.size();
        bool firstMatch = (i < (int)s.size() && (p[j] == s[i] || p[j] == '.'));
        if (j+1 < (int)p.size() && p[j+1] == '*') {
            return helper(s, p, i, j+2) ||
                   (firstMatch && helper(s, p, i+1, j));
        }
        return firstMatch && helper(s, p, i+1, j+1);
    }
public:
    bool isMatch(string s, string p) { return helper(s, p, 0, 0); }
};

void test(string s, string p, int approach) {
    bool result;
    cout << "s=\"" << s << "\" p=\"" << p << "\" ";
    switch(approach) {
        case 1: { Solution1 sol; result = sol.isMatch(s,p); cout<<"2D-DP:  "; break; }
        case 2: { Solution2 sol; result = sol.isMatch(s,p); cout<<"1D-DP:  "; break; }
        case 3: { Solution3 sol; result = sol.isMatch(s,p); cout<<"Memo:   "; break; }
        case 4: { Solution4 sol; result = sol.isMatch(s,p); cout<<"Recur:  "; break; }
    }
    cout << (result ? "true" : "false") << "\n";
}

int main() {
    for(int i=1;i<=4;i++) test("aa","a",i);
    for(int i=1;i<=4;i++) test("aa","a*",i);
    for(int i=1;i<=4;i++) test("ab",".*",i);
    for(int i=1;i<=4;i++) test("aab","c*a*b",i);
    for(int i=1;i<=4;i++) test("mississippi","mis*is*p*.",i);
    return 0;
}

/*
 * COMPLEXITY SUMMARY:
 * Approach 1 (2D DP):    Time O(m*n)    Space O(m*n)
 * Approach 2 (1D DP):    Time O(m*n)    Space O(n)
 * Approach 3 (Memo):     Time O(m*n)    Space O(m*n)+stack
 * Approach 4 (Recursion):Time O(2^(m+n)) Space O(m+n)
 */

// Made with Bob
