/*
 * Problem: Palindrome Partitioning (LeetCode 131)
 * Link: https://leetcode.com/problems/palindrome-partitioning/
 * Difficulty: Medium
 * Category: Backtracking and Recursion
 * 
 * Description:
 * Given a string s, partition s such that every substring of the partition is a palindrome.
 * Return all possible palindrome partitioning of s.
 * 
 * Example 1:
 * Input: s = "aab"
 * Output: [["a","a","b"],["aa","b"]]
 * 
 * Example 2:
 * Input: s = "a"
 * Output: [["a"]]
 * 
 * Constraints:
 * - 1 <= s.length <= 16
 * - s contains only lowercase English letters
 */

#include <iostream>
#include <vector>
#include <string>
using namespace std;

/*
 * APPROACH 1: BACKTRACKING WITH PALINDROME CHECK
 * 
 * Intuition:
 * - Try all possible partitions using backtracking
 * - For each position, try all possible palindrome substrings
 * - If substring is palindrome, add to current partition and recurse
 * - When reach end of string, add current partition to result
 * 
 * Algorithm:
 * 1. Start from index 0
 * 2. Try all substrings starting from current index
 * 3. If substring is palindrome:
 *    - Add to current partition
 *    - Recurse for remaining string
 *    - Backtrack (remove from partition)
 * 4. Base case: reached end of string
 * 
 * Time Complexity: O(n * 2^n) - 2^n partitions, O(n) to check palindrome
 * Space Complexity: O(n) - recursion depth
 */
class Solution1 {
private:
    bool isPalindrome(const string& s, int left, int right) {
        while (left < right) {
            if (s[left] != s[right]) return false;
            left++;
            right--;
        }
        return true;
    }
    
    void backtrack(const string& s, int start, vector<string>& current,
                   vector<vector<string>>& result) {
        if (start == s.length()) {
            result.push_back(current);
            return;
        }
        
        // Try all possible substrings starting from 'start'
        for (int end = start; end < s.length(); end++) {
            if (isPalindrome(s, start, end)) {
                // Add palindrome substring
                current.push_back(s.substr(start, end - start + 1));
                
                // Recurse for remaining string
                backtrack(s, end + 1, current, result);
                
                // Backtrack
                current.pop_back();
            }
        }
    }
    
public:
    vector<vector<string>> partition(string s) {
        vector<vector<string>> result;
        vector<string> current;
        backtrack(s, 0, current, result);
        return result;
    }
};

/*
 * APPROACH 2: BACKTRACKING WITH DP PALINDROME TABLE
 * 
 * Intuition:
 * - Precompute palindrome information using DP
 * - dp[i][j] = true if s[i..j] is palindrome
 * - Use this table during backtracking for O(1) palindrome check
 * 
 * Algorithm:
 * 1. Build DP table for palindrome checking
 * 2. Use backtracking with O(1) palindrome lookup
 * 3. This optimizes repeated palindrome checks
 * 
 * Time Complexity: O(n^2) for DP + O(2^n) for backtracking = O(2^n)
 * Space Complexity: O(n^2) for DP table
 */
class Solution2 {
private:
    void buildPalindromeTable(const string& s, vector<vector<bool>>& dp) {
        int n = s.length();
        
        // Every single character is palindrome
        for (int i = 0; i < n; i++) {
            dp[i][i] = true;
        }
        
        // Check for length 2
        for (int i = 0; i < n - 1; i++) {
            if (s[i] == s[i + 1]) {
                dp[i][i + 1] = true;
            }
        }
        
        // Check for lengths greater than 2
        for (int len = 3; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                if (s[i] == s[j] && dp[i + 1][j - 1]) {
                    dp[i][j] = true;
                }
            }
        }
    }
    
    void backtrack(const string& s, int start, vector<vector<bool>>& dp,
                   vector<string>& current, vector<vector<string>>& result) {
        if (start == s.length()) {
            result.push_back(current);
            return;
        }
        
        for (int end = start; end < s.length(); end++) {
            if (dp[start][end]) {
                current.push_back(s.substr(start, end - start + 1));
                backtrack(s, end + 1, dp, current, result);
                current.pop_back();
            }
        }
    }
    
