/*
 * Problem: Subsets II (LeetCode 90)
 * Difficulty: Medium
 * Category: Backtracking and Recursion
 * 
 * Description:
 * Given an integer array nums that may contain duplicates, return all possible
 * subsets (the power set). The solution set must not contain duplicate subsets.
 * Return the solution in any order.
 * 
 * Example 1:
 * Input: nums = [1,2,2]
 * Output: [[],[1],[1,2],[1,2,2],[2],[2,2]]
 * 
 * Example 2:
 * Input: nums = [0]
 * Output: [[],[0]]
 * 
 * Constraints:
 * - 1 <= nums.length <= 10
 * - -10 <= nums[i] <= 10
 */

#include <iostream>
#include <vector>
#include <algorithm>
#include <set>
using namespace std;

/*
 * APPROACH 1: BACKTRACKING WITH SORTING AND SKIP DUPLICATES
 * 
 * Intuition:
 * - Sort the array to group duplicates together
 * - Use backtracking to generate all subsets
 * - Skip duplicate elements at the same recursion level
 * - This ensures we don't generate duplicate subsets
 * 
 * Algorithm:
 * 1. Sort the input array
 * 2. Use backtracking with index tracking
 * 3. At each level, skip duplicates: if nums[i] == nums[i-1], skip
 * 4. Add current subset to result
 * 5. Recursively explore including/excluding each element
 * 
 * Time Complexity: O(2^n * n) - 2^n subsets, O(n) to copy each
 * Space Complexity: O(n) - recursion depth
 */
class Solution1 {
private:
    void backtrack(vector<int>& nums, int start, vector<int>& current, 
                   vector<vector<int>>& result) {
        // Add current subset to result
        result.push_back(current);
        
        // Try adding each remaining element
        for (int i = start; i < nums.size(); i++) {
            // Skip duplicates at same level
            if (i > start && nums[i] == nums[i-1]) {
                continue;
            }
            
            // Include nums[i]
            current.push_back(nums[i]);
            backtrack(nums, i + 1, current, result);
            current.pop_back(); // Backtrack
        }
    }
    
public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> current;
        
        // Sort to group duplicates
        sort(nums.begin(), nums.end());
        
        backtrack(nums, 0, current, result);
        return result;
    }
};

/*
 * APPROACH 2: ITERATIVE WITH DUPLICATE TRACKING
 * 
 * Intuition:
 * - Build subsets iteratively
 * - When we encounter a duplicate, only add it to subsets created in previous iteration
 * - Track the size before adding duplicates
 * - This avoids creating duplicate subsets
 * 
 * Algorithm:
 * 1. Sort the array
 * 2. Start with empty subset
 * 3. For each number:
 *    - If it's a duplicate, only extend subsets from previous iteration
 *    - Otherwise, extend all existing subsets
 * 4. Track startIndex to handle duplicates correctly
 * 
 * Time Complexity: O(2^n * n) - 2^n subsets, O(n) to copy each
 * Space Complexity: O(1) - excluding output space
 */
class Solution2 {
public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        vector<vector<int>> result;
        result.push_back({}); // Empty subset
        
        // Sort to group duplicates
        sort(nums.begin(), nums.end());
        
        int startIndex = 0;
        
        for (int i = 0; i < nums.size(); i++) {
            // If duplicate, only extend subsets from previous iteration
            if (i > 0 && nums[i] == nums[i-1]) {
                startIndex = startIndex;
            } else {
                startIndex = 0;
            }
            
            int size = result.size();
            
            // Extend subsets
            for (int j = startIndex; j < size; j++) {
                vector<int> subset = result[j];
                subset.push_back(nums[i]);
                result.push_back(subset);
            }
            
            startIndex = size;
        }
        
        return result;
    }
};

/*
 * APPROACH 3: BACKTRACKING WITH FREQUENCY MAP
 * 
 * Intuition:
 * - Count frequency of each unique element
 * - For each unique element, decide how many times to include it (0 to freq)
 * - This naturally handles duplicates
 * 
 * Algorithm:
 * 1. Create frequency map of elements
 * 2. Extract unique elements
 * 3. Use backtracking to decide count of each unique element
 * 4. Generate subset based on counts
 * 
 * Time Complexity: O(2^n * n) - still 2^n subsets
 * Space Complexity: O(n) - frequency map + recursion
 */
