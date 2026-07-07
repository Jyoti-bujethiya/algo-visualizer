import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './SpiralMatrix.module.css'

const TEST_CASES = [
  { label: '3×3 Classic',    detail: '→ [1,2,3,6,9,8,7,4,5]',              matrix: [[1,2,3],[4,5,6],[7,8,9]] },
  { label: '3×4 Rectangle',  detail: '→ [1,2,3,4,8,12,11,10,9,5,6,7]',    matrix: [[1,2,3,4],[5,6,7,8],[9,10,11,12]] },
  { label: '4×4 Square',     detail: '→ [1,2,3,4,8,12,16,15,…]',           matrix: [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]] },
  { label: '1×N Row',        detail: '→ [1,2,3,4,5]',                      matrix: [[1,2,3,4,5]] },
  { label: 'N×1 Column',     detail: '→ [1,2,3,4]',                        matrix: [[1],[2],[3],[4]] },
]

const ALGORITHMS = [
  { id: 'boundary',  name: 'Shrinking Boundaries (Optimal)', complexity: 'O(m·n) time · O(1) space' },
  { id: 'direction', name: 'Direction Array + Visited',       complexity: 'O(m·n) time · O(m·n) space' },
  { id: 'recursive', name: 'Recursive Peel',                  complexity: 'O(m·n) time · O(min(m,n)) space' },
]

const CODE = {
  boundary:  ['top=0, bottom=m-1, left=0, right=n-1;', 'while (top<=bottom && left<=right) {', '  → traverse top row (left→right); top++;', '  ↓ traverse right col (top→bottom); right--;', '  ← traverse bottom row (right→left); bottom--;', '  ↑ traverse left col (bottom→top); left++;', '}'],
  direction: ['dr[]={0,1,0,-1}, dc[]={1,0,-1,0}; dir=0;', 'for i in 0..m*n:', '  result.push(m[r][c]); visited[r][c]=true;', '  if next is wall/visited: turn right (dir++%4)', '  r+=dr[dir]; c+=dc[dir];'],
  recursive: ['if top>bottom || left>right: return;', '→ collect top row;', '↓ collect right col;', '← collect bottom row (if top<bottom);', '↑ collect left col (if left<right);', 'peel(top+1, bottom-1, left+1, right-1);'],
}

const LEGEND = [
  { token: 'current', label: 'Current cell' },
  { token: 'match',   label: 'Visited / collected' },
  { token: 'compare', label: 'Active boundary' },
  { token: 'special', label: 'Complete (all cells)' },
]

const DIR_COLORS = { right: styles.dirRight, down: styles.dirDown, left: styles.dirLeft, up: styles.dirUp }

function MatrixGrid({ matrix, step }) {
  if (!matrix || matrix.length === 0) return null
  const rows = matrix.length, cols = matrix[0].length
  const visited = step?.visited ?? new Set()
  const current = step?.current
  const phase = step?.phase
  const visitedOrder = [...visited]



  return (
    <div
      className={styles.matrixGrid}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {matrix.map((row, r) =>
        row.map((val, c) => {
          const k = `${r},${c}`
          const isCurrent = current && current.r === r && current.c === c && phase !== 'complete'
          const isVisited = visited.has(k)
          const isComplete = phase === 'complete'
          const dirCls = isCurrent ? (DIR_COLORS[step.dir] || '') : ''
          let cls = styles.cell
          if (isComplete) cls += ' ' + styles.special
          else if (isCurrent) cls += ' ' + (dirCls || styles.dirLeft)
          else if (isVisited) cls += ' ' + styles.visited

          const visitIdx = isVisited ? visitedOrder.indexOf(k) : -1

          return (
            <div key={`${r}-${c}`} className={cls}>
              {isCurrent && <span className={styles.cellPtr}>{r},{c}</span>}
              <span className={styles.cellVal}>{val}</span>
              {isVisited && !isComplete && visitIdx >= 0 && (
                <span className={styles.visitOrder}>{visitIdx + 1}</span>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

export default function SpiralMatrixVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('boundary')
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
  const bnd = step?.boundaries

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={i => { setCustomCase(null); setSelectedTest(i); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'Direction':  step.dir || '—',
        'Collected':  `${step.result?.length ?? 0} / ${matrix.length * matrix[0].length}`,
        'Boundaries': bnd ? `T${bnd.top} B${bnd.bottom} L${bnd.left} R${bnd.right}` : '—',
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <MatrixGrid matrix={matrix} step={step} />

        {step && step.result?.length > 0 && (
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>Collected:</span>
            <span className={styles.resultList}>
              [{step.result.join(', ')}{step.phase !== 'complete' ? '…' : ''}]
            </span>
          </div>
        )}

        {step?.phase === 'complete' && (
          <div className={styles.resultBadge}>
            ✅ Spiral: [{step.result.join(', ')}]
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
