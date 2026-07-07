// 048 — Pacific Atlantic Water Flow · steps.js
// DFS/BFS from Pacific border & Atlantic border separately; result = intersection

// DFS line indices:
// 0: function pacificAtlantic(heights):
// 1:   start DFS from Pacific borders (top, left)
// 2:   start DFS from Atlantic borders (bottom, right)
// 3:   function dfs(r, c, visited, prevHeight):
// 4:     if out of bounds or visited or heights[r][c] < prevHeight: return
// 5:     visited.add((r,c))
// 6:     dfs 4 neighbors
// 7:   result = cells in both pacific and atlantic sets

// BFS line indices same structure

function push(steps, desc, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, highlights: { ...highlights }, codeLineIndex, ...extra })
}

function key(r, c) { return `${r},${c}` }

export function generateSteps(algo, heights) {
  const steps = []
  const rows = heights.length
  const cols = heights[0].length
  const highlights = {}

  push(steps,
    `Pacific Atlantic Water Flow: water flows from high to low cells. Find all cells from which water can reach BOTH the Pacific (top/left) and Atlantic (bottom/right) oceans.`,
    {}, 0
  )

  const pacific  = new Set()
  const atlantic = new Set()

  if (algo === 'dfs') {
    function dfs(r, c, visited, prevH) {
      const k = key(r, c)
      if (r < 0 || r >= rows || c < 0 || c >= cols || visited.has(k) || heights[r][c] < prevH) return
      visited.add(k)
      highlights[k] = visited === pacific ? 'compare' : 'visiting'
      dfs(r-1, c, visited, heights[r][c])
      dfs(r+1, c, visited, heights[r][c])
      dfs(r, c-1, visited, heights[r][c])
      dfs(r, c+1, visited, heights[r][c])
    }

    push(steps, 'DFS from Pacific borders (top row + left column). All reachable cells are added to Pacific set.', { ...highlights }, 1)
    for (let r = 0; r < rows; r++) dfs(r, 0, pacific, 0)
    for (let c = 0; c < cols; c++) dfs(0, c, pacific, 0)

    push(steps,
      `Pacific reachable: ${pacific.size} cells (shown in blue).`,
      { ...highlights }, 1
    )

    push(steps, 'DFS from Atlantic borders (bottom row + right column). Reachable cells added to Atlantic set.', { ...highlights }, 2)
    for (let r = 0; r < rows; r++) dfs(r, cols - 1, atlantic, 0)
    for (let c = 0; c < cols; c++) dfs(rows - 1, c, atlantic, 0)

    push(steps,
      `Atlantic reachable: ${atlantic.size} cells (shown in orange).`,
      { ...highlights }, 2
    )
  } else {
    // BFS
    function bfs(starts, visited, color) {
      const queue = [...starts]
      for (const [r, c] of starts) { visited.add(key(r, c)); highlights[key(r, c)] = color }
      while (queue.length > 0) {
        const [r, c] = queue.shift()
        for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          const nr = r+dr, nc = c+dc
          const k = key(nr, nc)
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(k) && heights[nr][nc] >= heights[r][c]) {
            visited.add(k)
            queue.push([nr, nc])
            highlights[k] = color
          }
        }
      }
    }

    const pacificStarts = []
    const atlanticStarts = []
    for (let r = 0; r < rows; r++) { pacificStarts.push([r, 0]); atlanticStarts.push([r, cols-1]) }
    for (let c = 0; c < cols; c++) { pacificStarts.push([0, c]); atlanticStarts.push([rows-1, c]) }

    push(steps, 'BFS from Pacific borders (top row + left column).', { ...highlights }, 1)
    bfs(pacificStarts, pacific, 'compare')
    push(steps, `Pacific reachable: ${pacific.size} cells (blue).`, { ...highlights }, 1)

    push(steps, 'BFS from Atlantic borders (bottom row + right column).', { ...highlights }, 2)
    bfs(atlanticStarts, atlantic, 'visiting')
    push(steps, `Atlantic reachable: ${atlantic.size} cells (orange).`, { ...highlights }, 2)
  }

  // Find intersection
  const result = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = key(r, c)
      if (pacific.has(k) && atlantic.has(k)) {
        result.push([r, c])
        highlights[k] = 'done'
      }
    }
  }

  push(steps,
    `Intersection: ${result.length} cells can reach BOTH oceans: [${result.map(([r,c])=>`(${r},${c})`).join(', ')}].`,
    { ...highlights }, 7, { result, done: true }
  )
  return steps
}
