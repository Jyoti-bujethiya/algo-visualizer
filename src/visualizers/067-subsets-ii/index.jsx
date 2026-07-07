import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './Subsets.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [1,2,2]',    detail: '6 unique subsets',  nums: [1,2,2]    },
  { label: 'Test 2 — [0]',         detail: '2 subsets',         nums: [0]         },
  { label: 'Test 3 — [1,1,2,2]',  detail: '9 unique subsets',  nums: [1,1,2,2]  },
  { label: 'Test 4 — [4,4,4,1,4]',detail: '8 unique subsets',  nums: [4,4,4,1,4] },
]

const ALGORITHMS = [
  { id: 'bt', name: 'Backtracking (sort + skip dups)', complexity: 'O(2ⁿ) time · O(n) space' },
]

const CODE = {
  bt: [
    'function subsetsWithDup(nums):',
    '  sort(nums)',
    '  result = []; current = []',
    '  function backtrack(start):',
    '    result.push([...current])',
    '    for i = start to n-1:',
    '      if i > start and nums[i]==nums[i-1]: skip  // dup',
    '      current.push(nums[i])',
    '      backtrack(i + 1)',
    '      current.pop()',
    '  backtrack(0)',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Being added' },
  { token: 'compare', label: 'In current path' },
  { token: 'match',   label: 'Explored / backtracked' },
  { token: 'discard', label: 'Skipped (duplicate)' },
]

/* ── Element bubble SVG ── */
function ElemBubbleSVG({ val, state }) {
  const fill =
    state === 'current' ? '#f59e0b' :
    state === 'compare' ? '#8b5cf6' :
    state === 'match'   ? '#16a34a' :
    state === 'discard' ? '#dc2626' : '#94a3b8'
  const bg =
    state === 'current' ? '#fffbeb' :
    state === 'compare' ? '#f3e8ff' :
    state === 'match'   ? '#d1fae5' :
    state === 'discard' ? '#fef2f2' : '#f3f4f6'
  return (
    <svg viewBox="0 0 40 40" className={styles.elemBubble}>
      <circle cx="20" cy="20" r="17" fill={bg} stroke={fill} strokeWidth="2.5"/>
      <text x="20" y="25" textAnchor="middle" fontSize="13" fontWeight="800"
        fill={fill} fontFamily="monospace">{val}</text>
    </svg>
  )
}

/* ── Skip X badge ── */
function SkipBadgeSVG() {
  return (
    <svg viewBox="0 0 22 22" className={styles.skipBadge}>
      <circle cx="11" cy="11" r="9" fill="#fef2f2" stroke="#dc2626" strokeWidth="2"/>
      <path d="M7 7 L15 15 M15 7 L7 15" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

/* ── Set ring (Venn-like circle) ── */
function SetRingSVG({ size, color }) {
  return (
    <svg viewBox="0 0 60 60" className={styles.setRing} style={{ width: size, height: size }}>
      <circle cx="30" cy="30" r="26" fill={color + '18'} stroke={color} strokeWidth="2"
        strokeDasharray="6 3"/>
    </svg>
  )
}

export default function SubsetsIIVisualizer() {
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

  const sorted = [...nums].sort((a, b) => a - b)

  const customInputUI = (
    <CustomInput
      fields={[{ key: 'nums', label: 'Nums (may have dups)', type: 'array', placeholder: '1,2,2' }]}
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
        'Subsets found': result.length,
        ...(step.done ? { 'Total unique': result.length, 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Input bubbles row */}
        <div className={styles.sectionLabel}>Sorted input (duplicates detected)</div>
        <div className={styles.bubblesRow}>
          {sorted.map((v, i) => {
            const isDup = i > 0 && sorted[i] === sorted[i - 1]
            return (
              <div key={i} className={styles.bubbleWrap}>
                <ElemBubbleSVG val={v} state={highlights[i] || 'default'} />
                {isDup && (
                  <div className={styles.dupLabel}>
                    <SkipBadgeSVG />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Current subset being built */}
        <div className={styles.buildSection}>
          <SetRingSVG size={44} color="#8b5cf6" />
          <div className={styles.currentPath}>
            <span className={styles.currentLabel}>Current subset:</span>
            {current.length === 0
              ? <span className={styles.emptySet}>∅</span>
              : current.map((v, i) => (
                <span key={i} className={styles.pathChip}>{v}</span>
              ))
            }
          </div>
        </div>

        {/* Results */}
        {result.length > 0 && (
          <div className={styles.resultSection}>
            <div className={styles.countBadge}>
              <SetRingSVG size={22} color="#16a34a" />
              {result.length} unique subset{result.length !== 1 ? 's' : ''}
            </div>
            <div className={styles.resultGrid}>
              {result.map((s, i) => (
                <span key={i} className={`${styles.resultChip} ${s.length === 0 ? styles.emptyChip : ''}`}>
                  {s.length === 0 ? '∅' : `{${s.join(',')}}`}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
