// 095 — Median of Two Sorted Arrays · steps.js

// Approach 1 — Merge & Find (simple, O((m+n) log(m+n)))
// Approach 2 — Binary Partition (optimal, O(log(min(m,n))))

// Merge line indices:
// 0: function findMedianSortedArrays(nums1, nums2):
// 1:   merged = merge(nums1, nums2)
// 2:   n = merged.length
// 3:   if n is odd: return merged[n/2]
// 4:   else: return (merged[n/2-1] + merged[n/2]) / 2

// Partition line indices:
// 0: function findMedianSortedArrays(nums1, nums2):
// 1:   ensure m <= n; partition on shorter array
// 2:   lo=0, hi=m
// 3:   while lo <= hi:
// 4:     px = (lo+hi)/2;  py = (m+n+1)/2 - px
// 5:     maxLeftX = nums1[px-1] or -Inf
// 6:     minRightX = nums1[px] or +Inf
// 7:     maxLeftY = nums2[py-1] or -Inf
// 8:     minRightY = nums2[py] or +Inf
// 9:     if maxLeftX <= minRightY && maxLeftY <= minRightX: correct partition!
// 10:    else if maxLeftX > minRightY: hi = px-1
// 11:    else: lo = px+1
// 12:   compute median from partition

function push(steps, desc, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(algo, nums1, nums2) {
  const steps = []

  push(steps,
    `Median of Two Sorted Arrays: nums1=[${nums1.join(',')}], nums2=[${nums2.join(',')}].`,
    {}, 0
  )

  if (algo === 'merge') {
    // Merge
    const merged = []
    let i = 0, j = 0
    const hl = {}

    push(steps, 'Merge both sorted arrays, tracking which elements get merged.', {}, 1)

    while (i < nums1.length && j < nums2.length) {
      hl[`a${i}`] = 'current'
      hl[`b${j}`] = 'current'
      if (nums1[i] <= nums2[j]) {
        push(steps,
          `nums1[${i}]=${nums1[i]} ≤ nums2[${j}]=${nums2[j]}. Take from nums1. Merged so far: [${merged.join(',')}].`,
          { ...hl }, 1, { merged: [...merged, nums1[i]], step: 'merge' }
        )
        merged.push(nums1[i++])
      } else {
        push(steps,
          `nums1[${i}]=${nums1[i]} > nums2[${j}]=${nums2[j]}. Take from nums2. Merged so far: [${merged.join(',')}].`,
          { ...hl }, 1, { merged: [...merged, nums2[j]], step: 'merge' }
        )
        merged.push(nums2[j++])
      }
    }
    while (i < nums1.length) { merged.push(nums1[i++]) }
    while (j < nums2.length) { merged.push(nums2[j++]) }

    push(steps,
      `Merged: [${merged.join(', ')}]. Length=${merged.length}.`,
      {}, 2, { merged: [...merged], step: 'merged' }
    )

    const n = merged.length
    let median
    if (n % 2 === 1) {
      median = merged[(n / 2) | 0]
      const mhl = {}
      mhl[`m${(n/2)|0}`] = 'match'
      push(steps,
        `Odd length (${n}). Median = merged[${(n/2)|0}] = ${median}.`,
        mhl, 3, { merged: [...merged], step: 'done', median }
      )
    } else {
      const l = (n / 2) - 1, r = n / 2
      median = (merged[l] + merged[r]) / 2
      const mhl = {}
      mhl[`m${l}`] = 'match'
      mhl[`m${r}`] = 'match'
      push(steps,
        `Even length (${n}). Median = (merged[${l}]=${merged[l]} + merged[${r}]=${merged[r]}) / 2 = ${median}.`,
        mhl, 4, { merged: [...merged], step: 'done', median }
      )
    }
    push(steps,
      `Median = ${median}.`,
      {}, 4, { merged: [...merged], step: 'done', median, done: true }
    )

  } else {
    // Binary partition
    let A = nums1, B = nums2
    let aLabel = 'nums1', bLabel = 'nums2'
    if (A.length > B.length) { [A, B] = [B, A]; [aLabel, bLabel] = [bLabel, aLabel] }
    const m = A.length, n = B.length
    const half = (m + n + 1) >> 1

    push(steps,
      `Binary partition on shorter array ${aLabel} (length ${m}). half=${half}.`,
      {}, 1
    )

    let lo = 0, hi = m, iter = 0

    while (lo <= hi) {
      iter++
      const px = (lo + hi) >> 1
      const py = half - px

      const maxLeftX  = px > 0 ? A[px - 1] : -Infinity
      const minRightX = px < m ? A[px]      :  Infinity
      const maxLeftY  = py > 0 ? B[py - 1] : -Infinity
      const minRightY = py < n ? B[py]      :  Infinity

      const hl = {}
      if (px > 0) hl[`a${px-1}`] = 'compare'
      if (px < m) hl[`a${px}`] = 'compare'
      if (py > 0) hl[`b${py-1}`] = 'compare'
      if (py < n) hl[`b${py}`] = 'compare'

      push(steps,
        `Iter ${iter}: px=${px}, py=${py}. maxL_A=${maxLeftX===(-Infinity)?'-∞':maxLeftX}, minR_A=${minRightX===Infinity?'+∞':minRightX}, maxL_B=${maxLeftY===(-Infinity)?'-∞':maxLeftY}, minR_B=${minRightY===Infinity?'+∞':minRightY}.`,
        hl, 4, { px, py, maxLeftX, minRightX, maxLeftY, minRightY }
      )

      if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
        let median
        if ((m + n) % 2 === 1) {
          median = Math.max(maxLeftX, maxLeftY)
          push(steps,
            `Correct partition! (m+n) is odd. Median = max(${maxLeftX===(-Infinity)?'-∞':maxLeftX}, ${maxLeftY===(-Infinity)?'-∞':maxLeftY}) = ${median}.`,
            hl, 12, { px, py, median, done: true }
          )
        } else {
          const leftMax  = Math.max(maxLeftX, maxLeftY)
          const rightMin = Math.min(minRightX, minRightY)
          median = (leftMax + rightMin) / 2
          push(steps,
            `Correct partition! (m+n) is even. Median = (${leftMax} + ${rightMin}) / 2 = ${median}.`,
            hl, 12, { px, py, median, done: true }
          )
        }
        return steps
      } else if (maxLeftX > minRightY) {
        push(steps,
          `maxL_A=${maxLeftX} > minR_B=${minRightY}. Too far right in A. hi = ${px - 1}.`,
          hl, 10
        )
        hi = px - 1
      } else {
        push(steps,
          `maxL_B=${maxLeftY} > minR_A=${minRightX}. Too far left in A. lo = ${px + 1}.`,
          hl, 11
        )
        lo = px + 1
      }
    }
  }

  return steps
}
