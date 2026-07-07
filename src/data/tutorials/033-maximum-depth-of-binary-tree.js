/**
 * Tutorial content for #033 — Maximum Depth of Binary Tree
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given the root of a binary tree, return its maximum depth — the number of nodes along the longest path from the root down to the farthest leaf node. A leaf is a node with no children.`,
    example: `Tree: root=3, left=9, right=20, 20.left=15, 20.right=7\n→ Path 3→9: length 2\n→ Path 3→20→15: length 3\n→ Path 3→20→7: length 3\n✅ Answer: 3`,
    keyInsight: `The maximum depth of a tree is 1 (for the current node) plus the maximum of the depths of its left and right subtrees. This recursive definition naturally leads to a DFS solution.`,
  },

  approaches: {
    'Recursive DFS': {
      intuition: `Ask the tree a simple recursive question: "What is my maximum depth?" The answer is: 0 if I'm null, otherwise 1 (for me) plus the bigger of my left and right subtree depths. This bottom-up recursion propagates the answer from leaves back up to the root.`,
      steps: [
        `Base case: if root is null, return 0.`,
        `Recursively compute leftDepth = maxDepth(root.left).`,
        `Recursively compute rightDepth = maxDepth(root.right).`,
        `Return 1 + max(leftDepth, rightDepth).`,
      ],
      example: `Tree: 3 → left:9, right:20 → 20.left:15, 20.right:7\n\nmaxDepth(9)  = 1 + max(0,0) = 1\nmaxDepth(15) = 1 + max(0,0) = 1\nmaxDepth(7)  = 1 + max(0,0) = 1\nmaxDepth(20) = 1 + max(1,1) = 2\nmaxDepth(3)  = 1 + max(1,2) = 3\n✅ Answer: 3`,
      keyInsight: `O(n) time (every node visited once), O(h) space for the call stack (h = tree height, O(n) worst case for a skewed tree). This is the most elegant and concise solution.`,
    },

    'BFS Level Order': {
      intuition: `Count levels using a BFS queue. Each time you finish processing all nodes at the current level, increment a depth counter. When the queue is empty you've processed all levels, so the counter equals the maximum depth.`,
      steps: [
        `If root is null, return 0.`,
        `Enqueue root. Set depth = 0.`,
        `While the queue is not empty: increment depth. Record levelSize = queue.length.`,
        `Process exactly levelSize nodes: dequeue each and enqueue their non-null children.`,
        `After the loop ends, return depth.`,
      ],
      example: `Tree: 3, left=9, right=20, 20.left=15, 20.right=7\n\nQueue: [3]        depth becomes 1, process 3, enqueue 9, 20\nQueue: [9, 20]    depth becomes 2, process 9 (no children), 20 (enqueue 15, 7)\nQueue: [15, 7]    depth becomes 3, process 15, 7 (no children)\nQueue: []\nReturn depth = 3\n✅ Answer: 3`,
      keyInsight: `O(n) time, O(n) space for the queue. Naturally counts depth without recursion — each BFS round corresponds to one tree level.`,
    },

    'Iterative DFS with Stack': {
      intuition: `Simulate the recursive DFS using an explicit stack. Push (node, depth) pairs. Track the maximum depth seen across all visited nodes. This avoids recursion entirely, which is useful for extremely deep trees.`,
      steps: [
        `If root is null, return 0.`,
        `Push (root, 1) onto a stack. Set maxDepth = 0.`,
        `While the stack is not empty: pop (node, depth).`,
        `Update maxDepth = max(maxDepth, depth).`,
        `If node.left exists, push (node.left, depth+1).`,
        `If node.right exists, push (node.right, depth+1).`,
        `Return maxDepth.`,
      ],
      example: `Tree: 3, left=9, right=20, 20.left=15, 20.right=7\n\nStack: [(3,1)]         maxDepth=0\nPop (3,1) maxDepth=1, push (9,2),(20,2)\nStack: [(9,2),(20,2)]  maxDepth=1\nPop (20,2) maxDepth=2, push (15,3),(7,3)\nPop (7,3)  maxDepth=3\nPop (15,3) maxDepth=3\nPop (9,2)  maxDepth=3\n✅ Answer: 3`,
      keyInsight: `O(n) time, O(h) space for the stack. Functionally identical to recursive DFS but iterative — avoids call stack overflow for very deep trees.`,
    },

    'Morris Traversal': {
      intuition: `Adapt the Morris threading technique to track depth without a stack or recursion. When descending left (creating a thread to a predecessor), increment a depth counter. When ascending back via a thread (removing it), subtract the number of steps used to find the predecessor — this restores the correct current depth. Track the maximum depth seen at each node visit.`,
      steps: [
        `Set curr = root, maxDepth = 0, currDepth = 0.`,
        `While curr is not null:`,
        `  If curr has no left child: increment currDepth, update maxDepth, move curr = curr.right.`,
        `  Otherwise, find the inorder predecessor (rightmost in left subtree), counting steps taken.`,
        `  If predecessor.right is null: create thread (predecessor.right = curr), increment currDepth, move curr = curr.left.`,
        `  If predecessor.right is curr: remove thread (predecessor.right = null), subtract steps from currDepth, move curr = curr.right.`,
      ],
      example: `Tree: 3 (root), left=9, right=20, 20.left=15, 20.right=7\n\ncurr=3: has left(9). Pred of 3 = node 9 (steps=1). Thread: 9.right→3. currDepth=1, go left→9.\ncurr=9: no left. currDepth=2, maxDepth=2. Move right (via thread)→3.\ncurr=3: has left(9). Pred=9, thread exists. Remove thread. currDepth-=1=1. Move right→20.\ncurr=20: has left(15). Pred=15 (steps=1). Thread: 15.right→20. currDepth=2, go left→15.\ncurr=15: no left. currDepth=3, maxDepth=3. Move right (via thread)→20.\ncurr=20: pred=15, thread exists. Remove. currDepth-=1=2. Move right→7.\ncurr=7: no left. currDepth=3, maxDepth=3. Move right→null. Done.\n✅ Answer: 3`,
      keyInsight: `O(n) time, O(1) space. Applying Morris traversal to depth calculation requires careful step-counting when threads are created and removed — currDepth must decrease by exactly the steps traversed to find the predecessor when the thread is unwound.`,
    },

    'Tail Recursion with Accumulator': {
      intuition: `Instead of returning depth bottom-up, pass the current depth downward as an accumulator parameter. At every node visit, compare the accumulated depth against a running maximum (stored as a field or result holder). Recurse on both children with depth+1. When the recursion finishes, the field holds the answer. This is effectively a pre-order DFS — visit the node first, then go deeper.`,
      steps: [
        `Initialise a class-level (or closure) variable maxAcc = 0.`,
        `Define helper(node, depth): if node is null, return immediately.`,
        `Update maxAcc = max(maxAcc, depth).`,
        `Recursively call helper(node.left, depth + 1) and helper(node.right, depth + 1).`,
        `Call helper(root, 1) and return maxAcc.`,
      ],
      example: `Tree: 3, left=9, right=20, 20.left=15, 20.right=7\n\nhelper(3, 1): maxAcc=1\n  helper(9, 2): maxAcc=2\n    helper(null, 3): return\n    helper(null, 3): return\n  helper(20, 2): maxAcc=2\n    helper(15, 3): maxAcc=3\n      helper(null,4): return × 2\n    helper(7, 3): maxAcc=3\n      helper(null,4): return × 2\nReturn maxAcc = 3\n✅ Answer: 3`,
      keyInsight: `O(n) time, O(h) space for the call stack. Functionally equivalent to recursive DFS but the depth flows down rather than bubbling up — avoids the final "1 + max(left, right)" computation at each node. Useful when the accumulator pattern is clearer to the reader.`,
    },
  },
}
