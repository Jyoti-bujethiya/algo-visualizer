// 032 — Binary Tree Level Order Traversal · steps.js

// Pseudocode line indices:
// 0: function levelOrder(root):
// 1:   if root is null: return []
// 2:   queue = [root], result = []
// 3:   while queue is not empty:
// 4:     levelSize = queue.length; level = []
// 5:     for i in range(levelSize):
// 6:       node = queue.dequeue()
// 7:       level.append(node.val)
// 8:       if node.left: queue.enqueue(node.left)
// 9:       if node.right: queue.enqueue(node.right)
// 10:  result.append(level)
// 11: return result

function push(steps, desc, highlights, result, queue, codeLineIndex, extra = {}) {
  steps.push({ description: desc, highlights: { ...highlights }, result: result.map(l => [...l]), queue: [...queue], codeLineIndex, ...extra })
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

function levelOrderBFS(root, steps) {
  const result = []
  const highlights = {}

  push(steps, 'Starting BFS level order traversal. We use a queue — enqueue the root first. Each iteration processes one complete level before moving to the next.', {}, result, [root.val], 2)

  const queue = [root]
  highlights[root.id] = 'current'
  let levelNum = 1

  while (queue.length > 0) {
    const levelSize = queue.length
    const levelVals = []
    const levelNodeIds = queue.map(n => n.id)

    push(steps,
      `Processing level ${levelNum}. There are ${levelSize} node${levelSize > 1 ? 's' : ''} in this level. We will dequeue each one, record its value, and enqueue its children.`,
      Object.fromEntries(levelNodeIds.map(id => [id, 'current'])),
      result, queue.map(n => n.val), 4
    )

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()
      highlights[node.id] = 'visited'
      levelVals.push(node.val)

      push(steps,
        `Dequeue node ${node.val}. Add ${node.val} to the current level. Enqueue any children (left: ${node.left ? node.left.val : 'none'}, right: ${node.right ? node.right.val : 'none'}).`,
        { ...highlights, ...(node.left ? { [node.left.id]: 'current' } : {}), ...(node.right ? { [node.right.id]: 'current' } : {}) },
        [...result, [...levelVals]], queue.map(n => n.val), 6,
        { level: levelNum }
      )

      if (node.left) {
        queue.push(node.left)
        highlights[node.left.id] = 'current'
      }
      if (node.right) {
        queue.push(node.right)
        highlights[node.right.id] = 'current'
      }
    }

    result.push([...levelVals])
    push(steps,
      `Level ${levelNum} complete: [${levelVals.join(', ')}]. The queue now holds the ${queue.length} node${queue.length !== 1 ? 's' : ''} of the next level.`,
      { ...highlights },
      result, queue.map(n => n.val), 10,
      { level: levelNum, levelVals: [...levelVals] }
    )
    levelNum++
  }

  push(steps,
    `BFS complete! All ${result.length} level${result.length !== 1 ? 's' : ''} recorded: ${result.map(l => '[' + l.join(',') + ']').join(' → ')}.`,
    highlights, result, [], 11, { done: true }
  )
}

export function generateSteps(algo, treeArr) {
  const steps = []
  const root = buildTree(treeArr)

  if (!root) {
    steps.push({ description: 'The tree is empty — result is an empty list.', highlights: {}, result: [], queue: [], codeLineIndex: 1 })
    return steps
  }

  levelOrderBFS(root, steps)
  return steps
}
