import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './NQueens.module.css'

const TEST_CASES = [
  { label: 'Test 1 — n=4', detail: '2 solutions', n: 4 },
  { label: 'Test 2 — n=1', detail: '1 solution',  n: 1 },
  { label: 'Test 3 — n=5', detail: '10 solutions', n: 5 },
  { label: 'Test 4 — n=6', detail: '4 solutions',  n: 6 },
]

const ALGORITHMS = [
  { id: 'bt', name: 'Backtracking (row-by-row)', complexity: 'O(n!) time · O(n) space' },
]

const CODE = {
  bt: [
    'function solveNQueens(n):',
    '  board = n×n empty; result=[]',
    '  cols=set; diag1=set; diag2=set',
    '  function backtrack(row):',
    '    if row==n: record solution',
    '    for col = 0 to n-1:',
    '      if conflict: continue',
    '      place queen; mark sets',
    '      backtrack(row+1)',
    '      remove queen; unmark sets',
    '  backtrack(0)',
  ],
}

const LEGEND = [
  { token: 'compare', label: 'Placed queen ♛' },
  { token: 'current', label: 'Trying this cell' },
  { token: 'match',   label: 'Solution found ✓' },
  { token: 'error',   label: 'Under attack ✗' },
  { token: 'discard', label: 'Backtracked' },
]

/* ── SVG queen piece ── */
function QueenSVG({ color = '#f59e0b' }) {


  return (
    <svg viewBox="0 0 40 40" className={styles.queenSvg}>
      {/* crown base */}
      <rect x="8" y="28" width="24" height="6" rx="2" fill={color}/>
      {/* crown body */}
      <path d="M10,28 L10,18 L16,24 L20,12 L24,24 L30,18 L30,28 Z" fill={color}/>
      {/* crown points / balls */}
      <circle cx="10" cy="17" r="3" fill={color}/>
      <circle cx="20" cy="11" r="3" fill={color}/>
      <circle cx="30" cy="17" r="3" fill={color}/>
      {/* crown detail */}
      <path d="M10,28 L10,18 L16,24 L20,12 L24,24 L30,18 L30,28 Z" fill="none" stroke="#fff" strokeWidth="1" opacity="0.4"/>
      {/* shimmer */}
      <ellipse cx="16" cy="16" rx="2.5" ry="1.5" fill="#fff" opacity="0.35" transform="rotate(-20 16 16)"/>
    </svg>
  )
}

/* ── X mark for attacked cells ── */
function XMarkSVG() {
  return (
    <svg viewBox="0 0 40 40" className={styles.xMarkSvg}>
      <line x1="10" y1="10" x2="30" y2="30" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
      <line x1="30" y1="10" x2="10" y2="30" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}

function getCellState(ri, ci, rawHl) {
  return rawHl[`${ri},${ci}`] ?? null
}

function getCellClass(state, isLight, styles) {
  const chess = isLight ? styles.cellLight : styles.cellDark
  if (state === 'placed') return `${chess} ${styles.cellQueen}`
  if (state === 'trying') return `${chess} ${styles.cellTrying}`
  if (state === 'error')  return `${chess} ${styles.cellError}`
  if (state === 'done')   return `${chess} ${styles.cellDone}`
  if (state === 'solution') return `${chess} ${styles.cellSolution}`
  return chess
}

export default function NQueensVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('bt')
  const [customCase,   setCustomCase]   = useState(null)

  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "n",
                "label": "n (queens)",
                "type": "number",
                "placeholder": "6"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ n: parsed.n }); hook.reset()
      }}
    />
  )
  const { n } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(n), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const board     = step?.board ?? Array.from({ length: n }, () => new Array(n).fill(0))
  const rawHl     = step?.highlights ?? {}
  const solutions = step?.solutions ?? []

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? { 'n': n, 'Solutions found': solutions.length, ...(step.done ? {'Status':'Done ✓'}:{}) } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {solutions.length > 0 && (
          <div className={styles.solutionBadge}>♛ Solutions: {solutions.length}</div>
        )}

        {/* ── Chess board ── */}
        <div className={styles.board} style={{ gridTemplateColumns: `repeat(${n}, 56px)` }}>
          {board.map((row, ri) =>
            row.map((cell, ci) => {
              const state   = getCellState(ri, ci, rawHl)
              const isLight = (ri + ci) % 2 === 0
              const cls     = getCellClass(state, isLight, styles)
              const hasQueen = cell === 1 || state === 'placed'
              const isSolution = state === 'solution'
              return (
                <div key={`${ri}-${ci}`} className={`${styles.cell} ${cls}`}>
                  {hasQueen || isSolution
                    ? <QueenSVG color={isSolution ? '#16a34a' : state === 'placed' ? '#f59e0b' : '#f59e0b'} />
                    : state === 'error'
                      ? <XMarkSVG />
                      : null
                  }
                </div>
              )
            })
          )}
        </div>

        {/* ── Solution chips ── */}
        {solutions.length > 0 && (
          <div className={styles.solutionsRow}>
            {solutions.map((sol, i) => (
              <span key={i} className={styles.solChip}>
                ♛[{sol.join(',')}]
              </span>
            ))}
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
