/*
 * LeetCode Problem #1: Two Sum
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/two-sum/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Brute Force | O(n²) time | O(1) space
    // EXPLAIN: Check every pair of indices to see if their values sum to target.
    // WHEN: Only for very small inputs where code simplicity is more important than speed.
    public int[] twoSum_BruteForce(int[] nums, int target) {
        int n = nums.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = i + 1; j < n; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{};
    }

    // APPROACH 2: Hash Map (One Pass) | O(n) time | O(n) space
    // EXPLAIN: Store each number's index in a map; look up the complement before inserting.
    // WHEN: Default go-to — optimal time complexity with a single pass.
    public int[] twoSum_HashMap(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }

    // APPROACH 3: Two Pointers (Sorted copy) | O(n log n) time | O(n) space
    // EXPLAIN: Sort a copy of the array with original indices, then converge two pointers.
    // WHEN: When input is already sorted or you want to avoid hash collisions.
    public int[] twoSum_TwoPointers(int[] nums, int target) {
        int n = nums.length;
        int[][] indexed = new int[n][2];
        for (int i = 0; i < n; i++) {
            indexed[i][0] = nums[i];
            indexed[i][1] = i;
        }
        Arrays.sort(indexed, (a, b) -> a[0] - b[0]);

        int left = 0, right = n - 1;
        while (left < right) {
            int sum = indexed[left][0] + indexed[right][0];
            if (sum == target) {
                return new int[]{indexed[left][1], indexed[right][1]};
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
        return new int[]{};
    }
}

// Made with Bob
