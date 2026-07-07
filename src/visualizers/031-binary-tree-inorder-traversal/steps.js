// 031 — Binary Tree Inorder Traversal · steps.js

// Pseudocode line indices:
// 0: function inorder(root):
// 1:   stack = [], curr = root
// 2:   while curr is not null or stack is not empty:
// 3:     while curr is not null: push curr onto stack; curr = curr.left
// 4:     curr = stack.pop()
// 5:     result.append(curr.val)
// 6:     curr = curr.right
// 7:   return result

function push(steps, desc, highlights, result, stack, codeLineIndex, extra = {}) {
  steps.push({ description: desc, highlights: { ...highlights }, result: [...result], stack: [...stack], codeLineIndex, ...extra })
}

function buildTree(arr) {
  if (!arr || arr.length === 0) return null
  const nodeArr = arr.map((v, i) => v !== null ? { val: v, id: i, left: null, right: null } : null)
  for (let i = 0; i < nodeArr.length; i++) {
    if (!nodeArr[i]) continue
    if (2 * i + 1 < nodeArr.length) nodeArr[i].left  = nodeArr[2 * i + 1]
    if (2 * i + 2 < nodeArr.length) nodeArr[i].right = nodeArr[2 * i + 2]
  }
  return nodeArr[0]
}

function inorderIterative(root, steps) {
  const result = []
  const highlights = {}
  const stack = []  // stack of node objects

  push(steps, 'Starting iterative inorder traversal. We use a stack to simulate recursion. Our pointer begins at the root.', {}, result, [], 1)

  let curr = root
  while (curr !== null || stack.length > 0) {
    while (curr !== null) {
      push(steps,
        `Push node ${curr.val} onto the stack and move left. We keep going left until we reach the leftmost node — that is the first value to record in inorder.`,
        { ...highlights, [curr.id]: 'current' }, result,
        [...stack.map(n => n.val), curr.val], 3
      )
      stack.push(curr)
      highlights[curr.id] = 'visiting'
      curr = curr.left
    }
    const node = stack.pop()
    push(steps,
      `Reached a null left child. Pop node ${node.val} from the stack — this is the next node in inorder order. Record ${node.val} in the result.`,
      { ...highlights }, result, stack.map(n => n.val), 4
    )
    result.push(node.val)
    highlights[node.id] = 'done'
    push(steps,
      `Node ${node.val} added to the result. Now move to its right child — we must explore the right subtree before continuing up the stack.`,
      { ...highlights }, result, stack.map(n => n.val), 5, { justAdded: node.val }
    )
    curr = node.right
  }

  push(steps,
    `Inorder traversal complete! Result: [${result.join(', ')}]. For a BST this is always sorted in ascending order.`,
    highlights, result, [], 7, { done: true }
  )
}

function inorderRecursive(root, steps) {
  const result = []
  const highlights = {}

  // Pseudocode line indices for recursive version:
  // 0: function inorder(node):
  // 1:   if node is null: return
  // 2:   inorder(node.left)
  // 3:   result.append(node.val)
  // 4:   inorder(node.right)
  // 5:   return result

  push(steps, 'Starting recursive inorder traversal. We will call inorder on the left subtree, then record this node, then the right subtree.', {}, result, [], 0)

  function dfs(node) {
    if (!node) return
    push(steps,
      `Entered node ${node.val}. Recurse into the left child first — in inorder, the left subtree always comes before the root.`,
      { ...highlights, [node.id]: 'current' }, result, [], 2
    )
    highlights[node.id] = 'visiting'
    dfs(node.left)

    result.push(node.val)
    highlights[node.id] = 'done'
    push(steps,
      `Left subtree of node ${node.val} is finished. Record ${node.val} in the result, then recurse into the right child.`,
      { ...highlights }, result, [], 3, { justAdded: node.val }
    )
    dfs(node.right)
  }

  dfs(root)
  push(steps,
    `Recursive inorder traversal complete! Result: [${result.join(', ')}].`,
    highlights, result, [], 5, { done: true }
  )
}

export function generateSteps(algo, treeArr) {
  const steps = []
  const root = buildTree(treeArr)

  if (!root) {
    steps.push({ description: 'The tree is empty — nothing to traverse.', highlights: {}, result: [], stack: [], codeLineIndex: 0 })
    return steps
  }

  if (algo === 'iterative') {
    inorderIterative(root, steps)
  } else {
    inorderRecursive(root, steps)
  }

  return steps
}
