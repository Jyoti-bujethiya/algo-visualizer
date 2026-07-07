/*
 * Problem: Letter Combinations of a Phone Number (LeetCode 17)
 * Link: https://leetcode.com/problems/letter-combinations-of-a-phone-number/
 * Difficulty: Medium
 * Category: Backtracking and Recursion
 * 
 * Description:
 * Given a string containing digits from 2-9 inclusive, return all possible letter
 * combinations that the number could represent. Return the answer in any order.
 * 
 * A mapping of digits to letters (just like on the telephone buttons) is given below.
 * Note that 1 does not map to any letters.
 * 
 * 2: abc, 3: def, 4: ghi, 5: jkl, 6: mno, 7: pqrs, 8: tuv, 9: wxyz
 * 
 * Example 1:
 * Input: digits = "23"
 * Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
 * 
 * Example 2:
 * Input: digits = ""
 * Output: []
 * 
 * Example 3:
 * Input: digits = "2"
 * Output: ["a","b","c"]
 * 
 * Constraints:
 * - 0 <= digits.length <= 4
 * - digits[i] is a digit in the range ['2', '9'].
 */

#include <iostream>
#include <vector>
#include <string>
#include <queue>
using namespace std;

/*
 * APPROACH 1: BACKTRACKING (OPTIMAL)
 * 
 * Intuition:
 * - Build combinations character by character
 * - For each digit, try all possible letters
 * - Backtrack when combination is complete
 * - Classic backtracking pattern
 * 
 * Algorithm:
 * 1. Create digit to letters mapping
 * 2. Use recursive backtracking:
 *    - Base case: current combination length == digits length
 *    - For each letter of current digit:
 *      - Add letter to current combination
 *      - Recurse for next digit
 *      - Remove letter (backtrack)
 * 3. Return all combinations
 * 
 * Time Complexity: O(4^n) where n is length of digits (max 4 letters per digit)
 * Space Complexity: O(n) - recursion stack
 */
class Solution1 {
private:
    vector<string> mapping = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    vector<string> result;
    
    void backtrack(const string& digits, int index, string& current) {
        if (index == digits.length()) {
            result.push_back(current);
            return;
        }
        
        string letters = mapping[digits[index] - '0'];
        for (char c : letters) {
            current.push_back(c);
            backtrack(digits, index + 1, current);
            current.pop_back();
        }
    }
    
public:
    vector<string> letterCombinations(string digits) {
        if (digits.empty()) return {};
        
        string current;
        backtrack(digits, 0, current);
        return result;
    }
};

/*
 * APPROACH 2: ITERATIVE WITH QUEUE (BFS)
 * 
 * Intuition:
 * - Build combinations level by level
 * - Use queue to store partial combinations
 * - For each digit, extend all existing combinations
 * 
 * Algorithm:
 * 1. Start with empty string in queue
 * 2. For each digit:
 *    - Process all combinations in queue
 *    - For each combination, add all possible letters
 *    - Add new combinations back to queue
 * 3. Return final combinations
 * 
 * Time Complexity: O(4^n)
 * Space Complexity: O(4^n) - queue size
 */
class Solution2 {
public:
    vector<string> letterCombinations(string digits) {
        if (digits.empty()) return {};
        
        vector<string> mapping = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
        queue<string> q;
        q.push("");
        
        for (char digit : digits) {
            string letters = mapping[digit - '0'];
            int size = q.size();
            
            for (int i = 0; i < size; i++) {
                string current = q.front();
                q.pop();
                
                for (char c : letters) {
                    q.push(current + c);
                }
            }
        }
        
        vector<string> result;
        while (!q.empty()) {
            result.push_back(q.front());
            q.pop();
        }
        
        return result;
    }
};

/*
 * APPROACH 3: ITERATIVE WITH VECTOR
 * 
 * Intuition:
 * - Similar to Approach 2 but use vector
 * - Build new combinations from existing ones
 * - More memory efficient than queue
 * 
 * Algorithm:
 * 1. Start with empty vector containing empty string
 * 2. For each digit:
 *    - Create new vector for extended combinations
 *    - For each existing combination:
 *      - Add all possible letters
 *    - Replace old vector with new one
 * 3. Return result
 * 
 * Time Complexity: O(4^n)
 * Space Complexity: O(4^n)
 */
class Solution3 {
public:
    vector<string> letterCombinations(string digits) {
        if (digits.empty()) return {};
        
        vector<string> mapping = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
        vector<string> result = {""};
        
        for (char digit : digits) {
            string letters = mapping[digit - '0'];
            vector<string> temp;
            
            for (const string& combination : result) {
                for (char c : letters) {
                    temp.push_back(combination + c);
                }
            }
            
            result = temp;
        }
        
        return result;
    }
};

/*
 * APPROACH 4: RECURSIVE WITHOUT HELPER
 * 
 * Intuition:
 * - Direct recursive approach
 * - Build combinations by prepending letters
 * - No separate helper function
 * 
 * Algorithm:
 * 1. Base case: empty digits returns empty vector
 * 2. Get combinations for remaining digits
 * 3. Prepend all letters of first digit
 * 4. Return combined results
 * 
 * Time Complexity: O(4^n)
 * Space Complexity: O(4^n)
 */
