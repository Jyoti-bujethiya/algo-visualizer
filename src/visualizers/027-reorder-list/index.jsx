import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import LinkedListDisplay from '../../components/display/LinkedListDisplay.jsx'
import styles from './ReorderList.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Five nodes',  detail: '1→2→3→4→5',  arr: [1,2,3,4,5] },
  { label: 'Test 2 — Four nodes',  detail: '1→2→3→4',    arr: [1,2,3,4] },
  { label: 'Test 3 — Three nodes', detail: '1→2→3',       arr: [1,2,3] },
  { label: 'Test 4 — Two nodes',   detail: '1→2',         arr: [1,2] },
  { label: 'Test 5 — Six nodes',   detail: '1→2→3→4→5→6', arr: [1,2,3,4,5,6] },
]

const ALGORITHMS = [
  { id: 'three-step', name: 'Find-Mid + Reverse + Interleave', complexity: 'O(n) time · O(1) space' },
]

const CODE = {
  'three-step': [
    '# Step 1: find middle',
    'slow = fast = head',
    'while fast.next and fast.next.next:',
    '  slow = slow.next; fast = fast.next.next',
    '# Step 2: reverse second half',
    'prev, cur = None, slow.next',
    'slow.next = None',
    'while cur: cur.next, prev, cur = prev, cur, cur.next',
    '# Step 3: interleave',
    'l1, l2 = head, prev',
    'while l2:',
    '  l1.next, l2.next = l2, l1.next',
    '  l1, l2 = l1.next, l2',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'slow pointer (mid-finding)' },
  { token: 'special',  label: 'fast pointer (mid-finding)' },
  { token: 'compare',  label: 'First half' },
  { token: 'match',    label: 'Interleaved result' },
]

export default function ReorderListVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('three-step')
  const [customCase,   setCustomCase]   = useState(null)

  const { arr } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, arr), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const nodes = step?.nodes ?? arr.map((val, i) => ({ val, id: i }))
  const ptrs  = step?.pointers ?? {}

  const hlMap = {}
  nodes.forEach((nd, i) => { if (nd.state) hlMap[i] = nd.state })

  // For reverse-done phase, show first and second halves separately
  const showHalves = step?.phase === 'reverse-done' && step?.first && step?.second
  const firstNodes  = showHalves ? step.first.map((v, i) => ({ val: v, id: i, state: 'compare' })) : []
  const secondNodes = showHalves ? step.second.map((v, i) => ({ val: v, id: i, state: 'special' })) : []


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "arr",
                "label": "List values",
                "type": "array",
                "placeholder": "1,2,3,4"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ arr: parsed.arr }); hook.reset()
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
        ...(step.mid !== undefined ? { 'Mid index': step.mid } : {}),
        ...(step.result ? { 'Result': step.result.join(' → ') } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {showHalves ? (
          <>
            <div className={styles.listRow}>
              <span className={styles.listLabel}>First half</span>
              <LinkedListDisplay nodes={firstNodes} highlights={{}} pointers={{}} />
            </div>
            <div className={styles.listRow}>
              <span className={styles.listLabel}>Second half (reversed)</span>
              <LinkedListDisplay nodes={secondNodes} highlights={{}} pointers={{}} />
            </div>
          </>
        ) : (
          <LinkedListDisplay nodes={nodes.map((n, i) => ({ ...n, state: hlMap[i] ?? n.state }))} highlights={hlMap} pointers={ptrs} />
        )}

        {step?.phase === 'complete' && step?.result && (
          <div className={styles.resultBadge}>
            ✅ Reordered: {step.result.join(' → ')}
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
