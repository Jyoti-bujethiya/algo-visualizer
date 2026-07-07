/*
 * Problem: Permutations
 * LeetCode: https://leetcode.com/problems/permutations/
 * 
 * Description:
 * Given an array nums of distinct integers, return all the possible permutations.
 * You can return the answer in any order.
 * 
 * Example 1:
 * Input: nums = [1,2,3]
 * Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
 * 
 * Example 2:
 * Input: nums = [0,1]
 * Output: [[0,1],[1,0]]
 * 
 * Example 3:
 * Input: nums = [1]
 * Output: [[1]]
 * 
 * Constraints:
 * - 1 <= nums.length <= 6
 * - -10 <= nums[i] <= 10
 * - All the integers of nums are unique.
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
     * Approach 1: Backtracking with Swap
     * 
     * Intuition:
     * - Fix each element at the first position and permute the rest
     * - Use swapping to avoid extra space for tracking used elements
     * - Swap element to current position, recurse, then swap back (backtrack)
     * 
     * Algorithm:
     * 1. For each position from start to end:
     *    - Swap current element with start position
     *    - Recursively permute remaining elements
     *    - Swap back to restore original array (backtrack)
     * 2. Base case: when start reaches end, add permutation to result
     * 
     * Time Complexity: O(n! * n) - n! permutations, each takes O(n) to copy
     * Space Complexity: O(n) - recursion depth
     */
    void backtrackSwap(vector<int>& nums, int start, vector<vector<int>>& result) {
        // Base case: reached end of array
        if (start == nums.size()) {
            result.push_back(nums);
            return;
        }
        
        // Try each element at current position
        for (int i = start; i < nums.size(); i++) {
            swap(nums[start], nums[i]);              // Choose
            backtrackSwap(nums, start + 1, result);  // Explore
            swap(nums[start], nums[i]);              // Unchoose (backtrack)
        }
    }
    
    vector<vector<int>> permute_swap(vector<int>& nums) {
        vector<vector<int>> result;
        backtrackSwap(nums, 0, result);
        return result;
    }
    
    /*
     * Approach 2: Backtracking with Used Array
     * 
     * Intuition:
     * - Build permutation element by element
     * - Track which elements have been used with boolean array
     * - More intuitive but uses extra space
     * 
     * Algorithm:
     * 1. Maintain current permutation and used array
     * 2. For each unused element:
     *    - Mark as used, add to current permutation
     *    - Recurse to add next element
     *    - Mark as unused, remove from permutation (backtrack)
     * 3. Base case: when permutation is complete, add to result
     * 
     * Time Complexity: O(n! * n)
     * Space Complexity: O(n) - used array + recursion depth
     */
    void backtrackUsed(vector<int>& nums, vector<bool>& used, 
                       vector<int>& current, vector<vector<int>>& result) {
        // Base case: permutation is complete
        if (current.size() == nums.size()) {
            result.push_back(current);
            return;
        }
        
        // Try each unused element
        for (int i = 0; i < nums.size(); i++) {
            if (used[i]) continue;  // Skip if already used
            
            used[i] = true;                              // Mark as used
            current.push_back(nums[i]);                  // Add to permutation
            backtrackUsed(nums, used, current, result);  // Recurse
            current.pop_back();                          // Remove (backtrack)
            used[i] = false;                             // Mark as unused
        }
    }
    
    vector<vector<int>> permute_used(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> current;
        vector<bool> used(nums.size(), false);
        backtrackUsed(nums, used, current, result);
        return result;
    }
    
    /*
     * Approach 3: Iterative (Insert at All Positions)
     * 
     * Intuition:
     * - Start with permutations of first element: [[1]]
     * - For each new element, insert it at all possible positions in existing permutations
     * - Example: [[1]] + 2 -> [[2,1], [1,2]]
     * 
     * Algorithm:
     * 1. Start with permutation containing first element
     * 2. For each remaining element:
     *    - For each existing permutation:
     *      - Insert element at each position (0 to size)
     *      - Add new permutation to result
     * 
     * Time Complexity: O(n! * n)
     * Space Complexity: O(1) - excluding output
     */
    vector<vector<int>> permute_iterative(vector<int>& nums) {
        vector<vector<int>> result = {{}};
        
        for (int num : nums) {
            vector<vector<int>> newResult;
            for (auto& perm : result) {
                // Insert num at each position
                for (int i = 0; i <= perm.size(); i++) {
                    vector<int> newPerm = perm;
                    newPerm.insert(newPerm.begin() + i, num);
                    newResult.push_back(newPerm);
                }
            }
            result = newResult;
        }
        
        return result;
    }
    
    /*
     * Approach 4: Using STL next_permutation
     * 
     * Intuition:
     * - C++ STL provides next_permutation function
     * - Generates permutations in lexicographic order
     * - Need to sort array first
     * 
     * Algorithm:
     * 1. Sort the array
     * 2. Add current permutation to result
     * 3. Use next_permutation to get next permutation
     * 4. Repeat until no more permutations
     * 
     * Time Complexity: O(n! * n)
     * Space Complexity: O(1) - excluding output
     */
    vector<vector<int>> permute_stl(vector<int>& nums) {
        vector<vector<int>> result;
        sort(nums.begin(), nums.end());
        
        do {
            result.push_back(nums);
        } while (next_permutation(nums.begin(), nums.end()));
        
        return result;
    }
    
    /*
     * Approach 5: Standard Solution (Most Common)
     * 
     * This is the most commonly used approach in interviews
     * Uses swap-based backtracking for efficiency
     * 
     * Time Complexity: O(n! * n)
     * Space Complexity: O(n)
     */
    vector<vector<int>> permute(vector<int>& nums) {
        vector<vector<int>> result;
        backtrackSwap(nums, 0, result);
        return result;
    }
};

