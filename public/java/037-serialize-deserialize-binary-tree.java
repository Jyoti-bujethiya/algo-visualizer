/*
 * LeetCode Problem #297: Serialize and Deserialize Binary Tree
 * Difficulty: Hard
 * Link: https://leetcode.com/problems/serialize-and-deserialize-binary-tree/
 */
import java.util.*;

public class Solution {

    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // ─── APPROACH 1: Pre-order DFS ───────────────────────────────────────────
    // APPROACH 1: Pre-order DFS | O(n) time | O(n) space
    // EXPLAIN: Serialize with pre-order DFS, marking nulls as "null"; deserialize by consuming a string-stream token by token.
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        serHelper(root, sb);
        return sb.toString();
    }
    private void serHelper(TreeNode node, StringBuilder sb) {
        if (node == null) { sb.append("null,"); return; }
        sb.append(node.val).append(',');
        serHelper(node.left,  sb);
        serHelper(node.right, sb);
    }
    public TreeNode deserialize(String data) {
        Queue<String> q = new LinkedList<>(Arrays.asList(data.split(",")));
        return desHelper(q);
    }
    private TreeNode desHelper(Queue<String> q) {
        String val = q.poll();
        if ("null".equals(val)) return null;
        TreeNode node = new TreeNode(Integer.parseInt(val));
        node.left  = desHelper(q);
        node.right = desHelper(q);
        return node;
    }

    // APPROACH 2: Level-order BFS | O(n) time | O(n) space
    // EXPLAIN: BFS serializes nodes level by level; deserialization reconstructs by assigning children to each dequeued node.
    public String serializeBFS(TreeNode root) {
        if (root == null) return "";
        StringBuilder sb = new StringBuilder();
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            TreeNode node = q.poll();
            if (node == null) { sb.append("null,"); continue; }
            sb.append(node.val).append(',');
            q.offer(node.left);
            q.offer(node.right);
        }
        return sb.toString();
    }
    public TreeNode deserializeBFS(String data) {
        if (data.isEmpty()) return null;
        String[] tokens = data.split(",");
        TreeNode root = new TreeNode(Integer.parseInt(tokens[0]));
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        int i = 1;
        while (!q.isEmpty()) {
            TreeNode node = q.poll();
            if (i < tokens.length && !tokens[i].equals("null")) {
                node.left = new TreeNode(Integer.parseInt(tokens[i])); q.offer(node.left);
            }
            i++;
            if (i < tokens.length && !tokens[i].equals("null")) {
                node.right = new TreeNode(Integer.parseInt(tokens[i])); q.offer(node.right);
            }
            i++;
        }
        return root;
    }

    // APPROACH 3: Pre-order with Space Separator | O(n) time | O(n) space
    // EXPLAIN: Variation of Approach 1 using '#' for null and space as delimiter; demonstrates flexible encoding choices.
    public String serializeSpace(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        spaceHelper(root, sb);
        return sb.toString().trim();
    }
    private void spaceHelper(TreeNode node, StringBuilder sb) {
        if (node == null) { sb.append("# "); return; }
        sb.append(node.val).append(' ');
        spaceHelper(node.left,  sb);
        spaceHelper(node.right, sb);
    }
    public TreeNode deserializeSpace(String data) {
        Queue<String> q = new LinkedList<>(Arrays.asList(data.split("\\s+")));
        return spaceDeHelper(q);
    }
    private TreeNode spaceDeHelper(Queue<String> q) {
        String val = q.poll();
        if (val == null || "#".equals(val)) return null;
        TreeNode node = new TreeNode(Integer.parseInt(val));
        node.left  = spaceDeHelper(q);
        node.right = spaceDeHelper(q);
        return node;
    }

    // APPROACH 4: Compact Parentheses | O(n) time | O(n) space
    // EXPLAIN: Encode as "val(left)(right)"; omit right-branch parens when right is null; parse with a mutable index.
    public String serializeCompact(TreeNode root) {
        if (root == null) return "";
        String result = String.valueOf(root.val);
        if (root.left != null || root.right != null)
            result += "(" + serializeCompact(root.left) + ")";
        if (root.right != null)
            result += "(" + serializeCompact(root.right) + ")";
        return result;
    }
    private int[] idx = {0};
    public TreeNode deserializeCompact(String data) {
        idx[0] = 0;
        return compactHelper(data);
    }
    private TreeNode compactHelper(String data) {
        if (idx[0] >= data.length()) return null;
        int start = idx[0];
        if (data.charAt(idx[0]) == '-') idx[0]++;
        while (idx[0] < data.length() && Character.isDigit(data.charAt(idx[0]))) idx[0]++;
        if (start == idx[0]) return null;
        TreeNode node = new TreeNode(Integer.parseInt(data.substring(start, idx[0])));
        if (idx[0] < data.length() && data.charAt(idx[0]) == '(') {
            idx[0]++; node.left  = compactHelper(data); idx[0]++;
        }
        if (idx[0] < data.length() && data.charAt(idx[0]) == '(') {
            idx[0]++; node.right = compactHelper(data); idx[0]++;
        }
        return node;
    }
}

// Made with Bob
