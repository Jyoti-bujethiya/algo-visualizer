/*
 * Problem: Daily Temperatures (LeetCode 739)
 * Link: https://leetcode.com/problems/daily-temperatures/
 * Difficulty: Medium
 * Category: Stacks and Queues
 * 
 * Description:
 * Given an array of integers temperatures represents the daily temperatures,
 * return an array answer such that answer[i] is the number of days you have to
 * wait after the ith day to get a warmer temperature. If there is no future day
 * for which this is possible, keep answer[i] == 0 instead.
 * 
 * Example 1:
 * Input: temperatures = [73,74,75,71,69,72,76,73]
 * Output: [1,1,4,2,1,1,0,0]
 * 
 * Example 2:
 * Input: temperatures = [30,40,50,60]
 * Output: [1,1,1,0]
 * 
 * Example 3:
 * Input: temperatures = [30,60,90]
 * Output: [1,1,0]
 * 
 * Constraints:
 * - 1 <= temperatures.length <= 10^5
 * - 30 <= temperatures[i] <= 100
 */

#include <iostream>
#include <vector>
#include <stack>
using namespace std;

/*
 * APPROACH 1: MONOTONIC STACK (OPTIMAL)
 * 
 * Intuition:
 * - Use stack to track indices of temperatures waiting for warmer day
 * - Stack maintains decreasing temperature order
 * - When we find warmer temperature, pop all smaller temperatures from stack
 * - Calculate days difference for each popped index
 * 
 * Algorithm:
 * 1. Iterate through temperatures
 * 2. While stack not empty and current temp > stack top temp:
 *    - Pop index from stack
 *    - Calculate days = current index - popped index
 *    - Store in result
 * 3. Push current index to stack
 * 4. Return result
 * 
 * Time Complexity: O(n) - each element pushed and popped once
 * Space Complexity: O(n) - stack size
 */
class Solution1 {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> result(n, 0);
        stack<int> stk; // Store indices
        
        for (int i = 0; i < n; i++) {
            // Pop all temperatures smaller than current
            while (!stk.empty() && temperatures[i] > temperatures[stk.top()]) {
                int prevIndex = stk.top();
                stk.pop();
                result[prevIndex] = i - prevIndex;
            }
            
            stk.push(i);
        }
        
        return result;
    }
};

/*
 * APPROACH 2: BRUTE FORCE (FOR COMPARISON)
 * 
 * Intuition:
 * - For each day, search forward for warmer temperature
 * - Simple but inefficient
 * - Good for understanding the problem
 * 
 * Algorithm:
 * 1. For each index i:
 *    - Search from i+1 to end
 *    - Find first temperature > temperatures[i]
 *    - Calculate days difference
 * 2. Return result
 * 
 * Time Complexity: O(n^2) - nested loops
 * Space Complexity: O(1) - excluding output
 */
class Solution2 {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> result(n, 0);
        
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (temperatures[j] > temperatures[i]) {
                    result[i] = j - i;
                    break;
                }
            }
        }
        
        return result;
    }
};

/*
 * APPROACH 3: BACKWARD ITERATION WITH OPTIMIZATION
 * 
 * Intuition:
 * - Iterate from right to left
 * - Use result array to jump to next warmer day
 * - If result[j] == 0, no warmer day exists
 * - Otherwise, jump by result[j] days
 * 
 * Algorithm:
 * 1. Start from second last element
 * 2. For each position i:
 *    - Start checking from i+1
 *    - If temp[j] > temp[i], found answer
 *    - If temp[j] <= temp[i] and result[j] == 0, no answer
 *    - Otherwise, jump to j + result[j]
 * 3. Return result
 * 
 * Time Complexity: O(n) - amortized, each element visited constant times
 * Space Complexity: O(1) - excluding output
 */
class Solution3 {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> result(n, 0);
        
        for (int i = n - 2; i >= 0; i--) {
            int j = i + 1;
            
            while (j < n) {
                if (temperatures[j] > temperatures[i]) {
                    result[i] = j - i;
                    break;
                }
                
                if (result[j] == 0) {
                    break; // No warmer day exists
                }
                
                j += result[j]; // Jump to next potential warmer day
            }
        }
        
        return result;
    }
};

