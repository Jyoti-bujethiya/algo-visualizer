/**
 * Tutorial content for #043 — Course Schedule
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `You have numCourses courses (0 to numCourses-1) and a list of prerequisites where [a, b] means you must take course b before course a. Return true if you can finish all courses (i.e. no circular dependencies), false otherwise. This is equivalent to detecting whether a directed graph has a cycle.`,
    example: `numCourses=2, prerequisites=[[1,0]]\n→ To take course 1, you need course 0 first.\n→ No cycle: you can take 0 then 1.\n✅ Answer: true\n\nnumCourses=2, prerequisites=[[1,0],[0,1]]\n→ Cycle: 0 needs 1, but 1 needs 0.\n✅ Answer: false`,
    keyInsight: `The courses and prerequisites form a directed graph. If that graph has a cycle, you can never finish all courses. Detecting a cycle in a directed graph is the core task — use DFS with three node states or BFS (Kahn's algorithm) counting processed nodes.`,
  },

  approaches: {
    'DFS with Three States': {
      intuition: `For each node, track one of three states: 0 = unvisited, 1 = in the current DFS path (being processed), 2 = fully done (no cycle from this node). When a DFS from node X visits a neighbour already in state 1, it found a back-edge — a cycle! If DFS finishes without seeing state 1, mark the node as state 2.`,
      steps: [
        `Build an adjacency list from the prerequisites.`,
        `Create a state array of size numCourses initialised to 0 (unvisited).`,
        `Define dfs(node): if state[node] === 1 return true (cycle found). If state[node] === 2 return false (already safe).`,
        `Set state[node] = 1 (mark as "in progress").`,
        `For each neighbour: if dfs(neighbour) returns true, propagate true (cycle found).`,
        `Set state[node] = 2 (fully processed, no cycle). Return false.`,
        `For each course 0..n-1, call dfs if not yet visited. Return false if any call finds a cycle; otherwise return true.`,
      ],
      example: `numCourses=2, prerequisites=[[1,0],[0,1]]\nAdj: 0→[1], 1→[0]\n\ndfs(0): state[0]=1\n  dfs(1): state[1]=1\n    neighbour of 1 is 0: state[0]=1 → CYCLE! return true\n  Propagate true → cycle found.\nReturn false (cannot finish courses)\n✅ Answer: false`,
      keyInsight: `O(V+E) time, O(V) space. The three-state approach is the standard DFS cycle detection for directed graphs. State 1 ("grey") catching a back-edge is the cycle signal.`,
    },

    "BFS / Kahn's Algorithm": {
      intuition: `Count in-degrees (how many prerequisites each course has). Enqueue all courses with in-degree 0 (no prerequisites). Process them one by one: when a course is processed, decrement in-degree of its dependents. If any dependent reaches in-degree 0, enqueue it. If all courses get processed, there's no cycle. If any course is never processed (still has in-degree > 0), there's a cycle.`,
      steps: [
        `Build an adjacency list and count in-degrees for all nodes.`,
        `Enqueue all nodes with in-degree 0.`,
        `Track a count of processed nodes, starting at 0.`,
        `While queue is not empty: dequeue a node, increment processed count.`,
        `For each neighbour: decrement its in-degree. If in-degree becomes 0, enqueue it.`,
        `After the queue empties, if processed === numCourses return true, else return false.`,
      ],
      example: `numCourses=4, prerequisites=[[1,0],[2,1],[3,2]]\nIn-degrees: [0,1,1,1]. Adj: 0→[1], 1→[2], 2→[3]\n\nQueue: [0] (in-degree=0)\nProcess 0: count=1, decrement in-degree of 1 → 0, enqueue 1.\nProcess 1: count=2, decrement in-degree of 2 → 0, enqueue 2.\nProcess 2: count=3, decrement in-degree of 3 → 0, enqueue 3.\nProcess 3: count=4.\ncount(4) == numCourses(4) → true\n✅ Answer: true`,
      keyInsight: `O(V+E) time, O(V+E) space. Kahn's algorithm is inherently iterative — no recursion needed. It's also the foundation for topological sort (see Course Schedule II).`,
    },

    'DFS with Visited Sets': {
      intuition: `Use two sets: visited (completely processed nodes, definitely not in a cycle) and path (nodes on the current DFS path). If you reach a node already in path, you found a cycle. If you reach a node already in visited, it's safe — skip it. After exploring all neighbours, remove the node from path and add it to visited.`,
      steps: [
        `Build adjacency list. Create two sets: visited and path.`,
        `Define dfs(node): if node is in path → cycle found (return true). If node is in visited → safe (return false).`,
        `Add node to path. Recurse on all neighbours; if any return true, propagate true.`,
        `Remove node from path, add to visited. Return false.`,
        `Iterate all courses; if any dfs returns true, return false overall.`,
      ],
      example: `numCourses=2, prerequisites=[[1,0]]\nAdj: 0→[1], 1→[]\n\ndfs(0): path={0}. Visit neighbour 1:\n  dfs(1): path={0,1}. No neighbours. Remove 1 from path, add to visited.\n  Return false.\nRemove 0 from path, add to visited.\ndfs(1): already in visited → return false.\nNo cycle found → true\n✅ Answer: true`,
      keyInsight: `O(V+E) time, O(V) space. Using explicit sets makes the three-state logic transparent — path is "grey" (in-progress), visited is "black" (done). Equivalent to the state-array approach.`,
    },

    'DFS with Path Tracking': {
      intuition: `A cleaner framing of DFS cycle detection: keep a boolean array inPath[] to track nodes on the current recursion path, plus a visited[] array for nodes fully processed. When DFS enters a node, mark it inPath. If DFS encounters a node already inPath, a cycle exists. When DFS exits a node (all neighbours processed), clear inPath and mark visited.`,
      steps: [
        `Build adjacency list. Create boolean arrays visited[n] and inPath[n], both false.`,
        `Define hasCycle(node): if inPath[node] return true (back-edge = cycle). If visited[node] return false (already safe).`,
        `Mark inPath[node] = true. Recurse on all neighbours; if any return true, return true.`,
        `Mark inPath[node] = false; visited[node] = true. Return false.`,
        `For each course: if hasCycle returns true, return false (can't finish). After all, return true.`,
      ],
      example: `numCourses=3, prerequisites=[[1,0],[2,1]]\nAdj: 0→[1], 1→[2], 2→[]\n\nhasCycle(0): inPath={0}.\n  hasCycle(1): inPath={0,1}.\n    hasCycle(2): inPath={0,1,2}. No neighbours. inPath[2]=false, visited[2]=true.\n  inPath[1]=false, visited[1]=true.\ninPath[0]=false, visited[0]=true.\nNo cycle → return true\n✅ Answer: true (can finish all courses)`,
      keyInsight: `O(V+E) time, O(V) space. Explicitly zeroing inPath on exit is the critical step — it ensures the path-tracking only reflects the current recursion chain, not all previously visited nodes.`,
    },

    "Kahn's BFS (Variant)": {
      intuition: `A variant of Kahn's algorithm that emphasises the conceptual framing: compute in-degrees, repeatedly "peel off" nodes with no remaining prerequisites (in-degree 0), and check whether every node gets processed. The variation here counts processed nodes and compares to numCourses — if equal, no cycle exists; if less, some courses are stuck in a cycle.`,
      steps: [
        `Build adjacency list and compute in-degree for each course.`,
        `Initialise a queue with all courses having in-degree 0.`,
        `processed = 0. While queue not empty: dequeue course, increment processed.`,
        `For each course that depends on the dequeued course: decrement its in-degree. If in-degree hits 0, enqueue it.`,
        `After queue empties: return processed === numCourses.`,
      ],
      example: `numCourses=3, prerequisites=[[1,0],[2,0]]\nAdj: 0→[1,2]. In-degrees: [0,1,1].\n\nQueue: [0]. processed=0.\nDequeue 0: processed=1. Decrement 1→0 (enqueue), 2→0 (enqueue).\nDequeue 1: processed=2. Dequeue 2: processed=3.\nprocessed(3)==numCourses(3) → true\n✅ Answer: true`,
      keyInsight: `O(V+E) time, O(V+E) space. Identical in logic to Approach 2 — the "variant" label simply highlights that counting processed nodes is the cycle-detection mechanism rather than checking leftover in-degrees.`,
    },
  },
}
