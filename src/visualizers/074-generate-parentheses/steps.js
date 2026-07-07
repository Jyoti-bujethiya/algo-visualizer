// 074 — Generate Parentheses · steps.js
// Backtrack tracking open/close counts; add '(' if open<n, ')' if close<open

// line indices:
// 0: function generateParentheses(n):
// 1:   result=[]; current=""
// 2:   function backtrack(open, close):
// 3:     if current.length == 2*n: result.push(current)
// 4:     if open < n:
// 5:       backtrack(open+1, close) with current+'('
// 6:     if close < open:
// 7:       backtrack(open, close+1) with current+')'
// 8:   backtrack(0, 0)

function push(steps, desc, current, result, open, close, codeLineIndex, extra = {}) {
  steps.push({ description: desc, current, result: [...result], open, close, codeLineIndex, ...extra })
}

export function generateSteps(n) {
  const steps = []
  const result = []
  push(steps, `Generate Parentheses: n=${n}. Backtrack adding '(' when open<${n} and ')' when close<open.`, '', result, 0, 0, 0)

  function backtrack(current, open, close) {
    if (current.length === 2 * n) {
      result.push(current)
      push(steps, `Valid combo: "${current}". Total: ${result.length}.`, current, [...result], open, close, 3)
      return
    }
    if (open < n) {
      push(steps, `open=${open}<${n}: add '('. Building: "${current+'('}"`, current + '(', [...result], open + 1, close, 5)
      backtrack(current + '(', open + 1, close)
    }
    if (close < open) {
      push(steps, `close=${close}<open=${open}: add ')'. Building: "${current+')'}"`, current + ')', [...result], open, close + 1, 7)
      backtrack(current + ')', open, close + 1)
    }
    push(steps, `Backtrack from "${current}" (open=${open}, close=${close}).`, current, [...result], open, close, 8)
  }

  backtrack('', 0, 0)
  push(steps, `All ${result.length} combinations: [${result.map(r=>`"${r}"`).join(', ')}].`, '', result, n, n, 8, { done: true })
  return steps
}
