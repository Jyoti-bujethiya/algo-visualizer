import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './ReorgString.module.css'

const TEST_CASES = [
  { label: 'Test 1 — "aab"',      detail: '"aba"',     s: 'aab'      },
  { label: 'Test 2 — "aaab"',     detail: '""',         s: 'aaab'     },
  { label: 'Test 3 — "vvvlo"',    detail: '"vlvov"',    s: 'vvvlo'    },
  { label: 'Test 4 — "aabbcc"',   detail: 'e.g. "abcabc"', s: 'aabbcc' },
]

const ALGORITHMS = [
  { id: 'heap', name: 'Max-Heap + Greedy', complexity: 'O(n log k) time · O(k) space' },
]

const CODE = {
  heap: [
    'function reorganizeString(s):',
    '  freq = count frequencies',
    '  if any freq > ceil(n/2): return ""',
    '  heap = max-heap by freq',
    '  result = ""',
    '  while heap not empty:',
    '    (ca, a) = heap.pop()  // most frequent',
    '    result += a',
    '    if prev exists: heap.push(prev)',
    '    prev = (ca-1, a) if ca-1>0',
    '  return result',
  ],
}

const LEGEND = [
  { token: 'special', label: 'Max-heap root (most frequent)' },
  { token: 'match',   label: 'Placed in result' },
  { token: 'compare', label: 'Previous (held back)' },
]

export default function ReorganizeStringVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('heap')
  const [customCase,   setCustomCase]   = useState(null)
  const { s } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(s), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const heap   = step?.heap   ?? []
  const result = step?.result ?? ''


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "s",
                "label": "String",
                "type": "text",
                "placeholder": "aab"
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
      stats={step ? {
        'Input': s,
        'Built so far': result.length,
        ...(step.done ? { 'Result': result || '""' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.buildRow}>
          <span className={styles.buildLabel}>Building:</span>
          <span className={styles.buildStr}>"{result}"</span>
        </div>
        {step?.done && (
          <div className={`${styles.resultBadge} ${result ? styles.resultOk : styles.resultFail}`}>
            {result ? `"${result}"` : 'Impossible — return ""'}
          </div>
        )}
        <div className={styles.label}>Max-Heap (most frequent at root)</div>
        <div className={styles.heapRow}>
          {heap.length === 0
            ? <span className={styles.empty}>empty</span>
            : heap.map(([f, c], i) => (
              <span key={i} className={`${styles.heapCell} ${i === 0 ? styles.heapRoot : ''}`}>
                {c}<br /><span className={styles.freqLbl}>{f}</span>
              </span>
            ))
          }
        </div>
      </div>
    </VisualizerShell>
  )
}
