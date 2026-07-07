/*
 * Problem: Merge K Sorted Lists (LeetCode 23)
 * Link: https://leetcode.com/problems/merge-k-sorted-lists/
 * Difficulty: Hard
 * Category: Linked Lists / Heaps
 * 
 * Description:
 * You are given an array of k linked-lists lists, each linked-list is sorted in
 * ascending order. Merge all the linked-lists into one sorted linked-list and return it.
 * 
 * Example 1:
 * Input: lists = [[1,4,5],[1,3,4],[2,6]]
 * Output: [1,1,2,3,4,4,5,6]
 * 
 * Example 2:
 * Input: lists = []
 * Output: []
 * 
 * Example 3:
 * Input: lists = [[]]
 * Output: []
 * 
 * Constraints:
 * - k == lists.length
 * - 0 <= k <= 10^4
 * - 0 <= lists[i].length <= 500
 * - -10^4 <= lists[i][j] <= 10^4
 * - lists[i] is sorted in ascending order.
 * - The sum of lists[i].length will not exceed 10^4.
 */

#include <iostream>
#include <vector>
#include <queue>
using namespace std;

// Definition for singly-linked list
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

/*
 * APPROACH 1: MIN HEAP (OPTIMAL)
 * 
 * Intuition:
 * - Use min heap to track smallest element among k lists
 * - Always extract minimum and add its next node
 * - Heap size is at most k
 * 
 * Algorithm:
 * 1. Add first node of each list to min heap
 * 2. While heap not empty:
 *    - Extract minimum node
 *    - Add to result
 *    - If node has next, add next to heap
 * 3. Return merged list
 * 
 * Time Complexity: O(N log k) where N is total nodes, k is number of lists
 * Space Complexity: O(k) - heap size
 */
class Solution1 {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        auto cmp = [](ListNode* a, ListNode* b) {
            return a->val > b->val;
        };
        priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> minHeap(cmp);
        
        // Add first node of each list
        for (ListNode* list : lists) {
            if (list) {
                minHeap.push(list);
            }
        }
        
        ListNode dummy(0);
        ListNode* tail = &dummy;
        
        while (!minHeap.empty()) {
            ListNode* node = minHeap.top();
            minHeap.pop();
            
            tail->next = node;
            tail = tail->next;
            
            if (node->next) {
                minHeap.push(node->next);
            }
        }
        
        return dummy.next;
    }
};

/*
 * APPROACH 2: DIVIDE AND CONQUER
 * 
 * Intuition:
 * - Merge lists pairwise
 * - Recursively merge pairs until one list remains
 * - Similar to merge sort
 * 
 * Algorithm:
 * 1. If 0 or 1 list, return it
 * 2. Divide lists into two halves
 * 3. Recursively merge each half
 * 4. Merge the two results
 * 
 * Time Complexity: O(N log k)
 * Space Complexity: O(log k) - recursion stack
 */
class Solution2 {
private:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* tail = &dummy;
        
        while (l1 && l2) {
            if (l1->val < l2->val) {
                tail->next = l1;
                l1 = l1->next;
            } else {
                tail->next = l2;
                l2 = l2->next;
            }
            tail = tail->next;
        }
        
        tail->next = l1 ? l1 : l2;
        return dummy.next;
    }
    
    ListNode* mergeKListsHelper(vector<ListNode*>& lists, int left, int right) {
        if (left > right) return nullptr;
        if (left == right) return lists[left];
        
        int mid = left + (right - left) / 2;
        ListNode* leftList = mergeKListsHelper(lists, left, mid);
        ListNode* rightList = mergeKListsHelper(lists, mid + 1, right);
        
        return mergeTwoLists(leftList, rightList);
    }
    
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        if (lists.empty()) return nullptr;
        return mergeKListsHelper(lists, 0, lists.size() - 1);
    }
};

/*
 * APPROACH 3: ITERATIVE PAIRWISE MERGE
 * 
 * Intuition:
 * - Merge lists pairwise iteratively
 * - Reduce k lists to k/2, then k/4, etc.
 * - Bottom-up approach
 * 
 * Algorithm:
 * 1. While more than one list:
 *    - Merge pairs of lists
 *    - Store merged lists
 * 2. Return final list
 * 
 * Time Complexity: O(N log k)
 * Space Complexity: O(1)
 */
