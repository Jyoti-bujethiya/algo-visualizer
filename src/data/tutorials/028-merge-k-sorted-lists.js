/**
 * Tutorial content for #028 — Merge K Sorted Lists
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `You are given an array of k linked lists, each sorted in ascending order. Merge all of them into one single sorted linked list and return its head.`,
    example: `Input: [[1→4→5], [1→3→4], [2→6]]\n→ Compare heads: 1, 1, 2 → pick 1\n→ Compare heads: 1, 3, 4, 2 → pick 1\n→ Continue picking smallest each time\n✅ Answer: 1 → 1 → 2 → 3 → 4 → 4 → 5 → 6`,
    keyInsight: `Merging k lists is expensive if you pick the minimum by scanning all k heads every time. A min-heap (priority queue) lets you find and remove the minimum in O(log k) instead of O(k), giving a much faster overall solution.`,
  },

  approaches: {
    'Min Heap': {
      intuition: `Put the head node of every list into a min-heap ordered by node value. Repeatedly extract the minimum node, append it to your result list, and if that node has a next node, push the next node into the heap. The heap always holds at most k nodes — one per remaining list — so each extraction is O(log k).`,
      steps: [
        `Create a min-heap (priority queue) and insert the head of each non-null list.`,
        `Create a dummy head node for the result list; keep a tail pointer on it.`,
        `While the heap is not empty: extract the node with the smallest value.`,
        `Append that node to tail (tail.next = node, then advance tail).`,
        `If the extracted node has a next pointer, push node.next into the heap.`,
        `Return dummy.next as the head of the merged list.`,
      ],
      example: `Lists: [1→4→5], [1→3→4], [2→6]\n\nHeap: {1(L1), 1(L2), 2(L3)}\nExtract 1(L1) → result: 1, push 4(L1). Heap: {1(L2),2(L3),4(L1)}\nExtract 1(L2) → result: 1→1, push 3(L2). Heap: {2(L3),3(L2),4(L1)}\nExtract 2(L3) → result: 1→1→2, push 6(L3). Heap: {3(L2),4(L1),6(L3)}\nExtract 3(L2) → result: 1→1→2→3, push 4(L2). Heap: {4(L1),4(L2),6(L3)}\n... continue until heap empty\n✅ Answer: 1→1→2→3→4→4→5→6`,
      keyInsight: `O(N log k) time where N = total nodes and k = number of lists. O(k) space for the heap. This is the optimal approach for large k.`,
    },

    'Divide and Conquer': {
      intuition: `Instead of merging all k lists at once, pair them up and merge each pair. Repeat this halving process — like a tournament bracket — until one list remains. Each round halves the number of lists, so there are log k rounds, and each round does O(N) work total across all merges.`,
      steps: [
        `Start with the array of k lists.`,
        `In each round, pair up adjacent lists and merge each pair using the classic two-list merge.`,
        `Collect the merged results as the new, smaller array of lists.`,
        `Repeat the pairing/merging until only one list remains.`,
        `Return that final list.`,
      ],
      example: `Lists: [L1, L2, L3, L4]  (k=4)\n\nRound 1: merge(L1,L2)=M12, merge(L3,L4)=M34 → [M12, M34]\nRound 2: merge(M12,M34)=M1234 → [M1234]\nDone!\n\nFor our example [[1→4→5],[1→3→4],[2→6]]:\nRound 1: merge(L1,L2)=[1→1→3→4→4→5], L3=[2→6] → 2 lists\nRound 2: merge → [1→1→2→3→4→4→5→6]\n✅ Answer: 1→1→2→3→4→4→5→6`,
      keyInsight: `O(N log k) time, O(1) extra space beyond recursion stack. Same time complexity as the heap but with very low constant factors. The divide-and-conquer structure avoids repeatedly re-merging long lists.`,
    },

    'Sequential Merge': {
      intuition: `Merge lists one by one: take the result so far and merge it with the next list in the array, then merge that result with the list after, and so on. You are reducing k lists to 1 by doing k-1 two-list merges sequentially.`,
      steps: [
        `If the input is empty, return null.`,
        `Set result = lists[0].`,
        `For i from 1 to k-1: result = mergeTwoLists(result, lists[i]).`,
        `Return result after all merges.`,
        `(mergeTwoLists uses the classic pointer-based O(n+m) merge.)`,
      ],
      example: `Lists: [1→4→5], [1→3→4], [2→6]\n\nStep 1: merge([1→4→5], [1→3→4]) = 1→1→3→4→4→5\nStep 2: merge([1→1→3→4→4→5], [2→6]) = 1→1→2→3→4→4→5→6\n✅ Answer: 1→1→2→3→4→4→5→6`,
      keyInsight: `O(kN) time in the worst case (the first list gets re-merged k-1 times, growing longer each round). O(1) extra space. Fine for small k but slow for large k — use heap or divide-and-conquer instead.`,
    },

    'Iterative Pairwise Merge': {
      intuition: `Merge lists two at a time in repeated rounds, similar to Divide and Conquer but implemented iteratively rather than recursively. In each round, pair up adjacent lists and merge each pair; the results become the input for the next round. After ⌈log k⌉ rounds a single list remains. This avoids the recursion stack of the divide-and-conquer approach.`,
      steps: [
        `Start with the array of k lists.`,
        `While the array has more than 1 list: create a new empty array for this round's results.`,
        `  Iterate i = 0, 2, 4, … over the current array: merge lists[i] and lists[i+1] (or just lists[i] if i+1 is out of bounds).`,
        `  Append each merged result to the round's result array.`,
        `Replace the current array with the round results and repeat.`,
        `Return the single remaining list.`,
      ],
      example: `Lists: [L1, L2, L3, L4, L5]  (k=5)\n\nRound 1 (pair adjacent):\n  merge(L1,L2)=M12, merge(L3,L4)=M34, L5 unpaired → [M12, M34, L5]\nRound 2:\n  merge(M12,M34)=M1234, L5 unpaired → [M1234, L5]\nRound 3:\n  merge(M1234,L5)=M12345 → [M12345]\nDone!\n\nFor [[1→4→5],[1→3→4],[2→6]]:\nRound 1: merge(L1,L2)=[1→1→3→4→4→5], L3=[2→6]\nRound 2: merge → [1→1→2→3→4→4→5→6]\n✅ Answer: 1→1→2→3→4→4→5→6`,
      keyInsight: `O(N log k) time, O(1) extra space (no recursion stack). The iterative pairing mirrors the divide-and-conquer structure but is easier to reason about stack depth — each round processes every node once and halves the list count.`,
    },

    'Collect + Sort': {
      intuition: `Drain all node values into a plain array, sort it with the language's built-in sort, then reconstruct a fresh linked list node by node. The name "Collect + Sort" distinguishes this from "Collect and Sort" (which builds new nodes); the two approaches are algorithmically identical but may differ in minor implementation details such as whether original nodes are reused.`,
      steps: [
        `Traverse every list and collect each node's value into a flat integer array.`,
        `Sort the array using the built-in comparator (e.g. Collections.sort or Arrays.sort).`,
        `Create a dummy head and a tail pointer for the result list.`,
        `Iterate over the sorted array: create a new ListNode for each value and append it to the tail.`,
        `Return dummy.next.`,
      ],
      example: `Lists: [1→4→5], [1→3→4], [2→6]\n\nCollect values: [1, 4, 5, 1, 3, 4, 2, 6]\nSort:           [1, 1, 2, 3, 4, 4, 5, 6]\nBuild new list: new node(1) → new node(1) → … → new node(6)\n✅ Answer: 1→1→2→3→4→4→5→6`,
      keyInsight: `O(N log N) time (sort dominates), O(N) space for the value array plus the new list. Simpler to implement than any merge-based strategy but sacrifices the sorted property of each input list.`,
    },
  },
}
