import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './Subsets.module.css'

const TEST_CASES = [
  { label: 'Test 1 — [1,2,3]',   detail: '8 subsets',  nums: [1,2,3]   },
  { label: 'Test 2 — [0]',        detail: '2 subsets',  nums: [0]        },
  { label: 'Test 3 — [1,2,3,4]', detail: '16 subsets', nums: [1,2,3,4] },
  { label: 'Test 4 — [4,1,0]',   detail: '8 subsets',  nums: [4,1,0]   },
]

const ALGORITHMS = [
  { id: 'bt', name: 'Backtracking', complexity: 'O(2ⁿ) time · O(n) space' },
]

const CODE = {
  bt: [
    'function subsets(nums):',
    '  result = []; current = []',
    '  function backtrack(start):',
    '    result.push([...current])',
    '    for i = start to n-1:',
    '      current.push(nums[i])',
    '      backtrack(i + 1)',
    '      current.pop()  // backtrack',
    '  backtrack(0)',
    '  return result',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Being added to subset' },
  { token: 'compare', label: 'Included in current path' },
  { token: 'match',   label: 'Explored / backtracked' },
  { token: 'done',    label: 'Already explored' },
]

/* ── Tree node SVG ── */
function TreeNodeSVG({ val, state, isLeaf }) {
  const fill =
    state === 'current' ? '#f59e0b' :
    state === 'compare' ? '#8b5cf6' :
    state === 'match'   ? '#16a34a' :
    state === 'done'    ? '#94a3b8' : '#e5e7eb'
  const textFill = (state === 'current' || state === 'compare' || state === 'match') ? 'white' : '#374151'


  return (
    <svg viewBox="0 0 36 36" className={styles.treeNodeIcon}>
      <circle cx="18" cy="18" r="15" fill={fill} stroke={fill === '#e5e7eb' ? '#d1d5db' : fill} strokeWidth="2"/>
      {isLeaf && <circle cx="18" cy="18" r="9" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5"/>}
      <text x="18" y="23" textAnchor="middle" fontSize="12" fontWeight="800" fill={textFill} fontFamily="monospace">
        {val === null ? '∅' : val}
      </text>
    </svg>
  )
}

/* ── Include/Exclude branch indicator ── */
function BranchSVG({ type }) {
  const color = type === 'include' ? '#16a34a' : '#dc2626'
  const label = type === 'include' ? '✓' : '✗'
  return (
    <svg viewBox="0 0 28 20" className={styles.branchIcon}>
      <line x1="14" y1="0" x2="14" y2="20" stroke={color} strokeWidth="1.5" strokeDasharray="3 2"/>
      <text x="14" y="13" textAnchor="middle" fontSize="9" fontWeight="800" fill={color}>{label}</text>
    </svg>
  )
}

export default function SubsetsVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('bt')
  const [customCase,   setCustomCase]   = useState(null)

  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "nums",
                "label": "Nums",
                "type": "array",
                "placeholder": "1,2,3"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ nums: parsed.nums }); hook.reset()
      }}
    />
  )

  const { nums } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(nums), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const current    = step?.current    ?? []
  const result     = step?.result     ?? []
  const highlights = step?.highlights ?? {}
  const depth      = step?.depth ?? 0

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
        ...(step.done ? { 'Total': result.length, 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Input nums with state */}
        <div className={styles.numsRow}>
          {nums.map((v, i) => {
            const hl = highlights[i]
            const inCurrent = current.includes(v)
            return (
              <div key={i} className={styles.numEntry}>
                <TreeNodeSVG
                  val={v}
                  state={hl || (inCurrent ? 'compare' : 'default')}
                  isLeaf={false}
                />
                <span className={styles.numIdx}>[{i}]</span>
              </div>
            )
          })}
        </div>

        {/* Current path display */}
        <div className={styles.pathWrap}>
          <span className={styles.pathLabel}>Current path (depth {depth}):</span>
          <div className={styles.pathRow}>
            <TreeNodeSVG val={null} state="default" isLeaf={false} />
            {current.map((v, i) => (
              <span key={i} className={styles.pathEntry}>
                <BranchSVG type="include" />
                <TreeNodeSVG val={v} state="current" isLeaf={i === current.length - 1} />
              </span>
            ))}
          </div>
        </div>

        {/* Subsets grid */}
        {result.length > 0 && (
          <>
            <div className={styles.countBadge}>
              <svg viewBox="0 0 20 20" className={styles.countIcon}><rect x="2" y="2" width="7" height="7" rx="1.5" fill="#8b5cf6"/><rect x="11" y="2" width="7" height="7" rx="1.5" fill="#8b5cf6" opacity="0.7"/><rect x="2" y="11" width="7" height="7" rx="1.5" fill="#8b5cf6" opacity="0.5"/><rect x="11" y="11" width="7" height="7" rx="1.5" fill="#8b5cf6" opacity="0.3"/></svg>
              {result.length} subset{result.length !== 1 ? 's' : ''} found
            </div>
            <div className={styles.resultGrid}>
              {result.map((s, i) => (
                <span key={i} className={`${styles.resultChip} ${i === result.length - 1 ? styles.resultChipNew : ''}`}>
                  [{s.join(',')}]
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </VisualizerShell>
  )
}
