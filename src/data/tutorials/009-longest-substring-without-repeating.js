/**
 * Tutorial content for #009 — Longest Substring Without Repeating Characters
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a string, find the length of the longest substring (a contiguous sequence of characters) that contains no repeating characters.`,
    example: `s = "abcabcbb"\n→ "abc" has length 3 and no repeats\n→ "abca" has a repeat ('a')\n✅ Answer: 3`,
    keyInsight: `Use a sliding window: expand the right side, and whenever you hit a duplicate, shrink from the left until the duplicate is gone. The window always contains a valid (no-repeat) substring.`,
  },

  approaches: {
    'Brute Force': {
      intuition: `Try every possible starting index. For each start, extend the substring one character at a time until you hit a repeat. Track the maximum length seen. Simple but re-scans many characters needlessly.`,
      steps: [
        `Initialize maxLen = 0.`,
        `Outer loop i from 0 to n-1 (start of substring).`,
        `Create an empty set of seen characters.`,
        `Inner loop j from i to n-1: if s[j] is in the set, break. Otherwise add s[j] to set.`,
        `Update maxLen = max(maxLen, j - i) (or j - i + 1 if you don't break).`,
        `Return maxLen.`,
      ],
      example: `s = "abcabcbb"\n\ni=0: a,b,c → hit 'a' at j=3 → len=3\ni=1: b,c,a → hit 'b' at j=4 → len=3\ni=2: c,a,b → hit 'c' at j=5 → len=3\n...\n✅ Answer: 3`,
      keyInsight: `O(n²) time, O(min(n, m)) space where m is the character set size. Each starting position may scan O(n) chars. Works for small strings but slow for large inputs.`,
    },

    'Sliding Window with Set': {
      intuition: `Maintain a window [left, right] and a set of characters in the window. Expand right by adding s[right] to the set. If s[right] is already in the set, shrink left (remove s[left] from the set, move left forward) until the duplicate is gone. Always track the window size.`,
      steps: [
        `Initialize a HashSet, left=0, maxLen=0.`,
        `Loop right from 0 to n-1.`,
        `While s[right] is in the set: remove s[left] from set, left++.`,
        `Add s[right] to the set.`,
        `Update maxLen = max(maxLen, right - left + 1).`,
        `Return maxLen.`,
      ],
      example: `s = "abcabcbb"\n\nright=0('a'): set={a}, window="a", len=1\nright=1('b'): set={a,b}, len=2\nright=2('c'): set={a,b,c}, len=3\nright=3('a'): 'a' in set → remove 'a',left=1 → add 'a', set={b,c,a}, len=3\nright=4('b'): 'b' in set → remove 'b',left=2 → add 'b', set={c,a,b}, len=3\nright=5('c'): 'c' in set → remove 'c',left=3 → add 'c', len=3\nright=6('b'): 'b' in set → remove 'a',left=4; 'b' in set → remove 'b',left=5 → add 'b', len=2\nright=7('b'): 'b' in set → remove 'c',left=6; 'b' in set → remove 'b',left=7 → add 'b', len=1\n✅ Answer: 3`,
      keyInsight: `O(n) amortized time (each character added/removed once), O(min(n,m)) space. The sliding window avoids restarting from scratch — it only moves forward.`,
    },

    'Sliding Window with HashMap': {
      intuition: `Instead of a set, store the last-seen index of each character in a hash map. When you encounter a character already in the map, you can jump the left pointer directly to (lastSeenIndex + 1) — no need to remove characters one by one from the left.`,
      steps: [
        `Initialize a HashMap<Character, Integer>, left=0, maxLen=0.`,
        `Loop right from 0 to n-1.`,
        `If s[right] is in the map AND map.get(s[right]) >= left:`,
        `  Jump: left = map.get(s[right]) + 1.`,
        `Update map: put s[right] → right.`,
        `Update maxLen = max(maxLen, right - left + 1).`,
        `Return maxLen.`,
      ],
      example: `s = "abcabcbb"\n\nr=0('a'): map={a:0}, left=0, len=1\nr=1('b'): map={a:0,b:1}, len=2\nr=2('c'): map={a:0,b:1,c:2}, len=3\nr=3('a'): 'a' in map at 0 ≥ left(0) → left=1. map={a:3,b:1,c:2}, len=3\nr=4('b'): 'b' in map at 1 ≥ left(1) → left=2. map={...,b:4}, len=3\nr=5('c'): 'c' in map at 2 ≥ left(2) → left=3. map={...,c:5}, len=3\nr=6('b'): 'b' in map at 4 ≥ left(3) → left=5. len=2\nr=7('b'): 'b' in map at 6 ≥ left(5) → left=7. len=1\n✅ Answer: 3`,
      keyInsight: `O(n) time, O(min(n,m)) space. The key improvement over the set approach: left pointer jumps directly to the correct position instead of shuffling one step at a time.`,
    },

    'Array Instead of HashMap': {
      intuition: `If the character set is fixed (e.g., ASCII), replace the hash map with a plain integer array indexed by character code. Array lookups are faster and use less overhead than hash maps. Same sliding window logic, just swapping the data structure.`,
      steps: [
        `Initialize int[] charIndex = new int[128] (or 256 for extended ASCII), fill with -1.`,
        `Set left=0, maxLen=0.`,
        `Loop right from 0 to n-1.`,
        `If charIndex[s[right]] >= left: left = charIndex[s[right]] + 1 (jump left pointer).`,
        `charIndex[s[right]] = right (record latest position).`,
        `maxLen = max(maxLen, right - left + 1).`,
        `Return maxLen.`,
      ],
      example: `s = "abcabcbb"\n\nr=0('a'=97): charIndex[97]=-1<left=0 → no jump. charIndex[97]=0, len=1\nr=1('b'): charIndex[98]=-1 → no jump. charIndex[98]=1, len=2\nr=2('c'): charIndex[99]=-1 → no jump. charIndex[99]=2, len=3\nr=3('a'): charIndex[97]=0 ≥ left=0 → left=1. charIndex[97]=3, len=3\nr=4('b'): charIndex[98]=1 ≥ left=1 → left=2. charIndex[98]=4, len=3\n...\n✅ Answer: 3`,
      keyInsight: `O(n) time, O(1) space (fixed-size array). Practically faster than HashMap due to no hashing overhead. The go-to approach when the character universe is bounded and known.`,
    },
  },
}
