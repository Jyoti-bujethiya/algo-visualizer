/**
 * Tutorial content for #079 — Daily Temperatures
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an array of daily temperatures, return an array where each element tells you how many days you have to wait until a warmer temperature. If no future day is warmer, put 0 for that day.`,
    example: `temps = [73,74,75,71,69,72,76,73]\nDay 0 (73°): next warmer is day 1 (74°) → 1 day wait\nDay 1 (74°): next warmer is day 2 (75°) → 1 day wait\nDay 2 (75°): next warmer is day 6 (76°) → 4 days wait\nDay 3 (71°): next warmer is day 5 (72°) → 2 days wait\n✅ Answer: [1,1,4,2,1,1,0,0]`,
    keyInsight: `You need the "next greater element" to the right for each position. A monotonic stack (decreasing) lets you solve this in one pass: stack stores indices of days whose warmer future day hasn't been found yet.`,
  },

  approaches: {
    'Monotonic Stack (Optimal)': {
      intuition: `Keep a stack of indices of days that are still "waiting" for a warmer day. The stack stays in decreasing order of temperature (monotonically decreasing).\n\nFor each new day, if its temperature is warmer than the top of the stack, we've found the answer for that waiting day — pop it, compute the gap, record it. Keep popping while the new day is warmer. Then push the current index.`,
      steps: [
        `Initialize result array of zeros, same length as temperatures.`,
        `Create an empty stack (stores indices).`,
        `For each index i:`,
        `  While stack is not empty AND temps[i] > temps[stack.top]:`,
        `    idx = stack.pop()`,
        `    result[idx] = i - idx`,
        `  Push i onto the stack.`,
        `Return result (any index still in the stack stays 0).`,
      ],
      example: `temps = [73,74,75,71,69,72,76,73]\nresult = [0,0,0,0,0,0,0,0]\n\ni=0(73): stack empty → push 0.  stack:[0]\ni=1(74): 74>73 → pop 0, res[0]=1-0=1. push 1. stack:[1]\ni=2(75): 75>74 → pop 1, res[1]=2-1=1. push 2. stack:[2]\ni=3(71): 71<75 → push 3.  stack:[2,3]\ni=4(69): 69<71 → push 4.  stack:[2,3,4]\ni=5(72): 72>69 → pop 4, res[4]=5-4=1\n         72>71 → pop 3, res[3]=5-3=2\n         72<75 → stop. push 5. stack:[2,5]\ni=6(76): 76>72 → pop 5, res[5]=6-5=1\n         76>75 → pop 2, res[2]=6-2=4\n         stack empty → push 6. stack:[6]\ni=7(73): 73<76 → push 7. stack:[6,7]\nResult: [1,1,4,2,1,1,0,0] ✅`,
      keyInsight: `O(n) time — each index is pushed and popped at most once. O(n) space for the stack. This is the canonical "next greater element" pattern and appears frequently in interview problems.`,
    },

    'Brute Force': {
      intuition: `For each day i, scan every future day j (j > i) until you find a temperature warmer than temps[i]. Record the gap j - i. Simple to understand but slow for large inputs.`,
      steps: [
        `Initialize result array of zeros.`,
        `For each index i from 0 to n-2:`,
        `  For each index j from i+1 to n-1:`,
        `    If temps[j] > temps[i]: result[i] = j - i; break.`,
        `Return result.`,
      ],
      example: `temps = [73,74,75,71]\n\ni=0(73): j=1(74)>73 → res[0]=1. stop.\ni=1(74): j=2(75)>74 → res[1]=1. stop.\ni=2(75): j=3(71)<75 → no warmer found → res[2]=0.\ni=3(71): no j → res[3]=0.\nResult: [1,1,0,0] ✅`,
      keyInsight: `O(n²) time, O(1) extra space. Fine for n ≤ 100 but too slow for n = 100,000. Useful as a correctness reference to verify faster approaches.`,
    },

    'Backward Iteration with Jump': {
      intuition: `Iterate from the second-to-last day backward to day 0. For each day i, use the already-computed result array to "jump" forward: if temps[j] ≤ temps[i], jump by result[j] steps to find the next candidate, repeating until you find a warmer day or fall off the end.`,
      steps: [
        `Initialize result array of zeros.`,
        `Iterate i from n-2 down to 0:`,
        `  j = i + 1.`,
        `  While j < n AND temps[j] <= temps[i]:`,
        `    If result[j] == 0: break (no warmer day exists beyond j).`,
        `    j += result[j]  ← jump forward using precomputed answer.`,
        `  If j < n AND temps[j] > temps[i]: result[i] = j - i.`,
        `Return result.`,
      ],
      example: `temps = [73,74,75,71,69,72,76,73]\n\ni=6(76): j=7(73) ≤ 76, result[7]=0 → break. res[6]=0.\ni=5(72): j=6(76) > 72 → res[5]=1.\ni=4(69): j=5(72) > 69 → res[4]=1.\ni=3(71): j=4(69) ≤ 71, jump j+=1→5(72) > 71 → res[3]=2.\ni=2(75): j=3, jump→5, jump→6(76)>75 → res[2]=4.\ni=1(74): j=2, jump→6(76)>74 → res[1]=1.\ni=0(73): j=1, jump→2, jump→6(76)>73 → res[0]=1.\nResult: [1,1,4,2,1,1,0,0] ✅`,
      keyInsight: `O(n) amortized time, O(1) extra space (uses only the output array). The jump avoids re-scanning already-resolved days. A clever space-saving alternative to the monotonic stack.`,
    },

    'Array as Stack': {
      intuition: `Exactly the monotonic stack approach, but uses a plain integer array with a manual top pointer instead of a Stack/Deque object. This is the same algorithm — just a micro-optimization to avoid object allocation overhead in languages like Java.`,
      steps: [
        `int[] stack = new int[n]; int top = -1.`,
        `int[] result = new int[n].`,
        `For each i from 0 to n-1:`,
        `  While top >= 0 AND temps[i] > temps[stack[top]]:`,
        `    idx = stack[top--].`,
        `    result[idx] = i - idx.`,
        `  stack[++top] = i.`,
        `Return result.`,
      ],
      example: `temps = [73,74,75,71]\nstack=[], top=-1\n\ni=0: push 0. stack=[0]\ni=1(74>73): pop 0 res[0]=1, push 1. stack=[1]\ni=2(75>74): pop 1 res[1]=1, push 2. stack=[2]\ni=3(71<75): push 3. stack=[2,3]\nResult: [1,1,0,0] ✅`,
      keyInsight: `O(n) time, O(n) space. Identical to the Monotonic Stack approach in behavior. Using an array manually is common in competitive programming for speed; in an interview, the Deque version is more readable.`,
    },

    'Next Greater Element Pattern': {
      intuition: `Recognize this as the classic "Next Greater Element" problem. Some implementations solve it by processing the stack in a slightly different order — pushing (temperature, index) pairs — or by doing two passes. The core idea is unchanged: a monotonic decreasing stack resolves waiting indices as soon as a larger element arrives.`,
      steps: [
        `Stack stores (temperature, index) pairs.`,
        `For each (i, temp) in enumerated temperatures:`,
        `  While stack not empty AND temp > stack.top.temperature:`,
        `    (t, idx) = stack.pop()`,
        `    result[idx] = i - idx`,
        `  Push (temp, i).`,
        `Return result.`,
      ],
      example: `temps = [73,74,75,71]\n\ni=0,T=73: push (73,0). stack:[(73,0)]\ni=1,T=74: 74>73 → pop(73,0) res[0]=1-0=1. push (74,1).\ni=2,T=75: 75>74 → pop(74,1) res[1]=2-1=1. push (75,2).\ni=3,T=71: 71<75 → push (71,3).\nStack remaining: (75,2),(71,3) → res stays 0.\nResult: [1,1,0,0] ✅`,
      keyInsight: `O(n) time, O(n) space. Storing pairs is slightly more memory per entry but makes the code more explicit. Functionally equivalent to storing index-only — the temperature can always be recovered via temps[idx].`,
    },
  },
}
