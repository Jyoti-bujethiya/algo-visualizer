/*
 * LeetCode Problem #8: String to Integer (atoi)
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/string-to-integer-atoi/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Simulation | O(n) time | O(1) space
    // EXPLAIN: Skip whitespace, read sign, then accumulate digits while clamping to INT range.
    // WHEN: Only practical approach — models the exact specification with a clean linear pass.
    public int myAtoi_Simulation(String s) {
        int i = 0, n = s.length();

        // Step 1: Skip leading whitespace
        while (i < n && s.charAt(i) == ' ') i++;

        if (i == n) return 0;

        // Step 2: Read sign
        int sign = 1;
        if (s.charAt(i) == '+') {
            i++;
        } else if (s.charAt(i) == '-') {
            sign = -1;
            i++;
        }

        // Step 3: Read digits
        long result = 0;
        while (i < n && Character.isDigit(s.charAt(i))) {
            result = result * 10 + (s.charAt(i) - '0');
            // Clamp early to avoid long overflow
            if (sign * result > Integer.MAX_VALUE) return Integer.MAX_VALUE;
            if (sign * result < Integer.MIN_VALUE) return Integer.MIN_VALUE;
            i++;
        }

        return (int) (sign * result);
    }

    // APPROACH 2: Overflow-Safe (no long) | O(n) time | O(1) space
    // EXPLAIN: Detect overflow before multiplying by checking against Integer.MAX_VALUE/10 so no 64-bit temp is needed.
    // WHEN: When you want to demonstrate careful integer boundary handling without widening to long.
    public int myAtoi_OverflowSafe(String s) {
        int i = 0, n = s.length(), sign = 1, result = 0;

        while (i < n && s.charAt(i) == ' ') i++;
        if (i < n && (s.charAt(i) == '+' || s.charAt(i) == '-'))
            sign = (s.charAt(i++) == '-') ? -1 : 1;

        while (i < n && Character.isDigit(s.charAt(i))) {
            int d = s.charAt(i++) - '0';
            // Overflow check: result > MAX/10, or result == MAX/10 and d > 7
            if (result > Integer.MAX_VALUE / 10 ||
                (result == Integer.MAX_VALUE / 10 && d > 7)) {
                return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
            }
            result = result * 10 + d;
        }
        return sign * result;
    }

    // APPROACH 3: DFA / State Machine | O(n) time | O(1) space
    // EXPLAIN: Model parsing as explicit states (START → SIGN → NUMBER → END) for rigour and extensibility.
    // WHEN: When you want to demonstrate finite-automaton design or need to handle a richer grammar.
    public int myAtoi_DFA(String s) {
        final int START = 0, SIGN = 1, NUMBER = 2, END = 3;
        int state = START, sign = 1;
        long result = 0;

        for (char c : s.toCharArray()) {
            if (state == START) {
                if (c == ' ') { /* stay */ }
                else if (c == '+' || c == '-') { sign = (c == '-') ? -1 : 1; state = SIGN; }
                else if (Character.isDigit(c)) { result = c - '0'; state = NUMBER; }
                else state = END;
            } else if (state == SIGN) {
                if (Character.isDigit(c)) { result = c - '0'; state = NUMBER; }
                else state = END;
            } else if (state == NUMBER) {
                if (Character.isDigit(c)) {
                    result = result * 10 + (c - '0');
                    if (result * sign > Integer.MAX_VALUE) return Integer.MAX_VALUE;
                    if (result * sign < Integer.MIN_VALUE) return Integer.MIN_VALUE;
                } else state = END;
            }
        }
        return (int) (result * sign);
    }

    // APPROACH 4: Manual Parse (trim then scan) | O(n) time | O(n) space
    // EXPLAIN: Use String.stripLeading() to trim, then manually read sign and digits — explicit steps mirror the spec.
    // WHEN: When code clarity and step-by-step readability are more important than micro-optimization.
    public int myAtoi_ManualParse(String s) {
        String trimmed = s.stripLeading();
        if (trimmed.isEmpty()) return 0;

        int sign = 1, i = 0;
        if (trimmed.charAt(0) == '+' || trimmed.charAt(0) == '-') {
            sign = (trimmed.charAt(i++) == '-') ? -1 : 1;
        }

        long res = 0;
        while (i < trimmed.length() && Character.isDigit(trimmed.charAt(i))) {
            res = res * 10 + (trimmed.charAt(i++) - '0');
            if (res * sign > Integer.MAX_VALUE) return Integer.MAX_VALUE;
            if (res * sign < Integer.MIN_VALUE) return Integer.MIN_VALUE;
        }
        return (int) (res * sign);
    }

    // APPROACH 5: Library Parse (Long.parseLong) | O(n) time | O(n) space
    // EXPLAIN: Trim, extract the leading digit-with-sign substring, parse with Long.parseLong, then clamp.
    // WHEN: Shows awareness of library tools — not acceptable in an interview without permission.
    public int myAtoi(String s) {
        s = s.stripLeading();
        if (s.isEmpty()) return 0;
        int end = 0;
        if (!s.isEmpty() && (s.charAt(0) == '+' || s.charAt(0) == '-')) end++;
        while (end < s.length() && Character.isDigit(s.charAt(end))) end++;
        if (end == 0 || (end == 1 && !Character.isDigit(s.charAt(0)))) return 0;
        try {
            long val = Long.parseLong(s.substring(0, end));
            if (val > Integer.MAX_VALUE) return Integer.MAX_VALUE;
            if (val < Integer.MIN_VALUE) return Integer.MIN_VALUE;
            return (int) val;
        } catch (NumberFormatException e) {
            // overflow in Long — clamp based on sign
            return s.charAt(0) == '-' ? Integer.MIN_VALUE : Integer.MAX_VALUE;
        }
    }
}

// Made with Bob
