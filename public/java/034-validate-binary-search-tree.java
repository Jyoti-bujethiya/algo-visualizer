/*
 * LeetCode Problem #98: Validate Binary Search Tree
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/validate-binary-search-tree/
 */
import java.util.*;

public class Solution {

    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // APPROACH 1: Recursive with Range | O(n) time | O(h) space
    // EXPLAIN: Pass a valid [min, max] range to each node; narrow the range as we recurse into each subtree.
    public boolean isValidBST(TreeNode root) {
        return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }
    private boolean validate(TreeNode node, long lo, long hi) {
        if (node == null) return true;
        if (node.val <= lo || node.val >= hi) return false;
        return validate(node.left, lo, node.val) && validate(node.right, node.val, hi);
    }

    // APPROACH 2: Inorder Traversal | O(n) time | O(h) space
    // EXPLAIN: Inorder traversal of a valid BST produces strictly increasing values; track the previous node.
    private TreeNode prev = null;

    public boolean isValidBSTInorder(TreeNode root) {
        prev = null;
        return inorder(root);
    }
    private boolean inorder(TreeNode node) {
        if (node == null) return true;
        if (!inorder(node.left)) return false;
        if (prev != null && node.val <= prev.val) return false;
        prev = node;
        return inorder(node.right);
    }

    // APPROACH 3: Inorder with Array | O(n) time | O(n) space
    // EXPLAIN: Collect the full inorder sequence; verify it is strictly increasing.
    public boolean isValidBSTArray(TreeNode root) {
        List<Integer> vals = new ArrayList<>();
        collectInorder(root, vals);
        for (int i = 1; i < vals.size(); i++)
            if (vals.get(i) <= vals.get(i - 1)) return false;
        return true;
    }
    private void collectInorder(TreeNode node, List<Integer> vals) {
        if (node == null) return;
        collectInorder(node.left, vals);
        vals.add(node.val);
        collectInorder(node.right, vals);
    }

    // APPROACH 4: Iterative Inorder with Stack | O(n) time | O(h) space
    // EXPLAIN: Iterative inorder using an explicit stack; compare each value to the previous.
    public boolean isValidBSTIterative(TreeNode root) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode curr = root;
        TreeNode prevNode = null;
        while (curr != null || !stack.isEmpty()) {
            while (curr != null) { stack.push(curr); curr = curr.left; }
            curr = stack.pop();
            if (prevNode != null && curr.val <= prevNode.val) return false;
            prevNode = curr;
            curr = curr.right;
        }
        return true;
    }
}

// Made with Bob