/*
 * Helper function to print permutations
 */
void printPermutations(const vector<vector<int>>& perms) {
    cout << "[";
    for (int i = 0; i < perms.size(); i++) {
        cout << "[";
        for (int j = 0; j < perms[i].size(); j++) {
            cout << perms[i][j];
            if (j < perms[i].size() - 1) cout << ",";
        }
        cout << "]";
        if (i < perms.size() - 1) cout << ",";
    }
    cout << "]" << endl;
}

/*
 * Test Cases
 */
void runTests() {
    Solution sol;
    
    // Test Case 1: Three elements
    vector<int> test1 = {1, 2, 3};
    cout << "Test 1 - Input: [1,2,3]" << endl;
    cout << "Swap-based: ";
    printPermutations(sol.permute_swap(test1));
    cout << "Used array: ";
    printPermutations(sol.permute_used(test1));
    cout << "Iterative: ";
    printPermutations(sol.permute_iterative(test1));
    cout << "STL: ";
    printPermutations(sol.permute_stl(test1));
    cout << "Standard: ";
    printPermutations(sol.permute(test1));
    cout << "Expected: 6 permutations (3!)" << endl << endl;
    
    // Test Case 2: Two elements
    vector<int> test2 = {0, 1};
    cout << "Test 2 - Input: [0,1]" << endl;
    cout << "Result: ";
    printPermutations(sol.permute(test2));
    cout << "Expected: [[0,1],[1,0]]" << endl << endl;
    
    // Test Case 3: Single element
    vector<int> test3 = {1};
    cout << "Test 3 - Input: [1]" << endl;
    cout << "Result: ";
    printPermutations(sol.permute(test3));
    cout << "Expected: [[1]]" << endl << endl;
    
    // Test Case 4: Four elements
    vector<int> test4 = {1, 2, 3, 4};
    cout << "Test 4 - Input: [1,2,3,4]" << endl;
    auto result4 = sol.permute(test4);
    cout << "Number of permutations: " << result4.size() << endl;
    cout << "Expected: 24 permutations (4!)" << endl << endl;
    
    // Test Case 5: Negative numbers
    vector<int> test5 = {-1, 0, 1};
    cout << "Test 5 - Input: [-1,0,1]" << endl;
    auto result5 = sol.permute(test5);
    cout << "Number of permutations: " << result5.size() << endl;
    cout << "Expected: 6 permutations (3!)" << endl << endl;
}

