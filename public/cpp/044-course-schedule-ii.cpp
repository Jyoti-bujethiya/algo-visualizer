/*
 * Problem: Course Schedule II (LeetCode 210)
 * Link: https://leetcode.com/problems/course-schedule-ii/
 * Difficulty: Medium
 * Category: Graphs
 * 
 * Description:
 * There are a total of numCourses courses you have to take, labeled from 0 to
 * numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi]
 * indicates that you must take course bi first if you want to take course ai.
 * 
 * Return the ordering of courses you should take to finish all courses. If there are
 * many valid answers, return any of them. If it is impossible to finish all courses,
 * return an empty array.
 * 
 * Example 1:
 * Input: numCourses = 2, prerequisites = [[1,0]]
 * Output: [0,1]
 * 
 * Example 2:
 * Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
 * Output: [0,2,1,3] or [0,1,2,3]
 * 
 * Example 3:
 * Input: numCourses = 1, prerequisites = []
 * Output: [0]
 * 
 * Constraints:
 * - 1 <= numCourses <= 2000
 * - 0 <= prerequisites.length <= numCourses * (numCourses - 1)
 * - prerequisites[i].length == 2
 * - 0 <= ai, bi < numCourses
 * - ai != bi
 * - All the pairs [ai, bi] are distinct.
 */

#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

/*
 * APPROACH 1: KAHN'S ALGORITHM (BFS TOPOLOGICAL SORT)
 * 
 * Intuition:
 * - Use BFS with in-degree tracking
 * - Start with courses having no prerequisites (in-degree 0)
 * - Process courses and reduce in-degree of dependents
 * - If all courses processed, valid order exists
 * 
 * Algorithm:
 * 1. Build adjacency list and in-degree array
 * 2. Add all courses with in-degree 0 to queue
 * 3. While queue not empty:
 *    - Remove course from queue
 *    - Add to result
 *    - Reduce in-degree of neighbors
 *    - If neighbor in-degree becomes 0, add to queue
 * 4. If result size == numCourses, return result
 * 5. Otherwise, return empty array (cycle exists)
 * 
 * Time Complexity: O(V + E) - visit all vertices and edges
 * Space Complexity: O(V + E) - adjacency list
 */
class Solution1 {
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> graph(numCourses);
        vector<int> inDegree(numCourses, 0);
        
        // Build graph and in-degree array
        for (auto& prereq : prerequisites) {
            int course = prereq[0];
            int prerequisite = prereq[1];
            graph[prerequisite].push_back(course);
            inDegree[course]++;
        }
        
        // Find all courses with no prerequisites
        queue<int> q;
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) {
                q.push(i);
            }
        }
        
        vector<int> result;
        
        // Process courses
        while (!q.empty()) {
            int course = q.front();
            q.pop();
            result.push_back(course);
            
            // Reduce in-degree of dependent courses
            for (int next : graph[course]) {
                inDegree[next]--;
                if (inDegree[next] == 0) {
                    q.push(next);
                }
            }
        }
        
        // Check if all courses can be taken
        return result.size() == numCourses ? result : vector<int>();
    }
};

/*
 * APPROACH 2: DFS TOPOLOGICAL SORT
 * 
 * Intuition:
 * - Use DFS with three states (unvisited, visiting, visited)
 * - Detect cycles during DFS
 * - Add courses to result in post-order (reverse)
 * - Reverse result at end
 * 
 * Algorithm:
 * 1. Build adjacency list
 * 2. For each unvisited course, run DFS
 * 3. DFS:
 *    - Mark as visiting
 *    - Visit all neighbors
 *    - If neighbor is visiting, cycle detected
 *    - Mark as visited
 *    - Add to result
 * 4. Reverse result
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V + E)
 */
class Solution2 {
private:
    bool dfs(int course, vector<vector<int>>& graph, vector<int>& state, vector<int>& result) {
        if (state[course] == 1) return false; // Cycle detected
        if (state[course] == 2) return true;  // Already processed
        
        state[course] = 1; // Mark as visiting
        
        for (int next : graph[course]) {
            if (!dfs(next, graph, state, result)) {
                return false;
            }
        }
        
        state[course] = 2; // Mark as visited
        result.push_back(course);
        return true;
    }
    
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> graph(numCourses);
        
        // Build graph
        for (auto& prereq : prerequisites) {
            int course = prereq[0];
            int prerequisite = prereq[1];
            graph[prerequisite].push_back(course);
        }
        
        vector<int> state(numCourses, 0); // 0: unvisited, 1: visiting, 2: visited
        vector<int> result;
        
