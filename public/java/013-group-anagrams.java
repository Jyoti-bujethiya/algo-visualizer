/*
 * LeetCode Problem #49: Group Anagrams
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/group-anagrams/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Sorted String as Key | O(m·n·log n) time | O(m·n) space
    // EXPLAIN: Sort each word's characters to get a canonical key; group words by that key.
    // WHEN: Simple and readable; fine when word length n is small.
    public List<List<String>> groupAnagrams_SortKey(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }

    // APPROACH 2: Character Count as Key | O(m·n) time | O(m·n) space
    // EXPLAIN: Build a 26-length frequency count string as the key instead of sorting.
    // WHEN: Faster when words are long — avoids the O(n log n) sort inside each word.
    public List<List<String>> groupAnagrams_CharCount(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            int[] count = new int[26];
            for (char c : s.toCharArray()) {
                count[c - 'a']++;
            }
            StringBuilder sb = new StringBuilder();
            for (int freq : count) {
                sb.append(freq).append('#');
            }
            String key = sb.toString();
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }

    // APPROACH 3: Prime Number Product | O(m·n) time | O(m·n) space
    // EXPLAIN: Assign each letter a unique prime; multiply primes for all characters — anagrams yield the same product.
    // WHEN: Interesting interview talking point but not recommended — can overflow for long strings.
    public List<List<String>> groupAnagrams_Prime(String[] strs) {
        int[] primes = {2,  3,  5,  7, 11, 13, 17, 19, 23, 29,
                        31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
                        73, 79, 83, 89, 97, 101};
        Map<Long, List<String>> map = new HashMap<>();
        for (String s : strs) {
            long key = 1;
            for (char c : s.toCharArray()) {
                key *= primes[c - 'a'];
            }
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }
}

// Made with Bob
