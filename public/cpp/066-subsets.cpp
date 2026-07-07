/*
 * Problem: Subsets
 * LeetCode: https://leetcode.com/problems/subsets/
 * 
 * Description:
 * Given an integer array nums of unique elements, return all possible subsets (the power set).
 * The solution set must not contain duplicate subsets. Return the solution in any order.
 * 
 * Example 1:
 * Input: nums = [1,2,3]
 * Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
 * 
 * Example 2:
 * Input: nums = [0]
 * Output: [[],[0]]
 * 
 * Constraints:
 * - 1 <= nums.length <= 10
 * - -10 <= nums[i] <= 10
 * - All the numbers of nums are unique.
 * 
 * Difficulty: Medium
 * Topics: Array, Backtracking, Bit Manipulation
 */

#include <iostream>
#include <vector>
#include <cmath>
using namespace std;

class Solution {
public:
    /*
     * Approach 1: Backtracking (DFS)
     * 
     * Intuition:
     * - For each element, we have two choices: include it or exclude it
     * - Build subsets incrementally by making these choices
     * - Use backtracking to explore all possibilities
     * 
     * Algorithm:
     * 1. Start with empty subset
     * 2. For each position, try including the element and recurse
     * 3. Backtrack by removing the element
     * 4. Try excluding the element and recurse
     * 
     * Time Complexity: O(n * 2^n) - 2^n subsets, each takes O(n) to copy
     * Space Complexity: O(n) - recursion depth
     */
    void backtrack(vector<int>& nums, int start, vector<int>& current, 
                   vector<vector<int>>& result) {
        // Add current subset to result
        result.push_back(current);
        
        // Try adding each remaining element
        for (int i = start; i < nums.size(); i++) {
            current.push_back(nums[i]);           // Include nums[i]
            backtrack(nums, i + 1, current, result);  // Recurse
            current.pop_back();                    // Backtrack
        }
    }
    
    vector<vector<int>> subsets_backtracking(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> current;
        backtrack(nums, 0, current, result);
        return result;
    }
    
    /*
     * Approach 2: Iterative (Cascading)
     * 
     * Intuition:
     * - Start with empty subset
     * - For each number, add it to all existing subsets to create new subsets
     * - Example: [] -> [], [1] -> [], [1], [2], [1,2]
     * 
     * Algorithm:
     * 1. Initialize result with empty subset
     * 2. For each number in nums:
     *    - For each existing subset:
     *      - Create new subset by adding current number
     *      - Add new subset to result
     * 
     * Time Complexity: O(n * 2^n)
     * Space Complexity: O(1) - excluding output
     */
    vector<vector<int>> subsets_iterative(vector<int>& nums) {
        vector<vector<int>> result = {{}};  // Start with empty subset
        
        for (int num : nums) {
            int size = result.size();
            for (int i = 0; i < size; i++) {
                vector<int> newSubset = result[i];
                newSubset.push_back(num);
                result.push_back(newSubset);
            }
        }
        
        return result;
    }
    
    /*
     * Approach 3: Bit Manipulation
     * 
     * Intuition:
     * - There are 2^n possible subsets for n elements
     * - Each subset can be represented by a binary number
     * - Bit i indicates whether nums[i] is included (1) or excluded (0)
     * - Example: For [1,2,3], binary 101 represents subset [1,3]
     * 
     * Algorithm:
     * 1. Iterate through all numbers from 0 to 2^n - 1
     * 2. For each number, check each bit
     * 3. If bit i is set, include nums[i] in current subset
     * 
     * Time Complexity: O(n * 2^n)
     * Space Complexity: O(1) - excluding output
     */
    vector<vector<int>> subsets_bitmask(vector<int>& nums) {
        int n = nums.size();
        int totalSubsets = 1 << n;  // 2^n
        vector<vector<int>> result;
        
        for (int mask = 0; mask < totalSubsets; mask++) {
            vector<int> subset;
            for (int i = 0; i < n; i++) {
                // Check if i-th bit is set
                if (mask & (1 << i)) {
                    subset.push_back(nums[i]);
                }
            }
            result.push_back(subset);
        }
        
        return result;
    }
    
