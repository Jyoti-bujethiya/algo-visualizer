/*
 * Problem: Word Break (LeetCode 139)
 * Link: https://leetcode.com/problems/word-break/
 * Difficulty: Medium
 * Category: Dynamic Programming
 * 
 * Description:
 * Given a string s and a dictionary of strings wordDict, return true if s can be
 * segmented into a space-separated sequence of one or more dictionary words.
 * 
 * Note that the same word in the dictionary may be reused multiple times in the
 * segmentation.
 * 
 * Example 1:
 * Input: s = "leetcode", wordDict = ["leet","code"]
 * Output: true
 * Explanation: Return true because "leetcode" can be segmented as "leet code".
 * 
 * Example 2:
 * Input: s = "applepenapple", wordDict = ["apple","pen"]
 * Output: true
 * Explanation: Return true because "applepenapple" can be segmented as "apple pen apple".
 * 
 * Example 3:
 * Input: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
 * Output: false
 * 
 * Constraints:
 * - 1 <= s.length <= 300
 * - 1 <= wordDict.length <= 1000
 * - 1 <= wordDict[i].length <= 20
 * - s and wordDict[i] consist of only lowercase English letters.
 * - All the strings of wordDict are unique.
 */

#include <iostream>
#include <vector>
#include <string>
#include <unordered_set>
#include <queue>
using namespace std;

/*
 * APPROACH 1: DYNAMIC PROGRAMMING (OPTIMAL)
 * 
 * Intuition:
 * - dp[i] = true if s[0..i-1] can be segmented
 * - For each position i, check all possible last words
 * - If s[j..i-1] is in dict and dp[j] is true, then dp[i] is true
 * 
 * Algorithm:
 * 1. dp[0] = true (empty string)
 * 2. For i from 1 to n:
 *    - For j from 0 to i-1:
 *      - If dp[j] and s[j..i-1] in dict:
 *        - dp[i] = true
 * 3. Return dp[n]
 * 
 * Time Complexity: O(n^2 * m) where m is max word length
 * Space Complexity: O(n) - dp array
 */
class Solution1 {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        int n = s.length();
        unordered_set<string> dict(wordDict.begin(), wordDict.end());
        vector<bool> dp(n + 1, false);
        dp[0] = true;
        
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && dict.count(s.substr(j, i - j))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        
        return dp[n];
    }
};

/*
 * APPROACH 2: DP WITH OPTIMIZATION
 * 
 * Intuition:
 * - Same as Approach 1 but optimize inner loop
 * - Only check substrings up to max word length
 * - Reduces unnecessary checks
 * 
 * Algorithm:
 * 1. Find max word length
 * 2. For each position, only check last maxLen characters
 * 3. Same DP logic
 * 
 * Time Complexity: O(n * maxLen)
 * Space Complexity: O(n)
 */
class Solution2 {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        int n = s.length();
        unordered_set<string> dict(wordDict.begin(), wordDict.end());
        
        // Find max word length
        int maxLen = 0;
        for (const string& word : wordDict) {
            maxLen = max(maxLen, (int)word.length());
        }
        
        vector<bool> dp(n + 1, false);
        dp[0] = true;
        
        for (int i = 1; i <= n; i++) {
            for (int j = max(0, i - maxLen); j < i; j++) {
                if (dp[j] && dict.count(s.substr(j, i - j))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        
        return dp[n];
    }
};

/*
 * APPROACH 3: BFS
 * 
 * Intuition:
 * - Treat as graph problem
 * - Each position is a node
 * - Edge exists if substring is in dictionary
 * - BFS from start to end
 * 
 * Algorithm:
 * 1. Use queue for BFS
 * 2. Start from position 0
 * 3. For each position, try all possible next positions
 * 4. If reach end, return true
 * 
 * Time Complexity: O(n^2)
 * Space Complexity: O(n)
 */
class Solution3 {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        int n = s.length();
        unordered_set<string> dict(wordDict.begin(), wordDict.end());
        vector<bool> visited(n, false);
        queue<int> q;
        q.push(0);
        
        while (!q.empty()) {
            int start = q.front();
            q.pop();
            
            if (start == n) return true;
            if (visited[start]) continue;
            visited[start] = true;
            
            for (int end = start + 1; end <= n; end++) {
                if (dict.count(s.substr(start, end - start))) {
                    q.push(end);
                }
            }
        }
        
        return false;
    }
};

/*
 * APPROACH 4: MEMOIZATION (TOP-DOWN DP)
 * 
 * Intuition:
 * - Recursive approach with memoization
 * - Try to match each word from current position
 * - Cache results to avoid recomputation
 * 
 * Algorithm:
 * 1. For each position, try all words
 * 2. If word matches, recursively check rest
 * 3. Memoize results
 * 
 * Time Complexity: O(n^2)
 * Space Complexity: O(n) - memo + recursion stack
 */
class Solution4 {
private:
    unordered_set<string> dict;
    vector<int> memo;
    
    bool helper(const string& s, int start) {
        if (start == s.length()) return true;
        if (memo[start] != -1) return memo[start];
        
        for (int end = start + 1; end <= s.length(); end++) {
            string word = s.substr(start, end - start);
            if (dict.count(word) && helper(s, end)) {
                return memo[start] = 1;
            }
        }
        
        return memo[start] = 0;
    }
    
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        dict = unordered_set<string>(wordDict.begin(), wordDict.end());
        memo.resize(s.length(), -1);
        return helper(s, 0);
    }
};

/*
 * APPROACH 5: TRIE + DP
 * 
 * Intuition:
 * - Build trie from dictionary
 * - Use trie for efficient word matching
 * - Combine with DP
 * 
 * Algorithm:
 * 1. Build trie from wordDict
 * 2. For each position, use trie to find matching words
 * 3. Apply DP logic
 * 
 * Time Complexity: O(n^2)
 * Space Complexity: O(total chars in dict)
 */
