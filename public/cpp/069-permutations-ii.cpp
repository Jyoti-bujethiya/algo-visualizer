/*
 * Problem: Permutations II (LeetCode 47)
 * Difficulty: Medium
 * Category: Backtracking and Recursion
 * 
 * Description:
 * Given a collection of numbers, nums, that might contain duplicates, return all
 * possible unique permutations in any order.
 * 
 * Example 1:
 * Input: nums = [1,1,2]
 * Output: [[1,1,2],[1,2,1],[2,1,1]]
 * 
 * Example 2:
 * Input: nums = [1,2,3]
 * Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
 * 
 * Constraints:
 * - 1 <= nums.length <= 8
 * - -10 <= nums[i] <= 10
 */

#include <iostream>
#include <vector>
#include <algorithm>
#include <unordered_set>
#include <set>
using namespace std;

/*
 * APPROACH 1: BACKTRACKING WITH SORTING AND SKIP DUPLICATES
 * 
 * Intuition:
 * - Sort array to group duplicates together
 * - Use backtracking with a used array to track which elements are used
 * - Skip duplicate elements at the same recursion level
 * - Key insight: if nums[i] == nums[i-1] and nums[i-1] is not used,
 *   skip nums[i] to avoid duplicate permutations
 * 
 * Algorithm:
 * 1. Sort the array
 * 2. Use backtracking with used array
 * 3. For each position, try each unused element
 * 4. Skip if current element equals previous and previous is not used
 * 5. This ensures we only use duplicates in order
 * 
 * Time Complexity: O(n! * n) - n! permutations, O(n) to copy each
 * Space Complexity: O(n) - recursion depth + used array
 */
class Solution1 {
private:
    void backtrack(vector<int>& nums, vector<bool>& used, 
                   vector<int>& current, vector<vector<int>>& result) {
        // Base case: permutation complete
        if (current.size() == nums.size()) {
            result.push_back(current);
            return;
        }
        
        // Try each element
        for (int i = 0; i < nums.size(); i++) {
            // Skip if already used
            if (used[i]) continue;
            
            // Skip duplicates: if current equals previous and previous not used
            // This ensures we use duplicates in order
            if (i > 0 && nums[i] == nums[i-1] && !used[i-1]) {
                continue;
            }
            
            // Use nums[i]
            used[i] = true;
            current.push_back(nums[i]);
            
            backtrack(nums, used, current, result);
            
            // Backtrack
            current.pop_back();
            used[i] = false;
        }
    }
    
public:
    vector<vector<int>> permuteUnique(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> current;
        vector<bool> used(nums.size(), false);
        
        // Sort to group duplicates
        sort(nums.begin(), nums.end());
        
        backtrack(nums, used, current, result);
        return result;
    }
};

/*
 * APPROACH 2: BACKTRACKING WITH SWAP AND SET
 * 
 * Intuition:
 * - Use swap-based backtracking
 * - At each position, use a set to track which values we've already tried
 * - This prevents generating duplicate permutations
 * 
 * Algorithm:
 * 1. For each position, maintain a set of used values
 * 2. Try swapping with each position from current to end
 * 3. Skip if value already tried at this position
 * 4. Recursively permute remaining positions
 * 
 * Time Complexity: O(n! * n)
 * Space Complexity: O(n^2) - recursion depth * set at each level
 */
class Solution2 {
private:
    void backtrack(vector<int>& nums, int start, vector<vector<int>>& result) {
        if (start == nums.size()) {
            result.push_back(nums);
            return;
        }
        
        // Track which values we've tried at this position
        unordered_set<int> used;
        
        for (int i = start; i < nums.size(); i++) {
            // Skip if we've already tried this value at this position
            if (used.count(nums[i])) continue;
            
            used.insert(nums[i]);
            
            // Swap and recurse
            swap(nums[start], nums[i]);
            backtrack(nums, start + 1, result);
            swap(nums[start], nums[i]); // Backtrack
        }
    }
    
public:
    vector<vector<int>> permuteUnique(vector<int>& nums) {
        vector<vector<int>> result;
        backtrack(nums, 0, result);
        return result;
    }
};

