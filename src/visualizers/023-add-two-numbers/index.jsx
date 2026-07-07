import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import LinkedListDisplay from '../../components/display/LinkedListDisplay.jsx'
import styles from './AddTwoNumbers.module.css'

const TEST_CASES = [
  { label: 'Test 1 — 342 + 465', detail: '[2,4,3] + [5,6,4] = 807', a: [2,4,3], b: [5,6,4] },
  { label: 'Test 2 — 0 + 0',     detail: '[0] + [0] = 0',            a: [0],     b: [0] },
  { label: 'Test 3 — Carry',      detail: '[9,9,9] + [9,9,9,9]',     a: [9,9,9], b: [9,9,9,9] },
  { label: 'Test 4 — 99 + 1',    detail: '[9,9] + [1] = 100',        a: [9,9],   b: [1] },
  { label: 'Test 5 — 5 + 5',     detail: '[5] + [5] = 10',           a: [5],     b: [5] },
]

const ALGORITHMS = [
  { id: 'sim', name: 'Digit-by-Digit (Optimal)', complexity: 'O(max(m,n)) time · O(max(m,n)) space' },
]

const CODE = {
  sim: [
    'dummy = curr = ListNode(0)',
    'carry = 0',
    'while l1 or l2 or carry:',
    '  d1 = l1.val if l1 else 0',
    '  d2 = l2.val if l2 else 0',
    '  total = d1 + d2 + carry',
    '  carry = total // 10',
    '  curr.next = ListNode(total % 10)',
    '  curr = curr.next',
    '  if l1: l1 = l1.next',
    '  if l2: l2 = l2.next',
    'return dummy.next',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'Active digit (list 1)' },
  { token: 'compare',  label: 'Active digit (list 2)' },
  { token: 'match',    label: 'Result digit written' },
  { token: 'special',  label: 'Carry forward' },
]

export default function AddTwoNumbersVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('sim')
  const [customCase,   setCustomCase]   = useState(null)

  const { a, b } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, a, b), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const d1     = step?.d1 ?? a
  const d2     = step?.d2 ?? b
  const result = step?.result ?? []
  const { i = 0, j = 0, carry = 0 } = step?.pointers ?? {}

  const d1Nodes = d1.map((val, idx) => ({ val, id: idx, state: idx === i ? 'current' : '' }))
  const d2Nodes = d2.map((val, idx) => ({ val, id: idx, state: idx === j ? 'compare' : '' }))
  const resNodes = result.map((val, idx) => ({ val, id: idx, state: 'match' }))

  const d1Ptrs = i >= 0 && i < d1.length ? { [i]: 'p1' } : {}
  const d2Ptrs = j >= 0 && j < d2.length ? { [j]: 'p2' } : {}


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "a",
                "label": "Digits 1",
                "type": "array",
                "placeholder": "2,4,3"
            },
            {
                "key": "b",
                "label": "Digits 2",
                "type": "array",
                "placeholder": "5,6,4"
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
        'Carry': carry,
        'Column': Math.max(i, j) >= 0 ? Math.max(i, j) : '—',
        'Result digits': result.length,
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.listRow}>
          <span className={styles.listLabel}>List 1 (digits, LSB first)</span>
          {d1.length > 0
            ? <LinkedListDisplay nodes={d1Nodes} highlights={{}} pointers={d1Ptrs} />
            : <span className={styles.empty}>empty</span>}
        </div>
        <div className={styles.listRow}>
          <span className={styles.listLabel}>List 2 (digits, LSB first)</span>
          {d2.length > 0
            ? <LinkedListDisplay nodes={d2Nodes} highlights={{}} pointers={d2Ptrs} />
            : <span className={styles.empty}>empty</span>}
        </div>

        {carry > 0 && step?.phase !== 'complete' && (
          <div className={styles.carryBadge}>Carry: {carry}</div>
        )}

        {result.length > 0 && (
          <div className={styles.listRow}>
            <span className={styles.listLabel}>Result (LSB first)</span>
            <LinkedListDisplay nodes={resNodes} highlights={{}} pointers={{}} />
          </div>
        )}

        {step?.phase === 'complete' && (
          <div className={styles.resultBadge}>
            ✅ Result: {result.join(' → ')}
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
