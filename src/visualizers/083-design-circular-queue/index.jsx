import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './CircularQueue.module.css'

const TEST_CASES = [
  { label: 'Test 1 — k=3, LeetCode', detail: 'enQ 1,2,3 → Rear → isFull → deQ → enQ 4',
    k:3, ops:[['enQueue',1],['enQueue',2],['enQueue',3],['Rear'],['isFull'],['deQueue'],['enQueue',4],['Rear'],['Front'],['deQueue'],['Front']] },
  { label: 'Test 2 — k=4, wrap-around', detail: 'fill → drain half → fill again',
    k:4, ops:[['enQueue',10],['enQueue',20],['enQueue',30],['enQueue',40],['deQueue'],['deQueue'],['enQueue',50],['enQueue',60],['Front'],['Rear']] },
  { label: 'Test 3 — k=2, edge cases', detail: 'overflow + underflow',
    k:2, ops:[['enQueue',1],['enQueue',2],['enQueue',3],['Rear'],['deQueue'],['deQueue'],['deQueue'],['isEmpty']] },
  { label: 'Test 4 — k=5, single ops', detail: 'front/rear on empty',
    k:5, ops:[['isEmpty'],['isFull'],['enQueue',7],['Front'],['Rear'],['deQueue'],['isEmpty']] },
]

const ALGORITHMS = [
  { id: 'ds', name: 'Ring Buffer (head/tail/count)', complexity: 'O(1) all ops · O(k) space' },
]

const CODE = {
  ds: [
    'class MyCircularQueue(k):',
    '  buf=[k slots]; head=0; tail=0; count=0',
    '  function enQueue(val):',
    '    if isFull: return false',
    '    buf[tail]=val; tail=(tail+1)%k; count++',
    '  function deQueue():',
    '    if isEmpty: return false',
    '    head=(head+1)%k; count--',
    '  function Front(): buf[head] if !empty',
    '  function Rear(): buf[(tail-1+k)%k] if !empty',
    '  function isEmpty(): count==0',
    '  function isFull(): count==k',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Head (front)' },
  { token: 'compare', label: 'Tail (next write)' },
  { token: 'match',   label: 'Occupied slot' },
  { token: 'discard', label: 'Empty slot' },
]

export default function CircularQueueVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('ds')
  const [customCase,   setCustomCase]   = useState(null)
  const { k, ops } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(k, ops), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step
  const buf    = step?.buf    ?? new Array(k).fill(null)
  const head   = step?.head   ?? 0
  const tail   = step?.tail   ?? 0
  const count  = step?.count  ?? 0
  const opResult = step?.result


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "k",
                "label": "Capacity k",
                "type": "number",
                "placeholder": "3"
            },
            {
                "key": "ops",
                "label": "Ops (JSON array)",
                "type": "text",
                "placeholder": "[[\"enQueue\",1],[\"enQueue\",2],[\"deQueue\"],[\"Front\"]]"
            }
        ]}
      onApply={parsed => {
        const ops = JSON.parse(parsed.ops)
        setCustomCase({ k, ops }); hook.reset()
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
      stats={step ? { 'Capacity': k, 'Count': count, 'Head': head, 'Tail': tail, ...(opResult !== undefined ? { 'Last result': String(opResult) } : {}) } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.ring}>
          {buf.map((v, i) => {
            const isHead = i === head && count > 0
            const isTail = i === (tail === 0 ? k - 1 : tail - 1) && count > 0
            const occupied = v !== null
            return (
              <div key={i} className={`${styles.slot} ${occupied ? styles.slotFilled : styles.slotEmpty} ${isHead ? styles.slotHead : ''} ${isTail ? styles.slotTail : ''}`}>
                <span className={styles.slotVal}>{v !== null ? v : '·'}</span>
                <span className={styles.slotIdx}>[{i}]</span>
                {isHead && <span className={styles.pointer}>H</span>}
                {isTail && !isHead && <span className={`${styles.pointer} ${styles.pointerTail}`}>T</span>}
              </div>
            )
          })}
        </div>
        {opResult !== undefined && (
          <div className={styles.resultBadge}>Result: {String(opResult)}</div>
        )}
      </div>
    </VisualizerShell>
  )
}
