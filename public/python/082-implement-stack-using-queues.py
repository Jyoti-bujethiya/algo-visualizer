# LeetCode Problem #225: Implement Stack using Queues
# Difficulty: Easy
# Link: https://leetcode.com/problems/implement-stack-using-queues/

from collections import deque

# ─────────────────────────────────────────────
# APPROACH 1: Two Queues — O(n) push, O(1) pop | O(n) space
# EXPLAIN: On push rotate the new element to front: enqueue to q2, drain q1 into q2, then swap.
# WHEN: Intuitive two-queue approach; push is O(n), pop/top are O(1).

class MyStack_TwoQueues:
    def __init__(self):
        self.q1 = deque()
        self.q2 = deque()

    def push(self, x: int) -> None:
        self.q2.append(x)
        while self.q1:
            self.q2.append(self.q1.popleft())
        self.q1, self.q2 = self.q2, self.q1

    def pop(self) -> int:
        return self.q1.popleft()

    def top(self) -> int:
        return self.q1[0]

    def empty(self) -> bool:
        return not self.q1


# APPROACH 2: One Queue — O(n) push, O(1) pop | O(n) space
# EXPLAIN: After appending, rotate the queue n-1 times so the new element is at front.
# WHEN: Simpler with a single queue; same push complexity but fewer variables.

class MyStack_OneQueue:
    def __init__(self):
        self.q = deque()

    def push(self, x: int) -> None:
        self.q.append(x)
        for _ in range(len(self.q) - 1):
            self.q.append(self.q.popleft())

    def pop(self) -> int:
        return self.q.popleft()

    def top(self) -> int:
        return self.q[0]

    def empty(self) -> bool:
        return not self.q


# ─────────────────────────────────────────────
# APPROACH 3: Deque-based (O(1) push, O(n) pop) | O(n) pop | O(n) space
# EXPLAIN: Use a deque and rotate it after each push so the new element is at front; pop is O(1).
# WHEN: Shows how deque rotation achieves stack semantics with a single data structure.

from collections import deque as _deque

class MyStack_Deque:
    def __init__(self):
        self._d = _deque()

    def push(self, x: int) -> None:
        self._d.append(x)
        # rotate so newest element is at front
        for _ in range(len(self._d) - 1):
            self._d.append(self._d.popleft())

    def pop(self) -> int:
        return self._d.popleft()

    def top(self) -> int:
        return self._d[0]

    def empty(self) -> bool:
        return len(self._d) == 0


def MyStack():
    """Default constructor — returns the single-queue implementation."""
    return MyStack_OneQueue()


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    for Cls in (MyStack_TwoQueues, MyStack_OneQueue, MyStack_Deque):
        s = Cls()
        s.push(1); s.push(2)
        assert s.top() == 2
        assert s.pop() == 2
        assert not s.empty()
        assert s.pop() == 1
        assert s.empty()
        print(f'{Cls.__name__}: passed')

# Made with Bob
