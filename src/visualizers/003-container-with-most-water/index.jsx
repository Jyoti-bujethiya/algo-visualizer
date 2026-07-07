import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import PointerLabel from '../../components/display/PointerLabel.jsx'
import styles from './Container.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Classic',  detail: '[1,8,6,2,5,4,8,3,7]', heights: [1,8,6,2,5,4,8,3,7] },
  { label: 'Test 2 — Two',      detail: '[1,1]',                heights: [1,1] },
  { label: 'Test 3 — Increasing',detail: '[1,2,3,4,5]',        heights: [1,2,3,4,5] },
  { label: 'Test 4 — All Same', detail: '[5,5,5,5]',            heights: [5,5,5,5] },
  { label: 'Test 5 — Extreme',  detail: '[1,100,1]',            heights: [1,100,1] },
]

const ALGORITHMS = [
  { id: 'twoPointer', name: 'Two Pointer (Optimal)', complexity: 'O(n) time · O(1) space' },
  { id: 'bruteForce', name: 'Brute Force',           complexity: 'O(n²) time · O(1) space' },
]

const CODE = {
  twoPointer: ['L=0, R=n-1', 'while L < R:', '  area = (R-L) * min(h[L],h[R])', '  maxArea = max(maxArea, area)', '  if h[L] < h[R]: L++', '  else: R--'],
  bruteForce: ['for i in 0..n-1:', '  for j in i+1..n:', '    area=(j-i)*min(h[i],h[j])', '    maxArea=max(maxArea,area)'],
}

const LEGEND = [
  { token: 'current', label: 'Left pointer (L)' },
  { token: 'special', label: 'Right pointer (R)' },
  { token: 'match',   label: 'New maximum' },
  { token: 'discard', label: 'Pointer moving away' },
]

export default function ContainerVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('twoPointer')
  const [customCase,   setCustomCase]   = useState(null)

  const { heights } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, heights), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook = useVisualizer(steps)
  const step = hook.step

  const maxH = Math.max(...heights, 1)
  const highlights = step?.highlights ?? []


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "heights",
                "label": "Heights",
                "type": "array",
                "placeholder": "1,8,6,2,5,4,8,3,7"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ heights: parsed.heights }); hook.reset()
      }}
    />
  )

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest} onTestChange={i => { setCustomCase(null); setSelectedTest(i); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo} onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step?.stats ? { 'Current Area': step.currentArea ?? 0, 'Max Area': step.maxArea ?? 0 } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Bar chart */}
        <div className={styles.bars}>
          {heights.map((h, i) => {
            const hl = highlights.find(x => x.index === i)
            const barClass = hl ? styles[hl.type] ?? '' : ''
            const isL = step?.left  === i
            const isR = step?.right === i
            return (
              <div key={i} className={styles.barWrap}>
                <div className={styles.ptrRow}>
                  {isL && <PointerLabel label="L" type="current" />}
                  {isR && <PointerLabel label="R" type="compare" />}
                </div>
                <div className={styles.barVal}>{h}</div>
                <div
                  className={`${styles.bar} ${barClass}`}
                  style={{ height: `${(h / maxH) * 200}px` }}
                />
                <div className={styles.barIdx}>{i}</div>
              </div>
            )
          })}
        </div>
        {/* Water fill overlay hint */}
        {step && step.left >= 0 && step.right > step.left && (
          <div className={styles.areaHint}>
            Area = {step.currentArea ?? 0} | Max = {step.maxArea ?? 0}
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
