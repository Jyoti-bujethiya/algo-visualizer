/**
 * Tutorial content for #048 — Pacific Atlantic Water Flow
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an m×n matrix of heights, find all cells from which rainwater can flow to BOTH the Pacific Ocean (top and left borders) AND the Atlantic Ocean (bottom and right borders). Water flows from a cell to an adjacent cell (up/down/left/right) only if the adjacent cell's height is less than or equal to the current cell's height.`,
    example: `heights=[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]\n→ Pacific touches top row and left column.\n→ Atlantic touches bottom row and right column.\n→ Cells that can reach both:\n✅ Answer: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]`,
    keyInsight: `Instead of asking "can water from cell X reach both oceans?" (expensive DFS per cell), reverse the question: start BFS/DFS from the ocean borders and find all cells that can REACH each border (water flowing uphill in reverse). Cells reachable from both borders are the answer.`,
  },

  approaches: {
    'Brute Force DFS from Each Cell': {
      intuition: `For every cell in the grid, run a DFS to check if water can flow to the Pacific, and another DFS to check if it can reach the Atlantic. A cell makes it into the answer only if both DFS calls return true. This is straightforward but very slow for large grids.`,
      steps: [
        `For each cell (r, c), run dfsCanReach(r, c, "pacific") and dfsCanReach(r, c, "atlantic").`,
        `dfsCanReach explores downhill/equal neighbours recursively. Pacific is reachable if row=0 or col=0 is hit. Atlantic if row=m-1 or col=n-1.`,
        `Use a visited set per DFS call to avoid infinite loops.`,
        `If both return true, add (r, c) to the result list.`,
      ],
      example: `heights=[[1,2],[3,4]], m=2, n=2\n\nCell (0,0)=1:\n  Pacific? row=0 → yes immediately.\n  Atlantic? From (0,0) go to (1,0)=3 or (0,1)=2.\n    From (1,0) go to (1,1)=4 → col=n-1=1 and row=m-1=1 → Atlantic reached!\n  Both reached → add (0,0).\nCell (0,1)=2: Pacific? row=0 → yes. Atlantic? (1,1)=4 → yes. Add (0,1).\nCell (1,0)=3: Pacific? → (0,0)=1<3 can't go, (1,0) row=1≠0, col=0 → Pacific reached! Atlantic? row=1=m-1 → yes. Add (1,0).\nCell (1,1)=4: Both borders trivially reachable. Add (1,1).\n✅ Answer: [[0,0],[0,1],[1,0],[1,1]]`,
      keyInsight: `O(m² × n²) time — a DFS for every cell. Very slow for large grids. Illustrates the problem clearly but is not viable for m,n > ~50.`,
    },

    'Multi-Source BFS (Optimal)': {
      intuition: `Start BFS from ALL Pacific border cells simultaneously, flowing "uphill" (to cells with equal or greater height). Mark every cell reachable as "pacific-reachable". Do the same from ALL Atlantic border cells. Cells marked in both sets are the answer. This visits each cell at most twice — optimal.`,
      steps: [
        `Create two visited sets: pacificReachable and atlanticReachable.`,
        `Seed the Pacific BFS queue with all cells in row 0 and column 0.`,
        `Seed the Atlantic BFS queue with all cells in row m-1 and column n-1.`,
        `BFS rule: from cell (r,c), move to neighbour (nr,nc) if heights[nr][nc] >= heights[r][c] (water flows uphill in reverse).`,
        `Run both BFS passes to completion.`,
        `Collect all cells (r,c) present in both reachable sets.`,
      ],
      example: `heights=[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]\n\nPacific BFS seeds: entire top row + left column.\n  From (0,4)=5: can flow to (1,4)=4? 4<5, no. Stays.\n  From (4,0)=5: reaches (3,0)=6≥5 → add (3,0). From (3,0)=6: (2,0)=2<6 stop. (3,1)=7≥6 → add (3,1).\nAtlantic BFS seeds: bottom row + right column.\n  From (0,4)=5: Atlantic border directly.\n  From (4,0)=5: Atlantic border directly.\n\nIntersection of both sets:\n✅ Answer: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]`,
      keyInsight: `O(m×n) time and space. Multi-source BFS is the key insight — treat ALL border cells as simultaneous starting points. Reversing the flow direction converts "can water drain to ocean?" into "can ocean expand inward?"`,
    },

    'Multi-Source DFS (Optimal DFS variant)': {
      intuition: `Same multi-source "reverse flow" insight as BFS, but use DFS instead of a queue. Start DFS simultaneously from all Pacific border cells (top row + left column), marking every cell reachable going uphill. Then start DFS from all Atlantic border cells (bottom row + right column). A cell is in the answer if it was marked by both DFS passes.`,
      steps: [
        `Create two boolean grids: pacific[m][n] and atlantic[m][n], both false.`,
        `Run dfs(r, c, reachable) from every cell in row 0 and column 0, marking pacific reachable.`,
        `Run dfs(r, c, reachable) from every cell in row m-1 and column n-1, marking atlantic reachable.`,
        `DFS rule: from (r,c), move to neighbour (nr,nc) if heights[nr][nc] >= heights[r][c] AND not yet marked.`,
        `Collect all (r,c) where pacific[r][c] && atlantic[r][c] is true.`,
      ],
      example: `heights=[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]\n\nPacific DFS seeds: row 0 + col 0. Mark all cells reachable flowing uphill from Pacific border.\nAtlantic DFS seeds: row 4 + col 4. Mark all cells reachable flowing uphill from Atlantic border.\n\nCells marked in both:\n(0,4): pacific=true (row 0 border), atlantic=true (col 4 border) → both ✓\n(1,3): pacific reachable via uphill path from top, atlantic reachable via uphill path from right border → both ✓\n... (similar for remaining answer cells)\n✅ Answer: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]`,
      keyInsight: `O(m×n) time, O(m×n) space. Identical complexity to Multi-Source BFS. DFS uses the call stack (O(m×n) worst case) rather than a queue. Use BFS if very large grids risk stack overflow; use DFS for simpler recursive code.`,
    },
  },
}