class Solution3 {
private:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* tail = &dummy;
        
        while (l1 && l2) {
            if (l1->val < l2->val) {
                tail->next = l1;
                l1 = l1->next;
            } else {
                tail->next = l2;
                l2 = l2->next;
            }
            tail = tail->next;
        }
        
        tail->next = l1 ? l1 : l2;
        return dummy.next;
    }
    
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        if (lists.empty()) return nullptr;
        
        while (lists.size() > 1) {
            vector<ListNode*> merged;
            
            for (int i = 0; i < lists.size(); i += 2) {
                ListNode* l1 = lists[i];
                ListNode* l2 = (i + 1 < lists.size()) ? lists[i + 1] : nullptr;
                merged.push_back(mergeTwoLists(l1, l2));
            }
            
            lists = merged;
        }
        
        return lists[0];
    }
};

/*
 * APPROACH 4: SEQUENTIAL MERGE
 * 
 * Intuition:
 * - Merge lists one by one
 * - Merge first two, then merge result with third, etc.
 * - Simple but not optimal
 * 
 * Algorithm:
 * 1. Start with first list
 * 2. Merge with each subsequent list
 * 3. Return final merged list
 * 
 * Time Complexity: O(N * k) - less efficient
 * Space Complexity: O(1)
 */
class Solution4 {
private:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* tail = &dummy;
        
        while (l1 && l2) {
            if (l1->val < l2->val) {
                tail->next = l1;
                l1 = l1->next;
            } else {
                tail->next = l2;
                l2 = l2->next;
            }
            tail = tail->next;
        }
        
        tail->next = l1 ? l1 : l2;
        return dummy.next;
    }
    
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        if (lists.empty()) return nullptr;
        
        ListNode* result = lists[0];
        for (int i = 1; i < lists.size(); i++) {
            result = mergeTwoLists(result, lists[i]);
        }
        
        return result;
    }
};

/*
 * APPROACH 5: PRIORITY QUEUE WITH CUSTOM COMPARATOR
 * 
 * Intuition:
 * - Similar to Approach 1
 * - Use struct for cleaner comparator
 * - More explicit implementation
 * 
 * Algorithm:
 * Same as Approach 1 with struct comparator
 * 
 * Time Complexity: O(N log k)
 * Space Complexity: O(k)
 */
class Solution5 {
private:
    struct Compare {
        bool operator()(ListNode* a, ListNode* b) {
            return a->val > b->val;
        }
    };
    
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        priority_queue<ListNode*, vector<ListNode*>, Compare> pq;
        
        for (ListNode* list : lists) {
            if (list) {
                pq.push(list);
            }
        }
        
        ListNode dummy(0);
        ListNode* tail = &dummy;
        
        while (!pq.empty()) {
            ListNode* node = pq.top();
            pq.pop();
            
            tail->next = node;
            tail = tail->next;
            
            if (node->next) {
                pq.push(node->next);
            }
        }
        
        return dummy.next;
    }
};

// Helper functions
ListNode* createList(vector<int> vals) {
    ListNode dummy(0);
    ListNode* tail = &dummy;
    for (int val : vals) {
        tail->next = new ListNode(val);
        tail = tail->next;
    }
    return dummy.next;
}

void printList(ListNode* head) {
    cout << "[";
    while (head) {
        cout << head->val;
        if (head->next) cout << ",";
        head = head->next;
    }
    cout << "]";
}

// Test function
void test(vector<vector<int>> input, int approach) {
    vector<ListNode*> lists;
    for (auto& vals : input) {
        lists.push_back(createList(vals));
    }
    
    cout << "Input: [";
    for (int i = 0; i < input.size(); i++) {
        cout << "[";
        for (int j = 0; j < input[i].size(); j++) {
            cout << input[i][j];
            if (j < input[i].size() - 1) cout << ",";
        }
        cout << "]";
        if (i < input.size() - 1) cout << ",";
    }
    cout << "]\n";
    
    ListNode* result = nullptr;
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.mergeKLists(lists);
            cout << "Approach 1 (Min Heap): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.mergeKLists(lists);
            cout << "Approach 2 (Divide & Conquer): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.mergeKLists(lists);
            cout << "Approach 3 (Iterative Pairwise): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.mergeKLists(lists);
            cout << "Approach 4 (Sequential): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.mergeKLists(lists);
            cout << "Approach 5 (PQ Custom): ";
            break;
        }
    }
    
    printList(result);
    cout << "\n\n";
}

