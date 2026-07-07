import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import styles from './PalinPart.module.css'

const TEST_CASES = [
  { label: 'Test 1 — "aab"',     detail: '[["a","a","b"],["aa","b"]]',  s: 'aab'    },
  { label: 'Test 2 — "a"',       detail: '[["a"]]',                      s: 'a'      },
  { label: 'Test 3 — "racecar"', detail: 'Many partitions',              s: 'racecar' },
  { label: 'Test 4 — "abba"',    detail: '[["a","b","b","a"],["a","bb","a"],["abba"]]', s: 'abba' },
]

const ALGORITHMS = [
  { id: 'bt', name: 'Backtracking', complexity: 'O(n·2ⁿ) time · O(n) space' },
]

const CODE = {
  bt: [
    'function partition(s):',
    '  result=[]; current=[]',
    '  function isPalin(l,r): ...',
    '  function backtrack(start):',
    '    if start==n: result.push([...current])',
    '    for end = start to n-1:',
    '      if isPalin(start, end):',
    '        current.push(s[start..end])',
    '        backtrack(end + 1)',
    '        current.pop()',
    '  backtrack(0)',
  ],
}

const LEGEND = [
  { token: 'current', label: 'Adding palindrome' },
  { token: 'compare', label: 'Is palindrome ✓' },
  { token: 'discard', label: 'Not palindrome ✗' },
  { token: 'match',   label: 'Backtracked' },
]

/* ── Mirror reflection SVG ── */
function MirrorSVG() {
  return (
    <svg viewBox="0 0 40 32" className={styles.mirrorIcon}>
      {/* left half */}
      <text x="14" y="22" textAnchor="end" fontSize="13" fontWeight="800" fill="#8b5cf6" fontFamily="monospace">ab</text>
      {/* mirror line */}
      <line x1="20" y1="4" x2="20" y2="28" stroke="#d1d5db" strokeWidth="2" strokeDasharray="3 2"/>
      {/* right half (mirrored) */}
      <text x="26" y="22" textAnchor="start" fontSize="13" fontWeight="800" fill="#8b5cf6" fontFamily="monospace">ba</text>
      {/* reflection arrows */}
      <path d="M14 14 Q17 12 20 14 Q23 16 26 14" stroke="#8b5cf6" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

/* ── Palindrome chip with glow ── */
function PalinChip({ word, isPalin }) {
  return (
    <div className={`${styles.palinChip} ${isPalin ? styles.palinGlow : styles.notPalin}`}>
      {word.split('').map((ch, i) => {
        const mirror = word[word.length - 1 - i]
        const isMatchEnd = isPalin && ch === mirror && i <= Math.floor(word.length / 2)
        return (
          <span key={i} className={isMatchEnd ? styles.mirrorChar : ''}>{ch}</span>
        )
      })}
    </div>
  )
}

function isPalindrome(str) {
  return str === str.split('').reverse().join('')
}

export default function PalindromePartitioningVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('bt')
  const [customCase,   setCustomCase]   = useState(null)

  const { s } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(s), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const current    = step?.current    ?? []
  const result     = step?.result     ?? []
  const checkWord  = step?.checkWord  // optional: word currently being checked

  const customInputUI = (
    <CustomInput
      fields={[{ key: 's', label: 'String', type: 'text', placeholder: 'aab' }]}
      onApply={parsed => { setCustomCase({ s: parsed.s }); hook.reset() }}
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
      stats={step ? { 'String': `"${s}"`, 'Partitions found': result.length, ...(step.done ? {'Status':'Done ✓'}:{}) } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* String display with segment markers */}
        <div className={styles.stringDisplay}>
          <MirrorSVG />
          <div className={styles.strChars}>
            {s.split('').map((ch, i) => (
              <span key={i} className={styles.strChar}>{ch}</span>
            ))}
          </div>
          <div className={styles.strIndices}>
            {s.split('').map((_, i) => (
              <span key={i} className={styles.strIdx}>{i}</span>
            ))}
          </div>
        </div>

        {/* Palindrome check indicator */}
        {checkWord && (
          <div className={styles.checkRow}>
            <span className={styles.checkLabel}>Checking:</span>
            <PalinChip word={checkWord} isPalin={isPalindrome(checkWord)} />
            <span className={`${styles.checkBadge} ${isPalindrome(checkWord) ? styles.checkYes : styles.checkNo}`}>
              {isPalindrome(checkWord) ? '✓ palindrome' : '✗ not palindrome'}
            </span>
          </div>
        )}

        {/* Current path */}
        <div className={styles.buildRow}>
          <span className={styles.buildLabel}>Building:</span>
          {current.length === 0
            ? <span className={styles.empty}>[ ]</span>
            : current.map((w, i) => (
              <PalinChip key={i} word={w} isPalin={isPalindrome(w)} />
            ))
          }
        </div>

        {/* Results */}
        {result.length > 0 && (
          <div className={styles.resultSection}>
            <div className={styles.countBadge}>{result.length} partition{result.length !== 1 ? 's' : ''}</div>
            <div className={styles.resultGrid}>
              {result.map((p, i) => (
                <div key={i} className={styles.partitionChip}>
                  {p.map((w, j) => (
                    <span key={j} className={styles.segChip}>{w}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
