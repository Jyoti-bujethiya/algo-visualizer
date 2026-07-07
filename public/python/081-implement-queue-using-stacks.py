# LeetCode Problem #232: Implement Queue using Stacks
# Difficulty: Easy
# Link: https://leetcode.com/problems/implement-queue-using-stacks/

# ─────────────────────────────────────────────
# APPROACH 1: Two Stacks — Lazy Transfer (Amortized O(1)) | O(1) amortized | O(n) space
# EXPLAIN: Push to inbox; on peek/pop, transfer inbox to outbox only when outbox is empty.
# WHEN: Optimal amortised approach — the standard interview answer.

class MyQueue_TwoStacks:
    def __init__(self):
        self.inbox = []    # push here
        self.outbox = []   # pop from here

    def push(self, x: int) -> None:
        self.inbox.append(x)

    def pop(self) -> int:
        self._transfer()
        return self.outbox.pop()

    def peek(self) -> int:
        self._transfer()
        return self.outbox[-1]

    def empty(self) -> bool:
        return not self.inbox and not self.outbox

    def _transfer(self):
        if not self.outbox:
            while self.inbox:
                self.outbox.append(self.inbox.pop())


# APPROACH 2: Two Stacks — Eager Transfer (O(n) push, O(1) pop) | O(n) push | O(n) space
# EXPLAIN: On every push, move everything to temp stack, add new element, move back.
# WHEN: Simpler reasoning — pop and peek are always O(1) at the cost of expensive push.

class MyQueue_EagerTransfer:
    def __init__(self):
        self.stack = []

    def push(self, x: int) -> None:
        temp = []
        while self.stack:
            temp.append(self.stack.pop())
        self.stack.append(x)
        while temp:
            self.stack.append(temp.pop())

    def pop(self) -> int:
        return self.stack.pop()

    def peek(self) -> int:
        return self.stack[-1]

    def empty(self) -> bool:
        return not self.stack


# ─────────────────────────────────────────────
# APPROACH 3: Deque-based (O(1) all ops) | O(1) amortized | O(n) space
# EXPLAIN: Use collections.deque directly — appendleft for push, pop for pop, giving true O(1).
# WHEN: When you're allowed to use deque; shows the ideal underlying data structure.

from collections import deque as _deque

class MyQueue_Deque:
    def __init__(self):
        self._q = _deque()

    def push(self, x: int) -> None:
        self._q.append(x)

    def pop(self) -> int:
        return self._q.popleft()

    def peek(self) -> int:
        return self._q[0]

    def empty(self) -> bool:
        return len(self._q) == 0


def MyQueue():
    """Default constructor — returns the amortized two-stack implementation."""
    return MyQueue_TwoStacks()


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    for Cls in (MyQueue_TwoStacks, MyQueue_EagerTransfer, MyQueue_Deque):
        q = Cls()
        q.push(1); q.push(2)
        assert q.peek() == 1
        assert q.pop()  == 1
        assert not q.empty()
        assert q.pop()  == 2
        assert q.empty()
        print(f'{Cls.__name__}: passed')

# Made with Bob
