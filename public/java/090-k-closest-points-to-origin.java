/*
 * LeetCode Problem #973: K Closest Points to Origin
 * Link: https://leetcode.com/problems/k-closest-points-to-origin/
 * Difficulty: Medium
 */
import java.util.*;

class Solution {

    private int dist2(int[] p) { return p[0] * p[0] + p[1] * p[1]; }

    // APPROACH 1: Sort by Distance² | O(n log n) time | O(1) space
    // EXPLAIN: Sort all points by squared Euclidean distance and return the first k.
    public int[][] kClosest1(int[][] points, int k) {
        Arrays.sort(points, Comparator.comparingInt(this::dist2));
        return Arrays.copyOfRange(points, 0, k);
    }

    // APPROACH 2: Max Heap of Size K | O(n log k) time | O(k) space
    // EXPLAIN: Maintain a max-heap of size k; evict the farthest point when size exceeds k.
    public int[][] kClosest2(int[][] points, int k) {
        PriorityQueue<int[]> maxHeap = new PriorityQueue<>((a, b) -> dist2(b) - dist2(a));
        for (int[] p : points) {
            maxHeap.offer(p);
            if (maxHeap.size() > k) maxHeap.poll();
        }
        return maxHeap.toArray(new int[0][]);
    }

    // APPROACH 3: Quickselect | O(n) average time | O(log n) space
    // EXPLAIN: Partition in place until the first k elements are the k closest (unsorted).
    public int[][] kClosest3(int[][] points, int k) {
        quickselect(points, 0, points.length - 1, k);
        return Arrays.copyOfRange(points, 0, k);
    }

    private void quickselect(int[][] pts, int lo, int hi, int k) {
        if (lo >= hi) return;
        int p = partitionDist(pts, lo, hi);
        if (p == k) return;
        else if (p < k) quickselect(pts, p + 1, hi, k);
        else quickselect(pts, lo, p - 1, k);
    }

    private int partitionDist(int[][] pts, int lo, int hi) {
        int pivot = dist2(pts[hi]), i = lo;
        for (int j = lo; j < hi; j++) {
            if (dist2(pts[j]) <= pivot) {
                int[] tmp = pts[i]; pts[i] = pts[j]; pts[j] = tmp; i++;
            }
        }
        int[] tmp = pts[i]; pts[i] = pts[hi]; pts[hi] = tmp;
        return i;
    }

    // APPROACH 4: Partial Sort | O(n log k) time | O(k) space
    // EXPLAIN: Use a PriorityQueue as a min-heap to collect the k smallest by distance.
    public int[][] kClosest4(int[][] points, int k) {
        PriorityQueue<int[]> minHeap = new PriorityQueue<>(Comparator.comparingInt(this::dist2));
        for (int[] p : points) minHeap.offer(p);
        int[][] result = new int[k][];
        for (int i = 0; i < k; i++) result[i] = minHeap.poll();
        return result;
    }

    // APPROACH 5: Manual Quickselect | O(n) average time | O(log n) space
    // EXPLAIN: Explicit in-place quickselect with last-element pivot; same as Approach 3 but separated.
    public int[][] kClosest5(int[][] points, int k) {
        manualQS(points, 0, points.length - 1, k);
        return Arrays.copyOfRange(points, 0, k);
    }

    private void manualQS(int[][] pts, int lo, int hi, int k) {
        if (lo >= hi) return;
        int pivot = dist2(pts[hi]), i = lo;
        for (int j = lo; j < hi; j++) {
            if (dist2(pts[j]) <= pivot) {
                int[] tmp = pts[i]; pts[i] = pts[j]; pts[j] = tmp; i++;
            }
        }
        int[] tmp = pts[i]; pts[i] = pts[hi]; pts[hi] = tmp;
        if (i == k) return;
        else if (i < k) manualQS(pts, i + 1, hi, k);
        else manualQS(pts, lo, i - 1, k);
    }
}

// Made with Bob
