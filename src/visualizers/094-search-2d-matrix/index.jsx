import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './Search2D.module.css'

const TEST_CASES = [
  {
    label: 'Test 1 — target=3, found', detail: 'LeetCode example',
    matrix: [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target: 3,
  },
  {
    label: 'Test 2 — target=13, not found', detail: 'LeetCode example 2',
    matrix: [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target: 13,
  },
  {
    label: 'Test 3 — 2×2, target=3', detail: 'Small matrix',
    matrix: [[1,3],[5,7]], target: 3,
  },
  {
    label: 'Test 4 — 1×1, target=2', detail: 'Single cell miss',
    matrix: [[1]], target: 2,
  },
]

const ALGORITHMS = [
  { id: 'binary', name: 'Binary Search (Flat)', complexity: 'O(log(m·n)) time · O(1) space' },
]

const CODE = {
  binary: [
    'function searchMatrix(matrix, target):',
    '  m = rows, n = cols',
    '  lo = 0, hi = m*n - 1',
    '  while lo <= hi:',
    '    mid = (lo + hi) >>> 1',
    '    r = mid / n | 0,  c = mid % n',
    '    if matrix[r][c] == target: return true',
    '    else if matrix[r][c] < target: lo = mid + 1',
    '    else: hi = mid - 1',
    '  return false',
  ],
}

const LEGEND = [
  { token: 'compare', label: 'Active search range' },
  { token: 'current', label: 'mid cell (being checked)' },
  { token: 'match',   label: 'Found!' },
]

function getCellClass(r, c, highlights, styles) {
  const hl = highlights[`${r},${c}`]
  if (hl === 'match')   return styles.cellMatch
  if (hl === 'current') return styles.cellCurrent
  if (hl === 'compare') return styles.cellCompare
  return ''
}

export default function Search2DMatrixVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('binary')
  const [customCase,   setCustomCase]   = useState(null)

  const { matrix, target } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(matrix, target), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const highlights = step?.highlights ?? {}
  const lo     = step?.lo
  const hi     = step?.hi
  const mid    = step?.mid
  const result = step?.result

  const m = matrix.length
  const n = matrix[0].length


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "matrix",
                "label": "Matrix (rows, semicolons)",
                "type": "text",
                "placeholder": "1,3,5,7;10,11,16,20;23,30,34,60"
            },
            {
                "key": "target",
                "label": "Target",
                "type": "number",
                "placeholder": "3"
            }
        ]}
      onApply={parsed => {
        const matrix = parsed.matrix.split(';').map(row => row.split(',').map(Number))
        setCustomCase({ matrix, target }); hook.reset()
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
        'Target': target,
        'Matrix': `${m}×${n}`,
        ...(lo !== undefined ? { 'lo': lo } : {}),
        ...(hi !== undefined ? { 'hi': hi } : {}),
        ...(mid !== undefined && mid >= 0 ? { 'mid': mid, 'cell': `(${(mid/n)|0},${mid%n})` } : {}),
        ...(result !== undefined ? { 'Found': result ? 'Yes ✓' : 'No ✗' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {result !== undefined && (
          <div className={`${styles.resultBadge} ${result ? styles.resultFound : styles.resultNone}`}>
            {result ? `Found at (${result[0]},${result[1]}) ✓` : 'Not Found ✗'}
          </div>
        )}
        <div className={styles.matrixWrap}>
          {matrix.map((row, r) => (
            <div key={r} className={styles.matrixRow}>
              {row.map((val, c) => (
                <div key={c} className={`${styles.cell} ${getCellClass(r, c, highlights, styles)}`}>
                  {val}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className={styles.indexLabel}>
          Flat indices: 0..{m * n - 1}
          {mid !== undefined && mid >= 0 ? ` | mid=${mid} → (${(mid/n)|0},${mid%n})` : ''}
        </div>
      </div>
    </VisualizerShell>
  )
}
