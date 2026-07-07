/*
 * LeetCode Problem #15: Three Sum
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/3sum/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Brute Force | O(n³ log n) time | O(n) space
    // EXPLAIN: Try every triple combination and collect unique triplets that sum to zero.
    // WHEN: Only for tiny inputs; illustrates the baseline before optimisation.
    public List<List<Integer>> threeSum_BruteForce(int[] nums) {
        int n = nums.length;
        Set<List<Integer>> result = new HashSet<>();
        for (int i = 0; i < n - 2; i++) {
            for (int j = i + 1; j < n - 1; j++) {
                for (int k = j + 1; k < n; k++) {
                    if (nums[i] + nums[j] + nums[k] == 0) {
                        List<Integer> triplet = Arrays.asList(nums[i], nums[j], nums[k]);
                        Collections.sort(triplet);
                        result.add(triplet);
                    }
                }
            }
        }
        return new ArrayList<>(result);
    }

    // APPROACH 2: HashMap | O(n²) time | O(n) space
    // EXPLAIN: Fix one element; use a hash set to find the complement pair among remaining elements.
    // WHEN: Demonstrates hash-based triplet finding; uses extra space compared to two-pointer approach.
    public List<List<Integer>> threeSum_HashMap(int[] nums) {
        Arrays.sort(nums);
        Set<List<Integer>> result = new HashSet<>();
        int n = nums.length;
        for (int i = 0; i < n - 2; i++) {
            Set<Integer> seen = new HashSet<>();
            int target = -nums[i];
            for (int j = i + 1; j < n; j++) {
                int complement = target - nums[j];
                if (seen.contains(complement)) {
                    List<Integer> triplet = Arrays.asList(nums[i], complement, nums[j]);
                    Collections.sort(triplet);
                    result.add(triplet);
                }
                seen.add(nums[j]);
            }
        }
        return new ArrayList<>(result);
    }

    // APPROACH 3: Two Pointers | O(n²) time | O(1) space
    // EXPLAIN: Sort the array, fix one element, then use two pointers to find the other two.
    // WHEN: Preferred approach — eliminates duplicates cleanly without extra memory.
    public List<List<Integer>> threeSum_TwoPointers(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(nums);
        int n = nums.length;

        for (int i = 0; i < n - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int left = i + 1, right = n - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum == 0) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (sum < 0) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        return result;
    }

    // APPROACH 4: Optimized Two Pointers | O(n²) time | O(1) space
    // EXPLAIN: Extends two pointers with early-exit bounds checks that skip unpromising pivot values.
    // WHEN: Best practical runtime — adds constant-time pruning on top of the two-pointer approach.
    public List<List<Integer>> threeSum_Optimized(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(nums);
        int n = nums.length;

        for (int i = 0; i < n - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            if (nums[i] > 0) break;
            if (nums[i] + nums[i + 1] + nums[i + 2] > 0) break;
            if (nums[i] + nums[n - 2] + nums[n - 1] < 0) continue;

            int left = i + 1, right = n - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum == 0) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (sum < 0) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        return result;
    }
}

// Made with Bob
