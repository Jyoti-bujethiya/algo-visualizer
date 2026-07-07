import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import PointerLabel from '../../components/display/PointerLabel.jsx'
import styles from './LongestSubstring.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Classic',    detail: '"abcabcbb"', str: 'abcabcbb' },
  { label: 'Test 2 — All same',   detail: '"bbbbb"',    str: 'bbbbb'    },
  { label: 'Test 3 — pwwkew',     detail: '"pwwkew"',   str: 'pwwkew'   },
  { label: 'Test 4 — No repeats', detail: '"abcde"',    str: 'abcde'    },
  { label: 'Test 5 — dvdf',       detail: '"dvdf"',     str: 'dvdf'     },
]

const ALGORITHMS = [
  { id: 'hashmap', name: 'Sliding Window + HashMap', complexity: 'O(n) time · O(min(n,m)) space' },
  { id: 'set',     name: 'Sliding Window + Set',     complexity: 'O(2n) time · O(min(n,m)) space' },
]

const CODE = {
  hashmap: ['map = {}; left = 0; maxLen = 0', 'for right in 0..n-1:', '  if s[right] in map and map[s[right]] >= left:', '    left = map[s[right]] + 1', '  map[s[right]] = right', '  maxLen = max(maxLen, right-left+1)', 'return maxLen'],
  set:     ['set = {}; left = 0; maxLen = 0', 'for right in 0..n-1:', '  while s[right] in set:', '    set.remove(s[left]); left++', '  set.add(s[right])', '  maxLen = max(maxLen, right-left+1)', 'return maxLen'],
}

const LEGEND = [
  { token: 'current', label: 'Window (active range)' },
  { token: 'special', label: 'Best substring found' },
  { token: 'error',   label: 'Duplicate detected' },
]

export default function LongestSubstringVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('hashmap')
  const [customCase,   setCustomCase]   = useState(null)

  const { str } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, str), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const chars = str.split('')

  const getState = (i) => {
    if (!step) return ''
    const isDone = step.description.startsWith('✅')
    if (isDone && step.bestEnd >= 0 && i >= step.bestStart && i <= step.bestEnd) return 'special'
    if (i === step.duplicate) return 'error'
    if (i === step.right)     return 'current'
    if (i >= step.left && i <= step.right) return 'current'
    return ''
  }

  const mapEntries = step ? Object.entries(step.map) : []


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "str",
                "label": "String",
                "type": "text",
                "placeholder": "abcabcbb"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ str: parsed.str }); hook.reset()
      }}
    />
  )

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={i => { setCustomCase(null); setSelectedTest(i); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'Left':   step.left,
        'Right':  step.right >= 0 ? step.right : '—',
        'Length': step.right >= step.left ? step.right - step.left + 1 : 0,
        'Max':    step.maxLen,
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        <div className={styles.charRow}>
          {chars.map((ch, i) => {
            const state   = getState(i)
            const isLeft  = step && i === step.left && step.left <= step.right
            const isRight = step && i === step.right && step.right >= 0
            return (
              <div key={i} className={`${styles.cell} ${state ? styles[state] : ''}`}>
                <div className={styles.ptrRow}>
                  {isLeft  && <PointerLabel label="L" type="current" />}
                  {isRight && <PointerLabel label="R" type="compare" />}
                </div>
                <div className={styles.charVal}>{ch}</div>
                <div className={styles.charIdx}>{i}</div>
              </div>
            )
          })}
        </div>

        {step?.bestEnd >= 0 && (
          <div className={styles.bestBadge}>
            Best: &ldquo;{str.slice(step.bestStart, step.bestEnd + 1)}&rdquo; (length {step.maxLen})
          </div>
        )}

        {mapEntries.length > 0 && (
          <div className={styles.mapSection}>
            <div className={styles.mapTitle}>{selectedAlgo === 'hashmap' ? 'Last-seen index map' : 'Current set'}</div>
            <div className={styles.mapGrid}>
              {mapEntries.map(([ch, val]) => (
                <div key={ch} className={styles.mapEntry}>
                  <span className={styles.mapKey}>'{ch}'</span>
                  <span className={styles.mapArrow}>→</span>
                  <span className={styles.mapVal}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