class Solution4 {
public:
    vector<string> letterCombinations(string digits) {
        if (digits.empty()) return {};
        
        vector<string> mapping = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
        
        if (digits.length() == 1) {
            vector<string> result;
            for (char c : mapping[digits[0] - '0']) {
                result.push_back(string(1, c));
            }
            return result;
        }
        
        vector<string> prev = letterCombinations(digits.substr(1));
        vector<string> result;
        
        for (char c : mapping[digits[0] - '0']) {
            for (const string& s : prev) {
                result.push_back(c + s);
            }
        }
        
        return result;
    }
};

/*
 * APPROACH 5: BACKTRACKING WITH INDEX PARAMETER
 * 
 * Intuition:
 * - Similar to Approach 1
 * - Pass result vector as parameter
 * - More explicit parameter passing
 * 
 * Algorithm:
 * Same as Approach 1 with different parameter style
 * 
 * Time Complexity: O(4^n)
 * Space Complexity: O(n)
 */
class Solution5 {
private:
    void backtrack(const string& digits, int index, string current, 
                   vector<string>& result, const vector<string>& mapping) {
        if (index == digits.length()) {
            result.push_back(current);
            return;
        }
        
        string letters = mapping[digits[index] - '0'];
        for (char c : letters) {
            backtrack(digits, index + 1, current + c, result, mapping);
        }
    }
    
public:
    vector<string> letterCombinations(string digits) {
        if (digits.empty()) return {};
        
        vector<string> mapping = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
        vector<string> result;
        backtrack(digits, 0, "", result, mapping);
        return result;
    }
};

// Test function
void test(string digits, int approach) {
    vector<string> result;
    
    cout << "Input: digits = \"" << digits << "\"\n";
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.letterCombinations(digits);
            cout << "Approach 1 (Backtracking): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.letterCombinations(digits);
            cout << "Approach 2 (BFS Queue): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.letterCombinations(digits);
            cout << "Approach 3 (Iterative Vector): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.letterCombinations(digits);
            cout << "Approach 4 (Pure Recursive): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.letterCombinations(digits);
            cout << "Approach 5 (Backtracking Alt): ";
            break;
        }
    }
    
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << "\"" << result[i] << "\"";
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]\n\n";
}

int main() {
    // Test Case 1: Two digits
    cout << "Test Case 1: Two digits\n";
    for (int i = 1; i <= 5; i++) {
        test("23", i);
    }
    
    // Test Case 2: Empty string
    cout << "Test Case 2: Empty string\n";
    for (int i = 1; i <= 5; i++) {
        test("", i);
    }
    
    // Test Case 3: Single digit
    cout << "Test Case 3: Single digit\n";
    for (int i = 1; i <= 5; i++) {
        test("2", i);
    }
    
    // Test Case 4: Three digits
    cout << "Test Case 4: Three digits\n";
    for (int i = 1; i <= 5; i++) {
        test("234", i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (Backtracking - OPTIMAL):
 * - Time: O(4^n * n) - 4^n combinations, n to build each
 * - Space: O(n) - recursion stack
 * - Best for: Clean, standard solution
 * 
 * Approach 2 (BFS Queue):
 * - Time: O(4^n * n)
 * - Space: O(4^n) - queue size
 * - Best for: Iterative preference
 * 
 * Approach 3 (Iterative Vector):
 * - Time: O(4^n * n)
 * - Space: O(4^n)
 * - Best for: Simple iterative
 * 
 * Approach 4 (Pure Recursive):
 * - Time: O(4^n * n)
 * - Space: O(4^n) - intermediate results
 * - Best for: Functional style
 * 
 * Approach 5 (Backtracking Alt):
 * - Time: O(4^n * n)
 * - Space: O(n)
 * - Best for: Explicit parameters
 * 
 * INTERVIEW TIPS:
 * 1. Start with Approach 1 (backtracking)
 * 2. Explain digit to letters mapping
 * 3. Draw recursion tree for small example
 * 4. Mention iterative alternative
 * 5. Discuss time complexity clearly
 * 
 * COMMON MISTAKES:
 * 1. Not handling empty string input
 * 2. Wrong digit to index conversion
 * 3. Not backtracking properly
 * 4. Forgetting to return empty for empty input
 * 5. Off-by-one errors in mapping array
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. What if we want combinations in specific order? (Use different traversal)
 * 2. Can you do it iteratively? (Yes, Approach 2 or 3)
 * 3. What's the space complexity? (O(n) for backtracking)
 * 4. How many total combinations? (Product of letter counts)
 * 5. What if digits can repeat? (Same algorithm works)
 * 
 * RELATED PROBLEMS:
 * - Generate Parentheses
 * - Combination Sum
 * - Permutations
 * - Subsets
 * - Word Search
 * 
 * KEY INSIGHTS:
 * 1. Classic backtracking problem
 * 2. Build combinations character by character
 * 3. Each digit adds one level to recursion
 * 4. Can be solved iteratively or recursively
 * 5. Time complexity is exponential
 * 
 * BACKTRACKING PATTERN:
 * - Choose: add letter to current combination
 * - Explore: recurse for next digit
 * - Unchoose: remove letter (backtrack)
 * - Base case: all digits processed
 * - Build solution incrementally
 * 
 * TIME COMPLEXITY ANALYSIS:
 * - Each digit has 3-4 letters
 * - Total combinations: 3^n to 4^n
 * - Building each combination: O(n)
 * - Total: O(4^n * n)
 * - For n=4 (max): ~256 combinations
 * 
 * ITERATIVE VS RECURSIVE:
 * - Recursive: cleaner code, uses stack
 * - Iterative: no stack overflow, more memory
 * - Both have same time complexity
 * - Backtracking is more intuitive
 * - Choose based on preference
 */

// Made with Bob
