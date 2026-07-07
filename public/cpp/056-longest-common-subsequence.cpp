/*
 * Problem: Longest Common Subsequence
 * LeetCode: https://leetcode.com/problems/longest-common-subsequence/
 * 
 * Description:
 * Given two strings text1 and text2, return the length of their longest common subsequence.
 * If there is no common subsequence, return 0.
 * 
 * A subsequence of a string is a new string generated from the original string with some
 * characters (can be none) deleted without changing the relative order of the remaining characters.
 * 
 * A common subsequence of two strings is a subsequence that is common to both strings.
 * 
 * Example 1:
 * Input: text1 = "abcde", text2 = "ace"
 * Output: 3
 * Explanation: The longest common subsequence is "ace" and its length is 3.
 * 
 * Example 2:
 * Input: text1 = "abc", text2 = "abc"
 * Output: 3
 * Explanation: The longest common subsequence is "abc" and its length is 3.
 * 
 * Example 3:
 * Input: text1 = "abc", text2 = "def"
 * Output: 0
 * Explanation: There is no such common subsequence, so the result is 0.
 * 
 * Constraints:
 * - 1 <= text1.length, text2.length <= 1000
 * - text1 and text2 consist of only lowercase English characters.
 * 
 * Difficulty: Medium
 * Topics: String, Dynamic Programming
 */

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

class Solution {
public:
    /*
     * Approach 1: 2D Dynamic Programming (Bottom-Up)
     * 
     * Intuition:
     * - dp[i][j] = LCS length of text1[0..i-1] and text2[0..j-1]
     * - If characters match: dp[i][j] = dp[i-1][j-1] + 1
     * - If they don't match: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
     * 
     * Recurrence Relation:
     * dp[i][j] = {
     *   dp[i-1][j-1] + 1           if text1[i-1] == text2[j-1]
     *   max(dp[i-1][j], dp[i][j-1]) otherwise
     * }
     * 
     * Algorithm:
     * 1. Create (m+1) x (n+1) DP table
     * 2. Initialize first row and column to 0
     * 3. Fill table using recurrence relation
     * 4. Return dp[m][n]
     * 
     * Time Complexity: O(m * n)
     * Space Complexity: O(m * n)
     */
    int longestCommonSubsequence_2d(string text1, string text2) {
        int m = text1.length();
        int n = text2.length();
        
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1[i-1] == text2[j-1]) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                } else {
                    dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
                }
            }
        }
        
        return dp[m][n];
    }
    
    /*
     * Approach 2: Space Optimized (1D DP)
     * 
     * Intuition:
     * - Only need previous row to compute current row
     * - Use two 1D arrays instead of 2D array
     * - Alternate between them
     * 
     * Time Complexity: O(m * n)
     * Space Complexity: O(min(m, n))
     */
    int longestCommonSubsequence_1d(string text1, string text2) {
        // Make text2 the shorter string
        if (text1.length() < text2.length()) {
            swap(text1, text2);
        }
        
        int m = text1.length();
        int n = text2.length();
        
        vector<int> prev(n + 1, 0);
        vector<int> curr(n + 1, 0);
        
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1[i-1] == text2[j-1]) {
                    curr[j] = prev[j-1] + 1;
                } else {
                    curr[j] = max(prev[j], curr[j-1]);
                }
            }
            swap(prev, curr);
        }
        
        return prev[n];
    }
    
    /*
     * Approach 3: Further Space Optimized (Single Array)
     * 
     * Intuition:
     * - Use single array with careful update order
     * - Store diagonal value before overwriting
     * 
     * Time Complexity: O(m * n)
     * Space Complexity: O(min(m, n))
     */
    int longestCommonSubsequence_optimized(string text1, string text2) {
        if (text1.length() < text2.length()) {
            swap(text1, text2);
        }
        
        int m = text1.length();
        int n = text2.length();
        
        vector<int> dp(n + 1, 0);
        
        for (int i = 1; i <= m; i++) {
            int prev = 0;  // dp[i-1][j-1]
            for (int j = 1; j <= n; j++) {
                int temp = dp[j];  // Save current value
                if (text1[i-1] == text2[j-1]) {
                    dp[j] = prev + 1;
                } else {
                    dp[j] = max(dp[j], dp[j-1]);
                }
                prev = temp;  // Update prev for next iteration
            }
        }
        
        return dp[n];
    }
    
    /*
     * Approach 4: Recursive with Memoization (Top-Down)
     * 
     * Intuition:
     * - Solve recursively with memoization
     * - Cache results to avoid recomputation
     * 
     * Time Complexity: O(m * n)
     * Space Complexity: O(m * n) for memo + recursion stack
     */
    int lcsHelper(string& text1, string& text2, int i, int j, 
                  vector<vector<int>>& memo) {
        if (i == 0 || j == 0) {
            return 0;
        }
        
        if (memo[i][j] != -1) {
            return memo[i][j];
        }
        
        if (text1[i-1] == text2[j-1]) {
            memo[i][j] = 1 + lcsHelper(text1, text2, i-1, j-1, memo);
        } else {
            memo[i][j] = max(lcsHelper(text1, text2, i-1, j, memo),
                            lcsHelper(text1, text2, i, j-1, memo));
        }
        
        return memo[i][j];
    }
    
    int longestCommonSubsequence_memo(string text1, string text2) {
        int m = text1.length();
        int n = text2.length();
        vector<vector<int>> memo(m + 1, vector<int>(n + 1, -1));
        return lcsHelper(text1, text2, m, n, memo);
    }
    
    /*
     * Approach 5: With Path Reconstruction
     * 
     * Intuition:
     * - Same as 2D DP but also track the actual LCS
     * - Backtrack through DP table to build LCS string
     * 
     * Time Complexity: O(m * n)
     * Space Complexity: O(m * n)
     */
    string getLCS(string text1, string text2) {
        int m = text1.length();
        int n = text2.length();
        
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        
        // Fill DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1[i-1] == text2[j-1]) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                } else {
                    dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
                }
            }
        }
        
        // Backtrack to build LCS
        string lcs;
        int i = m, j = n;
        
        while (i > 0 && j > 0) {
            if (text1[i-1] == text2[j-1]) {
                lcs = text1[i-1] + lcs;
                i--;
                j--;
            } else if (dp[i-1][j] > dp[i][j-1]) {
                i--;
            } else {
                j--;
            }
        }
        
        return lcs;
    }
    
    /*
     * Approach 6: Standard Solution (Most Common)
     * 
     * This is the most commonly used approach in interviews
     * 
     * Time Complexity: O(m * n)
     * Space Complexity: O(m * n)
     */
    int longestCommonSubsequence(string text1, string text2) {
        return longestCommonSubsequence_2d(text1, text2);
    }
};

