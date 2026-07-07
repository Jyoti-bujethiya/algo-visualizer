/**
 * Tutorial content for #089 — Reorganize String
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a string s, rearrange the characters so that no two adjacent characters are the same. Return any valid rearrangement. If it is impossible (because one character appears more than ⌈n/2⌉ times), return an empty string.`,
    example: `s = "aab"\n→ Frequencies: a→2, b→1\n→ Place most frequent first: a_a, fill gap with b: aba\n✅ Answer: "aba"\n\ns = "aaab" → a appears 3 times, n=4, ⌈4/2⌉=2 → impossible\n✅ Answer: ""`,
    keyInsight: `The character with the highest frequency is the one most likely to cause adjacent duplicates. Always place the most frequent remaining character next — if it was just used, use the second most frequent. A max-heap implements this greedy choice perfectly.`,
  },

  approaches: {
    'Max Heap Greedy (Pair Pop)': {
      intuition: `Push all (frequency, char) pairs into a max-heap. At each step, pop the TWO most frequent characters. Place both into the result (the most frequent at position i, the second most at i+1). Push them back with decremented frequencies if they still have remaining count.\n\nThis guarantees no two same characters end up adjacent.`,
      steps: [
        `Count character frequencies; push (freq, char) into max-heap.`,
        `While heap has ≥ 2 elements:`,
        `  Pop (f1,c1) and (f2,c2).`,
        `  Append c1 then c2 to result.`,
        `  If f1-1 > 0: push (f1-1, c1) back.`,
        `  If f2-1 > 0: push (f2-1, c2) back.`,
        `If 1 element remains: if freq == 1 append it; else return "" (impossible).`,
        `Return result.`,
      ],
      example: `s="aab". freqs: a→2, b→1. heap:[(2,a),(1,b)]\n\nPop (2,a),(1,b). result="ab". push (1,a).\nheap:[(1,a)]\nOne element left, freq=1 → append 'a'. result="aba" ✅\n\ns="aaab". heap:[(3,a),(1,b)]\nPop (3,a),(1,b). result="ab". push (2,a).\nhash:[(2,a)]\nOne element, freq=2>1 → return "" ✅`,
      keyInsight: `O(n log 26) = O(n) time (heap has ≤ 26 entries). O(n) space for the result. Greedy by always using the two most frequent guarantees no adjacency issues.`,
    },

    'Interleave Even/Odd Indices': {
      intuition: `Sort characters by frequency descending. Fill all even indices (0, 2, 4, ...) first with the most frequent characters, then fill odd indices. This naturally separates any character placed at even indices from itself (it will be at positions 0, 2, 4, ... — never adjacent). If the most frequent char has frequency > ⌈n/2⌉, return "".`,
      steps: [
        `Count frequencies; sort characters by frequency descending.`,
        `If maxFreq > (n+1)/2: return "".`,
        `Create result array of size n.`,
        `Fill even indices (0,2,4,...) then odd indices (1,3,5,...), in order of decreasing frequency.`,
        `Return the result joined as a string.`,
      ],
      example: `s="aab". n=3. freqs: a→2,b→1. sorted chars: "aab"\nmaxFreq=2 ≤ (3+1)/2=2 ✓\n\nresult = [_,_,_]\nFill evens: idx0→a, idx2→a → [a,_,a]\nFill odds:  idx1→b          → [a,b,a]\nReturn "aba" ✅`,
      keyInsight: `O(n log n) time (sort step). O(n) space. The "fill evens first" trick is elegant and easy to remember: same characters get placed at 0, 2, 4 — never next to each other.`,
    },

    'Greedy with Previous Tracking': {
      intuition: `Use a max-heap. At each step, pop the most frequent character. If it equals the character just placed (prev), pop the NEXT most frequent instead, place it, then push the prev back. This ensures you never place the same character twice in a row.`,
      steps: [
        `Count frequencies, build max-heap.`,
        `prev = null, prevFreq = 0.`,
        `While heap not empty:`,
        `  If prev is not null: push (prevFreq, prev) back onto heap.`,
        `  Wait — instead: before each step, re-add prev to heap if it has remaining count.`,
        `  Pop most frequent (f, c). Append c to result.`,
        `  prev = c, prevFreq = f - 1.`,
        `After loop: if prevFreq > 0 return ""; else return result.`,
      ],
      example: `s="aab". heap:[(2,a),(1,b)]\n\nStep 1: pop (2,a). result="a". prev=a,prevFreq=1.\nStep 2: push prev (1,a). heap:[(1,a),(1,b)]. pop (1,a or b).\n  but a==prev? pop (1,b). result="ab". prev=b,prevFreq=0.\nStep 3: prev freq=0, don't push. pop (1,a). result="aba". prev=a,prevFreq=0.\nDone. prevFreq=0 → return "aba" ✅`,
      keyInsight: `O(n log 26) = O(n) time. The "hold the previous character out" pattern is very common in greedy heap scheduling problems — it prevents the greedy choice from accidentally re-using the last character.`,
    },

    'Counting + Direct Placement': {
      intuition: `Count frequencies. Find the character with the highest frequency. If it exceeds ⌈n/2⌉, return "". Otherwise, place all characters directly: fill even positions with the most frequent character first, then continue filling even then odd positions with remaining characters in any order.`,
      steps: [
        `Count frequencies for all 26 letters.`,
        `Find maxChar (the most frequent) and maxFreq.`,
        `If maxFreq > (n+1)/2: return "".`,
        `Allocate result[n].`,
        `Start index at 0 (even positions first).`,
        `For each character (start with maxChar):`,
        `  Place all its occurrences at current index, stepping by 2.`,
        `  When index goes past n, reset to 1 (start odd positions).`,
        `Return result as string.`,
      ],
      example: `s="vvvlo". n=5. freqs: v→3,l→1,o→1.\nmaxFreq=3, ⌈5/2⌉=3. ok.\n\nPlace v at 0,2,4: [v,_,v,_,v]\nPlace l at 1 (first odd): [v,l,v,_,v]\nPlace o at 3: [v,l,v,o,v]\nReturn "vlvov" ✅`,
      keyInsight: `O(n) time, O(n) space. No heap needed — direct array placement. The fastest implementation in practice, though the heap approaches are more general and easier to adapt to variants.`,
    },
  },
}
