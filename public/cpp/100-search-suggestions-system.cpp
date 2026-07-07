/*
 * Problem: Search Suggestions System (LeetCode 1268)
 * Link: https://leetcode.com/problems/search-suggestions-system/
 * Difficulty: Medium
 * Category: Sorting and Searching
 * 
 * Description:
 * You are given an array of strings products and a string searchWord.
 * Design a system that suggests at most three product names from products after
 * each character of searchWord is typed. Suggested products should have common
 * prefix with searchWord. If there are more than three products with a common
 * prefix return the three lexicographically minimums products.
 * 
 * Return a list of lists of the suggested products after each character of searchWord is typed.
 * 
 * Example 1:
 * Input: products = ["mobile","mouse","moneypot","monitor","mousepad"], searchWord = "mouse"
 * Output: [["mobile","moneypot","monitor"],["mobile","moneypot","monitor"],
 *          ["mouse","mousepad"],["mouse","mousepad"],["mouse","mousepad"]]
 * 
 * Example 2:
 * Input: products = ["havana"], searchWord = "havana"
 * Output: [["havana"],["havana"],["havana"],["havana"],["havana"],["havana"]]
 */

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

/*
 * APPROACH 1: SORT + BINARY SEARCH (OPTIMAL)
 * Time: O(n log n + m * log n), Space: O(1)
 */
class Solution1 {
public:
    vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
        sort(products.begin(), products.end());
        vector<vector<string>> result;
        string prefix = "";
        
        for (char c : searchWord) {
            prefix += c;
            auto it = lower_bound(products.begin(), products.end(), prefix);
            
            vector<string> suggestions;
            for (int i = 0; i < 3 && it + i != products.end(); i++) {
                string& product = *(it + i);
                if (product.find(prefix) == 0) {
                    suggestions.push_back(product);
                } else {
                    break;
                }
            }
            result.push_back(suggestions);
        }
        
        return result;
    }
};

/*
 * APPROACH 2: TRIE
 * Time: O(n * m + k), Space: O(n * m)
 */
class TrieNode {
public:
    TrieNode* children[26];
    vector<string> suggestions;
    
    TrieNode() {
        for (int i = 0; i < 26; i++) {
            children[i] = nullptr;
        }
    }
};

class Solution2 {
private:
    TrieNode* root;
    
    void insert(string& word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx]) {
                node->children[idx] = new TrieNode();
            }
            node = node->children[idx];
            if (node->suggestions.size() < 3) {
                node->suggestions.push_back(word);
            }
        }
    }
    
public:
    vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
        sort(products.begin(), products.end());
        root = new TrieNode();
        
        for (string& product : products) {
            insert(product);
        }
        
        vector<vector<string>> result;
        TrieNode* node = root;
        
        for (char c : searchWord) {
            int idx = c - 'a';
            if (node && node->children[idx]) {
                node = node->children[idx];
                result.push_back(node->suggestions);
            } else {
                node = nullptr;
                result.push_back({});
            }
        }
        
        return result;
    }
};

/*
 * APPROACH 3: SORT + LINEAR SCAN
 * Time: O(n log n + m * n), Space: O(1)
 */
class Solution3 {
public:
    vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
        sort(products.begin(), products.end());
        vector<vector<string>> result;
        string prefix = "";
        
        for (char c : searchWord) {
            prefix += c;
            vector<string> suggestions;
            
            for (const string& product : products) {
                if (product.find(prefix) == 0) {
                    suggestions.push_back(product);
                    if (suggestions.size() == 3) break;
                }
            }
            result.push_back(suggestions);
        }
        
        return result;
    }
};

/*
 * APPROACH 4: SORT + TWO POINTERS
 * Time: O(n log n + m * n), Space: O(1)
 */
class Solution4 {
public:
    vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
        sort(products.begin(), products.end());
        vector<vector<string>> result;
        int start = 0, end = products.size() - 1;
        string prefix = "";
        
        for (char c : searchWord) {
            prefix += c;
            
            while (start <= end && (products[start].size() < prefix.size() || 
                   products[start].substr(0, prefix.size()) != prefix)) {
                start++;
            }
            
            while (start <= end && (products[end].size() < prefix.size() || 
                   products[end].substr(0, prefix.size()) != prefix)) {
                end--;
            }
            
            vector<string> suggestions;
            for (int i = start; i < min(start + 3, end + 1); i++) {
                suggestions.push_back(products[i]);
            }
            result.push_back(suggestions);
        }
        
        return result;
    }
};

/*
 * APPROACH 5: BRUTE FORCE WITH FILTERING
 * Time: O(n log n + m * n), Space: O(n)
 */
class Solution5 {
public:
    vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
        sort(products.begin(), products.end());
        vector<vector<string>> result;
        
        for (int i = 1; i <= searchWord.size(); i++) {
            string prefix = searchWord.substr(0, i);
            vector<string> filtered;
            
            for (const string& product : products) {
                if (product.find(prefix) == 0) {
                    filtered.push_back(product);
                }
            }
            
            vector<string> suggestions;
            for (int j = 0; j < min(3, (int)filtered.size()); j++) {
                suggestions.push_back(filtered[j]);
            }
            result.push_back(suggestions);
        }
        
        return result;
    }
};

void test(vector<string> products, string searchWord, int approach) {
    vector<vector<string>> result;
    
    cout << "SearchWord: " << searchWord << "\n";
    
    switch(approach) {
        case 1: { Solution1 sol; result = sol.suggestedProducts(products, searchWord); break; }
        case 2: { Solution2 sol; result = sol.suggestedProducts(products, searchWord); break; }
        case 3: { Solution3 sol; result = sol.suggestedProducts(products, searchWord); break; }
        case 4: { Solution4 sol; result = sol.suggestedProducts(products, searchWord); break; }
        case 5: { Solution5 sol; result = sol.suggestedProducts(products, searchWord); break; }
    }
    
    for (const auto& suggestions : result) {
        cout << "[";
        for (int i = 0; i < suggestions.size(); i++) {
            cout << suggestions[i];
            if (i < suggestions.size() - 1) cout << ",";
        }
        cout << "] ";
    }
    cout << "\n\n";
}

int main() {
    vector<string> products = {"mobile","mouse","moneypot","monitor","mousepad"};
    string searchWord = "mouse";
    
    for (int i = 1; i <= 5; i++) {
        cout << "Approach " << i << ":\n";
        test(products, searchWord, i);
    }
    return 0;
}

// Made with Bob
