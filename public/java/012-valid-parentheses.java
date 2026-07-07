/*
 * LeetCode Problem #20: Valid Parentheses
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/valid-parentheses/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Stack | O(n) time | O(n) space
    // EXPLAIN: Push open brackets onto a stack; for each closing bracket check it matches the top.
    // WHEN: Only practical solution — stack perfectly models the LIFO nesting of brackets.
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        Map<Character, Character> pairs = new HashMap<>();
        pairs.put(')', '(');
        pairs.put(']', '[');
        pairs.put('}', '{');
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
            } else {
                if (stack.isEmpty() || stack.peek() != pairs.get(c)) return false;
                stack.pop();
            }
        }
        return stack.isEmpty();
    }

    // APPROACH 2: Stack with Switch | O(n) time | O(n) space
    // EXPLAIN: Same stack logic but uses explicit conditionals instead of a map — avoids map overhead.
    // WHEN: Slightly faster due to no map lookup; useful when every nanosecond counts.
    public boolean isValid_Switch(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (c == ')' && top != '(') return false;
                if (c == ']' && top != '[') return false;
                if (c == '}' && top != '{') return false;
            }
        }
        return stack.isEmpty();
    }

    // APPROACH 3: Replace Method | O(n²) time | O(n) space
    // EXPLAIN: Repeatedly remove valid adjacent bracket pairs until no more can be removed.
    // WHEN: Never (inefficient) — O(n²) due to repeated string rebuilding; included for illustration only.
    public boolean isValid_Replace(String s) {
        int prevLen;
        do {
            prevLen = s.length();
            s = s.replace("()", "").replace("[]", "").replace("{}", "");
        } while (s.length() < prevLen);
        return s.isEmpty();
    }
}

// Made with Bob
