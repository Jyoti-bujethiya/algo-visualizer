# LeetCode Problem #49: Group Anagrams
# Difficulty: Medium
# Link: https://leetcode.com/problems/group-anagrams/

from collections import defaultdict

# ─────────────────────────────────────────────
# APPROACH 1: Sorted String Key | O(m·n log n) time | O(m·n) space
# EXPLAIN: Sort each word alphabetically to produce a canonical key; group words sharing the same key.
# WHEN: Clean and idiomatic Python — fine for most input sizes; sorting dominates the per-word cost.

def group_anagrams_sort(strs: list[str]) -> list[list[str]]:
    groups: dict[str, list[str]] = defaultdict(list)
    for word in strs:
        key = "".join(sorted(word))
        groups[key].append(word)
    return list(groups.values())


# ─────────────────────────────────────────────
# APPROACH 2: Character-Count Key | O(m·n) time | O(m·n) space
# EXPLAIN: Represent each word as a fixed-length tuple of 26 character counts; use that tuple as the hash key.
# WHEN: Better asymptotic cost per word (O(n) vs O(n log n)) — preferred when words are long.

def group_anagrams_count(strs: list[str]) -> list[list[str]]:
    groups: dict[tuple[int, ...], list[str]] = defaultdict(list)
    for word in strs:
        counts = [0] * 26
        for ch in word:
            counts[ord(ch) - ord('a')] += 1
        groups[tuple(counts)].append(word)
    return list(groups.values())


# ─────────────────────────────────────────────
# APPROACH 3: Prime Number Product | O(m·n) time | O(m·n) space
# EXPLAIN: Assign each letter a unique prime and use the product of primes as the key — anagrams yield identical products.
# WHEN: Interesting interview talking point, but not recommended in practice due to overflow risk with long strings.

def group_anagrams_prime(strs: list[str]) -> list[list[str]]:
    primes = [2,  3,  5,  7, 11, 13, 17, 19, 23, 29,
              31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
              73, 79, 83, 89, 97, 101]
    groups: dict[int, list[str]] = defaultdict(list)
    for word in strs:
        key = 1
        for ch in word:
            key *= primes[ord(ch) - ord('a')]
        groups[key].append(word)
    return list(groups.values())


# ─────────────────────────────────────────────
if __name__ == "__main__":
    def normalize(result):
        return sorted([sorted(group) for group in result])

    cases = [
        (["eat","tea","tan","ate","nat","bat"],
         [["ate","eat","tea"],["bat"],["nat","tan"]]),
        ([""],  [[""]]),
        (["a"], [["a"]]),
    ]
    for strs, expected in cases:
        assert normalize(group_anagrams_sort(strs))  == normalize(expected)
        assert normalize(group_anagrams_count(strs)) == normalize(expected)
        assert normalize(group_anagrams_prime(strs)) == normalize(expected)
    print("All tests passed.")

# Made with Bob
