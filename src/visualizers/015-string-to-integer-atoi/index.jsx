import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import PointerLabel from '../../components/display/PointerLabel.jsx'
import styles from './Atoi.module.css'

const INT_MAX =  2147483647
const INT_MIN = -2147483648

const TEST_CASES = [
  { label: 'Test 1 — Simple',       detail: '"42"',              str: '42' },
  { label: 'Test 2 — Neg spaces',   detail: '"   -42"',          str: '   -42' },
  { label: 'Test 3 — Trailing',     detail: '"4193 with words"', str: '4193 with words' },
  { label: 'Test 4 — Non-digit',    detail: '"words and 987"',   str: 'words and 987' },
  { label: 'Test 5 — Overflow −',   detail: '"-91283472332"',    str: '-91283472332' },
  { label: 'Test 6 — Overflow +',   detail: '"91283472332"',     str: '91283472332' },
  { label: 'Test 7 — Plus sign',    detail: '"+100"',            str: '+100' },
  { label: 'Test 8 — Double sign',  detail: '"+-12"',            str: '+-12' },
]

const ALGORITHMS = [
  { id: 'sim', name: 'Step-by-step Simulation', complexity: 'O(n) time · O(1) space' },
  { id: 'dfa', name: 'DFA / State Machine',      complexity: 'O(n) time · O(1) space' },
]

const CODE = {
  sim: ['// 1. Skip leading whitespace', 'while s[i]==" ": i++', '// 2. Read optional sign', 'if s[i]="+" or "-": sign=...', '// 3. Read digits', 'while isdigit(s[i]): result=result*10+digit', '// 4. Clamp', 'return clamp(sign*result, INT_MIN, INT_MAX)'],
  dfa: ['state = START', "START: ' ' → START", "START: '+'/'-' → SIGN", 'START/SIGN: digit → NUMBER', 'NUMBER: digit → accumulate', 'NUMBER: other → END', 'overflow check each digit'],
}

const LEGEND = [
  { token: 'compare',  label: 'Whitespace (trimming)' },
  { token: 'special',  label: 'Sign character' },
  { token: 'current',  label: 'Digit being read' },
  { token: 'discard',  label: 'Ignored (trailing chars)' },
  { token: 'error',    label: 'Overflow / invalid' },
]

const DFA_STATES = ['START', 'SIGN', 'NUMBER', 'END']

export default function AtoiVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('sim')
  const [customCase,   setCustomCase]   = useState(null)

  const { str } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(selectedAlgo, str), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const chars = str.split('')

  const getCharState = (i) => {
    if (!step) return ''
    const ph = step.phase
    if (step.clamped && step.charIdx === i) return 'error'
    if (step.charIdx === i) {
      if (ph === 'trim' || ph === 'START') return 'compare'
      if (ph === 'sign' || ph === 'SIGN')  return 'special'
      if (ph === 'digits' || ph === 'number' || ph === 'NUMBER') return 'current'
      if (ph === 'END' || ph === 'stop')   return 'discard'
      if (ph === 'clamp' || ph === 'CLAMP') return 'error'
    }
    if (step.charIdx > i || step.phase === 'done') return 'discard'
    return ''
  }

  const pct = step ? Math.max(0, Math.min(1, (step.result - INT_MIN) / (INT_MAX - INT_MIN))) : 0.5
  const isDone = step?.phase === 'done' || step?.clamped


  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "str",
                "label": "String",
                "type": "text",
                "placeholder": "   -42"
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
        'State':  step.state || '—',
        'Sign':   step.sign === 1 ? '+1' : '-1',
        'Result': step.result,
        'Char':   step.charIdx >= 0 ? `'${str[step.charIdx]}' [${step.charIdx}]` : '—',
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* String row */}
        <div className={styles.charRow}>
          {chars.map((ch, i) => {
            const state = getCharState(i)
            return (
              <div key={i} className={`${styles.cell} ${state ? styles[state] : ''}`}>
                <div className={styles.ptrRow}>
                  {step?.charIdx === i && <PointerLabel label="i" type="current" />}
                </div>
                <div className={styles.charVal}>{ch === ' ' ? '⎵' : ch}</div>
                <div className={styles.charIdx}>{i}</div>
              </div>
            )
          })}
        </div>

        {/* DFA state machine */}
        <div className={styles.dfaRow}>
          {DFA_STATES.map((st, i) => {
            const isCurr = step?.state === st || (step?.clamped && st === 'NUMBER')
            const isClamp = isCurr && step?.clamped
            return (
              <div key={st} className={styles.dfaState}>
                <div className={`${styles.dfaNode} ${isCurr ? (isClamp ? styles.dfaError : styles.dfaActive) : ''}`}>
                  {st}
                </div>
                {i < DFA_STATES.length - 1 && <div className={styles.dfaArrow}>→</div>}
              </div>
            )
          })}
        </div>

        {/* Result meter */}
        <div className={styles.meterSection}>
          <div className={styles.meterLabels}>
            <span>INT_MIN</span>
            <span className={`${styles.meterVal} ${step?.clamped ? styles.meterError : ''}`}>
              {step?.result ?? 0}
            </span>
            <span>INT_MAX</span>
          </div>
          <div className={styles.meterTrack}>
            <div
              className={`${styles.meterFill} ${step?.clamped ? styles.meterFillError : step?.result >= 0 ? styles.meterFillPos : styles.meterFillNeg}`}
              style={{ width: `${pct * 100}%` }}
            />
          </div>
        </div>

        {/* Answer badge */}
        {isDone && (
          <div className={`${styles.resultBadge} ${step.clamped ? styles.clamped : styles.found}`}>
            ✅ Result: {step.result}{step.clamped ? ' (clamped to limit)' : ''}
          </div>
        )}
      </div>
    </VisualizerShell>
  )
}
