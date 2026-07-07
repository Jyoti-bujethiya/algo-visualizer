import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './JumpGame.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [2,3,1,1,4]',  detail: 'Can reach — true',  nums: [2,3,1,1,4] },
  { label: 'Test 2 — [3,2,1,0,4]',  detail: 'Stuck at 3 — false', nums: [3,2,1,0,4] },
  { label: 'Test 3 — [0]',           detail: 'Already at end — true', nums: [0] },
  { label: 'Test 4 — [1,0,1,0]',    detail: 'Cannot reach end — false', nums: [1,0,1,0] },
]

const ALGORITHMS = [
  { id: 'greedy', name: 'Greedy (maxReach)', complexity: 'O(n) time · O(1) space' },
  { id: 'dp',     name: 'DP (reachability)', complexity: 'O(n²) time · O(n) space' },
]

const CODE = {
  greedy: [
    'function canJump(nums):',
    '  maxReach = 0',
    '  for i = 0 to n-1:',
    '    if i > maxReach: return false',
    '    maxReach = max(maxReach, i + nums[i])',
    '  return true',
  ],
  dp: [
    'function canJump(nums):',
    '  dp = [false,...]; dp[0] = true',
    '  for i = 1 to n-1:',
    '    for j = 0 to i-1:',
    '      if dp[j] and j + nums[j] >= i:',
    '        dp[i] = true; break',
    '  return dp[n-1]',
  ],
}

const LEGEND = [
  { token: 'special', label: 'Start pad 🐸' },
  { token: 'current', label: 'Frog is here' },
  { token: 'compare', label: 'Being tested as jump source' },
  { token: 'match',   label: 'Reachable ✓' },
  { token: 'error',   label: 'Unreachable / blocked ✗' },
]

