/**
 * Tutorial content for #098 — Meeting Rooms II
 * Keyed by approach name (must match the name parsed from the solution file).
 */
export const tutorial = {
  problem: {
    statement: `Given an array of meeting time intervals, find the minimum number of conference rooms required so that all meetings can be held simultaneously. A new room is needed any time a meeting starts before an earlier meeting ends.`,
    example: `intervals = [[0,30],[5,10],[15,20]]\nMeeting 1: 0–30 needs Room A\nMeeting 2: 5–10 starts during Meeting 1 → needs Room B\nMeeting 3: 15–20 can use Room B (Meeting 2 ended at 10)\nMinimum rooms = 2\n✅ Answer: 2`,
    keyInsight: `The number of rooms needed at any moment equals the number of meetings active at that time. Track when rooms become free by storing end times in a min-heap: if a new meeting starts after the earliest ending time, reuse that room; otherwise open a new room.`,
  },

  approaches: {
    'Min Heap (End Times)': {
      intuition: `Sort meetings by start time. Maintain a min-heap of room end times. For each meeting:\n• If the earliest-ending room is free (its end ≤ new meeting's start), replace that end time with the new meeting's end (reuse the room).\n• Otherwise, open a new room (add a new end time to the heap).\nThe heap's size at the end equals the rooms used.`,
      steps: [
        `Sort intervals by start time.`,
        `Create an empty min-heap (stores end times).`,
        `For each interval [start, end]:`,
        `  If heap not empty AND heap.peek() <= start: heap.poll() (free a room).`,
        `  heap.add(end) (assign or open a room).`,
        `Return heap.size().`,
      ],
      example: `intervals=[[0,30],[5,10],[15,20]] (already sorted by start)\n\n[0,30]: heap empty → push 30. heap:[30]. rooms=1\n[5,10]: heap.peek()=30 > 5 → can't reuse → push 10. heap:[10,30]. rooms=2\n[15,20]: heap.peek()=10 ≤ 15 → poll 10, push 20. heap:[20,30]. rooms=2\nReturn heap.size()=2 ✅`,
      keyInsight: `O(n log n) time (sort + heap operations), O(n) space. This is the canonical interview solution. The min-heap always gives you the earliest-ending meeting — perfect for checking if a room can be freed.`,
    },

    'Chronological / Two Sorted Arrays': {
      intuition: `Separate start and end times into two sorted arrays. Use two pointers to simulate a timeline: when a start pointer event fires, increment active rooms; when an end pointer event fires, decrement. Track the maximum active rooms at any point.`,
      steps: [
        `starts = sorted start times. ends = sorted end times.`,
        `i = 0, j = 0. rooms = 0, maxRooms = 0.`,
        `While i < n:`,
        `  If starts[i] < ends[j]: rooms++; i++ (meeting starts, need new room).`,
        `  Else: rooms--; j++ (meeting ends, free a room).`,
        `  maxRooms = max(maxRooms, rooms).`,
        `Return maxRooms.`,
      ],
      example: `intervals=[[0,30],[5,10],[15,20]]\nstarts=[0,5,15] ends=[10,20,30]\n\ni=0,j=0: 0<10 → rooms=1, i=1. max=1\ni=1,j=0: 5<10 → rooms=2, i=2. max=2\ni=2,j=0: 15>=10 → rooms=1, j=1.\ni=2,j=1: 15<20 → rooms=2, i=3. max=2\ni=3: loop ends.\nReturn 2 ✅`,
      keyInsight: `O(n log n) time, O(n) space. Same complexity as the heap approach. Elegant — no heap needed, just two sorted arrays and two pointers. Often cited as the "cleanest" solution.`,
    },

    'Sweep Line (Events)': {
      intuition: `Create events: each meeting start is a +1 event and each meeting end is a -1 event. Sort all events by time (break ties: ends before starts, so ending at time t frees the room before a new meeting starts at time t). Sweep through events, tracking the running sum as "current rooms in use."`,
      steps: [
        `Create list of (time, type) events: (start,+1) and (end,-1) for each meeting.`,
        `Sort by time; break ties by putting -1 (ends) before +1 (starts).`,
        `Sweep: running sum starts at 0. For each event, add its type. Track max running sum.`,
        `Return max.`,
      ],
      example: `intervals=[[0,30],[5,10],[15,20]]\nEvents: (0,+1),(5,+1),(10,-1),(15,+1),(20,-1),(30,-1)\n\nTime 0:  sum=1. max=1\nTime 5:  sum=2. max=2\nTime 10: sum=1.\nTime 15: sum=2. max=2\nTime 20: sum=1.\nTime 30: sum=0.\nReturn 2 ✅`,
      keyInsight: `O(n log n) time, O(n) space. The most general form — handles any resource contention problem, not just meeting rooms. The tie-breaking rule (end before start at the same time) matters: a room freed at time t can be reused for a meeting starting at t.`,
    },

    'TreeMap (Sweep Line with Counts)': {
      intuition: `Use a TreeMap (sorted map) to store the net change at each time point: +1 for a meeting start, -1 for a meeting end. Then scan the map in time order, accumulating the running count. The maximum count is the answer.`,
      steps: [
        `TreeMap<Integer, Integer> map.`,
        `For each [start, end]: map[start]++; map[end]--.`,
        `Scan map in key order: runningSum += value. Track max.`,
        `Return max.`,
      ],
      example: `intervals=[[0,30],[5,10],[15,20]]\nmap: {0:+1, 5:+1, 10:-1, 15:+1, 20:-1, 30:-1}\n\nScan: 0→1, 5→2(max=2), 10→1, 15→2, 20→1, 30→0\nReturn 2 ✅`,
      keyInsight: `O(n log n) time, O(n) space. Clean and readable. Works correctly when multiple meetings start/end at the same time because the map accumulates the net change at each timestamp automatically.`,
    },

    'Priority Queue with (end, start) Pairs': {
      intuition: `Variation of the min-heap approach where we push the full interval pair and sort by end time. Functionally equivalent to Min Heap (End Times), but some implementations sort or push full pairs to make debugging easier.`,
      steps: [
        `Sort intervals by start time.`,
        `Min-heap keyed by end time.`,
        `For each [start, end]: if heap non-empty AND heap.peek()[0] <= start: poll (room freed). Add [end, start] to heap.`,
        `Return heap.size().`,
      ],
      example: `intervals=[[0,30],[5,10],[15,20]]\n\n[0,30]: push [30,0]. heap:[[30,0]]\n[5,10]: peek=30>5 → push [10,5]. heap:[[10,5],[30,0]] size=2\n[15,20]: peek=10≤15 → poll [10,5]. push [20,15]. heap:[[20,15],[30,0]] size=2\nReturn 2 ✅`,
      keyInsight: `O(n log n) time, O(n) space. Same as Min Heap (End Times) — storing the full interval in the heap is a minor implementation choice that doesn't affect correctness or complexity.`,
    },
  },
}
