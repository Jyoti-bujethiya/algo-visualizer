/**
 * Tutorial content for #041 — Number of Islands
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a 2D grid of '1's (land) and '0's (water), count the number of islands. An island is a group of '1's connected horizontally or vertically. The grid is surrounded by water on all edges. You can assume all four edges of the grid are water.`,
    example: `grid = [\n  ["1","1","0","0"],\n  ["1","1","0","0"],\n  ["0","0","1","0"],\n  ["0","0","0","1"]\n]\n→ Top-left group of 1s = island 1\n→ Middle 1 = island 2\n→ Bottom-right 1 = island 3\n✅ Answer: 3`,
    keyInsight: `Every time you find an unvisited '1', you've found a new island. To avoid counting the same island twice, flood-fill (DFS or BFS) from that cell to mark all connected land cells as visited before moving on.`,
  },

  approaches: {
    'DFS Recursive': {
      intuition: `Scan the grid cell by cell. When you find a '1' that hasn't been visited, increment the island count, then DFS in all four directions (up, down, left, right) to mark the entire island as visited (e.g. change '1' to '0' or mark in a visited array). Continue scanning — any new '1' you find after that is a different island.`,
      steps: [
        `Iterate over every cell (r, c) in the grid.`,
        `If grid[r][c] === '1': increment island count; call dfs(r, c).`,
        `dfs(r, c): if out of bounds or grid[r][c] !== '1', return immediately.`,
        `Mark grid[r][c] = '0' (or visited) to prevent revisiting.`,
        `Recursively call dfs on all four neighbours: (r-1,c), (r+1,c), (r,c-1), (r,c+1).`,
        `Return the final count after scanning all cells.`,
      ],
      example: `grid (simplified, 3×3): [["1","1","0"],["1","1","0"],["0","0","1"]]\n\nScan (0,0): '1' found! count=1. DFS:\n  Mark (0,0)='0'. Visit (0,1)→mark '0'. Visit (1,0)→mark '0'. Visit (1,1)→mark '0'.\n  All neighbours of marked cells are now '0' or out of bounds.\nScan (0,1),(1,0),(1,1): already '0', skip.\nScan (2,2): '1' found! count=2. DFS: mark (2,2)='0'.\nFinal count: 2\n✅ Answer: 2`,
      keyInsight: `O(m×n) time and O(m×n) space (recursion depth). Modifying the grid in-place avoids a separate visited array. If you cannot modify the input, use a boolean visited matrix instead.`,
    },

    BFS: {
      intuition: `Same logic as DFS but use a queue instead of recursion. When you find an unvisited '1', enqueue it, mark it visited, and increment the count. Then process the queue: for each cell dequeued, enqueue all unvisited '1' neighbours and mark them visited. When the queue empties, the entire island is processed.`,
      steps: [
        `Iterate over every cell (r, c) in the grid.`,
        `If grid[r][c] === '1': increment island count. Mark grid[r][c] = '0'. Enqueue (r, c).`,
        `While the queue is not empty: dequeue (r, c).`,
        `For each of the four directions: if the neighbour is in bounds and equals '1', mark it '0' and enqueue it.`,
        `Continue scanning the grid after the queue empties.`,
        `Return the final count.`,
      ],
      example: `grid (3×3): [["1","1","0"],["1","1","0"],["0","0","1"]]\n\nScan (0,0): count=1, mark (0,0)='0', queue=[(0,0)]\nDequeue (0,0): neighbours (0,1)='1'→mark,enqueue; (1,0)='1'→mark,enqueue.\nQueue=[(0,1),(1,0)]\nDequeue (0,1): neighbour (1,1)='1'→mark,enqueue.\nDequeue (1,0): (1,1) already '0', skip.\nDequeue (1,1): all neighbours '0' or visited.\nQueue empty. Scanning continues...\nScan (2,2): '1' found! count=2. BFS marks it.\n✅ Answer: 2`,
      keyInsight: `O(m×n) time and O(min(m,n)) space for the queue (BFS wave front). Iterative BFS avoids recursion depth issues for very large grids.`,
    },

    'Union-Find': {
      intuition: `Treat every land cell ('1') as its own component initially, counting total land cells. Then scan all land cells: for each adjacent pair of land cells, union them. Each successful union (merging two previously separate components) decrements the island count. After processing all adjacencies, the count equals the number of islands.`,
      steps: [
        `Build a Union-Find structure over all m×n cells. Count = number of '1' cells.`,
        `For each '1' cell (i,j), check its right neighbour (i,j+1) and bottom neighbour (i+1,j).`,
        `If the neighbour is also '1' and in a different component: union them and decrement count.`,
        `Repeat for all cells. Return count.`,
      ],
      example: `grid (3×3): [["1","1","0"],["1","1","0"],["0","0","1"]]\nLand cells: (0,0),(0,1),(1,0),(1,1),(2,2). count=5.\n\nUnion (0,0)↔(0,1): different → merge, count=4.\nUnion (0,0)↔(1,0): different → merge, count=3.\nUnion (0,1)↔(1,1): different → merge, count=2.\nUnion (1,0)↔(1,1): same root already → skip.\nNo neighbours for (2,2).\nFinal count: 2\n✅ Answer: 2`,
      keyInsight: `O(m×n × α(m×n)) ≈ O(m×n) time, O(m×n) space. Union-Find is elegant here — counting merges gives the island count directly. Useful when grid cells are added dynamically (online variant of the problem).`,
    },

    'DFS with Visited Array': {
      intuition: `Same logic as DFS Recursive, but instead of modifying the grid in-place (changing '1' to '0'), track visited cells in a separate boolean array. This preserves the original grid, which is important when the input must not be mutated. The DFS flood-fill logic is otherwise identical.`,
      steps: [
        `Create a boolean visited[m][n] array, initialised to false.`,
        `Iterate over every cell (r, c). If grid[r][c] === '1' AND visited[r][c] is false: increment count; call dfsVis(r, c).`,
        `dfsVis(r, c): if out of bounds, not '1', or already visited, return.`,
        `Mark visited[r][c] = true.`,
        `Recursively call dfsVis on all four neighbours.`,
        `Return the final count.`,
      ],
      example: `grid (3×3): [["1","1","0"],["1","1","0"],["0","0","1"]]\n\nScan (0,0): '1' and unvisited → count=1. DFS:\n  Mark (0,0). Visit (0,1)→mark. Visit (1,0)→mark. Visit (1,1)→mark.\nScan (0,1),(1,0),(1,1): visited, skip.\nScan (2,2): '1' and unvisited → count=2. DFS: mark (2,2).\nOriginal grid unchanged.\n✅ Answer: 2`,
      keyInsight: `O(m×n) time, O(m×n) space (visited array + recursion). Slightly more memory than in-place DFS but preserves the input. Use this when you cannot modify the given grid.`,
    },

    'Iterative DFS (Stack)': {
      intuition: `Replace the recursive flood-fill with an explicit stack. When an unvisited '1' is found, push it, mark it, and increment count. Then pop cells from the stack one at a time; for each cell, push all unvisited '1' neighbours and mark them immediately. Continue until the stack is empty, then resume scanning.`,
      steps: [
        `Iterate over every cell (r, c). If grid[r][c] === '1': increment count; mark grid[r][c] = '0'; push (r, c) onto stack.`,
        `While stack is not empty: pop (r, c).`,
        `For each of the four neighbours (nr, nc): if in bounds and grid[nr][nc] === '1', mark '0' and push.`,
        `Stack empties when the entire island is processed. Continue outer scan.`,
        `Return final count.`,
      ],
      example: `grid (3×3): [["1","1","0"],["1","1","0"],["0","0","1"]]\n\nScan (0,0): count=1, mark '0', stack=[(0,0)]\nPop (0,0): neighbours (0,1)='1'→mark,push; (1,0)='1'→mark,push. Stack=[(0,1),(1,0)]\nPop (1,0): neighbour (1,1)='1'→mark,push. Stack=[(0,1),(1,1)]\nPop (1,1): neighbours all '0'. Stack=[(0,1)]\nPop (0,1): neighbours all '0'. Stack=[]\nScan (2,2): count=2, mark '0', stack=[(2,2)]\nPop (2,2): no '1' neighbours. Stack=[]\n✅ Answer: 2`,
      keyInsight: `O(m×n) time, O(m×n) space for the stack. Iterative DFS avoids recursion depth issues on very large grids (e.g., a 300×300 all-land grid would recurse 90000 levels deep recursively).`,
    },
  },
}
