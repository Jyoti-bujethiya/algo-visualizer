/*
 * LeetCode Problem #269: Alien Dictionary
 * Difficulty: Hard
 * Link: https://leetcode.com/problems/alien-dictionary/
 */
import java.util.*;

public class Solution {

    // APPROACH 1: Topological Sort via BFS (Kahn's Algorithm) | O(C) time | O(1) space
    // EXPLAIN: Extract ordering constraints from adjacent word pairs; run Kahn's BFS; cycle ↔ return "".
    public String alienOrder(String[] words) {
        Map<Character,Integer> indegree = new HashMap<>();
        Map<Character,List<Character>> adj = new HashMap<>();
        for (String w : words) for (char c : w.toCharArray()) { indegree.putIfAbsent(c,0); adj.putIfAbsent(c,new ArrayList<>()); }
        for (int i = 0; i+1 < words.length; i++) {
            String a=words[i], b=words[i+1];
            int mn=Math.min(a.length(),b.length());
            if (a.length()>b.length() && a.substring(0,mn).equals(b.substring(0,mn))) return "";
            for (int j=0;j<mn;j++) if (a.charAt(j)!=b.charAt(j)) {
                adj.get(a.charAt(j)).add(b.charAt(j));
                indegree.merge(b.charAt(j),1,Integer::sum);
                break;
            }
        }
        Queue<Character> q = new LinkedList<>();
        for (char c : indegree.keySet()) if (indegree.get(c)==0) q.offer(c);
        StringBuilder sb = new StringBuilder();
        while (!q.isEmpty()) { char c=q.poll(); sb.append(c); for (char nb:adj.get(c)) if (indegree.merge(nb,-1,Integer::sum)==0) q.offer(nb); }
        return sb.length()==indegree.size() ? sb.toString() : "";
    }

    // APPROACH 2: Topological Sort via DFS (Cycle Detection) | O(C) time | O(1) space
    // EXPLAIN: DFS post-order gives reverse topological order; detect cycles with 3-color marking.
    private Map<Character,List<Character>> adjDFS;
    private Map<Character,Integer> color;
    private StringBuilder orderDFS;
    private boolean cycle;

    public String alienOrderDFS(String[] words) {
        adjDFS = new HashMap<>(); color = new HashMap<>(); orderDFS = new StringBuilder(); cycle = false;
        for (String w : words) for (char c : w.toCharArray()) { adjDFS.putIfAbsent(c,new ArrayList<>()); color.put(c,0); }
        for (int i=0;i+1<words.length;i++) {
            String a=words[i],b=words[i+1]; int mn=Math.min(a.length(),b.length());
            if (a.length()>b.length()&&a.substring(0,mn).equals(b.substring(0,mn))) return "";
            for (int j=0;j<mn;j++) if (a.charAt(j)!=b.charAt(j)) { adjDFS.get(a.charAt(j)).add(b.charAt(j)); break; }
        }
        for (char c : color.keySet()) if (color.get(c)==0) dfsSolve(c);
        if (cycle) return "";
        return orderDFS.reverse().toString();
    }
    private void dfsSolve(char c) {
        if (cycle) return;
        color.put(c,1);
        for (char nb : adjDFS.get(c)) {
            if (color.get(nb)==1) { cycle=true; return; }
            if (color.get(nb)==0) dfsSolve(nb);
        }
        color.put(c,2); orderDFS.append(c);
    }

    // APPROACH 3: BFS with Deduplication | O(C) time | O(1) space
    // EXPLAIN: Same as Approach 1 but deduplicates edges with a seen-set to avoid inflated in-degrees.
    public String alienOrderClean(String[] words) {
        Map<Character,Integer> indegree = new HashMap<>();
        Map<Character,List<Character>> adj = new HashMap<>();
        Set<String> seenEdges = new HashSet<>();
        for (String w : words) for (char c : w.toCharArray()) { indegree.putIfAbsent(c,0); adj.putIfAbsent(c,new ArrayList<>()); }
        for (int i=0;i+1<words.length;i++) {
            String a=words[i],b=words[i+1]; int mn=Math.min(a.length(),b.length());
            if (a.length()>b.length()&&a.substring(0,mn).equals(b.substring(0,mn))) return "";
            for (int j=0;j<mn;j++) if (a.charAt(j)!=b.charAt(j)) {
                String edge=a.charAt(j)+""+b.charAt(j);
                if (!seenEdges.contains(edge)) { seenEdges.add(edge); adj.get(a.charAt(j)).add(b.charAt(j)); indegree.merge(b.charAt(j),1,Integer::sum); }
                break;
            }
        }
        Queue<Character> q = new LinkedList<>();
        for (char c : indegree.keySet()) if (indegree.get(c)==0) q.offer(c);
        StringBuilder sb = new StringBuilder();
        while (!q.isEmpty()) { char c=q.poll(); sb.append(c); for (char nb:adj.get(c)) if (indegree.merge(nb,-1,Integer::sum)==0) q.offer(nb); }
        return sb.length()==indegree.size() ? sb.toString() : "";
    }
}

// Made with Bob
