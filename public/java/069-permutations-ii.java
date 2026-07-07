/*
 * LeetCode Problem #47: Permutations II
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/permutations-ii/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Backtracking with Sorting and Skip Duplicates | O(n!*n) time | O(n) space
    // EXPLAIN: Sort array; skip element if it equals previous unused sibling to avoid duplicate permutations.
    // WHEN: Most common interview solution — clean and efficient.
    public List<List<Integer>> permuteUnique_backtrack(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        boolean[] used = new boolean[nums.length];
        backtrack(nums, used, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] nums, boolean[] used, List<Integer> cur, List<List<Integer>> result) {
        if (cur.size() == nums.length) { result.add(new ArrayList<>(cur)); return; }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) continue;
            used[i] = true; cur.add(nums[i]);
            backtrack(nums, used, cur, result);
            cur.remove(cur.size() - 1); used[i] = false;
        }
    }

    // APPROACH 2: Backtracking with Swap and Set | O(n!*n) time | O(n²) space
    // EXPLAIN: Use swap-based backtracking; track tried values at each level via a set.
    // WHEN: Alternative swap approach; no sorting required.
    public List<List<Integer>> permuteUnique_swap(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrackSwap(nums, 0, result);
        return result;
    }

    private void backtrackSwap(int[] nums, int start, List<List<Integer>> result) {
        if (start == nums.length) {
            List<Integer> perm = new ArrayList<>();
            for (int n : nums) perm.add(n);
            result.add(perm); return;
        }
        Set<Integer> seen = new HashSet<>();
        for (int i = start; i < nums.length; i++) {
            if (seen.contains(nums[i])) continue;
            seen.add(nums[i]);
            int tmp = nums[start]; nums[start] = nums[i]; nums[i] = tmp;
            backtrackSwap(nums, start + 1, result);
            tmp = nums[start]; nums[start] = nums[i]; nums[i] = tmp;
        }
    }

    // APPROACH 3: Frequency Map Backtracking | O(n!*n) time | O(n) space
    // EXPLAIN: Count frequency of each unique element; build permutations by decrementing counts.
    // WHEN: Most elegant for heavy duplicates — no sorting or used-array needed.
    public List<List<Integer>> permuteUnique_freq(int[] nums) {
        Map<Integer, Integer> freq = new TreeMap<>();
        for (int n : nums) freq.merge(n, 1, Integer::sum);
        List<List<Integer>> result = new ArrayList<>();
        backtrackFreq(freq, nums.length, new ArrayList<>(), result);
        return result;
    }

    private void backtrackFreq(Map<Integer, Integer> freq, int n, List<Integer> cur, List<List<Integer>> result) {
        if (cur.size() == n) { result.add(new ArrayList<>(cur)); return; }
        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
            if (e.getValue() > 0) {
                e.setValue(e.getValue() - 1); cur.add(e.getKey());
                backtrackFreq(freq, n, cur, result);
                cur.remove(cur.size() - 1); e.setValue(e.getValue() + 1);
            }
        }
    }

    // APPROACH 4: Iterative Insertion with Set | O(n!*n²) time | O(n!*n) space
    // EXPLAIN: Insert each element at all positions in existing permutations; deduplicate via set.
    // WHEN: Purely iterative alternative; less efficient due to insertion cost.
    public List<List<Integer>> permuteUnique_iterative(int[] nums) {
        Set<List<Integer>> result = new HashSet<>();
        result.add(new ArrayList<>());
        for (int num : nums) {
            Set<List<Integer>> next = new HashSet<>();
            for (List<Integer> perm : result) {
                for (int i = 0; i <= perm.size(); i++) {
                    List<Integer> newPerm = new ArrayList<>(perm);
                    newPerm.add(i, num);
                    next.add(newPerm);
                }
            }
            result = next;
        }
        return new ArrayList<>(result);
    }

    // APPROACH 5: Next Permutation | O(n!*n) time | O(1) space
    // EXPLAIN: Sort array, then repeatedly advance to the next lexicographic permutation.
    // WHEN: Generates permutations in sorted order; uses in-place next-permutation logic.
    public List<List<Integer>> permuteUnique(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        do {
            List<Integer> perm = new ArrayList<>();
            for (int n : nums) perm.add(n);
            result.add(perm);
        } while (nextPermutation(nums));
        return result;
    }

    private boolean nextPermutation(int[] nums) {
        int i = nums.length - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;
        if (i < 0) return false;
        int j = nums.length - 1;
        while (nums[j] <= nums[i]) j--;
        int tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp;
        int lo = i + 1, hi = nums.length - 1;
        while (lo < hi) { tmp = nums[lo]; nums[lo++] = nums[hi]; nums[hi--] = tmp; }
        return true;
    }
}

// Made with Bob
