/*
 * Problem: Combination Sum II (LeetCode 40)
 * Link: https://leetcode.com/problems/combination-sum-ii/
 * Difficulty: Medium
 * Category: Backtracking and Recursion
 * 
 * Description:
 * Given a collection of candidate numbers (candidates) and a target number (target),
 * find all unique combinations in candidates where the candidate numbers sum to target.
 * 
 * Each number in candidates may only be used once in the combination.
 * 
 * Note: The solution set must not contain duplicate combinations.
 * 
 * Example 1:
 * Input: candidates = [10,1,2,7,6,1,5], target = 8
 * Output: [[1,1,6],[1,2,5],[1,7],[2,6]]
 * 
 * Example 2:
 * Input: candidates = [2,5,2,1,2], target = 5
 * Output: [[1,2,2],[5]]
 * 
 * Constraints:
 * - 1 <= candidates.length <= 100
 * - 1 <= candidates[i] <= 50
 * - 1 <= target <= 30
 */

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/*
 * APPROACH 1: BACKTRACKING WITH SORTING AND SKIP DUPLICATES
 * 
 * Intuition:
 * - Sort array to group duplicates together
 * - Use backtracking to explore all combinations
 * - Skip duplicate elements at same recursion level
 * - Each element can be used only once
 * 
 * Algorithm:
 * 1. Sort candidates array
 * 2. Use backtracking with index tracking
 * 3. For each position, try including current element
 * 4. Skip duplicates: if candidates[i] == candidates[i-1], skip
 * 5. Recurse with remaining target and next index
 * 
 * Time Complexity: O(2^n) - worst case, try all subsets
 * Space Complexity: O(n) - recursion depth
 */
class Solution1 {
private:
    void backtrack(vector<int>& candidates, int target, int start,
                   vector<int>& current, vector<vector<int>>& result) {
        if (target == 0) {
            result.push_back(current);
            return;
        }
        
        if (target < 0) return;
        
        for (int i = start; i < candidates.size(); i++) {
            // Skip duplicates at same level
            if (i > start && candidates[i] == candidates[i-1]) {
                continue;
            }
            
            // Pruning: if current number > target, no point continuing
            if (candidates[i] > target) break;
            
            // Include current number
            current.push_back(candidates[i]);
            backtrack(candidates, target - candidates[i], i + 1, current, result);
            current.pop_back(); // Backtrack
        }
    }
    
public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        vector<vector<int>> result;
        vector<int> current;
        
        // Sort to group duplicates
        sort(candidates.begin(), candidates.end());
        
        backtrack(candidates, target, 0, current, result);
        return result;
    }
};

/*
 * APPROACH 2: BACKTRACKING WITH FREQUENCY MAP
 * 
 * Intuition:
 * - Count frequency of each unique number
 * - For each unique number, try using 0 to freq[num] copies
 * - This naturally handles duplicates
 * 
 * Algorithm:
 * 1. Build frequency map
 * 2. Extract unique numbers
 * 3. For each unique number, try different counts
 * 4. Recurse with updated target
 * 
 * Time Complexity: O(2^n)
 * Space Complexity: O(n)
 */
class Solution2 {
private:
    void backtrack(vector<pair<int, int>>& freq, int target, int index,
                   vector<int>& current, vector<vector<int>>& result) {
        if (target == 0) {
            result.push_back(current);
            return;
        }
        
        if (index == freq.size() || target < 0) return;
        
        int num = freq[index].first;
        int count = freq[index].second;
        
        // Try using 0 to count copies of current number
        for (int i = 0; i <= count; i++) {
            if (num * i > target) break;
            
            // Add i copies of num
            for (int j = 0; j < i; j++) {
                current.push_back(num);
            }
            
            backtrack(freq, target - num * i, index + 1, current, result);
            
            // Remove i copies
            for (int j = 0; j < i; j++) {
                current.pop_back();
            }
        }
    }
    
public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        // Build frequency map
        sort(candidates.begin(), candidates.end());
        vector<pair<int, int>> freq;
        
        for (int num : candidates) {
            if (freq.empty() || freq.back().first != num) {
                freq.push_back({num, 1});
            } else {
                freq.back().second++;
            }
        }
        
        vector<vector<int>> result;
        vector<int> current;
        backtrack(freq, target, 0, current, result);
        
        return result;
    }
};

