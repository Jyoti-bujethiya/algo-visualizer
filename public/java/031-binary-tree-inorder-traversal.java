/*
 * LeetCode Problem #94: Binary Tree Inorder Traversal
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/binary-tree-inorder-traversal/
 */
import java.util.*;

public class Solution {

    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // APPROACH 1: Recursive | O(n) time | O(h) space
    // EXPLAIN: Recursively traverse left subtree, visit root, traverse right subtree.
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        dfs(root, result);
        return result;
    }
    private void dfs(TreeNode node, List<Integer> result) {
        if (node == null) return;
        dfs(node.left, result);
        result.add(node.val);
        dfs(node.right, result);
    }

    // APPROACH 2: Iterative with Stack | O(n) time | O(h) space
    // EXPLAIN: Push all left nodes to stack; pop to record and then process right subtree.
    public List<Integer> inorderTraversalIterative(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode curr = root;
        while (curr != null || !stack.isEmpty()) {
            while (curr != null) { stack.push(curr); curr = curr.left; }
            curr = stack.pop();
            result.add(curr.val);
            curr = curr.right;
        }
        return result;
    }

    // APPROACH 3: Morris Traversal | O(n) time | O(1) space
    // EXPLAIN: Use threaded-tree technique to traverse without recursion or stack; create/remove threads to predecessors.
    public List<Integer> inorderTraversalMorris(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        TreeNode curr = root;
        while (curr != null) {
            if (curr.left == null) {
                result.add(curr.val);
                curr = curr.right;
            } else {
                TreeNode pred = curr.left;
                while (pred.right != null && pred.right != curr) pred = pred.right;
                if (pred.right == null) {
                    pred.right = curr;
                    curr = curr.left;
                } else {
                    pred.right = null;
                    result.add(curr.val);
                    curr = curr.right;
                }
            }
        }
        return result;
    }

    // APPROACH 4: Iterative with Color Marking | O(n) time | O(h) space
    // EXPLAIN: Stack of (node, visited) pairs; on first encounter push right/root-marked/left; on second (marked) encounter record the value.
    public List<Integer> inorderTraversalColor(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;
        Deque<Object[]> stack = new ArrayDeque<>();
        stack.push(new Object[]{root, false});
        while (!stack.isEmpty()) {
            Object[] top = stack.pop();
            TreeNode node = (TreeNode) top[0];
            boolean visited = (boolean) top[1];
            if (node == null) continue;
            if (visited) {
                result.add(node.val);
            } else {
                stack.push(new Object[]{node.right, false});
                stack.push(new Object[]{node, true});
                stack.push(new Object[]{node.left, false});
            }
        }
        return result;
    }
}

// Made with Bob