        // Run DFS from each unvisited course
        for (int i = 0; i < numCourses; i++) {
            if (state[i] == 0) {
                if (!dfs(i, graph, state, result)) {
                    return vector<int>(); // Cycle detected
                }
            }
        }
        
        reverse(result.begin(), result.end());
        return result;
    }
};

/*
 * APPROACH 3: DFS WITH EXPLICIT STACK
 * 
 * Intuition:
 * - Iterative DFS using explicit stack
 * - Avoid recursion stack overflow
 * - Same logic as recursive DFS
 * 
 * Algorithm:
 * 1. Use stack for DFS
 * 2. Track state for each course
 * 3. Process courses iteratively
 * 4. Detect cycles
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V + E)
 */
class Solution3 {
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> graph(numCourses);
        
        for (auto& prereq : prerequisites) {
            graph[prereq[1]].push_back(prereq[0]);
        }
        
        vector<int> state(numCourses, 0);
        vector<int> result;
        
        for (int start = 0; start < numCourses; start++) {
            if (state[start] != 0) continue;
            
            vector<pair<int, int>> stack; // (course, neighbor_index)
            stack.push_back({start, 0});
            
            while (!stack.empty()) {
                auto [course, idx] = stack.back();
                stack.pop_back();
                
                if (idx == 0) {
                    if (state[course] == 1) return vector<int>(); // Cycle
                    if (state[course] == 2) continue;
                    state[course] = 1;
                }
                
                if (idx < graph[course].size()) {
                    stack.push_back({course, idx + 1});
                    int next = graph[course][idx];
                    if (state[next] == 0) {
                        stack.push_back({next, 0});
                    } else if (state[next] == 1) {
                        return vector<int>(); // Cycle
                    }
                } else {
                    state[course] = 2;
                    result.push_back(course);
                }
            }
        }
        
        reverse(result.begin(), result.end());
        return result;
    }
};

/*
 * APPROACH 4: KAHN'S WITH PRIORITY QUEUE
 * 
 * Intuition:
 * - Same as Kahn's but use priority queue
 * - Produces lexicographically smallest order
 * - Useful when specific ordering needed
 * 
 * Algorithm:
 * Same as Approach 1 but with priority queue
 * 
 * Time Complexity: O(V log V + E)
 * Space Complexity: O(V + E)
 */
class Solution4 {
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> graph(numCourses);
        vector<int> inDegree(numCourses, 0);
        
        for (auto& prereq : prerequisites) {
            graph[prereq[1]].push_back(prereq[0]);
            inDegree[prereq[0]]++;
        }
        
        priority_queue<int, vector<int>, greater<int>> pq;
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) {
                pq.push(i);
            }
        }
        
        vector<int> result;
        
        while (!pq.empty()) {
            int course = pq.top();
            pq.pop();
            result.push_back(course);
            
            for (int next : graph[course]) {
                inDegree[next]--;
                if (inDegree[next] == 0) {
                    pq.push(next);
                }
            }
        }
        
        return result.size() == numCourses ? result : vector<int>();
    }
};

/*
 * APPROACH 5: DFS WITH FINISH TIME
 * 
 * Intuition:
 * - Track finish time for each course
 * - Sort by finish time (descending)
 * - Produces topological order
 * 
 * Algorithm:
 * 1. Run DFS and track finish times
 * 2. Sort courses by finish time
 * 3. Return sorted order
 * 
 * Time Complexity: O(V log V + E)
 * Space Complexity: O(V + E)
 */
class Solution5 {
private:
    int time;
    
    bool dfs(int course, vector<vector<int>>& graph, vector<int>& state, 
             vector<int>& finishTime) {
        if (state[course] == 1) return false;
        if (state[course] == 2) return true;
        
        state[course] = 1;
        
        for (int next : graph[course]) {
            if (!dfs(next, graph, state, finishTime)) {
                return false;
            }
        }
        
        state[course] = 2;
        finishTime[course] = time++;
        return true;
    }
    
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> graph(numCourses);
        
        for (auto& prereq : prerequisites) {
            graph[prereq[1]].push_back(prereq[0]);
        }
        
        vector<int> state(numCourses, 0);
        vector<int> finishTime(numCourses);
        time = 0;
        
        for (int i = 0; i < numCourses; i++) {
            if (state[i] == 0) {
                if (!dfs(i, graph, state, finishTime)) {
                    return vector<int>();
                }
            }
        }
        
        vector<pair<int, int>> courses;
        for (int i = 0; i < numCourses; i++) {
            courses.push_back({finishTime[i], i});
        }
        
        sort(courses.rbegin(), courses.rend());
        
        vector<int> result;
        for (auto& p : courses) {
            result.push_back(p.second);
        }
        
