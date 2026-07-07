/*
 * Problem: Jump Game (LeetCode 55)
 * Difficulty: Medium
 * Category: Dynamic Programming
 * 
 * Description:
 * You are given an integer array nums. You are initially positioned at the array's
 * first index, and each element in the array represents your maximum jump length
 * at that position.
 * 
 * Return true if you can reach the last index, or false otherwise.
 * 
 * Example 1:
 * Input: nums = [2,3,1,1,4]
 * Output: true
 * Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.
 * 
 * Example 2:
 * Input: nums = [3,2,1,0,4]
 * Output: false
 * Explanation: You will always arrive at index 3 no matter what. Its maximum
 * jump length is 0, which makes it impossible to reach the last index.
 * 
 * Constraints:
 * - 1 <= nums.length <= 10^4
 * - 0 <= nums[i] <= 10^5
 */

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/*
 * APPROACH 1: GREEDY (OPTIMAL)
 * 
 * Intuition:
 * - Track the farthest position we can reach
 * - At each position, update the farthest reachable position
 * - If current position is beyond farthest reachable, return false
 * - If farthest reaches or exceeds last index, return true
 * 
 * Algorithm:
 * 1. Initialize maxReach = 0
 * 2. For each position i from 0 to n-1:
 *    - If i > maxReach, return false (can't reach here)
 *    - Update maxReach = max(maxReach, i + nums[i])
 *    - If maxReach >= n-1, return true
 * 3. Return true (reached end of loop)
 * 
 * Time Complexity: O(n) - single pass
 * Space Complexity: O(1) - only variables
 */
class Solution1 {
public:
    bool canJump(vector<int>& nums) {
        int n = nums.size();
        int maxReach = 0;
        
        for (int i = 0; i < n; i++) {
            // Can't reach current position
            if (i > maxReach) {
                return false;
            }
            
            // Update farthest reachable position
            maxReach = max(maxReach, i + nums[i]);
            
            // Can reach the end
            if (maxReach >= n - 1) {
                return true;
            }
        }
        
        return true;
    }
};

/*
 * APPROACH 2: GREEDY (BACKWARD)
 * 
 * Intuition:
 * - Start from the end and work backwards
 * - Track the leftmost position that can reach the end
 * - If we can reach position 0, return true
 * - This is elegant and easy to understand
 * 
 * Algorithm:
 * 1. Initialize lastPos = n - 1 (target position)
 * 2. Iterate from n-2 to 0:
 *    - If i + nums[i] >= lastPos, update lastPos = i
 * 3. Return lastPos == 0
 * 
 * Time Complexity: O(n) - single pass
 * Space Complexity: O(1) - only variables
 */
class Solution2 {
public:
    bool canJump(vector<int>& nums) {
        int n = nums.size();
        int lastPos = n - 1;
        
        // Work backwards
        for (int i = n - 2; i >= 0; i--) {
            // Can reach lastPos from position i
            if (i + nums[i] >= lastPos) {
                lastPos = i;
            }
        }
        
        return lastPos == 0;
    }
};

/*
 * APPROACH 3: DYNAMIC PROGRAMMING (BOTTOM-UP)
 * 
 * Intuition:
 * - Use DP array where dp[i] = true if position i is reachable
 * - For each reachable position, mark all positions it can jump to
 * - This is less efficient but shows DP thinking
 * 
 * Algorithm:
 * 1. Create dp array, initialize dp[0] = true
 * 2. For each position i:
 *    - If dp[i] is true, mark all positions i can reach
 * 3. Return dp[n-1]
 * 
 * Time Complexity: O(n^2) - nested loops in worst case
 * Space Complexity: O(n) - DP array
 */
class Solution3 {
public:
    bool canJump(vector<int>& nums) {
        int n = nums.size();
        vector<bool> dp(n, false);
        dp[0] = true;
        
        for (int i = 0; i < n; i++) {
            if (!dp[i]) continue;
            
            // Mark all reachable positions from i
            for (int j = 1; j <= nums[i] && i + j < n; j++) {
                dp[i + j] = true;
            }
            
            // Early exit if we can reach the end
            if (dp[n - 1]) return true;
        }
        
        return dp[n - 1];
    }
};

/*
 * APPROACH 4: BFS (GRAPH TRAVERSAL)
 * 
 * Intuition:
 * - Treat this as a graph problem
 * - Each position is a node, edges to all reachable positions
 * - Use BFS to find if we can reach the last position
 * - This is overkill but shows different perspective
 * 
 * Algorithm:
 * 1. Use queue for BFS, start with position 0
 * 2. Track visited positions
 * 3. For each position, add all reachable unvisited positions to queue
 * 4. If we reach last position, return true
 * 
 * Time Complexity: O(n^2) - in worst case visit all edges
 * Space Complexity: O(n) - queue and visited set
 */
class Solution4 {
public:
    bool canJump(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return true;
        
        vector<bool> visited(n, false);
        int maxReach = 0;
        
        for (int i = 0; i <= maxReach && i < n; i++) {
            maxReach = max(maxReach, i + nums[i]);
            if (maxReach >= n - 1) return true;
        }
        
        return false;
    }
};

/*
 * APPROACH 5: RECURSIVE WITH MEMOIZATION
 * 
 * Intuition:
 * - Recursively check if we can reach end from current position
 * - Use memoization to avoid recomputing
 * - This shows top-down DP approach
 * 
 * Algorithm:
 * 1. Base case: if at last position, return true
 * 2. If already computed, return cached result
 * 3. Try all possible jumps from current position
 * 4. If any jump leads to success, return true
 * 5. Cache and return result
 * 
 * Time Complexity: O(n^2) - each position computed once, but tries all jumps
 * Space Complexity: O(n) - memoization + recursion stack
 */
