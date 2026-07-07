// 054 — Coin Change · steps.js
// dp[i] = min coins to make amount i
// dp[0] = 0; dp[i] = min(dp[i - coin] + 1) for each coin

// line indices:
// 0: function coinChange(coins, amount):
// 1:   dp = array of size amount+1, filled with Infinity
// 2:   dp[0] = 0
// 3:   for i = 1 to amount:
// 4:     for each coin in coins:
// 5:       if i - coin >= 0 and dp[i - coin] != Infinity:
// 6:         dp[i] = min(dp[i], dp[i - coin] + 1)
// 7:   return dp[amount] == Infinity ? -1 : dp[amount]

const INF = Infinity

function push(steps, desc, dp, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, dp: [...dp], highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(coins, amount) {
  const steps = []
  const dp = new Array(amount + 1).fill(INF)
  const highlights = {}

  push(steps,
    `Coin Change: coins=[${coins.join(', ')}], amount=${amount}. Build dp where dp[i] = fewest coins to make amount i.`,
    dp, {}, 0
  )

  dp[0] = 0
  highlights['0'] = 'special'
  push(steps, 'Base case: dp[0] = 0 (zero coins needed to make amount 0).', dp, { ...highlights }, 2)

  for (let i = 1; i <= amount; i++) {
    highlights[String(i)] = 'current'
    push(steps,
      `Computing dp[${i}]: try each coin [${coins.join(', ')}].`,
      dp, { ...highlights }, 3
    )

    for (const coin of coins) {
      if (i - coin >= 0 && dp[i - coin] !== INF) {
        highlights[String(i - coin)] = 'compare'
        push(steps,
          `  coin=${coin}: dp[${i-coin}]=${dp[i-coin]} + 1 = ${dp[i-coin]+1}. ${dp[i-coin]+1 < dp[i] ? 'New minimum!' : `Not better than current ${dp[i] === INF ? '∞' : dp[i]}.`}`,
          dp, { ...highlights }, 6, { activeCoin: coin }
        )
        if (dp[i - coin] + 1 < dp[i]) {
          dp[i] = dp[i - coin] + 1
        }
        highlights[String(i - coin)] = 'match'
      } else {
        push(steps,
          `  coin=${coin}: i-coin=${i-coin} ${i - coin < 0 ? '< 0 (skip)' : `→ dp[${i-coin}]=∞ (skip)`}.`,
          dp, { ...highlights }, 5, { activeCoin: coin }
        )
      }
    }
    highlights[String(i)] = dp[i] === INF ? 'discard' : 'match'
    push(steps,
      `dp[${i}] = ${dp[i] === INF ? '∞ (unreachable)' : dp[i]}.`,
      dp, { ...highlights }, 6
    )
  }

  const result = dp[amount] === INF ? -1 : dp[amount]
  push(steps,
    `dp[${amount}] = ${dp[amount] === INF ? '∞ → return -1' : dp[amount]}. Minimum coins needed: ${result}.`,
    dp, { ...highlights }, 7, { result, done: true }
  )
  return steps
}
