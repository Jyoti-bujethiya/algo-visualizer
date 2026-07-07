// 086 — Find Median from Data Stream · steps.js
// Two heaps: maxHeap (lower half) + minHeap (upper half)
// Balance so sizes differ by at most 1

// line indices:
// 0: class MedianFinder:
// 1:   maxHeap=[]; minHeap=[]  // max-heap(lo), min-heap(hi)
// 2:   function addNum(num):
// 3:     maxHeap.push(num)  // always push to max heap first
// 4:     minHeap.push(maxHeap.pop())  // move max of lo to hi
// 5:     if maxHeap.size < minHeap.size:  // rebalance
// 6:       maxHeap.push(minHeap.pop())
// 7:   function findMedian():
// 8:     if equal size: (maxHeap.top + minHeap.top) / 2
// 9:     else: maxHeap.top

function pushStep(steps, desc, lo, hi, median, codeLineIndex, extra = {}) {
  steps.push({ description: desc, lo: [...lo], hi: [...hi], median, codeLineIndex, ...extra })
}

// Simple binary heap helpers (max-heap for lo, min-heap for hi)
function hPush(h, v, cmp) {
  h.push(v)
  let i = h.length - 1
  while (i > 0) { const p = (i-1)>>1; if (cmp(h[p], h[i]) > 0) { [h[p],h[i]]=[h[i],h[p]]; i=p } else break }
}
function hPop(h, cmp) {
  const top = h[0]; h[0] = h[h.length-1]; h.pop()
  let i = 0
  while (true) { let s=i,l=2*i+1,r=2*i+2; if (l<h.length&&cmp(h[l],h[s])<0)s=l; if(r<h.length&&cmp(h[r],h[s])<0)s=r; if(s===i)break;[h[s],h[i]]=[h[i],h[s]];i=s }
  return top
}
const cmpMax = (a, b) => b - a  // max-heap
const cmpMin = (a, b) => a - b  // min-heap

export function generateSteps(nums) {
  const steps = []
  const lo = [], hi = []  // lo=max-heap (lower half), hi=min-heap (upper half)

  pushStep(steps, `Find Median from Stream. Two heaps: maxHeap (lower half) and minHeap (upper half). Sizes balanced so median is O(1).`, lo, hi, null, 0)

  for (const num of nums) {
    hPush(lo, num, cmpMax)
    pushStep(steps, `addNum(${num}): push ${num} to maxHeap(lo). lo=[${lo.join(',')}].`, lo, hi, null, 3)

    const moved = hPop(lo, cmpMax)
    hPush(hi, moved, cmpMin)
    pushStep(steps, `Move top of lo (${moved}) to minHeap(hi). lo=[${lo.join(',')}], hi=[${hi.join(',')}].`, lo, hi, null, 4)

    if (lo.length < hi.length) {
      const back = hPop(hi, cmpMin)
      hPush(lo, back, cmpMax)
      pushStep(steps, `Rebalance: move hi top (${back}) back to lo. lo=[${lo.join(',')}], hi=[${hi.join(',')}].`, lo, hi, null, 6)
    }

    const med = lo.length === hi.length ? (lo[0] + hi[0]) / 2 : lo[0]
    pushStep(steps,
      `After addNum(${num}): lo.top=${lo[0]}, hi.top=${hi.length>0?hi[0]:'—'}. median=${med}.`,
      lo, hi, med, 8, { median: med }
    )
  }

  const finalMed = lo.length === hi.length ? (lo[0] + hi[0]) / 2 : lo[0]
  pushStep(steps, `Final median = ${finalMed}.`, lo, hi, finalMed, 9, { median: finalMed, done: true })
  return steps
}
