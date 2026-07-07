/**
 * Tutorial content for #049 — Alien Dictionary
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `You are given a list of words sorted in lexicographic order according to an alien language's alphabet. Derive the order of characters in that alien alphabet. If the order is invalid (contradictory constraints), return an empty string. If multiple valid orderings exist, return any one.`,
    example: `words=["wrt","wrf","er","ett","rftt"]\n→ Compare adjacent words to extract ordering rules:\n  "wrt" vs "wrf" → t comes before f\n  "wrf" vs "er"  → w comes before e\n  "er"  vs "ett" → r comes before t\n  "ett" vs "rftt"→ e comes before r\n→ Chain: w→e→r→t→f\n✅ Answer: "wertf"`,
    keyInsight: `Adjacent words share a common prefix — the first differing character gives one ordering constraint (u < v). Collect all such constraints as directed edges and topologically sort the resulting graph. A cycle means contradictory constraints.`,
  },

  approaches: {
    "Topological Sort via BFS (Kahn's Algorithm)": {
      intuition: `Extract character-ordering constraints by comparing adjacent words. Build a directed graph where an edge u→v means "u comes before v in the alphabet". Compute in-degrees and use Kahn's BFS: process characters with in-degree 0 first. If all characters are processed, the BFS order is the alien alphabet. A cycle (some characters never processed) means the input is invalid.`,
      steps: [
        `Find all unique characters and initialise in-degree=0 for each.`,
        `Compare each pair of adjacent words: find the first differing character pair (u, v). Add edge u→v and increment in-degree of v. If word A is a prefix of a shorter word B, the input is invalid — return "".`,
        `Seed BFS queue with all characters of in-degree 0.`,
        `Dequeue a character, append to result. Decrement in-degrees of its successors. Enqueue any that reach 0.`,
        `If result.length equals the number of unique characters, return result. Otherwise return "" (cycle).`,
      ],
      example: `words=["wrt","wrf","er","ett","rftt"]\nEdges: t→f, w→e, r→t, e→r\nIn-degrees: w=0, e=1, r=1, t=1, f=1\n\nQueue: [w]\nProcess w: order="w", decrement e→0. Queue=[e]\nProcess e: order="we", decrement r→0. Queue=[r]\nProcess r: order="wer", decrement t→0. Queue=[t]\nProcess t: order="wert", decrement f→0. Queue=[f]\nProcess f: order="wertf".\nLength=5 == 5 unique chars → ✅ Answer: "wertf"`,
      keyInsight: `O(C + U) time where C = total characters in all words, U = number of unique characters. Kahn's gives a natural cycle-detection mechanism: if BFS can't process all nodes, a cycle exists.`,
    },

    'Topological Sort via DFS (Cycle Detection)': {
      intuition: `Build the same directed graph of character constraints, then run DFS. The key: DFS post-order (adding a character to the result AFTER visiting all its successors) gives reverse topological order. Detect cycles using a three-state visited marker (unvisited, in-progress, done). Reverse the post-order list at the end.`,
      steps: [
        `Build the directed graph (adjacency list) from adjacent word comparisons.`,
        `Create a visited map with states: false=unvisited, true=in-progress, and a "done" set.`,
        `For each unvisited character, call dfs(char).`,
        `dfs(char): if in-progress → cycle, return false. If done → return true.`,
        `Mark in-progress. Recurse into all successors. On return, mark done and push to result stack.`,
        `Reverse the result stack and return as string. Return "" if any cycle detected.`,
      ],
      example: `words=["wrt","wrf","er","ett","rftt"]\nEdges: t→f, w→e, r→t, e→r\n\ndfs(t): in-prog. → dfs(f): no successors. done. stack=[f]. t done. stack=[f,t]\ndfs(w): → dfs(e): → dfs(r): → dfs(t): already done, return true.\n  r done. stack=[f,t,r]. e done. stack=[f,t,r,e]. w done. stack=[f,t,r,e,w]\n\nReverse: "w","e","r","t","f" → ✅ Answer: "wertf"`,
      keyInsight: `O(C + U) time and space. DFS naturally handles sparse graphs and is slightly simpler to reason about for those who find recursive DFS intuitive. The three-state marker is the standard directed-cycle detector.`,
    },

    'BFS with Deduplication': {
      intuition: `Same as Kahn's BFS but adds a deduplication step when extracting edges: use a set to avoid adding duplicate edges (same u→v pair from different word comparisons). Duplicate edges would artificially inflate in-degrees, producing incorrect results. This is an important correctness detail omitted in naive implementations.`,
      steps: [
        `Build the directed graph with a Set of edges to deduplicate.`,
        `For each unique character, initialise in-degree=0. Only increment in-degree once per unique (u,v) pair.`,
        `Proceed with standard Kahn's BFS: enqueue in-degree-0 characters, process in topological order.`,
        `Return the result if all characters processed, else "" for cycle.`,
      ],
      example: `Suppose two adjacent word pairs both give edge e→r:\nWithout deduplication: in-degree[r]=2 (wrong! two edges counted)\nWith deduplication Set: only add e→r once → in-degree[r]=1 (correct)\n\nwords=["wrt","wrf","er","ett","rftt"]\nEdge set: {(t,f),(w,e),(r,t),(e,r)} — all unique here anyway.\nIn-degrees: w=0, e=1, r=1, t=1, f=1\n\nBFS identical to standard Kahn's:\nw→e→r→t→f → ✅ Answer: "wertf"`,
      keyInsight: `O(C + U) time. The deduplication ensures in-degree counts are accurate. An important implementation correctness detail — without it, valid inputs may produce wrong in-degrees and incorrectly return "".`,
    },
  },
}
