/*
 * Problem: Course Schedule (LeetCode 207)
 * Link: https://leetcode.com/problems/course-schedule/
 * Difficulty: Medium
 * Category: Trees and Graphs
 * 
 * Description:
 * There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1.
 * You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you
 * must take course bi first if you want to take course ai.
 * 
 * For example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.
 * Return true if you can finish all courses. Otherwise, return false.
 * 
 * Example 1:
 * Input: numCourses = 2, prerequisites = [[1,0]]
 * Output: true
 * Explanation: There are a total of 2 courses to take. 
 * To take course 1 you should have finished course 0. So it is possible.
 * 
 * Example 2:
 * Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
 * Output: false
 * Explanation: There are a total of 2 courses to take. 
 * To take course 1 you should have finished course 0, and to take course 0 you should also
 * have finished course 1. So it is impossible.
 * 
 * Constraints:
 * - 1 <= numCourses <= 2000
 * - 0 <= prerequisites.length <= 5000
 * - prerequisites[i].length == 2
 * - 0 <= ai, bi < numCourses
 * - All the pairs prerequisites[i] are unique
 */

#include <iostream>
#include <vector>
#include <queue>
#include <unordered_set>
using namespace std;

/*
 * APPROACH 1: DFS WITH CYCLE DETECTION (THREE STATES)
 * 
 * Intuition:
 * - This is a cycle detection problem in directed graph
 * - If there's a cycle, courses cannot be completed
 * - Use DFS with three states: unvisited, visiting, visited
 * - If we encounter a "visiting" node, there's a cycle
 * 
 * Algorithm:
 * 1. Build adjacency list from prerequisites
 * 2. Use three states: 0 (unvisited), 1 (visiting), 2 (visited)
 * 3. For each unvisited course, run DFS
 * 4. If DFS finds a cycle (visiting node), return false
 * 5. Mark nodes as visited after exploring all neighbors
 * 
 * Time Complexity: O(V + E) where V = courses, E = prerequisites
 * Space Complexity: O(V + E) for adjacency list and recursion stack
 */
class Solution1 {
private:
    bool hasCycle(int course, vector<vector<int>>& adj, vector<int>& state) {
        // If currently visiting this course, cycle detected
        if (state[course] == 1) return true;
        
        // If already visited, no cycle from this node
        if (state[course] == 2) return false;
        
        // Mark as visiting
        state[course] = 1;
        
        // Visit all neighbors
        for (int next : adj[course]) {
            if (hasCycle(next, adj, state)) {
                return true;
            }
        }
        
        // Mark as visited
        state[course] = 2;
        return false;
    }
    
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        // Build adjacency list
        vector<vector<int>> adj(numCourses);
        for (const auto& pre : prerequisites) {
            adj[pre[1]].push_back(pre[0]); // pre[1] -> pre[0]
        }
        
        // State: 0 = unvisited, 1 = visiting, 2 = visited
        vector<int> state(numCourses, 0);
        
        // Check each course
        for (int i = 0; i < numCourses; i++) {
            if (state[i] == 0) {
                if (hasCycle(i, adj, state)) {
                    return false;
                }
            }
        }
        
        return true;
    }
};

/*
 * APPROACH 2: BFS WITH KAHN'S ALGORITHM (TOPOLOGICAL SORT)
 * 
 * Intuition:
 * - Use Kahn's algorithm for topological sorting
 * - Track in-degree (number of prerequisites) for each course
 * - Start with courses that have no prerequisites (in-degree = 0)
 * - Process courses and reduce in-degree of dependent courses
 * - If we can process all courses, no cycle exists
 * 
 * Algorithm:
 * 1. Build adjacency list and calculate in-degrees
 * 2. Add all courses with in-degree 0 to queue
 * 3. Process queue: for each course, reduce in-degree of neighbors
 * 4. If neighbor's in-degree becomes 0, add to queue
 * 5. Count processed courses; if equals numCourses, return true
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V + E)
 */
class Solution2 {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        // Build adjacency list and in-degree array
        vector<vector<int>> adj(numCourses);
        vector<int> inDegree(numCourses, 0);
        
        for (const auto& pre : prerequisites) {
            adj[pre[1]].push_back(pre[0]);
            inDegree[pre[0]]++;
        }
        
        // Queue for courses with no prerequisites
        queue<int> q;
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) {
                q.push(i);
            }
        }
        
        // Process courses
        int processed = 0;
        while (!q.empty()) {
            int course = q.front();
            q.pop();
            processed++;
            
            // Reduce in-degree of dependent courses
            for (int next : adj[course]) {
                inDegree[next]--;
                if (inDegree[next] == 0) {
                    q.push(next);
                }
            }
        }
        
        return processed == numCourses;
    }
};

