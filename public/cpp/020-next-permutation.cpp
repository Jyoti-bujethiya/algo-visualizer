/*
 * Problem: Next Permutation (LeetCode 31)
 * Link: https://leetcode.com/problems/next-permutation/
 * Difficulty: Medium
 * Category: Arrays and Strings
 *
 * Description:
 * A permutation of an array of integers is an arrangement of its members into
 * a sequence or linear order. The next permutation of an array is the next
 * lexicographically greater permutation of its integer values.
 * If no such arrangement is possible (array is in descending order), rearrange
 * it as the lowest possible order (ascending). The replacement must be in-place.
 *
 * Example 1:
 * Input: nums = [1,2,3]  → Output: [1,3,2]
 *
 * Example 2:
 * Input: nums = [3,2,1]  → Output: [1,2,3]
 *
 * Example 3:
 * Input: nums = [1,1,5]  → Output: [1,5,1]
 */

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/*
 * APPROACH 1: STL NEXT_PERMUTATION
 * Time: O(n), Space: O(1)
 * Direct STL call — good baseline / interview sanity check.
 */
class Solution1 {
public:
    void nextPermutation(vector<int>& nums) {
        next_permutation(nums.begin(), nums.end());
    }
};

/*
 * APPROACH 2: CLASSIC IN-PLACE (OPTIMAL)
 * Time: O(n), Space: O(1)
 * Step 1: Find rightmost index i where nums[i] < nums[i+1]  (pivot)
 * Step 2: Find rightmost index j > i where nums[j] > nums[i]
 * Step 3: Swap nums[i] and nums[j]
 * Step 4: Reverse the suffix starting at i+1
 */
class Solution2 {
public:
    void nextPermutation(vector<int>& nums) {
        int n = nums.size();
        int i = n - 2;

        // Step 1: find pivot
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;

        if (i >= 0) {
            // Step 2: find swap candidate
            int j = n - 1;
            while (nums[j] <= nums[i]) j--;
            // Step 3: swap
            swap(nums[i], nums[j]);
        }

        // Step 4: reverse suffix
        reverse(nums.begin() + i + 1, nums.end());
    }
};

/*
 * APPROACH 3: EXPLICIT REVERSE WITHOUT STL REVERSE
 * Time: O(n), Space: O(1)
 * Same logic as Approach 2 but implements the suffix reverse manually.
 */
class Solution3 {
public:
    void nextPermutation(vector<int>& nums) {
        int n = nums.size();
        int i = n - 2;

        while (i >= 0 && nums[i] >= nums[i + 1]) i--;

        if (i >= 0) {
            int j = n - 1;
            while (nums[j] <= nums[i]) j--;
            swap(nums[i], nums[j]);
        }

        // Manual reverse of suffix
        int lo = i + 1, hi = n - 1;
        while (lo < hi) {
            swap(nums[lo++], nums[hi--]);
        }
    }
};

/*
 * APPROACH 4: TWO-PASS SCAN (VERBOSE / EDUCATIONAL)
 * Time: O(n), Space: O(1)
 * Identical to approach 2 but written with clearer variable names
 * for teaching purposes — highlights the 4 conceptual steps.
 */
class Solution4 {
public:
    void nextPermutation(vector<int>& nums) {
        int n = nums.size();

        // Pass 1: locate the "dip" — last position where ascending order breaks
        int pivot = -1;
        for (int i = n - 2; i >= 0; i--) {
            if (nums[i] < nums[i + 1]) { pivot = i; break; }
        }

        // If entirely non-increasing → just reverse to get smallest permutation
        if (pivot == -1) {
            reverse(nums.begin(), nums.end());
            return;
        }

        // Pass 2: find smallest element in suffix that is greater than pivot
        int swapIdx = -1;
        for (int j = n - 1; j > pivot; j--) {
            if (nums[j] > nums[pivot]) { swapIdx = j; break; }
        }

        swap(nums[pivot], nums[swapIdx]);
        reverse(nums.begin() + pivot + 1, nums.end());
    }
};

/*
 * APPROACH 5: SORT-BASED (LESS OPTIMAL BUT CORRECT)
 * Time: O(n log n), Space: O(1)
 * Find pivot, swap with smallest greater element in suffix,
 * then sort the suffix to get the smallest arrangement.
 * Slightly slower due to sort but still in-place.
 */
class Solution5 {
public:
    void nextPermutation(vector<int>& nums) {
        int n = nums.size();
        int i = n - 2;

        while (i >= 0 && nums[i] >= nums[i + 1]) i--;

        if (i >= 0) {
            int j = n - 1;
            while (nums[j] <= nums[i]) j--;
            swap(nums[i], nums[j]);
        }

        // Sort suffix instead of reverse (works because suffix is descending)
        sort(nums.begin() + i + 1, nums.end());
    }
};

void print(const vector<int>& v) {
    cout << "[";
    for (int i = 0; i < (int)v.size(); i++) { if (i) cout << ","; cout << v[i]; }
    cout << "]";
}

void test(vector<int> nums, int approach) {
    cout << "Approach " << approach << ": ";
    print(nums); cout << " → ";
    switch(approach) {
        case 1: { Solution1 s; s.nextPermutation(nums); break; }
        case 2: { Solution2 s; s.nextPermutation(nums); break; }
        case 3: { Solution3 s; s.nextPermutation(nums); break; }
        case 4: { Solution4 s; s.nextPermutation(nums); break; }
        case 5: { Solution5 s; s.nextPermutation(nums); break; }
    }
    print(nums); cout << "\n";
}

int main() {
    vector<vector<int>> cases = {{1,2,3},{3,2,1},{1,1,5},{1,3,2},{2,3,1}};
    for (auto& c : cases) {
        cout << "\nInput: "; print(c); cout << "\n";
        for (int i = 1; i <= 5; i++) test(c, i);
    }
    return 0;
}

// Made with Bob
