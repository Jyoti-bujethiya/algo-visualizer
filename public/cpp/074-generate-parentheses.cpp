/*
 * Problem: Generate Parentheses (LeetCode 22)
 * Link: https://leetcode.com/problems/generate-parentheses/
 * Difficulty: Medium
 * Category: Backtracking and Recursion
 * 
 * Description:
 * Given n pairs of parentheses, write a function to generate all combinations of
 * well-formed parentheses.
 * 
 * Example 1:
 * Input: n = 3
 * Output: ["((()))","(()())","(())()","()(())","()()()"]
 * 
 * Example 2:
 * Input: n = 1
 * Output: ["()"]
 * 
 * Constraints:
 * - 1 <= n <= 8
 */

#include <iostream>
#include <vector>
#include <string>
#include <stack>
using namespace std;

/*
 * APPROACH 1: BACKTRACKING (OPTIMAL)
 * 
 * Intuition:
 * - Build valid combinations by adding '(' or ')' one at a time
 * - Track count of open and close parentheses
 * - Can add '(' if open < n
 * - Can add ')' if close < open (ensures validity)
 * - Backtrack when combination is complete
 * 
 * Algorithm:
 * 1. Start with empty string
 * 2. At each step:
 *    - If open < n, add '(' and recurse
 *    - If close < open, add ')' and recurse
 * 3. Base case: when length == 2*n, add to result
 * 4. Return all valid combinations
 * 
 * Time Complexity: O(4^n / sqrt(n)) - Catalan number
 * Space Complexity: O(n) - recursion stack
 */
class Solution1 {
private:
    vector<string> result;
    
    void backtrack(string current, int open, int close, int n) {
        if (current.length() == 2 * n) {
            result.push_back(current);
            return;
        }
        
        if (open < n) {
            backtrack(current + '(', open + 1, close, n);
        }
        
        if (close < open) {
            backtrack(current + ')', open, close + 1, n);
        }
    }
    
public:
    vector<string> generateParenthesis(int n) {
        backtrack("", 0, 0, n);
        return result;
    }
};

/*
 * APPROACH 2: BACKTRACKING WITH STRING REFERENCE
 * 
 * Intuition:
 * - Same as Approach 1 but pass string by reference
 * - More efficient (no string copying)
 * - Must backtrack by removing characters
 * 
 * Algorithm:
 * Same as Approach 1 with reference passing
 * 
 * Time Complexity: O(4^n / sqrt(n))
 * Space Complexity: O(n)
 */
class Solution2 {
private:
    vector<string> result;
    
    void backtrack(string& current, int open, int close, int n) {
        if (current.length() == 2 * n) {
            result.push_back(current);
            return;
        }
        
        if (open < n) {
            current.push_back('(');
            backtrack(current, open + 1, close, n);
            current.pop_back();
        }
        
        if (close < open) {
            current.push_back(')');
            backtrack(current, open, close + 1, n);
            current.pop_back();
        }
    }
    
public:
    vector<string> generateParenthesis(int n) {
        string current;
        backtrack(current, 0, 0, n);
        return result;
    }
};

/*
 * APPROACH 3: CLOSURE NUMBER (MATHEMATICAL)
 * 
 * Intuition:
 * - Use recurrence relation based on Catalan numbers
 * - For n pairs: (a)b where a has i pairs, b has n-1-i pairs
 * - Combine results from smaller subproblems
 * 
 * Algorithm:
 * 1. Base case: n=0 returns [""]
 * 2. For each i from 0 to n-1:
 *    - Generate all combinations with i pairs inside first ()
 *    - Generate all combinations with n-1-i pairs after
 *    - Combine: "(" + inside + ")" + after
 * 3. Return all combinations
 * 
 * Time Complexity: O(4^n / sqrt(n))
 * Space Complexity: O(4^n / sqrt(n))
 */
class Solution3 {
public:
    vector<string> generateParenthesis(int n) {
        if (n == 0) return {""};
        
        vector<string> result;
        
        for (int i = 0; i < n; i++) {
            vector<string> left = generateParenthesis(i);
            vector<string> right = generateParenthesis(n - 1 - i);
            
            for (const string& l : left) {
                for (const string& r : right) {
                    result.push_back("(" + l + ")" + r);
                }
            }
        }
        
        return result;
    }
};

/*
 * APPROACH 4: DYNAMIC PROGRAMMING
 * 
 * Intuition:
 * - Build solutions bottom-up
 * - dp[i] = all valid combinations with i pairs
 * - Use closure number approach iteratively
 * 
 * Algorithm:
 * 1. dp[0] = [""]
 * 2. For i from 1 to n:
 *    - For j from 0 to i-1:
 *      - Combine dp[j] and dp[i-1-j]
 * 3. Return dp[n]
 * 
 * Time Complexity: O(4^n / sqrt(n))
 * Space Complexity: O(4^n / sqrt(n))
 */
class Solution4 {
public:
    vector<string> generateParenthesis(int n) {
        vector<vector<string>> dp(n + 1);
        dp[0] = {""};
        
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                for (const string& left : dp[j]) {
                    for (const string& right : dp[i - 1 - j]) {
                        dp[i].push_back("(" + left + ")" + right);
                    }
                }
            }
        }
        
        return dp[n];
    }
};

