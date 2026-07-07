// 041 — Number of Islands · steps.js

function push(steps, desc, grid, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, grid: grid.map(r => [...r]), highlights: { ...highlights }, codeLineIndex, ...extra })
}

function cloneGrid(g) { return g.map(r => [...r]) }
function buildGrid(arr) { return arr.map(r => [...r]) }

// islandId stored in highlights as 'island-N' string for per-island coloring
export function generateSteps(algo, gridArr) {
  const steps = []
  const grid = buildGrid(gridArr)
  const rows = grid.length
  const cols = grid[0].length
  const highlights = {}

  push(steps,
    "Starting island counting. We iterate every cell; when we find a '1' (land), we flood-fill it to mark the entire island, then increment count.",
    cloneGrid(grid), {}, 0
  )

  let count = 0

  if (algo === 'dfs') {
    function dfs(r, c, islandId) {
      if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') return
      const key = `${r},${c}`
      highlights[key] = 'current'
      push(steps, `DFS at (${r},${c}). Land cell — mark visited and recurse 4 neighbors.`, cloneGrid(grid), { ...highlights }, 8, { count, islandId })
      grid[r][c] = '0'
      highlights[key] = `island-${islandId}`
      push(steps, `Marked (${r},${c}) visited (island #${islandId}).`, cloneGrid(grid), { ...highlights }, 8, { count, islandId })
      dfs(r - 1, c, islandId); dfs(r + 1, c, islandId)
      dfs(r, c - 1, islandId); dfs(r, c + 1, islandId)
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = `${r},${c}`
        highlights[key] = 'scanning'
        push(steps, `Scanning cell (${r},${c}) = '${grid[r][c]}'.`, cloneGrid(grid), { ...highlights }, 2, { count })
        highlights[key] = undefined
        if (grid[r][c] === '1') {
          count++
          push(steps, `Found land at (${r},${c})! Island #${count} discovered. Starting DFS flood-fill.`, cloneGrid(grid), { ...highlights }, 4, { count })
          dfs(r, c, count)
          push(steps, `Island #${count} fully explored.`, cloneGrid(grid), { ...highlights }, 4, { count })
        }
      }
    }
  } else {
    // BFS
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = `${r},${c}`
        highlights[key] = 'scanning'
        push(steps, `Scanning cell (${r},${c}) = '${grid[r][c]}'.`, cloneGrid(grid), { ...highlights }, 2, { count })
        highlights[key] = undefined
        if (grid[r][c] === '1') {
          count++
          push(steps, `Found land at (${r},${c})! Island #${count} discovered. Starting BFS.`, cloneGrid(grid), { ...highlights }, 4, { count })
          const queue = [[r, c]]
          grid[r][c] = '0'
          highlights[key] = 'queued'
          while (queue.length > 0) {
            const [cr, cc] = queue.shift()
            highlights[`${cr},${cc}`] = 'current'
            push(steps, `BFS: processing (${cr},${cc}). Exploring 4-neighbors.`, cloneGrid(grid), { ...highlights }, 8, { count })
            for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
              const nr = cr + dr, nc = cc + dc
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === '1') {
                grid[nr][nc] = '0'
                queue.push([nr, nc])
                highlights[`${nr},${nc}`] = 'queued'
              }
            }
            highlights[`${cr},${cc}`] = `island-${count}`
          }
          push(steps, `Island #${count} fully explored.`, cloneGrid(grid), { ...highlights }, 4, { count })
        }
      }
    }
  }

  push(steps, `Done! Total islands = ${count}.`, cloneGrid(grid), { ...highlights }, 5, { count, done: true })
  return steps
}
