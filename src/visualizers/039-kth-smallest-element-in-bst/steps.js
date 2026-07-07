// 039 — Kth Smallest Element in a BST · steps.js

// Pseudocode line indices:
// 0: function kthSmallest(root, k):
// 1:   count = 0, result = null
// 2:   function inorder(node):
// 3:     if node is null: return
// 4:     inorder(node.left)
// 5:     count += 1
// 6:     if count == k: result = node.val; return
// 7:     inorder(node.right)
// 8:   inorder(root)
// 9:   return result

function push(steps, desc, highlights, count, k, result, codeLineIndex, extra = {}) {
  steps.push({ description: desc, highlights: { ...highlights }, count, k, result, codeLineIndex, ...extra })
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

function kthSmallestDFS(root, k, steps) {
  const highlights = {}
  let count = 0
  let result = null
  let found = false

  push(steps,
    `Finding the ${k}${k === 1 ? 'st' : k === 2 ? 'nd' : k === 3 ? 'rd' : 'th'} smallest element in this BST. Inorder traversal of a BST visits nodes in ascending order, so the ${k}${k === 1 ? 'st' : k === 2 ? 'nd' : k === 3 ? 'rd' : 'th'} node we visit is the answer.`,
    {}, count, k, result, 0
  )

  function inorder(node) {
    if (!node || found) return

    highlights[node.id] = 'current'
    push(steps,
      `At node ${node.val}. Go left first — smaller values in a BST are always in the left subtree.`,
      { ...highlights }, count, k, result, 4
    )
    inorder(node.left)
    if (found) return

    count++
    highlights[node.id] = count === k ? 'found' : 'done'

    push(steps,
      `Visited node ${node.val} (this is the ${count}${count === 1 ? 'st' : count === 2 ? 'nd' : count === 3 ? 'rd' : 'th'} node in inorder). ${count === k ? `Count equals k=${k} — found the answer: ${node.val}!` : `Count = ${count}, not yet k=${k}. Continue.`}`,
      { ...highlights }, count, k, count === k ? node.val : result, 5,
      { nodeVal: node.val, isAnswer: count === k }
    )

    if (count === k) {
      result = node.val
      found = true
      return
    }

    inorder(node.right)
  }

  inorder(root)
  push(steps,
    `Search complete! The ${k}${k === 1 ? 'st' : k === 2 ? 'nd' : k === 3 ? 'rd' : 'th'} smallest element is ${result}.`,
    highlights, count, k, result, 9, { done: true, answer: result }
  )
}

export function generateSteps(algo, treeArr, k) {
  const steps = []
  const root = buildTree(treeArr)

  if (!root) {
    steps.push({ description: 'Empty tree — no element exists.', highlights: {}, count: 0, k, result: null, codeLineIndex: 0 })
    return steps
  }

  kthSmallestDFS(root, k, steps)
  return steps
}
