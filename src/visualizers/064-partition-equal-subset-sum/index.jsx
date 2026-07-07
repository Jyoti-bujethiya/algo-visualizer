import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import DPTableDisplay from '../../components/display/DPTableDisplay.jsx'
import styles from './PartitionSubset.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [1,5,11,5]',    detail: 'Answer: true ([1,5,5] / [11])',  nums: [1,5,11,5] },
  { label: 'Test 2 — [1,2,3,5]',     detail: 'Answer: false',                  nums: [1,2,3,5] },
  { label: 'Test 3 — [1,1]',          detail: 'Answer: true',                   nums: [1,1] },
  { label: 'Test 4 — [3,3,3,4,5]',   detail: 'Answer: true (sum=18, target=9)', nums: [3,3,3,4,5] },
]

const ALGORITHMS = [
  { id: 'tab', name: '0/1 Knapsack DP', complexity: 'O(n·target) time · O(target) space' },
]

const CODE = {
  tab: [
    'function canPartition(nums):',
    '  total = sum(nums); if total%2 != 0: return false',
    '  target = total / 2',
    '  dp = [T, F, ..., F]  // size target+1',
    '  for each num in nums:',
    '    for j = target downto num:',
    '      dp[j] = dp[j] || dp[j - num]',
    '  return dp[target]',
  ],
}

const LEGEND = [
  { token: 'special', label: 'Base case dp[0]=true' },
  { token: 'current', label: 'dp[j] being updated' },
  { token: 'compare', label: 'dp[j-num] source' },
  { token: 'match',   label: 'True (reachable sum)' },
  { token: 'discard', label: 'False (unreachable)' },
]

/* ── Scale / Balance SVG ── */
function ScaleSVG({ leftSum, rightSum, target }) {
  const balanced = leftSum === rightSum
  const leftTilt  = leftSum > rightSum  ? 8 : leftSum < rightSum ? -8 : 0
  const leftY     = 70 + leftTilt
  const rightY    = 70 - leftTilt


  return (
    <svg viewBox="0 0 160 100" className={styles.scaleIcon}>
      {/* pivot */}
      <line x1="80" y1="30" x2="80" y2="60" stroke="#92400e" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="80" cy="28" r="5" fill="#ca8a04"/>
      {/* beam */}
      <line x1="20" y1="60" x2="140" y2="60" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round"
        transform={`rotate(${leftTilt > 0 ? -4 : leftTilt < 0 ? 4 : 0}, 80, 60)`}/>
      {/* left pan */}
      <line x1="30" y1="60" x2="30" y2={leftY} stroke="#ca8a04" strokeWidth="1.5"/>
      <ellipse cx="30" cy={leftY + 10} rx="22" ry="8" fill={balanced ? '#d1fae5' : '#fef9c3'} stroke={balanced ? '#16a34a' : '#ca8a04'} strokeWidth="1.5"/>
      <text x="30" y={leftY + 14} textAnchor="middle" fontSize="10" fontWeight="800" fill={balanced ? '#065f46' : '#92400e'} fontFamily="monospace">{leftSum}</text>
      {/* right pan */}
      <line x1="130" y1="60" x2="130" y2={rightY} stroke="#ca8a04" strokeWidth="1.5"/>
      <ellipse cx="130" cy={rightY + 10} rx="22" ry="8" fill={balanced ? '#d1fae5' : '#dbeafe'} stroke={balanced ? '#16a34a' : '#3b82f6'} strokeWidth="1.5"/>
      <text x="130" y={rightY + 14} textAnchor="middle" fontSize="10" fontWeight="800" fill={balanced ? '#065f46' : '#1e3a5f'} fontFamily="monospace">{target}</text>
      {/* balanced label */}
      {balanced && <text x="80" y="95" textAnchor="middle" fontSize="9" fill="#16a34a" fontWeight="700">BALANCED ✓</text>}
    </svg>
  )
}

/* ── Num block SVGs ── */
function NumBlockSVG({ val, isActive, isUsed }) {
  const fill = isActive ? '#f59e0b' : isUsed ? '#3b82f6' : '#e5e7eb'
  const stroke = isActive ? '#d97706' : isUsed ? '#2563eb' : '#d1d5db'
  const textFill = isActive || isUsed ? 'white' : '#374151'
  return (
    <svg viewBox="0 0 34 34" className={styles.numBlock}>
      <rect x="2" y="2" width="30" height="30" rx="6" fill={fill} stroke={stroke} strokeWidth="2"/>
      <text x="17" y="21" textAnchor="middle" fontSize="13" fontWeight="800" fill={textFill} fontFamily="monospace">{val}</text>
    </svg>
  )
}

export default function PartitionSubsetVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('tab')
  const [customCase,   setCustomCase]   = useState(null)

  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "nums",
                "label": "Nums",
                "type": "array",
                "placeholder": "1,5,11,5"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ nums: parsed.nums }); hook.reset()
      }}
    />
  )

  const { nums } = customCase ?? TEST_CASES[selectedTest]
  const total  = nums.reduce((a, b) => a + b, 0)
  const target = total % 2 === 0 ? total / 2 : 0

  const steps = useMemo(() => generateSteps(nums), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const dp         = step?.dp ?? [true, ...new Array(Math.max(target, 1)).fill(false)]
  const highlights = step?.highlights ?? {}
  const result     = step?.result
  const activeNum  = step?.activeNum    // current number being processed
  const currentSum = step?.currentSum ?? 0  // running sum being built

  const colHeaders = dp.map((_, i) => String(i))

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'Sum': total,
        'Target': target || 'odd (impossible)',
        ...(result !== undefined ? { 'Can partition': result ? 'Yes ✓' : 'No ✗' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {result !== undefined && (
          <div className={`${styles.resultBadge} ${result ? styles.resultTrue : styles.resultFalse}`}>
            {result ? '⚖️ Equal partition possible ✓' : '⚖️ Cannot partition equally ✗'}
          </div>
        )}

        {/* Scale visual + num blocks */}
        <div className={styles.topRow}>
          <div className={styles.scaleWrap}>
            <ScaleSVG leftSum={currentSum} rightSum={target} target={target} />
          </div>

          <div className={styles.numsWrap}>
            <span className={styles.numsTitle}>Numbers:</span>
            <div className={styles.numBlocks}>
              {nums.map((n, i) => (
                <NumBlockSVG
                  key={i}
                  val={n}
                  isActive={n === activeNum}
                  isUsed={false}
                />
              ))}
            </div>
            <div className={styles.sumRow}>
              <span className={styles.sumLabel}>Running sum: {currentSum}</span>
              <span className={styles.targetLabel}>Target: {target}</span>
            </div>
          </div>
        </div>

        <div className={styles.label}>dp[0..{target}] (T=reachable sum)</div>
        <DPTableDisplay
          dp={dp.map(v => v ? 'T' : 'F')}
          highlights={highlights}
          colHeaders={colHeaders}
        />
      </div>
    </VisualizerShell>
  )
}
