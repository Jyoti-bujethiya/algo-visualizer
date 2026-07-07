/*
 * LeetCode Problem #46: Permutations
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/permutations/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Backtracking with Swap | O(n!*n) time | O(n) space
    // EXPLAIN: Fix each element at start position by swapping, recurse, then swap back.
    // WHEN: Most space-efficient backtracking — no extra used-array needed.
    public List<List<Integer>> permute_swap(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrackSwap(nums, 0, result);
        return result;
    }

    private void backtrackSwap(int[] nums, int start, List<List<Integer>> result) {
        if (start == nums.length) {
            List<Integer> perm = new ArrayList<>();
            for (int n : nums) perm.add(n);
            result.add(perm);
            return;
        }
        for (int i = start; i < nums.length; i++) {
            int tmp = nums[start]; nums[start] = nums[i]; nums[i] = tmp;
            backtrackSwap(nums, start + 1, result);
            tmp = nums[start]; nums[start] = nums[i]; nums[i] = tmp;
        }
    }

    // APPROACH 2: Backtracking with Used Array | O(n!*n) time | O(n) space
    // EXPLAIN: Build permutation element-by-element tracking which elements are already used.
    // WHEN: More intuitive for beginners; easy to adapt to Permutations II.
    public List<List<Integer>> permute_used(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        boolean[] used = new boolean[nums.length];
        backtrackUsed(nums, used, new ArrayList<>(), result);
        return result;
    }

    private void backtrackUsed(int[] nums, boolean[] used, List<Integer> cur, List<List<Integer>> result) {
        if (cur.size() == nums.length) { result.add(new ArrayList<>(cur)); return; }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true; cur.add(nums[i]);
            backtrackUsed(nums, used, cur, result);
            cur.remove(cur.size() - 1); used[i] = false;
        }
    }

    // APPROACH 3: Iterative Insertion | O(n!*n) time | O(1) space
    // EXPLAIN: Insert each new element at every possible position in all existing permutations.
    // WHEN: No recursion; builds permutations layer by layer.
    public List<List<Integer>> permute_iterative(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        result.add(new ArrayList<>());
        for (int num : nums) {
            List<List<Integer>> next = new ArrayList<>();
            for (List<Integer> perm : result) {
                for (int i = 0; i <= perm.size(); i++) {
                    List<Integer> newPerm = new ArrayList<>(perm);
                    newPerm.add(i, num);
                    next.add(newPerm);
                }
            }
            result = next;
        }
        return result;
    }

    // APPROACH 4: Next Permutation (STL-style) | O(n!*n) time | O(1) space
    // EXPLAIN: Sort array, then repeatedly advance to next lexicographic permutation.
    // WHEN: Generates permutations in sorted order; elegant alternative to explicit backtracking.
    public List<List<Integer>> permute_nextPerm(int[] nums) {
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

    // APPROACH 5: Standard (entry point — uses swap backtracking) | O(n!*n) time | O(n) space
    // EXPLAIN: Standard canonical solution used in LeetCode submissions.
    // WHEN: Default choice when asked to implement permutations.
    public List<List<Integer>> permute(int[] nums) {
        return permute_swap(nums);
    }
}

// Made with Bob
