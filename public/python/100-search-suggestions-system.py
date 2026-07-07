# LeetCode Problem #1268: Search Suggestions System
# Difficulty: Medium
# Link: https://leetcode.com/problems/search-suggestions-system/

from typing import List
import bisect

# ─────────────────────────────────────────────
# APPROACH 1: Sort + Binary Search | O(n log n + m log n) time | O(1) space
# EXPLAIN: Sort products once; for each prefix use bisect to find the range of matching products.
# WHEN: Optimal for one-shot queries; O(log n) per prefix lookup after an O(n log n) sort.

def solve_1(products: List[str], searchWord: str) -> List[List[str]]:
    products.sort()
    result = []
    prefix = ""
    for c in searchWord:
        prefix += c
        lo = bisect.bisect_left(products, prefix)
        suggestions = []
        for i in range(lo, min(lo + 3, len(products))):
            if products[i].startswith(prefix):
                suggestions.append(products[i])
            else:
                break
        result.append(suggestions)
    return result

# ─────────────────────────────────────────────
# APPROACH 2: Trie | O(n * L + m) time | O(n * L) space
# EXPLAIN: Build a trie; at each node store up to 3 lexicographically smallest suggestions for that prefix.
# WHEN: Best for repeated prefix queries; O(m) per query after O(n*L) build time.

class _TrieNode:
    def __init__(self):
        self.children: dict = {}
        self.suggestions: List[str] = []

def solve_2(products: List[str], searchWord: str) -> List[List[str]]:
    products.sort()
    root = _TrieNode()
    for word in products:
        node = root
        for c in word:
            if c not in node.children:
                node.children[c] = _TrieNode()
            node = node.children[c]
            if len(node.suggestions) < 3:
                node.suggestions.append(word)
    result = []
    node = root
    for c in searchWord:
        if node and c in node.children:
            node = node.children[c]
            result.append(node.suggestions[:])
        else:
            node = None
            result.append([])
    return result

# ─────────────────────────────────────────────
# APPROACH 3: Sort + Linear Scan | O(n log n + m * n) time | O(1) space
# EXPLAIN: Sort once; for each prefix scan the entire product list and collect up to 3 matches.
# WHEN: Simple to implement; fine for small product lists where binary search overhead isn't worth it.

def solve_3(products: List[str], searchWord: str) -> List[List[str]]:
    products.sort()
    result = []
    prefix = ""
    for c in searchWord:
        prefix += c
        suggestions = []
        for product in products:
            if product.startswith(prefix):
                suggestions.append(product)
                if len(suggestions) == 3:
                    break
        result.append(suggestions)
    return result

# ─────────────────────────────────────────────
# APPROACH 4: Sort + Two Pointers | O(n log n + m * n) time | O(1) space
# EXPLAIN: Maintain a shrinking window [start, end] of products matching the current prefix by advancing pointers.
# WHEN: Avoids repeated scanning from the beginning; window monotonically narrows as prefix grows.

def solve_4(products: List[str], searchWord: str) -> List[List[str]]:
    products.sort()
    result = []
    start, end = 0, len(products) - 1
    prefix = ""
    for c in searchWord:
        prefix += c
        plen = len(prefix)
        while start <= end and (len(products[start]) < plen or products[start][:plen] != prefix):
            start += 1
        while start <= end and (len(products[end]) < plen or products[end][:plen] != prefix):
            end -= 1
        result.append([products[i] for i in range(start, min(start + 3, end + 1))])
    return result

# ─────────────────────────────────────────────
# APPROACH 5: Brute Force with Filtering | O(n log n + m * n) time | O(n) space
# EXPLAIN: For each prefix, filter all products that start with it, sort (already sorted), take first 3.
# WHEN: Most readable reference implementation; explicit about the intent of each step.

def solve_5(products: List[str], searchWord: str) -> List[List[str]]:
    products.sort()
    result = []
    for i in range(1, len(searchWord) + 1):
        prefix = searchWord[:i]
        filtered = [p for p in products if p.startswith(prefix)]
        result.append(filtered[:3])
    return result

# Made with Bob