class Solution3 {
private:
    void backtrack(vector<int>& unique, vector<int>& freq, int index,
                   vector<int>& current, vector<vector<int>>& result) {
        if (index == unique.size()) {
            result.push_back(current);
            return;
        }
        
        // Try including 0 to freq[index] copies of unique[index]
        for (int count = 0; count <= freq[index]; count++) {
            // Add 'count' copies of unique[index]
            for (int i = 0; i < count; i++) {
                current.push_back(unique[index]);
            }
            
            backtrack(unique, freq, index + 1, current, result);
            
            // Remove 'count' copies
            for (int i = 0; i < count; i++) {
                current.pop_back();
            }
        }
    }
    
public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        
        // Build frequency map
        vector<int> unique;
        vector<int> freq;
        
        for (int num : nums) {
            if (unique.empty() || unique.back() != num) {
                unique.push_back(num);
                freq.push_back(1);
            } else {
                freq.back()++;
            }
        }
        
        vector<vector<int>> result;
        vector<int> current;
        backtrack(unique, freq, 0, current, result);
        
        return result;
    }
};

/*
 * APPROACH 4: BIT MANIPULATION WITH SET (BRUTE FORCE)
 * 
 * Intuition:
 * - Generate all 2^n possible subsets using bit manipulation
 * - Use set to automatically remove duplicates
 * - This is less efficient but shows alternative thinking
 * 
 * Algorithm:
 * 1. Sort the array
 * 2. For each number from 0 to 2^n - 1:
 *    - Use bits to determine which elements to include
 *    - Add subset to set (automatically handles duplicates)
 * 3. Convert set to vector
 * 
 * Time Complexity: O(2^n * n * log(2^n)) - set operations
 * Space Complexity: O(2^n * n) - set storage
 */
class Solution4 {
public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        
        set<vector<int>> uniqueSubsets;
        int n = nums.size();
        
        // Generate all 2^n subsets
        for (int mask = 0; mask < (1 << n); mask++) {
            vector<int> subset;
            
            for (int i = 0; i < n; i++) {
                if (mask & (1 << i)) {
                    subset.push_back(nums[i]);
                }
            }
            
            uniqueSubsets.insert(subset);
        }
        
        // Convert set to vector
        return vector<vector<int>>(uniqueSubsets.begin(), uniqueSubsets.end());
    }
};

/*
 * APPROACH 5: CASCADING WITH DUPLICATE HANDLING
 * 
 * Intuition:
 * - Build subsets by cascading (adding each element to existing subsets)
 * - Track which subsets were added in the last step
 * - For duplicates, only cascade from last step's subsets
 * 
 * Algorithm:
 * 1. Sort array
 * 2. Start with empty subset
 * 3. For each element:
 *    - If not duplicate, cascade from all subsets
 *    - If duplicate, cascade only from subsets added in last step
 * 4. Track lastAddedCount for duplicate handling
 * 
 * Time Complexity: O(2^n * n)
 * Space Complexity: O(1) - excluding output
 */
class Solution5 {
public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        
        vector<vector<int>> result;
        result.push_back({});
        
        int lastAddedCount = 0;
        
        for (int i = 0; i < nums.size(); i++) {
            int startIndex = 0;
            
            // If duplicate, only use subsets from last iteration
            if (i > 0 && nums[i] == nums[i-1]) {
                startIndex = result.size() - lastAddedCount;
            }
            
            int currentSize = result.size();
            lastAddedCount = 0;
            
            for (int j = startIndex; j < currentSize; j++) {
                vector<int> newSubset = result[j];
                newSubset.push_back(nums[i]);
                result.push_back(newSubset);
                lastAddedCount++;
            }
        }
        
        return result;
    }
};

// Helper function to print subsets
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
    cout << "]\n";
}

