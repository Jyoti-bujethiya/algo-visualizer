import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import DPTableDisplay from '../../components/display/DPTableDisplay.jsx'
import styles from './WordBreak.module.css'

const TEST_CASES = [
  { label: 'Test 1 — "leetcode"',  detail: 'leet + code = true',  s: 'leetcode',  wordDict: ['leet','code'] },
  { label: 'Test 2 — "applepenapple"', detail: 'true',            s: 'applepenapple', wordDict: ['apple','pen'] },
  { label: 'Test 3 — "catsandog"', detail: 'false',               s: 'catsandog', wordDict: ['cats','dog','sand','and','cat'] },
  { label: 'Test 4 — "cars"',      detail: 'car + s = false',     s: 'cars',      wordDict: ['car','ca','rs'] },
]

const ALGORITHMS = [
  { id: 'tab', name: 'Bottom-up DP', complexity: 'O(n²) time · O(n) space' },
]

const CODE = {
  tab: [
    'function wordBreak(s, wordDict):',
    '  dp = [false, ..., false]  // size n+1',
    '  dp[0] = true  // empty string',
    '  for i = 1 to n:',
    '    for j = 0 to i-1:',
    '      if dp[j] == true:',
    '        word = s[j..i-1]',
    '        if word in wordDict: dp[i] = true; break',
    '  return dp[n]',
  ],
}

const LEGEND = [
  { token: 'special', label: 'Base case (dp[0])' },
  { token: 'current', label: 'Currently filling dp[i]' },
  { token: 'compare', label: 'Trying dp[j]' },
  { token: 'match',   label: 'True — segment found' },
  { token: 'discard', label: 'False / no match' },
]

/* ── Segmented string display ── */
function SegmentedString({ s, dp, wordDict, highlights, activeI, activeJ }) {
  // Color each char based on dp state


  return (
    <div className={styles.segStr}>
      {/* dp[0] base marker */}
      <span className={styles.segMarker} title="dp[0]=true">|</span>
      {s.split('').map((ch, i) => {
        const dpState = dp[i + 1]
        const isActive = activeI !== undefined && i + 1 === activeI
        const isScanJ  = activeJ !== undefined && i >= activeJ && i < activeI
        return (
          <span
            key={i}
            className={`${styles.segChar} ${isActive ? styles.segCharActive : isScanJ ? styles.segCharScan : dpState ? styles.segCharTrue : ''}`}
          >
            {ch}
            {/* segment marker after each char if dp[i+1] is true */}
            {dpState && <span className={styles.segMarker} title={`dp[${i+1}]=true`}>|</span>}
          </span>
        )
      })}
    </div>
  )
}

export default function WordBreakVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('tab')
  const [customCase,   setCustomCase]   = useState(null)

  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "s",
                "label": "s",
                "type": "text",
                "placeholder": "leetcode"
            },
            {
                "key": "wordDict",
                "label": "Word dict (comma)",
                "type": "text",
                "placeholder": "leet,code"
            }
        ]}
      onApply={parsed => {
        const wordDict = parsed.wordDict.split(',').map(s => s.trim())
        setCustomCase({ s, wordDict }); hook.reset()
      }}
    />
  )

  const { s, wordDict } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(s, wordDict), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const dp         = step?.dp ?? new Array(s.length + 1).fill(false)
  const highlights = step?.highlights ?? {}
  const result     = step?.result
  const activeI    = step?.activeI
  const activeJ    = step?.activeJ
  const matchWord  = step?.matchWord

  const colHeaders = ['', ...s.split('')].map((c, i) => i === 0 ? '""' : `[${i-1}]${c}`)

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'String': s,
        ...(result !== undefined ? { 'Can break': result ? 'Yes ✓' : 'No ✗' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Word dict chips with match highlight */}
        <div className={styles.dictRow}>
          {wordDict.map((w, i) => (
            <span key={i} className={`${styles.dictChip} ${matchWord === w ? styles.dictChipMatch : ''}`}>
              {matchWord === w && <span className={styles.matchMark}>✓</span>}
              {w}
            </span>
          ))}
        </div>

        {result !== undefined && (
          <div className={`${styles.resultBadge} ${result ? styles.resultTrue : styles.resultFalse}`}>
            {result ? '✓ Word break possible' : '✗ Word break impossible'}
          </div>
        )}

        {/* Segmented string visual */}
        <SegmentedString
          s={s}
          dp={dp}
          wordDict={wordDict}
          highlights={highlights}
          activeI={activeI}
          activeJ={activeJ}
        />

        <div className={styles.label}>dp[0..{s.length}]</div>
        <DPTableDisplay
          dp={dp.map(v => v ? 'T' : 'F')}
          highlights={highlights}
          colHeaders={colHeaders}
        />
      </div>
    </VisualizerShell>
  )
}
