/*
 * LeetCode Problem #11: Container With Most Water
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/container-with-most-water/
 * 
 * Problem Statement:
 * You are given an integer array height of length n. There are n vertical lines
 * drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).
 * Find two lines that together with the x-axis form a container that contains
 * the most water. Return the maximum amount of water a container can store.
 */

#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

class Solution {
public:
    // ==================== APPROACH 1: Brute Force ====================
    /*
     * Algorithm:
     * - Check all possible pairs of lines
     * - Calculate area for each pair: min(height[i], height[j]) * (j - i)
     * - Track maximum area
     * 
     * Time Complexity: O(n²) - nested loops
     * Space Complexity: O(1) - only variables
     * 
     * When to use: Only for understanding, not acceptable in interviews
     */
    int maxArea_BruteForce(vector<int>& height) {
        int maxArea = 0;
        int n = height.size();
        
        for (int i = 0; i < n - 1; i++) {
            for (int j = i + 1; j < n; j++) {
                // Area = width * min_height
                int width = j - i;
                int minHeight = min(height[i], height[j]);
                int area = width * minHeight;
                maxArea = max(maxArea, area);
            }
        }
        
        return maxArea;
    }
    
    // ==================== APPROACH 2: Two Pointer (Optimal) ====================
    /*
     * Algorithm:
     * - Start with widest container (left = 0, right = n-1)
     * - Calculate area and update maximum
     * - Move pointer with smaller height inward (greedy choice)
     * - Continue until pointers meet
     * 
     * Time Complexity: O(n) - single pass with two pointers
     * Space Complexity: O(1) - only variables
     * 
     * When to use: This is the OPTIMAL solution
     * 
     * Key Insight:
     * - Width decreases as we move pointers inward
     * - To potentially increase area, we need to increase height
     * - Moving the pointer with smaller height gives us a chance to find taller line
     * - Moving the pointer with larger height will never increase area
     *   (because height is limited by the smaller one)
     * 
     * Proof of Correctness:
     * - We start with maximum width
     * - If we move the taller line, area can only decrease (width↓, height same or ↓)
     * - If we move the shorter line, area might increase (width↓, but height might ↑)
     * - By always moving the shorter line, we explore all potentially better solutions
     */
    int maxArea_TwoPointer(vector<int>& height) {
        int maxArea = 0;
        int left = 0;
        int right = height.size() - 1;
        
        while (left < right) {
            // Calculate current area
            int width = right - left;
            int minHeight = min(height[left], height[right]);
            int area = width * minHeight;
            maxArea = max(maxArea, area);
            
            // Move pointer with smaller height
            // This is the greedy choice that ensures optimality
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        
        return maxArea;
    }
    
    // ==================== APPROACH 3: Two Pointer with Optimization ====================
    /*
     * Same as Approach 2 but with minor optimizations:
     * - Skip lines that are shorter than current minimum
     * - Early termination if remaining width can't beat current max
     * 
     * Time Complexity: O(n) - still linear but faster in practice
     * Space Complexity: O(1)
     */
    int maxArea_Optimized(vector<int>& height) {
        int maxArea = 0;
        int left = 0;
        int right = height.size() - 1;
        
        while (left < right) {
            int width = right - left;
            int minHeight = min(height[left], height[right]);
            int area = width * minHeight;
            maxArea = max(maxArea, area);
            
            // Optimization: skip shorter lines on the side we're moving
            if (height[left] < height[right]) {
                int currentHeight = height[left];
                // Skip all lines shorter than or equal to current
                while (left < right && height[left] <= currentHeight) {
                    left++;
                }
            } else {
                int currentHeight = height[right];
                while (left < right && height[right] <= currentHeight) {
                    right--;
                }
            }
        }
        
        return maxArea;
    }
};

// ==================== TEST CASES ====================
void runTests() {
    Solution sol;
    
    // Test Case 1: Standard case
    vector<int> height1 = {1, 8, 6, 2, 5, 4, 8, 3, 7};
    cout << "Test 1: " << sol.maxArea_TwoPointer(height1) << endl;
    // Expected: 49 (between index 1 and 8: min(8,7) * 7 = 49)
    
    // Test Case 2: Two elements
    vector<int> height2 = {1, 1};
    cout << "Test 2: " << sol.maxArea_TwoPointer(height2) << endl;
    // Expected: 1 (min(1,1) * 1 = 1)
    
    // Test Case 3: Increasing heights
    vector<int> height3 = {1, 2, 3, 4, 5};
    cout << "Test 3: " << sol.maxArea_TwoPointer(height3) << endl;
    // Expected: 6 (between index 0 and 4: min(1,5) * 4 = 4, or 1 and 3: min(2,4) * 2 = 4)
    // Actually: 6 (between index 1 and 4: min(2,5) * 3 = 6)
    
    // Test Case 4: All same height
    vector<int> height4 = {5, 5, 5, 5};
    cout << "Test 4: " << sol.maxArea_TwoPointer(height4) << endl;
    // Expected: 15 (min(5,5) * 3 = 15)
    
    // Test Case 5: Large difference in heights
    vector<int> height5 = {1, 100, 1};
    cout << "Test 5: " << sol.maxArea_TwoPointer(height5) << endl;
    // Expected: 2 (between index 0 and 2: min(1,1) * 2 = 2)
}

int main() {
    runTests();
    return 0;
}

/*
 * COMPARISON OF APPROACHES:
 * 
 * 1. Brute Force:
 *    Time: O(n²), Space: O(1)
 *    Pros: Simple to understand
 *    Cons: Too slow for large inputs
 * 
 * 2. Two Pointer (RECOMMENDED):
 *    Time: O(n), Space: O(1)
 *    Pros: Optimal, elegant, easy to implement
 *    Cons: Requires understanding of greedy approach
 * 
 * 3. Optimized Two Pointer:
 *    Time: O(n), Space: O(1)
 *    Pros: Faster in practice with skipping
 *    Cons: Slightly more complex, same worst case
 * 
 * INTERVIEW TIPS:
 * - Start by explaining the brute force approach
 * - Draw a diagram to visualize the problem
 * - Explain why moving the shorter line makes sense (greedy choice)
 * - Prove that we won't miss the optimal solution
 * - Discuss why we can't use binary search (not monotonic)
 * 
 * KEY INSIGHTS:
 * - Area is limited by the shorter of two lines
 * - Width decreases as we move inward
 * - To compensate for width loss, we need height gain
 * - Moving the taller line never helps (height stays same or decreases)
 * - Moving the shorter line gives us a chance to find a taller line
 * 
 * COMMON MISTAKES:
 * - Moving both pointers at once
 * - Moving the taller line instead of shorter
 * - Not understanding why greedy approach works
 * - Trying to use sorting (loses position information)
 * 
 * FOLLOW-UP QUESTIONS:
 * - What if we need to find the actual indices? (Track them during iteration)
 * - Can we use divide and conquer? (No, not efficient for this problem)
 * - What if heights can be negative? (Problem doesn't make sense)
 * - How to handle duplicate heights? (Current solution handles it)
 * 
 * RELATED PROBLEMS:
 * - Trapping Rain Water (LeetCode #42) - similar but different approach
 * - Largest Rectangle in Histogram (LeetCode #84) - uses stack
 * 
 * VISUALIZATION:
 * For height = [1,8,6,2,5,4,8,3,7]:
 * 
 * Initial: left=0(1), right=8(7), area = min(1,7)*8 = 8
 * Move left (shorter): left=1(8), right=8(7), area = min(8,7)*7 = 49 ✓
 * Move right (shorter): left=1(8), right=7(3), area = min(8,3)*6 = 18
 * Move right: left=1(8), right=6(8), area = min(8,8)*5 = 40
 * ... continue until left meets right
 * 
 * Maximum area found: 49
 */

// Made with Bob