/*
 * APPROACH 3: FREQUENCY MAP BACKTRACKING
 * 
 * Intuition:
 * - Count frequency of each unique element
 * - Build permutations by choosing from available elements
 * - Decrement frequency when using an element
 * - This naturally handles duplicates
 * 
 * Algorithm:
 * 1. Build frequency map
 * 2. For each position, try each unique element with available count
 * 3. Decrement count, recurse, then restore count
 * 4. No need to sort or track used array
 * 
 * Time Complexity: O(n! * n)
 * Space Complexity: O(n) - frequency map + recursion
 */
class Solution3 {
private:
    void backtrack(unordered_map<int, int>& freq, int n,
                   vector<int>& current, vector<vector<int>>& result) {
        if (current.size() == n) {
            result.push_back(current);
            return;
        }
        
        // Try each unique element
        for (auto& [num, count] : freq) {
            if (count > 0) {
                // Use this element
                current.push_back(num);
                freq[num]--;
                
                backtrack(freq, n, current, result);
                
                // Backtrack
                current.pop_back();
                freq[num]++;
            }
        }
    }
    
public:
    vector<vector<int>> permuteUnique(vector<int>& nums) {
        // Build frequency map
        unordered_map<int, int> freq;
        for (int num : nums) {
            freq[num]++;
        }
        
        vector<vector<int>> result;
        vector<int> current;
        backtrack(freq, nums.size(), current, result);
        
        return result;
    }
};

/*
 * APPROACH 4: ITERATIVE WITH INSERTION
 * 
 * Intuition:
 * - Build permutations iteratively by inserting each element
 * - For each new element, insert it at all possible positions in existing permutations
 * - Use set to avoid duplicates
 * 
 * Algorithm:
 * 1. Start with empty permutation
 * 2. For each element, insert it at all positions in all existing permutations
 * 3. Use set to automatically handle duplicates
 * 4. Convert set to vector at the end
 * 
 * Time Complexity: O(n! * n^2) - insertion takes O(n)
 * Space Complexity: O(n! * n) - set storage
 */
class Solution4 {
public:
    vector<vector<int>> permuteUnique(vector<int>& nums) {
        set<vector<int>> uniquePerms;
        vector<vector<int>> current = {{}};
        
        for (int num : nums) {
            vector<vector<int>> next;
            
            for (const auto& perm : current) {
                // Insert num at all positions
                for (int i = 0; i <= perm.size(); i++) {
                    vector<int> newPerm = perm;
                    newPerm.insert(newPerm.begin() + i, num);
                    next.push_back(newPerm);
                }
            }
            
            current = next;
        }
        
        // Remove duplicates using set
        for (const auto& perm : current) {
            uniquePerms.insert(perm);
        }
        
        return vector<vector<int>>(uniquePerms.begin(), uniquePerms.end());
    }
};

/*
 * APPROACH 5: NEXT PERMUTATION APPROACH
 * 
 * Intuition:
 * - Sort array to get first permutation
 * - Use next_permutation algorithm repeatedly
 * - This generates permutations in lexicographic order
 * - Automatically handles duplicates
 * 
 * Algorithm:
 * 1. Sort array
 * 2. Add current permutation to result
 * 3. Generate next permutation using STL or custom implementation
 * 4. Repeat until no more permutations
 * 
 * Time Complexity: O(n! * n) - n! permutations, O(n) for next_permutation
 * Space Complexity: O(1) - excluding output
 */
class Solution5 {
public:
    vector<vector<int>> permuteUnique(vector<int>& nums) {
        vector<vector<int>> result;
        
        // Sort to get first permutation
        sort(nums.begin(), nums.end());
        
        do {
            result.push_back(nums);
        } while (next_permutation(nums.begin(), nums.end()));
        
        return result;
    }
};