// Test function
void test(vector<int> nums, int approach) {
    vector<vector<int>> result;
    
    cout << "Input: [";
    for (int i = 0; i < nums.size(); i++) {
        cout << nums[i];
        if (i < nums.size() - 1) cout << ",";
    }
    cout << "]\n";
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.subsetsWithDup(nums);
            cout << "Approach 1 (Backtracking with Skip): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.subsetsWithDup(nums);
            cout << "Approach 2 (Iterative): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.subsetsWithDup(nums);
            cout << "Approach 3 (Frequency Map): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.subsetsWithDup(nums);
            cout << "Approach 4 (Bit Manipulation): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.subsetsWithDup(nums);
            cout << "Approach 5 (Cascading): ";
            break;
        }
    }
    
    printSubsets(result);
    cout << "\n";
}

int main() {
    // Test Case 1: Standard case with duplicates
    cout << "Test Case 1: Standard case\n";
    vector<int> test1 = {1, 2, 2};
    for (int i = 1; i <= 5; i++) {
        test(test1, i);
    }
    
    // Test Case 2: Single element
    cout << "Test Case 2: Single element\n";
    vector<int> test2 = {0};
    for (int i = 1; i <= 5; i++) {
        test(test2, i);
    }
    
    // Test Case 3: All duplicates
    cout << "Test Case 3: All duplicates\n";
    vector<int> test3 = {1, 1, 1};
    for (int i = 1; i <= 5; i++) {
        test(test3, i);
    }
    
    // Test Case 4: No duplicates
    cout << "Test Case 4: No duplicates\n";
    vector<int> test4 = {1, 2, 3};
    for (int i = 1; i <= 5; i++) {
        test(test4, i);
    }
    
    // Test Case 5: Multiple duplicate groups
    cout << "Test Case 5: Multiple duplicate groups\n";
    vector<int> test5 = {4, 4, 4, 1, 4};
    for (int i = 1; i <= 5; i++) {
        test(test5, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (Backtracking with Skip):
 * - Time: O(2^n * n) - 2^n subsets, O(n) to copy
 * - Space: O(n) - recursion depth
 * - Best for: Clean, efficient, most common solution
 * 
 * Approach 2 (Iterative):
 * - Time: O(2^n * n)
 * - Space: O(1) - excluding output
 * - Best for: Avoiding recursion
 * 
 * Approach 3 (Frequency Map):
 * - Time: O(2^n * n)
 * - Space: O(n) - frequency map
 * - Best for: When duplicates are frequent
 * 
 * Approach 4 (Bit Manipulation):
 * - Time: O(2^n * n * log(2^n)) - set operations
 * - Space: O(2^n * n) - set storage
 * - Best for: Alternative perspective (less efficient)
 * 
 * Approach 5 (Cascading):
 * - Time: O(2^n * n)
 * - Space: O(1) - excluding output
 * - Best for: Iterative with duplicate tracking
 * 
 * INTERVIEW TIPS:
 * 1. Start with Approach 1 - most elegant and efficient
 * 2. Key insight: sort first, then skip duplicates at same level
 * 3. Explain why sorting is necessary
 * 4. Discuss difference from Subsets I (no duplicates)
 * 5. Mention iterative approach as alternative
 * 
 * COMMON MISTAKES:
 * 1. Not sorting the array first
 * 2. Skipping duplicates incorrectly (should be i > start, not i > 0)
 * 3. Not understanding when to skip duplicates
 * 4. Using set unnecessarily (inefficient)
 * 5. Confusing with combination sum problems
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. How to generate subsets of specific size? (Add size parameter)
 * 2. What if we want subsets in lexicographic order? (Already sorted)
 * 3. Can you do it without sorting? (Use set, but less efficient)
 * 4. How to count subsets without generating them? (DP)
 * 5. What if array is very large? (Consider memory constraints)
 * 
 * RELATED PROBLEMS:
 * - Subsets (without duplicates)
 * - Permutations II
 * - Combination Sum II
 * - Palindrome Partitioning
 * - Letter Case Permutation
 */

// Made with Bob
