/*
 * LeetCode Problem #3: Longest Substring Without Repeating Characters
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/longest-substring-without-repeating-characters/
 * 
 * Problem Statement:
 * Given a string s, find the length of the longest substring without repeating characters.
 */

#include <string>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <iostream>
using namespace std;

class Solution {
public:
    // ==================== APPROACH 1: Brute Force ====================
    /*
     * Algorithm:
     * - Check all possible substrings
     * - For each substring, check if all characters are unique
     * - Track maximum length
     * 
     * Time Complexity: O(n³)
     * Space Complexity: O(min(n, m)) where m is charset size
     * 
     * When to use: Never (too slow)
     */
    int lengthOfLongestSubstring_BruteForce(string s) {
        int n = s.length();
        int maxLen = 0;
        
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                // Check if substring s[i..j] has all unique characters
                unordered_set<char> chars;
                bool allUnique = true;
                
                for (int k = i; k <= j; k++) {
                    if (chars.count(s[k])) {
                        allUnique = false;
                        break;
                    }
                    chars.insert(s[k]);
                }
                
                if (allUnique) {
                    maxLen = max(maxLen, j - i + 1);
                }
            }
        }
        
        return maxLen;
    }
    
    // ==================== APPROACH 2: Sliding Window with Set ====================
    /*
     * Algorithm:
     * - Use two pointers (left, right) for sliding window
     * - Use set to track characters in current window
     * - If duplicate found, shrink window from left
     * - Track maximum window size
     * 
     * Time Complexity: O(2n) = O(n) - each character visited at most twice
     * Space Complexity: O(min(n, m))
     * 
     * When to use: Good solution, easy to understand
     */
    int lengthOfLongestSubstring_Set(string s) {
        unordered_set<char> chars;
        int maxLen = 0;
        int left = 0;
        
        for (int right = 0; right < s.length(); right++) {
            // Shrink window until no duplicate
            while (chars.count(s[right])) {
                chars.erase(s[left]);
                left++;
            }
            
            chars.insert(s[right]);
            maxLen = max(maxLen, right - left + 1);
        }
        
        return maxLen;
    }
    
    // ==================== APPROACH 3: Sliding Window with HashMap (Optimal) ====================
    /*
     * Algorithm:
     * - Use hash map to store character and its index
     * - When duplicate found, jump left pointer to position after last occurrence
     * - Track maximum window size
     * 
     * Time Complexity: O(n) - single pass
     * Space Complexity: O(min(n, m))
     * 
     * When to use: This is the OPTIMAL solution
     * 
     * Key Insight:
     * - Instead of removing characters one by one, jump directly
     * - Store index of each character for quick lookup
     * - left = max(left, lastIndex[char] + 1)
     */
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> charIndex;
        int maxLen = 0;
        int left = 0;
        
        for (int right = 0; right < s.length(); right++) {
            char c = s[right];
            
            // If character seen before and within current window
            if (charIndex.count(c) && charIndex[c] >= left) {
                left = charIndex[c] + 1;
            }
            
            charIndex[c] = right;
            maxLen = max(maxLen, right - left + 1);
        }
        
        return maxLen;
    }
    
    // ==================== APPROACH 4: Array Instead of HashMap ====================
    /*
     * Optimization for ASCII characters
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1) - fixed size array
     */
    int lengthOfLongestSubstring_Array(string s) {
        vector<int> charIndex(128, -1);  // ASCII characters
        int maxLen = 0;
        int left = 0;
        
        for (int right = 0; right < s.length(); right++) {
            if (charIndex[s[right]] >= left) {
                left = charIndex[s[right]] + 1;
            }
            
            charIndex[s[right]] = right;
            maxLen = max(maxLen, right - left + 1);
        }
        
        return maxLen;
    }
};

// ==================== TEST CASES ====================
void runTests() {
    Solution sol;
    
    // Test Case 1: Standard case
    cout << "Test 1: " << sol.lengthOfLongestSubstring("abcabcbb") << endl;
    // Expected: 3 ("abc")
    
    // Test Case 2: All same characters
    cout << "Test 2: " << sol.lengthOfLongestSubstring("bbbbb") << endl;
    // Expected: 1 ("b")
    
    // Test Case 3: No repeating
    cout << "Test 3: " << sol.lengthOfLongestSubstring("pwwkew") << endl;
    // Expected: 3 ("wke")
    
    // Test Case 4: Empty string
    cout << "Test 4: " << sol.lengthOfLongestSubstring("") << endl;
    // Expected: 0
    
    // Test Case 5: Single character
    cout << "Test 5: " << sol.lengthOfLongestSubstring("a") << endl;
    // Expected: 1
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. Brute Force:
 *    Time: O(n³), Space: O(m)
 *    Not acceptable
 * 
 * 2. Sliding Window with Set:
 *    Time: O(2n), Space: O(m)
 *    Good solution, easy to code
 * 
 * 3. Sliding Window with HashMap (RECOMMENDED):
 *    Time: O(n), Space: O(m)
 *    Optimal, single pass
 * 
 * 4. Array Optimization:
 *    Time: O(n), Space: O(1)
 *    Best for ASCII strings
 * 
 * INTERVIEW TIPS:
 * - Start with set-based sliding window
 * - Optimize to hash map for single pass
 * - Explain why we can jump left pointer
 * - Handle edge cases: empty string, single char
 * 
 * KEY INSIGHTS:
 * - Sliding window pattern for substring problems
 * - Hash map stores last seen index
 * - Jump left pointer instead of incrementing
 * - Window size = right - left + 1
 * 
 * COMMON MISTAKES:
 * - Not checking if duplicate is within current window
 * - Forgetting to update character index
 * - Wrong window size calculation
 * 
 * FOLLOW-UP QUESTIONS:
 * - At most K distinct characters? (Similar sliding window)
 * - Longest substring with at most 2 distinct? (Variation)
 * - Return the actual substring? (Track start index)
 */
