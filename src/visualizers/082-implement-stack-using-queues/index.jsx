import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './StackQueues.module.css'

const TEST_CASES = [
  { label: 'Test 1 — LeetCode example', detail: 'push 1,2 → top → pop → empty',
    ops:[['push',1],['push',2],['top'],['pop'],['empty']] },
  { label: 'Test 2 — Three pushes', detail: 'LIFO order visible',
    ops:[['push',5],['push',3],['push',8],['top'],['pop'],['top'],['pop'],['pop'],['empty']] },
  { label: 'Test 3 — Interleaved', detail: 'push/pop mix',
    ops:[['push',1],['pop'],['push',2],['push',3],['top'],['pop'],['empty']] },
  { label: 'Test 4 — Single element', detail: 'edge case',
    ops:[['push',42],['top'],['pop'],['empty']] },
]

const ALGORITHMS = [
  { id: 'ds', name: 'One-Queue (rotate on push)', complexity: 'O(n) push · O(1) pop/top · O(n) space' },
]

const CODE = {
  ds: [
    'class MyStack:',
    '  queue=[]',
    '  function push(x):',
    '    queue.enqueue(x)',
    '    for i=0 to size-2: queue.enqueue(queue.dequeue())',
    '  function pop(): return queue.dequeue()',
    '  function top(): return queue.front',
    '  function empty(): return queue.empty',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Front = stack top' },
  { token: 'compare', label: 'Being rotated' },
  { token: 'match',   label: 'Popped result' },
]

export default function StackUsingQueuesVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('ds')
  const [customCase,   setCustomCase]   = useState(null)
  const { ops } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(ops), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step
  const queue    = step?.queue  ?? []
  const opResult = step?.result


  const customInputUI = (
    <CustomInput
      fields={[
          {
              "key": "ops",
              "label": "Ops (JSON)",
              "type": "text",
              "placeholder": "[[\"push\",1],[\"push\",2],[\"top\"],[\"pop\"],[\"empty\"]]"
          }
      ]}
      onApply={parsed => {
        const ops = JSON.parse(parsed.ops)
        setCustomCase({ ops }); hook.reset()
      }}
    />
  )

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      legend={LEGEND}
      stats={step ? { 'Queue size': queue.length, ...(opResult !== undefined ? { 'Last result': opResult } : {}) } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.label}>Queue (front = stack top)</div>
        <div className={styles.queueRow}>
          {queue.length === 0
            ? <span className={styles.empty}>[ empty ]</span>
            : queue.map((v, i) => (
              <span key={i} className={`${styles.cell} ${i === 0 ? styles.cellFront : ''}`}>
                {v}
                {i === 0 && <span className={styles.frontLabel}>top</span>}
              </span>
            ))
          }
        </div>
        {opResult !== undefined && (
          <div className={styles.resultBadge}>Result: {String(opResult)}</div>
        )}
      </div>
    </VisualizerShell>
  )
}
