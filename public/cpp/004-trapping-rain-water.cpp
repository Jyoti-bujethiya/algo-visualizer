/*
 * LeetCode Problem #42: Trapping Rain Water
 * Difficulty: Hard
 * Link: https://leetcode.com/problems/trapping-rain-water/
 * 
 * Problem Statement:
 * Given n non-negative integers representing an elevation map where the width
 * of each bar is 1, compute how much water it can trap after raining.
 */

#include <vector>
#include <stack>
#include <algorithm>
#include <iostream>
using namespace std;

class Solution {
public:
    // ==================== APPROACH 1: Brute Force ====================
    /*
     * Algorithm:
     * - For each position, find max height on left and right
     * - Water trapped at position = min(leftMax, rightMax) - height[i]
     * - Sum up water for all positions
     * 
     * Time Complexity: O(n²) - for each element, scan left and right
     * Space Complexity: O(1)
     * 
     * When to use: Only for understanding
     */
    int trap_BruteForce(vector<int>& height) {
        int n = height.size();
        int totalWater = 0;
        
        for (int i = 0; i < n; i++) {
            // Find max height on left
            int leftMax = 0;
            for (int j = 0; j <= i; j++) {
                leftMax = max(leftMax, height[j]);
            }
            
            // Find max height on right
            int rightMax = 0;
            for (int j = i; j < n; j++) {
                rightMax = max(rightMax, height[j]);
            }
            
            // Water at current position
            totalWater += min(leftMax, rightMax) - height[i];
        }
        
        return totalWater;
    }
    
    // ==================== APPROACH 2: Dynamic Programming ====================
    /*
     * Algorithm:
     * - Precompute leftMax and rightMax arrays
     * - leftMax[i] = max height from 0 to i
     * - rightMax[i] = max height from i to n-1
     * - Water at i = min(leftMax[i], rightMax[i]) - height[i]
     * 
     * Time Complexity: O(n) - three passes
     * Space Complexity: O(n) - two arrays
     * 
     * When to use: When you need O(n) time and can use O(n) space
     */
    int trap_DP(vector<int>& height) {
        int n = height.size();
        if (n == 0) return 0;
        
        vector<int> leftMax(n), rightMax(n);
        
        // Build leftMax array
        leftMax[0] = height[0];
        for (int i = 1; i < n; i++) {
            leftMax[i] = max(leftMax[i - 1], height[i]);
        }
        
        // Build rightMax array
        rightMax[n - 1] = height[n - 1];
        for (int i = n - 2; i >= 0; i--) {
            rightMax[i] = max(rightMax[i + 1], height[i]);
        }
        
        // Calculate trapped water
        int totalWater = 0;
        for (int i = 0; i < n; i++) {
            totalWater += min(leftMax[i], rightMax[i]) - height[i];
        }
        
        return totalWater;
    }
    
    // ==================== APPROACH 3: Two Pointer (Optimal) ====================
    /*
     * Algorithm:
     * - Use two pointers from both ends
     * - Track leftMax and rightMax as we go
     * - Move pointer with smaller max height
     * - Add water based on the smaller max
     * 
     * Time Complexity: O(n) - single pass
     * Space Complexity: O(1) - only variables
     * 
     * When to use: This is the OPTIMAL solution
     * 
     * Key Insight:
     * - Water level at position depends on min(leftMax, rightMax)
     * - If leftMax < rightMax, we know water level is determined by leftMax
     * - We can calculate water at left position without knowing exact rightMax
     * - Same logic applies when rightMax < leftMax
     */
    int trap_TwoPointer(vector<int>& height) {
        int n = height.size();
        if (n == 0) return 0;
        
        int left = 0, right = n - 1;
        int leftMax = 0, rightMax = 0;
        int totalWater = 0;
        
        while (left < right) {
            if (height[left] < height[right]) {
                // Process left side
                if (height[left] >= leftMax) {
                    leftMax = height[left];
                } else {
                    totalWater += leftMax - height[left];
                }
                left++;
            } else {
                // Process right side
                if (height[right] >= rightMax) {
                    rightMax = height[right];
                } else {
                    totalWater += rightMax - height[right];
                }
                right--;
            }
        }
        
        return totalWater;
    }
    
    // ==================== APPROACH 4: Stack ====================
    /*
     * Algorithm:
     * - Use stack to store indices of bars
     * - When we find a bar taller than stack top, we can trap water
     * - Calculate water in horizontal layers
     * 
     * Time Complexity: O(n) - each bar pushed/popped once
     * Space Complexity: O(n) - stack storage
     * 
     * When to use: Alternative approach, useful for understanding
     * 
     * Key Insight:
     * - Stack maintains decreasing heights
     * - When we find taller bar, we can calculate trapped water
     * - Water is calculated layer by layer (horizontal slices)
     */
    int trap_Stack(vector<int>& height) {
        int n = height.size();
        stack<int> st;
        int totalWater = 0;
        
        for (int i = 0; i < n; i++) {
            // While current bar is taller than stack top
            while (!st.empty() && height[i] > height[st.top()]) {
                int top = st.top();
                st.pop();
                
                if (st.empty()) break;
                
                // Calculate water trapped
                int distance = i - st.top() - 1;
                int boundedHeight = min(height[i], height[st.top()]) - height[top];
                totalWater += distance * boundedHeight;
            }
            st.push(i);
        }
        
        return totalWater;
    }
};

// ==================== TEST CASES ====================
void runTests() {
    Solution sol;
    
    // Test Case 1: Standard case
    vector<int> height1 = {0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1};
    cout << "Test 1: " << sol.trap_TwoPointer(height1) << endl;
    // Expected: 6
    
    // Test Case 2: No water trapped
    vector<int> height2 = {3, 2, 1, 0};
    cout << "Test 2: " << sol.trap_TwoPointer(height2) << endl;
    // Expected: 0
    
    // Test Case 3: Simple valley
    vector<int> height3 = {3, 0, 2};
    cout << "Test 3: " << sol.trap_TwoPointer(height3) << endl;
    // Expected: 2
    
    // Test Case 4: Multiple valleys
    vector<int> height4 = {4, 2, 0, 3, 2, 5};
    cout << "Test 4: " << sol.trap_TwoPointer(height4) << endl;
    // Expected: 9
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
 *    Not acceptable for interviews
 * 
 * 2. Dynamic Programming:
 *    Time: O(n), Space: O(n)
 *    Good solution, easy to understand
 * 
 * 3. Two Pointer (RECOMMENDED):
 *    Time: O(n), Space: O(1)
 *    Optimal solution, most elegant
 * 
 * 4. Stack:
 *    Time: O(n), Space: O(n)
 *    Alternative approach, calculates horizontally
 * 
 * INTERVIEW TIPS:
 * - Draw the elevation map to visualize
 * - Explain that water level = min(leftMax, rightMax)
 * - Start with DP approach, then optimize to two pointer
 * - Mention stack approach as alternative
 * - Discuss trade-offs between approaches
 * 
 * KEY INSIGHTS:
 * - Water at position depends on boundaries on both sides
 * - We only need the minimum of left and right max
 * - Two pointer exploits this by processing from smaller side
 * - Stack approach calculates water layer by layer
 * 
 * VISUALIZATION for [0,1,0,2,1,0,1,3,2,1,2,1]:
 * 
 *       █
 *   █xxx█x█
 * █x█x█████x█
 * 0102101321 21
 * 
 * Water (x) = 6 units
 */

// Made with Bob
