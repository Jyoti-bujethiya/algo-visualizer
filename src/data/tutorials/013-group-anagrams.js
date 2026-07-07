/**
 * Tutorial content for #013 — Group Anagrams
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an array of strings, group the strings that are anagrams of each other (same letters, different order) into sublists. Return all the groups.`,
    example: `["eat","tea","tan","ate","nat","bat"]\n→ "eat","tea","ate" are all anagrams\n→ "tan","nat" are anagrams\n→ "bat" is alone\n✅ Answer: [["bat"],["nat","tan"],["ate","eat","tea"]]`,
    keyInsight: `Two strings are anagrams if and only if they have the same sorted characters — or equivalently, the same character frequency counts. Use that fact as the grouping key in a hash map.`,
  },

  approaches: {
    'Sorted String as Key': {
      intuition: `Sort each word alphabetically. Anagrams will produce the same sorted string. Use that sorted string as a key in a hash map to group words together. Simple and clean — the sorted string uniquely identifies the anagram group.`,
      steps: [
        `Create a HashMap<String, List<String>>.`,
        `For each word in the input:`,
        `  Sort the characters of the word to create a key (e.g., "eat" → "aet").`,
        `  Add the original word to the list at map[key].`,
        `Return all the values of the map as a list of lists.`,
      ],
      example: `words = ["eat","tea","tan","ate","nat","bat"]\n\n"eat" → sorted "aet" → map{"aet":["eat"]}\n"tea" → sorted "aet" → map{"aet":["eat","tea"]}\n"tan" → sorted "ant" → map{"aet":[...],"ant":["tan"]}\n"ate" → sorted "aet" → map{"aet":["eat","tea","ate"]}\n"nat" → sorted "ant" → map{...,"ant":["tan","nat"]}\n"bat" → sorted "abt" → map{...,"abt":["bat"]}\n✅ Answer: [["eat","tea","ate"],["tan","nat"],["bat"]]`,
      keyInsight: `O(n × k log k) time where k is max word length (sorting each word costs k log k), O(n × k) space. This is the most readable solution and the standard interview answer.`,
    },

    'Character Count as Key': {
      intuition: `Instead of sorting, count how many times each letter appears in the word. Represent that count as a string like "1#0#1#..." (one value per letter). Anagrams will produce identical count strings. This avoids the sort step, reducing time per word from O(k log k) to O(k).`,
      steps: [
        `Create a HashMap<String, List<String>>.`,
        `For each word: create an int[26] count array (one slot per letter a-z).`,
        `Increment count[c - 'a'] for each character c in the word.`,
        `Build a key string from the counts, e.g., "1#0#1#0...".`,
        `Add the word to map[key].`,
        `Return all values of the map.`,
      ],
      example: `"eat": e=1,a=1,t=1 → key="1#0#0#0#1#0#0#0#0#0#0#0#0#0#0#0#0#0#0#1#0#0#0#0#0#0"\n"tea": t=1,e=1,a=1 → same key ✅ → grouped together\n"bat": b=1,a=1,t=1 → different key\n✅ All anagram groups correctly identified`,
      keyInsight: `O(n × k) time, O(n × k) space. Faster per word than sorted-key when k is large. The separator '#' in the key string is crucial — without it "10" could be ambiguous (one 'a' and zero 'b', or zero 'a' and ten 'b').`,
    },

    'Prime Number Product': {
      intuition: `Assign a distinct prime number to each letter (a=2, b=3, c=5, ...). The "key" for a word is the product of its letter-primes. By the fundamental theorem of arithmetic, two words have the same product if and only if they have the same multiset of letters — i.e., they are anagrams.`,
      steps: [
        `Assign primes: a→2, b→3, c→5, d→7, e→11, ..., z→101.`,
        `For each word: compute product = multiply all its letter-primes together.`,
        `Use that product as the hash map key.`,
        `Add the word to the group at map[product].`,
        `Return all groups.`,
      ],
      example: `primes: a=2, b=3, e=11, t=97 (approximate)\n\n"eat" → 11×2×97 = 2134\n"tea" → 97×11×2 = 2134 ✅ same key\n"ate" → 2×97×11 = 2134 ✅ same key\n"bat" → 3×2×97 = 582 → different group\n✅ All anagram groups correctly identified`,
      keyInsight: `O(n × k) time. Mathematically elegant — primes guarantee no hash collisions for anagram grouping. Caveat: for long words the product can overflow even a long/BigInteger. Not practical for production but a fun mathematical trick.`,
    },
  },
}
