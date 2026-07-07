import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import PointerLabel from '../../components/display/PointerLabel.jsx'
import styles from './ValidParentheses.module.css'

const TEST_CASES = [
  { label: 'Test 1 — Nested valid',    detail: '"{[]}"',    str: '{[]}' },
  { label: 'Test 2 — Sequential',      detail: '"()[]{}"',  str: '()[]{}' },
  { label: 'Test 3 — Mismatch',        detail: '"(]"',      str: '(]' },
  { label: 'Test 4 — Wrong order',     detail: '"([)]"',    str: '([)]' },
  { label: 'Test 5 — Unclosed',        detail: '"((("',     str: '(((' },
  { label: 'Test 6 — Complex valid',   detail: '"{([()]}"', str: '{([()])}' },
]

const ALGORITHMS = [
  { id: 'stack',   name: 'Stack (Optimal)',  complexity: 'O(n) time · O(n) space' },
  { id: 'replace', name: 'Replace Method',   complexity: 'O(n²) time · O(n) space' },
]

const CODE = {
  stack:   ['stack = []', 'for c in s:', '  if closing(c):', '    if empty or top != match(c): return false', '    stack.pop()', '  else: stack.push(c)', 'return stack.empty()'],
  replace: ['while "()" or "[]" or "{}" in s:', '  s.erase(pair)', 'return s.empty()'],
}

const LEGEND = [
  { token: 'current',  label: 'Current character' },
  { token: 'compare',  label: 'Already processed' },
  { token: 'match',    label: 'Valid — matched & popped' },
  { token: 'error',    label: 'Invalid — mismatch' },
  { token: 'special',  label: 'Final result' },
]

const BRACKET_COLOR = { '(': 'current', ')': 'current', '[': 'compare', ']': 'compare', '{': 'special', '}': 'special' }

export default function ValidParenthesesVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('stack')
  const [customCase,   setCustomCase]   = useState(null)

  const { str } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, str), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const chars = str.split('')

  const getCharState = (i) => {
    if (!step) return ''
    if (step.result === true && step.charIdx === -1)  return 'match'
    if (step.result === false && step.charIdx === i)  return 'error'
    if (step.charIdx === i)    return 'current'
    if (step.charIdx > i)      return 'compare'
    return ''
  }

  const getStackBracketColor = (c) => BRACKET_COLOR[c] ?? 'compare'


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "str",
                "label": "String",
                "type": "text",
                "placeholder": "()[]{}"
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
        'Stack':  step.stack.length ? `[${step.stack.join('')}]` : 'empty',
        'Top':    step.stack.length ? step.stack[step.stack.length - 1] : '—',
        'Char':   step.charIdx >= 0 ? `'${str[step.charIdx]}' [${step.charIdx}]` : '—',
        'Result': step.result === true ? '✅ Valid' : step.result === false ? '✗ Invalid' : '…',
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* String row */}
        <div className={styles.charRow}>
          {chars.map((ch, i) => (
            <div key={i} className={`${styles.cell} ${styles[getCharState(i)] || ''}`}>
              <div className={styles.ptrRow}>
                {step?.charIdx === i && <PointerLabel label="i" type="current" />}
              </div>
              <div className={`${styles.charVal} ${styles[BRACKET_COLOR[ch] || '']}`}>{ch}</div>
              <div className={styles.charIdx}>{i}</div>
            </div>
          ))}
        </div>

        {/* Stack visualization */}
        {selectedAlgo === 'stack' && (
          <div className={styles.stackSection}>
            <div className={styles.stackTitle}>Stack (top →)</div>
            <div className={styles.stackRow}>
              {step?.stack.length === 0
                ? <span className={styles.stackEmpty}>empty</span>
                : step?.stack.map((c, pos) => {
                    const isTop = pos === (step.stack.length - 1)
                    return (
                      <div key={pos} className={`${styles.stackCell} ${isTop ? styles.stackTop : ''} ${styles[getStackBracketColor(c)]}`}>
                        {c}
                      </div>
                    )
                  })
              }
            </div>
            {step?.stack.length > 0 && (
              <div className={styles.stackLabel}>size: {step.stack.length}</div>
            )}
          </div>
        )}

        {/* Result badge */}
        {step?.result !== null && step?.result !== undefined && (
          <div className={`${styles.resultBadge} ${step.result === true ? styles.valid : styles.invalid}`}>
            {step.result === true ? '✅ VALID — all brackets matched!' : '✗ INVALID — bracket mismatch or unclosed'}
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