int main() {
    cout << "Permutations - Multiple Approaches" << endl;
    cout << "===================================" << endl << endl;
    
    runTests();
    
    // Demonstrate recursion tree for [1,2,3]
    cout << "\nRecursion Tree Visualization for [1,2,3] (Swap-based):" << endl;
    cout << "=======================================================" << endl;
    cout << "                    [1,2,3]" << endl;
    cout << "           /          |          \\" << endl;
    cout << "      [1,2,3]      [2,1,3]      [3,2,1]" << endl;
    cout << "       /  \\         /  \\         /  \\" << endl;
    cout << "  [1,2,3][1,3,2][2,1,3][2,3,1][3,2,1][3,1,2]" << endl;
    cout << "\nAt each level, we fix one position and permute the rest" << endl;
    
    return 0;
}

/*
 * Complexity Analysis Summary:
 * 
 * All Approaches:
 * - Time: O(n! * n) - n! permutations, each takes O(n) to construct/copy
 * - Space varies by approach
 * 
 * Approach 1 (Swap-based Backtracking):
 * - Most efficient in terms of space
 * - No extra data structures needed
 * - Space: O(n) for recursion stack only
 * - BEST for interviews
 * 
 * Approach 2 (Used Array):
 * - More intuitive for beginners
 * - Easier to understand the logic
 * - Space: O(n) for used array + recursion stack
 * 
 * Approach 3 (Iterative):
 * - No recursion
 * - Builds permutations incrementally
 * - Space: O(1) excluding output
 * 
 * Approach 4 (STL):
 * - Shortest code
 * - Uses built-in function
 * - Space: O(1) excluding output
 * 
 * Key Insights:
 * 1. Total permutations = n! (factorial)
 * 2. Each permutation is a different ordering of all elements
 * 3. Backtracking explores all possibilities systematically
 * 4. Swap-based approach is most space-efficient
 * 5. Used array approach is more intuitive
 * 
 * Recursion Tree Pattern (Swap-based):
 * - Level 0: Fix position 0, try all elements
 * - Level 1: Fix position 1, try remaining elements
 * - Level n-1: Only one element left, add to result
 * - Each path from root to leaf is one permutation
 * 
 * Difference from Subsets:
 * - Subsets: Choose which elements to include (2^n possibilities)
 * - Permutations: Choose order of all elements (n! possibilities)
 * - Subsets: Variable length results
 * - Permutations: All results have same length (n)
 * 
 * Common Pitfalls:
 * 1. Forgetting to backtrack (swap back or remove from current)
 * 2. Not handling single element case
 * 3. Modifying input array without restoring it
 * 4. Incorrect base case in recursion
 * 5. Off-by-one errors in loop bounds
 * 
 * Interview Tips:
 * 1. Start with swap-based backtracking (most efficient)
 * 2. Draw recursion tree to explain
 * 3. Explain time complexity: n! permutations, O(n) to copy each
 * 4. Mention space complexity: O(n) for recursion depth
 * 5. Discuss alternative approaches if asked
 * 6. Test with small examples (n=1, n=2, n=3)
 * 7. Explain backtracking concept clearly
 * 
 * Optimization Techniques:
 * 1. Swap-based avoids extra space for tracking used elements
 * 2. Can generate permutations in lexicographic order if needed
 * 3. Can prune branches if constraints are added
 * 4. Can use iterative approach to avoid recursion overhead
 * 
 * Mathematical Background:
 * - Number of permutations of n distinct elements = n!
 * - n! = n × (n-1) × (n-2) × ... × 2 × 1
 * - Examples: 3! = 6, 4! = 24, 5! = 120
 * - Grows very fast (factorial growth)
 * 
 * Extensions and Variations:
 * 1. Permutations II (with duplicates) - need to skip duplicate permutations
 * 2. Next Permutation - find lexicographically next permutation
 * 3. k-Permutations - permutations of length k from n elements
 * 4. Permutations with constraints - add pruning conditions
 * 5. Count permutations instead of generating them
 * 
 * Related Problems:
 * - Permutations II (with duplicates)
 * - Next Permutation
 * - Permutation Sequence
 * - Letter Case Permutation
 * - Subsets
 * - Combinations
 * - N-Queens
 */

// Made with Bob