int main() {
    // Test Case 1: Standard case
    cout << "Test Case 1: Standard case\n";
    vector<vector<int>> test1 = {{1,4,5}, {1,3,4}, {2,6}};
    for (int i = 1; i <= 5; i++) {
        test(test1, i);
    }
    
    // Test Case 2: Empty lists
    cout << "Test Case 2: Empty\n";
    vector<vector<int>> test2 = {};
    for (int i = 1; i <= 5; i++) {
        test(test2, i);
    }
    
    // Test Case 3: Single list
    cout << "Test Case 3: Single list\n";
    vector<vector<int>> test3 = {{1,2,3}};
    for (int i = 1; i <= 5; i++) {
        test(test3, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (Min Heap - OPTIMAL):
 * - Time: O(N log k) where N = total nodes
 * - Space: O(k) - heap size
 * - Best for: Standard solution, efficient
 * 
 * Approach 2 (Divide & Conquer):
 * - Time: O(N log k)
 * - Space: O(log k) - recursion
 * - Best for: Recursive preference
 * 
 * Approach 3 (Iterative Pairwise):
 * - Time: O(N log k)
 * - Space: O(1)
 * - Best for: Space efficiency
 * 
 * Approach 4 (Sequential):
 * - Time: O(N * k) - less efficient
 * - Space: O(1)
 * - Best for: Simple implementation
 * 
 * Approach 5 (PQ Custom):
 * - Time: O(N log k)
 * - Space: O(k)
 * - Best for: Clean comparator
 * 
 * INTERVIEW TIPS:
 * 1. Start with Approach 1 (min heap)
 * 2. Explain why heap is efficient
 * 3. Mention divide & conquer alternative
 * 4. Draw example with 3 lists
 * 5. Discuss time complexity clearly
 * 
 * COMMON MISTAKES:
 * 1. Not handling empty lists
 * 2. Wrong heap comparator
 * 3. Forgetting to add next node to heap
 * 4. Memory leaks in test code
 * 5. Off-by-one in pairwise merge
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. What if lists are very long? (Heap still optimal)
 * 2. Can you do it in-place? (Yes, just rearrange pointers)
 * 3. What about k=2? (Simple two-pointer merge)
 * 4. How to handle duplicates? (Already handled)
 * 5. What if k is very large? (Heap still O(log k))
 * 
 * RELATED PROBLEMS:
 * - Merge Two Sorted Lists
 * - Merge Sorted Array
 * - Kth Smallest Element in Sorted Matrix
 * - Find K Pairs with Smallest Sums
 * - Ugly Number II
 * 
 * KEY INSIGHTS:
 * 1. Min heap tracks smallest among k lists
 * 2. Heap size never exceeds k
 * 3. Each node processed once
 * 4. Divide & conquer also O(N log k)
 * 5. Sequential merge is O(N * k)
 * 
 * WHY MIN HEAP WORKS:
 * - Always extract minimum element
 * - Heap maintains k candidates
 * - Each extraction is O(log k)
 * - Total N extractions
 * - Overall O(N log k)
 * 
 * DIVIDE & CONQUER ANALYSIS:
 * - Merge pairs: k/2 merges of 2N/k nodes
 * - Next level: k/4 merges of 4N/k nodes
 * - log k levels total
 * - Each level processes N nodes
 * - Total: O(N log k)
 * 
 * COMPARISON:
 * - Heap: O(N log k), O(k) space
 * - D&C: O(N log k), O(log k) space
 * - Iterative: O(N log k), O(1) space
 * - Sequential: O(N * k), O(1) space
 * - Choose based on constraints
 */

// Made with Bob
