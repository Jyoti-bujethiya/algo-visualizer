/*
 * LeetCode Problem #5: Longest Palindromic Substring
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/longest-palindromic-substring/
 *
 * Problem Statement:
 * Given a string s, return the longest palindromic substring in s.
 * A palindrome reads the same forwards and backwards.
 *
 * Example 1:
 * Input: s = "babad"
 * Output: "bab"  (or "aba" — both are valid)
 *
 * Example 2:
 * Input: s = "cbbd"
 * Output: "bb"
 */

#include <string>
#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

/*
 * APPROACH 1: BRUTE FORCE
 * Time: O(n³), Space: O(1)
 * Try every substring and check if it's a palindrome.
 */
class Solution1 {
    bool isPalin(const string& s, int l, int r) {
        while (l < r) { if (s[l++] != s[r--]) return false; }
        return true;
    }
public:
    string longestPalindrome(string s) {
        int n = s.size(), bestL = 0, bestLen = 1;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                if (j - i + 1 > bestLen && isPalin(s, i, j))
                    { bestL = i; bestLen = j - i + 1; }
        return s.substr(bestL, bestLen);
    }
};

/*
 * APPROACH 2: EXPAND AROUND CENTER (Optimal for interviews)
 * Time: O(n²), Space: O(1)
 *
 * Key Insight:
 * Every palindrome has a center (single char or pair).
 * Expand outward from each of the 2n-1 centers.
 */
class Solution2 {
    int expand(const string& s, int l, int r) {
        while (l >= 0 && r < (int)s.size() && s[l] == s[r]) { l--; r++; }
        return r - l - 1;   // length
    }
public:
    string longestPalindrome(string s) {
        int n = s.size(), start = 0, maxLen = 1;
        for (int i = 0; i < n; i++) {
            int odd  = expand(s, i, i);       // odd-length center
            int even = expand(s, i, i + 1);   // even-length center
            int best = max(odd, even);
            if (best > maxLen) {
                maxLen = best;
                start  = i - (best - 1) / 2;
            }
        }
        return s.substr(start, maxLen);
    }
};

/*
 * APPROACH 3: DYNAMIC PROGRAMMING
 * Time: O(n²), Space: O(n²)
 *
 * dp[i][j] = true  iff  s[i..j] is a palindrome.
 * Base:      dp[i][i] = true,  dp[i][i+1] = (s[i]==s[i+1]).
 * Recurrence: dp[i][j] = (s[i]==s[j]) && dp[i+1][j-1].
 */
class Solution3 {
public:
    string longestPalindrome(string s) {
        int n = s.size(), start = 0, maxLen = 1;
        vector<vector<bool>> dp(n, vector<bool>(n, false));

        // All substrings of length 1 are palindromes
        for (int i = 0; i < n; i++) dp[i][i] = true;

        // Length 2
        for (int i = 0; i < n - 1; i++)
            if (s[i] == s[i+1]) { dp[i][i+1] = true; start = i; maxLen = 2; }

        // Length 3 and above
        for (int len = 3; len <= n; len++)
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                if (s[i] == s[j] && dp[i+1][j-1]) {
                    dp[i][j] = true;
                    if (len > maxLen) { start = i; maxLen = len; }
                }
            }
        return s.substr(start, maxLen);
    }
};

/*
 * APPROACH 4: MANACHER'S ALGORITHM (Linear)
 * Time: O(n), Space: O(n)
 *
 * Transform s into "^#a#b#a#$" to handle even/odd uniformly.
 * p[i] = radius of palindrome centered at i in the transformed string.
 * Reuse already-computed palindrome info via the "mirror" property.
 */
class Solution4 {
public:
    string longestPalindrome(string s) {
        // Transform: "abc" → "^#a#b#c#$"
        string t = "^#";
        for (char c : s) { t += c; t += '#'; }
        t += '$';
        int n = t.size();
        vector<int> p(n, 0);
        int C = 0, R = 0;   // center and right boundary of rightmost palindrome

        for (int i = 1; i < n - 1; i++) {
            int mirror = 2 * C - i;
            if (i < R) p[i] = min(R - i, p[mirror]);
            // Expand
            while (t[i + p[i] + 1] == t[i - p[i] - 1]) p[i]++;
            // Update center
            if (i + p[i] > R) { C = i; R = i + p[i]; }
        }

        // Find max
        int maxLen = 0, center = 0;
        for (int i = 1; i < n - 1; i++)
            if (p[i] > maxLen) { maxLen = p[i]; center = i; }

        int start = (center - maxLen) / 2;
        return s.substr(start, maxLen);
    }
};

/*
 * APPROACH 5: DP WITH SPACE OPTIMISATION (1-D rolling)
 * Time: O(n²), Space: O(n)
 *
 * We only need the previous diagonal row of the DP table,
 * so we can reduce space from O(n²) to O(n).
 */
class Solution5 {
public:
    string longestPalindrome(string s) {
        int n = s.size(), start = 0, maxLen = 1;
        // prev[j] = dp[i+1][j] from previous iteration
        vector<bool> prev(n, false), cur(n, false);

        for (int i = n - 1; i >= 0; i--) {
            cur.assign(n, false);
            cur[i] = true;   // dp[i][i]
            for (int j = i + 1; j < n; j++) {
                if (s[i] == s[j])
                    cur[j] = (j == i + 1) ? true : prev[j - 1];
                else
                    cur[j] = false;
                if (cur[j] && j - i + 1 > maxLen) { maxLen = j - i + 1; start = i; }
            }
            prev = cur;
        }
        return s.substr(start, maxLen);
    }
};

void runTests() {
    Solution2 sol;
    struct TC { string s, expected; };
    vector<TC> tests = {
        {"babad",  "bab"},
        {"cbbd",   "bb"},
        {"a",      "a"},
        {"ac",     "a"},
        {"racecar","racecar"},
        {"abacaba","abacaba"},
    };
    for (auto& tc : tests) {
        string got = sol.longestPalindrome(tc.s);
        cout << "\"" << tc.s << "\" → \"" << got << "\"" << (got.size()==tc.expected.size()?" ✓":" ?") << "\n";
    }
}

int main() {
    runTests();
    return 0;
}

// Made with Bob
