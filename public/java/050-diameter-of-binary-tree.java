/*
 * LeetCode Problem #543: Diameter of Binary Tree
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/diameter-of-binary-tree/
 */
import java.util.*;

public class Solution {

    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // APPROACH 1: Recursive DFS with Global Max | O(n) time | O(h) space
    // EXPLAIN: For each node, the diameter through it is leftHeight + rightHeight; track the global maximum across all nodes while the recursion returns the single-arm height.
    // WHEN: Only practical approach; the diameter does not necessarily pass through the root so a global variable is required.
    private int maxDiameter = 0;

    public int diameterOfBinaryTree(TreeNode root) {
        maxDiameter = 0;
        height(root);
        return maxDiameter;
    }

    private int height(TreeNode node) {
        if (node == null) return 0;
        int left  = height(node.left);
        int right = height(node.right);
        maxDiameter = Math.max(maxDiameter, left + right);
        return 1 + Math.max(left, right);
    }

    // APPROACH 2: Iterative Post-order | O(n) time | O(n) space
    // EXPLAIN: Iterative post-order traversal using a stack; compute heights bottom-up in a map and update diameter on each pop.
    public int diameterOfBinaryTreeIterative(TreeNode root) {
        if (root == null) return 0;
        int maxDiam = 0;
        Map<TreeNode, Integer> memo = new HashMap<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode prev = null;
        stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.peek();
            boolean goDeeper = (prev == null || prev.left == node || prev.right == node);
            if (goDeeper) {
                if (node.right != null) stack.push(node.right);
                if (node.left  != null) stack.push(node.left);
            }
            if ((!node.left  || memo.containsKey(node.left)) &&
                (!node.right || memo.containsKey(node.right))) {
                int l = node.left  != null ? memo.get(node.left)  + 1 : 0;
                int r = node.right != null ? memo.get(node.right) + 1 : 0;
                maxDiam = Math.max(maxDiam, l + r);
                memo.put(node, Math.max(l, r));
                stack.pop(); prev = node;
            }
        }
        return maxDiam;
    }

    // APPROACH 3: Brute Force (recompute height per node) | O(n²) time | O(h) space
    // EXPLAIN: For each node recompute heights of both subtrees; maximum of through-root and sub-diameters.
    public int diameterOfBinaryTreeBrute(TreeNode root) {
        if (root == null) return 0;
        int throughRoot = heightBrute(root.left) + heightBrute(root.right);
        int leftDiam  = diameterOfBinaryTreeBrute(root.left);
        int rightDiam = diameterOfBinaryTreeBrute(root.right);
        return Math.max(throughRoot, Math.max(leftDiam, rightDiam));
    }
    private int heightBrute(TreeNode node) {
        if (node == null) return 0;
        return 1 + Math.max(heightBrute(node.left), heightBrute(node.right));
    }
}

// Made with Bob
