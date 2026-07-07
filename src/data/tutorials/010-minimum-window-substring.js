/**
 * Tutorial content for #010 — Minimum Window Substring
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given two strings s and t, find the smallest window (contiguous substring) in s that contains all the characters of t (including duplicates). If no such window exists, return an empty string.`,
    example: `s = "ADOBECODEBANC", t = "ABC"\n→ "BANC" contains A, B, C and has length 4\n→ "ADOBEC" also works but is longer\n✅ Answer: "BANC"`,
    keyInsight: `Use a sliding window: expand right to collect characters of t, then shrink from the left as long as the window still contains all of t. Track the minimum valid window found.`,
  },

  approaches: {
    'Brute Force': {
      intuition: `Try every possible substring of s. For each one, check if it contains all characters of t. Track the shortest valid one. Very straightforward but extremely slow because there are O(n²) substrings and each check takes O(n) time.`,
      steps: [
        `Build a frequency map for t.`,
        `Try every pair (i, j) with two nested loops.`,
        `For each substring s[i..j], check if it contains all characters of t with correct frequencies.`,
        `If valid and shorter than current best, update the answer.`,
        `Return the best substring found.`,
      ],
      example: `s = "ADOBECODEBANC", t = "ABC"\n\nCheck "A" → missing B,C ✗\nCheck "AD" → missing B,C ✗\n...\nCheck "ADOBEC" → has A,B,C ✅ len=6\n...\nCheck "BANC" → has A,B,C ✅ len=4 ← better\n...\n✅ Answer: "BANC"`,
      keyInsight: `O(n² × m) time where m = |t|. Completely impractical for long strings. Good only for understanding what "valid window" means before learning the sliding window approach.`,
    },

    'Sliding Window with Frequency Maps': {
      intuition: `Use two frequency maps: one for what t needs (required), one for what the current window has (window). Expand right, adding characters. Once the window satisfies all requirements, try to shrink from the left to find the minimum size, then expand again. The "formed" counter tracks how many distinct characters in t are currently satisfied.`,
      steps: [
        `Build requiredMap (freq of each char in t). Set required = number of unique chars in t.`,
        `Initialize left=0, formed=0, windowMap={}, best=(infinity, 0, 0).`,
        `Expand right from 0 to n-1: add s[right] to windowMap.`,
        `  If windowMap[s[right]] == requiredMap[s[right]]: formed++.`,
        `While formed == required (window is valid): try to update the best answer.`,
        `  Remove s[left] from windowMap.`,
        `  If windowMap[s[left]] < requiredMap[s[left]]: formed-- (window no longer valid).`,
        `  left++.`,
        `Return the best substring (or "" if none found).`,
      ],
      example: `s = "ADOBECODEBANC", t = "ABC"\nrequired = {A:1, B:1, C:1}, need 3 unique chars satisfied\n\nr=0(A): window={A:1}, formed=1\nr=1(D): window={A:1,D:1}\nr=2(O): window+O\nr=3(B): window={...,B:1}, formed=2\nr=4(E): window+E\nr=5(C): window={...,C:1}, formed=3 ✅ valid!\n  best="ADOBEC"(len=6), remove A(left=0)→window{A:0},formed=2,left=1\nr=6..r=9(B): window{B:2}, formed stays 2\nr=9(A): formed=3 ✅ → best="DOBECODEBA"? shrink...\n  remove D,O,B → still valid → shrink to "BANC" len=4 ✅\n✅ Answer: "BANC"`,
      keyInsight: `O(n + m) time, O(m) space. The window expands and shrinks linearly — each character is added and removed at most once. The "formed" counter avoids scanning the whole frequency map each step.`,
    },

    'Optimized with Array': {
      intuition: `Same sliding window logic, but replace the HashMap with a fixed-size integer array of length 128 (covering all ASCII characters). Array lookups are O(1) with better cache locality than a hash map. The validity check uses the same "formed" counter trick — no need to scan the full array each step.`,
      steps: [
        `Build an int[128] need[] from t (increment need[c] for each char c in t). Count distinct needed chars as required.`,
        `Initialize left=0, formed=0, bestLen=Integer.MAX_VALUE, bestLeft=0.`,
        `Expand right from 0 to n-1: decrement need[s[right]]. If need[s[right]] == 0, formed++.`,
        `While formed == required: if (right-left+1) < bestLen, update bestLen and bestLeft.`,
        `  Increment need[s[left]]. If need[s[left]] > 0, formed--. left++.`,
        `Return bestLen == MAX_VALUE ? "" : s.substring(bestLeft, bestLeft+bestLen).`,
      ],
      example: `s = "ADOBECODEBANC", t = "ABC"\nneed['A']=1, need['B']=1, need['C']=1, required=3\n\nr=0(A): need[A]=0, formed=1\nr=3(B): need[B]=0, formed=2\nr=5(C): need[C]=0, formed=3 ✅\n  bestLen=6 (ADOBEC), need[A]++ → need[A]=1>0 → formed=2, left=1\n...(slide until BANC)...\n  bestLen=4 ✅\n✅ Answer: "BANC"`,
      keyInsight: `O(n + m) time, O(1) space (array of fixed size 128). Identical asymptotic complexity to the HashMap version but faster in practice due to array cache performance — the preferred implementation in competitive settings.`,
    },
  },
}
