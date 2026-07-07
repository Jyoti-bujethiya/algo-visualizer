/**
 * Tutorial content for #044 — Course Schedule II
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `You have numCourses courses (labelled 0 to numCourses-1) and a list of prerequisites where [a, b] means you must take course b before course a. Return a valid order in which to take all courses. If it is impossible (circular dependency), return an empty array. This is topological sorting of a directed graph.`,
    example: `numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]\n→ Course 0 has no prerequisites.\n→ Courses 1 and 2 both need 0.\n→ Course 3 needs both 1 and 2.\n✅ Answer: [0,1,2,3] or [0,2,1,3]`,
    keyInsight: `Finding a valid course order is exactly topological sorting. Two approaches work: Kahn's BFS (process nodes with no remaining prerequisites first) or DFS (add a node to the result only after all its dependencies are finished).`,
  },

  approaches: {
    "Kahn's Algorithm (BFS Topological Sort)": {
      intuition: `Count how many prerequisites each course has (in-degree). Courses with in-degree 0 can be taken immediately — add them to a queue. Each time you "take" a course, decrement the in-degree of courses that depended on it. When a course's in-degree hits 0, it's ready — enqueue it. The order you process them is a valid course order.`,
      steps: [
        `Build an adjacency list (course → list of courses that depend on it) and an in-degree array.`,
        `Enqueue all courses with in-degree 0 (no prerequisites).`,
        `While queue is not empty: dequeue a course, append it to the result order.`,
        `For each course that depended on it: decrement its in-degree. If in-degree reaches 0, enqueue it.`,
        `If result.length === numCourses, return result. Otherwise return [] (cycle detected).`,
      ],
      example: `numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]\nAdj: 0→[1,2], 1→[3], 2→[3], 3→[]\nIn-degrees: [0, 1, 1, 2]\n\nQueue: [0]\nProcess 0: order=[0], decrement 1→0, decrement 2→0. Queue=[1,2]\nProcess 1: order=[0,1], decrement 3→1. Queue=[2]\nProcess 2: order=[0,1,2], decrement 3→0. Queue=[3]\nProcess 3: order=[0,1,2,3]. Queue=[]\norder.length=4 == numCourses → ✅ Answer: [0,1,2,3]`,
      keyInsight: `O(V+E) time, O(V+E) space. Kahn's algorithm is the most intuitive topological sort — it mirrors real-world scheduling. If any course is never processed, a cycle prevents it.`,
    },

    'DFS Topological Sort': {
      intuition: `Run DFS on each unvisited course. The key insight: a course should appear in the order AFTER all its dependencies have been placed. So after recursing into all neighbours, push the current course onto a stack. When all DFS calls finish, pop the stack to get topological order (deepest-finished nodes come first).`,
      steps: [
        `Build an adjacency list. Create a visited array with states: 0=unvisited, 1=in-progress, 2=done.`,
        `Define dfs(node): if state=1 return false (cycle). If state=2 return true (already done).`,
        `Mark state=1. Recurse into all neighbours. If any recurse returns false, propagate false.`,
        `Mark state=2. Push node onto a result stack. Return true.`,
        `Call dfs for all unvisited nodes. If any return false, return []. Otherwise pop the stack for the order.`,
      ],
      example: `numCourses=3, prerequisites=[[1,0],[2,1]]\nAdj: 0→[1], 1→[2], 2→[]\n\ndfs(0): state[0]=1\n  dfs(1): state[1]=1\n    dfs(2): state[2]=1, no neighbours. state[2]=2. stack=[2]\n  state[1]=2. stack=[2,1]\nstate[0]=2. stack=[2,1,0]\n\nPop stack → order=[0,1,2]\n✅ Answer: [0,1,2]`,
      keyInsight: `O(V+E) time, O(V) space. Post-order DFS naturally produces reverse topological order. Reversing the finish-time stack gives a valid course sequence.`,
    },

    'Iterative DFS': {
      intuition: `Perform DFS without recursion using an explicit stack. Push nodes onto the stack; when a node is fully processed (all neighbours visited), add it to the result in reverse finish order. Use visited states to detect cycles and avoid revisiting nodes.`,
      steps: [
        `Build adjacency list. Use a state array: 0=unvisited, 1=in-stack, 2=done.`,
        `For each unvisited node, push it onto a stack with a "visited" flag.`,
        `Pop from stack: if not yet expanded, push again as "expanded" then push all neighbours as unexpanded.`,
        `If we pop an "expanded" node, add it to result and mark as done.`,
        `If we encounter a node marked in-stack during neighbour expansion, a cycle exists — return [].`,
        `Reverse result at the end.`,
      ],
      example: `numCourses=3, prerequisites=[[1,0],[2,1]]\nAdj: 0→[1], 1→[2], 2→[]\n\nStack: [0-unexpanded]\nPop 0-unexpanded: push 0-expanded, push 1-unexpanded.\nPop 1-unexpanded: push 1-expanded, push 2-unexpanded.\nPop 2-unexpanded: push 2-expanded (no neighbours).\nPop 2-expanded: result=[2], state[2]=done.\nPop 1-expanded: result=[2,1], state[1]=done.\nPop 0-expanded: result=[2,1,0], state[0]=done.\nReverse → [0,1,2]\n✅ Answer: [0,1,2]`,
      keyInsight: `O(V+E) time, O(V) space. Avoids recursion stack limits. More complex to implement than recursive DFS but functionally equivalent.`,
    },

    "Kahn's with Priority Queue": {
      intuition: `Identical to Kahn's BFS but use a min-heap instead of a plain queue. This ensures that among all courses that are ready at any moment, you always take the one with the smallest index first — producing the lexicographically smallest valid order.`,
      steps: [
        `Build adjacency list and in-degree array as in standard Kahn's.`,
        `Insert all in-degree-0 courses into a min-heap (priority queue).`,
        `While heap is not empty: extract the minimum-index course and append to result.`,
        `Decrement in-degrees of dependent courses; push any that reach 0 into the heap.`,
        `Return result if complete, else return [] for cycle.`,
      ],
      example: `numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]\nIn-degrees: [0,1,1,2]. Heap starts: {0}\n\nExtract 0: order=[0]. Dependents 1,2 become in-degree 0. Heap={1,2}\nExtract 1 (min): order=[0,1]. 3→in-degree 1. Heap={2}\nExtract 2: order=[0,1,2]. 3→in-degree 0. Heap={3}\nExtract 3: order=[0,1,2,3].\n✅ Answer: [0,1,2,3] (smallest lexicographic valid order)`,
      keyInsight: `O((V+E) log V) time, O(V) space. The priority queue adds a log V factor but guarantees the lexicographically smallest result among all valid orderings.`,
    },

    'DFS with Finish Time': {
      intuition: `Record a finish timestamp for each node as DFS completes it. Sort all nodes by finish time in descending order — nodes that finish last appear first in topological order. This mirrors the academic definition of topological sort via DFS finish times.`,
      steps: [
        `Build adjacency list. Maintain visited states and a timer counter.`,
        `When DFS finishes visiting all neighbours of a node, record finish[node] = timer++.`,
        `After all DFS calls, sort nodes by finish time in descending order.`,
        `If a cycle exists (back-edge detected via in-progress state), return [].`,
        `Return the sorted node order.`,
      ],
      example: `numCourses=3, prerequisites=[[1,0],[2,1]]\nAdj: 0→[1], 1→[2], 2→[]\n\ndfs(0) → dfs(1) → dfs(2): finish[2]=0, timer=1\n  back in dfs(1): finish[1]=1, timer=2\nback in dfs(0): finish[0]=2, timer=3\n\nSort by finish descending: 0(t=2), 1(t=1), 2(t=0)\n✅ Answer: [0,1,2]`,
      keyInsight: `O(V+E) time, O(V) space. This approach directly reflects the classic algorithm-theory definition of topological sort. In practice, Kahn's or post-order DFS are more commonly used.`,
    },
  },
}
