// 087 — Merge K Sorted Lists (Heap) · steps.js
// Min-heap of [val, listIndex]; always extract minimum and advance pointer

// line indices:
// 0: function mergeKLists(lists):
// 1:   heap = min-heap
// 2:   for each list: if non-empty, push (val, listIdx, node)
// 3:   result = dummy head
// 4:   while heap not empty:
// 5:     (val, li, node) = heap.pop()
// 6:     append node to result
// 7:     if node.next: heap.push(node.next)
// 8:   return result

function pushStep(steps, desc, heap, merged, highlights, codeLineIndex, extra = {}) {
  steps.push({ description: desc, heap: heap.map(h=>[...h]), merged: [...merged], highlights:{...highlights}, codeLineIndex, ...extra })
}

function hPush(h, item) {
  h.push(item); let i=h.length-1
  while(i>0){const p=(i-1)>>1;if(h[p][0]>h[i][0]){[h[p],h[i]]=[h[i],h[p]];i=p}else break}
}
function hPop(h) {
  const top=h[0];h[0]=h[h.length-1];h.pop();let i=0
  while(true){let s=i,l=2*i+1,r=2*i+2;if(l<h.length&&h[l][0]<h[s][0])s=l;if(r<h.length&&h[r][0]<h[s][0])s=r;if(s===i)break;[h[s],h[i]]=[h[i],h[s]];i=s}
  return top
}

export function generateSteps(lists) {
  const steps = []
  const heap = [], merged = [], highlights = {}
  const ptrs = lists.map(l => 0)

  pushStep(steps, `Merge K Sorted Lists: ${lists.length} lists. Push first element of each list into min-heap. Always extract minimum.`, heap, merged, {}, 0)

  for (let li = 0; li < lists.length; li++) {
    if (lists[li].length > 0) {
      hPush(heap, [lists[li][0], li, 0])
      highlights[`${li},0`] = 'current'
    }
  }
  pushStep(steps, `Initial heap: [${heap.map(h=>h[0]).join(',')}]. Each entry = [val, listIdx, nodeIdx].`, heap, merged, { ...highlights }, 2)

  while (heap.length > 0) {
    const [val, li, ni] = hPop(heap)
    merged.push(val)
    highlights[`${li},${ni}`] = 'match'
    pushStep(steps, `Pop min=${val} from list ${li}. Merged: [${merged.join(',')}].`, heap, merged, { ...highlights }, 5)

    const nextNi = ni + 1
    if (nextNi < lists[li].length) {
      hPush(heap, [lists[li][nextNi], li, nextNi])
      highlights[`${li},${nextNi}`] = 'compare'
      pushStep(steps, `Advance list ${li}: push next val=${lists[li][nextNi]}. Heap: [${heap.map(h=>h[0]).join(',')}].`, heap, merged, { ...highlights }, 7)
    }
  }

  pushStep(steps, `Merged result: [${merged.join(',')}].`, heap, merged, { ...highlights }, 8, { result: merged, done: true })
  return steps
}
