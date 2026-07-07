// 008 – Insert Interval — pure step generator (no DOM)

const fmtIv   = iv   => `[${iv[0]},${iv[1]}]`
const fmtList = list => '[' + list.map(fmtIv).join(', ') + ']'

// CODE.threepart = ['three-phase: before / overlap / after', 'Phase 1 — copy non-overlapping before', 'copy each before', 'Phase 2 — merge overlapping', 'expand bounds', 'push merged new interval', 'Phase 3 — copy after', 'copy each after', 'done']
// CODE.binsearch = ['binary search for insertion point', 'compare mid', 'insert at pos', 'merge pass: start with first', 'compare pair', 'merge', 'done']
const push = (steps, desc, ivs, ni, result, extra = {}) =>
  steps.push({ description: desc, intervals: ivs.map(iv => [...iv]), newInterval: [...ni], result: result.map(iv => [...iv]), ...extra })

function genThreePart(intervals, newInterval) {
  const steps = []
  const orig  = intervals.map(iv => [...iv])
  let ni      = [...newInterval]
  const res   = []
  let i = 0; const n = orig.length

  push(steps, `Insert ${fmtIv(ni)} into the sorted list. Handle three phases: intervals that end before the new one, intervals that overlap, then the rest.`, orig, ni, res, { codeLineIndex: 0 })
  push(steps, `Phase 1: copy every interval that ends before the new interval starts (before ${ni[0]}).`, orig, ni, res, { phase: 1, codeLineIndex: 1 })
  while (i < n && orig[i][1] < ni[0]) {
    res.push([...orig[i]])
    push(steps, `${fmtIv(orig[i])} ends at ${orig[i][1]}, which is before ${ni[0]}. Copy it straight into the result.`, orig, ni, res, { phase: 1, activeIdx: i, added: true, codeLineIndex: 2 })
    i++
  }
  push(steps, `Phase 2: merge all intervals that overlap with ${fmtIv(ni)} by expanding its boundaries.`, orig, ni, res, { phase: 2, codeLineIndex: 3 })
  while (i < n && orig[i][0] <= ni[1]) {
    ni[0] = Math.min(ni[0], orig[i][0]); ni[1] = Math.max(ni[1], orig[i][1])
    push(steps, `${fmtIv(orig[i])} overlaps with the new interval — expand the new interval's boundaries to cover both. Now it's ${fmtIv(ni)}.`, orig, ni, res, { phase: 2, activeIdx: i, merging: true, codeLineIndex: 4 })
    i++
  }
  res.push([...ni])
  push(steps, `All overlapping intervals absorbed. Push the merged result ${fmtIv(ni)}. Result so far: ${fmtList(res)}.`, orig, ni, res, { phase: 2, pushedNew: true, codeLineIndex: 5 })
  push(steps, `Phase 3: copy all remaining intervals that start after the new interval ends.`, orig, ni, res, { phase: 3, codeLineIndex: 6 })
  while (i < n) {
    res.push([...orig[i]])
    push(steps, `${fmtIv(orig[i])} starts after ${ni[1]} — copy it into the result unchanged.`, orig, ni, res, { phase: 3, activeIdx: i, added: true, codeLineIndex: 7 })
    i++
  }
  push(steps, `Done! Final result: ${fmtList(res)}.`, orig, ni, res, { complete: true, codeLineIndex: 8 })
  return steps
}

function genBinSearch(intervals, newInterval) {
  const steps = []
  const ni  = [...newInterval]
  let arr   = intervals.map(iv => [...iv])

  push(steps, `Use binary search to find the correct insertion position for ${fmtIv(ni)}, then merge any overlapping intervals.`, arr, ni, [], { codeLineIndex: 0 })

  let left = 0, right = arr.length
  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    push(steps,
      `Binary search: checking the midpoint at position ${mid} (${fmtIv(arr[mid])}). ${arr[mid][0] < ni[0] ? `Its start ${arr[mid][0]} is before ${ni[0]} — search the right half.` : `Its start ${arr[mid][0]} is at or after ${ni[0]} — search the left half.`}`,
      arr, ni, [], { bsMid: mid, codeLineIndex: 1 })
    if (arr[mid][0] < ni[0]) left = mid + 1
    else right = mid
  }
  arr.splice(left, 0, [...ni])
  push(steps, `Insertion point found at position ${left}. The new interval is now placed in sorted order: ${fmtList(arr)}.`, arr, ni, [], { insertPos: left, codeLineIndex: 2 })

  const result = [[...arr[0]]]
  push(steps, `Now merge overlaps. Start with the first interval ${fmtIv(arr[0])}.`, arr, ni, result, { codeLineIndex: 3 })
  for (let i = 1; i < arr.length; i++) {
    const last = result[result.length - 1]
    const ov   = arr[i][0] <= last[1]
    push(steps, `${fmtIv(arr[i])} vs the last result interval ${fmtIv(last)}: ${ov ? 'they overlap — merge together.' : 'no overlap — add as a new interval.'}`,
      arr, ni, result, { activeIdx: i, overlaps: ov, codeLineIndex: 4 })
    if (ov) {
      result[result.length - 1] = [last[0], Math.max(last[1], arr[i][1])]
      push(steps, `Merged into ${fmtIv(result[result.length - 1])}.`, arr, ni, result, { activeIdx: i, merged: true, codeLineIndex: 5 })
    } else {
      result.push([...arr[i]])
    }
  }
  push(steps, `Done! Final result: ${fmtList(result)}.`, arr, ni, result, { complete: true, codeLineIndex: 6 })
  return steps
}

export function generateSteps(algo, intervals, newInterval) {
  if (algo === 'binsearch') return genBinSearch(intervals, newInterval)
  return genThreePart(intervals, newInterval)
}
