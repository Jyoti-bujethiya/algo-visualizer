// 060 — Unique Paths · steps.js
// dp[i][j] = number of unique paths to cell (i,j)
// dp[0][*] = 1, dp[*][0] = 1
// dp[i][j] = dp[i-1][j] + dp[i][j-1]

// line indices:
// 0: function uniquePaths(m, n):
// 1:   dp = m×n table, all 0
// 2:   for j = 0 to n-1: dp[0][j] = 1  (top row)
// 3:   for i = 0 to m-1: dp[i][0] = 1  (left col)
// 4:   for i = 1 to m-1:
// 5:     for j = 1 to n-1:
// 6:       dp[i][j] = dp[i-1][j] + dp[i][j-1]
// 7:   return dp[m-1][n-1]

function push(steps, desc, dp, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, dp: dp.map(r => [...r]), highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(m, n) {
  const steps = []
  const dp = Array.from({ length: m }, () => new Array(n).fill(0))
  const highlights = {}

  push(steps,
    `Unique Paths: m=${m} rows, n=${n} cols. Robot starts top-left (0,0), destination is bottom-right (${m-1},${n-1}). Can only move right or down.`,
    dp, {}, 0
  )

  // Fill top row
  for (let j = 0; j < n; j++) {
    dp[0][j] = 1
    highlights[`0,${j}`] = 'special'
  }
  push(steps, 'Fill top row with 1s (only one way to reach any cell in top row — go right).', dp, { ...highlights }, 2)

  // Fill left col
  for (let i = 1; i < m; i++) {
    dp[i][0] = 1
    highlights[`${i},0`] = 'special'
  }
  push(steps, 'Fill left column with 1s (only one way to reach any cell in left col — go down).', dp, { ...highlights }, 3)

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      highlights[`${i},${j}`] = 'current'
      highlights[`${i-1},${j}`] = 'compare'
      highlights[`${i},${j-1}`] = 'compare'
      push(steps,
        `dp[${i}][${j}] = dp[${i-1}][${j}] + dp[${i}][${j-1}] = ${dp[i-1][j]} + ${dp[i][j-1]} = ${dp[i-1][j] + dp[i][j-1]}.`,
        dp, { ...highlights }, 6
      )
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
      highlights[`${i-1},${j}`] = 'match'
      highlights[`${i},${j-1}`] = 'match'
      highlights[`${i},${j}`] = 'match'
      push(steps,
        `dp[${i}][${j}] = ${dp[i][j]}.`,
        dp, { ...highlights }, 6
      )
    }
  }

  push(steps,
    `dp[${m-1}][${n-1}] = ${dp[m-1][n-1]}. There are ${dp[m-1][n-1]} unique paths.`,
    dp, { ...highlights }, 7, { result: dp[m - 1][n - 1], done: true }
  )
  return steps
}