class Solution5 {
private:
    struct TrieNode {
        unordered_map<char, TrieNode*> children;
        bool isWord;
        TrieNode() : isWord(false) {}
    };
    
    TrieNode* root;
    
    void insert(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children[c]) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
        }
        node->isWord = true;
    }
    
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        root = new TrieNode();
        for (const string& word : wordDict) {
            insert(word);
        }
        
        int n = s.length();
        vector<bool> dp(n + 1, false);
        dp[0] = true;
        
        for (int i = 0; i < n; i++) {
            if (!dp[i]) continue;
            
            TrieNode* node = root;
            for (int j = i; j < n; j++) {
                if (!node->children[s[j]]) break;
                node = node->children[s[j]];
                if (node->isWord) {
                    dp[j + 1] = true;
                }
            }
        }
        
        return dp[n];
    }
};

// Test function
void test(string s, vector<string> wordDict, int approach) {
    bool result;
    
    cout << "Input: s = \"" << s << "\", wordDict = [";
    for (int i = 0; i < wordDict.size(); i++) {
        cout << "\"" << wordDict[i] << "\"";
        if (i < wordDict.size() - 1) cout << ",";
    }
    cout << "]\n";
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.wordBreak(s, wordDict);
            cout << "Approach 1 (DP): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.wordBreak(s, wordDict);
            cout << "Approach 2 (DP Optimized): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.wordBreak(s, wordDict);
            cout << "Approach 3 (BFS): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.wordBreak(s, wordDict);
            cout << "Approach 4 (Memoization): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.wordBreak(s, wordDict);
            cout << "Approach 5 (Trie + DP): ";
            break;
        }
    }
    
    cout << (result ? "true" : "false") << "\n\n";
}

int main() {
    // Test Case 1: Simple case
    cout << "Test Case 1: Simple case\n";
    vector<string> dict1 = {"leet", "code"};
    for (int i = 1; i <= 5; i++) {
        test("leetcode", dict1, i);
    }
    
    // Test Case 2: Reuse words
    cout << "Test Case 2: Reuse words\n";
    vector<string> dict2 = {"apple", "pen"};
    for (int i = 1; i <= 5; i++) {
        test("applepenapple", dict2, i);
    }
    
    // Test Case 3: Impossible
    cout << "Test Case 3: Impossible\n";
    vector<string> dict3 = {"cats", "dog", "sand", "and", "cat"};
    for (int i = 1; i <= 5; i++) {
        test("catsandog", dict3, i);
    }
    
    // Test Case 4: Empty string
    cout << "Test Case 4: Single character\n";
    vector<string> dict4 = {"a"};
    for (int i = 1; i <= 5; i++) {
        test("a", dict4, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (DP - OPTIMAL):
 * - Time: O(n^2 * m) where m is substring length
 * - Space: O(n)
 * - Best for: Standard solution, easy to understand
 * 
 * Approach 2 (DP Optimized):
 * - Time: O(n * maxLen)
 * - Space: O(n)
 * - Best for: When words have bounded length
 * 
 * Approach 3 (BFS):
 * - Time: O(n^2)
 * - Space: O(n)
 * - Best for: Graph perspective
 * 
 * Approach 4 (Memoization):
 * - Time: O(n^2)
 * - Space: O(n)
 * - Best for: Top-down thinking
 * 
 * Approach 5 (Trie + DP):
 * - Time: O(n^2)
 * - Space: O(total chars)
 * - Best for: Large dictionary
 * 
 * INTERVIEW TIPS:
 * 1. Start with Approach 1 (DP)
 * 2. Explain dp[i] meaning clearly
 * 3. Draw example showing DP table
 * 4. Mention optimization with max word length
 * 5. Discuss BFS alternative
 * 
 * COMMON MISTAKES:
 * 1. Not handling empty string correctly
 * 2. Wrong substring indices
 * 3. Not using set for O(1) lookup
 * 4. Forgetting words can be reused
 * 5. Not optimizing with max word length
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. Can you return all possible segmentations? (Backtracking)
 * 2. What if words can't be reused? (Different DP)
 * 3. How to handle very large dictionary? (Trie)
 * 4. Can you do it in O(n)? (No, need to check substrings)
 * 5. What about word break II? (Return all segmentations)
 * 
 * RELATED PROBLEMS:
 * - Word Break II (return all segmentations)
 * - Concatenated Words
 * - Word Search II
 * - Extra Characters in a String
 * - Sentence Screen Fitting
 * 
 * KEY INSIGHTS:
 * 1. DP is natural approach
 * 2. dp[i] represents if s[0..i-1] can be segmented
 * 3. Check all possible last words
 * 4. Use set for O(1) word lookup
 * 5. Can optimize with max word length
 * 
 * DP RECURRENCE:
 * - dp[0] = true (base case)
 * - dp[i] = OR of (dp[j] AND s[j..i-1] in dict) for all j < i
 * - Answer is dp[n]
 * - Build table bottom-up
 * - Each position depends on previous positions
 * 
 * OPTIMIZATION TECHNIQUES:
 * 1. Use set instead of vector for dictionary
 * 2. Only check substrings up to max word length
 * 3. Break early when dp[i] becomes true
 * 4. Use trie for large dictionaries
 * 5. BFS with visited array to avoid reprocessing
 * 
 * WHY DP WORKS:
 * - Optimal substructure: if s[0..i] can be segmented,
 *   and s[i+1..j] is a word, then s[0..j] can be segmented
 * - Overlapping subproblems: same prefixes checked multiple times
 * - Bottom-up builds solution from smaller subproblems
 * - Each position depends only on previous positions
 */

// Made with Bob
