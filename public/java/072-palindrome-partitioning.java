/*
 * LeetCode Problem #131: Palindrome Partitioning
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/palindrome-partitioning/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Backtracking with Palindrome Check | O(n*2ⁿ) time | O(n) space
    // EXPLAIN: Try all substrings from current index; if palindrome, add and recurse on remainder.
    // WHEN: Simple and intuitive — the standard interview answer.
    public List<List<String>> partition_backtrack(String s) {
        List<List<String>> result = new ArrayList<>();
        backtrack(s, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(String s, int start, List<String> cur, List<List<String>> result) {
        if (start == s.length()) { result.add(new ArrayList<>(cur)); return; }
        for (int end = start; end < s.length(); end++) {
            if (isPalindrome(s, start, end)) {
                cur.add(s.substring(start, end + 1));
                backtrack(s, end + 1, cur, result);
                cur.remove(cur.size() - 1);
            }
        }
    }

    private boolean isPalindrome(String s, int l, int r) {
        while (l < r) { if (s.charAt(l++) != s.charAt(r--)) return false; }
        return true;
    }

    // APPROACH 2: Backtracking with DP Palindrome Table | O(n²) preprocess + O(2ⁿ) time | O(n²) space
    // EXPLAIN: Precompute dp[i][j]=true if s[i..j] is a palindrome; use O(1) lookup in backtracking.
    // WHEN: Best when the string is long — amortises palindrome check cost across all calls.
    public List<List<String>> partition_dp(String s) {
        int n = s.length();
        boolean[][] dp = new boolean[n][n];
        for (int i = 0; i < n; i++) dp[i][i] = true;
        for (int i = 0; i < n - 1; i++) dp[i][i + 1] = (s.charAt(i) == s.charAt(i + 1));
        for (int len = 3; len <= n; len++)
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                dp[i][j] = (s.charAt(i) == s.charAt(j)) && dp[i + 1][j - 1];
            }
        List<List<String>> result = new ArrayList<>();
        backtrackDP(s, 0, dp, new ArrayList<>(), result);
        return result;
    }

    private void backtrackDP(String s, int start, boolean[][] dp,
                              List<String> cur, List<List<String>> result) {
        if (start == s.length()) { result.add(new ArrayList<>(cur)); return; }
        for (int end = start; end < s.length(); end++) {
            if (dp[start][end]) {
                cur.add(s.substring(start, end + 1));
                backtrackDP(s, end + 1, dp, cur, result);
                cur.remove(cur.size() - 1);
            }
        }
    }

    // APPROACH 3: Backtracking with Memoised Palindrome Check | O(n*2ⁿ) time | O(n²) space
    // EXPLAIN: Cache palindrome results for (i,j) pairs; avoid recomputing the same check.
    // WHEN: Middle ground — simple code with memoisation.
    public List<List<String>> partition_memo(String s) {
        int n = s.length();
        Boolean[][] memo = new Boolean[n][n];
        List<List<String>> result = new ArrayList<>();
        backtrackMemo(s, 0, memo, new ArrayList<>(), result);
        return result;
    }

    private void backtrackMemo(String s, int start, Boolean[][] memo,
                                List<String> cur, List<List<String>> result) {
        if (start == s.length()) { result.add(new ArrayList<>(cur)); return; }
        for (int end = start; end < s.length(); end++) {
            if (isPalindromeMemo(s, start, end, memo)) {
                cur.add(s.substring(start, end + 1));
                backtrackMemo(s, end + 1, memo, cur, result);
                cur.remove(cur.size() - 1);
            }
        }
    }

    private boolean isPalindromeMemo(String s, int l, int r, Boolean[][] memo) {
        if (memo[l][r] != null) return memo[l][r];
        int lo = l, hi = r;
        while (lo < hi) { if (s.charAt(lo++) != s.charAt(hi--)) return memo[l][r] = false; }
        return memo[l][r] = true;
    }

    // APPROACH 4: Iterative DP | O(n²*2ⁿ) time | O(n*2ⁿ) space
    // EXPLAIN: dp[i] stores all valid partitions of s[0..i-1]; extend by palindromic substrings.
    // WHEN: Iterative alternative to recursion; useful when stack depth is a concern.
    public List<List<String>> partition_iterative(String s) {
        int n = s.length();
        List<List<List<String>>> dp = new ArrayList<>();
        for (int i = 0; i <= n; i++) dp.add(new ArrayList<>());
        dp.get(0).add(new ArrayList<>());
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (isPalindrome(s, j, i - 1)) {
                    String pal = s.substring(j, i);
                    for (List<String> prev : dp.get(j)) {
                        List<String> newPart = new ArrayList<>(prev);
                        newPart.add(pal);
                        dp.get(i).add(newPart);
                    }
                }
            }
        }
        return dp.get(n);
    }

    // APPROACH 5: Standard (entry point — DP table backtracking) | O(n²+2ⁿ) time | O(n²) space
    // EXPLAIN: Standard canonical solution used in LeetCode submissions.
    // WHEN: Default choice combining optimal palindrome precomputation with backtracking.
    public List<List<String>> partition(String s) {
        return partition_dp(s);
    }
}

// Made with Bob
