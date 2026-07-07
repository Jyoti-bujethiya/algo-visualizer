import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './GenParens.module.css'

const TEST_CASES = [
  { label: 'Test 1 — n=3', detail: '5 combinations', n: 3 },
  { label: 'Test 2 — n=1', detail: '1 combination',  n: 1 },
  { label: 'Test 3 — n=2', detail: '2 combinations', n: 2 },
  { label: 'Test 4 — n=4', detail: '14 combinations',n: 4 },
]

const ALGORITHMS = [
  { id: 'bt', name: 'Backtracking', complexity: 'O(4ⁿ/√n) time · O(n) space' },
]

const CODE = {
  bt: [
    'function generateParentheses(n):',
    '  result=[]; current=""',
    '  function backtrack(open, close):',
    '    if current.length == 2*n: result.push(current)',
    '    if open < n: backtrack(open+1, close) // add "("',
    '    if close < open: backtrack(open, close+1) // add ")"',
    '  backtrack(0, 0)',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Open bracket added' },
  { token: 'compare', label: 'Close bracket added' },
  { token: 'match',   label: 'Complete combination' },
]

/* ── Balance beam SVG ── */
function BalanceBeamSVG({ open, close, n }) {
  const openPct  = n > 0 ? open / n  : 0
  const closePct = n > 0 ? close / n : 0
  const isBalanced = open === close && open === n
  const tiltAngle = (open - close) * 4  // tilt left if more open than close
  return (
    <svg viewBox="0 0 120 70" className={styles.beam}>
      {/* fulcrum */}
      <polygon points="60,58 55,68 65,68" fill="#6b7280"/>
      <rect x="58" y="50" width="4" height="10" fill="#6b7280"/>
      {/* beam */}
      <g style={{ transformOrigin: '60px 50px', transform: `rotate(${tiltAngle}deg)` }}>
        <rect x="12" y="48" width="96" height="4" rx="2"
          fill={isBalanced ? '#16a34a' : '#6b7280'}/>
        {/* left pan — open brackets */}
        <rect x="4" y="28" width="24" height="20" rx="4"
          fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
        <text x="16" y="42" textAnchor="middle" fontSize="11" fontWeight="800"
          fill="#1d4ed8" fontFamily="monospace">({open}</text>
        {/* right pan — close brackets */}
        <rect x="92" y="28" width="24" height="20" rx="4"
          fill="#d1fae5" stroke="#16a34a" strokeWidth="2"/>
        <text x="104" y="42" textAnchor="middle" fontSize="11" fontWeight="800"
          fill="#166534" fontFamily="monospace">){close}</text>
      </g>
      {/* progress dots (open) */}
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={10 + i * 10} cy="22" r="4"
          fill={i < open ? '#3b82f6' : '#dbeafe'}
          stroke="#3b82f6" strokeWidth="1.5"/>
      ))}
      {/* progress dots (close) */}
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={10 + i * 10} cy="12" r="4"
          fill={i < close ? '#16a34a' : '#d1fae5'}
          stroke="#16a34a" strokeWidth="1.5"/>
      ))}
    </svg>
  )
}

/* ── Parenthesis string colorized ── */
function ColoredParens({ s }) {
  if (!s) return <span className={styles.emptyParen}>&ldquo;&rdquo;</span>
  let depth = 0
  const colors = ['#3b82f6','#8b5cf6','#f59e0b','#dc2626','#0891b2']
  return (
    <span className={styles.coloredStr}>
      {s.split('').map((ch, i) => {
        const d = depth
        if (ch === '(') { depth++ }
        else { depth-- }
        const color = colors[(ch === '(' ? d : depth) % colors.length]
        return (
          <span key={i} style={{ color, fontWeight: 900, fontSize: '18px' }}>{ch}</span>
        )
      })}
    </span>
  )
}

export default function GenerateParenthesesVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('bt')
  const [customCase,   setCustomCase]   = useState(null)

  const { n } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(n), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const current = step?.current ?? ''
  const result  = step?.result  ?? []
  const open    = step?.open    ?? 0
  const close   = step?.close   ?? 0

  const customInputUI = (
    <CustomInput
      fields={[{ key: 'n', label: 'n (pairs)', type: 'number', placeholder: '3' }]}
      onApply={parsed => { setCustomCase({ n: parsed.n }); hook.reset() }}
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
      stats={step ? { 'n': n, 'open': open, 'close': close, 'Found': result.length, ...(step.done ? {'Status':'Done ✓'}:{}) } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Balance beam visualizer */}
        <div className={styles.sectionLabel}>Open / Close bracket balance</div>
        <BalanceBeamSVG open={open} close={close} n={n} />

        {/* Current string being built */}
        <div className={styles.buildRow}>
          <span className={styles.buildLabel}>Building:</span>
          <div className={styles.buildStr}>
            <ColoredParens s={current} />
          </div>
          <div className={styles.counters}>
            <span className={styles.openCount} style={{ color: '#3b82f6' }}>({open}×<span className={styles.bracket}>(</span></span>
            <span className={styles.closeCount} style={{ color: '#16a34a' }}>{close}×<span className={styles.bracket}>)</span></span>
          </div>
        </div>

        {/* Results */}
        {result.length > 0 && (
          <div className={styles.resultSection}>
            <div className={styles.countBadge}>{result.length} combination{result.length !== 1 ? 's' : ''}</div>
            <div className={styles.resultGrid}>
              {result.map((r, i) => (
                <div key={i} className={styles.parenResult}>
                  <ColoredParens s={r} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
