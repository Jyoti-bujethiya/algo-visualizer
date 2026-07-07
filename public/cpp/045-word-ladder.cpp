/*
 * Problem: Word Ladder (LeetCode 127)
 * Difficulty: Hard
 * Category: Trees and Graphs
 * 
 * Description:
 * A transformation sequence from word beginWord to word endWord using a dictionary
 * wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:
 * - Every adjacent pair of words differs by a single letter
 * - Every si for 1 <= i <= k is in wordList (beginWord need not be in wordList)
 * - sk == endWord
 * 
 * Given two words, beginWord and endWord, and a dictionary wordList, return the
 * number of words in the shortest transformation sequence from beginWord to endWord,
 * or 0 if no such sequence exists.
 * 
 * Example 1:
 * Input: beginWord = "hit", endWord = "cog", 
 *        wordList = ["hot","dot","dog","lot","log","cog"]
 * Output: 5
 * Explanation: One shortest transformation sequence is:
 * "hit" -> "hot" -> "dot" -> "dog" -> "cog" (5 words)
 * 
 * Example 2:
 * Input: beginWord = "hit", endWord = "cog",
 *        wordList = ["hot","dot","dog","lot","log"]
 * Output: 0
 * Explanation: endWord "cog" is not in wordList, so no transformation possible.
 * 
 * Constraints:
 * - 1 <= beginWord.length <= 10
 * - endWord.length == beginWord.length
 * - 1 <= wordList.length <= 5000
 * - wordList[i].length == beginWord.length
 * - beginWord, endWord, and wordList[i] consist of lowercase English letters
 * - beginWord != endWord
 * - All words in wordList are unique
 */

#include <iostream>
#include <vector>
#include <string>
#include <queue>
#include <unordered_set>
#include <unordered_map>
using namespace std;

/*
 * APPROACH 1: BFS WITH WORD TRANSFORMATION
 * 
 * Intuition:
 * - This is a shortest path problem in an unweighted graph
 * - Each word is a node, edges exist between words differing by one letter
 * - Use BFS to find shortest path from beginWord to endWord
 * - Try all possible single-letter transformations at each step
 * 
 * Algorithm:
 * 1. Convert wordList to set for O(1) lookup
 * 2. If endWord not in set, return 0
 * 3. Use BFS starting from beginWord
 * 4. For each word, try changing each character to 'a'-'z'
 * 5. If transformed word is in set and not visited, add to queue
 * 6. Track level (distance) in BFS
 * 7. Return level when endWord is found
 * 
 * Time Complexity: O(M^2 * N) where M = word length, N = wordList size
 *                  For each word, we try M positions * 26 letters = 26M transformations
 *                  Each transformation takes O(M) to create new string
 * Space Complexity: O(N) for queue and visited set
 */
class Solution1 {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        // Convert wordList to set for O(1) lookup
        unordered_set<string> wordSet(wordList.begin(), wordList.end());
        
        // If endWord not in wordList, no transformation possible
        if (wordSet.find(endWord) == wordSet.end()) {
            return 0;
        }
        
        // BFS queue: stores (word, level)
        queue<pair<string, int>> q;
        q.push({beginWord, 1});
        
        // Visited set to avoid cycles
        unordered_set<string> visited;
        visited.insert(beginWord);
        
        while (!q.empty()) {
            auto [currentWord, level] = q.front();
            q.pop();
            
            // Try transforming each character
            for (int i = 0; i < currentWord.length(); i++) {
                string word = currentWord;
                
                // Try all 26 letters
                for (char c = 'a'; c <= 'z'; c++) {
                    word[i] = c;
                    
                    // Found the target word
                    if (word == endWord) {
                        return level + 1;
                    }
                    
                    // If word is in dictionary and not visited
                    if (wordSet.find(word) != wordSet.end() && 
                        visited.find(word) == visited.end()) {
                        visited.insert(word);
                        q.push({word, level + 1});
                    }
                }
            }
        }
        
        return 0; // No transformation sequence found
    }
};

/*
 * APPROACH 2: BIDIRECTIONAL BFS
 * 
 * Intuition:
 * - Search from both beginWord and endWord simultaneously
 * - When the two searches meet, we've found the shortest path
 * - This can be much faster as it reduces search space significantly
 * - Search space grows exponentially, so meeting in middle is O(b^(d/2)) vs O(b^d)
 * 
 * Algorithm:
 * 1. Maintain two sets: beginSet and endSet
 * 2. Always expand the smaller set (optimization)
 * 3. For each word in current set, try all transformations
 * 4. If transformation is in opposite set, path found
 * 5. Otherwise, add to next level set
 * 6. Swap sets and continue
 * 
 * Time Complexity: O(M^2 * N) but typically much faster in practice
 * Space Complexity: O(N) for sets
 */
