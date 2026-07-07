/**
 * Tutorial content for #029 — Copy List with Random Pointer
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `You have a linked list where each node has two pointers: next (to the next node) and random (which can point to any node in the list, or null). Create a completely independent deep copy of this list — every node must be a brand-new object with the same value, next, and random connections.`,
    example: `Input nodes (val, random index): [[7,null],[13,0],[11,4],[10,2],[1,0]]\n→ Node 0 (val=7):  random → null\n→ Node 1 (val=13): random → node 0\n→ Node 2 (val=11): random → node 4\n→ Node 3 (val=10): random → node 2\n→ Node 4 (val=1):  random → node 0\n✅ Answer: a new list with identical structure but all new node objects`,
    keyInsight: `The hard part is the random pointer: when you create a copy of node A, the copy's random pointer should point to the COPY of whatever A.random points to — not the original. You need a way to look up "given this original node, what is its copy?"`,
  },

  approaches: {
    'Hash Map': {
      intuition: `Build a dictionary (hash map) that maps every original node to its newly created copy. In the first pass, create all the copy nodes (values only). In the second pass, wire up both next and random pointers using the map to translate original references into copy references.`,
      steps: [
        `Create an empty hash map: originalNode → copyNode.`,
        `First pass — traverse the original list: for each node, create a new copy node (same val) and store it in the map.`,
        `Second pass — traverse again: for each original node, set copyNode.next = map[original.next] and copyNode.random = map[original.random] (handle null carefully).`,
        `Return map[head] — the copy of the head node.`,
      ],
      example: `Original: 7 → 13 → 11 → 10 → 1\n\nPass 1 — create copies:\nmap = { node7→copy7, node13→copy13, node11→copy11, node10→copy10, node1→copy1 }\n\nPass 2 — wire pointers:\ncopy7.next=copy13,  copy7.random=null\ncopy13.next=copy11, copy13.random=copy7\ncopy11.next=copy10, copy11.random=copy1\ncopy10.next=copy1,  copy10.random=copy11\ncopy1.next=null,    copy1.random=copy7\n✅ Answer: new list 7→13→11→10→1 with correct random pointers`,
      keyInsight: `O(n) time, O(n) space. The hash map is the key: it provides O(1) lookup to find the copy of any original node, making the pointer wiring trivial.`,
    },

    'Interweaving Nodes': {
      intuition: `Avoid the extra hash map by weaving copy nodes directly into the original list. Insert each copy immediately after its original: A → A' → B → B' → C → C'. Now A'.random is just A.random.next (the copy sits right next to the original). Finally, separate the two lists to restore the original and extract the copy.`,
      steps: [
        `Pass 1 — interweave: for each original node A, create copy A' and insert it between A and A.next.`,
        `Pass 2 — set random pointers: for each original A, copy A'.random = A.random.next (the copy of A.random is right after it in the woven list).`,
        `Pass 3 — separate: restore original list and extract copy list by relinking next pointers alternately.`,
        `Return the head of the extracted copy list.`,
      ],
      example: `Original: 7 → 13 → 11 → 10 → 1\n\nPass 1 — interweave:\n7 → 7' → 13 → 13' → 11 → 11' → 10 → 10' → 1 → 1'\n\nPass 2 — random pointers (e.g. node 13.random = node 7):\n13'.random = 13.random.next = 7.next = 7'\n\nPass 3 — separate:\nOriginal: 7 → 13 → 11 → 10 → 1\nCopy:    7'→ 13'→ 11'→ 10'→ 1'\n✅ Answer: new list with correct structure, O(1) extra space`,
      keyInsight: `O(n) time, O(1) extra space (not counting the output list). Cleverly uses the "next of original = copy" relationship to avoid any hash map, but requires three careful passes and is trickier to code correctly.`,
    },

    'Recursive with Memo': {
      intuition: `Recursively clone each node on demand, memoising every result. When you clone node A, immediately store the copy in the memo map before recursing — this breaks any cycles created by the random pointer pointing back to an earlier node. If the recursive call for A.next or A.random finds A already in the memo map, it returns the cached copy instead of creating a duplicate.`,
      steps: [
        `Create a memo map: originalNode → copyNode. Initialize it as an instance-level field.`,
        `Define clone(node): if node == null, return null.`,
        `If node is already in memo, return memo.get(node) immediately.`,
        `Create copy = new Node(node.val) and store memo.put(node, copy) BEFORE recursing.`,
        `Set copy.next = clone(node.next) and copy.random = clone(node.random).`,
        `Return copy.`,
      ],
      example: `Nodes: 7 → 13 → 11 → 10 → 1  (node 11's random = node 1)\n\nclone(7): create copy7, memo={7:c7}. Recurse next→clone(13).\n  clone(13): create copy13, memo={7:c7,13:c13}. Recurse next→clone(11).\n    clone(11): create copy11, memo+. Recurse random→clone(1).\n      clone(1): create copy1, memo+. copy1.next=null, copy1.random=clone(7).\n        clone(7): already in memo → return copy7. ✓\n    copy11.random = copy1.\n  copy13.random = clone(7) → copy7 (from memo). ✓\ncopy7.random = null.\n✅ New list with correct structure, all new nodes.`,
      keyInsight: `O(n) time, O(n) space (memo map). The key detail: store the copy in the memo BEFORE recursing on its children — this prevents infinite recursion when random pointers create back-references.`,
    },

    'Hash Map with Null Sentinel': {
      intuition: `A small optimisation of the standard Hash Map approach: pre-insert the mapping null → null into the map before the first pass. This means all pointer assignments (copy.next = map.get(orig.next) and copy.random = map.get(orig.random)) work uniformly even when next or random is null — no null-checks are required in the second pass.`,
      steps: [
        `Create map and immediately insert map.put(null, null).`,
        `First pass — traverse the original list: for each node, create copy and put (node → copy) in map.`,
        `Second pass — traverse again: for each node, set copy.next = map.get(node.next) and copy.random = map.get(node.random). Both handle null automatically via the sentinel.`,
        `Return map.get(head).`,
      ],
      example: `Original: 7 → 13 → 11 → 10 → 1  (node 1 has random=null)\n\nmap = {null:null}\nPass 1: map = {null:null, 7:c7, 13:c13, 11:c11, 10:c10, 1:c1}\n\nPass 2 for node 1:\n  c1.next   = map.get(null) = null  ✓ (no null-check needed)\n  c1.random = map.get(null) = null  ✓\n✅ Clean uniform pointer assignments throughout.`,
      keyInsight: `O(n) time, O(n) space. Exactly the same complexity as the plain Hash Map approach. The null sentinel is a micro-pattern that eliminates conditional checks — worth knowing for cleaner code in any language that uses hash-based lookups.`,
    },

    'Index-Based': {
      intuition: `Assign a numeric index to every original node (0, 1, 2, …) and store them in an array. Build a parallel array of copy nodes. To set a copy's random pointer, look up the original node's random target in the index map, then point to the copy at that same index. This replaces object identity hashing with integer indexing.`,
      steps: [
        `First pass: traverse the list, building a nodes[] array and an index map (node → integer).`,
        `Allocate a copies[] array of the same length, creating a new Node for each position.`,
        `Second pass: for index i, set copies[i].next = copies[i+1] (unless last node). Set copies[i].random = copies[index.get(nodes[i].random)] if random is non-null.`,
        `Return copies[0].`,
      ],
      example: `Original: 7(i=0) → 13(i=1) → 11(i=2) → 10(i=3) → 1(i=4)\nnode 11 (i=2): random = node 1 (i=4)\n\ncopies = [c7, c13, c11, c10, c1]\n\ni=2 (node 11): copies[2].next = copies[3], copies[2].random = copies[4]  (idx[node1]=4)\ni=4 (node 1):  copies[4].next = null,      copies[4].random = copies[0]  (idx[node7]=0)\n✅ Correct deep copy using pure integer indexing.`,
      keyInsight: `O(n) time, O(n) space. Conceptually straightforward — integer indices are easier to reason about than object identity. The tradeoff is two arrays plus an index map; the Hash Map approach needs only one map.`,
    },
  },
}
