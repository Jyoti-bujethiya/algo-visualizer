/*
 * LeetCode Problem #76: Minimum Window Substring
 * Difficulty: Hard
 * Link: https://leetcode.com/problems/minimum-window-substring/
 * 
 * Problem Statement:
 * Given two strings s and t of lengths m and n respectively, return the minimum window
 * substring of s such that every character in t (including duplicates) is included in
 * the window. If there is no such substring, return the empty string "".
 */

#include <string>
#include <unordered_map>
#include <climits>
#include <iostream>
using namespace std;

class Solution {
public:
    // ==================== APPROACH 1: Brute Force ====================
    /*
     * Algorithm:
     * - Check all possible substrings of s
     * - For each substring, check if it contains all characters of t
     * - Track minimum length substring
     * 
     * Time Complexity: O(n² * m) where n = s.length(), m = t.length()
     * Space Complexity: O(m)
     * 
     * When to use: Never (too slow)
     */
    bool containsAll(const string& s, int start, int end, unordered_map<char, int>& tCount) {
        unordered_map<char, int> windowCount;
        for (int i = start; i <= end; i++) {
            windowCount[s[i]]++;
        }
        
        for (auto& p : tCount) {
            if (windowCount[p.first] < p.second) {
                return false;
            }
        }
        return true;
    }
    
    string minWindow_BruteForce(string s, string t) {
        if (s.empty() || t.empty()) return "";
        
        unordered_map<char, int> tCount;
        for (char c : t) tCount[c]++;
        
        int minLen = INT_MAX;
        int minStart = 0;
        
        for (int i = 0; i < s.length(); i++) {
            for (int j = i; j < s.length(); j++) {
                if (containsAll(s, i, j, tCount)) {
                    if (j - i + 1 < minLen) {
                        minLen = j - i + 1;
                        minStart = i;
                    }
                    break;  // No need to extend further
                }
            }
        }
        
        return minLen == INT_MAX ? "" : s.substr(minStart, minLen);
    }
    
    // ==================== APPROACH 2: Sliding Window (Optimal) ====================
    /*
     * Algorithm:
     * 1. Use two pointers (left, right) for sliding window
     * 2. Expand right to include characters until window is valid
     * 3. Contract left to minimize window while keeping it valid
     * 4. Track minimum window found
     * 
     * Time Complexity: O(m + n) where m = s.length(), n = t.length()
     * Space Complexity: O(m + n) for hash maps
     * 
     * When to use: This is the OPTIMAL solution
     * 
     * Key Insight:
     * - Use hash map to track required characters and their counts
     * - Use 'formed' counter to track when window is valid
     * - Expand right until valid, then contract left to minimize
     * - Only check validity when adding/removing required characters
     */
    string minWindow(string s, string t) {
        if (s.empty() || t.empty()) return "";
        
        // Count characters in t
        unordered_map<char, int> tCount;
        for (char c : t) {
            tCount[c]++;
        }
        
        int required = tCount.size();  // Number of unique chars in t
        int formed = 0;  // Number of unique chars in window with desired frequency
        
        unordered_map<char, int> windowCount;
        int left = 0, right = 0;
        
        // Result: [window length, left, right]
        int minLen = INT_MAX;
        int minLeft = 0, minRight = 0;
        
        while (right < s.length()) {
            // Expand window by adding character at right
            char c = s[right];
            windowCount[c]++;
            
            // Check if frequency of current char matches desired frequency
            if (tCount.count(c) && windowCount[c] == tCount[c]) {
                formed++;
            }
            
            // Contract window from left while it's valid
            while (left <= right && formed == required) {
                // Update result if current window is smaller
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    minLeft = left;
                    minRight = right;
                }
                
                // Remove character at left
                char leftChar = s[left];
                windowCount[leftChar]--;
                
                if (tCount.count(leftChar) && windowCount[leftChar] < tCount[leftChar]) {
                    formed--;
                }
                
                left++;
            }
            
            right++;
        }
        
