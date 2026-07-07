/*
 * LeetCode Problem #76: Minimum Window Substring
 * Difficulty: Hard
 * Link: https://leetcode.com/problems/minimum-window-substring/
 */
import java.util.*;

class Solution {

    // APPROACH 1: Brute Force | O(n²·m) time | O(m) space
    // EXPLAIN: Check every substring of s and test whether it contains all characters of t.
    // WHEN: Demonstration only — far too slow for large inputs.
    public String minWindow_BruteForce(String s, String t) {
        if (s.isEmpty() || t.isEmpty()) return "";
        int[] need = new int[128];
        for (char c : t.toCharArray()) need[c]++;

        int minLen = Integer.MAX_VALUE;
        int minStart = 0;

        for (int i = 0; i < s.length(); i++) {
            int[] window = new int[128];
            for (int j = i; j < s.length(); j++) {
                window[s.charAt(j)]++;
                if (containsAll(window, need)) {
                    if (j - i + 1 < minLen) {
                        minLen = j - i + 1;
                        minStart = i;
                    }
                    break;
                }
            }
        }
        return minLen == Integer.MAX_VALUE ? "" : s.substring(minStart, minStart + minLen);
    }

    private boolean containsAll(int[] window, int[] need) {
        for (int i = 0; i < 128; i++) {
            if (window[i] < need[i]) return false;
        }
        return true;
    }

    // APPROACH 2: Sliding Window with Frequency Maps | O(n + m) time | O(m) space
    // EXPLAIN: Expand right to include required chars; shrink left once the window is valid to minimise size.
    // WHEN: Standard optimal approach for all minimum-window / substring coverage problems.
    public String minWindow_SlidingWindow(String s, String t) {
        if (s.isEmpty() || t.isEmpty()) return "";

        Map<Character, Integer> need = new HashMap<>();
        for (char c : t.toCharArray()) {
            need.merge(c, 1, Integer::sum);
        }

        int required = need.size();
        int formed = 0;
        Map<Character, Integer> window = new HashMap<>();

        int left = 0, minLen = Integer.MAX_VALUE, minLeft = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            window.merge(c, 1, Integer::sum);

            if (need.containsKey(c) && window.get(c).intValue() == need.get(c).intValue()) {
                formed++;
            }

            while (formed == required) {
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    minLeft = left;
                }
                char leftChar = s.charAt(left);
                window.merge(leftChar, -1, Integer::sum);
                if (need.containsKey(leftChar) && window.get(leftChar) < need.get(leftChar)) {
                    formed--;
                }
                left++;
            }
        }
        return minLen == Integer.MAX_VALUE ? "" : s.substring(minLeft, minLeft + minLen);
    }

    // APPROACH 3: Optimized with Array | O(n + m) time | O(1) space
    // EXPLAIN: Same sliding window logic but uses int arrays instead of HashMaps for speed.
    // WHEN: When input is guaranteed ASCII — array lookups are faster than map operations.
    public String minWindow_ArrayFreq(String s, String t) {
        int[] need = new int[128];
        int[] window = new int[128];
        for (char c : t.toCharArray()) need[c]++;

        int required = 0;
        for (int f : need) if (f > 0) required++;

        int formed = 0, left = 0, minLen = Integer.MAX_VALUE, minLeft = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            window[c]++;
            if (need[c] > 0 && window[c] == need[c]) formed++;

            while (formed == required) {
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    minLeft = left;
                }
                char lc = s.charAt(left);
                if (need[lc] > 0 && window[lc] == need[lc]) formed--;
                window[lc]--;
                left++;
            }
        }
        return minLen == Integer.MAX_VALUE ? "" : s.substring(minLeft, minLeft + minLen);
    }
}

// Made with Bob
