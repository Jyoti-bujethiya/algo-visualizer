/*
 * LeetCode Problem #5: Longest Palindromic Substring
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/longest-palindromic-substring/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Brute Force | O(n³) time | O(1) space
    // EXPLAIN: Check every substring and test if it is a palindrome; track the longest one found.
    // WHEN: Only for very short strings as a correctness baseline.
    public String longestPalindrome_BruteForce(String s) {
        int n = s.length();
        String best = "";
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                if (isPalindrome(s, i, j) && j - i + 1 > best.length()) {
                    best = s.substring(i, j + 1);
                }
            }
        }
        return best;
    }

    private boolean isPalindrome(String s, int l, int r) {
        while (l < r) {
            if (s.charAt(l++) != s.charAt(r--)) return false;
        }
        return true;
    }

    // APPROACH 2: Expand Around Center | O(n²) time | O(1) space
    // EXPLAIN: For each character (and gap between characters), expand outward while chars match.
    // WHEN: Optimal in practice — O(n²) time with O(1) space; standard interview answer.
    public String longestPalindrome_ExpandCenter(String s) {
        int n = s.length();
        int start = 0, maxLen = 1;
        for (int i = 0; i < n; i++) {
            // Odd-length palindromes
            int len1 = expand(s, i, i);
            // Even-length palindromes
            int len2 = expand(s, i, i + 1);
            int len = Math.max(len1, len2);
            if (len > maxLen) {
                maxLen = len;
                start = i - (len - 1) / 2;
            }
        }
        return s.substring(start, start + maxLen);
    }

    private int expand(String s, int left, int right) {
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }
        return right - left - 1;
    }

    // APPROACH 3: Dynamic Programming | O(n²) time | O(n²) space
    // EXPLAIN: dp[i][j] = true if s[i..j] is a palindrome; fill using the recurrence dp[i][j] = (s[i]==s[j]) && dp[i+1][j-1].
    // WHEN: When the interviewer explicitly asks for a DP solution or you need sub-problem reuse.
    public String longestPalindrome_DP(String s) {
        int n = s.length();
        boolean[][] dp = new boolean[n][n];
        int start = 0, maxLen = 1;

        // All substrings of length 1 are palindromes
        for (int i = 0; i < n; i++) dp[i][i] = true;

        // Check substrings of length 2
        for (int i = 0; i < n - 1; i++) {
            if (s.charAt(i) == s.charAt(i + 1)) {
                dp[i][i + 1] = true;
                start = i;
                maxLen = 2;
            }
        }

        // Check substrings of length 3 and above
        for (int len = 3; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                if (s.charAt(i) == s.charAt(j) && dp[i + 1][j - 1]) {
                    dp[i][j] = true;
                    if (len > maxLen) {
                        maxLen = len;
                        start = i;
                    }
                }
            }
        }
        return s.substring(start, start + maxLen);
    }

    // APPROACH 4: Manacher's Algorithm | O(n) time | O(n) space
    // EXPLAIN: Transform string with '#' separators; reuse palindrome radii via a center-mirror property for linear time.
    // WHEN: When strictly O(n) is required — impressive to know; rarely asked but optimal.
    public String longestPalindrome_Manacher(String s) {
        // Transform: "abc" -> "^#a#b#c#$"
        StringBuilder sb = new StringBuilder("^#");
        for (char c : s.toCharArray()) { sb.append(c); sb.append('#'); }
        sb.append('$');
        String t = sb.toString();
        int n = t.length();
        int[] p = new int[n];
        int C = 0, R = 0;

        for (int i = 1; i < n - 1; i++) {
            int mirror = 2 * C - i;
            if (i < R) p[i] = Math.min(R - i, p[mirror]);
            // Expand around center i
            while (t.charAt(i + p[i] + 1) == t.charAt(i - p[i] - 1)) p[i]++;
            // Update center
            if (i + p[i] > R) { C = i; R = i + p[i]; }
        }

        // Find the index with maximum palindrome radius
        int maxLen = 0, center = 0;
        for (int i = 1; i < n - 1; i++) {
            if (p[i] > maxLen) { maxLen = p[i]; center = i; }
        }
        int start = (center - maxLen) / 2;
        return s.substring(start, start + maxLen);
    }

    // APPROACH 5: DP Space Optimized | O(n²) time | O(n) space
    // EXPLAIN: Use two 1-D boolean arrays (prev, curr) to represent one diagonal of the DP table at a time.
    // WHEN: When you want DP correctness but cannot afford the O(n²) table; trading time constant for memory.
    public String longestPalindrome_DPOptimized(String s) {
        int n = s.length();
        if (n == 0) return "";
        int start = 0, maxLen = 1;
        boolean[] prev = new boolean[n];
        boolean[] cur  = new boolean[n];

        for (int i = n - 1; i >= 0; i--) {
            cur = new boolean[n];
            cur[i] = true;                             // dp[i][i]
            for (int j = i + 1; j < n; j++) {
                if (s.charAt(i) == s.charAt(j)) {
                    cur[j] = (j == i + 1) ? true : prev[j - 1];
                } else {
                    cur[j] = false;
                }
                if (cur[j] && j - i + 1 > maxLen) {
                    maxLen = j - i + 1;
                    start  = i;
                }
            }
            prev = cur;
        }
        return s.substring(start, start + maxLen);
    }
}

// Made with Bob
