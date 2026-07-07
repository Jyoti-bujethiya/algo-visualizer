// 050 — Diameter of Binary Tree · steps.js
// Diameter = longest path between any two nodes (may not pass through root)
// At each node: diameter candidate = left_depth + right_depth
// Track global maximum

// DFS line indices:
// 0: function diameterOfBinaryTree(root):
// 1:   maxDiameter = 0
// 2:   function dfs(node):
// 3:     if node == null: return 0
// 4:     left  = dfs(node.left)
// 5:     right = dfs(node.right)
// 6:     maxDiameter = max(maxDiameter, left + right)
// 7:     return 1 + max(left, right)
// 8:   dfs(root)
// 9:   return maxDiameter

function push(steps, desc, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, highlights: { ...highlights }, codeLineIndex, ...extra })
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

export function generateSteps(treeArr) {
  const steps = []
  const root = buildTree(treeArr)
  const highlights = {}

  push(steps,
    'Diameter of Binary Tree: for each node compute left depth + right depth. The maximum of these sums across all nodes is the diameter.',
    {}, 0
  )

  if (!root) {
    steps.push({ description: 'Empty tree — diameter is 0.', highlights: {}, codeLineIndex: 9, diameter: 0, done: true })
    return steps
  }

  let maxDiameter = 0
  const depthMap = {}

  function dfs(node) {
    if (!node) return 0

    highlights[node.id] = 'current'
    push(steps,
      `DFS at node ${node.val}. Computing depth of left and right subtrees.`,
      { ...highlights }, 3
    )

    const left = dfs(node.left)
    push(steps,
      `Left subtree depth of node ${node.val} = ${left}.`,
      { ...highlights }, 4, { depth: left }
    )

    const right = dfs(node.right)
    push(steps,
      `Right subtree depth of node ${node.val} = ${right}.`,
      { ...highlights }, 5, { depth: right }
    )

    const candidate = left + right
    if (candidate > maxDiameter) {
      maxDiameter = candidate
      highlights[node.id] = 'special'
      push(steps,
        `Node ${node.val}: left+right = ${left}+${right} = ${candidate}. New maxDiameter = ${maxDiameter}! ⭐`,
        { ...highlights }, 6, { maxDiameter }
      )
    } else {
      push(steps,
        `Node ${node.val}: left+right = ${left}+${right} = ${candidate}. maxDiameter stays ${maxDiameter}.`,
        { ...highlights }, 6, { maxDiameter }
      )
    }

    const myDepth = 1 + Math.max(left, right)
    depthMap[node.id] = myDepth
    highlights[node.id] = 'done'
    push(steps,
      `Node ${node.val} done. Returns depth = 1 + max(${left}, ${right}) = ${myDepth}.`,
      { ...highlights }, 7, { maxDiameter, depthMap: { ...depthMap } }
    )

    return myDepth
  }

  dfs(root)

  push(steps,
    `Diameter = ${maxDiameter}. This is the longest path between any two nodes in the tree.`,
    { ...highlights }, 9, { maxDiameter, depthMap: { ...depthMap }, done: true }
  )
  return steps
}
