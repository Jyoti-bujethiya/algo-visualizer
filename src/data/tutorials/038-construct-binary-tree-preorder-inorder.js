/**
 * Tutorial content for #038 — Construct Binary Tree from Preorder and Inorder Traversal
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given two integer arrays — preorder (root → left → right) and inorder (left → root → right) of the same binary tree — reconstruct the tree and return its root. All values are unique.`,
    example: `preorder = [3, 9, 20, 15, 7]\ninorder  = [9, 3, 15, 20, 7]\n→ preorder[0]=3 is root.\n→ In inorder, 3 is at index 1: left subtree = [9], right subtree = [15, 20, 7].\n→ Recurse: left subtree root=9, right subtree root=20.\n✅ Answer: tree [3, 9, 20, null, null, 15, 7]`,
    keyInsight: `The first element of preorder is always the root. Find that value in inorder — everything to its left is the left subtree, everything to its right is the right subtree. Recurse on each part with the corresponding slices of both arrays.`,
  },

  approaches: {
    'Recursive with Hash Map': {
      intuition: `Build a hash map from value → inorder index so you can find the root's position in O(1) instead of O(n). Then recursively build the tree: the first preorder element is the root, its inorder index splits the left and right subtrees, and the number of left elements tells you how to slice the preorder array for each subtree.`,
      steps: [
        `Build a map: inorderMap[value] = index for every element in inorder.`,
        `Define build(preStart, preEnd, inStart, inEnd) using indices into the original arrays.`,
        `If preStart > preEnd, return null (empty subtree).`,
        `Root value = preorder[preStart]. Create the root node.`,
        `Look up rootInorderIdx = inorderMap[rootVal].`,
        `Left subtree size = rootInorderIdx - inStart.`,
        `Recurse: root.left = build(preStart+1, preStart+leftSize, inStart, rootInorderIdx-1).`,
        `Recurse: root.right = build(preStart+leftSize+1, preEnd, rootInorderIdx+1, inEnd).`,
        `Return root.`,
      ],
      example: `preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]\ninorderMap: {9:0, 3:1, 15:2, 20:3, 7:4}\n\nbuild(0,4, 0,4): root=3, rootIdx=1, leftSize=1\n  left=build(1,1, 0,0): root=9, rootIdx=0, leftSize=0\n    left=build(2,1,...) → null\n    right=build(2,1,...) → null\n    return node(9)\n  right=build(2,4, 2,4): root=20, rootIdx=3, leftSize=1\n    left=build(3,3, 2,2): root=15 → node(15)\n    right=build(4,4, 4,4): root=7  → node(7)\n    return node(20)\n  return node(3)\n✅ Answer: tree [3,9,20,null,null,15,7]`,
      keyInsight: `O(n) time (O(1) lookup per node), O(n) space for the hash map. The hash map eliminates repeated linear searches through inorder, making this the optimal approach.`,
    },

    'Recursive without Hash Map': {
      intuition: `Same idea but without the hash map. For each recursive call, do a linear scan through the current inorder slice to find the root's index. Simpler to implement from scratch, but each lookup is O(n), making the overall algorithm O(n²) in the worst case (e.g., a skewed tree).`,
      steps: [
        `Define build(preorder, inorder) where each call works on sub-arrays.`,
        `If either array is empty, return null.`,
        `Root = preorder[0]. Create root node.`,
        `Find rootIdx = index of root.val in inorder (linear scan).`,
        `Left inorder slice = inorder[0..rootIdx-1], left preorder slice = preorder[1..1+rootIdx-1].`,
        `Right inorder slice = inorder[rootIdx+1..end], right preorder slice = preorder[1+rootIdx..end].`,
        `Recurse: root.left = build(leftPre, leftIn), root.right = build(rightPre, rightIn).`,
      ],
      example: `preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]\n\nbuild([3,9,20,15,7],[9,3,15,20,7]): root=3, rootIdx=1\n  left: pre=[9], in=[9] → root=9, no children → node(9)\n  right: pre=[20,15,7], in=[15,20,7] → root=20, rootIdx=1\n    left: pre=[15], in=[15] → node(15)\n    right: pre=[7], in=[7]  → node(7)\n    return node(20)\nreturn node(3)\n✅ Answer: tree [3,9,20,null,null,15,7]`,
      keyInsight: `O(n²) time in the worst case (linear search per node), O(n) space. Easier to code for an initial solution or when n is small. Use the hash map version for large inputs or production code.`,
    },

    'Iterative with Stack': {
      intuition: `Process preorder elements one by one. Keep a stack of nodes whose left subtrees are still being built. A separate inorder pointer tells you when to stop attaching left children and switch to attaching a right child. This avoids recursion and runs in O(n) time without the hash map.`,
      steps: [
        `Create root from preorder[0] and push it onto the stack. Set inIdx = 0.`,
        `For each subsequent preorder element (i from 1 to n-1): create node = new TreeNode(preorder[i]).`,
        `If stack.top().val !== inorder[inIdx]: attach node as the LEFT child of stack.top().`,
        `Otherwise: pop nodes off the stack while stack is non-empty and stack.top().val === inorder[inIdx], advancing inIdx each time. The last popped node becomes parent; attach node as its RIGHT child.`,
        `Push node onto the stack. Repeat until all preorder elements are processed.`,
      ],
      example: `preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]\n\nCreate root=3, stack=[3], inIdx=0\ni=1 (val=9): top=3, inorder[0]=9. 3≠9 → left. 3.left=9. stack=[3,9]\ni=2 (val=20): top=9, inorder[0]=9. 9==9 → pop 9(inIdx=1), top=3, inorder[1]=3. 3==3 → pop 3(inIdx=2). Stack empty. parent=3. 3.right=20. stack=[20]\ni=3 (val=15): top=20, inorder[2]=15. 20≠15 → left. 20.left=15. stack=[20,15]\ni=4 (val=7): top=15, inorder[2]=15. 15==15 → pop 15(inIdx=3), top=20, inorder[3]=20. 20==20 → pop 20(inIdx=4). parent=20. 20.right=7. stack=[7]\n✅ Answer: tree [3,9,20,null,null,15,7]`,
      keyInsight: `O(n) time, O(n) space. The most efficient iterative approach — no hash map needed. The inorder pointer is the key: it signals the boundary between left-child attachment and right-child attachment.`,
    },

    'Slicing (Intuitive)': {
      intuition: `The most readable approach: at each step, create actual sub-arrays for the left and right recursive calls rather than tracking index ranges. The first element of the preorder slice is always the root; find it in the inorder slice to compute the split. Simple to understand but creates many intermediate arrays.`,
      steps: [
        `If preorder is empty, return null.`,
        `rootVal = preorder[0]. Create root node.`,
        `Scan inorder for rootVal to find mid (its index).`,
        `Left inorder slice = inorder[0..mid-1]; left preorder slice = preorder[1..1+mid-1].`,
        `Right inorder slice = inorder[mid+1..end]; right preorder slice = preorder[1+mid..end].`,
        `root.left = buildTreeSlicing(leftPre, leftIn); root.right = buildTreeSlicing(rightPre, rightIn). Return root.`,
      ],
      example: `preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]\n\nbuildTreeSlicing([3,9,20,15,7],[9,3,15,20,7]):\n  root=3, mid=1 (index of 3 in inorder)\n  left:  pre=[9],      in=[9]       → root=9, no children → node(9)\n  right: pre=[20,15,7], in=[15,20,7] → root=20, mid=1\n    left:  pre=[15], in=[15] → node(15)\n    right: pre=[7],  in=[7]  → node(7)\n  return node(3)\n✅ Answer: tree [3,9,20,null,null,15,7]`,
      keyInsight: `O(n²) time (linear scan + array copying per node), O(n²) space (intermediate arrays). Least efficient but easiest to read and write from scratch. Good for understanding the algorithm before optimising.`,
    },

    'Standard Solution (same as Approach 1)': {
      intuition: `The canonical LeetCode submission — the hash map recursive approach packaged as the required public method buildTree(). It is functionally identical to Approach 1. Shown here to make explicit that the "standard" answer is simply the optimal recursive-with-hashmap version.`,
      steps: [
        `Build a hash map inorderMap: value → index for all inorder elements.`,
        `Call build(preorder, 0, inorder.length - 1) with a shared preorder index starting at 0.`,
        `build(pre, lo, hi): if lo > hi return null. Root = pre[preIdx++]. Mid = inorderMap[root.val].`,
        `root.left = build(pre, lo, mid-1). root.right = build(pre, mid+1, hi). Return root.`,
      ],
      example: `preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]\ninorderMap={9:0,3:1,15:2,20:3,7:4}\n\nbuild(pre,0,4): root=pre[0]=3, mid=1. preIdx=1\n  left  build(pre,0,0): root=pre[1]=9, mid=0. preIdx=2 → node(9)\n  right build(pre,2,4): root=pre[2]=20, mid=3. preIdx=3\n    left  build(pre,2,2): root=pre[3]=15 → node(15)\n    right build(pre,4,4): root=pre[4]=7  → node(7)\n  return node(3)\n✅ Answer: tree [3,9,20,null,null,15,7]`,
      keyInsight: `O(n) time, O(n) space. This is the solution you submit to LeetCode and write in interviews. The hash map makes each root lookup O(1), yielding linear overall time.`,
    },
  },
}
