import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import ArrayDisplay from '../../components/display/ArrayDisplay.jsx'
import styles from './RPN.module.css'

const TEST_CASES = [
  { label: 'Test 1 — ["2","1","+","3","*"]',       detail: '9',   tokens:['2','1','+','3','*'] },
  { label: 'Test 2 — ["4","13","5","/","+"]',       detail: '6',   tokens:['4','13','5','/','+'  ] },
  { label: 'Test 3 — ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]', detail: '22', tokens:['10','6','9','3','+','-11','*','/','*','17','+','5','+'] },
  { label: 'Test 4 — ["3","4","+","2","*","7","/"]', detail: '2',   tokens:['3','4','+','2','*','7','/'] },
]

const ALGORITHMS = [
  { id: 'stack', name: 'Stack', complexity: 'O(n) time · O(n) space' },
]

const CODE = {
  stack: [
    'function evalRPN(tokens):',
    '  stack = []',
    '  for each token:',
    '    if token is number: stack.push(token)',
    '    else (operator):',
    '      b = stack.pop(); a = stack.pop()',
    '      stack.push(apply(a, op, b))',
    '  return stack.pop()',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Current token' },
  { token: 'match',   label: 'Pushed to stack' },
  { token: 'compare', label: 'Operator — pop 2, push result' },
]

export default function RPNVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('stack')
  const [customCase,   setCustomCase]   = useState(null)
  const { tokens } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(tokens), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step
  const stack      = step?.stack      ?? []
  const highlights = step?.highlights ?? {}
  const result     = step?.result
  const arrHighlights = Object.entries(highlights).map(([k, v]) => ({ index: Number(k), type: v }))


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "tokens",
                "label": "RPN tokens (space-sep)",
                "type": "text",
                "placeholder": "2 1 + 3 *"
            }
        ]}
      onApply={parsed => {
        const tokens = parsed.tokens.trim().split(/\s+/)
        setCustomCase({ tokens }); hook.reset()
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
      stats={step ? { 'Tokens': tokens.length, 'Stack depth': stack.length, ...(result !== undefined ? {'Result': result} : {}) } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.label}>Tokens</div>
        <ArrayDisplay elements={tokens} highlights={arrHighlights} showIndex={false} />
        {result !== undefined && (
          <div className={styles.resultBadge}>Result: {result}</div>
        )}
        <div className={styles.label}>Stack (top →)</div>
        <div className={styles.stackRow}>
          {stack.length === 0
            ? <span className={styles.empty}>[ empty ]</span>
            : [...stack].reverse().map((v, i) => <span key={i} className={`${styles.stackCell} ${i === 0 ? styles.stackTop : ''}`}>{v}</span>)
          }
        </div>
      </div>
    </VisualizerShell>
  )
}
