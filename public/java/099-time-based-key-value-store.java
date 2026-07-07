/*
 * LeetCode Problem #981: Time Based Key-Value Store
 * Link: https://leetcode.com/problems/time-based-key-value-store/
 * Difficulty: Medium
 */
import java.util.*;

class Solution {

    // APPROACH 1: HashMap + Binary Search | O(1) set | O(log n) get | O(n) space
    // EXPLAIN: Store (timestamp, value) pairs per key in insertion order; binary search for the largest ts ≤ query.
    static class TimeMap1 {
        Map<String, List<int[]>> store = new HashMap<>();      // key -> [(timestamp, valueIdx)]
        Map<String, List<String>> vals = new HashMap<>();

        public void set(String key, String value, int timestamp) {
            store.computeIfAbsent(key, k -> new ArrayList<>()).add(new int[]{timestamp});
            vals.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
        }

        public String get(String key, int timestamp) {
            if (!store.containsKey(key)) return "";
            List<int[]> ts = store.get(key);
            int lo = 0, hi = ts.size() - 1;
            String result = "";
            while (lo <= hi) {
                int mid = lo + (hi - lo) / 2;
                if (ts.get(mid)[0] <= timestamp) { result = vals.get(key).get(mid); lo = mid + 1; }
                else hi = mid - 1;
            }
            return result;
        }
    }

    // APPROACH 2: HashMap + TreeMap | O(log n) set | O(log n) get | O(n) space
    // EXPLAIN: Use a TreeMap per key so floorKey(timestamp) directly returns the largest valid timestamp.
    static class TimeMap2 {
        Map<String, TreeMap<Integer, String>> store = new HashMap<>();

        public void set(String key, String value, int timestamp) {
            store.computeIfAbsent(key, k -> new TreeMap<>()).put(timestamp, value);
        }

        public String get(String key, int timestamp) {
            if (!store.containsKey(key)) return "";
            Map.Entry<Integer, String> entry = store.get(key).floorEntry(timestamp);
            return entry == null ? "" : entry.getValue();
        }
    }

    // APPROACH 3: HashMap + Linear Search | O(1) set | O(n) get | O(n) space
    // EXPLAIN: Append to a list per key; scan from the end to find the latest valid timestamp.
    static class TimeMap3 {
        Map<String, List<int[]>> times = new HashMap<>();
        Map<String, List<String>> vals = new HashMap<>();

        public void set(String key, String value, int timestamp) {
            times.computeIfAbsent(key, k -> new ArrayList<>()).add(new int[]{timestamp});
            vals.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
        }

        public String get(String key, int timestamp) {
            if (!times.containsKey(key)) return "";
            List<int[]> ts = times.get(key);
            String result = "";
            for (int i = 0; i < ts.size(); i++) {
                if (ts.get(i)[0] <= timestamp) result = vals.get(key).get(i);
                else break;
            }
            return result;
        }
    }

    // APPROACH 4: HashMap + Parallel Lists (upper_bound via manual binary search) | O(1) set | O(log n) get | O(n) space
    // EXPLAIN: Maintain parallel timestamp and value lists per key; binary search for the insertion point, step back one.
    static class TimeMap4 {
        Map<String, List<Integer>> times = new HashMap<>();
        Map<String, List<String>> vals = new HashMap<>();

        public void set(String key, String value, int timestamp) {
            times.computeIfAbsent(key, k -> new ArrayList<>()).add(timestamp);
            vals.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
        }

        public String get(String key, int timestamp) {
            if (!times.containsKey(key)) return "";
            List<Integer> ts = times.get(key);
            // bisect_right: find first index where ts[i] > timestamp
            int lo = 0, hi = ts.size();
            while (lo < hi) {
                int mid = lo + (hi - lo) / 2;
                if (ts.get(mid) <= timestamp) lo = mid + 1;
                else hi = mid;
            }
            int idx = lo - 1;
            return idx < 0 ? "" : vals.get(key).get(idx);
        }
    }

    // APPROACH 5: HashMap + HashMap (Nested) with Timestamp Scan | O(1) set | O(n) get | O(n) space
    // EXPLAIN: Store key -> {timestamp -> value} and a separate list of timestamps; scan for best match.
    static class TimeMap5 {
        Map<String, Map<Integer, String>> store = new HashMap<>();
        Map<String, List<Integer>> timestamps = new HashMap<>();

        public void set(String key, String value, int timestamp) {
            store.computeIfAbsent(key, k -> new HashMap<>()).put(timestamp, value);
            timestamps.computeIfAbsent(key, k -> new ArrayList<>()).add(timestamp);
        }

        public String get(String key, int timestamp) {
            if (!store.containsKey(key)) return "";
            int bestTime = -1;
            for (int t : timestamps.get(key))
                if (t <= timestamp && t > bestTime) bestTime = t;
            return bestTime == -1 ? "" : store.get(key).get(bestTime);
        }
    }
}

// Made with Bob
