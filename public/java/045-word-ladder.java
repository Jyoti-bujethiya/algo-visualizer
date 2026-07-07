/*
 * LeetCode Problem #127: Word Ladder
 * Difficulty: Hard
 * Link: https://leetcode.com/problems/word-ladder/
 */
import java.util.*;

public class Solution {

    // APPROACH 1: BFS with Transformation | O(M²*N) time | O(N) space
    // EXPLAIN: For each word in the queue try all single-letter substitutions; if the result is in the word set (and unvisited), enqueue it.
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> wordSet = new HashSet<>(wordList);
        if (!wordSet.contains(endWord)) return 0;
        Queue<String> q = new LinkedList<>();
        Set<String> visited = new HashSet<>();
        q.offer(beginWord);
        visited.add(beginWord);
        int level = 1;
        while (!q.isEmpty()) {
            int size = q.size();
            level++;
            for (int s = 0; s < size; s++) {
                char[] arr = q.poll().toCharArray();
                for (int i = 0; i < arr.length; i++) {
                    char orig = arr[i];
                    for (char c = 'a'; c <= 'z'; c++) {
                        if (c == orig) continue;
                        arr[i] = c;
                        String next = new String(arr);
                        if (next.equals(endWord)) return level;
                        if (wordSet.contains(next) && !visited.contains(next)) {
                            visited.add(next); q.offer(next);
                        }
                        arr[i] = orig;
                    }
                }
            }
        }
        return 0;
    }

    // APPROACH 2: Bidirectional BFS | O(M²*N) time | O(N) space
    // EXPLAIN: Expand simultaneously from begin and end; when frontiers intersect the path length is found.
    public int ladderLengthBidir(String beginWord, String endWord, List<String> wordList) {
        Set<String> wordSet = new HashSet<>(wordList);
        if (!wordSet.contains(endWord)) return 0;
        Set<String> beginSet = new HashSet<>(), endSet = new HashSet<>();
        beginSet.add(beginWord); endSet.add(endWord);
        int level = 1;
        while (!beginSet.isEmpty() && !endSet.isEmpty()) {
            if (beginSet.size() > endSet.size()) { Set<String> tmp = beginSet; beginSet = endSet; endSet = tmp; }
            Set<String> nextSet = new HashSet<>();
            for (String word : beginSet) {
                char[] arr = word.toCharArray();
                for (int i = 0; i < arr.length; i++) {
                    char orig = arr[i];
                    for (char c = 'a'; c <= 'z'; c++) {
                        arr[i] = c;
                        String next = new String(arr);
                        if (endSet.contains(next)) return level + 1;
                        if (wordSet.contains(next)) { nextSet.add(next); wordSet.remove(next); }
                        arr[i] = orig;
                    }
                }
            }
            beginSet = nextSet; level++;
        }
        return 0;
    }

    // APPROACH 3: BFS with Pattern Matching | O(M²*N) time | O(M²*N) space
    // EXPLAIN: Pre-build pattern→words adjacency map; BFS uses wildcard patterns to find neighbours.
    public int ladderLengthPattern(String beginWord, String endWord, List<String> wordList) {
        if (!new HashSet<>(wordList).contains(endWord)) return 0;
        List<String> all = new ArrayList<>(wordList);
        if (!all.contains(beginWord)) all.add(beginWord);
        Map<String, List<String>> patMap = new HashMap<>();
        for (String word : all)
            for (int i = 0; i < word.length(); i++) {
                String pat = word.substring(0,i) + "*" + word.substring(i+1);
                patMap.computeIfAbsent(pat, k -> new ArrayList<>()).add(word);
            }
        Queue<String> q = new LinkedList<>();
        Set<String> visited = new HashSet<>();
        q.offer(beginWord); visited.add(beginWord);
        int level = 1;
        while (!q.isEmpty()) {
            int sz = q.size(); level++;
            for (int s = 0; s < sz; s++) {
                String word = q.poll();
                for (int i = 0; i < word.length(); i++) {
                    String pat = word.substring(0,i) + "*" + word.substring(i+1);
                    for (String nb : patMap.getOrDefault(pat, Collections.emptyList())) {
                        if (nb.equals(endWord)) return level;
                        if (!visited.contains(nb)) { visited.add(nb); q.offer(nb); }
                    }
                }
            }
        }
        return 0;
    }

    // APPROACH 4: Optimised BFS (Remove from Set) | O(M²*N) time | O(N) space
    // EXPLAIN: Remove words from the set when enqueued, acting as a combined dictionary and visited tracker.
    public int ladderLengthOptimised(String beginWord, String endWord, List<String> wordList) {
        Set<String> wordSet = new HashSet<>(wordList);
        if (!wordSet.contains(endWord)) return 0;
        Queue<String> q = new LinkedList<>();
        q.offer(beginWord);
        int level = 1;
        while (!q.isEmpty()) {
            int sz = q.size(); level++;
            for (int s = 0; s < sz; s++) {
                char[] arr = q.poll().toCharArray();
                for (int i = 0; i < arr.length; i++) {
                    char orig = arr[i];
                    for (char c = 'a'; c <= 'z'; c++) {
                        if (c == orig) continue;
                        arr[i] = c;
                        String next = new String(arr);
                        if (next.equals(endWord)) return level;
                        if (wordSet.remove(next)) q.offer(next);
                        arr[i] = orig;
                    }
                }
            }
        }
        return 0;
    }
}

// Made with Bob