    /*
     * Approach 4: Backtracking with Include/Exclude Pattern
     * 
     * Intuition:
     * - Explicitly model the include/exclude decision
     * - More intuitive for understanding the recursion tree
     * 
     * Time Complexity: O(n * 2^n)
     * Space Complexity: O(n) - recursion depth
     */
    void backtrackIncludeExclude(vector<int>& nums, int index, 
                                  vector<int>& current, 
                                  vector<vector<int>>& result) {
        // Base case: processed all elements
        if (index == nums.size()) {
            result.push_back(current);
            return;
        }
        
        // Exclude current element
        backtrackIncludeExclude(nums, index + 1, current, result);
        
        // Include current element
        current.push_back(nums[index]);
        backtrackIncludeExclude(nums, index + 1, current, result);
        current.pop_back();  // Backtrack
    }
    
    vector<vector<int>> subsets_include_exclude(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> current;
        backtrackIncludeExclude(nums, 0, current, result);
        return result;
    }
    
    /*
     * Approach 5: Standard Solution (Most Common)
     * 
     * This is the most commonly used approach in interviews
     * 
     * Time Complexity: O(n * 2^n)
     * Space Complexity: O(n)
     */
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> current;
        backtrack(nums, 0, current, result);
        return result;
    }
};

/*
 * Helper function to print subsets
 */
void printSubsets(const vector<vector<int>>& subsets) {
    cout << "[";
    for (int i = 0; i < subsets.size(); i++) {
        cout << "[";
        for (int j = 0; j < subsets[i].size(); j++) {
            cout << subsets[i][j];
            if (j < subsets[i].size() - 1) cout << ",";
        }
        cout << "]";
        if (i < subsets.size() - 1) cout << ",";
    }
    cout << "]" << endl;
}

/*
 * Test Cases
 */
void runTests() {
    Solution sol;
    
    // Test Case 1: Basic case
    vector<int> test1 = {1, 2, 3};
    cout << "Test 1 - Input: [1,2,3]" << endl;
    cout << "Backtracking: ";
    printSubsets(sol.subsets_backtracking(test1));
    cout << "Iterative: ";
    printSubsets(sol.subsets_iterative(test1));
    cout << "Bitmask: ";
    printSubsets(sol.subsets_bitmask(test1));
    cout << "Include/Exclude: ";
    printSubsets(sol.subsets_include_exclude(test1));
    cout << "Standard: ";
    printSubsets(sol.subsets(test1));
    cout << "Expected: 8 subsets total" << endl << endl;
    
    // Test Case 2: Single element
    vector<int> test2 = {0};
    cout << "Test 2 - Input: [0]" << endl;
    cout << "Result: ";
    printSubsets(sol.subsets(test2));
    cout << "Expected: [[],[0]]" << endl << endl;
    
    // Test Case 3: Two elements
    vector<int> test3 = {1, 2};
    cout << "Test 3 - Input: [1,2]" << endl;
    cout << "Result: ";
    printSubsets(sol.subsets(test3));
    cout << "Expected: [[],[1],[2],[1,2]]" << endl << endl;
    
    // Test Case 4: Four elements
    vector<int> test4 = {1, 2, 3, 4};
    cout << "Test 4 - Input: [1,2,3,4]" << endl;
    auto result4 = sol.subsets(test4);
    cout << "Number of subsets: " << result4.size() << endl;
    cout << "Expected: 16 subsets (2^4)" << endl << endl;
    
    // Test Case 5: Negative numbers
    vector<int> test5 = {-1, 0, 1};
    cout << "Test 5 - Input: [-1,0,1]" << endl;
    cout << "Result: ";
    printSubsets(sol.subsets(test5));
    cout << "Expected: 8 subsets" << endl << endl;
}

