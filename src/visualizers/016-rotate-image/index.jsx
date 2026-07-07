import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import PointerLabel from '../../components/display/PointerLabel.jsx'
import styles from './RotateImage.module.css'

const TEST_CASES = [
  { label: '3×3 Classic',  detail: '[[1,2,3],[4,5,6],[7,8,9]]',               matrix: [[1,2,3],[4,5,6],[7,8,9]] },
  { label: '4×4 Matrix',   detail: '[[5,1,9,11],[2,4,8,10],…]',               matrix: [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]] },
  { label: '2×2 Small',    detail: '[[1,2],[3,4]]',                            matrix: [[1,2],[3,4]] },
  { label: '1×1 Trivial',  detail: '[[42]]',                                   matrix: [[42]] },
]

const ALGORITHMS = [
  { id: 'transpose', name: 'Transpose + Reverse Rows (Optimal)', complexity: 'O(n²) time · O(1) space' },
  { id: 'cycle',     name: 'Four-Way Cycle (Layer-by-layer)',     complexity: 'O(n²) time · O(1) space' },
  { id: 'copy',      name: 'Copy to New Matrix',                  complexity: 'O(n²) time · O(n²) space' },
]

const CODE = {
  transpose: ['// Step 1: Transpose', 'for i in 0..n: for j in i+1..n:', '  swap(m[i][j], m[j][i]);', '// Step 2: Reverse each row', 'for i in 0..n:', '  reverse(m[i].begin(), m[i].end());'],
  cycle:     ['for layer in 0..n/2:', '  for i in first..last:', '    top = m[first][i];', '    m[first][i] = m[last-off][first];   // L→T', '    m[last-off][first] = m[last][last-off]; // B→L', '    m[last][last-off] = m[i][last];    // R→B', '    m[i][last] = top;                  // T→R'],
  copy:      ['vector<vector<int>> res(n, vector<int>(n));', 'for i in 0..n: for j in 0..n:', '  res[j][n-1-i] = m[i][j];', 'm = res;'],
}

const LEGEND = [
  { token: 'special', label: 'Swap / Source' },
  { token: 'match',   label: 'After swap / Done' },
  { token: 'compare', label: 'Row being reversed' },
  { token: 'current', label: 'Ring outline (layer)' },
  { token: 'discard', label: 'Top position in cycle' },
]

// Map codeKey → line index per algo
// Highlight type → CSS token
const hlTypeMap = {
  swap: 'special', done: 'match', row: 'compare', ring: 'current',
  top: 'discard', right: 'compare', bottom: 'current', left: 'match', src: 'special',
}

function MatrixGrid({ matrix, highlights, phase, label, resMatrix }) {
  if (!matrix || matrix.length === 0) return null
  const n = matrix.length, nc = matrix[0].length
  const hlMap = {}
  for (const h of (highlights || [])) hlMap[`${h.r},${h.c}`] = h.type
  const isComplete = phase === 'complete'



  return (
    <div className={styles.matrixWrap}>
      {label && <div className={styles.matrixLabel}>{label}</div>}
      <div
        className={styles.matrixGrid}
        style={{ gridTemplateColumns: `repeat(${nc}, 1fr)` }}
      >
        {matrix.map((row, r) =>
          row.map((val, c) => {
            const hlType = hlMap[`${r},${c}`]
            const token = isComplete ? 'match' : (hlType ? hlTypeMap[hlType] : '')
            const isActive = !!hlType && !isComplete
            return (
              <div key={`${r}-${c}`} className={`${styles.cell} ${token ? styles[token] : ''}`}>
                {isActive && <span className={styles.cellPtr}>{r},{c}</span>}
                {val}
              </div>
            )
          })
        )}
      </div>
      {resMatrix && (
        <div className={styles.matrixWrap} style={{ marginTop: 12 }}>
          <div className={styles.matrixLabel}>Result</div>
          <div className={styles.matrixGrid} style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
            {resMatrix.map((row, r) => row.map((val, c) => (
              <div key={`${r}-${c}`} className={`${styles.cell} ${val !== 0 ? styles.match : ''}`}>{val}</div>
            )))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function RotateImageVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('transpose')
  const [customCase,   setCustomCase]   = useState(null)

  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "matrix",
                "label": "Matrix (rows, semicolons)",
                "type": "text",
                "placeholder": "1,2,3;4,5,6;7,8,9"
            }
        ]}
      onApply={parsed => {
        const matrix = parsed.matrix.split(';').map(row => row.split(',').map(x => isNaN(Number(x)) ? x : Number(x)))
        setCustomCase({ matrix }); hook.reset()
      }}
    />
  )

  const { matrix } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, matrix), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook = useVisualizer(steps)
  const step = hook.step

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={i => { setCustomCase(null); setSelectedTest(i); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'Size':  `${step.matrix.length}×${step.matrix.length}`,
        'Phase': step.phase || step.codeKey || '—',
        'Step':  step ? `${hook.stepIndex + 1} / ${steps.length}` : '—',
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {step && (
          step.resMatrix
            ? (
              <div className={styles.sideBySide}>
                <MatrixGrid matrix={step.matrix} highlights={step.highlights} phase={step.phase} label="Current" />
                <MatrixGrid matrix={step.resMatrix} highlights={[]} phase="" label="Result" />
              </div>
            )
            : <MatrixGrid matrix={step.matrix} highlights={step.highlights} phase={step.phase} />
        )}
        {step?.phase === 'complete' && (
          <div className={styles.resultBadge}>
            ✅ 90° clockwise rotation complete: [{step.matrix.map(r => `[${r.join(',')}]`).join(', ')}]
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
