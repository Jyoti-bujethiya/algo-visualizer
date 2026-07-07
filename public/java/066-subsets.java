/*
 * LeetCode Problem #78: Subsets
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/subsets/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Backtracking (DFS) | O(n*2ⁿ) time | O(n) space
    // EXPLAIN: At each index add current list to result then try including each remaining element.
    // WHEN: Go-to interview approach — generalises easily to Subsets II and Combination Sum.
    public List<List<Integer>> subsets_backtrack(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] nums, int start, List<Integer> cur, List<List<Integer>> result) {
        result.add(new ArrayList<>(cur));
        for (int i = start; i < nums.length; i++) {
            cur.add(nums[i]);
            backtrack(nums, i + 1, cur, result);
            cur.remove(cur.size() - 1);
        }
    }

    // APPROACH 2: Iterative Cascading | O(n*2ⁿ) time | O(1) space
    // EXPLAIN: Start with [[]]; for each number extend every existing subset.
    // WHEN: Clean iterative approach without recursion or bit manipulation.
    public List<List<Integer>> subsets_iterative(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        result.add(new ArrayList<>());
        for (int num : nums) {
            int size = result.size();
            for (int i = 0; i < size; i++) {
                List<Integer> newSubset = new ArrayList<>(result.get(i));
                newSubset.add(num);
                result.add(newSubset);
            }
        }
        return result;
    }

    // APPROACH 3: Bit Manipulation | O(n*2ⁿ) time | O(1) space
    // EXPLAIN: Each integer 0..(2ⁿ-1) encodes a subset via its binary bits.
    // WHEN: Non-recursive; demonstrates bit-mask enumeration elegantly.
    public List<List<Integer>> subsets_bitmask(int[] nums) {
        int n = nums.length;
        List<List<Integer>> result = new ArrayList<>();
        for (int mask = 0; mask < (1 << n); mask++) {
            List<Integer> subset = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                if ((mask >> i & 1) == 1) subset.add(nums[i]);
            }
            result.add(subset);
        }
        return result;
    }

    // APPROACH 4: Include/Exclude Backtracking | O(n*2ⁿ) time | O(n) space
    // EXPLAIN: Explicitly model include/exclude binary decision at each index; collect at leaves.
    // WHEN: Illustrates the decision-tree structure most clearly for teaching.
    public List<List<Integer>> subsets_includeExclude(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        includeExclude(nums, 0, new ArrayList<>(), result);
        return result;
    }

    private void includeExclude(int[] nums, int idx, List<Integer> cur, List<List<Integer>> result) {
        if (idx == nums.length) {
            result.add(new ArrayList<>(cur)); return;
        }
        includeExclude(nums, idx + 1, cur, result);           // Exclude
        cur.add(nums[idx]);
        includeExclude(nums, idx + 1, cur, result);           // Include
        cur.remove(cur.size() - 1);
    }

    // APPROACH 5: Standard (entry point — uses backtracking) | O(n*2ⁿ) time | O(n) space
    // EXPLAIN: Standard solution used in LeetCode submissions.
    // WHEN: Default choice when asked to implement subsets.
    public List<List<Integer>> subsets(int[] nums) {
        return subsets_backtrack(nums);
    }
}

// Made with Bob
