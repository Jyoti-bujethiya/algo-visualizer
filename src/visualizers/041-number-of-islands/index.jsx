import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './Islands.module.css'

const TEST_CASES = [
  {
    label: 'Test 1 — 4×5 grid (1 island)', detail: 'LeetCode Example 1',
    grid: [
      ['1','1','1','1','0'],
      ['1','1','0','1','0'],
      ['1','1','0','0','0'],
      ['0','0','0','0','0'],
    ],
  },
  {
    label: 'Test 2 — 4×5 grid (3 islands)', detail: 'LeetCode Example 2',
    grid: [
      ['1','1','0','0','0'],
      ['1','1','0','0','0'],
      ['0','0','1','0','0'],
      ['0','0','0','1','1'],
    ],
  },
  {
    label: 'Test 3 — Single island', detail: 'All land',
    grid: [
      ['1','1'],
      ['1','1'],
    ],
  },
  {
    label: 'Test 4 — No islands', detail: 'All water',
    grid: [
      ['0','0'],
      ['0','0'],
    ],
  },
]

const ALGORITHMS = [
  { id: 'dfs', name: 'DFS (Flood Fill)',  complexity: 'O(m·n) time · O(m·n) space' },
  { id: 'bfs', name: 'BFS (Queue)',       complexity: 'O(m·n) time · O(min(m,n)) space' },
]

const CODE = {
  dfs: [
    'function numIslands(grid):',
    '  count = 0',
    '  for each cell (r,c) in grid:',
    '    if grid[r][c] == \'1\':',
    '      dfs(r, c); count++',
    '  return count',
    'function dfs(r, c):',
    '  if out of bounds or grid[r][c] != \'1\': return',
    '  grid[r][c] = \'0\'  // mark visited',
    '  dfs(r±1,c); dfs(r,c±1)',
  ],
  bfs: [
    'function numIslands(grid):',
    '  count = 0',
    '  for each cell (r,c) in grid:',
    '    if grid[r][c] == \'1\':',
    '      bfs(r, c); count++',
    '  return count',
    'function bfs(r, c):',
    '  queue = [(r,c)]; mark visited',
    '  while queue not empty:',
    '    pop (r,c); explore 4 neighbors',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'DFS/BFS frontier' },
  { token: 'compare',  label: 'Queued (BFS)' },
  { token: 'match',    label: 'Visited land (island)' },
  { token: 'special',  label: 'Scanner' },
]

/* Per-island color palette */
const ISLAND_PALETTE = [
  { bg: '#d1fae5', border: '#16a34a', icon: '#15803d' },
  { bg: '#dbeafe', border: '#2563eb', icon: '#1d4ed8' },
  { bg: '#fef9c3', border: '#d97706', icon: '#b45309' },
  { bg: '#f3e8ff', border: '#7c3aed', icon: '#6d28d9' },
  { bg: '#fce7f3', border: '#db2777', icon: '#be185d' },
  { bg: '#ccfbf1', border: '#0d9488', icon: '#0f766e' },
]

/* ── SVG Icons ── */
function TreeSVG({ color = '#15803d' }) {
  return (
    <svg viewBox="0 0 32 32" className={styles.cellIcon}>
      <rect x="14" y="22" width="4" height="7" rx="1" fill="#92400e"/>
      <polygon points="16,2 27,16 5,16" fill={color}/>
      <polygon points="16,8 26,20 6,20" fill={color} opacity="0.8"/>
    </svg>
  )
}

function WaveSVG() {
  return (
    <svg viewBox="0 0 32 32" className={styles.cellIcon}>
      <path d="M2,18 Q8,12 14,18 Q20,24 26,18 Q29,15 30,16" stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M2,23 Q8,17 14,23 Q20,29 26,23 Q29,20 30,21" stroke="#60a5fa" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
    </svg>
  )
}

function FlameSVG() {
  return (
    <svg viewBox="0 0 32 32" className={styles.cellIcon}>
      <path d="M16,28 C8,28 4,22 6,16 C8,10 12,12 12,8 C13,12 18,10 16,4 C20,8 24,14 22,20 C24,18 25,14 23,10 C27,14 28,22 16,28Z" fill="#f97316"/>
      <path d="M16,26 C11,26 9,21 10,17 C12,14 14,15 14,12 C15,15 18,13 16,9 C19,12 21,17 19,21 C20,19 21,16 20,13 C22,16 22,22 16,26Z" fill="#fde68a"/>
    </svg>
  )
}

