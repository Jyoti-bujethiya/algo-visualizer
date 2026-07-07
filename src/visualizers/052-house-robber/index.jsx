import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './HouseRobber.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [1,2,3,1]',       detail: 'Answer: 4',   nums: [1,2,3,1] },
  { label: 'Test 2 — [2,7,9,3,1]',     detail: 'Answer: 12',  nums: [2,7,9,3,1] },
  { label: 'Test 3 — [2,1,1,2]',       detail: 'Answer: 4',   nums: [2,1,1,2] },
  { label: 'Test 4 — [1,2,3,4,5,6]',   detail: 'Answer: 12',  nums: [1,2,3,4,5,6] },
]

const ALGORITHMS = [
  { id: 'tab', name: 'Bottom-up DP', complexity: 'O(n) time · O(n) space' },
]

const CODE = {
  tab: [
    'function rob(nums):',
    '  n = nums.length',
    '  if n == 0: return 0',
    '  dp[0] = nums[0]',
    '  dp[1] = max(nums[0], nums[1])',
    '  for i = 2 to n-1:',
    '    dp[i] = max(dp[i-1], dp[i-2] + nums[i])',
    '  return dp[n-1]',
  ],
}

const LEGEND = [
  { token: 'special', label: 'Base case (dp[0], dp[1])' },
  { token: 'current', label: 'Just computed' },
  { token: 'compare', label: 'Used in computation' },
  { token: 'match',   label: 'Filled' },
]

/* ── Inline SVG house ── */
function HouseSVG({ roofColor, wallColor, doorColor, windowColor }) {


  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.houseSvg}>
      {/* roof */}
      <polygon points="28,6 52,26 4,26" fill={roofColor} stroke="#fff" strokeWidth="1.5"/>
      {/* chimney */}
      <rect x="38" y="12" width="6" height="10" fill={roofColor} stroke="#fff" strokeWidth="1"/>
      {/* wall */}
      <rect x="8" y="25" width="40" height="24" rx="2" fill={wallColor} stroke="#fff" strokeWidth="1.5"/>
      {/* door */}
      <rect x="22" y="35" width="12" height="14" rx="2" fill={doorColor}/>
      <circle cx="31" cy="43" r="1.5" fill="#fff" opacity="0.8"/>
      {/* windows */}
      <rect x="11" y="29" width="9" height="9" rx="1.5" fill={windowColor} opacity="0.9"/>
      <rect x="36" y="29" width="9" height="9" rx="1.5" fill={windowColor} opacity="0.9"/>
      {/* window cross */}
      <line x1="15.5" y1="29" x2="15.5" y2="38" stroke="#fff" strokeWidth="1" opacity="0.6"/>
      <line x1="11" y1="33.5" x2="20" y2="33.5" stroke="#fff" strokeWidth="1" opacity="0.6"/>
      <line x1="40.5" y1="29" x2="40.5" y2="38" stroke="#fff" strokeWidth="1" opacity="0.6"/>
      <line x1="36" y1="33.5" x2="45" y2="33.5" stroke="#fff" strokeWidth="1" opacity="0.6"/>
    </svg>
  )
}

function getHouseColors(state) {
  if (state === 'current') return { roofColor:'#f97316', wallColor:'#fed7aa', doorColor:'#c2410c', windowColor:'#fef9c3' }
  if (state === 'robbed')  return { roofColor:'#ef4444', wallColor:'#fecaca', doorColor:'#991b1b', windowColor:'#fef2f2' }
  if (state === 'special') return { roofColor:'#7c3aed', wallColor:'#ede9fe', doorColor:'#5b21b6', windowColor:'#ddd6fe' }
  if (state === 'compare') return { roofColor:'#2563eb', wallColor:'#dbeafe', doorColor:'#1d4ed8', windowColor:'#eff6ff' }
  if (state === 'done')    return { roofColor:'#16a34a', wallColor:'#dcfce7', doorColor:'#15803d', windowColor:'#f0fdf4' }
  /* neutral */             return { roofColor:'#9ca3af', wallColor:'#f3f4f6', doorColor:'#6b7280', windowColor:'#e5e7eb' }
}

function getHouseState(i, highlights) {
  const h = highlights[String(i)]
  if (h === 'special') return 'special'
  if (h === 'current') return 'current'
  if (h === 'compare') return 'compare'
  if (h === 'match')   return 'done'
  if (highlights[`n${i}`]) return 'robbed'
  return 'neutral'
}

function getDpChipClass(i, highlights, styles) {
  const h = highlights[String(i)]
  if (h === 'special') return styles.dpChipSpecial
  if (h === 'current') return styles.dpChipCurrent
  if (h === 'compare') return styles.dpChipCompare
  if (h === 'match')   return styles.dpChipMatch
  return styles.dpChipNull
}

export default function HouseRobberVisualizer() {
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
                "placeholder": "2,7,9,3,1"
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

  const dp         = step?.dp ?? new Array(nums.length).fill(null)
  const highlights = step?.highlights ?? {}
  const result     = step?.result

  // which house index is currently being computed
  const currentIdx = Object.entries(highlights).find(([k, v]) => v === 'current' && !k.startsWith('n'))?.[0]

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'Houses': nums.length,
        ...(result !== undefined ? { 'Max rob': result } : {}),
        ...(step.done ? { 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {result !== undefined && (
          <div className={styles.resultBadge}>
            <span>💰</span>
            <span>Max Loot: {result}</span>
          </div>
        )}

        {/* ── Houses street ── */}
        <div className={styles.label}>Houses</div>
        <div className={styles.street}>
          {nums.map((val, i) => {
            const state = getHouseState(i, highlights)
            const colors = getHouseColors(state)
            const isCurrentHouse = String(i) === currentIdx
            return (
              <div key={i} className={`${styles.houseWrap} ${state !== 'neutral' ? styles['state' + state.charAt(0).toUpperCase() + state.slice(1)] : ''}`}>
                {isCurrentHouse && <span className={styles.robberBadge}>🦹</span>}
                <HouseSVG {...colors} />
                <span className={styles.houseVal}>${val}</span>
                <span className={styles.houseIndex}>[{i}]</span>
              </div>
            )
          })}
        </div>

        {/* ── dp row ── */}
        <div className={styles.label}>dp table</div>
        <div className={styles.dpRow}>
          {dp.map((val, i) => (
            <div key={i} className={`${styles.dpChip} ${getDpChipClass(i, highlights, styles)}`}>
              {val !== null ? val : '—'}
            </div>
          ))}
        </div>
      </div>
    </VisualizerShell>
  )
}
