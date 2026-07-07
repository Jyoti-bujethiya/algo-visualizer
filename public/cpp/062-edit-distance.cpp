/*
 * Problem: Edit Distance (LeetCode 72)
 * Link: https://leetcode.com/problems/edit-distance/
 * Difficulty: Hard
 * Category: Dynamic Programming
 * 
 * Description:
 * Given two strings word1 and word2, return the minimum number of operations
 * required to convert word1 to word2.
 * 
 * You have the following three operations permitted on a word:
 * - Insert a character
 * - Delete a character
 * - Replace a character
 * 
 * Example 1:
 * Input: word1 = "horse", word2 = "ros"
 * Output: 3
 * Explanation: 
 * horse -> rorse (replace 'h' with 'r')
 * rorse -> rose (remove 'r')
 * rose -> ros (remove 'e')
 * 
 * Example 2:
 * Input: word1 = "intention", word2 = "execution"
 * Output: 5
 * Explanation: 
 * intention -> inention (remove 't')
 * inention -> enention (replace 'i' with 'e')
 * enention -> exention (replace 'n' with 'x')
 * exention -> exection (replace 'n' with 'c')
 * exection -> execution (insert 'u')
 * 
 * Constraints:
 * - 0 <= word1.length, word2.length <= 500
 * - word1 and word2 consist of lowercase English letters
 */

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

/*
 * APPROACH 1: 2D DYNAMIC PROGRAMMING
 * 
 * Intuition:
 * - dp[i][j] = minimum operations to convert word1[0..i-1] to word2[0..j-1]
 * - If characters match, no operation needed: dp[i][j] = dp[i-1][j-1]
 * - Otherwise, take minimum of:
 *   - Insert: dp[i][j-1] + 1
 *   - Delete: dp[i-1][j] + 1
 *   - Replace: dp[i-1][j-1] + 1
 * 
 * Algorithm:
 * 1. Create (m+1) x (n+1) DP table
 * 2. Initialize first row and column (base cases)
 * 3. Fill table using recurrence relation
 * 4. Return dp[m][n]
 * 
 * Time Complexity: O(m * n) where m, n are string lengths
 * Space Complexity: O(m * n) for DP table
 */
class Solution1 {
public:
    int minDistance(string word1, string word2) {
        int m = word1.length();
        int n = word2.length();
        
        // Create DP table
        vector<vector<int>> dp(m + 1, vector<int>(n + 1));
        
        // Base cases
        for (int i = 0; i <= m; i++) {
            dp[i][0] = i; // Delete all characters from word1
        }
        for (int j = 0; j <= n; j++) {
            dp[0][j] = j; // Insert all characters of word2
        }
        
        // Fill DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1[i-1] == word2[j-1]) {
                    // Characters match, no operation needed
                    dp[i][j] = dp[i-1][j-1];
                } else {
                    // Take minimum of insert, delete, replace
                    dp[i][j] = 1 + min({
                        dp[i][j-1],     // Insert
                        dp[i-1][j],     // Delete
                        dp[i-1][j-1]    // Replace
                    });
                }
            }
        }
        
        return dp[m][n];
    }
};

/*
 * APPROACH 2: SPACE-OPTIMIZED DP (1D ARRAY)
 * 
 * Intuition:
 * - Only need previous row to compute current row
 * - Use two 1D arrays or optimize to single array
 * - Reduces space from O(m*n) to O(n)
 * 
 * Algorithm:
 * 1. Use two arrays: prev and curr
 * 2. Initialize prev with base case
 * 3. For each row, compute curr based on prev
 * 4. Swap arrays for next iteration
 * 
 * Time Complexity: O(m * n)
 * Space Complexity: O(n) - two arrays of size n
 */
class Solution2 {
public:
    int minDistance(string word1, string word2) {
        int m = word1.length();
        int n = word2.length();
        
        // Use two arrays
        vector<int> prev(n + 1);
        vector<int> curr(n + 1);
        
        // Initialize prev (base case for row 0)
        for (int j = 0; j <= n; j++) {
            prev[j] = j;
        }
        
        // Fill DP table row by row
        for (int i = 1; i <= m; i++) {
            curr[0] = i; // Base case for column 0
            
            for (int j = 1; j <= n; j++) {
                if (word1[i-1] == word2[j-1]) {
                    curr[j] = prev[j-1];
                } else {
                    curr[j] = 1 + min({
                        curr[j-1],      // Insert
                        prev[j],        // Delete
                        prev[j-1]       // Replace
                    });
                }
            }
            
            swap(prev, curr);
        }
        
        return prev[n];
    }
};

