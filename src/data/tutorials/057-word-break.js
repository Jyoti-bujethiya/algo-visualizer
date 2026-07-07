/**
 * Tutorial content for #057 — Word Break
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a string s and a dictionary of words, return true if s can be segmented into one or more dictionary words. Words can be reused and the entire string must be covered.`,
    example: `s = "leetcode", wordDict = ["leet", "code"]\n→ "leet" + "code" covers the whole string\n✅ Answer: true`,
    keyInsight: `Define dp[i] = "can the prefix s[0..i-1] be segmented?". dp[i] is true if there exists some j < i such that dp[j] is true and s[j..i-1] is in the dictionary.`,
  },

  approaches: {
    'Recursive Memoization': {
      intuition: `Try all possible first words starting at position 0. If a word matches, recursively check if the rest of the string can also be segmented. Memoize each start position so you never redo work.`,
      steps: [
        `Create a memo map from index → boolean.`,
        `Base case: index == s.length() → return true (whole string consumed).`,
        `If memo contains index, return cached result.`,
        `For each word in wordDict: check if s.startsWith(word, index).`,
        `If yes, recursively check index + word.length().`,
        `If any recursive call returns true, cache true and return.`,
        `Otherwise cache false and return.`,
      ],
      example: `s="leetcode", dict=["leet","code"]\n\nsolve(0): try "leet" → matches → solve(4)\nsolve(4): try "code" → matches → solve(8)\nsolve(8): 8==length → return true ✅\nsolve(4) = true, solve(0) = true\n✅ Answer: true`,
      keyInsight: `O(n × m × L) time where m is dict size and L is max word length; O(n) space for memo. Naturally expresses the search without explicit DP table construction.`,
    },

    'Bottom-Up DP': {
      intuition: `Build a boolean dp array of size n+1. dp[0] = true (empty prefix). For each position i, check all words: if dp[i - word.length()] is true and s ends with word at position i, set dp[i] = true.`,
      steps: [
        `Create dp[n+1] all false; set dp[0] = true.`,
        `For i from 1 to n:`,
        `  For each word in wordDict:`,
        `    Let len = word.length().`,
        `    If i >= len and dp[i-len] and s.substring(i-len, i) == word: dp[i] = true; break.`,
        `Return dp[n].`,
      ],
      example: `s="leetcode", dict=["leet","code"]\n\ndp=[T,F,F,F,F,F,F,F,F]\ni=4: word="leet" (len=4), dp[0]=T, s[0..3]="leet" ✓ → dp[4]=T\ni=8: word="code" (len=4), dp[4]=T, s[4..7]="code" ✓ → dp[8]=T\nReturn dp[8]=true\n✅ Answer: true`,
      keyInsight: `O(n × m × L) time, O(n) space. Clean and iterative — the most common interview answer.`,
    },

    'DP with Max-Length Optimization': {
      intuition: `Same as Bottom-Up DP, but first compute the maximum word length in the dictionary. When scanning words for position i, only consider offsets up to maxLen. This avoids checking impossibly long words and can significantly cut inner loop work.`,
      steps: [
        `Compute maxLen = maximum word length in wordDict.`,
        `Put wordDict into a HashSet for O(1) lookup.`,
        `Create dp[n+1]; dp[0] = true.`,
        `For i from 1 to n:`,
        `  For len from 1 to min(i, maxLen):`,
        `    If dp[i-len] and wordSet.contains(s.substring(i-len, i)): dp[i]=true; break.`,
        `Return dp[n].`,
      ],
      example: `s="leetcode", dict=["leet","code"]  maxLen=4\n\ni=4: len=4 → dp[0]=T, "leet" ✓ → dp[4]=T\ni=8: len=4 → dp[4]=T, "code" ✓ → dp[8]=T\n✅ Answer: true`,
      keyInsight: `O(n × maxLen) time — a meaningful improvement when the dictionary has many short words and the string is long. O(n) space.`,
    },

    'BFS': {
      intuition: `Treat character positions as nodes. Start from position 0. For each position in the queue, try all words — if the word fits starting at that position, enqueue the end position. If we reach position n (end of string), return true.`,
      steps: [
        `Use a queue initialised with position 0 and a visited set.`,
        `Pop position from queue.`,
        `For each word in wordDict: if s.startsWith(word, pos), compute next = pos + word.length().`,
        `If next == n, return true.`,
        `If next not visited, add to queue and visited.`,
        `If queue empties, return false.`,
      ],
      example: `s="leetcode", dict=["leet","code"]\n\nQueue: [0]\nPop 0: try "leet" → next=4 (enqueue); try "code" → no match at 0\nPop 4: try "code" → next=8 == n → return true ✅\n✅ Answer: true`,
      keyInsight: `O(n × m × L) time, O(n) space. BFS naturally avoids revisiting the same position (via the visited set) and finds a valid segmentation without exploring all paths.`,
    },

    'Trie + DP': {
      intuition: `Build a Trie from the dictionary. For each DP position i, walk the Trie character by character forward from i. Each time we hit a complete word node in the Trie and dp[i] is true, set dp[i + wordLength] = true. This avoids repeated substring lookups.`,
      steps: [
        `Insert all words into a Trie.`,
        `Create dp[n+1]; dp[0] = true.`,
        `For each i where dp[i] is true:`,
        `  Walk the Trie starting at i, advancing one character at a time.`,
        `  Whenever a Trie node marks end-of-word, set dp[i + offset] = true.`,
        `  Stop if the Trie has no child for the current character.`,
        `Return dp[n].`,
      ],
      example: `s="leetcode", dict=["leet","code"]\nTrie: l→e→e→t* (word), c→o→d→e* (word)\n\ni=0, dp[0]=T: walk Trie with "leetcode"\n  l→e→e→t* → dp[4]=T; then no child for 'c' in "leet" branch → stop\ni=4, dp[4]=T: walk Trie with "code"\n  c→o→d→e* → dp[8]=T\nReturn dp[8]=true\n✅ Answer: true`,
      keyInsight: `O(n × L) time (L = max word length) and O(total chars in dict) space for the Trie. Most efficient when the dictionary is large with many common prefixes.`,
    },
  },
}
