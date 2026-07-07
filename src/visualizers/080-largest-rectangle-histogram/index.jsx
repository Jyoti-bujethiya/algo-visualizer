import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import ArrayDisplay from '../../components/display/ArrayDisplay.jsx'
import styles from './Histogram.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [2,1,5,6,2,3]', detail: 'Max area: 10',  heights:[2,1,5,6,2,3] },
  { label: 'Test 2 — [2,4]',          detail: 'Max area: 4',   heights:[2,4] },
  { label: 'Test 3 — [6,2,5,4,5,1,6]',detail: 'Max area: 12', heights:[6,2,5,4,5,1,6] },
  { label: 'Test 4 — [1,1,1,1,1]',   detail: 'Max area: 5',   heights:[1,1,1,1,1] },
]

const ALGORITHMS = [
  { id: 'mono', name: 'Monotonic Stack', complexity: 'O(n) time · O(n) space' },
]

const CODE = {
  mono: [
    'function largestRectangleArea(heights):',
    '  stack=[]; maxArea=0',
    '  for i = 0 to n (include sentinel 0):',
    '    h = i==n ? 0 : heights[i]',
    '    while stack and h < heights[stack.top]:',
    '      height = heights[stack.pop()]',
    '      width = stack.empty ? i : i - stack.top - 1',
    '      maxArea = max(maxArea, height * width)',
    '    stack.push(i)',
    '  return maxArea',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Current bar' },
  { token: 'compare', label: 'On monotonic stack' },
  { token: 'match',   label: 'Best rectangle found' },
  { token: 'done',    label: 'Popped / processed' },
]

export default function LargestRectangleVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('mono')
  const [customCase,   setCustomCase]   = useState(null)
  const { heights } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(heights), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step
  const stack      = step?.stack      ?? []
  const maxArea    = step?.maxArea    ?? 0
  const highlights = step?.highlights ?? {}
  const arrHighlights = Object.entries(highlights).map(([k, v]) => ({ index: Number(k), type: v }))
  const maxH = Math.max(...heights, 1)


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "heights",
                "label": "Heights",
                "type": "array",
                "placeholder": "2,1,5,6,2,3"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ heights: parsed.heights }); hook.reset()
      }}
    />
  )

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? { 'Bars': heights.length, 'Max area so far': maxArea, ...(step.done ? {'Final max area': maxArea, 'Status':'Done ✓'}:{}) } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {maxArea > 0 && <div className={styles.areaBadge}>Max Area: {maxArea}</div>}
        <div className={styles.histogram}>
          {heights.map((h, i) => {
            const hl = highlights[i]
            const barClass = hl === 'current' ? styles.barCurrent
              : hl === 'compare' ? styles.barStack
              : hl === 'match'   ? styles.barBest
              : hl === 'done'    ? styles.barDone
              : styles.bar
            return (
              <div key={i} className={styles.barWrap}>
                <div
                  className={barClass}
                  style={{ height: `${(h / maxH) * 140}px` }}
                  title={`h[${i}]=${h}`}
                />
                <span className={styles.barLabel}>{h}</span>
              </div>
            )
          })}
        </div>
        <div className={styles.label}>Heights</div>
        <ArrayDisplay elements={heights} highlights={arrHighlights} />
        <div className={styles.label}>Stack (indices, top→)</div>
        <div className={styles.stackRow}>
          {stack.length === 0
            ? <span className={styles.empty}>[ empty ]</span>
            : [...stack].reverse().map((idx, i) => (
              <span key={i} className={`${styles.stackCell} ${i === 0 ? styles.stackTop : ''}`}>
                {idx}<br /><span className={styles.tempLbl}>{heights[idx]}</span>
              </span>
            ))
          }
        </div>
      </div>
    </VisualizerShell>
  )
}
