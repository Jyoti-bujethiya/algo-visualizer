/**
 * Tutorial content for #032 — Binary Tree Level Order Traversal
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given the root of a binary tree, return the level-order traversal of its nodes' values — i.e., from left to right, level by level. The output should be a list of lists, where each inner list contains the values at one depth level.`,
    example: `Tree: root=3, left=9, right=20, 20.left=15, 20.right=7\n→ Level 0: [3]\n→ Level 1: [9, 20]\n→ Level 2: [15, 7]\n✅ Answer: [[3], [9, 20], [15, 7]]`,
    keyInsight: `Level-order is naturally expressed by a queue: process all nodes at the current level before moving to the next. The trick to separating levels is to snapshot the queue's current size at the start of each iteration — that tells you exactly how many nodes belong to the current level.`,
  },

  approaches: {
    'BFS with Queue': {
      intuition: `Use a queue (FIFO). Start by enqueuing the root. At each level, record how many nodes are currently in the queue — that is the width of this level. Process exactly that many nodes, collecting their values and enqueuing their children. Repeat until the queue is empty.`,
      steps: [
        `If root is null, return an empty list.`,
        `Create a queue and enqueue root.`,
        `While the queue is not empty: record levelSize = queue.length.`,
        `Create an empty array for this level's values.`,
        `Loop levelSize times: dequeue a node, add its value to the level array, enqueue its non-null left and right children.`,
        `Add the completed level array to the result.`,
        `Return the result after all levels are processed.`,
      ],
      example: `Tree: 3 (root), 9 (left), 20 (right), 15 (20.left), 7 (20.right)\n\nQueue: [3]  levelSize=1\nDequeue 3 → level=[3], enqueue 9, 20. Queue: [9, 20]\nResult: [[3]]\n\nQueue: [9, 20]  levelSize=2\nDequeue 9 → level=[9], no children. Queue: [20]\nDequeue 20 → level=[9,20], enqueue 15, 7. Queue: [15, 7]\nResult: [[3], [9,20]]\n\nQueue: [15, 7]  levelSize=2\nDequeue 15 → level=[15]. Dequeue 7 → level=[15,7]. Queue: []\nResult: [[3], [9,20], [15,7]]\n✅ Answer: [[3], [9, 20], [15, 7]]`,
      keyInsight: `O(n) time (every node enqueued and dequeued once), O(n) space for the queue. The levelSize snapshot is the key to cleanly separating each level without any extra markers.`,
    },

    'DFS with Level Tracking': {
      intuition: `Use depth-first search but track the current depth. When you visit a node, pass its depth as a parameter. If the result array doesn't yet have a list for this depth, create one. Append the node's value to result[depth]. Recurse on left child with depth+1, then right child with depth+1.`,
      steps: [
        `Create an empty result array.`,
        `Define a helper dfs(node, depth).`,
        `Base case: if node is null, return.`,
        `If result.length === depth, push a new empty array (this depth hasn't been seen yet).`,
        `Append node.val to result[depth].`,
        `Recursively call dfs(node.left, depth+1) and dfs(node.right, depth+1).`,
        `Call dfs(root, 0) and return result.`,
      ],
      example: `Tree: 3, left=9, right=20, 20.left=15, 20.right=7\n\ndfs(3, 0): result=[] → push [] → result=[[3]]\ndfs(9, 1): result=[[3]] → push [] → result=[[3],[9]]\ndfs(null, 2): return\ndfs(null, 2): return\ndfs(20, 1): result=[[3],[9]] → append 20 → result=[[3],[9,20]]\ndfs(15, 2): result=[[3],[9,20]] → push [] → result=[[3],[9,20],[15]]\ndfs(7, 2): result=[[3],[9,20],[15]] → append 7 → result=[[3],[9,20],[15,7]]\n✅ Answer: [[3], [9, 20], [15, 7]]`,
      keyInsight: `O(n) time, O(h) space on the call stack (h = tree height). Interesting because it achieves level-order output using depth-first traversal — a non-obvious but valid technique.`,
    },

    'BFS with Null Markers': {
      intuition: `Enqueue the root, then add a null sentinel to mark the end of the first level. As you process nodes, enqueue their children. When you dequeue a null, you know the current level is done — add the level's values to results, and if the queue still has nodes, enqueue another null to mark the next level boundary.`,
      steps: [
        `Enqueue root and then null (level separator) into the queue.`,
        `Create a currentLevel array and result array.`,
        `While the queue is not empty: dequeue a node.`,
        `If the node is null: save currentLevel to result, reset currentLevel to []; if queue is non-empty, enqueue null again.`,
        `Otherwise: push node.val to currentLevel, enqueue non-null children.`,
        `Return result.`,
      ],
      example: `Queue: [3, null] (null = end of level 0)\ncurrentLevel = []\n\nDequeue 3 → currentLevel=[3], enqueue 9, 20. Queue: [null, 9, 20]\nDequeue null → save [3] to result, enqueue null. Queue: [9, 20, null]\ncurrentLevel=[]\n\nDequeue 9 → currentLevel=[9]. Dequeue 20 → currentLevel=[9,20], enqueue 15,7. Queue:[null,15,7]\nDequeue null → save [9,20]. Enqueue null. Queue:[15,7,null]\n\nDequeue 15,7 → currentLevel=[15,7]. Dequeue null → save [15,7]. Queue empty, stop.\n✅ Answer: [[3], [9, 20], [15, 7]]`,
      keyInsight: `O(n) time, O(n) space. The null marker approach is a valid alternative to levelSize snapshots. Both are equally correct; the levelSize approach tends to be cleaner in code.`,
    },

    'Two Queues': {
      intuition: `Instead of using size snapshots or null sentinels to delineate levels, keep two queues: currentLevel and nextLevel. Dequeue from currentLevel; for each node, enqueue its children into nextLevel. When currentLevel is empty the full level has been processed — save the collected values, then swap the queues (nextLevel becomes the new currentLevel, and currentLevel is reset to empty).`,
      steps: [
        `If root is null return [].`,
        `Initialize currentLevel = [root], nextLevel = [].`,
        `While currentLevel is not empty:`,
        `  Create levelValues = [].`,
        `  For each node in currentLevel: add node.val to levelValues; push non-null children into nextLevel.`,
        `  Append levelValues to result.`,
        `  Set currentLevel = nextLevel, nextLevel = [].`,
        `Return result.`,
      ],
      example: `Tree: 3 (root), left=9, right=20, 20.left=15, 20.right=7\n\ncurrentLevel=[3], nextLevel=[]\nProcess 3: levelValues=[3], nextLevel=[9,20]\nSwap: currentLevel=[9,20], nextLevel=[]\n\nProcess 9: levelValues=[9], nextLevel=[]\nProcess 20: levelValues=[9,20], nextLevel=[15,7]\nSwap: currentLevel=[15,7], nextLevel=[]\n\nProcess 15,7: levelValues=[15,7], nextLevel=[]\nSwap: currentLevel=[], stop.\n✅ Answer: [[3],[9,20],[15,7]]`,
      keyInsight: `O(n) time, O(n) space. The two-queue approach makes the level boundary self-evident — no size counter, no sentinel needed. The swap at the end of each level is a constant-time pointer reassignment.`,
    },
  },
}
