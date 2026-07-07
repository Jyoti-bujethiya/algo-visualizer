import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './PacificAtlantic.module.css'

const TEST_CASES = [
  {
    label: 'Test 1 — 5×5 grid', detail: 'LeetCode example',
    heights: [
      [1,2,2,3,5],
      [3,2,3,4,4],
      [2,4,5,3,1],
      [6,7,1,4,5],
      [5,1,1,2,4],
    ],
  },
  {
    label: 'Test 2 — Uniform grid 2×2', detail: 'All 1s — all cells qualify',
    heights: [[1,1],[1,1]],
  },
  {
    label: 'Test 3 — 3×3 grid', detail: 'Center peak',
    heights: [[1,2,3],[8,9,4],[7,6,5]],
  },
  {
    label: 'Test 4 — 1×1 grid', detail: 'Single cell',
    heights: [[10]],
  },
]

const ALGORITHMS = [
  { id: 'dfs', name: 'DFS (Reverse flow)', complexity: 'O(m·n) time · O(m·n) space' },
  { id: 'bfs', name: 'BFS (Reverse flow)', complexity: 'O(m·n) time · O(m·n) space' },
]

const CODE = {
  dfs: [
    'function pacificAtlantic(heights):',
    '  DFS from Pacific borders (top, left)',
    '  DFS from Atlantic borders (bottom, right)',
    '  function dfs(r, c, visited, prevHeight):',
    '    if OOB or visited or height < prevHeight: return',
    '    visited.add((r,c))',
    '    dfs 4 neighbors',
    '  return intersection of pacific & atlantic sets',
  ],
  bfs: [
    'function pacificAtlantic(heights):',
    '  BFS from Pacific borders (top, left)',
    '  BFS from Atlantic borders (bottom, right)',
    '  function bfs(starts, visited):',
    '    while queue not empty:',
    '      pop cell; explore neighbors >= current height',
    '    return visited set',
    '  return intersection of pacific & atlantic sets',
  ],
}

const LEGEND = [
  { token: 'compare',  label: 'Pacific reachable' },
  { token: 'visiting', label: 'Atlantic reachable' },
  { token: 'done',     label: 'Reaches BOTH oceans ✓' },
]

/* ── Raindrop SVG (for dual-ocean cells) ── */
function RaindropSVG() {


  return (
    <svg viewBox="0 0 18 24" className={styles.raindrop}>
      {/* drop body */}
      <path d="M9,1 Q16,10 16,16 A7,7 0 0 1 2,16 Q2,10 9,1 Z" fill="#22d3ee" stroke="#0891b2" strokeWidth="1"/>
      {/* highlight */}
      <ellipse cx="11" cy="12" rx="2" ry="4" fill="white" opacity="0.4" transform="rotate(-20 11 12)"/>
    </svg>
  )
}

/* ── Pacific wave border SVG (decorative top-left strip) ── */
function WaveSVG({ color }) {
  return (
    <svg viewBox="0 0 60 14" className={styles.waveStrip}>
      <path d="M0,7 Q5,2 10,7 Q15,12 20,7 Q25,2 30,7 Q35,12 40,7 Q45,2 50,7 Q55,12 60,7"
        stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

function getCellClass(r, c, highlights, styles) {
  const hl = highlights[`${r},${c}`]
  if (hl === 'done')     return styles.cellBoth
  if (hl === 'compare')  return styles.cellPacific
  if (hl === 'visiting') return styles.cellAtlantic
  return styles.cellNone
}

export default function PacificAtlanticVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('dfs')
  const [customCase,   setCustomCase]   = useState(null)

  const { heights } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, heights), [selectedAlgo, selectedTest, customCase]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const customInputUI = (
    <CustomInput
      fields={[{ key: 'heights', label: 'Heights (rows; cols,)', type: 'text', placeholder: '1,2,2,3,5;3,2,3,4,4;2,4,5,3,1' }]}
      onApply={parsed => {
        const heights = parsed.heights.split(';').map(row => row.split(',').map(Number))
        setCustomCase({ heights }); hook.reset()
      }}
    />
  )

  const highlights = step?.highlights ?? {}
  const result     = step?.result
  const cols = heights[0]?.length ?? 0
  const rows = heights.length

  // Border detection helpers
  function isPacificBorder(r, c) { return r === 0 || c === 0 }
  function isAtlanticBorder(r, c) { return r === rows - 1 || c === cols - 1 }

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'Grid': `${heights.length}×${cols}`,
        ...(result !== undefined ? { 'Both oceans': result.length } : {}),
        ...(step.done ? { 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Ocean labels with wave strips */}
        <div className={styles.oceanRow}>
          <div className={styles.oceanBadge} style={{ color: '#2563eb', borderColor: '#3b82f6', background: '#eff6ff' }}>
            <WaveSVG color="#3b82f6" />
            <span>Pacific</span>
          </div>
          <div className={styles.oceanSep}>flows →</div>
          <div className={styles.oceanBadge} style={{ color: '#0891b2', borderColor: '#06b6d4', background: '#ecfeff' }}>
            <WaveSVG color="#06b6d4" />
            <span>Atlantic</span>
          </div>
        </div>

        <div
          className={styles.grid}
          style={{ gridTemplateColumns: `repeat(${cols}, 44px)` }}
        >
          {heights.map((row, r) =>
            row.map((val, c) => {
              const hl = highlights[`${r},${c}`]
              const isP = isPacificBorder(r, c)
              const isA = isAtlanticBorder(r, c)
              return (
                <div
                  key={`${r},${c}`}
                  className={`${styles.cell} ${getCellClass(r, c, highlights, styles)} ${isP ? styles.pacificBorder : ''} ${isA ? styles.atlanticBorder : ''}`}
                  title={`(${r},${c})=${val}`}
                >
                  {hl === 'done' ? <RaindropSVG /> : <span className={styles.cellVal}>{val}</span>}
                </div>
              )
            })
          )}
        </div>

        {result && result.length > 0 && (
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>Both-ocean cells:</span>
            <span className={styles.resultCount}>{result.length} cells</span>
            <span className={styles.resultHint}>
              {result.slice(0, 4).map(([r,c]) => `[${r},${c}]`).join(' ')}
              {result.length > 4 ? ` +${result.length - 4}` : ''}
            </span>
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
