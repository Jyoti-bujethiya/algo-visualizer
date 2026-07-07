import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import ArrayDisplay from '../../components/display/ArrayDisplay.jsx'
import styles from './Stack.module.css'

const TEST_CASES = [
  { label: 'Test 1 — "()"',       detail: 'true',   s: '()'       },
  { label: 'Test 2 — "()[]{}"',   detail: 'true',   s: '()[]{}'   },
  { label: 'Test 3 — "(]"',       detail: 'false',  s: '(]'       },
  { label: 'Test 4 — "([)]"',     detail: 'false',  s: '([)]'     },
]

const ALGORITHMS = [
  { id: 'stack', name: 'Stack', complexity: 'O(n) time · O(n) space' },
]

const CODE = {
  stack: [
    'function isValid(s):',
    '  stack = []',
    '  for each char c in s:',
    '    if c is open bracket: stack.push(c)',
    '    else: if empty or top != match: return false',
    '          stack.pop()',
    '  return stack.isEmpty()',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Current character' },
  { token: 'match',   label: 'Matched / pushed' },
  { token: 'error',   label: 'Mismatch' },
]

export default function ValidParenthesesVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('stack')
  const [customCase,   setCustomCase]   = useState(null)
  const { s } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(s), [selectedAlgo, selectedTest]) // eslint-disable-line
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
                "key": "s",
                "label": "String",
                "type": "text",
                "placeholder": "()[]{}"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ s: parsed.s }); hook.reset()
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
      stats={step ? { 'String': s, 'Stack depth': stack.length, ...(result !== undefined ? {'Valid': result ? 'Yes ✓' : 'No ✗'} : {}) } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.label}>Input string</div>
        <ArrayDisplay elements={s.split('')} highlights={arrHighlights} showIndex={false} />
        {result !== undefined && (
          <div className={`${styles.resultBadge} ${result ? styles.resultTrue : styles.resultFalse}`}>
            {result ? 'Valid ✓' : 'Invalid ✗'}
          </div>
        )}
        <div className={styles.label}>Stack (top →)</div>
        <div className={styles.stackRow}>
          {stack.length === 0
            ? <span className={styles.empty}>[ empty ]</span>
            : [...stack].reverse().map((c, i) => <span key={i} className={styles.stackCell}>{c}</span>)
          }
        </div>
      </div>
    </VisualizerShell>
  )
}
