import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import ArrayDisplay from '../../components/display/ArrayDisplay.jsx'
import styles from './Product.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Standard',  detail: '[1,2,3,4]',      nums: [1,2,3,4] },
  { label: 'Test 2 — With Zero', detail: '[-1,1,0,-3,3]',  nums: [-1,1,0,-3,3] },
  { label: 'Test 3 — Two',       detail: '[5,2]',           nums: [5,2] },
  { label: 'Test 4 — All Ones',  detail: '[1,1,1,1]',       nums: [1,1,1,1] },
  { label: 'Test 5 — Negatives', detail: '[-2,-3,4,-5]',   nums: [-2,-3,4,-5] },
]

const ALGORITHMS = [
  { id: 'optimal',      name: 'Optimal O(1) Space',      complexity: 'O(n) time · O(1) space' },
  { id: 'prefixSuffix', name: 'Prefix × Suffix Arrays',  complexity: 'O(n) time · O(n) space' },
]

const CODE = {
  optimal:      ['// Pass 1: prefix products', 'prefix=1; for i: result[i]=prefix; prefix*=nums[i]', '// Pass 2: suffix products', 'suffix=1; for i (reverse): result[i]*=suffix; suffix*=nums[i]'],
  prefixSuffix: ['// Build prefix[i] = product of nums[0..i-1]', 'for i: prefix[i]=prefix[i-1]*nums[i-1]', '// Build suffix[i] = product of nums[i+1..n-1]', 'for i (rev): suffix[i]=suffix[i+1]*nums[i+1]', '// Combine', 'for i: result[i]=prefix[i]*suffix[i]'],
}

const LEGEND = [
  { token: 'current', label: 'Current position' },
  { token: 'special', label: 'Prefix value used' },
  { token: 'compare', label: 'Suffix value used' },
  { token: 'match',   label: 'Result computed' },
]

export default function ProductVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('optimal')
  const [customCase,   setCustomCase]   = useState(null)

  const { nums } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, nums), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook = useVisualizer(steps)
  const step = hook.step

  const curPos = step?.currentPos ?? -1
  const phase  = step?.phase ?? ''

  const numHighlights    = curPos >= 0 ? [{ index: curPos, type: 'current' }] : []
  const resultHighlights = curPos >= 0 ? [{ index: curPos, type: phase === 'Result' || phase === 'Complete' ? 'match' : phase === 'Suffix' ? 'compare' : 'special' }] : []
  const curPointers      = curPos >= 0 ? [{ index: curPos, label: 'i' }] : []

  const result = step?.result ?? []
  const prefix = Array.isArray(step?.prefix) ? step.prefix : null
  const suffix = Array.isArray(step?.suffix) ? step.suffix : null


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "nums",
                "label": "Nums",
                "type": "array",
                "placeholder": "1,2,3,4,5"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ nums: parsed.nums }); hook.reset()
      }}
    />
  )

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest} onTestChange={i => { setCustomCase(null); setSelectedTest(i); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo} onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? { Phase: step.phase ?? '—', 'Prefix Val': step.prefixVal ?? '—', 'Suffix Val': step.suffixVal ?? '—' } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.row}><span className={styles.rowLabel}>Input</span><ArrayDisplay elements={nums} highlights={numHighlights} pointers={curPointers} showIndex /></div>
        {prefix && <div className={styles.row}><span className={styles.rowLabel}>Prefix</span><ArrayDisplay elements={prefix} highlights={[]} pointers={curPointers} showIndex /></div>}
        {suffix && <div className={styles.row}><span className={styles.rowLabel}>Suffix</span><ArrayDisplay elements={suffix} highlights={[]} pointers={curPointers} showIndex /></div>}
        {result.length > 0 && <div className={styles.row}><span className={styles.rowLabel}>Result</span><ArrayDisplay elements={result} highlights={resultHighlights} pointers={curPointers} showIndex /></div>}
      </div>
    </VisualizerShell>
  )
}
