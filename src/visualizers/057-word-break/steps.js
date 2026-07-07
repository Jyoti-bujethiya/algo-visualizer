// 057 — Word Break · steps.js
// dp[i] = true if s[0..i-1] can be segmented using words in wordDict
// dp[0] = true (empty string)
// dp[i] = OR over j<i: dp[j] && s[j..i-1] in dict

// line indices:
// 0: function wordBreak(s, wordDict):
// 1:   dp = boolean array size n+1, all false
// 2:   dp[0] = true  (empty string)
// 3:   for i = 1 to n:
// 4:     for j = 0 to i-1:
// 5:       if dp[j] == true:
// 6:         word = s[j..i-1]
// 7:         if word in wordDict: dp[i] = true; break
// 8:   return dp[n]

function push(steps, desc, dp, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, dp: [...dp], highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(s, wordDict) {
  const steps = []
  const n = s.length
  const wordSet = new Set(wordDict)
  const dp = new Array(n + 1).fill(false)
  const highlights = {}

  push(steps,
    `Word Break: s="${s}", dict=[${wordDict.map(w => `"${w}"`).join(', ')}]. dp[i]=true if s[0..i-1] can be segmented.`,
    dp, {}, 0
  )

  dp[0] = true
  highlights['0'] = 'special'
  push(steps, 'Base case: dp[0] = true (empty prefix always valid).', dp, { ...highlights }, 2)

  for (let i = 1; i <= n; i++) {
    highlights[String(i)] = 'current'
    push(steps,
      `i=${i}: checking prefix s[0..${i-1}]="${s.slice(0, i)}".`,
      dp, { ...highlights }, 3
    )
    for (let j = 0; j < i; j++) {
      if (dp[j]) {
        const word = s.slice(j, i)
        highlights[String(j)] = 'compare'
        const inDict = wordSet.has(word)
        push(steps,
          `  j=${j}: dp[${j}]=true. word="${word}" — ${inDict ? 'IN dict! dp['+i+']=true.' : 'NOT in dict.'}`,
          dp, { ...highlights }, inDict ? 7 : 6
        )
        if (inDict) {
          dp[i] = true
          highlights[String(j)] = 'match'
          break
        }
        highlights[String(j)] = 'discard'
      }
    }
    highlights[String(i)] = dp[i] ? 'match' : 'discard'
    push(steps,
      `dp[${i}] = ${dp[i]}.`,
      dp, { ...highlights }, 7
    )
  }

  push(steps,
    `dp[${n}] = ${dp[n]}. Word break is ${dp[n] ? 'possible' : 'NOT possible'}.`,
    dp, { ...highlights }, 8, { result: dp[n], done: true }
  )
  return steps
}
