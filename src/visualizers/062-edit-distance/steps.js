// 062 — Edit Distance · steps.js
// dp[i][j] = min edits to convert word1[0..i-1] to word2[0..j-1]
// if chars match: dp[i][j] = dp[i-1][j-1]
// else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
//                         (delete)      (insert)     (replace)

// line indices:
// 0: function minDistance(word1, word2):
// 1:   dp = (m+1)×(n+1); dp[i][0]=i, dp[0][j]=j
// 2:   for i = 1 to m:
// 3:     for j = 1 to n:
// 4:       if word1[i-1] == word2[j-1]:
// 5:         dp[i][j] = dp[i-1][j-1]
// 6:       else:
// 7:         dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
// 8:   return dp[m][n]

function push(steps, desc, dp, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, dp: dp.map(r => [...r]), highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(word1, word2) {
  const steps = []
  const m = word1.length, n = word2.length
  const dp = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)))
  const highlights = {}

  // Mark base cases
  for (let i = 0; i <= m; i++) highlights[`${i},0`] = 'special'
  for (let j = 0; j <= n; j++) highlights[`0,${j}`] = 'special'

  push(steps,
    `Edit Distance: word1="${word1}", word2="${word2}". dp[i][j] = min ops to convert word1[0..i-1] → word2[0..j-1]. Base: dp[i][0]=i (delete i chars), dp[0][j]=j (insert j chars).`,
    dp, { ...highlights }, 0
  )

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      highlights[`${i},${j}`] = 'current'
      const match = word1[i - 1] === word2[j - 1]
      push(steps,
        `i=${i}('${word1[i-1]}'), j=${j}('${word2[j-1]}'): ${match ? 'chars MATCH.' : 'no match — try delete/insert/replace.'}`,
        dp, { ...highlights }, match ? 4 : 6
      )

      if (match) {
        highlights[`${i-1},${j-1}`] = 'compare'
        dp[i][j] = dp[i - 1][j - 1]
        push(steps,
          `Match → dp[${i}][${j}] = dp[${i-1}][${j-1}] = ${dp[i][j]}.`,
          dp, { ...highlights }, 5
        )
        highlights[`${i-1},${j-1}`] = 'match'
      } else {
        const del = dp[i - 1][j], ins = dp[i][j - 1], rep = dp[i - 1][j - 1]
        highlights[`${i-1},${j}`] = 'compare'
        highlights[`${i},${j-1}`] = 'compare'
        highlights[`${i-1},${j-1}`] = 'compare'
        dp[i][j] = 1 + Math.min(del, ins, rep)
        push(steps,
          `dp[${i}][${j}] = 1 + min(del=${del}, ins=${ins}, rep=${rep}) = ${dp[i][j]}.`,
          dp, { ...highlights }, 7
        )
        highlights[`${i-1},${j}`] = 'match'
        highlights[`${i},${j-1}`] = 'match'
        highlights[`${i-1},${j-1}`] = 'match'
      }
      highlights[`${i},${j}`] = 'match'
    }
  }

  push(steps,
    `Edit distance = dp[${m}][${n}] = ${dp[m][n]}.`,
    dp, { ...highlights }, 8, { result: dp[m][n], done: true }
  )
  return steps
}
