/**
 * Tutorial content for #050 — Diameter of Binary Tree
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given the root of a binary tree, return the length of the diameter — the longest path between any two nodes in the tree. The path may or may not pass through the root. The length is measured in number of edges (not nodes).`,
    example: `Tree: [1,2,3,4,5]\n      1\n     / \\\n    2   3\n   / \\\n  4   5\n\n→ Longest path: 4→2→1→3 or 5→2→1→3 (3 edges)\n✅ Answer: 3`,
    keyInsight: `At each node, the longest path passing THROUGH that node = left height + right height (the two longest arms going down each side). Use a single DFS that returns the height of each subtree while updating a global maximum of (left height + right height).`,
  },

  approaches: {
    'Recursive DFS with Global Max': {
      intuition: `The diameter passing through a node equals the height of its left subtree plus the height of its right subtree. Do a post-order DFS: compute the height of each subtree bottom-up, and at each node update a running maximum with left + right. Return the maximum at the end.`,
      steps: [
        `Initialise a global variable maxDiameter = 0.`,
        `Define height(node): if node is null, return 0.`,
        `Recursively compute leftH = height(node.left) and rightH = height(node.right).`,
        `Update maxDiameter = max(maxDiameter, leftH + rightH).`,
        `Return 1 + max(leftH, rightH) as the height of this subtree.`,
        `Call height(root) and return maxDiameter.`,
      ],
      example: `Tree: [1,2,3,4,5]\n\nheight(4): leftH=0, rightH=0. maxDiameter=max(0,0+0)=0. return 1.\nheight(5): leftH=0, rightH=0. maxDiameter=max(0,0+0)=0. return 1.\nheight(2): leftH=1(from 4), rightH=1(from 5).\n  maxDiameter=max(0,1+1)=2. return 2.\nheight(3): leftH=0, rightH=0. maxDiameter=max(2,0)=2. return 1.\nheight(1): leftH=2(from 2), rightH=1(from 3).\n  maxDiameter=max(2,2+1)=3. return 3.\n\n✅ Answer: 3`,
      keyInsight: `O(n) time — each node is visited once. O(h) space for the recursion stack (h = tree height). This is the optimal approach: one DFS computes all heights AND the answer simultaneously.`,
    },

    'Iterative Post-order': {
      intuition: `Replicate the recursive DFS using an explicit stack and a hash map to store the computed height of each node. Process nodes in post-order (children before parents) so each node's children heights are ready when the node itself is processed. Update a running maximum as each node is processed.`,
      steps: [
        `If root is null, return 0. Initialise stack=[root], heights={null:0}, maxDiameter=0.`,
        `Post-order iteration: push node, then its right child, then left child onto the stack (left processed first).`,
        `Pop each node. If both children's heights are already computed: process the node.`,
        `leftH = heights[node.left], rightH = heights[node.right]. Update maxDiameter = max(maxDiameter, leftH+rightH).`,
        `heights[node] = 1 + max(leftH, rightH).`,
        `Return maxDiameter.`,
      ],
      example: `Tree: [1,2,3,4,5]\nStack: [1], heights={null:0}\n\nPush 1: push right(3) then left(2). Stack=[1,3,2]\nPop 2: children 4,5 not processed yet. Push 2 again, then 5, then 4. Stack=[1,3,2,5,4]\nPop 4: heights[null]=0 for both children. maxDiameter=0. heights[4]=1. Stack=[1,3,2,5]\nPop 5: heights[null]=0 for both. maxDiameter=0. heights[5]=1. Stack=[1,3,2]\nPop 2: heights[4]=1, heights[5]=1. maxDiameter=max(0,1+1)=2. heights[2]=2. Stack=[1,3]\nPop 3: heights[null]=0 both. maxDiameter=max(2,0)=2. heights[3]=1. Stack=[1]\nPop 1: heights[2]=2, heights[3]=1. maxDiameter=max(2,2+1)=3. heights[1]=3. Stack=[]\n✅ Answer: 3`,
      keyInsight: `O(n) time, O(n) space (heights map + stack). Avoids recursion stack overflow on deep trees. The heights map acts as memoisation for child subtrees.`,
    },

    'Brute Force (recompute height per node)': {
      intuition: `For every node in the tree, compute the height of its left subtree and right subtree separately (two full DFS calls each time). The diameter through that node is left height + right height. Track the maximum across all nodes. Simple to understand, but redundantly recomputes heights many times.`,
      steps: [
        `Define computeHeight(node): return 0 if null, else 1 + max(computeHeight(left), computeHeight(right)).`,
        `Define getDiameter(node): if null return 0.`,
        `At each node: diameter through this node = computeHeight(left) + computeHeight(right).`,
        `Return max(diameter through this node, getDiameter(left), getDiameter(right)).`,
        `Call getDiameter(root).`,
      ],
      example: `Tree: [1,2,3,4,5]\n\ngetDiameter(1):\n  computeHeight(2) = 2. computeHeight(3) = 1.\n  through node 1: 2+1 = 3.\n  getDiameter(2):\n    computeHeight(4)=1, computeHeight(5)=1. through node 2: 1+1=2.\n    getDiameter(4): computeHeight(null)+computeHeight(null)=0. return 0.\n    getDiameter(5): 0. return 0.\n    max(2,0,0)=2. return 2.\n  getDiameter(3): 0. return 0.\n  max(3, 2, 0) = 3.\n✅ Answer: 3`,
      keyInsight: `O(n²) time — computeHeight is called O(n) times per node in the worst case (skewed tree). O(h) space. Correct but inefficient. Shows why the single-pass DFS approach is a major improvement.`,
    },
  },
}
