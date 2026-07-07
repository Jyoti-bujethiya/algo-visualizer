# LeetCode Problem #127: Word Ladder
# Difficulty: Hard
# Link: https://leetcode.com/problems/word-ladder/

from typing import List
from collections import deque, defaultdict


# ─────────────────────────────────────────────
# APPROACH 1: BFS with Word Transformation | O(M²*N) time | O(N) space
# EXPLAIN: For each word in the queue try all single-letter substitutions; if the result is in the word set (and unvisited), enqueue it.
# WHEN: Standard BFS shortest-path approach; most readable first solution.

def ladderLength_bfs(beginWord: str, endWord: str, wordList: List[str]) -> int:
    word_set = set(wordList)
    if endWord not in word_set:
        return 0
    q = deque([(beginWord, 1)])
    visited = {beginWord}
    while q:
        word, level = q.popleft()
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                new_word = word[:i] + c + word[i+1:]
                if new_word == endWord:
                    return level + 1
                if new_word in word_set and new_word not in visited:
                    visited.add(new_word)
                    q.append((new_word, level + 1))
    return 0


# ─────────────────────────────────────────────
# APPROACH 2: Bidirectional BFS | O(M²*N) time | O(N) space
# EXPLAIN: Search simultaneously from both ends; when the two frontiers intersect the answer is found — typically much faster in practice.
# WHEN: Large search spaces; can be exponentially faster than one-directional BFS.

def ladderLength_bidir(beginWord: str, endWord: str, wordList: List[str]) -> int:
    word_set = set(wordList)
    if endWord not in word_set:
        return 0
    begin_set, end_set = {beginWord}, {endWord}
    level = 1
    while begin_set and end_set:
        if len(begin_set) > len(end_set):
            begin_set, end_set = end_set, begin_set
        next_set = set()
        for word in begin_set:
            for i in range(len(word)):
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    new_word = word[:i] + c + word[i+1:]
                    if new_word in end_set:
                        return level + 1
                    if new_word in word_set:
                        next_set.add(new_word)
                        word_set.discard(new_word)
        begin_set = next_set
        level += 1
    return 0


# ─────────────────────────────────────────────
# APPROACH 3: BFS with Pattern Matching | O(M²*N) time | O(M²*N) space
# EXPLAIN: Pre-build an adjacency map from wildcard patterns (e.g. "h*t") to all matching words; BFS uses this map to find neighbours.
# WHEN: Useful when the word length is large; avoids re-scanning the alphabet for each position.

def ladderLength_pattern(beginWord: str, endWord: str, wordList: List[str]) -> int:
    if endWord not in set(wordList):
        return 0
    if beginWord not in wordList:
        wordList.append(beginWord)
    pattern_map = defaultdict(list)
    for word in wordList:
        for i in range(len(word)):
            pattern = word[:i] + '*' + word[i+1:]
            pattern_map[pattern].append(word)
    q = deque([(beginWord, 1)])
    visited = {beginWord}
    while q:
        word, level = q.popleft()
        for i in range(len(word)):
            pattern = word[:i] + '*' + word[i+1:]
            for nb in pattern_map[pattern]:
                if nb == endWord:
                    return level + 1
                if nb not in visited:
                    visited.add(nb)
                    q.append((nb, level + 1))
    return 0


# ─────────────────────────────────────────────
# APPROACH 4: Optimised BFS (Remove from Set) | O(M²*N) time | O(N) space
# EXPLAIN: Use the word set as a visited tracker by erasing words after they are added to the queue, avoiding a separate visited set.
# WHEN: Slightly lower memory overhead; clean code.

def ladderLength_optimised(beginWord: str, endWord: str, wordList: List[str]) -> int:
    word_set = set(wordList)
    if endWord not in word_set:
        return 0
    q = deque([beginWord])
    level = 1
    while q:
        level += 1
        for _ in range(len(q)):
            word = q.popleft()
            for i in range(len(word)):
                orig = word[i]
                for c in 'abcdefghijklmnopqrstuvwxyz':
                    if c == orig:
                        continue
                    new_word = word[:i] + c + word[i+1:]
                    if new_word == endWord:
                        return level
                    if new_word in word_set:
                        word_set.discard(new_word)
                        q.append(new_word)
    return 0


# Made with Bob
