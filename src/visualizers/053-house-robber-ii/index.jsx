import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './HouseRobberII.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [2,3,2]',           detail: 'Answer: 3',   nums: [2,3,2] },
  { label: 'Test 2 — [1,2,3,1]',         detail: 'Answer: 4',   nums: [1,2,3,1] },
  { label: 'Test 3 — [1,2,3,4,5,6]',     detail: 'Answer: 12',  nums: [1,2,3,4,5,6] },
  { label: 'Test 4 — [5]',               detail: 'Answer: 5',   nums: [5] },
]

const ALGORITHMS = [
  { id: 'tab', name: 'Two-pass DP', complexity: 'O(n) time · O(n) space' },
]

const CODE = {
  tab: [
    'function rob(nums):',
    '  if n == 1: return nums[0]',
    '  return max(robRange(0,n-2), robRange(1,n-1))',
    'function robRange(start, end):',
    '  prev2 = 0; prev1 = 0',
    '  for i = start to end:',
    '    curr = max(prev1, prev2 + nums[i])',
    '    prev2 = prev1; prev1 = curr',
    '  return prev1',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Computing now' },
  { token: 'match',   label: 'Included (active pass)' },
  { token: 'special', label: 'Pass boundary (excluded)' },
  { token: 'compare', label: 'Used in computation' },
]

/* Reuse the same house SVG from problem 052 */
function HouseSVG({ roofColor, wallColor, doorColor, windowColor }) {


  return (
    <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.houseSvg}>
      <polygon points="28,6 52,26 4,26" fill={roofColor} stroke="#fff" strokeWidth="1.5"/>
      <rect x="38" y="12" width="6" height="10" fill={roofColor} stroke="#fff" strokeWidth="1"/>
      <rect x="8" y="25" width="40" height="24" rx="2" fill={wallColor} stroke="#fff" strokeWidth="1.5"/>
      <rect x="22" y="35" width="12" height="14" rx="2" fill={doorColor}/>
      <circle cx="31" cy="43" r="1.5" fill="#fff" opacity="0.8"/>
      <rect x="11" y="29" width="9" height="9" rx="1.5" fill={windowColor} opacity="0.9"/>
      <rect x="36" y="29" width="9" height="9" rx="1.5" fill={windowColor} opacity="0.9"/>
      <line x1="15.5" y1="29" x2="15.5" y2="38" stroke="#fff" strokeWidth="1" opacity="0.6"/>
      <line x1="11" y1="33.5" x2="20" y2="33.5" stroke="#fff" strokeWidth="1" opacity="0.6"/>
      <line x1="40.5" y1="29" x2="40.5" y2="38" stroke="#fff" strokeWidth="1" opacity="0.6"/>
      <line x1="36" y1="33.5" x2="45" y2="33.5" stroke="#fff" strokeWidth="1" opacity="0.6"/>
    </svg>
  )
}

function getHouseColors(state) {
  if (state === 'current')  return { roofColor:'#f97316', wallColor:'#fed7aa', doorColor:'#c2410c', windowColor:'#fef9c3' }
  if (state === 'active')   return { roofColor:'#16a34a', wallColor:'#dcfce7', doorColor:'#15803d', windowColor:'#f0fdf4' }
  if (state === 'compare')  return { roofColor:'#2563eb', wallColor:'#dbeafe', doorColor:'#1d4ed8', windowColor:'#eff6ff' }
  if (state === 'excluded') return { roofColor:'#9ca3af', wallColor:'#f3f4f6', doorColor:'#6b7280', windowColor:'#e5e7eb' }
  return                           { roofColor:'#9ca3af', wallColor:'#f3f4f6', doorColor:'#6b7280', windowColor:'#e5e7eb' }
}

function getHouseState(i, highlights, prefix) {
  const h = highlights[`${prefix}${i}`]
  if (h === 'current') return 'current'
  if (h === 'match')   return 'active'
  if (h === 'compare') return 'compare'
  if (h === 'special') return 'excluded'
  return 'neutral'
}

