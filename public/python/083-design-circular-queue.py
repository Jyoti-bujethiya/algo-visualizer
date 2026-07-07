# LeetCode Problem #622: Design Circular Queue
# Difficulty: Medium
# Link: https://leetcode.com/problems/design-circular-queue/

# ─────────────────────────────────────────────
# APPROACH 1: Array with Head/Tail Pointers | O(1) all ops | O(k) space
# EXPLAIN: Use a fixed-size array; head/tail pointers wrap around with modulo.
# WHEN: Classic circular buffer — most efficient and standard implementation.

class MyCircularQueue_Array:
    def __init__(self, k: int):
        self.data = [0] * k
        self.head = 0
        self.tail = -1
        self.size = 0
        self.capacity = k

    def enQueue(self, value: int) -> bool:
        if self.isFull():
            return False
        self.tail = (self.tail + 1) % self.capacity
        self.data[self.tail] = value
        self.size += 1
        return True

    def deQueue(self) -> bool:
        if self.isEmpty():
            return False
        self.head = (self.head + 1) % self.capacity
        self.size -= 1
        return True

    def Front(self) -> int:
        return -1 if self.isEmpty() else self.data[self.head]

    def Rear(self) -> int:
        return -1 if self.isEmpty() else self.data[self.tail]

    def isEmpty(self) -> bool:
        return self.size == 0

    def isFull(self) -> bool:
        return self.size == self.capacity


# APPROACH 2: Doubly Linked List | O(1) all ops | O(k) space
# EXPLAIN: Use a doubly linked list with dummy head/tail sentinels and a size counter.
# WHEN: Dynamic allocation; avoids pre-allocating the full array.

class MyCircularQueue_LinkedList:
    class _Node:
        def __init__(self, val=0):
            self.val = val
            self.prev = self.next = None

    def __init__(self, k: int):
        self.capacity = k
        self.size = 0
        self.head = self._Node()  # dummy
        self.tail = self._Node()  # dummy
        self.head.next = self.tail
        self.tail.prev = self.head

    def enQueue(self, value: int) -> bool:
        if self.isFull():
            return False
        node = self._Node(value)
        prev = self.tail.prev
        prev.next = node
        node.prev = prev
        node.next = self.tail
        self.tail.prev = node
        self.size += 1
        return True

    def deQueue(self) -> bool:
        if self.isEmpty():
            return False
        front = self.head.next
        self.head.next = front.next
        front.next.prev = self.head
        self.size -= 1
        return True

    def Front(self) -> int:
        return -1 if self.isEmpty() else self.head.next.val

    def Rear(self) -> int:
        return -1 if self.isEmpty() else self.tail.prev.val

    def isEmpty(self) -> bool:
        return self.size == 0

    def isFull(self) -> bool:
        return self.size == self.capacity


def MyCircularQueue(k: int):
    """Default constructor — returns array-based implementation."""
    return MyCircularQueue_Array(k)


# ── quick tests ──────────────────────────────────────────────────────────────
# ─────────────────────────────────────────────
# APPROACH 3: Deque with Max-Length (O(1) all ops) | O(1) all ops | O(k) space
# EXPLAIN: Use collections.deque(maxlen=k) — Python's deque enforces capacity automatically.
# WHEN: Pythonic solution when the language's stdlib is available; cleanest implementation.

from collections import deque as _deque

class MyCircularQueue_Deque:
    def __init__(self, k: int):
        self._d = _deque(maxlen=k)
        self._k = k

    def enQueue(self, value: int) -> bool:
        if self.isFull():
            return False
        self._d.append(value)
        return True

    def deQueue(self) -> bool:
        if self.isEmpty():
            return False
        self._d.popleft()
        return True

    def Front(self) -> int:
        return -1 if self.isEmpty() else self._d[0]

    def Rear(self) -> int:
        return -1 if self.isEmpty() else self._d[-1]

    def isEmpty(self) -> bool:
        return len(self._d) == 0

    def isFull(self) -> bool:
        return len(self._d) == self._k


if __name__ == '__main__':
    for Cls in (MyCircularQueue_Array, MyCircularQueue_LinkedList):
        q = Cls(3)
        assert q.enQueue(1)
        assert q.enQueue(2)
        assert q.enQueue(3)
        assert not q.enQueue(4)   # full
        assert q.Rear()  == 3
        assert q.isFull()
        assert q.deQueue()
        assert q.enQueue(4)
        assert q.Rear()  == 4
        assert q.Front() == 2
        print(f'{Cls.__name__}: passed')

# Made with Bob
