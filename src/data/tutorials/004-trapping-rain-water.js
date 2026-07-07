/**
 * Tutorial content for #004 — Trapping Rain Water
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an array representing the height of bars in an elevation map, compute how much water can be trapped between the bars after it rains. Water sits on top of bars and is bounded on both sides by taller bars.`,
    example: `heights = [0,1,0,2,1,0,1,3,2,1,2,1]\n→ Water fills above index 2 (1 unit), above index 4 (1 unit), etc.\n✅ Answer: 6`,
    keyInsight: `The water level at any position is determined by the shorter of the tallest bar to its left and the tallest bar to its right. Water trapped at i = min(maxLeft[i], maxRight[i]) - height[i].`,
  },

  approaches: {
    'Brute Force': {
      intuition: `For every bar, scan left to find the tallest bar on the left, and scan right to find the tallest bar on the right. The water sitting on top of this bar is min(leftMax, rightMax) - height[i]. Sum this up for every position. Simple but does redundant scanning.`,
      steps: [
        `Initialize totalWater = 0.`,
        `For each index i from 0 to n-1:`,
        `  Scan left from i to 0, track leftMax = max height seen.`,
        `  Scan right from i to n-1, track rightMax = max height seen.`,
        `  water at i = min(leftMax, rightMax) - height[i].`,
        `  Add max(0, water) to totalWater.`,
        `Return totalWater.`,
      ],
      example: `heights = [0,1,0,2,1,0,1,3,2,1,2,1]\n\ni=2(h=0): leftMax=max(0,1,0)=1, rightMax=max(0,2,1,0,1,3,2,1,2,1)=3\n  water = min(1,3)-0 = 1\ni=5(h=0): leftMax=2, rightMax=3 → water=min(2,3)-0=2\n...\n✅ Total = 6`,
      keyInsight: `O(n²) time, O(1) space. For each of n positions we scan up to n positions — redundant work that the next approaches eliminate.`,
    },

    'Prefix & Suffix Arrays': {
      intuition: `Pre-compute the answers to "what is the tallest bar to my left?" and "what is the tallest bar to my right?" for every position. Store them in two arrays. Then a single pass computes the water at each position in O(1) using those pre-computed values.`,
      steps: [
        `Build leftMax[]: leftMax[i] = max of heights[0..i].`,
        `Build rightMax[]: rightMax[i] = max of heights[i..n-1].`,
        `For each index i: water[i] = min(leftMax[i], rightMax[i]) - heights[i].`,
        `Sum all water[i] values (negative values clamped to 0).`,
        `Return the total.`,
      ],
      example: `heights =  [0,1,0,2,1,0,1,3,2,1,2,1]\nleftMax  = [0,1,1,2,2,2,2,3,3,3,3,3]\nrightMax = [3,3,3,3,3,3,3,3,2,2,2,1]\n\ni=0: min(0,3)-0=0\ni=2: min(1,3)-0=1  ✓\ni=5: min(2,3)-0=2  ✓\ni=9: min(3,2)-1=1  ✓\n... total = 0+0+1+0+1+2+1+0+0+1+0+0 = 6\n✅ Answer: 6`,
      keyInsight: `O(n) time, O(n) space (two extra arrays). Clean and easy to understand — a great step up from brute force that illustrates the power of pre-computation.`,
    },

    'Two Pointers': {
      intuition: `Use two pointers starting at each end. The key insight: if the left bar is shorter, the water at the left pointer is fully determined by leftMax (the right side is guaranteed to have something at least as tall). Process the shorter side and move that pointer inward. This avoids needing any extra arrays.`,
      steps: [
        `Set left=0, right=n-1, leftMax=0, rightMax=0, totalWater=0.`,
        `While left < right:`,
        `  If heights[left] <= heights[right]: process the left side.`,
        `    Update leftMax = max(leftMax, heights[left]).`,
        `    Add leftMax - heights[left] to totalWater.`,
        `    left++.`,
        `  Else: process the right side symmetrically, right--.`,
        `Return totalWater.`,
      ],
      example: `heights = [0,1,0,2,1,0,1,3,2,1,2,1]\nleft=0,right=11,leftMax=0,rightMax=0\n\nh[0]=0≤h[11]=1: leftMax=0, water+=0-0=0, left=1\nh[1]=1>h[11]=1→no: rightMax=1, water+=1-1=0, right=10\nh[1]=1≤h[10]=2: leftMax=1, water+=1-1=0, left=2\nh[2]=0≤h[10]=2: leftMax=1, water+=1-0=1, left=3\n... (continuing)\n✅ Total = 6`,
      keyInsight: `O(n) time, O(1) space — the optimal solution. The two-pointer approach works because whichever side is shorter, its water level is already fully determined by the running max on that side.`,
    },

    'Monotonic Stack': {
      intuition: `Think of water filling horizontally between bars. Use a stack to keep track of bars that could form the left wall of a "valley". When you find a bar taller than the stack top, you've found the right wall — compute the water that fills the valley between the left wall and right wall, then pop and continue.`,
      steps: [
        `Initialize an empty stack and totalWater = 0.`,
        `Iterate over each index i:`,
        `  While stack is not empty AND heights[i] > heights[stack.top()]:`,
        `    Pop the top → this is the bottom of the valley.`,
        `    If stack is empty, break (no left wall).`,
        `    left = stack.top(), right = i.`,
        `    width = right - left - 1.`,
        `    boundedHeight = min(heights[left], heights[right]) - heights[bottom].`,
        `    totalWater += width * boundedHeight.`,
        `  Push i onto the stack.`,
        `Return totalWater.`,
      ],
      example: `heights = [0,1,0,2,...]\n\ni=0(0): stack=[0]\ni=1(1): h[1]>h[0]: pop 0 (bottom), stack empty→break. Push 1. stack=[1]\ni=2(0): h[2]<h[1]: push. stack=[1,2]\ni=3(2): h[3]>h[2]: pop 2(bottom=0), left=1(h=1),right=3(h=2)\n  width=1, height=min(1,2)-0=1, water+=1. stack=[1]\n  h[3]>h[1]: pop 1(bottom), stack empty→break. Push 3.\n... continue\n✅ Total = 6`,
      keyInsight: `O(n) time, O(n) space (stack). Computes water horizontally in layers — elegant for understanding the structure of trapped water. Each bar is pushed and popped at most once.`,
    },
  },
}
