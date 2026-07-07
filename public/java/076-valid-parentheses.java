/*
 * LeetCode Problem #20: Valid Parentheses
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/valid-parentheses/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Stack with Closing Bracket Map | O(n) time | O(n) space
    // EXPLAIN: Push opening brackets; on closing bracket verify top of stack matches.
    // WHEN: Default approach — handles all bracket types cleanly in one pass.

    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        Map<Character, Character> map = new HashMap<>();
        map.put(')', '(');
        map.put('}', '{');
        map.put(']', '[');
        for (char c : s.toCharArray()) {
            if (map.containsKey(c)) {
                char top = stack.isEmpty() ? '#' : stack.pop();
                if (top != map.get(c)) return false;
            } else {
                stack.push(c);
            }
        }
        return stack.isEmpty();
    }

    // APPROACH 2: Stack with Opening Bracket Push (Expected Closer) | O(n) time | O(n) space
    // EXPLAIN: Push the expected closing bracket; pop and compare when a closer is seen.
    // WHEN: Slightly more readable — avoids map lookup on close by pre-storing the expected char.

    public boolean isValidV2(String s) {
        if (s.length() % 2 != 0) return false;
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else {
                if (stack.isEmpty() || stack.pop() != c) return false;
            }
        }
        return stack.isEmpty();
    }

    // APPROACH 3: String Replace (Iterative Reduction) | O(n²) time | O(n) space
    // EXPLAIN: Repeatedly remove matching adjacent pairs until no more exist or string empties.
    // WHEN: Academic / interview curiosity only — illustrates reduction; too slow for production.

    public boolean isValidV3(String s) {
        int prev = -1;
        while (prev != s.length()) {
            prev = s.length();
            s = s.replace("()", "").replace("{}", "").replace("[]", "");
        }
        return s.isEmpty();
    }

    // ── quick tests ──────────────────────────────────────────────────────────
    public static void main(String[] args) {
        Solution sol = new Solution();
        String[][] cases = {{"()", "true"}, {"()[]{}", "true"},
                {"(]", "false"}, {"([)]", "false"}, {"{[]}", "true"}, {"", "true"}};
        for (String[] tc : cases) {
            boolean r1 = sol.isValid(tc[0]);
            boolean r2 = sol.isValidV2(tc[0]);
            boolean r3 = sol.isValidV3(tc[0]);
            boolean exp = Boolean.parseBoolean(tc[1]);
            assert r1 == exp : "V1 failed: " + tc[0];
            assert r2 == exp : "V2 failed: " + tc[0];
            assert r3 == exp : "V3 failed: " + tc[0];
        }
        System.out.println("All tests passed.");
    }
}

// Made with Bob