class Solution2 {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        unordered_set<string> wordSet(wordList.begin(), wordList.end());
        
        if (wordSet.find(endWord) == wordSet.end()) {
            return 0;
        }
        
        // Two sets for bidirectional search
        unordered_set<string> beginSet, endSet;
        beginSet.insert(beginWord);
        endSet.insert(endWord);
        
        int level = 1;
        
        while (!beginSet.empty() && !endSet.empty()) {
            // Always expand the smaller set
            if (beginSet.size() > endSet.size()) {
                swap(beginSet, endSet);
            }
            
            unordered_set<string> nextLevel;
            
            for (const string& word : beginSet) {
                string currentWord = word;
                
                for (int i = 0; i < currentWord.length(); i++) {
                    char originalChar = currentWord[i];
                    
                    for (char c = 'a'; c <= 'z'; c++) {
                        currentWord[i] = c;
                        
                        // Found connection between two searches
                        if (endSet.find(currentWord) != endSet.end()) {
                            return level + 1;
                        }
                        
                        // Add to next level if in dictionary
                        if (wordSet.find(currentWord) != wordSet.end()) {
                            nextLevel.insert(currentWord);
                            wordSet.erase(currentWord); // Mark as visited
                        }
                    }
                    
                    currentWord[i] = originalChar; // Restore
                }
            }
            
            beginSet = nextLevel;
            level++;
        }
        
        return 0;
    }
};

/*
 * APPROACH 3: BFS WITH PATTERN MATCHING
 * 
 * Intuition:
 * - Instead of trying all 26 letters, use pattern matching
 * - Create intermediate states like "h*t", "*ot", "ho*" for "hot"
 * - Build adjacency list using these patterns
 * - This can be faster when word length is large
 * 
 * Algorithm:
 * 1. Build graph using pattern matching
 * 2. For each word, create M patterns (M = word length)
 * 3. Map each pattern to all words matching it
 * 4. Use standard BFS on this graph
 * 
 * Time Complexity: O(M^2 * N) for building graph + O(M * N) for BFS
 * Space Complexity: O(M^2 * N) for pattern map
 */
class Solution3 {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        // Build pattern map
        unordered_map<string, vector<string>> patternMap;
        
        // Add beginWord to wordList if not present
        bool hasBeginWord = false;
        for (const string& word : wordList) {
            if (word == beginWord) hasBeginWord = true;
        }
        if (!hasBeginWord) {
            wordList.push_back(beginWord);
        }
        
        // Build adjacency list using patterns
        for (const string& word : wordList) {
            for (int i = 0; i < word.length(); i++) {
                string pattern = word.substr(0, i) + "*" + word.substr(i + 1);
                patternMap[pattern].push_back(word);
            }
        }
        
        // BFS
        queue<pair<string, int>> q;
        q.push({beginWord, 1});
        
        unordered_set<string> visited;
        visited.insert(beginWord);
        
        while (!q.empty()) {
            auto [currentWord, level] = q.front();
            q.pop();
            
            // Try all patterns for current word
            for (int i = 0; i < currentWord.length(); i++) {
                string pattern = currentWord.substr(0, i) + "*" + currentWord.substr(i + 1);
                
                // Get all words matching this pattern
                for (const string& word : patternMap[pattern]) {
                    if (word == endWord) {
                        return level + 1;
                    }
                    
                    if (visited.find(word) == visited.end()) {
                        visited.insert(word);
                        q.push({word, level + 1});
                    }
                }
            }
        }
        
        return 0;
    }
};

/*
 * APPROACH 4: OPTIMIZED BFS (REMOVE FROM SET)
 * 
 * Intuition:
 * - Instead of maintaining separate visited set, remove words from wordSet
 * - This saves space and simplifies code
 * - Once a word is visited, it won't be visited again
 * 
 * Algorithm:
 * 1. Use wordSet as both dictionary and visited tracker
 * 2. Remove words from set as they are visited
 * 3. This ensures each word is processed only once
 * 
 * Time Complexity: O(M^2 * N)
 * Space Complexity: O(N) - only wordSet and queue
 */
class Solution4 {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        unordered_set<string> wordSet(wordList.begin(), wordList.end());
        
        if (wordSet.find(endWord) == wordSet.end()) {
            return 0;
        }
        
        queue<string> q;
        q.push(beginWord);
        
        int level = 1;
        
        while (!q.empty()) {
            int size = q.size();
            level++;
            
            // Process all words at current level
            for (int i = 0; i < size; i++) {
                string currentWord = q.front();
                q.pop();
                
                // Try all transformations
                for (int j = 0; j < currentWord.length(); j++) {
                    char originalChar = currentWord[j];
                    
                    for (char c = 'a'; c <= 'z'; c++) {
                        if (c == originalChar) continue;
                        
                        currentWord[j] = c;
                        
                        if (currentWord == endWord) {
                            return level;
                        }
                        
                        if (wordSet.find(currentWord) != wordSet.end()) {
                            q.push(currentWord);
                            wordSet.erase(currentWord); // Remove to mark as visited
                        }
                    }
                    
                    currentWord[j] = originalChar;
                }
            }
        }
        
