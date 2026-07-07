import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import DPTableDisplay from '../../components/display/DPTableDisplay.jsx'
import styles from './CoinChange.module.css'

const TEST_CASES = [
  { label: 'Test 1 — coins=[1,5,6,9], amount=11', detail: 'Answer: 2',  coins: [1,5,6,9], amount: 11 },
  { label: 'Test 2 — coins=[1,2,5], amount=11',   detail: 'Answer: 3',  coins: [1,2,5],   amount: 11 },
  { label: 'Test 3 — coins=[2], amount=3',         detail: 'Answer: -1', coins: [2],        amount: 3 },
  { label: 'Test 4 — coins=[1,2,5], amount=6',    detail: 'Answer: 2',  coins: [1,2,5],   amount: 6 },
]

const ALGORITHMS = [
  { id: 'tab', name: 'Bottom-up DP', complexity: 'O(amount × coins) time · O(amount) space' },
]

const CODE = {
  tab: [
    'function coinChange(coins, amount):',
    '  dp = [∞, ∞, ..., ∞]  // size amount+1',
    '  dp[0] = 0',
    '  for i = 1 to amount:',
    '    for each coin in coins:',
    '      if i - coin >= 0 and dp[i-coin] != ∞:',
    '        dp[i] = min(dp[i], dp[i-coin] + 1)',
    '  return dp[amount] == ∞ ? -1 : dp[amount]',
  ],
}

const LEGEND = [
  { token: 'special', label: 'Base case (dp[0]=0)' },
  { token: 'current', label: 'Currently filling dp[i]' },
  { token: 'compare', label: 'Sub-problem used (dp[i-coin])' },
  { token: 'match',   label: 'Filled with minimum' },
]

/* ── Coin SVG — round gold coin with denomination inside ── */
function CoinSVG({ value, state }) {
  const colors = {
    active:   { ring: '#f59e0b', face: '#fde68a', text: '#92400e', shine: '#fef3c7' },
    used:     { ring: '#16a34a', face: '#dcfce7', text: '#14532d', shine: '#f0fdf4' },
    neutral:  { ring: '#d97706', face: '#fef3c7', text: '#92400e', shine: '#fffbeb' },
  }
  const c = colors[state] ?? colors.neutral
  return (
    <svg viewBox="0 0 44 44" className={styles.coinSvg}>
      {/* outer ring / shadow */}
      <circle cx="22" cy="24" r="19" fill={c.ring} opacity="0.4"/>
      {/* coin body */}
      <circle cx="22" cy="22" r="19" fill={c.face} stroke={c.ring} strokeWidth="2.5"/>
      {/* shine highlight */}
      <ellipse cx="17" cy="14" rx="5" ry="3" fill={c.shine} opacity="0.7" transform="rotate(-30 17 14)"/>
      {/* denomination text */}
      <text x="22" y="27" textAnchor="middle" fontSize={value >= 100 ? '9' : value >= 10 ? '11' : '13'} fontWeight="800" fill={c.text} fontFamily="monospace">
        {value}
      </text>
    </svg>
  )
}

/* ── Coin stack for result ── */
function CoinStack({ count, value }) {
  const stackItems = Math.min(count, 5)
  return (
    <div className={styles.coinStack}>
      {Array.from({ length: stackItems }, (_, i) => (
        <div
          key={i}
          className={styles.stackCoin}
          style={{ bottom: `${i * 8}px`, zIndex: i, filter: `brightness(${0.75 + i * 0.06})` }}
        >
          <CoinSVG value={value} state="used" />
        </div>
      ))}
      {count > 5 && (
        <div className={styles.stackMore} style={{ bottom: `${5 * 8}px` }}>+{count - 5}</div>
      )}
    </div>
  )
}

export default function CoinChangeVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('tab')
  const [customCase,   setCustomCase]   = useState(null)

  const { coins, amount } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(coins, amount), [coins, amount]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const dp         = step?.dp ?? new Array(amount + 1).fill(Infinity)
  const highlights = step?.highlights ?? {}
  const result     = step?.result
  const activeCoin = step?.activeCoin

  const colHeaders = dp.map((_, i) => String(i))

  const customInputUI = (
    <CustomInput
      fields={[
        { key: 'coins',  label: 'Coins',  type: 'array',  placeholder: '1, 5, 6, 9' },
        { key: 'amount', label: 'Amount', type: 'number', placeholder: '11' },
      ]}
      onApply={({ coins: c, amount: a }) => {
        setCustomCase({ coins: c, amount: Math.max(1, Math.round(a)) })
        hook.reset()
      }}
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
        'Amount': amount,
        'Coins': `[${coins.join(',')}]`,
        ...(activeCoin !== undefined ? { 'Trying coin': activeCoin } : {}),
        ...(result !== undefined ? { 'Min coins': result === -1 ? 'impossible' : result } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* ── Coin tray ── */}
        <div className={styles.label}>Available coins</div>
        <div className={styles.coinTray}>
          {coins.map((c, i) => (
            <div key={i} className={`${styles.coinWrap} ${activeCoin === c ? styles.coinActive : ''}`}>
              <CoinSVG value={c} state={activeCoin === c ? 'active' : 'neutral'} />
              {activeCoin === c && <span className={styles.coinArrow}>↓ trying</span>}
            </div>
          ))}
        </div>

        {/* ── Result ── */}
        {result !== undefined && (
          result === -1 ? (
            <div className={`${styles.resultBadge} ${styles.resultFail}`}>
              ❌ Impossible — cannot make {amount} with given coins
            </div>
          ) : (
            <div className={styles.resultOkWrap}>
              <div className={`${styles.resultBadge} ${styles.resultOk}`}>
                🪙 Min coins: {result}
              </div>
              <CoinStack count={result} value={coins[coins.length - 1]} />
            </div>
          )
        )}

        {/* ── DP table ── */}
        <div className={styles.label}>dp[0..{amount}]</div>
        <DPTableDisplay
          dp={dp}
          highlights={highlights}
          colHeaders={colHeaders}
          infinity={Infinity}
        />
      </div>
    </VisualizerShell>
  )
}
