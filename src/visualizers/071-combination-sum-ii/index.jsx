import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './CombSumII.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [10,1,2,7,6,1,5], target=8', detail: '[[1,1,6],[1,2,5],[1,7],[2,6]]', candidates:[10,1,2,7,6,1,5], target:8 },
  { label: 'Test 2 — [2,5,2,1,2], target=5',      detail: '[[1,2,2],[5]]',                  candidates:[2,5,2,1,2],     target:5 },
  { label: 'Test 3 — [1,1,1,1], target=3',         detail: '[[1,1,1]]',                      candidates:[1,1,1,1],       target:3 },
  { label: 'Test 4 — [2,4,6,8], target=5',         detail: '[] (impossible)',                candidates:[2,4,6,8],       target:5 },
]

const ALGORITHMS = [
  { id: 'bt', name: 'Backtracking (sort+dedup)', complexity: 'O(2ⁿ) time · O(n) space' },
]

const CODE = {
  bt: [
    'function combinationSum2(candidates, target):',
    '  sort(candidates)',
    '  result = []; current = []',
    '  function backtrack(start, remaining):',
    '    if remaining == 0: result.push([...current])',
    '    for i = start to n-1:',
    '      if i>start and candidates[i]==candidates[i-1]: skip',
    '      if candidates[i] > remaining: break',
    '      current.push(candidates[i])',
    '      backtrack(i+1, remaining - candidates[i])',
    '      current.pop()',
    '  backtrack(0, target)',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Chosen' },
  { token: 'compare', label: 'In current path' },
  { token: 'match',   label: 'Backtracked' },
  { token: 'discard', label: 'Skipped (dup or pruned)' },
]

/* ── Single-use ticket SVG ── */
function TicketSVG({ val, state, used }) {
  const color =
    state === 'current' ? '#f59e0b' :
    state === 'compare' ? '#8b5cf6' :
    state === 'match'   ? '#16a34a' :
    state === 'discard' ? '#dc2626' :
    used ? '#9ca3af' : '#3b82f6'
  const bg = used ? '#f3f4f6' : '#eff6ff'
  return (
    <svg viewBox="0 0 46 40" className={styles.ticket}>
      {/* ticket body with cut edges */}
      <path d="M4,4 H42 A2,2 0 0 1 44,6 V18 A4,4 0 0 0 44,22 V34 A2,2 0 0 1 42,36 H4 A2,2 0 0 1 2,34 V22 A4,4 0 0 0 2,18 V6 A2,2 0 0 1 4,4 Z"
        fill={bg} stroke={color} strokeWidth="2"/>
      {/* perforation line */}
      <line x1="2" y1="20" x2="44" y2="20" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5"/>
      {/* used strike-through */}
      {used && <line x1="8" y1="8" x2="38" y2="32" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>}
      <text x="23" y="15" textAnchor="middle" fontSize="13" fontWeight="800"
        fill={color} fontFamily="monospace">{val}</text>
      <text x="23" y="30" textAnchor="middle" fontSize="8" fill={color} opacity="0.7">
        {used ? 'used' : 'once'}
      </text>
    </svg>
  )
}

/* ── Prune scissors SVG ── */
function ScissorsBadgeSVG() {
  return (
    <svg viewBox="0 0 22 22" className={styles.scissors}>
      <circle cx="7" cy="7" r="4" fill="none" stroke="#dc2626" strokeWidth="1.8"/>
      <circle cx="7" cy="15" r="4" fill="none" stroke="#dc2626" strokeWidth="1.8"/>
      <line x1="11" y1="11" x2="19" y2="3" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="11" y1="11" x2="19" y2="19" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export default function CombinationSumIIVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('bt')
  const [customCase,   setCustomCase]   = useState(null)

  const { candidates, target } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(candidates, target), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const current    = step?.current    ?? []
  const result     = step?.result     ?? []
  const remaining  = step?.remaining  ?? target
  const highlights = step?.highlights ?? {}

  const sorted = [...candidates].sort((a, b) => a - b)
  const usedIdx = step?.usedIdx ?? new Set()

  const customInputUI = (
    <CustomInput
      fields={[
        { key: 'candidates', label: 'Candidates (may dup)', type: 'array', placeholder: '10,1,2,7,6,1,5' },
        { key: 'target', label: 'Target', type: 'number', placeholder: '8' },
      ]}
      onApply={parsed => { setCustomCase({ candidates: parsed.candidates, target: parsed.target }); hook.reset() }}
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
      stats={step ? { 'Target': target, 'Remaining': remaining, 'Combos found': result.length, ...(step.done ? {'Status':'Done ✓'}:{}) } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Single-use ticket tiles */}
        <div className={styles.sectionLabel}>Sorted candidates — each used at most once</div>
        <div className={styles.ticketsRow}>
          {sorted.map((v, i) => {
            const hl = highlights[i]
            const isSkipped = hl === 'discard'
            return (
              <div key={i} className={styles.ticketWrap}>
                <TicketSVG val={v} state={hl || 'default'} used={usedIdx.has ? usedIdx.has(i) : false} />
                {isSkipped && (
                  <div className={styles.scissorsOverlay}><ScissorsBadgeSVG /></div>
                )}
              </div>
            )
          })}
        </div>

        {/* Current combo + remaining */}
        <div className={styles.buildBar}>
          <div className={styles.buildLeft}>
            <span className={styles.buildLabel}>Building:</span>
            {current.length === 0
              ? <span className={styles.empty}>[ ]</span>
              : current.map((v, i) => <span key={i} className={styles.buildChip}>{v}</span>)
            }
          </div>
          <span
            className={styles.remBadge}
            style={{ color: remaining === 0 ? '#16a34a' : remaining < 0 ? '#dc2626' : '#3b82f6' }}
          >
            rem: {remaining}
          </span>
        </div>

        {result.length > 0 && (
          <div className={styles.resultSection}>
            <div className={styles.countBadge}>{result.length} combination{result.length !== 1 ? 's' : ''}</div>
            <div className={styles.resultGrid}>
              {result.map((c, i) => <span key={i} className={styles.resultChip}>[{c.join(',')}]</span>)}
            </div>
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