        return result;
    }
};

// Test function
void test(int numCourses, vector<vector<int>> prerequisites, int approach) {
    vector<int> result;
    
    cout << "Input: numCourses = " << numCourses << ", prerequisites = [";
    for (int i = 0; i < prerequisites.size(); i++) {
        cout << "[" << prerequisites[i][0] << "," << prerequisites[i][1] << "]";
        if (i < prerequisites.size() - 1) cout << ",";
    }
    cout << "]\n";
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.findOrder(numCourses, prerequisites);
            cout << "Approach 1 (Kahn's): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.findOrder(numCourses, prerequisites);
            cout << "Approach 2 (DFS): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.findOrder(numCourses, prerequisites);
            cout << "Approach 3 (DFS Iterative): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.findOrder(numCourses, prerequisites);
            cout << "Approach 4 (Priority Queue): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.findOrder(numCourses, prerequisites);
            cout << "Approach 5 (Finish Time): ";
            break;
        }
    }
    
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]\n\n";
}

int main() {
    // Test Case 1: Simple case
    cout << "Test Case 1: Simple case\n";
    vector<vector<int>> test1 = {{1, 0}};
    for (int i = 1; i <= 5; i++) {
        test(2, test1, i);
    }
    
    // Test Case 2: Multiple dependencies
    cout << "Test Case 2: Multiple dependencies\n";
    vector<vector<int>> test2 = {{1, 0}, {2, 0}, {3, 1}, {3, 2}};
    for (int i = 1; i <= 5; i++) {
        test(4, test2, i);
    }
    
    // Test Case 3: Cycle (impossible)
    cout << "Test Case 3: Cycle\n";
    vector<vector<int>> test3 = {{1, 0}, {0, 1}};
    for (int i = 1; i <= 5; i++) {
        test(2, test3, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (Kahn's - OPTIMAL):
 * - Time: O(V + E)
 * - Space: O(V + E)
 * - Best for: Intuitive, easy to understand
 * 
 * Approach 2 (DFS):
 * - Time: O(V + E)
 * - Space: O(V + E)
 * - Best for: Recursive solution
 * 
 * Approach 3 (DFS Iterative):
 * - Time: O(V + E)
 * - Space: O(V + E)
 * - Best for: Avoiding recursion
 * 
 * Approach 4 (Priority Queue):
 * - Time: O(V log V + E)
 * - Space: O(V + E)
 * - Best for: Lexicographically smallest order
 * 
 * Approach 5 (Finish Time):
 * - Time: O(V log V + E)
 * - Space: O(V + E)
 * - Best for: Understanding topological sort
 * 
 * INTERVIEW TIPS:
 * 1. Start with Kahn's algorithm (Approach 1)
 * 2. Explain in-degree concept
 * 3. Draw example showing process
 * 4. Mention DFS alternative
 * 5. Discuss cycle detection
 * 
 * COMMON MISTAKES:
 * 1. Wrong graph direction (prerequisite -> course)
 * 2. Not checking if all courses processed
 * 3. Forgetting to reverse DFS result
 * 4. Not handling disconnected components
 * 5. Wrong cycle detection logic
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. How to find all valid orders? (Generate all topological sorts)
 * 2. What if multiple valid orders? (Any is fine)
 * 3. How to detect cycle? (Check result size or use states)
 * 4. Can you do it in parallel? (Difficult, dependencies)
 * 5. What about weighted edges? (Same algorithm)
 * 
 * RELATED PROBLEMS:
 * - Course Schedule (detect cycle only)
 * - Alien Dictionary
 * - Sequence Reconstruction
 * - Minimum Height Trees
 * - Parallel Courses
 * 
 * KEY INSIGHTS:
 * 1. This is topological sort problem
 * 2. Two main approaches: Kahn's (BFS) and DFS
 * 3. In-degree tracks prerequisites
 * 4. Cycle means impossible to complete
 * 5. Multiple valid orders possible
 * 
 * TOPOLOGICAL SORT:
 * - Linear ordering of vertices
 * - For edge u -> v, u comes before v
 * - Only possible in DAG (no cycles)
 * - Kahn's uses BFS with in-degree
 * - DFS uses post-order traversal
 * 
 * KAHN'S ALGORITHM:
 * 1. Calculate in-degree for all vertices
 * 2. Add vertices with in-degree 0 to queue
 * 3. Process queue:
 *    - Remove vertex
 *    - Add to result
 *    - Reduce in-degree of neighbors
 *    - Add neighbors with in-degree 0
 * 4. If all vertices processed, valid order
 * 5. Otherwise, cycle exists
 */

// Made with Bob
