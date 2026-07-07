# LeetCode Problem #155: Min Stack
# Difficulty: Medium
# Link: https://leetcode.com/problems/min-stack/

# ─────────────────────────────────────────────
# APPROACH 1: Two Stacks | O(1) time all ops | O(n) space
# EXPLAIN: Maintain a parallel min-stack that tracks the current minimum at each level.
# WHEN: Classic, clean solution — industry standard for this problem.

class MinStack_TwoStacks:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        min_val = min(val, self.min_stack[-1] if self.min_stack else val)
        self.min_stack.append(min_val)

    def pop(self) -> None:
        self.stack.pop()
        self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]


# APPROACH 2: Stack of (value, min) Pairs | O(1) time all ops | O(n) space
# EXPLAIN: Each stack entry stores (value, current_min) as a tuple — single data structure.
# WHEN: Prefer fewer variables; encapsulates both value and min in one stack.

class MinStack_Pairs:
    def __init__(self):
        self.stack = []  # (value, current_min)

    def push(self, val: int) -> None:
        cur_min = min(val, self.stack[-1][1] if self.stack else val)
        self.stack.append((val, cur_min))

    def pop(self) -> None:
        self.stack.pop()

    def top(self) -> int:
        return self.stack[-1][0]

    def getMin(self) -> int:
        return self.stack[-1][1]


# APPROACH 3: Encode Delta | O(1) time all ops | O(n) space
# EXPLAIN: Store (val - current_min) on stack; reconstruct min from negative deltas.
# WHEN: Space-constant alternative when values are large integers and you want one list.

class MinStack_Delta:
    def __init__(self):
        self.stack = []
        self.min_val = float('inf')

    def push(self, val: int) -> None:
        if not self.stack:
            self.stack.append(0)
            self.min_val = val
        else:
            delta = val - self.min_val
            self.stack.append(delta)
            if val < self.min_val:
                self.min_val = val

    def pop(self) -> None:
        delta = self.stack.pop()
        if delta < 0:
            self.min_val = self.min_val - delta  # restore previous min

    def top(self) -> int:
        delta = self.stack[-1]
        return self.min_val if delta <= 0 else self.min_val + delta

    def getMin(self) -> int:
        return self.min_val


# APPROACH 4: Vector of (value, min) Pairs | O(1) time all ops | O(n) space
# EXPLAIN: Same as pairs approach but using a list explicitly — cache-friendly version.
# WHEN: Slight preference when working with list-based structures.

class MinStack_Vector:
    def __init__(self):
        self.data = []  # [value, min_so_far]

    def push(self, val: int) -> None:
        cur_min = min(val, self.data[-1][1] if self.data else val)
        self.data.append([val, cur_min])

    def pop(self) -> None:
        self.data.pop()

    def top(self) -> int:
        return self.data[-1][0]

    def getMin(self) -> int:
        return self.data[-1][1]


# APPROACH 5: Linked List (Node-based) | O(1) time all ops | O(n) space
# EXPLAIN: Each node stores value and the running minimum; head always points to top.
# WHEN: Shows manual memory management; useful in languages without built-in stacks.

class MinStack_LinkedList:
    class _Node:
        def __init__(self, val, min_val, nxt=None):
            self.val = val
            self.min_val = min_val
            self.next = nxt

    def __init__(self):
        self.head = None

    def push(self, val: int) -> None:
        cur_min = min(val, self.head.min_val if self.head else val)
        self.head = self._Node(val, cur_min, self.head)

    def pop(self) -> None:
        self.head = self.head.next

    def top(self) -> int:
        return self.head.val

    def getMin(self) -> int:
        return self.head.min_val


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    for Cls in (MinStack_TwoStacks, MinStack_Pairs, MinStack_Delta,
                MinStack_Vector, MinStack_LinkedList):
        ms = Cls()
        ms.push(-2); ms.push(0); ms.push(-3)
        assert ms.getMin() == -3
        ms.pop()
        assert ms.top() == 0
        assert ms.getMin() == -2
        print(f'{Cls.__name__}: passed')

# Made with Bob
