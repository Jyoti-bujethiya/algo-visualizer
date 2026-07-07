// 056 — Longest Common Subsequence · steps.js
// dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]
// if text1[i-1] == text2[j-1]: dp[i][j] = dp[i-1][j-1] + 1
// else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])

// line indices:
// 0: function lcs(text1, text2):
// 1:   dp = (m+1) x (n+1) table, all 0
// 2:   for i = 1 to m:
// 3:     for j = 1 to n:
// 4:       if text1[i-1] == text2[j-1]:
// 5:         dp[i][j] = dp[i-1][j-1] + 1
// 6:       else:
// 7:         dp[i][j] = max(dp[i-1][j], dp[i][j-1])
// 8:   return dp[m][n]

function push(steps, desc, dp, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, dp: dp.map(r => [...r]), highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(text1, text2) {
  const steps = []
  const m = text1.length, n = text2.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  const highlights = {}

  push(steps,
    `LCS: text1="${text1}" (m=${m}), text2="${text2}" (n=${n}). Build (m+1)×(n+1) table. dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1].`,
    dp, {}, 0
  )

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      highlights[`${i},${j}`] = 'current'
      const match = text1[i - 1] === text2[j - 1]
      push(steps,
        `i=${i} (text1[${i-1}]='${text1[i-1]}'), j=${j} (text2[${j-1}]='${text2[j-1]}'): ${match ? 'MATCH!' : 'no match.'}`,
        dp, { ...highlights }, match ? 4 : 6
      )
      if (match) {
        highlights[`${i-1},${j-1}`] = 'compare'
        dp[i][j] = dp[i - 1][j - 1] + 1
        push(steps,
          `Match! dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i][j]}.`,
          dp, { ...highlights }, 5
        )
        highlights[`${i-1},${j-1}`] = 'match'
      } else {
        highlights[`${i-1},${j}`] = 'compare'
        highlights[`${i},${j-1}`] = 'compare'
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
        push(steps,
          `No match. dp[${i}][${j}] = max(dp[${i-1}][${j}]=${dp[i-1][j]}, dp[${i}][${j-1}]=${dp[i][j-1]}) = ${dp[i][j]}.`,
          dp, { ...highlights }, 7
        )
        highlights[`${i-1},${j}`] = 'match'
        highlights[`${i},${j-1}`] = 'match'
      }
      highlights[`${i},${j}`] = 'match'
    }
  }

  push(steps,
    `LCS length = dp[${m}][${n}] = ${dp[m][n]}.`,
    dp, { ...highlights }, 8, { result: dp[m][n], done: true }
  )
  return steps
}
