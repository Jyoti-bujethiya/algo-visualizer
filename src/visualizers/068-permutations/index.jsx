import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './Permutations.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [1,2,3]',   detail: '6 permutations',  nums: [1,2,3] },
  { label: 'Test 2 — [0,1]',     detail: '2 permutations',  nums: [0,1]   },
  { label: 'Test 3 — [1]',       detail: '1 permutation',   nums: [1]     },
  { label: 'Test 4 — [1,2,3,4]', detail: '24 permutations', nums: [1,2,3,4] },
]

const ALGORITHMS = [
  { id: 'bt', name: 'Backtracking (swap in-place)', complexity: 'O(n!) time · O(n) space' },
]

const CODE = {
  bt: [
    'function permute(nums):',
    '  result = []',
    '  function backtrack(start):',
    '    if start == n:',
    '      result.push([...nums]); return',
    '    for i = start to n-1:',
    '      swap(nums[start], nums[i])',
    '      backtrack(start + 1)',
    '      swap(nums[start], nums[i])  // restore',
    '  backtrack(0)',
    '  return result',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Fixed position (start)' },
  { token: 'compare', label: 'Being swapped' },
  { token: 'match',   label: 'Complete permutation' },
  { token: 'done',    label: 'Restored' },
]

/* ── Tile with position slot ── */
function TileSVG({ val, state, slot }) {
  const fill =
    state === 'current' ? '#3b82f6' :
    state === 'compare' ? '#f59e0b' :
    state === 'match'   ? '#16a34a' :
    state === 'done'    ? '#94a3b8' : '#e5e7eb'
  const textFill = (state === 'current' || state === 'compare' || state === 'match') ? 'white' : '#374151'
  return (
    <svg viewBox="0 0 44 52" className={styles.tile}>
      {/* slot indicator */}
      <rect x="4" y="2" width="36" height="8" rx="2" fill="#e0e7ff" opacity="0.7"/>
      <text x="22" y="9" textAnchor="middle" fontSize="7" fill="#6366f1" fontWeight="700">#{slot}</text>
      {/* main tile */}
      <rect x="4" y="12" width="36" height="36" rx="6" fill={fill}
        stroke={fill === '#e5e7eb' ? '#d1d5db' : fill} strokeWidth="1.5"/>
      <text x="22" y="36" textAnchor="middle" fontSize="17" fontWeight="800"
        fill={textFill} fontFamily="monospace">{val}</text>
    </svg>
  )
}

/* ── Swap arrow SVG ── */
function SwapArrowSVG() {
  return (
    <svg viewBox="0 0 48 28" className={styles.swapArrow}>
      {/* top arrow → */}
      <path d="M4 9 L44 9" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M38 4 L44 9 L38 14" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* bottom arrow ← */}
      <path d="M44 20 L4 20" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M10 15 L4 20 L10 25" stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {/* swap label */}
      <text x="24" y="15" textAnchor="middle" fontSize="7" fontWeight="800" fill="#6b7280">swap</text>
    </svg>
  )
}

/* ── Result permutation row ── */
function PermRow({ perm }) {
  return (
    <div className={styles.permRow}>
      {perm.map((v, i) => (
        <span key={i} className={styles.permCell}>{v}</span>
      ))}
    </div>
  )
}

export default function PermutationsVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('bt')
  const [customCase,   setCustomCase]   = useState(null)

  const { nums } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(nums), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const current    = step?.current    ?? nums
  const result     = step?.result     ?? []
  const highlights = step?.highlights ?? {}
  const swapPair   = step?.swapPair   // optional [i, j] being swapped

  const customInputUI = (
    <CustomInput
      fields={[{ key: 'nums', label: 'Nums', type: 'array', placeholder: '1,2,3' }]}
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
        'Permutations found': result.length,
        ...(step.done ? { 'Total': `${result.length} (${nums.length}!)`, 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Tile array with slot indicators */}
        <div className={styles.sectionLabel}>Current array state</div>
        <div className={styles.tilesRow}>
          {current.map((v, i) => {
            const hl = highlights[i]
            const isSwap = swapPair && (swapPair[0] === i || swapPair[1] === i)
            return (
              <div key={i} className={`${styles.tileWrap} ${isSwap ? styles.tileSwapping : ''}`}>
                <TileSVG val={v} state={isSwap ? (i === swapPair[0] ? 'current' : 'compare') : (hl || 'default')} slot={i} />
              </div>
            )
          })}
        </div>

        {/* Swap indicator */}
        {swapPair && (
          <div className={styles.swapIndicator}>
            <span className={styles.swapLabel}>Swapping positions {swapPair[0]} ↔ {swapPair[1]}</span>
            <SwapArrowSVG />
          </div>
        )}

        {/* Results */}
        {result.length > 0 && (
          <div className={styles.resultSection}>
            <div className={styles.countBadge}>{result.length} permutation{result.length !== 1 ? 's' : ''}</div>
            <div className={styles.resultGrid}>
              {result.map((p, i) => (
                <PermRow key={i} perm={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
