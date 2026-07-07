// 034 — Validate Binary Search Tree · steps.js

// Pseudocode line indices:
// 0: function isValidBST(root):
// 1:   return validate(root, -Infinity, +Infinity)
// 2: function validate(node, min, max):
// 3:   if node is null: return true
// 4:   if node.val <= min or node.val >= max: return false
// 5:   leftOk = validate(node.left, min, node.val)
// 6:   rightOk = validate(node.right, node.val, max)
// 7:   return leftOk and rightOk

function push(steps, desc, highlights, isValid, codeLineIndex, extra = {}) {
  steps.push({ description: desc, highlights: { ...highlights }, isValid, codeLineIndex, ...extra })
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

function validateBST(root, steps) {
  const highlights = {}
  let valid = true

  push(steps,
    'Checking if this is a valid BST. The rule: every node in the left subtree must be strictly less than the current node, and every node in the right subtree must be strictly greater. We pass a valid range (min, max) down the tree.',
    {}, true, 0
  )

  function validate(node, min, max) {
    if (!node) return true

    highlights[node.id] = 'current'
    const minStr = min === -Infinity ? '−∞' : min
    const maxStr = max === Infinity  ? '+∞' : max

    push(steps,
      `Checking node ${node.val}. Its value must be strictly between ${minStr} and ${maxStr} to satisfy the BST property inherited from its ancestors.`,
      { ...highlights }, valid, 2,
      { nodeVal: node.val, min: minStr, max: maxStr }
    )

    if (node.val <= min || node.val >= max) {
      highlights[node.id] = 'invalid'
      valid = false
      push(steps,
        `Node ${node.val} violates the BST constraint — ${node.val} is not strictly between ${minStr} and ${maxStr}. This tree is NOT a valid BST.`,
        { ...highlights }, false, 4,
        { nodeVal: node.val, violated: true }
      )
      return false
    }

    highlights[node.id] = 'visiting'
    push(steps,
      `Node ${node.val} passes — it is within (${minStr}, ${maxStr}). Now check the left subtree: all values there must be less than ${node.val}.`,
      { ...highlights }, valid, 5
    )

    const leftOk = validate(node.left, min, node.val)
    if (!leftOk) return false

    push(steps,
      `Left subtree of node ${node.val} is valid. Now check the right subtree: all values there must be greater than ${node.val}.`,
      { ...highlights }, valid, 6
    )

    const rightOk = validate(node.right, node.val, max)
    if (!rightOk) return false

    highlights[node.id] = 'done'
    push(steps,
      `Both subtrees of node ${node.val} are valid. This node and its subtree satisfy the BST property.`,
      { ...highlights }, valid, 7
    )
    return true
  }

  const result = validate(root, -Infinity, Infinity)
  push(steps,
    result
      ? `Validation complete! Every node satisfies its inherited range. This IS a valid BST.`
      : `Validation found a violation. This is NOT a valid BST.`,
    highlights, result, 7, { done: true, answer: result }
  )
}

export function generateSteps(algo, treeArr) {
  const steps = []
  const root = buildTree(treeArr)

  if (!root) {
    steps.push({ description: 'An empty tree is a valid BST by definition.', highlights: {}, isValid: true, codeLineIndex: 3, done: true, answer: true })
    return steps
  }

  validateBST(root, steps)
  return steps
}
