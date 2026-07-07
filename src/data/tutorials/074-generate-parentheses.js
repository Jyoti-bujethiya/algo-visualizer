/**
 * Tutorial content for #074 — Generate Parentheses
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given n pairs of parentheses, generate all combinations of well-formed parentheses strings. A well-formed string has every '(' matched by a subsequent ')' and no ')' appears before its matching '('.`,
    example: `n = 3\n→ "((()))", "(()())", "(())()", "()(())", "()()()"\n✅ Answer: 5 combinations (Catalan number C₃)`,
    keyInsight: `At any point, you can add '(' as long as you have open parens left (open < n). You can add ')' only if there are more open parens than close parens placed so far (close < open). These two constraints guarantee validity.`,
  },

  approaches: {
    'Backtracking (Optimal)': {
      intuition: `Build the string character by character. At each step, you have two choices: add '(' or add ')'. But only make a choice if it leads to a valid string: add '(' if open < n; add ')' if close < open. When the string has 2n characters, it's complete.`,
      steps: [
        `Backtrack(current, open, close):`,
        `  If current.length() == 2*n: add to results; return.`,
        `  If open < n: recurse(current+"(", open+1, close).`,
        `  If close < open: recurse(current+")", open, close+1).`,
      ],
      example: `n = 2\n\nbt("", 0, 0):\n  add '(' → bt("(", 1, 0):\n    add '(' → bt("((", 2, 0):\n      add ')' → bt("(()", 2, 1):\n        add ')' → bt("(())", 2, 2) → ADD "(()" ? \n        Wait: "(())" has length 4==2*2 → ADD "(())"\n    add ')' → bt("()", 2, 1):\n      Oops open=1, wait — let me redo with n=2\n      → leads to "()()" ✓\n✅ Answer (n=3): ["((()))","(()())","(())()","()(())","()()()"]`,
      keyInsight: `O(4ⁿ / √n) time (Catalan number of results, each of length 2n), O(n) extra stack space. This is the ideal approach — prunes invalid paths immediately.`,
    },

    'Backtracking with StringBuilder': {
      intuition: `Same logic as Backtracking (Optimal), but use a StringBuilder instead of string concatenation. StringBuilder allows O(1) append and delete, avoiding the O(n) cost of creating a new string at each recursive step.`,
      steps: [
        `Backtrack(sb, open, close):`,
        `  If sb.length() == 2*n: add sb.toString() to results; return.`,
        `  If open < n: sb.append('('); recurse(open+1, close); sb.deleteCharAt(last).`,
        `  If close < open: sb.append(')'); recurse(open, close+1); sb.deleteCharAt(last).`,
      ],
      example: `n = 3\n\nSame enumeration as Backtracking (Optimal).\nDifference is implementation: instead of current+"(", we mutate the StringBuilder.\nThis is more memory-efficient in Java (avoids many String allocations).\n✅ Answer: ["((()))","(()())","(())()","()(())","()()()"]`,
      keyInsight: `O(4ⁿ / √n) time. Fewer allocations than string concatenation version. Especially beneficial in Java where String is immutable and every concatenation creates a new object.`,
    },

    'Closure Number (Mathematical)': {
      intuition: `Every valid parenthesis sequence can be described by the position of the first ')' that closes the first '('. The sequence looks like "(" + A + ")" + B where A and B are themselves valid sequences (possibly empty). Recursively generate all A of length 0..(n-1) and all B of length (n-1-|A|).`,
      steps: [
        `generate(n):`,
        `  If n == 0: return [""].`,
        `  For c from 0 to n-1: (c = number of pairs inside first closure)`,
        `    For each A in generate(c):`,
        `      For each B in generate(n-1-c):`,
        `        Add "(" + A + ")" + B.`,
        `Return results.`,
      ],
      example: `n = 2\n\nc=0: A="", B=generate(1)=["()"]\n  → "()" + "()" wait — "(" + "" + ")" + "()" = "()()" ✓\nc=1: A=generate(1)=["()"], B=generate(0)=[""].\n  → "(" + "()" + ")" + "" = "(())" ✓\n✅ Answer: ["()()","(())"]  (n=2)`,
      keyInsight: `O(4ⁿ / √n) time. Mathematical, elegant, and directly encodes the Catalan number structure. Each unique decomposition produces a unique valid sequence.`,
    },

    'Dynamic Programming': {
      intuition: `Build up from smaller n. dp[k] = list of all valid sequences with k pairs. dp[0] = [""], dp[1] = ["()"]. For each n, combine: wrap A pairs in the first closure ("(" + A + ")") and append B pairs after it, where |A| + |B| = n-1.`,
      steps: [
        `dp[0] = [""].`,
        `For i from 1 to n:`,
        `  dp[i] = [].`,
        `  For c from 0 to i-1:`,
        `    For each A in dp[c], for each B in dp[i-1-c]:`,
        `      dp[i].add("(" + A + ")" + B).`,
        `Return dp[n].`,
      ],
      example: `dp[0] = [""]\ndp[1] = ["(" + "" + ")" + ""] = ["()"]\ndp[2]:\n  c=0: "(" + "" + ")" + "()" = "()()" \n  c=1: "(" + "()" + ")" + "" = "(())"\ndp[2] = ["()()","(())"]\ndp[3]: ... builds all 5 sequences\n✅ Answer (n=3): ["((()))","(()())","(())()","()(())","()()()"]`,
      keyInsight: `O(4ⁿ / √n) time. Builds results incrementally and reuses previous answers. Same results as Closure Number — both decompose on the first closure boundary.`,
    },

    'BFS / Iterative Stack': {
      intuition: `Use a queue (or stack) of states, where each state is (currentString, openCount, closeCount). Start from ("", 0, 0). Pop each state and push up to two children: one with '(' appended (if open < n) and one with ')' appended (if close < open). When a string has length 2n, it's complete.`,
      steps: [
        `Queue = [("", 0, 0)].`,
        `While queue not empty:`,
        `  Pop (s, open, close).`,
        `  If s.length() == 2*n: add s to results; continue.`,
        `  If open < n: enqueue (s+"(", open+1, close).`,
        `  If close < open: enqueue (s+")", open, close+1).`,
        `Return results.`,
      ],
      example: `n = 2\n\nQueue: [("",0,0)]\nPop ("",0,0): push ("(",1,0)\nPop ("(",1,0): push ("((",2,0) and ("()",1,1)\nPop ("((",2,0): push ("(()",2,1)\nPop ("()",1,1): push ("()(", 2,1)\n... eventually collects "(())" and "()()"\n✅ Answer (n=2): ["(())","()()"]`,
      keyInsight: `O(4ⁿ / √n) time. Iterative alternative to recursion — avoids the call stack but uses a queue of states. Less memory-efficient than the StringBuilder approach.`,
    },
  },
}
