// 015 – String to Integer (atoi) — pure step generator

const INT_MAX =  2147483647
const INT_MIN = -2147483648

// CODE.sim line→ trim:0/1, sign:3, digits:5, clamp:7, ret:8 (start:0)
// CODE.dfa line→ start:0, space:1, sign:2, digit:3, number:4, end:5, clamp:6, ret:6
const SIM_LINE = { trim: 1, sign: 3, digits: 5, clamp: 7, ret: 8 }
const DFA_LINE = { start: 0, space: 1, sign: 2, digit: 3, number: 4, end: 5, clamp: 6, ret: 6 }

const push = (steps, desc, codeKey, charIdx, phase, sign, result, clamped = false, state = '') =>
  steps.push({ description: desc, codeKey, charIdx, phase, sign, result, clamped, state,
    codeLineIndex: (SIM_LINE[codeKey] ?? DFA_LINE[codeKey] ?? -1) })

function genSim(str) {
  const steps = []
  const s = str, n = s.length
  let i = 0, sign = 1, result = 0

  push(steps, `Processing "${s}". Step 1: skip any leading whitespace. Step 2: read an optional sign. Step 3: read digits. Step 4: clamp to 32-bit integer range.`, 'trim', -1, 'start', 1, 0)

  while (i < n && s[i] === ' ') {
    push(steps, `Position ${i} is a space — skip it.`, 'trim', i, 'trim', sign, result)
    i++
  }
  push(steps, `Done skipping whitespace. Now at position ${i} ("${s[i] ?? 'end of string'}").`, 'trim', i, 'trim', sign, result)

  if (i < n && (s[i] === '+' || s[i] === '-')) {
    sign = s[i] === '-' ? -1 : 1
    push(steps, `Found a "${s[i]}" sign character. The result will be ${sign > 0 ? 'positive' : 'negative'}.`, 'sign', i, 'sign', sign, result)
    i++
  } else if (i < n) {
    push(steps, `No sign character — treating the result as positive.`, 'sign', i, 'sign', sign, result)
  }

  push(steps, `Now reading digits one by one, building up the number.`, 'digits', i, 'digits', sign, result)
  let clamped = false
  while (i < n && s[i] >= '0' && s[i] <= '9') {
    const d = s[i].charCodeAt(0) - 48
    result = result * 10 + d
    if (result * sign > INT_MAX) {
      push(steps, `The number would exceed the maximum 32-bit integer (${INT_MAX}). Clamping to ${INT_MAX}.`, 'clamp', i, 'clamp', sign, INT_MAX, true)
      clamped = true; break
    }
    if (result * sign < INT_MIN) {
      push(steps, `The number would go below the minimum 32-bit integer (${INT_MIN}). Clamping to ${INT_MIN}.`, 'clamp', i, 'clamp', sign, INT_MIN, true)
      clamped = true; break
    }
    push(steps, `Digit "${d}" at position ${i}: running total is now ${result}.`, 'digits', i, 'digits', sign, result)
    i++
  }
  if (!clamped) {
    if (i < n && !(s[i] >= '0' && s[i] <= '9'))
      push(steps, `"${s[i]}" is not a digit — stop reading here.`, 'digits', i, 'stop', sign, result)
    const final = sign * result
    push(steps, `Applying the sign: ${sign > 0 ? '+' : '-'}${result} = ${final}. That's the answer.`, 'ret', -1, 'done', sign, final)
  }
  return steps
}

function genDFA(str) {
  const steps = []
  const s = str
  let state = 'START', sign = 1, result = 0, clamped = false

  push(steps, `Model the parsing as a state machine with four states: START → SIGN → NUMBER → END. Each character drives a transition.`, 'start', -1, state, sign, result)

  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (state === 'END') break
    if (state === 'START') {
      if (c === ' ') { push(steps, `In START state: "${c}" is a space — stay in START and keep skipping.`, 'space', i, state, sign, result) }
      else if (c === '+' || c === '-') {
        sign = c === '-' ? -1 : 1; state = 'SIGN'
        push(steps, `In START state: "${c}" is a sign — move to SIGN state. Result will be ${sign > 0 ? 'positive' : 'negative'}.`, 'sign', i, state, sign, result)
      } else if (c >= '0' && c <= '9') {
        result = c.charCodeAt(0) - 48; state = 'NUMBER'
        push(steps, `In START state: "${c}" is a digit — move directly to NUMBER state. Running total: ${result}.`, 'digit', i, state, sign, result)
      } else {
        state = 'END'
        push(steps, `In START state: "${c}" is not a space, sign, or digit — move to END. Return 0.`, 'end', i, state, sign, 0); break
      }
    } else if (state === 'SIGN') {
      if (c >= '0' && c <= '9') {
        result = c.charCodeAt(0) - 48; state = 'NUMBER'
        push(steps, `In SIGN state: "${c}" is a digit — move to NUMBER state. Running total: ${result}.`, 'digit', i, state, sign, result)
      } else { state = 'END'; push(steps, `In SIGN state: "${c}" is not a digit — move to END.`, 'end', i, state, sign, result); break }
    } else if (state === 'NUMBER') {
      if (c >= '0' && c <= '9') {
        const d = c.charCodeAt(0) - 48
        result = result * 10 + d
        if (result * sign > INT_MAX) { push(steps, `Number exceeds the maximum 32-bit integer — clamp to ${INT_MAX}.`, 'clamp', i, 'CLAMP', sign, INT_MAX, true); clamped = true; break }
        if (result * sign < INT_MIN) { push(steps, `Number goes below the minimum 32-bit integer — clamp to ${INT_MIN}.`, 'clamp', i, 'CLAMP', sign, INT_MIN, true); clamped = true; break }
        push(steps, `In NUMBER state: appended digit "${c}". Running total is now ${result}.`, 'number', i, state, sign, result)
      } else { state = 'END'; push(steps, `In NUMBER state: "${c}" is not a digit — move to END.`, 'end', i, state, sign, result); break }
    }
  }
  if (!clamped) {
    const final = sign * result
    push(steps, `Parsing complete. Applying the sign: ${final}. That's the final answer.`, 'ret', -1, 'done', sign, final)
  }
  return steps
}

export function generateSteps(algo, str) {
  if (algo === 'dfa') return genDFA(str)
  return genSim(str)
}
