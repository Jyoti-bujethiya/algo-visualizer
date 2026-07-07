/*
 * Problem: Merge k Sorted Lists (LeetCode 23)
 * Link: https://leetcode.com/problems/merge-k-sorted-lists/
 * Difficulty: Hard
 * Category: Heaps and Priority Queues
 *
 * Description:
 * You are given an array of k linked-lists lists, each linked-list is sorted
 * in ascending order. Merge all the linked-lists into one sorted linked-list
 * and return it.
 *
 * Example 1:
 * Input:  lists = [[1,4,5],[1,3,4],[2,6]]
 * Output: [1,1,2,3,4,4,5,6]
 *
 * Example 2:
 * Input:  lists = []   Output: []
 * Example 3:
 * Input:  lists = [[]]  Output: []
 *
 * Constraints:
 * - k == lists.length
 * - 0 <= k <= 10^4
 * - 0 <= lists[i].length <= 500
 * - -10^4 <= lists[i][j] <= 10^4
 * - lists[i] is sorted in ascending order.
 */

#include <vector>
#include <queue>
#include <algorithm>
#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// Helper: build list from vector
ListNode* makeList(vector<int>& v) {
    ListNode dummy(0); ListNode* cur = &dummy;
    for (int x : v) { cur->next = new ListNode(x); cur = cur->next; }
    return dummy.next;
}
// Helper: print list
void printList(ListNode* h) {
    cout << "[";
    while (h) { cout << h->val; if (h->next) cout << ","; h = h->next; }
    cout << "]";
}

/*
 * APPROACH 1: MIN HEAP (PRIORITY QUEUE)
 *
 * Push the head of each list into a min-heap.
 * Each time pop the smallest node, append to result, then push its next node.
 *
 * Time:  O(N log k)  N = total nodes, k = number of lists
 * Space: O(k)  heap holds at most k nodes
 */
class Solution1 {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        auto cmp = [](ListNode* a, ListNode* b){ return a->val > b->val; };
        priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);
        for (auto* h : lists) if (h) pq.push(h);
        ListNode dummy(0); ListNode* cur = &dummy;
        while (!pq.empty()) {
            auto* node = pq.top(); pq.pop();
            cur->next = node; cur = cur->next;
            if (node->next) pq.push(node->next);
        }
        return dummy.next;
    }
};

/*
 * APPROACH 2: DIVIDE AND CONQUER
 *
 * Merge pairs of lists: [0+1, 2+3, ...], then repeat until one list remains.
 * Each merge is O(n), depth is O(log k) → O(N log k) total.
 *
 * Time:  O(N log k)
 * Space: O(log k)  recursion stack
 */
class Solution2 {
    ListNode* mergeTwoLists(ListNode* a, ListNode* b) {
        ListNode dummy(0); ListNode* cur = &dummy;
        while (a && b) {
            if (a->val <= b->val) { cur->next = a; a = a->next; }
            else                  { cur->next = b; b = b->next; }
            cur = cur->next;
        }
        cur->next = a ? a : b;
        return dummy.next;
    }
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        if (lists.empty()) return nullptr;
        int n = lists.size();
        while (n > 1) {
            for (int i = 0; i < n / 2; i++)
                lists[i] = mergeTwoLists(lists[i], lists[n - 1 - i]);
            n = (n + 1) / 2;
        }
        return lists[0];
    }
};

/*
 * APPROACH 3: COLLECT + SORT
 *
 * Collect all values, sort, rebuild list.
 *
 * Time:  O(N log N)
 * Space: O(N)
 */
class Solution3 {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        vector<int> vals;
        for (auto* h : lists)
            for (auto* p = h; p; p = p->next) vals.push_back(p->val);
        sort(vals.begin(), vals.end());
        ListNode dummy(0); ListNode* cur = &dummy;
        for (int v : vals) { cur->next = new ListNode(v); cur = cur->next; }
        return dummy.next;
    }
};

/*
 * APPROACH 4: SEQUENTIAL MERGE (BRUTE)
 *
 * Merge list[0] with list[1], result with list[2], etc.
 *
 * Time:  O(k * N) — poor for large k
 * Space: O(1)
 */
class Solution4 {
    ListNode* mergeTwoLists(ListNode* a, ListNode* b) {
        ListNode dummy(0); ListNode* cur = &dummy;
        while (a && b) {
            if (a->val <= b->val) { cur->next = a; a = a->next; }
            else                  { cur->next = b; b = b->next; }
            cur = cur->next;
        }
        cur->next = a ? a : b;
        return dummy.next;
    }
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        if (lists.empty()) return nullptr;
        ListNode* result = lists[0];
        for (int i = 1; i < (int)lists.size(); i++)
            result = mergeTwoLists(result, lists[i]);
        return result;
    }
};

int main() {
    // [[1,4,5],[1,3,4],[2,6]] → [1,1,2,3,4,4,5,6]
    auto run = [](vector<vector<int>> raw, int approach) {
        vector<ListNode*> lists;
        for (auto& v : raw) lists.push_back(makeList(v));
        ListNode* res = nullptr;
        if      (approach==1) { Solution1 s; res=s.mergeKLists(lists); }
        else if (approach==2) { Solution2 s; res=s.mergeKLists(lists); }
        else if (approach==3) { Solution3 s; res=s.mergeKLists(lists); }
        else                  { Solution4 s; res=s.mergeKLists(lists); }
        cout << "Approach " << approach << ": "; printList(res); cout << "\n";
    };
    for (int i=1;i<=4;i++) run({{1,4,5},{1,3,4},{2,6}}, i);
    for (int i=1;i<=4;i++) run({{}}, i);
    return 0;
}

/*
 * COMPLEXITY SUMMARY:
 * Approach 1 (Min Heap):         Time O(N log k)  Space O(k)
 * Approach 2 (Divide & Conquer): Time O(N log k)  Space O(log k)
 * Approach 3 (Collect + Sort):   Time O(N log N)  Space O(N)
 * Approach 4 (Sequential):       Time O(k*N)      Space O(1)
 */

// Made with Bob
