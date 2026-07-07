import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import PointerLabel from '../../components/display/PointerLabel.jsx'
import styles from './RainWater.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Classic',   detail: '[0,1,0,2,1,0,1,3,2,1,2,1]', heights: [0,1,0,2,1,0,1,3,2,1,2,1] },
  { label: 'Test 2 — No water',  detail: '[3,2,1,0]',                  heights: [3,2,1,0] },
  { label: 'Test 3 — Valley',    detail: '[3,0,2]',                     heights: [3,0,2] },
  { label: 'Test 4 — Multiple',  detail: '[4,2,0,3,2,5]',              heights: [4,2,0,3,2,5] },
  { label: 'Test 5 — Flat',      detail: '[2,2,2,2]',                   heights: [2,2,2,2] },
]

const ALGORITHMS = [
  { id: 'twoPointer', name: 'Two Pointer (Optimal)', complexity: 'O(n) time · O(1) space' },
  { id: 'dp',         name: 'Dynamic Programming',   complexity: 'O(n) time · O(n) space' },
]

const CODE = {
  twoPointer: ['L=0, R=n-1, lMax=rMax=0', 'while L < R:', '  if h[L]<h[R]:', '    if h[L]>=lMax: lMax=h[L]', '    else: water[L]=lMax-h[L]; L++', '  else:', '    if h[R]>=rMax: rMax=h[R]', '    else: water[R]=rMax-h[R]; R--'],
  dp:         ['Build leftMax[i] = max(leftMax[i-1], h[i])', 'Build rightMax[i] = max(rightMax[i+1], h[i])', 'water[i] = min(leftMax[i],rightMax[i]) - h[i]'],
}

const LEGEND = [
  { token: 'current', label: 'Active pointer' },
  { token: 'match',   label: 'Water trapped here' },
  { token: 'special', label: 'Max boundary updated' },
]

/* ── Raindrop SVG ── */
function RaindropSVG({ units }) {


  return (
    <svg viewBox="0 0 20 26" className={styles.raindropIcon}>
      <path d="M10,1 Q17,10 17,17 A7,7 0 0 1 3,17 Q3,10 10,1 Z" fill="#38bdf8" stroke="#0ea5e9" strokeWidth="1.2"/>
      <ellipse cx="12" cy="13" rx="2" ry="4" fill="white" opacity="0.35" transform="rotate(-20 12 13)"/>
      {units > 0 && (
        <text x="10" y="20" textAnchor="middle" fontSize="6" fontWeight="800" fill="#0c4a6e">{units}</text>
      )}
    </svg>
  )
}

/* ── Boat SVG (for pointer) ── */
function BoatSVG({ label }) {
  const isL = label === 'L'
  const color = isL ? '#f59e0b' : '#8b5cf6'
  return (
    <svg viewBox="0 0 28 22" className={styles.boatIcon}>
      {/* hull */}
      <path d="M3,14 Q14,20 25,14 L22,10 L6,10 Z" fill={color} stroke="white" strokeWidth="1"/>
      {/* mast */}
      <line x1="14" y1="3" x2="14" y2="10" stroke={color} strokeWidth="1.5"/>
      {/* sail */}
      <path d="M14,4 L22,9 L14,9 Z" fill={isL ? '#fde68a' : '#ede9fe'} stroke={color} strokeWidth="1"/>
      {/* flag label */}
      <text x="14" y="17" textAnchor="middle" fontSize="7" fontWeight="800" fill="white">{label}</text>
    </svg>
  )
}

export default function RainWaterVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('twoPointer')
  const [customCase,   setCustomCase]   = useState(null)

  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "heights",
                "label": "Heights",
                "type": "array",
                "placeholder": "0,1,0,2,1,0,1,3,2,1,2,1"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ heights: parsed.heights }); hook.reset()
      }}
    />
  )

  const { heights } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, heights), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook = useVisualizer(steps)
  const step = hook.step

  const water   = step?.water ?? new Array(heights.length).fill(0)
  const maxH    = Math.max(...heights, 1)
  const curPos  = step?.currentPos ?? -1
  const totalW  = step?.totalWater ?? 0

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest} onTestChange={i => { setCustomCase(null); setSelectedTest(i); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo} onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? { 'Total Water': totalW, 'L Pointer': step.left >= 0 ? step.left : '—', 'R Pointer': step.right >= 0 ? step.right : '—' } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Column chart */}
        <div className={styles.chartWrap}>
          {/* Water level line (horizon) */}
          {totalW > 0 && (
            <div className={styles.waterLevel}>
              <span className={styles.waterLevelLabel}>~{totalW} units</span>
            </div>
          )}

          <div className={styles.bars}>
            {heights.map((h, i) => {
              const w = water[i] ?? 0
              const totalH = h + w
              const stackH = Math.max(totalH / (maxH + 2), 0.04) * 240
              const waterFrac = w > 0 ? w / totalH : 0
              const isActive = i === curPos
              const isLeft   = step?.left  === i
              const isRight  = step?.right === i

              return (
                <div key={i} className={styles.colWrap}>
                  {/* Boat on water pointer */}
                  <div className={styles.boatRow}>
                    {isLeft  && <BoatSVG label="L" />}
                    {isRight && <BoatSVG label="R" />}
                    {!isLeft && !isRight && step?.left === undefined && (
                      // fallback PointerLabel for DP mode
                      null
                    )}
                  </div>

                  {/* Height value */}
                  <div className={styles.barVal}>{h}</div>

                  {/* Bar stack: water on top, stone below */}
                  <div className={styles.barStack} style={{ height: `${stackH}px` }}>
                    {/* Water layer */}
                    {w > 0 && (
                      <div className={styles.waterLayer} style={{ height: `${waterFrac * 100}%` }}>
                        <div className={styles.waterWave} />
                        {/* Raindrop badge */}
                        <div className={styles.raindropWrap}>
                          <RaindropSVG units={w} />
                        </div>
                      </div>
                    )}
                    {/* Stone column */}
                    <div
                      className={`${styles.stoneBar} ${isActive ? styles.stoneBarActive : ''}`}
                      style={{ height: `${(h / totalH) * 100}%` }}
                    />
                  </div>

                  <div className={styles.barIdx}>{i}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Total water badge */}
        {totalW > 0 && (
          <div className={styles.totalBadge}>
            <RaindropSVG units={null} />
            <span>Total trapped: <strong>{totalW}</strong> units</span>
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
