/*
 * LeetCode Problem #739: Daily Temperatures
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/daily-temperatures/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Monotonic Stack (Optimal) | O(n) time | O(n) space
    // EXPLAIN: Stack stores indices of unresolved days; pop when a warmer temperature is found.
    // WHEN: Standard O(n) solution — the classic monotonic stack pattern.
    public int[] dailyTemperatures_stack(int[] temperatures) {
        int n = temperatures.length;
        int[] result = new int[n];
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
                int prev = stack.pop();
                result[prev] = i - prev;
            }
            stack.push(i);
        }
        return result;
    }

    // APPROACH 2: Brute Force | O(n²) time | O(1) space
    // EXPLAIN: For each day search forward for the first warmer temperature.
    // WHEN: Educational baseline; correct but too slow for large inputs.
    public int[] dailyTemperatures_brute(int[] temperatures) {
        int n = temperatures.length;
        int[] result = new int[n];
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                if (temperatures[j] > temperatures[i]) { result[i] = j - i; break; }
        return result;
    }

    // APPROACH 3: Backward Iteration with Jump | O(n) time | O(1) space
    // EXPLAIN: Scan right-to-left; use result array to skip ahead to the next candidate.
    // WHEN: O(1) extra space beyond output — best space-complexity solution.
    public int[] dailyTemperatures_backward(int[] temperatures) {
        int n = temperatures.length;
        int[] result = new int[n];
        for (int i = n - 2; i >= 0; i--) {
            int j = i + 1;
            while (j < n) {
                if (temperatures[j] > temperatures[i]) { result[i] = j - i; break; }
                if (result[j] == 0) break;
                j += result[j];
            }
        }
        return result;
    }

    // APPROACH 4: Array as Stack | O(n) time | O(n) space
    // EXPLAIN: Use an int array as a manual stack — better cache locality than Deque.
    // WHEN: Performance-critical — avoids Deque overhead.
    public int[] dailyTemperatures_arrayStack(int[] temperatures) {
        int n = temperatures.length;
        int[] result = new int[n];
        int[] stack = new int[n];
        int top = -1;
        for (int i = 0; i < n; i++) {
            while (top >= 0 && temperatures[i] > temperatures[stack[top]]) {
                int prev = stack[top--];
                result[prev] = i - prev;
            }
            stack[++top] = i;
        }
        return result;
    }

    // APPROACH 5: Next Greater Element Pattern | O(n) time | O(n) space
    // EXPLAIN: Generalised NGE pattern — standard monotonic stack solution for LeetCode.
    // WHEN: Default submission; matches the problem's canonical form.
    public int[] dailyTemperatures(int[] temperatures) {
        return dailyTemperatures_arrayStack(temperatures);
    }
}

// Made with Bob
