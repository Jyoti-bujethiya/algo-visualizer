// 009 – Longest Substring Without Repeating Characters — pure step generator

// CODE.hashmap = ['map={}; left=0','for right in 0..n-1:','  if dup in window: left jump','  left = map[c]+1','  map[c]=right','  update maxLen','return maxLen']
// CODE.set     = ['set={}; left=0','for right in 0..n-1:','  while c in set:','    set.remove; left++','  set.add(c)','  update maxLen','return maxLen']
const push = (steps, desc, left, right, maxLen, bestStart, bestEnd, map, duplicate = -1, codeLineIndex = -1) =>
  steps.push({ description: desc, left, right, maxLen, bestStart, bestEnd, map: { ...map }, duplicate, codeLineIndex })

function genHashMap(str) {
  const steps = []
  const s = str, n = s.length
  if (n === 0) { steps.push({ description: 'Empty string — the answer is 0.', left: 0, right: -1, maxLen: 0, bestStart: 0, bestEnd: -1, map: {}, duplicate: -1, codeLineIndex: 6 }); return steps }

  const map = {}; let left = 0, maxLen = 0, bestStart = 0, bestEnd = -1

  push(steps, `Use a map to remember the last position of each character. When a duplicate is found, jump the left boundary past it instantly.`, left, -1, maxLen, bestStart, bestEnd, map, -1, 0)

  for (let right = 0; right < n; right++) {
    const c = s[right]; let dup = -1
    if (map[c] !== undefined && map[c] >= left) {
      dup = map[c]
      push(steps, `Character "${c}" was seen before at position ${map[c]}, which is inside the current window. Jump the left boundary to ${map[c] + 1} to remove the duplicate.`,
        left, right, maxLen, bestStart, bestEnd, map, dup, 2)
      left = map[c] + 1
    } else {
      push(steps, `Character "${c}" is not in the current window — safe to expand.`, left, right, maxLen, bestStart, bestEnd, map, -1, 1)
    }
    map[c] = right
    const len = right - left + 1
    if (len > maxLen) {
      maxLen = len; bestStart = left; bestEnd = right
      push(steps, `New longest window: "${s.slice(left, right + 1)}" — length ${maxLen}. This is the best so far.`, left, right, maxLen, bestStart, bestEnd, map, -1, 5)
    } else {
      push(steps, `Window is now "${s.slice(left, right + 1)}" (length ${len}). Best so far is still ${maxLen}.`, left, right, maxLen, bestStart, bestEnd, map, -1, 4)
    }
  }

  push(steps, `Reached the end. Longest substring without repeating characters: "${s.slice(bestStart, bestEnd + 1)}" (length ${maxLen}).`,
    left, n - 1, maxLen, bestStart, bestEnd, map, -1, 6)
  return steps
}

function genSet(str) {
  const steps = []
  const s = str, n = s.length
  if (n === 0) { steps.push({ description: 'Empty string — the answer is 0.', left: 0, right: -1, maxLen: 0, bestStart: 0, bestEnd: -1, map: {}, duplicate: -1, codeLineIndex: 6 }); return steps }

  const set = new Set(); let left = 0, maxLen = 0, bestStart = 0, bestEnd = -1
  const snapshot = () => Object.fromEntries([...set].map((ch, i) => [ch, i]))

  push(steps, `Use a set to track which characters are in the current window. When a duplicate is found, shrink the window from the left until the duplicate is gone.`, left, -1, maxLen, bestStart, bestEnd, {}, -1, 0)

  for (let right = 0; right < n; right++) {
    const c = s[right]
    if (set.has(c)) {
      push(steps, `"${c}" is already in the window — need to shrink from the left until it's removed.`, left, right, maxLen, bestStart, bestEnd, snapshot(), right, 2)
      while (set.has(c)) {
        push(steps, `Removing "${s[left]}" from the left edge of the window.`, left + 1, right, maxLen, bestStart, bestEnd, snapshot(), -1, 3)
        set.delete(s[left]); left++
      }
    }
    set.add(c)
    const len = right - left + 1
    if (len > maxLen) {
      maxLen = len; bestStart = left; bestEnd = right
      push(steps, `New longest window: "${s.slice(left, right + 1)}" — length ${maxLen}.`, left, right, maxLen, bestStart, bestEnd, snapshot(), -1, 5)
    } else {
      push(steps, `Current window is "${s.slice(left, right + 1)}" (length ${len}). Best is still ${maxLen}.`, left, right, maxLen, bestStart, bestEnd, snapshot(), -1, 4)
    }
  }

  push(steps, `Done! Longest substring without repeating characters: "${s.slice(bestStart, bestEnd + 1)}" (length ${maxLen}).`,
    left, n - 1, maxLen, bestStart, bestEnd, snapshot(), -1, 6)
  return steps
}

export function generateSteps(algo, str) {
  if (algo === 'set') return genSet(str)
  return genHashMap(str)
}
