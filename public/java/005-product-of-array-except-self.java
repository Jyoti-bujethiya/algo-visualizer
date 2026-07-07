/*
 * LeetCode Problem #238: Product of Array Except Self
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/product-of-array-except-self/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Brute Force | O(n²) time | O(1) space
    // EXPLAIN: For each index, multiply every other element together in a nested loop.
    // WHEN: Tiny arrays only; illustrates why the O(n) approaches are needed.
    public int[] productExceptSelf_BruteForce(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        for (int i = 0; i < n; i++) {
            int product = 1;
            for (int j = 0; j < n; j++) {
                if (j != i) product *= nums[j];
            }
            result[i] = product;
        }
        return result;
    }

    // APPROACH 2: Division | O(n) time | O(1) space
    // EXPLAIN: Compute total product, then divide by each element; zeros handled via counting.
    // WHEN: Shown for completeness only — the problem explicitly forbids using division.
    public int[] productExceptSelf_Division(int[] nums) {
        int n = nums.length;
        int zeroCount = 0;
        long product = 1;
        for (int x : nums) {
            if (x == 0) zeroCount++;
            else product *= x;
        }
        int[] result = new int[n];
        for (int i = 0; i < n; i++) {
            if (zeroCount > 1)       result[i] = 0;
            else if (zeroCount == 1) result[i] = (nums[i] == 0) ? (int) product : 0;
            else                     result[i] = (int) (product / nums[i]);
        }
        return result;
    }

    // APPROACH 3: Prefix + Suffix Arrays | O(n) time | O(n) space
    // EXPLAIN: Build a prefix product array and a suffix product array, then multiply them.
    // WHEN: Clear and readable; use when extra memory is acceptable.
    public int[] productExceptSelf_PrefixSuffix(int[] nums) {
        int n = nums.length;
        int[] prefix = new int[n];
        int[] suffix = new int[n];
        int[] result = new int[n];

        prefix[0] = 1;
        for (int i = 1; i < n; i++) {
            prefix[i] = prefix[i - 1] * nums[i - 1];
        }

        suffix[n - 1] = 1;
        for (int i = n - 2; i >= 0; i--) {
            suffix[i] = suffix[i + 1] * nums[i + 1];
        }

        for (int i = 0; i < n; i++) {
            result[i] = prefix[i] * suffix[i];
        }
        return result;
    }

    // APPROACH 4: Optimized Space | O(n) time | O(1) space
    // EXPLAIN: Use the output array for the prefix pass, then accumulate suffix in a running variable.
    // WHEN: Optimal — meets the problem's no-extra-space constraint.
    public int[] productExceptSelf_ConstantSpace(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];

        result[0] = 1;
        for (int i = 1; i < n; i++) {
            result[i] = result[i - 1] * nums[i - 1];
        }

        int suffixProduct = 1;
        for (int i = n - 1; i >= 0; i--) {
            result[i] *= suffixProduct;
            suffixProduct *= nums[i];
        }
        return result;
    }
}

// Made with Bob
