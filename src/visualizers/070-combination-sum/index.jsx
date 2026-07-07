import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './CombinationSum.module.css'

const TEST_CASES = [
  { label: 'Test 1 — cands=[2,3,6,7], target=7',  detail: '[[2,2,3],[7]]',        candidates: [2,3,6,7],  target: 7  },
  { label: 'Test 2 — cands=[2,3,5], target=8',    detail: '[[2,2,2,2],[2,3,3],[3,5]]', candidates: [2,3,5], target: 8  },
  { label: 'Test 3 — cands=[2], target=1',         detail: 'No solution',          candidates: [2],        target: 1  },
  { label: 'Test 4 — cands=[1,2], target=4',       detail: '[[1,1,1,1],[1,1,2],[2,2]]', candidates: [1,2], target: 4  },
]

const ALGORITHMS = [
  { id: 'bt', name: 'Backtracking (sorted + prune)', complexity: 'O(N^(T/M)) time · O(T/M) space' },
]

const CODE = {
  bt: [
    'function combinationSum(candidates, target):',
    '  sort(candidates); result=[]; current=[]',
    '  function backtrack(start, remaining):',
    '    if remaining == 0:',
    '      result.push([...current])',
    '    for i = start to n-1:',
    '      if candidates[i] > remaining: break  // prune',
    '      current.push(candidates[i])',
    '      backtrack(i, remaining - candidates[i])',
    '      current.pop()',
    '  backtrack(0, target)',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Being chosen' },
  { token: 'compare', label: 'In current combination' },
  { token: 'match',   label: 'Backtracked' },
  { token: 'discard', label: 'Pruned (too large)' },
  { token: 'done',    label: 'Explored' },
]

/* ── Coin tile SVG (reusable number) ── */
function CoinSVG({ val, state }) {
  const color =
    state === 'current' ? '#f59e0b' :
    state === 'compare' ? '#8b5cf6' :
    state === 'match'   ? '#16a34a' :
    state === 'discard' ? '#dc2626' : '#6b7280'
  const bg =
    state === 'current' ? '#fffbeb' :
    state === 'compare' ? '#f3e8ff' :
    state === 'match'   ? '#d1fae5' :
    state === 'discard' ? '#fef2f2' : '#f3f4f6'
  return (
    <svg viewBox="0 0 44 44" className={styles.coin}>
      {/* outer ring */}
      <circle cx="22" cy="22" r="19" fill={bg} stroke={color} strokeWidth="2.5"/>
      {/* inner ring */}
      <circle cx="22" cy="22" r="13" fill={color} opacity="0.15"/>
      <text x="22" y="27" textAnchor="middle" fontSize="14" fontWeight="800"
        fill={color} fontFamily="monospace">{val}</text>
    </svg>
  )
}

/* ── Budget gauge SVG ── */
function BudgetGaugeSVG({ target, remaining }) {
  const used = target - remaining
  const pct = target > 0 ? Math.max(0, Math.min(1, used / target)) : 0
  const r = 20
  const circ = 2 * Math.PI * r
  const dashOffset = circ * (1 - pct)
  const color = remaining === 0 ? '#16a34a' : remaining < 0 ? '#dc2626' : '#3b82f6'
  return (
    <svg viewBox="0 0 56 56" className={styles.gauge}>
      {/* track */}
      <circle cx="28" cy="28" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6"/>
      {/* fill arc */}
      <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={dashOffset}
        strokeLinecap="round"
        style={{ transformOrigin: '28px 28px', transform: 'rotate(-90deg)' }}/>
      {/* labels */}
      <text x="28" y="26" textAnchor="middle" fontSize="10" fontWeight="800" fill={color}>{remaining}</text>
      <text x="28" y="36" textAnchor="middle" fontSize="7" fill="#9ca3af">left</text>
    </svg>
  )
}

export default function CombinationSumVisualizer() {
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

  const customInputUI = (
    <CustomInput
      fields={[
        { key: 'candidates', label: 'Candidates', type: 'array', placeholder: '2,3,6,7' },
        { key: 'target', label: 'Target', type: 'number', placeholder: '7' },
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
      stats={step ? {
        'Target': target,
        'Remaining': remaining,
        'Combinations': result.length,
        ...(step.done ? { 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Candidates as coin tiles */}
        <div className={styles.sectionLabel}>Candidates (can reuse)</div>
        <div className={styles.coinsRow}>
          {sorted.map((v, i) => (
            <CoinSVG key={i} val={v} state={highlights[i] || 'default'} />
          ))}
        </div>

        {/* Budget gauge + current combo */}
        <div className={styles.buildPanel}>
          <BudgetGaugeSVG target={target} remaining={remaining} />
          <div className={styles.buildRight}>
            <div className={styles.targetRow}>
              <span className={styles.targetLabel}>Target:</span>
              <span className={styles.targetVal}>{target}</span>
              <span className={styles.arrow}>→</span>
              <span className={styles.remainLabel}>Remaining:</span>
              <span className={styles.remainVal} style={{ color: remaining === 0 ? '#16a34a' : remaining < 0 ? '#dc2626' : '#3b82f6' }}>
                {remaining}
              </span>
            </div>
            <div className={styles.currentRow}>
              {current.length === 0
                ? <span className={styles.empty}>[ ] picking…</span>
                : current.map((v, i) => <span key={i} className={styles.currentChip}>{v}</span>)
              }
              {current.length > 0 && (
                <span className={styles.sumBadge}>= {current.reduce((a, b) => a + b, 0)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {result.length > 0 && (
          <div className={styles.resultSection}>
            <div className={styles.countBadge}>{result.length} combination{result.length !== 1 ? 's' : ''}</div>
            <div className={styles.resultGrid}>
              {result.map((c, i) => (
                <span key={i} className={styles.resultChip}>[{c.join('+')}]={c.reduce((a,b)=>a+b,0)}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
