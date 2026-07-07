/*
 * LeetCode Problem #105: Construct Binary Tree from Preorder and Inorder Traversal
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
 */
import java.util.*;

public class Solution {

    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // APPROACH 1: Recursive with Hash Map | O(n) time | O(n) space
    // EXPLAIN: First element of preorder is always the root; find it in inorder (via O(1) map lookup) to split into left/right subtrees.
    private Map<Integer, Integer> inMap;
    private int preIdx;

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        inMap = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) inMap.put(inorder[i], i);
        preIdx = 0;
        return build(preorder, 0, inorder.length - 1);
    }
    private TreeNode build(int[] pre, int lo, int hi) {
        if (lo > hi) return null;
        TreeNode root = new TreeNode(pre[preIdx++]);
        int mid = inMap.get(root.val);
        root.left  = build(pre, lo,    mid - 1);
        root.right = build(pre, mid + 1, hi);
        return root;
    }

    // APPROACH 2: Recursive without Hash Map | O(n²) time | O(n) space
    // EXPLAIN: Same approach but finds the root in inorder with a linear scan; simpler but slower.
    public TreeNode buildTreeNoMap(int[] preorder, int[] inorder) {
        return buildNoMap(preorder, inorder, 0, preorder.length - 1, 0, inorder.length - 1);
    }
    private TreeNode buildNoMap(int[] pre, int[] in, int ps, int pe, int is, int ie) {
        if (ps > pe || is > ie) return null;
        int rootVal = pre[ps];
        TreeNode root = new TreeNode(rootVal);
        int mid = is;
        while (in[mid] != rootVal) mid++;
        int leftSize = mid - is;
        root.left  = buildNoMap(pre, in, ps + 1, ps + leftSize, is, mid - 1);
        root.right = buildNoMap(pre, in, ps + leftSize + 1, pe, mid + 1, ie);
        return root;
    }

    // APPROACH 3: Iterative with Stack | O(n) time | O(n) space
    // EXPLAIN: Process preorder elements; use an inorder pointer to decide left-child vs right-child attachment.
    public TreeNode buildTreeIterative(int[] preorder, int[] inorder) {
        if (preorder.length == 0) return null;
        TreeNode root = new TreeNode(preorder[0]);
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(root);
        int inIdx = 0;
        for (int i = 1; i < preorder.length; i++) {
            TreeNode node = new TreeNode(preorder[i]);
            TreeNode parent = stack.peek();
            if (parent.val != inorder[inIdx]) {
                parent.left = node;
            } else {
                while (!stack.isEmpty() && stack.peek().val == inorder[inIdx]) {
                    parent = stack.pop(); inIdx++;
                }
                parent.right = node;
            }
            stack.push(node);
        }
        return root;
    }

    // APPROACH 4: Slicing (Intuitive) | O(n²) time | O(n²) space
    // EXPLAIN: Create sub-arrays for each recursive call; most readable but least efficient.
    public TreeNode buildTreeSlicing(int[] preorder, int[] inorder) {
        if (preorder.length == 0) return null;
        int rootVal = preorder[0];
        int mid = 0;
        while (inorder[mid] != rootVal) mid++;
        TreeNode root = new TreeNode(rootVal);
        root.left  = buildTreeSlicing(Arrays.copyOfRange(preorder, 1, 1 + mid),
                                       Arrays.copyOfRange(inorder, 0, mid));
        root.right = buildTreeSlicing(Arrays.copyOfRange(preorder, 1 + mid, preorder.length),
                                       Arrays.copyOfRange(inorder, mid + 1, inorder.length));
        return root;
    }

    // APPROACH 5: Standard Solution (same as Approach 1) | O(n) time | O(n) space
    // EXPLAIN: Canonical entry point — delegates to the hash-map approach.
    public TreeNode buildTreeStandard(int[] preorder, int[] inorder) {
        return buildTree(preorder, inorder);
    }
}

// Made with Bob
