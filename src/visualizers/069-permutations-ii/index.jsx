import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './PermutationsII.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [1,1,2]',  detail: '3 unique permutations',  nums: [1,1,2]  },
  { label: 'Test 2 — [1,2,3]',  detail: '6 permutations',         nums: [1,2,3]  },
  { label: 'Test 3 — [1,1,1]',  detail: '1 unique permutation',   nums: [1,1,1]  },
  { label: 'Test 4 — [1,2,1,2]',detail: '6 unique permutations',  nums: [1,2,1,2] },
]

const ALGORITHMS = [
  { id: 'bt', name: 'Backtracking (sort + used[])', complexity: 'O(n!) time · O(n) space' },
]

const CODE = {
  bt: [
    'function permuteUnique(nums):',
    '  sort(nums); result=[]; used=[]',
    '  function backtrack(current):',
    '    if current.length==n: result.push([...current])',
    '    for i = 0 to n-1:',
    '      if used[i]: continue',
    '      if i>0 and nums[i]==nums[i-1] and !used[i-1]: skip',
    '      used[i]=true; current.push(nums[i])',
    '      backtrack(current)',
    '      used[i]=false; current.pop()',
    '  backtrack([])',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Being added' },
  { token: 'compare', label: 'In current path (used)' },
  { token: 'match',   label: 'Complete permutation' },
  { token: 'discard', label: 'Skipped (duplicate)' },
  { token: 'done',    label: 'Unuse / restored' },
]

/* ── Used-state slot SVG ── */
function UsedSlotSVG({ val, used, state, isSkipped }) {
  const borderColor =
    isSkipped ? '#dc2626' :
    state === 'current' ? '#f59e0b' :
    state === 'compare' ? '#8b5cf6' :
    state === 'match'   ? '#16a34a' :
    used ? '#8b5cf6' : '#d1d5db'
  const bg = used ? '#f3e8ff' : '#f9fafb'
  return (
    <svg viewBox="0 0 44 52" className={styles.slot}>
      {/* used/unused indicator bar */}
      <rect x="4" y="2" width="36" height="7" rx="2"
        fill={used ? '#8b5cf6' : '#e5e7eb'}/>
      <text x="22" y="8" textAnchor="middle" fontSize="6.5" fontWeight="700"
        fill={used ? 'white' : '#9ca3af'}>{used ? 'used' : 'free'}</text>
      {/* main body */}
      <rect x="4" y="11" width="36" height="36" rx="6"
        fill={bg} stroke={borderColor} strokeWidth="2.5"/>
      {/* skip X overlay */}
      {isSkipped && (
        <>
          <line x1="14" y1="21" x2="30" y2="43" stroke="#dc2626" strokeWidth="3" strokeLinecap="round"/>
          <line x1="30" y1="21" x2="14" y2="43" stroke="#dc2626" strokeWidth="3" strokeLinecap="round"/>
        </>
      )}
      <text x="22" y="35" textAnchor="middle" fontSize="16" fontWeight="800"
        fill={borderColor} fontFamily="monospace">{val}</text>
    </svg>
  )
}

/* ── Current path build row ── */
function BuildRow({ current }) {
  return (
    <div className={styles.buildRow}>
      <span className={styles.buildLabel}>Building:</span>
      {current.length === 0
        ? <span className={styles.empty}>[ ]</span>
        : current.map((v, i) => <span key={i} className={styles.buildChip}>{v}</span>)
      }
    </div>
  )
}

export default function PermutationsIIVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('bt')
  const [customCase,   setCustomCase]   = useState(null)

  const { nums } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(nums), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const current    = step?.current    ?? []
  const result     = step?.result     ?? []
  const highlights = step?.highlights ?? {}
  const usedArr    = step?.used       ?? []  // optional boolean array

  const sorted = [...nums].sort((a, b) => a - b)

  const customInputUI = (
    <CustomInput
      fields={[{ key: 'nums', label: 'Nums (may have dups)', type: 'array', placeholder: '1,1,2' }]}
      onApply={parsed => { setCustomCase({ nums: parsed.nums }); hook.reset() }}
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
        'n': nums.length,
        'Unique perms found': result.length,
        ...(step.done ? { 'Total': result.length, 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Sorted input with used[] indicators */}
        <div className={styles.sectionLabel}>Sorted input — used[ ] tracking</div>
        <div className={styles.slotsRow}>
          {sorted.map((v, i) => {
            const hl = highlights[i]
            const used = usedArr[i] ?? false
            const isSkipped = hl === 'discard'
            return (
              <UsedSlotSVG key={i} val={v} used={used} state={hl || 'default'} isSkipped={isSkipped} />
            )
          })}
        </div>

        {/* Path under construction */}
        <BuildRow current={current} />

        {/* Results */}
        {result.length > 0 && (
          <div className={styles.resultSection}>
            <div className={styles.countBadge}>{result.length} unique permutation{result.length !== 1 ? 's' : ''}</div>
            <div className={styles.resultGrid}>
              {result.map((p, i) => (
                <span key={i} className={styles.resultChip}>[{p.join(',')}]</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
