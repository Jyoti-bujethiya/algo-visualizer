/**
 * Tutorial content for #078 — Evaluate Reverse Polish Notation
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Evaluate an arithmetic expression given in Reverse Polish Notation (RPN). In RPN, operators come AFTER their operands. The operators are +, -, *, and /. Division is integer division truncated toward zero. You can assume the input is always a valid RPN expression.`,
    example: `["2","1","+","3","*"]\n→ Step 1: see "2" → push 2\n→ Step 2: see "1" → push 1\n→ Step 3: see "+" → pop 1 and 2, push 2+1=3\n→ Step 4: see "3" → push 3\n→ Step 5: see "*" → pop 3 and 3, push 3*3=9\n✅ Answer: 9`,
    keyInsight: `A stack is the natural fit: push numbers, and when you see an operator, pop the top two numbers, apply the operator, and push the result back. The final value left on the stack is the answer.`,
  },

  approaches: {
    'Stack-Based Evaluation': {
      intuition: `Walk through the token array left to right. For every token:\n• If it's a number, push it.\n• If it's an operator (+, -, *, /), pop two numbers (b then a), compute a op b, and push the result.\n\nBe careful about order: the first pop gives the RIGHT operand, the second pop gives the LEFT operand (because the stack is LIFO).`,
      steps: [
        `Create an empty stack.`,
        `For each token in the array:`,
        `  If token is a number (parseInt / Integer.parseInt) → push it.`,
        `  If token is "+" → b=pop, a=pop, push a+b.`,
        `  If token is "-" → b=pop, a=pop, push a-b.`,
        `  If token is "*" → b=pop, a=pop, push a*b.`,
        `  If token is "/" → b=pop, a=pop, push trunc(a/b).`,
        `Return the single value remaining on the stack.`,
      ],
      example: `tokens = ["4","13","5","/","+"]\n\ntoken "4"  → push 4     stack: [4]\ntoken "13" → push 13    stack: [4,13]\ntoken "5"  → push 5     stack: [4,13,5]\ntoken "/"  → b=5,a=13 → push 13/5=2  stack: [4,2]\ntoken "+"  → b=2,a=4  → push 4+2=6   stack: [6]\nReturn 6 ✅`,
      keyInsight: `O(n) time, O(n) space. This is the textbook stack evaluation algorithm and is the only approach you need to know. Every RPN evaluator in compilers and calculators works exactly like this.`,
    },

    'Stack with Set-Based Operator Check': {
      intuition: `Same stack algorithm as above, but instead of four separate if-else comparisons for the operator, store the operators in a Set and check membership first. This makes the "is this token an operator?" check a one-liner, then a switch/if-else handles the actual math.`,
      steps: [
        `Create a Set ops = {"+", "-", "*", "/"}.`,
        `Create an empty stack.`,
        `For each token:`,
        `  If ops.contains(token): b=pop, a=pop, compute result, push.`,
        `  Else: push parseInt(token).`,
        `Return stack.pop().`,
      ],
      example: `tokens = ["2","1","+","3","*"]\n\n"2" → not in ops → push 2\n"1" → not in ops → push 1\n"+" → in ops → b=1,a=2 → push 3\n"3" → not in ops → push 3\n"*" → in ops → b=3,a=3 → push 9\nReturn 9 ✅`,
      keyInsight: `O(n) time, O(n) space. The Set check is a cosmetic refactor — same complexity. Useful when you want the "is operator?" logic decoupled from the "which operator?" switch.`,
    },

    'Stack with Array': {
      intuition: `Instead of a Stack or Deque object, use a plain integer array with a manual pointer (top) as a stack. This avoids object overhead and boxing/unboxing of integers, giving slightly better constant-factor performance in languages like Java.`,
      steps: [
        `Allocate int[] stack of size tokens.length; int top = -1.`,
        `For each token:`,
        `  If it's an operator: b=stack[top--], a=stack[top--], compute, stack[++top]=result.`,
        `  Else: stack[++top] = parseInt(token).`,
        `Return stack[0].`,
      ],
      example: `tokens = ["2","1","+","3","*"]\nstack = [_, _, _, _, _], top = -1\n\n"2" → stack[0]=2, top=0\n"1" → stack[1]=1, top=1\n"+" → b=1(top=0), a=2(top=-1), res=3, stack[0]=3, top=0\n"3" → stack[1]=3, top=1\n"*" → b=3(top=0), a=3(top=-1), res=9, stack[0]=9, top=0\nReturn stack[0] = 9 ✅`,
      keyInsight: `O(n) time, O(n) space. Same algorithm, tighter memory. Useful in performance-critical code or embedded contexts without dynamic data structures.`,
    },
  },
}