/*
 * APPROACH 3: RECURSIVE WITH MEMOIZATION (TOP-DOWN)
 * 
 * Intuition:
 * - Recursively solve subproblems
 * - Use memoization to avoid recomputation
 * - More intuitive than bottom-up
 * 
 * Algorithm:
 * 1. Base cases: empty strings
 * 2. If characters match, recurse without operation
 * 3. Otherwise, try all three operations and take minimum
 * 4. Cache results in memo table
 * 
 * Time Complexity: O(m * n)
 * Space Complexity: O(m * n) for memo + recursion stack
 */
class Solution3 {
private:
    int helper(string& word1, string& word2, int i, int j, 
               vector<vector<int>>& memo) {
        // Base cases
        if (i == 0) return j; // Insert all remaining characters of word2
        if (j == 0) return i; // Delete all remaining characters of word1
        
        // Check memo
        if (memo[i][j] != -1) return memo[i][j];
        
        if (word1[i-1] == word2[j-1]) {
            // Characters match
            memo[i][j] = helper(word1, word2, i-1, j-1, memo);
        } else {
            // Try all three operations
            int insert = helper(word1, word2, i, j-1, memo);
            int del = helper(word1, word2, i-1, j, memo);
            int replace = helper(word1, word2, i-1, j-1, memo);
            
            memo[i][j] = 1 + min({insert, del, replace});
        }
        
        return memo[i][j];
    }
    
public:
    int minDistance(string word1, string word2) {
        int m = word1.length();
        int n = word2.length();
        
        vector<vector<int>> memo(m + 1, vector<int>(n + 1, -1));
        return helper(word1, word2, m, n, memo);
    }
};

/*
 * APPROACH 4: SPACE-OPTIMIZED WITH SINGLE ARRAY
 * 
 * Intuition:
 * - Further optimize space to single array
 * - Use variable to track diagonal value
 * - Most space-efficient solution
 * 
 * Algorithm:
 * 1. Use single array dp
 * 2. Track previous diagonal value
 * 3. Update array in-place
 * 
 * Time Complexity: O(m * n)
 * Space Complexity: O(min(m, n)) - optimize for smaller dimension
 */
class Solution4 {
public:
    int minDistance(string word1, string word2) {
        // Optimize for smaller dimension
        if (word1.length() < word2.length()) {
            swap(word1, word2);
        }
        
        int m = word1.length();
        int n = word2.length();
        
        vector<int> dp(n + 1);
        
        // Initialize
        for (int j = 0; j <= n; j++) {
            dp[j] = j;
        }
        
        // Fill DP array
        for (int i = 1; i <= m; i++) {
            int prev = dp[0];
            dp[0] = i;
            
            for (int j = 1; j <= n; j++) {
                int temp = dp[j];
                
                if (word1[i-1] == word2[j-1]) {
                    dp[j] = prev;
                } else {
                    dp[j] = 1 + min({dp[j-1], dp[j], prev});
                }
                
                prev = temp;
            }
        }
        
        return dp[n];
    }
};

/*
 * APPROACH 5: RECURSIVE (NO MEMOIZATION - FOR UNDERSTANDING)
 * 
 * Intuition:
 * - Pure recursive solution
 * - Shows the problem structure clearly
 * - Exponential time, not practical
 * 
 * Algorithm:
 * 1. Base cases: empty strings
 * 2. If characters match, recurse
 * 3. Otherwise, try all operations
 * 4. Return minimum
 * 
 * Time Complexity: O(3^(m+n)) - exponential
 * Space Complexity: O(m + n) - recursion stack
 */
class Solution5 {
private:
    int helper(string& word1, string& word2, int i, int j) {
        // Base cases
        if (i == 0) return j;
        if (j == 0) return i;
        
        if (word1[i-1] == word2[j-1]) {
            return helper(word1, word2, i-1, j-1);
        }
        
        // Try all three operations
        int insert = helper(word1, word2, i, j-1);
        int del = helper(word1, word2, i-1, j);
        int replace = helper(word1, word2, i-1, j-1);
        
        return 1 + min({insert, del, replace});
    }
    
public:
    int minDistance(string word1, string word2) {
        return helper(word1, word2, word1.length(), word2.length());
    }
};

