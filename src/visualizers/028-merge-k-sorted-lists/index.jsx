import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './MergeKLists.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Three lists', detail: '[[1,4,5],[1,3,4],[2,6]]', lists: [[1,4,5],[1,3,4],[2,6]] },
  { label: 'Test 2 — Empty',       detail: '[]',                      lists: [] },
  { label: 'Test 3 — One empty',   detail: '[[],[]]',                  lists: [[],[]] },
  { label: 'Test 4 — Two lists',   detail: '[[1,2],[3,4]]',            lists: [[1,2],[3,4]] },
  { label: 'Test 5 — Four lists',  detail: '[[1,3],[2,4],[5],[6,7]]',  lists: [[1,3],[2,4],[5],[6,7]] },
]

const ALGORITHMS = [
  { id: 'heap',   name: 'Min-Heap',           complexity: 'O(n log k) time · O(k) space' },
  { id: 'divconq', name: 'Divide & Conquer',   complexity: 'O(n log k) time · O(log k) space' },
]

const CODE = {
  heap: [
    'heap = [(list[0], i, 0) for i, list in enumerate(lists) if list]',
    'heapify(heap)',
    'dummy = cur = ListNode(0)',
    'while heap:',
    '  val, li, idx = heappop(heap)',
    '  cur.next = ListNode(val); cur = cur.next',
    '  if idx+1 < len(lists[li]):',
    '    heappush(heap, (lists[li][idx+1], li, idx+1))',
    'return dummy.next',
  ],
  divconq: [
    'def merge(lists, l, r):',
    '  if l == r: return lists[l]',
    '  mid = (l + r) // 2',
    '  left  = merge(lists, l, mid)',
    '  right = merge(lists, mid+1, r)',
    '  return mergeTwoLists(left, right)',
    'return merge(lists, 0, len(lists)-1)',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'Active list' },
  { token: 'match',    label: 'Merged into result' },
  { token: 'special',  label: 'In heap' },
]

export default function MergeKSortedListsVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('heap')
  const [customCase,   setCustomCase]   = useState(null)

  const { lists } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, lists), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const curLists = step?.lists ?? lists
  const merged   = step?.merged ?? []
  const heap     = step?.heap ?? []
  const ptrs     = step?.ptrs ?? curLists.map(() => 0)
  const activeList = step?.activeList ?? -1


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "lists",
                "label": "Lists (semicolon-sep)",
                "type": "text",
                "placeholder": "1,4,5;1,3,4;2,6"
            }
        ]}
      onApply={parsed => {
        const lists = parsed.lists.split(';').map(seg => seg.split(',').map(Number))
        setCustomCase({ lists }); hook.reset()
      }}
    />
  )

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'Phase': step.phase ?? '—',
        'Merged': merged.length,
        ...(heap.length > 0 ? { 'Heap': `[${heap.join(', ')}]` } : {}),
        ...(step.round !== undefined ? { 'Round': step.round } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.listsGrid}>
          {curLists.map((list, li) => (
            <div key={li} className={`${styles.listCol} ${li === activeList ? styles.activeList : ''}`}>
              <div className={styles.listLabel}>List {li}</div>
              <div className={styles.listNodes}>
                {list.map((val, idx) => (
                  <div key={idx} className={`${styles.node} ${idx === (ptrs[li] ?? 0) && li === activeList ? styles.nodeActive : ''}`}>
                    {val}
                  </div>
                ))}
                {list.length === 0 && <span className={styles.empty}>∅</span>}
              </div>
            </div>
          ))}
        </div>

        {heap.length > 0 && (
          <div className={styles.heapRow}>
            <span className={styles.heapLabel}>Min-Heap</span>
            <div className={styles.heapNodes}>
              {heap.map((val, i) => (
                <div key={i} className={`${styles.heapNode} ${i === 0 ? styles.heapMin : ''}`}>{val}</div>
              ))}
            </div>
          </div>
        )}

        {merged.length > 0 && (
          <div className={styles.mergedRow}>
            <span className={styles.mergedLabel}>Merged result</span>
            <div className={styles.mergedNodes}>
              {merged.map((val, i) => (
                <div key={i} className={styles.mergedNode}>{val}</div>
              ))}
            </div>
          </div>
        )}

        {step?.phase === 'complete' && (
          <div className={styles.resultBadge}>✅ Merged: [{merged.join(', ')}]</div>
        )}
      </div>
    </VisualizerShell>
  )
}
