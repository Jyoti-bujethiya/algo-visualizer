/**
 * Tutorial content for #076 — Valid Parentheses
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a string containing only the characters '(', ')', '{', '}', '[', and ']', determine if the input string is valid. A string is valid if every opening bracket has a matching closing bracket of the same type, and brackets are closed in the correct order. An empty string is also valid.`,
    example: `"()[]{}" → open (, close ) ✓, open [, close ] ✓, open {, close } ✓\n"(]"    → open (, but closed with ] ✗\n"([)]"  → open (, open [, close ) — wrong order ✗\n✅ Answer: true, false, false`,
    keyInsight: `A stack is perfect here: push every opening bracket, and when you see a closing bracket check that it matches the top of the stack. If the stack is empty at the end, every bracket was matched.`,
  },

  approaches: {
    'Stack with Closing Bracket Map': {
      intuition: `Build a map from each closing bracket to its matching opener: ) → (, ] → [, } → {.\n\nPush every opening bracket onto a stack. When you see a closing bracket, look it up in the map to find the expected opener, then check whether the stack's top equals that opener.\n\nIf it does, pop and continue. If it doesn't (or the stack is empty), the string is invalid.`,
      steps: [
        `Create a map: { ')': '(', ']': '[', '}': '{' }.`,
        `Create an empty stack.`,
        `For each character c in the string:`,
        `  If c is in the map (it's a closing bracket):`,
        `    If stack is empty OR stack.top ≠ map[c] → return false.`,
        `    Otherwise pop the top.`,
        `  Else (it's an opening bracket) → push c.`,
        `Return true only if the stack is empty (all brackets matched).`,
      ],
      example: `s = "([{}])"\n\nc='(' → push → stack: ['(']\nc='[' → push → stack: ['(','[']\nc='{' → push → stack: ['(','[','{']\nc='}' → map['}']='{'  top='{' ✓ pop → stack: ['(','[']\nc=']' → map[']']='['  top='[' ✓ pop → stack: ['(']\nc=')' → map[')']='('  top='(' ✓ pop → stack: []\nStack empty → ✅ true`,
      keyInsight: `O(n) time, O(n) space. The map makes the matching logic a single lookup instead of three if-else branches — cleaner and easier to extend if more bracket types are added.`,
    },

    'Stack with Opening Bracket Push (Expected Closer)': {
      intuition: `Instead of storing the opener on the stack and looking up the expected opener when we see a closer, we flip the logic: when we see an opener, we push the EXPECTED closer onto the stack.\n\nNow when we encounter a closing bracket, we just check whether it equals the top of the stack — no map lookup needed at that point.`,
      steps: [
        `Create an empty stack.`,
        `For each character c:`,
        `  If c == '(' → push ')' onto stack.`,
        `  If c == '[' → push ']' onto stack.`,
        `  If c == '{' → push '}' onto stack.`,
        `  Otherwise c is a closer: if stack is empty OR stack.pop() ≠ c → return false.`,
        `Return stack.isEmpty().`,
      ],
      example: `s = "({})"\n\nc='(' → push ')' → stack: [')']\nc='{' → push '}' → stack: [')','}']\nc='}' → pop '}', c=='}' ✓ → stack: [')']\nc=')' → pop ')', c==')' ✓ → stack: []\nStack empty → ✅ true`,
      keyInsight: `O(n) time, O(n) space. Pushing the expected closer is a neat trick that eliminates a map lookup at closing time — the comparison is always one direct equality check.`,
    },

    'String Replace (Iterative Reduction)': {
      intuition: `Repeatedly scan the string and remove every valid adjacent pair ("()", "[]", "{}") until no more can be removed. If the string becomes empty, it was valid.\n\nThis is intuitive but slow — it's mainly useful as a thinking exercise, not a real implementation.`,
      steps: [
        `Repeat until no change occurs:`,
        `  Replace all occurrences of "()" with "".`,
        `  Replace all occurrences of "[]" with "".`,
        `  Replace all occurrences of "{}" with "".`,
        `If the string is now empty → return true, else return false.`,
      ],
      example: `s = "()[]{}"\n\nPass 1: remove "()" → "[]{}"\nPass 2: remove "[]" → "{}"\nPass 3: remove "{}" → ""\nString is empty → ✅ true\n\ns = "([)]"\nPass 1: no "()", "[]", or "{}" adjacent → no change\nString not empty → ✅ false`,
      keyInsight: `O(n²) time in the worst case (each pass removes one pair and we re-scan). Useful to illustrate the concept but never use this in an interview — the stack approach is strictly better.`,
    },
  },
}
