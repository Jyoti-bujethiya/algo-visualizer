/*
 * LeetCode Problem #236: Lowest Common Ancestor of a Binary Tree
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/
 */
import java.util.*;

public class Solution {

    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // APPROACH 1: Recursive | O(n) time | O(h) space
    // EXPLAIN: If root is null/p/q return root; otherwise recurse both sides — if both sides return non-null, root is the LCA; otherwise propagate the non-null result.
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode left  = lowestCommonAncestor(root.left,  p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;
        return left != null ? left : right;
    }

    // APPROACH 2: Parent Pointers | O(n) time | O(n) space
    // EXPLAIN: BFS/DFS to build a parent-pointer map; trace p's ancestors into a set, then walk q's ancestors until finding one in the set.
    public TreeNode lowestCommonAncestorParents(TreeNode root, TreeNode p, TreeNode q) {
        Map<TreeNode, TreeNode> parent = new HashMap<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        parent.put(root, null);
        stack.push(root);
        while (!parent.containsKey(p) || !parent.containsKey(q)) {
            TreeNode node = stack.pop();
            if (node.left  != null) { parent.put(node.left,  node); stack.push(node.left);  }
            if (node.right != null) { parent.put(node.right, node); stack.push(node.right); }
        }
        Set<TreeNode> ancestors = new HashSet<>();
        while (p != null) { ancestors.add(p); p = parent.get(p); }
        while (!ancestors.contains(q)) q = parent.get(q);
        return q;
    }

    // APPROACH 3: Path Storage | O(n) time | O(n) space
    // EXPLAIN: Find the full root-to-p and root-to-q paths; the last common node on both paths is the LCA.
    public TreeNode lowestCommonAncestorPaths(TreeNode root, TreeNode p, TreeNode q) {
        List<TreeNode> pathP = new ArrayList<>(), pathQ = new ArrayList<>();
        findPath(root, p, pathP);
        findPath(root, q, pathQ);
        TreeNode lca = null;
        for (int i = 0; i < pathP.size() && i < pathQ.size(); i++) {
            if (pathP.get(i) == pathQ.get(i)) lca = pathP.get(i);
            else break;
        }
        return lca;
    }
    private boolean findPath(TreeNode root, TreeNode target, List<TreeNode> path) {
        if (root == null) return false;
        path.add(root);
        if (root == target) return true;
        if (findPath(root.left, target, path) || findPath(root.right, target, path)) return true;
        path.remove(path.size() - 1);
        return false;
    }
}

// Made with Bob
