import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './QueueStacks.module.css'

const TEST_CASES = [
  { label: 'Test 1 — LeetCode example', detail: 'push 1,2 → peek → pop → empty',
    ops: [['push',1],['push',2],['peek'],['pop'],['empty']] },
  { label: 'Test 2 — Interleaved', detail: 'push 3,4 → pop → push 5 → peek → pop',
    ops: [['push',3],['push',4],['pop'],['push',5],['peek'],['pop'],['empty']] },
  { label: 'Test 3 — Multiple transfers', detail: '3 pushes → 3 pops → empty check',
    ops: [['push',10],['push',20],['push',30],['pop'],['pop'],['pop'],['empty']] },
  { label: 'Test 4 — Push after pop', detail: 'Tests lazy transfer twice',
    ops: [['push',1],['push',2],['pop'],['push',3],['pop'],['pop'],['empty']] },
]

const ALGORITHMS = [
  { id: 'ds', name: 'Two-Stack Design', complexity: 'O(1) amortized push/pop · O(n) space' },
]

const CODE = {
  ds: [
    'class MyQueue:',
    '  inbox=[]; outbox=[]',
    '  function push(x): inbox.push(x)',
    '  function transfer():',
    '    while inbox: outbox.push(inbox.pop())',
    '  function pop():',
    '    if outbox empty: transfer()',
    '    return outbox.pop()',
    '  function peek():',
    '    if outbox empty: transfer()',
    '    return outbox.top',
    '  function empty(): inbox.empty && outbox.empty',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Inbox top (newest)' },
  { token: 'compare', label: 'Outbox top (oldest = front)' },
  { token: 'special', label: 'Transfer in progress' },
  { token: 'match',   label: 'Popped / peeked result' },
]

export default function QueueUsingStacksVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('ds')
  const [customCase,   setCustomCase]   = useState(null)
  const { ops } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(ops), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step
  const inbox  = step?.inbox  ?? []
  const outbox = step?.outbox ?? []
  const opResult = step?.result


  const customInputUI = (
    <CustomInput
      fields={[
          {
              "key": "ops",
              "label": "Ops (JSON)",
              "type": "text",
              "placeholder": "[[\"push\",1],[\"push\",2],[\"peek\"],[\"pop\"],[\"empty\"]]"
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
      stats={step ? {
        'Inbox size': inbox.length,
        'Outbox size': outbox.length,
        ...(opResult !== undefined ? { 'Last result': opResult } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.twoCol}>
          <div className={styles.col}>
            <div className={styles.colLabel}>Inbox (push →)</div>
            <div className={styles.stackCol}>
              {inbox.length === 0
                ? <span className={styles.empty}>empty</span>
                : [...inbox].reverse().map((v, i) => (
                  <span key={i} className={`${styles.cell} ${i === 0 ? styles.cellTop : ''}`}>{v}</span>
                ))}
            </div>
          </div>
          <div className={styles.arrow}>⇒</div>
          <div className={styles.col}>
            <div className={styles.colLabel}>Outbox (← pop)</div>
            <div className={styles.stackCol}>
              {outbox.length === 0
                ? <span className={styles.empty}>empty</span>
                : [...outbox].reverse().map((v, i) => (
                  <span key={i} className={`${styles.cell} ${styles.cellOut} ${i === 0 ? styles.cellOutTop : ''}`}>{v}</span>
                ))}
            </div>
          </div>
        </div>
        {opResult !== undefined && (
          <div className={styles.resultBadge}>Result: {String(opResult)}</div>
        )}
      </div>
    </VisualizerShell>
  )
}
