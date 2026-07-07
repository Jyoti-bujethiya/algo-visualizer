/*
 * Problem: Combination Sum
 * LeetCode: https://leetcode.com/problems/combination-sum/
 * 
 * Description:
 * Given an array of distinct integers candidates and a target integer target, return a list of
 * all unique combinations of candidates where the chosen numbers sum to target. You may return
 * the combinations in any order.
 * 
 * The same number may be chosen from candidates an unlimited number of times. Two combinations
 * are unique if the frequency of at least one of the chosen numbers is different.
 * 
 * The test cases are generated such that the number of unique combinations that sum up to target
 * is less than 150 combinations for the given input.
 * 
 * Example 1:
 * Input: candidates = [2,3,6,7], target = 7
 * Output: [[2,2,3],[7]]
 * Explanation:
 * 2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times.
 * 7 is a candidate, and 7 = 7.
 * These are the only two combinations.
 * 
 * Example 2:
 * Input: candidates = [2,3,5], target = 8
 * Output: [[2,2,2,2],[2,3,3],[3,5]]
 * 
 * Example 3:
 * Input: candidates = [2], target = 1
 * Output: []
 * 
 * Constraints:
 * - 1 <= candidates.length <= 30
 * - 2 <= candidates[i] <= 40
 * - All elements of candidates are distinct.
 * - 1 <= target <= 40
 * 
 * Difficulty: Medium
 * Topics: Array, Backtracking
 */

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    /*
     * Approach 1: Backtracking with Reuse
     * 
     * Intuition:
     * - Use backtracking to explore all combinations
     * - Can reuse same element multiple times
     * - Start from current index to avoid duplicates
     * - Prune when sum exceeds target
     * 
     * Algorithm:
     * 1. Sort candidates (optional, helps with pruning)
     * 2. For each candidate starting from index:
     *    - Add to current combination
     *    - If sum == target, add to result
     *    - If sum < target, recurse with same index (reuse allowed)
     *    - Backtrack by removing last element
     * 3. Return all valid combinations
     * 
     * Time Complexity: O(N^(T/M)) where N = candidates, T = target, M = min candidate
     * Space Complexity: O(T/M) for recursion depth
     */
    void backtrack(vector<int>& candidates, int target, int start,
                   vector<int>& current, vector<vector<int>>& result) {
        if (target == 0) {
            result.push_back(current);
            return;
        }
        
        if (target < 0) {
            return;  // Exceeded target
        }
        
        for (int i = start; i < candidates.size(); i++) {
            current.push_back(candidates[i]);
            // Can reuse same element, so pass i (not i+1)
            backtrack(candidates, target - candidates[i], i, current, result);
            current.pop_back();  // Backtrack
        }
    }
    
    vector<vector<int>> combinationSum_backtrack(vector<int>& candidates, int target) {
        vector<vector<int>> result;
        vector<int> current;
        backtrack(candidates, target, 0, current, result);
        return result;
    }
    
    /*
     * Approach 2: Backtracking with Early Pruning
     * 
     * Intuition:
     * - Sort candidates first
     * - Break early when candidate > remaining target
     * - More efficient pruning
     * 
     * Time Complexity: O(N^(T/M)) - better in practice
     * Space Complexity: O(T/M)
     */
    void backtrackPruned(vector<int>& candidates, int target, int start,
                         vector<int>& current, vector<vector<int>>& result) {
        if (target == 0) {
            result.push_back(current);
            return;
        }
        
        for (int i = start; i < candidates.size(); i++) {
            // Early pruning: if current candidate > target, no point continuing
            if (candidates[i] > target) {
                break;  // Since sorted, all remaining are also > target
            }
            
            current.push_back(candidates[i]);
            backtrackPruned(candidates, target - candidates[i], i, current, result);
            current.pop_back();
        }
    }
    
    vector<vector<int>> combinationSum_pruned(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());  // Sort for pruning
        vector<vector<int>> result;
        vector<int> current;
        backtrackPruned(candidates, target, 0, current, result);
        return result;
    }
    
    /*
     * Approach 3: Backtracking with Explicit Choice
     * 
     * Intuition:
     * - At each step, explicitly choose: include or exclude
     * - More intuitive for some people
     * 
     * Time Complexity: O(N^(T/M))
     * Space Complexity: O(T/M)
     */
    void backtrackChoice(vector<int>& candidates, int target, int index,
                         vector<int>& current, vector<vector<int>>& result) {
        if (target == 0) {
            result.push_back(current);
            return;
        }
        
        if (index >= candidates.size() || target < 0) {
            return;
        }
        
        // Include current candidate (can reuse)
        current.push_back(candidates[index]);
        backtrackChoice(candidates, target - candidates[index], index, current, result);
        current.pop_back();
        
        // Exclude current candidate (move to next)
        backtrackChoice(candidates, target, index + 1, current, result);
    }
    
    vector<vector<int>> combinationSum_choice(vector<int>& candidates, int target) {
        vector<vector<int>> result;
        vector<int> current;
        backtrackChoice(candidates, target, 0, current, result);
        return result;
    }
    
    /*
     * Approach 4: Dynamic Programming (Bottom-Up)
     * 
     * Intuition:
     * - Build combinations for each sum from 0 to target
     * - For each sum, try adding each candidate
     * - Less intuitive but shows DP perspective
     * 
     * Time Complexity: O(N * T * K) where K = avg combinations
     * Space Complexity: O(T * K)
     */
    vector<vector<int>> combinationSum_dp(vector<int>& candidates, int target) {
        vector<vector<vector<int>>> dp(target + 1);
        dp[0] = {{}};  // Base case: one way to make 0 (empty combination)
        
        for (int sum = 1; sum <= target; sum++) {
            for (int candidate : candidates) {
                if (candidate <= sum) {
                    for (auto& combo : dp[sum - candidate]) {
                        vector<int> newCombo = combo;
                        newCombo.push_back(candidate);
                        // Sort to avoid duplicates
                        sort(newCombo.begin(), newCombo.end());
                        
                        // Check if this combination already exists
                        bool exists = false;
                        for (auto& existing : dp[sum]) {
                            if (existing == newCombo) {
                                exists = true;
                                break;
                            }
                        }
                        
                        if (!exists) {
                            dp[sum].push_back(newCombo);
                        }
                    }
                }
            }
        }
        
        return dp[target];
    }
    
    /*
     * Approach 5: Standard Solution (Most Common)
     * 
     * This is the most commonly used approach in interviews
     * 
     * Time Complexity: O(N^(T/M))
     * Space Complexity: O(T/M)
     */
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        vector<vector<int>> result;
        vector<int> current;
        backtrackPruned(candidates, target, 0, current, result);
        return result;
    }
};