public:
    vector<vector<string>> partition(string s) {
        int n = s.length();
        vector<vector<bool>> dp(n, vector<bool>(n, false));
        
        buildPalindromeTable(s, dp);
        
        vector<vector<string>> result;
        vector<string> current;
        backtrack(s, 0, dp, current, result);
        
        return result;
    }
};

/*
 * APPROACH 3: BACKTRACKING WITH EXPAND AROUND CENTER
 * 
 * Intuition:
 * - Check palindrome by expanding around center
 * - More efficient than substring comparison
 * - Still O(n) per check but with better constants
 * 
 * Algorithm:
 * 1. For each position, expand around center
 * 2. Check both odd and even length palindromes
 * 3. Use in backtracking
 * 
 * Time Complexity: O(n * 2^n)
 * Space Complexity: O(n)
 */
class Solution3 {
private:
    bool isPalindrome(const string& s, int left, int right) {
        while (left < right) {
            if (s[left++] != s[right--]) return false;
        }
        return true;
    }
    
    void backtrack(const string& s, int start, vector<string>& current,
                   vector<vector<string>>& result) {
        if (start == s.length()) {
            result.push_back(current);
            return;
        }
        
        for (int end = start; end < s.length(); end++) {
            if (isPalindrome(s, start, end)) {
                current.push_back(s.substr(start, end - start + 1));
                backtrack(s, end + 1, current, result);
                current.pop_back();
            }
        }
    }
    
public:
    vector<vector<string>> partition(string s) {
        vector<vector<string>> result;
        vector<string> current;
        backtrack(s, 0, current, result);
        return result;
    }
};

/*
 * APPROACH 4: MEMOIZATION WITH BACKTRACKING
 * 
 * Intuition:
 * - Cache palindrome check results
 * - Use map to store substring palindrome status
 * - Avoid redundant palindrome checks
 * 
 * Algorithm:
 * 1. Use map to cache palindrome results
 * 2. Check cache before computing
 * 3. Store result in cache
 * 
 * Time Complexity: O(n * 2^n)
 * Space Complexity: O(n^2) for cache
 */
class Solution4 {
private:
    unordered_map<string, bool> palindromeCache;
    
    bool isPalindrome(const string& s, int left, int right) {
        string key = to_string(left) + "," + to_string(right);
        
        if (palindromeCache.find(key) != palindromeCache.end()) {
            return palindromeCache[key];
        }
        
        int l = left, r = right;
        while (l < r) {
            if (s[l++] != s[r--]) {
                palindromeCache[key] = false;
                return false;
            }
        }
        
        palindromeCache[key] = true;
        return true;
    }
    
    void backtrack(const string& s, int start, vector<string>& current,
                   vector<vector<string>>& result) {
        if (start == s.length()) {
            result.push_back(current);
            return;
        }
        
        for (int end = start; end < s.length(); end++) {
            if (isPalindrome(s, start, end)) {
                current.push_back(s.substr(start, end - start + 1));
                backtrack(s, end + 1, current, result);
                current.pop_back();
            }
        }
    }
    
public:
    vector<vector<string>> partition(string s) {
        vector<vector<string>> result;
        vector<string> current;
        backtrack(s, 0, current, result);
        return result;
    }
};

/*
 * APPROACH 5: ITERATIVE WITH DYNAMIC PROGRAMMING
 * 
 * Intuition:
 * - Build partitions iteratively
 * - For each position, extend all valid partitions
 * - Use DP to track partitions ending at each position
 * 
 * Algorithm:
 * 1. dp[i] = all valid partitions of s[0..i-1]
 * 2. For each position i:
 *    - For each j < i:
 *      - If s[j..i-1] is palindrome:
 *        - Extend all partitions in dp[j]
 * 3. Return dp[n]
 * 
 * Time Complexity: O(n^2 * 2^n)
 * Space Complexity: O(n * 2^n)
 */
class Solution5 {
private:
    bool isPalindrome(const string& s, int left, int right) {
        while (left < right) {
            if (s[left++] != s[right--]) return false;
        }
        return true;
    }
    
public:
    vector<vector<string>> partition(string s) {
        int n = s.length();
        vector<vector<vector<string>>> dp(n + 1);
        dp[0].push_back({}); // Empty partition
        
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (isPalindrome(s, j, i - 1)) {
                    string palindrome = s.substr(j, i - j);
                    
                    for (const auto& partition : dp[j]) {
                        vector<string> newPartition = partition;
                        newPartition.push_back(palindrome);
                        dp[i].push_back(newPartition);
                    }
                }
            }
        }
        
        return dp[n];
    }
};

