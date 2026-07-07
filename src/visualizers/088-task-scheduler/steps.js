// 088 — Task Scheduler · steps.js
// Greedy: always schedule the most frequent remaining task; idle if needed
// Result: time units = max(n+1 blocks * ceil, total tasks)

// line indices:
// 0: function leastInterval(tasks, n):
// 1:   freq = count task frequencies
// 2:   sort frequencies descending
// 3:   maxFreq = freq[0]; maxCount = # tasks with maxFreq
// 4:   slots = (maxFreq - 1) * (n + 1) + maxCount
// 5:   return max(slots, tasks.length)

function pushStep(steps, desc, timeline, freq, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, timeline: [...timeline], freq: { ...freq }, highlights: { ...highlights }, codeLineIndex, ...extra })
}

export function generateSteps(tasks, n) {
  const steps = []

  // Count frequencies
  const freq = {}
  for (const t of tasks) freq[t] = (freq[t] || 0) + 1
  pushStep(steps,
    `Task Scheduler: tasks=[${tasks.join(',')}], cooldown n=${n}. Count frequencies: {${Object.entries(freq).map(([k,v])=>`${k}:${v}`).join(', ')}}.`,
    [], { ...freq }, {}, 0
  )

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1])
  const maxFreq  = sorted[0][1]
  const maxCount = sorted.filter(([,v]) => v === maxFreq).length

  pushStep(steps,
    `Sort by frequency: [${sorted.map(([k,v])=>`${k}(${v})`).join(', ')}]. maxFreq=${maxFreq}, maxCount=${maxCount}.`,
    [], { ...freq }, {}, 2
  )

  // Build timeline greedily
  const timeline = []
  const remaining = { ...freq }
  let time = 0

  while (Object.values(remaining).some(v => v > 0)) {
    // Pick top n+1 tasks by remaining count
    const avail = Object.entries(remaining)
      .filter(([,v]) => v > 0)
      .sort((a, b) => b[1] - a[1])

    for (let slot = 0; slot <= n; slot++) {
      if (avail[slot]) {
        const [task] = avail[slot]
        timeline.push(task)
        remaining[task]--
        pushStep(steps,
          `time=${time}: schedule '${task}' (remaining ${remaining[task]+1}→${remaining[task]}).`,
          [...timeline], { ...remaining }, {}, 3
        )
      } else if (Object.values(remaining).some(v => v > 0)) {
        timeline.push('idle')
        pushStep(steps,
          `time=${time}: IDLE (no task available during cooldown).`,
          [...timeline], { ...remaining }, {}, 4
        )
      }
      time++
      if (!Object.values(remaining).some(v => v > 0)) break
    }
  }

  // Formula result
  const formula = Math.max((maxFreq - 1) * (n + 1) + maxCount, tasks.length)
  pushStep(steps,
    `Done! Total time = ${timeline.length}. Formula: max((${maxFreq}-1)×(${n}+1)+${maxCount}, ${tasks.length}) = max(${(maxFreq-1)*(n+1)+maxCount}, ${tasks.length}) = ${formula}.`,
    timeline, { ...remaining }, {}, 5, { result: timeline.length, done: true }
  )
  return steps
}
