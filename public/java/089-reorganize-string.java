/*
 * LeetCode Problem #767: Reorganize String
 * Link: https://leetcode.com/problems/reorganize-string/
 * Difficulty: Medium
 */
import java.util.*;

class Solution {

    // APPROACH 1: Max Heap Greedy (Pair Pop) | O(n log 26) time | O(1) space
    // EXPLAIN: Each step pop the two most frequent chars, append both, re-push with decremented counts.
    public String reorganizeString1(String s) {
        int[] freq = new int[26];
        for (char c : s.toCharArray()) freq[c - 'a']++;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> b[0] - a[0]);
        for (int i = 0; i < 26; i++) if (freq[i] > 0) pq.offer(new int[]{freq[i], i});
        StringBuilder res = new StringBuilder();
        while (pq.size() >= 2) {
            int[] a = pq.poll(), b = pq.poll();
            res.append((char)('a' + a[1]));
            res.append((char)('a' + b[1]));
            if (a[0] - 1 > 0) pq.offer(new int[]{a[0] - 1, a[1]});
            if (b[0] - 1 > 0) pq.offer(new int[]{b[0] - 1, b[1]});
        }
        if (!pq.isEmpty()) {
            int[] last = pq.poll();
            if (last[0] > 1) return "";
            res.append((char)('a' + last[1]));
        }
        return res.toString();
    }

    // APPROACH 2: Interleave Even/Odd Indices | O(n log n) time | O(n) space
    // EXPLAIN: Sort chars by frequency descending; fill even indices first, then odd indices.
    public String reorganizeString2(String s) {
        int n = s.length();
        int[] freq = new int[26];
        for (char c : s.toCharArray()) freq[c - 'a']++;
        int maxFreq = 0;
        for (int f : freq) maxFreq = Math.max(maxFreq, f);
        if (maxFreq > (n + 1) / 2) return "";
        Integer[] indices = new Integer[26];
        for (int i = 0; i < 26; i++) indices[i] = i;
        Arrays.sort(indices, (a, b) -> freq[b] - freq[a]);
        char[] res = new char[n];
        int idx = 0;
        for (int i : indices) {
            for (int j = 0; j < freq[i]; j++) {
                if (idx >= n) idx = 1;
                res[idx] = (char)('a' + i);
                idx += 2;
            }
        }
        return new String(res);
    }

    // APPROACH 3: Greedy with Previous Tracking | O(n log 26) time | O(1) space
    // EXPLAIN: Always place the highest-frequency char; if it matches the last placed, use the second-highest.
    public String reorganizeString3(String s) {
        int[] freq = new int[26];
        for (char c : s.toCharArray()) freq[c - 'a']++;
        int maxFreq = 0;
        for (int f : freq) maxFreq = Math.max(maxFreq, f);
        if (maxFreq > (s.length() + 1) / 2) return "";
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> b[0] - a[0]);
        for (int i = 0; i < 26; i++) if (freq[i] > 0) pq.offer(new int[]{freq[i], i});
        StringBuilder res = new StringBuilder();
        int prevChar = -1;
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            if (top[1] == prevChar && !pq.isEmpty()) {
                int[] second = pq.poll();
                res.append((char)('a' + second[1]));
                if (second[0] - 1 > 0) pq.offer(new int[]{second[0] - 1, second[1]});
                pq.offer(top);
                prevChar = second[1];
            } else {
                res.append((char)('a' + top[1]));
                if (top[0] - 1 > 0) pq.offer(new int[]{top[0] - 1, top[1]});
                prevChar = top[1];
            }
        }
        return res.length() == s.length() ? res.toString() : "";
    }

    // APPROACH 4: Counting + Direct Placement | O(n) time | O(n) space
    // EXPLAIN: Place the most frequent char at all even slots first, then fill remaining slots sequentially.
    public String reorganizeString4(String s) {
        int n = s.length();
        int[] freq = new int[26];
        for (char c : s.toCharArray()) freq[c - 'a']++;
        int maxChar = 0;
        for (int i = 1; i < 26; i++) if (freq[i] > freq[maxChar]) maxChar = i;
        if (freq[maxChar] > (n + 1) / 2) return "";
        char[] res = new char[n];
        int idx = 0;
        while (freq[maxChar] > 0) { res[idx] = (char)('a' + maxChar); idx += 2; freq[maxChar]--; }
        for (int i = 0; i < 26; i++) {
            while (freq[i] > 0) {
                if (idx >= n) idx = 1;
                res[idx] = (char)('a' + i); idx += 2; freq[i]--;
            }
        }
        return new String(res);
    }
}

// Made with Bob
