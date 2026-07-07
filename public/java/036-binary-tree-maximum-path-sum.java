/*
 * LeetCode Problem #124: Binary Tree Maximum Path Sum
 * Difficulty: Hard
 * Link: https://leetcode.com/problems/binary-tree-maximum-path-sum/
 */
import java.util.*;

public class Solution {

    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // APPROACH 1: Recursive DFS with Global Max | O(n) time | O(h) space
    // EXPLAIN: For each node compute the best single-arm gain (left or right, floored at 0); update a global max with the path through the node (left arm + node + right arm); return the best single arm to the parent.
    // WHEN: Only viable correct approach — the global max must be tracked separately because the maximum path may not pass through the root.
    private int maxSum;

    public int maxPathSum(TreeNode root) {
        maxSum = Integer.MIN_VALUE;
        gain(root);
        return maxSum;
    }

    private int gain(TreeNode node) {
        if (node == null) return 0;
        int leftGain  = Math.max(gain(node.left),  0);
        int rightGain = Math.max(gain(node.right), 0);
        maxSum = Math.max(maxSum, node.val + leftGain + rightGain);
        return node.val + Math.max(leftGain, rightGain);
    }

    // APPROACH 2: DFS returning pair (maxSingle, maxPath) | O(n) time | O(h) space
    // EXPLAIN: Return both the best single-arm extension and the best full path in the subtree, avoiding a class-level mutable field.
    public int maxPathSumPair(TreeNode root) {
        return dfsP(root)[1];
    }
    private int[] dfsP(TreeNode node) {
        if (node == null) return new int[]{0, Integer.MIN_VALUE};
        int[] left  = dfsP(node.left);
        int[] right = dfsP(node.right);
        int ls = left[0], lp = left[1], rs = right[0], rp = right[1];
        int maxSingle = node.val + Math.max(0, Math.max(ls, rs));
        int maxPath   = Math.max(Math.max(lp, rp),
                                  node.val + Math.max(0, ls) + Math.max(0, rs));
        return new int[]{maxSingle, maxPath};
    }

    // APPROACH 3: DFS with Detailed Comments | O(n) time | O(h) space
    // EXPLAIN: Same as Approach 1, rewritten with descriptive variable names to aid understanding.
    private int globalMax;

    public int maxPathSumDetailed(TreeNode root) {
        globalMax = Integer.MIN_VALUE;
        dfsDetailed(root);
        return globalMax;
    }
    private int dfsDetailed(TreeNode node) {
        if (node == null) return 0;
        int leftGain  = Math.max(dfsDetailed(node.left),  0);
        int rightGain = Math.max(dfsDetailed(node.right), 0);
        int priceNewPath = node.val + leftGain + rightGain;
        globalMax = Math.max(globalMax, priceNewPath);
        return node.val + Math.max(leftGain, rightGain);
    }

    // APPROACH 4: Iterative Post-order | O(n) time | O(n) space
    // EXPLAIN: Two-stack post-order traversal; process nodes bottom-up storing best single-arm gains in a map.
    public int maxPathSumIterative(TreeNode root) {
        if (root == null) return 0;
        int maxResult = Integer.MIN_VALUE;
        Map<TreeNode, Integer> best = new HashMap<>();
        best.put(null, 0);
        Deque<TreeNode> s1 = new ArrayDeque<>(), s2 = new ArrayDeque<>();
        s1.push(root);
        while (!s1.isEmpty()) {
            TreeNode node = s1.pop(); s2.push(node);
            if (node.left  != null) s1.push(node.left);
            if (node.right != null) s1.push(node.right);
        }
        while (!s2.isEmpty()) {
            TreeNode node = s2.pop();
            int lm = Math.max(0, best.getOrDefault(node.left,  0));
            int rm = Math.max(0, best.getOrDefault(node.right, 0));
            maxResult = Math.max(maxResult, node.val + lm + rm);
            best.put(node, node.val + Math.max(lm, rm));
        }
        return maxResult;
    }

    // APPROACH 5: Standard Solution (most common) | O(n) time | O(h) space
    // EXPLAIN: Canonical single-method solution matching LeetCode's expected signature; delegates to the DFS helper above.
    public int maxPathSumStandard(TreeNode root) {
        return maxPathSum(root);
    }
}

// Made with Bob
