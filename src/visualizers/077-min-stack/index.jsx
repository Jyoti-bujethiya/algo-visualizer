import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './MinStack.module.css'

const TEST_CASES = [
  { label: 'Test 1 — LeetCode example', detail: 'push -3,push 0,push -2,...', ops:[['push',-3],['push',0],['push',-2],['getMin'],['pop'],['top'],['getMin']] },
  { label: 'Test 2 — Decreasing', detail: 'min always top', ops:[['push',5],['push',3],['push',1],['getMin'],['pop'],['getMin']] },
  { label: 'Test 3 — Increasing', detail: 'min stays after pops', ops:[['push',1],['push',2],['push',3],['getMin'],['pop'],['pop'],['getMin']] },
  { label: 'Test 4 — Mixed', detail: 'Multiple getMin calls', ops:[['push',2],['push',-1],['push',5],['getMin'],['pop'],['getMin'],['pop'],['getMin']] },
]

const ALGORITHMS = [
  { id: 'ds', name: 'Two-Stack Design', complexity: 'O(1) push/pop/getMin · O(n) space' },
]

const CODE = {
  ds: [
    'class MinStack:',
    '  stack=[]; minStack=[]',
    '  function push(val):',
    '    stack.push(val)',
    '    minStack.push(min(val, minStack.top ?? val))',
    '  function pop():',
    '    stack.pop(); minStack.pop()',
    '  function top(): return stack.top',
    '  function getMin(): return minStack.top',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Current operation' },
  { token: 'match',   label: 'Completed operation' },
  { token: 'compare', label: 'top() result' },
  { token: 'special', label: 'getMin() result' },
]

export default function MinStackVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('ds')
  const [customCase,   setCustomCase]   = useState(null)
  const { ops } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(ops), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step
  const stack      = step?.stack      ?? []
  const minStack   = step?.minStack   ?? []
  const currentMin = step?.currentMin


  const customInputUI = (
    <CustomInput
      fields={[
          {
              "key": "ops",
              "label": "Ops (JSON array of [op,val?])",
              "type": "text",
              "placeholder": "[[\"push\",-3],[\"push\",0],[\"getMin\"],[\"pop\"],[\"top\"]]"
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
      stats={step ? { 'Stack size': stack.length, ...(currentMin !== undefined && currentMin !== null ? {'Current min': currentMin} : {}) } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.twoCol}>
          <div className={styles.col}>
            <div className={styles.colLabel}>Main Stack</div>
            <div className={styles.stackCol}>
              {stack.length === 0
                ? <span className={styles.empty}>empty</span>
                : [...stack].reverse().map((v, i) => <span key={i} className={`${styles.stackCell} ${i === 0 ? styles.stackTop : ''}`}>{v}</span>)
              }
            </div>
          </div>
          <div className={styles.col}>
            <div className={styles.colLabel}>Min Stack</div>
            <div className={styles.stackCol}>
              {minStack.length === 0
                ? <span className={styles.empty}>empty</span>
                : [...minStack].reverse().map((v, i) => <span key={i} className={`${styles.stackCell} ${styles.minCell} ${i === 0 ? styles.stackTop : ''}`}>{v}</span>)
              }
            </div>
          </div>
        </div>
        {currentMin !== undefined && currentMin !== null && (
          <div className={styles.minBadge}>getMin() = {currentMin}</div>
        )}
      </div>
    </VisualizerShell>
  )
}
