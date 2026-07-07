// 035 — Lowest Common Ancestor of a BST · steps.js

// Pseudocode line indices:
// 0: function lca(root, p, q):
// 1:   if root is null: return null
// 2:   if p < root.val and q < root.val:
// 3:     return lca(root.left, p, q)   // both in left subtree
// 4:   if p > root.val and q > root.val:
// 5:     return lca(root.right, p, q)  // both in right subtree
// 6:   return root                     // split point — this is the LCA

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

function findLCA(root, p, q, steps) {
  const highlights = {}

  push(steps,
    `Finding the lowest common ancestor of nodes ${p} and ${q} in a BST. We exploit the BST property: if both targets are smaller than the current node, go left; if both are larger, go right; otherwise the current node is the LCA (the "split point").`,
    {}, 0
  )

  function lca(node) {
    if (!node) return null
    highlights[node.id] = 'current'

    push(steps,
      `At node ${node.val}. Targets are ${p} and ${q}. Checking which direction to go.`,
      { ...highlights }, 2, { nodeVal: node.val }
    )

    if (p < node.val && q < node.val) {
      push(steps,
        `Both ${p} and ${q} are less than ${node.val} — they must both be in the LEFT subtree. Go left.`,
        { ...highlights }, 2, { direction: 'left' }
      )
      highlights[node.id] = 'discard'
      return lca(node.left)
    }

    if (p > node.val && q > node.val) {
      push(steps,
        `Both ${p} and ${q} are greater than ${node.val} — they must both be in the RIGHT subtree. Go right.`,
        { ...highlights }, 4, { direction: 'right' }
      )
      highlights[node.id] = 'discard'
      return lca(node.right)
    }

    // Split point — this is the LCA
    highlights[node.id] = 'found'
    push(steps,
      `Node ${node.val} is the split point! One target (${p}) is ≤ ${node.val} and the other (${q}) is ≥ ${node.val}. This node is the Lowest Common Ancestor.`,
      { ...highlights }, 6, { lcaVal: node.val, done: true }
    )
    return node
  }

  const result = lca(root)
  push(steps,
    `LCA found: node ${result ? result.val : '—'}. This is the deepest node that is an ancestor of both ${p} and ${q}.`,
    highlights, 6, { done: true, answer: result ? result.val : null }
  )
}

export function generateSteps(algo, treeArr, p, q) {
  const steps = []
  const root = buildTree(treeArr)

  if (!root) {
    steps.push({ description: 'Empty tree — no LCA exists.', highlights: {}, codeLineIndex: 1 })
    return steps
  }

  findLCA(root, p, q, steps)
  return steps
}
