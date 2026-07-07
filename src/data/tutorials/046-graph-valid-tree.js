/**
 * Tutorial content for #046 — Graph Valid Tree
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given n nodes labelled 0 to n-1 and a list of undirected edges, return true if they form a valid tree. A valid tree must be fully connected (all nodes reachable from any starting node) AND contain no cycles. This is equivalent to having exactly n-1 edges and being connected.`,
    example: `n=5, edges=[[0,1],[0,2],[0,3],[1,4]]\n→ 4 edges for 5 nodes (n-1 ✓)\n→ Starting from 0: can reach 1,2,3,4 ✓\n✅ Answer: true\n\nn=5, edges=[[0,1],[1,2],[2,3],[1,3],[1,4]]\n→ 5 edges — too many, must contain a cycle.\n✅ Answer: false`,
    keyInsight: `A valid tree has exactly n-1 edges AND is connected. You can check both at once with DFS/BFS (traverse entire graph, no cycle) or Union-Find (union all edges, check for cycle and single component).`,
  },

  approaches: {
    DFS: {
      intuition: `Build an adjacency list and run DFS from node 0. Track visited nodes. If you ever try to visit an already-visited node (and it's not the direct parent), you've found a cycle — return false. After DFS, if the count of visited nodes doesn't equal n, the graph is disconnected — return false. Otherwise return true.`,
      steps: [
        `Quick check: if edges.length !== n-1, immediately return false (wrong number of edges).`,
        `Build an undirected adjacency list from the edge list.`,
        `Run DFS from node 0, passing the current node and its parent.`,
        `Mark each visited node. If a neighbour is already visited AND is not the parent, return false (cycle found).`,
        `After DFS, count visited nodes. If count !== n, return false (disconnected). Otherwise return true.`,
      ],
      example: `n=5, edges=[[0,1],[0,2],[0,3],[1,4]]\nAdj: 0:[1,2,3], 1:[0,4], 2:[0], 3:[0], 4:[1]\n\ndfs(0, -1): visited={0}\n  dfs(1, 0): visited={0,1}\n    dfs(0, 1): 0 is visited, but it's the parent → skip.\n    dfs(4, 1): visited={0,1,4}. No more neighbours.\n  dfs(2, 0): visited={0,1,4,2}. No more neighbours.\n  dfs(3, 0): visited={0,1,4,2,3}.\nvisited.size=5 == n → ✅ Answer: true`,
      keyInsight: `O(V+E) time, O(V+E) space. The parent check is critical for undirected graphs — without it, every edge looks like a back-edge cycle.`,
    },

    BFS: {
      intuition: `Use BFS from node 0. Enqueue all neighbours of each dequeued node; skip the node we came from (to handle the undirected edge). If BFS tries to enqueue an already-visited node (that isn't the parent), there's a cycle. After BFS, count visited nodes — if fewer than n, the graph is disconnected.`,
      steps: [
        `Quick check: if edges.length !== n-1, return false.`,
        `Build undirected adjacency list.`,
        `BFS from node 0: use a queue and a visited array. Also track parent for each node.`,
        `For each dequeued node, iterate neighbours. Skip the parent. If a neighbour is already visited, return false (cycle). Otherwise mark visited and enqueue.`,
        `After BFS, return visited.count === n.`,
      ],
      example: `n=5, edges=[[0,1],[0,2],[0,3],[1,4]]\nAdj: 0:[1,2,3], 1:[0,4], 2:[0], 3:[0], 4:[1]\n\nQueue: [0], visited={0}\nDequeue 0: neighbours 1,2,3 → enqueue all. visited={0,1,2,3}\nDequeue 1: neighbours 0(parent-skip),4 → enqueue 4. visited={0,1,2,3,4}\nDequeue 2: neighbour 0(parent-skip). No new nodes.\nDequeue 3: neighbour 0(parent-skip). No new nodes.\nDequeue 4: neighbour 1(parent-skip). No new nodes.\nvisited.size=5==n → ✅ Answer: true`,
      keyInsight: `O(V+E) time, O(V+E) space. BFS and DFS are equivalent here. BFS can be preferred when you want iterative code without recursion depth concerns.`,
    },

    'Union-Find': {
      intuition: `Process edges one by one using Union-Find. For each edge [u, v]: find their roots. If they share the same root, they are already connected — adding this edge creates a cycle, return false. Otherwise union them. After processing all edges, check that all nodes belong to a single component (one root).`,
      steps: [
        `Quick check: if edges.length !== n-1, return false.`,
        `Initialise Union-Find with n nodes (each node is its own parent).`,
        `For each edge [u, v]: find(u) and find(v).`,
        `If find(u) === find(v): a cycle would be created → return false.`,
        `Otherwise union(u, v) (attach one root to the other).`,
        `After all edges, verify all nodes share the same root → return true.`,
      ],
      example: `n=5, edges=[[0,1],[0,2],[0,3],[1,4]]\nParents: [0,1,2,3,4]\n\nEdge [0,1]: find(0)=0, find(1)=1 → different → union → parents=[0,0,2,3,4]\nEdge [0,2]: find(0)=0, find(2)=2 → different → union → parents=[0,0,0,3,4]\nEdge [0,3]: find(0)=0, find(3)=3 → different → union → parents=[0,0,0,0,4]\nEdge [1,4]: find(1)=0, find(4)=4 → different → union → parents=[0,0,0,0,0]\nAll nodes have root 0 → ✅ Answer: true`,
      keyInsight: `O(E × α(N)) time ≈ O(E) with path compression and union by rank. O(N) space. Union-Find is the most elegant solution here — it naturally detects cycles and checks connectivity simultaneously.`,
    },
  },
}
