/**
 * Tutorial content for #042 — Clone Graph
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a reference to a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node has a value and a list of neighbours. The clone must be a completely new set of nodes — no original nodes should appear in the clone.`,
    example: `adjList = [[2,4],[1,3],[2,4],[1,3]]\nNode 1 neighbours: [2,4]\nNode 2 neighbours: [1,3]\nNode 3 neighbours: [2,4]\nNode 4 neighbours: [1,3]\n→ Create 4 new nodes with same values and same adjacency.\n✅ Answer: deep copy of the graph`,
    keyInsight: `The challenge is avoiding infinite loops — graphs can have cycles. Use a hash map (original node → clone node) to track already-cloned nodes. If you encounter a node already in the map, return the existing clone instead of creating another copy.`,
  },

  approaches: {
    'DFS with Hash Map': {
      intuition: `Use recursive DFS. Maintain a map from original node to its clone. When you visit a node: if it's already in the map, return the existing clone immediately. Otherwise create a new clone, store it in the map, then recursively clone all its neighbours and add them to the clone's neighbour list.`,
      steps: [
        `Create a hash map cloned = {}.`,
        `Define dfs(node): if node is null return null. If node is in cloned, return cloned[node].`,
        `Create a new node clone with node.val. Store cloned[node] = clone.`,
        `For each neighbour n of node: clone.neighbours.push(dfs(n)).`,
        `Return clone.`,
        `Call dfs(startNode) and return the result.`,
      ],
      example: `adjList = [[2,4],[1,3],[2,4],[1,3]]\n\ndfs(node1): not in map. Create clone1. cloned={1:c1}\n  dfs(node2): Create clone2. cloned={1:c1,2:c2}\n    dfs(node1): already in map → return c1. c2.neighbours=[c1]\n    dfs(node3): Create clone3. cloned={1:c1,2:c2,3:c3}\n      dfs(node2): in map → return c2. c3.neighbours=[c2]\n      dfs(node4): Create clone4. cloned={...,4:c4}\n        dfs(node1): in map → c1. dfs(node3): in map → c3. c4.neighbours=[c1,c3]\n      c3.neighbours=[c2,c4]. return c3.\n    c2.neighbours=[c1,c3]. return c2.\n  dfs(node4): in map → return c4. c1.neighbours=[c2,c4].\nreturn c1.\n✅ Answer: new graph c1↔c2↔c3↔c4`,
      keyInsight: `O(V+E) time (every node and edge visited once), O(V) space for the hash map. The map is essential — it both prevents cycles and ensures each clone is created exactly once.`,
    },

    'BFS with Hash Map': {
      intuition: `Use a queue instead of recursion. Start by cloning the given node and enqueuing it. For each node dequeued, iterate over its original neighbours: if a neighbour hasn't been cloned yet, clone it and enqueue it. Either way, add the clone of the neighbour to the current clone's neighbour list.`,
      steps: [
        `If node is null, return null.`,
        `Create cloned[startNode] = new Node(startNode.val). Enqueue startNode.`,
        `While queue is not empty: dequeue original.`,
        `For each neighbour n of original: if n is not in cloned, create cloned[n] = new Node(n.val) and enqueue n.`,
        `Append cloned[n] to cloned[original].neighbours.`,
        `Return cloned[startNode] after the queue empties.`,
      ],
      example: `Start node = node1, adjList = [[2,4],[1,3],[2,4],[1,3]]\n\nCreate c1, cloned={1:c1}, queue=[node1]\nDequeue node1: neighbours=[node2,node4]\n  node2 not in map → create c2, enqueue. node4 not in map → create c4, enqueue.\n  c1.neighbours=[c2,c4]\nDequeue node2: neighbours=[node1,node3]\n  node1 in map → c1. node3 not in map → create c3, enqueue.\n  c2.neighbours=[c1,c3]\nDequeue node4: neighbours=[node1,node3]\n  node1→c1, node3→c3. c4.neighbours=[c1,c3]\nDequeue node3: neighbours=[node2,node4]\n  node2→c2, node4→c4. c3.neighbours=[c2,c4]\nQueue empty.\n✅ Answer: deep copy of graph`,
      keyInsight: `O(V+E) time, O(V) space. BFS naturally processes nodes level by level — no recursion depth concerns. The map serves the same cycle-prevention role as in DFS.`,
    },

    'DFS Iterative (Stack)': {
      intuition: `Like BFS but with a stack instead of a queue. This gives depth-first order without recursive function calls. Useful when the graph is very deep or when you want to avoid recursion limits.`,
      steps: [
        `If node is null, return null.`,
        `Create cloned[startNode] = new Node(startNode.val). Push startNode onto stack.`,
        `While stack is not empty: pop original from stack.`,
        `For each neighbour n of original: if n is not in cloned, clone it and push it onto the stack.`,
        `Append cloned[n] to cloned[original].neighbours.`,
        `Return cloned[startNode].`,
      ],
      example: `Start node = node1, adjList = [[2,4],[1,3],[2,4],[1,3]]\n\nCreate c1, stack=[node1]\nPop node1: neighbours=[node2,node4]\n  node2 not in map → create c2, push. node4 → create c4, push.\n  c1.neighbours=[c2,c4]\nPop node4: neighbours=[node1,node3]\n  node1→c1. node3→create c3, push. c4.neighbours=[c1,c3]\nPop node3: neighbours=[node2,node4]\n  node2→c2. node4→c4. c3.neighbours=[c2,c4]\nPop node2: neighbours=[node1,node3]\n  node1→c1. node3→c3. c2.neighbours=[c1,c3]\nStack empty.\n✅ Answer: deep copy of graph`,
      keyInsight: `O(V+E) time, O(V) space. Functionally equivalent to recursive DFS but uses an explicit stack — avoids call-stack overflow on deep graphs.`,
    },

    'Two-Pass BFS': {
      intuition: `Split the cloning into two explicit phases. In the first pass, BFS the entire graph and create a clone node for every original node (no neighbour wiring yet). In the second pass, BFS again and wire up the neighbour lists using the already-created clone nodes. Separating node creation from neighbour wiring can make the logic clearer in some implementations.`,
      steps: [
        `Pass 1 — create nodes: BFS from startNode. For every unvisited node, create cloned[node] = new Node(node.val) and enqueue it.`,
        `Pass 2 — wire neighbours: BFS again from startNode. For each original node dequeued, iterate its neighbours and set cloned[node].neighbours = map each neighbour n → cloned[n].`,
        `Return cloned[startNode].`,
      ],
      example: `adjList = [[2,4],[1,3],[2,4],[1,3]]\n\nPass 1 (create): BFS visits node1,node2,node4,node3.\n  cloned = {1:c1, 2:c2, 3:c3, 4:c4}. All neighbours empty.\n\nPass 2 (wire): BFS visits node1,node2,node4,node3.\n  node1.neighbours=[node2,node4] → c1.neighbours=[c2,c4]\n  node2.neighbours=[node1,node3] → c2.neighbours=[c1,c3]\n  node4.neighbours=[node1,node3] → c4.neighbours=[c1,c3]\n  node3.neighbours=[node2,node4] → c3.neighbours=[c2,c4]\nReturn c1.\n✅ Answer: deep copy of graph`,
      keyInsight: `O(V+E) time, O(V) space. Same asymptotic complexity as the single-pass approaches. The two-pass separation is a design choice — it makes the code more readable at the cost of traversing the graph twice.`,
    },

    'Recursive with Visited Set': {
      intuition: `Use a Set instead of a Map for cycle detection, paired with a separate clones Map. The visited Set tracks which original nodes have been seen to prevent infinite recursion; the clones Map stores original→clone mappings for neighbour wiring. Logically equivalent to DFS with Hash Map but uses two separate structures for clarity.`,
      steps: [
        `Create a visited Set and a clones Map.`,
        `Define dfs(node): if node is in visited, return clones[node].`,
        `Add node to visited. Create clone = new Node(node.val). Store clones[node] = clone.`,
        `For each neighbour n of node: clone.neighbours.push(dfs(n)).`,
        `Return clone.`,
        `Call dfs(startNode).`,
      ],
      example: `adjList = [[2,4],[1,3],[2,4],[1,3]]\n\ndfs(node1): visited={1}. c1 created. clones={1:c1}\n  dfs(node2): visited={1,2}. c2 created.\n    dfs(node1): in visited → return c1. c2.neighbours=[c1,...]\n    dfs(node3): visited={1,2,3}. c3 created.\n      dfs(node2): in visited → c2. dfs(node4): visited={1,2,3,4}. c4 created.\n        ...(all cross-references resolve to existing clones)\n      c3.neighbours=[c2,c4]. return c3.\n    c2.neighbours=[c1,c3]. return c2.\n  dfs(node4): in visited → return c4. c1.neighbours=[c2,c4].\nreturn c1.\n✅ Answer: deep copy of graph`,
      keyInsight: `O(V+E) time, O(V) space. Functionally identical to DFS with Hash Map. The explicit visited Set vs clones Map separation emphasises the two concerns: cycle-prevention and clone-storage. In practice, a single Map suffices (as in Approach 1).`,
    },
  },
}