/*
 * APPROACH 3: DFS WITH VISITED SET
 * 
 * Intuition:
 * - Similar to Approach 1 but use sets instead of state array
 * - Track currently visiting nodes and fully visited nodes
 * - Simpler to understand but slightly more overhead
 * 
 * Algorithm:
 * 1. Build adjacency list
 * 2. Use two sets: visiting and visited
 * 3. For each unvisited course, run DFS
 * 4. If we encounter a course in visiting set, cycle exists
 * 5. Move courses from visiting to visited after exploring
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V + E)
 */
class Solution3 {
private:
    bool hasCycle(int course, vector<vector<int>>& adj,
                  unordered_set<int>& visiting, unordered_set<int>& visited) {
        if (visiting.count(course)) return true;
        if (visited.count(course)) return false;
        
        visiting.insert(course);
        
        for (int next : adj[course]) {
            if (hasCycle(next, adj, visiting, visited)) {
                return true;
            }
        }
        
        visiting.erase(course);
        visited.insert(course);
        return false;
    }
    
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        for (const auto& pre : prerequisites) {
            adj[pre[1]].push_back(pre[0]);
        }
        
        unordered_set<int> visiting, visited;
        
        for (int i = 0; i < numCourses; i++) {
            if (!visited.count(i)) {
                if (hasCycle(i, adj, visiting, visited)) {
                    return false;
                }
            }
        }
        
        return true;
    }
};

/*
 * APPROACH 4: DFS WITH PATH TRACKING
 * 
 * Intuition:
 * - Track the current path during DFS
 * - If we revisit a node in current path, cycle exists
 * - Use recursion stack to implicitly track path
 * 
 * Algorithm:
 * 1. Build adjacency list
 * 2. Use visited array and onPath array
 * 3. During DFS, mark nodes as onPath
 * 4. If we encounter a node already onPath, cycle exists
 * 5. Remove from onPath after exploring all neighbors
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V + E)
 */
class Solution4 {
private:
    bool dfs(int course, vector<vector<int>>& adj,
             vector<bool>& visited, vector<bool>& onPath) {
        if (onPath[course]) return true;  // Cycle detected
        if (visited[course]) return false; // Already processed
        
        visited[course] = true;
        onPath[course] = true;
        
        for (int next : adj[course]) {
            if (dfs(next, adj, visited, onPath)) {
                return true;
            }
        }
        
        onPath[course] = false;
        return false;
    }
    
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        for (const auto& pre : prerequisites) {
            adj[pre[1]].push_back(pre[0]);
        }
        
        vector<bool> visited(numCourses, false);
        vector<bool> onPath(numCourses, false);
        
        for (int i = 0; i < numCourses; i++) {
            if (!visited[i]) {
                if (dfs(i, adj, visited, onPath)) {
                    return false;
                }
            }
        }
        
        return true;
    }
};

/*
 * APPROACH 5: UNION-FIND (LESS EFFICIENT)
 * 
 * Intuition:
 * - Use Union-Find to detect cycles
 * - For each edge, check if nodes are already connected
 * - If connected and we try to add edge, cycle exists
 * - Note: This approach is less efficient for directed graphs
 * 
 * Algorithm:
 * 1. Initialize Union-Find structure
 * 2. For each prerequisite edge:
 *    - Check if nodes are in same set
 *    - If yes, cycle exists
 *    - Otherwise, union them
 * 3. Return true if no cycles found
 * 
 * Time Complexity: O(E * α(V)) where α is inverse Ackermann
 * Space Complexity: O(V)
 * Note: This approach doesn't work correctly for directed graphs with cycles
 */
class Solution5 {
private:
    class UnionFind {
    public:
        vector<int> parent;
        vector<int> rank;
        
        UnionFind(int n) {
            parent.resize(n);
            rank.resize(n, 0);
            for (int i = 0; i < n; i++) {
                parent[i] = i;
            }
        }
        
        int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }
        
        bool unite(int x, int y) {
            int rootX = find(x);
            int rootY = find(y);
            
            if (rootX == rootY) return false; // Already connected
            
            if (rank[rootX] < rank[rootY]) {
                parent[rootX] = rootY;
            } else if (rank[rootX] > rank[rootY]) {
                parent[rootY] = rootX;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }
            
            return true;
        }
    };
    
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        // Note: This approach uses BFS/DFS logic instead
        // Union-Find doesn't work well for directed cycle detection
        // Using Approach 2 (Kahn's algorithm) instead
        
        vector<vector<int>> adj(numCourses);
        vector<int> inDegree(numCourses, 0);
        
        for (const auto& pre : prerequisites) {
            adj[pre[1]].push_back(pre[0]);
            inDegree[pre[0]]++;
        }
        
        queue<int> q;
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) {
                q.push(i);
            }
        }
        
        int processed = 0;
        while (!q.empty()) {
            int course = q.front();
            q.pop();
            processed++;
            
            for (int next : adj[course]) {
                inDegree[next]--;
                if (inDegree[next] == 0) {
                    q.push(next);
                }
            }
        }
        
        return processed == numCourses;
    }
};