/*
 * APPROACH 3: BACKTRACKING WITH USED ARRAY
 * 
 * Intuition:
 * - Track which elements are used
 * - Skip if previous same element not used (avoids duplicates)
 * - Similar to Permutations II logic
 * 
 * Algorithm:
 * 1. Sort array
 * 2. Use boolean array to track used elements
 * 3. Skip if candidates[i] == candidates[i-1] && !used[i-1]
 * 4. This ensures duplicates used in order
 * 
 * Time Complexity: O(2^n)
 * Space Complexity: O(n)
 */
class Solution3 {
private:
    void backtrack(vector<int>& candidates, int target, int start,
                   vector<bool>& used, vector<int>& current,
                   vector<vector<int>>& result) {
        if (target == 0) {
            result.push_back(current);
            return;
        }
        
        if (target < 0) return;
        
        for (int i = start; i < candidates.size(); i++) {
            if (used[i]) continue;
            
            // Skip duplicates
            if (i > 0 && candidates[i] == candidates[i-1] && !used[i-1]) {
                continue;
            }
            
            if (candidates[i] > target) break;
            
            used[i] = true;
            current.push_back(candidates[i]);
            
            backtrack(candidates, target - candidates[i], i + 1, used, current, result);
            
            current.pop_back();
            used[i] = false;
        }
    }
    
public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        
        vector<vector<int>> result;
        vector<int> current;
        vector<bool> used(candidates.size(), false);
        
        backtrack(candidates, target, 0, used, current, result);
        return result;
    }
};

/*
 * APPROACH 4: ITERATIVE WITH BIT MANIPULATION
 * 
 * Intuition:
 * - Generate all possible subsets using bit manipulation
 * - Check if subset sum equals target
 * - Use set to avoid duplicates
 * 
 * Algorithm:
 * 1. Sort array
 * 2. For each number from 0 to 2^n - 1:
 *    - Generate subset based on bits
 *    - Check if sum equals target
 *    - Add to set (automatically handles duplicates)
 * 3. Convert set to vector
 * 
 * Time Complexity: O(2^n * n) - generate and check all subsets
 * Space Complexity: O(2^n) - store all combinations
 */
class Solution4 {
public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        
        set<vector<int>> uniqueCombos;
        int n = candidates.size();
        
        // Try all possible subsets
        for (int mask = 0; mask < (1 << n); mask++) {
            vector<int> combo;
            int sum = 0;
            
            for (int i = 0; i < n; i++) {
                if (mask & (1 << i)) {
                    combo.push_back(candidates[i]);
                    sum += candidates[i];
                }
            }
            
            if (sum == target) {
                uniqueCombos.insert(combo);
            }
        }
        
        return vector<vector<int>>(uniqueCombos.begin(), uniqueCombos.end());
    }
};

/*
 * APPROACH 5: BACKTRACKING WITH EARLY TERMINATION
 * 
 * Intuition:
 * - Similar to Approach 1 but with more aggressive pruning
 * - Stop early if remaining sum cannot be achieved
 * - Track minimum value for better pruning
 * 
 * Algorithm:
 * 1. Sort array
 * 2. Track minimum value in remaining array
 * 3. If target < minValue, stop early
 * 4. Use standard backtracking with skip duplicates
 * 
 * Time Complexity: O(2^n) but faster in practice
 * Space Complexity: O(n)
 */
class Solution5 {
private:
    void backtrack(vector<int>& candidates, int target, int start,
                   vector<int>& current, vector<vector<int>>& result) {
        if (target == 0) {
            result.push_back(current);
            return;
        }
        
        for (int i = start; i < candidates.size(); i++) {
            // Skip duplicates
            if (i > start && candidates[i] == candidates[i-1]) {
                continue;
            }
            
            // Early termination
            if (candidates[i] > target) break;
            
            current.push_back(candidates[i]);
            backtrack(candidates, target - candidates[i], i + 1, current, result);
            current.pop_back();
        }
    }
    
public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        
        vector<vector<int>> result;
        vector<int> current;
        
        backtrack(candidates, target, 0, current, result);
        return result;
    }
};

// Helper function to print combinations
void printCombinations(const vector<vector<int>>& combos) {
    cout << "[";
    for (int i = 0; i < combos.size(); i++) {
        cout << "[";
        for (int j = 0; j < combos[i].size(); j++) {
            cout << combos[i][j];
            if (j < combos[i].size() - 1) cout << ",";
        }
        cout << "]";
        if (i < combos.size() - 1) cout << ",";
    }
    cout << "]\n";
}

