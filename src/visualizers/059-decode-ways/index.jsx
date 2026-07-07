import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import DPTableDisplay from '../../components/display/DPTableDisplay.jsx'
import styles from './DecodeWays.module.css'

const TEST_CASES = [
  { label: 'Test 1 — "12"',     detail: 'AB or L — Answer: 2',   s: '12'     },
  { label: 'Test 2 — "226"',    detail: '3 ways — Answer: 3',    s: '226'    },
  { label: 'Test 3 — "06"',     detail: 'Starts with 0 — 0',     s: '06'     },
  { label: 'Test 4 — "11106"',  detail: 'Answer: 2',             s: '11106'  },
]

const ALGORITHMS = [
  { id: 'tab', name: 'Bottom-up DP', complexity: 'O(n) time · O(n) space' },
]

const CODE = {
  tab: [
    'function numDecodings(s):',
    '  dp = [0, ..., 0]  // size n+1',
    '  dp[0] = 1',
    '  dp[1] = s[0] != \'0\' ? 1 : 0',
    '  for i = 2 to n:',
    '    oneDigit  = s[i-1]',
    '    twoDigits = s[i-2..i-1]',
    '    if oneDigit != \'0\': dp[i] += dp[i-1]',
    '    if 10 <= twoDigits <= 26: dp[i] += dp[i-2]',
    '  return dp[n]',
  ],
}

const LEGEND = [
  { token: 'special', label: 'Base case' },
  { token: 'current', label: 'Currently filling' },
  { token: 'compare', label: 'dp[i-1] or dp[i-2] used' },
  { token: 'match',   label: 'Filled > 0' },
  { token: 'discard', label: 'Zero ways (blocked)' },
]

/* ── Phone keypad digit SVG ── */
function DigitKeySVG({ digit, letters, isActive, isBlocked, isTwoDigit }) {
  const bg    = isBlocked ? '#fef2f2' : isActive ? '#eff6ff' : isTwoDigit ? '#f3e8ff' : '#f9fafb'
  const border = isBlocked ? '#dc2626' : isActive ? '#3b82f6' : isTwoDigit ? '#9333ea' : '#d1d5db'
  const textFill = isBlocked ? '#dc2626' : isActive ? '#1d4ed8' : isTwoDigit ? '#6d28d9' : '#374151'


  return (
    <svg viewBox="0 0 42 52" className={styles.keyIcon}>
      {/* key body */}
      <rect x="2" y="2" width="38" height="48" rx="8" fill={bg} stroke={border} strokeWidth="2"/>
      {/* digit */}
      <text x="21" y="26" textAnchor="middle" fontSize="18" fontWeight="800" fill={textFill} fontFamily="monospace">{digit}</text>
      {/* letters below */}
      {letters && <text x="21" y="38" textAnchor="middle" fontSize="7" fill="#9ca3af" fontFamily="sans-serif">{letters}</text>}
      {/* active indicator */}
      {isActive && <circle cx="21" cy="45" r="2.5" fill="#3b82f6"/>}
      {/* two-digit bracket */}
      {isTwoDigit && (
        <rect x="1" y="1" width="40" height="50" rx="9" fill="none" stroke="#9333ea" strokeWidth="1.5" strokeDasharray="3 2"/>
      )}
    </svg>
  )
}

// Phone keypad letters map
const KEY_LETTERS = { '2':'ABC','3':'DEF','4':'GHI','5':'JKL','6':'MNO','7':'PQRS','8':'TUV','9':'WXYZ','0':'','1':'' }

/* ── Signal meter SVG ── */
function SignalMeterSVG({ ways }) {
  const bars = Math.min(ways, 5)
  return (
    <svg viewBox="0 0 50 32" className={styles.signalIcon}>
      {[1,2,3,4,5].map(b => (
        <rect key={b} x={4 + (b-1)*9} y={32 - b * 5} width="6" height={b * 5}
          rx="1.5"
          fill={b <= bars ? '#16a34a' : '#e5e7eb'}
          stroke={b <= bars ? '#15803d' : '#d1d5db'} strokeWidth="1"/>
      ))}
      <text x="25" y="12" textAnchor="middle" fontSize="9" fontWeight="800" fill="#374151" fontFamily="monospace">{ways}</text>
    </svg>
  )
}

export default function DecodeWaysVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('tab')
  const [customCase,   setCustomCase]   = useState(null)

  const customInputUI = (
    <CustomInput
      fields={[
            {
                "key": "s",
                "label": "Encoded string",
                "type": "text",
                "placeholder": "226"
            }
        ]}
      onApply={parsed => {
        setCustomCase({ s: parsed.s }); hook.reset()
      }}
    />
  )

  const { s } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(s), [selectedAlgo, selectedTest]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const dp         = step?.dp ?? new Array(s.length + 1).fill(0)
  const highlights = step?.highlights ?? {}
  const result     = step?.result
  const activeI    = step?.activeI
  const twoDigitI  = step?.twoDigitI  // optional: index using two-digit decode

  const colHeaders = dp.map((_, i) => i === 0 ? '""' : `[${i-1}]${s[i-1]}`)

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
        ...(result !== undefined ? { 'Decode ways': result } : {}),
        ...(step.done ? { 'Status': 'Done ✓' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Phone keypad row */}
        <div className={styles.keypads}>
          {s.split('').map((digit, i) => {
            const isActive    = activeI !== undefined && i === activeI - 1
            const isTwoDigit  = twoDigitI !== undefined && i === twoDigitI - 1
            const isBlocked   = digit === '0'
            return (
              <DigitKeySVG
                key={i}
                digit={digit}
                letters={KEY_LETTERS[digit]}
                isActive={isActive}
                isBlocked={isBlocked}
                isTwoDigit={isTwoDigit}
              />
            )
          })}
        </div>

        {/* Signal meter + result */}
        {result !== undefined && (
          <div className={styles.signalRow}>
            <SignalMeterSVG ways={result} />
            <div className={styles.resultBadge}>
              {result} decode {result === 1 ? 'way' : 'ways'}
            </div>
          </div>
        )}

        <div className={styles.label}>dp[0..{s.length}]</div>
        <DPTableDisplay dp={dp} highlights={highlights} colHeaders={colHeaders} />
      </div>
    </VisualizerShell>
  )
}
