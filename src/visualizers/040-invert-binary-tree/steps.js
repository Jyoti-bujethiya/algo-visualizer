// 040 — Invert Binary Tree · steps.js

// Pseudocode line indices:
// 0: function invertTree(root):
// 1:   if root is null: return null
// 2:   root.left, root.right = root.right, root.left
// 3:   invertTree(root.left)
// 4:   invertTree(root.right)
// 5:   return root

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

function cloneTree(node) {
  if (!node) return null
  return { val: node.val, id: node.id, left: cloneTree(node.left), right: cloneTree(node.right) }
}

function invertDFS(root, steps) {
  const highlights = {}

  push(steps,
    'Inverting the binary tree. At every node we swap the left and right children, then recursively invert each subtree. The result is the mirror image of the original tree.',
    {}, 0
  )

  function invert(node) {
    if (!node) return null

    highlights[node.id] = 'current'
    push(steps,
      `At node ${node.val}. Swap its left child (${node.left ? node.left.val : 'null'}) and right child (${node.right ? node.right.val : 'null'}).`,
      { ...highlights }, 2,
      { nodeVal: node.val, leftVal: node.left?.val, rightVal: node.right?.val }
    )

    // Swap
    const temp = node.left
    node.left  = node.right
    node.right = temp

    highlights[node.id] = 'visiting'
    push(steps,
      `Swapped children of node ${node.val}. Left is now ${node.left ? node.left.val : 'null'}, right is now ${node.right ? node.right.val : 'null'}. Recurse into the new left child.`,
      { ...highlights }, 3
    )

    invert(node.left)
    push(steps,
      `Left subtree of node ${node.val} inverted. Now recurse into the right child.`,
      { ...highlights }, 4
    )
    invert(node.right)

    highlights[node.id] = 'done'
    push(steps,
      `Node ${node.val} and both its subtrees are fully inverted.`,
      { ...highlights }, 5
    )

    return node
  }

  invert(root)
  push(steps,
    'Tree inversion complete! The tree is now the mirror image of the original.',
    highlights, 5, { done: true }
  )
}

export function generateSteps(algo, treeArr) {
  const steps = []
  const root = buildTree(treeArr)

  if (!root) {
    steps.push({ description: 'Empty tree — nothing to invert.', highlights: {}, codeLineIndex: 1, done: true })
    return steps
  }

  // We store snapshots of the tree at each step
  // The tree is mutated in-place; each step snapshot is the tree state at that point
  const snaps = []
  const hlSeries = []
  const descSeries = []
  const clSeries = []
  const extraSeries = []

  // Re-build tree for snapshotting
  const root2 = buildTree(treeArr)
  const highlights = {}

  function invertSnap(node) {
    if (!node) return null

    highlights[node.id] = 'current'
    snaps.push(cloneTree(root2))
    hlSeries.push({ ...highlights })
    descSeries.push(`At node ${node.val}. About to swap its left child (${node.left ? node.left.val : 'null'}) and right child (${node.right ? node.right.val : 'null'}).`)
    clSeries.push(2)
    extraSeries.push({ nodeVal: node.val })

    const temp = node.left
    node.left  = node.right
    node.right = temp

    highlights[node.id] = 'visiting'
    snaps.push(cloneTree(root2))
    hlSeries.push({ ...highlights })
    descSeries.push(`Swapped children of node ${node.val}. Left is now ${node.left ? node.left.val : 'null'}, right is now ${node.right ? node.right.val : 'null'}.`)
    clSeries.push(3)
    extraSeries.push({})

    invertSnap(node.left)
    invertSnap(node.right)

    highlights[node.id] = 'done'
    snaps.push(cloneTree(root2))
    hlSeries.push({ ...highlights })
    descSeries.push(`Node ${node.val} and its subtrees are fully inverted.`)
    clSeries.push(5)
    extraSeries.push({})
  }

  // Initial snapshot
  steps.push({
    description: 'Inverting the binary tree using DFS. At each node we swap the left and right children, creating the mirror image of the original tree.',
    highlights: {},
    tree: cloneTree(root2),
    codeLineIndex: 0,
  })

  invertSnap(root2)

  for (let i = 0; i < snaps.length; i++) {
    steps.push({
      description: descSeries[i],
      highlights: hlSeries[i],
      tree: snaps[i],
      codeLineIndex: clSeries[i],
      ...extraSeries[i],
    })
  }

  steps.push({
    description: 'Tree inversion complete! Every left and right subtree has been swapped. The tree is now the mirror image of the original.',
    highlights: Object.fromEntries(Object.keys(highlights).map(id => [id, 'done'])),
    tree: cloneTree(root2),
    codeLineIndex: 5,
    done: true,
  })

  return steps
}
