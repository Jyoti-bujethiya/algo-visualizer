/**
 * Tutorial content for #036 — Binary Tree Maximum Path Sum
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given the root of a binary tree, find the maximum path sum. A path is any sequence of nodes where each pair of adjacent nodes has a direct edge, and each node can appear at most once. The path does not need to pass through the root. Node values can be negative.`,
    example: `Tree: root=-10, left=9, right=20, 20.left=15, 20.right=7\n→ Possible paths: [9]=9, [15]=15, [7]=7, [15,20,7]=42, [-10,9]=-1, etc.\n→ Best path: 15→20→7 = 42\n✅ Answer: 42`,
    keyInsight: `At each node, a path can either continue upward through the parent (contributing as one "arm") or "complete" by combining the best left arm + node + best right arm. Use a post-order DFS: each node returns its best single-arm contribution to its parent while updating a global maximum with the best complete path through it.`,
  },

  approaches: {
    'Recursive DFS with Global Max': {
      intuition: `For each node, compute the maximum gain it can contribute if included in a path going upward (i.e. as one "arm": node + best of left or right gain). At the same time, check if combining node + left gain + right gain would beat the global maximum. Return the single-arm gain to the parent.`,
      steps: [
        `Initialise a global variable maxSum = -Infinity (to handle all-negative trees).`,
        `Define dfs(node) that returns the maximum single-arm gain from this node upward.`,
        `Base case: if node is null, return 0.`,
        `Compute leftGain = max(0, dfs(node.left)) and rightGain = max(0, dfs(node.right)). Taking max with 0 means we ignore negative branches.`,
        `Update maxSum = max(maxSum, node.val + leftGain + rightGain). This is the best "completed" path through this node.`,
        `Return node.val + max(leftGain, rightGain). This is what we offer to the parent (can only extend one arm).`,
        `Call dfs(root) and return maxSum.`,
      ],
      example: `Tree: -10, left=9, right=20, 20.left=15, 20.right=7\n\ndfs(9):  leftGain=0, rightGain=0. maxSum=max(-∞, 9+0+0)=9. Return 9+0=9.\ndfs(15): leftGain=0, rightGain=0. maxSum=max(9,15)=15. Return 15.\ndfs(7):  leftGain=0, rightGain=0. maxSum=max(15,7)=15. Return 7.\ndfs(20): leftGain=max(0,15)=15, rightGain=max(0,7)=7.\n         maxSum=max(15, 20+15+7)=42. Return 20+max(15,7)=35.\ndfs(-10):leftGain=max(0,9)=9, rightGain=max(0,35)=35.\n         maxSum=max(42, -10+9+35)=42. Return -10+max(9,35)=25.\nReturn maxSum = 42\n✅ Answer: 42`,
      keyInsight: `O(n) time, O(h) space. The "take max with 0" trick elegantly prunes negative branches. The separation between "gain returned to parent" (one arm) and "path through this node" (two arms) is the key insight.`,
    },

    'DFS returning pair (maxSingle, maxPath)': {
      intuition: `Instead of a global variable, make each recursive call return two values: (1) the best single-arm gain this node can contribute to its parent, and (2) the best complete path sum found anywhere in this subtree. The parent combines these to compute its own values. No side effects — purely functional.`,
      steps: [
        `Define dfs(node) returning [maxSingle, maxPath].`,
        `Base case: if node is null, return [0, -Infinity].`,
        `Recursively get [leftSingle, leftPath] = dfs(node.left) and [rightSingle, rightPath] = dfs(node.right).`,
        `Compute gains: leftGain = max(0, leftSingle), rightGain = max(0, rightSingle).`,
        `The best path through this node = node.val + leftGain + rightGain.`,
        `Return [node.val + max(leftGain, rightGain), max(leftPath, rightPath, pathThrough)].`,
        `The answer is dfs(root)[1].`,
      ],
      example: `Tree: -10, left=9, right=20, 20.left=15, 20.right=7\n\ndfs(15) = [15, 15]\ndfs(7)  = [7, 7]\ndfs(20): gains=(15,7), pathThrough=20+15+7=42.\n         Return [20+15=35, max(15,7,42)=42]\ndfs(9)  = [9, 9]\ndfs(-10): gains=(9,35), pathThrough=-10+9+35=34.\n         Return [25, max(9,42,34)=42]\nAnswer = 42\n✅ Answer: 42`,
      keyInsight: `O(n) time, O(h) space. Purely functional style — avoids mutable global state. The return type makes the invariants explicit: every call guarantees both the "contribution up" value and the "best found below" value.`,
    },

    'DFS with Detailed Comments': {
      intuition: `Functionally identical to Approach 1 but uses more descriptive variable names — leftGain/rightGain, priceNewPath — to make the intent explicit at each step. Great for understanding the algorithm before moving to the terser production version.`,
      steps: [
        `Initialise globalMax = -Infinity.`,
        `Define dfsDetailed(node): if null return 0.`,
        `leftGain = max(dfsDetailed(node.left), 0).`,
        `rightGain = max(dfsDetailed(node.right), 0).`,
        `priceNewPath = node.val + leftGain + rightGain.`,
        `Update globalMax = max(globalMax, priceNewPath).`,
        `Return node.val + max(leftGain, rightGain) to the parent.`,
      ],
      example: `Tree: -10, left=9, right=20, 20.left=15, 20.right=7\n\ndfsDetailed(15): leftGain=0, rightGain=0. priceNewPath=15. globalMax=15. Return 15.\ndfsDetailed(7):  leftGain=0, rightGain=0. priceNewPath=7.  globalMax=15. Return 7.\ndfsDetailed(20): leftGain=15, rightGain=7. priceNewPath=42. globalMax=42. Return 35.\ndfsDetailed(9):  leftGain=0,  rightGain=0. priceNewPath=9.  globalMax=42. Return 9.\ndfsDetailed(-10): leftGain=9, rightGain=35. priceNewPath=34. globalMax=42. Return 25.\nReturn 42\n✅ Answer: 42`,
      keyInsight: `O(n) time, O(h) space. Same algorithm as Approach 1 — the verbose names cost nothing at runtime but make the logic transparent for readers unfamiliar with the pattern.`,
    },

    'Iterative Post-order': {
      intuition: `Simulate the recursive post-order DFS iteratively using two stacks. The first stack drives a modified pre-order traversal that pushes nodes into the second stack in post-order (leaves first). Then drain the second stack: for each node, look up its children's best gains from a map, update the global max, and store the node's own best gain.`,
      steps: [
        `Use stack s1 (driver) and stack s2 (post-order collector). A map best stores each node's best single-arm gain (defaulting to 0 for null).`,
        `Push root onto s1. While s1 is not empty: pop a node, push it to s2; push its left and right children to s1.`,
        `While s2 is not empty: pop a node. lm = max(0, best[node.left]); rm = max(0, best[node.right]).`,
        `Update maxResult = max(maxResult, node.val + lm + rm).`,
        `Store best[node] = node.val + max(lm, rm). Continue until s2 is empty.`,
        `Return maxResult.`,
      ],
      example: `Tree: -10, left=9, right=20, 20.left=15, 20.right=7\n\ns1 push -10. Pop -10 → s2. Push 9, 20 to s1.\nPop 20 → s2. Push 15, 7 to s1.\nPop 7 → s2 (leaf). Pop 15 → s2 (leaf). Pop 9 → s2 (leaf).\n\nDrain s2 (post-order): 9,15,7,20,-10\nProcess 9:  lm=0, rm=0. maxResult=9.  best[9]=9.\nProcess 15: lm=0, rm=0. maxResult=15. best[15]=15.\nProcess 7:  lm=0, rm=0. maxResult=15. best[7]=7.\nProcess 20: lm=15, rm=7. maxResult=42. best[20]=35.\nProcess -10: lm=9, rm=35. max(-10+9+35=34)<42. best[-10]=25.\nReturn 42\n✅ Answer: 42`,
      keyInsight: `O(n) time, O(n) space (map + two stacks). Avoids recursion entirely — useful for very deep trees where stack overflow is a risk. More complex to code than the recursive version.`,
    },

    'Standard Solution (most common)': {
      intuition: `The canonical single-method solution that most LeetCode submissions use — a direct recursive DFS with a class-level global max variable. It is the same as Approach 1 but packaged as the expected public method signature. This is what interviewers expect as the standard answer.`,
      steps: [
        `Declare a class-level int maxSum = Integer.MIN_VALUE.`,
        `In maxPathSum(root): reset maxSum, call gain(root), return maxSum.`,
        `gain(node): if null return 0.`,
        `leftGain = max(0, gain(node.left)); rightGain = max(0, gain(node.right)).`,
        `maxSum = max(maxSum, node.val + leftGain + rightGain). Return node.val + max(leftGain, rightGain).`,
      ],
      example: `Tree: -10, left=9, right=20, 20.left=15, 20.right=7\n\ngain(9)=9, gain(15)=15, gain(7)=7\ngain(20): lG=15, rG=7. maxSum=max(MIN,42)=42. return 35.\ngain(-10): lG=9, rG=35. maxSum=max(42,34)=42. return 25.\nReturn maxSum=42\n✅ Answer: 42`,
      keyInsight: `O(n) time, O(h) space. This is the exact form you'd write in an interview or submit to LeetCode. Identical in logic to Approach 1 — shown here to make the "standard" shape explicit.`,
    },
  },
}