/*
 * APPROACH 4: ARRAY AS STACK
 * 
 * Intuition:
 * - Use array instead of stack for better cache locality
 * - Maintain stack pointer manually
 * - Same logic as monotonic stack
 * 
 * Algorithm:
 * 1. Use array to simulate stack
 * 2. Track stack size with pointer
 * 3. Same monotonic stack logic
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
class Solution4 {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> result(n, 0);
        vector<int> stack(n);
        int top = -1;
        
        for (int i = 0; i < n; i++) {
            while (top >= 0 && temperatures[i] > temperatures[stack[top]]) {
                int prevIndex = stack[top--];
                result[prevIndex] = i - prevIndex;
            }
            
            stack[++top] = i;
        }
        
        return result;
    }
};

/*
 * APPROACH 5: NEXT GREATER ELEMENT PATTERN
 * 
 * Intuition:
 * - This is a variant of "Next Greater Element" problem
 * - Use same monotonic stack pattern
 * - Store both index and temperature in stack
 * 
 * Algorithm:
 * 1. Use stack of pairs (index, temperature)
 * 2. For each element, pop smaller temperatures
 * 3. Calculate days for each popped element
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
class Solution5 {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> result(n, 0);
        stack<pair<int, int>> stk; // (index, temperature)
        
        for (int i = 0; i < n; i++) {
            while (!stk.empty() && temperatures[i] > stk.top().second) {
                auto [prevIndex, prevTemp] = stk.top();
                stk.pop();
                result[prevIndex] = i - prevIndex;
            }
            
            stk.push({i, temperatures[i]});
        }
        
        return result;
    }
};

// Test function
void test(vector<int> temperatures, int approach) {
    vector<int> result;
    
    cout << "Input: [";
    for (int i = 0; i < temperatures.size(); i++) {
        cout << temperatures[i];
        if (i < temperatures.size() - 1) cout << ",";
    }
    cout << "]\n";
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.dailyTemperatures(temperatures);
            cout << "Approach 1 (Monotonic Stack): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.dailyTemperatures(temperatures);
            cout << "Approach 2 (Brute Force): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.dailyTemperatures(temperatures);
            cout << "Approach 3 (Backward Iteration): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.dailyTemperatures(temperatures);
            cout << "Approach 4 (Array as Stack): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.dailyTemperatures(temperatures);
            cout << "Approach 5 (Next Greater Pattern): ";
            break;
        }
    }
    
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]\n\n";
}

int main() {
    // Test Case 1: Standard case
    cout << "Test Case 1: Standard case\n";
    vector<int> test1 = {73, 74, 75, 71, 69, 72, 76, 73};
    for (int i = 1; i <= 5; i++) {
        test(test1, i);
    }
    
    // Test Case 2: Increasing temperatures
    cout << "Test Case 2: Increasing\n";
    vector<int> test2 = {30, 40, 50, 60};
    for (int i = 1; i <= 5; i++) {
        test(test2, i);
    }
    
    // Test Case 3: Decreasing temperatures
    cout << "Test Case 3: Decreasing\n";
    vector<int> test3 = {90, 80, 70, 60};
    for (int i = 1; i <= 5; i++) {
        test(test3, i);
    }
    
    // Test Case 4: Single element
    cout << "Test Case 4: Single element\n";
    vector<int> test4 = {30};
    for (int i = 1; i <= 5; i++) {
        test(test4, i);
    }
    
    // Test Case 5: All same
    cout << "Test Case 5: All same\n";
    vector<int> test5 = {30, 30, 30};
    for (int i = 1; i <= 5; i++) {
        test(test5, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (Monotonic Stack):
 * - Time: O(n) - each element pushed/popped once
 * - Space: O(n) - stack size
 * - Best for: Optimal solution, most common
 * 
 * Approach 2 (Brute Force):
 * - Time: O(n^2) - nested loops
 * - Space: O(1)
 * - Best for: Understanding problem (not optimal)
 * 
 * Approach 3 (Backward Iteration):
 * - Time: O(n) - amortized
 * - Space: O(1) - excluding output
 * - Best for: Space-efficient solution
 * 
 * Approach 4 (Array as Stack):
 * - Time: O(n)
 * - Space: O(n)
 * - Best for: Better cache locality
 * 
 * Approach 5 (Next Greater Pattern):
 * - Time: O(n)
 * - Space: O(n)
 * - Best for: Showing pattern recognition
 * 
 * INTERVIEW TIPS:
 * 1. Recognize as "Next Greater Element" variant
 * 2. Start with Approach 1 (monotonic stack)
 * 3. Explain why stack maintains decreasing order
 * 4. Mention Approach 3 for space optimization
 * 5. Draw example to visualize stack operations
 * 
 * COMMON MISTAKES:
 * 1. Using max heap instead of stack (wrong data structure)
 * 2. Not initializing result array with zeros
 * 3. Storing temperatures instead of indices in stack
 * 4. Off-by-one errors in day calculation
 * 5. Not handling case where no warmer day exists
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. What if we want previous warmer day? (Iterate left to right)
 * 2. Can you do it in O(1) space? (Yes, Approach 3)
 * 3. What if temperatures can be negative? (Same algorithm)
 * 4. How to find next k warmer days? (More complex, use heap)
 * 5. What if we want exact temperature difference? (Store temps)
 * 
 * RELATED PROBLEMS:
 * - Next Greater Element I
 * - Next Greater Element II (circular)
 * - Online Stock Span
 * - Largest Rectangle in Histogram
 * - Trapping Rain Water
 * 
 * KEY INSIGHTS:
 * 1. Monotonic stack is key data structure
 * 2. Stack maintains decreasing temperature order
 * 3. Each element processed exactly once
 * 4. Backward iteration can save space
 * 5. This is a classic stack application
 * 
 * MONOTONIC STACK PATTERN:
 * - Used for "next greater/smaller element" problems
 * - Maintains increasing or decreasing order
 * - O(n) time complexity
 * - Each element pushed and popped at most once
 * - Very common in interviews
 */

// Made with Bob