/*
 * Helper function to print results
 */
void printCombinations(const vector<vector<int>>& combinations) {
    cout << "[";
    for (int i = 0; i < combinations.size(); i++) {
        cout << "[";
        for (int j = 0; j < combinations[i].size(); j++) {
            cout << combinations[i][j];
            if (j < combinations[i].size() - 1) cout << ",";
        }
        cout << "]";
        if (i < combinations.size() - 1) cout << ",";
    }
    cout << "]" << endl;
}

/*
 * Test Cases
 */
void runTests() {
    Solution sol;
    
    // Test Case 1: Standard case
    cout << "Test 1 - Input: candidates=[2,3,6,7], target=7" << endl;
    vector<int> c1 = {2, 3, 6, 7};
    cout << "Backtrack: ";
    printCombinations(sol.combinationSum_backtrack(c1, 7));
    cout << "Pruned: ";
    printCombinations(sol.combinationSum_pruned(c1, 7));
    cout << "Choice: ";
    printCombinations(sol.combinationSum_choice(c1, 7));
    cout << "Expected: [[2,2,3],[7]]" << endl << endl;
    
    // Test Case 2: Multiple combinations
    cout << "Test 2 - Input: candidates=[2,3,5], target=8" << endl;
    vector<int> c2 = {2, 3, 5};
    cout << "Result: ";
    printCombinations(sol.combinationSum(c2, 8));
    cout << "Expected: [[2,2,2,2],[2,3,3],[3,5]]" << endl << endl;
    
    // Test Case 3: No solution
    cout << "Test 3 - Input: candidates=[2], target=1" << endl;
    vector<int> c3 = {2};
    cout << "Result: ";
    printCombinations(sol.combinationSum(c3, 1));
    cout << "Expected: []" << endl << endl;
    
    // Test Case 4: Single element solution
    cout << "Test 4 - Input: candidates=[1], target=1" << endl;
    vector<int> c4 = {1};
    cout << "Result: ";
    printCombinations(sol.combinationSum(c4, 1));
    cout << "Expected: [[1]]" << endl << endl;
    
    // Test Case 5: Large target
    cout << "Test 5 - Input: candidates=[2,3,5], target=10" << endl;
    vector<int> c5 = {2, 3, 5};
    cout << "Result: ";
    printCombinations(sol.combinationSum(c5, 10));
    cout << "Expected: Multiple valid combinations" << endl << endl;
}

