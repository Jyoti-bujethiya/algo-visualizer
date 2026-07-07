/**
 * Tutorial content for #037 — Serialize and Deserialize Binary Tree
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Design an algorithm to serialize a binary tree into a string, and deserialize that string back into the same tree. Serialization means converting the tree to a string (for storage/transmission). Deserialization means reconstructing the tree from that string. Both operations must be inverses of each other — a round-trip must produce the original tree.`,
    example: `Tree: root=1, left=2, right=3, 3.left=4, 3.right=5\nSerialize: "1,2,null,null,3,4,null,null,5,null,null"\nDeserialize: read values left-to-right, reconstruct the same tree.\n✅ Answer: original tree structure preserved`,
    keyInsight: `Pre-order traversal (root → left → right) naturally encodes the tree because when deserializing, you always know the root value first. Null markers are essential — without them you cannot tell where subtrees end.`,
  },

  approaches: {
    'Pre-order DFS': {
      intuition: `Serialize using pre-order DFS: visit the root, recurse left, recurse right. Represent null nodes as a special marker (e.g., "null"). Join all values with a comma separator. To deserialize, split on commas to get a list of tokens, then consume them left-to-right using the same pre-order logic — each consumed token either creates a node (recurse left then right) or terminates (if "null").`,
      steps: [
        `Serialize: define dfs(node) that appends node.val (or "null" for null nodes) to a list, then recurses left then right.`,
        `Join the list with commas to form the string.`,
        `Deserialize: split the string by commas to get a token queue.`,
        `Define helper(queue): dequeue the next token. If it's "null", return null.`,
        `Otherwise create a new node with that value.`,
        `Set node.left = helper(queue), then node.right = helper(queue).`,
        `Return the node.`,
      ],
      example: `Tree: 1 → left:2, right:3 → 3.left:4, 3.right:5\n\nSerialize (pre-order):\nVisit 1 → visit 2 → null,null → visit 3 → visit 4 → null,null → visit 5 → null,null\nString: "1,2,null,null,3,4,null,null,5,null,null"\n\nDeserialize:\nTokens: [1,2,null,null,3,4,null,null,5,null,null]\nRead 1 → node(1), left=Read(2→node(2),left=null,right=null), right=Read(3→node(3),left=4,right=5)\n✅ Answer: same tree reconstructed`,
      keyInsight: `O(n) time and O(n) space for both operations. Pre-order with null markers is the standard approach — it uniquely encodes any binary tree and deserializes in a single left-to-right pass.`,
    },

    'Level-order BFS': {
      intuition: `Serialize using BFS level by level (like the array representation). Enqueue the root, then process the queue: record each node's value (or "null"), and enqueue its left and right children (even if null, so the level structure is preserved). To deserialize, rebuild level by level: the first token is the root, subsequent pairs are children of nodes from the previous level.`,
      steps: [
        `Serialize: enqueue root. While queue is non-empty, dequeue a node. If null, append "null". Otherwise append node.val and enqueue node.left and node.right.`,
        `Join tokens with commas.`,
        `Deserialize: split into tokens. The first token is the root. Use a queue of parent nodes.`,
        `For each parent, the next two tokens are its left and right child values.`,
        `Create nodes for non-null tokens and enqueue them as the next parents.`,
        `Return the root.`,
      ],
      example: `Tree: 1 → left:2, right:3 → 3.left:4, 3.right:5\n\nSerialize (BFS): queue=[1]\nProcess 1: tokens=[1], enqueue 2,3\nProcess 2: tokens=[1,2], enqueue null,null\nProcess 3: tokens=[1,2,3], enqueue 4,5\nProcess null,null: tokens=[1,2,3,null,null]\nProcess 4,5: tokens=[1,2,3,null,null,4,5], enqueue their nulls\nString: "1,2,3,null,null,4,5,null,null,null,null"\n\nDeserialize: root=1, children of 1 are (2,3), children of 2 are (null,null), children of 3 are (4,5).\n✅ Answer: same tree reconstructed`,
      keyInsight: `O(n) time and O(n) space. BFS serialization produces the familiar "array" representation of a binary tree. Slightly more complex to deserialize than pre-order, but maps directly to the LeetCode tree input format.`,
    },

    'Pre-order with Space Separator': {
      intuition: `A variation of Pre-order DFS that swaps the comma delimiter for a space and uses "#" instead of "null" for empty nodes. The logic is identical — pre-order traversal with null markers — but it illustrates that the choice of separator and null-token are arbitrary implementation details, not algorithmic requirements.`,
      steps: [
        `Serialize: define spaceHelper(node, sb). If null, append "# ". Otherwise append node.val + " ", recurse left then right.`,
        `Trim trailing space from the result string.`,
        `Deserialize: split on whitespace to get a token queue.`,
        `spaceDeHelper(queue): poll next token. If "#" or null, return null.`,
        `Create node with parsed int value. Set left = spaceDeHelper(queue), right = spaceDeHelper(queue). Return node.`,
      ],
      example: `Tree: 1 → left:2, right:3\n\nSerialize (space-separated):\n"1 2 # # 3 # #"\n\nDeserialize:\nTokens: [1,2,#,#,3,#,#]\nRead 1 → node(1). Read 2 → node(2). Read # → null. Read # → null. node(2) complete.\nRead 3 → node(3). Read # → null. Read # → null. node(3) complete.\nnode(1).left=node(2), node(1).right=node(3).\n✅ Answer: same tree reconstructed`,
      keyInsight: `O(n) time and O(n) space. Functionally identical to Approach 1. The key learning: the encoding format (separator character, null token) is completely interchangeable — the algorithm is the same regardless.`,
    },

    'Compact Parentheses': {
      intuition: `Encode the tree as a nested parentheses string: "val(left)(right)". The right-child pair is omitted when the right child is null, making the format more compact for unbalanced trees. Deserializing requires scanning the string with a mutable index pointer rather than splitting into tokens first.`,
      steps: [
        `Serialize: if null return "". Build string = val. If left or right is non-null, append "(" + serialize(left) + ")". If right is non-null, append "(" + serialize(right) + ")".`,
        `Deserialize: use a mutable index idx starting at 0.`,
        `compactHelper: read digits (and optional leading minus) for the current node's value.`,
        `If next char is "(", advance idx past it, recurse for left child, advance past closing ")".`,
        `If next char is "(" again, advance idx, recurse for right child, advance past closing ")".`,
        `Return the constructed node.`,
      ],
      example: `Tree: 1 → left:2, right:3 → 3.left:4, 3.right:5\n\nSerialize:\nnode 4 → "4"\nnode 5 → "5"\nnode 3 has left=4, right=5 → "3(4)(5)"\nnode 2 has no children → "2"\nnode 1 has left=2, right=3 → "1(2)(3(4)(5))"\nString: "1(2)(3(4)(5))"\n\nDeserialize:\nidx=0: read "1" → node(1)\nidx=1: '(' → idx=2, recurse: read "2" → node(2), no '(' → return.\nidx=4: ')' → idx=5\nidx=5: '(' → idx=6, recurse: read "3" → node(3)\n  idx=7: '(' → recurse: read "4" → node(4). idx=9: ')' → idx=10\n  idx=10:'(' → recurse: read "5" → node(5). idx=12: ')' → idx=13\nidx=13:')' → idx=14\n✅ Answer: same tree reconstructed`,
      keyInsight: `O(n) time and O(n) space. The compact format is shorter for right-skewed trees (fewer null markers) but requires a stateful index-based parser rather than a simple token queue. Useful when output string size matters.`,
    },
  },
}
