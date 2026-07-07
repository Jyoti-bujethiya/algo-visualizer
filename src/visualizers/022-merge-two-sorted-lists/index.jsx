import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import LinkedListDisplay from '../../components/display/LinkedListDisplay.jsx'
import styles from './MergeTwoLists.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Standard', detail: '[1,2,4] + [1,3,4]', a: [1,2,4], b: [1,3,4] },
  { label: 'Test 2 — One empty', detail: '[] + [0]',          a: [],     b: [0] },
  { label: 'Test 3 — Both empty', detail: '[] + []',           a: [],     b: [] },
  { label: 'Test 4 — Longer',     detail: '[1,3,5,7] + [2,4,6,8]', a: [1,3,5,7], b: [2,4,6,8] },
  { label: 'Test 5 — All same',   detail: '[1,1,1] + [1,1]',   a: [1,1,1], b: [1,1] },
]

const ALGORITHMS = [
  { id: 'iterative', name: 'Iterative (Optimal)', complexity: 'O(m+n) time · O(1) space' },
  { id: 'recursive', name: 'Recursive',           complexity: 'O(m+n) time · O(m+n) space' },
]

const CODE = {
  iterative: [
    'dummy = new ListNode(0)',
    'cur = dummy',
    'while l1 and l2:',
    '  if l1.val <= l2.val:',
    '    cur.next = l1; l1 = l1.next',
    '  else:',
    '    cur.next = l2; l2 = l2.next',
    '  cur = cur.next',
    'cur.next = l1 or l2',
    'return dummy.next',
  ],
  recursive: [
    'merge(l1, l2):',
    '  if not l1: return l2',
    '  if not l2: return l1',
    '  if l1.val <= l2.val:',
    '    l1.next = merge(l1.next, l2)',
    '    return l1',
    '  else:',
    '    l2.next = merge(l1, l2.next)',
    '    return l2',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'List 1 pointer' },
  { token: 'compare',  label: 'List 2 pointer' },
  { token: 'match',    label: 'Merged / done' },
]

export default function MergeTwoSortedListsVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('iterative')
  const [customCase,   setCustomCase]   = useState(null)

  const { a, b } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, a, b), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const l1 = step?.l1 ?? a
  const l2 = step?.l2 ?? b
  const merged = step?.merged ?? []
  const { i = 0, j = 0 } = step?.pointers ?? {}

  const l1Nodes = l1.map((val, idx) => ({ val, id: idx, state: idx === i ? 'current' : '' }))
  const l2Nodes = l2.map((val, idx) => ({ val, id: idx, state: idx === j ? 'compare' : '' }))
  const mergedNodes = merged.map((val, idx) => ({ val, id: idx, state: 'match' }))

  const l1Ptrs = i >= 0 && i < l1.length ? { [i]: 'p1' } : {}
  const l2Ptrs = j >= 0 && j < l2.length ? { [j]: 'p2' } : {}


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "a",
                "label": "List 1",
                "type": "array",
                "placeholder": "1,2,4"
            },
            {
                "key": "b",
                "label": "List 2",
                "type": "array",
                "placeholder": "1,3,4"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ a: parsed.a, b: parsed.b }); hook.reset()
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
        'Merged length': merged.length,
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.listRow}>
          <span className={styles.listLabel}>List 1</span>
          {l1.length > 0
            ? <LinkedListDisplay nodes={l1Nodes} highlights={{}} pointers={l1Ptrs} />
            : <span className={styles.empty}>empty</span>}
        </div>
        <div className={styles.listRow}>
          <span className={styles.listLabel}>List 2</span>
          {l2.length > 0
            ? <LinkedListDisplay nodes={l2Nodes} highlights={{}} pointers={l2Ptrs} />
            : <span className={styles.empty}>empty</span>}
        </div>

        {merged.length > 0 && (
          <div className={styles.listRow}>
            <span className={styles.listLabel}>Merged</span>
            <LinkedListDisplay nodes={mergedNodes} highlights={{}} pointers={{}} />
          </div>
        )}

        {step?.phase === 'complete' && (
          <div className={styles.resultBadge}>
            ✅ Result: {merged.join(' → ')}
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
