/**
 * Tutorial content for #045 — Word Ladder
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a beginWord, an endWord, and a wordList, find the length of the shortest transformation sequence from beginWord to endWord. Each step changes exactly one letter, and every intermediate word must exist in the wordList. If no such sequence exists, return 0.`,
    example: `beginWord="hit", endWord="cog"\nwordList=["hot","dot","dog","lot","log","cog"]\n→ hit → hot → dot → dog → cog\n→ 5 words in the chain = length 5\n✅ Answer: 5`,
    keyInsight: `Model each word as a graph node. Two words share an edge if they differ by exactly one letter. The shortest path from beginWord to endWord in this graph is the answer — shortest paths in unweighted graphs are found with BFS.`,
  },

  approaches: {
    'BFS with Transformation': {
      intuition: `Run BFS from beginWord. At each level, generate all words that differ by one letter from the current word and exist in the wordList. Each BFS level represents one transformation step. The moment we reach endWord, the current level count is our answer. Remove words from the set as we visit them to avoid re-visiting.`,
      steps: [
        `Put all words from wordList into a hash set for O(1) lookup. If endWord is not in the set, return 0.`,
        `Start BFS with a queue containing (beginWord, level=1). Mark beginWord as visited.`,
        `For each word at the current level: try replacing each character (position 0..len-1) with every letter a-z.`,
        `If the new word is in the set: if it equals endWord return level+1, otherwise enqueue (newWord, level+1) and remove it from the set.`,
        `If the queue empties without finding endWord, return 0.`,
      ],
      example: `beginWord="hit", wordList={"hot","dot","dog","lot","log","cog"}\n\nLevel 1: "hit"\n  h_t: hat,hbt,...,hot ✓ → enqueue "hot"\n  hi_: hia,...,hiz — none in set\n  _it: ait,...,zit — none in set\n\nLevel 2: "hot"\n  _ot: dot ✓ lot ✓ → enqueue both\n\nLevel 3: "dot","lot"\n  dot→dog ✓, lot→log ✓ → enqueue both\n\nLevel 4: "dog","log"\n  dog→cog ✓ == endWord → return 4+1=5\n✅ Answer: 5`,
      keyInsight: `O(M² × N) time where M = word length, N = wordList size. The 26-letter substitution loop runs M×26 per word. BFS guarantees the shortest path is found first.`,
    },

    'Bidirectional BFS': {
      intuition: `Run BFS simultaneously from both beginWord and endWord. Expand the smaller frontier at each step. When the two frontiers intersect (a word appears in both), the sum of their levels is the answer. This dramatically reduces the search space — instead of exploring a full sphere of radius r, you explore two spheres of radius r/2, which is much smaller.`,
      steps: [
        `Create two sets: beginSet={beginWord}, endSet={endWord}. Add endWord-to-set of wordList check.`,
        `Use a wordSet of all available words. Keep a step counter starting at 1.`,
        `While both sets are non-empty: always expand the smaller set (swap if needed).`,
        `For each word in the current frontier, generate all one-letter variants.`,
        `If a variant is in the OTHER set, return step+1 (the two frontiers met).`,
        `If a variant is in wordSet, add it to the next frontier and remove from wordSet. Increment step. Repeat.`,
      ],
      example: `beginWord="hit", endWord="cog"\nbeginSet={"hit"}, endSet={"cog"}, step=1\n\nExpand beginSet: "hit"→"hot". nextBegin={"hot"}, step=2\nExpand endSet (smaller check): "cog"→"dog","log". nextEnd={"dog","log"}, step=2\nExpand beginSet: "hot"→"dot","lot". nextBegin={"dot","lot"}, step=3\nExpand endSet: "dog"→"dot" — "dot" in nextBegin? Yes!\nReturn step+1 = 5\n✅ Answer: 5`,
      keyInsight: `O(M² × N) worst-case but typical speedup of ~√N. Bidirectional BFS is the optimal BFS variant — used in real-world pathfinding. Best when both ends are known.`,
    },

    'BFS with Pattern Matching': {
      intuition: `Instead of trying all 26 letter replacements, preprocess the wordList into pattern buckets. For example "hot" generates patterns "*ot", "h*t", "ho*". Group all words by their patterns. During BFS, for each word generate its patterns, then find all words sharing each pattern — those are the valid one-step neighbours.`,
      steps: [
        `Preprocess: for each word, generate all length patterns by replacing each character with '*'. Map pattern → list of words.`,
        `BFS from beginWord. For each word, generate all patterns.`,
        `Look up each pattern in the map to get all one-letter neighbours.`,
        `Enqueue unvisited neighbours and mark them visited.`,
        `Return the level when endWord is dequeued (or 0 if queue empties).`,
      ],
      example: `wordList=["hot","dot","dog","lot","log","cog"]\nPatterns: "*ot":[hot,dot,lot], "h*t":[hot], "ho*":[hot],\n          "d*t":[dot], "do*":[dot,dog], ...\n\nBFS from "hit":\n  Patterns of "hit": "*it"→[], "h*t"→[hot], "hi*"→[]\n  Neighbours: "hot" → enqueue.\nBFS level 2 from "hot": patterns "*ot"→[dot,lot]\n... continue as standard BFS ...\n✅ Answer: 5`,
      keyInsight: `O(M² × N) time and O(M² × N) space for preprocessing. This approach avoids the 26-letter loop and is especially efficient when the alphabet is large or variable.`,
    },

    'Optimised BFS (Remove from Set)': {
      intuition: `Standard BFS but with one important optimisation: instead of maintaining a separate visited set, remove words from the wordList set as soon as they are enqueued. This prevents duplicate enqueuing without any extra data structure, making the constant factor smaller.`,
      steps: [
        `Convert wordList to a mutable set. If endWord not in set, return 0.`,
        `Enqueue (beginWord, 1). Also remove beginWord from the set if present.`,
        `For each dequeued (word, steps): generate all one-letter variants.`,
        `If variant == endWord, return steps+1.`,
        `If variant is in wordSet: remove it from wordSet (mark visited) and enqueue (variant, steps+1).`,
        `Return 0 if queue empties.`,
      ],
      example: `beginWord="hit", wordList={"hot","dot","dog","lot","log","cog"}\nQueue: [("hit",1)]\n\nDequeue ("hit",1): generate "hot" → in set, remove, enqueue ("hot",2).\nDequeue ("hot",2): "dot"→remove+enqueue("dot",3), "lot"→remove+enqueue("lot",3).\nDequeue ("dot",3): "dog"→remove+enqueue("dog",4).\nDequeue ("lot",3): "log"→remove+enqueue("log",4).\nDequeue ("dog",4): "cog" → cog==endWord → return 4+1=5.\n✅ Answer: 5`,
      keyInsight: `O(M² × N) time, O(N) space. Removing from the word set is equivalent to marking visited but uses no additional memory. The cleanest standard BFS implementation.`,
    },
  },
}
