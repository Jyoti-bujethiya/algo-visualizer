/*
 * LeetCode Problem #150: Evaluate Reverse Polish Notation
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/evaluate-reverse-polish-notation/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Stack-Based Evaluation | O(n) time | O(n) space
    // EXPLAIN: Push numbers onto a stack; on encountering an operator, pop two operands and push result.
    // WHEN: Classic stack application — standard interview answer.
    public int evalRPN_stack(String[] tokens) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (String token : tokens) {
            switch (token) {
                case "+": { int b = stack.pop(), a = stack.pop(); stack.push(a + b); break; }
                case "-": { int b = stack.pop(), a = stack.pop(); stack.push(a - b); break; }
                case "*": { int b = stack.pop(), a = stack.pop(); stack.push(a * b); break; }
                case "/": { int b = stack.pop(), a = stack.pop(); stack.push(a / b); break; }
                default:  stack.push(Integer.parseInt(token));
            }
        }
        return stack.peek();
    }

    // APPROACH 2: Stack with Set-Based Operator Check | O(n) time | O(n) space
    // EXPLAIN: Use a Set to identify operators; reduces repeated string comparisons.
    // WHEN: Slightly cleaner than switch when operator set is dynamic.
    public int evalRPN_set(String[] tokens) {
        Set<String> ops = new HashSet<>(Arrays.asList("+", "-", "*", "/"));
        Deque<Long> stack = new ArrayDeque<>();
        for (String token : tokens) {
            if (ops.contains(token)) {
                long b = stack.pop(), a = stack.pop();
                switch (token) {
                    case "+": stack.push(a + b); break;
                    case "-": stack.push(a - b); break;
                    case "*": stack.push(a * b); break;
                    case "/": stack.push(a / b); break;
                }
            } else {
                stack.push(Long.parseLong(token));
            }
        }
        return (int)(long) stack.peek();
    }

    // APPROACH 3: Stack with Array | O(n) time | O(n) space
    // EXPLAIN: Use a fixed-size int array as a stack — better cache performance than Deque.
    // WHEN: Performance-critical — array access is faster than Deque's linked node traversal.
    public int evalRPN(String[] tokens) {
        int[] stack = new int[tokens.length];
        int top = -1;
        for (String token : tokens) {
            switch (token) {
                case "+": stack[top - 1] += stack[top--]; break;
                case "-": stack[top - 1] -= stack[top--]; break;
                case "*": stack[top - 1] *= stack[top--]; break;
                case "/": stack[top - 1] /= stack[top--]; break;
                default:  stack[++top] = Integer.parseInt(token);
            }
        }
        return stack[top];
    }
}

// Made with Bob