        return minLen == INT_MAX ? "" : s.substr(minLeft, minLen);
    }
    
    // ==================== APPROACH 3: Optimized with Array ====================
    /*
     * Use array instead of hash map for ASCII characters
     * 
     * Time Complexity: O(m + n)
     * Space Complexity: O(1) - fixed size arrays
     */
    string minWindow_Array(string s, string t) {
        if (s.empty() || t.empty()) return "";
        
        vector<int> tCount(128, 0);
        int required = 0;
        
        for (char c : t) {
            if (tCount[c] == 0) required++;
            tCount[c]++;
        }
        
        vector<int> windowCount(128, 0);
        int formed = 0;
        int left = 0, right = 0;
        int minLen = INT_MAX;
        int minLeft = 0;
        
        while (right < s.length()) {
            char c = s[right];
            windowCount[c]++;
            
            if (tCount[c] > 0 && windowCount[c] == tCount[c]) {
                formed++;
            }
            
            while (left <= right && formed == required) {
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    minLeft = left;
                }
                
                char leftChar = s[left];
                windowCount[leftChar]--;
                
                if (tCount[leftChar] > 0 && windowCount[leftChar] < tCount[leftChar]) {
                    formed--;
                }
                
                left++;
            }
            
            right++;
        }
        
        return minLen == INT_MAX ? "" : s.substr(minLeft, minLen);
    }
};

// ==================== TEST CASES ====================
void runTests() {
    Solution sol;
    
    // Test Case 1: Standard case
    cout << "Test 1: \"" << sol.minWindow("ADOBECODEBANC", "ABC") << "\"" << endl;
    // Expected: "BANC"
    
    // Test Case 2: No valid window
    cout << "Test 2: \"" << sol.minWindow("a", "aa") << "\"" << endl;
    // Expected: ""
    
    // Test Case 3: Entire string is minimum
    cout << "Test 3: \"" << sol.minWindow("a", "a") << "\"" << endl;
    // Expected: "a"
    
    // Test Case 4: Multiple valid windows
    cout << "Test 4: \"" << sol.minWindow("ADOBECODEBANC", "AABC") << "\"" << endl;
    // Expected: "ADOBEC" or "BANC" depending on implementation
    
    // Test Case 5: t longer than s
    cout << "Test 5: \"" << sol.minWindow("ab", "abc") << "\"" << endl;
    // Expected: ""
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. Brute Force:
 *    Time: O(n² * m), Space: O(m)
 *    Not acceptable for interviews
 * 
 * 2. Sliding Window (RECOMMENDED):
 *    Time: O(m + n), Space: O(m + n)
 *    Optimal solution, most intuitive
 * 
 * 3. Array Optimization:
 *    Time: O(m + n), Space: O(1)
 *    Best for ASCII strings
 * 
 * INTERVIEW TIPS:
 * - Explain sliding window technique clearly
 * - Use 'formed' counter to track validity efficiently
 * - Discuss why we contract from left after expanding right
 * - Handle edge cases: empty strings, no valid window
 * - Mention that we only update result when contracting
 * 
 * KEY INSIGHTS:
 * - Sliding window pattern for substring problems
 * - Expand right to make window valid
 * - Contract left to minimize while keeping valid
 * - Use 'formed' counter instead of checking all chars each time
 * - Only care about characters that are in t
 * 
 * ALGORITHM WALKTHROUGH for s="ADOBECODEBANC", t="ABC":
 * 
 * Initial: left=0, right=0, formed=0, required=3
 * 
 * Expand phase:
 * right=0: A, formed=1 (A matched)
 * right=1: D, formed=1
 * right=2: O, formed=1
 * right=3: B, formed=2 (B matched)
 * right=4: E, formed=2
 * right=5: C, formed=3 (C matched) -> Valid!
 * 
 * Contract phase:
 * Window "ADOBEC" (len=6), update min
 * left=1: Remove A, formed=2 -> Invalid
 * 
 * Continue expanding...
 * Eventually find "BANC" (len=4) which is minimum
 * 
 * COMMON MISTAKES:
 * - Not handling duplicate characters in t
 * - Checking validity on every iteration (inefficient)
 * - Wrong condition for contracting window
 * - Not updating result during contraction
 * - Forgetting edge cases
 * 
 * FOLLOW-UP QUESTIONS:
 * - Find all minimum windows? (Store all with min length)
 * - Case insensitive? (Convert to lowercase first)
 * - Unicode characters? (Use hash map, not array)
 * - Return indices instead of substring? (Return [minLeft, minRight])
 * 
 * RELATED PROBLEMS:
 * - Longest Substring Without Repeating Characters (LeetCode #3)
 * - Longest Substring with At Most K Distinct Characters (LeetCode #340)
 * - Substring with Concatenation of All Words (LeetCode #30)
 * - Find All Anagrams in a String (LeetCode #438)
 * 
 * SLIDING WINDOW PATTERN:
 * 1. Expand right to include more elements
 * 2. Check if window is valid
 * 3. If valid, try to contract from left
 * 4. Update result when appropriate
 * 5. Repeat until right reaches end
 */

// Made with Bob
