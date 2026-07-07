/*
 * Problem: Decode Ways
 * LeetCode: https://leetcode.com/problems/decode-ways/
 * 
 * Description:
 * A message containing letters from A-Z can be encoded into numbers using the following mapping:
 * 'A' -> "1"
 * 'B' -> "2"
 * ...
 * 'Z' -> "26"
 * 
 * To decode an encoded message, all the digits must be grouped then mapped back into letters
 * using the reverse of the mapping above (there may be multiple ways). For example, "11106"
 * can be mapped into:
 * - "AAJF" with the grouping (1 1 10 6)
 * - "KJF" with the grouping (11 10 6)
 * 
 * Note that the grouping (1 11 06) is invalid because "06" cannot be mapped into 'F' since "6"
 * is different from "06".
 * 
 * Given a string s containing only digits, return the number of ways to decode it.
 * 
 * Example 1:
 * Input: s = "12"
 * Output: 2
 * Explanation: "12" could be decoded as "AB" (1 2) or "L" (12).
 * 
 * Example 2:
 * Input: s = "226"
 * Output: 3
 * Explanation: "226" could be decoded as "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).
 * 
 * Example 3:
 * Input: s = "06"
 * Output: 0
 * Explanation: "06" cannot be mapped to "F" because of the leading zero.
 * 
 * Constraints:
 * - 1 <= s.length <= 100
 * - s contains only digits and may contain leading zero(s).
 * 
 * Difficulty: Medium
 * Topics: String, Dynamic Programming
 */

#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    /*
     * Approach 1: Dynamic Programming (Bottom-Up)
     * 
     * Intuition:
     * - dp[i] = number of ways to decode s[0..i-1]
     * - At each position, we can:
     *   1. Decode single digit (if valid: 1-9)
     *   2. Decode two digits (if valid: 10-26)
     * - dp[i] = dp[i-1] (if single valid) + dp[i-2] (if double valid)
     * 
     * Algorithm:
     * 1. Create dp array of size n+1
     * 2. Base case: dp[0] = 1 (empty string)
     * 3. For each position i:
     *    - Check if single digit is valid (1-9)
     *    - Check if two digits are valid (10-26)
     *    - Add corresponding dp values
     * 4. Return dp[n]
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     */
    int numDecodings_dp(string s) {
        int n = s.length();
        if (n == 0 || s[0] == '0') return 0;
        
        vector<int> dp(n + 1, 0);
        dp[0] = 1;  // Empty string
        dp[1] = 1;  // First character (already checked not '0')
        
        for (int i = 2; i <= n; i++) {
            // Check single digit
            int oneDigit = s[i-1] - '0';
            if (oneDigit >= 1 && oneDigit <= 9) {
                dp[i] += dp[i-1];
            }
            
            // Check two digits
            int twoDigits = (s[i-2] - '0') * 10 + (s[i-1] - '0');
            if (twoDigits >= 10 && twoDigits <= 26) {
                dp[i] += dp[i-2];
            }
        }
        
        return dp[n];
    }
    
    /*
     * Approach 2: Space Optimized DP
     * 
     * Intuition:
     * - Only need last two values (dp[i-1] and dp[i-2])
     * - Use two variables instead of array
     * - Similar to Fibonacci pattern
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    int numDecodings_optimized(string s) {
        int n = s.length();
        if (n == 0 || s[0] == '0') return 0;
        
        int prev2 = 1;  // dp[i-2]
        int prev1 = 1;  // dp[i-1]
        
        for (int i = 2; i <= n; i++) {
            int curr = 0;
            
            // Check single digit
            int oneDigit = s[i-1] - '0';
            if (oneDigit >= 1 && oneDigit <= 9) {
                curr += prev1;
            }
            
            // Check two digits
            int twoDigits = (s[i-2] - '0') * 10 + (s[i-1] - '0');
            if (twoDigits >= 10 && twoDigits <= 26) {
                curr += prev2;
            }
            
            prev2 = prev1;
            prev1 = curr;
        }
        
        return prev1;
    }
    
    /*
     * Approach 3: Recursive with Memoization
     * 
     * Intuition:
     * - Solve recursively with memoization
     * - At each position, try both single and double digit
     * - Cache results to avoid recomputation
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n) for memo + recursion stack
     */
    int decodeHelper(string& s, int index, vector<int>& memo) {
        if (index == s.length()) {
            return 1;  // Successfully decoded entire string
        }
        
        if (s[index] == '0') {
            return 0;  // Invalid: leading zero
        }
        
        if (memo[index] != -1) {
            return memo[index];
        }
        
        int ways = 0;
        
        // Try single digit
        ways += decodeHelper(s, index + 1, memo);
        
        // Try two digits
        if (index + 1 < s.length()) {
            int twoDigits = (s[index] - '0') * 10 + (s[index + 1] - '0');
            if (twoDigits >= 10 && twoDigits <= 26) {
                ways += decodeHelper(s, index + 2, memo);
            }
        }
        
        memo[index] = ways;
        return ways;
    }
    
    int numDecodings_memo(string s) {
        vector<int> memo(s.length(), -1);
        return decodeHelper(s, 0, memo);
    }
    
    /*
     * Approach 4: Iterative with Clear Logic
     * 
     * Intuition:
     * - Same as approach 1 but with clearer variable names
     * - Explicitly check validity conditions
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     */
    bool isValid(string s, int start, int length) {
        if (length == 1) {
            return s[start] != '0';
        }
        if (length == 2) {
            if (s[start] == '0') return false;
            int num = (s[start] - '0') * 10 + (s[start + 1] - '0');
            return num >= 10 && num <= 26;
        }
        return false;
    }
    
    int numDecodings_clear(string s) {
        int n = s.length();
        if (n == 0) return 0;
        
        vector<int> dp(n + 1, 0);
        dp[0] = 1;
        
        for (int i = 1; i <= n; i++) {
            // Single digit decode
            if (isValid(s, i - 1, 1)) {
                dp[i] += dp[i - 1];
            }
            
            // Two digit decode
            if (i >= 2 && isValid(s, i - 2, 2)) {
                dp[i] += dp[i - 2];
            }
        }
        
        return dp[n];
    }
    
    /*
     * Approach 5: Standard Solution (Most Common)
     * 
     * This is the most commonly used approach in interviews
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    int numDecodings(string s) {
        return numDecodings_optimized(s);
    }
};

/*
 * Test Cases
 */
