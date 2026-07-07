import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import DPTableDisplay from '../../components/display/DPTableDisplay.jsx'
import styles from './LIS.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [10,9,2,5,3,7,101,18]', detail: 'LeetCode — Answer: 4',  nums: [10,9,2,5,3,7,101,18] },
  { label: 'Test 2 — [0,1,0,3,2,3]',          detail: 'Answer: 4',              nums: [0,1,0,3,2,3] },
  { label: 'Test 3 — [7,7,7,7,7]',             detail: 'All same — Answer: 1',  nums: [7,7,7,7,7] },
  { label: 'Test 4 — [1,3,6,7,9,4,10,5,6]',   detail: 'Answer: 6',              nums: [1,3,6,7,9,4,10,5,6] },
]

const ALGORITHMS = [
  { id: 'dp',  name: 'DP O(n²)',         complexity: 'O(n²) time · O(n) space' },
  { id: 'bs',  name: 'Binary Search O(n log n)', complexity: 'O(n log n) time · O(n) space' },
]

const CODE = {
  dp: [
    'function lengthOfLIS(nums):',
    '  dp = [1, 1, ..., 1]  // size n',
    '  for i = 1 to n-1:',
    '    for j = 0 to i-1:',
    '      if nums[j] < nums[i]:',
    '        dp[i] = max(dp[i], dp[j] + 1)',
    '  return max(dp)',
  ],
  bs: [
    'function lengthOfLIS(nums):',
    '  tails = []',
    '  for each num in nums:',
    '    lo=0, hi=tails.length',
    '    while lo < hi: mid=(lo+hi)/2',
    '      if tails[mid] < num: lo=mid+1 else hi=mid',
    '    tails[lo] = num',
    '  return tails.length',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Current index' },
  { token: 'compare', label: 'Comparing (j < i)' },
  { token: 'match',   label: 'Filled / used' },
  { token: 'special', label: 'Tails array entry' },
]

/* ── Bar chart element ── */
function NumBar({ val, dpVal, hl, maxVal, isInLIS }) {
  const heightPct = Math.max(val / (maxVal + 1), 0.06)
  const barColor  =
    hl === 'current' ? '#f59e0b' :
    hl === 'compare' ? '#8b5cf6' :
    hl === 'match'   ? '#16a34a' :
    isInLIS          ? '#3b82f6' : '#94a3b8'



  return (
    <div className={styles.barCol}>
      {/* dp value badge */}
      {dpVal !== null && dpVal !== undefined && (
        <div className={styles.dpBadge} style={{ background: isInLIS ? '#dbeafe' : '#f3f4f6', color: isInLIS ? '#1d4ed8' : '#6b7280', borderColor: isInLIS ? '#3b82f6' : '#d1d5db' }}>
          {dpVal}
        </div>
      )}
      {/* bar */}
      <div
        className={styles.bar}
        style={{
          height: `${heightPct * 160}px`,
          background: barColor,
          border: `2px solid ${barColor}`,
          boxShadow: hl === 'current' ? `0 0 8px ${barColor}88` : 'none',
        }}
      />
      {/* value label */}
      <div className={styles.barNumLabel}>{val}</div>
    </div>
  )
}

/* ── Upward arrow SVG connecting LIS chain ── */
function ChainArrowSVG() {
  return (
    <svg viewBox="0 0 16 20" className={styles.chainArrow}>
      <path d="M8 18 L8 4 M4 8 L8 4 L12 8" stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ── Tails card SVG ── */
function TailCardSVG({ val, pos }) {
  return (
    <svg viewBox="0 0 40 48" className={styles.tailCard}>
      {/* card body */}
      <rect x="2" y="2" width="36" height="44" rx="5" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2"/>
      {/* pos label top */}
      <text x="20" y="14" textAnchor="middle" fontSize="8" fill="#6b7280" fontFamily="monospace">[{pos}]</text>
      {/* value */}
      <text x="20" y="30" textAnchor="middle" fontSize="16" fontWeight="800" fill="#1d4ed8" fontFamily="monospace">{val}</text>
      {/* tail indicator */}
      <circle cx="20" cy="40" r="3" fill="#3b82f6"/>
    </svg>
  )
}

export default function LISVisualizer() {
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
                "placeholder": "10,9,2,5,3,7,101,18"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ nums: parsed.nums }); hook.reset()
      }}
    />
  )

  const { nums } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, nums), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const dp         = step?.dp ?? new Array(nums.length).fill(selectedAlgo === 'dp' ? 1 : null)
  const highlights = step?.highlights ?? {}
  const result     = step?.result
  const tails      = step?.tails ?? []
  const lisIndices = step?.lisIndices ?? []

  const maxVal = Math.max(...nums, 1)
  const colHeaders = dp.map((_, i) => `[${i}]`)

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
        ...(tails.length > 0 ? { 'Tails length': tails.length } : {}),
        ...(result !== undefined ? { 'LIS length': result } : {}),
        ...(step.done ? { 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {result !== undefined && (
          <div className={styles.resultBadge}>
            <svg viewBox="0 0 20 20" className={styles.resultIcon}><path d="M3 17 L3 10 L7 10 L7 17 M8 17 L8 5 L12 5 L12 17 M13 17 L13 8 L17 8 L17 17" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
            LIS Length: {result}
          </div>
        )}

        {/* Bar chart of the array */}
        <div className={styles.barChart}>
          {nums.map((v, i) => (
            <NumBar
              key={i}
              val={v}
              dpVal={dp[i]}
              hl={highlights[i]}
              maxVal={maxVal}
              isInLIS={lisIndices.includes(i)}
            />
          ))}
        </div>

        {/* LIS chain arrows for active indices */}
        {lisIndices.length > 1 && (
          <div className={styles.chainRow}>
            <span className={styles.chainLabel}>LIS chain:</span>
            {lisIndices.map((idx, k) => (
              <span key={idx} className={styles.chainEl}>
                <span className={styles.chainNum}>{nums[idx]}</span>
                {k < lisIndices.length - 1 && <ChainArrowSVG />}
              </span>
            ))}
          </div>
        )}

        {/* Tails deck (binary search mode) */}
        {selectedAlgo === 'bs' && tails.length > 0 && (
          <div className={styles.tailsDeck}>
            <span className={styles.tailsLabel}>Tails:</span>
            {tails.map((v, i) => <TailCardSVG key={i} val={v} pos={i} />)}
          </div>
        )}

        {/* DP table */}
        <div className={styles.label}>{selectedAlgo === 'dp' ? 'dp[i] = LIS length ending at i' : 'LIS length per position'}</div>
        <DPTableDisplay dp={dp} highlights={highlights} colHeaders={colHeaders} />
      </div>
    </VisualizerShell>
  )
}