        return 0;
    }
};

// Test function
void test(string beginWord, string endWord, vector<string> wordList, int approach) {
    int result;
    
    cout << "Input: beginWord = \"" << beginWord << "\", endWord = \"" << endWord << "\"\n";
    cout << "wordList = [";
    for (int i = 0; i < wordList.size(); i++) {
        cout << "\"" << wordList[i] << "\"";
        if (i < wordList.size() - 1) cout << ",";
    }
    cout << "]\n";
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.ladderLength(beginWord, endWord, wordList);
            cout << "Approach 1 (BFS with Transformation): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.ladderLength(beginWord, endWord, wordList);
            cout << "Approach 2 (Bidirectional BFS): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.ladderLength(beginWord, endWord, wordList);
            cout << "Approach 3 (BFS with Pattern Matching): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.ladderLength(beginWord, endWord, wordList);
            cout << "Approach 4 (Optimized BFS): ";
            break;
        }
    }
    
    cout << result << "\n\n";
}

int main() {
    // Test Case 1: Standard case with solution
    cout << "Test Case 1: Standard case\n";
    vector<string> test1 = {"hot", "dot", "dog", "lot", "log", "cog"};
    for (int i = 1; i <= 4; i++) {
        test("hit", "cog", test1, i);
    }
    
    // Test Case 2: No solution (endWord not in list)
    cout << "Test Case 2: No solution\n";
    vector<string> test2 = {"hot", "dot", "dog", "lot", "log"};
    for (int i = 1; i <= 4; i++) {
        test("hit", "cog", test2, i);
    }
    
    // Test Case 3: Direct transformation
    cout << "Test Case 3: Direct transformation\n";
    vector<string> test3 = {"hot"};
    for (int i = 1; i <= 4; i++) {
        test("hot", "hot", test3, i);
    }
    
    // Test Case 4: Multiple paths
    cout << "Test Case 4: Multiple paths\n";
    vector<string> test4 = {"hot", "dot", "dog", "lot", "log", "cog"};
    for (int i = 1; i <= 4; i++) {
        test("hit", "cog", test4, i);
    }
    
    // Test Case 5: Long chain
    cout << "Test Case 5: Long chain\n";
    vector<string> test5 = {"a", "b", "c"};
    for (int i = 1; i <= 4; i++) {
        test("a", "c", test5, i);
    }
    
    // Test Case 6: No path exists
    cout << "Test Case 6: No path\n";
    vector<string> test6 = {"hot", "dog"};
    for (int i = 1; i <= 4; i++) {
        test("hot", "dog", test6, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (BFS with Transformation):
 * - Time: O(M^2 * N) where M = word length, N = wordList size
 * - Space: O(N) for queue and visited set
 * - Best for: Standard implementation, easy to understand
 * 
 * Approach 2 (Bidirectional BFS):
 * - Time: O(M^2 * N) but typically much faster
 * - Space: O(N) for sets
 * - Best for: Large search spaces, optimal performance
 * 
 * Approach 3 (BFS with Pattern Matching):
 * - Time: O(M^2 * N) for preprocessing + O(M * N) for BFS
 * - Space: O(M^2 * N) for pattern map
 * - Best for: Long words, many transformations
 * 
 * Approach 4 (Optimized BFS):
 * - Time: O(M^2 * N)
 * - Space: O(N) - minimal space usage
 * - Best for: Space-constrained environments
 * 
 * INTERVIEW TIPS:
 * 1. Recognize this as shortest path problem → use BFS
 * 2. Start with Approach 1, then optimize to Approach 2 if asked
 * 3. Bidirectional BFS is a key optimization technique
 * 4. Discuss trade-offs between different approaches
 * 5. Handle edge cases: endWord not in list, beginWord == endWord
 * 
 * COMMON MISTAKES:
 * 1. Using DFS instead of BFS (won't find shortest path)
 * 2. Not checking if endWord is in wordList
 * 3. Forgetting to mark words as visited (infinite loop)
 * 4. Off-by-one errors in level counting
 * 5. Not restoring original character after transformation
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. Return all shortest paths? (Use BFS with backtracking)
 * 2. What if words have different lengths? (No transformation possible)
 * 3. Can you optimize for very long words? (Use pattern matching)
 * 4. How to handle very large wordList? (Use bidirectional BFS)
 * 5. What if multiple endWords? (Modify BFS to check multiple targets)
 */

// Made with Bob
