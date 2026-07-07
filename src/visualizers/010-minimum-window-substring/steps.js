// 010 – Minimum Window Substring — pure step generator
// CODE.sliding = ['Build tCount from t','left=0, formed=0','for right in 0..m-1:','  add s[right] to window','  if window satisfies all t counts:','    try shrinking from left','    record if new minimum','    remove s[left], left++','return minWindow']
// Phase → codeLineIndex: init:0, expand:3, newmin:6, contract:7, complete:8

export function generateSteps(_algo, s, t) {
  const steps = []

  if (!s || !t) {
    steps.push({ description: 'Empty input.', left: 0, right: -1, formed: 0, required: 0, windowCount: {}, tCount: {}, minLeft: -1, minRight: -1, phase: 'init', codeLineIndex: 0 })
    return steps
  }

  const tCount = {}
  for (const c of t) tCount[c] = (tCount[c] || 0) + 1
  const required = Object.keys(tCount).length

  const PHASE_LINE = { init: 0, expand: 3, newmin: 6, contract: 7, complete: 8 }
  const push = (desc, left, right, formed, windowCount, minLeft, minRight, phase) =>
    steps.push({ description: desc, left, right, formed, required, windowCount: { ...windowCount }, tCount: { ...tCount }, minLeft, minRight, phase, codeLineIndex: PHASE_LINE[phase] ?? -1 })

  push(`Count how many of each character we need from "${t}". There are ${required} unique character(s) to satisfy.`, 0, -1, 0, {}, -1, -1, 'init')

  let left = 0, formed = 0
  const windowCount = {}
  let minLen = Infinity, minLeft = -1, minRight = -1

  for (let right = 0; right < s.length; right++) {
    const c = s[right]
    windowCount[c] = (windowCount[c] || 0) + 1

    const prev = formed
    if (tCount[c] && windowCount[c] === tCount[c]) formed++

    const formedMsg = formed > prev ? ` We now satisfy ${formed} of ${required} required characters.` : ''
    push(`Expanding: include "${c}" at position ${right}.${formedMsg}`,
      left, right, formed, windowCount, minLeft, minRight, 'expand')

    while (left <= right && formed === required) {
      const len = right - left + 1
      if (len < minLen) {
        minLen = len; minLeft = left; minRight = right
        push(`All required characters are in the window. New smallest window found: "${s.slice(left, right + 1)}" (length ${len}).`,
          left, right, formed, windowCount, minLeft, minRight, 'newmin')
      }

      const lc = s[left]
      windowCount[lc]--
      const lostFormed = tCount[lc] && windowCount[lc] < tCount[lc]
      if (lostFormed) formed--

      push(`Shrinking: remove "${lc}" from the left.${lostFormed ? ` Now we no longer satisfy all requirements — expand again.` : ' Window still valid.'}`,
        left + 1, right, formed, windowCount, minLeft, minRight, 'contract')
      left++
    }
  }

  const answer = minLeft === -1 ? 'none found' : `"${s.slice(minLeft, minRight + 1)}"`
  push(`Finished scanning the entire string. Minimum window: ${answer}.`, left, s.length - 1, formed, windowCount, minLeft, minRight, 'complete')
  return steps
}
