/*
 * LeetCode Problem #22: Generate Parentheses
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/generate-parentheses/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Backtracking (Optimal) | O(4ⁿ/√n) time | O(n) space
    // EXPLAIN: Add '(' if open<n; add ')' if close<open; collect when length==2n.
    // WHEN: Cleanest, most efficient — standard interview answer.
    public List<String> generateParenthesis_backtrack(int n) {
        List<String> result = new ArrayList<>();
        backtrack("", 0, 0, n, result);
        return result;
    }

    private void backtrack(String cur, int open, int close, int n, List<String> result) {
        if (cur.length() == 2 * n) { result.add(cur); return; }
        if (open < n)       backtrack(cur + '(', open + 1, close, n, result);
        if (close < open)   backtrack(cur + ')', open, close + 1, n, result);
    }

    // APPROACH 2: Backtracking with StringBuilder | O(4ⁿ/√n) time | O(n) space
    // EXPLAIN: Same logic but mutates a StringBuilder and restores — avoids string concatenation.
    // WHEN: More memory-efficient; shows backtrack-restore pattern explicitly.
    public List<String> generateParenthesis_ref(int n) {
        List<String> result = new ArrayList<>();
        backtrackSB(new StringBuilder(), 0, 0, n, result);
        return result;
    }

    private void backtrackSB(StringBuilder cur, int open, int close, int n, List<String> result) {
        if (cur.length() == 2 * n) { result.add(cur.toString()); return; }
        if (open < n) {
            cur.append('('); backtrackSB(cur, open + 1, close, n, result); cur.deleteCharAt(cur.length()-1);
        }
        if (close < open) {
            cur.append(')'); backtrackSB(cur, open, close + 1, n, result); cur.deleteCharAt(cur.length()-1);
        }
    }

    // APPROACH 3: Closure Number (Mathematical) | O(4ⁿ/√n) time | O(4ⁿ/√n) space
    // EXPLAIN: Any valid combination is '(' + inside + ')' + after where inside has i pairs.
    // WHEN: Elegant mathematical decomposition; shows Catalan number recurrence.
    public List<String> generateParenthesis_closure(int n) {
        if (n == 0) return Collections.singletonList("");
        List<String> result = new ArrayList<>();
        for (int i = 0; i < n; i++)
            for (String left : generateParenthesis_closure(i))
                for (String right : generateParenthesis_closure(n - 1 - i))
                    result.add("(" + left + ")" + right);
        return result;
    }

    // APPROACH 4: Dynamic Programming | O(4ⁿ/√n) time | O(4ⁿ/√n) space
    // EXPLAIN: dp[k] = all valid combinations with k pairs; build from dp[0..k-1].
    // WHEN: Demonstrates DP perspective; avoids recomputing subproblems.
    public List<String> generateParenthesis_dp(int n) {
        List<List<String>> dp = new ArrayList<>();
        dp.add(Collections.singletonList(""));
        for (int k = 1; k <= n; k++) {
            List<String> row = new ArrayList<>();
            for (int i = 0; i < k; i++)
                for (String left : dp.get(i))
                    for (String right : dp.get(k - 1 - i))
                        row.add("(" + left + ")" + right);
            dp.add(row);
        }
        return dp.get(n);
    }

    // APPROACH 5: BFS / Iterative Stack | O(4ⁿ/√n) time | O(4ⁿ/√n) space
    // EXPLAIN: Use a stack of (string, open, close) states; expand valid next states iteratively.
    // WHEN: Iterative preference; avoids recursion entirely.
    public List<String> generateParenthesis(int n) {
        List<String> result = new ArrayList<>();
        Deque<int[]> stack = new ArrayDeque<>();  // [open, close, encoded string via list]
        // Use a wrapper approach: store state as Object[]
        Deque<Object[]> stk = new ArrayDeque<>();
        stk.push(new Object[]{"", 0, 0});
        while (!stk.isEmpty()) {
            Object[] state = stk.pop();
            String cur = (String) state[0];
            int open = (int) state[1], close = (int) state[2];
            if (cur.length() == 2 * n) { result.add(cur); continue; }
            if (open < n)     stk.push(new Object[]{cur + "(", open + 1, close});
            if (close < open) stk.push(new Object[]{cur + ")", open, close + 1});
        }
        return result;
    }
}

// Made with Bob
