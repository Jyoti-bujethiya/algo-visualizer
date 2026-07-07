/*
 * LeetCode Problem #139: Word Break
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/word-break/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Recursive Memoization | O(n³) time | O(n) space
    // EXPLAIN: Try every prefix of the remaining string as a dictionary word; cache by start index.
    // WHEN: Use when top-down thinking is natural; n = string length.

    public boolean wordBreak_memo(String s, List<String> wordDict) {
        Set<String> dict = new HashSet<>(wordDict);
        Boolean[] memo = new Boolean[s.length()];
        return canBreak(s, 0, dict, memo);
    }

    private boolean canBreak(String s, int start, Set<String> dict, Boolean[] memo) {
        if (start == s.length()) return true;
        if (memo[start] != null) return memo[start];
        for (int end = start + 1; end <= s.length(); end++) {
            if (dict.contains(s.substring(start, end)) && canBreak(s, end, dict, memo)) {
                memo[start] = true;
                return true;
            }
        }
        memo[start] = false;
        return false;
    }

    // APPROACH 2: Bottom-Up DP | O(n³) time | O(n) space
    // EXPLAIN: dp[i] = true if s[0..i-1] is breakable; for each i check all j<i splits.
    // WHEN: Use as the standard iterative DP answer for interviews.

    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> dict = new HashSet<>(wordDict);
        int n = s.length();
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && dict.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[n];
    }

    // APPROACH 3: DP with Max-Length Optimization | O(n*maxLen) time | O(n) space
    // EXPLAIN: Only check substrings up to maxWordLength; avoids redundant dictionary lookups.
    // WHEN: Use when the dictionary has a known max word length for a minor speedup.

    public boolean wordBreak_optimized(String s, List<String> wordDict) {
        Set<String> dict = new HashSet<>(wordDict);
        int maxLen = 0;
        for (String w : wordDict) maxLen = Math.max(maxLen, w.length());
        int n = s.length();
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;
        for (int i = 1; i <= n; i++) {
            for (int j = Math.max(0, i - maxLen); j < i; j++) {
                if (dp[j] && dict.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[n];
    }

    // APPROACH 4: BFS | O(n³) time | O(n) space
    // EXPLAIN: BFS from index 0; each valid word enqueues the end index as a new node.
    // WHEN: Use for a graph-traversal perspective — each position is a node.

    public boolean wordBreak_bfs(String s, List<String> wordDict) {
        Set<String> dict = new HashSet<>(wordDict);
        int n = s.length();
        boolean[] visited = new boolean[n];
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(0);
        while (!queue.isEmpty()) {
            int start = queue.poll();
            if (visited[start]) continue;
            visited[start] = true;
            for (int end = start + 1; end <= n; end++) {
                if (dict.contains(s.substring(start, end))) {
                    if (end == n) return true;
                    queue.offer(end);
                }
            }
        }
        return false;
    }

    // APPROACH 5: Trie + DP | O(n²) time | O(total_chars) space
    // EXPLAIN: Build a trie from the dictionary; walk the trie from each dp[i]=true position.
    // WHEN: Use when the dictionary is very large — trie avoids repeated string hashing.

    public boolean wordBreak_trie(String s, List<String> wordDict) {
        // Build trie
        Map<Character, Object> root = new HashMap<>();
        for (String word : wordDict) {
            Map<Character, Object> node = root;
            for (char c : word.toCharArray()) {
                node = (Map<Character, Object>) node.computeIfAbsent(c, k -> new HashMap<>());
            }
            node.put('#', null);  // end marker
        }
        int n = s.length();
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;
        for (int i = 0; i < n; i++) {
            if (!dp[i]) continue;
            Map<Character, Object> node = root;
            for (int j = i; j < n; j++) {
                char c = s.charAt(j);
                if (!node.containsKey(c)) break;
                node = (Map<Character, Object>) node.get(c);
                if (node.containsKey('#')) dp[j + 1] = true;
            }
        }
        return dp[n];
    }
}

// Made with Bob
