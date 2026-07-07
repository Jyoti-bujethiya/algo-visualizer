import { useState, useMemo } from 'react'
import { generateSteps } from './steps.js'
import { useVisualizer } from '../../hooks/useVisualizer.js'
import VisualizerShell from '../../components/VisualizerShell/VisualizerShell.jsx'
import CustomInput from '../../components/VisualizerShell/CustomInput.jsx'
import GraphDisplay from '../../components/display/GraphDisplay.jsx'
import styles from './AlienDictionary.module.css'

const TEST_CASES = [
  {
    label: 'Test 1 — ["wrt","wrf","er","ett","rftt"]', detail: 'LeetCode example — order: wertf',
    words: ['wrt','wrf','er','ett','rftt'],
  },
  {
    label: 'Test 2 — ["z","x"]', detail: 'z before x',
    words: ['z','x'],
  },
  {
    label: 'Test 3 — ["z","x","z"]', detail: 'Cycle — return ""',
    words: ['z','x','z'],
  },
  {
    label: 'Test 4 — ["abc","ab"]', detail: 'Invalid — prefix longer',
    words: ['abc','ab'],
  },
]

const ALGORITHMS = [
  { id: 'bfs', name: "Kahn's BFS (Topo Sort)", complexity: 'O(C) time · O(1) space' },
]

const CODE = {
  bfs: [
    'function alienOrder(words):',
    '  for adjacent pairs: find first diff char → add edge',
    '  compute in-degree per char',
    '  queue = [chars with in-degree 0]',
    '  while queue not empty:',
    '    pop c; result += c',
    '    for each neighbor: in-degree[neighbor]--',
    '    if in-degree[neighbor] == 0: queue.push',
    '  return result.length == numChars ? result : ""',
  ],
}

const LEGEND = [
  { token: 'current',  label: 'In queue' },
  { token: 'compare',  label: 'Edge source/target' },
  { token: 'visiting', label: 'Reducing in-degree' },
  { token: 'done',     label: 'Added to order' },
]

/* ── Alien glyph decoration per char node ── */
function AlienGlyphSVG({ char, isActive, isDone }) {
  const fill = isDone ? '#7c3aed' : isActive ? '#f59e0b' : '#6b7280'


  return (
    <svg viewBox="0 0 40 50" className={styles.alienNode}>
      {/* alien head */}
      <ellipse cx="20" cy="18" rx="13" ry="14" fill={isDone ? '#f3e8ff' : isActive ? '#fffbeb' : '#f3f4f6'} stroke={fill} strokeWidth="2"/>
      {/* eyes */}
      <ellipse cx="14" cy="15" rx="4" ry="5" fill={fill} opacity="0.9"/>
      <ellipse cx="26" cy="15" rx="4" ry="5" fill={fill} opacity="0.9"/>
      {/* pupils */}
      <circle cx="14" cy="15" r="1.5" fill="white"/>
      <circle cx="26" cy="15" r="1.5" fill="white"/>
      {/* antennae */}
      <line x1="14" y1="5" x2="10" y2="-1" stroke={fill} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="-1" r="2" fill={fill}/>
      <line x1="26" y1="5" x2="30" y2="-1" stroke={fill} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="30" cy="-1" r="2" fill={fill}/>
      {/* character label */}
      <text x="20" y="36" textAnchor="middle" fontSize="11" fontWeight="800" fill={fill} fontFamily="monospace">{char}</text>
    </svg>
  )
}

/* ── Highlight diffs in word pairs ── */
function AnnotatedWordPair({ w1, w2 }) {
  const len = Math.min(w1.length, w2.length)
  let diffIdx = -1
  for (let i = 0; i < len; i++) {
    if (w1[i] !== w2[i]) { diffIdx = i; break }
  }
  return (
    <div className={styles.wordPairRow}>
      <span className={styles.wordPair}>
        {w1.split('').map((ch, i) => (
          <span key={i} className={i === diffIdx ? styles.diffChar : ''}>{ch}</span>
        ))}
      </span>
      <span className={styles.pairArrow}>→</span>
      <span className={styles.wordPair}>
        {w2.split('').map((ch, i) => (
          <span key={i} className={i === diffIdx ? styles.diffChar : ''}>{ch}</span>
        ))}
      </span>
      {diffIdx >= 0 && (
        <span className={styles.edgeHint}>{w1[diffIdx]} before {w2[diffIdx]}</span>
      )}
    </div>
  )
}

