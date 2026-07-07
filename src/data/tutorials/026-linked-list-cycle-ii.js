/**
 * Tutorial content for #026 — Linked List Cycle II
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a linked list, find the node where the cycle begins. If there is no cycle, return null. You are given the head of the list and you must return the actual node object (not just its value). You may not modify the list.`,
    example: `head = [3, 2, 0, -4], pos = 1  (tail connects back to index 1)\n→ Node at index 1 has value 2\n→ Travel: 3 → 2 → 0 → -4 → 2 (cycle detected)\n✅ Answer: node with value 2`,
    keyInsight: `If a slow pointer and a fast pointer meet inside a cycle, the distance from the meeting point to the cycle entrance equals the distance from the head to the entrance — so restarting one pointer from head and advancing both one step at a time finds the exact entry node.`,
  },

  approaches: {
    "Floyd's Algorithm + Math": {
      intuition: `Use two pointers: slow moves one step at a time, fast moves two steps. If a cycle exists they must meet. Here is the magic: once they meet, place one pointer back at head. Now advance BOTH one step at a time. The spot where they meet again is the cycle entrance. This is provable with simple algebra on the distances.`,
      steps: [
        `Initialise slow = head, fast = head.`,
        `Advance slow by 1 and fast by 2 each iteration. If fast or fast.next is null, there is no cycle — return null.`,
        `When slow === fast, the pointers have met inside the cycle.`,
        `Move slow back to head; keep fast at the meeting point.`,
        `Advance both slow and fast by exactly 1 step each iteration.`,
        `When slow === fast again, that node is the cycle entrance — return it.`,
      ],
      example: `List: 3 → 2 → 0 → -4 → (back to 2)\nLet F = distance head→entry, C = cycle length, x = entry→meeting point.\n\nPhase 1 — find meeting:\nslow travels F + x steps; fast travels F + x + n*C steps.\n2(F+x) = F+x+nC  →  F = nC − x\n\nPhase 2 — find entry:\nStart one pointer at head (travels F), one at meeting point (travels nC−x = F).\nBoth arrive at the entry at the same time.\n\nConcretely:\nMeeting inside cycle at node -4.\nReset slow to head (node 3), keep fast at -4.\nStep 1: slow→2, fast→2. They meet!\n✅ Answer: node 2 (index 1)`,
      keyInsight: `O(n) time, O(1) space. The math shows F = nC − x, so both pointers travel the same number of steps to the entrance after the reset.`,
    },

    'Hash Set': {
      intuition: `The simplest approach: walk the list one node at a time and record every node you visit in a hash set. The very first node you try to add that is already in the set is the cycle entrance — because it's the first node you've visited twice.`,
      steps: [
        `Create an empty hash set (or Set in JS).`,
        `Start a pointer curr at head.`,
        `At each step, check if curr is already in the set.`,
        `If yes, curr is the cycle entrance — return it.`,
        `If no, add curr to the set and move curr to curr.next.`,
        `If curr becomes null, no cycle exists — return null.`,
      ],
      example: `List: 3 → 2 → 0 → -4 → (back to 2)\n\nVisit 3  → set: {3}\nVisit 2  → set: {3, 2}\nVisit 0  → set: {3, 2, 0}\nVisit -4 → set: {3, 2, 0, -4}\nVisit 2  → 2 is already in set!\n✅ Answer: node 2`,
      keyInsight: `O(n) time and O(n) space. Easiest to code and understand, but uses extra memory proportional to the list length.`,
    },

    'Reverse Pointers': {
      intuition: `Walk the list reversing each pointer as you go (pointing each node back to its predecessor). When you finally reach a node whose next is head, that is the cycle entrance — because the cycle makes the forward path loop back, and reversing exposes it. Restore the list afterward.`,
      steps: [
        `If head is null or head.next is null, return null.`,
        `Walk forward reversing each link: keep prev, curr, next pointers.`,
        `When curr.next === head, you have reached the last node of the "reversed" path — curr is the cycle entrance.`,
        `Reverse the entire list back to restore it.`,
        `Return the entrance node.`,
      ],
      example: `List: 3 → 2 → 0 → -4 → (back to 2)\n\nReverse step by step:\n3 ←→ 2 (reverse link from 2 to 3)\n3 ←→ 2 ←→ 0\n3 ←→ 2 ←→ 0 ←→ -4\nNext of -4 points to 2 (head of cycle), and 2's link was already reversed back to 3.\nWhen curr.next === original head? No — detect when we'd revisit a reversed node.\nActually check: curr.next is the entrance node when following next leads to a node already pointing backwards (i.e. next.next has been reversed to point away).\n✅ Answer: node 2`,
      keyInsight: `O(n) time, O(1) space. Clever but tricky to implement correctly — requires careful pointer bookkeeping and list restoration. Floyd's is preferred in practice.`,
    },

    'Mark Values': {
      intuition: `Walk the list and destructively mark each visited node by overwriting its value with a unique sentinel (Integer.MIN_VALUE). If you encounter a node whose value is already the sentinel, that is the first node visited twice — the cycle entrance. This avoids any extra data structure at the cost of permanently modifying node values.`,
      steps: [
        `Choose a sentinel value that cannot appear in the input (e.g. Integer.MIN_VALUE).`,
        `Start curr = head.`,
        `At each step: if curr.val == sentinel, return curr (cycle entrance found).`,
        `Otherwise, set curr.val = sentinel (mark as visited), then curr = curr.next.`,
        `If curr becomes null, return null (no cycle).`,
      ],
      example: `List: 3 → 2 → 0 → -4 → (back to 2)\n\ncurr=3: val≠MIN, mark val=MIN, move → curr=2\ncurr=2: val≠MIN, mark val=MIN, move → curr=0\ncurr=0: val≠MIN, mark val=MIN, move → curr=-4\ncurr=-4: val≠MIN, mark val=MIN, move → curr=2 (cycle)\ncurr=2: val==MIN → ✅ return curr (node 2 is cycle entrance)`,
      keyInsight: `O(n) time, O(1) space. Extremely simple to implement — no math required. The major drawback is that the list is permanently mutated. Use only when mutation is acceptable.`,
    },

    'Distance Calculation': {
      intuition: `An algebraic companion to Floyd's. Let F = distance from head to cycle entrance, C = cycle length, and x = distance from entrance to meeting point. Since fast travels twice as far as slow, we derive 2(F + x) = F + x + n·C, which simplifies to F = n·C − x. This means resetting one pointer to head and advancing both one step at a time will bring them to the entrance simultaneously after exactly F more steps.`,
      steps: [
        `Run the standard Floyd's phase 1: slow and fast start at head, slow moves 1 step, fast 2 steps, until they meet. If fast reaches null, return null.`,
        `At the meeting point, let x = steps from cycle entrance to this point.`,
        `The math gives F = n·C − x, where F is the head-to-entrance distance.`,
        `Reset slow to head; keep fast at the meeting point. Advance both 1 step at a time.`,
        `After F steps both arrive at the cycle entrance — return that node.`,
      ],
      example: `List: head → [3] → [2] → [0] → [-4] → (back to [2])\nF=1 (head to node 2), C=3 (cycle: 2→0→-4→2), meeting at node -4 → x=2\nProof: F = 1·C − x = 3 − 2 = 1 ✓\n\nPhase 2: slow starts at head(3), fast stays at -4.\nStep 1: slow=2, fast=2. They meet!\n✅ return node(2)`,
      keyInsight: `O(n) time, O(1) space — same as Floyd's. This entry emphasises the mathematical derivation (F = nC − x) that proves correctness, useful when an interviewer asks "why does resetting one pointer work?"`,
    },
  },
}