// Helper function to print partitions
void printPartitions(const vector<vector<string>>& partitions) {
    cout << "[";
    for (int i = 0; i < partitions.size(); i++) {
        cout << "[";
        for (int j = 0; j < partitions[i].size(); j++) {
            cout << "\"" << partitions[i][j] << "\"";
            if (j < partitions[i].size() - 1) cout << ",";
        }
        cout << "]";
        if (i < partitions.size() - 1) cout << ",";
    }
    cout << "]\n";
}

// Test function
void test(string s, int approach) {
    vector<vector<string>> result;
    
    cout << "Input: s = \"" << s << "\"\n";
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.partition(s);
            cout << "Approach 1 (Basic Backtracking): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.partition(s);
            cout << "Approach 2 (DP Palindrome Table): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.partition(s);
            cout << "Approach 3 (Expand Around Center): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.partition(s);
            cout << "Approach 4 (Memoization): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.partition(s);
            cout << "Approach 5 (Iterative DP): ";
            break;
        }
    }
    
    printPartitions(result);
    cout << "\n";
}

int main() {
    // Test Case 1: Standard case
    cout << "Test Case 1: Standard case\n";
    for (int i = 1; i <= 5; i++) {
        test("aab", i);
    }
    
    // Test Case 2: Single character
    cout << "Test Case 2: Single character\n";
    for (int i = 1; i <= 5; i++) {
        test("a", i);
    }
    
    // Test Case 3: All same characters
    cout << "Test Case 3: All same\n";
    for (int i = 1; i <= 5; i++) {
        test("aaa", i);
    }
    
    // Test Case 4: No palindrome substrings
    cout << "Test Case 4: Alternating\n";
    for (int i = 1; i <= 5; i++) {
        test("abcd", i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (Basic Backtracking):
 * - Time: O(n * 2^n) - 2^n partitions, O(n) palindrome check
 * - Space: O(n) - recursion depth
 * - Best for: Simple, clean implementation
 * 
 * Approach 2 (DP Palindrome Table):
 * - Time: O(n^2) preprocessing + O(2^n) backtracking
 * - Space: O(n^2) - DP table
 * - Best for: Optimal when many palindrome checks
 * 
 * Approach 3 (Expand Around Center):
 * - Time: O(n * 2^n)
 * - Space: O(n)
 * - Best for: Better constants than Approach 1
 * 
 * Approach 4 (Memoization):
 * - Time: O(n * 2^n)
 * - Space: O(n^2) - cache
 * - Best for: Avoiding redundant checks
 * 
 * Approach 5 (Iterative DP):
 * - Time: O(n^2 * 2^n)
 * - Space: O(n * 2^n)
 * - Best for: Iterative solution
 * 
 * INTERVIEW TIPS:
 * 1. Start with Approach 1 - most intuitive
 * 2. Mention Approach 2 for optimization
 * 3. Explain backtracking clearly
 * 4. Draw recursion tree for small example
 * 5. Discuss palindrome checking strategies
 * 
 * COMMON MISTAKES:
 * 1. Not handling empty string
 * 2. Incorrect substring indices
 * 3. Not backtracking properly
 * 4. Inefficient palindrome checking
 * 5. Forgetting base case in recursion
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. Return minimum cuts needed? (Palindrome Partitioning II)
 * 2. Can you optimize palindrome checking? (Use DP table)
 * 3. What if string is very long? (DP table helps)
 * 4. How to find longest palindrome partition? (Track lengths)
 * 5. Can you do it iteratively? (Yes, Approach 5)
 * 
 * RELATED PROBLEMS:
 * - Palindrome Partitioning II (minimum cuts)
 * - Palindrome Partitioning III (k partitions)
 * - Longest Palindromic Substring
 * - Palindrome Pairs
 * - Valid Palindrome
 * 
 * KEY INSIGHTS:
 * 1. Backtracking explores all possible partitions
 * 2. DP table optimizes palindrome checking
 * 3. Each partition is a valid solution path
 * 4. Pruning happens when substring is not palindrome
 * 5. Time complexity dominated by number of partitions (2^n)
 */

// Made with Bob