function getIslandIndex(hl) {
  if (!hl) return -1
  const m = hl.match(/^island-(\d+)$/)
  return m ? parseInt(m[1], 10) - 1 : -1
}

function getCellStyle(val, hl) {
  if (hl === 'current')  return { bg: 'var(--color-current-bg)',  border: 'var(--color-current)',  scale: 1.1 }
  if (hl === 'queued')   return { bg: 'var(--color-compare-bg)',  border: 'var(--color-compare)',  scale: 1.0 }
  if (hl === 'scanning') return { bg: 'var(--color-special-bg)',  border: 'var(--color-special)',  scale: 1.0 }
  const islandIdx = getIslandIndex(hl)
  if (islandIdx >= 0) {
    const col = ISLAND_PALETTE[islandIdx % ISLAND_PALETTE.length]
    return { bg: col.bg, border: col.border, scale: 1.0 }
  }
  if (val === '1') return { bg: '#d1fae5', border: '#6ee7b7', scale: 1.0 }
  return { bg: '#dbeafe', border: '#93c5fd', scale: 1.0 }
}

function getCellContent(val, hl) {
  if (hl === 'current' || hl === 'queued') return <FlameSVG />
  if (hl === 'scanning') return null
  const islandIdx = getIslandIndex(hl)
  if (islandIdx >= 0) {
    const col = ISLAND_PALETTE[islandIdx % ISLAND_PALETTE.length]
    return <TreeSVG color={col.icon} />
  }
  if (val === '1') return <TreeSVG />
  return <WaveSVG />
}

export default function NumberOfIslandsVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('dfs')
  const [customCase,   setCustomCase]   = useState(null)

  const { grid: activeGrid } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(
    () => generateSteps(selectedAlgo, activeGrid),
    [selectedAlgo, selectedTest, customCase] // eslint-disable-line
  )
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const customInputUI = (
    <CustomInput
      fields={[{ key: 'grid', label: 'Grid rows (semicolons, 0/1)', type: 'text', placeholder: '1,1,0;0,1,0;0,0,1' }]}
      onApply={parsed => {
        const grid = parsed.grid.split(';').map(row => row.split(',').map(s => s.trim()))
        setCustomCase({ grid }); hook.reset()
      }}
    />
  )

  const displayGrid = step?.grid ?? activeGrid
  const highlights  = step?.highlights ?? {}
  const count       = step?.count ?? 0
  const cols        = displayGrid[0]?.length ?? 0

  // Collect distinct island indices seen so far
  const visibleIslands = new Set()
  Object.values(highlights).forEach(hl => {
    const idx = getIslandIndex(hl)
    if (idx >= 0) visibleIslands.add(idx)
  })

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'Grid size': `${displayGrid.length}×${cols}`,
        'Islands found': count,
        ...(step.done ? { 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Island color legend badges */}
        {count > 0 && (
          <div className={styles.countBadge}>
            {Array.from({ length: Math.min(count, 6) }, (_, i) => {
              const col = ISLAND_PALETTE[i % ISLAND_PALETTE.length]
              return (
                <span key={i} className={styles.islandChip}
                  style={{ background: col.bg, borderColor: col.border, color: col.border }}>
                  Island {i + 1}
                </span>
              )
            })}
            {count > 6 && <span className={styles.islandMore}>+{count - 6} more</span>}
          </div>
        )}

        {/* Grid */}
        <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${cols}, 48px)` }}>
          {displayGrid.map((row, r) =>
            row.map((val, c) => {
              const hlKey = `${r},${c}`
              const hl    = highlights[hlKey]
              const s     = getCellStyle(val, hl)
              return (
                <div
                  key={hlKey}
                  className={styles.cell}
                  style={{
                    background: s.bg,
                    borderColor: s.border,
                    transform: s.scale > 1 ? `scale(${s.scale})` : undefined,
                  }}
                  title={`(${r},${c})=${val}`}
                >
                  {getCellContent(val, hl)}
                </div>
              )
            })
          )}
        </div>
      </div>
    </VisualizerShell>
  )
}
