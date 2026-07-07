import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import DPTableDisplay from '../../components/display/DPTableDisplay.jsx'
import styles from './MaxProduct.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [2,3,-2,4]',      detail: 'Answer: 6',   nums: [2,3,-2,4] },
  { label: 'Test 2 — [-2,0,-1]',        detail: 'Answer: 0',   nums: [-2,0,-1] },
  { label: 'Test 3 — [-2,3,-4]',        detail: 'Answer: 24',  nums: [-2,3,-4] },
  { label: 'Test 4 — [2,-5,-2,-4,3]',  detail: 'Answer: 24',  nums: [2,-5,-2,-4,3] },
]

const ALGORITHMS = [
  { id: 'dp', name: 'DP (track max & min)', complexity: 'O(n) time · O(1) extra space' },
]

const CODE = {
  dp: [
    'function maxProduct(nums):',
    '  maxP = minP = result = nums[0]',
    '  for i = 1 to n-1:',
    '    if nums[i] < 0: swap(maxP, minP)',
    '    maxP = max(nums[i], maxP * nums[i])',
    '    minP = min(nums[i], minP * nums[i])',
    '    result = max(result, maxP)',
    '  return result',
  ],
}

const LEGEND = [
  { token: 'special', label: 'Base case (index 0)' },
  { token: 'current', label: 'Current index' },
  { token: 'match',   label: 'Contributes to result' },
  { token: 'done',    label: 'Processed' },
]

/* ── Negative sign flip SVG ── */
function SignFlipSVG() {


  return (
    <svg viewBox="0 0 32 24" className={styles.signFlipIcon}>
      {/* minus sign → plus sign flip */}
      <line x1="3" y1="8" x2="13" y2="8" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"/>
      <text x="5.5" y="19" fontSize="9" fill="#dc2626" fontWeight="700">−</text>
      <path d="M15,12 L17,12 M17,10 L17,14" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="19" y1="8" x2="29" y2="8" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="24" y1="3" x2="24" y2="13" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"/>
      <text x="20" y="19" fontSize="9" fill="#16a34a" fontWeight="700">+max</text>
    </svg>
  )
}

/* ── Dual-track bar chart element ── */
function DualBar({ val, maxP, minP, hl, maxAbsMax, maxAbsMin, isResult }) {
  const isNeg = val < 0
  const isZero = val === 0

  const barColor =
    hl === 'current' ? '#f59e0b' :
    hl === 'match'   ? '#16a34a' :
    hl === 'done'    ? '#94a3b8' : '#64748b'

  const maxBarH = maxP !== null ? Math.max(maxP / (maxAbsMax || 1), 0.04) * 80 : 0
  const minBarH = minP !== null ? Math.abs(minP) / (maxAbsMin || 1) * 40 : 0

  return (
    <div className={styles.dualCol}>
      {/* maxP bar (top half) */}
      <div className={styles.maxTrack}>
        {maxP !== null && (
          <div
            className={`${styles.maxBar} ${isResult ? styles.maxBarResult : ''}`}
            style={{ height: `${maxBarH}px` }}
            title={`maxP=${maxP}`}
          >
            <span className={styles.barTip}>{maxP}</span>
          </div>
        )}
      </div>

      {/* center label */}
      <div
        className={`${styles.valChip} ${isNeg ? styles.valChipNeg : isZero ? styles.valChipZero : styles.valChipPos} ${hl === 'current' ? styles.valChipActive : ''}`}
      >
        {isNeg && <span className={styles.negBadge}>×(−1)</span>}
        {val}
      </div>

      {/* minP bar (bottom half) */}
      <div className={styles.minTrack}>
        {minP !== null && (
          <div className={styles.minBar} style={{ height: `${minBarH}px` }} title={`minP=${minP}`}>
            <span className={styles.barTipMin}>{minP}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MaxProductVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('dp')
  const [customCase,   setCustomCase]   = useState(null)

  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "nums",
                "label": "Nums",
                "type": "array",
                "placeholder": "2,3,-2,4"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ nums: parsed.nums }); hook.reset()
      }}
    />
  )

  const { nums } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(nums), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const dpMax    = step?.dpMax    ?? new Array(nums.length).fill(null)
  const dpMin    = step?.dpMin    ?? new Array(nums.length).fill(null)
  const highlights = step?.highlights ?? {}
  const result     = step?.result
  const swapped    = step?.swapped  // optional: true when sign flip happened
  const resultIdx  = step?.resultIdx

  const maxAbsMax = Math.max(...dpMax.filter(v => v !== null).map(Math.abs), 1)
  const maxAbsMin = Math.max(...dpMin.filter(v => v !== null).map(Math.abs), 1)
  const colHeaders = nums.map((_, i) => `[${i}]`)

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'n': nums.length,
        ...(result !== undefined ? { 'Max product': result } : {}),
        ...(step.done ? { 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {result !== undefined && (
          <div className={styles.resultBadge}>
            <svg viewBox="0 0 22 22" className={styles.resultIcon}><polygon points="11,2 13.5,8.5 20,9 15,14 16.5,21 11,17.5 5.5,21 7,14 2,9 8.5,8.5" fill="#fde68a" stroke="#d97706" strokeWidth="1.2"/></svg>
            Max Product: {result}
          </div>
        )}

        {/* Sign-flip indicator */}
        {swapped && (
          <div className={styles.swapBadge}>
            <SignFlipSVG />
            <span>Negative → swapped max↔min</span>
          </div>
        )}

        {/* Dual-track bar chart */}
        <div className={styles.chartWrap}>
          <div className={styles.trackLabel} style={{ color: '#16a34a' }}>maxP ↑</div>
          <div className={styles.barChart}>
            {nums.map((v, i) => (
              <DualBar
                key={i}
                val={v}
                maxP={dpMax[i]}
                minP={dpMin[i]}
                hl={highlights[i]}
                maxAbsMax={maxAbsMax}
                maxAbsMin={maxAbsMin}
                isResult={i === resultIdx}
              />
            ))}
          </div>
          <div className={styles.trackLabel} style={{ color: '#dc2626' }}>minP ↓</div>
        </div>

        <div className={styles.label}>maxP at each index</div>
        <DPTableDisplay dp={dpMax} highlights={highlights} colHeaders={colHeaders} />
        <div className={styles.label}>minP at each index</div>
        <DPTableDisplay dp={dpMin} highlights={{}} colHeaders={colHeaders} />
      </div>
    </VisualizerShell>
  )
}
