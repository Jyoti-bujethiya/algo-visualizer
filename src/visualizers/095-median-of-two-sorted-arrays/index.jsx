import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './Median.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [1,3]+[2]',        detail: 'Median = 2.0',   nums1: [1,3],    nums2: [2] },
  { label: 'Test 2 — [1,2]+[3,4]',      detail: 'Median = 2.5',   nums1: [1,2],    nums2: [3,4] },
  { label: 'Test 3 — [0,0]+[0,0]',      detail: 'Median = 0.0',   nums1: [0,0],    nums2: [0,0] },
  { label: 'Test 4 — [1,3,5]+[2,4,6]',  detail: 'Median = 3.5',   nums1: [1,3,5],  nums2: [2,4,6] },
]

const ALGORITHMS = [
  { id: 'merge',   name: 'Merge & Find',       complexity: 'O(m+n) time · O(m+n) space' },
  { id: 'binary',  name: 'Binary Partition',    complexity: 'O(log(min(m,n))) time · O(1) space' },
]

const CODE = {
  merge: [
    'function findMedianSortedArrays(nums1, nums2):',
    '  merged = merge(nums1, nums2)',
    '  n = merged.length',
    '  if n is odd: return merged[n/2]',
    '  else: return (merged[n/2-1] + merged[n/2]) / 2',
  ],
  binary: [
    'function findMedianSortedArrays(nums1, nums2):',
    '  ensure m <= n; partition on shorter array',
    '  lo=0, hi=m',
    '  while lo <= hi:',
    '    px = (lo+hi)/2;  py = (m+n+1)/2 - px',
    '    maxLeftX = nums1[px-1] or -Inf',
    '    minRightX = nums1[px] or +Inf',
    '    maxLeftY = nums2[py-1] or -Inf',
    '    minRightY = nums2[py] or +Inf',
    '    if maxLeftX <= minRightY && maxLeftY <= minRightX: found!',
    '    else if maxLeftX > minRightY: hi = px-1',
    '    else: lo = px+1',
    '    compute median from partition',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Being compared / partition point' },
  { token: 'compare', label: 'Active range / merged' },
  { token: 'special', label: 'Partition boundary' },
  { token: 'match',   label: 'Median element(s)' },
]

function getCellClass(key, highlights, styles) {
  const hl = highlights[key]
  if (hl === 'match')   return styles.cellMatch
  if (hl === 'current') return styles.cellCurrent
  if (hl === 'compare') return styles.cellCompare
  if (hl === 'special') return styles.cellSpecial
  return ''
}

export default function MedianTwoArraysVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('merge')
  const [customCase,   setCustomCase]   = useState(null)

  const { nums1, nums2 } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, nums1, nums2), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const highlights = step?.highlights ?? {}
  const merged     = step?.merged
  const median     = step?.median
  const px         = step?.px
  const py         = step?.py


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "nums1",
                "label": "Array 1",
                "type": "array",
                "placeholder": "1,3"
            },
            {
                "key": "nums2",
                "label": "Array 2",
                "type": "array",
                "placeholder": "2"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ nums1: parsed.nums1, nums2: parsed.nums2 }); hook.reset()
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
        'nums1 len': nums1.length,
        'nums2 len': nums2.length,
        ...(px !== undefined ? { 'px': px, 'py': py } : {}),
        ...(median !== undefined ? { 'Median': median } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {median !== undefined && (
          <div className={styles.resultBadge}>Median = {median}</div>
        )}
        <div className={styles.twoArrays}>
          <div className={styles.arrayBlock}>
            <div className={styles.arrayTitle}>nums1</div>
            <div className={styles.arrayRow}>
              {nums1.map((v, i) => (
                <div key={i} className={`${styles.cell} ${getCellClass(`a${i}`, highlights, styles)}`}>
                  {v}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.arrayBlock}>
            <div className={styles.arrayTitle}>nums2</div>
            <div className={styles.arrayRow}>
              {nums2.map((v, i) => (
                <div key={i} className={`${styles.cell} ${getCellClass(`b${i}`, highlights, styles)}`}>
                  {v}
                </div>
              ))}
            </div>
          </div>
        </div>
        {merged && merged.length > 0 && (
          <>
            <div className={styles.label}>Merged</div>
            <div className={styles.mergedRow}>
              {merged.map((v, i) => (
                <div key={i} className={`${styles.mergedCell} ${getCellClass(`m${i}`, highlights, styles) === styles.cellMatch ? styles.mergedCellMatch : ''}`}>
                  {v}
                </div>
              ))}
            </div>
          </>
        )}
        {px !== undefined && step?.maxLeftX !== undefined && (
          <div className={styles.partitionInfo}>
            <span className={styles.partCell}>maxL_A={step.maxLeftX === -Infinity ? '-∞' : step.maxLeftX}</span>
            <span className={styles.partCell}>minR_A={step.minRightX === Infinity ? '+∞' : step.minRightX}</span>
            <span className={styles.partCell}>maxL_B={step.maxLeftY === -Infinity ? '-∞' : step.maxLeftY}</span>
            <span className={styles.partCell}>minR_B={step.minRightY === Infinity ? '+∞' : step.minRightY}</span>
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
