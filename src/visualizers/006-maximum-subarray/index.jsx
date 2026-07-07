import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import PointerLabel from '../../components/display/PointerLabel.jsx'
import styles from './MaxSubarray.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Classic',    detail: '[-2,1,-3,4,-1,2,1,-5,4]', nums: [-2,1,-3,4,-1,2,1,-5,4] },
  { label: 'Test 2 — All Neg',    detail: '[-2,-3,-1,-4]',            nums: [-2,-3,-1,-4] },
  { label: 'Test 3 — All Pos',    detail: '[1,2,3,4,5]',              nums: [1,2,3,4,5] },
  { label: 'Test 4 — Single',     detail: '[5]',                       nums: [5] },
  { label: 'Test 5 — Mixed',      detail: '[5,-3,5]',                  nums: [5,-3,5] },
]

const ALGORITHMS = [
  { id: 'kadane',  name: "Kadane's Algorithm",  complexity: 'O(n) time · O(1) space' },
  { id: 'brute',   name: 'Brute Force',          complexity: 'O(n²) time · O(1) space' },
  { id: 'divconq', name: 'Divide & Conquer',     complexity: 'O(n log n) time · O(log n) space' },
]

const CODE = {
  kadane:  ['cur = best = nums[0]', 'for i in 1..n-1:', '  cur = max(nums[i], cur+nums[i])', '  best = max(best, cur)', 'return best'],
  brute:   ['best = -∞', 'for i in 0..n-1:', '  cur = 0', '  for j in i..n-1:', '    cur += nums[j]', '    best = max(best, cur)', 'return best'],
  divconq: ['solve(l, r):', '  mid = (l+r)/2', '  L = solve(l, mid)', '  R = solve(mid+1, r)', '  C = maxCross(l, mid, r)', '  return max(L, R, C)'],
}

const LEGEND = [
  { token: 'current', label: 'Current pointer' },
  { token: 'match',   label: 'Best subarray window' },
  { token: 'special', label: 'New maximum found' },
  { token: 'compare', label: 'Range being examined' },
]

export default function MaxSubarrayVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('kadane')
  const [customCase,   setCustomCase]   = useState(null)

  const { nums } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, nums), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const wStart = step?.windowStart ?? -1
  const wEnd   = step?.windowEnd   ?? -1
  const maxAbs = Math.max(...nums.map(Math.abs), 1)
  const BAR_H  = 140

  const getState = (i) => {
    if (!step) return ''
    if (step.complete && i >= wStart && i <= wEnd) return 'match'
    if (step.newMax   && i >= wStart && i <= wEnd) return 'special'
    if (i >= wStart   && i <= wEnd)                return 'current'
    if (step.rangeStart !== undefined && i >= step.rangeStart && i <= step.rangeEnd) return 'compare'
    return ''
  }


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "nums",
                "label": "Nums",
                "type": "array",
                "placeholder": "-2,1,-3,4,-1,2,1,-5,4"
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
      onTestChange={i => { setCustomCase(null); setSelectedTest(i); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'Current Sum': step.currentSum !== undefined ? step.currentSum : '—',
        'Max Sum':     step.bestSum !== undefined && step.bestSum !== -Infinity ? step.bestSum : '—',
        'Window':      wStart >= 0 && wEnd >= 0 ? `[${wStart}..${wEnd}]` : '—',
        'Array Size':  nums.length,
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.bars}>
          {nums.map((val, i) => {
            const state  = getState(i)
            const isNeg  = val < 0
            const px     = Math.max(Math.abs(val) / maxAbs * BAR_H, 6)
            // Pointer labels: current scanning index, and window boundaries
            const isCur  = step?.current === i
            const isWinL = step && i === step.windowStart && step.windowStart >= 0
            const isWinR = step && i === step.windowEnd   && step.windowEnd   >= 0
            return (
              <div key={i} className={`${styles.barWrap} ${state ? styles[state] : ''}`}>
                <div className={styles.ptrRow}>
                  {isCur  && <PointerLabel label="i"  type="current" />}
                  {!isCur && isWinL && <PointerLabel label="L" type="compare" />}
                  {!isCur && isWinR && <PointerLabel label="R" type="compare" />}
                </div>
                <div className={`${styles.valLabel} ${isNeg ? styles.negLabel : ''}`}>{val}</div>
                <div className={`${styles.bar} ${isNeg ? styles.barNeg : styles.barPos}`}
                     style={{ height: `${px}px` }} />
                <div className={styles.idxLabel}>{i}</div>
              </div>
            )
          })}
        </div>
        {step?.complete && wStart >= 0 && (
          <div className={styles.answerBadge}>
            Max subarray: [{nums.slice(wStart, wEnd + 1).join(', ')}] = {step.bestSum}
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
