// 042 — Clone Graph · steps.js

// DFS pseudocode line indices:
// 0: function cloneGraph(node):
// 1:   if node == null: return null
// 2:   visited = {}
// 3:   function dfs(curr):
// 4:     if curr in visited: return visited[curr]
// 5:     clone = new Node(curr.val)
// 6:     visited[curr] = clone
// 7:     for each neighbor in curr.neighbors:
// 8:       clone.neighbors.push(dfs(neighbor))
// 9:     return clone

function push(steps, desc, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(algo, adjList) {
  // adjList: array where adjList[i] = list of neighbor indices (0-based)
  const steps = []
  const n = adjList.length
  if (n === 0) {
    steps.push({ description: 'Empty graph.', highlights: {}, codeLineIndex: 1, done: true })
    return steps
  }

  push(steps,
    'Clone Graph: we DFS from node 1, creating a copy for each visited node. We use a hash map to avoid re-cloning already-visited nodes.',
    {}, 0
  )

  const highlights = {}
  const visited = new Set()
  const cloned = {}

  function dfs(id) {
    if (visited.has(id)) {
      highlights[id] = 'done'
      push(steps,
        `Node ${id+1} already in visited map — return existing clone. No duplicate processing.`,
        { ...highlights }, 4
      )
      return
    }
    highlights[id] = 'current'
    push(steps,
      `DFS at node ${id+1}. Not yet visited — create a new clone node.`,
      { ...highlights }, 5
    )
    visited.add(id)
    cloned[id] = { id, val: id + 1 }
    highlights[id] = 'visiting'
    push(steps,
      `Cloned node ${id+1}. Add to visited map. Now iterating over neighbors: [${(adjList[id] ?? []).map(x=>x+1).join(', ')}].`,
      { ...highlights }, 6
    )
    for (const nb of (adjList[id] ?? [])) {
      highlights[nb] = highlights[nb] === 'done' ? 'done' : 'compare'
      push(steps,
        `Processing neighbor ${nb+1} of node ${id+1}.`,
        { ...highlights }, 8
      )
      dfs(nb)
    }
    highlights[id] = 'done'
    push(steps,
      `All neighbors of node ${id+1} cloned. Return clone.`,
      { ...highlights }, 9
    )
  }

  dfs(0)

  push(steps,
    `Graph cloned! All ${n} nodes and their edges are faithfully reproduced in the new graph.`,
    { ...highlights }, 9, { done: true }
  )
  return steps
}
