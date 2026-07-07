import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './KClosest.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [[1,3],[-2,2]], k=1',              detail: '[[-2,2]]',           points:[[1,3],[-2,2]],                         k:1 },
  { label: 'Test 2 — [[3,3],[5,-1],[-2,4]], k=2',       detail: '[[3,3],[-2,4]]',     points:[[3,3],[5,-1],[-2,4]],                  k:2 },
  { label: 'Test 3 — [[0,1],[1,0],[1,1],[-1,-1]], k=3', detail: '3 closest',          points:[[0,1],[1,0],[1,1],[-1,-1]],            k:3 },
  { label: 'Test 4 — [[2,2],[2,-2],[-2,2],[-2,-2],[0,3]], k=2', detail: '4 equidist.', points:[[2,2],[2,-2],[-2,2],[-2,-2],[0,3]],  k:2 },
]

const ALGORITHMS = [
  { id: 'heap', name: 'Max-Heap of size k', complexity: 'O(n log k) time · O(k) space' },
]

const CODE = {
  heap: [
    'function kClosest(points, k):',
    '  heap = max-heap (by dist², size k)',
    '  for each point [x,y]:',
    '    d = x²+y²',
    '    heap.push([d, x, y])',
    '    if heap.size > k: heap.pop()  // remove farthest',
    '  return heap elements',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Being processed' },
  { token: 'match',   label: 'In heap (k closest so far)' },
  { token: 'discard', label: 'Evicted (too far)' },
]

export default function KClosestVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('heap')
  const [customCase,   setCustomCase]   = useState(null)
  const { points, k } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(points, k), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const heap       = step?.heap       ?? []
  const highlights = step?.highlights ?? {}
  const result     = step?.result

  // SVG scatter plot
  const W = 280, H = 280, cx = W / 2, cy = H / 2, scale = 30


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "points",
                "label": "Points (semicolons)",
                "type": "text",
                "placeholder": "1,3;-2,2"
            },
            {
                "key": "k",
                "label": "k",
                "type": "number",
                "placeholder": "1"
            }
        ]}
      onApply={parsed => {
        const points = parsed.points.split(';').map(seg => { const [x,y] = seg.split(',').map(Number); return [x,y] })
        setCustomCase({ points, k }); hook.reset()
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
      stats={step ? {
        'k': k,
        'Heap size': heap.length,
        ...(result ? { 'Result': result.map(p=>`[${p}]`).join(' ') } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <svg width={W} height={H} className={styles.plot}>
          {/* axes */}
          <line x1={cx} y1={0} x2={cx} y2={H} className={styles.axis} />
          <line x1={0} y1={cy} x2={W} y2={cy} className={styles.axis} />
          <text x={cx+4} y={12} className={styles.axisLabel}>y</text>
          <text x={W-12} y={cy-4} className={styles.axisLabel}>x</text>
          {/* Origin */}
          <circle cx={cx} cy={cy} r={4} className={styles.origin} />
          {points.map(([x, y], i) => {
            const hl = highlights[i]
            const px = cx + x * scale, py = cy - y * scale
            return (
              <g key={i}>
                <circle
                  cx={px} cy={py} r={8}
                  className={`${styles.point}
                    ${hl === 'current' ? styles.ptCurrent : ''}
                    ${hl === 'match'   ? styles.ptMatch   : ''}
                    ${hl === 'discard' ? styles.ptDiscard : ''}`}
                />
                <text x={px + 10} y={py + 4} className={styles.ptLabel}>[{x},{y}]</text>
              </g>
            )
          })}
        </svg>

        <div className={styles.label}>Max-Heap root = farthest in current k</div>
        <div className={styles.heapRow}>
          {heap.length === 0
            ? <span className={styles.empty}>empty</span>
            : heap.map(([d, x, y], i) => (
              <span key={i} className={`${styles.heapCell} ${i === 0 ? styles.heapRoot : ''}`}>
                [{x},{y}]<br /><span className={styles.distLbl}>d²={d}</span>
              </span>
            ))
          }
        </div>
      </div>
    </VisualizerShell>
  )
}
