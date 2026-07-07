// 059 — Decode Ways · steps.js
// dp[i] = number of ways to decode s[0..i-1]
// dp[0] = 1 (empty), dp[1] = s[0]!='0' ? 1 : 0
// dp[i] += dp[i-1] if s[i-1]!='0'  (single digit)
// dp[i] += dp[i-2] if s[i-2..i-1] in 10..26  (two digits)

// line indices:
// 0: function numDecodings(s):
// 1:   dp = array size n+1, all 0
// 2:   dp[0] = 1
// 3:   dp[1] = s[0] != '0' ? 1 : 0
// 4:   for i = 2 to n:
// 5:     oneDigit  = s[i-1]
// 6:     twoDigits = s[i-2..i-1]
// 7:     if oneDigit != '0': dp[i] += dp[i-1]
// 8:     if 10 <= twoDigits <= 26: dp[i] += dp[i-2]
// 9:   return dp[n]

function push(steps, desc, dp, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, dp: [...dp], highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(s) {
  const steps = []
  const n = s.length
  const dp = new Array(n + 1).fill(0)
  const highlights = {}

  push(steps,
    `Decode Ways: s="${s}". dp[i] = number of ways to decode s[0..i-1]. '0' cannot stand alone.`,
    dp, {}, 0
  )

  dp[0] = 1
  highlights['0'] = 'special'
  push(steps, 'dp[0] = 1 (empty string — one way).', dp, { ...highlights }, 2)

  dp[1] = s[0] !== '0' ? 1 : 0
  highlights['1'] = s[0] !== '0' ? 'special' : 'discard'
  push(steps,
    `dp[1]: s[0]='${s[0]}' ${s[0] !== '0' ? '≠ 0 → dp[1]=1' : '= 0 → dp[1]=0 (invalid)'}.`,
    dp, { ...highlights }, 3
  )

  for (let i = 2; i <= n; i++) {
    highlights[String(i)] = 'current'
    const oneDigit  = s[i - 1]
    const twoDigits = parseInt(s.slice(i - 2, i))

    push(steps,
      `i=${i}: oneDigit='${oneDigit}', twoDigits=${twoDigits}.`,
      dp, { ...highlights }, 4
    )

    if (oneDigit !== '0') {
      highlights[String(i - 1)] = 'compare'
      dp[i] += dp[i - 1]
      push(steps,
        `  oneDigit '${oneDigit}' ≠ 0 → dp[${i}] += dp[${i-1}]=${dp[i-1]}. dp[${i}]=${dp[i]}.`,
        dp, { ...highlights }, 7
      )
      highlights[String(i - 1)] = 'match'
    } else {
      push(steps, `  oneDigit '${oneDigit}' = 0 — single decode invalid.`, dp, { ...highlights }, 7)
    }

    if (twoDigits >= 10 && twoDigits <= 26) {
      highlights[String(i - 2)] = 'compare'
      dp[i] += dp[i - 2]
      push(steps,
        `  twoDigits=${twoDigits} in [10,26] → dp[${i}] += dp[${i-2}]=${dp[i-2]}. dp[${i}]=${dp[i]}.`,
        dp, { ...highlights }, 8
      )
      highlights[String(i - 2)] = 'match'
    } else {
      push(steps,
        `  twoDigits=${twoDigits} not in [10,26] — two-digit decode invalid.`,
        dp, { ...highlights }, 8
      )
    }

    highlights[String(i)] = dp[i] > 0 ? 'match' : 'discard'
    push(steps, `dp[${i}] = ${dp[i]}.`, dp, { ...highlights }, 8)
  }

  push(steps,
    `dp[${n}] = ${dp[n]}. Total ways to decode "${s}" = ${dp[n]}.`,
    dp, { ...highlights }, 9, { result: dp[n], done: true }
  )
  return steps
}
