import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import PointerLabel from '../../components/display/PointerLabel.jsx'
import styles from './SlidingWindowMax.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Classic',       detail: '[1,3,-1,-3,5,3,6,7] k=3', nums: [1,3,-1,-3,5,3,6,7], k: 3 },
  { label: 'Test 2 — All same',       detail: '[2,2,2,2,2] k=3',          nums: [2,2,2,2,2],          k: 3 },
  { label: 'Test 3 — Decreasing',     detail: '[5,4,3,2,1] k=2',          nums: [5,4,3,2,1],          k: 2 },
  { label: 'Test 4 — Single window',  detail: '[1,3,1,2,0,5] k=6',        nums: [1,3,1,2,0,5],        k: 6 },
  { label: 'Test 5 — k=1',            detail: '[4,2,7,1,9] k=1',          nums: [4,2,7,1,9],          k: 1 },
]

const ALGORITHMS = [
  { id: 'deque', name: 'Monotonic Deque', complexity: 'O(n) time · O(k) space' },
  { id: 'brute', name: 'Brute Force',     complexity: 'O(n·k) time · O(1) space' },
]

const CODE = {
  deque: ['deque = [] (stores indices)', 'for i in 0..n-1:', '  while dq.front < i-k+1: pop front', '  while nums[dq.back] <= nums[i]: pop back', '  deque.push(i)', '  if i >= k-1: result.append(nums[dq.front])'],
  brute: ['for i in 0..n-k:', '  maxVal = nums[i]', '  for j in i..i+k-1:', '    maxVal = max(maxVal, nums[j])', '  result.append(maxVal)'],
}

const LEGEND = [
  { token: 'current',  label: 'Current element (i)' },
  { token: 'compare',  label: 'In deque (candidates)' },
  { token: 'match',    label: 'Window max recorded' },
  { token: 'discard',  label: 'Popped — useless / out of window' },
  { token: 'special',  label: 'Final result' },
]

export default function SlidingWindowMaxVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('deque')
  const [customCase,   setCustomCase]   = useState(null)

  const { nums, k } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, nums, k), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const maxAbs = Math.max(...nums.map(Math.abs), 1)

  const getState = (i) => {
    if (!step) return ''
    if (step.complete)                          return 'special'
    if (step.recording && i >= step.winL && i <= step.winR) return 'match'
    if (step.removing === i || step.popping === i)           return 'discard'
    if (step.scanning === i)                    return 'current'
    if (step.right === i)                       return 'current'
    if (step.deque?.includes(i))                return 'compare'
    if (i >= step.winL && i <= step.winR)       return 'compare'
    return ''
  }


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "nums",
                "label": "Nums",
                "type": "array",
                "placeholder": "1,3,-1,-3,5,3,6,7"
            },
            {
                "key": "k",
                "label": "k",
                "type": "number",
                "placeholder": "3"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ nums: parsed.nums, k: parsed.k }); hook.reset()
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
        'Right (i)': step.right >= 0 ? step.right : '—',
        'Window':    step.winR >= 0 ? `[${step.winL}..${step.winR}]` : '—',
        'Deque vals': step.deque?.length ? `[${step.deque.map(i => nums[i]).join(',')}]` : '—',
        'Results':   step.result?.length ?? 0,
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Bar chart */}
        <div className={styles.bars}>
          {nums.map((val, i) => {
            const state = getState(i)
            const isNeg = val < 0
            const px    = Math.max(Math.abs(val) / maxAbs * 130, 6)
            const isRight = step && step.right === i
            const isWinL  = step && step.winL === i && i <= (step.winR ?? -1)
            const isWinR  = step && step.winR === i && step.winR >= (step.winL ?? 0)
            const isMax   = step && step.maxIdx === i && i >= (step.winL ?? 0) && i <= (step.winR ?? 0)
            return (
              <div key={i} className={`${styles.barWrap} ${state ? styles[state] : ''}`}>
                <div className={styles.ptrRow}>
                  {isRight && <PointerLabel label="i"   type="current" />}
                  {!isRight && isWinL && <PointerLabel label="L" type="compare" />}
                  {!isRight && isWinR && <PointerLabel label="R" type="compare" />}
                  {isMax   && <PointerLabel label="max" type="match"   />}
                </div>
                <div className={styles.valLabel}>{val}</div>
                <div className={`${styles.bar} ${isNeg ? styles.barNeg : styles.barPos}`} style={{ height: `${px}px` }} />
                <div className={styles.idxLabel}>{i}</div>
              </div>
            )
          })}
        </div>

        {/* Deque visualization */}
        {selectedAlgo === 'deque' && step?.deque && (
          <div className={styles.dequeSection}>
            <div className={styles.dequeTitle}>Deque (front = max)</div>
            <div className={styles.dequeRow}>
              {step.deque.length === 0
                ? <span className={styles.dequeEmpty}>empty</span>
                : step.deque.map((idx, pos) => (
                    <div key={idx} className={`${styles.dequeNode} ${pos === 0 ? styles.dequeFront : ''}`}>
                      <div className={styles.dequeIdx}>i={idx}</div>
                      <div className={styles.dequeVal}>{nums[idx]}</div>
                      {pos === 0 && <div className={styles.dequeTag}>max</div>}
                    </div>
                  ))
              }
            </div>
          </div>
        )}

        {/* Result row */}
        {step?.result?.length > 0 && (
          <div className={styles.resultSection}>
            <div className={styles.resultTitle}>Result</div>
            <div className={styles.resultRow}>
              {step.result.map((v, i) => (
                <div key={i} className={`${styles.resultCell} ${step.complete ? styles.special : i === step.result.length - 1 ? styles.match : ''}`}>
                  <div className={styles.resultVal}>{v}</div>
                  <div className={styles.resultWin}>w{i}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
