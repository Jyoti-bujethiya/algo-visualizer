// 036 — Binary Tree Maximum Path Sum · steps.js

// Pseudocode line indices:
// 0: function maxPathSum(root):
// 1:   globalMax = -Infinity
// 2:   function dfs(node):
// 3:     if node is null: return 0
// 4:     leftGain  = max(dfs(node.left), 0)   // ignore negative gains
// 5:     rightGain = max(dfs(node.right), 0)
// 6:     pathThroughNode = node.val + leftGain + rightGain
// 7:     globalMax = max(globalMax, pathThroughNode)
// 8:     return node.val + max(leftGain, rightGain)  // only one branch upward
// 9:   dfs(root)
// 10:  return globalMax

function push(steps, desc, highlights, globalMax, codeLineIndex, extra = {}) {
  steps.push({ description: desc, highlights: { ...highlights }, globalMax, codeLineIndex, ...extra })
}

function buildTree(arr) {
  if (!arr || arr.length === 0) return null
  const nodes = arr.map((v, i) => v !== null ? { val: v, id: i, left: null, right: null } : null)
  for (let i = 0; i < nodes.length; i++) {
    if (!nodes[i]) continue
    if (2 * i + 1 < nodes.length) nodes[i].left  = nodes[2 * i + 1]
    if (2 * i + 2 < nodes.length) nodes[i].right = nodes[2 * i + 2]
  }
  return nodes[0]
}

function maxPathSum(root, steps) {
  const highlights = {}
  let globalMax = -Infinity

  push(steps,
    'Finding the maximum path sum. A path can start and end at any node. We use post-order DFS — for each node we compute the best gain from its left and right children, update a global maximum for the full path through this node, and return the best single-branch gain upward.',
    {}, globalMax, 0
  )

  function dfs(node) {
    if (!node) return 0

    highlights[node.id] = 'current'
    push(steps,
      `Visiting node ${node.val}. Recursing into left child first to get the best gain from the left subtree.`,
      { ...highlights }, globalMax, 4
    )

    const leftGain  = Math.max(dfs(node.left),  0)
    push(steps,
      `Left subtree of node ${node.val} returns a best gain of ${leftGain} (negative gains are treated as 0 — we just skip that branch). Now computing the right subtree.`,
      { ...highlights }, globalMax, 5,
      { nodeVal: node.val, leftGain }
    )

    const rightGain = Math.max(dfs(node.right), 0)
    const pathThrough = node.val + leftGain + rightGain
    const updated = pathThrough > globalMax

    if (updated) globalMax = pathThrough
    highlights[node.id] = updated ? 'found' : 'done'

    push(steps,
      `At node ${node.val}: left gain = ${leftGain}, right gain = ${rightGain}. Path through this node = ${node.val} + ${leftGain} + ${rightGain} = ${pathThrough}. ${updated ? `New global maximum: ${globalMax}!` : `Global max stays at ${globalMax}.`}`,
      { ...highlights }, globalMax, 7,
      { nodeVal: node.val, leftGain, rightGain, pathThrough, globalMax }
    )

    return node.val + Math.max(leftGain, rightGain)
  }

  dfs(root)
  push(steps,
    `DFS complete! The maximum path sum is ${globalMax}. This path uses the subset of nodes that maximises the total.`,
    highlights, globalMax, 10, { done: true, answer: globalMax }
  )
}

export function generateSteps(algo, treeArr) {
  const steps = []
  const root = buildTree(treeArr)

  if (!root) {
    steps.push({ description: 'Empty tree — no path exists.', highlights: {}, globalMax: 0, codeLineIndex: 0 })
    return steps
  }

  maxPathSum(root, steps)
  return steps
}