// Helper function to print permutations
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
            result = sol.permuteUnique(nums);
            cout << "Approach 1 (Backtracking with Skip): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.permuteUnique(nums);
            cout << "Approach 2 (Swap with Set): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.permuteUnique(nums);
            cout << "Approach 3 (Frequency Map): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.permuteUnique(nums);
            cout << "Approach 4 (Iterative Insertion): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.permuteUnique(nums);
            cout << "Approach 5 (Next Permutation): ";
            break;
        }
    }
    
    cout << "Count: " << result.size() << "\n";
    printPermutations(result);
    cout << "\n";
}

int main() {
    // Test Case 1: Standard case with duplicates
    cout << "Test Case 1: Standard case\n";
    vector<int> test1 = {1, 1, 2};
    for (int i = 1; i <= 5; i++) {
        test(test1, i);
    }
    
    // Test Case 2: No duplicates
    cout << "Test Case 2: No duplicates\n";
    vector<int> test2 = {1, 2, 3};
    for (int i = 1; i <= 5; i++) {
        test(test2, i);
    }
    
    // Test Case 3: All duplicates
    cout << "Test Case 3: All duplicates\n";
    vector<int> test3 = {1, 1, 1};
    for (int i = 1; i <= 5; i++) {
        test(test3, i);
    }
    
    // Test Case 4: Single element
    cout << "Test Case 4: Single element\n";
    vector<int> test4 = {1};
    for (int i = 1; i <= 5; i++) {
        test(test4, i);
    }
    
    // Test Case 5: Two elements, one duplicate
    cout << "Test Case 5: Two elements\n";
    vector<int> test5 = {1, 1};
    for (int i = 1; i <= 5; i++) {
        test(test5, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (Backtracking with Skip):
 * - Time: O(n! * n) - n! permutations, O(n) to copy
 * - Space: O(n) - recursion + used array
 * - Best for: Most efficient, clean code
 * 
 * Approach 2 (Swap with Set):
 * - Time: O(n! * n)
 * - Space: O(n^2) - set at each recursion level
 * - Best for: Alternative backtracking approach
 * 
 * Approach 3 (Frequency Map):
 * - Time: O(n! * n)
 * - Space: O(n) - frequency map
 * - Best for: When many duplicates
 * 
 * Approach 4 (Iterative Insertion):
 * - Time: O(n! * n^2) - insertion overhead
 * - Space: O(n! * n) - set storage
 * - Best for: Avoiding recursion (less efficient)
 * 
 * Approach 5 (Next Permutation):
 * - Time: O(n! * n)
 * - Space: O(1) - excluding output
 * - Best for: Using STL, lexicographic order
 * 
 * INTERVIEW TIPS:
 * 1. Start with Approach 1 - most common and efficient
 * 2. Key insight: sort first, then skip duplicates correctly
 * 3. Explain the condition: i > 0 && nums[i] == nums[i-1] && !used[i-1]
 * 4. This ensures duplicates are used in order
 * 5. Mention next_permutation as elegant alternative
 * 
 * COMMON MISTAKES:
 * 1. Not sorting the array first
 * 2. Wrong duplicate-skipping condition
 * 3. Forgetting to mark elements as used/unused
 * 4. Using set unnecessarily (inefficient)
 * 5. Not understanding why the skip condition works
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. How to generate only k-length permutations? (Modify base case)
 * 2. Can you generate permutations in lexicographic order? (Use Approach 5)
 * 3. What if we want to count permutations without generating? (Use formula)
 * 4. How to handle very large arrays? (Consider memory constraints)
 * 5. Can you generate next permutation in-place? (Yes, O(n) algorithm)
 * 
 * RELATED PROBLEMS:
 * - Permutations (without duplicates)
 * - Next Permutation
 * - Subsets II
 * - Combination Sum II
 * - Palindrome Permutation II
 * 
 * KEY INSIGHTS:
 * 1. Sorting groups duplicates together
 * 2. Skip condition ensures duplicates used in order
 * 3. Used array tracks which elements are in current permutation
 * 4. Frequency map is elegant for many duplicates
 * 5. Next permutation provides lexicographic order
 */

// Made with Bob
