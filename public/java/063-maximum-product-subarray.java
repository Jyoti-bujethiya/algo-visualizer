/*
 * LeetCode Problem #152: Maximum Product Subarray
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/maximum-product-subarray/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Brute Force | O(n²) time | O(1) space
    // EXPLAIN: Try every subarray start/end pair and track the running product.
    // WHEN: Use only to verify correctness or when n is tiny (≤100).

    public int maxProduct_brute(int[] nums) {
        int result = nums[0];
        for (int i = 0; i < nums.length; i++) {
            int product = 1;
            for (int j = i; j < nums.length; j++) {
                product *= nums[j];
                result = Math.max(result, product);
            }
        }
        return result;
    }

    // APPROACH 2: DP tracking min and max | O(n) time | O(1) space
    // EXPLAIN: At each index keep both the max and min product ending here; a negative flips min↔max.
    // WHEN: Use as the optimal solution — handles negative numbers elegantly in one pass.

    public int maxProduct(int[] nums) {
        int maxProd = nums[0], minProd = nums[0], result = nums[0];
        for (int i = 1; i < nums.length; i++) {
            int num = nums[i];
            int tempMax = Math.max(num, Math.max(maxProd * num, minProd * num));
            int tempMin = Math.min(num, Math.min(maxProd * num, minProd * num));
            maxProd = tempMax;
            minProd = tempMin;
            result = Math.max(result, maxProd);
        }
        return result;
    }

    // APPROACH 3: Kadane Variant (swap on negative) | O(n) time | O(1) space
    // EXPLAIN: When element is negative, swap maxProd and minProd before updating.
    // WHEN: Cleaner swap-based formulation of the same O(1) DP logic.

    public int maxProduct_kadane(int[] nums) {
        int maxProd = nums[0], minProd = nums[0], result = nums[0];
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] < 0) { int tmp = maxProd; maxProd = minProd; minProd = tmp; }
            maxProd = Math.max(nums[i], maxProd * nums[i]);
            minProd = Math.min(nums[i], minProd * nums[i]);
            result  = Math.max(result, maxProd);
        }
        return result;
    }

    // APPROACH 4: Two-Pass (Left→Right and Right→Left) | O(n) time | O(1) space
    // EXPLAIN: Scan each direction tracking running product; reset on zero; take overall max.
    // WHEN: Elegant alternative that handles zeros and negatives via dual pass.

    public int maxProduct_twoPass(int[] nums) {
        int n = nums.length, result = nums[0], product = 1;
        // Left to right
        for (int i = 0; i < n; i++) {
            product *= nums[i];
            result   = Math.max(result, product);
            if (product == 0) product = 1;
        }
        // Right to left
        product = 1;
        for (int i = n - 1; i >= 0; i--) {
            product *= nums[i];
            result   = Math.max(result, product);
            if (product == 0) product = 1;
        }
        return result;
    }

    // APPROACH 5: Divide by Zeros | O(n) time | O(1) space
    // EXPLAIN: Split array at zeros; for each non-zero segment apply DP tracking min/max.
    // WHEN: Makes the zero-handling logic explicit; useful for understanding edge cases.

    public int maxProduct_divideZeros(int[] nums) {
        int result = nums[0];
        int maxP = nums[0], minP = nums[0];
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] == 0) {
                result = Math.max(result, 0);
                maxP = 0; minP = 0;
            } else {
                int newMax = Math.max(nums[i], Math.max(maxP * nums[i], minP * nums[i]));
                int newMin = Math.min(nums[i], Math.min(maxP * nums[i], minP * nums[i]));
                maxP = newMax; minP = newMin;
                result = Math.max(result, maxP);
            }
        }
        return result;
    }
}

// Made with Bob
