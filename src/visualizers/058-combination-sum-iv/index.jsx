import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import DPTableDisplay from '../../components/display/DPTableDisplay.jsx'
import styles from './CombinationSumIV.module.css'

const TEST_CASES = [
  { label: 'Test 1 — nums=[1,2,3], target=4',  detail: 'Answer: 7',  nums: [1,2,3], target: 4 },
  { label: 'Test 2 — nums=[9], target=3',       detail: 'Answer: 0',  nums: [9],     target: 3 },
  { label: 'Test 3 — nums=[1,2,3], target=6',  detail: 'Answer: 24', nums: [1,2,3], target: 6 },
  { label: 'Test 4 — nums=[2,1,3], target=5',  detail: 'Answer: 13', nums: [2,1,3], target: 5 },
]

const ALGORITHMS = [
  { id: 'tab', name: 'Bottom-up DP', complexity: 'O(target × |nums|) time · O(target) space' },
]

const CODE = {
  tab: [
    'function combinationSum4(nums, target):',
    '  dp = [0, 0, ..., 0]  // size target+1',
    '  dp[0] = 1',
    '  for i = 1 to target:',
    '    for each num in nums:',
    '      if i - num >= 0:',
    '        dp[i] += dp[i - num]',
    '  return dp[target]',
  ],
}

const LEGEND = [
  { token: 'special', label: 'Base case dp[0]=1' },
  { token: 'current', label: 'Currently filling dp[i]' },
  { token: 'compare', label: 'dp[i-num] used' },
  { token: 'match',   label: 'Filled' },
]

/* ── Target gauge SVG ── */
function TargetGaugeSVG({ current, target }) {
  const pct = Math.min(current / Math.max(target, 1), 1)
  const r = 20, cx = 26, cy = 26
  const circ = 2 * Math.PI * r
  const filled = circ * pct


  return (
    <svg viewBox="0 0 52 52" className={styles.gaugeIcon}>
      {/* background ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="5"/>
      {/* progress ring */}
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke={pct >= 1 ? '#16a34a' : '#3b82f6'} strokeWidth="5"
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}/>
      {/* center label */}
      <text x={cx} y={cy - 3} textAnchor="middle" fontSize="9" fill="#374151" fontFamily="monospace" fontWeight="700">{current}</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="monospace">/{target}</text>
    </svg>
  )
}

/* ── Num tile SVG ── */
function NumTileSVG({ val, isActive }) {
  const fill = isActive ? '#3b82f6' : '#e5e7eb'
  const textFill = isActive ? 'white' : '#374151'
  return (
    <svg viewBox="0 0 36 36" className={styles.numTile}>
      <rect x="2" y="2" width="32" height="32" rx="6" fill={fill} stroke={isActive ? '#2563eb' : '#d1d5db'} strokeWidth="2"/>
      {/* dot pattern */}
      {val >= 1 && <circle cx="18" cy="18" r="3.5" fill={textFill} opacity="0.6"/>}
      {val >= 2 && <circle cx="10" cy="10" r="2.5" fill={textFill} opacity="0.6"/>}
      {val >= 3 && <circle cx="26" cy="26" r="2.5" fill={textFill} opacity="0.6"/>}
      {/* number */}
      <text x="18" y="22" textAnchor="middle" fontSize="13" fontWeight="800" fill={textFill} fontFamily="monospace">{val}</text>
    </svg>
  )
}

export default function CombinationSumIVVisualizer() {
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
                "placeholder": "1,2,3,4"
            },
            {
                "key": "target",
                "label": "Target",
                "type": "number",
                "placeholder": "4"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ nums: parsed.nums, target: parsed.target }); hook.reset()
      }}
    />
  )

  const { nums, target } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(nums, target), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const dp         = step?.dp ?? new Array(target + 1).fill(0)
  const highlights = step?.highlights ?? {}
  const result     = step?.result
  const activeI    = step?.activeI
  const activeNum  = step?.activeNum

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
        'Target': target,
        'Nums': `[${nums.join(',')}]`,
        ...(result !== undefined ? { 'Combinations': result } : {}),
        ...(step.done ? { 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Nums + gauge row */}
        <div className={styles.topRow}>
          <div className={styles.numsPanel}>
            <span className={styles.panelLabel}>Numbers:</span>
            <div className={styles.tilesRow}>
              {nums.map((n, i) => <NumTileSVG key={i} val={n} isActive={activeNum === n} />)}
            </div>
          </div>

          <div className={styles.gaugePanel}>
            <span className={styles.panelLabel}>Progress:</span>
            <TargetGaugeSVG current={activeI ?? 0} target={target} />
          </div>
        </div>

        {result !== undefined && (
          <div className={styles.resultBadge}>
            <span className={styles.comboIcon}>🎯</span>
            Combinations: <strong>{result}</strong>
          </div>
        )}

        <div className={styles.label}>dp[0..{target}]</div>
        <DPTableDisplay dp={dp} highlights={highlights} colHeaders={colHeaders} />
      </div>
    </VisualizerShell>
  )
}
