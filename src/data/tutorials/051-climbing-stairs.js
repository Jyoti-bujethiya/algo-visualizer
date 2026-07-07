/**
 * Tutorial content for #051 — Climbing Stairs
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `You are climbing a staircase with n steps. Each time you can either climb 1 step or 2 steps. In how many distinct ways can you reach the top?`,
    example: `n = 4\n→ (1+1+1+1), (1+1+2), (1+2+1), (2+1+1), (2+2)\n✅ Answer: 5`,
    keyInsight: `To reach step n you must have come from step n-1 (took 1 step) or step n-2 (took 2 steps). So ways(n) = ways(n-1) + ways(n-2) — the Fibonacci recurrence.`,
  },

  approaches: {
    'Recursive Memoization (Top-Down DP)': {
      intuition: `Think recursively: to count ways to reach step n, count ways to reach step n-1 and add it to ways to reach step n-2. Without caching, the same sub-problems are solved over and over. Memoisation stores each result the first time it is computed so every step is solved exactly once.`,
      steps: [
        `Create a memo array of size n+1 filled with -1 (unsolved).`,
        `Base cases: ways(0) = 1, ways(1) = 1.`,
        `For any other n: check memo first; if filled, return it.`,
        `Otherwise compute memo[n] = solve(n-1) + solve(n-2).`,
        `Return memo[n].`,
      ],
      example: `n = 4\n\nsolve(4) = solve(3) + solve(2)\nsolve(3) = solve(2) + solve(1)\nsolve(2) = solve(1) + solve(0) = 1 + 1 = 2  ← cached\nsolve(3) = 2 + 1 = 3  ← cached\nsolve(4) = 3 + 2 = 5\n✅ Answer: 5`,
      keyInsight: `O(n) time and O(n) space. The memo array turns an exponential recursion tree into a linear chain of lookups.`,
    },

    'Bottom-Up DP': {
      intuition: `Build the answer from the smallest steps upward. dp[i] stores the number of ways to reach step i. We fill it left-to-right using dp[i] = dp[i-1] + dp[i-2]. No recursion or stack needed.`,
      steps: [
        `Create a dp array of size n+1.`,
        `Set dp[0] = 1 and dp[1] = 1.`,
        `For i from 2 to n: dp[i] = dp[i-1] + dp[i-2].`,
        `Return dp[n].`,
      ],
      example: `n = 4\n\ndp[0] = 1\ndp[1] = 1\ndp[2] = dp[1] + dp[0] = 2\ndp[3] = dp[2] + dp[1] = 3\ndp[4] = dp[3] + dp[2] = 5\n✅ Answer: 5`,
      keyInsight: `O(n) time and O(n) space. Iterative so no risk of stack overflow on large n.`,
    },

    'Space-Optimized DP': {
      intuition: `The bottom-up recurrence only looks back two positions. Instead of storing the whole array, keep just two variables — one for the previous step and one for the step before that — and slide them forward.`,
      steps: [
        `Set prev2 = 1 (ways to reach step 0) and prev1 = 1 (ways to reach step 1).`,
        `For each step i from 2 to n:`,
        `  cur = prev1 + prev2`,
        `  prev2 = prev1`,
        `  prev1 = cur`,
        `Return prev1.`,
      ],
      example: `n = 4\n\nprev2=1, prev1=1\ni=2: cur=1+1=2 → prev2=1, prev1=2\ni=3: cur=2+1=3 → prev2=2, prev1=3\ni=4: cur=3+2=5 → prev2=3, prev1=5\nReturn 5\n✅ Answer: 5`,
      keyInsight: `O(n) time and O(1) space — the interview-optimal solution. Only two variables are ever needed because the recurrence has a window of two.`,
    },

    'Matrix Exponentiation': {
      intuition: `The Fibonacci recurrence can be written as a matrix multiplication: [f(n), f(n-1)] = [[1,1],[1,0]]^n × [1, 0]. We can compute the matrix raised to the power n using fast exponentiation (repeated squaring), halving the number of multiplications.`,
      steps: [
        `Represent the transition as the 2×2 matrix M = [[1,1],[1,0]].`,
        `Use fast matrix exponentiation: M^n via repeated squaring.`,
        `Start with result = identity matrix, base = M.`,
        `While n > 0: if n is odd, result = result × base; base = base × base; n = n / 2.`,
        `Return result[0][1] (which equals fib(n)).`,
      ],
      example: `n = 4\n\nM = [[1,1],[1,0]]\nM^2 = [[2,1],[1,1]]\nM^4 = [[5,3],[3,2]]\nResult[0][1] = 3... but ways(4) = dp[4] = 5\nActually result[0][0] = 5 ✅\n✅ Answer: 5`,
      keyInsight: `O(log n) time and O(1) space. Overkill for this problem but essential when n can be astronomically large.`,
    },

    "Mathematical Formula (Binet's Formula)": {
      intuition: `The climbing-stairs sequence is exactly Fibonacci shifted by one position. Binet's formula gives Fibonacci numbers directly using the golden ratio φ = (1+√5)/2. We can compute ways(n) = round( φ^(n+1) / √5 ) in a single arithmetic expression — no loops needed.`,
      steps: [
        `Compute φ = (1 + √5) / 2 (the golden ratio, ≈ 1.618).`,
        `Compute ψ = (1 - √5) / 2 (the conjugate, ≈ -0.618).`,
        `Result = round( (φ^(n+1) - ψ^(n+1)) / √5 ).`,
        `The ψ term shrinks so fast it only matters for rounding — many implementations just use round(φ^(n+1) / √5).`,
      ],
      example: `n = 4\n\nφ ≈ 1.618\nφ^5 ≈ 11.09\n11.09 / 2.236 ≈ 4.959\nround(4.959) = 5\n✅ Answer: 5`,
      keyInsight: `O(1) time conceptually, but floating-point precision limits correctness to small n (roughly n ≤ 70). Impractical for competitive programming but a great interview talking point.`,
    },
  },
}
