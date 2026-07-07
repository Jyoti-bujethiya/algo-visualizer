/**
 * Tutorial content for #073 — Letter Combinations of a Phone Number
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a string of digits 2-9, return all possible letter combinations the digits could represent, as on a telephone keypad. 2=ABC, 3=DEF, 4=GHI, 5=JKL, 6=MNO, 7=PQRS, 8=TUV, 9=WXYZ.`,
    example: `digits = "23"\n→ 2→(a,b,c), 3→(d,e,f)\n→ "ad","ae","af","bd","be","bf","cd","ce","cf"\n✅ Answer: 9 combinations`,
    keyInsight: `For each digit position, the number of choices equals the number of letters mapped to that digit (3 or 4). The total combinations = product of choices at each position. Use backtracking or BFS to enumerate them.`,
  },

  approaches: {
    'Backtracking': {
      intuition: `Recurse digit by digit. At each depth, try every letter mapped to the current digit. Append the letter to the current combination and recurse for the next digit. When all digits are consumed, the combination is complete.`,
      steps: [
        `Create a phone map: 2→"abc", 3→"def", ..., 9→"wxyz".`,
        `Backtrack(index, current):`,
        `  If index == digits.length(): add current to results; return.`,
        `  For each letter in phoneMap[digits[index]]:`,
        `    Recurse(index+1, current + letter).`,
      ],
      example: `digits = "23"\n\nbacktrack(0, ""):\n  'a' → backtrack(1, "a")\n    'd' → backtrack(2, "ad") → add\n    'e' → backtrack(2, "ae") → add\n    'f' → backtrack(2, "af") → add\n  'b' → backtrack(1, "b")\n    'd' → "bd", 'e' → "be", 'f' → "bf"\n  'c' → backtrack(1, "c")\n    → "cd","ce","cf"\n✅ Answer: ["ad","ae","af","bd","be","bf","cd","ce","cf"]`,
      keyInsight: `O(4ⁿ × n) time where n is the number of digits (some keys have 4 letters). O(n) extra space for the recursion stack. The most natural approach.`,
    },

    'BFS with Queue': {
      intuition: `Treat each partial combination as a node. Start with an empty string. For each digit, expand every existing partial combination by appending each letter for that digit. After processing all digits, the queue contains the complete combinations.`,
      steps: [
        `Enqueue "" (empty string).`,
        `For each digit in digits:`,
        `  For each existing partial combo in the queue:`,
        `    For each letter in phoneMap[digit]:`,
        `      Enqueue partial + letter.`,
        `  Remove the old (shorter) entries.`,
        `Return remaining queue contents.`,
      ],
      example: `digits = "23"\n\nQueue: [""]\nDigit '2' (abc): "" + a/b/c → Queue: ["a","b","c"]\nDigit '3' (def): "a"+d/e/f, "b"+d/e/f, "c"+d/e/f\nQueue: ["ad","ae","af","bd","be","bf","cd","ce","cf"]\n✅ Answer: 9 combinations`,
      keyInsight: `O(4ⁿ × n) time and space. BFS builds the answer level by level — each level corresponds to one digit. Iterative and easy to understand.`,
    },

    'Iterative with List': {
      intuition: `Same as BFS but explicitly use a list rather than a queue. Start with [""] and for each digit, build a new list by expanding every existing entry with each valid letter.`,
      steps: [
        `result = [""].`,
        `For each digit:`,
        `  newResult = [].`,
        `  For each combo in result:`,
        `    For each letter in phoneMap[digit]:`,
        `      newResult.add(combo + letter).`,
        `  result = newResult.`,
        `Return result.`,
      ],
      example: `digits = "23"\n\nStart: [""]\nAfter digit '2': ["a","b","c"]\nAfter digit '3': ["ad","ae","af","bd","be","bf","cd","ce","cf"]\n✅ Answer: 9 combinations`,
      keyInsight: `O(4ⁿ × n) time and space. Functionally identical to BFS. Slightly simpler implementation using a list instead of a queue data structure.`,
    },

    'Pure Recursive (no helper)': {
      intuition: `A compact recursive approach with no separate helper method. The recursion is self-contained: if digits is empty, return an empty list or a list containing the empty string. Otherwise, recurse on digits[1:], then prepend each letter from digits[0] to every result.`,
      steps: [
        `If digits is empty: return [""]. (or empty list if we want no result for empty input)`,
        `Get letters for digits[0].`,
        `Recurse on digits[1:] to get all combos for the rest.`,
        `For each letter and each sub-combo: prepend letter to sub-combo and add to result.`,
        `Return result.`,
      ],
      example: `digits = "23"\n\nrecurse("23"):\n  letters of '2' = [a,b,c]\n  subResults = recurse("3"):\n    letters of '3' = [d,e,f]\n    subResults = recurse("") = [""]\n    → ["d","e","f"]\n  Combine: a+d,a+e,a+f,b+d,... = ["ad","ae","af","bd","be","bf","cd","ce","cf"]\n✅ Answer: 9 combinations`,
      keyInsight: `O(4ⁿ × n) time. Elegant one-method solution — no helper or iteration. Slightly less efficient due to string slicing but clean for short inputs.`,
    },

    'Standard (entry point — backtracking)': {
      intuition: `The entry point that handles the edge case (empty digits → return empty list) and then delegates to the backtracking helper.`,
      steps: [
        `If digits is null or empty: return empty list.`,
        `Initialise results list and phone map.`,
        `Call backtrack(0, new StringBuilder()).`,
        `Return results.`,
      ],
      example: `digits = "23"\nletterCombinations("23")\n→ not empty, calls backtracking\n→ ["ad","ae","af","bd","be","bf","cd","ce","cf"]\n✅ Answer: 9 combinations`,
      keyInsight: `O(4ⁿ × n) time — same as backtracking. Entry point exists to guard against empty input and initialise shared state before backtracking begins.`,
    },
  },
}
