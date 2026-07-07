// 033 — Maximum Depth of Binary Tree · steps.js

// Pseudocode line indices:
// 0: function maxDepth(root):
// 1:   if root is null: return 0
// 2:   leftDepth = maxDepth(root.left)
// 3:   rightDepth = maxDepth(root.right)
// 4:   return 1 + max(leftDepth, rightDepth)

// BFS version (alt):
// 0: function maxDepth(root):
// 1:   if root is null: return 0
// 2:   queue = [root], depth = 0
// 3:   while queue is not empty:
// 4:     depth += 1
// 5:     for each node in current level: enqueue children
// 6:   return depth

function push(steps, desc, highlights, maxSoFar, codeLineIndex, extra = {}) {
  steps.push({ description: desc, highlights: { ...highlights }, maxSoFar, codeLineIndex, ...extra })
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

function dfsDepth(root, steps) {
  const highlights = {}

  push(steps, 'Starting recursive DFS to find the maximum depth. At each node we recursively compute the depth of both subtrees and return one plus the larger value.', {}, 0, 0)

  function dfs(node, depth) {
    if (!node) return 0
    highlights[node.id] = 'current'
    push(steps,
      `Entered node ${node.val} at depth ${depth}. Recurse into the left child to find the depth of the left subtree.`,
      { ...highlights }, depth, 2
    )
    const left = dfs(node.left, depth + 1)
    push(steps,
      `Left subtree of node ${node.val} has depth ${left}. Now recurse into the right child.`,
      { ...highlights }, depth, 3
    )
    const right = dfs(node.right, depth + 1)
    const total = 1 + Math.max(left, right)
    highlights[node.id] = 'done'
    push(steps,
      `Back at node ${node.val}. Left depth = ${left}, right depth = ${right}. This node contributes depth ${total} (1 + max(${left}, ${right})).`,
      { ...highlights }, total, 4, { nodeVal: node.val, left, right, total }
    )
    return total
  }

  const ans = dfs(root, 1)
  push(steps,
    `DFS complete! The maximum depth of the tree is ${ans}.`,
    highlights, ans, 4, { done: true, answer: ans }
  )
}

function bfsDepth(root, steps) {
  const highlights = {}
  let depth = 0
  const queue = [root]
  highlights[root.id] = 'current'

  push(steps, 'Starting BFS to find maximum depth. We process the tree level by level — each complete level adds one to the depth count.', {}, 0, 2)

  while (queue.length > 0) {
    const levelSize = queue.length
    depth++
    push(steps,
      `Processing level ${depth} — there are ${levelSize} node${levelSize !== 1 ? 's' : ''} at this level. Dequeue each one and enqueue its children.`,
      { ...highlights }, depth, 4
    )
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()
      highlights[node.id] = 'visited'
      if (node.left)  { queue.push(node.left);  highlights[node.left.id]  = 'current' }
      if (node.right) { queue.push(node.right); highlights[node.right.id] = 'current' }
    }
    push(steps,
      `Finished level ${depth}. ${queue.length > 0 ? `${queue.length} node${queue.length !== 1 ? 's' : ''} queued for the next level.` : 'No more children — this was the last level.'}`,
      { ...highlights }, depth, 5
    )
  }

  push(steps,
    `BFS complete! The tree has ${depth} level${depth !== 1 ? 's' : ''}, so the maximum depth is ${depth}.`,
    highlights, depth, 6, { done: true, answer: depth }
  )
}

export function generateSteps(algo, treeArr) {
  const steps = []
  const root = buildTree(treeArr)

  if (!root) {
    steps.push({ description: 'The tree is empty — its depth is 0.', highlights: {}, maxSoFar: 0, codeLineIndex: 1, done: true, answer: 0 })
    return steps
  }

  if (algo === 'bfs') {
    bfsDepth(root, steps)
  } else {
    dfsDepth(root, steps)
  }

  return steps
}