int main() {
    cout << "Subsets - Multiple Approaches" << endl;
    cout << "==============================" << endl << endl;
    
    runTests();
    
    // Demonstrate recursion tree for [1,2,3]
    cout << "\nRecursion Tree Visualization for [1,2,3]:" << endl;
    cout << "===========================================" << endl;
    cout << "                    []" << endl;
    cout << "           /                  \\" << endl;
    cout << "        [1]                    []" << endl;
    cout << "      /     \\                /    \\" << endl;
    cout << "   [1,2]    [1]           [2]      []" << endl;
    cout << "   /  \\     /  \\          /  \\     /  \\" << endl;
    cout << "[1,2,3][1,2][1,3][1]  [2,3][2] [3] []" << endl;
    
    return 0;
}

/*
 * Complexity Analysis Summary:
 * 
 * All Approaches:
 * - Time: O(n * 2^n) - 2^n subsets, each takes O(n) to construct/copy
 * - Space: O(n) for recursion depth (backtracking) or O(1) (iterative/bitmask)
 * 
 * Approach 1 (Backtracking):
 * - Most intuitive and commonly used in interviews
 * - Easy to extend to variations (subsets with duplicates, etc.)
 * - Space: O(n) for recursion stack
 * 
 * Approach 2 (Iterative):
 * - No recursion, easier to understand for some
 * - Builds subsets incrementally
 * - Space: O(1) excluding output
 * 
 * Approach 3 (Bit Manipulation):
 * - Clever use of binary representation
 * - Good for understanding power set concept
 * - Space: O(1) excluding output
 * 
 * Approach 4 (Include/Exclude):
 * - Explicitly models the decision tree
 * - Good for teaching recursion
 * - Space: O(n) for recursion stack
 * 
 * Key Insights:
 * 1. Power set has 2^n subsets (each element: in or out)
 * 2. Backtracking explores all possibilities systematically
 * 3. Can be solved iteratively by cascading
 * 4. Bit manipulation provides elegant solution
 * 5. All approaches generate same result, different perspectives
 * 
 * Recursion Tree Pattern:
 * - At each level, we decide: include or exclude current element
 * - Left subtree: include element
 * - Right subtree: exclude element
 * - Leaves represent complete subsets
 * 
 * Bit Manipulation Insight:
 * - For n=3: numbers 0-7 (000 to 111 in binary)
 * - 000 = [] (no elements)
 * - 001 = [1] (only first element)
 * - 010 = [2] (only second element)
 * - 011 = [1,2] (first and second)
 * - 100 = [3] (only third element)
 * - 101 = [1,3] (first and third)
 * - 110 = [2,3] (second and third)
 * - 111 = [1,2,3] (all elements)
 * 
 * Common Pitfalls:
 * 1. Forgetting to include empty subset
 * 2. Not backtracking properly (forgetting to pop)
 * 3. Modifying input array
 * 4. Incorrect bit manipulation (off-by-one errors)
 * 5. Not handling edge cases (empty input, single element)
 * 
 * Interview Tips:
 * 1. Start with backtracking approach (most intuitive)
 * 2. Draw recursion tree to explain
 * 3. Mention time complexity is O(n * 2^n)
 * 4. Explain why: 2^n subsets, each takes O(n) to construct
 * 5. Discuss alternative approaches (iterative, bit manipulation)
 * 6. Test with small examples first
 * 7. Mention this is foundation for many other problems
 * 
 * Extensions and Variations:
 * 1. Subsets II (with duplicates) - need to sort and skip duplicates
 * 2. Subsets of size k - add constraint in backtracking
 * 3. Subsets with sum equal to target - add sum tracking
 * 4. Subsets with product equal to target
 * 5. Count subsets instead of generating them
 * 
 * Related Problems:
 * - Subsets II (with duplicates)
 * - Permutations
 * - Combinations
 * - Combination Sum
 * - Letter Case Permutation
 * - Generate Parentheses
 */

// Made with Bob