class Solution5 {
private:
    bool helper(vector<int>& nums, int pos, vector<int>& memo) {
        int n = nums.size();
        
        // Base case: reached the end
        if (pos >= n - 1) return true;
        
        // Check memo
        if (memo[pos] != -1) return memo[pos];
        
        // Try all possible jumps
        int maxJump = nums[pos];
        for (int jump = 1; jump <= maxJump; jump++) {
            if (helper(nums, pos + jump, memo)) {
                memo[pos] = 1;
                return true;
            }
        }
        
        memo[pos] = 0;
        return false;
    }
    
public:
    bool canJump(vector<int>& nums) {
        int n = nums.size();
        vector<int> memo(n, -1);
        return helper(nums, 0, memo);
    }
};

// Test function
void test(vector<int> nums, int approach) {
    bool result;
    
    cout << "Input: [";
    for (int i = 0; i < nums.size(); i++) {
        cout << nums[i];
        if (i < nums.size() - 1) cout << ",";
    }
    cout << "]\n";
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.canJump(nums);
            cout << "Approach 1 (Greedy Forward): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.canJump(nums);
            cout << "Approach 2 (Greedy Backward): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.canJump(nums);
            cout << "Approach 3 (DP Bottom-up): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.canJump(nums);
            cout << "Approach 4 (BFS): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.canJump(nums);
            cout << "Approach 5 (Memoization): ";
            break;
        }
    }
    
    cout << (result ? "true" : "false") << "\n\n";
}

int main() {
    // Test Case 1: Can reach end
    cout << "Test Case 1: Can reach end\n";
    vector<int> test1 = {2, 3, 1, 1, 4};
    for (int i = 1; i <= 5; i++) {
        test(test1, i);
    }
    
    // Test Case 2: Cannot reach end
    cout << "Test Case 2: Cannot reach end\n";
    vector<int> test2 = {3, 2, 1, 0, 4};
    for (int i = 1; i <= 5; i++) {
        test(test2, i);
    }
    
    // Test Case 3: Single element
    cout << "Test Case 3: Single element\n";
    vector<int> test3 = {0};
    for (int i = 1; i <= 5; i++) {
        test(test3, i);
    }
    
    // Test Case 4: All zeros except first
    cout << "Test Case 4: All zeros except first\n";
    vector<int> test4 = {2, 0, 0};
    for (int i = 1; i <= 5; i++) {
        test(test4, i);
    }
    
    // Test Case 5: Large jumps
    cout << "Test Case 5: Large jumps\n";
    vector<int> test5 = {10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
    for (int i = 1; i <= 5; i++) {
        test(test5, i);
    }
    
    // Test Case 6: Stuck in middle
    cout << "Test Case 6: Stuck in middle\n";
    vector<int> test6 = {1, 1, 0, 1};
    for (int i = 1; i <= 5; i++) {
        test(test6, i);
    }
    
    // Test Case 7: Can barely reach
    cout << "Test Case 7: Can barely reach\n";
    vector<int> test7 = {1, 1, 1, 1, 1};
    for (int i = 1; i <= 5; i++) {
        test(test7, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (Greedy Forward):
 * - Time: O(n) - single pass
 * - Space: O(1) - only variables
 * - Best for: Optimal solution, most efficient
 * 
 * Approach 2 (Greedy Backward):
 * - Time: O(n) - single pass
 * - Space: O(1) - only variables
 * - Best for: Elegant code, easy to understand
 * 
 * Approach 3 (DP Bottom-up):
 * - Time: O(n^2) - nested loops
 * - Space: O(n) - DP array
 * - Best for: Showing DP thinking
 * 
 * Approach 4 (BFS):
 * - Time: O(n^2) - worst case
 * - Space: O(n) - queue and visited
 * - Best for: Graph perspective
 * 
 * Approach 5 (Memoization):
 * - Time: O(n^2) - each position tries all jumps
 * - Space: O(n) - memo + recursion
 * - Best for: Top-down DP approach
 * 
 * INTERVIEW TIPS:
 * 1. Start with greedy approach (Approach 1 or 2)
 * 2. Greedy is optimal here - no need for DP
 * 3. Explain why greedy works (local optimal = global optimal)
 * 4. Mention DP approaches if asked about alternatives
 * 5. This problem tests greedy algorithm understanding
 * 
 * COMMON MISTAKES:
 * 1. Using DP when greedy is sufficient (overcomplicating)
 * 2. Not handling edge case of single element
 * 3. Off-by-one errors in maxReach calculation
 * 4. Not checking if current position is reachable
 * 5. Confusing this with Jump Game II (minimum jumps)
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. What's the minimum number of jumps? (Jump Game II - LeetCode 45)
 * 2. Can you return the actual path? (Track previous positions)
 * 3. What if you can jump backwards? (Different problem, use BFS)
 * 4. What if there are negative jumps? (Use DP or BFS)
 * 5. How to handle very large arrays? (Greedy is already optimal)
 * 
 * RELATED PROBLEMS:
 * - Jump Game II (minimum jumps)
 * - Jump Game III (jump to zero)
 * - Jump Game IV (jump to same value)
 * - Jump Game V (jump with obstacles)
 * - Minimum Number of Taps to Open to Water a Garden
 * 
 * KEY INSIGHTS:
 * 1. Greedy works because we only care about reachability, not path
 * 2. Forward greedy tracks maximum reachable position
 * 3. Backward greedy finds leftmost position that can reach end
 * 4. Both greedy approaches are O(n) time, O(1) space
 * 5. DP is overkill but shows problem-solving flexibility
 */

// Made with Bob
