// 014 – Longest Palindromic Substring — pure step generator

// CODE.expand = ['for i in 0..n-1:','  expand odd center','  expand even center','  update best']
// CODE.dp     = ['dp[i][i]=true','check len-2','for len=3..n: dp[i][j]=...','track best']
// CODE.manacher = ['transform s','for i in 1..n-1:','  mirror or 0','  expand while match','  update C,R']
const EXPAND_LINE   = { loop: 0, odd: 1, even: 2, update: 3, ret: 3 }
const DP_LINE       = { init: 0, len2: 1, check: 2, update: 3, ret: 3 }
const MANACHER_LINE = { transform: 0, loop: 1, mirror: 2, expand: 3, update: 4, ret: 4 }

const push = (steps, desc, codeKey, centerL, centerR, expandL, expandR, bestL, bestR, extra = {}) =>
  steps.push({
    description: desc, codeKey, centerL, centerR, expandL, expandR, bestL, bestR, ...extra,
    codeLineIndex: extra.codeLineIndex ??
      EXPAND_LINE[codeKey] ?? DP_LINE[codeKey] ?? MANACHER_LINE[codeKey] ?? -1
  })

function genExpand(str) {
  const steps = []
  const s = str, n = s.length
  let bestL = 0, bestR = 0

  push(steps, `Try every possible center — both odd-length (single character center) and even-length (two-character center). Expand outward as long as the characters match.`, 'loop', -1, -1, -1, -1, 0, 0)

  for (let i = 0; i < n; i++) {
    push(steps, `Trying a single character center at position ${i} (${s[i]}). Expand left and right while both sides match.`, 'odd', i, i, i, i, bestL, bestR)
    let l = i, r = i
    while (l > 0 && r < n - 1 && s[l-1] === s[r+1]) { l--; r++ }
    push(steps, `Odd expansion settled: "${s.slice(l, r+1)}" from position ${l} to ${r}.`, 'odd', i, i, l, r, bestL, bestR)
    if (r - l > bestR - bestL) { bestL = l; bestR = r }

    if (i < n - 1) {
      push(steps, `Trying a two-character center between positions ${i} and ${i+1} ("${s[i]}${s[i+1]}").`, 'even', i, i+1, i, i+1, bestL, bestR)
      if (s[i] === s[i+1]) {
        l = i; r = i + 1
        while (l > 0 && r < n - 1 && s[l-1] === s[r+1]) { l--; r++ }
        push(steps, `Even expansion settled: "${s.slice(l, r+1)}" from position ${l} to ${r}.`, 'even', i, i+1, l, r, bestL, bestR)
        if (r - l > bestR - bestL) { bestL = l; bestR = r }
      } else {
        push(steps, `"${s[i]}" and "${s[i+1]}" don't match — no even-length palindrome starts here.`, 'even', i, i+1, i, i, bestL, bestR)
      }
    }

    const last = steps[steps.length - 1]
    if (last.bestL !== bestL || last.bestR !== bestR) {
      push(steps, `New longest palindrome found: "${s.slice(bestL, bestR+1)}" (length ${bestR - bestL + 1}).`, 'update', i, i, bestL, bestR, bestL, bestR)
    }
  }

  push(steps, `All centers tried. Longest palindromic substring: "${s.slice(bestL, bestR+1)}".`,
    'ret', -1, -1, bestL, bestR, bestL, bestR, { complete: true })
  return steps
}

