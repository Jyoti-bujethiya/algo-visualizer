/*
 * LeetCode Problem #17: Letter Combinations of a Phone Number
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/letter-combinations-of-a-phone-number/
 */
import java.util.*;

class Solution {

    private static final String[] MAPPING = {"", "", "abc", "def", "ghi", "jkl",
                                              "mno", "pqrs", "tuv", "wxyz"};

    // APPROACH 1: Backtracking | O(4ⁿ*n) time | O(n) space
    // EXPLAIN: Build combinations character-by-character; backtrack after each letter choice.
    // WHEN: Classic backtracking template — clean and O(n) auxiliary space.
    public List<String> letterCombinations_backtrack(String digits) {
        List<String> result = new ArrayList<>();
        if (digits.isEmpty()) return result;
        backtrack(digits, 0, new StringBuilder(), result);
        return result;
    }

    private void backtrack(String digits, int index, StringBuilder cur, List<String> result) {
        if (index == digits.length()) { result.add(cur.toString()); return; }
        for (char ch : MAPPING[digits.charAt(index) - '0'].toCharArray()) {
            cur.append(ch);
            backtrack(digits, index + 1, cur, result);
            cur.deleteCharAt(cur.length() - 1);
        }
    }

    // APPROACH 2: BFS with Queue | O(4ⁿ*n) time | O(4ⁿ) space
    // EXPLAIN: Treat each digit as a BFS level; extend all partial combinations with each letter.
    // WHEN: Iterative approach using a queue — intuitive level-by-level expansion.
    public List<String> letterCombinations_bfs(String digits) {
        if (digits.isEmpty()) return new ArrayList<>();
        Deque<String> queue = new ArrayDeque<>();
        queue.add("");
        for (char digit : digits.toCharArray()) {
            String letters = MAPPING[digit - '0'];
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                String prefix = queue.poll();
                for (char ch : letters.toCharArray()) queue.add(prefix + ch);
            }
        }
        return new ArrayList<>(queue);
    }

    // APPROACH 3: Iterative with List | O(4ⁿ*n) time | O(4ⁿ) space
    // EXPLAIN: Start with [""] and replace with all extensions for each digit.
    // WHEN: Simplest iterative approach; no extra queue data structure needed.
    public List<String> letterCombinations_iterative(String digits) {
        if (digits.isEmpty()) return new ArrayList<>();
        List<String> result = new ArrayList<>();
        result.add("");
        for (char digit : digits.toCharArray()) {
            String letters = MAPPING[digit - '0'];
            List<String> temp = new ArrayList<>();
            for (String prev : result)
                for (char ch : letters.toCharArray()) temp.add(prev + ch);
            result = temp;
        }
        return result;
    }

    // APPROACH 4: Pure Recursive (no helper) | O(4ⁿ*n) time | O(4ⁿ) space
    // EXPLAIN: Recurse on remaining digits; prepend first digit's letters to sub-results.
    // WHEN: Functional recursive style — no mutation of shared state.
    public List<String> letterCombinations_recursive(String digits) {
        if (digits.isEmpty()) return new ArrayList<>();
        if (digits.length() == 1) {
            List<String> res = new ArrayList<>();
            for (char ch : MAPPING[digits.charAt(0) - '0'].toCharArray()) res.add(String.valueOf(ch));
            return res;
        }
        List<String> sub = letterCombinations_recursive(digits.substring(1));
        List<String> result = new ArrayList<>();
        for (char ch : MAPPING[digits.charAt(0) - '0'].toCharArray())
            for (String s : sub) result.add(ch + s);
        return result;
    }

    // APPROACH 5: Standard (entry point — backtracking) | O(4ⁿ*n) time | O(n) space
    // EXPLAIN: Standard canonical solution used in LeetCode submissions.
    // WHEN: Default choice when asked to implement letter combinations.
    public List<String> letterCombinations(String digits) {
        return letterCombinations_backtrack(digits);
    }
}

// Made with Bob
