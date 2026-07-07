/**
 * Tutorial content for #030 — LRU Cache
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Design a data structure that follows the Least Recently Used (LRU) cache eviction policy. Support two O(1) operations: get(key) — return the value if the key exists, otherwise -1; and put(key, value) — insert or update the key. When the cache reaches its capacity and a new key must be inserted, evict the least recently used item first.`,
    example: `capacity = 2\nput(1, 1) → cache: {1=1}\nput(2, 2) → cache: {1=1, 2=2}\nget(1)    → returns 1, cache order: {2=2, 1=1} (1 is most recent)\nput(3, 3) → evicts key 2 (least recent), cache: {1=1, 3=3}\nget(2)    → returns -1 (was evicted)\n✅ Answer: -1`,
    keyInsight: `O(1) get and put require fast lookup (hash map) AND fast reordering (doubly-linked list). Together, the map gives instant node access and the list lets you move any node to the "most recent" position in O(1) by adjusting just its neighbours' pointers.`,
  },

  approaches: {
    LinkedHashMap: {
      intuition: `Many languages provide an ordered map that maintains insertion/access order — Java's LinkedHashMap, Python's OrderedDict, or JavaScript's Map (which preserves insertion order). You can use this built-in structure to implement LRU: on every access, move the key to the end ("most recent"). On eviction, remove the key at the front ("least recent").`,
      steps: [
        `Store capacity and create an ordered map (LinkedHashMap / OrderedDict / Map).`,
        `get(key): if the key is missing return -1. Otherwise, delete it and re-insert it (moving it to the "most recent" end), then return the value.`,
        `put(key, value): if key already exists, delete it so it can be re-inserted at the end.`,
        `If the map is now at capacity, delete the first (oldest) entry.`,
        `Insert (key, value) at the end of the map.`,
      ],
      example: `capacity = 2\n\nput(1,1): map = {1:1}\nput(2,2): map = {1:1, 2:2}\nget(1):   delete 1, re-insert → map = {2:2, 1:1}, return 1\nput(3,3): at capacity, evict first key (2) → map = {1:1}, insert 3 → map = {1:1, 3:3}\nget(2):   key not found → return -1\n✅ Answer: -1`,
      keyInsight: `O(1) average for all operations. Extremely concise — the ordered map does all the work. In Python this is a 10-line solution with OrderedDict.`,
    },

    'Doubly-Linked List + HashMap': {
      intuition: `Build the data structure from scratch. A hash map gives O(1) lookup: key → node. A doubly-linked list maintains the usage order: the head (or a sentinel head) holds the least-recently-used item, the tail holds the most-recently-used. Moving a node to the tail on every access or insert, and removing from the head on eviction, are both O(1) pointer operations because each node knows its prev and next.`,
      steps: [
        `Create a doubly-linked list with sentinel head and tail nodes (dummy nodes simplify edge cases).`,
        `Create a hash map: key → list node.`,
        `get(key): if key not in map return -1. Otherwise move that node to just before the tail (mark it "most recent"), then return its value.`,
        `put(key, value): if key exists, update its value and move it to the tail. If key is new, create a new node and insert it just before the tail; add it to the map.`,
        `If size now exceeds capacity, remove the node just after the sentinel head (the LRU node) and delete its key from the map.`,
        `Helper functions addToTail(node) and removeNode(node) manipulate the four surrounding pointers each.`,
      ],
      example: `capacity = 2\nSentinels: HEAD ↔ TAIL\n\nput(1,1): HEAD ↔ [1:1] ↔ TAIL, map={1:node1}\nput(2,2): HEAD ↔ [1:1] ↔ [2:2] ↔ TAIL, map={1,2}\nget(1):   move node1 to tail → HEAD ↔ [2:2] ↔ [1:1] ↔ TAIL, return 1\nput(3,3): size=3 > cap=2, evict LRU=node after HEAD=node2\n          HEAD ↔ [1:1] ↔ TAIL, map={1}\n          insert node3 → HEAD ↔ [1:1] ↔ [3:3] ↔ TAIL, map={1,3}\nget(2):   not in map → -1\n✅ Answer: -1`,
      keyInsight: `O(1) time for both get and put. O(capacity) space. This is the canonical interview solution — understanding how to maintain a doubly-linked list alongside a hash map is a fundamental systems design pattern.`,
    },

    'Timestamp (Not O(1))': {
      intuition: `The simplest possible LRU eviction strategy: store the last-access timestamp alongside every cache entry. On each get or put, record the current timestamp for that key. When capacity is exceeded and eviction is needed, scan all entries to find the one with the smallest timestamp — that is the least recently used. Straightforward to understand and implement, but the O(n) eviction scan violates the O(1) requirement.`,
      steps: [
        `Maintain two maps: values (key → value) and times (key → last-access timestamp). Keep a global counter ts.`,
        `get(key): if key not in values return -1. Otherwise update times[key] = ts++, return values[key].`,
        `put(key, value): if key exists, update value and times[key] = ts++.`,
        `If key is new and at capacity: find lruKey = key with minimum value in times map (O(n) scan). Remove it from both maps.`,
        `Insert values[key] = value, times[key] = ts++.`,
      ],
      example: `capacity=2, ts starts at 0\n\nput(1,1): values={1:1}, times={1:0}, ts=1\nput(2,2): values={1:1,2:2}, times={1:0,2:1}, ts=2\nget(1):   times={1:2,2:1}, return 1, ts=3\nput(3,3): at capacity. Scan times: min is key 2 (ts=1). Evict 2.\n          values={1:1,3:3}, times={1:2,3:3}, ts=4\nget(2):   key 2 not in values → return -1\n✅ Answer: -1 (correct result, but eviction was O(n))`,
      keyInsight: `O(1) get/put amortised for non-eviction operations, but O(n) when eviction is triggered. Does NOT satisfy the O(1) requirement. Presented as a baseline showing why a proper ordered structure (linked list or LinkedHashMap) is necessary.`,
    },
  },
}
