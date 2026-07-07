/*
 * LeetCode Problem #230: Kth Smallest Element in a BST
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/kth-smallest-element-in-a-bst/
 */
import java.util.*;

public class Solution {

    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    // APPROACH 1: Recursive Inorder | O(k) time | O(h) space
    // EXPLAIN: Inorder traversal of a BST yields sorted order; stop when k nodes have been visited.
    private int count, result;

    public int kthSmallest(TreeNode root, int k) {
        count = 0;
        inorder(root, k);
        return result;
    }
    private void inorder(TreeNode node, int k) {
        if (node == null || count >= k) return;
        inorder(node.left, k);
        if (++count == k) { result = node.val; return; }
        inorder(node.right, k);
    }

    // APPROACH 2: Iterative Inorder | O(h + k) time | O(h) space
    // EXPLAIN: Stack-based inorder traversal; pop nodes one by one and return when k-th is reached.
    public int kthSmallestIterative(TreeNode root, int k) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode curr = root;
        int cnt = 0;
        while (curr != null || !stack.isEmpty()) {
            while (curr != null) { stack.push(curr); curr = curr.left; }
            curr = stack.pop();
            if (++cnt == k) return curr.val;
            curr = curr.right;
        }
        return -1;
    }

    // APPROACH 3: Store Inorder in Array | O(n) time | O(n) space
    // EXPLAIN: Collect all values via inorder traversal; return the element at index k-1.
    public int kthSmallestArray(TreeNode root, int k) {
        List<Integer> vals = new ArrayList<>();
        collectInorder(root, vals);
        return vals.get(k - 1);
    }
    private void collectInorder(TreeNode node, List<Integer> vals) {
        if (node == null) return;
        collectInorder(node.left, vals);
        vals.add(node.val);
        collectInorder(node.right, vals);
    }

    // APPROACH 4: Morris Traversal | O(n) time | O(1) space
    // EXPLAIN: Threaded-tree inorder; count nodes without extra memory.
    public int kthSmallestMorris(TreeNode root, int k) {
        TreeNode curr = root;
        int cnt = 0;
        while (curr != null) {
            if (curr.left == null) {
                if (++cnt == k) return curr.val;
                curr = curr.right;
            } else {
                TreeNode pred = curr.left;
                while (pred.right != null && pred.right != curr) pred = pred.right;
                if (pred.right == null) {
                    pred.right = curr; curr = curr.left;
                } else {
                    pred.right = null;
                    if (++cnt == k) return curr.val;
                    curr = curr.right;
                }
            }
        }
        return -1;
    }

    // APPROACH 5: Augmented BST (Follow-up) | O(h) time | O(n) space
    // EXPLAIN: Annotate each node with its left-subtree size; binary-search for k in O(h) per query.
    static class AugNode {
        int val, leftSize;
        AugNode left, right;
        AugNode(int v) { val = v; }
    }

    public int kthSmallestAugmented(TreeNode root, int k) {
        AugNode aug = buildAug(root);
        return searchAug(aug, k);
    }
    private int countNodes(AugNode node) {
        if (node == null) return 0;
        return 1 + countNodes(node.left) + countNodes(node.right);
    }
    private AugNode buildAug(TreeNode node) {
        if (node == null) return null;
        AugNode aug = new AugNode(node.val);
        aug.left  = buildAug(node.left);
        aug.right = buildAug(node.right);
        aug.leftSize = countNodes(aug.left);
        return aug;
    }
    private int searchAug(AugNode node, int k) {
        if (k <= node.leftSize)        return searchAug(node.left,  k);
        if (k == node.leftSize + 1)    return node.val;
        return searchAug(node.right, k - node.leftSize - 1);
    }

    // APPROACH 6: Standard Solution | O(h + k) time | O(h) space
    // EXPLAIN: Canonical iterative inorder — same as Approach 2; matches typical LeetCode submission.
    public int kthSmallestStandard(TreeNode root, int k) {
        return kthSmallestIterative(root, k);
    }
}

// Made with Bob
