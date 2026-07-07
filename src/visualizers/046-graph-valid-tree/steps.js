// 046 — Graph Valid Tree · steps.js
// A graph is a valid tree iff: connected + no cycle = exactly n-1 edges

// DFS line indices:
// 0: function validTree(n, edges):
// 1:   if edges.length != n-1: return false
// 2:   build adjacency list
// 3:   visited = new Set()
// 4:   function dfs(node, parent):
// 5:     visited.add(node)
// 6:     for each neighbor:
// 7:       if neighbor == parent: skip
// 8:       if neighbor in visited: return false  // cycle
// 9:       if !dfs(neighbor, node): return false
//10:   dfs(0, -1)
//11:   return visited.size == n

// Union-Find line indices:
// 0: function validTree(n, edges):
// 1:   if edges.length != n-1: return false
// 2:   parent = [0..n-1]; rank = [0..n-1]
// 3:   function find(x): ...
// 4:   function union(x, y): ...
// 5:   for each [u,v] in edges:
// 6:     ru = find(u); rv = find(v)
// 7:     if ru == rv: return false  // cycle
// 8:     union(ru, rv)
// 9:   return true

function push(steps, desc, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(algo, n, edges) {
  const steps = []
  const highlights = {}

  push(steps,
    `Graph Valid Tree: ${n} nodes, ${edges.length} edges. A valid tree must have exactly n-1 edges and be connected with no cycles.`,
    {}, 0
  )

  if (edges.length !== n - 1) {
    push(steps,
      `edges.length (${edges.length}) ≠ n-1 (${n - 1}). Cannot be a tree — return false immediately.`,
      {}, 1, { result: false, done: true }
    )
    return steps
  }

  // Build adjacency list
  const adj = Array.from({ length: n }, () => [])
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u) }

  if (algo === 'dfs') {
    const visited = new Set()
    let hasCycle = false

    function dfs(node, parent) {
      visited.add(node)
      highlights[node] = 'current'
      push(steps,
        `DFS at node ${node} (parent=${parent}). Neighbors: [${adj[node].join(', ')}].`,
        { ...highlights }, 5
      )
      for (const nb of adj[node]) {
        if (nb === parent) {
          push(steps, `Neighbor ${nb} is parent — skip undirected back-edge.`, { ...highlights }, 7)
          continue
        }
        if (visited.has(nb)) {
          highlights[nb] = 'error'
          push(steps, `Neighbor ${nb} already visited (not parent) — CYCLE detected! Not a tree.`, { ...highlights }, 8)
          hasCycle = true
          return false
        }
        highlights[nb] = 'compare'
        push(steps, `Recurse into unvisited neighbor ${nb}.`, { ...highlights }, 9)
        if (!dfs(nb, node)) return false
      }
      highlights[node] = 'done'
      return true
    }

    dfs(0, -1)

    const result = !hasCycle && visited.size === n
    push(steps,
      result
        ? `No cycle, all ${n} nodes visited — valid tree!`
        : hasCycle
          ? 'Cycle found — not a valid tree.'
          : `Only ${visited.size}/${n} nodes reachable — graph is disconnected, not a tree.`,
      { ...highlights }, 11, { result, done: true }
    )
  } else {
    // Union-Find
    const parent = Array.from({ length: n }, (_, i) => i)
    const rank   = new Array(n).fill(0)

    function find(x) {
      if (parent[x] !== x) parent[x] = find(parent[x])
      return parent[x]
    }

    function union(x, y) {
      const rx = find(x), ry = find(y)
      if (rx === ry) return false
      if (rank[rx] < rank[ry]) parent[rx] = ry
      else if (rank[rx] > rank[ry]) parent[ry] = rx
      else { parent[ry] = rx; rank[rx]++ }
      return true
    }

    push(steps, 'Union-Find: initialize each node as its own parent.', {}, 2)

    let hasCycle = false
    for (const [u, v] of edges) {
      highlights[u] = 'current'; highlights[v] = 'compare'
      const ru = find(u), rv = find(v)
      push(steps,
        `Edge (${u},${v}): find(${u})=${ru}, find(${v})=${rv}.${ru === rv ? ' Same component — CYCLE!' : ' Different components — union.'}`,
        { ...highlights }, 7
      )
      if (ru === rv) {
        highlights[u] = 'error'; highlights[v] = 'error'
        hasCycle = true
        push(steps, `Cycle detected — return false.`, { ...highlights }, 7, { result: false, done: true })
        return steps
      }
      union(u, v)
      highlights[u] = 'done'; highlights[v] = 'done'
      push(steps, `Unioned (${u},${v}).`, { ...highlights }, 8)
    }

    push(steps, `All edges processed with no cycles — valid tree!`, { ...highlights }, 9, { result: true, done: true })
  }

  return steps
}
