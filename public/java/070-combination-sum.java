/*
 * LeetCode Problem #39: Combination Sum
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/combination-sum/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Backtracking with Reuse | O(N^(T/M)) time | O(T/M) space
    // EXPLAIN: For each candidate try including it (reuse allowed) by passing same index.
    // WHEN: Classic backtracking — simple and correct.
    public List<List<Integer>> combinationSum_backtrack(int[] candidates, int target) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(candidates, target, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] candidates, int remaining, int start,
                           List<Integer> cur, List<List<Integer>> result) {
        if (remaining == 0) { result.add(new ArrayList<>(cur)); return; }
        if (remaining < 0) return;
        for (int i = start; i < candidates.length; i++) {
            cur.add(candidates[i]);
            backtrack(candidates, remaining - candidates[i], i, cur, result);  // reuse: pass i
            cur.remove(cur.size() - 1);
        }
    }

    // APPROACH 2: Backtracking with Early Pruning | O(N^(T/M)) time | O(T/M) space
    // EXPLAIN: Sort candidates; break early when candidate exceeds remaining target.
    // WHEN: Better practical performance — prunes branches early for sorted input.
    public List<List<Integer>> combinationSum_pruned(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> result = new ArrayList<>();
        backtrackPruned(candidates, target, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrackPruned(int[] candidates, int remaining, int start,
                                  List<Integer> cur, List<List<Integer>> result) {
        if (remaining == 0) { result.add(new ArrayList<>(cur)); return; }
        for (int i = start; i < candidates.length; i++) {
            if (candidates[i] > remaining) break;
            cur.add(candidates[i]);
            backtrackPruned(candidates, remaining - candidates[i], i, cur, result);
            cur.remove(cur.size() - 1);
        }
    }

    // APPROACH 3: Include/Exclude Decision Tree | O(N^(T/M)) time | O(T/M) space
    // EXPLAIN: At each index explicitly choose include-again or move to next candidate.
    // WHEN: Illustrates the decision-tree structure most clearly.
    public List<List<Integer>> combinationSum_choice(int[] candidates, int target) {
        List<List<Integer>> result = new ArrayList<>();
        backtrackChoice(candidates, target, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrackChoice(int[] candidates, int remaining, int index,
                                  List<Integer> cur, List<List<Integer>> result) {
        if (remaining == 0) { result.add(new ArrayList<>(cur)); return; }
        if (index >= candidates.length || remaining < 0) return;
        cur.add(candidates[index]);
        backtrackChoice(candidates, remaining - candidates[index], index, cur, result);
        cur.remove(cur.size() - 1);
        backtrackChoice(candidates, remaining, index + 1, cur, result);
    }

    // APPROACH 4: Dynamic Programming | O(N*T*K) time | O(T*K) space
    // EXPLAIN: Build combinations bottom-up for each sum 0..target; deduplicate by sorting.
    // WHEN: Educational DP perspective; not optimal for large T.
    public List<List<Integer>> combinationSum_dp(int[] candidates, int target) {
        List<List<List<Integer>>> dp = new ArrayList<>();
        for (int i = 0; i <= target; i++) dp.add(new ArrayList<>());
        dp.get(0).add(new ArrayList<>());
        for (int s = 1; s <= target; s++) {
            for (int c : candidates) {
                if (c <= s) {
                    for (List<Integer> combo : dp.get(s - c)) {
                        List<Integer> newCombo = new ArrayList<>(combo);
                        newCombo.add(c);
                        Collections.sort(newCombo);
                        if (!dp.get(s).contains(newCombo)) dp.get(s).add(newCombo);
                    }
                }
            }
        }
        return dp.get(target);
    }

    // APPROACH 5: Standard (entry point — pruned backtracking) | O(N^(T/M)) time | O(T/M) space
    // EXPLAIN: Standard canonical solution used in LeetCode submissions.
    // WHEN: Default choice when asked to implement combination sum.
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        return combinationSum_pruned(candidates, target);
    }
}

// Made with Bob