/* ── Frog SVG ── */
function FrogSVG() {


  return (
    <svg viewBox="0 0 40 40" className={styles.frogSvg}>
      {/* body */}
      <ellipse cx="20" cy="24" rx="12" ry="9" fill="#16a34a"/>
      {/* eyes */}
      <circle cx="14" cy="16" r="5" fill="#16a34a"/>
      <circle cx="26" cy="16" r="5" fill="#16a34a"/>
      <circle cx="14" cy="15" r="2.5" fill="#fff"/>
      <circle cx="26" cy="15" r="2.5" fill="#fff"/>
      <circle cx="14.8" cy="15.2" r="1.2" fill="#1f2937"/>
      <circle cx="26.8" cy="15.2" r="1.2" fill="#1f2937"/>
      {/* smile */}
      <path d="M16,26 Q20,30 24,26" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* legs */}
      <path d="M8,28 Q3,32 5,36" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M32,28 Q37,32 35,36" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

/* ── Lily pad SVG ── */
function LilyPadSVG({ state }) {
  const colors = {
    reachable: { pad: '#4ade80', border: '#16a34a', water: '#bfdbfe' },
    blocked:   { pad: '#9ca3af', border: '#6b7280', water: '#e5e7eb' },
    current:   { pad: '#86efac', border: '#15803d', water: '#bfdbfe' },
    source:    { pad: '#93c5fd', border: '#2563eb', water: '#dbeafe' },
    start:     { pad: '#a78bfa', border: '#7c3aed', water: '#ede9fe' },
    neutral:   { pad: '#6ee7b7', border: '#10b981', water: '#ecfdf5' },
  }
  const c = colors[state] ?? colors.neutral
  return (
    <svg viewBox="0 0 52 36" className={styles.padSvg}>
      {/* water surface */}
      <ellipse cx="26" cy="30" rx="22" ry="6" fill={c.water}/>
      {/* lily pad */}
      <ellipse cx="26" cy="22" rx="20" ry="12" fill={c.pad} stroke={c.border} strokeWidth="2"/>
      {/* pad notch */}
      <path d="M26,10 L26,22" stroke={c.border} strokeWidth="1.5"/>
      {/* pad veins */}
      <line x1="26" y1="22" x2="10" y2="18" stroke={c.border} strokeWidth="0.8" opacity="0.5"/>
      <line x1="26" y1="22" x2="42" y2="18" stroke={c.border} strokeWidth="0.8" opacity="0.5"/>
    </svg>
  )
}

/* ── Wall block for unreachable ── */
function WallSVG() {
  return (
    <svg viewBox="0 0 52 36" className={styles.padSvg}>
      <rect x="6" y="8" width="40" height="22" rx="3" fill="#374151" stroke="#1f2937" strokeWidth="2"/>
      <line x1="6" y1="19" x2="46" y2="19" stroke="#4b5563" strokeWidth="1.5"/>
      <line x1="18" y1="8" x2="18" y2="19" stroke="#4b5563" strokeWidth="1.5"/>
      <line x1="34" y1="8" x2="34" y2="19" stroke="#4b5563" strokeWidth="1.5"/>
      <line x1="11" y1="19" x2="11" y2="30" stroke="#4b5563" strokeWidth="1.5"/>
      <line x1="27" y1="19" x2="27" y2="30" stroke="#4b5563" strokeWidth="1.5"/>
      <line x1="41" y1="19" x2="41" y2="30" stroke="#4b5563" strokeWidth="1.5"/>
      <text x="26" y="20" textAnchor="middle" fontSize="9" fill="#9ca3af" fontWeight="700">✗</text>
    </svg>
  )
}

function getPadState(i, n, highlights) {
  const h = highlights[String(i)]
  if (i === 0) return 'start'
  if (h === 'current') return 'current'
  if (h === 'compare') return 'source'
  if (h === 'match')   return 'reachable'
  if (h === 'error' || h === 'discard') return 'blocked'
  if (h === 'special') return 'start'
  return 'neutral'
}

export default function JumpGameVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('greedy')
  const [customCase,   setCustomCase]   = useState(null)

  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "nums",
                "label": "Nums",
                "type": "array",
                "placeholder": "2,3,1,1,4"
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

  const highlights = step?.highlights ?? {}
  const result     = step?.result
  const maxReach   = step?.maxReach

  // current frog position: highest 'current' index
  const frogIdx = Number(Object.entries(highlights).find(([, v]) => v === 'current')?.[0] ?? 0)

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
        ...(maxReach !== undefined ? { 'maxReach': maxReach } : {}),
        ...(result !== undefined ? { 'Can jump': result ? 'Yes ✓' : 'No ✗' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {result !== undefined && (
          <div className={`${styles.resultBadge} ${result ? styles.resultTrue : styles.resultFalse}`}>
            {result ? '🐸 Reached the end! ✓' : '🐸 Stuck — cannot reach end ✗'}
          </div>
        )}

        {/* max-reach arrow */}
        {maxReach !== undefined && maxReach > 0 && (
          <div className={styles.reachLabel}>
            Max reach: index <strong>{Math.min(maxReach, nums.length - 1)}</strong>
          </div>
        )}

        {/* ── Lily pad row ── */}
        <div className={styles.padsRow}>
          {nums.map((val, i) => {
            const state     = getPadState(i, nums.length, highlights)
            const isFrog    = i === frogIdx && highlights[String(i)] === 'current'
            const isBlocked = state === 'blocked'
            const isLast    = i === nums.length - 1
            return (
              <div key={i} className={styles.padWrap}>
                {/* frog sits above current pad */}
                {isFrog && <div className={styles.frogWrap}><FrogSVG /></div>}
                {/* flag at last pad */}
                {isLast && <div className={styles.flagWrap}>🏁</div>}
                {isBlocked ? <WallSVG /> : <LilyPadSVG state={state} />}
                <div className={styles.padVal}>{val}</div>
                <div className={styles.padIdx}>[{i}]</div>
              </div>
            )
          })}
        </div>
      </div>
    </VisualizerShell>
  )
}
