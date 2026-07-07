import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './SetMatrixZeroes.module.css'

const TEST_CASES = [
  { label: 'Example 1',   detail: '[[1,1,1],[1,0,1],[1,1,1]] → one zero', matrix: [[1,1,1],[1,0,1],[1,1,1]] },
  { label: 'Example 2',   detail: '[[0,1,2,0],[3,4,5,2],[1,3,1,5]]',      matrix: [[0,1,2,0],[3,4,5,2],[1,3,1,5]] },
  { label: 'Corner Zero', detail: 'Zero at top-left corner',               matrix: [[0,1,2],[3,4,5],[6,7,8]] },
  { label: 'All Zeroes',  detail: '[[0,0],[0,0]] — already all zeros',     matrix: [[0,0],[0,0]] },
  { label: 'No Zeroes',   detail: '[[1,2,3],[4,5,6],[7,8,9]] — no change', matrix: [[1,2,3],[4,5,6],[7,8,9]] },
]

const ALGORITHMS = [
  { id: 'markers',  name: 'First Row/Col Markers (Optimal)', complexity: 'O(m·n) time · O(1) space' },
  { id: 'booleans', name: 'Boolean Arrays',                  complexity: 'O(m·n) time · O(m+n) space' },
  { id: 'hashsets', name: 'Hash Sets',                       complexity: 'O(m·n) time · O(m+n) space' },
  { id: 'brute',    name: 'Brute Force (Matrix Copy)',        complexity: 'O(m·n·(m+n)) time · O(m·n) space' },
]

const CODE = {
  markers:  ['firstRowZero = any(matrix[0][j]==0)', 'firstColZero = any(matrix[i][0]==0)', '// Mark: scan interior for zeros', 'for i=1..m: for j=1..n:', '  if matrix[i][j]==0:', '    matrix[i][0]=0; matrix[0][j]=0', '// Apply: zero out from markers', 'for i=1..m: for j=1..n:', '  if matrix[i][0]==0 || matrix[0][j]==0:', '    matrix[i][j] = 0', '// Zero first row/col if needed', 'if firstRowZero: zero row 0', 'if firstColZero: zero col 0'],
  booleans: ['rowZero = bool[m] = false', 'colZero = bool[n] = false', 'for i,j: if matrix[i][j]==0:', '  rowZero[i]=true; colZero[j]=true', 'for i,j:', '  if rowZero[i] || colZero[j]:', '    matrix[i][j] = 0'],
  hashsets: ['zeroRows = {}; zeroCols = {}', 'for i,j: if matrix[i][j]==0:', '  zeroRows.add(i); zeroCols.add(j)', 'for i,j:', '  if i in zeroRows or j in zeroCols:', '    matrix[i][j] = 0'],
  brute:    ['copy = matrix.clone()', 'for i,j: if copy[i][j]==0:', '  zero entire row i', '  zero entire col j'],
}

const LEGEND = [
  { token: 'current', label: 'Active cell (highlight)' },
  { token: 'match',   label: 'Zero (existing or just set)' },
  { token: 'special', label: 'Marker cell (first row/col)' },
  { token: 'compare', label: 'Entire row or col zeroed' },
]

function MatrixGrid({ step, algo }) {
  if (!step) return null
  const m = step.matrix
  if (!m || m.length === 0) return null
  const rows = m.length, cols = m[0].length
  const hlSet = new Set((step.highlight || []).map(([r, c]) => `${r},${c}`))
  const isComplete = step.phase === 'complete'



  return (
    <div className={styles.matrixWrap}>
      <div
        className={styles.matrixGrid}
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {m.map((row, r) =>
          row.map((val, c) => {
            const isHL = hlSet.has(`${r},${c}`)
            const isZero = val === 0
            const isMarker = (r === 0 || c === 0) && algo === 'markers' && !isHL && !isComplete
            let cls = styles.cell
            if (isComplete && isZero) cls += ' ' + styles.match
            else if (isHL) cls += ' ' + styles.current
            else if (isZero) cls += ' ' + styles.match
            else if (isMarker) cls += ' ' + styles.special
            return (
              <div key={`${r}-${c}`} className={cls}>
                {isHL && !isComplete && <span className={styles.cellPtr}>{r},{c}</span>}
                {val}
              </div>
            )
          })
        )}
      </div>

      {(step.zeroRows?.length > 0 || step.zeroCols?.length > 0) && (
        <div className={styles.badges}>
          {step.zeroRows?.length > 0 && <span className={styles.badge}>Zero rows: {'{' + step.zeroRows.join(', ') + '}'}</span>}
          {step.zeroCols?.length > 0 && <span className={styles.badge}>Zero cols: {'{' + step.zeroCols.join(', ') + '}'}</span>}
        </div>
      )}
    </div>
  )
}

export default function SetMatrixZeroesVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('markers')
  const [customCase,   setCustomCase]   = useState(null)

  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "matrix",
                "label": "Matrix (rows, semicolons)",
                "type": "text",
                "placeholder": "1,1,1;1,0,1;1,1,1"
            }
        ]}
      onApply={parsed => {
        const matrix = parsed.matrix.split(';').map(row => row.split(',').map(Number))
        setCustomCase({ matrix }); hook.reset()
      }}
    />
  )

  const { matrix } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, matrix), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook = useVisualizer(steps)
  const step = hook.step

  const zeros = step ? step.matrix.flat().filter(v => v === 0).length : 0

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={i => { setCustomCase(null); setSelectedTest(i); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'Rows':   step.matrix.length,
        'Cols':   step.matrix[0].length,
        'Zeros':  zeros,
        'Phase':  step.phase || '—',
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <MatrixGrid step={step} algo={selectedAlgo} />
        {step?.phase === 'complete' && (
          <div className={styles.resultBadge}>✅ Matrix zeroed in-place!</div>
        )}
      </div>
    </VisualizerShell>
  )
}
