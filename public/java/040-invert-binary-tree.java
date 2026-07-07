/*
 * LeetCode Problem #226: Invert Binary Tree
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/invert-binary-tree/
 */
import java.util.*;

public class Solution {

    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // APPROACH 1: Recursive DFS (Post-order) | O(n) time | O(h) space
    // EXPLAIN: Recursively invert left and right subtrees, then swap the children of the current node.
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode left  = invertTree(root.left);
        TreeNode right = invertTree(root.right);
        root.left  = right;
        root.right = left;
        return root;
    }

    // APPROACH 2: Recursive DFS (Pre-order) | O(n) time | O(h) space
    // EXPLAIN: Swap children first, then recurse into the already-swapped subtrees.
    public TreeNode invertTreePreorder(TreeNode root) {
        if (root == null) return null;
        TreeNode tmp  = root.left;
        root.left  = root.right;
        root.right = tmp;
        invertTreePreorder(root.left);
        invertTreePreorder(root.right);
        return root;
    }

    // APPROACH 3: Iterative BFS | O(n) time | O(w) space
    // EXPLAIN: BFS with a queue; swap children of each dequeued node, then enqueue non-null children.
    public TreeNode invertTreeBFS(TreeNode root) {
        if (root == null) return null;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            TreeNode node = q.poll();
            TreeNode tmp  = node.left;
            node.left  = node.right;
            node.right = tmp;
            if (node.left  != null) q.offer(node.left);
            if (node.right != null) q.offer(node.right);
        }
        return root;
    }

    // APPROACH 4: Iterative DFS (Stack) | O(n) time | O(h) space
    // EXPLAIN: Use an explicit stack instead of the call stack; same logic as pre-order recursive.
    public TreeNode invertTreeStack(TreeNode root) {
        if (root == null) return null;
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            TreeNode tmp  = node.left;
            node.left  = node.right;
            node.right = tmp;
            if (node.left  != null) stack.push(node.left);
            if (node.right != null) stack.push(node.right);
        }
        return root;
    }

    // APPROACH 5: Morris Traversal | O(n) time | O(1) space
    // EXPLAIN: Threaded-tree traversal; swap children when visiting each node without extra memory.
    public TreeNode invertTreeMorris(TreeNode root) {
        TreeNode curr = root;
        while (curr != null) {
            if (curr.left == null) {
                TreeNode tmp = curr.left; curr.left = curr.right; curr.right = tmp;
                curr = curr.left;
            } else {
                TreeNode pred = curr.left;
                while (pred.right != null && pred.right != curr) pred = pred.right;
                if (pred.right == null) {
                    pred.right = curr;
                    curr = curr.left;
                } else {
                    pred.right = null;
                    TreeNode tmp = curr.left; curr.left = curr.right; curr.right = tmp;
                    curr = curr.left;
                }
            }
        }
        return root;
    }
}

// Made with Bob
