// 038 — Construct Binary Tree from Preorder and Inorder Traversal · steps.js

// Pseudocode line indices:
// 0: function buildTree(preorder, inorder):
// 1:   if preorder is empty: return null
// 2:   root = preorder[0]
// 3:   mid = indexOf(root) in inorder
// 4:   root.left  = buildTree(preorder[1 : mid+1], inorder[0 : mid])
// 5:   root.right = buildTree(preorder[mid+1 :],   inorder[mid+1 :])
// 6:   return root

function push(steps, desc, highlights, builtRoot, preSlice, inSlice, codeLineIndex, extra = {}) {
  steps.push({ description: desc, highlights: { ...highlights }, builtRoot: builtRoot ? cloneTree(builtRoot) : null, preSlice: [...preSlice], inSlice: [...inSlice], codeLineIndex, ...extra })
}

function cloneTree(node) {
  if (!node) return null
  return { val: node.val, id: node.id, left: cloneTree(node.left), right: cloneTree(node.right) }
}

let nodeIdCounter = 0

function construct(preorder, inorder, steps) {
  nodeIdCounter = 0
  const highlights = {}
  let builtRoot = null

  push(steps,
    `Building a binary tree from preorder = [${preorder.join(', ')}] and inorder = [${inorder.join(', ')}]. The first element of preorder is always the root. Its position in inorder tells us how many nodes are in the left and right subtrees.`,
    {}, null, preorder, inorder, 0
  )

  function build(pre, ino) {
    if (pre.length === 0) return null

    const rootVal = pre[0]
    const mid = ino.indexOf(rootVal)
    const node = { val: rootVal, id: nodeIdCounter++, left: null, right: null }
    highlights[node.id] = 'current'

    if (!builtRoot) builtRoot = node

    push(steps,
      `Root of this subtree is ${rootVal} (first of preorder [${pre.slice(0, 4).join(', ')}${pre.length > 4 ? '…' : ''}]). In inorder, ${rootVal} is at position ${mid}. Left subtree has ${mid} node${mid !== 1 ? 's' : ''}, right has ${ino.length - mid - 1}.`,
      { ...highlights }, builtRoot, pre, ino, 2,
      { rootVal, mid }
    )

    node.left = build(pre.slice(1, mid + 1), ino.slice(0, mid))
    highlights[node.id] = 'visiting'

    push(steps,
      `Left subtree of ${rootVal} constructed. Now building the right subtree from preorder [${pre.slice(mid + 1, mid + 4).join(', ')}${pre.slice(mid + 1).length > 3 ? '…' : ''}] and inorder [${ino.slice(mid + 1, mid + 4).join(', ')}${ino.slice(mid + 1).length > 3 ? '…' : ''}].`,
      { ...highlights }, builtRoot, pre.slice(mid + 1), ino.slice(mid + 1), 5,
      { rootVal }
    )

    node.right = build(pre.slice(mid + 1), ino.slice(mid + 1))
    highlights[node.id] = 'done'

    push(steps,
      `Both subtrees of node ${rootVal} are built. This node is complete.`,
      { ...highlights }, builtRoot, [], [], 6
    )
    return node
  }

  const result = build(preorder, inorder)
  push(steps,
    `Tree construction complete! The tree with root ${result ? result.val : '—'} has been reconstructed from the two traversals.`,
    highlights, result, [], [], 6, { done: true }
  )
}

export function generateSteps(algo, preorder, inorder) {
  const steps = []

  if (!preorder || preorder.length === 0) {
    steps.push({ description: 'Empty input — resulting tree is null.', highlights: {}, builtRoot: null, preSlice: [], inSlice: [], codeLineIndex: 1 })
    return steps
  }

  construct(preorder, inorder, steps)
  return steps
}