/*
 * Test Cases
 */
void runTests() {
    Solution sol;
    
    // Test Case 1: Standard case
    cout << "Test 1 - Input: text1=\"abcde\", text2=\"ace\"" << endl;
    string t1_1 = "abcde", t1_2 = "ace";
    cout << "2D DP: " << sol.longestCommonSubsequence_2d(t1_1, t1_2) << endl;
    cout << "1D DP: " << sol.longestCommonSubsequence_1d(t1_1, t1_2) << endl;
    cout << "Optimized: " << sol.longestCommonSubsequence_optimized(t1_1, t1_2) << endl;
    cout << "Memoization: " << sol.longestCommonSubsequence_memo(t1_1, t1_2) << endl;
    cout << "LCS String: \"" << sol.getLCS(t1_1, t1_2) << "\"" << endl;
    cout << "Expected: 3 (\"ace\")" << endl << endl;
    
    // Test Case 2: Identical strings
    cout << "Test 2 - Input: text1=\"abc\", text2=\"abc\"" << endl;
    string t2_1 = "abc", t2_2 = "abc";
    cout << "Result: " << sol.longestCommonSubsequence(t2_1, t2_2) << endl;
    cout << "LCS String: \"" << sol.getLCS(t2_1, t2_2) << "\"" << endl;
    cout << "Expected: 3 (\"abc\")" << endl << endl;
    
    // Test Case 3: No common subsequence
    cout << "Test 3 - Input: text1=\"abc\", text2=\"def\"" << endl;
    string t3_1 = "abc", t3_2 = "def";
    cout << "Result: " << sol.longestCommonSubsequence(t3_1, t3_2) << endl;
    cout << "Expected: 0" << endl << endl;
    
    // Test Case 4: One character match
    cout << "Test 4 - Input: text1=\"abc\", text2=\"xyz\"" << endl;
    string t4_1 = "abc", t4_2 = "xyz";
    cout << "Result: " << sol.longestCommonSubsequence(t4_1, t4_2) << endl;
    cout << "Expected: 0" << endl << endl;
    
    // Test Case 5: Complex case
    cout << "Test 5 - Input: text1=\"abcdefgh\", text2=\"acdgh\"" << endl;
    string t5_1 = "abcdefgh", t5_2 = "acdgh";
    cout << "Result: " << sol.longestCommonSubsequence(t5_1, t5_2) << endl;
    cout << "LCS String: \"" << sol.getLCS(t5_1, t5_2) << "\"" << endl;
    cout << "Expected: 5 (\"acdgh\")" << endl << endl;
    
    // Test Case 6: Reversed strings
    cout << "Test 6 - Input: text1=\"abc\", text2=\"cba\"" << endl;
    string t6_1 = "abc", t6_2 = "cba";
    cout << "Result: " << sol.longestCommonSubsequence(t6_1, t6_2) << endl;
    cout << "LCS String: \"" << sol.getLCS(t6_1, t6_2) << "\"" << endl;
    cout << "Expected: 1 (any single character)" << endl << endl;
}

