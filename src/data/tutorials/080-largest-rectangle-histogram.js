/**
 * Tutorial content for #080 — Largest Rectangle in Histogram
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an array of integers representing the heights of bars in a histogram (each bar has width 1), find the area of the largest rectangle that can be formed. The rectangle must be contained within the histogram — it can span multiple adjacent bars but cannot exceed the shortest bar in that span.`,
    example: `heights = [2,1,5,6,2,3]\nThe largest rectangle spans bars 2–3 (heights 5 and 6), limited to height 5:\n  width = 2, height = 5, area = 10\n✅ Answer: 10`,
    keyInsight: `For each bar, the rectangle it "anchors" extends left and right as far as bars are at least as tall. A monotonic increasing stack lets us find those left/right boundaries efficiently in one pass.`,
  },

  approaches: {
    'Monotonic Stack (Optimal)': {
      intuition: `Maintain a stack of bar indices in increasing order of height. When a new bar is shorter than the top, the top bar can no longer extend right — so we pop it and compute its rectangle.\n\nThe width is determined by: the current index (right boundary) minus the new stack top (left boundary) minus 1. Keep popping until the stack is empty or the top is shorter.`,
      steps: [
        `Create an empty stack (indices). Initialize maxArea = 0.`,
        `Iterate i from 0 to n (inclusive — treat heights[n] = 0 as a sentinel to flush the stack).`,
        `While stack not empty AND heights[i] < heights[stack.top]:`,
        `  height = heights[stack.pop()]`,
        `  width = i if stack is empty else i - stack.top - 1`,
        `  maxArea = max(maxArea, height * width)`,
        `Push i.`,
        `Return maxArea.`,
      ],
      example: `heights = [2,1,5,6,2,3]  (append 0 as sentinel at index 6)\n\ni=0(h=2): push 0. stack:[0]\ni=1(h=1): 1<2 → pop 0(h=2), width=1(stack empty) area=2. push 1. stack:[1]\ni=2(h=5): push 2. stack:[1,2]\ni=3(h=6): push 3. stack:[1,2,3]\ni=4(h=2): 2<6 → pop 3(h=6), w=4-2-1=1, area=6\n           2<5 → pop 2(h=5), w=4-1-1=2, area=10\n           2>1 → stop. push 4. stack:[1,4]\ni=5(h=3): push 5. stack:[1,4,5]\ni=6(h=0 sentinel): pop 5(h=3), w=6-4-1=1, area=3\n           pop 4(h=2), w=6-1-1=4, area=8\n           pop 1(h=1), w=6(stack empty), area=6\nmax = 10 ✅`,
      keyInsight: `O(n) time — each bar is pushed and popped exactly once. O(n) space for the stack. This is a classic hard problem that becomes clean once you understand "pop when the new bar is shorter."`,
    },

    'Brute Force': {
      intuition: `For every pair of bars (i, j), compute the minimum height in that range and multiply by the width (j - i + 1). Track the maximum area seen. Simple to understand but far too slow for large inputs.`,
      steps: [
        `Initialize maxArea = 0.`,
        `For each i from 0 to n-1:`,
        `  minHeight = heights[i].`,
        `  For each j from i to n-1:`,
        `    minHeight = min(minHeight, heights[j]).`,
        `    maxArea = max(maxArea, minHeight * (j - i + 1)).`,
        `Return maxArea.`,
      ],
      example: `heights = [2,1,5,6,2,3]\n\ni=0: j=0 h=2 area=2; j=1 h=min(2,1)=1 area=2; j=2 h=1 area=3; ...\ni=2: j=2 h=5 area=5; j=3 h=min(5,6)=5 area=10; j=4 h=min(5,2)=2 area=6; ...\nBest found: 10 ✅`,
      keyInsight: `O(n²) time, O(1) extra space. Good for understanding the problem but times out on large test cases. Use only to verify correctness of faster approaches.`,
    },

    'Stack with Sentinel (clean version)': {
      intuition: `The same monotonic stack algorithm, but we add a 0 at the start AND end of the heights array (sentinels). The leading 0 means the stack is never truly empty during pops (so no empty-check needed for width), and the trailing 0 flushes all remaining bars. This simplifies the width formula to just: i - stack.top - 1, always.`,
      steps: [
        `Prepend and append 0 to heights → new array h.`,
        `Create a stack, push index 0 (the leading sentinel).`,
        `For i from 1 to len(h)-1:`,
        `  While h[i] < h[stack.top]:`,
        `    height = h[stack.pop()]`,
        `    width = i - stack.top - 1  ← stack never empty because of leading 0`,
        `    maxArea = max(maxArea, height * width)`,
        `  Push i.`,
        `Return maxArea.`,
      ],
      example: `h = [0,2,1,5,6,2,3,0]  (0 prepended, 0 appended)\nstack:[0]\n\ni=1(h=2): push 1. stack:[0,1]\ni=2(h=1): 1<2 → pop 1(h=2), w=2-0-1=1, area=2. push 2. stack:[0,2]\ni=3(h=5): push.  stack:[0,2,3]\ni=4(h=6): push.  stack:[0,2,3,4]\ni=5(h=2): 2<6 → pop4(h=6),w=5-3-1=1,area=6\n           2<5 → pop3(h=5),w=5-2-1=2,area=10\n           2>1 → push 5. stack:[0,2,5]\ni=6(h=3): push 6. stack:[0,2,5,6]\ni=7(h=0 sentinel): pop6(h=3),w=7-5-1=1,area=3\n           pop5(h=2),w=7-2-1=4,area=8\n           pop2(h=1),w=7-0-1=6,area=6\nmax = 10 ✅`,
      keyInsight: `O(n) time, O(n) space. The sentinels eliminate all edge-case checks in the loop body. This is often the cleanest version to write from memory in an interview.`,
    },
  },
}