void runTests() {
    Solution sol;
    
    // Test Case 1: Simple case
    cout << "Test 1 - Input: s=\"12\"" << endl;
    string s1 = "12";
    cout << "DP: " << sol.numDecodings_dp(s1) << endl;
    cout << "Optimized: " << sol.numDecodings_optimized(s1) << endl;
    cout << "Memoization: " << sol.numDecodings_memo(s1) << endl;
    cout << "Clear: " << sol.numDecodings_clear(s1) << endl;
    cout << "Expected: 2 (\"AB\" or \"L\")" << endl << endl;
    
    // Test Case 2: Multiple ways
    cout << "Test 2 - Input: s=\"226\"" << endl;
    string s2 = "226";
    cout << "Result: " << sol.numDecodings(s2) << endl;
    cout << "Expected: 3 (\"BZ\", \"VF\", or \"BBF\")" << endl << endl;
    
    // Test Case 3: Leading zero
    cout << "Test 3 - Input: s=\"06\"" << endl;
    string s3 = "06";
    cout << "Result: " << sol.numDecodings(s3) << endl;
    cout << "Expected: 0 (invalid)" << endl << endl;
    
    // Test Case 4: Single digit
    cout << "Test 4 - Input: s=\"1\"" << endl;
    string s4 = "1";
    cout << "Result: " << sol.numDecodings(s4) << endl;
    cout << "Expected: 1" << endl << endl;
    
    // Test Case 5: Zero in middle
    cout << "Test 5 - Input: s=\"10\"" << endl;
    string s5 = "10";
    cout << "Result: " << sol.numDecodings(s5) << endl;
    cout << "Expected: 1 (\"J\")" << endl << endl;
    
    // Test Case 6: Multiple zeros
    cout << "Test 6 - Input: s=\"2101\"" << endl;
    string s6 = "2101";
    cout << "Result: " << sol.numDecodings(s6) << endl;
    cout << "Expected: 1 (\"BAA\" or \"UJ\")" << endl << endl;
    
    // Test Case 7: All same digit
    cout << "Test 7 - Input: s=\"111\"" << endl;
    string s7 = "111";
    cout << "Result: " << sol.numDecodings(s7) << endl;
    cout << "Expected: 3 (\"AAA\", \"KA\", \"AK\")" << endl << endl;
    
    // Test Case 8: Invalid zero
    cout << "Test 8 - Input: s=\"230\"" << endl;
    string s8 = "230";
    cout << "Result: " << sol.numDecodings(s8) << endl;
    cout << "Expected: 0 (\"30\" is invalid)" << endl << endl;
}