// Test function
void test(vector<int> candidates, int target, int approach) {
    vector<vector<int>> result;
    
    cout << "Input: candidates = [";
    for (int i = 0; i < candidates.size(); i++) {
        cout << candidates[i];
        if (i < candidates.size() - 1) cout << ",";
    }
    cout << "], target = " << target << "\n";
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.combinationSum2(candidates, target);
            cout << "Approach 1 (Skip Duplicates): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.combinationSum2(candidates, target);
            cout << "Approach 2 (Frequency Map): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.combinationSum2(candidates, target);
            cout << "Approach 3 (Used Array): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.combinationSum2(candidates, target);
            cout << "Approach 4 (Bit Manipulation): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.combinationSum2(candidates, target);
            cout << "Approach 5 (Early Termination): ";
            break;
        }
    }
    
    printCombinations(result);
    cout << "\n";
}

int main() {
    // Test Case 1: Standard case
    cout << "Test Case 1: Standard case\n";
    vector<int> test1 = {10, 1, 2, 7, 6, 1, 5};
    for (int i = 1; i <= 5; i++) {
        test(test1, 8, i);
    }
    
    // Test Case 2: Multiple duplicates
    cout << "Test Case 2: Multiple duplicates\n";
    vector<int> test2 = {2, 5, 2, 1, 2};
    for (int i = 1; i <= 5; i++) {
        test(test2, 5, i);
    }
    
    // Test Case 3: No solution
    cout << "Test Case 3: No solution\n";
    vector<int> test3 = {2, 3, 5};
    for (int i = 1; i <= 5; i++) {
        test(test3, 1, i);
    }
    
    // Test Case 4: Single element
    cout << "Test Case 4: Single element\n";
    vector<int> test4 = {1};
    for (int i = 1; i <= 5; i++) {
        test(test4, 1, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (Skip Duplicates):
 * - Time: O(2^n) - explore all combinations
 * - Space: O(n) - recursion depth
 * - Best for: Most efficient, clean code
 * 
 * Approach 2 (Frequency Map):
 * - Time: O(2^n)
 * - Space: O(n)
 * - Best for: When many duplicates
 * 
 * Approach 3 (Used Array):
 * - Time: O(2^n)
 * - Space: O(n)
 * - Best for: Alternative duplicate handling
 * 
 * Approach 4 (Bit Manipulation):
 * - Time: O(2^n * n)
 * - Space: O(2^n)
 * - Best for: Different perspective (less efficient)
 * 
 * Approach 5 (Early Termination):
 * - Time: O(2^n) but faster in practice
 * - Space: O(n)
 * - Best for: Optimized backtracking
 * 
 * INTERVIEW TIPS:
 * 1. Start with Approach 1 - most common solution
 * 2. Key insight: sort first, then skip duplicates
 * 3. Explain why i > start (not i > 0) in skip condition
 * 4. Mention pruning optimization (break when num > target)
 * 5. Discuss difference from Combination Sum I (reuse vs no reuse)
 * 
 * COMMON MISTAKES:
 * 1. Not sorting array first
 * 2. Wrong duplicate-skipping condition (i > 0 instead of i > start)
 * 3. Allowing element reuse (using i instead of i+1)
 * 4. Not handling empty result case
 * 5. Forgetting to backtrack (pop from current)
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. What if we can reuse elements? (Combination Sum I)
 * 2. How to find all combinations of any size? (Same algorithm)
 * 3. Can you optimize for very large arrays? (Pruning helps)
 * 4. What if target is very large? (Same approach)
 * 5. How to count combinations without generating? (DP)
 * 
 * RELATED PROBLEMS:
 * - Combination Sum (with reuse)
 * - Combination Sum III (fixed size)
 * - Subsets II (all subsets with duplicates)
 * - Partition Equal Subset Sum
 * - Target Sum
 * 
 * KEY INSIGHTS:
 * 1. Sorting groups duplicates for easy skipping
 * 2. Skip condition: i > start ensures no duplicate combinations
 * 3. Each element used at most once (i+1 in recursion)
 * 4. Pruning with sorted array improves performance
 * 5. Frequency map is elegant for many duplicates
 */

// Made with Bob
