// 047 — Number of Connected Components · steps.js

// DFS line indices:
// 0: function countComponents(n, edges):
// 1:   build adjacency list
// 2:   visited = new Set()
// 3:   count = 0
// 4:   for each node i:
// 5:     if i not in visited:
// 6:       dfs(i); count++
// 7:   return count

// Union-Find line indices:
// 0: function countComponents(n, edges):
// 1:   parent = [0..n-1]; count = n
// 2:   function find(x): ...
// 3:   function union(x, y):
// 4:     if find(x) != find(y): merge; count--
// 5:   for each [u,v] in edges:
// 6:     union(u, v)
// 7:   return count

function push(steps, desc, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(algo, n, edges) {
  const steps = []
  const highlights = {}

  const adj = Array.from({ length: n }, () => [])
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u) }

  push(steps,
    `Count Connected Components: ${n} nodes, ${edges.length} edges. We count the number of separate connected groups.`,
    {}, 0
  )

  if (algo === 'dfs') {
    const visited = new Set()
    let count = 0
    const compMap = {}  // nodeId → component id (1-based)

    function dfs(node, compId) {
      visited.add(node)
      compMap[node] = compId
      highlights[node] = 'current'
      push(steps, `DFS at node ${node}. Mark visited (component #${compId}). Neighbors: [${adj[node].join(', ')}].`, { ...highlights }, 5, { count, compMap: { ...compMap } })
      for (const nb of adj[node]) {
        if (!visited.has(nb)) {
          highlights[nb] = 'compare'
          push(steps, `Recurse into unvisited neighbor ${nb}.`, { ...highlights }, 6, { count, compMap: { ...compMap } })
          dfs(nb, compId)
        }
      }
      highlights[node] = 'done'
    }

    for (let i = 0; i < n; i++) {
      push(steps, `Check node ${i}: ${visited.has(i) ? 'already visited' : 'unvisited — new component!'}.`, { ...highlights }, 4, { count, compMap: { ...compMap } })
      if (!visited.has(i)) {
        count++
        push(steps, `Starting DFS from node ${i}. Component #${count}.`, { ...highlights }, 6, { count, compMap: { ...compMap } })
        dfs(i, count)
        push(steps, `Component #${count} complete.`, { ...highlights }, 6, { count, compMap: { ...compMap } })
      }
    }

    push(steps, `Total connected components: ${count}.`, { ...highlights }, 7, { count, compMap: { ...compMap }, done: true })
  } else {
    // Union-Find
    const parent = Array.from({ length: n }, (_, i) => i)
    const rank   = new Array(n).fill(0)
    let count = n

    function find(x) {
      if (parent[x] !== x) parent[x] = find(parent[x])
      return parent[x]
    }

    push(steps, `Union-Find: start with ${n} components (each node is its own component).`, {}, 1, { count })

    for (const [u, v] of edges) {
      highlights[u] = 'current'; highlights[v] = 'compare'
      const ru = find(u), rv = find(v)
      push(steps,
        `Edge (${u},${v}): find(${u})=${ru}, find(${v})=${rv}.${ru === rv ? ' Same component, skip.' : ' Different — union! count--'}`,
        { ...highlights }, 5
      )
      if (ru !== rv) {
        if (rank[ru] < rank[rv]) parent[ru] = rv
        else if (rank[ru] > rank[rv]) parent[rv] = ru
        else { parent[rv] = ru; rank[ru]++ }
        count--
        highlights[u] = 'done'; highlights[v] = 'done'
        push(steps, `Merged. Components remaining: ${count}.`, { ...highlights }, 4, { count })
      } else {
        highlights[u] = 'done'; highlights[v] = 'done'
      }
    }

    push(steps, `Total connected components: ${count}.`, { ...highlights }, 7, { count, done: true })
  }

  return steps
}
