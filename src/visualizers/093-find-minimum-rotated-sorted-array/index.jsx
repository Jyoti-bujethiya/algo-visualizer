import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './FindMin.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [3,4,5,1,2]',     detail: 'Min = 1',    nums: [3,4,5,1,2] },
  { label: 'Test 2 — [4,5,6,7,0,1,2]', detail: 'Min = 0',    nums: [4,5,6,7,0,1,2] },
  { label: 'Test 3 — [11,13,15,17]',   detail: 'Min = 11',   nums: [11,13,15,17] },
  { label: 'Test 4 — [2,1]',           detail: 'Min = 1',    nums: [2,1] },
]

const ALGORITHMS = [
  { id: 'binary', name: 'Binary Search', complexity: 'O(log n) time · O(1) space' },
]

const CODE = {
  binary: [
    'function findMin(nums):',
    '  lo = 0, hi = nums.length - 1',
    '  while lo < hi:',
    '    mid = (lo + hi) >>> 1',
    '    if nums[mid] > nums[hi]:   // min in right half',
    '      lo = mid + 1',
    '    else:                       // min at mid or left',
    '      hi = mid',
    '  return nums[lo]',
  ],
}

const LEGEND = [
  { token: 'special', label: 'lo / hi bounds' },
  { token: 'current', label: 'mid (being checked)' },
  { token: 'compare', label: 'Active search range' },
  { token: 'match',   label: 'Minimum found!' },
]

function getCellClass(i, highlights, styles) {
  const hl = highlights[i]
  if (hl === 'match')   return styles.cellMatch
  if (hl === 'current') return styles.cellCurrent
  if (hl === 'compare') return styles.cellCompare
  if (hl === 'special') return styles.cellSpecial
  return ''
}

export default function FindMinVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('binary')
  const [customCase,   setCustomCase]   = useState(null)

  const { nums } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(nums), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const highlights = step?.highlights ?? {}
  const lo     = step?.lo ?? 0
  const hi     = step?.hi ?? nums.length - 1
  const mid    = step?.mid ?? -1
  const result = step?.result


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "nums",
                "label": "Rotated nums",
                "type": "array",
                "placeholder": "3,4,5,1,2"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ nums: parsed.nums }); hook.reset()
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
        'lo': lo,
        'hi': hi,
        ...(mid >= 0 ? { 'mid': mid, 'nums[mid]': nums[mid] } : {}),
        ...(result !== undefined ? { 'Minimum': result } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {result !== undefined && (
          <div className={styles.resultBadge}>
            Minimum = {result}
          </div>
        )}
        <div className={styles.arrayWrap}>
          <div className={styles.arrayRow}>
            {nums.map((v, i) => (
              <div key={i} className={`${styles.cell} ${getCellClass(i, highlights, styles)}`}>
                {v}
              </div>
            ))}
          </div>
          <div className={styles.pointerRow}>
            {nums.map((_, i) => (
              <div key={i} className={`${styles.ptr} ${i === mid ? styles.ptrMid : (i === lo || i === hi) ? styles.ptrLo : ''}`}>
                {i === lo && i === hi ? 'lo=hi' : i === lo ? 'lo' : i === hi ? 'hi' : i === mid ? 'mid' : ''}
              </div>
            ))}
          </div>
          <div className={styles.label}>indices</div>
          <div className={styles.arrayRow}>
            {nums.map((_, i) => (
              <div key={i} className={styles.ptr}>{i}</div>
            ))}
          </div>
        </div>
      </div>
    </VisualizerShell>
  )
}
