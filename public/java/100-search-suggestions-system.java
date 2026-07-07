/*
 * LeetCode Problem #1268: Search Suggestions System
 * Link: https://leetcode.com/problems/search-suggestions-system/
 * Difficulty: Medium
 */
import java.util.*;

class Solution {

    // APPROACH 1: Sort + Binary Search | O(n log n + m log n) time | O(1) space
    // EXPLAIN: Sort products once; for each prefix use binary search to find the matching range and take up to 3.
    public List<List<String>> suggestedProducts1(String[] products, String searchWord) {
        Arrays.sort(products);
        List<List<String>> result = new ArrayList<>();
        StringBuilder prefix = new StringBuilder();
        for (char c : searchWord.toCharArray()) {
            prefix.append(c);
            String pfx = prefix.toString();
            int lo = lowerBound(products, pfx);
            List<String> suggestions = new ArrayList<>();
            for (int i = lo; i < Math.min(lo + 3, products.length); i++) {
                if (products[i].startsWith(pfx)) suggestions.add(products[i]);
                else break;
            }
            result.add(suggestions);
        }
        return result;
    }

    private int lowerBound(String[] products, String prefix) {
        int lo = 0, hi = products.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (products[mid].compareTo(prefix) < 0) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }

    // APPROACH 2: Trie | O(n * L + m) time | O(n * L) space
    // EXPLAIN: Build a trie; at each node store up to 3 lexicographically smallest suggestions.
    static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        List<String> suggestions = new ArrayList<>();
    }

    public List<List<String>> suggestedProducts2(String[] products, String searchWord) {
        Arrays.sort(products);
        TrieNode root = new TrieNode();
        for (String word : products) {
            TrieNode node = root;
            for (char c : word.toCharArray()) {
                int idx = c - 'a';
                if (node.children[idx] == null) node.children[idx] = new TrieNode();
                node = node.children[idx];
                if (node.suggestions.size() < 3) node.suggestions.add(word);
            }
        }
        List<List<String>> result = new ArrayList<>();
        TrieNode node = root;
        for (char c : searchWord.toCharArray()) {
            int idx = c - 'a';
            if (node != null && node.children[idx] != null) {
                node = node.children[idx];
                result.add(new ArrayList<>(node.suggestions));
            } else {
                node = null;
                result.add(new ArrayList<>());
            }
        }
        return result;
    }

    // APPROACH 3: Sort + Linear Scan | O(n log n + m * n) time | O(1) space
    // EXPLAIN: Sort once; for each prefix scan the list and collect up to 3 prefix-matching products.
    public List<List<String>> suggestedProducts3(String[] products, String searchWord) {
        Arrays.sort(products);
        List<List<String>> result = new ArrayList<>();
        StringBuilder prefix = new StringBuilder();
        for (char c : searchWord.toCharArray()) {
            prefix.append(c);
            String pfx = prefix.toString();
            List<String> suggestions = new ArrayList<>();
            for (String product : products) {
                if (product.startsWith(pfx)) {
                    suggestions.add(product);
                    if (suggestions.size() == 3) break;
                }
            }
            result.add(suggestions);
        }
        return result;
    }

    // APPROACH 4: Sort + Two Pointers | O(n log n + m * n) time | O(1) space
    // EXPLAIN: Maintain a shrinking window [start, end] of products matching the growing prefix.
    public List<List<String>> suggestedProducts4(String[] products, String searchWord) {
        Arrays.sort(products);
        List<List<String>> result = new ArrayList<>();
        int start = 0, end = products.length - 1;
        StringBuilder prefix = new StringBuilder();
        for (int k = 0; k < searchWord.length(); k++) {
            prefix.append(searchWord.charAt(k));
            String pfx = prefix.toString();
            int plen = pfx.length();
            while (start <= end && (products[start].length() < plen || !products[start].substring(0, plen).equals(pfx)))
                start++;
            while (start <= end && (products[end].length() < plen || !products[end].substring(0, plen).equals(pfx)))
                end--;
            List<String> suggestions = new ArrayList<>();
            for (int i = start; i < Math.min(start + 3, end + 1); i++) suggestions.add(products[i]);
            result.add(suggestions);
        }
        return result;
    }

    // APPROACH 5: Brute Force with Filtering | O(n log n + m * n) time | O(n) space
    // EXPLAIN: For each prefix, filter all products starting with it and take the first 3.
    public List<List<String>> suggestedProducts5(String[] products, String searchWord) {
        Arrays.sort(products);
        List<List<String>> result = new ArrayList<>();
        for (int i = 1; i <= searchWord.length(); i++) {
            String prefix = searchWord.substring(0, i);
            List<String> suggestions = new ArrayList<>();
            for (String product : products) {
                if (product.startsWith(prefix)) suggestions.add(product);
            }
            result.add(suggestions.subList(0, Math.min(3, suggestions.size())));
        }
        return result;
    }
}

// Made with Bob
