// 073 — Letter Combinations of a Phone Number · steps.js
// Map digits 2-9 to phone letters; backtrack over all combos

// line indices:
// 0: function letterCombinations(digits):
// 1:   if digits empty: return []
// 2:   map = {2:'abc', 3:'def', ...}
// 3:   result=[]; current=[]
// 4:   function backtrack(index):
// 5:     if index==digits.length: result.push(current.join(''))
// 6:     for each letter in map[digits[index]]:
// 7:       current.push(letter)
// 8:       backtrack(index+1)
// 9:       current.pop()
// 10:  backtrack(0)

const MAP = { '2':'abc','3':'def','4':'ghi','5':'jkl','6':'mno','7':'pqrs','8':'tuv','9':'wxyz' }

function push(steps, desc, current, result, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, current: [...current], result: [...result], highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(digits) {
  const steps = []
  if (!digits || digits.length === 0) {
    steps.push({ description: 'Empty digits — return [].', current: [], result: [], highlights: {}, codeLineIndex: 1, done: true })
    return steps
  }
  const current = [], result = [], highlights = {}
  push(steps, `Letter Combinations: digits="${digits}". Map: ${digits.split('').map(d => `${d}→[${MAP[d]}]`).join(', ')}.`, current, result, {}, 0)

  function backtrack(index) {
    if (index === digits.length) {
      result.push(current.join(''))
      push(steps, `Combination found: "${current.join('')}". Total: ${result.length}.`, current, [...result], { ...highlights }, 5)
      return
    }
    const letters = MAP[digits[index]] || ''
    for (const letter of letters) {
      const li = letters.indexOf(letter)
      highlights[`${index},${li}`] = 'current'
      current.push(letter)
      push(steps, `digit[${index}]='${digits[index]}' → try '${letter}'. Building: "${current.join('')}".`, current, [...result], { ...highlights }, 7)
      highlights[`${index},${li}`] = 'compare'
      backtrack(index + 1)
      current.pop()
      highlights[`${index},${li}`] = 'match'
      push(steps, `Backtrack: remove '${letter}'. Building: "${current.join('')}".`, current, [...result], { ...highlights }, 9)
    }
  }

  backtrack(0)
  push(steps, `All ${result.length} combinations: [${result.map(r=>`"${r}"`).join(', ')}].`, current, result, { ...highlights }, 10, { done: true })
  return steps
}
