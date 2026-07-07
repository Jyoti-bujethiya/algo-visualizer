// 007 – Merge Intervals — pure step generator (no DOM)

const fmtIv  = iv   => `[${iv[0]},${iv[1]}]`
const fmtList = list => '[' + list.map(fmtIv).join(', ') + ']'

// CODE.sort  line→ sort:0, init:1, compare:3, merged:4, appended:5, done:6
// CODE.brute line→ init:0, pass:0, compare:2, merged:2, done:3
const push = (steps, desc, sorted, result, extra = {}) =>
  steps.push({ description: desc, sorted: sorted.map(iv => [...iv]), result: result.map(iv => [...iv]), ...extra })

function generateSort(intervals) {
  const steps = []
  const sorted = [...intervals].sort((a, b) => a[0] - b[0])

  push(steps, `Sort all intervals by their start time so overlapping ones are adjacent. Sorted order: ${fmtList(sorted)}.`, sorted, [], { codeLineIndex: 0 })

  const result = [[...sorted[0]]]
  push(steps, `Start the result with the first interval ${fmtIv(sorted[0])}.`, sorted, result, { activeIdx: 0, codeLineIndex: 1 })

  for (let i = 1; i < sorted.length; i++) {
    const cur      = sorted[i]
    const last     = result[result.length - 1]
    const overlaps = cur[0] <= last[1]

    push(steps,
      `Comparing ${fmtIv(cur)} with the last result interval ${fmtIv(last)}. ${overlaps ? `They overlap (${cur[0]} ≤ ${last[1]}) — merge them together.` : `No overlap (${cur[0]} > ${last[1]}) — add it as a separate interval.`}`,
      sorted, result, { activeIdx: i, overlaps, codeLineIndex: 3 })

    if (overlaps) {
      const newEnd = Math.max(last[1], cur[1])
      result[result.length - 1] = [last[0], newEnd]
      push(steps, `Merged into [${last[0]},${newEnd}] — expanded the right boundary to cover both intervals.`, sorted, result, { activeIdx: i, merged: true, codeLineIndex: 4 })
    } else {
      result.push([...cur])
      push(steps, `Added ${fmtIv(cur)} as a new entry — it doesn't touch the previous interval.`, sorted, result, { activeIdx: i, appended: true, codeLineIndex: 5 })
    }
  }

  push(steps, `All intervals processed. Final merged result: ${fmtList(result)}.`, sorted, result, { complete: true, codeLineIndex: 6 })
  return steps
}

function generateBrute(intervals) {
  const steps = []
  let current = intervals.map(iv => [...iv])

  push(steps, `Repeatedly scan all pairs of intervals and merge any that overlap. Keep going until a full pass finds nothing to merge.`, current, [], { codeLineIndex: 0 })

  let pass = 0, anyMerge = true
  while (anyMerge) {
    anyMerge = false; pass++
    push(steps, `Pass ${pass}: scanning through ${current.length} intervals looking for any pair that overlaps.`, current, [], { codeLineIndex: 0 })

    const next = [], used = new Array(current.length).fill(false)
    for (let i = 0; i < current.length; i++) {
      if (used[i]) continue
      let merged = [...current[i]]; used[i] = true
      for (let j = i + 1; j < current.length; j++) {
        if (used[j]) continue
        const a = merged, b = current[j]
        const ov = a[1] >= b[0] && a[0] <= b[1]
        push(steps, `Comparing ${fmtIv(a)} and ${fmtIv(b)}: ${ov ? 'they overlap — merging them.' : 'no overlap — leave them separate.'}`,
          current, next, { cmpA: i, cmpB: j, overlaps: ov, codeLineIndex: 2 })
        if (ov) {
          merged = [Math.min(a[0], b[0]), Math.max(a[1], b[1])]
          used[j] = true; anyMerge = true
          push(steps, `Merged into ${fmtIv(merged)}.`, current, next, { cmpA: i, cmpB: j, merged: true, codeLineIndex: 2 })
        }
      }
      next.push(merged)
    }
    current = next
  }

  push(steps, `No more overlaps found. Final result: ${fmtList(current)}.`, current, current, { complete: true, codeLineIndex: 3 })
  return steps
}

export function generateSteps(algo, intervals) {
  if (algo === 'brute') return generateBrute(intervals)
  return generateSort(intervals)
}
