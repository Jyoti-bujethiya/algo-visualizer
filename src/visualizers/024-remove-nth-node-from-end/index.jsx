import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import LinkedListDisplay from '../../components/display/LinkedListDisplay.jsx'
import styles from './RemoveNth.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Middle',  detail: '[1,2,3,4,5], n=2',  arr: [1,2,3,4,5], n: 2 },
  { label: 'Test 2 — Head',    detail: '[1,2], n=2',         arr: [1,2],       n: 2 },
  { label: 'Test 3 — Tail',    detail: '[1,2,3], n=1',       arr: [1,2,3],     n: 1 },
  { label: 'Test 4 — Single',  detail: '[1], n=1',           arr: [1],         n: 1 },
  { label: 'Test 5 — Longer',  detail: '[1,2,3,4,5,6], n=3', arr: [1,2,3,4,5,6], n: 3 },
]

const ALGORITHMS = [
  { id: 'two-pass',    name: 'Two-Pass',           complexity: 'O(n) time · O(1) space' },
  { id: 'two-pointer', name: 'Two-Pointer (1-pass)', complexity: 'O(n) time · O(1) space' },
]

const CODE = {
  'two-pass': [
    'length = count(list)',
    'target = length - n',
    'if target == 0: return head.next',
    'cur = head',
    'for i in range(target - 1): cur = cur.next',
    'cur.next = cur.next.next',
    'return head',
  ],
  'two-pointer': [
    'dummy.next = head',
    'fast = slow = dummy',
    'for _ in range(n+1): fast = fast.next',
    'while fast:',
    '  fast = fast.next',
    '  slow = slow.next',
    'slow.next = slow.next.next',
    'return dummy.next',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'fast pointer' },
  { token: 'compare',  label: 'slow pointer' },
  { token: 'special',  label: 'Target node' },
  { token: 'match',    label: 'Kept / result' },
]

export default function RemoveNthNodeVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('two-pass')
  const [customCase,   setCustomCase]   = useState(null)

  const { arr, n } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, arr, n), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const nodes = step?.nodes ?? arr.map((val, i) => ({ val, id: i }))
  const ptrs  = step?.pointers ?? {}

  const hlMap = {}
  nodes.forEach((nd, i) => { if (nd.state) hlMap[i] = nd.state })

  const dispNodes = nodes.map((n, i) => ({ ...n, state: hlMap[i] ?? n.state }))


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "arr",
                "label": "List values",
                "type": "array",
                "placeholder": "1,2,3,4,5"
            },
            {
                "key": "n",
                "label": "n (from end)",
                "type": "number",
                "placeholder": "2"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ arr: parsed.arr, n: parsed.n }); hook.reset()
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
        'Phase':  step.phase ?? '—',
        'N':      n,
        ...(step.targetIdx !== undefined ? { 'Target index': step.targetIdx } : {}),
        ...(step.result ? { 'Result': step.result.join(' → ') } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.listRow}>
          <span className={styles.listLabel}>List (removing {n}th from end)</span>
          <LinkedListDisplay nodes={dispNodes} highlights={hlMap} pointers={ptrs} />
        </div>

        {step?.phase === 'complete' && step?.result && (
          <div className={styles.resultBadge}>
            ✅ Result: {step.result.join(' → ')}
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
