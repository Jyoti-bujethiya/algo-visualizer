/**
 * Tutorial content for #087 — Merge K Sorted Lists
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an array of k sorted linked lists, merge them all into one sorted linked list and return it. Each list is sorted in ascending order. This is the same fundamental problem as "Merge K Sorted Lists" (LeetCode #23) — note that multiple problem numbers may map to the same core algorithm.`,
    example: `Input: [[1→4→5], [1→3→4], [2→6]]\nMerge all three sorted lists into one:\n→ Pick min across heads at each step: 1,1,2,3,4,4,5,6\n✅ Answer: 1→1→2→3→4→4→5→6`,
    keyInsight: `At each step you need the smallest current head across all k lists. A min-heap of size k lets you find the minimum in O(log k) instead of scanning all k heads in O(k), giving O(n log k) total.`,
  },

  approaches: {
    'Min Heap (Priority Queue)': {
      intuition: `Push the head node of each non-null list into a min-heap. Repeatedly extract the minimum node, append it to the result, and if that node has a next node, push the next node into the heap. Repeat until the heap is empty.`,
      steps: [
        `Create a min-heap sorted by node value.`,
        `For each list's head node (if not null): add to heap.`,
        `Create a dummy head node for the result.`,
        `While heap is not empty:`,
        `  node = heap.extractMin()`,
        `  Append node to result list.`,
        `  If node.next exists: heap.add(node.next).`,
        `Return dummy.next.`,
      ],
      example: `Lists: [1→4→5], [1→3→4], [2→6]\n\nHeap initially: {1(list1), 1(list2), 2(list3)}\nExtract 1(list1): result→1; push 4. Heap:{1(L2),2(L3),4(L1)}\nExtract 1(list2): result→1→1; push 3. Heap:{2(L3),3(L2),4(L1)}\nExtract 2(list3): result→1→1→2; push 6. Heap:{3(L2),4(L1),6(L3)}\nExtract 3: push 4. Heap:{4(L1),4(L2),6}\nExtract 4(L1): push 5. ...\nFinal: 1→1→2→3→4→4→5→6 ✅`,
      keyInsight: `O(n log k) time where n = total nodes, k = number of lists. O(k) space for the heap. This is the optimal and standard interview solution for merging k sorted sequences.`,
    },

    'Divide and Conquer': {
      intuition: `Treat the k lists like a tournament bracket. Merge pairs of lists in round 1 (getting k/2 merged lists), then merge those pairs in round 2, and so on — log k rounds total. Each round does O(n) work total. This is the merge sort approach applied to k-way merging.`,
      steps: [
        `If 0 or 1 list: return as-is.`,
        `Pair up adjacent lists and merge each pair using the standard two-list merge.`,
        `Replace the list array with the merged results (half as many).`,
        `Repeat until only one list remains.`,
      ],
      example: `Round 0: [L1,L2,L3] → merge(L1,L2)=[1,1,3,4,4,5], L3=[2,6]\nRound 1: [L12, L3] → merge L12 and L3\n= 1→1→2→3→4→4→5→6 ✅`,
      keyInsight: `O(n log k) time, O(log k) space for the recursion stack. Same complexity as the heap approach but with better cache performance on some hardware. Often the "elegant" solution interviewers appreciate.`,
    },

    'Collect and Sort': {
      intuition: `The simplest possible approach: collect all values from all lists into a single array, sort the array, then build a new linked list from the sorted values. No heaps, no merging logic — just collect, sort, rebuild.`,
      steps: [
        `Traverse all k lists and collect all node values into an array.`,
        `Sort the array.`,
        `Build a new linked list from the sorted array.`,
        `Return its head.`,
      ],
      example: `Lists: [1→4→5], [1→3→4], [2→6]\nCollect: [1,4,5,1,3,4,2,6]\nSort: [1,1,2,3,4,4,5,6]\nBuild: 1→1→2→3→4→4→5→6 ✅`,
      keyInsight: `O(n log n) time, O(n) space. Simple to code but discards the "already sorted" property of each list — we're paying to re-sort information that was partially sorted for free. Fine for quick solutions in interviews.`,
    },

    'Sequential Merge (Brute Force)': {
      intuition: `Merge the lists one by one: merge list1 with list2, take the result and merge with list3, and so on. This is the simplest iterative approach using the standard two-list merge as a subroutine.`,
      steps: [
        `Start with result = lists[0].`,
        `For i from 1 to k-1: result = mergeTwoLists(result, lists[i]).`,
        `Return result.`,
      ],
      example: `Lists: [L1=[1,4,5], L2=[1,3,4], L3=[2,6]]\n\nmerge(L1, L2) = [1,1,3,4,4,5]\nmerge([1,1,3,4,4,5], L3=[2,6]) = [1,1,2,3,4,4,5,6] ✅`,
      keyInsight: `O(kn) time (each of the n total nodes is touched in up to k merges), O(1) extra space. Much slower than the heap/divide-and-conquer for large k. Acceptable only for small k (like k ≤ 10).`,
    },
  },
}