int main() {
    cout << "Longest Common Subsequence - Multiple Approaches" << endl;
    cout << "=================================================" << endl << endl;
    
    runTests();
    
    return 0;
}

/*
 * Complexity Analysis Summary:
 * 
 * Approach 1 (2D DP):
 * - Time: O(m * n)
 * - Space: O(m * n)
 * - BEST for interviews: clear and intuitive
 * 
 * Approach 2 (1D DP):
 * - Time: O(m * n)
 * - Space: O(min(m, n))
 * - Space optimized version
 * 
 * Approach 3 (Single Array):
 * - Time: O(m * n)
 * - Space: O(min(m, n))
 * - Most space-efficient
 * 
 * Approach 4 (Memoization):
 * - Time: O(m * n)
 * - Space: O(m * n) + recursion stack
 * - Top-down approach
 * 
 * Approach 5 (With Path):
 * - Time: O(m * n)
 * - Space: O(m * n)
 * - Returns actual LCS string
 * 
 * Key Insights:
 * 1. Classic 2D DP problem
 * 2. Subsequence vs substring (order matters, not contiguous)
 * 3. Two choices at each position: match or skip
 * 4. Can optimize space to O(n)
 * 5. Can reconstruct actual LCS by backtracking
 * 
 * DP Table Example:
 * text1 = "abcde", text2 = "ace"
 * 
 *     ""  a  c  e
 * ""   0  0  0  0
 * a    0  1  1  1
 * b    0  1  1  1
 * c    0  1  2  2
 * d    0  1  2  2
 * e    0  1  2  3
 * 
 * Recurrence Relation Explained:
 * - If text1[i-1] == text2[j-1]:
 *   Characters match, extend LCS from dp[i-1][j-1]
 *   dp[i][j] = dp[i-1][j-1] + 1
 * 
 * - If text1[i-1] != text2[j-1]:
 *   Characters don't match, take max of:
 *   - Skip text1[i-1]: dp[i-1][j]
 *   - Skip text2[j-1]: dp[i][j-1]
 *   dp[i][j] = max(dp[i-1][j], dp[i][j-1])
 * 
 * Why This Works:
 * - dp[i][j] represents optimal solution for subproblem
 * - Each cell depends only on previous cells
 * - Build solution bottom-up from smaller subproblems
 * - Final answer is dp[m][n]
 * 
 * Space Optimization:
 * - Only need previous row to compute current row
 * - Can use two 1D arrays (prev and curr)
 * - Or single array with careful update order
 * - Reduces space from O(m*n) to O(min(m,n))
 * 
 * Backtracking for LCS String:
 * 1. Start at dp[m][n]
 * 2. If text1[i-1] == text2[j-1]:
 *    - Add character to LCS
 *    - Move diagonally (i--, j--)
 * 3. Else move to larger neighbor:
 *    - If dp[i-1][j] > dp[i][j-1]: move up (i--)
 *    - Else: move left (j--)
 * 4. Continue until i=0 or j=0
 * 
 * Common Pitfalls:
 * 1. Confusing subsequence with substring
 * 2. Off-by-one errors in indexing
 * 3. Incorrect base case initialization
 * 4. Wrong recurrence relation
 * 5. Not handling empty strings
 * 
 * Interview Tips:
 * 1. Start with 2D DP (most intuitive)
 * 2. Draw DP table for small example
 * 3. Explain recurrence relation clearly
 * 4. Mention space optimization exists
 * 5. Discuss how to reconstruct LCS if asked
 * 6. Handle edge cases: empty strings, no match
 * 7. Explain difference from longest common substring
 * 
 * Subsequence vs Substring:
 * - Subsequence: Order matters, not contiguous
 *   Example: "ace" is subsequence of "abcde"
 * - Substring: Must be contiguous
 *   Example: "bcd" is substring of "abcde"
 * 
 * Real-World Applications:
 * 1. Diff tools (git diff, file comparison)
 * 2. DNA sequence alignment
 * 3. Plagiarism detection
 * 4. Version control systems
 * 5. Text similarity measurement
 * 
 * Extensions and Variations:
 * 1. Longest Common Substring (must be contiguous)
 * 2. Shortest Common Supersequence
 * 3. Edit Distance (Levenshtein distance)
 * 4. LCS of three strings
 * 5. Minimum insertions/deletions to convert string
 * 
 * Related Problems:
 * - Edit Distance
 * - Longest Palindromic Subsequence
 * - Shortest Common Supersequence
 * - Delete Operation for Two Strings
 * - Minimum ASCII Delete Sum
 */

// Made with Bob