/*
 * APPROACH 5: BFS WITH QUEUE
 * 
 * Intuition:
 * - Build combinations level by level
 * - Use queue to store partial combinations with counts
 * - Generate all valid next states
 * 
 * Algorithm:
 * 1. Start with empty string, 0 open, 0 close
 * 2. For each state in queue:
 *    - If complete, add to result
 *    - Otherwise, generate valid next states
 * 3. Return all complete combinations
 * 
 * Time Complexity: O(4^n / sqrt(n))
 * Space Complexity: O(4^n / sqrt(n))
 */
class Solution5 {
public:
    vector<string> generateParenthesis(int n) {
        vector<string> result;
        
        struct State {
            string str;
            int open;
            int close;
        };
        
        vector<State> queue;
        queue.push_back({"", 0, 0});
        
        while (!queue.empty()) {
            State curr = queue.back();
            queue.pop_back();
            
            if (curr.str.length() == 2 * n) {
                result.push_back(curr.str);
                continue;
            }
            
            if (curr.open < n) {
                queue.push_back({curr.str + '(', curr.open + 1, curr.close});
            }
            
            if (curr.close < curr.open) {
                queue.push_back({curr.str + ')', curr.open, curr.close + 1});
            }
        }
        
        return result;
    }
};

// Test function
void test(int n, int approach) {
    vector<string> result;
    
    cout << "Input: n = " << n << "\n";
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.generateParenthesis(n);
            cout << "Approach 1 (Backtracking): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.generateParenthesis(n);
            cout << "Approach 2 (Backtracking Ref): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.generateParenthesis(n);
            cout << "Approach 3 (Closure Number): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.generateParenthesis(n);
            cout << "Approach 4 (Dynamic Programming): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.generateParenthesis(n);
            cout << "Approach 5 (BFS): ";
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
    // Test Case 1: n = 1
    cout << "Test Case 1: n = 1\n";
    for (int i = 1; i <= 5; i++) {
        test(1, i);
    }
    
    // Test Case 2: n = 2
    cout << "Test Case 2: n = 2\n";
    for (int i = 1; i <= 5; i++) {
        test(2, i);
    }
    
    // Test Case 3: n = 3
    cout << "Test Case 3: n = 3\n";
    for (int i = 1; i <= 5; i++) {
        test(3, i);
    }
    
    // Test Case 4: n = 4
    cout << "Test Case 4: n = 4\n";
    for (int i = 1; i <= 5; i++) {
        test(4, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (Backtracking - OPTIMAL):
 * - Time: O(4^n / sqrt(n)) - Catalan number
 * - Space: O(n) - recursion stack
 * - Best for: Clean, standard solution
 * 
 * Approach 2 (Backtracking Ref):
 * - Time: O(4^n / sqrt(n))
 * - Space: O(n)
 * - Best for: Memory efficiency
 * 
 * Approach 3 (Closure Number):
 * - Time: O(4^n / sqrt(n))
 * - Space: O(4^n / sqrt(n))
 * - Best for: Mathematical approach
 * 
 * Approach 4 (Dynamic Programming):
 * - Time: O(4^n / sqrt(n))
 * - Space: O(4^n / sqrt(n))
 * - Best for: Bottom-up thinking
 * 
 * Approach 5 (BFS):
 * - Time: O(4^n / sqrt(n))
 * - Space: O(4^n / sqrt(n))
 * - Best for: Iterative preference
 * 
 * INTERVIEW TIPS:
 * 1. Start with Approach 1 (backtracking)
 * 2. Explain validity conditions clearly
 * 3. Draw recursion tree for n=2
 * 4. Mention Catalan number connection
 * 5. Discuss pruning strategy
 * 
 * COMMON MISTAKES:
 * 1. Not checking close < open condition
 * 2. Wrong base case (length vs count)
 * 3. Not backtracking properly
 * 4. Generating invalid combinations
 * 5. Wrong termination condition
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. How many valid combinations for n? (Catalan number)
 * 2. Can you do it iteratively? (Yes, Approach 5)
 * 3. What's the time complexity? (O(4^n / sqrt(n)))
 * 4. How to verify if string is valid? (Stack-based check)
 * 5. What if we want only unique combinations? (Already unique)
 * 
 * RELATED PROBLEMS:
 * - Valid Parentheses
 * - Longest Valid Parentheses
 * - Remove Invalid Parentheses
 * - Different Ways to Add Parentheses
 * - Minimum Add to Make Parentheses Valid
 * 
 * KEY INSIGHTS:
 * 1. Classic backtracking problem
 * 2. Validity ensured by close < open
 * 3. Number of solutions is Catalan number
 * 4. Can be solved recursively or iteratively
 * 5. Pruning prevents invalid combinations
 * 
 * VALIDITY CONDITIONS:
 * - Can add '(' if open < n
 * - Can add ')' if close < open
 * - These ensure well-formed parentheses
 * - No need to validate at end
 * - Pruning happens during generation
 * 
 * CATALAN NUMBER:
 * - C(n) = (2n)! / ((n+1)! * n!)
 * - C(0)=1, C(1)=1, C(2)=2, C(3)=5, C(4)=14
 * - Appears in many combinatorial problems
 * - This problem generates all Catalan structures
 * - Time complexity related to Catalan number
 * 
 * BACKTRACKING STRATEGY:
 * - Build solution incrementally
 * - Make choice: add '(' or ')'
 * - Check constraints before recursing
 * - Backtrack when complete
 * - Prune invalid branches early
 * 
 * CLOSURE NUMBER APPROACH:
 * - Based on recurrence: C(n) = sum(C(i) * C(n-1-i))
 * - Split into inside and after first pair
 * - Combine smaller subproblems
 * - Mathematical elegance
 * - Same complexity as backtracking
 */

// Made with Bob
