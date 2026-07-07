/**
 * Tutorial content for #047 — Connected Components
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an integer n (nodes labelled 0 to n-1) and a list of undirected edges, return the number of connected components in the graph. A connected component is a group of nodes where every node can reach every other node.`,
    example: `n=5, edges=[[0,1],[1,2],[3,4]]\n→ Component 1: nodes {0,1,2} (all connected)\n→ Component 2: nodes {3,4} (connected to each other)\n→ Node clusters: 2 groups\n✅ Answer: 2`,
    keyInsight: `Start a counter at n (every node is its own component). Union-Find merges components as edges are processed — each successful union reduces the count by 1. Alternatively, DFS/BFS marks all reachable nodes; each new unvisited start is a new component.`,
  },

  approaches: {
    DFS: {
      intuition: `Iterate through all nodes. When you find an unvisited node, start a DFS from it, marking all reachable nodes as visited. Each time you start a new DFS (a new unvisited node), increment the component count. By the end, the count equals the number of connected components.`,
      steps: [
        `Build an undirected adjacency list from the edge list.`,
        `Create a visited array of size n, all false.`,
        `Initialise count = 0.`,
        `For each node i from 0 to n-1: if not visited, increment count and run dfs(i).`,
        `dfs(node): mark node visited, then recurse on all unvisited neighbours.`,
        `Return count.`,
      ],
      example: `n=5, edges=[[0,1],[1,2],[3,4]]\nAdj: 0:[1], 1:[0,2], 2:[1], 3:[4], 4:[3]\n\nNode 0 unvisited → count=1, dfs(0):\n  Visit 0. Neighbour 1 unvisited → dfs(1):\n    Visit 1. Neighbour 0 visited, neighbour 2 unvisited → dfs(2):\n      Visit 2. Neighbour 1 visited. Done.\nNode 1 visited. Node 2 visited.\nNode 3 unvisited → count=2, dfs(3):\n  Visit 3. Neighbour 4 unvisited → dfs(4): Visit 4.\nNode 4 visited.\n✅ Answer: 2`,
      keyInsight: `O(V+E) time, O(V+E) space. The classic "flood fill" approach — simple, intuitive, and works for any graph traversal problem.`,
    },

    BFS: {
      intuition: `Same idea as DFS but use a queue. For each unvisited node, start BFS, marking all reachable nodes as visited and incrementing the component count. BFS processes nodes level by level (by distance), but for component counting the order doesn't matter — both DFS and BFS explore the full component.`,
      steps: [
        `Build undirected adjacency list. Create visited array, all false. Initialise count = 0.`,
        `For each node i from 0 to n-1: if not visited, increment count and enqueue i.`,
        `BFS: while queue not empty, dequeue a node. Mark it visited. Enqueue all unvisited neighbours.`,
        `Continue until the queue empties (full component explored).`,
        `Return count.`,
      ],
      example: `n=5, edges=[[0,1],[1,2],[3,4]]\nAdj: 0:[1], 1:[0,2], 2:[1], 3:[4], 4:[3]\n\nNode 0 unvisited → count=1. Queue=[0]\nDequeue 0: visited. Neighbour 1 unvisited → enqueue. Queue=[1]\nDequeue 1: visited. Neighbour 0 visited, 2 unvisited → enqueue. Queue=[2]\nDequeue 2: visited. Neighbour 1 visited. Queue=[]\nNode 1,2 visited.\nNode 3 unvisited → count=2. Queue=[3]\nDequeue 3: visited. Neighbour 4 → enqueue. Queue=[4]\nDequeue 4: visited. Neighbour 3 visited. Queue=[]\n✅ Answer: 2`,
      keyInsight: `O(V+E) time, O(V+E) space. Preferred over DFS when recursion depth might be an issue (very large graphs). Both achieve the same result.`,
    },

    'Union-Find': {
      intuition: `Start with each node as its own component (count = n). For each edge, if the two nodes are in different components, merge them and decrement count. After processing all edges, count holds the number of components. Union-Find with path compression makes each operation nearly O(1).`,
      steps: [
        `Initialise parent[i] = i for all i. Set count = n.`,
        `Define find(x): follow parent pointers to root, applying path compression.`,
        `Define union(x, y): find roots of x and y. If different, set one as parent of the other and decrement count.`,
        `For each edge [u, v]: call union(u, v).`,
        `Return count.`,
      ],
      example: `n=5, edges=[[0,1],[1,2],[3,4]]\nParents: [0,1,2,3,4], count=5\n\nEdge [0,1]: find(0)=0, find(1)=1 → different → union, count=4. Parents=[0,0,2,3,4]\nEdge [1,2]: find(1)=0, find(2)=2 → different → union, count=3. Parents=[0,0,0,3,4]\nEdge [3,4]: find(3)=3, find(4)=4 → different → union, count=2. Parents=[0,0,0,3,3]\n✅ Answer: 2`,
      keyInsight: `O(E × α(N)) ≈ O(E) time with path compression. O(N) space. The most efficient approach for dynamic connectivity problems — handles edges one at a time without rebuilding the graph.`,
    },
  },
}
