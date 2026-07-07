/**
 * Tutorial content for #012 — Valid Parentheses
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a string containing only the characters '(', ')', '{', '}', '[', ']', determine if the string is valid. A string is valid if every opening bracket is closed by the same type of bracket in the correct order.`,
    example: `"()[]{}" → every bracket closed in order → true\n"([)]"  → brackets interleaved incorrectly → false\n"([])"  → inner [] closed before outer () → true\n✅ Answer: true for "()[]{}"`,
    keyInsight: `A stack perfectly models bracket matching: push opening brackets, and whenever you see a closing bracket, check that it matches the most recently opened (top of stack) bracket.`,
  },

  approaches: {
    'Stack': {
      intuition: `Use a stack to keep track of all open brackets you've seen so far. When you hit a closing bracket, check if the top of the stack is its matching opener. If not, it's invalid. At the end, the stack should be empty — every opener was closed.`,
      steps: [
        `Create an empty stack.`,
        `For each character c in the string:`,
        `  If c is an opening bracket ('(', '{', '['), push it onto the stack.`,
        `  If c is a closing bracket: if the stack is empty OR top of stack doesn't match c, return false.`,
        `  Otherwise pop the top of the stack.`,
        `After the loop: return true if the stack is empty, false otherwise.`,
      ],
      example: `s = "([{}])"\n\nc='(': push → stack=['(']\nc='[': push → stack=['(','[']\nc='{': push → stack=['(','[','{']\nc='}': top='{' matches '}' → pop → stack=['(','[']\nc=']': top='[' matches ']' → pop → stack=['(']\nc=')': top='(' matches ')' → pop → stack=[]\nStack empty → ✅ true`,
      keyInsight: `O(n) time, O(n) space (stack can hold up to n/2 openers). The stack is the natural data structure for this — it respects the last-in-first-out (LIFO) order that bracket nesting requires.`,
    },

    'Stack with Switch': {
      intuition: `Same stack-based approach, but uses a switch/case statement instead of if-else chains to map each closing bracket to its expected opener. Slightly more readable for some and shows how to handle multi-case matching cleanly.`,
      steps: [
        `Create an empty stack.`,
        `For each character c in the string:`,
        `  Use a switch on c.`,
        `  Cases '(', '{', '[': push c onto the stack.`,
        `  Case ')': if stack empty or top ≠ '(', return false. Else pop.`,
        `  Case '}': if stack empty or top ≠ '{', return false. Else pop.`,
        `  Case ']': if stack empty or top ≠ '[', return false. Else pop.`,
        `Return stack.isEmpty().`,
      ],
      example: `s = "([)]"\n\nc='(': push → ['(']\nc='[': push → ['(','[']\nc=')': switch ')' → top='[' ≠ '(' → return false ✅\n\n(Caught the mismatch immediately)`,
      keyInsight: `Same O(n) time and O(n) space as the basic stack. The switch statement is idiomatic in Java and can be slightly faster due to compiler optimization of jump tables.`,
    },

    'Replace Method': {
      intuition: `Repeatedly scan the string and remove adjacent matched pairs ("()", "[]", "{}") until no more pairs can be removed. If the string becomes empty, it was valid. This is a conceptual/educational approach — not efficient but intuitive.`,
      steps: [
        `While the string contains "()", "[]", or "{}":`,
        `  Replace each occurrence with an empty string "".`,
        `After the loop: if the string is empty, return true. Otherwise return false.`,
      ],
      example: `s = "([{}])"\n\nIteration 1: find "{}" → remove → "([])"\nIteration 2: find "[]" → remove → "()"\nIteration 3: find "()" → remove → ""\nString is empty → ✅ true\n\ns = "([)]"\nIteration 1: no adjacent matched pair found → stop\nString is not empty → ✅ false`,
      keyInsight: `O(n²) time (each pass is O(n), up to n/2 passes), O(n) space for the string. Elegant to understand conceptually — like peeling an onion from the inside out — but far too slow for production use.`,
    },
  },
}
