/**
 * Tutorial content for #094 — Search a 2D Matrix
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an m×n matrix where each row is sorted in ascending order and the first integer of each row is greater than the last integer of the previous row, search for a target value. Return true if found, false otherwise. The matrix is essentially one long sorted array laid out in rows.`,
    example: `matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3\nRow 0: [1,3,5,7]    — 3 is here!\nRow 1: [10,11,16,20]\nRow 2: [23,30,34,60]\n✅ Answer: true`,
    keyInsight: `Because every row follows the last, the matrix is equivalent to one sorted array of length m*n. You can run a single binary search by converting a 1D index i into 2D coordinates: row = i/n, col = i%n.`,
  },

  approaches: {
    'Treat as 1D Array': {
      intuition: `Imagine the matrix "unrolled" into a single sorted array of length m*n. Run a standard binary search on indices 0 to m*n-1. For any index mid, convert back to 2D: row = mid / n, col = mid % n, then compare matrix[row][col] to the target.`,
      steps: [
        `m = rows, n = cols. left = 0, right = m*n - 1.`,
        `While left <= right:`,
        `  mid = left + (right - left) / 2.`,
        `  val = matrix[mid / n][mid % n].`,
        `  If val == target: return true.`,
        `  If val < target: left = mid + 1.`,
        `  Else: right = mid - 1.`,
        `Return false.`,
      ],
      example: `matrix=[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=3\nm=3, n=4. left=0, right=11.\n\nmid=5: 5/4=1, 5%4=1 → matrix[1][1]=11. 11>3 → right=4.\nmid=2: 2/4=0, 2%4=2 → matrix[0][2]=5. 5>3 → right=1.\nmid=0: 0/4=0, 0%4=0 → matrix[0][0]=1. 1<3 → left=1.\nmid=1: 1/4=0, 1%4=1 → matrix[0][1]=3. 3==3 → return true ✅`,
      keyInsight: `O(log(m*n)) time, O(1) space. This is the optimal solution. The key insight is that the matrix's property makes it a 1D sorted array in disguise.`,
    },

    'Two Binary Searches': {
      intuition: `Binary search the rows to find which row could contain the target (the target must be ≥ the first element and ≤ the last element of that row). Then binary search within that row.`,
      steps: [
        `Binary search rows: find the row where row[0] <= target <= row[n-1].`,
        `  left=0, right=m-1.`,
        `  While left <= right: check mid row. Narrow based on first/last element.`,
        `If no valid row found: return false.`,
        `Binary search the identified row for target.`,
      ],
      example: `matrix=[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=3\n\nRow search: mid=1([10..20]). 3<10 → right=0.\n  mid=0([1..7]). 1<=3<=7 → row 0 found.\nCol search in row 0=[1,3,5,7]: mid=1(val=3)==3 → return true ✅`,
      keyInsight: `O(log m + log n) = O(log(mn)) time, O(1) space. Same asymptotic complexity as "Treat as 1D" but uses two separate binary searches. Slightly more code but very easy to reason about.`,
    },

    'Start from Top-Right': {
      intuition: `Start at the top-right corner. At each step:\n• If current value == target → found.\n• If current value > target → move left (eliminate this column).\n• If current value < target → move down (eliminate this row).\nThis works because top-right is the max of its row and min of its column.`,
      steps: [
        `row = 0, col = n - 1.`,
        `While row < m AND col >= 0:`,
        `  If matrix[row][col] == target: return true.`,
        `  If matrix[row][col] > target: col-- (go left).`,
        `  Else: row++ (go down).`,
        `Return false.`,
      ],
      example: `matrix=[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=3\n\nStart (0,3)=7 > 3 → col=2\n(0,2)=5 > 3 → col=1\n(0,1)=3 == 3 → return true ✅`,
      keyInsight: `O(m+n) time, O(1) space. Slower than the O(log(mn)) binary searches, but this approach works on matrices where only each row (not globally) is sorted — a more general matrix search.`,
    },

    'Linear Search': {
      intuition: `Check every element in the matrix one by one. No exploitation of sorted order.`,
      steps: [
        `For each row in matrix:`,
        `  For each value in row:`,
        `    If value == target: return true.`,
        `Return false.`,
      ],
      example: `target=3\nRow 0: 1≠3, 3==3 → return true ✅`,
      keyInsight: `O(m*n) time, O(1) space. Always correct but completely ignores the sorted structure. Use only as a reference baseline.`,
    },

    'Row-wise Binary Search': {
      intuition: `For each row, quickly check if the target could be in that row (target >= row[0] and target <= row[n-1]), and if so, binary search that row. Skip rows where the target is out of range.`,
      steps: [
        `For each row:`,
        `  If target < row[0] or target > row[n-1]: continue.`,
        `  Binary search within row for target.`,
        `  If found: return true.`,
        `Return false.`,
      ],
      example: `target=3\nRow 0=[1..7]: 1<=3<=7 → binary search [1,3,5,7] for 3 → found at idx 1 → return true ✅\nRow 1=[10..20]: 3<10 → skip\nRow 2=[23..60]: 3<23 → skip`,
      keyInsight: `O(m + n) worst case (check all rows, binary search one). O(1) space. Less efficient than the 1D binary search approach but easy to implement and verify.`,
    },
  },
}
