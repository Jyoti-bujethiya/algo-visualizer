/*
 * LeetCode Problem #104: Maximum Depth of Binary Tree
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/maximum-depth-of-binary-tree/
 */
import java.util.*;

public class Solution {

    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // APPROACH 1: Recursive DFS | O(n) time | O(h) space
    // EXPLAIN: Depth = 1 + max(leftDepth, rightDepth); base case is null returning 0.
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }

    // APPROACH 2: BFS Level Order | O(n) time | O(w) space
    // EXPLAIN: BFS processes levels one at a time; the count of levels processed equals the maximum depth.
    public int maxDepthBFS(TreeNode root) {
        if (root == null) return 0;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        int depth = 0;
        while (!q.isEmpty()) {
            int size = q.size();
            depth++;
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                if (node.left  != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
        }
        return depth;
    }

    // APPROACH 3: Iterative DFS with Stack | O(n) time | O(h) space
    // EXPLAIN: Push (node, depth) pairs onto a stack; update maximum depth at each pop.
    public int maxDepthStack(TreeNode root) {
        if (root == null) return 0;
        Deque<Object[]> stack = new ArrayDeque<>();
        stack.push(new Object[]{root, 1});
        int maxDepth = 0;
        while (!stack.isEmpty()) {
            Object[] top = stack.pop();
            TreeNode node = (TreeNode) top[0];
            int depth = (int) top[1];
            maxDepth = Math.max(maxDepth, depth);
            if (node.left  != null) stack.push(new Object[]{node.left,  depth + 1});
            if (node.right != null) stack.push(new Object[]{node.right, depth + 1});
        }
        return maxDepth;
    }

    // APPROACH 4: Morris Traversal | O(n) time | O(1) space
    // EXPLAIN: Threaded-tree technique tracks current depth without recursion or stack; subtract steps when removing threads.
    public int maxDepthMorris(TreeNode root) {
        if (root == null) return 0;
        int maxDepth = 0, currDepth = 0;
        TreeNode curr = root;
        while (curr != null) {
            if (curr.left == null) {
                currDepth++;
                maxDepth = Math.max(maxDepth, currDepth);
                curr = curr.right;
            } else {
                TreeNode pred = curr.left;
                int steps = 1;
                while (pred.right != null && pred.right != curr) { pred = pred.right; steps++; }
                if (pred.right == null) {
                    currDepth++;
                    pred.right = curr;
                    curr = curr.left;
                } else {
                    pred.right = null;
                    currDepth -= steps;
                    curr = curr.right;
                }
            }
        }
        return maxDepth;
    }

    // APPROACH 5: Tail Recursion with Accumulator | O(n) time | O(h) space
    // EXPLAIN: Pass current depth as an accumulator; update a class-level max when traversing leaf branches.
    private int maxAcc = 0;

    public int maxDepthAccumulator(TreeNode root) {
        maxAcc = 0;
        helper(root, 1);
        return maxAcc;
    }

    private void helper(TreeNode node, int depth) {
        if (node == null) return;
        maxAcc = Math.max(maxAcc, depth);
        helper(node.left,  depth + 1);
        helper(node.right, depth + 1);
    }
}

// Made with Bob
