// 065 — Regular Expression Matching · steps.js
// dp[i][j] = does s[0..i-1] match p[0..j-1]?
// Cases:
//   p[j-1] == s[i-1] or p[j-1]=='.'  → dp[i][j] = dp[i-1][j-1]
//   p[j-1] == '*':
//     zero occurrences: dp[i][j] = dp[i][j-2]
//     one+ occurrences: dp[i][j] = dp[i-1][j] if s[i-1] matches p[j-2]

// line indices:
// 0: function isMatch(s, p):
// 1:   dp = (m+1)×(n+1), all false; dp[0][0] = true
// 2:   for j=1 to n: if p[j-1]=='*': dp[0][j] = dp[0][j-2]
// 3:   for i=1 to m:
// 4:     for j=1 to n:
// 5:       if p[j-1]=='.' or p[j-1]==s[i-1]:  dp[i][j]=dp[i-1][j-1]
// 6:       elif p[j-1]=='*':
// 7:         dp[i][j] = dp[i][j-2]  // zero occurrences
// 8:         if p[j-2]=='.' or p[j-2]==s[i-1]:
// 9:           dp[i][j] = dp[i][j] || dp[i-1][j]
// 10:  return dp[m][n]

function push(steps, desc, dp, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, dp: dp.map(r => [...r]), highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(s, p) {
  const steps = []
  const m = s.length, n = p.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false))
  const highlights = {}

  dp[0][0] = true
  highlights['0,0'] = 'special'

  // Fill dp[0][j] for '*' patterns
  for (let j = 1; j <= n; j++) {
    if (p[j - 1] === '*' && j >= 2) {
      dp[0][j] = dp[0][j - 2]
      highlights[`0,${j}`] = dp[0][j] ? 'special' : 'discard'
    }
  }

  push(steps,
    `Regex Matching: s="${s}", p="${p}". dp[i][j] = does s[0..i-1] match p[0..j-1]? Base: dp[0][0]=true, fill row-0 for '*' patterns.`,
    dp, { ...highlights }, 0
  )

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      highlights[`${i},${j}`] = 'current'
      const sc = s[i - 1], pc = p[j - 1]

      if (pc === '.' || pc === sc) {
        highlights[`${i-1},${j-1}`] = 'compare'
        dp[i][j] = dp[i - 1][j - 1]
        push(steps,
          `i=${i}('${sc}'), j=${j}('${pc}'): char match or '.'. dp[${i}][${j}]=dp[${i-1}][${j-1}]=${dp[i][j]}.`,
          dp, { ...highlights }, 5
        )
        highlights[`${i-1},${j-1}`] = 'match'
      } else if (pc === '*') {
        highlights[`${i},${j-2}`] = 'compare'
        dp[i][j] = j >= 2 ? dp[i][j - 2] : false // zero occurrences
        push(steps,
          `i=${i}('${sc}'), j=${j}('*'): zero-occurrences → dp[${i}][${j}]=dp[${i}][${j-2}]=${dp[i][j]}.`,
          dp, { ...highlights }, 7
        )
        const prev = j >= 2 ? p[j - 2] : ''
        if (prev === '.' || prev === sc) {
          highlights[`${i-1},${j}`] = 'compare'
          dp[i][j] = dp[i][j] || dp[i - 1][j]
          push(steps,
            `  '${prev}' matches s[${i-1}]='${sc}' → also try one+ occurrences: dp[${i}][${j}] |= dp[${i-1}][${j}]=${dp[i-1][j]}. Result: ${dp[i][j]}.`,
            dp, { ...highlights }, 9
          )
          highlights[`${i-1},${j}`] = 'match'
        }
        highlights[`${i},${j-2}`] = 'match'
      } else {
        push(steps,
          `i=${i}('${sc}'), j=${j}('${pc}'): no match. dp[${i}][${j}]=false.`,
          dp, { ...highlights }, 5
        )
      }
      highlights[`${i},${j}`] = dp[i][j] ? 'match' : 'discard'
    }
  }

  push(steps,
    `dp[${m}][${n}] = ${dp[m][n]}. "${s}" ${dp[m][n] ? 'MATCHES' : 'does NOT match'} pattern "${p}".`,
    dp, { ...highlights }, 10, { result: dp[m][n], done: true }
  )
  return steps
}
