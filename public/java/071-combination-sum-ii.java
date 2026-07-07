/*
 * LeetCode Problem #40: Combination Sum II
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/combination-sum-ii/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Backtracking with Skip Duplicates | O(2^n) time | O(n) space
    // EXPLAIN: Sort array; skip element if it equals the previous element at the same recursion level.
    // WHEN: Standard interview solution — correct, efficient, easy to explain.
    public List<List<Integer>> combinationSum2_backtrack(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> result = new ArrayList<>();
        backtrack(candidates, target, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] candidates, int remaining, int start,
                           List<Integer> cur, List<List<Integer>> result) {
        if (remaining == 0) { result.add(new ArrayList<>(cur)); return; }
        for (int i = start; i < candidates.length; i++) {
            if (i > start && candidates[i] == candidates[i - 1]) continue;
            if (candidates[i] > remaining) break;
            cur.add(candidates[i]);
            backtrack(candidates, remaining - candidates[i], i + 1, cur, result);
            cur.remove(cur.size() - 1);
        }
    }

    // APPROACH 2: Frequency Map Backtracking | O(2^n) time | O(n) space
    // EXPLAIN: Count element frequencies; for each unique element try 0..freq copies.
    // WHEN: Elegant when duplicates are heavy; multiplicities handled naturally.
    public List<List<Integer>> combinationSum2_freq(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<int[]> freq = new ArrayList<>();
        for (int num : candidates) {
            if (freq.isEmpty() || freq.get(freq.size() - 1)[0] != num)
                freq.add(new int[]{num, 1});
            else
                freq.get(freq.size() - 1)[1]++;
        }
        List<List<Integer>> result = new ArrayList<>();
        freqBacktrack(freq, target, 0, new ArrayList<>(), result);
        return result;
    }

    private void freqBacktrack(List<int[]> freq, int remaining, int idx,
                                List<Integer> cur, List<List<Integer>> result) {
        if (remaining == 0) { result.add(new ArrayList<>(cur)); return; }
        if (idx == freq.size()) return;
        int num = freq.get(idx)[0], count = freq.get(idx)[1];
        for (int times = 0; times <= count && num * times <= remaining; times++) {
            for (int j = 0; j < times; j++) cur.add(num);
            freqBacktrack(freq, remaining - num * times, idx + 1, cur, result);
            for (int j = 0; j < times; j++) cur.remove(cur.size() - 1);
        }
    }

    // APPROACH 3: Backtracking with Used Array | O(2^n) time | O(n) space
    // EXPLAIN: Sort array; skip nums[i]==nums[i-1] when nums[i-1] is unused (Permutations II style).
    // WHEN: Same dedup logic as Permutations II; useful when the used-array pattern is already familiar.
    public List<List<Integer>> combinationSum2_used(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> result = new ArrayList<>();
        boolean[] used = new boolean[candidates.length];
        backtrackUsed(candidates, target, 0, used, new ArrayList<>(), result);
        return result;
    }

    private void backtrackUsed(int[] candidates, int remaining, int start, boolean[] used,
                                List<Integer> cur, List<List<Integer>> result) {
        if (remaining == 0) { result.add(new ArrayList<>(cur)); return; }
        for (int i = start; i < candidates.length; i++) {
            if (used[i]) continue;
            if (i > 0 && candidates[i] == candidates[i - 1] && !used[i - 1]) continue;
            if (candidates[i] > remaining) break;
            used[i] = true; cur.add(candidates[i]);
            backtrackUsed(candidates, remaining - candidates[i], i + 1, used, cur, result);
            cur.remove(cur.size() - 1); used[i] = false;
        }
    }

    // APPROACH 4: Bit Manipulation with Set | O(2^n*n) time | O(2^n) space
    // EXPLAIN: Try all subsets via bitmask; collect those that sum to target; deduplicate via set.
    // WHEN: Brute-force fallback; easy to code when n is small.
    public List<List<Integer>> combinationSum2_bitmask(int[] candidates, int target) {
        Arrays.sort(candidates);
        Set<List<Integer>> seen = new HashSet<>();
        List<List<Integer>> result = new ArrayList<>();
        int n = candidates.length;
        for (int mask = 0; mask < (1 << n); mask++) {
            List<Integer> subset = new ArrayList<>();
            int sum = 0;
            for (int i = 0; i < n; i++) {
                if ((mask >> i & 1) == 1) { subset.add(candidates[i]); sum += candidates[i]; }
            }
            if (sum == target && seen.add(subset)) result.add(subset);
        }
        return result;
    }

    // APPROACH 5: Standard (entry point) | O(2^n) time | O(n) space
    // EXPLAIN: Standard canonical solution used in LeetCode submissions.
    // WHEN: Default choice when asked to implement combination sum ii.
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        return combinationSum2_backtrack(candidates, target);
    }
}

// Made with Bob