export default function AlienDictionaryVisualizer() {
  const [selectedTest, setSelectedTest] = useState(0)
  const [selectedAlgo, setSelectedAlgo] = useState('bfs')
  const [customCase,   setCustomCase]   = useState(null)

  const { words } = customCase ?? TEST_CASES[selectedTest]
  const steps = useMemo(() => generateSteps(words), [selectedAlgo, selectedTest, customCase]) // eslint-disable-line
  const hook  = useVisualizer(steps)
  const step  = hook.step

  const customInputUI = (
    <CustomInput
      fields={[{ key: 'words', label: 'Words (comma-separated)', type: 'text', placeholder: 'wrt,wrf,er,ett,rftt' }]}
      onApply={parsed => {
        const wordsParsed = parsed.words.split(',').map(w => w.trim())
        setCustomCase({ words: wordsParsed }); hook.reset()
      }}
    />
  )

  const highlights = step?.highlights ?? {}
  const order      = step?.order

  // Build unique char nodes
  const chars = [...new Set(words.join('').split(''))]
  const nodes = chars.map((c, i) => ({ id: i, label: c }))

  // Build edges from word comparisons
  const edges = []
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i], w2 = words[i + 1]
    const len = Math.min(w1.length, w2.length)
    for (let j = 0; j < len; j++) {
      if (w1[j] !== w2[j]) {
        const from = chars.indexOf(w1[j]), to = chars.indexOf(w2[j])
        if (from !== -1 && to !== -1) edges.push({ from, to, directed: true })
        break
      }
    }
  }

  return (
    <VisualizerShell
      testCases={TEST_CASES} selectedTest={selectedTest}
      onTestChange={idx => { setCustomCase(null); setSelectedTest(idx); hook.reset() }}
      algorithms={ALGORITHMS} selectedAlgo={selectedAlgo}
      onAlgoChange={id => { setSelectedAlgo(id); hook.reset() }}
      customInput={customInputUI}
      legend={LEGEND}
      stats={step ? {
        'Characters': chars.length,
        'Words': words.length,
        ...(order !== undefined ? { 'Order': order || '""' } : {}),
      } : {}}
      code={CODE[selectedAlgo]}
      hook={hook}
    >
      <div className={styles.canvas}>
        {/* Word list with diff annotations */}
        <div className={styles.wordPairs}>
          {words.slice(0, -1).map((w, i) => (
            <AnnotatedWordPair key={i} w1={w} w2={words[i + 1]} />
          ))}
        </div>

        {/* Alien node row */}
        <div className={styles.alienRow}>
          {chars.map((ch, i) => {
            const hl = highlights[i]
            return (
              <AlienGlyphSVG
                key={i}
                char={ch}
                isActive={hl === 'current' || hl === 'compare'}
                isDone={hl === 'done'}
              />
            )
          })}
        </div>

        {order !== undefined && (
          <div className={`${styles.orderBadge} ${order ? styles.orderValid : styles.orderInvalid}`}>
            {order ? (
              <div className={styles.orderChars}>
                <span className={styles.orderPrefix}>Alien order:</span>
                {order.split('').map((ch, i) => (
                  <span key={i} className={styles.orderChar}>{ch}</span>
                ))}
              </div>
            ) : 'No valid order (cycle/invalid)'}
          </div>
        )}

        <GraphDisplay nodes={nodes} edges={edges} highlights={highlights} directed width={480} height={220} />
      </div>
    </VisualizerShell>
  )
}
