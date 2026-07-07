/*
 * LeetCode Problem #3: Longest Substring Without Repeating Characters
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/longest-substring-without-repeating-characters/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Brute Force | O(n³) time | O(k) space
    // EXPLAIN: Check every substring and verify it has all unique characters using a set.
    // WHEN: Only for tiny strings; demonstrates the naive O(n³) baseline.
    public int lengthOfLongestSubstring_BruteForce(String s) {
        int maxLen = 0;
        int n = s.length();
        for (int i = 0; i < n; i++) {
            Set<Character> seen = new HashSet<>();
            for (int j = i; j < n; j++) {
                char c = s.charAt(j);
                if (seen.contains(c)) break;
                seen.add(c);
                maxLen = Math.max(maxLen, j - i + 1);
            }
        }
        return maxLen;
    }

    // APPROACH 2: Sliding Window with Set | O(n) time | O(k) space
    // EXPLAIN: Maintain a set of window characters; shrink from the left when a duplicate is encountered.
    // WHEN: Easy to explain and implement; good introduction to the sliding window pattern.
    public int lengthOfLongestSubstring_Set(String s) {
        Set<Character> window = new HashSet<>();
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            while (window.contains(c)) {
                window.remove(s.charAt(left));
                left++;
            }
            window.add(c);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }

    // APPROACH 3: Sliding Window with HashMap | O(n) time | O(k) space
    // EXPLAIN: Maintain a window [left, right]; on duplicate, jump left past the previous occurrence.
    // WHEN: Optimal — single pass, handles all character sets via a map from char to last index.
    public int lengthOfLongestSubstring_SlidingWindow(String s) {
        Map<Character, Integer> lastIndex = new HashMap<>();
        int maxLen = 0;
        int left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (lastIndex.containsKey(c) && lastIndex.get(c) >= left) {
                left = lastIndex.get(c) + 1;
            }
            lastIndex.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }

    // APPROACH 4: Array Instead of HashMap | O(n) time | O(1) space
    // EXPLAIN: Use a 128-element int array indexed by ASCII value instead of a HashMap.
    // WHEN: When input is guaranteed ASCII — array access is faster than hash map operations.
    public int lengthOfLongestSubstring_Array(String s) {
        int[] charIndex = new int[128];
        Arrays.fill(charIndex, -1);
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            int code = s.charAt(right);
            if (charIndex[code] >= left) {
                left = charIndex[code] + 1;
            }
            charIndex[code] = right;
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}

// Made with Bob