// Test function
void test(int numCourses, vector<vector<int>> prerequisites, int approach) {
    bool result;
    
    cout << "Input: numCourses = " << numCourses << ", prerequisites = [";
    for (int i = 0; i < prerequisites.size(); i++) {
        cout << "[" << prerequisites[i][0] << "," << prerequisites[i][1] << "]";
        if (i < prerequisites.size() - 1) cout << ",";
    }
    cout << "]\n";
    
    switch(approach) {
        case 1: {
            Solution1 sol;
            result = sol.canFinish(numCourses, prerequisites);
            cout << "Approach 1 (DFS Three States): ";
            break;
        }
        case 2: {
            Solution2 sol;
            result = sol.canFinish(numCourses, prerequisites);
            cout << "Approach 2 (BFS Kahn's Algorithm): ";
            break;
        }
        case 3: {
            Solution3 sol;
            result = sol.canFinish(numCourses, prerequisites);
            cout << "Approach 3 (DFS with Sets): ";
            break;
        }
        case 4: {
            Solution4 sol;
            result = sol.canFinish(numCourses, prerequisites);
            cout << "Approach 4 (DFS Path Tracking): ";
            break;
        }
        case 5: {
            Solution5 sol;
            result = sol.canFinish(numCourses, prerequisites);
            cout << "Approach 5 (Modified BFS): ";
            break;
        }
    }
    
    cout << (result ? "true" : "false") << "\n\n";
}

int main() {
    // Test Case 1: Can finish
    cout << "Test Case 1: Can finish\n";
    vector<vector<int>> test1 = {{1, 0}};
    for (int i = 1; i <= 5; i++) {
        test(2, test1, i);
    }
    
    // Test Case 2: Cannot finish (cycle)
    cout << "Test Case 2: Cannot finish\n";
    vector<vector<int>> test2 = {{1, 0}, {0, 1}};
    for (int i = 1; i <= 5; i++) {
        test(2, test2, i);
    }
    
    // Test Case 3: No prerequisites
    cout << "Test Case 3: No prerequisites\n";
    vector<vector<int>> test3 = {};
    for (int i = 1; i <= 5; i++) {
        test(3, test3, i);
    }
    
    // Test Case 4: Complex graph
    cout << "Test Case 4: Complex graph\n";
    vector<vector<int>> test4 = {{1, 0}, {2, 0}, {3, 1}, {3, 2}};
    for (int i = 1; i <= 5; i++) {
        test(4, test4, i);
    }
    
    // Test Case 5: Cycle in complex graph
    cout << "Test Case 5: Cycle in complex graph\n";
    vector<vector<int>> test5 = {{1, 0}, {2, 1}, {0, 2}};
    for (int i = 1; i <= 5; i++) {
        test(3, test5, i);
    }
    
    return 0;
}

/*
 * COMPLEXITY ANALYSIS SUMMARY:
 * 
 * Approach 1 (DFS Three States):
 * - Time: O(V + E) - visit each node and edge once
 * - Space: O(V + E) - adjacency list + recursion
 * - Best for: Clean cycle detection, most intuitive
 * 
 * Approach 2 (BFS Kahn's Algorithm):
 * - Time: O(V + E)
 * - Space: O(V + E) - adjacency list + queue
 * - Best for: Topological sort, iterative solution
 * 
 * Approach 3 (DFS with Sets):
 * - Time: O(V + E)
 * - Space: O(V + E) - sets have overhead
 * - Best for: Alternative DFS implementation
 * 
 * Approach 4 (DFS Path Tracking):
 * - Time: O(V + E)
 * - Space: O(V + E)
 * - Best for: Explicit path tracking
 * 
 * Approach 5 (Modified BFS):
 * - Time: O(V + E)
 * - Space: O(V + E)
 * - Best for: Same as Approach 2
 * 
 * INTERVIEW TIPS:
 * 1. Recognize this as cycle detection in directed graph
 * 2. Start with DFS (Approach 1) or BFS (Approach 2)
 * 3. Explain three states: unvisited, visiting, visited
 * 4. Kahn's algorithm is elegant for topological sort
 * 5. Both DFS and BFS are equally valid
 * 
 * COMMON MISTAKES:
 * 1. Not handling disconnected components
 * 2. Confusing directed and undirected graph cycle detection
 * 3. Not properly tracking visiting vs visited states
 * 4. Building adjacency list in wrong direction
 * 5. Forgetting to check all courses as starting points
 * 
 * FOLLOW-UP QUESTIONS:
 * 1. Return the course order? (Course Schedule II - LeetCode 210)
 * 2. What if multiple valid orders? (Return any valid order)
 * 3. Can you detect which courses form cycle? (Track path)
 * 4. What if prerequisites can be taken in parallel? (Same solution)
 * 5. How to handle very large graphs? (Same O(V+E) is optimal)
 * 
 * RELATED PROBLEMS:
 * - Course Schedule II (return order)
 * - Course Schedule III (with time constraints)
 * - Alien Dictionary (topological sort)
 * - Sequence Reconstruction
 * - Parallel Courses
 */

// Made with Bob
