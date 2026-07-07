import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './LetterCombinations.module.css'

const MAP = { '2':'abc','3':'def','4':'ghi','5':'jkl','6':'mno','7':'pqrs','8':'tuv','9':'wxyz' }

const TEST_CASES = [
  { label: 'Test 1 — "23"', detail: '9 combinations', digits: '23' },
  { label: 'Test 2 — "2"',  detail: '3 combinations', digits: '2'  },
  { label: 'Test 3 — ""',   detail: '0 combinations', digits: ''   },
  { label: 'Test 4 — "79"', detail: '16 combinations', digits: '79' },
]

const ALGORITHMS = [
  { id: 'bt', name: 'Backtracking', complexity: 'O(4ⁿ) time · O(n) space' },
]

const CODE = {
  bt: [
    'function letterCombinations(digits):',
    '  if digits empty: return []',
    '  map = {2:"abc", 3:"def", ...}',
    '  result=[]; current=[]',
    '  function backtrack(index):',
    '    if index==n: result.push(current.join(""))',
    '    for each letter in map[digits[index]]:',
    '      current.push(letter)',
    '      backtrack(index+1)',
    '      current.pop()',
    '  backtrack(0)',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Letter being tried' },
  { token: 'compare', label: 'Letter in current path' },
  { token: 'match',   label: 'Backtracked' },
]

/* ── Phone key SVG ── */
function PhoneKeySVG({ digit, letters, isActive, activeLetter }) {
  const color = isActive ? '#3b82f6' : '#6b7280'
  const bg = isActive ? '#eff6ff' : '#f3f4f6'
  return (
    <svg viewBox="0 0 52 62" className={styles.phoneKey}>
      {/* key body */}
      <rect x="3" y="3" width="46" height="56" rx="8" fill={bg} stroke={color} strokeWidth={isActive ? 2.5 : 1.5}/>
      {/* digit */}
      <text x="26" y="28" textAnchor="middle" fontSize="18" fontWeight="800"
        fill={color} fontFamily="monospace">{digit}</text>
      {/* letter row */}
      {letters.split('').map((l, i) => {
        const x = letters.length <= 3
          ? 12 + i * 14
          : 8 + i * 11
        const isActiveLetter = l === activeLetter
        return (
          <text key={i} x={x} y="50" textAnchor="middle" fontSize={isActiveLetter ? 9 : 8}
            fontWeight={isActiveLetter ? '800' : '600'}
            fill={isActiveLetter ? '#f59e0b' : color + '99'}
            fontFamily="monospace">{l.toUpperCase()}</text>
        )
      })}
    </svg>
  )
}

/* ── Active letter orbit bubble ── */
function LetterBubbleSVG({ ch }) {
  return (
    <svg viewBox="0 0 36 36" className={styles.letterBubble}>
      <circle cx="18" cy="18" r="15" fill="#fffbeb" stroke="#f59e0b" strokeWidth="2.5"/>
      <text x="18" y="23" textAnchor="middle" fontSize="15" fontWeight="800"
        fill="#b45309" fontFamily="monospace">{ch}</text>
    </svg>
  )
}

export default function LetterCombinationsVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('bt')
  const [customCase,   setCustomCase]   = useState(null)

  const { digits } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(digits), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const current     = step?.current     ?? []
  const result      = step?.result      ?? []
  const activeDigit = step?.activeDigit // optional: which digit position is active
  const activeLetter = step?.activeLetter // optional: which letter is being tried

  const customInputUI = (
    <CustomInput
      fields={[{ key: 'digits', label: 'Digits string', type: 'text', placeholder: '23' }]}
      onApply={parsed => { setCustomCase({ digits: parsed.digits }); hook.reset() }}
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
      stats={step ? { 'Digits': `"${digits}"`, 'Combos found': result.length, ...(step.done ? {'Status':'Done ✓'}:{}) } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Phone keypad display */}
        <div className={styles.sectionLabel}>Phone keys</div>
        <div className={styles.phoneRow}>
          {digits.length === 0 ? (
            <span className={styles.emptyDigits}>No digits entered</span>
          ) : digits.split('').map((d, i) => (
            <PhoneKeySVG
              key={i}
              digit={d}
              letters={MAP[d] || ''}
              isActive={activeDigit === i}
              activeLetter={activeDigit === i ? activeLetter : null}
            />
          ))}
        </div>

        {/* Current combo being built */}
        <div className={styles.buildRow}>
          <span className={styles.buildLabel}>Building:</span>
          <div className={styles.buildLetters}>
            {current.length === 0
              ? <span className={styles.empty}>&ldquo;&rdquo;</span>
              : current.map((ch, i) => <LetterBubbleSVG key={i} ch={ch} />)
            }
            <span className={styles.buildStr}>&ldquo;{current.join('')}&rdquo;</span>
          </div>
        </div>

        {/* Results */}
        {result.length > 0 && (
          <div className={styles.resultSection}>
            <div className={styles.countBadge}>{result.length} combination{result.length !== 1 ? 's' : ''}</div>
            <div className={styles.resultGrid}>
              {result.map((r, i) => <span key={i} className={styles.resultChip}>&ldquo;{r}&rdquo;</span>)}
            </div>
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
