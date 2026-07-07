/*
 * Problem: Reorganize String (LeetCode 767)
 * Link: https://leetcode.com/problems/reorganize-string/
 * Difficulty: Medium
 * Category: Heaps and Priority Queues
 *
 * Description:
 * Given a string s, rearrange the characters of s so that any two adjacent
 * characters are not the same. Return any such rearrangement of s or return ""
 * if not possible.
 *
 * Example 1: s="aab" → "aba"
 * Example 2: s="aaab" → ""  (impossible)
 *
 * Key insight: if the most frequent character has frequency > ⌈n/2⌉ it is impossible.
 *
 * Constraints:
 * - 1 <= s.length <= 500
 * - s consists of lowercase English letters
 */

#include <string>
#include <vector>
#include <queue>
#include <algorithm>
#include <iostream>
using namespace std;

/*
 * APPROACH 1: MAX HEAP (GREEDY)
 *
 * Always place the most frequent character that is not the same as the last placed.
 * Use a max-heap of (freq, char). After placing a char, hold it for one step (cooldown=1).
 *
 * Time:  O(n log 26) = O(n)
 * Space: O(1)  (26 chars)
 */
class Solution1 {
public:
    string reorganizeString(string s) {
        int freq[26] = {};
        for (char c : s) freq[c-'a']++;
        priority_queue<pair<int,char>> pq;
        for (int i = 0; i < 26; i++) if (freq[i]) pq.push({freq[i], 'a'+i});

        string res;
        while (pq.size() >= 2) {
            auto [f1, c1] = pq.top(); pq.pop();
            auto [f2, c2] = pq.top(); pq.pop();
            res += c1; res += c2;
            if (f1 - 1) pq.push({f1-1, c1});
            if (f2 - 1) pq.push({f2-1, c2});
        }
        if (!pq.empty()) {
            auto [f, c] = pq.top();
            if (f > 1) return "";
            res += c;
        }
        return res;
    }
};

/*
 * APPROACH 2: INTERLEAVE EVEN/ODD INDICES
 *
 * Sort characters by frequency. Fill even indices 0,2,4,... first (most frequent),
 * then odd indices 1,3,5,...
 * If most frequent char needs > ceil(n/2) slots → impossible.
 *
 * Time:  O(n log n)
 * Space: O(n)
 */
class Solution2 {
public:
    string reorganizeString(string s) {
        int n = s.size(), freq[26] = {};
        for (char c : s) freq[c-'a']++;
        int maxFreq = *max_element(freq, freq+26);
        if (maxFreq > (n+1)/2) return "";

        // Sort chars by freq desc
        vector<pair<int,char>> v;
        for (int i=0;i<26;i++) if(freq[i]) v.push_back({freq[i],'a'+i});
        sort(v.rbegin(), v.rend());

        string res(n, ' ');
        int idx = 0;
        for (auto& [f, c] : v) {
            for (int i = 0; i < f; i++) {
                if (idx >= n) idx = 1;   // switch to odd
                res[idx] = c;
                idx += 2;
            }
        }
        // Validate
        for (int i=1;i<n;i++) if(res[i]==res[i-1]) return "";
        return res;
    }
};

/*
 * APPROACH 3: GREEDY WITH PREV TRACKING
 *
 * Maintain max-heap. At each step place the top element, but if it equals the
 * last placed character use the second-top instead (and re-push the top).
 *
 * Time:  O(n log 26) = O(n)
 * Space: O(1)
 */
class Solution3 {
public:
    string reorganizeString(string s) {
        int freq[26] = {};
        for (char c : s) freq[c-'a']++;
        int maxFreq = *max_element(freq, freq+26);
        if (maxFreq > (s.size()+1)/2) return "";

        priority_queue<pair<int,char>> pq;
        for (int i=0;i<26;i++) if(freq[i]) pq.push({freq[i],'a'+i});

        string res;
        char prev = 0;
        while (!pq.empty()) {
            auto [f, c] = pq.top(); pq.pop();
            if (c == prev && !pq.empty()) {
                auto [f2, c2] = pq.top(); pq.pop();
                res += c2;
                if (f2-1) pq.push({f2-1, c2});
                pq.push({f, c});
                prev = c2;
            } else {
                res += c;
                if (f-1) pq.push({f-1, c});
                prev = c;
            }
        }
        return res.size() == s.size() ? res : "";
    }
};

/*
 * APPROACH 4: COUNTING + DIRECT PLACEMENT
 *
 * Place most frequent char at all even positions first, then fill odd.
 * Classic O(n) approach without sorting.
 *
 * Time:  O(n)
 * Space: O(n)
 */
class Solution4 {
public:
    string reorganizeString(string s) {
        int n = s.size(), freq[26] = {};
        for (char c : s) freq[c-'a']++;
        int maxChar = max_element(freq, freq+26) - freq;
        if (freq[maxChar] > (n+1)/2) return "";

        string res(n, ' ');
        int idx = 0;
        // Place most frequent first at even slots
        while (freq[maxChar] > 0) { res[idx] = 'a'+maxChar; idx+=2; freq[maxChar]--; }
        // Fill remaining
        for (int i=0;i<26;i++) {
            while (freq[i]>0) {
                if (idx >= n) idx = 1;
                res[idx] = 'a'+i; idx+=2; freq[i]--;
            }
        }
        return res;
    }
};

int main() {
    auto run = [](string s) {
        cout << "s=\"" << s << "\"\n";
        { Solution1 sol; cout << "  MaxHeap:   \"" << sol.reorganizeString(s) << "\"\n"; }
        { Solution2 sol; cout << "  Interleave:\"" << sol.reorganizeString(s) << "\"\n"; }
        { Solution3 sol; cout << "  PrevTrack: \"" << sol.reorganizeString(s) << "\"\n"; }
        { Solution4 sol; cout << "  Direct:    \"" << sol.reorganizeString(s) << "\"\n"; }
        cout << "\n";
    };
    run("aab");    // "aba"
    run("aaab");   // ""
    run("vvvlo");  // any valid
    run("aabbcc"); // any valid
    return 0;
}

/*
 * COMPLEXITY SUMMARY:
 * Approach 1 (Max Heap):    Time O(n)        Space O(1)
 * Approach 2 (Interleave):  Time O(n log n)  Space O(n)
 * Approach 3 (Prev Track):  Time O(n)        Space O(1)
 * Approach 4 (Direct):      Time O(n)        Space O(n)
 *
 * Impossible if maxFreq > ceil(n/2).
 */

// Made with Bob
