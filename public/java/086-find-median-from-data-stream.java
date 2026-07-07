/*
 * LeetCode Problem #295: Find Median from Data Stream
 * Link: https://leetcode.com/problems/find-median-from-data-stream/
 * Difficulty: Hard
 */
import java.util.*;

class Solution {

    // APPROACH 1: Two Heaps | O(log n) addNum | O(1) findMedian | O(n) space
    // EXPLAIN: Max-heap for lower half, min-heap for upper half, balanced so size difference ≤ 1.
    static class MedianFinder1 {
        PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());
        PriorityQueue<Integer> hi = new PriorityQueue<>();

        public void addNum(int num) {
            lo.offer(num);
            hi.offer(lo.poll());
            if (hi.size() > lo.size()) lo.offer(hi.poll());
        }

        public double findMedian() {
            if (lo.size() > hi.size()) return lo.peek();
            return (lo.peek() + hi.peek()) / 2.0;
        }
    }

    // APPROACH 2: Sorted Array with Binary Search | O(n) addNum | O(1) findMedian | O(n) space
    // EXPLAIN: Maintain a sorted list via binary search insertion; median is middle element(s).
    static class MedianFinder2 {
        List<Integer> nums = new ArrayList<>();

        public void addNum(int num) {
            int lo = 0, hi = nums.size();
            while (lo < hi) {
                int mid = lo + (hi - lo) / 2;
                if (nums.get(mid) < num) lo = mid + 1;
                else hi = mid;
            }
            nums.add(lo, num);
        }

        public double findMedian() {
            int n = nums.size();
            if (n % 2 == 1) return nums.get(n / 2);
            return (nums.get(n / 2 - 1) + nums.get(n / 2)) / 2.0;
        }
    }

    // APPROACH 3: Two Heaps with Explicit Routing | O(log n) addNum | O(1) findMedian | O(n) space
    // EXPLAIN: Route each number directly to the correct heap, then rebalance; clearer logic than Approach 1.
    static class MedianFinder3 {
        PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());
        PriorityQueue<Integer> hi = new PriorityQueue<>();

        public void addNum(int num) {
            if (lo.isEmpty() || num <= lo.peek()) lo.offer(num);
            else hi.offer(num);
            if (lo.size() > hi.size() + 1) hi.offer(lo.poll());
            else if (hi.size() > lo.size()) lo.offer(hi.poll());
        }

        public double findMedian() {
            if (lo.size() > hi.size()) return lo.peek();
            return (lo.peek() + hi.peek()) / 2.0;
        }
    }

    // APPROACH 4: Insertion Sort (Linear Insert) | O(n) addNum | O(1) findMedian | O(n) space
    // EXPLAIN: Insert each number at the correct position using a linear scan; simple but slow.
    static class MedianFinder4 {
        List<Integer> nums = new ArrayList<>();

        public void addNum(int num) {
            int pos = 0;
            while (pos < nums.size() && nums.get(pos) < num) pos++;
            nums.add(pos, num);
        }

        public double findMedian() {
            int n = nums.size();
            if (n % 2 == 1) return nums.get(n / 2);
            return (nums.get(n / 2 - 1) + nums.get(n / 2)) / 2.0;
        }
    }

    // APPROACH 5: TreeMap (Balanced BST) | O(log n) addNum | O(log n) findMedian | O(n) space
    // EXPLAIN: Store value frequencies in a TreeMap; track the median position and walk the map to find it.
    static class MedianFinder5 {
        TreeMap<Integer, Integer> map = new TreeMap<>();
        int total = 0;

        public void addNum(int num) {
            map.merge(num, 1, Integer::sum);
            total++;
        }

        public double findMedian() {
            int mid1 = (total + 1) / 2, mid2 = (total + 2) / 2;
            int v1 = 0, v2 = 0, count = 0;
            for (Map.Entry<Integer, Integer> e : map.entrySet()) {
                count += e.getValue();
                if (v1 == 0 && count >= mid1) v1 = e.getKey();
                if (count >= mid2) { v2 = e.getKey(); break; }
            }
            return (v1 + v2) / 2.0;
        }
    }
}

// Made with Bob