int main() {
    cout << "Combination Sum - Multiple Approaches" << endl;
    cout << "======================================" << endl << endl;
    
    runTests();
    
    return 0;
}

/*
 * Complexity Analysis Summary:
 * 
 * All Backtracking Approaches:
 * - Time: O(N^(T/M)) where N = candidates, T = target, M = min candidate
 * - Space: O(T/M) for recursion depth
 * 
 * Approach 1 (Basic Backtracking):
 * - Simple and clear
 * - No optimization
 * 
 * Approach 2 (With Pruning):
 * - Sort first for early termination
 * - More efficient in practice
 * - BEST for interviews
 * 
 * Approach 3 (Explicit Choice):
 * - Include/exclude pattern
 * - More intuitive for some
 * 
 * Approach 4 (DP):
 * - Different perspective
 * - Less efficient due to duplicate checking
 * - Not recommended for this problem
 * 
 * Key Insights:
 * 1. Can reuse same element unlimited times
 * 2. Start from current index to avoid duplicates
 * 3. Sorting enables early pruning
 * 4. Backtracking explores all possibilities
 * 5. Base case: sum == target
 * 
 * Why Backtracking Works:
 * - Systematically explores all combinations
 * - Prunes invalid paths (sum > target)
 * - Reuses elements by staying at same index
 * - Avoids duplicates by moving forward only
 * 
 * Recursion Tree Example:
 * candidates = [2,3], target = 5
 * 
 *                    []
 *           /                \
 *         [2]                [3]
 *       /     \              /
 *    [2,2]   [2,3]        [3,3]
 *     /        |
 *  [2,2,2]  [2,3,3]
 * 
 * Valid: [2,3] (sum=5)
 * 
 * Avoiding Duplicates:
 * - Start from current index, not 0
 * - This ensures we don't generate [2,3] and [3,2]
 * - Example: After choosing 2, only consider 2,3,... (not 0,1,2,...)
 * 
 * Pruning Optimization:
 * - Sort candidates first
 * - If candidate > remaining target, break
 * - All subsequent candidates are also > target
 * - Significantly reduces search space
 * 
 * Common Pitfalls:
 * 1. Starting from 0 instead of current index (creates duplicates)
 * 2. Incrementing index when reuse is allowed
 * 3. Not handling target == 0 base case
 * 4. Forgetting to backtrack (pop)
 * 5. Not sorting for pruning optimization
 * 
 * Interview Tips:
 * 1. Start with basic backtracking
 * 2. Draw recursion tree for small example
 * 3. Explain why we start from current index
 * 4. Mention sorting optimization
 * 5. Discuss time complexity carefully
 * 6. Handle edge cases: no solution, single element
 * 7. Explain backtracking concept clearly
 * 
 * Time Complexity Explanation:
 * - Worst case: all candidates are 1
 * - Need to explore all ways to sum to target
 * - Each position has N choices
 * - Maximum depth is T/M (target / min candidate)
 * - Total: O(N^(T/M))
 * 
 * Space Complexity:
 * - Recursion depth: O(T/M)
 * - Current combination: O(T/M)
 * - Result storage not counted (output)
 * 
 * Comparison with Coin Change:
 * - Coin Change: Count ways (DP better)
 * - Combination Sum: List all ways (Backtracking better)
 * - Both allow unlimited reuse
 * - Different optimization strategies
 * 
 * Real-World Applications:
 * 1. Resource allocation problems
 * 2. Knapsack variations
 * 3. Change-making problems
 * 4. Recipe ingredient combinations
 * 5. Budget planning
 * 
 * Extensions and Variations:
 * 1. Combination Sum II (each element used once)
 * 2. Combination Sum III (fixed number of elements)
 * 3. Combination Sum IV (count permutations)
 * 4. Target Sum (with +/- signs)
 * 5. Partition Equal Subset Sum
 * 
 * Related Problems:
 * - Combination Sum II
 * - Combination Sum III
 * - Combination Sum IV
 * - Subsets
 * - Permutations
 * - Coin Change
 */

// Made with Bob
