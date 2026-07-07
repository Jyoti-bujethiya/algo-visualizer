/**
 * Tutorial content for #099 — Time Based Key-Value Store
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Design a time-based key-value store. Implement set(key, value, timestamp) to store the value with the given timestamp, and get(key, timestamp) to return the value associated with the largest timestamp less than or equal to the given timestamp. If no such value exists, return an empty string. Timestamps for set() are strictly increasing for the same key.`,
    example: `set("foo","bar",1)\nset("foo","bar2",4)\nget("foo",4) → "bar2"  (exact match at timestamp 4)\nget("foo",3) → "bar"   (latest at or before 3 is timestamp 1)\nget("foo",0) → ""      (no value before timestamp 1)\n✅ Answer: "bar2", "bar", ""`,
    keyInsight: `Since timestamps for the same key are stored in strictly increasing order (guaranteed by problem), values for each key form a sorted list. Use binary search (find the rightmost timestamp ≤ query timestamp) to answer each get() in O(log n).`,
  },

  approaches: {
    'HashMap + Binary Search': {
      intuition: `Store each key mapped to a list of (timestamp, value) pairs, appended in order (already sorted since timestamps are strictly increasing). For get(), binary search the list for the largest timestamp ≤ the query timestamp (upper bound - 1).`,
      steps: [
        `Map<String, List<int[]>> map where each list holds [timestamp, value] pairs.`,
        `set(key, value, ts): map.get(key).add([ts, value]).`,
        `get(key, ts):`,
        `  If key not in map: return "".`,
        `  list = map.get(key).`,
        `  Binary search for the largest ts ≤ query ts:`,
        `    lo=0, hi=list.size()-1.`,
        `    While lo <= hi: mid=(lo+hi)/2.`,
        `      If list[mid].ts <= queryTs: lo=mid+1.`,
        `      Else: hi=mid-1.`,
        `  If hi < 0: return "". Else return list[hi].value.`,
      ],
      example: `set("foo","bar",1): map["foo"]=[(1,"bar")]\nset("foo","bar2",4): map["foo"]=[(1,"bar"),(4,"bar2")]\n\nget("foo",4): binary search in [(1,_),(4,_)] for ts≤4.\n  lo=0,hi=1 → mid=0(ts=1)≤4 → lo=1\n  lo=1,hi=1 → mid=1(ts=4)≤4 → lo=2\n  lo>hi. return list[hi=1].value = "bar2" ✅\n\nget("foo",3): binary search for ts≤3.\n  mid=0(ts=1)≤3 → lo=1\n  mid=1(ts=4)>3 → hi=0\n  return list[hi=0].value = "bar" ✅\n\nget("foo",0): mid=0(ts=1)>0 → hi=-1. return "" ✅`,
      keyInsight: `set() is O(1). get() is O(log n) per query. O(n) total space. This is the optimal and standard interview solution for this problem.`,
    },

    'HashMap + TreeMap': {
      intuition: `Use a nested structure: Map<String, TreeMap<Integer, String>> where the inner TreeMap maps timestamp → value (automatically sorted). For get(), use TreeMap's floorKey(timestamp) which returns the largest key ≤ timestamp in O(log n).`,
      steps: [
        `Map<String, TreeMap<Integer,String>> store.`,
        `set(key, value, ts): store.get(key).put(ts, value).`,
        `get(key, ts): if key absent return "". TreeMap tm = store.get(key). Integer floor = tm.floorKey(ts). Return floor==null ? "" : tm.get(floor).`,
      ],
      example: `set("foo","bar",1): store["foo"]={1:"bar"}\nset("foo","bar2",4): store["foo"]={1:"bar",4:"bar2"}\n\nget("foo",4): floorKey(4)=4 → "bar2" ✅\nget("foo",3): floorKey(3)=1 → "bar" ✅\nget("foo",0): floorKey(0)=null → "" ✅`,
      keyInsight: `set() is O(log n), get() is O(log n). O(n) space. Extremely clean code thanks to TreeMap.floorKey(). The go-to solution in Java. Python equivalent: SortedList from sortedcontainers with bisect.`,
    },

    'HashMap + Linear Search': {
      intuition: `Store all (timestamp, value) pairs in an unsorted list per key. For get(), scan ALL stored values for that key and find the one with the largest timestamp ≤ the query.`,
      steps: [
        `Map<String, List<int[]>> map.`,
        `set(key, value, ts): append (ts, value) to list.`,
        `get(key, ts): scan all pairs, track best where pair.ts <= queryTs. Return best value or "".`,
      ],
      example: `set("foo","bar",1): [(1,"bar")]\nset("foo","bar2",4): [(1,"bar"),(4,"bar2")]\n\nget("foo",3): scan: ts=1≤3 best="bar"; ts=4>3 skip. return "bar" ✅`,
      keyInsight: `set() is O(1). get() is O(n) per query. Correct but too slow for large inputs. Useful as a reference baseline to verify binary search implementations.`,
    },

    'HashMap + Parallel Lists (upper_bound via manual binary search)': {
      intuition: `For each key, maintain two parallel arrays: one for timestamps (sorted) and one for values. This mirrors how you might implement a TreeMap manually, using array-based binary search for get().`,
      steps: [
        `Map<String, List<Integer>> timestamps. Map<String, List<String>> values.`,
        `set(key, value, ts): append ts to timestamps[key]; append value to values[key].`,
        `get(key, ts): binary search timestamps[key] for largest ts ≤ queryTs. Return corresponding values[key][idx].`,
      ],
      example: `set("foo","bar",1): timestamps["foo"]=[1], values["foo"]=["bar"]\nset("foo","bar2",4): timestamps=[(1,4)], values=[("bar","bar2")]\n\nget("foo",3): binarySearch([1,4], target=3) → largest ≤3 is index 0 (ts=1). values[0]="bar" ✅`,
      keyInsight: `O(log n) for get(), O(1) for set(). Same complexity as HashMap + Binary Search with a different data layout. Parallel arrays are slightly more cache-friendly than pairs but use two lists instead of one.`,
    },

    'HashMap + HashMap (Nested) with Timestamp Scan': {
      intuition: `Use a nested HashMap: outer key → inner map of (timestamp → value). For get(), collect all timestamps ≤ the query, take the maximum, look up its value. This is correct but O(n) per get() — shown for completeness.`,
      steps: [
        `Map<String, Map<Integer,String>> store.`,
        `set(key, value, ts): store.get(key).put(ts, value).`,
        `get(key, ts): filter all timestamps in store[key] where t <= queryTs. Return value for max timestamp, or "" if none.`,
      ],
      example: `get("foo",3): timestamps {1,4}. Filter ≤3: {1}. Max=1. return "bar" ✅`,
      keyInsight: `O(n) per get() (scans all timestamps). O(n) space. Simpler to reason about than binary search, but too slow for large inputs. Illustrates the value of sorted storage + binary search.`,
    },
  },
}
