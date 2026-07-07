// 044 — Course Schedule II · steps.js
// Returns topological order or [] if cycle exists

// DFS line indices:
// 0: function findOrder(numCourses, prerequisites):
// 1:   build adjacency list
// 2:   state[i] = 0/1/2  (unvisited/in-stack/done)
// 3:   result = []
// 4:   function dfs(node):
// 5:     if state[node] == 1: cycle! return false
// 6:     if state[node] == 2: return true
// 7:     state[node] = 1
// 8:     for each neighbor: if !dfs(neighbor) return false
// 9:     state[node] = 2; result.push(node)
//10:   for each node: dfs(node)
//11:   return hasCycle ? [] : result.reverse()

// BFS (Kahn's) line indices:
// 0: function findOrder(numCourses, prerequisites):
// 1:   build adj list + in-degree
// 2:   queue = [in-degree 0 nodes]
// 3:   order = []
// 4:   while queue not empty:
// 5:     pop u; order.push(u)
// 6:     for each neighbor v: in-degree[v]--
// 7:     if in-degree[v] == 0: queue.push(v)
// 8:   return order.length == numCourses ? order : []

function push(steps, desc, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(algo, numCourses, prereqs) {
  const steps = []
  const highlights = {}

  const adj = Array.from({ length: numCourses }, () => [])
  for (const [a, b] of prereqs) adj[b].push(a)

  push(steps,
    `Course Schedule II: find a valid ordering of all ${numCourses} courses. Returns [] if there is a cycle.`,
    {}, 0
  )

  if (algo === 'dfs') {
    const state = new Array(numCourses).fill(0)
    const order = []
    let hasCycle = false

    function dfs(node) {
      if (state[node] === 1) {
        highlights[node] = 'error'
        push(steps, `Cycle detected at node ${node}! Topological ordering is impossible.`, { ...highlights }, 5)
        hasCycle = true
        return false
      }
      if (state[node] === 2) {
        push(steps, `Node ${node} already processed — skip.`, { ...highlights }, 6)
        return true
      }
      state[node] = 1
      highlights[node] = 'current'
      push(steps,
        `DFS at node ${node}. Mark as in-stack. Neighbors: [${adj[node].join(', ')}].`,
        { ...highlights }, 7
      )
      for (const nb of adj[node]) {
        if (hasCycle) return false
        highlights[nb] = 'compare'
        push(steps, `Recurse into neighbor ${nb}.`, { ...highlights }, 8)
        if (!dfs(nb)) return false
      }
      state[node] = 2
      order.push(node)
      highlights[node] = 'done'
      push(steps,
        `Node ${node} done. Append to order: [${[...order].join(', ')}].`,
        { ...highlights }, 9, { order: [...order] }
      )
      return true
    }

    for (let i = 0; i < numCourses && !hasCycle; i++) {
      if (state[i] === 0) dfs(i)
    }

    const result = hasCycle ? [] : [...order].reverse()
    push(steps,
      hasCycle
        ? 'Cycle found — return [].'
        : `Topological order: [${result.join(', ')}].`,
      { ...highlights }, 11, { order: result, done: true }
    )
  } else {
    // Kahn's BFS
    const inDegree = new Array(numCourses).fill(0)
    for (const [a] of prereqs) inDegree[a]++
    const order = []

    const queue = []
    for (let i = 0; i < numCourses; i++) {
      if (inDegree[i] === 0) { queue.push(i); highlights[i] = 'compare' }
    }
    push(steps,
      `Kahn's: in-degree-0 nodes = [${queue.join(', ')}]. These can be taken first.`,
      { ...highlights }, 2
    )

    while (queue.length > 0) {
      const u = queue.shift()
      highlights[u] = 'current'
      order.push(u)
      push(steps,
        `Dequeue ${u}. Current order: [${order.join(', ')}]. Process neighbors: [${adj[u].join(', ')}].`,
        { ...highlights }, 5, { order: [...order] }
      )
      for (const v of adj[u]) {
        inDegree[v]--
        highlights[v] = 'visiting'
        push(steps,
          `in-degree[${v}] → ${inDegree[v]}.${inDegree[v] === 0 ? ' Enqueue!' : ''}`,
          { ...highlights }, 6
        )
        if (inDegree[v] === 0) { queue.push(v); highlights[v] = 'compare' }
      }
      highlights[u] = 'done'
    }

    const result = order.length === numCourses ? order : []
    push(steps,
      result.length > 0
        ? `Order: [${result.join(', ')}].`
        : 'Cycle detected — return [].',
      { ...highlights }, 8, { order: result, done: true }
    )
  }

  return steps
}
