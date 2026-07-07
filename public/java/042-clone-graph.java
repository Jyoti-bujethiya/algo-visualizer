/*
 * LeetCode Problem #133: Clone Graph
 * Difficulty: Medium
 * Link: https://leetcode.com/problems/clone-graph/
 */
import java.util.*;

public class Solution {

    static class Node {
        int val;
        List<Node> neighbors;
        Node(int v) { val = v; neighbors = new ArrayList<>(); }
    }

    // APPROACH 1: DFS with Hash Map | O(N+E) time | O(N) space
    // EXPLAIN: Recursively clone each node, storing original→clone in a map to handle cycles.
    private Map<Node, Node> visited = new HashMap<>();

    public Node cloneGraph(Node node) {
        if (node == null) return null;
        if (visited.containsKey(node)) return visited.get(node);
        Node clone = new Node(node.val);
        visited.put(node, clone);
        for (Node nb : node.neighbors) clone.neighbors.add(cloneGraph(nb));
        return clone;
    }

    // APPROACH 2: BFS with Hash Map | O(N+E) time | O(N) space
    // EXPLAIN: BFS traversal; clone each node on first encounter, then wire neighbor edges.
    public Node cloneGraphBFS(Node node) {
        if (node == null) return null;
        Map<Node, Node> map = new HashMap<>();
        Queue<Node> q = new LinkedList<>();
        map.put(node, new Node(node.val));
        q.offer(node);
        while (!q.isEmpty()) {
            Node curr = q.poll();
            for (Node nb : curr.neighbors) {
                if (!map.containsKey(nb)) { map.put(nb, new Node(nb.val)); q.offer(nb); }
                map.get(curr).neighbors.add(map.get(nb));
            }
        }
        return map.get(node);
    }

    // APPROACH 3: DFS Iterative (Stack) | O(N+E) time | O(N) space
    // EXPLAIN: Explicit stack DFS; clone nodes on first visit, then add cloned neighbors.
    public Node cloneGraphStack(Node node) {
        if (node == null) return null;
        Map<Node, Node> map = new HashMap<>();
        Deque<Node> stack = new ArrayDeque<>();
        map.put(node, new Node(node.val));
        stack.push(node);
        while (!stack.isEmpty()) {
            Node curr = stack.pop();
            for (Node nb : curr.neighbors) {
                if (!map.containsKey(nb)) { map.put(nb, new Node(nb.val)); stack.push(nb); }
                map.get(curr).neighbors.add(map.get(nb));
            }
        }
        return map.get(node);
    }

    // APPROACH 4: Two-Pass BFS | O(N+E) time | O(N) space
    // EXPLAIN: First BFS creates all clones; second pass wires the neighbor edges.
    public Node cloneGraphTwoPass(Node node) {
        if (node == null) return null;
        Map<Node, Node> map = new HashMap<>();
        Queue<Node> q = new LinkedList<>();
        map.put(node, new Node(node.val));
        q.offer(node);
        while (!q.isEmpty()) {
            Node curr = q.poll();
            for (Node nb : curr.neighbors)
                if (!map.containsKey(nb)) { map.put(nb, new Node(nb.val)); q.offer(nb); }
        }
        for (Map.Entry<Node, Node> e : map.entrySet())
            for (Node nb : e.getKey().neighbors) e.getValue().neighbors.add(map.get(nb));
        return map.get(node);
    }

    // APPROACH 5: Recursive with Visited Set | O(N+E) time | O(N) space
    // EXPLAIN: Separate visited set and clone map; check visited before recursing into neighbors.
    private Map<Node, Node> clones = new HashMap<>();
    private Set<Node> seen = new HashSet<>();

    public Node cloneGraphVisitedSet(Node node) {
        if (node == null) return null;
        if (clones.containsKey(node)) return clones.get(node);
        Node clone = new Node(node.val);
        clones.put(node, clone);
        seen.add(node);
        for (Node nb : node.neighbors)
            clone.neighbors.add(seen.contains(nb) ? clones.get(nb) : cloneGraphVisitedSet(nb));
        return clone;
    }
}

// Made with Bob
