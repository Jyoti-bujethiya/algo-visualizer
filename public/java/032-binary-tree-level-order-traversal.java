/*
 * LeetCode Problem #102: Binary Tree Level Order Traversal
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/binary-tree-level-order-traversal/
 */
import java.util.*;

public class Solution {

    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // APPROACH 1: BFS with Queue | O(n) time | O(w) space
    // EXPLAIN: Standard BFS; snapshot queue size at start of each level iteration to group nodes by level.
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left  != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            result.add(level);
        }
        return result;
    }

    // APPROACH 2: DFS with Level Tracking | O(n) time | O(h) space
    // EXPLAIN: Preorder DFS passes the current depth; create a new sub-list for each newly discovered depth.
    public List<List<Integer>> levelOrderDFS(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        dfs(root, 0, result);
        return result;
    }
    private void dfs(TreeNode node, int level, List<List<Integer>> result) {
        if (node == null) return;
        if (level >= result.size()) result.add(new ArrayList<>());
        result.get(level).add(node.val);
        dfs(node.left,  level + 1, result);
        dfs(node.right, level + 1, result);
    }

    // APPROACH 3: BFS with Null Markers | O(n) time | O(w) space
    // EXPLAIN: A null sentinel in the queue marks level boundaries; after each null push another if the queue is non-empty.
    public List<List<Integer>> levelOrderNullMarkers(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        q.offer(null);
        List<Integer> level = new ArrayList<>();
        while (!q.isEmpty()) {
            TreeNode node = q.poll();
            if (node == null) {
                result.add(new ArrayList<>(level));
                level.clear();
                if (!q.isEmpty()) q.offer(null);
            } else {
                level.add(node.val);
                if (node.left  != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
        }
        return result;
    }

    // APPROACH 4: Two Queues | O(n) time | O(w) space
    // EXPLAIN: Maintain distinct current-level and next-level queues; swap them after processing each level.
    public List<List<Integer>> levelOrderTwoQueues(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        Queue<TreeNode> current = new LinkedList<>(), next = new LinkedList<>();
        current.offer(root);
        while (!current.isEmpty()) {
            List<Integer> level = new ArrayList<>();
            while (!current.isEmpty()) {
                TreeNode node = current.poll();
                level.add(node.val);
                if (node.left  != null) next.offer(node.left);
                if (node.right != null) next.offer(node.right);
            }
            result.add(level);
            Queue<TreeNode> tmp = current; current = next; next = tmp;
        }
        return result;
    }
}

// Made with Bob
