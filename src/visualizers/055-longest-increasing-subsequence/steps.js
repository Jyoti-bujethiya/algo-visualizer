// 055 — Longest Increasing Subsequence · steps.js
// dp[i] = length of LIS ending at index i
// dp[i] = 1 + max(dp[j]) for all j < i where nums[j] < nums[i]

// DP line indices:
// 0: function lengthOfLIS(nums):
// 1:   dp = array of 1s, size n
// 2:   for i = 1 to n-1:
// 3:     for j = 0 to i-1:
// 4:       if nums[j] < nums[i]:
// 5:         dp[i] = max(dp[i], dp[j] + 1)
// 6:   return max(dp)

// Binary Search (Patience Sorting) line indices:
// 0: function lengthOfLIS(nums):
// 1:   tails = []
// 2:   for each num in nums:
// 3:     lo=0, hi=tails.length
// 4:     while lo < hi: mid=(lo+hi)/2
// 5:       if tails[mid] < num: lo=mid+1 else hi=mid
// 6:     tails[lo] = num
// 7:   return tails.length

function push(steps, desc, dp, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, dp: [...dp], highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(algo, nums) {
  const steps = []
  const n = nums.length
  const highlights = {}

  if (algo === 'dp') {
    const dp = new Array(n).fill(1)

    push(steps,
      `LIS (DP): nums=[${nums.join(', ')}]. dp[i] = length of LIS ending at index i. Initialize all dp[i]=1.`,
      dp, {}, 0
    )

    for (let i = 1; i < n; i++) {
      highlights[String(i)] = 'current'
      push(steps,
        `Outer loop i=${i}: nums[${i}]=${nums[i]}. Look back at all j < ${i}.`,
        dp, { ...highlights }, 2
      )
      for (let j = 0; j < i; j++) {
        highlights[String(j)] = 'compare'
        push(steps,
          `  j=${j}: nums[${j}]=${nums[j]} ${nums[j] < nums[i] ? '<' : '>='} nums[${i}]=${nums[i]}. ${nums[j] < nums[i] ? `dp[${i}] = max(${dp[i]}, dp[${j}]+1=${dp[j]+1}) = ${Math.max(dp[i], dp[j]+1)}.` : 'Skip.'}`,
          dp, { ...highlights }, 4
        )
        if (nums[j] < nums[i]) {
          dp[i] = Math.max(dp[i], dp[j] + 1)
        }
        highlights[String(j)] = 'match'
      }
      highlights[String(i)] = 'match'
      push(steps,
        `dp[${i}] = ${dp[i]}.`,
        dp, { ...highlights }, 5
      )
    }

    const result = Math.max(...dp)
    push(steps,
      `LIS length = max(dp) = ${result}.`,
      dp, { ...highlights }, 6, { result, done: true }
    )
  } else {
    // Binary search / patience sort
    const tails = []
    const dpDisplay = new Array(n).fill(null) // for visual

    push(steps,
      `LIS (Binary Search): maintain a "tails" array where tails[i] = smallest tail of all LIS of length i+1. Binary search to place each num.`,
      dpDisplay, {}, 0
    )

    for (let idx = 0; idx < n; idx++) {
      const num = nums[idx]
      highlights[String(idx)] = 'current'
      push(steps,
        `num=${num}. Binary search in tails=[${tails.join(', ')}] for insertion position.`,
        [...dpDisplay], { ...highlights }, 2
      )

      let lo = 0, hi = tails.length
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        push(steps,
          `  lo=${lo}, hi=${hi}, mid=${mid}, tails[${mid}]=${tails[mid]}. ${tails[mid] < num ? 'lo=mid+1' : 'hi=mid'}.`,
          [...dpDisplay], { ...highlights }, 4
        )
        if (tails[mid] < num) lo = mid + 1
        else hi = mid
      }

      tails[lo] = num
      dpDisplay[idx] = lo + 1 // LIS length at this position
      highlights[String(idx)] = 'match'
      push(steps,
        `Place ${num} at tails[${lo}]. tails=[${tails.join(', ')}]. LIS length so far = ${tails.length}.`,
        [...dpDisplay], { ...highlights }, 6, { tailsLen: tails.length }
      )
    }

    push(steps,
      `LIS length = tails.length = ${tails.length}.`,
      dpDisplay, { ...highlights }, 7, { result: tails.length, done: true }
    )
  }

  return steps
}
