/**
 * Tutorial content for #039 — Kth Smallest Element in a BST
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given the root of a Binary Search Tree (BST) and an integer k, return the kth smallest value among all node values in the BST (1-indexed, so k=1 means the smallest).`,
    example: `Tree: root=3, left=1, right=4, 1.right=2, k=1\nInorder: 1, 2, 3, 4\n→ The 1st smallest element is 1.\n✅ Answer: 1`,
    keyInsight: `In a BST, an inorder traversal (left → root → right) always visits nodes in ascending sorted order. So the kth smallest element is simply the kth value visited during inorder traversal.`,
  },

  approaches: {
    'Recursive Inorder': {
      intuition: `Perform an inorder traversal recursively. Use a counter that increments each time you visit a node. When the counter reaches k, you have found your answer — store it and stop recursing further.`,
      steps: [
        `Initialise a count = 0 and result = null (shared state or closure variable).`,
        `Define inorder(node): if node is null or result is already found, return.`,
        `Recurse on node.left.`,
        `Increment count. If count === k, set result = node.val and return.`,
        `Recurse on node.right.`,
        `Call inorder(root) and return result.`,
      ],
      example: `Tree: root=3, 3.left=1, 3.right=4, 1.right=2. k=1\n\ninorder(3) → inorder(1) → inorder(null) → count=1, k=1 → result=1 ✓\n(Stop recursing early)\n✅ Answer: 1`,
      keyInsight: `O(k) time on average (stops early), O(h) space for the call stack. Elegant and concise — the BST's sorted inorder property does all the heavy lifting.`,
    },

    'Iterative Inorder': {
      intuition: `Use an explicit stack to perform the inorder traversal without recursion. Keep a counter; each time you pop and process a node, decrement k. When k reaches 0, that node's value is the answer. Stops immediately without processing the rest of the tree.`,
      steps: [
        `Initialise an empty stack and curr = root.`,
        `Loop while curr is not null or stack is not empty.`,
        `Traverse left: while curr is not null, push curr onto stack, move curr = curr.left.`,
        `Pop a node from the stack — this is the next inorder node.`,
        `Decrement k. If k === 0, return node.val.`,
        `Move curr = node.right and continue.`,
      ],
      example: `Tree: root=3, 3.left=1, 3.right=4, 1.right=2. k=1\n\nPush 3 → push 1 → push null (stop left chain)\nStack: [3, 1]\nPop 1: k-- → k=0 → return 1\n✅ Answer: 1`,
      keyInsight: `O(k) time, O(h) space for the stack. Avoids recursion and terminates as soon as the kth element is found. Preferred in interviews when you want to avoid potential stack overflow.`,
    },

    'Store Inorder in Array': {
      intuition: `The simplest approach: do a full inorder traversal and collect all values into a sorted array. The answer is simply the element at index k-1. Two separate concerns (traversal and lookup) make the code very easy to read.`,
      steps: [
        `Define inorder(node, result): if null return; recurse left; append node.val; recurse right.`,
        `Create an empty array and call inorder(root, array).`,
        `Return array[k - 1].`,
      ],
      example: `Tree: root=3, 3.left=1, 3.right=4, 1.right=2. k=1\n\nInorder traversal → array = [1, 2, 3, 4]\nReturn array[k-1] = array[0] = 1\n✅ Answer: 1`,
      keyInsight: `O(n) time (visits all nodes) and O(n) space (stores all values). Simplest to code but wastes work when k is small. Use the iterative approach for early termination when k << n.`,
    },

    'Morris Traversal': {
      intuition: `Perform inorder traversal without any extra space (no stack, no recursion) by temporarily threading the tree. For each node, find its inorder predecessor and set a temporary right-pointer back to the current node ("thread"). This lets you return to a node after finishing its left subtree, then remove the thread before processing the node. Count nodes as you process them; return the kth.`,
      steps: [
        `curr = root, cnt = 0.`,
        `While curr is not null: if curr.left is null, process curr (increment cnt, check if cnt==k), then move curr = curr.right.`,
        `Otherwise find the inorder predecessor (rightmost node of the left subtree that doesn't already point to curr).`,
        `If pred.right is null (no thread yet): set pred.right = curr (create thread). Move curr = curr.left.`,
        `If pred.right == curr (thread exists): remove thread (pred.right = null). Process curr. Move curr = curr.right.`,
      ],
      example: `Tree: root=3, 3.left=1, 3.right=4, 1.right=2. k=1\n\ncurr=3: left≠null. Pred of 3 = rightmost of left(1) = node(2). pred.right=null → thread: 2.right=3. curr=1.\ncurr=1: left=null → PROCESS 1. cnt=1==k=1 → return 1.\n✅ Answer: 1`,
      keyInsight: `O(n) time, O(1) space — no stack, no recursion, no extra arrays. The threading technique is elegant but tricky to implement correctly. Useful when strict O(1) space is required.`,
    },

    'Augmented BST (Follow-up)': {
      intuition: `The LeetCode follow-up asks: if the BST is modified frequently and kth-smallest queries are frequent, how to optimise? Augment each node with the count of nodes in its left subtree (leftSize). Then a single root-to-leaf path of length O(h) can answer any kth-smallest query by comparing k to leftSize at each node — no full traversal needed.`,
      steps: [
        `Build an augmented BST where each node stores leftSize = number of nodes in its left subtree.`,
        `searchAug(node, k): if k <= node.leftSize → recurse left with same k.`,
        `If k == node.leftSize + 1 → current node is the kth smallest, return node.val.`,
        `Otherwise → recurse right with k = k - node.leftSize - 1 (subtract left subtree and current node).`,
      ],
      example: `Augmented tree: node(3).leftSize=2 (nodes 1,2), node(1).leftSize=0, node(4).leftSize=0. k=2\n\nsearchAug(3, 2): k=2, leftSize=2. k<=2 → recurse left.\nsearchAug(1, 2): k=2, leftSize=0. k==0+1=1? No. k>1 → recurse right with k=2-0-1=1.\nsearchAug(2, 1): k=1, leftSize=0. k==0+1=1 → return node(2).val=2.\n✅ Answer: 2 (2nd smallest)`,
      keyInsight: `O(h) per query once augmented (O(log n) for balanced BST). O(n) extra space for leftSize annotations. This is the optimal solution for repeated queries — each query costs O(h) instead of O(n).`,
    },

    'Standard Solution': {
      intuition: `The canonical answer for interviews and LeetCode: an iterative inorder traversal using an explicit stack. Walk left as far as possible, then pop and count; when count equals k, return that value. Clean, avoids recursion, and terminates early.`,
      steps: [
        `Initialise an empty stack and curr = root, cnt = 0.`,
        `Loop: while curr != null, push curr, move left. When curr is null, pop from stack.`,
        `Increment cnt. If cnt == k, return popped node's value.`,
        `Set curr = popped node's right child and continue.`,
      ],
      example: `Tree: root=3, 3.left=1, 3.right=4, 1.right=2. k=2\n\nPush 3 → push 1 → push null (stop). Stack=[3,1]\nPop 1: cnt=1. cnt≠2. curr=1.right=2.\nPush 2 → push null (stop). Stack=[3,2]\nPop 2: cnt=2. cnt==2 → return 2.\n✅ Answer: 2`,
      keyInsight: `O(h + k) time, O(h) space. Identical in complexity to Approach 2 (Iterative Inorder) — this entry exists to match the Java source's "Standard Solution" approach label.`,
    },
  },
}
