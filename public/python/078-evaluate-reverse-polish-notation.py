# LeetCode Problem #150: Evaluate Reverse Polish Notation
# Difficulty: Medium
# Link: https://leetcode.com/problems/evaluate-reverse-polish-notation/

from typing import List

# ─────────────────────────────────────────────
# APPROACH 1: Stack-Based Evaluation | O(n) time | O(n) space
# EXPLAIN: Push numbers onto a stack; on encountering an operator, pop two operands and push result.
# WHEN: Classic stack application — standard interview answer.

def evalRPN_stack(tokens: List[str]) -> int:
    stack = []
    ops = {'+', '-', '*', '/'}

    for token in tokens:
        if token not in ops:
            stack.append(int(token))
        else:
            b, a = stack.pop(), stack.pop()
            if token == '+':
                stack.append(a + b)
            elif token == '-':
                stack.append(a - b)
            elif token == '*':
                stack.append(a * b)
            else:
                stack.append(int(a / b))  # truncate towards zero

    return stack[0]


# APPROACH 2: Stack with Lambda Map | O(n) time | O(n) space
# EXPLAIN: Use a dict of operator → lambda to simplify the conditional evaluation.
# WHEN: More concise; good when you want to demonstrate Python's first-class functions.

def evalRPN_lambda(tokens: List[str]) -> int:
    import operator
    ops = {
        '+': operator.add,
        '-': operator.sub,
        '*': operator.mul,
        '/': lambda a, b: int(a / b),
    }
    stack = []
    for token in tokens:
        if token in ops:
            b, a = stack.pop(), stack.pop()
            stack.append(ops[token](a, b))
        else:
            stack.append(int(token))
    return stack[0]


# APPROACH 3: Recursive Postfix Evaluation | O(n) time | O(n) space
# EXPLAIN: Walk tokens in reverse; recursively consume sub-expressions.
# WHEN: Demonstrates the recursive nature of expression trees; less practical but illuminating.

def evalRPN_recursive(tokens: List[str]) -> int:
    ops = {'+', '-', '*', '/'}
    idx = [len(tokens) - 1]  # mutable index

    def evaluate():
        token = tokens[idx[0]]
        idx[0] -= 1
        if token not in ops:
            return int(token)
        b = evaluate()
        a = evaluate()
        if token == '+': return a + b
        if token == '-': return a - b
        if token == '*': return a * b
        return int(a / b)

    return evaluate()


def evalRPN(tokens: List[str]) -> int:
    return evalRPN_stack(tokens)


# ── quick tests ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    cases = [
        (["2", "1", "+", "3", "*"], 9),
        (["4", "13", "5", "/", "+"], 6),
        (["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"], 22),
    ]
    for fn in (evalRPN_stack, evalRPN_lambda, evalRPN_recursive, evalRPN):
        for tokens, expected in cases:
            assert fn(list(tokens)) == expected, f'{fn.__name__} mismatch'
    print('All tests passed.')

# Made with Bob
