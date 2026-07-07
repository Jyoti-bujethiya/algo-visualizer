/*
 * LeetCode Problem #20: Valid Parentheses
 * Difficulty: Easy
 * Link: https://leetcode.com/problems/valid-parentheses/
 * 
 * Problem Statement:
 * Given a string s containing just the characters '(', ')', '{', '}', '[' and ']',
 * determine if the input string is valid. An input string is valid if:
 * 1. Open brackets must be closed by the same type of brackets.
 * 2. Open brackets must be closed in the correct order.
 */

#include <string>
#include <stack>
#include <unordered_map>
#include <iostream>
using namespace std;

class Solution {
public:
    // ==================== APPROACH 1: Stack (Optimal) ====================
    /*
     * Algorithm:
     * - Use stack to track opening brackets
     * - For each character:
     *   - If opening bracket: push to stack
     *   - If closing bracket: check if matches top of stack
     * - At end, stack should be empty
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     * 
     * When to use: This is the OPTIMAL solution
     * 
     * Key Insight:
     * - Stack naturally handles nested structures
     * - Last opened bracket must be first closed (LIFO)
     * - Use hash map for bracket matching
     */
    bool isValid(string s) {
        stack<char> st;
        unordered_map<char, char> pairs = {
            {')', '('},
            {'}', '{'},
            {']', '['}
        };
        
        for (char c : s) {
            // If closing bracket
            if (pairs.count(c)) {
                // Check if stack is empty or top doesn't match
                if (st.empty() || st.top() != pairs[c]) {
                    return false;
                }
                st.pop();
            } else {
                // Opening bracket: push to stack
                st.push(c);
            }
        }
        
        // Valid if all brackets matched (stack empty)
        return st.empty();
    }
    
    // ==================== APPROACH 2: Stack with Switch ====================
    /*
     * Same logic but using switch statement
     * 
     * Time Complexity: O(n)
     * Space Complexity: O(n)
     */
    bool isValid_Switch(string s) {
        stack<char> st;
        
        for (char c : s) {
            switch(c) {
                case '(':
                case '{':
                case '[':
                    st.push(c);
                    break;
                case ')':
                    if (st.empty() || st.top() != '(') return false;
                    st.pop();
                    break;
                case '}':
                    if (st.empty() || st.top() != '{') return false;
                    st.pop();
                    break;
                case ']':
                    if (st.empty() || st.top() != '[') return false;
                    st.pop();
                    break;
            }
        }
        
        return st.empty();
    }
    
    // ==================== APPROACH 3: Replace Method (Not Recommended) ====================
    /*
     * Keep replacing valid pairs until no more replacements
     * 
     * Time Complexity: O(n²) - multiple passes
     * Space Complexity: O(n)
     * 
     * When to use: Never (inefficient)
     */
    bool isValid_Replace(string s) {
        while (s.find("()") != string::npos || 
               s.find("{}") != string::npos || 
               s.find("[]") != string::npos) {
            size_t pos;
            if ((pos = s.find("()")) != string::npos) {
                s.erase(pos, 2);
            } else if ((pos = s.find("{}")) != string::npos) {
                s.erase(pos, 2);
            } else if ((pos = s.find("[]")) != string::npos) {
                s.erase(pos, 2);
            }
        }
        return s.empty();
    }
};

// ==================== TEST CASES ====================
void runTests() {
    Solution sol;
    
    // Test Case 1: Valid simple
    cout << "Test 1: " << (sol.isValid("()") ? "true" : "false") << endl;
    // Expected: true
    
    // Test Case 2: Valid nested
    cout << "Test 2: " << (sol.isValid("()[]{}") ? "true" : "false") << endl;
    // Expected: true
    
    // Test Case 3: Invalid - wrong order
    cout << "Test 3: " << (sol.isValid("(]") ? "true" : "false") << endl;
    // Expected: false
    
    // Test Case 4: Valid deeply nested
    cout << "Test 4: " << (sol.isValid("{[]}") ? "true" : "false") << endl;
    // Expected: true
    
    // Test Case 5: Invalid - unmatched
    cout << "Test 5: " << (sol.isValid("([)]") ? "true" : "false") << endl;
    // Expected: false
    
    // Test Case 6: Invalid - extra closing
    cout << "Test 6: " << (sol.isValid("())(") ? "true" : "false") << endl;
    // Expected: false
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. Stack with HashMap (RECOMMENDED):
 *    Time: O(n), Space: O(n)
 *    Clean, efficient, easy to extend
 * 
 * 2. Stack with Switch:
 *    Time: O(n), Space: O(n)
 *    Slightly faster, more verbose
 * 
 * 3. Replace Method:
 *    Time: O(n²), Space: O(n)
 *    Inefficient, not recommended
 * 
 * INTERVIEW TIPS:
 * - Explain why stack is natural choice (LIFO)
 * - Mention that we only push opening brackets
 * - Handle edge cases: empty string, single bracket
 * - Discuss space optimization (not possible here)
 * - Can extend to handle more bracket types easily
 * 
 * KEY INSIGHTS:
 * - Stack perfect for matching nested structures
 * - Last opened must be first closed
 * - Only need to store opening brackets
 * - Hash map makes code cleaner and extensible
 * 
 * STEP-BY-STEP for "{[]}":
 * 
 * i=0: '{' -> push '{', stack: ['{']
 * i=1: '[' -> push '[', stack: ['{', '[']
 * i=2: ']' -> matches '[', pop, stack: ['{']
 * i=3: '}' -> matches '{', pop, stack: []
 * Result: stack empty -> valid
 * 
 * STEP-BY-STEP for "([)]":
 * 
 * i=0: '(' -> push '(', stack: ['(']
 * i=1: '[' -> push '[', stack: ['(', '[']
 * i=2: ')' -> doesn't match '[' -> invalid
 * 
 * COMMON MISTAKES:
 * - Not checking if stack is empty before popping
 * - Not checking if stack is empty at the end
 * - Trying to match closing with closing
 * - Not handling all bracket types
 * 
 * FOLLOW-UP QUESTIONS:
 * - Add more bracket types? (Extend hash map)
 * - Return position of first invalid bracket? (Track index)
 * - Fix invalid string? (More complex, need different approach)
 * - Handle escaped brackets? (Pre-process string)
 * 
 * RELATED PROBLEMS:
 * - Generate Parentheses (LeetCode #22)
 * - Longest Valid Parentheses (LeetCode #32)
 * - Remove Invalid Parentheses (LeetCode #301)
 * - Minimum Add to Make Parentheses Valid (LeetCode #921)
 * 
 * EDGE CASES:
 * - Empty string: valid (return true)
 * - Single bracket: invalid
 * - Only opening brackets: invalid
 * - Only closing brackets: invalid
 * - Odd length: invalid (can't be balanced)
 * 
 * OPTIMIZATION NOTES:
 * - Can check length first (must be even)
 * - Can use array instead of hash map for fixed brackets
 * - Can't do better than O(n) time
 * - Can't do better than O(n) space in worst case
 */

// Made with Bob