function genDP(str) {
  const steps = []
  const s = str, n = s.length
  const dp = Array.from({ length: n }, () => new Array(n).fill(false))
  let bestL = 0, bestR = 0

  push(steps, 'Every single character is a palindrome by itself. Mark the diagonal of the DP table as true.', 'init', -1, -1, 0, 0, 0, 0)
  for (let i = 0; i < n; i++) dp[i][i] = true

  push(steps, 'Now check all pairs of adjacent characters — a two-character palindrome needs both to be the same.', 'len2', -1, -1, 0, 0, bestL, bestR)
  for (let i = 0; i < n - 1; i++) {
    if (s[i] === s[i+1]) {
      dp[i][i+1] = true
      push(steps, `"${s[i]}" and "${s[i+1]}" are the same — the two-character string "${s.slice(i, i+2)}" is a palindrome.`,
        'len2', i, i+1, i, i+1, bestL, bestR)
      if (1 > bestR - bestL) { bestL = i; bestR = i + 1 }
    }
  }

  for (let len = 3; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1
      const inner = dp[i+1]?.[j-1] ?? false
      const match = s[i] === s[j]
      dp[i][j] = match && inner
      if (dp[i][j]) {
        push(steps, `"${s[i]}" equals "${s[j]}" and the inner substring "${s.slice(i+1, j)}" is already confirmed as a palindrome — so "${s.slice(i, j+1)}" is a palindrome too.`,
          'check', i, j, i, j, bestL, bestR)
        if (j - i > bestR - bestL) {
          bestL = i; bestR = j
          push(steps, `New longest palindrome: "${s.slice(bestL, bestR+1)}" (length ${bestR - bestL + 1}).`, 'update', i, j, bestL, bestR, bestL, bestR)
        }
      } else {
        push(steps, `"${s[i]}" ${match ? 'matches' : 'does not match'} "${s[j]}"${match ? ' but the inner part is not a palindrome' : ''} — "${s.slice(i, j+1)}" is not a palindrome.`,
          'check', i, j, i, j, bestL, bestR)
      }
    }
  }

  push(steps, `DP table complete. Longest palindromic substring: "${s.slice(bestL, bestR+1)}".`,
    'ret', -1, -1, bestL, bestR, bestL, bestR, { complete: true })
  return steps
}

function genManacher(str) {
  const steps = []
  const s = str
  let t = '^#'
  for (const c of s) t += c + '#'
  t += '$'
  const n = t.length
  const p = new Array(n).fill(0)
  let C = 0, R = 0, bestL = 0, bestR = 0

  push(steps, `Transform the string by inserting "#" between every character. This lets us treat odd and even palindromes the same way. "${s}" becomes "${t}".`, 'transform', -1, -1, 0, 0, 0, 0, { transformed: t })

  for (let i = 1; i < n - 1; i++) {
    const mirror = 2 * C - i
    if (i < R) {
      p[i] = Math.min(R - i, p[mirror] || 0)
      push(steps, `Position ${i} ("${t[i]}") is inside the current known palindrome boundary. Reuse the mirror result (${p[mirror] || 0}) to skip redundant comparisons.`,
        'mirror', -1, -1, -1, -1, bestL, bestR, { transformed: t, pArr: [...p], C, R, ti: i })
    }
    while (t[i + p[i] + 1] === t[i - p[i] - 1]) p[i]++
    push(steps, `Expanded around position ${i} ("${t[i]}"): palindrome radius is now ${p[i]}.`,
      'expand', -1, -1, -1, -1, bestL, bestR, { transformed: t, pArr: [...p], C, R, ti: i })
    if (i + p[i] > R) { C = i; R = i + p[i] }
    if (p[i] > 0) {
      const origStart = (i - p[i] - 1) / 2
      const origEnd   = origStart + p[i] - 1
      if (origEnd - origStart > bestR - bestL) { bestL = origStart; bestR = origEnd }
    }
    push(steps, `Updated the rightmost boundary. Current best palindrome in the original string: "${s.slice(bestL, bestR+1)}".`,
      'update', -1, -1, bestL, bestR, bestL, bestR, { transformed: t, pArr: [...p], C, R, ti: i })
  }

  push(steps, `All positions processed. Longest palindromic substring: "${s.slice(bestL, bestR+1)}".`,
    'ret', -1, -1, bestL, bestR, bestL, bestR, { complete: true, transformed: t })
  return steps
}

export function generateSteps(algo, str) {
  if (algo === 'dp')       return genDP(str)
  if (algo === 'manacher') return genManacher(str)
  return genExpand(str)
}
