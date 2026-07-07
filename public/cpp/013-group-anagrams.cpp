/*
 * LeetCode Problem #49: Group Anagrams
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/group-anagrams/
 * 
 * Problem Statement:
 * Given an array of strings strs, group the anagrams together. You can return
 * the answer in any order.
 */

#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <iostream>
using namespace std;

class Solution {
public:
    // ==================== APPROACH 1: Sort Each String ====================
    /*
     * Algorithm:
     * - For each string, sort it to get a key
     * - Use hash map: sorted string -> list of original strings
     * - Group strings with same sorted form
     * 
     * Time Complexity: O(n * k log k) where n = number of strings, k = max length
     * Space Complexity: O(n * k)
     * 
     * When to use: This is the STANDARD solution
     * 
     * Key Insight:
     * - Anagrams have same characters, so sorting gives same result
     * - Use sorted string as hash key
     */
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> groups;
        
        for (const string& str : strs) {
            string key = str;
            sort(key.begin(), key.end());
            groups[key].push_back(str);
        }
        
        vector<vector<string>> result;
        for (auto& pair : groups) {
            result.push_back(pair.second);
        }
        
        return result;
    }
    
    // ==================== APPROACH 2: Character Count as Key ====================
    /*
     * Algorithm:
     * - Count frequency of each character
     * - Use count array as key (convert to string)
     * - Group strings with same character counts
     * 
     * Time Complexity: O(n * k) where n = number of strings, k = max length
     * Space Complexity: O(n * k)
     * 
     * When to use: When you want O(n*k) instead of O(n*k log k)
     * 
     * Key Insight:
     * - Character count uniquely identifies anagrams
     * - Faster than sorting for long strings
     */
    string getKey(const string& str) {
        vector<int> count(26, 0);
        for (char c : str) {
            count[c - 'a']++;
        }
        
        // Convert count to string key
        string key = "";
        for (int i = 0; i < 26; i++) {
            if (count[i] > 0) {
                key += string(1, 'a' + i) + to_string(count[i]);
            }
        }
        return key;
    }
    
    vector<vector<string>> groupAnagrams_CharCount(vector<string>& strs) {
        unordered_map<string, vector<string>> groups;
        
        for (const string& str : strs) {
            string key = getKey(str);
            groups[key].push_back(str);
        }
        
        vector<vector<string>> result;
        for (auto& pair : groups) {
            result.push_back(pair.second);
        }
        
        return result;
    }
    
    // ==================== APPROACH 3: Prime Number Product ====================
    /*
     * Algorithm:
     * - Assign each character a prime number
     * - Multiply primes for all characters in string
     * - Use product as key
     * 
     * Time Complexity: O(n * k)
     * Space Complexity: O(n * k)
     * 
     * When to use: Interesting approach but can overflow
     * 
     * Note: Not recommended due to potential overflow with long strings
     */
    vector<vector<string>> groupAnagrams_Prime(vector<string>& strs) {
        vector<long long> primes = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 
                                    43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101};
        
        unordered_map<long long, vector<string>> groups;
        
        for (const string& str : strs) {
            long long key = 1;
            for (char c : str) {
                key *= primes[c - 'a'];
            }
            groups[key].push_back(str);
        }
        
        vector<vector<string>> result;
        for (auto& pair : groups) {
            result.push_back(pair.second);
        }
        
        return result;
    }
};

// ==================== TEST CASES ====================
void printResult(const vector<vector<string>>& result) {
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << "[";
        for (int j = 0; j < result[i].size(); j++) {
            cout << "\"" << result[i][j] << "\"";
            if (j < result[i].size() - 1) cout << ",";
        }
        cout << "]";
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
}

void runTests() {
    Solution sol;
    
    // Test Case 1: Standard case
    vector<string> strs1 = {"eat", "tea", "tan", "ate", "nat", "bat"};
    cout << "Test 1: ";
    printResult(sol.groupAnagrams(strs1));
    // Expected: [["bat"],["nat","tan"],["ate","eat","tea"]]
    
    // Test Case 2: Empty string
    vector<string> strs2 = {""};
    cout << "Test 2: ";
    printResult(sol.groupAnagrams(strs2));
    // Expected: [[""]]
    
    // Test Case 3: Single character
    vector<string> strs3 = {"a"};
    cout << "Test 3: ";
    printResult(sol.groupAnagrams(strs3));
    // Expected: [["a"]]
    
    // Test Case 4: All same
    vector<string> strs4 = {"abc", "bca", "cab"};
    cout << "Test 4: ";
    printResult(sol.groupAnagrams(strs4));
    // Expected: [["abc","bca","cab"]]
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. Sort Each String (RECOMMENDED):
 *    Time: O(n * k log k), Space: O(n * k)
 *    Most intuitive, widely accepted
 * 
 * 2. Character Count:
 *    Time: O(n * k), Space: O(n * k)
 *    Faster for long strings, more complex
 * 
 * 3. Prime Product:
 *    Time: O(n * k), Space: O(n * k)
 *    Clever but can overflow, not recommended
 * 
 * INTERVIEW TIPS:
 * - Start with sorting approach
 * - Mention character count optimization
 * - Explain why anagrams have same sorted form
 * - Discuss hash map choice for grouping
 * - Handle edge cases: empty strings, single char
 * 
 * KEY INSIGHTS:
 * - Anagrams have identical character frequencies
 * - Sorting normalizes anagrams to same form
 * - Hash map groups strings efficiently
 * - Key generation is critical for performance
 * 
 * COMMON MISTAKES:
 * - Not handling empty strings
 * - Using inefficient key generation
 * - Forgetting to collect results from map
 * - Prime approach overflow for long strings
 * 
 * FOLLOW-UP QUESTIONS:
 * - Case insensitive? (Convert to lowercase first)
 * - Unicode characters? (Adjust character count size)
 * - Return only groups of size > 1? (Filter results)
 * - Find largest anagram group? (Track max size)
 * 
 * RELATED PROBLEMS:
 * - Valid Anagram (LeetCode #242)
 * - Find All Anagrams in a String (LeetCode #438)
 * - Group Shifted Strings (LeetCode #249)
 */

// Made with Bob
