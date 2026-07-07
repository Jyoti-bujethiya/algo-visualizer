/**
 * Tutorial content for #003 — Container With Most Water
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `You are given an array of heights. Imagine vertical lines drawn at each index with the given height. Find two lines that, together with the x-axis, form a container that holds the most water. Return the maximum area of water that can be stored.`,
    example: `heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]\n→ Lines at index 1 (height 8) and index 8 (height 7)\n→ Width = 8-1 = 7, effective height = min(8,7) = 7\n→ Area = 7 × 7 = 49\n✅ Answer: 49`,
    keyInsight: `Area = width × min(left height, right height). Starting with the widest possible container, the only way to find a bigger area is to find taller lines — so move the shorter pointer inward.`,
  },

  approaches: {
    'Brute Force': {
      intuition: `Try every possible pair of lines and compute the area each pair forms. Track the maximum area seen. Two nested loops cover all pairs. Simple but slow because you check n² pairs.`,
      steps: [
        `Initialize maxArea = 0.`,
        `Outer loop i from 0 to n-2 (left line).`,
        `Inner loop j from i+1 to n-1 (right line).`,
        `Compute area = (j - i) * min(heights[i], heights[j]).`,
        `Update maxArea = max(maxArea, area).`,
        `Return maxArea after all pairs are checked.`,
      ],
      example: `heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]\n\ni=0,j=1: (1)*min(1,8)=1\ni=0,j=8: (8)*min(1,7)=8\ni=1,j=8: (7)*min(8,7)=49  ← max so far\n...\n✅ Answer: 49`,
      keyInsight: `O(n²) time, O(1) space. Easy to code but checks many useless pairs — for n=10,000 that's 50 million area calculations.`,
    },

    'Two Pointers': {
      intuition: `Start with the widest possible container — left pointer at index 0, right pointer at the last index. Compute the area. Then move the pointer that points to the shorter line inward (there's no point keeping the short line since it's already limiting the height). Repeat until pointers meet.`,
      steps: [
        `Set left = 0, right = n-1, maxArea = 0.`,
        `While left < right:`,
        `  Compute area = (right - left) * min(heights[left], heights[right]).`,
        `  Update maxArea = max(maxArea, area).`,
        `  If heights[left] <= heights[right]: left++ (move shorter line inward).`,
        `  Else: right-- (move shorter line inward).`,
        `Return maxArea.`,
      ],
      example: `heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]\n\nleft=0(1), right=8(7): area=8*1=8, heights[0]<heights[8]→left++\nleft=1(8), right=8(7): area=7*7=49, heights[8]<heights[1]→right--\nleft=1(8), right=7(3): area=6*3=18, right--\nleft=1(8), right=6(8): area=5*8=40, right--\nleft=1(8), right=5(4): area=4*4=16, right--\n... pointers converge\n✅ Answer: 49`,
      keyInsight: `O(n) time, O(1) space. The key proof: if we move the taller line, the width shrinks AND the height can only stay the same or shrink — so we can never do better. Moving the shorter line is our only hope.`,
    },

    'Two Pointers with Optimization': {
      intuition: `Same two-pointer approach, but add a skip: after moving a pointer, skip over any lines that are shorter than or equal to the line you just left. Those lines can't possibly beat the current max since the width is now smaller and the height isn't improving.`,
      steps: [
        `Set left = 0, right = n-1, maxArea = 0.`,
        `While left < right: compute area and update maxArea.`,
        `If heights[left] <= heights[right]: save leftHeight = heights[left], then left++ while left < right and heights[left] <= leftHeight.`,
        `Else: save rightHeight = heights[right], then right-- while left < right and heights[right] <= rightHeight.`,
        `Return maxArea.`,
      ],
      example: `heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]\n\nleft=0(1),right=8(7): area=8, move left (shorter)\n  Skip heights[1]=8>1 → stop. left=1\nleft=1(8),right=8(7): area=49, move right (shorter)\n  heights[7]=3 ≤ 7 → skip, heights[6]=8 > 7 → stop. right=6\nleft=1(8),right=6(8): area=40, move right (tie, heights equal)\n  heights[5]=4 ≤ 8 → skip, ... right=1 → loop ends\n✅ Answer: 49`,
      keyInsight: `Same O(n) worst case but skips many redundant positions in practice. The inner while-skip jump means fewer iterations on arrays with many short lines in the middle.`,
    },
  },
}
