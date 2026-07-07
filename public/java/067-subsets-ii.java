/*
 * LeetCode Problem #90: Subsets II
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/subsets-ii/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Backtracking with Skip Duplicates | O(n*2ⁿ) time | O(n) space
    // EXPLAIN: Sort array, then skip duplicate elements at the same recursion level.
    // WHEN: Standard go-to — correct, efficient, easy to explain in interviews.
    public List<List<Integer>> subsetsWithDup_backtrack(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] nums, int start, List<Integer> cur, List<List<Integer>> result) {
        result.add(new ArrayList<>(cur));
        for (int i = start; i < nums.length; i++) {
            if (i > start && nums[i] == nums[i - 1]) continue;
            cur.add(nums[i]);
            backtrack(nums, i + 1, cur, result);
            cur.remove(cur.size() - 1);
        }
    }

    // APPROACH 2: Iterative Cascading with Duplicate Handling | O(n*2ⁿ) time | O(1) space
    // EXPLAIN: Track how many subsets were added in the last round; for duplicates only extend those.
    // WHEN: Iterative preference; avoids recursion while correctly handling duplicates.
    public List<List<Integer>> subsetsWithDup_iterative(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        result.add(new ArrayList<>());
        int lastAddedCount = 0;

        for (int i = 0; i < nums.length; i++) {
            int start = (i > 0 && nums[i] == nums[i - 1]) ? result.size() - lastAddedCount : 0;
            int currentSize = result.size();
            for (int j = start; j < currentSize; j++) {
                List<Integer> newSubset = new ArrayList<>(result.get(j));
                newSubset.add(nums[i]);
                result.add(newSubset);
            }
            lastAddedCount = currentSize - start;
        }
        return result;
    }

    // APPROACH 3: Frequency Map Backtracking | O(n*2ⁿ) time | O(n) space
    // EXPLAIN: Count each unique element's frequency; for each unique element try 0..freq copies.
    // WHEN: Elegant when duplicates are heavy; no reasoning about index-skipping needed.
    public List<List<Integer>> subsetsWithDup_freq(int[] nums) {
        Arrays.sort(nums);
        List<int[]> freq = new ArrayList<>();
        for (int num : nums) {
            if (freq.isEmpty() || freq.get(freq.size() - 1)[0] != num)
                freq.add(new int[]{num, 1});
            else
                freq.get(freq.size() - 1)[1]++;
        }
        List<List<Integer>> result = new ArrayList<>();
        freqBacktrack(freq, 0, new ArrayList<>(), result);
        return result;
    }

    private void freqBacktrack(List<int[]> freq, int idx, List<Integer> cur, List<List<Integer>> result) {
        if (idx == freq.size()) { result.add(new ArrayList<>(cur)); return; }
        int num = freq.get(idx)[0], count = freq.get(idx)[1];
        for (int times = 0; times <= count; times++) {
            for (int j = 0; j < times; j++) cur.add(num);
            freqBacktrack(freq, idx + 1, cur, result);
            for (int j = 0; j < times; j++) cur.remove(cur.size() - 1);
        }
    }

    // APPROACH 4: Bit Manipulation with Set | O(n*2ⁿ*log(2ⁿ)) time | O(n*2ⁿ) space
    // EXPLAIN: Generate all 2ⁿ subsets via bitmask; insert into a set to deduplicate.
    // WHEN: Simplest to code from scratch; less efficient due to set overhead.
    public List<List<Integer>> subsetsWithDup_bitmask(int[] nums) {
        Arrays.sort(nums);
        Set<List<Integer>> seen = new HashSet<>();
        List<List<Integer>> result = new ArrayList<>();
        int n = nums.length;
        for (int mask = 0; mask < (1 << n); mask++) {
            List<Integer> subset = new ArrayList<>();
            for (int i = 0; i < n; i++) if ((mask >> i & 1) == 1) subset.add(nums[i]);
            if (seen.add(subset)) result.add(subset);
        }
        return result;
    }

    // APPROACH 5: Standard (entry point) | O(n*2ⁿ) time | O(n) space
    // EXPLAIN: Delegates to the standard backtracking solution.
    // WHEN: Default submission choice.
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        return subsetsWithDup_backtrack(nums);
    }
}

// Made with Bob
