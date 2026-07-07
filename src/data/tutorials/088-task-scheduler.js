/**
 * Tutorial content for #088 — Task Scheduler
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given a list of tasks (each represented by a letter) and a non-negative cooldown integer n, find the minimum number of CPU intervals needed to finish all tasks. Between any two identical tasks there must be at least n intervals (tasks or idle slots).`,
    example: `tasks = ["A","A","A","B","B","B"], n = 2\nSchedule: A B _ A B _ A B\nEach A is at least 2 slots apart, each B too.\nTotal intervals = 8\n✅ Answer: 8`,
    keyInsight: `The most frequent task determines the minimum number of "frames" needed. Each frame is (n+1) slots. Extra tasks fill the idle slots. If all tasks fill slots completely, the answer is simply len(tasks).`,
  },

  approaches: {
    'Math Formula': {
      intuition: `Let maxFreq = the frequency of the most common task. Let maxCount = how many tasks share that maximum frequency.\n\nThe minimum time is determined by the "frame" structure around the most frequent task:\n  frames = maxFreq - 1\n  slots per frame = n + 1\n  extra slots at the end = maxCount (tasks with same max freq that go in the last frame)\n\nSo: answer = max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount)`,
      steps: [
        `Count the frequency of each task.`,
        `Find maxFreq = maximum frequency.`,
        `Find maxCount = number of tasks with frequency == maxFreq.`,
        `Return max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount).`,
      ],
      example: `tasks=["A","A","A","B","B","B"], n=2\n\nfreqs: A→3, B→3. maxFreq=3, maxCount=2.\n(maxFreq-1)*(n+1)+maxCount = (3-1)*(2+1)+2 = 2*3+2 = 8\nmax(6, 8) = 8 ✅\n\ntasks=["A","A","A","B","B","B","C","C","C","D","D","E"], n=2\nmaxFreq=3, maxCount=3 (A,B,C)\n(3-1)*3+3=9. tasks.length=12. max(12,9)=12 ✅`,
      keyInsight: `O(n) time, O(1) space (only 26 possible tasks). This single formula is the key insight of the problem — no simulation needed. The hardest part is understanding why the formula works.`,
    },

    'Max Heap Cycle Simulation': {
      intuition: `Use a max-heap keyed by frequency. In each "cycle" of length (n+1), greedily pick up to (n+1) tasks from the heap (always the most frequent remaining task). After the cycle, push back tasks that still have remaining count. Count idle slots when fewer than (n+1) tasks are available.`,
      steps: [
        `Count frequencies, build max-heap.`,
        `time = 0.`,
        `While heap not empty:`,
        `  temp = [] (tasks used this cycle).`,
        `  For i = 0 to n (up to n+1 slots):`,
        `    If heap not empty: pop (freq, task); temp.add((freq-1, task)).`,
        `  Push back entries from temp with freq > 0.`,
        `  time += heap is empty after this cycle ? temp size (tasks done) : n + 1.`,
        `Return time.`,
      ],
      example: `tasks=["A","A","A","B","B","B"], n=2\nheap: [(3,A),(3,B)]\n\nCycle 1: pop A(3→2), pop B(3→2), 1 idle slot. time+=3. heap:[(2,A),(2,B)]\nCycle 2: pop A(2→1), pop B(2→1), idle. time+=3. heap:[(1,A),(1,B)]\nCycle 3: pop A(1→0), pop B(1→0). heap empty → time+=2 (no idle).\ntotal = 3+3+2 = 8 ✅`,
      keyInsight: `O(n log 26) = O(n) time (heap has at most 26 entries). Good for visualizing the actual schedule. The Math Formula is faster to implement; this is better for understanding why the schedule works.`,
    },

    'Greedy Simulation with Cooldown Queue': {
      intuition: `Simulate the CPU timeline explicitly. Maintain a "cooldown queue" of tasks that were recently used and can't be used yet (with the timestamp when they become available). At each tick, pick the most frequent available task, or idle if none is available.`,
      steps: [
        `Count frequencies, build max-heap.`,
        `Queue of (freq, availableTime) for tasks on cooldown.`,
        `time = 0.`,
        `While heap or queue is not empty:`,
        `  time++.`,
        `  If heap not empty: pop most frequent; if freq-1>0, add to queue with availableTime=time+n.`,
        `  If queue.front.availableTime == time: move back to heap.`,
        `Return time.`,
      ],
      example: `tasks=["A","A","A","B","B","B"], n=2\n\nt=1: pop A(3→2). queue:[(2,A,t=3)]\nt=2: pop B(3→2). queue:[(2,A,3),(2,B,4)]\nt=3: heap empty. idle. release A → heap:[(2,A),(0,B? wait)]\nt=3: A available → pop A(2→1). queue:[(2,B,4),(1,A,5)]\n... (continues)\nTotal time = 8 ✅`,
      keyInsight: `O(n log 26) = O(n) time. This approach explicitly models the scheduler and is very intuitive — you can trace the exact schedule. Slightly more complex to code than the Math Formula.`,
    },

    'Counting Idle Slots': {
      intuition: `Calculate the number of idle slots directly. Start with (maxFreq - 1) * n idle slots (one frame of n slots between each occurrence of the most frequent task). Then fill those idle slots by inserting other tasks. If idle slots go negative, there are no idles needed.`,
      steps: [
        `Count task frequencies.`,
        `Sort frequencies descending.`,
        `maxFreq = freqs[0].`,
        `idleSlots = (maxFreq - 1) * n.`,
        `For each remaining freq (freqs[1..]):`,
        `  idleSlots -= min(freq, maxFreq - 1).`,
        `Return tasks.length + max(0, idleSlots).`,
      ],
      example: `tasks=["A","A","A","B","B","B"], n=2\nfreqs=[3,3]. maxFreq=3. idleSlots=(3-1)*2=4.\n\nFor B (freq=3): idleSlots -= min(3, 3-1=2) = 4-2 = 2.\nRemaining idleSlots = 2.\nAnswer = 6 + max(0,2) = 8 ✅`,
      keyInsight: `O(n + 26 log 26) = O(n) time. A different angle on the same math formula — directly counting idle slots and filling them with other tasks. Equivalent result to the Math Formula.`,
    },
  },
}
