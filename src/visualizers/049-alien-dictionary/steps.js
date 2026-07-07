// 049 — Alien Dictionary · steps.js
// Topological sort on character ordering derived from sorted word list

// Kahn's BFS line indices:
// 0: function alienOrder(words):
// 1:   build graph: for adjacent words, find first differing character
// 2:   in-degree map for each unique character
// 3:   queue = [characters with in-degree 0]
// 4:   while queue not empty:
// 5:     pop c; result += c
// 6:     for each neighbor: in-degree[neighbor]--
// 7:     if in-degree[neighbor] == 0: queue.push(neighbor)
// 8:   return result if all chars included, else ''

function push(steps, desc, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(words) {
  const steps = []
  const highlights = {}

  // Collect all unique chars
  const chars = [...new Set(words.join('').split(''))]
  const charIndex = {}
  chars.forEach((c, i) => { charIndex[c] = i })
  const n = chars.length

  push(steps,
    `Alien Dictionary: derive character ordering from lexicographic word list. Characters: [${chars.join(', ')}].`,
    {}, 0
  )

  // Build graph
  const adj = {}
  chars.forEach(c => { adj[c] = [] })
  const inDegree = {}
  chars.forEach(c => { inDegree[c] = 0 })

  const edges = []

  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i], w2 = words[i + 1]
    const len = Math.min(w1.length, w2.length)
    let found = false
    for (let j = 0; j < len; j++) {
      if (w1[j] !== w2[j]) {
        adj[w1[j]].push(w2[j])
        inDegree[w2[j]]++
        edges.push([w1[j], w2[j]])
        highlights[charIndex[w1[j]]] = 'compare'
        highlights[charIndex[w2[j]]] = 'compare'
        push(steps,
          `Compare words "${w1}" and "${w2}": at position ${j}, '${w1[j]}' ≠ '${w2[j]}'. Rule: '${w1[j]}' comes before '${w2[j]}'.`,
          { ...highlights }, 1
        )
        found = true
        break
      }
    }
    if (!found && w1.length > w2.length) {
      push(steps,
        `"${w1}" is a prefix of "${w2}" but longer — invalid input, return "".`,
        {}, 1, { order: '', done: true }
      )
      return steps
    }
  }

  push(steps,
    `Graph built. Edges: [${edges.map(([a,b])=>`${a}→${b}`).join(', ')}]. In-degrees: {${chars.map(c=>`${c}:${inDegree[c]}`).join(', ')}}.`,
    { ...highlights }, 2
  )

  // Kahn's BFS
  const queue = chars.filter(c => inDegree[c] === 0)
  queue.forEach(c => { highlights[charIndex[c]] = 'current' })

  push(steps,
    `Kahn's: initial queue (in-degree=0) = [${queue.join(', ')}].`,
    { ...highlights }, 3
  )

  const order = []
  const bfsQueue = [...queue]

  while (bfsQueue.length > 0) {
    const c = bfsQueue.shift()
    order.push(c)
    highlights[charIndex[c]] = 'done'
    push(steps,
      `Dequeue '${c}'. Current order: [${order.join(', ')}]. Process neighbors: [${adj[c].join(', ')}].`,
      { ...highlights }, 5, { order: order.join('') }
    )
    for (const nb of adj[c]) {
      inDegree[nb]--
      highlights[charIndex[nb]] = 'visiting'
      push(steps,
        `in-degree['${nb}'] → ${inDegree[nb]}.${inDegree[nb] === 0 ? " Enqueue '"+nb+"'!" : ''}`,
        { ...highlights }, 6
      )
      if (inDegree[nb] === 0) { bfsQueue.push(nb); highlights[charIndex[nb]] = 'current' }
    }
  }

  const result = order.length === n ? order.join('') : ''
  push(steps,
    result
      ? `Topological order: "${result}". This is the alien alphabet ordering.`
      : `Only processed ${order.length}/${n} characters — cycle in constraints! Return "".`,
    { ...highlights }, 8, { order: result, done: true }
  )
  return steps
}