export default function HouseRobberIIVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('tab')
  const [customCase,   setCustomCase]   = useState(null)

  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "nums",
                "label": "Nums (circular)",
                "type": "array",
                "placeholder": "2,3,2"
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

  const dpA        = step?.dpA ?? []
  const dpB        = step?.dpB ?? []
  const highlights = step?.highlights ?? {}
  const result     = step?.result
  const resultA    = step?.resultA
  const resultB    = step?.resultB
  const n          = nums.length

  // Determine active pass
  const passA = Object.keys(highlights).some(k => k.startsWith('A'))
  const passB = Object.keys(highlights).some(k => k.startsWith('B'))

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
        ...(resultA !== undefined ? { 'Sub-A (0→n-2)': resultA } : {}),
        ...(resultB !== undefined ? { 'Sub-B (1→n-1)': resultB } : {}),
        ...(result !== undefined  ? { 'Max rob': result } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {result !== undefined && (
          <div className={styles.resultBadge}>💰 Max Loot: {result}</div>
        )}

        {/* ── Circular street ── */}
        <div className={styles.label}>Houses arranged in a circle (first ↔ last are adjacent)</div>
        <div className={styles.circleWrap}>
          {nums.map((val, i) => {
            // for circle layout position
            const angle = (2 * Math.PI * i) / n - Math.PI / 2
            const radius = Math.min(100, 30 + n * 14)
            const cx = 50 + radius * Math.cos(angle)
            const cy = 50 + radius * Math.sin(angle)

            const stateA = getHouseState(i, highlights, 'A')
            const stateB = getHouseState(i, highlights, 'B')
            const state  = passB ? stateB : (passA ? stateA : 'neutral')
            const colors = getHouseColors(state)

            return (
              <div
                key={i}
                className={`${styles.circleHouse} ${state !== 'neutral' ? styles['state' + state.charAt(0).toUpperCase() + state.slice(1)] : ''}`}
                style={{ left: `${cx}%`, top: `${cy}%`, transform: 'translate(-50%,-50%)' }}
              >
                <HouseSVG {...colors} />
                <span className={styles.houseVal}>${val}</span>
                <span className={styles.houseIdx}>[{i}]</span>
              </div>
            )
          })}
          {/* circular connector */}
          <svg className={styles.circleRoadSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
            {nums.map((_, i) => {
              const r = Math.min(100, 30 + n * 14)
              const a1 = (2 * Math.PI * i) / n - Math.PI / 2
              const a2 = (2 * Math.PI * ((i + 1) % n)) / n - Math.PI / 2
              const x1 = 50 + r * Math.cos(a1), y1 = 50 + r * Math.sin(a1)
              const x2 = 50 + r * Math.cos(a2), y2 = 50 + r * Math.sin(a2)
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="3 2"/>
            })}
          </svg>
        </div>

        {/* ── Two-pass dp strips ── */}
        {(dpA.length > 0 || dpB.length > 0) && (
          <div className={styles.passWrap}>
            {dpA.length > 0 && (
              <div className={`${styles.passBlock} ${passA ? styles.passActive : ''}`}>
                <div className={styles.passLabel}>Pass A: houses 0 → {n - 2}</div>
                <div className={styles.dpRow}>
                  {dpA.map((val, i) => {
                    const h = highlights[`A${i}`]
                    return (
                      <div key={i} className={`${styles.dpChip} ${
                        h === 'current' ? styles.dpCurrent :
                        h === 'match'   ? styles.dpMatch :
                        h === 'compare' ? styles.dpCompare :
                        h === 'special' ? styles.dpSpecial : styles.dpNull
                      }`}>
                        {val !== null ? val : '—'}
                      </div>
                    )
                  })}
                  {resultA !== undefined && <span className={styles.passResult}>= {resultA}</span>}
                </div>
              </div>
            )}
            {dpB.length > 0 && (
              <div className={`${styles.passBlock} ${passB ? styles.passActive : ''}`}>
                <div className={styles.passLabel}>Pass B: houses 1 → {n - 1}</div>
                <div className={styles.dpRow}>
                  {dpB.map((val, i) => {
                    const h = highlights[`B${i}`]
                    return (
                      <div key={i} className={`${styles.dpChip} ${
                        h === 'current' ? styles.dpCurrent :
                        h === 'match'   ? styles.dpMatch :
                        h === 'compare' ? styles.dpCompare :
                        h === 'special' ? styles.dpSpecial : styles.dpNull
                      }`}>
                        {val !== null ? val : '—'}
                      </div>
                    )
                  })}
                  {resultB !== undefined && <span className={styles.passResult}>= {resultB}</span>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