// Test function
void test(string word1, string word2, int approach) {
    int result;
    
    cout << "Input: word1 = \"" << word1 << "\", word2 = \"" << word2 << "\"\n";
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.minDistance(word1, word2);
            cout << "Approach 1 (2D DP): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.minDistance(word1, word2);
            cout << "Approach 2 (Space-Optimized): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.minDistance(word1, word2);
            cout << "Approach 3 (Memoization): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.minDistance(word1, word2);
            cout << "Approach 4 (Single Array): ";
            break;
        }
        case 5: {
            // Skip for long strings (exponential time)
            if (word1.length() <= 5 && word2.length() <= 5) {
                Solution5 sol;
                result = sol.minDistance(word1, word2);
                cout << "Approach 5 (Pure Recursive): ";
            } else {
                cout << "Approach 5 (Pure Recursive): Skipped (too slow)\n\n";
                return;
            }
            break;
        }
    }
    
    cout << result << "\n\n";
}

int main() {
    // Test Case 1: Standard case
    cout << "Test Case 1: Standard case\n";
    for (int i = 1; i <= 5; i++) {
        test("horse", "ros", i);
    }
    
    // Test Case 2: Longer strings
    cout << "Test Case 2: Longer strings\n";
    for (int i = 1; i <= 4; i++) { // Skip approach 5
        test("intention", "execution", i);
    }
    
    // Test Case 3: Empty string
    cout << "Test Case 3: Empty string\n";
    for (int i = 1; i <= 5; i++) {
        test("", "abc", i);
    }
    
    // Test Case 4: Same strings
    cout << "Test Case 4: Same strings\n";
    for (int i = 1; i <= 5; i++) {
        test("abc", "abc", i);
    }
    
    // Test Case 5: One character difference
    cout << "Test Case 5: One character\n";
    for (int i = 1; i <= 5; i++) {
        test("a", "b", i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (2D DP):
 * - Time: O(m * n)
 * - Space: O(m * n)
 * - Best for: Clear visualization, easy to understand
 * 
 * Approach 2 (Space-Optimized):
 * - Time: O(m * n)
 * - Space: O(n) - two arrays
 * - Best for: Space optimization
 * 
 * Approach 3 (Memoization):
 * - Time: O(m * n)
 * - Space: O(m * n) + recursion stack
 * - Best for: Top-down thinking
 * 
 * Approach 4 (Single Array):
 * - Time: O(m * n)
 * - Space: O(min(m, n))
 * - Best for: Maximum space efficiency
 * 
 * Approach 5 (Pure Recursive):
 * - Time: O(3^(m+n)) - exponential
 * - Space: O(m + n)
 * - Best for: Understanding problem structure
 * 
 * INTERVIEW TIPS:
 * 1. Start with 2D DP (Approach 1) - most intuitive
 * 2. Explain the three operations clearly
 * 3. Draw small example to show DP table
 * 4. Mention space optimization if asked
 * 5. This is a classic DP problem - know it well
 * 
 * COMMON MISTAKES:
 * 1. Incorrect base cases (empty strings)
 * 2. Off-by-one errors in indexing
 * 3. Not considering all three operations
 * 4. Confusing insert and delete operations
 * 5. Not handling empty string cases
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. Can you print the actual operations? (Track path in DP)
 * 2. What if operations have different costs? (Modify recurrence)
 * 3. Can you do it in O(min(m,n)) space? (Yes, Approach 4)
 * 4. What if strings are very long? (Use space-optimized version)
 * 5. How to handle Unicode characters? (Same algorithm)
 * 
 * RELATED PROBLEMS:
 * - Longest Common Subsequence
 * - Delete Operation for Two Strings
 * - Minimum ASCII Delete Sum
 * - One Edit Distance
 * - Edit Distance II
 * 
 * KEY INSIGHTS:
 * 1. Classic DP problem with clear recurrence
 * 2. Three operations lead to three subproblems
 * 3. Can optimize space from O(m*n) to O(min(m,n))
 * 4. Memoization and tabulation both work well
 * 5. Base cases are crucial: empty strings
 */

// Made with Bob
