// 043 — Course Schedule · steps.js
// Detect cycle in a directed graph (DFS topo-sort or BFS Kahn's)

// DFS line indices:
// 0: function canFinish(numCourses, prerequisites):
// 1:   build adjacency list
// 2:   state[i] = 0 (unvisited), 1 (in-stack), 2 (done)
// 3:   function dfs(node):
// 4:     if state[node] == 1: return false  // cycle!
// 5:     if state[node] == 2: return true   // already done
// 6:     state[node] = 1  // mark in-stack
// 7:     for each neighbor: if !dfs(neighbor) return false
// 8:     state[node] = 2  // mark done
// 9:     return true

// BFS (Kahn's) line indices:
// 0: function canFinish(numCourses, prerequisites):
// 1:   build adjacency list + in-degree array
// 2:   queue = [all nodes with in-degree 0]
// 3:   while queue not empty:
// 4:     pop u; processed++
// 5:     for each neighbor v: in-degree[v]--
// 6:     if in-degree[v] == 0: queue.push(v)
// 7:   return processed == numCourses

function push(steps, desc, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(algo, numCourses, prereqs) {
  const steps = []
  const highlights = {}

  // Build adjacency list
  const adj = Array.from({ length: numCourses }, () => [])
  for (const [a, b] of prereqs) adj[b].push(a) // b → a (must take b before a)

  push(steps,
    `Can Finish: ${numCourses} courses, ${prereqs.length} prerequisites. We need to detect if a cycle exists. If a cycle is present, we cannot finish all courses.`,
    {}, 0
  )

  if (algo === 'dfs') {
    // 0=unvisited, 1=in-stack, 2=done
    const state = new Array(numCourses).fill(0)
    let hasCycle = false

    function dfs(node) {
      if (state[node] === 1) {
        highlights[node] = 'error'
        push(steps,
          `Back-edge detected at node ${node}! This confirms a cycle — courses cannot be finished.`,
          { ...highlights }, 4
        )
        hasCycle = true
        return false
      }
      if (state[node] === 2) {
        push(steps, `Node ${node} already fully processed — skip.`, { ...highlights }, 5)
        return true
      }
      state[node] = 1
      highlights[node] = 'current'
      push(steps,
        `DFS entering node ${node}. Mark as in-stack (gray). Neighbors: [${adj[node].join(', ')}].`,
        { ...highlights }, 6
      )
      for (const nb of adj[node]) {
        if (hasCycle) return false
        highlights[nb] = 'compare'
        push(steps, `Visiting neighbor ${nb} of node ${node}.`, { ...highlights }, 7)
        if (!dfs(nb)) return false
      }
      state[node] = 2
      highlights[node] = 'done'
      push(steps, `Node ${node} fully processed — mark done (black).`, { ...highlights }, 8)
      return true
    }

    for (let i = 0; i < numCourses && !hasCycle; i++) {
      if (state[i] === 0) {
        highlights[i] = 'special'
        push(steps, `Starting DFS from unvisited node ${i}.`, { ...highlights }, 3)
        dfs(i)
      }
    }

    const result = !hasCycle
    push(steps,
      hasCycle
        ? 'Cycle detected! Cannot finish all courses. Return false.'
        : `No cycle found! All ${numCourses} courses can be completed. Return true.`,
      { ...highlights }, 9, { result, done: true }
    )
  } else {
    // BFS — Kahn's algorithm
    const inDegree = new Array(numCourses).fill(0)
    for (const [a] of prereqs.map((_, idx) => prereqs[idx])) void a // eslint-disable-line
    for (const [a, b] of prereqs) { void b; inDegree[a]++ }

    push(steps,
      `Kahn's BFS: compute in-degree for each node. Nodes with in-degree 0 can be taken immediately.`,
      {}, 1
    )

    const queue = []
    for (let i = 0; i < numCourses; i++) {
      if (inDegree[i] === 0) { queue.push(i); highlights[i] = 'compare' }
    }

    push(steps,
      `Initial queue (in-degree 0): [${queue.join(', ')}]. Process these nodes first.`,
      { ...highlights }, 2
    )

    let processed = 0
    while (queue.length > 0) {
      const u = queue.shift()
      highlights[u] = 'current'
      push(steps,
        `Processing node ${u}. Decrement in-degree of its neighbors: [${adj[u].join(', ')}].`,
        { ...highlights }, 4
      )
      processed++
      for (const v of adj[u]) {
        inDegree[v]--
        highlights[v] = 'visiting'
        push(steps,
          `Decremented in-degree of ${v} to ${inDegree[v]}.${inDegree[v] === 0 ? ' in-degree hits 0 — enqueue!' : ''}`,
          { ...highlights }, 5
        )
        if (inDegree[v] === 0) { queue.push(v); highlights[v] = 'compare' }
      }
      highlights[u] = 'done'
    }

    const result = processed === numCourses
    push(steps,
      result
        ? `Processed all ${numCourses} nodes — no cycle! All courses can be completed.`
        : `Only processed ${processed}/${numCourses} nodes — cycle detected! Cannot finish all courses.`,
      { ...highlights }, 7, { result, done: true }
    )
  }

  return steps
}
