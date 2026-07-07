/**
 * Tutorial content for #083 — Design Circular Queue
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Design a circular (ring buffer) queue with a fixed maximum capacity k. Implement: enQueue(val) — add to the rear (return false if full), deQueue() — remove from front (return false if empty), Front() — get front value (-1 if empty), Rear() — get rear value (-1 if empty), isEmpty(), isFull().`,
    example: `k = 3\nenQueue(1) → true.  queue: [1]\nenQueue(2) → true.  queue: [1,2]\nenQueue(3) → true.  queue: [1,2,3]\nenQueue(4) → false. (full)\nRear()     → 3\ndeQueue()  → true.  queue: [2,3]\nenQueue(4) → true.  queue: [2,3,4]\n✅ Answer: Rear = 3, then the queue becomes [2,3,4]`,
    keyInsight: `Use a fixed-size array with head and tail pointers. "Circular" means that when tail reaches the end of the array it wraps around to index 0 — achieved with modulo arithmetic (tail = (tail+1) % k).`,
  },

  approaches: {
    'Array with Head/Tail Pointers': {
      intuition: `Allocate an array of size k. Keep two pointers: head (index of the front element) and tail (index of the last element). Also track the current size.\n\nTo enqueue, increment tail mod k, write the value. To dequeue, increment head mod k. isFull when size == k, isEmpty when size == 0.`,
      steps: [
        `Allocate int[] data of size k; int head=0, tail=-1, size=0.`,
        `enQueue(val): if isFull return false; tail=(tail+1)%k; data[tail]=val; size++; return true.`,
        `deQueue(): if isEmpty return false; head=(head+1)%k; size--; return true.`,
        `Front(): if isEmpty return -1; return data[head].`,
        `Rear(): if isEmpty return -1; return data[tail].`,
        `isEmpty(): return size == 0.`,
        `isFull(): return size == k.`,
      ],
      example: `k=3. data=[_,_,_], head=0, tail=-1, size=0\n\nenQueue(1): tail=(0)%3=0, data[0]=1, size=1. data:[1,_,_]\nenQueue(2): tail=1, data[1]=2, size=2.       data:[1,2,_]\nenQueue(3): tail=2, data[2]=3, size=3.       data:[1,2,3]\nenQueue(4): size==k → return false ✅\nRear() → data[tail=2] = 3 ✅\ndeQueue(): head=(0+1)%3=1, size=2.\nenQueue(4): tail=(2+1)%3=0, data[0]=4, size=3. data:[4,2,3]\nFront() → data[head=1] = 2\nRear()  → data[tail=0] = 4 ✅`,
      keyInsight: `O(1) for all operations, O(k) space. The modulo trick is the entire secret to making the array "circular." This is the most common interview-friendly implementation.`,
    },

    'Doubly Linked List': {
      intuition: `Instead of an array, maintain a doubly linked list with pointers to both the head and tail nodes, plus a count. enQueue appends to the tail, deQueue removes from the head. No index arithmetic needed — just pointer manipulation.`,
      steps: [
        `Define Node class with val, prev, next.`,
        `Keep head, tail (sentinel or actual nodes), count, capacity k.`,
        `enQueue(val): if full return false; create new node; link after tail; tail = new node; count++.`,
        `deQueue(): if empty return false; head = head.next; unlink old head; count--.`,
        `Front(): isEmpty ? -1 : head.val.`,
        `Rear(): isEmpty ? -1 : tail.val.`,
      ],
      example: `k=3\nenQueue(1): list: [1]      head→1←→tail\nenQueue(2): list: [1,2]    head→1↔2←tail\nenQueue(3): list: [1,2,3]  head→1↔2↔3←tail\nisFull() → count=3=k → true\ndeQueue(): remove head(1), head→2. list: [2,3]\nenQueue(4): list: [2,3,4], tail→4\nFront() = 2, Rear() = 4 ✅`,
      keyInsight: `O(1) for all operations, O(k) space. No modulo arithmetic, but more memory per element (pointers). Preferred when the queue size is very dynamic or when you want to avoid pre-allocating a large array.`,
    },

    'ArrayDeque with Max-Capacity Check (O(1) all ops)': {
      intuition: `Use Java's LinkedList (or ArrayDeque) as the backing structure and enforce capacity manually with a size check. enQueue appends to the tail (addLast), deQueue removes from the head (removeFirst). isEmpty and isFull check the list size against capacity k. This mirrors Python's collections.deque(maxlen=k) and avoids all index arithmetic.`,
      steps: [
        `Store a LinkedList<Integer> list and an int capacity = k.`,
        `enQueue(val): if isFull() return false; list.addLast(val); return true.`,
        `deQueue(): if isEmpty() return false; list.removeFirst(); return true.`,
        `Front(): isEmpty() ? -1 : list.getFirst().`,
        `Rear(): isEmpty() ? -1 : list.getLast().`,
        `isEmpty(): list.isEmpty(). isFull(): list.size() == capacity.`,
      ],
      example: `k=3\nenQueue(1): list=[1]\nenQueue(2): list=[1,2]\nenQueue(3): list=[1,2,3]\nenQueue(4): isFull() → return false ✅\nRear(): list.getLast() = 3 ✅\ndeQueue(): list.removeFirst() → list=[2,3]\nenQueue(4): list=[2,3,4]\nFront(): list.getFirst() = 2\nRear():  list.getLast()  = 4 ✅`,
      keyInsight: `O(1) for all operations (LinkedList provides O(1) head/tail ops), O(k) space. Cleanest code among the three approaches — no modulo, no pointer bookkeeping. The trade-off is slightly higher memory overhead per element due to linked-list node objects.`,
    },
  },
}