int main() {
    cout << "Decode Ways - Multiple Approaches" << endl;
    cout << "==================================" << endl << endl;
    
    runTests();
    
    return 0;
}

/*
 * Complexity Analysis Summary:
 * 
 * Approach 1 (DP Array):
 * - Time: O(n)
 * - Space: O(n)
 * - Clear and intuitive
 * 
 * Approach 2 (Space Optimized):
 * - Time: O(n)
 * - Space: O(1)
 * - BEST for interviews: optimal space
 * 
 * Approach 3 (Memoization):
 * - Time: O(n)
 * - Space: O(n) + recursion stack
 * - Top-down approach
 * 
 * Approach 4 (Clear Logic):
 * - Time: O(n)
 * - Space: O(n)
 * - Most readable
 * 
 * Key Insights:
 * 1. Similar to climbing stairs (Fibonacci pattern)
 * 2. Two choices at each position: 1 digit or 2 digits
 * 3. Must validate: no leading zeros, range 1-26
 * 4. dp[i] depends only on dp[i-1] and dp[i-2]
 * 5. Can optimize space to O(1)
 * 
 * DP Recurrence:
 * dp[i] = ways to decode s[0..i-1]
 * 
 * dp[i] = {
 *   dp[i-1]  if s[i-1] is valid single digit (1-9)
 *   +
 *   dp[i-2]  if s[i-2:i] is valid two digits (10-26)
 * }
 * 
 * Example Walkthrough:
 * s = "226"
 * 
 * dp[0] = 1 (empty string)
 * dp[1] = 1 (decode "2" as "B")
 * 
 * At i=2 (s[0:2] = "22"):
 * - Single: "2" valid → dp[2] += dp[1] = 1
 * - Double: "22" valid (V) → dp[2] += dp[0] = 1
 * - dp[2] = 2
 * 
 * At i=3 (s[0:3] = "226"):
 * - Single: "6" valid → dp[3] += dp[2] = 2
 * - Double: "26" valid (Z) → dp[3] += dp[1] = 1
 * - dp[3] = 3
 * 
 * Valid Conditions:
 * - Single digit: 1-9 (not 0)
 * - Two digits: 10-26
 *   - First digit: 1 or 2
 *   - If first is 1: second can be 0-9
 *   - If first is 2: second can be 0-6
 * 
 * Invalid Cases:
 * 1. Leading zero: "06" → invalid
 * 2. Zero not after 1 or 2: "30" → invalid
 * 3. Number > 26: "27" → must decode as "2" "7"
 * 
 * Common Pitfalls:
 * 1. Forgetting to check for leading zeros
 * 2. Not handling "0" correctly
 * 3. Incorrect range check (10-26, not 1-26)
 * 4. Off-by-one errors in indexing
 * 5. Not initializing dp[0] = 1
 * 
 * Interview Tips:
 * 1. Start with DP array approach
 * 2. Draw table for small example
 * 3. Explain two choices at each position
 * 4. Mention Fibonacci-like pattern
 * 5. Discuss space optimization
 * 6. Handle edge cases: zeros, single digit
 * 7. Test with "0", "10", "20", "30"
 * 
 * Edge Cases to Test:
 * 1. Single digit: "1" → 1
 * 2. Leading zero: "06" → 0
 * 3. Zero after valid: "10" → 1
 * 4. Zero after invalid: "30" → 0
 * 5. All same: "111" → 3
 * 6. Large valid: "226" → 3
 * 7. Empty string: "" → 0 or 1 (depends on definition)
 * 
 * Why Space Optimization Works:
 * - dp[i] only depends on dp[i-1] and dp[i-2]
 * - Don't need entire array
 * - Use two variables: prev1 and prev2
 * - Update them as we go
 * - Similar to Fibonacci optimization
 * 
 * Real-World Applications:
 * 1. Morse code decoding
 * 2. DNA sequence analysis
 * 3. Barcode scanning
 * 4. Communication protocols
 * 5. Error correction codes
 * 
 * Extensions and Variations:
 * 1. Decode Ways II (with wildcards)
 * 2. Count distinct decodings
 * 3. Find all possible decodings
 * 4. Minimum cost decoding
 * 5. Decode with constraints
 * 
 * Related Problems:
 * - Climbing Stairs
 * - Fibonacci Number
 * - Decode Ways II
 * - Count Binary Substrings
 * - Unique Binary Search Trees
 */

// Made with Bob
