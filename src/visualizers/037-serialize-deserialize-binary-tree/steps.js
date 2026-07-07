// 037 — Serialize and Deserialize Binary Tree · steps.js

// Pseudocode line indices (BFS / level-order):
// 0: function serialize(root):
// 1:   if root is null: return ""
// 2:   queue = [root]; result = []
// 3:   while queue not empty:
// 4:     node = queue.dequeue()
// 5:     if node is null: result.append("N"); continue
// 6:     result.append(node.val)
// 7:     queue.enqueue(node.left, node.right)
// 8:   return result.join(",")
// 9:
// 10: function deserialize(data):
// 11:  nodes = data.split(","); root = Node(nodes[0])
// 12:  queue = [root], i = 1
// 13:  while queue not empty:
// 14:    node = queue.dequeue()
// 15:    if nodes[i] != "N": node.left = Node(nodes[i]); queue.enqueue(node.left)
// 16:    if nodes[i+1] != "N": node.right = Node(nodes[i+1]); queue.enqueue(node.right)
// 17:    i += 2

function push(steps, desc, highlights, serialized, phase, codeLineIndex, extra = {}) {
  steps.push({ description: desc, highlights: { ...highlights }, serialized: [...serialized], phase, codeLineIndex, ...extra })
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

function serializeTree(root, steps) {
  const serialized = []
  const highlights = {}

  push(steps, 'Starting serialization using BFS (level order). We visit nodes level by level, appending each value or "N" (null) to the output string.', {}, serialized, 'serialize', 2)

  const queue = [root]
  highlights[root.id] = 'current'

  while (queue.length > 0) {
    const node = queue.shift()
    if (!node) {
      serialized.push('N')
      push(steps,
        `Dequeued a null node. Append "N" to the serialized string to mark this missing child.`,
        { ...highlights }, serialized, 'serialize', 5
      )
      continue
    }

    serialized.push(String(node.val))
    highlights[node.id] = 'visited'

    push(steps,
      `Dequeue node ${node.val}. Append ${node.val} to the output. Enqueue its left child (${node.left ? node.left.val : 'null'}) and right child (${node.right ? node.right.val : 'null'}).`,
      { ...highlights,
        ...(node.left  ? { [node.left.id]:  'current' } : {}),
        ...(node.right ? { [node.right.id]: 'current' } : {}) },
      serialized, 'serialize', 6,
      { nodeVal: node.val }
    )

    queue.push(node.left)
    queue.push(node.right)
    if (node.left)  highlights[node.left.id]  = 'current'
    if (node.right) highlights[node.right.id] = 'current'
  }

  // Trim trailing N's for cleanliness
  while (serialized.length > 0 && serialized[serialized.length - 1] === 'N') serialized.pop()
  const str = serialized.join(',')
  push(steps,
    `Serialization complete! The tree is encoded as: "${str}". This compact string fully represents the tree structure and can be used to reconstruct it later.`,
    highlights, serialized, 'serialize', 8, { done: true, serializedStr: str }
  )
}

export function generateSteps(algo, treeArr) {
  const steps = []
  const root = buildTree(treeArr)

  if (!root) {
    steps.push({ description: 'Empty tree serializes to an empty string.', highlights: {}, serialized: [], phase: 'serialize', codeLineIndex: 1 })
    return steps
  }

  serializeTree(root, steps)
  return steps
}
